"""Original background score + voice mix for the ad (synthesised here, no samples, no third-party music).

  python music_gen.py   -> voice/mix.wav (voice-over sped up, placed per scene, over the score, ducked under the voice)

Score: a tense filtered A-minor pulse under the pain scene, a riser into the cut to light, then an upbeat
124 BPM groove (kick, clap, hats, bass, pad, pluck arp, C G Am F) to the call to action, ending on a held chord.
"""
import json, subprocess, sys, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent
SR = 48000
CFG = json.loads((ROOT / 'timing.json').read_text())
DUR, LIGHT, CTA = CFG['DUR'], CFG['LIGHT'], CFG['CTA']
BPM = 124; BEAT = 60 / BPM
rng = np.random.default_rng(7)
N = lambda s: int(round(s * SR))
t_all = np.arange(N(DUR)) / SR
hz = lambda m: 440 * 2 ** ((m - 69) / 12)


def lp(x, fc):   # one-pole low-pass, fc may be an array
    a = np.exp(-2 * np.pi * np.broadcast_to(fc, x.shape) / SR); y = np.empty_like(x); s = 0.0
    for i in range(len(x)): s = (1 - a[i]) * x[i] + a[i] * s; y[i] = s
    return y


def saw(f, n, ph=0.0): return 2 * ((np.cumsum(np.full(n, f / SR)) + ph) % 1) - 1


def add(bus, t0, x, g=1.0):
    i = N(t0)
    if i >= len(bus) or i + len(x) <= 0: return
    a = max(0, -i); j = min(len(bus), i + len(x)); bus[max(i, 0):j] += g * x[a:a + j - max(i, 0)]


def kick():
    n = N(0.4); t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 28); ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * np.exp(-t * 7) + 0.3 * rng.standard_normal(n) * np.exp(-t * 300)


def hat(open_=False):
    n = N(0.18 if open_ else 0.05); t = np.arange(n) / SR; x = rng.standard_normal(n)
    x = x - lp(x, 7000); return x * np.exp(-t * (18 if open_ else 90))


def clap():
    n = N(0.25); t = np.arange(n) / SR; x = rng.standard_normal(n); x = lp(x - lp(x, 900), 5000)
    env = sum(np.exp(-np.maximum(t - d, 0) * 60) * (t >= d) for d in (0, 0.011, 0.022)) * np.exp(-t * 14)
    return x * env


def pluck(m, d=0.22):
    n = N(d); t = np.arange(n) / SR; f = hz(m)
    x = saw(f, n) + 0.5 * saw(f * 1.006, n); return lp(x, 900 + 5000 * np.exp(-t * 20)) * np.exp(-t * 11)


CH = {'C': [60, 64, 67], 'G': [55, 59, 62], 'Am': [57, 60, 64], 'F': [53, 57, 60]}
ROOTN = {'C': 36, 'G': 43, 'Am': 45, 'F': 41}
PROG = ['C', 'G', 'Am', 'F']

drums, bass, pad, arp, fx = (np.zeros(N(DUR) + N(1)) for _ in range(5))

# ---- 1. tension: filtered A pulse, ticking hats, riser into the cut ----
b8 = BEAT / 2
for k in range(int(LIGHT / b8)):
    t0 = k * b8; n = N(b8 * 0.9); t = np.arange(n) / SR
    x = saw(hz(33), n) + saw(hz(33) * 1.01, n)
    add(bass, t0, lp(x, 180 + 520 * (t0 / LIGHT)) * np.exp(-t * 6), 0.55)
    if k % 2: add(drums, t0, hat(), 0.18)
for k in range(int(LIGHT / BEAT)):
    if k >= 2: add(drums, k * BEAT, kick(), 0.35 + 0.35 * k / (LIGHT / BEAT))
n = N(1.3); t = np.arange(n) / SR; x = rng.standard_normal(n)
add(fx, LIGHT - 1.3, lp(x, 300 + 6000 * (t / 1.3) ** 2) * (t / 1.3) ** 2, 0.5)        # riser
n = N(1.6); t = np.arange(n) / SR
add(fx, LIGHT, lp(rng.standard_normal(n), 2500) * np.exp(-t * 5), 0.35)                 # crash wash at the cut

# ---- 2. lift: the groove from the cut to the end ----
nb = int((DUR - LIGHT) / BEAT)
for k in range(nb):
    t0 = LIGHT + k * BEAT; bar, pos = divmod(k, 4)
    ch = PROG[bar % 4]; tail = t0 > DUR - 1.6
    if tail: continue
    add(drums, t0, kick(), 0.8)
    if pos in (1, 3): add(drums, t0, clap(), 0.35)
    add(drums, t0 + BEAT / 2, hat(open_=(pos == 3)), 0.22)
    add(drums, t0 + BEAT / 4, hat(), 0.08); add(drums, t0 + 3 * BEAT / 4, hat(), 0.08)
    for h in (0, 0.5):   # bass: root on the off-beat eighths (pumping house bass)
        nn = N(BEAT * 0.45); tt = np.arange(nn) / SR; r = ROOTN[ch]
        add(bass, t0 + h * BEAT + (0.0 if h == 0 else 0), lp(saw(hz(r), nn) + 0.6 * saw(hz(r + 12), nn), 700) * np.exp(-tt * 9), 0.5 if h else 0.25)
    for s in range(4):   # sixteenth arpeggio up the chord
        m = CH[ch][s % 3] + 12 * (s == 3)
        add(arp, t0 + s * BEAT / 4, pluck(m + 12), 0.16 if s else 0.22)
# pad: detuned saws per bar, slow attack, pumped by the kick
for bar in range(int(nb / 4) + 1):
    t0 = LIGHT + bar * 4 * BEAT; ch = PROG[bar % 4]; n = N(4 * BEAT + 0.3); t = np.arange(n) / SR
    x = sum(saw(hz(m), n, 0.13 * i) + saw(hz(m) * 1.004, n, 0.37 * i) for i, m in enumerate(CH[ch]))
    env = np.minimum(1, t / 0.25) * np.minimum(1, (n / SR - t) / 0.3)
    add(pad, t0, lp(x, 1400) * env, 0.09)
pump = np.ones_like(pad)
for k in range(nb):
    i = N(LIGHT + k * BEAT); n = N(BEAT); pump[i:i + n] = (1 - 0.6 * np.exp(-np.arange(n) / SR * 9))[:len(pump) - i]
pad *= pump
# ending: a held C chord that rings out
n = N(1.8); t = np.arange(n) / SR
x = sum(saw(hz(m), n) + saw(hz(m) * 1.005, n) for m in CH['C'] + [48]); add(pad, DUR - 1.7, lp(x, 1800) * np.exp(-t * 1.6), 0.12)
add(drums, DUR - 1.7, kick(), 0.8)
# the drop on the call to action: one crash
n = N(1.4); t = np.arange(n) / SR; add(fx, CTA, lp(rng.standard_normal(n), 3000) * np.exp(-t * 4), 0.25)

music = drums + 0.9 * bass + pad + 0.8 * arp + fx
music = music[:N(DUR)]; music[-N(0.5):] *= np.linspace(1, 0, N(0.5)) ** 2


# ---- voice: sped up (pitch kept), placed per scene ----
def load(path, tempo):
    cmd = ['ffmpeg', '-v', 'quiet', '-i', str(path), '-af', f'atempo={tempo}', '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32).astype(np.float64)


voice = np.zeros(N(DUR) + N(5))
for i, t0 in enumerate(CFG['VOICE'], 1):
    add(voice, t0, load(ROOT / 'voice' / f'line-{i}.wav', CFG['TEMPO']))
voice = voice[:N(DUR)]

rms = lambda x: np.sqrt(np.mean(x[np.abs(x) > 1e-4] ** 2))
music *= 10 ** (-13 / 20) * rms(voice) / rms(music)            # bed sits about 13 dB under the speech
env = np.convolve(np.abs(voice), np.ones(N(0.03)) / N(0.03), 'same')
duck = 1 - 0.45 * np.clip(env / (np.percentile(env[env > 1e-4], 90) + 1e-9), 0, 1)
duck = np.convolve(duck, np.ones(N(0.12)) / N(0.12), 'same')
mix = voice + music * duck
mix /= max(1.0, np.abs(mix).max() / 0.9)
with wave.open(str(ROOT / 'voice' / 'mix.wav'), 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((mix * 32767).astype('<i2').tobytes())
print(f'voice/mix.wav {DUR:.2f}s')
