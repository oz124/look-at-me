// ⚠️ IMPORTANT: Load environment variables FIRST before anything else!
try {
  const result = require('dotenv').config({ path: '.env.local', override: true });
  if (result.error) {
    console.log('⚠️  Error loading .env.local:', result.error.message);
  } else {
    console.log('✅ Environment variables loaded from .env.local');
    console.log(`📊 Loaded ${Object.keys(result.parsed || {}).length} variables`);
  }
} catch (error) {
  console.log('⚠️  No .env.local file found, using system environment variables');
}

// Express server for API routes
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Security utilities - loaded AFTER dotenv
const { 
  SecurityMiddleware, 
  createRateLimit, 
  SecurityLogger,
  ValidationService 
} = require('./src/lib/security.js');

// Validate critical environment variables
console.log('🔍 Validating environment variables...');
console.log('  - OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ SET' : '❌ MISSING');
console.log('  - JWT_SECRET:', process.env.JWT_SECRET ? '✅ SET' : '❌ MISSING');
console.log('  - ENCRYPTION_KEY:', process.env.ENCRYPTION_KEY ? '✅ SET' : '❌ MISSING');
console.log('  - SESSION_SECRET:', process.env.SESSION_SECRET ? '✅ SET' : '❌ MISSING');

if (!process.env.OPENAI_API_KEY) {
  console.log('');
  console.log('⚠️  OpenAI API key not set! Please set OPENAI_API_KEY environment variable');
  console.log('📋 Create a .env.local file with your OpenAI API key');
  console.log('🔗 Get your API key from: https://platform.openai.com/api-keys');
  console.log('');
}

const app = express();
const PORT = process.env.PORT || 3002;

// Security Headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.openai.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS Configuration - Secure for Production
console.log("🔍 ALLOWED_ORIGINS from env:", process.env.ALLOWED_ORIGINS);

// Production origins from environment variable
const productionOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
  : [];

// Development origins (only in development mode)
const developmentOrigins = [
  'http://localhost:8080', 
  'http://localhost:3000', 
  'http://127.0.0.1:8080', 
  'http://localhost:5173', 
  'http://192.168.0.106:8080',
  'http://192.168.0.110:8080',
  'http://192.168.0.110:8081',
  'http://localhost:8081'
];

// Use production origins in production, development origins in development
const allowedOrigins = process.env.NODE_ENV === 'production' 
  ? productionOrigins 
  : [...developmentOrigins, ...productionOrigins];

console.log("🔍 Environment:", process.env.NODE_ENV);
console.log("🔍 Final allowedOrigins:", allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    console.log("🔍 CORS Origin received:", origin);
    console.log("🔍 Allowed origins:", allowedOrigins);
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    // In development: Allow localhost and 127.0.0.1 automatically
    if (process.env.NODE_ENV !== 'production') {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        console.log("✅ Allowing localhost origin (dev mode):", origin);
        return callback(null, true);
      }
      
      // Allow local network IPs in development (192.168.x.x)
      if (origin.match(/http:\/\/192\.168\.\d+\.\d+:\d+/)) {
        console.log("✅ Allowing local network origin (dev mode):", origin);
        return callback(null, true);
      }
    }
    
    // Check against allowed origins list
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log("✅ Allowing whitelisted origin:", origin);
      callback(null, true);
    } else {
      console.log("❌ Rejecting origin:", origin);
      SecurityLogger.logSuspiciousActivity(
        origin, 
        'unknown', 
        `CORS violation attempt from ${origin}`
      );
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key']
}));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'strict'
  },
  store: process.env.MONGODB_URI ? MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600 // lazy session update
  }) : undefined
}));

// Rate Limiting
app.use(createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
}));

// Body parsing with size limits
app.use(express.json({ 
  limit: '100mb',
  verify: (req, res, buf) => {
    // Additional security checks on raw body
    if (buf.length > 100 * 1024 * 1024) { // 100MB
      throw new Error('Request body too large');
    }
  }
}));
app.use(express.urlencoded({ 
  extended: true, 
  limit: '100mb' 
}));

// Input sanitization middleware
app.use(SecurityMiddleware.sanitizeRequest);

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API Routes with Security
console.log("🔧 Loading API routes with security...");

// AI Analysis endpoint with enhanced security
console.log("📁 Loading analyze.js...");
const analyzeRoute = require('./api/ai/analyze');
app.post('/api/ai/analyze', 
  createRateLimit({ max: 50, windowMs: 15 * 60 * 1000 }), // 50 requests per 15 minutes
  SecurityMiddleware.validateAPIKey,
  analyzeRoute
);
console.log("✅ analyze.js loaded with security");

// Advanced AI Analysis endpoint with enhanced security
console.log("📁 Loading advanced-analyze.js...");
const advancedAnalyzeRoute = require('./api/ai/advanced-analyze');
app.post('/api/ai/advanced-analyze', 
  createRateLimit({ max: 10, windowMs: 15 * 60 * 1000 }), // 10 requests per 15 minutes (expensive operation)
  SecurityMiddleware.validateAPIKey,
  advancedAnalyzeRoute
);
console.log("✅ advanced-analyze.js loaded with security");

// Video compression endpoint with enhanced security
console.log("📁 Loading compress-video.js...");
const compressVideoRoute = require('./api/ai/compress-video');
app.post('/api/ai/compress-video', 
  createRateLimit({ max: 5, windowMs: 15 * 60 * 1000 }), // 5 requests per 15 minutes (resource intensive)
  SecurityMiddleware.validateAPIKey,
  compressVideoRoute
);
console.log("✅ compress-video.js loaded with security");

// Transcription endpoint with enhanced security
console.log("📁 Loading transcribe.js...");
const transcribeRoute = require('./api/ai/transcribe');
app.post('/api/ai/transcribe',
  createRateLimit({ max: 20, windowMs: 15 * 60 * 1000 }), // 20 requests per 15 minutes
  SecurityMiddleware.validateAPIKey,
  transcribeRoute
);
console.log("✅ transcribe.js loaded with security");

// Audio recommendations endpoint
console.log("📁 Loading audio-recommendations.js...");
const audioRoute = require('./api/ai/audio-recommendations');
app.post('/api/ai/audio-recommendations',
  createRateLimit({ max: 15, windowMs: 15 * 60 * 1000 }), // 15 requests per 15 minutes
  SecurityMiddleware.validateAPIKey,
  audioRoute
);
console.log("✅ audio-recommendations.js loaded with security");

// Social media platform endpoints with enhanced security
console.log("📁 Loading facebook/exchange-token.js...");
const facebookRoute = require('./api/platforms/facebook/exchange-token');
app.post('/api/platforms/facebook/exchange-token',
  createRateLimit({ max: 5, windowMs: 15 * 60 * 1000 }), // 5 requests per 15 minutes
  SecurityMiddleware.validateAPIKey,
  facebookRoute
);
console.log("✅ facebook/exchange-token.js loaded with security");

console.log("📁 Loading google/exchange-token.js...");
const googleRoute = require('./api/platforms/google/exchange-token');
app.post('/api/platforms/google/exchange-token',
  createRateLimit({ max: 5, windowMs: 15 * 60 * 1000 }), // 5 requests per 15 minutes
  SecurityMiddleware.validateAPIKey,
  googleRoute
);
console.log("✅ google/exchange-token.js loaded with security");

console.log("📁 Loading tiktok/exchange-token.js...");
const tiktokRoute = require('./api/platforms/tiktok/exchange-token');
app.post('/api/platforms/tiktok/exchange-token',
  createRateLimit({ max: 5, windowMs: 15 * 60 * 1000 }), // 5 requests per 15 minutes
  SecurityMiddleware.validateAPIKey,
  tiktokRoute
);
console.log("✅ tiktok/exchange-token.js loaded with security");

// Campaign Creation endpoint
console.log("📁 Loading campaigns/create.js...");
const createCampaignRoute = require('./api/campaigns/create');
app.post('/api/campaigns/create',
  createRateLimit({ max: 5, windowMs: 15 * 60 * 1000 }), // 5 requests per 15 minutes
  SecurityMiddleware.validateAPIKey,
  createCampaignRoute
);
console.log("✅ campaigns/create.js loaded with security");

// Campaign List endpoint - Get user's campaigns
console.log("📁 Loading campaigns/list.js...");
const listCampaignsRoute = require('./api/campaigns/list');
app.get('/api/campaigns/list',
  createRateLimit({ max: 100, windowMs: 15 * 60 * 1000 }), // 100 requests per 15 minutes
  listCampaignsRoute
);
console.log("✅ campaigns/list.js loaded with security");

// Campaign Pause/Resume endpoint
console.log("📁 Loading campaigns/pause.js...");
const pauseCampaignRoute = require('./api/campaigns/pause');
app.post('/api/campaigns/pause',
  createRateLimit({ max: 20, windowMs: 15 * 60 * 1000 }), // 20 requests per 15 minutes
  pauseCampaignRoute
);
console.log("✅ campaigns/pause.js loaded with security");

// Campaign Metrics Update endpoint
console.log("📁 Loading campaigns/update-metrics.js...");
const updateMetricsRoute = require('./api/campaigns/update-metrics');
app.post('/api/campaigns/update-metrics',
  createRateLimit({ max: 50, windowMs: 15 * 60 * 1000 }), // 50 requests per 15 minutes
  updateMetricsRoute
);
console.log("✅ campaigns/update-metrics.js loaded with security");

// Platform Verification endpoint
console.log("📁 Loading platforms/verify.js...");
const verifyPlatformRoute = require('./api/platforms/verify');
app.post('/api/platforms/verify',
  createRateLimit({ max: 10, windowMs: 15 * 60 * 1000 }), // 10 requests per 15 minutes
  SecurityMiddleware.validateAPIKey,
  verifyPlatformRoute
);
console.log("✅ platforms/verify.js loaded with security");

console.log("🔧 All API routes loaded successfully!");

// Health check endpoint
app.get('/api/health', (req, res) => {
  const hasValidKey = process.env.OPENAI_API_KEY && 
                     process.env.OPENAI_API_KEY !== 'sk-your-openai-key-here' &&
                     process.env.OPENAI_API_KEY.startsWith('sk-');
  
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    openai_key: hasValidKey ? 'Valid' : 'Missing or Invalid',
    openai_key_status: process.env.OPENAI_API_KEY ? 'Present' : 'Not Set',
    security: {
      helmet: 'enabled',
      cors: 'configured',
      rate_limiting: 'enabled',
      session: 'configured'
    }
  });
});

// Security monitoring endpoint (admin only)
app.get('/api/security/status', SecurityMiddleware.validateAPIKey, (req, res) => {
  res.json({
    status: 'secure',
    timestamp: new Date().toISOString(),
    security_features: {
      helmet: true,
      cors: true,
      rate_limiting: true,
      input_sanitization: true,
      session_management: true,
      api_key_validation: true
    },
    environment: process.env.NODE_ENV || 'development'
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('🚨 Global Error Handler:', error);
  
  // Log security-related errors
  if (error.message.includes('CORS') || 
      error.message.includes('rate limit') || 
      error.message.includes('API key')) {
    SecurityLogger.logSecurityEvent('API_ERROR', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      method: req.method
    });
  }
  
  // Don't expose internal errors in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.status || 500).json({
    success: false,
    error: isDevelopment ? error.message : 'Internal Server Error',
    timestamp: new Date().toISOString(),
    ...(isDevelopment && { stack: error.stack })
  });
});

// 404 handler - removed problematic route pattern

// Serve React app for all other routes (only in production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
}

console.log("🎯 Starting server...");
console.log("🔍 PORT:", PORT);
console.log("🔍 NODE_ENV:", process.env.NODE_ENV);

try {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`🔧 API routes available at /api/*`);
    console.log(`🔑 OpenAI API Key: ${process.env.OPENAI_API_KEY ? 'Set' : 'Missing'}`);
    console.log("✅ Server is ready to accept connections!");
  });
  
  server.on('error', (error) => {
    console.error("❌ Server error:", error);
  });
  
  server.on('listening', () => {
    console.log("🎧 Server is listening on port", PORT);
  });
  
} catch (error) {
  console.error("❌ Error starting server:", error);
}
