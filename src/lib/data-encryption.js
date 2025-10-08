// Data encryption utilities for sensitive information
const crypto = require('crypto');
const { EncryptionService } = require('./security');

// Enhanced encryption for sensitive data
class DataEncryption {
  constructor() {
    this.algorithm = 'aes-256-gcm';
    this.keyLength = 32; // 256 bits
    this.ivLength = 16; // 128 bits
    this.tagLength = 16; // 128 bits
  }

  // Generate a secure random key
  generateKey() {
    return crypto.randomBytes(this.keyLength);
  }

  // Derive key from password using PBKDF2
  deriveKey(password, salt) {
    return crypto.pbkdf2Sync(password, salt, 100000, this.keyLength, 'sha512');
  }

  // Encrypt sensitive data
  encryptSensitiveData(data, key) {
    try {
      const iv = crypto.randomBytes(this.ivLength);
      const cipher = crypto.createCipher(this.algorithm, key);
      cipher.setAAD(Buffer.from('look-at-me-app', 'utf8'));

      let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const tag = cipher.getAuthTag();

      return {
        encrypted,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
        algorithm: this.algorithm
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt sensitive data');
    }
  }

  // Decrypt sensitive data
  decryptSensitiveData(encryptedData, key) {
    try {
      const decipher = crypto.createDecipher(this.algorithm, key);
      decipher.setAAD(Buffer.from('look-at-me-app', 'utf8'));
      decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));

      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      return JSON.parse(decrypted);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt sensitive data');
    }
  }

  // Hash sensitive data (one-way)
  hashSensitiveData(data, salt = null) {
    const actualSalt = salt || crypto.randomBytes(16);
    const hash = crypto.pbkdf2Sync(JSON.stringify(data), actualSalt, 100000, 64, 'sha512');
    
    return {
      hash: hash.toString('hex'),
      salt: actualSalt.toString('hex')
    };
  }

  // Verify hashed data
  verifyHashedData(data, hash, salt) {
    const newHash = this.hashSensitiveData(data, Buffer.from(salt, 'hex'));
    return newHash.hash === hash;
  }

  // Encrypt API keys and tokens
  encryptApiKey(apiKey) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
    return this.encryptSensitiveData({ apiKey }, key);
  }

  // Decrypt API keys and tokens
  decryptApiKey(encryptedApiKey) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
    const decrypted = this.decryptSensitiveData(encryptedApiKey, key);
    return decrypted.apiKey;
  }

  // Encrypt user session data
  encryptSessionData(sessionData) {
    const key = Buffer.from(process.env.SESSION_SECRET, 'utf8');
    return this.encryptSensitiveData(sessionData, key);
  }

  // Decrypt user session data
  decryptSessionData(encryptedSessionData) {
    const key = Buffer.from(process.env.SESSION_SECRET, 'utf8');
    return this.decryptSensitiveData(encryptedSessionData, key);
  }

  // Encrypt file metadata
  encryptFileMetadata(metadata) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
    return this.encryptSensitiveData(metadata, key);
  }

  // Decrypt file metadata
  decryptFileMetadata(encryptedMetadata) {
    const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
    return this.decryptSensitiveData(encryptedMetadata, key);
  }
}

// Database encryption utilities
class DatabaseEncryption {
  constructor() {
    this.encryption = new DataEncryption();
  }

  // Encrypt data before storing in database
  encryptForStorage(data, fieldsToEncrypt = []) {
    const encrypted = { ...data };
    
    fieldsToEncrypt.forEach(field => {
      if (data[field]) {
        encrypted[field] = this.encryption.encryptSensitiveData(
          data[field], 
          Buffer.from(process.env.ENCRYPTION_KEY, 'utf8')
        );
      }
    });

    return encrypted;
  }

  // Decrypt data after retrieving from database
  decryptFromStorage(data, fieldsToDecrypt = []) {
    const decrypted = { ...data };
    
    fieldsToDecrypt.forEach(field => {
      if (data[field] && typeof data[field] === 'object' && data[field].encrypted) {
        decrypted[field] = this.encryption.decryptSensitiveData(
          data[field], 
          Buffer.from(process.env.ENCRYPTION_KEY, 'utf8')
        );
      }
    });

    return decrypted;
  }
}

// File encryption utilities
class FileEncryption {
  constructor() {
    this.encryption = new DataEncryption();
  }

  // Encrypt file content
  async encryptFile(filePath, outputPath) {
    try {
      const fs = require('fs');
      const fileContent = fs.readFileSync(filePath);
      const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
      
      const encrypted = this.encryption.encryptSensitiveData(
        { content: fileContent.toString('base64') }, 
        key
      );
      
      fs.writeFileSync(outputPath, JSON.stringify(encrypted));
      return true;
    } catch (error) {
      console.error('File encryption error:', error);
      return false;
    }
  }

  // Decrypt file content
  async decryptFile(encryptedFilePath, outputPath) {
    try {
      const fs = require('fs');
      const encryptedData = JSON.parse(fs.readFileSync(encryptedFilePath, 'utf8'));
      const key = Buffer.from(process.env.ENCRYPTION_KEY, 'utf8');
      
      const decrypted = this.encryption.decryptSensitiveData(encryptedData, key);
      const fileContent = Buffer.from(decrypted.content, 'base64');
      
      fs.writeFileSync(outputPath, fileContent);
      return true;
    } catch (error) {
      console.error('File decryption error:', error);
      return false;
    }
  }
}

// Secure data storage middleware
class SecureStorage {
  constructor() {
    this.encryption = new DataEncryption();
    this.dbEncryption = new DatabaseEncryption();
  }

  // Store sensitive data securely
  storeSensitiveData(key, data, options = {}) {
    const {
      encrypt = true,
      hash = false,
      ttl = null // Time to live in seconds
    } = options;

    let processedData = data;

    if (encrypt) {
      processedData = this.encryption.encryptSensitiveData(
        data, 
        Buffer.from(process.env.ENCRYPTION_KEY, 'utf8')
      );
    }

    if (hash) {
      processedData = this.encryption.hashSensitiveData(data);
    }

    // In a real application, store in secure database
    // For now, we'll use encrypted local storage
    const storageData = {
      data: processedData,
      timestamp: Date.now(),
      ttl: ttl,
      encrypted: encrypt,
      hashed: hash
    };

    // Store in secure location (implement based on your storage solution)
    return this.storeInSecureLocation(key, storageData);
  }

  // Retrieve sensitive data securely
  retrieveSensitiveData(key) {
    try {
      const storageData = this.retrieveFromSecureLocation(key);
      
      if (!storageData) {
        return null;
      }

      // Check TTL
      if (storageData.ttl && Date.now() - storageData.timestamp > storageData.ttl * 1000) {
        this.deleteSensitiveData(key);
        return null;
      }

      let data = storageData.data;

      if (storageData.encrypted) {
        data = this.encryption.decryptSensitiveData(
          data, 
          Buffer.from(process.env.ENCRYPTION_KEY, 'utf8')
        );
      }

      return data;
    } catch (error) {
      console.error('Error retrieving sensitive data:', error);
      return null;
    }
  }

  // Delete sensitive data
  deleteSensitiveData(key) {
    return this.deleteFromSecureLocation(key);
  }

  // Placeholder methods - implement based on your storage solution
  storeInSecureLocation(key, data) {
    // Implement secure storage (database, encrypted file, etc.)
    console.log(`Storing sensitive data for key: ${key}`);
    return true;
  }

  retrieveFromSecureLocation(key) {
    // Implement secure retrieval
    console.log(`Retrieving sensitive data for key: ${key}`);
    return null;
  }

  deleteFromSecureLocation(key) {
    // Implement secure deletion
    console.log(`Deleting sensitive data for key: ${key}`);
    return true;
  }
}

// Export encryption utilities
module.exports = {
  DataEncryption,
  DatabaseEncryption,
  FileEncryption,
  SecureStorage
};
