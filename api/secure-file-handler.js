// Secure File Handler - Encrypts temporary files and ensures cleanup
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { EncryptionService, SecurityLogger } = require('../src/lib/security-enhanced');

class SecureFileHandler {
  constructor() {
    this.tempFiles = new Map(); // Track temporary files for cleanup
    this.cleanupInterval = setInterval(() => {
      this.cleanupOldFiles();
    }, 300000); // Cleanup every 5 minutes
  }

  /**
   * Generate secure filename
   */
  generateSecureFilename(originalFilename) {
    const timestamp = Date.now();
    const randomString = crypto.randomBytes(16).toString('hex');
    const extension = path.extname(originalFilename);
    const sanitizedExt = extension.replace(/[^a-zA-Z0-9.]/g, '');
    
    return `secure_${timestamp}_${randomString}${sanitizedExt}`;
  }

  /**
   * Encrypt file and store securely
   */
  async encryptFile(filePath, metadata = {}) {
    try {
      const fileContent = fs.readFileSync(filePath);
      const encrypted = EncryptionService.encrypt(fileContent.toString('base64'));
      
      const encryptedPath = `${filePath}.encrypted`;
      fs.writeFileSync(encryptedPath, encrypted);
      
      // Store metadata
      const fileInfo = {
        originalPath: filePath,
        encryptedPath: encryptedPath,
        timestamp: Date.now(),
        size: fileContent.length,
        metadata: metadata
      };
      
      this.tempFiles.set(encryptedPath, fileInfo);
      
      // Delete original unencrypted file
      if (fs.existsSync(filePath)) {
        this.secureDelete(filePath);
      }
      
      SecurityLogger.logSecurityEvent('FILE_ENCRYPTED', {
        path: encryptedPath,
        size: fileContent.length
      });
      
      return encryptedPath;
    } catch (error) {
      SecurityLogger.logError(error, { context: 'File encryption failed' });
      throw new Error('Failed to encrypt file');
    }
  }

  /**
   * Decrypt file for processing
   */
  async decryptFile(encryptedPath, outputPath = null) {
    try {
      const encryptedContent = fs.readFileSync(encryptedPath, 'utf8');
      const decrypted = EncryptionService.decrypt(encryptedContent);
      const fileContent = Buffer.from(decrypted, 'base64');
      
      const output = outputPath || encryptedPath.replace('.encrypted', '');
      fs.writeFileSync(output, fileContent);
      
      SecurityLogger.logSecurityEvent('FILE_DECRYPTED', {
        path: output,
        size: fileContent.length
      });
      
      return output;
    } catch (error) {
      SecurityLogger.logError(error, { context: 'File decryption failed' });
      throw new Error('Failed to decrypt file');
    }
  }

  /**
   * Secure file deletion (overwrite before delete)
   */
  secureDelete(filePath) {
    try {
      if (!fs.existsSync(filePath)) {
        return;
      }

      const stats = fs.statSync(filePath);
      const fileSize = stats.size;
      
      // Overwrite file with random data 3 times
      for (let i = 0; i < 3; i++) {
        const randomData = crypto.randomBytes(fileSize);
        fs.writeFileSync(filePath, randomData);
      }
      
      // Finally delete the file
      fs.unlinkSync(filePath);
      
      SecurityLogger.logSecurityEvent('FILE_SECURELY_DELETED', {
        path: filePath
      });
    } catch (error) {
      console.error('Error in secure delete:', error);
      // Fallback to normal delete
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error('Failed to delete file:', e);
      }
    }
  }

  /**
   * Process uploaded file securely
   */
  async processUploadedFile(file, options = {}) {
    const {
      encrypt = true,
      maxAge = 3600000, // 1 hour default
      allowedTypes = [],
      maxSize = 104857600 // 100MB default
    } = options;

    try {
      // Validate file
      if (allowedTypes.length > 0) {
        const isValidType = allowedTypes.includes(file.mimetype);
        if (!isValidType) {
          this.secureDelete(file.filepath);
          throw new Error('Invalid file type');
        }
      }

      if (file.size > maxSize) {
        this.secureDelete(file.filepath);
        throw new Error('File too large');
      }

      // Generate secure filename
      const secureFilename = this.generateSecureFilename(file.originalFilename);
      const securePath = path.join(path.dirname(file.filepath), secureFilename);
      
      // Move file to secure location
      fs.renameSync(file.filepath, securePath);

      let finalPath = securePath;

      // Encrypt if requested
      if (encrypt) {
        finalPath = await this.encryptFile(securePath, {
          originalFilename: file.originalFilename,
          mimetype: file.mimetype,
          size: file.size,
          maxAge: maxAge
        });
      } else {
        // Store metadata for cleanup
        this.tempFiles.set(securePath, {
          originalPath: securePath,
          timestamp: Date.now(),
          size: file.size,
          metadata: {
            originalFilename: file.originalFilename,
            mimetype: file.mimetype,
            maxAge: maxAge
          }
        });
      }

      return {
        path: finalPath,
        originalFilename: file.originalFilename,
        mimetype: file.mimetype,
        size: file.size,
        encrypted: encrypt
      };

    } catch (error) {
      SecurityLogger.logError(error, { context: 'File processing failed' });
      throw error;
    }
  }

  /**
   * Cleanup old temporary files
   */
  cleanupOldFiles() {
    const now = Date.now();
    let cleanedCount = 0;

    for (const [filePath, fileInfo] of this.tempFiles.entries()) {
      const maxAge = fileInfo.metadata?.maxAge || 3600000; // 1 hour default
      const age = now - fileInfo.timestamp;

      if (age > maxAge) {
        try {
          // Delete encrypted file
          if (fs.existsSync(filePath)) {
            this.secureDelete(filePath);
          }

          // Delete original if it exists
          if (fileInfo.originalPath && fs.existsSync(fileInfo.originalPath)) {
            this.secureDelete(fileInfo.originalPath);
          }

          this.tempFiles.delete(filePath);
          cleanedCount++;
        } catch (error) {
          console.error('Error cleaning up file:', filePath, error);
        }
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned up ${cleanedCount} old temporary files`);
      SecurityLogger.logSecurityEvent('FILE_CLEANUP', {
        count: cleanedCount
      });
    }
  }

  /**
   * Force cleanup of specific file
   */
  async cleanup(filePath) {
    try {
      const fileInfo = this.tempFiles.get(filePath);

      if (fs.existsSync(filePath)) {
        this.secureDelete(filePath);
      }

      if (fileInfo?.originalPath && fs.existsSync(fileInfo.originalPath)) {
        this.secureDelete(fileInfo.originalPath);
      }

      this.tempFiles.delete(filePath);

      SecurityLogger.logSecurityEvent('FILE_CLEANUP_FORCED', {
        path: filePath
      });
    } catch (error) {
      console.error('Error in forced cleanup:', error);
    }
  }

  /**
   * Cleanup all temporary files (for shutdown)
   */
  async cleanupAll() {
    console.log('🧹 Cleaning up all temporary files...');
    
    for (const [filePath] of this.tempFiles.entries()) {
      await this.cleanup(filePath);
    }

    clearInterval(this.cleanupInterval);
    console.log('✅ All temporary files cleaned up');
  }

  /**
   * Get file info
   */
  getFileInfo(filePath) {
    return this.tempFiles.get(filePath);
  }

  /**
   * List all tracked files
   */
  listTrackedFiles() {
    return Array.from(this.tempFiles.entries()).map(([path, info]) => ({
      path,
      ...info
    }));
  }
}

// Export singleton instance
const secureFileHandler = new SecureFileHandler();

// Cleanup on process exit
process.on('exit', () => {
  secureFileHandler.cleanupAll();
});

process.on('SIGINT', () => {
  secureFileHandler.cleanupAll();
  process.exit();
});

process.on('SIGTERM', () => {
  secureFileHandler.cleanupAll();
  process.exit();
});

module.exports = secureFileHandler;

