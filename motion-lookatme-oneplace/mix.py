"""Voice-over + score premix for the one-place ad -> voice/mix.wav (CONFIG.music; audio.py adds the sound effects on top).

The score is muffled until TURN (the windows collapse into the logo), then opens on a measured downbeat.
"""
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
V = ROOT / 'voice'
DUR = 25.2
VOICE = [-0.25, 2.6, 6.2, 10.6, 15.3, 18.9]   # start of voice/line-N.wav
TURN = 6.3
MUSIC_IN = 6.803 - TURN                      # downbeat 0.809 + 1.998 * 3 lands on TURN

cmd = ['ffmpeg', '-v', 'error', '-y'] + sum((['-i', str(V / f'line-{i + 1}.wav')] for i in range(len(VOICE))), [])
cmd += ['-i', str(V / 'music.mp3')]
m = len(VOICE)
fg = [f'[{i}:a]aresample=48000,' + (f'atrim=start={-t},asetpts=PTS-STARTPTS' if t < 0 else f'adelay={int(t * 1000)}:all=1') + f'[l{i}]'
      for i, t in enumerate(VOICE)]   # a negative start trims the head of the line
fg.append(''.join(f'[l{i}]' for i in range(m)) + f'amix=inputs={m}:normalize=0,apad,atrim=0:{DUR},asplit=2[vo][sc]')
fg.append(f'[{m}:a]aresample=48000,atrim={MUSIC_IN}:{MUSIC_IN + DUR},asetpts=PTS-STARTPTS,asplit=2[m1][m2]')
fg.append(f"[m1]lowpass=f=450,lowpass=f=450,volume=0.5,volume='lt(t,{TURN})':eval=frame[mlo]")
fg.append(f"[m2]volume='gte(t,{TURN})':eval=frame[mhi]")
fg.append(f'[mlo][mhi]amix=inputs=2:normalize=0,afade=t=out:st={DUR - 1.5}:d=1.5,volume=0.5[mu]')
fg.append('[mu][sc]sidechaincompress=threshold=0.03:ratio=4:attack=20:release=400[duck]')
fg.append('[vo][duck]amix=inputs=2:normalize=0[out]')
cmd += ['-filter_complex', ';'.join(fg), '-map', '[out]', '-ac', '2', str(V / 'mix.wav')]
subprocess.run(cmd, check=True)
print('voice/mix.wav')
