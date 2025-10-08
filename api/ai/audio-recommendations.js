// API route for generating audio recommendations
// This endpoint handles audio analysis and recommendations using OpenAI API

const OpenAI = require('openai');
const formidable = require('formidable').formidable;

// Initialize OpenAI with server-side API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-your-openai-key-here'
});

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  const form = formidable({});

  try {
    const [fields] = await form.parse(req);
    const transcription = fields.transcription ? fields.transcription[0] : '';
    const textAnalysis = fields.textAnalysis ? fields.textAnalysis[0] : '';

    if (!transcription) {
      return res.status(400).json({ success: false, error: 'No transcription provided' });
    }

    // Create audio recommendations prompt
    const prompt = `
    אתה מומחה אודיו וקול מקצועי. צור המלצות מפורטות ומקצועיות לשיפור האודיו של הסרטון:

    תמלול: ${transcription}
    ניתוח טקסט: ${textAnalysis || 'לא סופק'}

    אנא תן המלצות מפורטות הכוללות:

    ## איכות קול:
    - איכות הקלטה
    - בהירות וחדות
    - רעשי רקע

    ## עוצמת קול:
    - רמות עוצמה
    - איזון
    - דינמיקה

    ## מוזיקה וסאונד:
    - מוזיקת רקע
    - אפקטים קוליים
    - איזון בין קול למוזיקה

    ## טכני:
    - עיבוד קול
    - קומפרסיה
    - EQ

    תן 5-7 המלצות מפורטות עם הסברים מקצועיים בעברית.
    `;

    // Call OpenAI API for recommendations
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.7
    });

    const recommendations = response.choices[0].message.content;
    
    // Split into array of recommendations
    const recommendationsArray = recommendations
      .split('\n')
      .filter(line => line.trim().length > 0)
      .map(line => line.replace(/^[-•*]\s*/, '').trim());

    res.status(200).json({
      success: true,
      message: 'Audio recommendations generated successfully',
      recommendations: recommendationsArray,
      rawResponse: recommendations,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error in audio recommendations API:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Internal Server Error' 
    });
  }
}

