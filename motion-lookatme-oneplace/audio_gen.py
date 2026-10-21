"""Voice-over (Gemini TTS) and score (Lyria) for the one-place ad. The key comes from GEMINI_API_KEY only.

  python audio_gen.py voice [VOICE] [N ...]   -> voice/line-1.wav ... voice/line-5.wav (only lines N when given)
  python audio_gen.py music           -> voice/music.* (whatever format Lyria returns)
"""
import base64, json, os, sys, urllib.request, wave
from pathlib import Path

KEY = os.environ.get('GEMINI_API_KEY') or sys.exit('GEMINI_API_KEY is not set')
API = 'https://generativelanguage.googleapis.com/v1beta/models/'
OUT = Path(__file__).resolve().parent / 'voice'; OUT.mkdir(exist_ok=True)

LINES = [
    ('פייסבוק. גוגל. טיקטוק.', 'fast staccato, each word a punch, slightly overwhelmed'),
    ('עושים שיווק ממומן, ולא רואים תוצאות?', 'knowing, a little teasing, direct question to the viewer'),
    ('תכירו את לוק אט מי. כל הפלטפורמות, במקום אחד.', 'bright, confident reveal, relief in the voice, stress "לוק אט מי"'),
    ('ניתוח אֵיי אַיי חכם מראה לכם מה עובד, ואיפה הכסף נשרף.', 'smart and confident, clear, upbeat pace'),
    ('בלי לקפוץ בין מערכות. בלי לנחש.', 'easy and relaxed, a confident smile'),
    ('לוק אט מי. השיווק שלכם, סוף סוף במקום אחד. נסו עכשיו.', 'warm, confident and inviting, stress the brand name and "נסו עכשיו"'),
]
MUSIC = ('Upbeat, confident modern electronic pop for a tech product ad, 120 BPM, punchy kick, crisp claps, '
         'bright synth plucks, warm chords, bouncy bass, sleek and optimistic, not cheesy, not cinematic. '
         'Full groove from the first second, steady energy. Instrumental only, no vocals.')


def post(model, body):
    req = urllib.request.Request(API + model + ':generateContent', data=json.dumps(body).encode(),
                                 headers={'Content-Type': 'application/json', 'x-goog-api-key': KEY})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.load(r)


if sys.argv[1] == 'voice':
    voice = sys.argv[2] if len(sys.argv) > 2 else 'Kore'
    only = [int(n) for n in sys.argv[3:]]
    for i, (line, mood) in enumerate(LINES, 1):
        if only and i not in only: continue
        r = post('gemini-2.5-pro-preview-tts', {
            'contents': [{'parts': [{'text': f'Say in Hebrew, as a female voice-over in a persuasive, upbeat modern ad, natural Israeli accent, '
                                             f'{mood}. Read exactly this and nothing else:\n{line}'}]}],
            'generationConfig': {'responseModalities': ['AUDIO'],
                                 'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': voice}}}}})
        pcm = base64.b64decode(r['candidates'][0]['content']['parts'][0]['inlineData']['data'])
        with wave.open(str(OUT / f'line-{i}.wav'), 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
        print(f'line {i}: {len(pcm) / 48000:.2f}s')
elif sys.argv[1] == 'music':
    model = sys.argv[2] if len(sys.argv) > 2 else 'lyria-3-clip-preview'
    r = post(model, {'contents': [{'parts': [{'text': MUSIC}]}], 'generationConfig': {'responseModalities': ['AUDIO']}})
    for p in r['candidates'][0]['content']['parts']:
        if 'inlineData' in p:
            mime = p['inlineData']['mimeType']; ext = {'audio/wav': 'wav', 'audio/mpeg': 'mp3', 'audio/mp3': 'mp3'}.get(mime.split(';')[0], 'bin')
            (OUT / f'music.{ext}').write_bytes(base64.b64decode(p['inlineData']['data'])); print('music', mime)
        elif 'text' in p:
            print('text:', p['text'][:300])
