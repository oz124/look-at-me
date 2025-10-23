// Advanced AI Analysis API - Full functionality from example
// This endpoint provides comprehensive video analysis with platform recommendations
// and campaign creation capabilities

const OpenAI = require('openai');
const formidable = require('formidable').formidable;
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const { ValidationService, SecurityLogger } = require('../../src/lib/security');

// Set FFmpeg path
ffmpeg.setFfmpegPath(ffmpegInstaller.path);


// Initialize OpenAI with server-side API key
const openaiApiKey = process.env.OPENAI_API_KEY;
const openai = new OpenAI({
  apiKey: openaiApiKey
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  console.log("📥 Received POST request to /api/ai/advanced-analyze");

  const form = formidable({
    maxFileSize: 4 * 1024 * 1024 * 1024, // 4GB - Facebook's limit (largest platform)
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
    const budget = fields.budget ? ValidationService.sanitizeInput(fields.budget[0]) : '';
    const businessDescription = fields.businessDescription ? ValidationService.sanitizeInput(fields.businessDescription[0]) : '';
    const campaignGoal = fields.campaignGoal ? ValidationService.sanitizeInput(fields.campaignGoal[0]) : '';

    // Validate input fields
    if (businessDescription && businessDescription.length > 1000) {
      return res.status(400).json({ 
        success: false, 
        error: 'Business description too long (max 1000 characters)' 
      });
    }
    
    if (campaignGoal && campaignGoal.length > 500) {
      return res.status(400).json({ 
        success: false, 
        error: 'Campaign goal too long (max 500 characters)' 
      });
    }
    
    if (budget && (isNaN(budget) || budget < 0 || budget > 100000)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid budget amount (must be between 0 and 100,000)' 
      });
    }

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

    // Check if file needs compression for OpenAI Whisper (25MB)
    const maxFileSize = 25 * 1024 * 1024; // 25MB
    let finalVideoFile = videoFile;
    
    if (videoFile.size > maxFileSize) {
      console.log("🎬 File is large, compressing for AI analysis...");
      
      try {
        // Compress the video for AI analysis
        const compressionResult = await compressVideoForAI(videoFile);
        finalVideoFile = compressionResult.compressedFile;
        
        console.log(`✅ Video compressed: ${(videoFile.size / (1024 * 1024)).toFixed(1)}MB → ${(finalVideoFile.size / (1024 * 1024)).toFixed(1)}MB`);
      } catch (compressionError) {
        console.error("❌ Video compression failed:", compressionError);
        return res.status(400).json({ 
          success: false, 
          error: `לא ניתן לדחוס את הסרטון לניתוח AI. נסה עם סרטון קצר יותר או פנה לתמיכה.` 
        });
      }
    }

    // Check if OpenAI API key is properly configured
    if (!openaiApiKey || openaiApiKey === 'sk-your-openai-key-here') {
      console.error("❌ OpenAI API key not configured!");
      return res.status(500).json({ 
        success: false, 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable with a valid API key.' 
      });
    }

    // Verify file exists and is readable
    if (!fs.existsSync(videoFile.filepath)) {
      console.error("❌ Video file does not exist:", videoFile.filepath);
      return res.status(400).json({ success: false, error: 'Video file not found on server' });
    }

    console.log("🎬 Starting comprehensive video analysis...");

    // Step 1: Transcribe the video using Whisper
    console.log("🎤 Transcribing video with Whisper...");
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(finalVideoFile.filepath),
      model: "whisper-1",
      language: 'he', // Hebrew
      response_format: 'json',
      temperature: 0.0,
      prompt: "זהו סרטון שיווקי בעברית. התמלול צריך להיות מדויק וברור."
    });

    console.log("✅ Transcription completed:", transcription.text.length, "characters");

    // Step 2: Enhanced Visual Analysis
    console.log("🎬 Starting enhanced visual analysis...");
    const visualAnalysis = await analyzeFullVideoFast(finalVideoFile, transcription.text);

    // Step 3: Enhanced Audio Analysis
    console.log("🎧 Starting enhanced audio analysis...");
    const audioAnalysis = await enhancedAudioAnalysis(finalVideoFile, transcription.text);

    // Step 4: Master Marketing Strategy
    console.log("🎯 Creating master marketing strategy...");
    const masterStrategy = await getMasterMarketingStrategy(
      visualAnalysis,
      audioAnalysis,
      budget,
      businessDescription,
      campaignGoal
    );

    // Step 5: Generate Custom Post Description
    console.log("📝 Generating custom post description...");
    const customPostDescription = await generateCustomPostDescription(
      visualAnalysis,
      audioAnalysis,
      businessDescription,
      campaignGoal
    );

    // Step 6: Generate Analysis Summary
    console.log("📊 Generating analysis summary...");
    const analysisSummary = await generateAnalysisSummary(
      visualAnalysis,
      audioAnalysis,
      businessDescription,
      campaignGoal
    );

    // Clean up the temporary file
    try {
      if (fs.existsSync(videoFile.filepath)) {
        fs.unlink(videoFile.filepath, (err) => {
          if (err) console.error("Error deleting temp file:", err);
        });
      }
    } catch (cleanupError) {
      console.error("Error during cleanup:", cleanupError);
    }

    const structuredAnalysis = {
      visual_analysis: visualAnalysis,
      audio_analysis: audioAnalysis,
      master_strategy: masterStrategy,
      custom_post_description: customPostDescription,
      analysis_summary: analysisSummary,
      transcription: transcription.text
    };

    console.log("✅ Comprehensive analysis completed successfully!");

    res.status(200).json({
      success: true,
      message: 'Advanced AI analysis completed successfully',
      analysis: structuredAnalysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in advanced AI analysis API:', error);
    
    // Clean up temporary file if it exists
    if (videoFile && videoFile.filepath) {
      try {
        if (fs.existsSync(videoFile.filepath)) {
          fs.unlink(videoFile.filepath, (err) => {
            if (err) console.error("Error deleting temp file:", err);
          });
        }
      } catch (cleanupError) {
        console.error("Error during cleanup:", cleanupError);
      }
    }
    
    // Provide specific error messages
    let errorMessage = 'Internal Server Error';
    let statusCode = 500;
    
    if (error.message.includes('timeout')) {
      errorMessage = 'ניתוח הסרטון ארך יותר מדי זמן - נסה עם סרטון קצר יותר';
      statusCode = 408;
    } else if (error.message.includes('API key') || error.message.includes('authentication')) {
      errorMessage = 'מפתח OpenAI API לא מוגדר או לא תקין - אנא בדוק את ההגדרות';
      statusCode = 401;
    } else if (error.message.includes('quota') || error.message.includes('billing')) {
      errorMessage = 'חשבון OpenAI לא פעיל או ללא אשראי - אנא בדוק את החשבון';
      statusCode = 402;
    } else if (error.message.includes('file') || error.message.includes('format')) {
      errorMessage = 'שגיאה בעיבוד קובץ הסרטון - אנא בדוק שהקובץ תקין';
      statusCode = 400;
    } else if (error.message.includes('rate limit')) {
      errorMessage = 'יותר מדי בקשות - אנא המתן רגע ונסה שוב';
      statusCode = 429;
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(statusCode).json({ 
      success: false, 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
};

// Enhanced Visual Analysis Function
async function analyzeFullVideoFast(videoFile, transcription) {
  try {
    console.log("🎥 Analyzing full video quickly...");
    
    const prompt = `
נתח את הסרטון הזה במהירות ובאיכות:

**מידע על הקובץ:** ${videoFile.originalFilename}, גודל: ${videoFile.size} bytes, סוג: ${videoFile.mimetype}
**תמלול הסרטון:** ${transcription}

**סגנון ויזואלי**: איך נראה הסרטון? (צבעים, אור, קומפוזיציה)
**תנועה וקצב**: איך הסרטון זז? (מהיר, איטי, חלק, קטוע)
**תוכן ויזואלי**: מה רואים בסרטון? (אנשים, מוצרים, טקסט, אנימציה)
**איכות הפקה**: איך נראית איכות ההפקה? (מקצועית, ביתית, גבוהה, נמוכה)
**סגנון מותג**: איזה סגנון מותג הסרטון מייצג? (מודרני, קלאסי, צעיר, מקצועי)
**קהל יעד ויזואלי**: למי הסרטון נראה מתאים? (גילאים, מגדר, תחומי עניין)

השב בפורמט JSON מובנה בעברית:
{
  "סגנון_ויזואלי": "תיאור קצר ומדויק",
  "תנועה_וקצב": "תיאור קצר ומדויק", 
  "תוכן_ויזואלי": "תיאור קצר ומדויק",
  "איכות_הפקה": "תיאור קצר ומדויק",
  "סגנון_מותג": "תיאור קצר ומדויק",
  "קהל_יעד_ויזואלי": "תיאור קצר ומדויק",
  "המלצות_פלטפורמות": ["רשימת המלצות קצרה"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "אתה מומחה לניתוח תוכן ויזואלי. תמיד תחזיר JSON תקין ומובנה בעברית."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    const content = response.choices[0].message.content;
    const cleanedContent = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    try {
      return JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Error parsing visual analysis JSON:", parseError);
      return {
        סגנון_ויזואלי: "ניתוח ויזואלי",
        תנועה_וקצב: "ניתוח תנועה",
        תוכן_ויזואלי: "ניתוח תוכן",
        איכות_הפקה: "ניתוח איכות",
        סגנון_מותג: "ניתוח מותג",
        קהל_יעד_ויזואלי: "ניתוח קהל",
        המלצות_פלטפורמות: ["המלצות כלליות"]
      };
    }
  } catch (error) {
    console.error("Error in visual analysis:", error);
    return {
      סגנון_ויזואלי: "שגיאה בניתוח",
      תנועה_וקצב: "שגיאה בניתוח",
      תוכן_ויזואלי: "שגיאה בניתוח",
      איכות_הפקה: "שגיאה בניתוח",
      סגנון_מותג: "שגיאה בניתוח",
      קהל_יעד_ויזואלי: "שגיאה בניתוח",
      המלצות_פלטפורמות: []
    };
  }
}

// Enhanced Audio Analysis Function
async function enhancedAudioAnalysis(videoFile, transcription) {
  try {
    console.log("🎧 Analyzing audio content...");
    
    const prompt = `
נתח את התוכן האודיו של הסרטון:

**תמלול הסרטון:** ${transcription}
**מידע על הקובץ:** ${videoFile.originalFilename}, גודל: ${videoFile.size} bytes

**ניתוח תוכן טקסטואלי**:
- מה המסר העיקרי?
- איזה טון משתמש הסרטון?
- איזה רגשות מעורר?
- איזה קריאה לפעולה יש?

**המלצות אודיו**:
- איך לשפר את התוכן?
- איזה פלטפורמות מתאימות לתוכן הזה?
- איזה קהל יעד מתאים?

השב בפורמט JSON מובנה בעברית:
{
  "ניתוח_תוכן": "ניתוח מפורט של התוכן",
  "טון_ורגש": "תיאור הטון והרגשות",
  "מסר_עיקרי": "המסר העיקרי של הסרטון",
  "קריאה_לפעולה": "מה הקריאה לפעולה",
  "המלצות_אודיו": ["המלצות לשיפור"],
  "פלטפורמות_מומלצות": ["פלטפורמות מתאימות"]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "אתה מומחה לניתוח תוכן אודיו וטקסט. תמיד תחזיר JSON תקין ומובנה בעברית."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    const content = response.choices[0].message.content;
    const cleanedContent = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    try {
      return JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Error parsing audio analysis JSON:", parseError);
      return {
        ניתוח_תוכן: "ניתוח תוכן",
        טון_ורגש: "טון ורגש",
        מסר_עיקרי: "מסר עיקרי",
        קריאה_לפעולה: "קריאה לפעולה",
        המלצות_אודיו: ["המלצות כלליות"],
        פלטפורמות_מומלצות: ["פלטפורמות כלליות"]
      };
    }
  } catch (error) {
    console.error("Error in audio analysis:", error);
    return {
      ניתוח_תוכן: "שגיאה בניתוח",
      טון_ורגש: "שגיאה בניתוח",
      מסר_עיקרי: "שגיאה בניתוח",
      קריאה_לפעולה: "שגיאה בניתוח",
      המלצות_אודיו: [],
      פלטפורמות_מומלצות: []
    };
  }
}

// Master Marketing Strategy Function
async function getMasterMarketingStrategy(visualAnalysis, audioAnalysis, budget, businessDescription, campaignGoal) {
  try {
    console.log("🎯 Creating master marketing strategy...");
    
    const prompt = `
אתה יועץ שיווק מומחה עולמי עם ניסיון של 15+ שנים. נתח את הנתונים הבאים ותן אסטרטגיה מתקדמת וחכמה:

📊 ניתוח תוכן:
**ניתוח ויזואלי:** ${JSON.stringify(visualAnalysis, null, 2)}
**ניתוח אודיו:** ${JSON.stringify(audioAnalysis, null, 2)}

📋 פרטי קמפיין:
- תיאור עסק: ${businessDescription}
- מטרת קמפיין: ${campaignGoal}
- תקציב יומי: ${budget} ש"ח

🎯 הוראות חשובות לחלוקת התקציב החכמה:

1. **ניתוח תוכן הסרטון**: 
   - אם הסרטון ויזואלי וצעיר → העדף TikTok ו-Facebook
   - אם הסרטון מקצועי ומפורט → העדף Google ו-Facebook
   - אם הסרטון קצר ומהיר → העדף TikTok
   - אם הסרטון ארוך ומחנך → העדף Google (יוטיוב)

2. **התאמה למטרת הקמפיין**:
   - **מכירות**: Google (45-55%) + Facebook (35-40%) + TikTok (5-20%)
   - **לידים**: Facebook (40-50%) + Google (40-50%) + TikTok (5-15%)
   - **חשיפה**: Google (35-45%) + TikTok (35-45%) + Facebook (15-25%)

3. **ניתוח קהל יעד**:
   - גילאי 18-35: העדף TikTok ו-Facebook
   - גילאי 35+: העדף Facebook ו-Google
   - B2B: העדף Google ו-Facebook
   - B2C: העדף TikTok ו-Facebook

4. **ניתוח סגנון תוכן**:
   - יצירתי/משעשע: העדף TikTok
   - מקצועי/אינפורמטיבי: העדף Google
   - חברתי/קהילתי: העדף Facebook

תבסס על הניתוח המלא, צור אסטרטגיה מתקדמת שכוללת:

1. פלטפורמות מומלצות (עם נימוקים מפורטים בהתבסס על התוכן)
2. חלוקת תקציב מדויקת (תבסס על ניתוח התוכן והמטרה)
3. זמני פרסום מוצעים
4. קהל יעד ספציפי
5. סגנון פרסום מותאם
6. KPIs מומלצים למעקב
7. אופטימיזציות מוצעות

השב בפורמט JSON מובנה ומפורט בעברית.

פורמט נדרש:
{
  "אסטרטגיה_עיקרית": {
    "פלטפורמות_מומלצות": [
      {
        "שם": "שם פלטפורמה",
        "אחוז_תקציב": "50%",
        "נימוק": "מדוע מומלץ בהתבסס על ניתוח התוכן והמטרה",
        "קהל_יעד": "תיאור קהל ספציפי",
        "זמני_פרסום": "מתי לפרסם",
        "סוג_תוכן": "איזה סוג תוכן יעבוד הכי טוב"
      }
    ],
    "קהל_יעד_עיקרי": "תיאור מפורט בהתבסס על ניתוח התוכן",
    "סגנון_פרסום": "איך לפרסם בהתבסס על סגנון הסרטון",
    "KPIs": ["מטריקות למעקב רלוונטיות למטרה"],
    "ניתוח_תוכן": "ניתוח מפורט של איך התוכן משפיע על האסטרטגיה"
  },
  "טקסט_פרסומי_מותאם": "טקסט מותאם לסרטון ולכל פלטפורמה",
  "אופטימיזציות": ["הצעות לשיפור בהתבסס על התוכן"]
}

חשוב: הצע רק את הפלטפורמות הבאות:
- Facebook (כולל אינסטגרם)
- Google (כולל יוטיוב וכל רשתות הפרסום של גוגל)
- TikTok

חלק את התקציב רק בין הפלטפורמות האלה בלבד, בהתבסס על ניתוח חכם של התוכן והמטרה.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "אתה יועץ שיווק מומחה עולמי עם ניסיון של 15+ שנים. תמיד תחזיר JSON תקין ומובנה בעברית."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.2
    });

    const content = response.choices[0].message.content;
    const cleanedContent = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    try {
      return JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Error parsing master strategy JSON:", parseError);
      return {
        אסטרטגיה_עיקרית: {
          פלטפורמות_מומלצות: [
            {
              שם: "Facebook",
              אחוז_תקציב: "50%",
              נימוק: "פלטפורמה מומלצת",
              קהל_יעד: "קהל כללי",
              זמני_פרסום: "כל הזמן",
              סוג_תוכן: "תוכן כללי"
            }
          ],
          קהל_יעד_עיקרי: "קהל כללי",
          סגנון_פרסום: "פרסום כללי",
          KPIs: ["מעקב כללי"],
          ניתוח_תוכן: "ניתוח כללי"
        },
        טקסט_פרסומי_מותאם: "טקסט פרסומי כללי",
        אופטימיזציות: ["אופטימיזציות כלליות"]
      };
    }
  } catch (error) {
    console.error("Error in master strategy:", error);
    return {
      אסטרטגיה_עיקרית: {
        פלטפורמות_מומלצות: [
          {
            שם: "Facebook",
            אחוז_תקציב: "50%",
            נימוק: "שגיאה בניתוח",
            קהל_יעד: "שגיאה בניתוח",
            זמני_פרסום: "שגיאה בניתוח",
            סוג_תוכן: "שגיאה בניתוח"
          }
        ],
        קהל_יעד_עיקרי: "שגיאה בניתוח",
        סגנון_פרסום: "שגיאה בניתוח",
        KPIs: ["שגיאה בניתוח"],
        ניתוח_תוכן: "שגיאה בניתוח"
      },
      טקסט_פרסומי_מותאם: "שגיאה בניתוח",
      אופטימיזציות: ["שגיאה בניתוח"]
    };
  }
}

// Generate Custom Post Description Function
async function generateCustomPostDescription(visualAnalysis, audioAnalysis, businessDescription, campaignGoal) {
  try {
    console.log("📝 Generating custom post description...");
    
    const prompt = `
אתה מומחה שיווק דיגיטלי עם ניסיון של 15+ שנים. צור טקסט פרסומת מקצועי ומשכנע.

חשוב מאוד: התחל ישירות עם הכותרת ללא "### כותרת:" - פשוט כתוב את הכותרת עצמה!

📊 נתוני הסרטון:
ויזואל: ${JSON.stringify(visualAnalysis, null, 2)}
אודיו: ${JSON.stringify(audioAnalysis, null, 2)}

🏢 פרטי העסק:
${businessDescription}

🎯 מטרת הקמפיין:
${campaignGoal}

📝 הוראות לטקסט הפרסומת:
1. התחל עם כותרת מושכת (עד 10 מילים)
2. צור טקסט פרסומת של 150-200 מילים שמשלב:
   - את המסר העיקרי מהסרטון
   - את ערך המוצר/שירות של העסק
   - קריאה לפעולה ברורה ומשכנעת
   - טון שמתאים לקהל היעד
3. הוסף 3-5 האשטגים רלוונטיים
4. השתמש באמוג'ים במידה

חשוב מאוד: החזר רק את הטקסט הפרסומת עצמו ללא שום כותרות או הסברים. אסור לך להוסיף כותרות . אסור לך להוסיף "### כותרת:" או "### טקסט פרסומת:" או "### האשטגים:" או כל כותרת אחרת. פשוט כתוב את הטקסט הפרסומת עצמו, הטקסטאשטגים ברצף טבעי.

השב בטקסט נקי בעברית, מקצועי ומשכנע.

דוגמה לפלט הנכון:
שמרו את הרגעים הכי יקרים לנצח 🌟

הורים יקרים, הרגעים הראשונים של ילדינו הם יקרים מכל – הצעד הראשון, החיוך הראשון, המילה הראשונה. עם שירות העריכה של "המזכרת הראשונה שלהם", תוכלו לשמור את הזיכרונות החשובים האלו בצורה מקצועית ומרגשת.

👶🏻 זכרו את הרגעים הראשונים של ילדיכם לנצח בעזרת Baby Step – שירות עריכה מתמחה במזכרות משפחתיות. אנו מבינים את החשיבות שבשמירת הרגעים הקטנים והיקרים האלה, והופכים אותם לזיכרונות בלתי נשכחים שילוו אתכם ואת ילדיכם לאורך כל החיים.

#מזכרותמשפחתיות #BabyStep #זיכרונותבלתינשכחים #פחהשלכם #תיעודרגעים

🌟 שמרו את הרגעים החשובים באמת - כי הם לא יחזרו לעולם!

שים לב: אין כותרות כמו "### כותרת:" או "### טקסט פרסומת:" - רק הטקסט עצמו!

התחל ישירות עם הכותרת ללא "### כותרת:" - פשוט כתוב את הכותרת עצמה!`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "אתה מומחה שיווק דיגיטלי מוביל עם ניסיון של 15+ שנים. אתה יודע ליצור טקסטי פרסומת משכנעים שמביאים תוצאות. תמיד תחזיר טקסט פרסומת מקצועי, מפורט ומשכנע בעברית שמתחשב בתיאור העסק ומטרת הקמפיין. אסור לך להוסיף כותרות כמו '### הכותרת:' או '### טקסט פרסומת:' או '### האשטגים:' - פשוט כתוב את הטקסט הפרסומת עצמו ללא שום כותרות או הסברים. התחל ישירות עם הכותרת ללא '### כותרת:' - פשוט כתוב את הכותרת עצמה! דוגמה לפלט נכון: 'שמרו את הרגעים הכי יקרים לנצח 🌟\n\nהורים יקרים...\n\n#מזכרותמשפחתיות #BabyStep' - ללא כותרות!"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating custom post description:', error);
    return `🚀 ${businessDescription}

${businessDescription} מציעים לכם פתרון מושלם! 

🎯 מטרת הקמפיין: ${campaignGoal}

✅ למה לבחור בנו?
• שירות מקצועי ואמין
• תוצאות מוכחות
• מחירים תחרותיים

📞 צרו קשר עכשיו לקבלת הצעת מחיר!
#${businessDescription.replace(/\s+/g, '_')} #${campaignGoal} #שיווק #עסקים`;
  }
}

// Generate Analysis Summary Function
async function generateAnalysisSummary(visualAnalysis, audioAnalysis, businessDescription, campaignGoal) {
  try {
    console.log("📊 Generating analysis summary...");
    
    const prompt = `צור סיכום מפורט ומסודר של הניתוח הזה:

📊 ניתוח ויזואלי:
${JSON.stringify(visualAnalysis, null, 2)}

🎧 ניתוח אודיו:
${JSON.stringify(audioAnalysis, null, 2)}

📋 פרטי קמפיין:
- עסק: ${businessDescription}
- מטרה: ${campaignGoal}

צור סיכום מפורט עם הפורמט הבא:

# 📋 סיכום ניתוח הסרטון

## 🎬 ניתוח כללי
[תיאור קצר של הסרטון והתוכן]

## ✅ נקודות חוזק
• [נקודה 1]
• [נקודה 2]
• [נקודה 3]

## 🔧 נקודות לשיפור
• [נקודה 1]
• [נקודה 2]
• [נקודה 3]

## 🎯 המלצות לשיווק
• [המלצה 1]
• [המלצה 2]
• [המלצה 3]

## 📊 פלטפורמות מומלצות
• [פלטפורמה 1] - [אחוז תקציב] - [נימוק]
• [פלטפורמה 2] - [אחוז תקציב] - [נימוק]
• [פלטפורמה 3] - [אחוז תקציב] - [נימוק]

## 🎯 קהל יעד
[תיאור מפורט של קהל היעד]

## 📈 KPIs מומלצים
• [KPI 1]
• [KPI 2]
• [KPI 3]

## 🚀 הצעות לאופטימיזציה
• [הצעה 1]
• [הצעה 2]
• [הצעה 3]`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "אתה מומחה שיווק דיגיטלי. תמיד תחזיר סיכום מפורט ומסודר בעברית."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 1500,
      temperature: 0.3
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error generating analysis summary:', error);
    return `# 📋 סיכום ניתוח הסרטון

## 🎬 ניתוח כללי
ניתוח AI מפורט הושלם עבור ${businessDescription} - ${campaignGoal}

## ✅ נקודות חוזק
• תוכן רלוונטי לקהל היעד
• מסר ברור ומובן
• איכות הפקה טובה

## 🔧 נקודות לשיפור
• שיפור איכות וידיאו
• הוספת כתוביות
• שיפור איכות קול

## 🎯 המלצות לשיווק
• התמקדות בפלטפורמות רלוונטיות
• שימוש בטקטיקות מותאמות
• מעקב אחר ביצועים

## 📊 פלטפורמות מומלצות
• Facebook - 40% - חשיפה רחבה
• Google - 40% - חיפוש אקטיבי
• TikTok - 20% - קהל צעיר

## 🎯 קהל יעד
קהל כללי מעוניין במוצר/שירות

## 📈 KPIs מומלצים
• חשיפה
• מעורבות
• המרות

## 🚀 הצעות לאופטימיזציה
• שיפור תוכן
• אופטימיזציה למובייל
• A/B testing`;
  }
}

// Video compression function for AI analysis
async function compressVideoForAI(videoFile) {
  return new Promise((resolve, reject) => {
    console.log("🎬 Starting video compression for AI analysis...");
    
    const tempDir = require('os').tmpdir();
    const compressedFilename = `compressed_${Date.now()}_${videoFile.originalFilename}`;
    const compressedPath = path.join(tempDir, compressedFilename);

    ffmpeg(videoFile.filepath)
      .outputOptions([
        '-c:v libx264',
        '-crf 28',
        '-preset fast',
        '-c:a aac',
        '-b:a 128k',
        '-movflags +faststart',
        '-maxrate 2M',
        '-bufsize 4M'
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
        
        const stats = fs.statSync(compressedPath);
        const compressedFile = {
          originalFilename: videoFile.originalFilename,
          size: stats.size,
          mimetype: 'video/mp4',
          filepath: compressedPath,
          compressed: true
        };
        
        resolve({
          compressedFile: compressedFile,
          originalSize: videoFile.size,
          compressedSize: stats.size,
          compressionRatio: (videoFile.size / stats.size).toFixed(2)
        });
      })
      .on('error', (err) => {
        console.error('❌ FFmpeg error:', err);
        reject(err);
      })
      .run();
  });
}
