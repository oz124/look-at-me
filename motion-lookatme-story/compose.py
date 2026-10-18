"""Assemble the story ad: Veo shots + motion-graphics insert/end card + captions + voice-over + score.

  python compose.py   -> out/story.mp4 (1080x1920, 30 fps)

Every cut, voice line and caption is listed in EDIT / VOICE / CAPS below (seconds).
"""
import subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
SH, OUT = ROOT / 'shots', ROOT / 'out'; OUT.mkdir(exist_ok=True)
FPS = 30

# [source, in, out]; motion/out/final.mp4 holds the UI insert (0..3.8) and the end card (3.8..9.1)
MO = ROOT / 'motion' / 'out' / 'final.mp4'
EDIT = [(SH / 'S1.mp4', 0.5, 4.1), (SH / 'S2.mp4', 2.6, 7.6), (SH / 'S3.mp4', 4.0, 7.2), (SH / 'S4.mp4', 1.0, 4.2),
        (MO, 0.0, 3.8), (SH / 'S5.mp4', 1.0, 5.4), (MO, 3.8, 9.1)]
VOICE = [0.3, 3.7, 8.9, 11.9, 19.3, 23.6]                     # start of voice/line-N.wav
CAPS = [  # text, from, to, style
    ('פתחת עסק בשביל חלום.', 0.41, 3.3, 'low'),
    ('קמת כל בוקר בחמש.', 3.93, 7.0, 'low'),
    ('נתת הכל.', 7.17, 8.7, 'low'),
    ('אבל כשאף אחד לא רואה אותך...', 9.01, 11.8, 'low'),
    ('LOOK AT ME הופך סרטון אחד לקמפיין,', 12.21, 16.0, 'low'),
    ('שמגיע לאנשים הנכונים.', 16.14, 18.8, 'low'),
    ('ופתאום, רואים אותך.', 19.55, 23.2, 'big'),
    ('תנו לעולם לראות אתכם.', 23.83, 99, 'top'),
]
DUR = sum(b - a for _, a, b in EDIT)
GRADE = {'S1.mp4': 'eq=brightness=-0.04:saturation=0.9,colorbalance=bs=0.06:ms=0.02',   # night: cooler and darker
         'S5.mp4': 'eq=saturation=1.08:brightness=0.01'}                                   # joy: a touch warmer and brighter

CAP_HTML = '''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="{fonts}/fonts.css"><style>
html,body{{margin:0;background:transparent}} #c{{position:absolute;left:0;top:0;width:1080px;height:1920px}}
.low,.big{{position:absolute;left:50%;transform:translateX(-50%);bottom:{bottom}px;direction:rtl;white-space:nowrap;
  font-family:Rubik;font-weight:700;color:#fff;padding:18px 40px;border-radius:28px;background:rgba(15,13,31,.55)}}
.low{{font-size:58px}} .big{{font-size:84px;font-family:'Noto Sans Hebrew';font-weight:900}}
.top{{position:absolute;left:50%;transform:translateX(-50%);top:330px;direction:rtl;white-space:nowrap;
  font-family:'Noto Sans Hebrew';font-weight:900;font-size:88px;color:#1E1B4B}}
</style></head><body><div id="c"><div class="{style}">{text}</div></div></body></html>'''


def captions():
    from playwright.sync_api import sync_playwright
    tmp = OUT / 'cap.html'; files = []
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1080, 'height': 1920})
        for i, (text, a, z, style) in enumerate(CAPS):
            tmp.write_text(CAP_HTML.format(fonts=(ROOT / 'motion' / 'fonts').as_uri(), bottom=430, style=style, text=text), encoding='utf-8')
            pg.goto(tmp.as_uri()); pg.evaluate('document.fonts.ready')
            f = OUT / f'cap-{i}.png'; pg.screenshot(path=str(f), omit_background=True); files.append(f)
        b.close()
    tmp.unlink(); return files


def main():
    caps = captions()
    cmd = ['ffmpeg', '-v', 'error', '-y']
    for src, a, b in EDIT: cmd += ['-ss', str(a), '-t', str(b - a), '-i', str(src)]
    vi = len(EDIT)
    for i in range(len(VOICE)): cmd += ['-i', str(ROOT / 'voice' / f'line-{i + 1}.wav')]
    mi = vi + len(VOICE); cmd += ['-i', str(ROOT / 'voice' / 'music.mp3')]
    ci = mi + 1
    for f in caps: cmd += ['-loop', '1', '-t', str(DUR), '-i', str(f)]
    fg = []
    for k, (src, a, b) in enumerate(EDIT):
        g = GRADE.get(src.name, 'null')
        fg.append(f'[{k}:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps={FPS},{g},setsar=1,format=yuv420p[v{k}]')
    fg.append(''.join(f'[v{k}]' for k in range(len(EDIT))) + f'concat=n={len(EDIT)}:v=1:a=0[base]')
    last = 'base'
    for k, (text, a, z, style) in enumerate(CAPS):
        z = min(z, DUR)
        fg.append(f'[{ci + k}:v]format=rgba,fade=in:st={a}:d=0.18:alpha=1,fade=out:st={max(a, z - 0.15)}:d=0.15:alpha=1[c{k}]')
        fg.append(f'[{last}][c{k}]overlay=0:0:enable=\'between(t,{a},{z})\'[o{k}]'); last = f'o{k}'
    # audio: voice lines placed, score under them ducked by the voice
    for i, t0 in enumerate(VOICE):
        fg.append(f'[{vi + i}:a]aresample=48000,adelay={int(t0 * 1000)}:all=1[l{i}]')
    fg.append(''.join(f'[l{i}]' for i in range(len(VOICE))) + f'amix=inputs={len(VOICE)}:normalize=0,apad,atrim=0:{DUR},asplit=2[vo][sc]')
    fg.append(f'[{mi}:a]aresample=48000,atrim=0:{DUR},afade=t=out:st={DUR - 1.8}:d=1.8,volume=0.55[mu]')
    fg.append('[mu][sc]sidechaincompress=threshold=0.03:ratio=4:attack=20:release=400[duck]')
    fg.append('[vo][duck]amix=inputs=2:normalize=0,loudnorm=I=-14:TP=-1:LRA=11[aout]')
    cmd += ['-filter_complex', ';'.join(fg), '-map', f'[{last}]', '-map', '[aout]', '-r', str(FPS),
            '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
            '-t', str(DUR), '-movflags', '+faststart', str(OUT / 'story.mp4')]
    subprocess.run(cmd, check=True)
    print(f'out/story.mp4 {DUR:.2f}s')


if __name__ == '__main__':
    main()
