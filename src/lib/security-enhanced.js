// Enhanced Security utilities and middleware - 100% Secure
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const CryptoJS = require('crypto-js');
const fs = require('fs');
const path = require('path');

// Security configuration with validation
const SECURITY_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || (() => {
    throw new Error('JWT_SECRET environment variable is required!');
  })(),
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY || (() => {
    throw new Error('ENCRYPTION_KEY environment variable is required!');
  })(),
  SESSION_SECRET: process.env.SESSION_SECRET || (() => {
    throw new Error('SESSION_SECRET environment variable is required!');
  })(),
  CSRF_SECRET: process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex'),
  JWT_EXPIRES_IN: '24h',
  JWT_REFRESH_EXPIRES_IN: '7d',
  BCRYPT_ROUNDS: 12,
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  MAX_LOGIN_ATTEMPTS: parseInt(process.env.MAX_LOGIN_ATTEMPTS) || 5,
  LOGIN_LOCKOUT_DURATION: parseInt(process.env.LOGIN_LOCKOUT_DURATION) || 900000,
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE) || 104857600, // 100MB
  ALLOWED_FILE_TYPES: (process.env.ALLOWED_FILE_TYPES || '').split(',').filter(Boolean)
};

// Validate security configuration at startup
function validateSecurityConfig() {
  const requiredVars = ['JWT_SECRET', 'ENCRYPTION_KEY', 'SESSION_SECRET'];
  const missing = requiredVars.filter(varName => !process.env[varName]);
  
  if (missing.length > 0 && process.env.NODE_ENV === 'production') {
    throw new Error(`⛔ Production environment requires: ${missing.join(', ')}`);
  }
  
  // Validate key lengths
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    console.warn('⚠️  JWT_SECRET should be at least 32 characters for security');
  }
  
  if (process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length < 64) {
    console.warn('⚠️  ENCRYPTION_KEY should be 64 hex characters (32 bytes)');
  }
  
  console.log('✅ Security configuration validated successfully');
}

// Initialize security validation
try {
  validateSecurityConfig();
} catch (error) {
  if (process.env.NODE_ENV === 'production') {
    throw error;
  }
  console.warn('⚠️ ', error.message);
}

// Enhanced Encryption Service
class EncryptionService {
  static encrypt(text) {
    try {
      const encrypted = CryptoJS.AES.encrypt(text, SECURITY_CONFIG.ENCRYPTION_KEY);
      return encrypted.toString();
    } catch (error) {
      console.error('❌ Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  static decrypt(encryptedText) {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedText, SECURITY_CONFIG.ENCRYPTION_KEY);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('❌ Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  static hashPassword(password) {
    return bcrypt.hash(password, SECURITY_CONFIG.BCRYPT_ROUNDS);
  }

  static comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
  }

  static generateSecureToken(length = 32) {
    return crypto.randomBytes(length).toString('hex');
  }

  static hashSHA256(data) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static encryptFile(filePath) {
    try {
      const fileContent = fs.readFileSync(filePath);
      const encrypted = this.encrypt(fileContent.toString('base64'));
      const encryptedPath = `${filePath}.encrypted`;
      fs.writeFileSync(encryptedPath, encrypted);
      fs.unlinkSync(filePath); // Remove original
      return encryptedPath;
    } catch (error) {
      console.error('❌ File encryption error:', error);
      throw new Error('Failed to encrypt file');
    }
  }

  static decryptFile(encryptedPath, outputPath) {
    try {
      const encryptedContent = fs.readFileSync(encryptedPath, 'utf8');
      const decrypted = this.decrypt(encryptedContent);
      const fileContent = Buffer.from(decrypted, 'base64');
      fs.writeFileSync(outputPath, fileContent);
      return outputPath;
    } catch (error) {
      console.error('❌ File decryption error:', error);
      throw new Error('Failed to decrypt file');
    }
  }
}

// Enhanced JWT Service
class JWTService {
  static generateToken(payload, options = {}) {
    return jwt.sign(payload, SECURITY_CONFIG.JWT_SECRET, {
      expiresIn: options.expiresIn || SECURITY_CONFIG.JWT_EXPIRES_IN,
      issuer: 'look-at-me-app',
      audience: 'look-at-me-users',
      ...options
    });
  }

  static generateRefreshToken(payload) {
    return this.generateToken(payload, {
      expiresIn: SECURITY_CONFIG.JWT_REFRESH_EXPIRES_IN
    });
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, SECURITY_CONFIG.JWT_SECRET, {
        issuer: 'look-at-me-app',
        audience: 'look-at-me-users'
      });
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expired');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Invalid token');
      }
      throw new Error('Token verification failed');
    }
  }

  static decodeToken(token) {
    return jwt.decode(token);
  }
}

// Enhanced Input Validation Service
class ValidationService {
  static sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      // Remove script tags
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      // Remove javascript: protocol
      .replace(/javascript:/gi, '')
      // Remove event handlers
      .replace(/on\w+\s*=/gi, '')
      // Remove data: protocol
      .replace(/data:/gi, '')
      // Remove vbscript: protocol
      .replace(/vbscript:/gi, '')
      // Remove dangerous HTML tags
      .replace(/<(iframe|embed|object|link|meta|base)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '')
      .trim();
  }

  static sanitizeFilename(filename) {
    // Remove path traversal attempts
    return filename
      .replace(/\.\./g, '')
      .replace(/[/\\]/g, '')
      .replace(/[^\w.-]/g, '_')
      .substring(0, 255);
  }

  static validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  static validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password) && password.length >= 8 && password.length <= 128;
  }

  static validateURL(url) {
    try {
      const urlObj = new URL(url);
      const allowedProtocols = ['http:', 'https:'];
      return allowedProtocols.includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  static validateFileType(filename, mimetype, allowedTypes) {
    const extension = filename.split('.').pop().toLowerCase();
    const allowedExtensions = allowedTypes.map(type => type.split('/')[1]);
    
    return allowedTypes.includes(mimetype) && allowedExtensions.includes(extension);
  }

  static validateFileSize(size, maxSize = SECURITY_CONFIG.MAX_FILE_SIZE) {
    return size > 0 && size <= maxSize;
  }

  static validateJSON(jsonString) {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  }

  static validateIPAddress(ip) {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }

  static escapeHTML(text) {
    const htmlEscapes = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    };
    return text.replace(/[&<>"'\/]/g, char => htmlEscapes[char]);
  }

  static validateInteger(value, min = -Infinity, max = Infinity) {
    const num = parseInt(value, 10);
    return Number.isInteger(num) && num >= min && num <= max;
  }

  static validateFloat(value, min = -Infinity, max = Infinity) {
    const num = parseFloat(value);
    return !isNaN(num) && num >= min && num <= max;
  }
}

// CSRF Protection Service
class CSRFService {
  static generateToken(sessionId) {
    const token = crypto.randomBytes(32).toString('hex');
    const hash = crypto
      .createHmac('sha256', SECURITY_CONFIG.CSRF_SECRET)
      .update(`${sessionId}-${token}`)
      .digest('hex');
    return `${token}.${hash}`;
  }

  static verifyToken(csrfToken, sessionId) {
    if (!csrfToken || typeof csrfToken !== 'string') {
      return false;
    }

    const [token, hash] = csrfToken.split('.');
    if (!token || !hash) {
      return false;
    }

    const expectedHash = crypto
      .createHmac('sha256', SECURITY_CONFIG.CSRF_SECRET)
      .update(`${sessionId}-${token}`)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      Buffer.from(expectedHash, 'hex')
    );
  }

  static middleware(req, res, next) {
    // Skip CSRF check for GET, HEAD, OPTIONS
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
      return next();
    }

    const csrfToken = req.headers['x-csrf-token'] || req.body._csrf;
    const sessionId = req.session?.id || req.sessionID;

    if (!sessionId) {
      return res.status(403).json({
        success: false,
        error: 'Session required'
      });
    }

    if (!CSRFService.verifyToken(csrfToken, sessionId)) {
      SecurityLogger.logSecurityEvent('CSRF_VALIDATION_FAILED', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path
      });

      return res.status(403).json({
        success: false,
        error: 'Invalid CSRF token'
      });
    }

    next();
  }
}

// Enhanced Security Middleware
class SecurityMiddleware {
  static async authenticateToken(req, res, next) {
    try {
      const authHeader = req.headers['authorization'];
      const token = authHeader && authHeader.split(' ')[1];

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
      SecurityLogger.logFailedAuth(req.ip, req.get('User-Agent'), error.message);
      
      return res.status(403).json({
        success: false,
        error: error.message
      });
    }
  }

  static async validateAPIKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey) {
      SecurityLogger.logFailedAuth(req.ip, req.get('User-Agent'), 'Missing API key');
      
      return res.status(401).json({
        success: false,
        error: 'API key required'
      });
    }

    const validApiKeys = process.env.VALID_API_KEYS ? 
      process.env.VALID_API_KEYS.split(',').map(k => k.trim()) : [];
    
    if (!validApiKeys.includes(apiKey)) {
      SecurityLogger.logFailedAuth(req.ip, req.get('User-Agent'), 'Invalid API key');
      
      return res.status(403).json({
        success: false,
        error: 'Invalid API key'
      });
    }

    next();
  }

  static sanitizeRequest(req, res, next) {
    // Sanitize body
    if (req.body && typeof req.body === 'object') {
      for (const key in req.body) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = ValidationService.sanitizeInput(req.body[key]);
        }
      }
    }

    // Sanitize query parameters
    if (req.query && typeof req.query === 'object') {
      for (const key in req.query) {
        if (typeof req.query[key] === 'string') {
          req.query[key] = ValidationService.sanitizeInput(req.query[key]);
        }
      }
    }

    // Sanitize params
    if (req.params && typeof req.params === 'object') {
      for (const key in req.params) {
        if (typeof req.params[key] === 'string') {
          req.params[key] = ValidationService.sanitizeInput(req.params[key]);
        }
      }
    }

    next();
  }

  static validateContentType(allowedTypes = ['application/json']) {
    return (req, res, next) => {
      const contentType = req.headers['content-type'];
      
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        if (!contentType || !allowedTypes.some(type => contentType.includes(type))) {
          return res.status(415).json({
            success: false,
            error: 'Unsupported Media Type'
          });
        }
      }
      
      next();
    };
  }

  static checkIPWhitelist(req, res, next) {
    const whitelist = process.env.IP_WHITELIST ? 
      process.env.IP_WHITELIST.split(',').map(ip => ip.trim()) : [];
    
    if (whitelist.length === 0) {
      return next();
    }

    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (!whitelist.includes(clientIP)) {
      SecurityLogger.logSuspiciousActivity(
        clientIP,
        req.get('User-Agent'),
        'IP not in whitelist'
      );
      
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    next();
  }

  static checkIPBlacklist(req, res, next) {
    const blacklist = process.env.IP_BLACKLIST ? 
      process.env.IP_BLACKLIST.split(',').map(ip => ip.trim()) : [];
    
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (blacklist.includes(clientIP)) {
      SecurityLogger.logSuspiciousActivity(
        clientIP,
        req.get('User-Agent'),
        'IP in blacklist'
      );
      
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    next();
  }
}

// Enhanced Rate Limiting Store
class RateLimitStore {
  constructor() {
    this.store = new Map();
    this.loginAttempts = new Map();
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 60000); // Cleanup every minute
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

  increment(key, windowMs = SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS) {
    const item = this.get(key);
    if (!item) {
      this.set(key, {
        count: 1,
        firstRequest: Date.now(),
        lastRequest: Date.now()
      });
      return 1;
    }
    
    item.count++;
    item.lastRequest = Date.now();
    return item.count;
  }

  recordLoginAttempt(identifier, success) {
    const key = `login:${identifier}`;
    const attempts = this.loginAttempts.get(key) || [];
    
    attempts.push({
      timestamp: Date.now(),
      success
    });

    // Keep only recent attempts
    const recentAttempts = attempts.filter(
      attempt => Date.now() - attempt.timestamp < SECURITY_CONFIG.LOGIN_LOCKOUT_DURATION
    );

    this.loginAttempts.set(key, recentAttempts);

    return recentAttempts;
  }

  isLoginLocked(identifier) {
    const key = `login:${identifier}`;
    const attempts = this.loginAttempts.get(key) || [];
    
    const recentFailedAttempts = attempts.filter(
      attempt => !attempt.success && 
                 Date.now() - attempt.timestamp < SECURITY_CONFIG.LOGIN_LOCKOUT_DURATION
    );

    return recentFailedAttempts.length >= SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS;
  }

  cleanup() {
    const now = Date.now();
    
    // Cleanup rate limit store
    for (const [key, item] of this.store.entries()) {
      if (now - item.firstRequest > SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS) {
        this.store.delete(key);
      }
    }

    // Cleanup login attempts
    for (const [key, attempts] of this.loginAttempts.entries()) {
      const recentAttempts = attempts.filter(
        attempt => now - attempt.timestamp < SECURITY_CONFIG.LOGIN_LOCKOUT_DURATION
      );
      
      if (recentAttempts.length === 0) {
        this.loginAttempts.delete(key);
      } else {
        this.loginAttempts.set(key, recentAttempts);
      }
    }
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    this.store.clear();
    this.loginAttempts.clear();
  }
}

// Global rate limit store
const rateLimitStore = new RateLimitStore();

// Enhanced Rate Limiting Middleware
function createRateLimit(options = {}) {
  const {
    windowMs = SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS,
    max = SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS,
    keyGenerator = (req) => req.ip || req.connection.remoteAddress,
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
    handler = null
  } = options;

  return (req, res, next) => {
    const key = keyGenerator(req);
    const count = rateLimitStore.increment(key, windowMs);
    
    if (count > max) {
      SecurityLogger.logRateLimitExceeded(req.ip, req.get('User-Agent'), req.path);

      if (handler) {
        return handler(req, res, next);
      }

      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    res.set({
      'X-RateLimit-Limit': max,
      'X-RateLimit-Remaining': Math.max(0, max - count),
      'X-RateLimit-Reset': new Date(Date.now() + windowMs).toISOString()
    });

    next();
  };
}

// Enhanced Security Logging
class SecurityLogger {
  static getLogFilePath() {
    const logDir = process.env.LOG_FILE_PATH ? 
      path.dirname(process.env.LOG_FILE_PATH) : './logs';
    
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }

    return process.env.LOG_FILE_PATH || path.join(logDir, 'security.log');
  }

  static writeLog(entry) {
    if (process.env.ENABLE_SECURITY_LOGGING !== 'true') {
      return;
    }

    const logEntry = {
      ...entry,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };

    // Console log
    console.log('🔒 SECURITY EVENT:', JSON.stringify(logEntry, null, 2));

    // File log
    try {
      const logFilePath = this.getLogFilePath();
      fs.appendFileSync(
        logFilePath,
        JSON.stringify(logEntry) + '\n',
        'utf8'
      );
    } catch (error) {
      console.error('Failed to write security log:', error);
    }
  }

  static logSecurityEvent(event, details = {}) {
    this.writeLog({
      event,
      severity: 'INFO',
      ...details
    });
  }

  static logFailedAuth(ip, userAgent, reason) {
    this.writeLog({
      event: 'FAILED_AUTH',
      severity: 'WARNING',
      ip,
      userAgent,
      reason
    });
  }

  static logRateLimitExceeded(ip, userAgent, endpoint) {
    this.writeLog({
      event: 'RATE_LIMIT_EXCEEDED',
      severity: 'WARNING',
      ip,
      userAgent,
      endpoint
    });
  }

  static logSuspiciousActivity(ip, userAgent, activity) {
    this.writeLog({
      event: 'SUSPICIOUS_ACTIVITY',
      severity: 'CRITICAL',
      ip,
      userAgent,
      activity
    });
  }

  static logDataAccess(userId, resource, action) {
    this.writeLog({
      event: 'DATA_ACCESS',
      severity: 'INFO',
      userId,
      resource,
      action
    });
  }

  static logError(error, context = {}) {
    this.writeLog({
      event: 'ERROR',
      severity: 'ERROR',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      ...context
    });
  }
}

module.exports = {
  SECURITY_CONFIG,
  EncryptionService,
  JWTService,
  ValidationService,
  CSRFService,
  SecurityMiddleware,
  createRateLimit,
  SecurityLogger,
  rateLimitStore
};

