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
    ('פתחת עסק בשביל חלום.', 'soft and intimate, almost a whisper of empathy, slow'),
    ('קמת כל בוקר בחמש. נתת הכל.', 'tender and proud of her, slow'),
    ('אבל כשאף אחד לא רואה אותך...', 'quiet, a little heartbroken, trailing off'),
    ('לוק אט מי הופך סרטון אחד לקמפיין, שמגיע לאנשים הנכונים.', 'warm, hopeful, clear and reassuring, medium pace'),
    ('ופתאום, רואים אותך.', 'moved and joyful, a smile you can hear, emotional peak'),
    ('תנו לעולם לראות אתכם. לוק אט מי.', 'confident, warm and inviting, stress the brand name'),
]
MUSIC = ('Emotional cinematic underscore for a 26 second vertical video ad about a small bakery owner. '
         '0 to 11 seconds: soft solo felt piano, intimate and slightly melancholic, sparse notes. '
         '11 to 15 seconds: the piano lifts, a warm cello enters, sense of hope. '
         '15 to 21 seconds: warm strings, gentle pulsing percussion and piano swell into an uplifting, joyful resolution. '
         '21 to 26 seconds: settle on a warm, sustained major chord and fade. Instrumental only, no vocals, 70 to 80 BPM.')


def post(model, body):
    req = urllib.request.Request(API + model + ':generateContent', data=json.dumps(body).encode(),
                                 headers={'Content-Type': 'application/json', 'x-goog-api-key': KEY})
    with urllib.request.urlopen(req, timeout=300) as r:
        return json.load(r)


if sys.argv[1] == 'voice':
    voice = sys.argv[2] if len(sys.argv) > 2 else 'Kore'
    for i, (line, mood) in enumerate(LINES, 1):
        r = post('gemini-2.5-pro-preview-tts', {
            'contents': [{'parts': [{'text': f'Say in Hebrew, as a female voice-over in an emotional, cinematic ad, natural Israeli accent, '
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
