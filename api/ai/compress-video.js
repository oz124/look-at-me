// API endpoint for video compression
// This endpoint compresses large video files for AI analysis while preserving quality

const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const fs = require('fs');
const path = require('path');
const { ValidationService, SecurityLogger } = require('../../src/lib/security');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  console.log("📥 Received POST request to /api/ai/compress-video");

  const formidable = require('formidable').formidable;
  
  const form = formidable({
    maxFileSize: 4 * 1024 * 1024 * 1024, // 4GB - Facebook's limit
    keepExtensions: true,
    uploadDir: require('os').tmpdir(),
    filter: function ({name, originalFilename, mimetype}) {
      // Security: Only allow video files
      const allowedMimeTypes = [
        'video/mp4',
        'video/avi',
        'video/mov',
        'video/wmv',
        'video/flv',
        'video/webm',
        'video/mkv'
      ];
      
      const allowedExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
      const fileExtension = originalFilename.split('.').pop().toLowerCase();
      
      if (!allowedMimeTypes.includes(mimetype) || !allowedExtensions.includes(fileExtension)) {
        SecurityLogger.logSecurityEvent('INVALID_FILE_TYPE', {
          filename: originalFilename,
          mimetype: mimetype,
          ip: req.ip,
          userAgent: req.get('User-Agent')
        });
        return false;
      }
      
      return true;
    }
  });

  let videoFile = null;

  try {
    console.log("🔄 Parsing form data...");
    const [fields, files] = await form.parse(req);
    console.log("✅ Form parsed successfully");
    
    videoFile = files.video ? files.video[0] : null;
    
    if (!videoFile) {
      console.error("❌ No video file provided");
      return res.status(400).json({ success: false, error: 'No video file provided' });
    }

    console.log("✅ Video file found:", {
      originalFilename: videoFile.originalFilename,
      size: videoFile.size,
      mimetype: videoFile.mimetype,
      filepath: videoFile.filepath
    });

    const maxSizeForAI = 25 * 1024 * 1024; // 25MB for OpenAI Whisper
    
    // If file is already small enough, return original
    if (videoFile.size <= maxSizeForAI) {
      console.log("✅ File is already small enough for AI analysis");
      return res.status(200).json({
        success: true,
        message: 'File is already small enough for AI analysis',
        compressedFile: videoFile,
        originalSize: videoFile.size,
        compressedSize: videoFile.size,
        compressionRatio: 1.0
      });
    }

    console.log("🎬 Starting video compression for AI analysis...");
    
    // Create compressed file path
    const tempDir = require('os').tmpdir();
    const compressedFilename = `compressed_${Date.now()}_${videoFile.originalFilename}`;
    const compressedPath = path.join(tempDir, compressedFilename);

    // Compress video for AI analysis
    await new Promise((resolve, reject) => {
      ffmpeg(videoFile.filepath)
        .outputOptions([
          '-c:v libx264',           // Use H.264 codec
          '-crf 28',                // Constant rate factor (lower = better quality, higher file size)
          '-preset fast',           // Encoding speed preset
          '-c:a aac',               // Audio codec
          '-b:a 128k',              // Audio bitrate
          '-movflags +faststart',   // Optimize for streaming
          '-maxrate 2M',            // Maximum bitrate
          '-bufsize 4M'             // Buffer size
        ])
        .output(compressedPath)
        .on('start', (commandLine) => {
          console.log('🎬 FFmpeg process started:', commandLine);
        })
        .on('progress', (progress) => {
          console.log(`📊 Compression progress: ${progress.percent}% done`);
        })
        .on('end', () => {
          console.log('✅ Video compression completed');
          resolve();
        })
        .on('error', (err) => {
          console.error('❌ FFmpeg error:', err);
          reject(err);
        })
        .run();
    });

    // Check compressed file size
    const stats = fs.statSync(compressedPath);
    const compressedSize = stats.size;
    
    console.log("📊 Compression results:", {
      originalSize: videoFile.size,
      compressedSize: compressedSize,
      compressionRatio: (videoFile.size / compressedSize).toFixed(2)
    });

    // If still too large, try more aggressive compression
    if (compressedSize > maxSizeForAI) {
      console.log("🔄 File still too large, trying more aggressive compression...");
      
      const aggressiveCompressedPath = path.join(tempDir, `aggressive_${compressedFilename}`);
      
      await new Promise((resolve, reject) => {
        ffmpeg(videoFile.filepath)
          .outputOptions([
            '-c:v libx264',
            '-crf 35',              // Higher CRF for more compression
            '-preset ultrafast',    // Fastest encoding
            '-c:a aac',
            '-b:a 64k',             // Lower audio bitrate
            '-vf scale=720:480',    // Scale down resolution
            '-maxrate 1M',          // Lower maximum bitrate
            '-bufsize 2M'
          ])
          .output(aggressiveCompressedPath)
          .on('end', () => resolve())
          .on('error', reject)
          .run();
      });

      const aggressiveStats = fs.statSync(aggressiveCompressedPath);
      
      if (aggressiveStats.size <= maxSizeForAI) {
        // Use aggressive compression
        fs.unlinkSync(compressedPath); // Delete first attempt
        fs.renameSync(aggressiveCompressedPath, compressedPath);
        console.log("✅ Aggressive compression successful");
      } else {
        // Delete both attempts and return error
        fs.unlinkSync(compressedPath);
        fs.unlinkSync(aggressiveCompressedPath);
        throw new Error('Unable to compress video to required size for AI analysis');
      }
    }

    // Create file object for compressed video
    const compressedFile = {
      originalFilename: videoFile.originalFilename,
      size: fs.statSync(compressedPath).size,
      mimetype: 'video/mp4',
      filepath: compressedPath,
      compressed: true
    };

    console.log("✅ Video compression completed successfully");

    res.status(200).json({
      success: true,
      message: 'Video compressed successfully for AI analysis',
      compressedFile: compressedFile,
      originalSize: videoFile.size,
      compressedSize: compressedFile.size,
      compressionRatio: (videoFile.size / compressedFile.size).toFixed(2)
    });

  } catch (error) {
    console.error('❌ Error in video compression API:', error);
    
    // Clean up files if they exist
    if (videoFile && videoFile.filepath) {
      try {
        if (fs.existsSync(videoFile.filepath)) {
          fs.unlinkSync(videoFile.filepath);
        }
      } catch (cleanupError) {
        console.error("Error during cleanup:", cleanupError);
      }
    }
    
    let errorMessage = 'Video compression failed';
    let statusCode = 500;
    
    if (error.message.includes('Unable to compress')) {
      errorMessage = 'הסרטון גדול מדי ולא ניתן לדחוס אותו לגודל הנדרש לניתוח AI. נסה עם סרטון קצר יותר.';
      statusCode = 400;
    } else if (error.message.includes('format') || error.message.includes('codec')) {
      errorMessage = 'פורמט הסרטון לא נתמך. אנא השתמש בפורמט MP4, AVI, MOV או WebM.';
      statusCode = 400;
    }
    
    res.status(statusCode).json({ 
      success: false, 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
};
