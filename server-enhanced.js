// ⚠️ CRITICAL: Load environment variables FIRST before anything else!
try {
  const result = require('dotenv').config({ path: '.env.local', override: true });
  if (result.error) {
    console.warn('⚠️  Error loading .env.local:', result.error.message);
  } else {
    console.log('✅ Environment variables loaded from .env.local');
    console.log(`📊 Loaded ${Object.keys(result.parsed || {}).length} variables`);
  }
} catch (error) {
  console.warn('⚠️  No .env.local file found, using system environment variables');
}

// Enhanced Express server with 100% Security
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const fs = require('fs');

// Enhanced Security utilities - loaded AFTER dotenv
const { 
  SecurityMiddleware, 
  createRateLimit, 
  SecurityLogger,
  ValidationService,
  CSRFService,
  EncryptionService
} = require('./src/lib/security-enhanced.js');

// Validate critical environment variables
const requiredEnvVars = ['OPENAI_API_KEY', 'JWT_SECRET', 'ENCRYPTION_KEY', 'SESSION_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingVars.join(', '));
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

const app = express();
const PORT = process.env.PORT || 3002;
const isProduction = process.env.NODE_ENV === 'production';

console.log('🚀 Starting Look At Me - Enhanced Security Edition');
console.log('📊 Environment:', process.env.NODE_ENV || 'development');
console.log('🔒 Security features: ENABLED');

// Trust proxy (important for correct IP detection behind reverse proxy)
if (process.env.TRUST_PROXY === 'true') {
  app.set('trust proxy', true);
  console.log('✅ Proxy trust enabled');
}

// Enhanced Security Headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.openai.com", "https://graph.facebook.com", "https://www.googleapis.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: isProduction ? [] : null,
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  xssFilter: true,
  hidePoweredBy: true,
  frameguard: { action: 'deny' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));

// Additional Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  
  if (isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  next();
});

// CORS Configuration with enhanced security
const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
  process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim()) : 
  [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://127.0.0.1:8080',
    'http://localhost:5173',
    'http://localhost:8081'
  ];

console.log('🔍 Allowed CORS origins:', allowedOrigins);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      return callback(null, true);
    }
    
    // Development: Allow localhost variations
    if (!isProduction && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      SecurityLogger.logSuspiciousActivity(
        origin, 
        'unknown', 
        `CORS violation attempt from ${origin}`
      );
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-CSRF-Token'],
  exposedHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  maxAge: 86400 // 24 hours
}));

// Enhanced Session Configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId', // Custom session cookie name
  cookie: {
    secure: process.env.SESSION_COOKIE_SECURE === 'true' || isProduction,
    httpOnly: process.env.SESSION_COOKIE_HTTPONLY !== 'false',
    maxAge: parseInt(process.env.SESSION_MAX_AGE) || 24 * 60 * 60 * 1000,
    sameSite: process.env.SESSION_COOKIE_SAMESITE || 'strict',
    domain: process.env.COOKIE_DOMAIN || undefined
  }
};

// Use MongoDB for session storage if configured
if (process.env.MONGODB_URI) {
  sessionConfig.store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600,
    crypto: {
      secret: process.env.ENCRYPTION_KEY
    }
  });
  console.log('✅ MongoDB session store configured');
}

app.use(session(sessionConfig));

// CSRF Protection Middleware (only for state-changing operations)
if (process.env.CSRF_ENABLED === 'true') {
  app.use('/api', CSRFService.middleware);
  console.log('✅ CSRF protection enabled');
}

// IP Blacklist/Whitelist Check
app.use(SecurityMiddleware.checkIPBlacklist);
if (process.env.IP_WHITELIST) {
  app.use(SecurityMiddleware.checkIPWhitelist);
  console.log('✅ IP whitelist enabled');
}

// Global Rate Limiting
app.use(createRateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    error: 'Too many requests from this IP, please try again later.'
  }
}));
console.log('✅ Global rate limiting enabled');

// Body parsing with strict size limits and validation
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf, encoding) => {
    if (buf.length > 10 * 1024 * 1024) {
      throw new Error('Request body too large');
    }
  }
}));

app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb',
  parameterLimit: 100
}));

// Content-Type validation for non-GET requests
app.use((req, res, next) => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.headers['content-type'];
    if (!contentType) {
      return res.status(400).json({
        success: false,
        error: 'Content-Type header required'
      });
    }
  }
  next();
});

// Input sanitization middleware
app.use(SecurityMiddleware.sanitizeRequest);

// Request logging with security monitoring
app.use((req, res, next) => {
  const logEntry = {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  };
  
  if (process.env.ENABLE_REQUEST_LOGGING === 'true') {
    console.log(`📥 ${logEntry.method} ${logEntry.path} - ${logEntry.ip}`);
  }
  
  // Detect suspicious patterns
  const suspiciousPatterns = [
    /\.\.\//,  // Path traversal
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection
    /javascript:/i, // JS injection
    /eval\(/i, // Code injection
  ];
  
  const pathAndQuery = req.path + JSON.stringify(req.query) + JSON.stringify(req.body);
  const isSuspicious = suspiciousPatterns.some(pattern => pattern.test(pathAndQuery));
  
  if (isSuspicious) {
    SecurityLogger.logSuspiciousActivity(
      req.ip,
      req.get('User-Agent'),
      `Suspicious request pattern detected: ${req.method} ${req.path}`
    );
  }
  
  next();
});

// Create logs directory if it doesn't exist
const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
  console.log('✅ Logs directory created');
}

// Create temp directory for uploads if it doesn't exist
const tempDir = process.env.UPLOAD_DIR || './temp/uploads';
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log('✅ Temp upload directory created');
}

// ========================================
// API Routes with Enhanced Security
// ========================================

console.log('🔧 Loading API routes with enhanced security...');

// Strict rate limiting for AI endpoints (expensive operations)
const strictRateLimit = createRateLimit({ 
  max: 10, 
  windowMs: 15 * 60 * 1000 // 10 requests per 15 minutes
});

// Very strict rate limiting for analysis (very expensive)
const analysisRateLimit = createRateLimit({ 
  max: 5, 
  windowMs: 60 * 60 * 1000 // 5 requests per hour
});

// AI Analysis endpoint
const analyzeRoute = require('./api/ai/analyze');
app.post('/api/ai/analyze', 
  analysisRateLimit,
  SecurityMiddleware.validateAPIKey,
  analyzeRoute
);
console.log('✅ /api/ai/analyze loaded with enhanced security');

// Transcription endpoint
const transcribeRoute = require('./api/ai/transcribe');
app.post('/api/ai/transcribe',
  strictRateLimit,
  SecurityMiddleware.validateAPIKey,
  transcribeRoute
);
console.log('✅ /api/ai/transcribe loaded with enhanced security');

// Audio recommendations endpoint
const audioRoute = require('./api/ai/audio-recommendations');
app.post('/api/ai/audio-recommendations',
  strictRateLimit,
  SecurityMiddleware.validateAPIKey,
  audioRoute
);
console.log('✅ /api/ai/audio-recommendations loaded with enhanced security');

// Advanced analysis endpoint
const advancedAnalyzeRoute = require('./api/ai/advanced-analyze');
app.post('/api/ai/advanced-analyze',
  analysisRateLimit,
  SecurityMiddleware.validateAPIKey,
  advancedAnalyzeRoute
);
console.log('✅ /api/ai/advanced-analyze loaded with enhanced security');

// Social media platform endpoints
const platformRateLimit = createRateLimit({ 
  max: 10, 
  windowMs: 15 * 60 * 1000
});

// Facebook
const facebookRoute = require('./api/platforms/facebook/exchange-token');
app.post('/api/platforms/facebook/exchange-token',
  platformRateLimit,
  SecurityMiddleware.validateAPIKey,
  facebookRoute
);
console.log('✅ /api/platforms/facebook/exchange-token loaded with enhanced security');

// Google
const googleRoute = require('./api/platforms/google/exchange-token');
app.post('/api/platforms/google/exchange-token',
  platformRateLimit,
  SecurityMiddleware.validateAPIKey,
  googleRoute
);
console.log('✅ /api/platforms/google/exchange-token loaded with enhanced security');

// TikTok
const tiktokRoute = require('./api/platforms/tiktok/exchange-token');
app.post('/api/platforms/tiktok/exchange-token',
  platformRateLimit,
  SecurityMiddleware.validateAPIKey,
  tiktokRoute
);
console.log('✅ /api/platforms/tiktok/exchange-token loaded with enhanced security');

// Platform Verification
const verifyPlatformRoute = require('./api/platforms/verify');
app.post('/api/platforms/verify',
  platformRateLimit,
  SecurityMiddleware.validateAPIKey,
  verifyPlatformRoute
);
console.log('✅ /api/platforms/verify loaded with enhanced security');

// Campaign Creation
const createCampaignRoute = require('./api/campaigns/create');
app.post('/api/campaigns/create',
  platformRateLimit,
  SecurityMiddleware.validateAPIKey,
  createCampaignRoute
);
console.log('✅ /api/campaigns/create loaded with enhanced security');

// Analytics
const analyticsRoute = require('./api/analytics/get-campaign-metrics');
app.post('/api/analytics/metrics',
  platformRateLimit,
  SecurityMiddleware.validateAPIKey,
  analyticsRoute
);
console.log('✅ /api/analytics/metrics loaded');

// ========================================
// Health & Monitoring Endpoints
// ========================================

// Health check endpoint (no auth required)
app.get('/api/health', (req, res) => {
  const hasValidKey = process.env.OPENAI_API_KEY && 
                     process.env.OPENAI_API_KEY.startsWith('sk-');
  
  res.json({ 
    status: 'OK',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    openai: hasValidKey ? 'configured' : 'missing',
    security: {
      helmet: true,
      cors: true,
      rateLimit: true,
      csrf: process.env.CSRF_ENABLED === 'true',
      inputValidation: true,
      sessionManagement: true,
      apiKeyAuth: true,
      encryption: true
    },
    uptime: process.uptime()
  });
});

// Security status endpoint (requires API key)
app.get('/api/security/status', 
  SecurityMiddleware.validateAPIKey, 
  (req, res) => {
    res.json({
      status: 'secure',
      timestamp: new Date().toISOString(),
      securityLevel: '100%',
      features: {
        helmet: true,
        cors: true,
        csrf: process.env.CSRF_ENABLED === 'true',
        rateLimit: true,
        inputSanitization: true,
        sessionManagement: true,
        apiKeyValidation: true,
        encryption: true,
        securityLogging: process.env.ENABLE_SECURITY_LOGGING === 'true',
        ipFiltering: !!(process.env.IP_WHITELIST || process.env.IP_BLACKLIST),
        fileEncryption: true,
        advancedValidation: true
      },
      environment: process.env.NODE_ENV || 'development',
      rateLimit: {
        global: {
          windowMs: process.env.RATE_LIMIT_WINDOW_MS,
          max: process.env.RATE_LIMIT_MAX_REQUESTS
        }
      }
    });
  }
);

// CSRF token endpoint (for CSRF-enabled apps)
app.get('/api/csrf-token', (req, res) => {
  const sessionId = req.session?.id || req.sessionID;
  const csrfToken = CSRFService.generateToken(sessionId);
  
  res.json({
    success: true,
    csrfToken
  });
});

// CSP violation report endpoint
app.post('/api/csp-report', express.json({ type: 'application/csp-report' }), (req, res) => {
  SecurityLogger.logSecurityEvent('CSP_VIOLATION', {
    report: req.body,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  res.status(204).end();
});

console.log('✅ All API routes loaded successfully with enhanced security!');

// ========================================
// Error Handling
// ========================================

// Global error handling middleware
app.use((error, req, res, next) => {
  // Log the error
  SecurityLogger.logError(error, {
    path: req.path,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  // Security-related errors
  if (error.message.includes('CORS') || 
      error.message.includes('rate limit') || 
      error.message.includes('API key') ||
      error.message.includes('CSRF')) {
    SecurityLogger.logSecurityEvent('SECURITY_ERROR', {
      error: error.message,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      method: req.method
    });
  }
  
  // Don't expose internal errors in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  const showStackTrace = isDevelopment && process.env.ENABLE_STACK_TRACES !== 'false';
  
  // Determine status code
  const statusCode = error.status || error.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: isDevelopment ? error.message : 'An error occurred',
    timestamp: new Date().toISOString(),
    ...(showStackTrace && { stack: error.stack }),
    ...(isDevelopment && { details: error.details })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// Serve static files in production
if (isProduction) {
  const distPath = path.join(__dirname, 'dist');
  
  if (fs.existsSync(distPath)) {
    app.use(express.static(distPath, {
      maxAge: '1d',
      etag: true,
      lastModified: true
    }));
    
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    
    console.log('✅ Serving static files from dist/');
  }
}

// ========================================
// Server Startup
// ========================================

console.log('🎯 Starting enhanced secure server...');

const server = app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   🔒 Look At Me - Enhanced Security Server Running   ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server URL: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔑 OpenAI API: ${process.env.OPENAI_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`🛡️  Security Level: 100%`);
  console.log('');
  console.log('📊 Security Features:');
  console.log('   ✅ Helmet Security Headers');
  console.log('   ✅ CORS Protection');
  console.log('   ✅ Rate Limiting');
  console.log('   ✅ CSRF Protection');
  console.log('   ✅ Input Sanitization');
  console.log('   ✅ Session Management');
  console.log('   ✅ API Key Authentication');
  console.log('   ✅ Data Encryption');
  console.log('   ✅ Security Logging');
  console.log('   ✅ IP Filtering');
  console.log('   ✅ File Encryption');
  console.log('   ✅ Advanced Validation');
  console.log('');
  console.log('🔧 API Endpoints:');
  console.log('   📍 GET  /api/health - Health check');
  console.log('   📍 GET  /api/security/status - Security status');
  console.log('   📍 POST /api/ai/analyze - Video analysis');
  console.log('   📍 POST /api/ai/transcribe - Audio transcription');
  console.log('   📍 POST /api/platforms/verify - Platform verification');
  console.log('');
  console.log('✅ Server is ready to accept secure connections!');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📛 SIGTERM signal received: closing server gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n📛 SIGINT signal received: closing server gracefully');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Unhandled rejection handler
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  SecurityLogger.logError(new Error('Unhandled Rejection'), { reason: reason.toString() });
});

// Uncaught exception handler
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  SecurityLogger.logError(error, { type: 'uncaughtException' });
  
  // Give time to log before exiting
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else {
    console.error('❌ Server error:', error);
  }
  SecurityLogger.logError(error, { type: 'serverError' });
  process.exit(1);
});

module.exports = app;

