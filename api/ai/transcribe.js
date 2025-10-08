// API route for video transcription using OpenAI Whisper
// This endpoint handles audio transcription from video files

const OpenAI = require('openai');
const formidable = require('formidable').formidable;
const fs = require('fs');
const { ValidationService, SecurityLogger } = require('../../src/lib/security');

// Initialize OpenAI with server-side API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-your-openai-key-here'
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const form = formidable({
    maxFileSize: 25 * 1024 * 1024, // 25MB for audio files
    keepExtensions: true,
    uploadDir: require('os').tmpdir(),
    filter: function ({name, originalFilename, mimetype}) {
      // Security: Only allow audio/video files
      const allowedMimeTypes = [
        'audio/mpeg',
        'audio/mp3',
        'audio/wav',
        'audio/m4a',
        'audio/ogg',
        'video/mp4',
        'video/avi',
        'video/mov',
        'video/wmv',
        'video/flv',
        'video/webm',
        'video/mkv'
      ];
      
      const allowedExtensions = ['mp3', 'wav', 'm4a', 'ogg', 'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
      const fileExtension = originalFilename.split('.').pop().toLowerCase();
      
      if (!allowedMimeTypes.includes(mimetype) || !allowedExtensions.includes(fileExtension)) {
        SecurityLogger.logSecurityEvent('INVALID_AUDIO_FILE_TYPE', {
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

  try {
    const [fields, files] = await form.parse(req);
    const audioFile = files.file ? files.file[0] : null;

    if (!audioFile) {
      return res.status(400).json({ success: false, error: 'No audio file provided' });
    }

    // Read the file from the temporary path
    const audioReadStream = fs.createReadStream(audioFile.filepath);

    const transcription = await openai.audio.transcriptions.create({
      file: audioReadStream,
      model: "whisper-1",
      language: 'he', // Hebrew
      response_format: 'json',
    });

    // Analyze the transcription for marketing insights
    const analysisPrompt = `
    אתה מומחה שיווק דיגיטלי. נתח את התמלול הזה עבור קמפיין שיווקי מקצועי:

    תמלול: ${transcription.text}

    אנא תן ניתוח מפורט ומקצועי הכולל:

    ## ניתוח טקסט:
    - טון וסגנון
    - מסר עיקרי
    - רגשות ומסרים
    - נקודות חוזק

    ## מילות מפתח:
    - מילות מפתח חשובות
    - ביטויים מרכזיים
    - קריאות לפעולה

    ## המלצות לשיפור:
    - שיפורים בטקסט
    - אופטימיזציות
    - התאמות לפלטפורמות

    ## התאמה לפלטפורמות:
    - Facebook/Instagram
    - Google/YouTube
    - TikTok
    - המלצות ספציפיות

    תן תשובה מפורטת ומקצועית בעברית.
    `;

    const analysisResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: analysisPrompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.7
    });

    const textAnalysis = analysisResponse.choices[0].message.content;

    // Clean up the temporary file
    fs.unlink(audioFile.filepath, (err) => {
      if (err) console.error("Error deleting temp file:", err);
    });

    res.status(200).json({
      success: true,
      message: 'Transcription and analysis completed successfully',
      transcription: transcription.text,
      textAnalysis: textAnalysis,
      language: transcription.language || 'he',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in transcription API:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal Server Error' 
    });
  }
}

