"""AI footage for the LOOK AT ME story ad (Gemini image + Veo video). The key comes from GEMINI_API_KEY only.

  python gen.py character            -> shots/character.png   (the bakery owner, used as reference for every shot)
  python gen.py frames [S1 S2 ...]   -> shots/S1.png ...      (first frame of each shot, same person)
  python gen.py video  [S1 S2 ...]   -> shots/S1.mp4 ...      (Veo image to video, 8 s, 9:16)
"""
import base64, json, os, sys, time, urllib.request
from pathlib import Path

KEY = os.environ.get('GEMINI_API_KEY') or sys.exit('GEMINI_API_KEY is not set')
API = 'https://generativelanguage.googleapis.com/v1beta/'
IMG_MODEL = os.environ.get('IMG_MODEL', 'gemini-3-pro-image')
VEO_MODEL = os.environ.get('VEO_MODEL', 'veo-3.1-fast-generate-preview')
OUT = Path(__file__).resolve().parent / 'shots'; OUT.mkdir(exist_ok=True)

MAYA = ('Maya, an Israeli woman in her mid 30s, warm olive skin, dark curly hair tied up in a loose bun with a few loose strands, '
        'small gold hoop earrings, a flour-dusted mustard-yellow apron over a plain white t-shirt')
PLACE = ('a small neighborhood bakery in Tel Aviv: white subway tiles, wooden shelves, warm Edison bulbs, '
         'a glass display counter with croissants, rugelach and challah')
LOOK = ('Photorealistic, cinematic, shot on 35mm film, shallow depth of field, natural skin texture, subtle film grain, '
        'vertical 9:16 frame. No text, no letters, no signage, no logos anywhere.')

SHOTS = {
    'S1': ('Late at night, pitch dark outside the windows, the bakery is closed and almost dark, only one dim warm bulb above her, deep shadows, low-key moody lighting. {maya} sits alone on a stool behind the counter, '
           'looking down at her phone, its cold glow on her tired face.',
           'She exhales slowly and lowers the phone, discouraged, eyes drifting to the empty room. Very slow push in. '
           'Quiet night room tone and a distant fridge hum. No dialogue, no music.'),
    'S2': ('Early morning, cold blue light from the window mixed with the warm glow of the oven. Extreme close-up of the '
           'flour-covered hands of {maya} kneading dough on a wooden table, flour dust floating in a beam of light.',
           'Slow, tender, rhythmic kneading, flour dust drifting through the light. Soft kneading sounds. No dialogue, no music.'),
    'S3': ('Daytime. The bakery is completely empty. {maya} arranges fresh croissants on the display shelf.',
           'She places the last croissant, then looks up hopefully toward the glass front door; nobody comes in, people '
           'walk past outside without stopping. Static camera, quiet and melancholic. No dialogue, no music.'),
    'S4': ('{maya} holds up her phone with both hands and films a tray of golden croissants fresh from the oven. '
           'Over-the-shoulder shot, the phone screen is not readable.',
           'She slowly moves the phone along the tray, a small determined smile growing on her face. Warm light. '
           'Oven ambience. No dialogue, no music.'),
    'S5': ('Bright morning. Inside the bakery, the room is crowded with happy customers of different ages standing in a line at the counter, warm sunlight. '
           '{maya} stands behind the counter handing a paper bag of pastries to a smiling customer.',
           'She laughs, genuinely happy and proud, looks around at the full room; her phone on the counter lights up '
           'with notifications. Gentle handheld camera. Warm cafe chatter with no clear words. No dialogue, no music.'),
}


def call(url, body=None, timeout=300):
    req = urllib.request.Request(url, data=json.dumps(body).encode() if body is not None else None,
                                 headers={'Content-Type': 'application/json', 'x-goog-api-key': KEY})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.load(r)


def image(prompt, out, refs=()):
    parts = [{'inlineData': {'mimeType': 'image/png', 'data': base64.b64encode(p.read_bytes()).decode()}} for p in refs]
    parts.append({'text': prompt})
    r = call(f'{API}models/{IMG_MODEL}:generateContent', {
        'contents': [{'parts': parts}],
        'generationConfig': {'responseModalities': ['IMAGE'], 'imageConfig': {'aspectRatio': '9:16'}}})
    for p in r['candidates'][0]['content']['parts']:
        if 'inlineData' in p:
            out.write_bytes(base64.b64decode(p['inlineData']['data'])); print('image', out.name); return
    sys.exit(f'no image for {out.name}: {json.dumps(r)[:400]}')


def video(sid):
    still, motion = SHOTS[sid]
    frame = OUT / f'{sid}.png'
    op = call(f'{API}models/{VEO_MODEL}:predictLongRunning', {
        'instances': [{'prompt': (still + ' ' + motion).format(maya='Maya') + ' ' + LOOK,
                       'image': {'bytesBase64Encoded': base64.b64encode(frame.read_bytes()).decode(), 'mimeType': 'image/png'}}],
        'parameters': {'aspectRatio': '9:16', 'durationSeconds': 8, 'resolution': '1080p',
                       'negativePrompt': 'text, subtitles, captions, watermark, logo, distorted hands, extra fingers, morphing face'}})
    name = op['name']; print(sid, 'started', name)
    while not op.get('done'):
        time.sleep(10); op = call(f'{API}{name}')
    if 'error' in op: sys.exit(f'{sid}: {op["error"]}')
    samples = op['response']['generateVideoResponse'].get('generatedSamples') or sys.exit(f'{sid}: {json.dumps(op)[:600]}')
    req = urllib.request.Request(samples[0]['video']['uri'], headers={'x-goog-api-key': KEY})
    with urllib.request.urlopen(req, timeout=300) as r:
        (OUT / f'{sid}.mp4').write_bytes(r.read())
    print('video', sid)


if __name__ == '__main__':
    cmd, ids = sys.argv[1], sys.argv[2:] or list(SHOTS)
    if cmd == 'character':
        image(f'Portrait photo of {MAYA}, standing in {PLACE}, soft morning light, looking at the camera with a warm, '
              f'slightly tired smile. {LOOK}', OUT / 'character.png')
    elif cmd == 'frames':
        for sid in ids:
            image(f'The same woman as in the reference photo (same face, hair, earrings and apron). '
                  f'{SHOTS[sid][0].format(maya=MAYA)} Setting: {PLACE}. {LOOK}', OUT / f'{sid}.png', [OUT / 'character.png'])
    elif cmd == 'video':
        for sid in ids: video(sid)
