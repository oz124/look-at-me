// LOOK AT ME, "from chaos to one place", 1080x1920, 25.2 s. Every time below is synced to the voice-over (mix.py).
// 1. chaos: ad-manager windows slam in, the screen piles up, alerts drop, then everything collapses into one point.
// 2. one place: the logo lands (the score opens), one app holds every platform, the AI recommends, a calm dashboard.
// 3. call to action.
(() => {
  'use strict';
  const GRAD = 'linear-gradient(135deg, #3B5BEB 0%, #9333EA 55%, #DB2777 100%)';
  const GRAD_X = 'linear-gradient(90deg, #3B5BEB 0%, #9333EA 50%, #DB2777 100%)';
  const RUB = { font: F.RUBIK };
  const gradText = { background: GRAD_X, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', padding: '0 0.04em' };
  const swap = (el, t, a, b) => tf(el, { o: vis(t, a, b, 22, 34), blur: 8 * (1 - S(t - a, 22, 1)) + (t > b ? 8 * S(t - b, 30, 1) : 0) });
  const press = (t, tc, k = 0.94) => track(1, [[tc, k, 40, 1], [tc + 0.12, 1, 26, 0.7]])(t);
  const pop = (t, t0, wn = 26, z = 0.6) => ({ s: S(t - t0, wn, z), o: t >= t0 ? 1 : 0 });

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

  // ================================ 1. chaos ================================
  const T_TURN = 6.3;
  scene('chaos', 0, T_TURN, { bg: C.INK }, (root) => {
    const cam = grp(root, W / 2, H / 2), w = grp(cam, -W / 2, -H / 2);
    const pile = grp(w, 540, 900), P0 = grp(pile, -540, -900);   // everything that collapses, pivoting on the frame centre

    // an ad-manager window: title bar with three dots, a falling line chart and skeleton rows, one bad metric
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
    // small untitled windows that pile up (spreadsheet grid or bars)
    const small = [[300, 420, 460, 280, 7, 2.85], [800, 560, 420, 260, -8, 3.15], [250, 1180, 440, 270, -9, 3.45], [820, 1250, 460, 280, 6, 3.75]].map(([cx, cy, ww, hh, r, t0], k) => {
      const g = win(cx, cy, ww, hh, null, null);
      if (k % 2) for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) rect(g, -ww / 2 + 30 + j * (ww - 60) / 4, -hh / 2 + 84 + i * 40, (ww - 60) / 4 - 6, 32, { background: '#24213A' });
      return { g, r, t0 };
    });
    const big = [
      { g: win(480, 760, 700, 360, 'Facebook Ads', 'המרות: 0'), r: -5, t0: 0.12 },
      { g: win(600, 950, 700, 360, 'Google Ads', 'CTR 0.3%'), r: 4, t0: 0.83 },
      { g: win(500, 1140, 700, 360, 'TikTok Ads', '₪4.90 לקליק'), r: -3, t0: 1.59 },
    ];
    // alerts dropping from the top
    const toast = (s, y, t0) => {
      const g = grp(P0, 540, y);
      rect(g, -420 + 10, -55 + 20, 820, 110, { borderRadius: '30px', background: 'rgba(0,0,0,0.6)', filter: 'blur(22px)' });
      box(g, 0, 0, 840, 116, { borderRadius: '30px', background: '#2A2740', border: '2px solid #3A3658', boxSizing: 'border-box' });
      box(g, 360, 0, 52, 52, { borderRadius: '50%', background: C.RED });
      txt(g, '!', { x: 360, y: 2, size: 36, font: F.LAT, weight: 900, color: C.WHITE, dir: 'ltr' });
      txt(g, s, Object.assign({ x: 310, y: 1, size: 42, weight: 700, color: C.WHITE, align: 'r' }, RUB));
      return { g, t0 };
    };
    const toasts = [toast('0 המרות היום', 370, 3.9), toast('התקציב היומי נוצל', 370, 4.4)];
    // the question, over a dark band at the bottom
    const band = rect(w, 0, 1180, W, 740, { background: 'linear-gradient(180deg, rgba(15,13,31,0) 0%, rgba(15,13,31,0.92) 35%, #0F0D1F 100%)' });
    const hero = { font: F.D, weight: 900 };
    const Q1 = 'עושים שיווק ממומן,', Q2 = 'ולא רואים תוצאות?';
    const zq = Math.min(fit(Q1, hero, 680, 100), fit(Q2, hero, 680, 100));
    const q1 = txt(w, Q1, Object.assign({ x: 540, y: 1380, size: zq, color: C.WHITE }, hero));
    const q2 = txt(w, Q2, Object.assign({ x: 540, y: 1490, size: zq, color: C.PINK }, hero));
    const q2from = Math.min(1.12, (W - 40) / (measure(Q2, Object.assign({ size: zq }, hero)).w * 1.04));

    const T_SUCK = 5.85;
    big.forEach((b, i) => sfx(b.t0, 'hit', 0.9 - i * 0.1));
    small.forEach((b, i) => sfx(b.t0, 'tick', 0.6 - i * 0.08));
    sfx(3.9, 'pop', 0.7); sfx(4.4, 'glitch', 0.5); sfx(4.27, 'hit', 0.6); sfx(T_SUCK - 0.05, 'whoosh', 0.7);

    return t => {
      for (const b of big) {
        b.g.line.setAttribute('stroke-dashoffset', b.g.len * (1 - E.smooth(seg(t, b.t0 + 0.05, b.t0 + 1.1))));   // the falling line draws itself
        const k = slam(t, b.t0, 1.22);
        tf(b.g, { s: k.s * (1 + 0.03 * seg(t, b.t0, T_SUCK)), o: k.o, y: -50 * seg(t, b.t0, T_SUCK), r: b.r + 2.5 * Math.sin(t * 2 + b.r) });
      }
      for (const b of small) { const k = pop(t, b.t0, 24, 0.62); tf(b.g, { s: k.s, o: k.o, r: b.r }); }
      toasts.forEach((q, i) => {
        const r = rise(t, q.t0, -60, 26, 0.7);
        const down = i === 0 ? 135 * S(t - toasts[1].t0, 22, 0.8) : 0;    // the first alert is pushed down by the second
        tf(q.g, { y: r.y + down, o: r.o });
      });
      tf(band, { o: clamp(S(t - 2.6, 10, 1), 0, 1) });
      const r1 = rise(t, 2.78); tf(q1, { y: r1.y, o: r1.o });
      const k2 = slam(t, 4.27, q2from); tf(q2, { s: k2.s, o: k2.o });
      // collapse: everything is sucked into the centre, spinning
      const c = S(t - T_SUCK, 13, 1);
      tf(pile, { s: Math.max(0.001, 1 - 0.97 * c), r: 40 * c, o: 1 - clamp((t - T_SUCK - 0.25) / 0.15, 0, 1) });
      [q1, q2].forEach(g => { g.style.opacity = String(Math.min(+g.style.opacity || 1, 1 - c)); });
      band.style.opacity = String(Math.min(+band.style.opacity, 1 - c));
      // camera: pushes in as it gets crowded, shakes on the slams, small jitter while the alerts land
      const [sx, sy, sr] = shake(t, [...big.map(b => [b.t0, 16]), [4.27, 10], [4.4, 8]]);
      tf(cam, { x: sx, y: sy, r: sr, s: 1 + 0.03 * E.o3(seg(t, 0, 2)) + 0.03 * seg(t, 0, T_SUCK) });
    };
  });

  // ============================ 2. one place + call to action ============================
  const T_APP = 7.9, T_AI = 10.6, T_DASH = 15.3, T_CTA = 18.9;
  scene('one', T_TURN, DUR, { bg: C.PAPER }, (root) => {
    div(root, { width: W + 'px', height: H + 'px', background:
      'radial-gradient(900px 700px at 90% 8%, rgba(219,39,119,0.10), transparent 70%), radial-gradient(900px 800px at 5% 92%, rgba(59,91,235,0.10), transparent 70%)' });
    const cam = grp(root, W / 2, H / 2), w = grp(cam, -W / 2, -H / 2);
    const hero = { font: F.D, weight: 900, color: C.INK2 };

    // ---- the reveal: logo lands where the windows vanished ----
    const ring = box(w, 540, 800, 300, 300, { borderRadius: '50%', border: '6px solid #C084FC', boxSizing: 'border-box' });
    const rLogo = logo(w, 540, 800, 300);
    const rName = letters(w, 'LOOK AT ME', { x: 540, y: 1060, size: fit('LOOK AT ME', { font: F.LAT, weight: 900 }, 720, 120), font: F.LAT, weight: 900, color: C.INK2, dir: 'ltr' });
    sfx(T_TURN, 'impact', 0.9); sfx(T_TURN + 0.02, 'sparkle', 0.5);

    // ---- headlines above the phone ----
    const caps = [
      [T_APP + 0.3, T_AI, 'כל הפלטפורמות', 'במקום אחד'],
      [T_AI, T_DASH, 'ניתוח AI חכם', 'מה עובד, ומה שורף כסף'],
      [T_DASH, T_CTA, 'בלי לקפוץ בין מערכות.', 'בלי לנחש.'],
    ];
    const zc = Math.min(...caps.flatMap(c => [fit(c[2], hero, 820, 110), fit(c[3], hero, 820, 110)]));
    const capEls = caps.map(([a, b, s1, s2]) => ({ a, b,
      l: [txt(w, s1, Object.assign({ x: 540, y: 330, size: zc }, hero)), txt(w, s2, Object.assign({ x: 540, y: 465, size: zc, css: gradText }, hero))] }));

    // ---- the phone ----
    const PX = 130, PW = 820, PT = 600;
    const ph = grp(w, 0, 0);
    card(ph, PX, PT, PW, 1500, { r: 72, shadow: 'rgba(76,29,149,0.22)', css: { border: '3px solid ' + C.LINE } });
    logo(ph, 850, 680, 84, false);
    txt(ph, 'LOOK AT ME', { x: 785, y: 682, size: 46, font: F.LAT, weight: 900, color: C.INK2, align: 'r', dir: 'ltr' });
    [-14, 0, 14].forEach(dy => rect(ph, 196, 680 + dy - 3, 40, 6, { borderRadius: '3px', background: C.INK2 }));
    rect(ph, PX + 40, 750, PW - 80, 2, { background: C.LINE });

    // rows: platform name on the right, check, status on the left
    const ROW = (parent, s, y, status, color = C.GREEN) => {
      const g = grp(parent, 0, 0);
      card(g, 190, y - 58, 700, 116, { r: 32, css: { border: '2px solid ' + C.LINE } });
      const ck = grp(g, 836, y);
      box(ck, 0, 0, 52, 52, { borderRadius: '50%', background: color });
      icon(ck, P.check, 0, 0, 30, C.WHITE, 3);
      txt(g, s, Object.assign({ x: 790, y, size: 44, weight: 700, color: C.INK2, align: 'r', dir: 'ltr' }, RUB));
      g.dot = box(g, 252, y, 20, 20, { borderRadius: '50%', background: color });
      txt(g, status, Object.assign({ x: 278, y, size: 36, weight: 500, color, align: 'l' }, RUB));
      return { g, ck };
    };
    const NAMES = ['Facebook', 'Google', 'TikTok'];

    // content 1: every platform lands in the app
    const c1 = grp(ph, 0, 0);
    const R1 = [8.4, 8.8, 9.2];
    const rows1 = NAMES.map((s, i) => ROW(c1, s, 880 + i * 140, 'מחובר'));
    R1.forEach((x, i) => sfx(x, 'popHi', 0.5 - i * 0.06));
    const one = grp(c1, 540, 1330);
    box(one, 0, 0, 700, 110, { borderRadius: '55px', background: GRAD_X });
    txt(one, 'דשבורד אחד לכל הקמפיינים', Object.assign({ x: 0, y: 1, size: 42, weight: 700, color: C.WHITE }, RUB));
    sfx(9.25, 'ding', 0.5);

    // content 2: the AI reads the campaigns and recommends one move
    const c2 = grp(ph, 0, 0);
    const head = grp(c2, 0, 0);
    box(head, 820, 850, 96, 96, { borderRadius: '28px', background: GRAD });
    icon(head, P.star4, 820, 850, 50, C.WHITE, 2);
    txt(head, 'ניתוח AI', Object.assign({ x: 750, y: 822, size: 42, weight: 700, color: C.INK2, align: 'r' }, RUB));
    txt(head, 'עלות לקליק לפי פלטפורמה', Object.assign({ x: 750, y: 892, size: 30, weight: 400, color: C.GREY, align: 'r' }, RUB));
    const BAR = [0.92, 0.7, 0.34], BAR_C = [C.RED, '#F59E0B', C.GREEN];
    const bars = NAMES.map((s, i) => {
      const y = 975 + i * 78, g = grp(c2, 0, 0);
      txt(g, s, Object.assign({ x: 860, y, size: 32, weight: 700, color: C.INK2, align: 'r', dir: 'ltr' }, RUB));
      rect(g, 210, y - 14, 500, 28, { borderRadius: '14px', background: '#F1EDFA' });
      const f = rect(g, 210, y - 14, 500, 28, { borderRadius: '14px', background: BAR_C[i], transformOrigin: '0 50%' });   // bars fill left to right
      return { g, f };
    });
    const rec = grp(c2, 0, 0);
    card(rec, 190, 1210, 700, 300, { r: 36, bg: '#FAF7FF', shadow: 'rgba(76,29,149,0.16)', css: { border: '2px solid #DDD3F5' } });
    icon(rec, P.bolt, 840, 1262, 40, C.PURPLE, 2);
    txt(rec, 'המלצה', Object.assign({ x: 805, y: 1262, size: 34, weight: 700, color: C.PURPLE, align: 'r' }, RUB));
    txt(rec, 'טיקטוק מביא את הקליקים הזולים ביותר.', Object.assign({ x: 850, y: 1316, size: 34, weight: 500, color: C.INK2, align: 'r' }, RUB));
    txt(rec, 'להעביר אליו תקציב?', Object.assign({ x: 850, y: 1380, size: 34, weight: 700, color: C.INK2, align: 'r' }, RUB));
    const yes = grp(rec, 715, 1445);
    box(yes, 0, 0, 230, 76, { borderRadius: '38px', background: GRAD_X });
    txt(yes, 'כן', Object.assign({ x: 0, y: 1, size: 36, weight: 700, color: C.WHITE }, RUB));
    box(rec, 465, 1445, 230, 76, { borderRadius: '38px', background: '#EEE9F8' });
    txt(rec, 'לא עכשיו', Object.assign({ x: 465, y: 1446, size: 32, weight: 500, color: C.GREY }, RUB));
    const done = grp(c2, 540, 1445);
    box(done, 0, 0, 640, 84, { borderRadius: '42px', background: C.GREEN });
    icon(done, P.check, 190, 0, 38, C.WHITE, 3);
    txt(done, 'התקציב עודכן', Object.assign({ x: -20, y: 1, size: 38, weight: 700, color: C.WHITE }, RUB));
    const T_BARS = 11.1, T_REC = 12.3, T_YES = 13.75;
    sfx(T_AI + 0.2, 'sparkle', 0.7); sfx(T_REC, 'pop', 0.6); sfx(T_YES, 'click', 0.9); sfx(T_YES + 0.2, 'success', 0.7);

    // content 3: calm dashboard, everything live
    const c3 = grp(ph, 0, 0);
    card(c3, 190, 820, 700, 150, { r: 32, bg: '#FAF7FF', css: { border: '2px solid ' + C.LINE } });
    txt(c3, 'קמפיינים פעילים', Object.assign({ x: 850, y: 895, size: 40, weight: 500, color: C.GREY, align: 'r' }, RUB));
    const live = txt(c3, '3', Object.assign({ x: 240, y: 897, size: 84, weight: 700, color: C.INK2, align: 'l', dir: 'ltr' }, RUB));
    const rows3 = NAMES.map((s, i) => ROW(c3, s + ' Ads', 1080 + i * 140, 'פעיל'));
    const R3 = [15.6, 15.8, 16.0];
    R3.forEach((x, i) => sfx(x, 'pop', 0.4 - i * 0.05));

    // ---- call to action ----
    const ctaLogo = logo(w, 540, 560, 240);
    const lam = letters(w, 'LOOK AT ME', { x: 540, y: 775, size: 118, font: F.LAT, weight: 900, color: C.INK2, dir: 'ltr' });
    const T1 = 'השיווק שלכם,', T2 = 'במקום אחד.', zt = Math.min(fit(T1, hero, 760, 110), fit(T2, hero, 760, 110));
    const tg1 = txt(w, T1, Object.assign({ x: 540, y: 955, size: zt }, hero));
    const tg2 = txt(w, T2, Object.assign({ x: 540, y: 1085, size: zt, css: gradText }, hero));
    const cta = grp(w, 540, 1290);
    box(cta, 0, 24, 700, 150, { borderRadius: '48px', background: 'rgba(147,51,234,0.38)', filter: 'blur(34px)' });
    const ctaBox = box(cta, 0, 0, 760, 160, { borderRadius: '48px', background: GRAD_X, overflow: 'hidden' });
    const sheen = rect(ctaBox, 0, -40, 160, 240, { background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))' });
    txt(cta, 'נסו עכשיו', Object.assign({ x: 30, y: 2, size: 70, weight: 700, color: C.WHITE }, RUB));
    icon(cta, 'M19 12H5M11 6l-6 6 6 6', -160, 0, 58, C.WHITE, 2.4);   // forward in Hebrew points left
    const url = txt(w, 'lookatme.site', { x: 540, y: 1475, size: 84, font: F.LAT, weight: 700, color: C.PURPLE, dir: 'ltr' });
    const T_LOGO = 19.0, T_LET = 19.15, T_TAG1 = 20.05, T_TAG2 = 21.2, T_BTN = 22.5, T_CLICK = 23.05, T_URL = 23.3;
    sfx(T_LOGO, 'pop', 0.8); sfx(T_CLICK, 'click', 0.9); sfx(T_CLICK + 0.05, 'sparkle', 0.5);

    // ---- cursor ----
    const cur = cursor(w, 62, C.INK2, C.WHITE);
    const curP = track([820, 1760], [[13.1, [700, 1460], 9, 0.95], [14.2, [860, 1760], 10, 1], [22.6, [600, 1300], 9, 0.95]]);

    return t => {
      // reveal
      const kr = S(t - T_TURN, 20, 0.6), ex = sp(t, T_APP - 0.1, 30);
      tf(rLogo, { s: kr * (1 - 0.2 * ex), r: -14 * (1 - S(t - T_TURN, 16, 0.8)), o: (t >= T_TURN ? 1 : 0) * (1 - ex) });
      const ru = seg(t, T_TURN, T_TURN + 0.6);
      tf(ring, { s: 0.9 + 1.4 * E.o3(ru), o: (1 - ru) * (t >= T_TURN ? 1 : 0) });
      rName.spans.forEach((s, i) => { const r = rise(t, T_TURN + 0.25 + i * 0.04, 40); tf(s, { y: r.y - 30 * ex, o: r.o * (1 - ex) }); });

      for (const c of capEls) c.l.forEach((g, i) => {
        const r = rise(t, c.a + 0.05 + i * 0.07), out = sp(t, c.b - 0.12, 40);
        tf(g, { y: r.y - 24 * out, o: r.o * (1 - out) });
      });

      tf(ph, { y: track(1350, [[T_APP, 0, 11, 0.9], [T_CTA - 0.15, 1500, 12, 1]])(t), o: t >= T_APP ? 1 : 0 });

      // 1: platforms connect
      swap(c1, t, T_APP + 0.1, T_AI);
      rows1.forEach((r, i) => {
        const k = S(t - R1[i], 22, 0.7), side = i === 1 ? 1 : -1;     // the rows fly in from alternating sides
        tf(r.g, { x: side * 500 * (1 - k), o: t >= R1[i] ? 1 : 0, mb: [vel(x => side * 500 * (1 - S(x - R1[i], 22, 0.7)), t), 0] });
        tf(r.ck, pop(t, R1[i] + 0.2, 28));
        tf(r.g.dot, { s: 1 + 0.35 * Math.max(0, Math.sin((t - R1[i]) * 6 - i)) });
      });
      const ko = pop(t, 9.25, 24, 0.62); tf(one, { s: ko.s, o: ko.o });

      // 2: AI
      swap(c2, t, T_AI + 0.1, T_DASH);
      tf(head, { o: clamp(S(t - T_AI - 0.15, 20, 1), 0, 1) });
      bars.forEach((b, i) => {
        const r = rise(t, T_BARS - 0.3 + i * 0.1, 30); tf(b.g, { y: r.y, o: r.o });
        const target = i === 2 ? track(BAR[2], [[T_YES + 0.1, 0.34, 14, 0.8]])(t) : BAR[i];
        tf(b.f, { sx: Math.max(0.001, target * S(t - T_BARS - i * 0.12, 9, 0.9)) });
      });
      const qr = rise(t, T_REC, 50, 22, 0.8); tf(rec, { y: qr.y, o: qr.o * (1 - sp(t, T_YES + 0.15, 40)) });
      tf(yes, { s: press(t, T_YES, 0.9) });
      tf(done, pop(t, T_YES + 0.2, 24, 0.62));

      // 3: dashboard
      swap(c3, t, T_DASH + 0.1, T_CTA - 0.3);
      tf(live, { o: t >= R3[0] ? 1 : 0, s: 1 + 0.12 * Math.max(0, Math.sin((t - R3[0]) * 4)) * Math.exp(-(t - R3[0])) });
      rows3.forEach((r, i) => {
        const q = rise(t, R3[i], 40, 24, 0.8); tf(r.g, { y: q.y, o: q.o });
        tf(r.ck, pop(t, R3[i] + 0.12, 28));
        tf(r.g.dot, { s: 1 + 0.35 * Math.max(0, Math.sin((t - R3[i]) * 6 - i)) });
      });

      // call to action
      tf(ctaLogo, { s: S(t - T_LOGO, 20, 0.62), r: -12 * (1 - S(t - T_LOGO, 16, 0.8)), o: t >= T_LOGO ? 1 : 0 });
      lam.spans.forEach((s, i) => { const r = rise(t, T_LET + i * 0.045, 40); tf(s, { y: r.y, o: r.o }); });
      const a1 = rise(t, T_TAG1); tf(tg1, { y: a1.y, o: a1.o });
      const a2 = rise(t, T_TAG2); tf(tg2, { y: a2.y, o: a2.o });
      const qc = rise(t, T_BTN, 60, 22, 0.8); tf(cta, { y: qc.y, o: qc.o, s: press(t, T_CLICK, 0.95) });
      tf(sheen, { x: lerp(-220, 840, S(t - T_CLICK - 0.05, 9, 1)), skx: -20, o: t > T_CLICK ? 1 : 0 });
      const qu = rise(t, T_URL); tf(url, { y: qu.y, o: qu.o });

      const [cx, cy] = curP(t);
      tf(cur, { x: cx, y: cy, o: Math.max(vis(t, 13.05, 14.2), vis(t, 22.55, 24.3)), s: press(t, T_YES, 0.86) * press(t, T_CLICK, 0.86) });

      tf(cam, { s: 1 + 0.03 * seg(t, T_TURN, DUR) + 0.01 * Math.sin((t - T_TURN) * 1.3), y: -12 * Math.sin((t - T_TURN) * 0.9) });
    };
  });
})();
