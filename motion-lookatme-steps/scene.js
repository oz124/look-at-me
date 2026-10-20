// LOOK AT ME, the five steps, 1080x1920, 36 s. All times follow the one-take voice-over (voice/lines.json + 0.6 s, mix.py).
// 1. slot-machine hook: three reels land on Facebook, Google, TikTok, then "0" stamps on all three.
// 2. chaos: ad-manager windows pile up and collapse; a circle of light opens on the logo.
// 3. the logo flies into the app; five steps slide past like pages: upload, details, budget, AI split, send.
// 4. the AI agent follows the campaign day by day.  5. the header logo flies out into the call to action.
// Every caption is the exact line the voice is saying.
(() => {
  'use strict';
  const GRAD = 'linear-gradient(135deg, #3B5BEB 0%, #9333EA 55%, #DB2777 100%)';
  const GRAD_X = 'linear-gradient(90deg, #3B5BEB 0%, #9333EA 50%, #DB2777 100%)';
  const RUB = { font: F.RUBIK };
  const HERO = { font: F.D, weight: 900 };
  const gradText = { background: GRAD_X, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', padding: '0 0.04em' };
  const press = (t, tc, k = 0.94) => track(1, [[tc, k, 40, 1], [tc + 0.12, 1, 26, 0.7]])(t);
  const pop = (t, t0, wn = 26, z = 0.6) => ({ s: S(t - t0, wn, z), o: t >= t0 ? 1 : 0 });

  // voice lines, global seconds (speech span in the take + where the take starts)
  const V = [[0.24, 3.71], [4.11, 7.9], [8.6, 10.12], [10.79, 12.41], [12.85, 14.2], [14.58, 15.57], [16.18, 20.25],
    [20.82, 22.48], [23.0, 27.87], [28.55, 33.57]].map(([a, b]) => [a + 0.6, b + 0.6]);

  const LOGO_IMG = new Image(); LOGO_IMG.src = window.LOGO; PRELOAD.push(LOGO_IMG.decode());
  function logo(parent, cx, cy, size, shadow = true) {
    const g = grp(parent, cx, cy);
    if (shadow) box(g, 0, size * 0.1, size * 0.92, size * 0.92, { borderRadius: '22%', background: 'rgba(91,33,182,0.28)', filter: `blur(${size * 0.12}px)` });
    const b = box(g, 0, 0, size, size, { borderRadius: '21.3%', overflow: 'hidden' });
    const im = LOGO_IMG.cloneNode(); Object.assign(im.style, { width: '100%', height: '100%', display: 'block' }); b.appendChild(im);
    return g;
  }
  function card(parent, x, y, w, h, o = {}) {
    if (o.shadow) rect(parent, x + 10, y + 24, w - 20, h, { borderRadius: (o.r || 40) + 'px', background: o.shadow, filter: 'blur(34px)' });
    return rect(parent, x, y, w, h, Object.assign({ borderRadius: (o.r || 40) + 'px', background: o.bg || C.WHITE, boxSizing: 'border-box' }, o.css || {}));
  }

  // ================================ 1 + 2. hook and chaos ================================
  const T_SUCK = 8.45, T_OPEN = 8.6;
  scene('dark', 0, 10.7, { bg: C.INK }, (root) => {
    const cam = grp(root, W / 2, H / 2), w = grp(cam, -W / 2, -H / 2);

    // ---- slot machine: three reels drawn on canvas (they spin too fast to be words), Facebook on the right ----
    const reels = grp(w, 540, 640), R0 = grp(reels, -540, -640);
    const ITEMS = ['Facebook', 'Instagram', 'Google', 'YouTube', 'TikTok', 'LinkedIn'], IH = 130, RW = 300, RH = 400;
    const STOP = [V[0][0], V[0][0] + 0.9, V[0][0] + 1.87], WANT = ['Facebook', 'Google', 'TikTok'], RX = [880, 540, 200];
    const VEL = 2600;   // px per second while spinning
    const reelPos = STOP.map((ts, i) => {
      // spin at constant speed, then a critically damped spring onto the wanted item (continuous position and speed)
      const ph = i * IH * 2.4, t1 = ts - 0.32, w0 = 13, p1 = ph + VEL * t1;   // each reel starts on a different item
      let k = Math.ceil((p1 + VEL / w0) / IH); while (ITEMS[((k % ITEMS.length) + ITEMS.length) % ITEMS.length] !== WANT[i]) k++;
      const target = k * IH, A = p1 - target, B = VEL + w0 * A;
      return t => t < t1 ? ph + VEL * t : target + (A + B * (t - t1)) * Math.exp(-w0 * (t - t1));
    });
    const ctxs = RX.map((x, i) => {
      const fr = grp(R0, x, 640);
      rect(fr, -RW / 2 - 10, -RH / 2 - 10, RW + 20, RH + 20, { borderRadius: '40px', background: 'linear-gradient(180deg, #2C2945, #1C1A2E)' });
      const ctx = canvas2d(fr, -RW / 2, -RH / 2, RW, RH); ctx.canvas.style.borderRadius = '30px';
      rect(fr, -RW / 2, -IH / 2, RW, IH, { border: '3px solid rgba(255,255,255,0.18)', borderLeft: 'none', borderRight: 'none', boxSizing: 'border-box' });
      return ctx;
    });
    const drawReel = (ctx, pos) => {
      ctx.clearRect(0, 0, RW, RH); ctx.fillStyle = '#16142A'; ctx.fillRect(0, 0, RW, RH);
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'ltr';
      const base = Math.floor(pos / IH);
      for (let k = base - 3; k <= base + 3; k++) {
        const y = RH / 2 + (k * IH - pos), d = Math.abs(y - RH / 2) / IH;
        if (y < -IH || y > RH + IH) continue;
        ctx.globalAlpha = Math.max(0.12, 1 - 0.75 * d);
        ctx.font = '700 50px Rubik'; ctx.fillStyle = '#FFFFFF';
        ctx.fillText(ITEMS[((k % ITEMS.length) + ITEMS.length) % ITEMS.length], RW / 2, y);
      }
      ctx.globalAlpha = 1;
      const gtop = ctx.createLinearGradient(0, 0, 0, RH);
      gtop.addColorStop(0, 'rgba(22,20,42,1)'); gtop.addColorStop(0.25, 'rgba(22,20,42,0)'); gtop.addColorStop(0.75, 'rgba(22,20,42,0)'); gtop.addColorStop(1, 'rgba(22,20,42,1)');
      ctx.fillStyle = gtop; ctx.fillRect(0, 0, RW, RH);
    };
    // the zero stamps
    const T_ZERO = V[0][1] - 0.7;
    const stamps = RX.map((x, i) => {
      const g = grp(R0, x, 905);
      box(g, 0, 0, 250, 84, { borderRadius: '42px', background: 'rgba(244,63,94,0.18)', border: '3px solid ' + C.RED, boxSizing: 'border-box' });
      txt(g, '0 המרות', Object.assign({ x: 0, y: 2, size: 40, weight: 700, color: C.RED }, RUB));
      return { g, t0: T_ZERO + i * 0.1 };
    });
    STOP.forEach((ts, i) => sfx(ts, 'thud', 0.8 - i * 0.1));
    stamps.forEach((s, i) => sfx(s.t0, 'hit', 0.7 - i * 0.12));

    // ---- chaos: windows pile up over the shrinking reels ----
    const pile = grp(w, 540, 900), P0 = grp(pile, -540, -900);
    function win(cx, cy, ww, hh, title, chip) {
      const g = grp(P0, cx, cy);
      rect(g, -ww / 2 + 12, -hh / 2 + 26, ww - 24, hh, { borderRadius: '28px', background: 'rgba(0,0,0,0.55)', filter: 'blur(26px)' });
      rect(g, -ww / 2, -hh / 2, ww, hh, { borderRadius: '28px', background: C.WIN, border: '2px solid ' + C.WLINE, boxSizing: 'border-box' });
      ['#FF5F57', '#FEBC2E', '#28C840'].forEach((c, i) => box(g, -ww / 2 + 36 + i * 30, -hh / 2 + 32, 16, 16, { borderRadius: '50%', background: c }));
      rect(g, -ww / 2, -hh / 2 + 64, ww, 2, { background: C.WLINE });
      if (title) txt(g, title, Object.assign({ x: 0, y: -hh / 2 + 33, size: 30, weight: 700, color: C.WHITE, dir: 'ltr' }, RUB));
      const sv = svgBox(g, -ww / 2 + 40, -hh / 2 + 96, ww - 80, hh * 0.38);
      const ch = hh * 0.38, pts = [0.25, 0.32, 0.3, 0.45, 0.5, 0.62, 0.7, 0.86].map((v, i) => `${(i / 7) * (ww - 80)},${v * ch}`).join(' ');
      g.line = svgEl('polyline', sv, { points: pts, fill: 'none', stroke: C.RED, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
      g.len = g.line.getTotalLength(); g.line.setAttribute('stroke-dasharray', g.len);
      [0.62, 0.4, 0.52].forEach((f, i) => rect(g, -ww / 2 + 40, -hh / 2 + 110 + ch + i * 34, (ww - 80) * f, 16, { borderRadius: '8px', background: C.WLINE }));
      if (chip) {
        const c = grp(g, -ww / 2 + 150, hh / 2 - 52);
        box(c, 0, 0, 230, 62, { borderRadius: '31px', background: 'rgba(244,63,94,0.16)', border: '2px solid rgba(244,63,94,0.5)', boxSizing: 'border-box' });
        txt(c, chip, Object.assign({ x: 0, y: 1, size: 30, weight: 700, color: C.RED }, RUB));
      }
      return g;
    }
    const L2 = V[1][0];
    const small = [[300, 420, 460, 280, 7, L2 + 1.6], [800, 560, 420, 260, -8, L2 + 1.85], [250, 1180, 440, 270, -9, L2 + 2.1], [820, 1250, 460, 280, 6, L2 + 2.35]].map(([cx, cy, ww, hh, r, t0], k) => {
      const g = win(cx, cy, ww, hh, null, null);
      if (k % 2) for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) rect(g, -ww / 2 + 30 + j * (ww - 60) / 4, -hh / 2 + 84 + i * 40, (ww - 60) / 4 - 6, 32, { background: '#24213A' });
      return { g, r, t0 };
    });
    const big = [
      { g: win(480, 760, 700, 360, 'Facebook Ads', 'המרות: 0'), r: -5, t0: L2 },
      { g: win(600, 950, 700, 360, 'Google Ads', 'CTR 0.3%'), r: 4, t0: L2 + 0.6 },
      { g: win(500, 1140, 700, 360, 'TikTok Ads', '₪4.90 לקליק'), r: -3, t0: L2 + 1.15 },
    ];
    const toast = (s, y, t0) => {
      const g = grp(P0, 540, y);
      rect(g, -410, -35, 820, 110, { borderRadius: '30px', background: 'rgba(0,0,0,0.6)', filter: 'blur(22px)' });
      box(g, 0, 0, 840, 116, { borderRadius: '30px', background: '#2A2740', border: '2px solid #3A3658', boxSizing: 'border-box' });
      box(g, 360, 0, 52, 52, { borderRadius: '50%', background: C.RED });
      icon(g, ['M12 6.5v7', 'M12 17.5v.01'], 360, 0, 34, C.WHITE, 3);
      txt(g, s, Object.assign({ x: 310, y: 1, size: 42, weight: 700, color: C.WHITE, align: 'r' }, RUB));
      return { g, t0 };
    };
    const toasts = [toast('0 המרות היום', 370, L2 + 1.75), toast('התקציב היומי נוצל', 370, L2 + 2.35)];

    // ---- captions on a dark band at the bottom: line 1, then line 2 in two parts ----
    const band = rect(w, 0, 1180, W, 740, { background: 'linear-gradient(180deg, rgba(15,13,31,0) 0%, rgba(15,13,31,0.92) 35%, #0F0D1F 100%)' });
    const C1 = 'פייסבוק. גוגל. טיקטוק. ועדיין אפס.', Q1 = 'עושים שיווק ממומן,', Q2 = 'ולא רואים תוצאות?';
    const zq = Math.min(fit(C1, HERO, 700, 96), fit(Q1, HERO, 680, 96), fit(Q2, HERO, 680, 96));
    const c1 = txt(w, C1, Object.assign({ x: 540, y: 1420, size: zq, color: C.WHITE }, HERO));
    const q1 = txt(w, Q1, Object.assign({ x: 540, y: 1380, size: zq, color: C.WHITE }, HERO));
    const q2 = txt(w, Q2, Object.assign({ x: 540, y: 1490, size: zq, color: C.PINK }, HERO));
    const T_Q2 = L2 + 2.4;
    big.forEach((b, i) => sfx(b.t0, 'hit', 0.7 - i * 0.1));
    small.forEach((b, i) => sfx(b.t0, 'tick', 0.5 - i * 0.06));
    sfx(toasts[0].t0, 'pop', 0.6); sfx(toasts[1].t0, 'pop', 0.5); sfx(T_SUCK - 0.05, 'whoosh', 0.6);

    return t => {
      // reels: spin, land, stamp; then they sink back behind the windows
      ctxs.forEach((ctx, i) => drawReel(ctx, reelPos[i](t)));
      stamps.forEach(s => { const k = slam(t, s.t0, 1.3); tf(s.g, { s: k.s, o: k.o, r: -4 }); });
      const back = S(t - L2 - 0.6, 11, 1);   // the stamped reels stay readable while the first windows land
      tf(reels, { s: 1 - 0.38 * back, y: -120 * back, o: 1 - 0.75 * back });
      // windows
      for (const b of big) {
        b.g.line.setAttribute('stroke-dashoffset', b.g.len * (1 - E.smooth(seg(t, b.t0 + 0.05, b.t0 + 1.1))));
        const k = slam(t, b.t0, 1.22);
        tf(b.g, { s: k.s * (1 + 0.03 * seg(t, b.t0, T_SUCK)), o: k.o, y: -50 * seg(t, b.t0, T_SUCK), r: b.r + 2.5 * Math.sin(t * 2 + b.r) });
      }
      for (const b of small) { const k = pop(t, b.t0, 24, 0.62); tf(b.g, { s: k.s, o: k.o, r: b.r }); }
      toasts.forEach((q, i) => {
        const r = rise(t, q.t0, -60, 26, 0.7), down = i === 0 ? 135 * S(t - toasts[1].t0, 22, 0.8) : 0;
        tf(q.g, { y: r.y + down, o: r.o });
      });
      // captions: line 1 hands over to line 2 with a short slide
      const a1 = rise(t, V[0][0]), o1 = sp(t, L2 - 0.15, 40);
      tf(c1, { y: a1.y - 30 * o1, o: a1.o * (1 - o1) });
      const r1 = rise(t, L2); tf(q1, { y: r1.y, o: r1.o });
      const r2 = rise(t, T_Q2); tf(q2, { y: r2.y, o: r2.o });
      // the collapse: everything spins into the centre
      const c = S(t - T_SUCK, 13, 1);
      tf(pile, { s: Math.max(0.001, 1 - 0.97 * c), r: 40 * c, o: 1 - clamp((t - T_SUCK - 0.25) / 0.15, 0, 1) });
      [q1, q2, reels].forEach(g => { g.style.opacity = String(Math.min(+g.style.opacity || 1, 1 - c)); });
      band.style.opacity = String(1 - c);
      const [sx, sy, sr] = shake(t, [...STOP.map(s => [s, 9]), ...stamps.map(s => [s.t0, 8]), ...big.map(b => [b.t0, 14])]);
      tf(cam, { x: sx, y: sy, r: sr, s: 1 + 0.03 * E.o3(seg(t, 0, 2)) + 0.03 * seg(t, 0, T_SUCK) });
    };
  });

  // ============================ 3 + 4 + 5. light: app steps, agent, call to action ============================
  const T_PHONE = 10.9, T_CTA = 28.75;
  scene('light', T_OPEN, DUR, { bg: C.PAPER }, (root) => {
    div(root, { width: W + 'px', height: H + 'px', background:
      'radial-gradient(900px 700px at 90% 8%, rgba(219,39,119,0.10), transparent 70%), radial-gradient(900px 800px at 5% 92%, rgba(59,91,235,0.10), transparent 70%)' });
    const cam = grp(root, W / 2, H / 2), w = grp(cam, -W / 2, -H / 2);
    const T_LAND = 9.0;

    // ---- reveal: "הכירו את" over the logo, the name under it ----
    const ring = box(w, 540, 860, 300, 300, { borderRadius: '50%', border: '6px solid #C084FC', boxSizing: 'border-box' });
    const meet = txt(w, 'הכירו את', Object.assign({ x: 540, y: 600, size: 96, color: C.INK2 }, HERO));
    const rName = letters(w, 'LOOK AT ME', { x: 540, y: 1110, size: fit('LOOK AT ME', { font: F.LAT, weight: 900 }, 720, 120), font: F.LAT, weight: 900, color: C.INK2, dir: 'ltr' });
    sfx(T_LAND, 'impact', 0.8); sfx(T_LAND + 0.02, 'sparkle', 0.5);

    // ---- captions above the phone: exactly the voice, one or two lines, one size for all ----
    const caps = [
      [V[3][0], V[4][0], ['מעלים סרטון של העסק,']],
      [V[4][0], V[5][0], ['ממלאים כמה פרטים,']],
      [V[5][0], V[6][0], ['ובוחרים תקציב.']],
      [V[6][0], V[7][0], ['ה AI מחלק את התקציב', 'בין הפלטפורמות, ונותן המלצות.']],
      [V[7][0], V[8][0], ['שולחים, בלחיצה אחת.']],
      [V[8][0], T_CTA, ['וסוכן AI עוקב אחרי הביצועים,', 'ונותן לכם המלצות, כל יום.']],
    ];
    const zc = Math.min(...caps.flatMap(c => c[2].map(s => fit(s, HERO, 860, 92))));
    const capEls = caps.map(([a, b, ls]) => ({ a, b, l: ls.map((s, i) => txt(w, s, Object.assign({ x: 540, y: ls.length === 1 ? 400 : 335 + i * 125, size: zc, color: C.INK2, css: i === ls.length - 1 ? gradText : {} }, HERO))) }));
    // step dots under the captions (1..5, the agent is the sixth page)
    const dots = [0, 1, 2, 3, 4].map(i => box(w, 540 + (2 - i) * 34, 530, 14, 14, { borderRadius: '7px', background: C.LILAC }));

    // ---- the phone, with a clipped page area that slides like a carousel ----
    const PX = 130, PW = 820, PT = 600;
    const ph = grp(w, 0, 0);
    card(ph, PX, PT, PW, 1500, { r: 72, shadow: 'rgba(76,29,149,0.22)', css: { border: '3px solid ' + C.LINE } });
    const hdrLogo = logo(ph, 850, 680, 84, false);
    txt(ph, 'LOOK AT ME', { x: 785, y: 682, size: 46, font: F.LAT, weight: 900, color: C.INK2, align: 'r', dir: 'ltr' });
    [-14, 0, 14].forEach(dy => rect(ph, 196, 680 + dy - 3, 40, 6, { borderRadius: '3px', background: C.INK2 }));
    rect(ph, PX + 40, 750, PW - 80, 2, { background: C.LINE });
    const clip = rect(ph, PX + 3, 756, PW - 6, 900, { overflow: 'hidden' });
    const pages = grp(clip, -PX - 3, -756);
    const page = () => grp(pages, 0, 0);
    // the flying logo: centre of the reveal -> phone header, later phone header -> call to action
    const fly = logo(w, 0, 0, 300);
    const T_FLY = T_PHONE - 0.05;

    // page 1: upload; a video file is dragged in and dropped
    const p1 = page();
    rect(p1, 190, 800, 700, 470, { borderRadius: '44px', border: '4px dashed #C084FC', boxSizing: 'border-box', background: 'rgba(245,240,255,0.6)' });
    const UP = ['M12 15V4', 'M7.5 8.5L12 4l4.5 4.5', 'M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15'];
    const p1a = grp(p1, 0, 0);
    box(p1a, 540, 950, 130, 130, { borderRadius: '36px', background: '#F3E8FF' });
    icon(p1a, UP, 540, 950, 60, C.PURPLE, 2);
    txt(p1a, 'גררו לכאן סרטון', Object.assign({ x: 540, y: 1080, size: 46, weight: 700, color: C.PURPLE }, RUB));
    const p1b = grp(p1, 0, 0);
    const thumb = grp(p1b, 540, 960);
    box(thumb, 0, 0, 300, 190, { borderRadius: '24px', background: 'linear-gradient(135deg, #F59E0B, #DB2777)' });
    box(thumb, 0, 0, 74, 74, { borderRadius: '50%', background: 'rgba(255,255,255,0.9)' });
    icon(thumb, P.play, 4, 0, 34, C.PINK, 2, C.PINK);
    rect(p1b, 270, 1110, 540, 18, { borderRadius: '9px', background: C.LINE });
    const bar = rect(p1b, 270, 1110, 540, 18, { borderRadius: '9px', background: GRAD_X, transformOrigin: '0 50%' });
    const pct = txt(p1b, '0%', Object.assign({ x: 540, y: 1180, size: 36, weight: 500, color: C.GREY, dir: 'ltr' }, RUB));
    const ok1 = grp(p1b, 540, 1180);
    box(ok1, 0, 0, 64, 64, { borderRadius: '50%', background: C.GREEN });
    icon(ok1, P.check, 0, 0, 36, C.WHITE, 3);
    const file = grp(w, 0, 0);   // the dragged file lives above the phone so it can come from outside
    box(file, 0, 0, 250, 96, { borderRadius: '24px', background: C.WHITE, border: '2px solid ' + C.LINE, boxSizing: 'border-box', boxShadow: '0 18px 40px rgba(76,29,149,0.25)' });
    icon(file, P.file, 82, 0, 40, C.PURPLE, 2);
    txt(file, 'עסק.mp4', Object.assign({ x: -25, y: 1, size: 32, weight: 700, color: C.INK2, dir: 'ltr' }, RUB));
    const L4 = V[3][0], T_GRAB = L4 + 0.05, T_DROP = L4 + 0.75, U0 = T_DROP + 0.05, U1 = T_DROP + 0.75;
    sfx(T_DROP, 'thud', 0.6); sfx(U1 + 0.05, 'tick', 0.6);

    // page 2: business details type themselves
    const p2 = page();
    const FIELDS = [['שם העסק', 'המאפייה של מאיה'], ['תחום', 'מאפייה'], ['אזור', 'תל אביב']];
    const L5 = V[4][0];
    const fields = FIELDS.map(([label, val], i) => {
      const y = 860 + i * 190, t0 = L5 + 0.05 + i * 0.4;
      txt(p2, label, Object.assign({ x: 860, y, size: 32, weight: 500, color: C.GREY, align: 'r' }, RUB));
      const fb = rect(p2, 190, y + 30, 700, 100, { borderRadius: '24px', background: '#FAF7FF', border: '2px solid ' + C.LINE, boxSizing: 'border-box' });
      const vo = Object.assign({ x: 850, y: y + 81, size: 42, weight: 700, color: C.INK2, align: 'r' }, RUB);
      const v = txt(p2, '', vo);
      const caret = rect(p2, 0, y + 58, 3, 46, { background: C.PURPLE });
      return { val, t0, v, vo, caret, fb };
    });
    fields.forEach(f => [...f.val].forEach((ch, k) => { if (k % 3 === 0) sfx(f.t0 + k / 20, 'key', 0.3); }));

    // page 3: the budget slider
    const p3 = page();
    const L6 = V[5][0];
    txt(p3, 'תקציב חודשי', Object.assign({ x: 540, y: 880, size: 40, weight: 500, color: C.GREY }, RUB));
    const money = txt(p3, '₪500', Object.assign({ x: 540, y: 990, size: 120, weight: 700, color: C.INK2, dir: 'ltr' }, RUB));
    const SX0 = 240, SX1 = 840, SY = 1180;   // the slider fills left to right, like any slider
    rect(p3, SX0, SY - 9, SX1 - SX0, 18, { borderRadius: '9px', background: C.LINE });
    const fillS = rect(p3, SX0, SY - 9, SX1 - SX0, 18, { borderRadius: '9px', background: GRAD_X, transformOrigin: '0 50%' });
    const knob = grp(p3, 0, SY);
    box(knob, 0, 0, 64, 64, { borderRadius: '50%', background: C.WHITE, border: '6px solid ' + C.PURPLE, boxSizing: 'border-box', boxShadow: '0 8px 20px rgba(76,29,149,0.3)' });
    [['₪500', SX0], ['₪5,000', SX1]].forEach(([s, x]) => txt(p3, s, Object.assign({ x, y: SY + 70, size: 28, weight: 500, color: C.GREY, dir: 'ltr' }, RUB)));
    const D0 = L6 + 0.1, D1 = L6 + 0.85, K0 = 0.12, K1 = 0.555;   // 0.555 of 500..5000 = 3,000
    const knobK = t => t < D0 ? K0 : t < D1 ? lerp(K0, K1, E.io3(seg(t, D0, D1))) : K1;
    [0.3, 0.55, 0.8].forEach(f => sfx(lerp(D0, D1, f), 'tick', 0.35));

    // page 4: the AI splits the budget (a donut that fills) and recommends
    const p4 = page();
    const L7 = V[6][0];
    const SPLIT = [['TikTok', 0.45, '#DB2777', '₪1,350'], ['Facebook', 0.35, '#3B5BEB', '₪1,050'], ['Google', 0.2, '#9333EA', '₪600']];
    const DX = 330, DY = 980, DR = 130;
    const dsv = svgBox(p4, DX - 170, DY - 170, 340, 340);
    svgEl('circle', dsv, { cx: 170, cy: 170, r: DR, fill: 'none', stroke: '#F1EDFA', 'stroke-width': 56 });
    const CIRC = 2 * Math.PI * DR;
    let acc = 0;
    const arcs = SPLIT.map(([n, f, col]) => {
      const a = svgEl('circle', dsv, { cx: 170, cy: 170, r: DR, fill: 'none', stroke: col, 'stroke-width': 56,
        transform: `rotate(${-90 + acc * 360} 170 170)`, 'stroke-dasharray': `0 ${CIRC}` });
      acc += f; return { a, f };
    });
    const dmid = txt(p4, '₪3,000', Object.assign({ x: DX, y: DY, size: 44, weight: 700, color: C.INK2, dir: 'ltr' }, RUB));
    const legend = SPLIT.map(([n, f, col, amt], i) => {
      const g = grp(p4, 0, 0), y = 870 + i * 110;
      box(g, 860, y, 22, 22, { borderRadius: '6px', background: col });
      txt(g, n, Object.assign({ x: 835, y: y - 24, size: 32, weight: 700, color: C.INK2, align: 'r', dir: 'ltr' }, RUB));
      txt(g, amt + ' · ' + Math.round(f * 100) + '%', Object.assign({ x: 835, y: y + 26, size: 30, weight: 500, color: C.GREY, align: 'r', dir: 'ltr' }, RUB));
      return g;
    });
    const RECS = ['קהל: גילאי 25 עד 45', 'שעות: 18:00 עד 22:00', 'קריאייטיב: סרטון קצר'];
    const recs = RECS.map((s, i) => {
      const g = grp(p4, 0, 0), y = 1240 + i * 100;
      card(g, 190, y - 40, 700, 80, { r: 40, bg: '#FAF7FF', css: { border: '2px solid #DDD3F5' } });
      icon(g, P.star4, 846, y, 34, C.PURPLE, 2);
      txt(g, s, Object.assign({ x: 810, y: y + 1, size: 34, weight: 700, color: C.INK2, align: 'r' }, RUB));
      return g;
    });
    const T_DONUT = L7 + 0.25, T_LEG = L7 + 0.9, T_REC = L7 + 2.3;
    sfx(T_DONUT, 'sparkle', 0.6); recs.forEach((_, i) => sfx(T_REC + i * 0.35, 'pop', 0.4 - i * 0.05));

    // page 5: send; three lines run from the button to the platforms
    const p5 = page();
    const L8 = V[7][0];
    const sendB = grp(p5, 540, 930);
    box(sendB, 0, 18, 640, 130, { borderRadius: '44px', background: 'rgba(147,51,234,0.35)', filter: 'blur(26px)' });
    box(sendB, 0, 0, 700, 150, { borderRadius: '44px', background: GRAD_X });
    txt(sendB, 'שלח קמפיין', Object.assign({ x: -25, y: 0, size: 56, weight: 700, color: C.WHITE }, RUB));
    icon(sendB, P.send, 160, 0, 48, C.WHITE, 2);
    const PLX = [780, 540, 300], PLY = 1360;
    const lsv = svgBox(p5, 0, 0, W, H);
    const wires = PLX.map(x => {
      const d = `M540 1005 C540 1150 ${x} 1170 ${x} ${PLY - 60}`;
      const p = svgEl('path', lsv, { d, fill: 'none', stroke: '#C084FC', 'stroke-width': 5, 'stroke-linecap': 'round' });
      const L = p.getTotalLength(); p.setAttribute('stroke-dasharray', L);
      const dot = svgEl('circle', lsv, { r: 10, fill: C.PURPLE });
      return { p, L, dot };
    });
    const plats = ['Facebook', 'Google', 'TikTok'].map((s, i) => {
      const g = grp(p5, PLX[i], PLY);
      const base = box(g, 0, 0, 226, 92, { borderRadius: '46px', background: '#F1EDFA', border: '2px solid ' + C.LINE, boxSizing: 'border-box' });
      const on = box(g, 0, 0, 226, 92, { borderRadius: '46px', background: '#F0FDF4', border: '2px solid #BBF7D0', boxSizing: 'border-box' });
      txt(g, s, Object.assign({ x: -14, y: 1, size: 34, weight: 700, color: C.INK2, dir: 'ltr' }, RUB));
      const ck = grp(g, 80, 0);
      box(ck, 0, 0, 36, 36, { borderRadius: '50%', background: C.GREEN });
      icon(ck, P.check, 0, 0, 22, C.WHITE, 3);
      return { g, on, ck };
    });
    const T_SEND = L8 + 0.1, W0 = T_SEND + 0.15, W1 = T_SEND + 0.75, T_ON = [W1, W1 + 0.15, W1 + 0.3];
    sfx(T_SEND, 'click', 0.9); T_ON.forEach((x, i) => sfx(x, 'popHi', 0.45 - i * 0.05));

    // page 6: the AI agent, day after day
    const p6 = page();
    const L9 = V[8][0];
    const av = grp(p6, 830, 830);
    box(av, 0, 0, 88, 88, { borderRadius: '50%', background: GRAD });
    icon(av, P.star4, 0, 0, 44, C.WHITE, 2);
    txt(p6, 'סוכן AI', Object.assign({ x: 765, y: 804, size: 40, weight: 700, color: C.INK2, align: 'r' }, RUB));
    const liveDot = box(p6, 750, 866, 16, 16, { borderRadius: '50%', background: C.GREEN });
    txt(p6, 'עוקב אחרי הקמפיין', Object.assign({ x: 730, y: 866, size: 28, weight: 500, color: C.GREEN, align: 'r' }, RUB));
    // the day chip flips over like a desk calendar
    const DAYS = [L9 + 0.2, L9 + 1.9, L9 + 3.5];
    const day = grp(p6, 270, 830);
    box(day, 0, 0, 150, 84, { borderRadius: '24px', background: C.INK2 });
    const dayTx = DAYS.map((_, i) => txt(day, 'יום ' + (i + 1), Object.assign({ x: 0, y: 2, size: 36, weight: 700, color: C.WHITE }, RUB)));
    // performance line that keeps drawing upward
    const gsv = svgBox(p6, 210, 930, 660, 220);
    rect(p6, 210, 1150, 660, 2, { background: C.LINE });
    const gp = [[0, 190], [90, 175], [180, 182], [270, 150], [360, 140], [450, 110], [540, 85], [660, 40]].map(([x, y]) => `${x},${y}`).join(' ');
    const gline = svgEl('polyline', gsv, { points: gp, fill: 'none', stroke: '#9333EA', 'stroke-width': 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
    const GL = gline.getTotalLength(); gline.setAttribute('stroke-dasharray', GL);
    // chat: the agent writes from the left (other people's messages sit on the left in a Hebrew chat)
    const bubble = (lines, y, t0) => {
      const g = grp(p6, 0, 0), h = 40 + lines.length * 50;
      card(g, 190, y, 640, h, { r: 32, bg: '#F3EEFF', css: { borderTopLeftRadius: '8px' } });
      lines.forEach((s, i) => txt(g, s, Object.assign({ x: 800, y: y + 45 + i * 50, size: 32, weight: i === 0 ? 700 : 500, color: C.INK2, align: 'r' }, RUB)));
      const typing = grp(p6, 0, 0);
      card(typing, 190, y, 150, 76, { r: 32, bg: '#F3EEFF', css: { borderTopLeftRadius: '8px' } });
      const tdots = [0, 1, 2].map(i => box(typing, 235 + i * 30, y + 38, 16, 16, { borderRadius: '50%', background: C.LILAC }));
      return { g, typing, tdots, t0 };
    };
    const chat = [bubble(['בוקר טוב! טיקטוק מוביל אתמול,', 'העברתי אליו עוד תקציב.'], 1200, L9 + 1.1),
      bubble(['המלצה להיום:', 'לנסות כותרת חדשה למודעה.'], 1390, L9 + 2.9)];
    chat.forEach(c => sfx(c.t0, 'ding', 0.45)); DAYS.slice(1).forEach(d => sfx(d, 'tick', 0.5));

    // ---- call to action ----
    const L10 = V[9][0];
    const lam = letters(w, 'LOOK AT ME', { x: 540, y: 775, size: 118, font: F.LAT, weight: 900, color: C.INK2, dir: 'ltr' });
    const T1 = 'השיווק שלכם,', T2 = 'סוף סוף במקום אחד.', zt = Math.min(fit(T1, HERO, 720, 104), fit(T2, HERO, 720, 104));
    const tg1 = txt(w, T1, Object.assign({ x: 540, y: 955, size: zt, color: C.INK2 }, HERO));
    const tg2 = txt(w, T2, Object.assign({ x: 540, y: 1080, size: zt, color: C.INK2, css: gradText }, HERO));
    const cta = grp(w, 540, 1290);
    box(cta, 0, 24, 700, 150, { borderRadius: '48px', background: 'rgba(147,51,234,0.38)', filter: 'blur(34px)' });
    const ctaBox = box(cta, 0, 0, 760, 160, { borderRadius: '48px', background: GRAD_X, overflow: 'hidden' });
    const sheen = rect(ctaBox, 0, -40, 160, 240, { background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))' });
    txt(cta, 'נסו עכשיו', Object.assign({ x: 30, y: 2, size: 70, weight: 700, color: C.WHITE }, RUB));
    icon(cta, 'M19 12H5M11 6l-6 6 6 6', -160, 0, 58, C.WHITE, 2.4);   // forward in Hebrew points left
    const url = txt(w, 'lookatme.site', { x: 540, y: 1475, size: 84, font: F.LAT, weight: 700, color: C.PURPLE, dir: 'ltr' });
    const T_TAG1 = L10 + 1.52, T_TAG2 = L10 + 2.05, T_BTN = L10 + 4.1, T_CLICK = L10 + 4.6, T_URL = L10 + 3.2;
    sfx(T_CLICK, 'click', 0.9); sfx(T_CLICK + 0.05, 'sparkle', 0.5);

    // ---- cursor: drags the file, the slider knob, presses send and the call to action ----
    const cur = cursor(w, 62, C.INK2, C.WHITE);
    const fileP = t => {   // file position: from the lower right corner into the drop zone, then into the box
      const k = E.io3(seg(t, T_GRAB, T_DROP));
      return [lerp(720, 560, k), lerp(1470, 1000, k) - 60 * Math.sin(Math.PI * k)];
    };
    const knobX = t => lerp(SX0, SX1, knobK(t));
    const curPos = t => {
      if (t < T_DROP + 0.3) { const [x, y] = fileP(t); return [x + 40, y + 20]; }
      if (t < L6 - 0.2) return [lerp(600, 800, seg(t, T_DROP + 0.3, T_DROP + 0.8)), lerp(1020, 1650, seg(t, T_DROP + 0.3, T_DROP + 0.8))];
      if (t < D1 + 0.3) return [knobX(t) + 6, SY + 8 - 30 * (1 - seg(t, L6 - 0.2, D0))];
      if (t < T_SEND + 0.4) return [lerp(knobX(t), 560, E.io3(seg(t, L8 - 0.6, T_SEND))), lerp(SY + 8, 945, E.io3(seg(t, L8 - 0.6, T_SEND)))];
      return [lerp(560, 600, seg(t, T_BTN, T_CLICK)), lerp(945, 1300, E.io3(seg(t, T_BTN - 0.3, T_CLICK)))];
    };

    return t => {
      // the light opens as a circle from the centre
      const uOpen = seg(t, T_OPEN, T_OPEN + 2.0), rOpen = 1160 * Math.sqrt(E.smooth(uOpen));   // area (brightness) grows evenly: no flash
      root.style.clipPath = uOpen >= 1 ? 'none' : `circle(${rOpen.toFixed(1)}px at 540px 900px)`;

      // reveal
      const kr = S(t - T_LAND, 20, 0.6), ex = sp(t, T_PHONE - 0.25, 30);
      const ru = seg(t, T_LAND, T_LAND + 0.6);
      tf(ring, { s: 0.9 + 1.4 * E.o3(ru), o: (1 - ru) * (t >= T_LAND ? 1 : 0) });
      const am = rise(t, V[2][0]); tf(meet, { y: am.y - 40 * ex, o: am.o * (1 - ex) });
      tf(rName, { o: t < T_PHONE + 0.5 ? 1 : 0 });
      rName.spans.forEach((s, i) => { const r = rise(t, V[2][0] + 0.75 + i * 0.04, 40); tf(s, { y: r.y + 40 * ex, o: r.o * (1 - ex) }); });

      // the flying logo: lands at the centre, flies into the phone header, later flies out to the call to action
      const fIn = E.io3(seg(t, T_FLY, T_FLY + 0.55)), fOut = E.io3(seg(t, T_CTA - 0.1, T_CTA + 0.5));
      const phY = track(1350, [[T_PHONE, 0, 11, 0.9], [T_CTA, 1500, 12, 1]])(t);
      const hx = 850, hy = 680 + phY;
      let fx = lerp(540, hx, fIn), fy = lerp(860, hy, fIn), fs = lerp(1, 84 / 300, fIn);
      if (t >= T_CTA - 0.1) { fx = lerp(hx, 540, fOut); fy = lerp(680, 560, fOut); fs = lerp(84 / 300, 240 / 300, fOut); }
      const between = t >= T_FLY + 0.55 && t < T_CTA - 0.1;   // while the logo sits in the header, the header draws it
      tf(fly, { x: fx, y: fy, s: fs * (t < T_FLY ? kr : 1), r: -12 * (1 - S(t - T_LAND, 16, 0.8)), o: t >= T_LAND && !between ? 1 : 0 });
      tf(hdrLogo, { o: between ? 1 : 0 });

      // captions + step dots
      for (const c of capEls) c.l.forEach((g, i) => {
        const r = rise(t, c.a + i * 0.07), out = sp(t, c.b - 0.12, 40);
        tf(g, { y: r.y - 24 * out, o: r.o * (1 - out) });
      });
      const stepIdx = [V[3][0], V[4][0], V[5][0], V[6][0], V[7][0]].filter(x => t >= x).length - 1;
      const dIn = clamp(S(t - V[3][0], 20, 1), 0, 1) * (1 - sp(t, V[8][0] - 0.1, 30));
      dots.forEach((d, i) => {
        tf(d, { o: dIn, sx: i === stepIdx ? 2.6 : 1 });
        d.style.background = i <= stepIdx ? C.PURPLE : C.LILAC;
      });

      // phone and pages
      tf(ph, { y: phY, o: t >= T_PHONE - 0.1 ? 1 : 0 });
      const PAGE_T = [T_PHONE, V[4][0] - 0.2, V[5][0] - 0.2, V[6][0] - 0.2, V[7][0] - 0.2, V[8][0] - 0.2];
      const cur_ = track(0, PAGE_T.slice(1).map((x, i) => [x, i + 1, 13, 0.92]))(t);
      [p1, p2, p3, p4, p5, p6].forEach((p, i) => { const d = i - cur_; tf(p, { x: -d * (PW + 40), o: clamp(1 - 1.8 * Math.abs(d), 0, 1) }); });   // only pages on their way in or out are drawn

      // page 1
      const drop = sp(t, T_DROP, 30);
      tf(p1a, { o: 1 - drop });
      tf(p1b, { o: drop, s: lerp(0.9, 1, drop) });
      const up = E.io3(seg(t, U0, U1)); tf(bar, { sx: Math.max(0.001, up) });
      pct.inner.textContent = Math.round(100 * up) + '%'; tf(pct, { o: 1 - sp(t, U1 + 0.05, 40) });
      tf(ok1, pop(t, U1 + 0.05));
      const [flx, fly_] = fileP(t);
      tf(file, { x: flx, y: fly_ + phY, s: (1 - 0.6 * sp(t, T_DROP, 26)) * (1 + 0.06 * Math.sin(Math.PI * seg(t, T_GRAB, T_DROP))), o: t >= T_GRAB - 0.15 && t < T_DROP + 0.2 ? 1 - seg(t, T_DROP + 0.05, T_DROP + 0.2) : 0, r: -6 * Math.sin(Math.PI * seg(t, T_GRAB, T_DROP)) });

      // page 2
      fields.forEach(f => {
        const n = typed(t, f.t0, [...f.val].length, 20);
        const shown = [...f.val].slice(0, n).join(''); f.v.inner.textContent = shown;
        const typing = t >= f.t0 - 0.1 && n < [...f.val].length + 1;
        const left = 850 - (n ? measure(shown, f.vo).w : 0);   // the caret sits left of the text, where Hebrew grows
        tf(f.caret, { x: left - 8, o: typing && Math.floor(t * 4) % 2 === 0 ? 1 : 0 });
        f.fb.style.borderColor = typing ? '#C084FC' : C.LINE;
      });

      // page 3
      const kk = knobK(t);
      tf(knob, { x: lerp(SX0, SX1, kk), s: t > D0 - 0.05 && t < D1 + 0.05 ? 1.12 : 1 });
      tf(fillS, { sx: Math.max(0.001, kk) });
      money.inner.textContent = '₪' + (Math.round(lerp(500, 5000, kk) / 100) * 100).toLocaleString('en-US');

      // page 4
      arcs.forEach((a, i) => {
        const k = E.o3(seg(t, T_DONUT + i * 0.25, T_DONUT + 0.6 + i * 0.25));
        a.a.setAttribute('stroke-dasharray', `${(a.f * CIRC * k - 3).toFixed(1)} ${CIRC}`);
      });
      tf(dmid, { o: clamp(S(t - T_DONUT - 0.6, 18, 1), 0, 1) });
      legend.forEach((g, i) => { const r = rise(t, T_LEG + i * 0.12, 30); tf(g, { y: r.y, o: r.o }); });
      recs.forEach((g, i) => { const r = rise(t, T_REC + i * 0.35, 40, 24, 0.8); tf(g, { y: r.y, o: r.o }); });

      // page 5
      tf(sendB, { s: press(t, T_SEND, 0.92) });
      wires.forEach((wr, i) => {
        const k = E.io3(seg(t, W0 + i * 0.05, W1 + i * 0.05));
        wr.p.setAttribute('stroke-dashoffset', wr.L * (1 - k));
        const pt = wr.p.getPointAtLength(wr.L * k);
        wr.dot.setAttribute('cx', pt.x); wr.dot.setAttribute('cy', pt.y);
        wr.dot.setAttribute('opacity', k > 0 && k < 1 ? 1 : 0);
      });
      plats.forEach((p, i) => { tf(p.on, { o: t >= T_ON[i] ? 1 : 0 }); tf(p.ck, pop(t, T_ON[i], 28)); tf(p.g, { s: 1 + 0.08 * Math.exp(-8 * Math.max(0, t - T_ON[i])) * (t >= T_ON[i] ? 1 : 0) }); });

      // page 6
      tf(liveDot, { s: 1 + 0.35 * Math.max(0, Math.sin(t * 5)) });
      dayTx.forEach((d, i) => {
        const tin = DAYS[i], tout = DAYS[i + 1] ?? 1e9;
        const fin = S(t - tin, 22, 0.8), fout = S(t - tout, 30, 1);
        tf(d, { rx: (1 - fin) * -90, o: t >= tin && t < tout ? 1 : 0 });   // each day flips in over the last one
      });
      gline.setAttribute('stroke-dashoffset', GL * (1 - E.o3(seg(t, L9 + 0.2, L9 + 4.6))));
      chat.forEach(c => {
        const tt = c.t0 - 0.45, typing = t >= tt && t < c.t0;
        tf(c.typing, { o: typing ? 1 : 0 });
        c.tdots.forEach((d, i) => tf(d, { y: -6 * Math.max(0, Math.sin((t - tt) * 9 - i * 0.9)) }));
        const r = rise(t, c.t0, 30, 24, 0.8); tf(c.g, { y: r.y, o: r.o });
      });

      // call to action
      tf(lam, { o: t >= L10 ? 1 : 0 });
      lam.spans.forEach((s, i) => { const r = rise(t, L10 + 0.1 + i * 0.045, 40); tf(s, { y: r.y, o: r.o }); });
      const a1 = rise(t, T_TAG1); tf(tg1, { y: a1.y, o: a1.o });
      const a2 = rise(t, T_TAG2); tf(tg2, { y: a2.y, o: a2.o });
      const qc = rise(t, T_BTN, 60, 22, 0.8); tf(cta, { y: qc.y, o: qc.o, s: press(t, T_CLICK, 0.95) });
      tf(sheen, { x: lerp(-220, 840, S(t - T_CLICK - 0.05, 9, 1)), skx: -20, o: t > T_CLICK ? 1 : 0 });
      const qu = rise(t, T_URL); tf(url, { y: qu.y, o: qu.o });

      // cursor
      const [cx, cy] = curPos(t);
      const co = Math.max(vis(t, T_GRAB - 0.25, T_DROP + 0.7), vis(t, L6 - 0.25, D1 + 0.35), vis(t, L8 - 0.65, T_SEND + 0.5), vis(t, T_BTN - 0.3, T_CLICK + 1.2));
      const yOff = t < T_CTA ? phY : 0;
      tf(cur, { x: cx, y: cy + yOff, o: co, s: press(t, T_SEND, 0.86) * press(t, T_CLICK, 0.86) * (t > D0 - 0.05 && t < D1 + 0.05 ? 0.9 : 1) });

      tf(cam, { s: 1 + 0.03 * seg(t, T_OPEN, DUR) + 0.008 * Math.sin((t - T_OPEN) * 1.3), y: -10 * Math.sin((t - T_OPEN) * 0.9) });
    };
  });
})();
