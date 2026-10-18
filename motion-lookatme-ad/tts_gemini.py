"""Hebrew voice-over through the Gemini TTS API, one file per narration line.

  GEMINI_API_KEY=... python tts_gemini.py [VOICE] [MODEL]     -> voice/line-1.wav ... voice/line-8.wav

The key is read from the environment only. Default voice Charon (male); Kore for a female voice.
"""
import base64, json, os, sys, urllib.request, wave
from pathlib import Path

LINES = [
    'עוד קמפיין. עוד ניחוש.',
    'הכסף נשרף, והתוצאות לא מגיעות.',
    'תפסיקו לנחש. תתחילו לפרסם חכם.',
    'מעלים סרטון אחד.',
    'אֵיי אַיי בונה לכם קהל, קריאייטיב ותקציב.',
    'ובקליק אחד, אתם בפייסבוק, גוגל וטיקטוק.',
    'מהסרטון, ועד קמפיין חי באוויר.',
    'לוק אט מי. צרו חשבון ב לוק אט מי נקודה סייט.',
]
MOOD = ['dry and a little frustrated'] * 2 + ['optimistic and confident'] * 5 + ['friendly, with a smile, stress the brand name']

KEY = os.environ.get('GEMINI_API_KEY') or sys.exit('GEMINI_API_KEY is not set')
VOICE = sys.argv[1] if len(sys.argv) > 1 else 'Charon'
MODEL = sys.argv[2] if len(sys.argv) > 2 else 'gemini-2.5-pro-preview-tts'
OUT = Path(__file__).resolve().parent / 'voice'
OUT.mkdir(exist_ok=True)

for i, (line, mood) in enumerate(zip(LINES, MOOD), 1):
    prompt = (f'Say in Hebrew, as a professional voice-over for a modern tech ad, natural Israeli accent, '
              f'medium pace, {mood}. Read exactly this and nothing else:\n{line}')
    body = {'contents': [{'parts': [{'text': prompt}]}],
            'generationConfig': {'responseModalities': ['AUDIO'],
                                 'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': VOICE}}}}}
    req = urllib.request.Request(f'https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent',
                                 data=json.dumps(body).encode(), headers={'Content-Type': 'application/json', 'x-goog-api-key': KEY})
    with urllib.request.urlopen(req, timeout=120) as r:
        part = json.load(r)['candidates'][0]['content']['parts'][0]['inlineData']
    pcm = base64.b64decode(part['data'])   # 16-bit mono PCM, 24 kHz
    with wave.open(str(OUT / f'line-{i}.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
    print(f'line {i}: {len(pcm) / 48000:.2f}s')
