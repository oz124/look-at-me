"""Voice-over (Gemini TTS) and score (Lyria) for the story ad. The key comes from GEMINI_API_KEY only.

  python audio_gen.py voice [VOICE]   -> voice/line-1.wav ... voice/line-6.wav
  python audio_gen.py music           -> voice/music.* (whatever format Lyria returns)
"""
import base64, json, os, sys, urllib.request, wave
from pathlib import Path

KEY = os.environ.get('GEMINI_API_KEY') or sys.exit('GEMINI_API_KEY is not set')
API = 'https://generativelanguage.googleapis.com/v1beta/models/'
OUT = Path(__file__).resolve().parent / 'voice'; OUT.mkdir(exist_ok=True)

LINES = [
    ('יש לך את המאפים הכי טובים בשכונה.', 'warm and knowing, a small smile, confident, not sad'),
    ('רק שאף אחד עוד לא יודע.', 'light and a little wry, a playful hint of a problem, not sad'),
    ('אז תצלמי סרטון אחד.', 'confident, a spark of an idea, encouraging'),
    ('לוק אט מי יביא אותו לאנשים הנכונים.', 'energetic and sure, upbeat'),
    ('ועכשיו? כולם יודעים.', 'joyful and proud, a grin you can hear'),
    ('תנו לעולם לראות אתכם. לוק אט מי.', 'confident, warm and inviting, stress the brand name'),
]
MUSIC = ('Upbeat, confident, feel-good modern indie pop with a light house groove, 118 BPM, punchy kick, crisp claps, '
         'warm electric piano chords, bouncy bass, bright plucks. Optimistic and stylish like a modern tech or lifestyle ad, '
         'not cheesy, not cinematic, no orchestra, no slow intro: full groove from the first second, steady energy throughout. '
         'Instrumental only, no vocals.')


def post(model, body):
    req = urllib.request.Request(API + model + ':generateContent', data=json.dumps(body).encode(),
                                 headers={'Content-Type': 'application/json', 'x-goog-api-key': KEY})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.load(r)


if sys.argv[1] == 'voice':
    voice = sys.argv[2] if len(sys.argv) > 2 else 'Kore'
    for i, (line, mood) in enumerate(LINES, 1):
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
