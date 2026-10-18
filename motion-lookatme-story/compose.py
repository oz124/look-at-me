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
EDIT = [(SH / 'S3.mp4', 3.0, 6.0), (SH / 'S1.mp4', 0.8, 3.9), (SH / 'S4.mp4', 2.0, 5.44),
        (MO, 0.9, 3.8), (SH / 'S5.mp4', 0.5, 6.3), (MO, 4.0, 9.1)]   # the end card starts after the phone has left
VOICE = [0.25, 3.1, 6.2, 13.54, 18.54]                       # start of voice/line-N.wav
TURN = 10.3                                                  # the "send" click in the UI insert, right as the brand name is said
MUSIC_IN = 11.747 - TURN                                     # puts a measured downbeat of voice/music.mp3 on TURN
CAPS = [  # text, from, to, style
    ('יש לך את המאפים הכי טובים בשכונה.', 0.37, 3.0, 'low'),
    ('רק שאף אחד עוד לא יודע.', 3.22, 6.1, 'low'),
    ('אז צלמי סרטון של העסק והמוצר,', 6.3, 8.5, 'low'),
    ('ותתחילי לשווק עם LOOK AT ME', 8.5, 10.6, 'up'),         # above the phone once the UI insert starts
    ('ועכשיו? כולם יודעים.', 13.59, 18.24, 'big'),
    ('תנו לעולם לראות אתכם.', 18.73, 99, 'top'),
]
DUR = sum(b - a for _, a, b in EDIT)
GRADE = {'S1.mp4': 'eq=brightness=-0.04:saturation=0.9,colorbalance=bs=0.06:bm=0.02',   # night: cooler and darker
         'S5.mp4': 'eq=saturation=1.08:brightness=0.01'}                                   # joy: a touch warmer and brighter

CAP_HTML = '''<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="{fonts}/fonts.css"><style>
html,body{{margin:0;background:transparent}} #c{{position:absolute;left:0;top:0;width:1080px;height:1920px}}
.low,.big,.up{{position:absolute;left:50%;transform:translateX(-50%);bottom:{bottom}px;direction:rtl;white-space:nowrap;
  font-family:Rubik;font-weight:700;color:#fff;padding:18px 40px;border-radius:28px;background:rgba(15,13,31,.55)}}
.low,.up{{font-size:58px}} .up{{bottom:auto;top:380px;font-size:50px}} .big{{font-size:84px;font-family:'Noto Sans Hebrew';font-weight:900}}
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
    # score: muffled and low until TURN, then the full groove (a filter-open drop on a downbeat)
    fg.append(f'[{mi}:a]aresample=48000,atrim={MUSIC_IN}:{MUSIC_IN + DUR},asetpts=PTS-STARTPTS,asplit=2[m1][m2]')
    fg.append(f"[m1]lowpass=f=450,lowpass=f=450,volume=0.5,volume='lt(t,{TURN})':eval=frame[mlo]")
    fg.append(f"[m2]volume='gte(t,{TURN})':eval=frame[mhi]")
    fg.append(f'[mlo][mhi]amix=inputs=2:normalize=0,afade=t=out:st={DUR - 1.5}:d=1.5,volume=0.5[mu]')
    # room sound of the footage itself, quietly under everything
    amb = [k for k, (src, a, b) in enumerate(EDIT) if src.parent == SH]
    starts = [sum(e[2] - e[1] for e in EDIT[:k]) for k in range(len(EDIT))]
    for k in amb:
        fg.append(f'[{k}:a]aresample=48000,volume=0.35,adelay={int(starts[k] * 1000)}:all=1[a{k}]')
    fg.append(''.join(f'[a{k}]' for k in amb) + f'amix=inputs={len(amb)}:normalize=0,apad,atrim=0:{DUR}[amb]')
    fg.append('[mu][sc]sidechaincompress=threshold=0.03:ratio=4:attack=20:release=400[duck]')
    fg.append('[vo][duck][amb]amix=inputs=3:normalize=0,loudnorm=I=-14:TP=-1:LRA=11[aout]')
    cmd += ['-filter_complex', ';'.join(fg), '-map', f'[{last}]', '-map', '[aout]', '-r', str(FPS),
            '-c:v', 'libx264', '-crf', '17', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-c:a', 'aac', '-b:a', '192k',
            '-t', str(DUR), '-movflags', '+faststart', str(OUT / 'story.mp4')]
    subprocess.run(cmd, check=True)
    print(f'out/story.mp4 {DUR:.2f}s')


if __name__ == '__main__':
    main()
