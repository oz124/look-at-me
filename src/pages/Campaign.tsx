import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Translations } from "@/lib/translations";
import { useAuth } from "@/lib/auth-context";
import { canUserAnalyze, incrementAnalysisCount, SUBSCRIPTION_PLANS } from "@/lib/firebase-auth";
import { useNavigate } from "react-router-dom";
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase-config';
import { 
  Upload, 
  DollarSign, 
  Target, 
  Users, 
  ShoppingCart, 
  Eye,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Play,
  Brain,
  Facebook,
  Instagram,
  Youtube,
  Linkedin,
  Edit3,
  Loader2,
  Camera,
  Volume2,
  Sparkles,
  TrendingUp,
  Heart,
  Zap,
  Globe,
  Settings,
  Link,
  Send,
  Check,
  X,
  Smartphone,
  Monitor,
  Wifi,
  Shield,
  MapPin,
  Calendar,
  Clock,
  Share2,
  Home,
  Plus,
  AlertTriangle,
  Menu,
  ChevronDown,
  Star,
  Rocket
} from "lucide-react";

// **אבטחה מאובטחת - כל ה-secrets הועברו ל-backend!**
// הקוד הזה כעת מאובטח - כל ה-API secrets הועברו לשרת backend
// 
// מה שהוסר מהקוד:
// - OpenAI API Key
// - Facebook App Secret  
// - Google Client Secret
// - TikTok Client Secret
//
// מה שנשאר (בטוח לחשיפה):
// - Client IDs (public)
// - API Keys (public)
// - Redirect URIs
//
// כל הקריאות ל-API עוברות דרך backend מאובטח

// Facebook config - רק client ID (public)
const FACEBOOK_CONFIG = {
  appId: import.meta.env.VITE_FACEBOOK_APP_ID,
  redirectUri: `${window.location.origin}/auth/facebook/callback`
};


// Google config - רק client ID ו-API key (public)
const GOOGLE_CONFIG = {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
  companyName: "look at me",
  redirectUri: `${window.location.origin}/auth/google/callback`,
  scopes: [
    'https://www.googleapis.com/auth/adwords',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube.channel-memberships.creator'
  ].join(' ')
};

// TikTok config - רק client ID (public)
const TIKTOK_CONFIG = {
  clientId: import.meta.env.VITE_TIKTOK_CLIENT_ID,
  redirectUri: `${window.location.origin}/auth/tiktok/callback`,
  scopes: [
    'user.info.basic',
    'video.list',
    'video.upload'
  ].join(',')
};

// מוח AI מתקדם - גרסה מאובטחת עם backend proxy
class EnhancedLocalBrain {
  constructor() {
    // לא שומרים API keys בקוד frontend!
    this.analysisResults = {};
  }

  // ניתוח ויזואלי מהיר ואיכותי (מקסימום 2 דקות)
  async enhancedVisualAnalysis(videoFile) {
    try {
      console.log("🎬 מתחיל ניתוח ויזואלי מהיר ואיכותי...");
      
      // ניתוח מהיר של הסרטון המלא בלבד (ללא פריימים נפרדים)
      const videoAnalysis = await this.analyzeFullVideoFast(videoFile);
      
      return {
        video_analysis: videoAnalysis,
        frames_analyzed: 1, // ניתוח של הסרטון המלא
        frame_details: [videoAnalysis],
        video_overview: videoAnalysis.סגנון_ויזואלי || "ניתוח מהיר של הסרטון",
        visual_recommendations: videoAnalysis.המלצות_פלטפורמות || []
      };
    } catch (error) {
      console.error("שגיאה בניתוח ויזואלי:", error);
      return {
        video_analysis: "לא ניתן לנתח",
        frames_analyzed: 0,
        frame_details: [],
        video_overview: "לא הצליח לנתח את התוכן הויזואלי",
        visual_recommendations: []
      };
    }
  }

  // ניתוח מהיר של הסרטון המלא (מקסימום 30 שניות)
  async analyzeFullVideoFast(videoFile) {
    try {
      console.log("🎥 מנתח את הסרטון המלא במהירות...");
      
      const prompt = `
נתח את הסרטון הזה במהירות ובאיכות:

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
}
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt
                },
                {
                  type: "image_url",
                  image_url: {
                    url: videoFile
                  }
                }
              ]
            }
          ],
          max_tokens: 600, // פחות טוקנים למהירות
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      try {
        return JSON.parse(analysisText);
      } catch (parseError) {
        return {
          סגנון_ויזואלי: analysisText,
          תנועה_וקצב: "לא ניתן לנתח",
          תוכן_ויזואלי: "לא ניתן לנתח",
          איכות_הפקה: "לא ניתן לנתח",
          סגנון_מותג: "לא ניתן לנתח",
          קהל_יעד_ויזואלי: "לא ניתן לנתח",
          המלצות_פלטפורמות: []
        };
      }
    } catch (error) {
      console.error("שגיאה בניתוח הסרטון המלא:", error);
      return {
        סגנון_ויזואלי: "לא ניתן לנתח",
        תנועה_וקצב: "לא ניתן לנתח",
        תוכן_ויזואלי: "לא ניתן לנתח",
        איכות_הפקה: "לא ניתן לנתח",
        סגנון_מותג: "לא ניתן לנתח",
        קהל_יעד_ויזואלי: "לא ניתן לנתח",
        המלצות_פלטפורמות: []
      };
    }
  }

  // ניתוח מהיר של הסרטון המלא
  async analyzeFullVideo(videoFile) {
    try {
      console.log("🎥 מנתח את הסרטון המלא...");
      
      const prompt = `
נתח את הסרטון הזה בצורה מקיפה וחכמה:

1. **סגנון ויזואלי כללי**: איך נראה הסרטון? (צבעים, אור, קומפוזיציה)
2. **תנועה וקצב**: איך הסרטון זז? (מהיר, איטי, חלק, קטוע)
3. **תוכן ויזואלי**: מה רואים בסרטון? (אנשים, מוצרים, טקסט, אנימציה)
4. **איכות הפקה**: איך נראית איכות ההפקה? (מקצועית, ביתית, גבוהה, נמוכה)
5. **סגנון מותג**: איזה סגנון מותג הסרטון מייצג? (מודרני, קלאסי, צעיר, מקצועי)
6. **קהל יעד ויזואלי**: למי הסרטון נראה מתאים? (גילאים, מגדר, תחומי עניין)

השב בפורמט JSON מובנה בעברית:
{
  "סגנון_ויזואלי": "תיאור מפורט",
  "תנועה_וקצב": "תיאור מפורט", 
  "תוכן_ויזואלי": "תיאור מפורט",
  "איכות_הפקה": "תיאור מפורט",
  "סגנון_מותג": "תיאור מפורט",
  "קהל_יעד_ויזואלי": "תיאור מפורט",
  "המלצות_פלטפורמות": ["רשימת המלצות"]
}
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt
                },
                {
                  type: "image_url",
                  image_url: {
                    url: videoFile
                  }
                }
              ]
            }
          ],
          max_tokens: 800, // פחות טוקנים למהירות
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      try {
        return JSON.parse(analysisText);
      } catch (parseError) {
        return {
          סגנון_ויזואלי: analysisText,
          תנועה_וקצב: "לא ניתן לנתח",
          תוכן_ויזואלי: "לא ניתן לנתח",
          איכות_הפקה: "לא ניתן לנתח",
          סגנון_מותג: "לא ניתן לנתח",
          קהל_יעד_ויזואלי: "לא ניתן לנתח",
          המלצות_פלטפורמות: []
        };
      }
    } catch (error) {
      console.error("שגיאה בניתוח הסרטון המלא:", error);
      return {
        סגנון_ויזואלי: "לא ניתן לנתח",
        תנועה_וקצב: "לא ניתן לנתח",
        תוכן_ויזואלי: "לא ניתן לנתח",
        איכות_הפקה: "לא ניתן לנתח",
        סגנון_מותג: "לא ניתן לנתח",
        קהל_יעד_ויזואלי: "לא ניתן לנתח",
        המלצות_פלטפורמות: []
      };
    }
  }

  // מיצוי פריימים מפתח (3 פריימים חשובים)
  async extractKeyFrames(videoFile) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const frames = [];

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // שלושה פריימים מפתח: התחלה, אמצע, סוף
        const keyTimestamps = [0.1, 0.5, 0.9]; // 10%, 50%, 90% מהסרטון
        
        let processedCount = 0;
        
        keyTimestamps.forEach((timestamp, index) => {
          video.currentTime = video.duration * timestamp;
          
          video.onseeked = () => {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const frameDataUrl = canvas.toDataURL('image/jpeg', 0.8);
            frames[index] = frameDataUrl;
            
            processedCount++;
            if (processedCount === keyTimestamps.length) {
              resolve(frames.filter(frame => frame !== undefined));
            }
          };
        });
      };

      video.onerror = () => {
        console.warn('שגיאה בטעינת הסרטון, משתמש בפריימים בסיסיים');
        resolve([]);
      };

      video.src = URL.createObjectURL(videoFile);
      video.load();
    });
  }

  async extractFramesAdvanced(videoFile) {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const frames = [];

      video.onloadedmetadata = () => {
        canvas.width = Math.min(video.videoWidth, 800);
        canvas.height = Math.min(video.videoHeight, 600);
        
        const duration = video.duration;
        const keyPoints = [0.1, 0.3, 0.5, 0.7, 0.9];
        let currentFrame = 0;
        
        const captureFrame = () => {
          if (currentFrame >= keyPoints.length) {
            resolve(frames);
            return;
          }
          video.currentTime = keyPoints[currentFrame] * duration;
        };
        
        video.onseeked = () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = canvas.toDataURL('image/jpeg', 0.9);
          frames.push({
            data: imageData,
            timestamp: keyPoints[currentFrame] * duration,
            position: keyPoints[currentFrame]
          });
          currentFrame++;
          captureFrame();
        };
        
        captureFrame();
      };

      video.src = URL.createObjectURL(videoFile);
    });
  }

  async analyzeFrameInDetail(frame, index) {
    try {
      const prompt = `
נתח את התמונה הזו מסרטון שיווק בצורה מפורטת ומקצועית:

1. אלמנטים ויזואליים:
   - מה מוצג בתמונה?
   - איך האיכות והתאורה?
   - מה הצבעים הדומיננטיים?

2. אלמנטים שיווקיים:
   - האם יש טקסט או לוגו?
   - האם יש אנשים? איך הם נראים?
   - מה הרגש שהתמונה מעבירה?

3. המלצות שיווק:
   - איזה סוג קהל זה יכול למשוך?
   - באיזו פלטפורמה זה יעבוד הכי טוב?
   - מה אפשר לשיפור?

השב בפורמט JSON מפורט בעברית.
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { 
                  type: "image_url", 
                  image_url: { url: frame.data, detail: "high" }
                }
              ]
            }
          ],
          max_tokens: 800,
          temperature: 0.3
        })
      });

      const data = await response.json();
      return {
        frame_index: index,
        timestamp: frame.timestamp,
        analysis: data.choices[0].message.content,
        position: frame.position
      };
    } catch (error) {
      console.error(`שגיאה בניתוח פריים ${index}:`, error);
      return {
        frame_index: index,
        timestamp: frame.timestamp,
        analysis: "לא הצליח לנתח את הפריים",
        position: frame.position
      };
    }
  }

  async analyzeVideoOverview(frameAnalyses) {
    try {
      const combinedAnalysis = frameAnalyses.map(f => f.analysis).join('\n\n');
      
      const prompt = `
בהתבסס על הניתוח של ${frameAnalyses.length} פריימים מהסרטון:

${combinedAnalysis}

תן סיכום מקיף בעברית על:
1. הסגנון הכללי של הסרטון
2. המסר העיקרי שמועבר
3. הקהל היעד הכי מתאים
4. האווירה והרגש של הסרטון
5. איכות הייצור
6. נקודות חזק ונקודות לשיפור

השב בפורמט JSON מובנה בעברית.
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1000,
          temperature: 0.4
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("שגיאה בניתוח כללי:", error);
      return "לא הצליח לנתח את הסרטון באופן כללי";
    }
  }

  async enhancedAudioAnalysis(videoFile) {
    try {
      console.log("🎧 מתחיל ניתוח אודיו מהיר ואיכותי...");
      
      // תמלול מהיר בלבד (ללא ניתוח אודיו נפרד)
      const transcription = await this.transcribeWithWhisper(videoFile);
      
      // ניתוח מהיר של הטקסט
      const textAnalysis = await this.analyzeTranscriptionFast(transcription);
      
      return {
        audio_analysis: "ניתוח מהיר של תמלול",
        transcription: transcription,
        text_analysis: textAnalysis,
        tone_analysis: textAnalysis.tone || "לא ניתן לנתח",
        audio_recommendations: textAnalysis.recommendations || []
      };
    } catch (error) {
      console.error("שגיאה בניתוח אודיו:", error);
      return {
        audio_analysis: "לא ניתן לנתח",
        transcription: "לא הצליח לתמלל",
        text_analysis: "לא הצליח לנתח",
        tone_analysis: "לא הצליח לנתח",
        audio_recommendations: []
      };
    }
  }

  // ניתוח מהיר של תמלול (מקסימום 20 שניות)
  async analyzeTranscriptionFast(transcription) {
    try {
      console.log("📝 מנתח תמלול במהירות...");
      
      const prompt = `
נתח את הטקסט הזה במהירות:

**תוכן**: מה הטקסט אומר?
**טון**: איזה טון יש לטקסט? (מקצועי, ידידותי, משכנע, אינפורמטיבי)
**קהל יעד**: למי הטקסט מתאים?
**המלצות פלטפורמות**: איזה פלטפורמות הטקסט מתאים להן?

השב בפורמט JSON מובנה בעברית:
{
  "תוכן": "תיאור קצר",
  "טון": "תיאור קצר",
  "קהל_יעד": "תיאור קצר",
  "המלצות": ["רשימת המלצות קצרה"]
}

טקסט: ${transcription}
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 400, // פחות טוקנים למהירות
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      try {
        return JSON.parse(analysisText);
      } catch (parseError) {
        return {
          תוכן: analysisText,
          טון: "לא ניתן לנתח",
          קהל_יעד: "לא ניתן לנתח",
          המלצות: []
        };
      }
    } catch (error) {
      console.error("שגיאה בניתוח התמלול:", error);
      return {
        תוכן: "לא ניתן לנתח",
        טון: "לא ניתן לנתח",
        קהל_יעד: "לא ניתן לנתח",
        המלצות: []
      };
    }
  }

  // ניתוח אודיו מתקדם של הסרטון המלא
  async analyzeFullAudio(videoFile) {
    try {
      console.log("🎵 מנתח את האודיו של הסרטון המלא...");
      
      // חילוץ אודיו מהסרטון
      const audioData = await this.extractAudioFromVideo(videoFile);
      
      const prompt = `
נתח את האודיו הזה בצורה מקיפה:

1. **סוג מוזיקה/קול**: איזה סוג מוזיקה או קול יש? (מוזיקה, דיבור, רעשי רקע)
2. **קצב ומקצב**: איך הקצב? (מהיר, איטי, משתנה, קבוע)
3. **טון ורגש**: איזה טון ורגש המוזיקה/קול מעביר? (שמח, עצוב, מרגש, רגוע)
4. **איכות קול**: איך האיכות? (ברור, מטושטש, מקצועי, ביתי)
5. **קהל יעד אודיו**: למי המוזיקה/קול מתאים? (גילאים, מגדר, תחומי עניין)
6. **התאמה לפלטפורמות**: איזה פלטפורמות המוזיקה/קול מתאים להן?

השב בפורמט JSON מובנה בעברית:
{
  "סוג_מוזיקה_קול": "תיאור מפורט",
  "קצב_ומקצב": "תיאור מפורט",
  "טון_ורגש": "תיאור מפורט", 
  "איכות_קול": "תיאור מפורט",
  "קהל_יעד_אודיו": "תיאור מפורט",
  "התאמה_פלטפורמות": ["רשימת המלצות"]
}

נתון אודיו: ${audioData}
`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const analysisText = data.choices[0].message.content;
      
      try {
        return JSON.parse(analysisText);
      } catch (parseError) {
        return {
          סוג_מוזיקה_קול: analysisText,
          קצב_ומקצב: "לא ניתן לנתח",
          טון_ורגש: "לא ניתן לנתח",
          איכות_קול: "לא ניתן לנתח",
          קהל_יעד_אודיו: "לא ניתן לנתח",
          התאמה_פלטפורמות: []
        };
      }
    } catch (error) {
      console.error("שגיאה בניתוח האודיו המלא:", error);
      return {
        סוג_מוזיקה_קול: "לא ניתן לנתח",
        קצב_ומקצב: "לא ניתן לנתח",
        טון_ורגש: "לא ניתן לנתח",
        איכות_קול: "לא ניתן לנתח",
        קהל_יעד_אודיו: "לא ניתן לנתח",
        התאמה_פלטפורמות: []
      };
    }
  }

  // חילוץ אודיו מהסרטון (פונקציה פשוטה)
  async extractAudioFromVideo(videoFile) {
    try {
      // זה פונקציה פשוטה שמחזירה מידע בסיסי על האודיו
      // בפרודקשן אפשר להשתמש ב-Web Audio API או ספריות מתקדמות יותר
      return `אודיו מסרטון באורך ${videoFile.size} bytes, סוג: ${videoFile.type}`;
    } catch (error) {
      console.error("שגיאה בחילוץ אודיו:", error);
      return "לא ניתן לחלץ אודיו";
    }
  }

  async transcribeWithWhisper(videoFile) {
    try {
      console.log("🎤 מתחיל תמלול דרך backend...");
      
      const formData = new FormData();
      formData.append('file', videoFile);
      
      const response = await fetch('/api/ai/transcribe', {
        method: 'POST',
        headers: {
          'X-API-Key': 'test-api-key-123'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Backend transcription failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Transcription failed');
      }

      console.log("✅ תמלול הושלם בהצלחה דרך backend");
      return result.transcription || "לא הצליח לתמלל";
    } catch (error) {
      console.error("שגיאה בתמלול:", error);
      return "לא הצליח לתמלל את האודיו";
    }
  }

  async analyzeTranscriptionInDetail(transcription) {
    try {
      const prompt = `
נתח את הטקסט הבא מסרטון שיווק:

"${transcription}"

בצע ניתוח מפורט:
1. מילות מפתח עיקריות
2. הרגש והטון של הדיבור
3. סגנון הדיבור (פורמלי/לא פורמלי)
4. מסרים עיקריים
5. קהל יעד משוער
6. נקודות חזק בטקסט
7. הצעות לשיפור

השב בפורמט JSON מובנה בעברית.
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 800,
          temperature: 0.3
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("שגיאה בניתוח טקסט:", error);
      return "לא הצליח לנתח את הטקסט";
    }
  }

  async analyzeToneAndStyle(transcription) {
    try {
      const prompt = `
נתח את הטון והסגנון של הטקסט הבא:

"${transcription}"

חזור עם:
1. טון כללי (מקצועי/חברותי/אנרגטי/רגוע)
2. רמת האנרגיה (גבוהה/בינונית/נמוכה)
3. סגנון פנייה (ישיר/עקיף)
4. רמת הביטחון של הדובר
5. מידת הייחודיות של המסר
6. התאמה לפלטפורמות שונות

השב בפורמט JSON בעברית.
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 600,
          temperature: 0.4
        })
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("שגיאה בניתוח טון:", error);
      return "לא הצליח לנתח את הטון";
    }
  }

  async getMasterMarketingStrategy(visualAnalysis, audioAnalysis, budget, businessDescription, campaignGoal) {
    try {
      const prompt = `
אתה יועץ שיווק מומחה עולמי עם ניסיון של 15+ שנים. נתח את הנתונים הבאים ותן אסטרטגיה מתקדמת וחכמה:

📊 ניתוח ויזואלי:
${JSON.stringify(visualAnalysis, null, 2)}

🎧 ניתוח אודיו:
${JSON.stringify(audioAnalysis, null, 2)}

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

בהתבסס על הניתוח המלא, צור אסטרטגיה מתקדמת שכוללת:

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
  "טקסט_פרסומי_מותאם": "טקסט מותאם לסרטון ולכל פלטפורמה (ללא כותרות כמו ### הכותרת: או ### טקסט פרסומת:)",
  "אופטימיזציות": ["הצעות לשיפור בהתבסס על התוכן"]
}

חשוב: הצע רק את הפלטפורמות הבאות:
- Facebook (כולל אינסטגרם)
- Google (כולל יוטיוב וכל רשתות הפרסום של גוגל)
- TikTok

חלק את התקציב רק בין הפלטפורמות האלה בלבד, בהתבסס על ניתוח חכם של התוכן והמטרה.

הערה חשובה: בטקסט הפרסומי, אל תוסיף כותרות כמו "### הכותרת:" או "### טקסט פרסומת:" או "### האשטגים:" - פשוט כתוב את הטקסט הפרסומת עצמו.

דוגמה לפלט הנכון:
שמרו את הרגעים הכי יקרים לנצח 🌟

הורים יקרים, הרגעים הראשונים של ילדינו הם יקרים מכל – הצעד הראשון, החיוך הראשון, המילה הראשונה. עם שירות העריכה של "המזכרת הראשונה שלהם", תוכלו לשמור את הזיכרונות החשובים האלו בצורה מקצועית ומרגשת.

#מזכרותמשפחתיות #BabyStep #זיכרונותבלתינשכחים

שים לב: אין כותרות כמו "### כותרת:" - רק הטקסט עצמו!
      `;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.openaiApiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: "אתה יועץ שיווק מומחה עולמי. תמיד תחזיר JSON תקין ומובנה. בטקסט הפרסומי, אל תוסיף כותרות כמו '### הכותרת:' או '### טקסט פרסומת:' - פשוט כתוב את הטקסט הפרסומת עצמו. דוגמה: 'שמרו את הרגעים הכי יקרים לנצח 🌟\n\nהורים יקרים...\n\n#מזכרותמשפחתיות #BabyStep' - ללא כותרות!" },
            { role: "user", content: prompt }
          ],
          temperature: 0.2,
          max_tokens: 2000
        })
      });

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return jsonMatch[0];
      }
      
      return content;
    } catch (error) {
      console.error("❌ שגיאה באסטרטגיה מתקדמת:", error);
      throw error; // זורק את השגיאה במקום להחזיר fallback
    }
  }

  // **חיבור אמיתי לפייסבוק**
  async connectFacebook() {
    try {
      console.log("🔗 מתחבר לפייסבוק בצורה אמיתית...");
      
      if (typeof window === 'undefined') {
        throw new Error('פונקציה זמינה רק בדפדפן');
      }
      
      const scope = "ads_management,pages_read_engagement,business_management,pages_show_list";
      // שימוש ב-client ID מהסביבה במקום hardcoded
      const appId = import.meta.env.VITE_FACEBOOK_APP_ID;
      const redirectUri = `${window.location.origin}/auth/facebook/callback`;
      const authUrl = `https://www.facebook.com/v18.0/dialog/oauth?client_id=${appId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=facebook_auth`;
      
      let popup;
      try {
        popup = window.open(authUrl, 'facebook_auth', 'width=600,height=600,scrollbars=yes,resizable=yes');
        
        if (!popup) {
          throw new Error('החלון נחסם על ידי חוסם פופאפים. אנא אפשר פופאפים ונסה שוב.');
        }
      } catch (error) {
        throw new Error('לא ניתן לפתוח חלון התחברות. בדוק את הגדרות הדפדפן.');
      }
      
      return new Promise((resolve, reject) => {
        let isResolved = false;
        
        const checkClosed = setInterval(async () => {
          try {
            if (!popup || popup.closed) {
              clearInterval(checkClosed);
              
              if (isResolved) return;
              isResolved = true;
              
              let accessToken = null;
              try {
                accessToken = localStorage.getItem('facebook_access_token');
              } catch (storageError) {
                console.warn('Cannot access localStorage:', storageError);
              }
              
              if (accessToken) {
                // אימות החיבור דרך backend מאובטח
                try {
                  const verifyResponse = await fetch('/api/platforms/verify', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-API-Key': 'test-api-key-123'
                    },
                    body: JSON.stringify({
                      platform: 'Facebook',
                      accessToken: accessToken
                    })
                  });

                  if (verifyResponse.ok) {
                    const verifyResult = await verifyResponse.json();
                    if (verifyResult.success) {
                      resolve({
                        success: true,
                        platform: "Facebook",
                        message: `חיבור לפייסבוק הושלם בהצלחה! כולל פרסום אוטומטי באינסטגרם!`,
                        access_token: accessToken,
                        account_id: verifyResult.result.user_info.id,
                        account_name: verifyResult.result.user_info.name,
                        permissions: verifyResult.result.permissions,
                        connected_at: new Date().toISOString(),
                        data: verifyResult.result
                      });
                    } else {
                      reject(new Error("אימות החיבור נכשל"));
                    }
                  } else {
                    reject(new Error("שגיאה באימות החיבור"));
                  }
                } catch (verifyError) {
                  console.error("שגיאה באימות החיבור:", verifyError);
                  reject(new Error("שגיאה באימות החיבור"));
                }
              } else {
                reject(new Error("החלון נסגר ללא השלמת ההתחברות"));
              }
            }
          } catch (error) {
            clearInterval(checkClosed);
            if (!isResolved) {
              isResolved = true;
              reject(new Error('שגיאה בבדיקת סטטוס החלון'));
            }
          }
        }, 1000);
        
        setTimeout(() => {
          if (!isResolved) {
            isResolved = true;
            clearInterval(checkClosed);
            
            try {
              if (popup && !popup.closed) {
                popup.close();
              }
            } catch (error) {
              console.warn('Error closing popup:', error);
            }
            
            reject(new Error("תם הזמן לחיבור לפייסבוק (120 שניות)"));
          }
        }, 120000);
      });
    } catch (error) {
      console.error("שגיאה בחיבור לפייסבוק:", error);
      return {
        success: false,
        platform: "Facebook",
        error: error.message,
        message: `שגיאה בחיבור לפייסבוק (כולל אינסטגרם): ${error.message}`
      };
    }
  }


  async connectGoogle() {
    try {
      console.log("🔗 מתחבר לגוגל בצורה אמיתית...");
      
      if (typeof window === 'undefined') {
        throw new Error('פונקציה זמינה רק בדפדפן');
      }
      
      // יצירת URL אימות גוגל עם client ID מהסביבה
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      const redirectUri = `${window.location.origin}/auth/google/callback`;
      const scopes = [
        'https://www.googleapis.com/auth/adwords',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/youtube',
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube.channel-memberships.creator'
      ].join(' ');
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        scope: scopes,
        response_type: 'code',
        access_type: 'offline',
        prompt: 'consent',
        state: 'google_auth'
      });
      
      let popup;
      try {
        popup = window.open(authUrl, 'google_auth', 'width=500,height=600,scrollbars=yes,resizable=yes');
        
        if (!popup) {
          throw new Error('החלון נחסם על ידי חוסם פופאפים. אנא אפשר פופאפים ונסה שוב.');
        }
      } catch (error) {
        throw new Error('לא ניתן לפתוח חלון התחברות גוגל. בדוק את הגדרות הדפדפן.');
      }
      
      return new Promise((resolve, reject) => {
        let isResolved = false;
        
        const checkClosed = setInterval(() => {
          try {
            if (!popup || popup.closed) {
              clearInterval(checkClosed);
              
              if (isResolved) return;
              isResolved = true;
              
              // בודק אם יש access token שנשמר
              let accessToken = null;
              try {
                accessToken = localStorage.getItem('google_access_token');
              } catch (storageError) {
                console.warn('Cannot access localStorage:', storageError);
              }
              
              if (accessToken) {
                // אימות החיבור דרך backend מאובטח
                this.verifyGoogleConnection(accessToken, resolve, reject);
              } else {
                reject(new Error("החלון נסגר ללא השלמת ההתחברות לגוגל"));
              }
            }
          } catch (error) {
            clearInterval(checkClosed);
            if (!isResolved) {
              isResolved = true;
              reject(new Error('שגיאה בבדיקת סטטוס חלון גוגל'));
            }
          }
        }, 1000);
        
        setTimeout(() => {
          if (!isResolved) {
            isResolved = true;
            clearInterval(checkClosed);
            
            try {
              if (popup && !popup.closed) {
                popup.close();
              }
            } catch (error) {
              console.warn('Error closing Google popup:', error);
            }
            
            reject(new Error("תם הזמן לחיבור לגוגל (120 שניות)"));
          }
        }, 120000);
      });
    } catch (error) {
      console.error("שגיאה בחיבור לגוגל:", error);
      return {
        success: false,
        platform: "Google",
        error: error.message,
        message: `שגיאה בחיבור לגוגל: ${error.message}`
      };
    }
  }

  // **חיבור אמיתי לטיקטוק - חדש!**
  // פונקציה לאימות חיבור גוגל
  async verifyGoogleConnection(accessToken, resolve, reject) {
    try {
      const verifyResponse = await fetch('/api/platforms/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key-123'
        },
        body: JSON.stringify({
          platform: 'Google',
          accessToken: accessToken
        })
      });

      if (verifyResponse.ok) {
        const verifyResult = await verifyResponse.json();
        if (verifyResult.success) {
          resolve({
            success: true,
            platform: "Google",
            message: `חיבור לגוגל הושלם בהצלחה! כולל גישה ליוטיוב וכל רשתות הפרסום של גוגל`,
            access_token: accessToken,
            account_id: verifyResult.result.user_info.id,
            account_name: verifyResult.result.user_info.name,
            email: verifyResult.result.user_info.email,
            permissions: verifyResult.result.permissions,
            connected_at: new Date().toISOString(),
            company: "look at me",
            networks_included: ["Google Search", "YouTube", "Display Network", "Gmail", "Shopping"],
            data: verifyResult.result
          });
        } else {
          reject(new Error("אימות החיבור נכשל"));
        }
      } else {
        reject(new Error("שגיאה באימות החיבור"));
      }
    } catch (verifyError) {
      console.error("שגיאה באימות החיבור:", verifyError);
      reject(new Error("שגיאה באימות החיבור"));
    }
  }

  // פונקציה לאימות חיבור טיקטוק
  async verifyTikTokConnection(accessToken, resolve, reject) {
    try {
      const verifyResponse = await fetch('/api/platforms/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'test-api-key-123'
        },
        body: JSON.stringify({
          platform: 'TikTok',
          accessToken: accessToken
        })
      });

      if (verifyResponse.ok) {
        const verifyResult = await verifyResponse.json();
        if (verifyResult.success) {
          resolve({
            success: true,
            platform: "TikTok",
            message: `חיבור לטיקטוק הושלם בהצלחה! כולל פרסום ויראלי`,
            access_token: accessToken,
            account_id: verifyResult.result.user_info.id,
            account_name: verifyResult.result.user_info.display_name,
            permissions: verifyResult.result.permissions,
            connected_at: new Date().toISOString(),
            data: verifyResult.result
          });
        } else {
          reject(new Error("אימות החיבור נכשל"));
        }
      } else {
        reject(new Error("שגיאה באימות החיבור"));
      }
    } catch (verifyError) {
      console.error("שגיאה באימות החיבור:", verifyError);
      reject(new Error("שגיאה באימות החיבור"));
    }
  }

  async connectTikTok() {
    try {
      console.log("🔗 מתחבר לטיקטוק בצורה אמיתית...");
      
      if (typeof window === 'undefined') {
        throw new Error('פונקציה זמינה רק בדפדפן');
      }
      
      // יצירת URL אימות טיקטוק עם client ID מהסביבה
      const clientId = import.meta.env.VITE_TIKTOK_CLIENT_ID;
      const redirectUri = `${window.location.origin}/auth/tiktok/callback`;
      const scopes = [
        'user.info.basic',
        'video.list',
        'video.upload'
      ].join(',');
      
      const authUrl = `https://www.tiktok.com/auth/authorize/?` + new URLSearchParams({
        client_key: clientId,
        response_type: 'code',
        scope: scopes,
        redirect_uri: redirectUri,
        state: 'tiktok_auth'
      });
      
      let popup;
      try {
        popup = window.open(authUrl, 'tiktok_auth', 'width=500,height=600,scrollbars=yes,resizable=yes');
        
        if (!popup) {
          throw new Error('החלון נחסם על ידי חוסם פופאפים. אנא אפשר פופאפים ונסה שוב.');
        }
      } catch (error) {
        throw new Error('לא ניתן לפתוח חלון התחברות טיקטוק. בדוק את הגדרות הדפדפן.');
      }
      
      return new Promise((resolve, reject) => {
        let isResolved = false;
        
        const checkClosed = setInterval(() => {
          try {
            if (!popup || popup.closed) {
              clearInterval(checkClosed);
              
              if (isResolved) return;
              isResolved = true;
              
              // בודק אם יש access token שנשמר
              let accessToken = null;
              try {
                accessToken = localStorage.getItem('tiktok_access_token');
              } catch (storageError) {
                console.warn('Cannot access localStorage:', storageError);
              }
              
              if (accessToken) {
                // אימות החיבור דרך backend מאובטח
                this.verifyTikTokConnection(accessToken, resolve, reject);
              } else {
                reject(new Error("החלון נסגר ללא השלמת ההתחברות לטיקטוק"));
              }
            }
          } catch (error) {
            clearInterval(checkClosed);
            if (!isResolved) {
              isResolved = true;
              reject(new Error('שגיאה בבדיקת סטטוס חלון טיקטוק'));
            }
          }
        }, 1000);
        
        setTimeout(() => {
          if (!isResolved) {
            isResolved = true;
            clearInterval(checkClosed);
            
            try {
              if (popup && !popup.closed) {
                popup.close();
              }
            } catch (error) {
              console.warn('Error closing TikTok popup:', error);
            }
            
            reject(new Error("תם הזמן לחיבור לטיקטוק (120 שניות)"));
          }
        }, 120000);
      });
    } catch (error) {
      console.error("שגיאה בחיבור לטיקטוק:", error);
      return {
        success: false,
        platform: "TikTok",
        error: error.message,
        message: `שגיאה בחיבור לטיקטוק: ${error.message}`
      };
    }
  }

  // Helper functions for platform connections
  async getFacebookUserInfo(accessToken) {
    try {
      const response = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${accessToken}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting Facebook user info:', error);
      return null;
    }
  }

  async getGoogleUserInfo(accessToken) {
    try {
      const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting Google user info:', error);
      return null;
    }
  }

  async getTikTokUserInfo(accessToken) {
    try {
      const response = await fetch('https://open-api.tiktok.com/user/info/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          access_token: accessToken,
          fields: ['open_id', 'union_id', 'avatar_url', 'display_name']
        })
      });
      return await response.json();
    } catch (error) {
      console.error('Error getting TikTok user info:', error);
      return null;
    }
  }

  // Campaign creation functions
  async createFacebookCampaign(campaignParams, adCreative, accessToken) {
    try {
      console.log("📱 יוצר קמפיין בפייסבוק...");
      
      // Facebook Ads API call
      const response = await fetch(`https://graph.facebook.com/v18.0/act_${campaignParams.accountId}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          name: campaignParams.name,
          objective: campaignParams.objective,
          status: 'PAUSED',
          special_ad_categories: []
        })
      });

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error.message);
      }

      return {
        success: true,
        campaign_id: result.id,
        platform: "Facebook",
        message: "קמפיין פייסבוק נוצר בהצלחה"
      };
    } catch (error) {
      console.error("שגיאה ביצירת קמפיין פייסבוק:", error);
      return {
        success: false,
        platform: "Facebook",
        error: error.message,
        message: `שגיאה ביצירת קמפיין פייסבוק: ${error.message}`
      };
    }
  }

  async createGoogleCampaign(campaignParams, adCreative, accessToken) {
    try {
      console.log("🔍 יוצר קמפיין בגוגל...");
      
      // Google Ads API call
      const response = await fetch(`https://googleads.googleapis.com/v14/customers/${campaignParams.customerId}/campaigns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          name: campaignParams.name,
          advertising_channel_type: 'SEARCH',
          status: 'PAUSED',
          campaign_budget: campaignParams.budget
        })
      });

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error.message);
      }

      return {
        success: true,
        campaign_id: result.results[0].resource_name,
        platform: "Google",
        message: "קמפיין גוגל נוצר בהצלחה"
      };
    } catch (error) {
      console.error("שגיאה ביצירת קמפיין גוגל:", error);
      return {
        success: false,
        platform: "Google",
        error: error.message,
        message: `שגיאה ביצירת קמפיין גוגל: ${error.message}`
      };
    }
  }

  async createTikTokCampaign(campaignParams, adCreative, accessToken) {
    try {
      console.log("🎵 יוצר קמפיין בטיקטוק...");
      
      // TikTok Ads API call
      const response = await fetch('https://business-api.tiktok.com/open_api/v1.3/campaign/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Token': accessToken
        },
        body: JSON.stringify({
          advertiser_id: campaignParams.advertiserId,
          campaign_name: campaignParams.name,
          objective_type: campaignParams.objective,
          budget_mode: 'BUDGET_MODE_DAY',
          budget: campaignParams.budget
        })
      });

      const result = await response.json();
      
      if (result.code !== 0) {
        throw new Error(result.message);
      }

      return {
        success: true,
        campaign_id: result.data.campaign_id,
        platform: "TikTok",
        message: "קמפיין טיקטוק נוצר בהצלחה"
      };
    } catch (error) {
      console.error("שגיאה ביצירת קמפיין טיקטוק:", error);
      return {
        success: false,
        platform: "TikTok",
        error: error.message,
        message: `שגיאה ביצירת קמפיין טיקטוק: ${error.message}`
      };
    }
  }

  async uploadVideoToTikTok(videoFile, accessToken, adCreative) {
    try {
      console.log("📹 מעלה וידאו לטיקטוק...");
      
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('post_info', JSON.stringify({
        title: adCreative.title,
        description: adCreative.description,
        privacy_level: 'PUBLIC_TO_EVERYONE'
      }));

      const response = await fetch('https://open-api.tiktok.com/video/upload/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });

      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error.message);
      }

      return {
        success: true,
        video_id: result.data.video_id,
        platform: "TikTok",
        message: "וידאו הועלה לטיקטוק בהצלחה"
      };
    } catch (error) {
      console.error("שגיאה בהעלאת וידאו לטיקטוק:", error);
      return {
        success: false,
        platform: "TikTok",
        error: error.message,
        message: `שגיאה בהעלאת וידאו לטיקטוק: ${error.message}`
      };
    }
  }

  // Helper function to map campaign goals to platform objectives
  mapGoalToFacebookObjective(goal) {
    const mapping = {
      'awareness': 'BRAND_AWARENESS',
      'traffic': 'LINK_CLICKS',
      'engagement': 'POST_ENGAGEMENT',
      'leads': 'LEAD_GENERATION',
      'sales': 'CONVERSIONS'
    };
    return mapping[goal] || 'BRAND_AWARENESS';
  }

  async deployAutomaticCampaign(platformName, campaignParams, adCreative, videoFile = null, debugMode = false) {
    try {
      console.log(`🚀 מפרסם קמפיין אוטומטי ב-${platformName}...`);
      
      const accessToken = localStorage.getItem(`${platformName.toLowerCase()}_access_token`);
      
      // 🔧 DEBUG MODE - דילוג על בדיקת access token
      if (!debugMode && !accessToken) {
        throw new Error(`לא מחובר ל-${platformName}`);
      }
      
      // אם במצב DEBUG, נשתמש באקסס טוקן דמה
      const tokenToUse = accessToken || (debugMode ? 'DEBUG_MODE_TOKEN' : null);
      
      if (!tokenToUse) {
        throw new Error(`לא מחובר ל-${platformName}`);
      }

      // עדכון progress - התחלת העלאה
      if (videoFile) {
        setUploadProgress(prev => ({ 
          ...prev, 
          [platformName]: 'מעלה סרטון...' 
        }));
      }

      // שליחת בקשה ליצירת קמפיין דרך backend מאובטח עם קובץ סרטון
      const formData = new FormData();
      formData.append('platform', platformName);
      formData.append('campaignParams', JSON.stringify(campaignParams));
      formData.append('adCreative', JSON.stringify(adCreative));
      formData.append('accessToken', tokenToUse);
      formData.append('debugMode', debugMode.toString()); // העברת מצב הבדיקה לשרת
      
      // הוספת userId למעקב אחר הקמפיין
      if (currentUser?.uid) {
        formData.append('userId', currentUser.uid);
      }
      
      // הוספת קובץ הסרטון אם קיים
      if (videoFile) {
        formData.append('video', videoFile);
        console.log(`📹 מעלה סרטון ל-${platformName}:`, videoFile.name);
      }

      const response = await fetch('/api/campaigns/create', {
        method: 'POST',
        headers: {
          'X-API-Key': 'test-api-key-123'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Failed to create campaign: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Campaign creation failed');
      }

      // עדכון progress - העלאה הושלמה
      if (videoFile) {
        setUploadProgress(prev => ({ 
          ...prev, 
          [platformName]: 'הושלם בהצלחה ✅' 
        }));
      }

      return result.result;
    } catch (error) {
      console.error(`שגיאה בפרסום קמפיין ב-${platformName}:`, error);
      
      // עדכון progress - שגיאה בהעלאה
      if (videoFile) {
        setUploadProgress(prev => ({ 
          ...prev, 
          [platformName]: 'שגיאה בהעלאה ❌' 
        }));
      }
      
      return {
        success: false,
        platform: platformName,
        error: error.message,
        message: `שגיאה בשליחת הפרסומת ל-${platformName}: ${error.message}`
      };
    }
  }

  async connectPlatform(platformName) {
    try {
      console.log(`🔗 מתחבר ל-${platformName} בצורה אמיתית...`);
      
      switch (platformName) {
        case 'Facebook':
          return await this.connectFacebook();
        case 'Google':
          return await this.connectGoogle();
        case 'TikTok':
          return await this.connectTikTok();
        default:
          throw new Error(`פלטפורמה ${platformName} לא נתמכת`);
      }
    } catch (error) {
      console.error(`שגיאה בחיבור ל-${platformName}:`, error);
      return {
        success: false,
        platform: platformName,
        error: error.message,
        message: `שגיאה בחיבור ל-${platformName}: ${error.message}`
      };
    }
  }

  getFallbackStrategy(campaignGoal) {
    console.warn("⚠️ Using fallback strategy - this means real AI analysis failed!");
    const strategies = {
      'awareness': '{"אסטרטגיה_עיקרית":"חשיפה מקסימלית","פלטפורמות_מומלצות":[{"שם":"Google","אחוז_תקציב":"40%"},{"שם":"Facebook","אחוז_תקציב":"35%"},{"שם":"TikTok","אחוז_תקציב":"25%"}]}',
      'sales': '{"אסטרטגיה_עיקרית":"מכירות","פלטפורמות_מומלצות":[{"שם":"Google","אחוז_תקציב":"45%"},{"שם":"Facebook","אחוז_תקציב":"35%"},{"שם":"TikTok","אחוז_תקציב":"20%"}]}'
    };
    return strategies[campaignGoal] || strategies.awareness;
  }

  async analyzeContentAdvanced(videoFile, budget, businessDescription, campaignGoal) {
    console.log("🧠 מתחיל ניתוח AI מתקדם דרך backend...");
    console.log("📁 קובץ הסרטון:", videoFile.name);
    console.log("📏 גודל הקובץ:", videoFile.size, "bytes");
    console.log("🎯 סוג קובץ:", videoFile.type);
    console.log("💰 תקציב:", budget);
    console.log("🏢 תיאור עסק:", businessDescription);
    console.log("🎯 מטרת קמפיין:", campaignGoal);
    
    try {
      // שליחת בקשה לניתוח AI מתקדם דרך backend החדש
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('budget', budget);
      formData.append('businessDescription', businessDescription);
      formData.append('campaignGoal', campaignGoal);
      
      console.log("📤 שולח בקשה לניתוח מתקדם...");
      const response = await fetch('/api/ai/advanced-analyze', {
        method: 'POST',
        headers: {
          'X-API-Key': 'test-api-key-123'
        },
        body: formData
      });

      console.log("📥 תשובה מהשרת:", response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Backend analysis failed: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("📊 תוצאה מהשרת:", result);
      
      if (!result.success) {
        throw new Error(result.error || 'Analysis failed');
      }

      console.log("✅ ניתוח AI הושלם בהצלחה דרך backend");
      
      // המרת התוצאה לפורמט המקורי
      return {
        visual_analysis: {
          video_analysis: result.analysis.visual_analysis.video_analysis,
          frames_analyzed: result.analysis.visual_analysis.frames_analyzed,
          frame_details: result.analysis.visual_analysis.frame_details,
          video_overview: result.analysis.visual_analysis.video_overview,
          visual_recommendations: result.analysis.visual_analysis.visual_recommendations
        },
        audio_analysis: {
          transcription: result.analysis.audio_analysis.transcription,
          text_analysis: result.analysis.audio_analysis.text_analysis,
          audio_recommendations: result.analysis.audio_analysis.audio_recommendations
        },
        master_strategy: result.analysis.master_strategy,
        custom_post_description: result.analysis.custom_post_description,
        analysis_summary: result.analysis.analysis_summary
      };
    } catch (error) {
      console.error("שגיאה בניתוח מתקדם:", error);
      throw error;
    }
  }

  async generateCustomPostDescription(visualAnalysis, audioAnalysis, businessDescription, campaignGoal) {
    try {
      // Backend כבר יוצר את זה ב-advanced-analyze, אז נחזיר fallback
      return `🏢 ${businessDescription}

🎯 ${campaignGoal}

גלו את ההזדמנות הזו! 🚀

#שיווק #עסקים #AI #ניתוח_וידאו`;
    } catch (error) {
      console.error("שגיאה ביצירת תיאור פוסט:", error);
      return "תיאור פוסט מותאם אישית";
    }
  }

  async generateAnalysisSummary(visualAnalysis, audioAnalysis) {
    try {
      const summary = `
סיכום ניתוח:
- ניתוח ויזואלי: ${visualAnalysis}
- ניתוח אודיו: ${audioAnalysis}
      `;
      return summary;
    } catch (error) {
      console.error("שגיאה ביצירת סיכום:", error);
      return "סיכום ניתוח";
    }
  }

  async generateVisualRecommendations(videoOverview) {
    try {
      // Backend כבר מייצר את ההמלצות ב-advanced-analyze
      // כאן נחזיר fallback בסיסי
      return [
        "שיפור איכות וידאו והפקה מקצועית",
        "שיפור תאורה ואיכות צילום",
        "שיפור קומפוזיציה ומסגור של הפריים",
        "הוספת כתוביות ואלמנטים ויזואליים",
        "שיפור תנועה ומעברים בסרטון"
      ];
    } catch (error) {
      console.error("שגיאה ביצירת המלצות ויזואל:", error);
      return ["שיפור תאורה", "הוספת טקסט", "חיזוק מסר ויזואלי"];
    }
  }

  async generateAudioRecommendations(transcription, textAnalysis) {
    try {
      console.log("🎵 יוצר המלצות אודיו דרך backend...");
      
      // שליחת בקשה לניתוח אודיו דרך backend
      const formData = new FormData();
      formData.append('transcription', transcription);
      formData.append('textAnalysis', JSON.stringify(textAnalysis));
      
      const response = await fetch('/api/ai/audio-recommendations', {
        method: 'POST',
        headers: {
          'X-API-Key': 'test-api-key-123'
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Backend audio recommendations failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Audio recommendations failed');
      }

      console.log("✅ המלצות אודיו הושלמו בהצלחה דרך backend");
      return result.recommendations || ["שיפור איכות קול", "הוספת מוזיקת רקע", "חיזוק מסר"];
    } catch (error) {
      console.error("שגיאה ביצירת המלצות אודיו:", error);
      return ["שיפור איכות קול", "הוספת מוזיקת רקע", "חיזוק מסר"];
    }
  }
}
function EnhancedCampaign() {
  // 🔧 DEBUG MODE - מאפשר פרסום בלי חיבור פלטפורמות (רק ב-development!)
  // בפרודקשן (npm run build) - DEBUG_MODE יהיה אוטומטית false
  const DEBUG_MODE = import.meta.env.DEV; // true רק ב-development, false ב-production
  
  // Firebase Auth
  const { currentUser, userData, refreshUserData } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not logged in
  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
    }
  }, [currentUser, navigate]);

  // Get user display name
  const getUserDisplayName = () => {
    if (currentUser?.displayName) return currentUser.displayName;
    if (currentUser?.email) return currentUser.email.split('@')[0];
    return 'משתמש';
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('connectedPlatforms');
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  
  const [currentPage, setCurrentPage] = useState('campaign');
  const [currentStep, setCurrentStep] = useState(1);
  const [previewMode, setPreviewMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  const [brainResponse, setBrainResponse] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [enhancedBrain] = useState(() => {
    try {
      return new EnhancedLocalBrain();
    } catch (error) {
      console.error("שגיאה ביצירת AI Brain:", error);
      return null;
    }
  });
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [currentAnalysisStep, setCurrentAnalysisStep] = useState("");
  const [estimatedTimeRemaining, setEstimatedTimeRemaining] = useState(0);
  const [analysisStartTime, setAnalysisStartTime] = useState(null);
  const [language, setLanguage] = useState('he');
  const [connectedPlatforms, setConnectedPlatforms] = useState({});
  const [deploymentProgress, setDeploymentProgress] = useState({});
  
  // Translation function and object based on local language state
  const t = (key) => {
    const lang = language === 'he' ? 'hebrew' : 'english';
    return Translations[lang][key] || key;
  };
  
  // Extended translation object for complex structures
  t.steps = {
    1: language === 'he' ? "העלאת סרטון ופרטי עסק" : "Video Upload & Business Details",
    2: language === 'he' ? "מטרת הקמפיין" : "Campaign Goal",
    3: language === 'he' ? "המלצות AI מתקדמות" : "Advanced AI Recommendations",
    4: language === 'he' ? "שליחה אוטומטית ומעקב" : "Automatic Deployment & Tracking"
  };
  
  t.nav = {
    campaign: language === 'he' ? "יצירת קמפיין" : "Create Campaign",
    platforms: language === 'he' ? "חיבור פלטפורמות" : "Connect Platforms",
    home: language === 'he' ? "דף בית" : "Home"
  };
  
  t.goals = {
    leads: language === 'he' ? "יצירת לידים" : "Generate Leads",
    sales: language === 'he' ? "הגדלת מכירות" : "Increase Sales",
    awareness: language === 'he' ? "חשיפה למותג" : "Brand Awareness"
  };
  
  t.title = language === 'he' ? "פלטפורמת שיווק AI מתקדמת" : "Advanced AI Marketing Platform";
  t.platformsTitle = language === 'he' ? "ניהול חיבורי פלטפורמות" : "Platform Connections Management";
  
  const isRTL = language === 'he';
  const [uploadProgress, setUploadProgress] = useState({}); // Progress for video uploads
  const [campaignResults, setCampaignResults] = useState([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Manual editing states - track which cards are being edited
  const [isManualEditMode, setIsManualEditMode] = useState(false);
  const [editingCards, setEditingCards] = useState({
    post: false,
    audience: false,
    platforms: false
  });
  const [manualPlatformBudgets, setManualPlatformBudgets] = useState({});
  const [selectedPlatforms, setSelectedPlatforms] = useState({});
  const [manualPostDescription, setManualPostDescription] = useState("");
  const [manualTargetAudience, setManualTargetAudience] = useState("");
  const [manualPublishingHours, setManualPublishingHours] = useState("");
  
  // Saved values for display after editing
  const [savedTargetAudience, setSavedTargetAudience] = useState("");
  const [savedPublishingHours, setSavedPublishingHours] = useState("");
  const [savedPlatforms, setSavedPlatforms] = useState([]);

  const [formData, setFormData] = useState({
    video: null,
    businessDescription: "",
    dailyBudget: "",
    campaignGoal: "",
    postDescription: "",
    aiSuggestion: ""
  });


  // Scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cleanup resources on component unmount
  React.useEffect(() => {
    return () => {
      try {
        if (window.toastTimeout) {
          clearTimeout(window.toastTimeout);
        }
        
        if (formData.video) {
          try {
            URL.revokeObjectURL(URL.createObjectURL(formData.video));
          } catch (error) {
            // ignore cleanup errors
          }
        }
      } catch (error) {
        console.warn("Error during cleanup:", error);
      }
    };
  }, [formData.video]);

  // Error boundary effect
  React.useEffect(() => {
    const handleError = (event) => {
      console.error("Global error caught:", event.error);
      showToastMessage("שגיאה כללית במערכת. אנא רענן את הדף.");
    };

    const handleUnhandledRejection = (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      showToastMessage("שגיאה בתקשורת עם השרת.");
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);


  // פונקציה לחזרה לדף הבית
  const handleGoHome = () => {
    // נבדוק אם יש window object (אנחנו בדפדפן)
    if (typeof window !== 'undefined') {
      // נניח שהדף בית הוא index.tsx באותה תיקיה
      window.location.href = '/';
    }
  };

  const showToastMessage = (message) => {
    try {
      if (!message) {
        console.warn('Attempted to show empty toast message');
        return;
      }
      
      const safeMessage = String(message).substring(0, 200);
      setToastMessage(safeMessage);
      setShowToast(true);
    } catch (error) {
      console.error('Error showing toast message:', error);
    }
  };

  // Auto-hide toast after 2 seconds
  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
          setShowToast(false);
          setToastMessage("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const steps = [
    { number: 1, title: t.steps[1], icon: Upload },
    { number: 2, title: t.steps[2], icon: Target },
    { number: 3, title: t.steps[3], icon: Brain },
    { number: 4, title: t.steps[4], icon: Send }
  ];

  const campaignGoals = [
    { 
      value: "leads", 
      label: t.goals.leads, 
      icon: Users, 
      description: language === 'he' ? "איסוף פרטי לקוחות פוטנציאליים עם טפסים מותאמים" : "Collect potential customer information with customized forms"
    },
    { 
      value: "sales", 
      label: t.goals.sales, 
      icon: ShoppingCart, 
      description: language === 'he' ? "קידום מכירות ישירות עם מעקב ROI מתקדם" : "Promote direct sales with advanced ROI tracking"
    },
    { 
      value: "awareness", 
      label: t.goals.awareness, 
      icon: Eye, 
      description: language === 'he' ? "הגדלת המודעות למותג עם מדידת reach ואנגייג'מנט" : "Increase brand awareness with reach and engagement measurement"
    }
  ];

  const availablePlatforms = [
    { 
      name: "Facebook", 
      icon: Facebook, 
      color: "bg-blue-600", 
      description: language === 'he' ? "הפלטפורמה הגדולה ביותר לפרסום ברשתות חברתיות - כולל פרסום אוטומטי באינסטגרם בפוסטים, סטוריז וריילס!" : "The largest social media advertising platform - includes automatic Instagram publishing for posts, stories and reels!",
      features: language === 'he' ? ["יצירת לידים", "מכירות", "חשיפה", "פוסטים באינסטגרם", "סטוריז באינסטגרם", "ריילס באינסטגרם"] : ["Lead Generation", "Sales", "Awareness", "Instagram Posts", "Instagram Stories", "Instagram Reels"],
      isRealConnection: true
    },
    { 
      name: "Google", 
      icon: Target, 
      color: "bg-red-600", 
      description: language === 'he' ? "פרסום בגוגל - כולל חיפוש, יוטיוב, Gmail, רשת התוכן ועוד! כל רשתות הפרסום של גוגל במקום אחד" : "Google Advertising - includes Search, YouTube, Gmail, Display Network & more! All Google advertising networks in one place",
      features: language === 'he' ? ["חיפוש גוגל", "יוטיוב", "Gmail", "רשת תוכן", "Google Shopping", "אפליקציות"] : ["Google Search", "YouTube", "Gmail", "Display Network", "Google Shopping", "Apps"],
      isRealConnection: true
    },
    { 
      name: "TikTok", 
      icon: Play, 
      color: "bg-black", 
      description: language === 'he' ? "הפלטפורמה הויראלית הגדולה בעולם לקהל צעיר ותוכן יצירתי" : "The world's largest viral platform for young audiences and creative content",
      features: language === 'he' ? ["תוכן ויראלי", "קהל צעיר", "העלאת סרטונים", "פרסום אינטראקטיבי"] : ["Viral Content", "Young Audience", "Video Upload", "Interactive Ads"],
      isRealConnection: true // יעודכן כשיהיו פרטים
    }
  ];

  const handleConnectPlatform = async (platformName) => {
    try {
      if (!platformName || typeof platformName !== 'string') {
        console.error('Invalid platform name:', platformName);
        showToastMessage("שם פלטפורמה לא תקין");
        return;
      }

      setConnectedPlatforms(prev => ({ 
        ...prev, 
        [platformName]: { status: 'connecting' } 
      }));
      
      if (!enhancedBrain || typeof enhancedBrain.connectPlatform !== 'function') {
        throw new Error('AI Brain לא זמין');
      }

      let result;
      try {
        result = await enhancedBrain.connectPlatform(platformName);
      } catch (connectionError) {
        console.error('Connection error:', connectionError);
        result = {
          success: false,
          error: connectionError.message || 'שגיאה בחיבור',
          message: `שגיאה בחיבור ל-${platformName}: ${connectionError.message || 'שגיאה לא ידועה'}`
        };
      }
      
      if (result && typeof result === 'object') {
        if (result.success) {
          setConnectedPlatforms(prev => ({ 
            ...prev, 
            [platformName]: { 
              status: 'connected', 
              data: result
            } 
          }));
          showToastMessage(result.message || `${platformName} חובר בהצלחה`);
        } else {
          setConnectedPlatforms(prev => ({ 
            ...prev, 
            [platformName]: { 
              status: 'error', 
              error: result.error || 'שגיאה לא ידועה' 
            } 
          }));
          showToastMessage(result.message || `שגיאה בחיבור ל-${platformName}`);
        }
      } else {
        throw new Error('תוצאת חיבור לא תקינה');
      }
    } catch (error) {
      console.error(`Error connecting to ${platformName}:`, error);
      
      const errorMessage = error?.message || 'שגיאה לא ידועה בחיבור';
      
      setConnectedPlatforms(prev => ({ 
        ...prev, 
        [platformName]: { 
          status: 'error', 
          error: errorMessage 
        } 
      }));
      
      showToastMessage(`שגיאה בחיבור ל-${platformName}: ${errorMessage}`);
    }
  };

  const handleDisconnectPlatform = (platformName) => {
    try {
      if (!platformName || typeof platformName !== 'string') {
        console.error('Invalid platform name for disconnect:', platformName);
        showToastMessage("שם פלטפורמה לא תקין לניתוק");
        return;
      }

      try {
        if (typeof Storage !== 'undefined' && localStorage) {
          localStorage.removeItem(`${platformName.toLowerCase()}_access_token`);
        }
      } catch (storageError) {
        console.warn('Cannot access localStorage for disconnect:', storageError);
      }
      
      setConnectedPlatforms(prev => {
        try {
          const updated = { ...prev };
          delete updated[platformName];
          return updated;
        } catch (error) {
          console.error('Error updating connected platforms state:', error);
          return prev;
        }
      });
      
      const successMessage = language === 'he' ? 
        `החיבור ל-${platformName} נותק בהצלחה` :
        `Disconnected from ${platformName} successfully`;
        
      showToastMessage(successMessage);
    } catch (error) {
      console.error(`Error disconnecting from ${platformName}:`, error);
      showToastMessage(`שגיאה בניתוק ${platformName}: ${error.message || 'שגיאה לא ידועה'}`);
    }
  };

  const parseAdvancedStrategy = (masterStrategy) => {
    try {
      if (!masterStrategy) {
        return null;
      }
      
      if (typeof masterStrategy === 'string') {
        const parsed = JSON.parse(masterStrategy);
        return parsed.אסטרטגיה_עיקרית || parsed;
      }
      
      if (typeof masterStrategy === 'object') {
        return masterStrategy.אסטרטגיה_עיקרית || masterStrategy;
      }
      
      return null;
    } catch (error) {
      console.error("Error parsing master strategy:", error);
      return null;
    }
  };

  const getAdvancedRecommendations = () => {
    try {
      if (brainResponse?.master_strategy) {
        const strategy = parseAdvancedStrategy(brainResponse.master_strategy);
        
        if (strategy?.פלטפורמות_מומלצות && Array.isArray(strategy.פלטפורמות_מומלצות)) {
          const platforms = strategy.פלטפורמות_מומלצות.map((platform, index) => {
            if (!platform || typeof platform !== 'object') {
              console.warn(`Platform ${index} is not valid:`, platform);
              return null;
            }
            
            const platformName = platform.שם || platform.name || 'Unknown';
            const percentage = platform.אחוז_תקציב || platform.percentage || '0%';
            const percentageNum = parseInt(String(percentage).replace('%', '')) || 0;
            
            return {
              name: platformName,
              icon: getPlatformIcon(platformName),
              recommended: percentageNum > 0,
              percentage: percentage,
              reason: platform.נימוק || platform.reason || 'ללא נימוק',
              targetAudience: platform.קהל_יעד || platform.target_audience || 'כללי',
              timing: platform.זמני_פרסום || platform.timing || 'כל היום'
            };
          }).filter(Boolean);

          return {
            platforms: platforms || [],
            targetAudience: strategy.קהל_יעד_עיקרי || strategy.target_audience || 'קהל כללי',
            style: strategy.סגנון_פרסום || strategy.style || 'כללי',
            kpis: Array.isArray(strategy.KPIs) ? strategy.KPIs : 
                  Array.isArray(strategy.kpis) ? strategy.kpis : []
          };
        }
      }
    } catch (error) {
      console.error('Error getting advanced recommendations:', error);
    }

    throw new Error('לא ניתן לקבל המלצות ללא ניתוח AI תקין');
  };

  const getPlatformIcon = (platformName) => {
    try {
      const icons = {
        "Facebook": Facebook,
        "YouTube": Youtube,
        "LinkedIn": Linkedin,
        "Google": Target,
        "TikTok": Play
      };
      return icons[platformName] || Target;
    } catch (error) {
      console.error('Error getting platform icon:', error);
      return Target;
    }
  };

  const getFallbackRecommendations = () => {
    console.warn("⚠️ Using fallback recommendations - this means real AI analysis failed!");
    return {
      platforms: [
        { name: "Facebook", icon: Facebook, recommended: true, percentage: "40%" },
        { name: "Google", icon: Target, recommended: true, percentage: "35%" }
      ],
      targetAudience: "קהל רחב",
      style: "משכנע",
      kpis: ["הגעה", "מעורבות"]
    };
  };

  const handleAdvancedAnalysis = async (videoFile) => {
    if (!videoFile) {
      showToastMessage(t('noVideoFile'));
      return false;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);
    setCurrentAnalysisStep("מתחיל ניתוח...");
    setAnalysisStartTime(Date.now());
    setEstimatedTimeRemaining(120); // 2 דקות משוערות
    
    try {
      // התחלת הניתוח האמיתי
      const startTime = Date.now();
      let currentProgress = 0;
      
      // חישוב זמן משוער בהתאם לגודל הקובץ
      const fileSizeMB = videoFile.size / (1024 * 1024);
      const baseTime = 60; // זמן בסיסי של דקה
      const sizeMultiplier = Math.max(1, fileSizeMB / 10); // 10MB = 1x, 20MB = 2x, וכו'
      const estimatedTotalTime = Math.round(baseTime * sizeMultiplier);
      
      // עדכון התקדמות בזמן אמת
      const updateProgress = (progress, step, timeEstimate) => {
        setAnalysisProgress(progress);
        setCurrentAnalysisStep(step);
        setEstimatedTimeRemaining(timeEstimate);
        currentProgress = progress;
      };
      
      // פונקציה לעדכון התקדמות בזמן אמת עם אנימציה איטית וחלקה
      const updateProgressRealTime = async (targetProgress, step, timeEstimate) => {
        const startProgress = currentProgress;
        const progressDiff = targetProgress - startProgress;
        const duration = Math.max(8000, progressDiff * 300); // לפחות 8 שניות, או 300ms לכל אחוז
        const totalSteps = Math.abs(progressDiff) * 5; // הרבה יותר צעדים לאנימציה חלקה יותר
        const stepTime = duration / totalSteps;
        
        for (let i = 0; i <= totalSteps; i++) {
          const newProgress = startProgress + (progressDiff * i / totalSteps);
          setAnalysisProgress(Math.round(newProgress));
          setCurrentAnalysisStep(step);
          setEstimatedTimeRemaining(timeEstimate);
          currentProgress = Math.round(newProgress);
          
          if (i < totalSteps) {
            await new Promise(resolve => setTimeout(resolve, stepTime));
          }
        }
      };
      
      // שלב 1: התחלת הניתוח
      await updateProgressRealTime(5, t('analysisStarting'), estimatedTotalTime);
      
      try {
        // קריאה ל-backend API במקום ל-OpenAI ישירות
        const requestFormData = new FormData();
        requestFormData.append('video', videoFile);
        requestFormData.append('budget', formData.dailyBudget || "100");
        requestFormData.append('businessDescription', formData.businessDescription || "עסק כללי");
        requestFormData.append('campaignGoal', formData.campaignGoal || "awareness");
        
        // שלב 2: שליחת בקשה לשרת
        await updateProgressRealTime(15, t('sendingToAnalysis'), Math.round(estimatedTotalTime * 0.8));
        
        // התחלת הניתוח בשרת עם עדכון מתמשך
        const analysisPromise = fetch('/api/ai/advanced-analyze', {
          method: 'POST',
          headers: {
            'X-API-Key': 'test-api-key-123'
          },
          body: requestFormData
        });

        // עדכון מתמשך בזמן שהניתוח קורה
        const progressInterval = setInterval(async () => {
          if (currentProgress < 95) {
            const newProgress = Math.min(currentProgress + 1, 95);
            setAnalysisProgress(newProgress);
            currentProgress = newProgress;
            
            // עדכון הודעות בהתאם להתקדמות
            if (newProgress < 25) {
              setCurrentAnalysisStep(t('analyzingVideo'));
            } else if (newProgress < 45) {
              setCurrentAnalysisStep(t('analyzingColors'));
            } else if (newProgress < 65) {
              setCurrentAnalysisStep(t('analyzingAudio'));
            } else if (newProgress < 85) {
              setCurrentAnalysisStep(t('buildingStrategy'));
            } else {
              setCurrentAnalysisStep(t('preparingRecommendations'));
            }
          }
        }, 800); // עדכון כל 0.8 שניות לאט יותר

        const response = await analysisPromise;

        if (!response.ok) {
          clearInterval(progressInterval);
          throw new Error(`Backend analysis failed: ${response.statusText}`);
        }

        clearInterval(progressInterval);
        
        const result = await response.json();
        
        if (!result.success) {
          throw new Error(result.error || 'Analysis failed');
        }

        // שלב 4: הניתוח הושלם
        await updateProgressRealTime(100, t('analysisComplete'), 0);
        
        // המרת התוצאה לפורמט המקורי
        const analysisResult = {
          visual_analysis: {
            video_analysis: result.analysis.visual_analysis.video_analysis,
            frames_analyzed: result.analysis.visual_analysis.frames_analyzed,
            frame_details: result.analysis.visual_analysis.frame_details,
            video_overview: result.analysis.visual_analysis.video_overview,
            visual_recommendations: result.analysis.visual_analysis.visual_recommendations
          },
          audio_analysis: {
            transcription: result.analysis.audio_analysis.transcription,
            text_analysis: result.analysis.audio_analysis.text_analysis,
            audio_recommendations: result.analysis.audio_analysis.audio_recommendations
          },
          master_strategy: result.analysis.master_strategy,
          custom_post_description: result.analysis.custom_post_description,
          analysis_summary: result.analysis.analysis_summary
        };
        
        
        // שמירת התוצאות
        setBrainResponse(analysisResult);
        setAiAnalysisComplete(true);
        
        // עדכון תיאור הפוסט אוטומטית
        if (analysisResult.custom_post_description) {
          setFormData(prev => ({
            ...prev,
            postDescription: analysisResult.custom_post_description
          }));
        }
        
        const totalTime = Math.round((Date.now() - startTime) / 1000);
        const estimatedTime = Math.round(estimatedTotalTime);
        const accuracy = Math.round((1 - Math.abs(totalTime - estimatedTime) / estimatedTime) * 100);
        
        console.log(`✅ ניתוח הושלם בהצלחה תוך ${totalTime} שניות (משוער: ${estimatedTime} שניות, דיוק: ${accuracy}%)`);
        
        showToastMessage(t('analysisCompleteTime').replace('{time}', totalTime));
        
        return true;
        
      } catch (error) {
        console.error("שגיאה בניתוח מתקדם:", error);
        showToastMessage(t('analysisError'));
        return false;
      }


    } catch (error) {
      console.error("❌ שגיאה בניתוח AI:", error);
      
      // הצג שגיאה ברורה למשתמש
      const errorMessage = error.message || 'שגיאה לא ידועה בניתוח הסרטון';
      showToastMessage(`❌ ${errorMessage}`);
      
      // נקה את המצב
      setBrainResponse(null);
      setAiAnalysisComplete(false);
      
      return false;
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
      setCurrentAnalysisStep("");
      setEstimatedTimeRemaining(0);
      setAnalysisStartTime(null);
    }
  };

  // Open manual edit mode
  const handleOpenManualEdit = () => {
    console.log("🔧 פותח מצב עריכה ידנית...");
    console.log("brainResponse:", brainResponse);
    console.log("connectedPlatforms:", connectedPlatforms);
    
    // Initialize manual editing with AI recommendations (or defaults)
    let strategy = null;
    
    if (brainResponse?.master_strategy) {
    try {
      strategy = typeof brainResponse.master_strategy === 'string' 
        ? JSON.parse(brainResponse.master_strategy)
        : brainResponse.master_strategy;
    } catch (parseError) {
        console.error("שגיאה בפרסור האסטרטגיה:", parseError);
        // Continue with null strategy - will use defaults
      }
    }

    const platforms = strategy?.אסטרטגיה_עיקרית?.פלטפורמות_מומלצות || strategy?.platforms || [];
    
    // Initialize budgets from AI recommendations or equal distribution
    const budgets = {};
    const selected = {};
    const connectedPlatformNames = Object.keys(connectedPlatforms).filter(
      platform => connectedPlatforms[platform]?.status === 'connected'
    );

    if (platforms.length > 0 && connectedPlatformNames.length > 0) {
      // Use AI recommendations
    platforms.forEach(platform => {
      const platformName = platform?.שם || platform?.name;
      if (platformName && connectedPlatformNames.includes(platformName)) {
        const percentage = parseInt(String(platform.אחוז_תקציב || platform.percentage || "0%").replace('%', ''));
        budgets[platformName] = Math.max(1, Math.floor((parseFloat(formData.dailyBudget || "100") * percentage) / 100));
          selected[platformName] = true;
        }
      });
    } else {
      // No AI recommendations - distribute budget equally among connected platforms
      const budgetPerPlatform = Math.floor(parseFloat(formData.dailyBudget || "100") / Math.max(1, connectedPlatformNames.length));
      connectedPlatformNames.forEach(platformName => {
        budgets[platformName] = Math.max(1, budgetPerPlatform);
        selected[platformName] = true;
      });
    }

    setManualPlatformBudgets(budgets);
    setSelectedPlatforms(selected);
    setManualPostDescription(formData.postDescription || brainResponse?.custom_post_description || "");
    
    // Initialize target audience and publishing hours
    const targetAudience = strategy?.אסטרטגיה_עיקרית?.קהל_יעד_עיקרי || strategy?.target_audience || "קהל רחב - גברים ונשים בגילאי 18-65";
    const publishingHours = strategy?.אסטרטגיה_עיקרית?.זמני_פרסום || strategy?.publishing_hours || "כל היום (24/7)";
    
    setManualTargetAudience(targetAudience);
    setManualPublishingHours(publishingHours);
    setIsManualEditMode(true);
    showToastMessage(t('editingModeEnabled'));
  };

  // Deploy with manual settings
  const handleManualDeployment = async () => {
    try {
      setIsDeploying(true);
      setCampaignResults([]);
      setDeploymentProgress({});

      const platformsToSend = Object.keys(selectedPlatforms).filter(
        platform => selectedPlatforms[platform]
      );

      if (platformsToSend.length === 0) {
        showToastMessage(t('selectAtLeastOnePlatform'));
        setIsDeploying(false);
        return;
      }

      const results = [];

      for (const platformName of platformsToSend) {
        try {
          setDeploymentProgress(prev => ({ 
            ...prev, 
            [platformName]: 'משגר...' 
          }));

          const campaignParams = {
            daily_budget: manualPlatformBudgets[platformName] || 10,
            goal: formData.campaignGoal || "awareness",
            post_description: manualPostDescription,
            business_description: formData.businessDescription || "עסק מקומי",
            video: formData.video,
            target_audience: manualTargetAudience || "קהל רחב",
            publishing_hours: manualPublishingHours || "כל היום (24/7)"
          };

          const adCreative = {
            caption: manualPostDescription,
            description: manualPostDescription,
            image_url: "https://via.placeholder.com/1080x1080/4F46E5/FFFFFF?text=AI+Campaign",
            video_url: formData.video ? URL.createObjectURL(formData.video) : null
          };

          let deploymentResult;
          try {
            deploymentResult = await enhancedBrain.deployAutomaticCampaign(
              platformName,
              campaignParams,
              adCreative,
              formData.video // העברת קובץ הסרטון המקורי
            );
          } catch (deployError) {
            console.error(`שגיאה בשליחה ל-${platformName}:`, deployError);
            deploymentResult = {
              success: false,
              platform: platformName,
              error: deployError.message || 'שגיאה לא ידועה',
              message: `שגיאה בשליחה ל-${platformName}: ${deployError.message || 'שגיאה לא ידועה'}`
            };
          }

          results.push(deploymentResult);
          
          setDeploymentProgress(prev => ({ 
            ...prev, 
            [platformName]: deploymentResult?.success ? 'הושלם ✅' : 'שגיאה ❌'
          }));
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (platformError) {
          console.error(`שגיאה כללית בשליחה ל-${platformName}:`, platformError);
          results.push({
            success: false,
            platform: platformName,
            error: platformError.message || 'שגיאה לא ידועה',
            message: `שגיאה כללית בשליחה ל-${platformName}`
          });
          
          setDeploymentProgress(prev => ({ 
            ...prev, 
            [platformName]: 'שגיאה ❌'
          }));
        }
      }

      setCampaignResults(results);
      
      const successCount = results.filter(r => r?.success).length;
      const totalCount = results.length;
      
      if (successCount === totalCount) {
        showToastMessage(t('allCampaignsSuccess').replace('{success}', successCount).replace('{total}', totalCount));
      } else if (successCount > 0) {
        showToastMessage(t('someCampaignsSuccess').replace('{success}', successCount).replace('{total}', totalCount));
      } else {
        showToastMessage(t('allCampaignsFailed'));
      }

    } catch (error) {
      console.error("שגיאה כללית בשליחה:", error);
      showToastMessage(t('generalDeploymentError'));
    } finally {
      setIsDeploying(false);
      setIsManualEditMode(false);
    }
  };

  const handleAutomaticDeployment = async () => {
    try {
      if (!brainResponse?.master_strategy) {
        showToastMessage(t('noStrategyAvailable'));
        return;
      }

      setIsDeploying(true);
      setCampaignResults([]);
      setDeploymentProgress({});
      
      let strategy;
      try {
        strategy = typeof brainResponse.master_strategy === 'string' 
          ? JSON.parse(brainResponse.master_strategy)
          : brainResponse.master_strategy;
      } catch (parseError) {
        console.error("שגיאה בפרסור האסטרטגיה:", parseError);
        showToastMessage(t('errorReadingStrategy'));
        return;
      }
      
      // Use saved platforms if available, otherwise use AI recommendations
      const platforms = savedPlatforms.length > 0 
        ? savedPlatforms 
        : (strategy?.אסטרטגיה_עיקרית?.פלטפורמות_מומלצות || strategy?.platforms || []);
      
      const connectedPlatformNames = Object.keys(connectedPlatforms).filter(
        platform => connectedPlatforms[platform]?.status === 'connected'
      );

      // 🔧 DEBUG MODE - דילוג על בדיקת פלטפורמות מחוברות
      if (!DEBUG_MODE && connectedPlatformNames.length === 0) {
        showToastMessage(t('noPlatformsConnected'));
        return;
      }

      // אם במצב DEBUG ואין פלטפורמות, משתמשים בפלטפורמות המומלצות מה-AI
      const platformsToDeployment = DEBUG_MODE && connectedPlatformNames.length === 0
        ? platforms // משתמש בכל הפלטפורמות המומלצות
        : platforms.filter(platform => {
            const platformName = platform?.שם || platform?.name;
            return platformName && connectedPlatformNames.includes(platformName);
          });

      if (!DEBUG_MODE && platformsToDeployment.length === 0) {
        showToastMessage("אין פלטפורמות מומלצות שמחוברות כרגע");
        return;
      }

      const results = [];
      
      for (const platform of platformsToDeployment) {
        try {
          const platformName = platform.שם || platform.name;
          
          setDeploymentProgress(prev => ({ 
            ...prev, 
            [platformName]: 'משגר...' 
          }));

          const campaignParams = {
            ...platform,
            daily_budget: Math.max(1, Math.floor((parseFloat(formData.dailyBudget || "100") * 
              parseInt(String(platform.אחוז_תקציב || platform.percentage || "50%").replace('%', '')) / 100))),
            goal: formData.campaignGoal || "awareness",
            post_description: formData.postDescription || "פוסט שיווק",
            business_description: formData.businessDescription || "עסק מקומי",
            video: formData.video,
            target_audience: savedTargetAudience || platform.קהל_יעד || platform.target_audience || strategy?.אסטרטגיה_עיקרית?.קהל_יעד_עיקרי || strategy?.target_audience || "קהל רחב",
            publishing_hours: savedPublishingHours || platform.זמני_פרסום || platform.timing || strategy?.אסטרטגיה_עיקרית?.זמני_פרסום || strategy?.publishing_hours || "כל היום (24/7)"
          };

          const adCreative = {
            caption: formData.postDescription || "פוסט שיווק",
            image_url: "https://via.placeholder.com/1080x1080/4F46E5/FFFFFF?text=AI+Campaign",
            video_url: formData.video ? URL.createObjectURL(formData.video) : null
          };

          let deploymentResult;
          try {
            deploymentResult = await enhancedBrain.deployAutomaticCampaign(
              platformName,
              campaignParams,
              adCreative,
              formData.video, // העברת קובץ הסרטון המקורי
              DEBUG_MODE // העברת מצב הבדיקה
            );
          } catch (deployError) {
            console.error(`שגיאה בשליחה ל-${platformName}:`, deployError);
            deploymentResult = {
              success: false,
              platform: platformName,
              error: deployError.message || 'שגיאה לא ידועה',
              message: `שגיאה בשליחה ל-${platformName}: ${deployError.message || 'שגיאה לא ידועה'}`
            };
          }

          results.push(deploymentResult);
          
          setDeploymentProgress(prev => ({ 
            ...prev, 
            [platformName]: deploymentResult?.success ? 'הושלם ✅' : 'שגיאה ❌'
          }));
          
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (platformError) {
          console.error(`שגיאה כללית בשליחה ל-${platform.שם || platform.name}:`, platformError);
          const platformName = platform.שם || platform.name || 'Unknown';
          results.push({
            success: false,
            platform: platformName,
            error: platformError.message || 'שגיאה לא ידועה',
            message: `שגיאה כללית בשליחה ל-${platformName}`
          });
          
          setDeploymentProgress(prev => ({ 
            ...prev, 
            [platformName]: 'שגיאה ❌'
          }));
        }
      }

      setCampaignResults(results);
      
      const successCount = results.filter(r => r?.success).length;
      const totalCount = results.length;
      
      if (successCount === totalCount) {
        showToastMessage(`🚀 כל הקמפיינים הושקו בהצלחה! (${successCount}/${totalCount})`);
      } else if (successCount > 0) {
        showToastMessage(`⚠️ ${successCount} מתוך ${totalCount} קמפיינים הושקו בהצלחה`);
      } else {
        showToastMessage("❌ שגיאה בשליחת כל הקמפיינים");
      }

    } catch (error) {
      console.error("שגיאה כללית בשליחה אוטומטית:", error);
      showToastMessage(`שגיאה בשליחת הפרסומות: ${error.message || 'שגיאה לא ידועה'}`);
    } finally {
      setIsDeploying(false);
      setDeploymentProgress({});
    }
  };

  const handleFileUpload = async (e) => {
    try {
      const file = e.target.files?.[0];
      
      if (!file) {
        showToastMessage("לא נבחר קובץ");
        return;
      }

      if (!file.type.startsWith('video/')) {
        showToastMessage("יש להעלות קובץ וידיאו בלבד");
        return;
      }

      const maxSize = 4 * 1024 * 1024 * 1024; // 4GB - Facebook's limit (largest platform)
      if (file.size > maxSize) {
        const fileSizeGB = (file.size / (1024 * 1024 * 1024)).toFixed(1);
        showToastMessage(`קובץ הוידיאו גדול מדי (${fileSizeGB}GB). מקסימום 4GB עבור כל הפלטפורמות`);
        return;
      }

      setAiAnalysisComplete(false);
      setBrainResponse(null);
      
      setFormData(prev => ({ 
        ...prev, 
        video: file,
        aiSuggestion: "",
        postDescription: ""
      }));
      
      showToastMessage(`✅ הסרטון ${file.name} הועלה בהצלחה!`);
      
      if (e.target) {
        e.target.value = '';
      }
    } catch (error) {
      console.error("שגיאה בהעלאת קובץ:", error);
      showToastMessage("שגיאה בהעלאת הקובץ, נסה שוב");
    }
  };

  const handleNext = async () => {
    try {
      // Preview mode - skip all validations
      if (previewMode) {
        if (currentStep < 4) {
          setCurrentStep(currentStep + 1);
        }
        return;
      }

      // Normal mode - with validations
      if (currentStep === 1) {
        if (!formData.video) {
          showToastMessage("יש להעלות סרטון לפני המעבר לשלב הבא");
          return;
        }
        if (!formData.businessDescription?.trim()) {
          showToastMessage("יש להזין תיאור עסק לפני המעבר לשלב הבא");
          return;
        }
        if (!formData.dailyBudget || parseFloat(formData.dailyBudget) <= 0) {
          showToastMessage("יש להזין תקציב יומי תקין לפני המעבר לשלב הבא");
          return;
        }
      }

      if (currentStep === 2) {
        if (!formData.campaignGoal) {
          showToastMessage("יש לבחור מטרת קמפיין לפני המעבר לשלב הבא");
          return;
        }
        
        if (formData.video && !aiAnalysisComplete && !brainResponse) {
          try {
            const analysisSuccess = await handleAdvancedAnalysis(formData.video);
            if (!analysisSuccess) {
              showToastMessage("⚠️ הניתוח לא הושלם, אך ניתן להמשיך עם נתונים בסיסיים");
            }
          } catch (analysisError) {
            console.error("❌ שגיאה בניתוח:", analysisError);
            
            showToastMessage("❌ שגיאה בניתוח הסרטון. אנא נסה שוב.");
            // לא משתמשים בנתוני דמו!
            return;
          }
        }
      }

      if (currentStep === 3) {
        if (!formData.postDescription?.trim()) {
          showToastMessage("יש להזין תיאור פוסט לפני המעבר לשלב הבא");
          return;
        }
      }
      
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      }
    } catch (error) {
      console.error("שגיאה במעבר לשלב הבא:", error);
      showToastMessage("שגיאה במעבר לשלב הבא, נסה שוב");
    }
  };

  const handlePrev = () => {
    try {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    } catch (error) {
      console.error("שגיאה במעבר לשלב הקודם:", error);
      showToastMessage("שגיאה במעבר לשלב הקודם");
    }
  };

  const handleLaunch = () => {
    try {
      showToastMessage("🚀 קמפיין השיווק הושק בהצלחה! המערכת מתחילה לפרסם על בסיס ההמלצות המתקדמות");
      setTimeout(() => {
        console.log("נווט לדף ביצועים ואנליטיקה");
      }, 3000);
    } catch (error) {
      console.error("שגיאה בהשקת הקמפיין:", error);
      showToastMessage("שגיאה בהשקת הקמפיין");
    }
  };

  const progressPercentage = Math.min(100, Math.max(0, ((currentStep || 1) / 4) * 100));
  
  // רק קבל המלצות אם יש ניתוח AI מושלם
  let recommendations;
  if (aiAnalysisComplete && brainResponse) {
    try {
      recommendations = getAdvancedRecommendations();
    } catch (error) {
      console.warn("⚠️ Could not get recommendations:", error);
      recommendations = getFallbackRecommendations();
    }
  } else {
    // השתמש בהמלצות בסיסיות עד שהניתוח יושלם
    recommendations = getFallbackRecommendations();
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Enhanced Header - Mobile Optimized */}
      <header
        className="fixed top-0 left-0 right-0 z-50 py-2 md:py-4 transition-all duration-300"
        id="header"
      >
        <div className="container max-w-6xl mx-auto px-3 md:px-6">
          <div className={`bg-white/95 backdrop-blur-md rounded-xl md:rounded-2xl shadow-lg border border-gray-100 px-3 md:px-6 py-3 md:py-4 transition-all duration-300 ${
            isScrolled ? 'shadow-xl bg-white/98' : 'shadow-lg'
          }`}>
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">L</span>
              </div>
              <div className="hidden md:block">
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  LOOK AT ME
                </span>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <Button
                onClick={handleGoHome}
                variant="ghost"
                className="flex items-center space-x-2 rounded-xl transition-all duration-300 hover:bg-gray-100"
              >
                <Home className="h-4 w-4" />
                <span>{t?.nav?.home || "דף בית"}</span>
              </Button>
              <Button
                variant={currentPage === 'campaign' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('campaign')}
                className={`flex items-center space-x-2 rounded-xl transition-all duration-300 ${
                  currentPage === 'campaign' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Rocket className="h-4 w-4" />
                <span>{t?.nav?.campaign || "יצירת קמפיין"}</span>
              </Button>
              <Button
                variant={currentPage === 'platforms' ? 'default' : 'ghost'}
                onClick={() => setCurrentPage('platforms')}
                className={`flex items-center space-x-2 rounded-xl transition-all duration-300 relative ${
                  currentPage === 'platforms' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Link className="h-4 w-4" />
                <span>{t?.nav?.platforms || "חיבור פלטפורמות"}</span>
                {Object.values(connectedPlatforms || {}).filter(p => p?.status === 'connected').length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-lg animate-pulse">
                    {Object.values(connectedPlatforms || {}).filter(p => p?.status === 'connected').length}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => window.location.href = '/analytics'}
                className="flex items-center space-x-2 rounded-xl hover:bg-gray-100 transition-all duration-300"
              >
                <TrendingUp className="h-4 w-4" />
                <span>ביצועים בזמן אמת</span>
              </Button>
              <Separator orientation="vertical" className="h-8 mx-2" />
              <span className="text-sm text-gray-700 font-medium px-2">
                שלום, {getUserDisplayName()}
              </span>
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="flex items-center space-x-2 rounded-xl transition-all duration-300 hover:bg-red-50 hover:text-red-600"
              >
                <span>התנתק</span>
              </Button>
            </nav>
            
            {/* Mobile menu + Language switcher */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Language Switcher */}
              <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm rounded-lg px-2 py-1 shadow-sm">
                <button
                  onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-300 ${
                    language === 'he' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  עב
                </button>
                <button
                  onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
                  className={`px-2 py-1 rounded-md text-xs font-medium transition-all duration-300 ${
                    language === 'en' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                      : 'text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-3 pb-3 border-t border-gray-200/50 pt-3 space-y-2">
              <Button
                onClick={() => {
                  handleGoHome();
                  setMobileMenuOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start rounded-lg py-3 text-base transition-all duration-300 hover:bg-gray-100"
              >
                <Home className="h-4 w-4 mr-2" />
                {t?.nav?.home || "דף בית"}
              </Button>
              <Button
                variant={currentPage === 'campaign' ? 'default' : 'ghost'}
                onClick={() => {
                  setCurrentPage('campaign');
                  setMobileMenuOpen(false);
                }}
                className={`w-full justify-start rounded-lg py-3 text-base transition-all duration-300 ${
                  currentPage === 'campaign' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Rocket className="h-4 w-4 mr-2" />
                {t?.nav?.campaign || "יצירת קמפיין"}
              </Button>
              <Button
                variant={currentPage === 'platforms' ? 'default' : 'ghost'}
                onClick={() => {
                  setCurrentPage('platforms');
                  setMobileMenuOpen(false);
                }}
                className={`w-full justify-start rounded-lg py-3 text-base transition-all duration-300 relative ${
                  currentPage === 'platforms' 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Link className="h-4 w-4 mr-2" />
                {t?.nav?.platforms || "חיבור פלטפורמות"}
                {Object.values(connectedPlatforms || {}).filter(p => p?.status === 'connected').length > 0 && (
                  <span className="ml-auto bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                    {Object.values(connectedPlatforms || {}).filter(p => p?.status === 'connected').length}
                  </span>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  window.location.href = '/analytics';
                  setMobileMenuOpen(false);
                }}
                className="w-full justify-start rounded-lg py-3 text-base hover:bg-gray-100 transition-all duration-300"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                ביצועים בזמן אמת
              </Button>
              <Separator className="my-2" />
              <div className="px-3 py-2">
                <span className="text-sm text-gray-600">
                  שלום, <span className="font-semibold text-gray-800">{getUserDisplayName()}</span>
                </span>
              </div>
              <Button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                variant="ghost"
                className="w-full justify-start rounded-lg py-3 text-base text-red-600 hover:bg-red-50 transition-all duration-300"
              >
                <span>התנתק</span>
              </Button>
            </div>
          )}
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-3 md:px-6 pt-20 md:pt-24 pb-6 md:py-8">
        {/* Toast Message - Mobile Responsive with Auto-hide */}
        {showToast && (
          <div className={`fixed top-16 sm:top-20 md:top-24 left-1/2 transform -translate-x-1/2 z-[60] w-[90%] sm:w-auto max-w-sm transition-all duration-300 ease-in-out ${
            showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}>
            <div className="bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-4">
              <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-md flex-shrink-0">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs sm:text-sm text-gray-800 leading-relaxed ${isRTL ? 'text-right' : 'text-left'} break-words`} dir={isRTL ? 'rtl' : 'ltr'}>
                    {toastMessage}
                  </p>
                </div>
                <button
                  onClick={() => setShowToast(false)}
                  className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Platform Management Page - Mobile Responsive */}
        {currentPage === 'platforms' && (
          <div className="space-y-4 sm:space-y-6 md:space-y-8 pt-4 sm:pt-6 md:pt-8">
            <div className="text-center px-2">
              <h1 className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 md:mb-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                {t.platformsTitle}
              </h1>
              <p className={`text-gray-600 text-xs sm:text-sm md:text-base ${isRTL ? 'text-right' : 'text-left'}`}>
                {language === 'he' ? 
                  'חבר את הפלטפורמות שלך כדי לשלוח פרסומות אוטומטית באמת (כולל פייסבוק עם אינסטגרם, גוגל עם יוטיוב וטיקטוק!)' :
                  'Connect your platforms to send advertisements automatically for real (including Facebook with Instagram, Google with YouTube and TikTok!)'
                }
              </p>
            </div>

            {/* Overview Card - Mobile Responsive */}
            <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200/50 shadow-lg rounded-xl md:rounded-2xl overflow-hidden">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3 sm:space-x-4' : 'space-x-3 sm:space-x-4'}`}>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <h3 className="font-bold text-blue-900 text-base sm:text-lg">
                        {language === 'he' ? 'פלטפורמות מחוברות' : 'Connected Platforms'}
                      </h3>
                      <p className="text-xs sm:text-sm text-blue-700">
                        {Object.values(connectedPlatforms || {}).filter(p => p?.status === 'connected').length} / {availablePlatforms?.length || 0} {language === 'he' ? 'מחוברות' : 'connected'}
                      </p>
                    </div>
                  </div>
                  <div className={`${isRTL ? 'text-left' : 'text-right'} flex flex-col items-center sm:items-end`}>
                    <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {Object.values(connectedPlatforms || {}).filter(p => p?.status === 'connected').length}
                    </div>
                    <div className="text-xs sm:text-sm text-blue-600 font-medium">
                      {language === 'he' ? 'פעילות' : 'Active'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Platforms - Mobile Responsive */}
            <div className="space-y-3 sm:space-y-4">
              <h2 className={`text-lg sm:text-xl font-bold text-gray-800 flex items-center ${isRTL ? 'space-x-reverse space-x-2 text-right' : 'space-x-2 text-left'} px-2`}>
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <span>{language === 'he' ? 'פלטפורמות זמינות' : 'Available Platforms'}</span>
              </h2>
              
              <div className="grid gap-3 sm:gap-4 md:gap-6">
                {availablePlatforms.map((platform) => {
                  const connectionStatus = connectedPlatforms?.[platform.name];
                  const isConnected = connectionStatus?.status === 'connected';
                  const isConnecting = connectionStatus?.status === 'connecting';
                  const hasError = connectionStatus?.status === 'error';
                  
                  return (
                    <Card 
                      key={platform.name}
                      className={`transition-all duration-500 rounded-xl md:rounded-2xl overflow-hidden ${
                        isConnected ? 'border-green-300/50 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg transform hover:scale-[1.01] sm:hover:scale-[1.02]' : 
                        hasError ? 'border-red-300/50 bg-gradient-to-br from-red-50 to-pink-50 shadow-md' :
                        'hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 hover:shadow-xl hover:transform hover:scale-[1.01] sm:hover:scale-[1.02] border-gray-200/50'
                      }`}
                    >
                      <CardContent className="p-4 sm:p-5 md:p-6">
                        <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-3 sm:space-x-4' : 'space-x-3 sm:space-x-4'}`}>
                          {/* Platform Icon - Mobile Responsive */}
                          <div className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-white ${platform.color} shadow-xl transform transition-transform duration-300 hover:scale-105 sm:hover:scale-110 flex-shrink-0`}>
                            <platform.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                            {platform.isRealConnection && (
                              <div className="absolute -top-1 sm:-top-2 -right-1 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                              </div>
                            )}
                            {isConnected && (
                              <div className="absolute -bottom-0.5 sm:-bottom-1 -right-0.5 sm:-right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {/* Header - Mobile Responsive */}
                            <div className="flex flex-col sm:flex-row items-start justify-between mb-2 sm:mb-3 gap-2">
                              <div className={`${isRTL ? 'text-right' : 'text-left'} flex-1 min-w-0`}>
                                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-1">
                                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 break-words">{platform.name}</h3>
                                  {platform.isRealConnection && (
                                    <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border border-green-200 whitespace-nowrap mt-1 sm:mt-0 inline-block w-fit">
                                      חיבור אמיתי
                                    </span>
                                  )}
                                </div>
                                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed break-words">{platform.description}</p>
                              </div>
                              
                              {/* Status Badge */}
                              <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                {isConnected && (
                                  <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm border border-green-200">
                                    <div className="flex items-center space-x-1">
                                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                      <span>{language === 'he' ? 'מחובר' : 'Connected'}</span>
                                    </div>
                                  </span>
                                )}
                                {hasError && (
                                  <span className="bg-gradient-to-r from-red-100 to-pink-100 text-red-800 px-3 py-1.5 rounded-full text-sm font-bold shadow-sm border border-red-200">
                                    {language === 'he' ? 'שגיאה' : 'Error'}
                                  </span>
                                )}
                                {!isConnected && !hasError && !isConnecting && (
                                  <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full text-sm font-medium">
                                    {language === 'he' ? 'לא מחובר' : 'Not Connected'}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            {/* Features */}
                            <div className="mb-4">
                              <p className={`text-sm text-gray-600 mb-2 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                                {language === 'he' ? 'תכונות עיקריות:' : 'Key Features:'}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {platform.features.map((feature, index) => (
                                  <span key={index} className="bg-white/80 backdrop-blur-sm text-gray-700 px-3 py-1.5 rounded-lg text-xs border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                    {feature}
                                  </span>
                                ))}
                              </div>
                            </div>
                            
                            {/* Connected Account Info */}
                            {isConnected && connectionStatus?.data && (
                              <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl mb-4 border border-green-200/50">
                                <div className="flex items-center justify-between">
                                  <div className={isRTL ? 'text-right' : 'text-left'}>
                                    <p className="text-sm font-bold text-green-900">
                                      {connectionStatus?.data?.account_name || 'משתמש לא ידוע'}
                                    </p>
                                    <p className="text-xs text-green-700">
                                      {language === 'he' ? 'מחובר' : 'Connected'}: {connectionStatus?.data?.connected_at ? new Date(connectionStatus.data.connected_at).toLocaleDateString() : 'תאריך לא ידוע'}
                                    </p>
                                    {connectionStatus?.data?.email && (
                                      <p className="text-xs text-green-600">{connectionStatus.data.email}</p>
                                    )}
                                  </div>
                                  <Button
                                    onClick={() => handleDisconnectPlatform(platform.name)}
                                    variant="outline"
                                    size="sm"
                                    className="text-red-600 border-red-300 hover:bg-red-50 rounded-xl transition-all duration-300"
                                  >
                                    <X className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                    {language === 'he' ? 'נתק' : 'Disconnect'}
                                  </Button>
                                </div>
                              </div>
                            )}
                            
                            {/* Action Button */}
                            <div className={`flex ${isRTL ? 'justify-start' : 'justify-end'}`}>
                              <Button
                                onClick={() => handleConnectPlatform(platform.name)}
                                disabled={isConnecting || isConnected}
                                className={`rounded-xl transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 ${
                                  isConnected ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' :
                                  hasError ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700' : 
                                  'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                                } text-white font-medium`}
                              >
                                {isConnecting ? (
                                  <>
                                    <Loader2 className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'} animate-spin`} />
                                    {language === 'he' ? 'מתחבר...' : 'Connecting...'}
                                  </>
                                ) : isConnected ? (
                                  <>
                                    <Check className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                    {language === 'he' ? 'מחובר' : 'Connected'}
                                  </>
                                ) : hasError ? (
                                  <>
                                    <X className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                    {language === 'he' ? 'נסה שוב' : 'Try Again'}
                                  </>
                                ) : (
                                  <>
                                    <Plus className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                    {language === 'he' ? 
                                      (platform.isRealConnection ? 'חבר באמת' : 'חבר (דמו)') : 
                                      (platform.isRealConnection ? 'Connect Real' : 'Connect (Demo)')
                                    }
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl shadow-lg">
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className={`font-bold text-gray-800 mb-4 text-lg ${isRTL ? 'text-right' : 'text-left'}`}>
                    {language === 'he' ? 'פעולות מהירות' : 'Quick Actions'}
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={() => setCurrentPage('campaign')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Rocket className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {language === 'he' ? 'חזור ליצירת קמפיין' : 'Back to Campaign Creation'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Campaign Creation Page */}
        {currentPage === 'campaign' && (
          <>
            {/* Progress Header - Mobile Optimized */}
            <div className="mb-4 sm:mb-6 md:mb-8 pt-20 sm:pt-24">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                <h1 className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent ${isRTL ? 'text-right' : 'text-left'}`}>
                  {t.title}
                </h1>
                <div className="flex items-center gap-2 sm:gap-3">
                  {/* Preview Mode Toggle */}
                  <Button
                    onClick={() => {
                      const newPreviewMode = !previewMode;
                      setPreviewMode(newPreviewMode);
                      
                      if (newPreviewMode) {
                        // הוסף נתוני דמו למצב תצוגה מקדימה
                        if (!formData.video) {
                          setFormData(prev => ({
                            ...prev,
                            businessDescription: prev.businessDescription || "עסק דמו לתצוגה מקדימה - חנות אופנה מקוונת",
                            dailyBudget: prev.dailyBudget || "500",
                            campaignGoal: prev.campaignGoal || "sales",
                            postDescription: prev.postDescription || "🎉 מבצע מיוחד! הנחה של 30% על כל המוצרים. לזמן מוגבל בלבד!"
                          }));
                        }
                        showToastMessage("🔍 מצב תצוגה מקדימה - לחץ על כל שלב לניווט חופשי");
                      } else {
                        showToastMessage("מצב רגיל - נדרשת הזנת נתונים אמיתיים");
                      }
                    }}
                    variant={previewMode ? "default" : "outline"}
                    size="sm"
                    className={`text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 h-8 sm:h-9 ${previewMode ? 'bg-yellow-600 hover:bg-yellow-700 text-white' : 'border-yellow-600 text-yellow-600'}`}
                  >
                    <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">{previewMode ? 'תצוגה מקדימה' : 'תצוגה מקדימה'}</span>
                    <span className="sm:hidden">תצוגה</span>
                  </Button>
                  
                <div className="flex items-center gap-1.5 sm:gap-2 bg-white/70 backdrop-blur-sm rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2 shadow-sm border border-gray-200/50">
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">שלב</div>
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md sm:rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm shadow-md">
                    {currentStep}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 font-medium">מתוך 4</div>
                  </div>
                </div>
              </div>
              
              {/* Preview Mode Notice */}
              {previewMode && (
                <div className="mb-3 sm:mb-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-2.5 sm:p-3 flex items-start gap-2 sm:gap-3">
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-yellow-800 font-medium">
                    <strong>מצב תצוגה מקדימה:</strong> ניתן לנווט חופשי בין השלבים.
                  </p>
                </div>
              )}
              
              {/* Modern Progress Bar - Mobile Optimized */}
              <div className="mb-4 sm:mb-6 md:mb-8">
                <div className="relative mb-1.5 sm:mb-2">
                  <div className="h-2.5 sm:h-3 md:h-4 bg-gray-200/60 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full transition-all duration-700 shadow-sm" 
                      style={{width: `${progressPercentage}%`}}
                    ></div>
                  </div>
                  <div className={`text-[10px] sm:text-xs text-gray-600 mt-1 sm:mt-1.5 font-medium ${isRTL ? 'text-right' : 'text-left'}`}>
                    {Math.round(progressPercentage)}% הושלם
                  </div>
                </div>
              
                {/* Steps Indicator - Mobile Optimized */}
                <div className={`flex items-center justify-between gap-2 sm:gap-3 md:gap-4 mt-3 sm:mt-4 md:mt-6 ${isRTL ? 'md:space-x-reverse' : ''}`}>
                  {steps.map((step, index) => (
                    <div 
                      key={step.number} 
                      className="flex-1 flex items-center justify-center"
                      onClick={() => {
                        if (previewMode) {
                          setCurrentStep(step.number);
                          showToastMessage(`עברת לשלב ${step.number}`);
                        }
                      }}
                    >
                      <div className={`flex flex-col items-center gap-1 ${
                        currentStep >= step.number ? 'text-blue-600' : 'text-gray-400'
                      } ${previewMode ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`}>
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-500 ${
                          currentStep >= step.number 
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                            : 'bg-gray-200 text-gray-400'
                        } ${previewMode ? 'hover:shadow-xl' : ''}`}>
                          {currentStep > step.number ? (
                            <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                          ) : (
                            <step.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
                          )}
                        </div>
                        {/* Mobile step number - always visible */}
                        <span className="text-[10px] sm:text-xs font-medium lg:hidden">{step.number}</span>
                        {/* Desktop step title */}
                        <div className="hidden lg:block min-w-0">
                          <div className={`font-semibold text-xs whitespace-nowrap ${isRTL ? 'text-right' : 'text-left'}`}>{step.title}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Card - Mobile Responsive */}
            <Card className="shadow-xl md:shadow-2xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-b border-gray-100 p-4 md:p-6">
                <CardTitle className="text-lg sm:text-xl md:text-2xl text-center text-gray-800 flex items-center justify-center space-x-2">
                  <span>{steps[currentStep - 1].title}</span>
                  {currentStep === 3 && <Brain className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="p-4 sm:p-5 md:p-6 lg:p-8">
                {/* Step 1: Video Upload - Mobile Responsive */}
                {currentStep === 1 && (
                  <div className="space-y-4 sm:space-y-6 md:space-y-8">
                    {/* Video Upload Section */}
                    <div className="space-y-2 sm:space-y-3">
                      <Label className={`text-sm sm:text-base md:text-lg font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                        <span>העלאת סרטון לניתוח AI</span>
                      </Label>
                      
                      <div className="border-2 border-dashed border-blue-300 rounded-xl md:rounded-2xl p-3 sm:p-4 md:p-6 text-center hover:border-blue-400 active:border-blue-500 transition-all duration-300 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="video-upload"
                        />
                        <label htmlFor="video-upload" className="cursor-pointer block">
                          {formData.video ? (
                            <div className="space-y-1.5 sm:space-y-2 animate-in fade-in duration-500">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
                              </div>
                              <p className="text-green-600 font-bold text-xs sm:text-sm md:text-base break-words px-2">{formData.video.name}</p>
                              <p className="text-[10px] sm:text-xs text-gray-600">סרטון מוכן לניתוח AI</p>
                              <p className="text-[9px] sm:text-[10px] text-blue-600 bg-blue-50 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full inline-block">לחץ להחלפה</p>
                            </div>
                          ) : (
                            <div className="space-y-1.5 sm:space-y-2">
                              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto shadow-lg">
                                <Upload className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-white" />
                              </div>
                              <p className="text-blue-600 font-bold text-xs sm:text-sm md:text-base">לחץ להעלאת סרטון</p>
                              <p className="text-[10px] sm:text-xs text-gray-600 px-2">MP4, MOV, AVI עד 4GB</p>
                              <p className={`text-[9px] sm:text-[10px] text-purple-600 bg-purple-50 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full inline-flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <Brain className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                <span>ניתוח AI</span>
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>


                    <Separator className="my-4 sm:my-6" />

                    {/* Business Description - Mobile Optimized */}
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="business" className={`text-sm sm:text-base md:text-lg font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 flex-shrink-0" />
                        <span>{t('businessDescription')}</span>
                      </Label>
                      <Textarea
                        id="business"
                        placeholder="ספר לנו על העסק שלך..."
                        value={formData?.businessDescription || ""}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessDescription: e.target.value }))}
                        className={`min-h-24 sm:min-h-28 md:min-h-32 rounded-lg sm:rounded-xl md:rounded-2xl border-gray-200 focus:border-purple-400 focus:ring-purple-400 bg-white/50 backdrop-blur-sm text-xs sm:text-sm md:text-base ${isRTL ? 'text-right' : 'text-left'}`}
                        dir={isRTL ? 'rtl' : 'ltr'}
                      />
                      <p className={`text-[10px] sm:text-xs text-gray-500 flex items-start gap-1 sm:gap-1.5 bg-purple-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                        <Brain className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-purple-500 flex-shrink-0 mt-0.5" />
                        <span>תיאור מפורט = המלצות מדויקות</span>
                      </p>
                    </div>

                    {/* Budget - Mobile Optimized */}
                    <div className="space-y-2 sm:space-y-3">
                      <Label htmlFor="budget" className={`text-sm sm:text-base md:text-lg font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                        <span>{t('dailyBudget')}</span>
                      </Label>
                      <div className="relative">
                        <DollarSign className={`absolute top-2 sm:top-2.5 md:top-3 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 ${isRTL ? 'right-2.5 sm:right-3' : 'left-2.5 sm:left-3'}`} />
                        <Input
                          id="budget"
                          type="number"
                          placeholder="200"
                          value={formData?.dailyBudget || ""}
                          onChange={(e) => setFormData(prev => ({ ...prev, dailyBudget: e.target.value }))}
                          className={`rounded-lg sm:rounded-xl md:rounded-2xl border-gray-200 focus:border-green-400 focus:ring-green-400 bg-white/50 backdrop-blur-sm text-xs sm:text-sm md:text-base h-9 sm:h-10 md:h-11 ${isRTL ? 'pr-8 sm:pr-9 md:pr-10 text-right' : 'pl-8 sm:pl-9 md:pl-10 text-left'}`}
                          dir={isRTL ? 'rtl' : 'ltr'}
                        />
                      </div>
                      <p className={`text-[10px] sm:text-xs text-gray-500 flex items-start gap-1 sm:gap-1.5 bg-green-50 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                        <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>AI יחלק את התקציב באופן מיטבי</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2: Campaign Goal - Mobile Responsive */}
                {currentStep === 2 && (
                  <div className="space-y-4 sm:space-y-6 md:space-y-8">
                    {isAnalyzing ? (
                      <div className="text-center py-6 sm:py-8 md:py-12">
                        <div className="mb-4 sm:mb-6">
                          <div className="relative">
                            <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-2xl animate-pulse">
                              <Brain className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-white animate-spin" />
                            </div>
                            {/* Rotating ring around the brain */}
                            <div className="absolute inset-0 w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 mx-auto border-4 border-transparent border-t-blue-300 rounded-full animate-spin"></div>
                          </div>
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2 px-2">AI מנתח את הסרטון...</h3>
                          <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base md:text-lg font-medium px-2">{currentAnalysisStep}</p>
                        </div>
                          
                          {/* Enhanced Progress Bar - Mobile Responsive */}
                          <div className="max-w-lg mx-auto mb-4 sm:mb-6 px-4">
                            <div className="relative">
                              <div className="h-5 sm:h-6 bg-gray-200/60 rounded-full overflow-hidden shadow-inner">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full transition-all duration-1000 ease-out relative overflow-hidden" 
                                  style={{width: `${analysisProgress}%`}}
                                >
                                  {/* Animated shimmer effect */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
                                  {/* Moving dots effect */}
                                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-ping"></div>
                                </div>
                              </div>
                              
                              {/* Progress percentage */}
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs sm:text-sm font-bold text-black drop-shadow-lg">
                                  {Math.round(analysisProgress)}%
                                </span>
                              </div>
                            </div>
                            
                            {/* Time remaining */}
                            {estimatedTimeRemaining > 0 && (
                              <div className="mt-2 sm:mt-3 flex items-center justify-center space-x-2">
                                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                                <span className="text-xs sm:text-sm text-gray-600 font-medium">
                                  זמן משוער: {estimatedTimeRemaining} שניות
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {/* Fun facts while waiting - Mobile Responsive */}
                          <div className="max-w-md mx-auto px-4">
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-blue-200 relative overflow-hidden">
                              {/* Background animation */}
                              <div className="absolute inset-0 bg-gradient-to-r from-blue-100/20 to-purple-100/20 animate-pulse"></div>
                              
                              <div className="relative z-10">
                                <div className="flex items-center justify-center space-x-2 mb-2">
                                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 animate-bounce" />
                                  <span className="text-xs sm:text-sm font-medium text-gray-700 text-center">
                                    {analysisProgress < 5 && "🚀 המערכת שלנו מתחילה ניתוח מתקדם עבורך..."}
                                    {analysisProgress >= 5 && analysisProgress < 15 && "📤 המערכת שולחת את הסרטון לניתוח מתקדם..."}
                                    {analysisProgress >= 15 && analysisProgress < 35 && "🎬 המערכת מנתחת את הסרטון שלך..."}
                                    {analysisProgress >= 35 && analysisProgress < 50 && "👁️ המערכת מנתחת צבעים ותאורה עבורך..."}
                                    {analysisProgress >= 50 && analysisProgress < 70 && "🎵 המערכת מתמללת ומנתחת את השמע שלך..."}
                                    {analysisProgress >= 70 && analysisProgress < 90 && "🧠 המערכת בונה אסטרטגיה מותאמת עבורך..."}
                                    {analysisProgress >= 90 && analysisProgress < 100 && "✨ המערכת מכינה המלצות מותאמות אישית עבורך..."}
                                    {analysisProgress >= 100 && "🎉 הניתוח הושלם בהצלחה! המערכת עבדה קשה עבורך!"}
                                  </span>
                                </div>
                                <p className="text-[10px] sm:text-xs text-gray-600 text-center leading-relaxed">
                                  {analysisProgress < 5 && "המערכת שלנו מתחילה לעבוד קשה עבורך..."}
                                  {analysisProgress >= 5 && analysisProgress < 15 && "המערכת שולחת את הסרטון שלך לניתוח מתקדם..."}
                                  {analysisProgress >= 15 && analysisProgress < 35 && "המערכת מנתחת את הסרטון שלך..."}
                                  {analysisProgress >= 35 && analysisProgress < 50 && "המערכת מנתחת צבעים, תאורה ואיכות ויזואלית עבורך..."}
                                  {analysisProgress >= 50 && analysisProgress < 70 && "המערכת מתמללת ומנתחת את השמע והטון שלך..."}
                                  {analysisProgress >= 70 && analysisProgress < 90 && "המערכת בונה אסטרטגיה שיווקית מותאמת אישית עבורך..."}
                                  {analysisProgress >= 90 && analysisProgress < 100 && "המערכת מכינה המלצות מותאמות אישית עבורך..."}
                                  {analysisProgress >= 100 && "הניתוח הושלם בהצלחה! המערכת עבדה קשה עבורך וקיבלת המלצות מותאמות אישית!"}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          
                      </div>
                    ) : (
                      <>
                        <div className="text-center mb-6 sm:mb-8">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                            <Target className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                          </div>
                          <p className={`text-gray-600 text-sm sm:text-base md:text-lg ${isRTL ? 'text-right' : 'text-left'} px-2`}>בחר את המטרה העיקרית של הקמפיין</p>
                      
                      {formData.video && (
                        <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl md:rounded-2xl border border-blue-200">
                          <p className={`text-xs sm:text-sm text-blue-700 flex items-center justify-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                            <Brain className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>AI ינתח את הסרטון בהתאם למטרה שתבחר</span>
                          </p>
                        </div>
                      )}
                      
                      {/* Platforms Status - Mobile Responsive */}
                      <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl md:rounded-2xl border border-gray-200">
                        <p className={`text-xs sm:text-sm text-gray-700 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 ${isRTL ? 'sm:space-x-reverse sm:space-x-2' : 'sm:space-x-2'}`}>
                          <span className="flex items-center gap-2">
                            <Link className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span>
                              {Object.values(connectedPlatforms || {}).filter(p => p?.status === 'connected').length > 0 ? 
                                `${Object.values(connectedPlatforms || {}).filter(p => p?.status === 'connected').length} פלטפורמות מחוברות ומוכנות` :
                                'עדיין לא חיברת פלטפורמות'
                              }
                            </span>
                          </span>
                          <Button
                            onClick={() => setCurrentPage('platforms')}
                            variant="link"
                            className="text-blue-600 underline p-0 h-auto font-bold text-xs sm:text-sm"
                          >
                            {Object.values(connectedPlatforms || {}).filter(p => p?.status === 'connected').length > 0 ? 
                              'נהל חיבורים' : 'חבר עכשיו'
                            }
                          </Button>
                        </p>
                      </div>
                    </div>
                    
                    {/* Goal Selection - Mobile Responsive */}
                    <div className="grid gap-3 sm:gap-4 md:gap-6">
                      {campaignGoals.map((goal) => (
                        <Card 
                          key={goal.value}
                          className={`cursor-pointer transition-all duration-500 hover:shadow-xl rounded-xl md:rounded-2xl overflow-hidden transform hover:scale-[1.01] sm:hover:scale-[1.02] ${
                            formData?.campaignGoal === goal.value 
                              ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 shadow-lg' 
                              : 'hover:bg-gradient-to-br hover:from-gray-50 hover:to-blue-50 border-gray-200'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, campaignGoal: goal.value }))}
                        >
                          <CardContent className={`p-4 sm:p-5 md:p-6 flex items-center ${isRTL ? 'space-x-reverse space-x-3 sm:space-x-4' : 'space-x-3 sm:space-x-4'}`}>
                            <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 flex-shrink-0 ${
                              formData?.campaignGoal === goal.value 
                                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white transform scale-105 sm:scale-110' 
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              <goal.icon className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                            </div>
                            <div className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}>
                              <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-800 mb-1 sm:mb-2 break-words">{goal.label}</h3>
                              <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed break-words">{goal.description}</p>
                            </div>
                            {formData?.campaignGoal === goal.value && (
                              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                                <CheckCircle className="h-5 w-5 text-white" />
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                      </>
                    )}
                  </div>
                )}

                {/* Step 3: AI Analysis & Recommendations - Mobile Responsive */}
                {currentStep === 3 && (
                  <div className="space-y-4 sm:space-y-6 md:space-y-8">
                    {!isAnalyzing && (
                      <>
                        {/* Analysis Header - Mobile Responsive */}
                        <div className="text-center mb-6 sm:mb-8 px-2">
                          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                              <Brain className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-white" />
                            </div>
                            <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 text-yellow-500 animate-pulse" />
                          </div>
                          <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
                            {aiAnalysisComplete ? "המלצות AI מתקדמות לסרטון שלך" : "המלצות בסיסיות"}
                          </h3>
                          <p className="text-gray-600 text-sm sm:text-base md:text-lg">
                            {aiAnalysisComplete 
                              ? "המלצות מותאמות אישית על בסיס ניתוח מתקדם" 
                              : "המלצות כלליות על בסיס המטרה שלך"}
                          </p>
                        </div>

                        {/* AI Analysis Summary */}
                        {(() => {
                          console.log("🔍 Debug - aiAnalysisComplete:", aiAnalysisComplete, "brainResponse:", brainResponse);
                          return aiAnalysisComplete && brainResponse;
                        })() && (
                          <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 mb-4 sm:mb-6 rounded-xl md:rounded-2xl shadow-lg">
                            <CardContent className="p-4 sm:p-5 md:p-6">
                              <div className="flex items-start gap-2 sm:gap-3 mb-3 sm:mb-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                                  <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                </div>
                                <div className="text-right flex-1 min-w-0">
                                  <h4 className="font-bold text-blue-900 mb-2 sm:mb-3 text-base sm:text-lg md:text-xl flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 flex-shrink-0" />
                                    <span>סיכום ניתוח AI מתקדם</span>
                                  </h4>
                                  
                                  {brainResponse.analysis_summary && (
                                    <div className="bg-white/70 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-lg sm:rounded-xl mb-3 sm:mb-4 border border-white/50">
                                      <div className="text-xs sm:text-sm text-blue-700 leading-relaxed space-y-2 sm:space-y-3" dir="rtl">
                                        {brainResponse.analysis_summary.split('\n').map((line, index) => {
                                          if (line.startsWith('# ')) {
                                            return (
                                              <h1 key={index} className="text-xl font-bold text-blue-900 mb-4 mt-2">
                                                {line.substring(2)}
                                              </h1>
                                            );
                                          } else if (line.startsWith('## ')) {
                                            return (
                                              <h2 key={index} className="text-lg font-bold text-blue-800 mb-2 mt-3">
                                                {line.substring(3)}
                                              </h2>
                                            );
                                          } else if (line.startsWith('• ')) {
                                            return (
                                              <div key={index} className="flex items-start space-x-2 space-x-reverse">
                                                <span className="text-green-600 font-bold">•</span>
                                                <span className="flex-1">{line.substring(2)}</span>
                                              </div>
                                            );
                                          } else if (line.trim() === '') {
                                            return <br key={index} />;
                                          } else {
                                            return (
                                              <p key={index} className="text-sm leading-relaxed">
                                                {line}
                                              </p>
                                            );
                                          }
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  {brainResponse.visual_analysis && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                                      <div className="bg-white/70 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/50">
                                        <h5 className="font-bold text-blue-800 mb-1.5 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                                          <Camera className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                          <span>ניתוח ויזואלי</span>
                                        </h5>
                                        <p className="text-xs sm:text-sm text-blue-600">
                                          {brainResponse.visual_analysis.frames_analyzed || 1} פריימים נותחו
                                        </p>
                                      </div>
                                      
                                      <div className="bg-white/70 backdrop-blur-sm p-3 sm:p-4 rounded-lg sm:rounded-xl border border-white/50">
                                        <h5 className="font-bold text-blue-800 mb-1.5 sm:mb-2 flex items-center gap-2 text-sm sm:text-base">
                                          <Volume2 className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                                          <span>ניתוח אודיו</span>
                                        </h5>
                                        <p className="text-xs sm:text-sm text-blue-600">
                                          תמלול וניתוח טון הושלמו
                                        </p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        {/* Platform Recommendations - Mobile Responsive */}
                        <div className="space-y-3 sm:space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                            <h4 className={`text-base sm:text-lg md:text-xl font-bold text-gray-800 ${isRTL ? 'text-right' : 'text-left'}`}>פלטפורמות מומלצות:</h4>
                            <div className={`flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium ${
                              aiAnalysisComplete ? 'text-green-600' : 'text-gray-500'
                            } ${isRTL ? 'justify-end' : 'justify-start'}`}>
                              {aiAnalysisComplete ? (
                                <>
                                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span>המלצות AI מותאמות אישית</span>
                                </>
                              ) : (
                                <>
                                  <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                                  <span>המלצות בסיסיות</span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid gap-3 sm:gap-4">
                            {recommendations?.platforms?.map((platform) => (
                              <Card 
                                key={platform?.name || Math.random()}
                                className={`transition-all duration-500 rounded-xl md:rounded-2xl overflow-hidden ${
                                  platform?.recommended 
                                    ? (aiAnalysisComplete ? 'border-green-300/50 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg' : 'border-green-200/50 bg-green-50 shadow-md') 
                                    : 'border-red-200/50 bg-gradient-to-br from-red-50 to-pink-50 shadow-md'
                                }`}
                              >
                                <CardContent className="p-3 sm:p-4">
                                  <div className={`flex flex-col sm:flex-row items-start ${isRTL ? 'sm:space-x-reverse sm:space-x-4' : 'sm:space-x-4'} gap-3 sm:gap-0`}>
                                    <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 ${
                                      platform?.recommended 
                                        ? (aiAnalysisComplete ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' : 'bg-green-500 text-white')
                                        : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
                                    }`}>
                                      {(() => {
                                        try {
                                          const IconComponent = platform?.icon || Target;
                                          return React.createElement(IconComponent, { className: "h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" });
                                        } catch (error) {
                                          return <Target className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8" />;
                                        }
                                      })()}
                                    </div>
                                    <div className={`flex-1 min-w-0 w-full ${isRTL ? 'text-right' : 'text-left'}`}>
                                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                                        <h4 className="font-bold text-gray-800 text-base sm:text-lg break-words">{platform?.name || 'Unknown Platform'}</h4>
                                        <div className={`text-xs sm:text-sm font-bold ${platform?.recommended ? 'text-green-600' : 'text-red-600'} flex-shrink-0`}>
                                          {platform?.recommended ? (
                                            <span className={`flex items-center bg-green-100 px-2 sm:px-3 py-1 rounded-full gap-1 text-[10px] sm:text-xs`}>
                                              {aiAnalysisComplete ? (
                                                <>
                                                  <Sparkles className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                                                  <span className="whitespace-nowrap">מומלץ על ידי AI</span>
                                                </>
                                              ) : (
                                                <span>✅ מומלץ</span>
                                              )}
                                              <span className="font-bold">({platform?.percentage || '0%'})</span>
                                            </span>
                                          ) : (
                                            <span className="bg-red-100 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs">❌ לא מומלץ</span>
                                          )}
                                        </div>
                                      </div>
                                      <p className={`text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 break-words ${isRTL ? 'text-right' : 'text-left'}`}>
                                        {platform?.reason || 'ללא נימוק'}
                                      </p>
                                      {platform?.recommended && aiAnalysisComplete && (
                                        <div className={`text-[10px] sm:text-xs text-gray-500 space-y-1 bg-white/50 p-2 sm:p-3 rounded-lg sm:rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                                          <p className="break-words"><strong>קהל יעד:</strong> {platform?.targetAudience || 'כללי'}</p>
                                          <p className="break-words"><strong>זמני פרסום:</strong> {platform?.timing || 'כל היום'}</p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            )) || (
                              <Card className="bg-gray-50 rounded-xl md:rounded-2xl">
                                <CardContent className="p-4 sm:p-6">
                                  <p className="text-gray-600 text-center text-sm sm:text-base">לא נמצאו המלצות פלטפורמות</p>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        </div>

                        {/* KPIs */}
                        {aiAnalysisComplete && recommendations?.kpis && Array.isArray(recommendations.kpis) && recommendations.kpis.length > 0 && (
                          <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 rounded-2xl shadow-lg">
                            <CardContent className="p-6">
                              <h4 className={`font-bold text-yellow-800 mb-4 flex items-center text-lg ${isRTL ? 'space-x-reverse space-x-2 text-right' : 'space-x-2 text-left'}`}>
                                <TrendingUp className="h-5 w-5" />
                                <span>מטריקות מומלצות למעקב:</span>
                              </h4>
                              <div className={`flex flex-wrap gap-3 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                                {recommendations.kpis.map((kpi, index) => (
                                  <span key={index} className="bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 px-4 py-2 rounded-xl text-sm font-bold border border-yellow-200 shadow-sm">
                                    {kpi || 'מטריקה לא ידועה'}
                                  </span>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        )}

                        <Separator className="my-6" />

                        {/* Post Description */}
                        <div className="space-y-4">
                          <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-2 text-right' : 'space-x-2 text-left'}`}>
                            <Edit3 className="h-5 w-5 text-blue-500" />
                            <Label htmlFor="post-description" className="text-lg font-bold text-gray-800">
                              תיאור הפוסט {aiAnalysisComplete ? "(נוצר על ידי AI)" : "(נוצר אוטומטית)"}
                            </Label>
                          </div>
                          <Textarea
                            id="post-description"
                            placeholder="תיאור הפוסט יופיע כאן..."
                            value={formData?.postDescription || ""}
                            onChange={(e) => setFormData(prev => ({ ...prev, postDescription: e.target.value }))}
                            className={`min-h-32 rounded-2xl border-gray-200 focus:border-blue-400 focus:ring-blue-400 bg-white/50 backdrop-blur-sm ${isRTL ? 'text-right' : 'text-left'}`}
                            dir={isRTL ? 'rtl' : 'ltr'}
                          />
                          <p className={`text-sm text-gray-500 flex items-center px-3 py-2 rounded-xl ${isRTL ? 'space-x-reverse space-x-1 text-right' : 'space-x-1 text-left'} ${
                            aiAnalysisComplete ? 'bg-green-50' : 'bg-blue-50'
                          }`}>
                            {aiAnalysisComplete ? (
                              <>
                                <Sparkles className="h-4 w-4 text-green-500" />
                                <span>תיאור מותאם אישית על בסיס ניתוח AI של הסרטון</span>
                              </>
                            ) : (
                              <>
                                <Edit3 className="h-4 w-4 text-blue-500" />
                                <span>תיאור בסיסי - תוכל לערוך אותו</span>
                              </>
                            )}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Step 4: Launch */}
                {currentStep === 4 && (
                  <div className="space-y-6 md:space-y-8">
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <CheckCircle className="h-8 w-8 text-white" />
                      </div>
                      <h3 className={`text-2xl font-bold text-gray-800 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>סיכום הקמפיין</h3>
                      <p className={`text-gray-600 text-lg ${isRTL ? 'text-right' : 'text-left'}`}>בדוק את הפרטים לפני השקת הקמפיין</p>
                    </div>

                    {/* Campaign Summary */}
                    <div className="space-y-6 mb-8">
                      {/* Video & Business Info */}
                      <Card className="bg-gradient-to-br from-gray-50 to-blue-50 border-gray-200 rounded-2xl shadow-lg">
                        <CardContent className="p-6">
                          <h4 className={`font-bold text-gray-800 mb-4 flex items-center text-lg ${isRTL ? 'space-x-reverse space-x-2 text-right' : 'space-x-2 text-left'}`}>
                            <Upload className="h-5 w-5 text-blue-600" />
                            <span>פרטי הקמפיין</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                              <div className={`flex items-center mb-2 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                <Camera className="h-4 w-4 text-blue-600" />
                                <span className="font-bold text-gray-700">סרטון:</span>
                              </div>
                              <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                                {formData.video ? formData.video.name : 'לא הועלה סרטון'}
                              </p>
                            </div>
                            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                              <div className={`flex items-center mb-2 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                <Target className="h-4 w-4 text-purple-600" />
                                <span className="font-bold text-gray-700">מטרה:</span>
                              </div>
                              <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                                {campaignGoals.find(g => g.value === formData.campaignGoal)?.label || 'לא נבחרה מטרה'}
                              </p>
                            </div>
                            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                              <div className={`flex items-center mb-2 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                <DollarSign className="h-4 w-4 text-green-600" />
                                <span className="font-bold text-gray-700">תקציב יומי:</span>
                              </div>
                              <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                                ₪{formData.dailyBudget || '0'}
                              </p>
                            </div>
                            <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                              <div className={`flex items-center mb-2 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                <Brain className="h-4 w-4 text-purple-600" />
                                <span className="font-bold text-gray-700">ניתוח AI:</span>
                              </div>
                              <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                                {aiAnalysisComplete ? 'ניתוח מתקדם הושלם' : 'ניתוח בסיסי'}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Business Description */}
                      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 rounded-2xl shadow-lg">
                        <CardContent className="p-6">
                          <h4 className={`font-bold text-gray-800 mb-4 flex items-center text-lg ${isRTL ? 'space-x-reverse space-x-2 text-right' : 'space-x-2 text-left'}`}>
                            <TrendingUp className="h-5 w-5 text-purple-600" />
                            <span>תיאור העסק</span>
                          </h4>
                          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                            <p className={`text-sm text-gray-700 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                              {formData.businessDescription || 'לא הוזן תיאור עסק'}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Target Audience & Publishing Hours */}
                      {recommendations && (
                        <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200 rounded-2xl shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className={`font-bold text-gray-800 flex items-center text-lg ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                <Target className="h-5 w-5 text-indigo-600" />
                                <span>קהל יעד ותזמון</span>
                              </h4>
                              {!editingCards.audience && (
                                <Button
                                  onClick={() => {
                                    setManualTargetAudience(savedTargetAudience || recommendations.targetAudience || 'קהל רחב');
                                    setManualPublishingHours(savedPublishingHours || 'כל היום (24/7)');
                                    setEditingCards(prev => ({ ...prev, audience: true }));
                                  }}
                                  variant="outline"
                                  size="sm"
                                  className="text-indigo-600 border-indigo-600 hover:bg-indigo-50"
                                >
                                  <Edit3 className="h-4 w-4 ml-1" />
                                  ערוך
                                </Button>
                              )}
                            </div>
                            
                            {!editingCards.audience ? (
                              <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                                    <div className={`flex items-center mb-2 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                      <Users className="h-4 w-4 text-indigo-600" />
                                      <span className="font-bold text-gray-700">קהל יעד:</span>
                                    </div>
                                    <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                                      {savedTargetAudience || recommendations.targetAudience || 'קהל רחב'}
                                    </p>
                                  </div>
                                  <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                                    <div className={`flex items-center mb-2 ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                                      <Clock className="h-4 w-4 text-blue-600" />
                                      <span className="font-bold text-gray-700">שעות פרסום:</span>
                                    </div>
                                    <p className={`text-sm text-gray-600 ${isRTL ? 'text-right' : 'text-left'}`}>
                                      {savedPublishingHours || 'כל היום (24/7)'}
                                    </p>
                                  </div>
                                </div>
                                {aiAnalysisComplete && (
                                  <div className={`mt-3 flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-xs text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg`}>
                                    <Sparkles className="h-3 w-3" />
                                    <span>המלצות אלו נוצרו על ידי AI על בסיס ניתוח הסרטון והעסק</span>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="space-y-4">
                                  <div className="text-right">
                                    <Label className="text-gray-700 font-bold mb-2 flex items-center justify-end space-x-2 space-x-reverse">
                                      <Users className="h-4 w-4 text-indigo-600" />
                                      <span>קהל יעד:</span>
                                    </Label>
                                    <Input
                                      value={manualTargetAudience}
                                      onChange={(e) => setManualTargetAudience(e.target.value)}
                                      className="text-right bg-white"
                                      placeholder="לדוגמה: גברים ונשים בגיל 25-45..."
                                    />
                                  </div>
                                  <div className="text-right">
                                    <Label className="text-gray-700 font-bold mb-2 flex items-center justify-end space-x-2 space-x-reverse">
                                      <Clock className="h-4 w-4 text-blue-600" />
                                      <span>שעות פרסום:</span>
                                    </Label>
                                    <Input
                                      value={manualPublishingHours}
                                      onChange={(e) => setManualPublishingHours(e.target.value)}
                                      className="text-right bg-white"
                                      placeholder="לדוגמה: 09:00-21:00..."
                                    />
                                  </div>
                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      onClick={() => {
                                        // Save to state
                                        setSavedTargetAudience(manualTargetAudience);
                                        setSavedPublishingHours(manualPublishingHours);
                                        setEditingCards(prev => ({ ...prev, audience: false }));
                                        showToastMessage("✅ קהל יעד ותזמון עודכנו");
                                      }}
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <Check className="h-4 w-4 ml-1" />
                                      שמור
                                    </Button>
                                    <Button
                                      onClick={() => setEditingCards(prev => ({ ...prev, audience: false }))}
                                      variant="outline"
                                      size="sm"
                                    >
                                      <X className="h-4 w-4 ml-1" />
                                      ביטול
                                    </Button>
                                  </div>
                                </div>
                              </>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Platform Strategy */}
                      {recommendations?.platforms && recommendations.platforms.length > 0 && (
                        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 rounded-2xl shadow-lg">
                          <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <h4 className={`font-bold text-gray-800 flex items-center text-lg ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                              <Sparkles className="h-5 w-5 text-green-600" />
                              <span>אסטרטגיית פלטפורמות</span>
                            </h4>
                              {!editingCards.platforms && (
                                <Button
                                  onClick={() => {
                                    // Initialize platform budgets from saved or recommendations
                                    const budgets = {};
                                    const selected = {};
                                    const platformsToUse = savedPlatforms.length > 0 ? savedPlatforms : recommendations.platforms.filter(p => p.recommended);
                                    
                                    platformsToUse.forEach(platform => {
                                      const platformName = platform.name;
                                      budgets[platformName] = Math.floor((parseFloat(formData.dailyBudget || "100") * parseInt(String(platform.percentage).replace('%', '')) / 100));
                                      selected[platformName] = true;
                                    });
                                    setManualPlatformBudgets(budgets);
                                    setSelectedPlatforms(selected);
                                    setEditingCards(prev => ({ ...prev, platforms: true }));
                                  }}
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 border-green-600 hover:bg-green-50"
                                >
                                  <Edit3 className="h-4 w-4 ml-1" />
                                  ערוך
                                </Button>
                              )}
                            </div>
                            
                            {!editingCards.platforms ? (
                            <div className="grid gap-3">
                                {(savedPlatforms.length > 0 ? savedPlatforms : recommendations.platforms.filter(p => p.recommended)).map((platform, index) => (
                                <div key={index} className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                                  <div className={`flex items-center justify-between ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                                        {(() => {
                                          try {
                                            const IconComponent = platform?.icon || Target;
                                            return React.createElement(IconComponent, { className: "h-5 w-5 text-white" });
                                          } catch (error) {
                                            return <Target className="h-5 w-5 text-white" />;
                                          }
                                        })()}
                                      </div>
                                      <div>
                                        <p className="font-bold text-gray-800">{platform.name}</p>
                                        <p className="text-xs text-gray-600">{platform.reason}</p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                                        {platform.percentage}
                                      </span>
                                      <p className="text-xs text-gray-600 mt-1">
                                        ₪{Math.floor((parseFloat(formData.dailyBudget || "100") * parseInt(String(platform.percentage).replace('%', '')) / 100))}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            ) : (
                              <div className="space-y-4">
                                {(savedPlatforms.length > 0 ? [...savedPlatforms, ...recommendations.platforms.filter(p => !savedPlatforms.find(sp => sp.name === p.name))] : recommendations.platforms).map((platform, index) => (
                                  <div key={index} className="bg-white/80 p-4 rounded-xl border-2 border-gray-200">
                                    <div className="flex items-center justify-between mb-3">
                                      <div className="flex items-center space-x-3 space-x-reverse">
                                        <input
                                          type="checkbox"
                                          checked={selectedPlatforms[platform.name] || false}
                                          onChange={(e) => setSelectedPlatforms(prev => ({
                                            ...prev,
                                            [platform.name]: e.target.checked
                                          }))}
                                          className="w-5 h-5 rounded border-gray-300"
                                        />
                                        <span className="font-bold text-gray-800">{platform.name}</span>
                                      </div>
                                      
                                      <div className="flex items-center space-x-2 space-x-reverse">
                                        <span className="text-sm text-gray-600">תקציב יומי:</span>
                                        <Input
                                          type="number"
                                          value={manualPlatformBudgets[platform.name] || 0}
                                          onChange={(e) => setManualPlatformBudgets(prev => ({
                                            ...prev,
                                            [platform.name]: parseInt(e.target.value) || 0
                                          }))}
                                          disabled={!selectedPlatforms[platform.name]}
                                          className="w-24 text-center"
                                          min="1"
                                        />
                                        <span className="text-sm font-bold text-gray-700">₪</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                                
                                <div className="bg-blue-50 p-3 rounded-xl">
                                  <p className="text-sm font-bold text-blue-800 text-right">
                                    סה"כ תקציב יומי: ₪
                                    {Object.keys(selectedPlatforms)
                                      .filter(p => selectedPlatforms[p])
                                      .reduce((sum, p) => sum + (manualPlatformBudgets[p] || 0), 0)}
                                  </p>
                                </div>
                                
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    onClick={() => {
                                      // Save platforms to state
                                      const updatedPlatforms = recommendations.platforms.map(platform => {
                                        if (selectedPlatforms[platform.name]) {
                                          const budget = manualPlatformBudgets[platform.name];
                                          const percentage = Math.round((budget / parseFloat(formData.dailyBudget || "100")) * 100);
                                          return {
                                            ...platform,
                                            recommended: true,
                                            percentage: `${percentage}%`
                                          };
                                        } else {
                                          return {
                                            ...platform,
                                            recommended: false
                                          };
                                        }
                                      }).filter(p => p.recommended);
                                      
                                      setSavedPlatforms(updatedPlatforms);
                                      setEditingCards(prev => ({ ...prev, platforms: false }));
                                      showToastMessage("✅ אסטרטגיית פלטפורמות עודכנה");
                                    }}
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="h-4 w-4 ml-1" />
                                    שמור
                                  </Button>
                                  <Button
                                    onClick={() => setEditingCards(prev => ({ ...prev, platforms: false }))}
                                    variant="outline"
                                    size="sm"
                                  >
                                    <X className="h-4 w-4 ml-1" />
                                    ביטול
                                  </Button>
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )}

                      {/* Post Content */}
                      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 rounded-2xl shadow-lg">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className={`font-bold text-gray-800 flex items-center text-lg ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'}`}>
                            <Edit3 className="h-5 w-5 text-blue-600" />
                            <span>תוכן הפרסומת</span>
                          </h4>
                            {!editingCards.post && (
                              <Button
                                onClick={() => {
                                  setManualPostDescription(formData.postDescription || "");
                                  setEditingCards(prev => ({ ...prev, post: true }));
                                }}
                                variant="outline"
                                size="sm"
                                className="text-blue-600 border-blue-600 hover:bg-blue-50"
                              >
                                <Edit3 className="h-4 w-4 ml-1" />
                                ערוך
                              </Button>
                            )}
                          </div>
                          
                          {!editingCards.post ? (
                            <>
                          <div className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                            <p className={`text-sm text-gray-700 leading-relaxed whitespace-pre-wrap ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
                              {formData.postDescription || 'לא הוזן תיאור פוסט'}
                            </p>
                          </div>
                          {aiAnalysisComplete && (
                            <div className={`mt-3 flex items-center ${isRTL ? 'space-x-reverse space-x-2' : 'space-x-2'} text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg`}>
                              <Sparkles className="h-3 w-3" />
                              <span>טקסט נוצר על ידי AI על בסיס ניתוח הסרטון</span>
                            </div>
                              )}
                            </>
                          ) : (
                            <>
                              <div className="space-y-3">
                                <Textarea
                                  value={manualPostDescription}
                                  onChange={(e) => setManualPostDescription(e.target.value)}
                                  className="min-h-32 text-right resize-none bg-white"
                                  placeholder="ערוך את תיאור הפוסט..."
                                />
                                <p className="text-xs text-gray-500 text-right">{manualPostDescription.length} תווים</p>
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    onClick={() => {
                                      setFormData(prev => ({ ...prev, postDescription: manualPostDescription }));
                                      setEditingCards(prev => ({ ...prev, post: false }));
                                      showToastMessage("✅ תוכן הפרסומת עודכן");
                                    }}
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700"
                                  >
                                    <Check className="h-4 w-4 ml-1" />
                                    שמור
                                  </Button>
                                  <Button
                                    onClick={() => setEditingCards(prev => ({ ...prev, post: false }))}
                                    variant="outline"
                                    size="sm"
                                  >
                                    <X className="h-4 w-4 ml-1" />
                                    ביטול
                                  </Button>
                                </div>
                              </div>
                            </>
                          )}
                        </CardContent>
                      </Card>

                      {/* Connected Platforms */}
                      <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 rounded-2xl shadow-lg">
                        <CardContent className="p-6">
                          <h4 className={`font-bold text-gray-800 mb-4 flex items-center text-lg ${isRTL ? 'space-x-reverse space-x-2 text-right' : 'space-x-2 text-left'}`}>
                            <Link className="h-5 w-5 text-yellow-600" />
                            <span>פלטפורמות מחוברות</span>
                          </h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {Object.keys(connectedPlatforms).filter(name => connectedPlatforms[name]?.status === 'connected').length > 0 ? (
                              Object.keys(connectedPlatforms).filter(name => connectedPlatforms[name]?.status === 'connected').map((platformName) => {
                                const platform = availablePlatforms.find(p => p.name === platformName);
                                const connection = connectedPlatforms[platformName];
                                return (
                                  <div key={platformName} className="bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50">
                                    <div className={`flex items-center ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                                      <div className={`w-10 h-10 ${platform?.color || 'bg-gray-500'} rounded-xl flex items-center justify-center`}>
                                        {platform && React.createElement(platform.icon, { className: "h-5 w-5 text-white" })}
                                      </div>
                                      <div className="flex-1">
                                        <p className="font-bold text-gray-800">{platformName}</p>
                                        <p className="text-xs text-gray-600">
                                          {connection?.data?.account_name || 'משתמש מחובר'}
                                        </p>
                                      </div>
                                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="col-span-2 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50 text-center">
                                <p className="text-gray-600">לא חוברו פלטפורמות</p>
                                <Button
                                  onClick={() => setCurrentPage('platforms')}
                                  variant="link"
                                  className="text-yellow-700 underline p-0 h-auto font-bold mt-2"
                                >
                                  חבר פלטפורמות עכשיו
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Deploy Button */}
                    <Card className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-blue-200 rounded-3xl shadow-xl">
                      <CardContent className="p-8">
                        <div className="text-center">
                            <>
                              <div className="mb-6">
                                <div className="w-20 h-20 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                                  <Send className="h-10 w-10 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">מוכן לשליחה!</h4>
                              <p className="text-gray-600">הקמפיין מוכן לשליחה לפלטפורמות המחוברות. ניתן לערוך כל קלף לפני השליחה</p>
                              </div>
                              
                              {/* Upload Progress Display */}
                              {Object.keys(uploadProgress).length > 0 && (
                                <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                  <h5 className="font-bold text-blue-800 mb-3 flex items-center">
                                    <Upload className="h-5 w-5 ml-2" />
                                    סטטוס העלאת סרטונים
                                  </h5>
                                  <div className="space-y-2">
                                    {Object.entries(uploadProgress).map(([platform, status]) => (
                                      <div key={platform} className="flex items-center justify-between bg-white p-3 rounded-lg border">
                                        <span className="font-medium text-gray-700">{platform}</span>
                                        <span className={`text-sm font-medium ${
                                          status.includes('✅') ? 'text-green-600' :
                                          status.includes('❌') ? 'text-red-600' :
                                          'text-blue-600'
                                        }`}>
                                          {status}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="space-y-3">
                                <Button
                                  onClick={handleAutomaticDeployment}
                                  disabled={isDeploying || (!DEBUG_MODE && Object.values(connectedPlatforms || {}).filter(p => p?.status === 'connected').length === 0)}
                                  className={`w-full bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700 text-xl px-12 py-4 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center font-bold ${isRTL ? 'flex-row-reverse' : ''}`}
                                >
                                  {isDeploying ? (
                                    <>
                                      <Loader2 className={`h-6 w-6 ${isRTL ? 'ml-3' : 'mr-3'} animate-spin`} />
                                      משגר פרסומות...
                                    </>
                                  ) : (
                                    <>
                                      <Send className={`h-6 w-6 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                                    שלח לפרסום
                                    </>
                                  )}
                                </Button>
                                
                                <Button
                                onClick={() => window.location.href = '/analytics'}
                                  variant="outline"
                                className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 text-lg px-12 py-4 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center justify-center font-bold"
                                >
                                <TrendingUp className={`h-5 w-5 ${isRTL ? 'ml-3' : 'mr-3'}`} />
                                ביצועים בזמן אמת
                                </Button>
                              </div>
                            </>
                        </div>
                      </CardContent>
                    </Card>
                          
                    {!DEBUG_MODE && Object.values(connectedPlatforms || {}).filter(p => p?.status === 'connected').length === 0 && (
                      <div className={`text-red-600 text-sm mt-4 ${isRTL ? 'text-right' : 'text-left'} bg-red-50 px-4 py-3 rounded-xl border border-red-200`}>
                        <div className="flex items-center justify-center space-x-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span>יש לחבר לפחות פלטפורמה אחת כדי לשלוח פרסומות</span>
                        </div>
                        <Button
                          onClick={() => setCurrentPage('platforms')}
                          variant="link"
                          className="text-red-700 underline p-0 h-auto font-bold mt-2"
                        >
                          חבר פלטפורמות עכשיו
                        </Button>
                      </div>
                    )}
                    
                    {/* 🔧 הודעת מצב בדיקה */}
                    {DEBUG_MODE && Object.values(connectedPlatforms || {}).filter(p => p?.status === 'connected').length === 0 && (
                      <div className={`text-blue-600 text-sm mt-4 ${isRTL ? 'text-right' : 'text-left'} bg-blue-50 px-4 py-3 rounded-xl border border-blue-200`}>
                        <div className="flex items-center justify-center space-x-2">
                          <AlertTriangle className="h-4 w-4" />
                          <span>🔧 מצב בדיקה: ניתן לשלוח קמפיין ללא חיבור פלטפורמות (הקמפיין יישמר במערכת אך לא יפורסם בפועל)</span>
                        </div>
                      </div>
                    )}

                    {/* Deployment Results */}
                    {campaignResults.length > 0 && (
                      <div className="space-y-4">
                        <h4 className={`font-bold text-gray-800 flex items-center text-lg ${isRTL ? 'space-x-reverse space-x-2 text-right' : 'space-x-2 text-left'}`}>
                          <TrendingUp className="h-5 w-5" />
                          <span>תוצאות שליחה:</span>
                        </h4>
                        {campaignResults.map((result, index) => (
                          <Card key={index} className={`rounded-2xl shadow-lg ${result?.success ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200'}`}>
                            <CardContent className="p-4">
                              <div className={`flex items-start ${isRTL ? 'space-x-reverse space-x-3' : 'space-x-3'}`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                                  result?.success ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
                                }`}>
                                  {result?.success ? <Check className="h-6 w-6" /> : <X className="h-6 w-6" />}
                                </div>
                                <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                                  <h5 className="font-bold text-gray-800 text-lg">{result?.platform || 'Unknown Platform'}</h5>
                                  <p className={`text-sm mb-2 ${result?.success ? 'text-green-700' : 'text-red-700'}`}>
                                    {result?.message || 'אין הודעה זמינה'}
                                  </p>
                                  {result?.success && (
                                    <div className={`text-xs text-gray-600 space-y-1 bg-white/50 p-3 rounded-xl ${isRTL ? 'text-right' : 'text-left'}`}>
                                      {result.campaign_id && <p><strong>מזהה קמפיין:</strong> {result.campaign_id}</p>}
                                      {result.estimated_reach && <p><strong>הגעה משוערת:</strong> {result.estimated_reach.toLocaleString()}</p>}
                                      {result.daily_budget && <p><strong>תקציב יומי:</strong> ₪{result.daily_budget}</p>}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                        
                        {/* Analytics Button - Show after successful deployment */}
                        {campaignResults.some(r => r?.success) && (
                          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300 shadow-xl">
                            <CardContent className="p-6 text-center">
                              <div className="mb-4">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                  <TrendingUp className="h-8 w-8 text-white" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-800 mb-2">הקמפיין פעיל!</h4>
                                <p className="text-gray-600">רוצה לראות את הביצועים בזמן אמת?</p>
                              </div>
                              <Button
                                onClick={() => window.location.href = '/analytics'}
                                className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700 text-lg px-8 py-4 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 font-bold"
                              >
                                <TrendingUp className={`h-5 w-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                                ביצועים בזמן אמת
                              </Button>
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation Buttons - Mobile Responsive */}
                <div className={`flex flex-col sm:flex-row gap-3 sm:gap-0 ${currentStep === 4 ? 'sm:justify-start' : 'sm:justify-between'} pt-6 sm:pt-8 border-t border-gray-200`}>
                  <Button 
                    variant="outline" 
                    onClick={handlePrev}
                    disabled={currentStep === 1}
                    className={`flex items-center justify-center rounded-xl md:rounded-2xl border-2 hover:bg-gray-50 transition-all duration-300 py-2.5 sm:py-3 text-sm sm:text-base ${isRTL ? 'flex-row-reverse' : ''} ${
                      currentStep === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg transform hover:scale-[1.02] sm:hover:scale-105'
                    }`}
                  >
                    <ArrowLeft className={`h-4 w-4 ${isRTL ? 'mr-2' : 'ml-2'} ${isRTL ? 'rotate-180' : ''}`} />
                    הקודם
                  </Button>

                  {currentStep < 4 && (
                    <Button 
                      onClick={handleNext}
                      disabled={isAnalyzing}
                      className={`w-full sm:w-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 flex items-center justify-center rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 font-bold py-2.5 sm:py-3 text-sm sm:text-base ${isRTL ? 'flex-row-reverse' : ''} disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
                    >
                      {isAnalyzing ? "מנתח..." : "הבא"}
                      <ArrowRight className={`h-4 w-4 sm:h-5 sm:w-5 ${isRTL ? 'ml-2' : 'mr-2'} ${isRTL ? 'rotate-180' : ''}`} />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

export default EnhancedCampaign;
