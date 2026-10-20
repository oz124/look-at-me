"""One continuous Hebrew voice-over take (Gemini TTS), split into lines at the pauses.

  GEMINI_API_KEY=... python voice_gen.py [VOICE]   -> voice/take.wav, voice/lines.json [[start, end], ...] (speech span per line)

One take keeps the tone the same from the first line to the last. LINES is the exact on-screen caption text;
SAY is how the voice should pronounce it (AI and the brand written phonetically).
"""
import base64, json, os, sys, urllib.request, wave
from pathlib import Path
import numpy as np

KEY = os.environ.get('GEMINI_API_KEY') or sys.exit('GEMINI_API_KEY is not set')
OUT = Path(__file__).resolve().parent / 'voice'; OUT.mkdir(exist_ok=True)
LINES = [
    'פייסבוק. גוגל. טיקטוק. ועדיין אפס.',
    'עושים שיווק ממומן, ולא רואים תוצאות?',
    'הכירו את LOOK AT ME.',
    'מעלים סרטון של העסק,',
    'ממלאים כמה פרטים,',
    'ובוחרים תקציב.',
    'ה AI מחלק את התקציב בין הפלטפורמות, ונותן המלצות.',
    'שולחים, בלחיצה אחת.',
    'וסוכן AI עוקב אחרי הביצועים, ונותן לכם המלצות, כל יום.',
    'LOOK AT ME. השיווק שלכם, סוף סוף במקום אחד. נסו עכשיו.',
]
SAY = [s.replace('LOOK AT ME', 'לוק אט מי').replace('ה AI', 'הָאֵיי אַיי').replace('AI', 'אֵיי אַיי') for s in LINES]
STYLE = ('Narrate in Hebrew like a well known, friendly Israeli TV commercial voice: a warm, smiling woman, energetic, '
         'conversational and trustworthy, natural Israeli accent, steady upbeat pace, the same tone and energy from the first '
         'line to the last. The first line is punchy and a little teasing, the last line is confident and inviting. '
         'Leave a clear pause of about one second between lines. Read exactly these lines and nothing else:')

if __name__ == '__main__':
    voice = sys.argv[1] if len(sys.argv) > 1 else 'Kore'
    body = {'contents': [{'parts': [{'text': STYLE + '\n\n' + '\n\n'.join(SAY)}]}],
            'generationConfig': {'responseModalities': ['AUDIO'],
                                 'speechConfig': {'voiceConfig': {'prebuiltVoiceConfig': {'voiceName': voice}}}}}
    req = urllib.request.Request('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-tts:generateContent',
                                 data=json.dumps(body).encode(), headers={'Content-Type': 'application/json', 'x-goog-api-key': KEY})
    with urllib.request.urlopen(req, timeout=300) as r:
        pcm = base64.b64decode(json.load(r)['candidates'][0]['content']['parts'][0]['inlineData']['data'])
    with wave.open(str(OUT / 'take.wav'), 'wb') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(24000); w.writeframes(pcm)
    x = np.frombuffer(pcm, '<i2').astype(float) / 32768
    env = np.convolve(np.abs(x), np.ones(480) / 480, 'same'); on = env > 0.008
    # silent gaps inside the take, longest first: the len(LINES) - 1 longest are the line breaks
    gaps, s = [], None
    for k in range(1, len(on)):
        if not on[k] and on[k - 1]: s = k
        if on[k] and not on[k - 1] and s is not None: gaps.append((k - s, s, k)); s = None
    cuts = sorted(sorted(gaps, reverse=True)[:len(LINES) - 1], key=lambda g: g[1])
    idx = np.where(on)[0]; a = idx[0]; spans = []
    for _, s0, s1 in cuts: spans.append([round(a / 24000, 3), round(s0 / 24000, 3)]); a = s1
    spans.append([round(a / 24000, 3), round(idx[-1] / 24000, 3)])
    (OUT / 'lines.json').write_text(json.dumps(spans))
    print(f'take {len(x) / 24000:.2f}s, shortest line break {min(g[0] for g in cuts) / 24000:.2f}s')
    for line, (p, q) in zip(LINES, spans): print(f'{p:6.2f} {q:6.2f} {q - p:5.2f}  {line}')
