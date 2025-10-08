// Frontend security utilities

// Input validation utilities for frontend
class ValidationService {
  static sanitizeInput(input: string): string {
    if (typeof input !== 'string') return input;
    
    // Remove potentially dangerous characters
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): boolean {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  static validateFileType(filename: string, allowedTypes: string[]): boolean {
    const extension = filename.split('.').pop()?.toLowerCase();
    return allowedTypes.includes(extension || '');
  }

  static validateFileSize(size: number, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return size <= maxSizeBytes;
  }
}

// Content Security Policy helper
export const createCSPNonce = (): string => {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

// XSS Protection
export const sanitizeHTML = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

// Input validation for forms
export const validateFormInput = (input: any, rules: {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  type?: 'email' | 'url' | 'number';
}): { isValid: boolean; error?: string } => {
  // Required check
  if (rules.required && (!input || input.toString().trim() === '')) {
    return { isValid: false, error: 'שדה זה נדרש' };
  }

  const value = input?.toString() || '';

  // Length checks
  if (rules.minLength && value.length < rules.minLength) {
    return { isValid: false, error: `מינימום ${rules.minLength} תווים נדרש` };
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    return { isValid: false, error: `מקסימום ${rules.maxLength} תווים מותר` };
  }

  // Pattern check
  if (rules.pattern && !rules.pattern.test(value)) {
    return { isValid: false, error: 'פורמט לא תקין' };
  }

  // Type checks
  if (rules.type === 'email' && !ValidationService.validateEmail(value)) {
    return { isValid: false, error: 'כתובת אימייל לא תקינה' };
  }

  if (rules.type === 'url') {
    try {
      new URL(value);
    } catch {
      return { isValid: false, error: 'כתובת URL לא תקינה' };
    }
  }

  if (rules.type === 'number' && isNaN(Number(value))) {
    return { isValid: false, error: 'מספר לא תקין' };
  }

  return { isValid: true };
};

// File validation
export const validateFile = (file: File, options: {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
}): { isValid: boolean; error?: string } => {
  // Size check
  if (options.maxSize && file.size > options.maxSize) {
    const maxSizeMB = Math.round(options.maxSize / (1024 * 1024));
    return { isValid: false, error: `קובץ גדול מדי. מקסימום ${maxSizeMB}MB` };
  }

  // Type check
  if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'סוג קובץ לא נתמך' };
  }

  // Extension check
  if (options.allowedExtensions) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !options.allowedExtensions.includes(extension)) {
      return { isValid: false, error: 'סיומת קובץ לא נתמכת' };
    }
  }

  return { isValid: true };
};

// Secure storage (localStorage with encryption)
export class SecureStorage {
  private static readonly PREFIX = 'secure_';
  private static readonly ENCRYPTION_KEY = 'look-at-me-app-key';

  static setItem(key: string, value: any): void {
    try {
      const encryptedValue = this.encrypt(JSON.stringify(value));
      localStorage.setItem(this.PREFIX + key, encryptedValue);
    } catch (error) {
      console.error('Failed to store secure data:', error);
    }
  }

  static getItem(key: string): any {
    try {
      const encryptedValue = localStorage.getItem(this.PREFIX + key);
      if (!encryptedValue) return null;
      
      const decryptedValue = this.decrypt(encryptedValue);
      return JSON.parse(decryptedValue);
    } catch (error) {
      console.error('Failed to retrieve secure data:', error);
      return null;
    }
  }

  static removeItem(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  private static encrypt(text: string): string {
    // Simple encryption for client-side storage
    // In production, use a proper encryption library
    let result = '';
    for (let i = 0; i < text.length; i++) {
      result += String.fromCharCode(text.charCodeAt(i) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length));
    }
    return btoa(result);
  }

  private static decrypt(encryptedText: string): string {
    try {
      const text = atob(encryptedText);
      let result = '';
      for (let i = 0; i < text.length; i++) {
        result += String.fromCharCode(text.charCodeAt(i) ^ this.ENCRYPTION_KEY.charCodeAt(i % this.ENCRYPTION_KEY.length));
      }
      return result;
    } catch (error) {
      throw new Error('Failed to decrypt data');
    }
  }
}

// CSRF Protection
export const getCSRFToken = (): string | null => {
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  return token || null;
};

// Security headers validation
export const validateSecurityHeaders = (): void => {
  if (import.meta.env.DEV) {
    const requiredHeaders = [
      'X-Content-Type-Options',
      'X-Frame-Options',
      'X-XSS-Protection',
      'Strict-Transport-Security'
    ];

    // Check if we're in a secure context
    if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
      console.warn('⚠️ Application should be served over HTTPS in production');
    }

    // Log security recommendations
    console.log('🔒 Security recommendations:');
    console.log('- Ensure all API requests use HTTPS');
    console.log('- Validate all user inputs on both client and server');
    console.log('- Use Content Security Policy headers');
    console.log('- Implement proper session management');
  }
};

// Input sanitization for display
export const sanitizeForDisplay = (input: string): string => {
  return ValidationService.sanitizeInput(input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

// URL validation
export const isValidURL = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
};

// Secure redirect
export const secureRedirect = (url: string): void => {
  if (isValidURL(url)) {
    // Add security checks before redirect
    if (url.startsWith('javascript:') || url.startsWith('data:')) {
      console.error('Blocked potentially dangerous redirect');
      return;
    }
    window.location.href = url;
  } else {
    console.error('Invalid redirect URL');
  }
};

// Initialize security
export const initializeSecurity = (): void => {
  // Validate security headers
  validateSecurityHeaders();

  // Set up global error handler for security
  window.addEventListener('error', (event) => {
    if (event.error?.message?.includes('CSP') || 
        event.error?.message?.includes('Content Security Policy')) {
      console.error('🔒 Content Security Policy violation detected');
    }
  });

  // Set up unhandled promise rejection handler
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('CORS') ||
        event.reason?.message?.includes('security')) {
      console.error('🔒 Security-related promise rejection:', event.reason);
    }
  });

  console.log('🔒 Frontend security initialized');
};

// Export ValidationService for use in other components
export { ValidationService };
