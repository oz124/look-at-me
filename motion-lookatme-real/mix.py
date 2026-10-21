"""Voice-over + score premix -> voice/mix.wav (CONFIG.music; audio.py adds the sound effects on top).

One take of the voice (voice_gen.py) starts at VOICE_AT; the score plays at one steady level for the whole ad and only
ducks under the voice, so the music never changes character between scenes.
"""
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parent
V = ROOT / 'voice'
DUR = 30.8
VOICE_AT = 0.6
MUSIC_IN = 1.403          # puts a downbeat of the score (0.809 + 1.998 k) at 5.4 s, where the logo lands

fg = [f'[0:a]aresample=48000,adelay={int(VOICE_AT * 1000)}:all=1,apad,atrim=0:{DUR},asplit=2[vo][sc]',
      f'[1:a]aresample=48000,atrim={MUSIC_IN}:{MUSIC_IN + DUR},asetpts=PTS-STARTPTS,afade=t=in:d=0.3,'
      f'afade=t=out:st={DUR - 2}:d=2,volume=0.45[mu]',
      '[mu][sc]sidechaincompress=threshold=0.03:ratio=3:attack=30:release=500[duck]',
      '[vo][duck]amix=inputs=2:normalize=0[out]']
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', str(V / 'take.wav'), '-i', str(V / 'music.mp3'),
                '-filter_complex', ';'.join(fg), '-map', '[out]', '-ac', '2', str(V / 'mix.wav')], check=True)
print('voice/mix.wav')
