// Secure API client for frontend
import { ValidationService } from './frontend-security';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';
const API_KEY = import.meta.env.VITE_API_KEY || 'test-api-key-123';

// Security headers
const getSecurityHeaders = () => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  };

  // Add CSRF token if available
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  return headers;
};

// Input validation for frontend
export const validateInput = (input: any, type: 'string' | 'number' | 'email' | 'file'): boolean => {
  switch (type) {
    case 'string':
      return typeof input === 'string' && input.length > 0 && input.length <= 1000;
    case 'number':
      return typeof input === 'number' && !isNaN(input) && input >= 0;
    case 'email':
      return ValidationService.validateEmail(input);
    case 'file':
      return input instanceof File && input.size <= 100 * 1024 * 1024; // 100MB
    default:
      return false;
  }
};

// Sanitize user input
export const sanitizeInput = (input: string): string => {
  return ValidationService.sanitizeInput(input);
};

// Secure API request function
export const secureApiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Validate URL
  try {
    new URL(url);
  } catch (error) {
    throw new Error('Invalid API endpoint');
  }

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...getSecurityHeaders(),
      ...options.headers,
    },
    credentials: 'include', // Include cookies for session management
  };

  // Add timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

  try {
    const response = await fetch(url, {
      ...requestOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Check for security-related headers
    const securityHeaders = {
      'X-Content-Type-Options': response.headers.get('X-Content-Type-Options'),
      'X-Frame-Options': response.headers.get('X-Frame-Options'),
      'X-XSS-Protection': response.headers.get('X-XSS-Protection'),
      'Strict-Transport-Security': response.headers.get('Strict-Transport-Security'),
    };

    // Log security warnings if headers are missing
    if (import.meta.env.DEV) {
      const missingHeaders = Object.entries(securityHeaders)
        .filter(([_, value]) => !value)
        .map(([key]) => key);
      
      if (missingHeaders.length > 0) {
        console.warn('Missing security headers:', missingHeaders);
      }
    }

    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    
    throw error;
  }
};

// File upload with security validation
export const uploadFile = async (
  endpoint: string,
  file: File,
  additionalData: Record<string, any> = {}
): Promise<Response> => {
  // Validate file
  if (!validateInput(file, 'file')) {
    throw new Error('Invalid file type or size');
  }

  // Validate file type
  const allowedTypes = [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/wmv',
    'video/flv',
    'video/webm',
    'video/mkv',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/m4a',
    'audio/ogg'
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error('File type not allowed');
  }

  // Create form data
  const formData = new FormData();
  formData.append('video', file);

  // Sanitize and add additional data
  Object.entries(additionalData).forEach(([key, value]) => {
    if (typeof value === 'string') {
      formData.append(key, sanitizeInput(value));
    } else {
      formData.append(key, String(value));
    }
  });

  return secureApiRequest(endpoint, {
    method: 'POST',
    body: formData,
    headers: {
      // Don't set Content-Type for FormData, let browser set it with boundary
      'X-API-Key': API_KEY,
    },
  });
};

// API endpoints
export const apiEndpoints = {
  analyze: '/api/ai/analyze',
  transcribe: '/api/ai/transcribe',
  audioRecommendations: '/api/ai/audio-recommendations',
  facebookToken: '/api/platforms/facebook/exchange-token',
  googleToken: '/api/platforms/google/exchange-token',
  tiktokToken: '/api/platforms/tiktok/exchange-token',
  health: '/api/health',
  securityStatus: '/api/security/status',
} as const;

// Error handling
export const handleApiError = (error: any): string => {
  if (error.message.includes('timeout')) {
    return 'הבקשה ארכה יותר מדי זמן. אנא נסה שוב.';
  }
  
  if (error.message.includes('network')) {
    return 'שגיאת רשת. אנא בדוק את החיבור לאינטרנט.';
  }
  
  if (error.message.includes('CORS')) {
    return 'שגיאת אבטחה. אנא רענן את הדף.';
  }
  
  if (error.message.includes('rate limit')) {
    return 'יותר מדי בקשות. אנא המתן רגע ונסה שוב.';
  }
  
  return 'שגיאה לא ידועה. אנא נסה שוב מאוחר יותר.';
};

// Rate limiting helper
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  canMakeRequest(key: string, maxRequests: number, windowMs: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Remove old requests outside the window
    const validRequests = requests.filter(time => now - time < windowMs);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    // Add current request
    validRequests.push(now);
    this.requests.set(key, validRequests);
    
    return true;
  }

  getRemainingRequests(key: string, maxRequests: number, windowMs: number): number {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    const validRequests = requests.filter(time => now - time < windowMs);
    
    return Math.max(0, maxRequests - validRequests.length);
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();
