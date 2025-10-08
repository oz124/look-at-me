// Security utilities and middleware
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');

// Security configuration
const SECURITY_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || 'fallback-secret-key-change-in-production',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || 'fallback-encryption-key-32-chars',
  SESSION_SECRET: process.env.SESSION_SECRET || 'fallback-session-secret',
  JWT_EXPIRES_IN: '24h',
  BCRYPT_ROUNDS: 12,
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
};

// Validate environment variables
function validateSecurityConfig() {
  const requiredVars = ['JWT_SECRET', 'ENCRYPTION_KEY', 'SESSION_SECRET'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  // Only warn in production
  if (process.env.NODE_ENV === 'production') {
    if (missing.length > 0) {
      throw new Error(`❌ Production requires: ${missing.join(', ')}`);
    }
    
    const usingFallbacks = requiredVars.some(varName => 
      process.env[varName] && process.env[varName].includes('fallback')
    );
    
    if (usingFallbacks) {
      throw new Error('❌ Production environment requires proper security configuration!');
    }
  }
  
  // In development, silently use fallback values
  if (process.env.NODE_ENV !== 'production' && missing.length > 0) {
    // Silent fallback in development
  }
}

// Initialize security validation
validateSecurityConfig();

// Encryption utilities
class EncryptionService {
  static encrypt(text) {
    try {
      return CryptoJS.AES.encrypt(text, SECURITY_CONFIG.ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  static decrypt(encryptedText) {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, SECURITY_CONFIG.ENCRYPTION_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  static hashPassword(password) {
    return bcrypt.hash(password, SECURITY_CONFIG.BCRYPT_ROUNDS);
  }

  static comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }
}

// JWT utilities
class JWTService {
  static generateToken(payload) {
    return jwt.sign(payload, SECURITY_CONFIG.JWT_SECRET, {
      expiresIn: SECURITY_CONFIG.JWT_EXPIRES_IN,
      issuer: 'look-at-me-app',
      audience: 'look-at-me-users'
    });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, SECURITY_CONFIG.JWT_SECRET, {
        issuer: 'look-at-me-app',
        audience: 'look-at-me-users'
      });
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  static decodeToken(token) {
    return jwt.decode(token);
  }
}

// Input validation utilities
class ValidationService {
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    // Remove potentially dangerous characters
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static validateFileType(filename, allowedTypes) {
    const extension = filename.split('.').pop().toLowerCase();
    return allowedTypes.includes(extension);
  }

  static validateFileSize(size, maxSizeMB) {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return size <= maxSizeBytes;
  }
}

// Security middleware
class SecurityMiddleware {
  static async authenticateToken(req, res, next) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

      if (!token) {
        return res.status(401).json({ 
          success: false, 
          error: 'Access token required' 
        });
      }

      const decoded = JWTService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(403).json({ 
        success: false, 
        error: 'Invalid or expired token' 
      });
    }
  }

  static async validateAPIKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      return res.status(401).json({ 
        success: false, 
        error: 'API key required' 
      });
    }

    // In production, validate against database or secure storage
    const validApiKeys = process.env.VALID_API_KEYS ? 
      process.env.VALID_API_KEYS.split(',') : ['test-api-key-123'];
    
    if (!validApiKeys.includes(apiKey)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Invalid API key' 
      });
    }

    next();
  }

  static sanitizeRequest(req, res, next) {
    // Sanitize body
    if (req.body) {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = ValidationService.sanitizeInput(req.body[key]);
        }
      }
    }

    // Sanitize query parameters
    if (req.query) {
      for (const key in req.query) {
        if (typeof req.query[key] === 'string') {
          req.query[key] = ValidationService.sanitizeInput(req.query[key]);
        }
      }
    }

    next();
  }
}

// Rate limiting store (in-memory for simplicity)
class RateLimitStore {
  constructor() {
    this.store = new Map();
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS);
  }

  get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    
    if (Date.now() - item.firstRequest > SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS) {
      this.store.delete(key);
      return null;
    }
    
    return item;
  }

  set(key, value) {
    this.store.set(key, value);
  }

  increment(key) {
    const item = this.get(key);
    if (!item) {
      this.set(key, {
        count: 1,
        firstRequest: Date.now()
      });
      return 1;
    }
    
    item.count++;
    return item.count;
  }

  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.store.entries()) {
      if (now - item.firstRequest > SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS) {
        this.store.delete(key);
      }
    }
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.store.clear();
  }
}

// Global rate limit store
const rateLimitStore = new RateLimitStore();

// Rate limiting middleware
function createRateLimit(options = {}) {
  const {
    windowMs = SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS,
    max = SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS,
    keyGenerator = (req) => req.ip,
    skipSuccessfulRequests = false,
    skipFailedRequests = false
  } = options;

  return (req, res, next) => {
    const key = keyGenerator(req);
    const count = rateLimitStore.increment(key);
    
    if (count > max) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    // Add rate limit headers
    res.set({
      'X-RateLimit-Limit': max,
      'X-RateLimit-Remaining': Math.max(0, max - count),
      'X-RateLimit-Reset': new Date(Date.now() + windowMs).toISOString()
    });

    next();
  };
}

// Security logging
class SecurityLogger {
  static logSecurityEvent(event, details = {}) {
    if (process.env.ENABLE_SECURITY_LOGGING === 'true') {
      const logEntry = {
        timestamp: new Date().toISOString(),
        event,
        details,
        ip: details.ip || 'unknown',
        userAgent: details.userAgent || 'unknown'
      };
      
      console.log('🔒 SECURITY EVENT:', JSON.stringify(logEntry, null, 2));
    }
  }

  static logFailedAuth(ip, userAgent, reason) {
    this.logSecurityEvent('FAILED_AUTH', {
      ip,
      userAgent,
      reason
    });
  }

  static logRateLimitExceeded(ip, userAgent, endpoint) {
    this.logSecurityEvent('RATE_LIMIT_EXCEEDED', {
      ip,
      userAgent,
      endpoint
    });
  }

  static logSuspiciousActivity(ip, userAgent, activity) {
    this.logSecurityEvent('SUSPICIOUS_ACTIVITY', {
      ip,
      userAgent,
      activity
    });
  }
}

module.exports = {
  SECURITY_CONFIG,
  EncryptionService,
  JWTService,
  ValidationService,
  SecurityMiddleware,
  createRateLimit,
  SecurityLogger,
  rateLimitStore
};
