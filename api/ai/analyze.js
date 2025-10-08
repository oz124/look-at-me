// API route for AI content analysis
// This endpoint handles video analysis using OpenAI API

const OpenAI = require('openai');
const formidable = require('formidable').formidable;
const fs = require('fs');
const { ValidationService, SecurityLogger } = require('../../src/lib/security');

// Initialize OpenAI with server-side API key
const openaiApiKey = process.env.OPENAI_API_KEY;
console.log("🔑 OpenAI API Key status:", openaiApiKey ? 'SET' : 'NOT SET');
console.log("🔑 OpenAI API Key (first 20 chars):", openaiApiKey ? openaiApiKey.substring(0, 20) + '...' : 'NOT SET');
console.log("🔑 OpenAI API Key length:", openaiApiKey ? openaiApiKey.length : 0);

const openai = new OpenAI({
  apiKey: openaiApiKey
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }


  console.log("📥 Received POST request to /api/ai/analyze");
  console.log("📋 Headers:", req.headers);
  console.log("📏 Content-Length:", req.headers['content-length']);

  const form = formidable({
    maxFileSize: 100 * 1024 * 1024, // 100MB
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

  let videoFile = null; // Define videoFile at function scope

  try {
    console.log("🔄 Parsing form data...");
    const [fields, files] = await form.parse(req);
    console.log("✅ Form parsed successfully");
    console.log("📁 Fields:", Object.keys(fields));
    console.log("📁 Files:", Object.keys(files));
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
      console.log("📁 Available files:", files);
      return res.status(400).json({ success: false, error: 'No video file provided' });
    }

    console.log("✅ Video file found:", {
      originalFilename: videoFile.originalFilename,
      size: videoFile.size,
      mimetype: videoFile.mimetype,
      filepath: videoFile.filepath
    });

    // Analyze the complete video using GPT-4 Vision with structured analysis functions
    console.log("🎬 מתחיל ניתוח מלא של הסרטון...");
    console.log("📁 קובץ הסרטון:", videoFile.originalFilename);
    console.log("📏 גודל הקובץ:", videoFile.size, "bytes");
    console.log("📂 נתיב זמני:", videoFile.filepath);
    console.log("🎯 סוג קובץ:", videoFile.mimetype);
    
    // Verify file exists and is readable
    if (!fs.existsSync(videoFile.filepath)) {
      console.error("❌ Video file does not exist:", videoFile.filepath);
      return res.status(400).json({ success: false, error: 'Video file not found on server' });
    }

    // Check if OpenAI API key is properly configured
    if (!openaiApiKey || openaiApiKey === 'sk-your-openai-key-here') {
      console.error("❌ OpenAI API key not configured!");
      return res.status(500).json({ 
        success: false, 
        error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable with a valid API key.' 
      });
    }

    console.log("📂 Creating read stream for video file...");
    
    // First, transcribe the video using Whisper
    console.log("🎤 מתחיל תמלול הסרטון...");
    console.log("🔍 משתמש במודל Whisper-1 לתמלול בעברית");
    
    const transcriptionPromise = openai.audio.transcriptions.create({
      file: fs.createReadStream(videoFile.filepath),
      model: "whisper-1",
      language: 'he', // Hebrew
      response_format: 'json',
      temperature: 0.0, // More consistent transcription
      prompt: "זהו סרטון שיווקי בעברית. התמלול צריך להיות מדויק וברור." // Hebrew prompt for better accuracy
    });

    const transcription = await transcriptionPromise;
    console.log("✅ תמלול הושלם בהצלחה");
    console.log("📝 אורך התמלול:", transcription.text.length, "תווים");
    console.log("📄 תחילת התמלול:", transcription.text.substring(0, 150) + "...");

    // Now analyze the transcription and video metadata with detailed analysis
    console.log("🧠 מתחיל ניתוח AI מתקדם...");
    console.log("🔍 משתמש במודל GPT-4o לניתוח מקצועי");
    
    // First, do visual analysis
    console.log("🎬 מתחיל ניתוח ויזואלי...");
    const visualAnalysisPromise = openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "אתה מומחה לניתוח תוכן ויזואלי. תמיד תחזיר JSON תקין ומובנה בעברית."
        },
        {
          role: "user",
          content: `נתח את הסרטון הזה במהירות ובאיכות:

**מידע על הקובץ:** ${videoFile.originalFilename}, גודל: ${videoFile.size} bytes, סוג: ${videoFile.mimetype}
**תמלול הסרטון:** ${transcription.text}

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
}`
        }
      ],
      max_tokens: 1000,
      temperature: 0.3
    });

    // Then, do master marketing strategy
    console.log("🎯 מתחיל ניתוח אסטרטגיה שיווקית...");
    const masterStrategyPromise = openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "אתה יועץ שיווק מומחה עולמי עם ניסיון של 15+ שנים. תמיד תחזיר JSON תקין ומובנה בעברית."
        },
        {
          role: "user",
          content: `אתה יועץ שיווק מומחה עולמי עם ניסיון של 15+ שנים. נתח את הנתונים הבאים ותן אסטרטגיה מתקדמת וחכמה:

📊 ניתוח תוכן:
**תמלול הסרטון:** ${transcription.text}
**מידע על הקובץ:** ${videoFile.originalFilename}, גודל: ${videoFile.size} bytes, סוג: ${videoFile.mimetype}

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

חלק את התקציב רק בין הפלטפורמות האלה בלבד, בהתבסס על ניתוח חכם של התוכן והמטרה.`
        }
      ],
      max_tokens: 2000,
      temperature: 0.2
    });

    // Wait for both analyses to complete
    const [visualAnalysis, masterStrategy] = await Promise.all([visualAnalysisPromise, masterStrategyPromise]);

    console.log("✅ ניתוח AI מפורט הושלם בהצלחה!");
    console.log("📊 ניתוח ויזואלי:", visualAnalysis.choices[0].message.content.length, "תווים");
    console.log("🎯 אסטרטגיה שיווקית:", masterStrategy.choices[0].message.content.length, "תווים");
    console.log("💰 עלות הניתוח: תמלול + ניתוח ויזואלי + אסטרטגיה שיווקית");

    const visualAnalysisResult = visualAnalysis.choices[0].message.content;
    const masterStrategyResult = masterStrategy.choices[0].message.content;

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

    // Parse and structure the response to match the expected format
    let visualAnalysisParsed;
    let masterStrategyParsed;
    
    // Helper function to clean JSON response
    function cleanJsonResponse(response) {
      // Remove markdown code blocks if present
      let cleaned = response.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      // Remove any leading/trailing whitespace
      cleaned = cleaned.trim();
      return cleaned;
    }
    
    try {
      const cleanedVisual = cleanJsonResponse(visualAnalysisResult);
      visualAnalysisParsed = JSON.parse(cleanedVisual);
    } catch (error) {
      console.error("Error parsing visual analysis JSON:", error);
      console.error("Raw response:", visualAnalysisResult);
      visualAnalysisParsed = {
        סגנון_ויזואלי: "ניתוח ויזואלי",
        תנועה_וקצב: "ניתוח תנועה",
        תוכן_ויזואלי: "ניתוח תוכן",
        איכות_הפקה: "ניתוח איכות",
        סגנון_מותג: "ניתוח מותג",
        קהל_יעד_ויזואלי: "ניתוח קהל",
        המלצות_פלטפורמות: ["המלצות כלליות"]
      };
    }
    
    try {
      const cleanedStrategy = cleanJsonResponse(masterStrategyResult);
      masterStrategyParsed = JSON.parse(cleanedStrategy);
    } catch (error) {
      console.error("Error parsing master strategy JSON:", error);
      console.error("Raw response:", masterStrategyResult);
      masterStrategyParsed = {
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

    // Generate detailed analysis summary
    const analysisSummary = await generateAnalysisSummary(transcription.text, visualAnalysisParsed, masterStrategyParsed, businessDescription, campaignGoal);

    // Generate professional post description
    const customPostDescription = await generatePostDescription(
      transcription.text, 
      businessDescription, 
      campaignGoal, 
      budget, 
      visualAnalysisParsed, 
      masterStrategyParsed
    );

    const structuredAnalysis = {
      visual_analysis: {
        video_analysis: visualAnalysisParsed,
        frames_analyzed: 1,
        frame_details: [visualAnalysisParsed],
        video_overview: visualAnalysisParsed.סגנון_ויזואלי || "ניתוח ויזואלי",
        visual_recommendations: visualAnalysisParsed.המלצות_פלטפורמות || []
      },
      audio_analysis: {
        transcription: transcription.text,
        text_analysis: `תמלול: ${transcription.text}`,
        audio_recommendations: ["המלצות אודיו כלליות"]
      },
      master_strategy: masterStrategyParsed,
      custom_post_description: customPostDescription,
      analysis_summary: analysisSummary
    };

    res.status(200).json({
      success: true,
      message: 'AI analysis completed successfully',
      analysis: structuredAnalysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error in AI analysis API:', error);
    console.error('❌ Error stack:', error.stack);
    
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
    
    // Provide more specific error messages
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
    
    console.error(`🚨 Sending error response: ${statusCode} - ${errorMessage}`);
    
    res.status(statusCode).json({ 
      success: false, 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
  }
}

// Helper function to extract sections from analysis
function extractSection(text, sectionName) {
  try {
    // Try multiple patterns to extract sections
    const patterns = [
      new RegExp(`${sectionName}[\\s\\S]*?(?=\\d+\\.|$)`, 'i'),
      new RegExp(`${sectionName}[\\s\\S]*?(?=\\n##|$)`, 'i'),
      new RegExp(`${sectionName}[\\s\\S]*?(?=\\n\\*\\*|$)`, 'i')
    ];
    
    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[0].trim().length > 10) {
        return match[0].trim();
      }
    }
    
    // Fallback: return a portion of the text if no specific section found
    return text.substring(0, 500) + '...';
  } catch (error) {
    console.error('Error extracting section:', error);
    return text.substring(0, 300) + '...';
  }
}

// Helper function to generate detailed analysis summary
async function generateAnalysisSummary(transcription, visualAnalysis, masterStrategy, businessDescription, campaignGoal) {
  try {
    const prompt = `צור סיכום מפורט ומסודר של הניתוח הזה:

📊 ניתוח ויזואלי:
${JSON.stringify(visualAnalysis, null, 2)}

🎧 ניתוח אודיו:
${transcription}

🎯 אסטרטגיה שיווקית:
${JSON.stringify(masterStrategy, null, 2)}

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

// Helper function to generate professional post description
async function generatePostDescription(transcription, businessDescription, campaignGoal, budget, visualAnalysis, masterStrategy) {
  try {
    const prompt = `תבסס על הניתוח המלא של הסרטון:

ויזואל: ${JSON.stringify(visualAnalysis.video_overview || visualAnalysis.סגנון_ויזואלי || "ניתוח ויזואלי")}
אודיו: ${transcription}
עסק: ${businessDescription}
מטרה: ${campaignGoal}

צור תיאור פוסט מותאם אישית (עד 200 מילים) שמשלב:
1. את המסר העיקרי מהסרטון
2. קריאה לפעולה מתאימה למטרה
3. טון שמתאים לניתוח
4. שימוש בהאשטגים רלוונטיים

השב בטקסט נקי בעברית.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "אתה המשווק הכי טוב בעולם. תמיד תחזיר תיאור פוסט מקצועי, מפורט ומשכנע בעברית."
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
    console.error('Error generating professional post description:', error);
    
    // Fallback to basic description
    const shortTranscription = transcription.substring(0, 200);
    const cleanTranscription = shortTranscription.replace(/\n/g, ' ').trim();
    
    // Generate hashtags based on campaign goal
    let hashtags = ['#שיווק', '#עסקים', '#AI', '#ניתוח_וידאו'];
    
    if (campaignGoal.includes('מכירות') || campaignGoal.includes('sales')) {
      hashtags.push('#מכירות', '#מוצרים');
    } else if (campaignGoal.includes('לידים') || campaignGoal.includes('leads')) {
      hashtags.push('#לידים', '#לקוחות');
    } else if (campaignGoal.includes('חשיפה') || campaignGoal.includes('awareness')) {
      hashtags.push('#חשיפה', '#מיתוג');
    }
    
    return `${cleanTranscription}... 

🏢 ${businessDescription}
🎯 מטרת הקמפיין: ${campaignGoal}
💰 תקציב יומי: ${budget} ש"ח

גלו את ההזדמנות הזו! 🚀 ${hashtags.join(' ')}`;
  }
}
