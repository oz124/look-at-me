// LOOK AT ME ad, 1080x1920, 22 s.
// Pain (dark) -> the brand's promise -> three step product demo in a phone -> live dashboard -> one call to action.
(() => {
  'use strict';
  const GRAD = 'linear-gradient(135deg, #3B5BEB 0%, #9333EA 55%, #DB2777 100%)';
  const GRAD_X = 'linear-gradient(90deg, #3B5BEB 0%, #9333EA 50%, #DB2777 100%)';
  const RUB = { font: F.RUBIK };
  const gradText = { background: GRAD_X, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', padding: '0 0.04em' };
  const fade = (t, a, b, wi = 22, wo = 34) => vis(t, a, b, wi, wo);
  // content that swaps inside a container: short blur in, faster blur out
  const swap = (el, t, a, b) => tf(el, { o: fade(t, a, b), blur: 8 * (1 - S(t - a, 22, 1)) + (t > b ? 8 * S(t - b, 30, 1) : 0) });
  const press = (t, tc, k = 0.94) => track(1, [[tc, k, 40, 1], [tc + 0.12, 1, 26, 0.7]])(t);

  // the user's logo (PNG with white corners: clipped to its own rounded square)
  const LOGO_IMG = new Image(); LOGO_IMG.src = window.LOGO; PRELOAD.push(LOGO_IMG.decode());
  function logo(parent, cx, cy, size, shadow = true) {
    const g = grp(parent, cx, cy);
    if (shadow) box(g, 0, size * 0.1, size * 0.92, size * 0.92, { borderRadius: '22%', background: 'rgba(91,33,182,0.28)', filter: `blur(${size * 0.12}px)` });
    const b = box(g, 0, 0, size, size, { borderRadius: '21.3%', overflow: 'hidden' });
    const im = LOGO_IMG.cloneNode(); Object.assign(im.style, { width: '100%', height: '100%', display: 'block' }); b.appendChild(im);
    return g;
  }
  // soft card with a blurred copy behind it as the shadow (big box-shadows band in Chromium)
  function card(parent, x, y, w, h, o = {}) {
    if (o.shadow) rect(parent, x + 10, y + 24, w - 20, h, { borderRadius: (o.r || 40) + 'px', background: o.shadow, filter: 'blur(34px)' });
    return rect(parent, x, y, w, h, Object.assign({ borderRadius: (o.r || 40) + 'px', background: o.bg || C.WHITE, boxSizing: 'border-box' }, o.css || {}));
  }

  // ================================ 1. the pain (dark) ================================
  const T_W1 = 0.12, T_W2 = 1.5, T_PAIN = 2.9, T_LIGHT = 5.3;
  scene('pain', 0, T_LIGHT, { bg: C.INK }, (root) => {
    const cam = grp(root, W / 2, H / 2), w = grp(cam, -W / 2, -H / 2);
    const hero = { font: F.D, weight: 900, color: C.WHITE };

    const s1 = 'עוד קמפיין.', z1 = fit(s1, hero, 840, 300);
    const w1 = txt(w, s1, Object.assign({ x: 540, y: 820, size: z1 }, hero));
    const from1 = Math.min(1.25, (W - 40) / (measure(s1, Object.assign({ size: z1 }, hero)).w * 1.04));

    const s2 = 'עוד ניחוש.', o2 = Object.assign({ wdth: 100, ls: 0.03 }, hero), z2 = fit(s2, o2, 840, 300);
    const w2 = txt(w, s2, Object.assign({ x: 540, y: 820, size: z2 }, o2));

    // headline over the dashboard cards
    const zh = Math.min(fit('הכסף נשרף.', hero, 760, 150), fit('התוצאות לא.', hero, 760, 150));
    const h1 = txt(w, 'הכסף נשרף.', Object.assign({ x: 540, y: 440, size: zh }, hero));
    const h2 = txt(w, 'התוצאות לא.', Object.assign({ x: 540, y: 600, size: zh }, hero, { color: C.PINK }));

    // spend card: the number keeps climbing
    const spend = grp(w, 0, 0);
    card(spend, 140, 770, 800, 340, { bg: C.CARD, r: 48, css: { border: '2px solid #2A2547' } });
    txt(spend, 'הוצאה', Object.assign({ x: 880, y: 850, size: 54, weight: 500, color: C.MUTED, align: 'r' }, RUB));
    const spendV = txt(spend, '₪0', Object.assign({ x: 880, y: 1000, size: 170, weight: 700, color: C.WHITE, align: 'r', dir: 'ltr' }, RUB));
    // clicks card: stuck on zero
    const clicks = grp(w, 0, 0);
    card(clicks, 140, 1150, 800, 300, { bg: C.CARD, r: 48, css: { border: '2px solid #2A2547' } });
    txt(clicks, 'קליקים', Object.assign({ x: 880, y: 1225, size: 54, weight: 500, color: C.MUTED, align: 'r' }, RUB));
    const zero = txt(clicks, '0', Object.assign({ x: 880, y: 1350, size: 130, weight: 700, color: C.PINK, align: 'r', dir: 'ltr' }, RUB));
    txt(clicks, 'CTR', Object.assign({ x: 200, y: 1225, size: 54, weight: 500, color: C.MUTED, align: 'l', dir: 'ltr' }, RUB));
    txt(clicks, '0.00%', Object.assign({ x: 200, y: 1350, size: 100, weight: 700, color: C.MUTED, align: 'l', dir: 'ltr' }, RUB));

    const C0 = 3.05, C1 = 4.7;
    sfx(T_W1, 'hit', 0.9); sfx(T_W2, 'hit', 0.65);
    [3.1, 3.4, 3.7, 4.0, 4.3].forEach((x, i) => sfx(x, 'count', 0.4 - i * 0.04));
    sfx(3.9, 'thud', 0.55);

    return t => {
      // word 1: slam, out fast on the cut
      const k1 = slam(t, T_W1, from1);
      tf(w1, { s: k1.s * (1 + 0.06 * seg(t, T_W1, T_W2)) * (1 - 0.06 * sp(t, T_W2 - 0.05, 40)), o: k1.o * (1 - sp(t, T_W2 - 0.05, 60)) });
      // word 2: narrow to wide
      const k = S(t - T_W2, 26, 0.68), c = clamp(k, 0, 1);
      w2.inner.style.fontStretch = lerp(62.5, 100, c) + '%';
      w2.inner.style.letterSpacing = lerp(-0.04, 0.03, c) + 'em';
      tf(w2, { sx: lerp(0.6, 1, k), s: 1 + 0.05 * seg(t, T_W2, T_PAIN), o: (t >= T_W2 ? 1 : 0) * (1 - sp(t, T_PAIN - 0.05, 60)) });
      // dashboard of pain
      const r1 = rise(t, T_PAIN + 0.05); tf(h1, { y: r1.y, o: r1.o });
      const r2 = rise(t, 3.85); tf(h2, { y: r2.y, o: r2.o });
      const rc = rise(t, T_PAIN, 80, 22, 0.85); tf(spend, { y: rc.y, o: rc.o });
      const rd = rise(t, 3.2, 80, 22, 0.85); tf(clicks, { y: rd.y, o: rd.o });
      const v = Math.round(2480 * E.o3(seg(t, C0, C1)));
      spendV.inner.textContent = '₪' + v.toLocaleString('en-US');
      tf(zero, { s: 1 + 0.12 * (track(0, [[3.9, 1, 40, 1], [4.0, 0, 18, 0.6]])(t) + track(0, [[4.5, 1, 40, 1], [4.6, 0, 18, 0.6]])(t)) });
      // camera: slow push, shake on the slams
      const [sx, sy, sr] = shake(t, [[T_W1, 14], [T_W2, 9]]);
      tf(cam, { x: sx, y: sy, s: 1 + 0.06 * t / T_LIGHT, r: sr + 0.4 * Math.sin(t * 0.7) });
    };
  });

  // ============================ 2. light: promise, demo, CTA ============================
  const T_EXIT = 7.75, T_PHONE = 7.8, T_S2 = 10.6, T_S3 = 13.1, T_S4 = 15.5, T_CTA = 17.9;
  scene('light', T_LIGHT, DUR, { bg: C.PAPER }, (root) => {
    // static backdrop like the site: lavender with two soft colour pools
    div(root, { width: W + 'px', height: H + 'px', background:
      'radial-gradient(900px 700px at 90% 8%, rgba(219,39,119,0.10), transparent 70%), radial-gradient(900px 800px at 5% 92%, rgba(59,91,235,0.10), transparent 70%)' });
    const cam = grp(root, W / 2, H / 2), w = grp(cam, -W / 2, -H / 2);
    const hero = { font: F.D, weight: 900, color: C.INK2 };

    // ---- the promise ----
    const pLogo = logo(w, 540, 700, 300);
    const L1 = 'תפסיקו לנחש', L2 = 'תתחילו לפרסם חכם', zp = fit(L2, hero, 740, 170);
    const p1 = txt(w, L1, Object.assign({ x: 540, y: 1010, size: zp }, hero));
    const p2 = txt(w, L2, Object.assign({ x: 540, y: 1195, size: zp, css: gradText }, hero));
    sfx(T_LIGHT - 0.05, 'whoosh', 0.5); sfx(T_LIGHT + 0.1, 'pop', 0.8); sfx(6.35, 'chime', 0.5);

    // ---- captions above the phone: line 1 ink, line 2 brand gradient ----
    const caps = [
      [8.0, T_S2, 'מעלים', 'סרטון אחד'],
      [T_S2, T_S3, 'AI בונה לכם', 'אסטרטגיה מלאה'],
      [T_S3, T_S4, 'שולחים בקליק', 'לכל הפלטפורמות'],
      [T_S4, T_CTA, 'מהסרטון ועד', 'קמפיין חי באוויר'],
    ];
    const zc = Math.min(...caps.flatMap(c => [fit(c[2], hero, 840, 120), fit(c[3], hero, 840, 120)]));
    const capEls = caps.map(([a, b, s1, s2]) => ({ a, b,
      l: [txt(w, s1, Object.assign({ x: 540, y: 330, size: zc }, hero)), txt(w, s2, Object.assign({ x: 540, y: 470, size: zc, css: gradText }, hero))] }));

    // ---- the phone ----
    const PX = 130, PW = 820, PT = 600;
    const ph = grp(w, 0, 0);
    card(ph, PX, PT, PW, 1500, { r: 72, shadow: 'rgba(76,29,149,0.22)', css: { border: '3px solid ' + C.LINE } });
    // header like the site
    logo(ph, 850, 680, 84, false);
    txt(ph, 'LOOK AT ME', { x: 785, y: 682, size: 46, font: F.LAT, weight: 900, color: C.INK2, align: 'r', dir: 'ltr' });
    [-14, 0, 14].forEach(dy => rect(ph, 196, 680 + dy - 3, 40, 6, { borderRadius: '3px', background: C.INK2 }));
    rect(ph, PX + 40, 750, PW - 80, 2, { background: C.LINE });
    // three step indicator, step 1 on the right
    const STEPX = [780, 540, 300], SY = 830, UPLOAD = ['M12 15V4', 'M7.5 8.5L12 4l4.5 4.5', 'M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15'];
    const STEPI = [UPLOAD, P.star4, P.send], STEPT = [T_PHONE, T_S2, T_S3];
    const conn = [0, 1].map(i => {
      rect(ph, STEPX[i + 1] + 62, SY - 3, STEPX[i] - STEPX[i + 1] - 124, 6, { borderRadius: '3px', background: C.LINE });
      const f = rect(ph, STEPX[i + 1] + 62, SY - 3, STEPX[i] - STEPX[i + 1] - 124, 6, { borderRadius: '3px', background: GRAD_X, transformOrigin: '100% 50%' });
      return f;
    });
    const stepOn = STEPX.map((x, i) => {
      box(ph, x, SY, 104, 104, { borderRadius: '30px', background: '#F7F3FF' });
      icon(ph, STEPI[i], x, SY, 46, C.LILAC, 2);
      const g = grp(ph, x, SY);
      box(g, 0, 0, 104, 104, { borderRadius: '30px', background: C.PURPLE });
      icon(g, STEPI[i], 0, 0, 46, C.WHITE, 2);
      return g;
    });

    // content 1: upload
    const c1 = grp(ph, 0, 0);
    rect(c1, 190, 930, 700, 470, { borderRadius: '44px', border: '4px dashed #C084FC', boxSizing: 'border-box', background: 'rgba(245,240,255,0.6)' });
    const c1a = grp(c1, 0, 0);
    box(c1a, 540, 1060, 130, 130, { borderRadius: '36px', background: '#F3E8FF' });
    icon(c1a, UPLOAD, 540, 1060, 60, C.PURPLE, 2);
    txt(c1a, 'לחץ להעלאת סרטון', Object.assign({ x: 540, y: 1190, size: 48, weight: 700, color: C.PURPLE }, RUB));
    txt(c1a, 'MP4, MOV, AVI עד 4GB', Object.assign({ x: 540, y: 1258, size: 34, weight: 400, color: C.GREY }, RUB));
    box(c1a, 540, 1330, 210, 60, { borderRadius: '30px', background: '#F3E8FF' });
    txt(c1a, 'ניתוח AI', Object.assign({ x: 555, y: 1331, size: 32, weight: 500, color: C.PURPLE }, RUB));
    icon(c1a, P.star4, 470, 1330, 30, C.PURPLE, 2);
    const c1b = grp(c1, 0, 0);
    box(c1b, 540, 1050, 120, 120, { borderRadius: '34px', background: '#F3E8FF' });
    icon(c1b, P.file, 540, 1050, 56, C.PURPLE, 2);
    txt(c1b, 'פרסומת.mp4', Object.assign({ x: 540, y: 1170, size: 44, weight: 700, color: C.INK2, dir: 'ltr' }, RUB));
    rect(c1b, 270, 1236, 540, 18, { borderRadius: '9px', background: C.LINE });
    const bar = rect(c1b, 270, 1236, 540, 18, { borderRadius: '9px', background: GRAD_X, transformOrigin: '0 50%' });
    const pct = txt(c1b, '0%', Object.assign({ x: 540, y: 1310, size: 36, weight: 500, color: C.GREY, dir: 'ltr' }, RUB));
    const done1 = grp(c1b, 540, 1310);
    box(done1, 0, 0, 64, 64, { borderRadius: '50%', background: C.GREEN });
    icon(done1, P.check, 0, 0, 36, C.WHITE, 3);
    const T_CLICK1 = 9.45, U0 = 9.55, U1 = 10.2, T_DONE1 = 10.3;
    sfx(T_CLICK1, 'click', 0.8); sfx(T_DONE1, 'tick', 0.7);

    // content 2: the AI builds the strategy
    const c2 = grp(ph, 0, 0);
    const tile = grp(c2, 540, 1010);
    box(tile, 0, 0, 150, 150, { borderRadius: '42px', background: GRAD });
    icon(tile, P.star4, 0, 0, 74, C.WHITE, 2);
    const ROWS = (parent, labels, y0, status) => labels.map((s, i) => {
      const g = grp(parent, 0, 0), y = y0 + i * 140;
      card(g, 190, y - 58, 700, 116, { r: 32, css: { border: '2px solid ' + C.LINE } });
      const ck = grp(g, 836, y);
      box(ck, 0, 0, 52, 52, { borderRadius: '50%', background: C.GREEN });
      icon(ck, P.check, 0, 0, 30, C.WHITE, 3);
      txt(g, s, Object.assign({ x: 790, y, size: 44, weight: 700, color: C.INK2, align: 'r', dir: /^[A-Za-z]/.test(s) ? 'ltr' : 'rtl' }, RUB));
      g.dot = box(g, 252, y, 20, 20, { borderRadius: '50%', background: C.GREEN });
      txt(g, status, Object.assign({ x: 278, y, size: 36, weight: 500, color: C.GREEN, align: 'l' }, RUB));
      return { g, ck };
    });
    const rows2 = ROWS(c2, ['קהל יעד', 'קריאייטיב', 'תקציב'], 1170, 'מוכן');
    const R2 = [11.2, 11.55, 11.9];
    sfx(T_S2 + 0.2, 'sparkle', 0.7); R2.forEach((x, i) => sfx(x, 'pop', 0.4 - i * 0.05));

    // content 3: one click to every platform
    const c3 = grp(ph, 0, 0);
    const PILLS = ['Facebook', 'Google', 'TikTok'], R3 = [13.4, 13.6, 13.8];
    const pills = PILLS.map((s, i) => {
      const x = 777 - i * 237, g = grp(c3, x, 1000), po = Object.assign({ size: 36, weight: 700, color: '#15803D', dir: 'ltr' }, RUB);
      const tw = measure(s, po).w, all = tw + 14 + 16;   // text, gap, dot (dot on the right, as on the site)
      box(g, 0, 0, 226, 92, { borderRadius: '46px', background: '#F0FDF4', border: '2px solid #BBF7D0', boxSizing: 'border-box' });
      txt(g, s, Object.assign({ x: -all / 2, y: 1, align: 'l' }, po));
      box(g, all / 2 - 8, 0, 16, 16, { borderRadius: '50%', background: C.GREEN });
      return g;
    });
    const banner = grp(c3, 0, 0);
    rect(banner, 190, 1110, 700, 120, { borderRadius: '32px', background: '#F0FDF4', border: '2px solid #BBF7D0', boxSizing: 'border-box' });
    icon(banner, P.check, 836, 1170, 42, C.GREEN, 3);
    txt(banner, 'הכל מחובר, מוכן לשליחה', Object.assign({ x: 800, y: 1170, size: 42, weight: 700, color: '#15803D', align: 'r' }, RUB));
    const sendB = grp(c3, 540, 1360);
    box(sendB, 0, 16, 640, 130, { borderRadius: '40px', background: 'rgba(147,51,234,0.35)', filter: 'blur(26px)' });
    box(sendB, 0, 0, 700, 140, { borderRadius: '40px', background: GRAD_X });
    txt(sendB, 'שלח קמפיין', Object.assign({ x: -25, y: 0, size: 52, weight: 700, color: C.WHITE }, RUB));
    icon(sendB, P.send, 150, 0, 46, C.WHITE, 2);
    const T_CLICK3 = 14.95;
    R3.forEach((x, i) => sfx(x, 'popHi', 0.35 - i * 0.04)); sfx(13.95, 'ding', 0.5); sfx(T_CLICK3, 'click', 0.8);

    // content 4: live
    const c4 = grp(ph, 0, 0);
    card(c4, 190, 905, 700, 150, { r: 32, bg: '#FAF7FF', css: { border: '2px solid ' + C.LINE } });
    txt(c4, 'קמפיינים פעילים', Object.assign({ x: 850, y: 980, size: 40, weight: 500, color: C.GREY, align: 'r' }, RUB));
    const live = txt(c4, '0', Object.assign({ x: 240, y: 982, size: 84, weight: 700, color: C.INK2, align: 'l', dir: 'ltr' }, RUB));
    const rows4 = ROWS(c4, ['Facebook Ads', 'Google Ads', 'TikTok Ads'], 1170, 'פעיל');
    const R4 = [15.85, 16.05, 16.25];
    R4.forEach((x, i) => sfx(x, 'pop', 0.35 - i * 0.05)); sfx(16.45, 'success', 0.7);

    // the phone dissolves into the page at the bottom
    rect(w, -40, 1560, W + 80, 420, { background: 'linear-gradient(180deg, rgba(245,241,255,0) 0%, rgba(245,241,255,0.92) 70%, #F5F1FF 100%)' });

    // ---- call to action ----
    const ctaLogo = logo(w, 540, 640, 260);
    const lam = letters(w, 'LOOK AT ME', { x: 540, y: 880, size: 128, font: F.LAT, weight: 900, color: C.INK2, dir: 'ltr' });
    const cta = grp(w, 540, 1150);
    box(cta, 0, 24, 700, 150, { borderRadius: '48px', background: 'rgba(147,51,234,0.38)', filter: 'blur(34px)' });
    const ctaBox = box(cta, 0, 0, 760, 170, { borderRadius: '48px', background: GRAD_X, overflow: 'hidden' });
    const sheen = rect(ctaBox, 0, -40, 160, 250, { background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))' });
    txt(cta, 'נסו עכשיו', Object.assign({ x: 30, y: 2, size: 72, weight: 700, color: C.WHITE }, RUB));
    icon(cta, 'M19 12H5M11 6l-6 6 6 6', -165, 0, 60, C.WHITE, 2.4);   // forward in Hebrew points left
    const url = txt(w, 'lookatme.site', { x: 540, y: 1390, size: 92, font: F.LAT, weight: 700, color: C.PURPLE, dir: 'ltr' });
    const T_LOGO = 18.05, T_LET = 18.25, T_BTN = 18.75, T_CLICK5 = 19.5, T_URL = 19.8;
    sfx(T_LOGO, 'pop', 0.8); sfx(T_CLICK5, 'click', 0.9); sfx(T_CLICK5 + 0.05, 'sparkle', 0.5); sfx(T_URL, 'thud', 0.45);

    // ---- cursor (on top of everything in the world) ----
    const cur = cursor(w, 62, C.INK2, C.WHITE);
    const curP = track([820, 1760], [
      [8.7, [560, 1180], 9, 0.95], [9.75, [800, 1760], 10, 1],
      [14.3, [570, 1385], 9, 0.95], [15.2, [820, 1760], 10, 1],
      [18.85, [620, 1170], 9, 0.95]]);

    return t => {
      // promise
      const pl = S(t - (T_LIGHT + 0.1), 22, 0.62), ex = sp(t, T_EXIT, 34), drift = 1 + 0.06 * seg(t, T_LIGHT, T_EXIT);
      tf(pLogo, { s: pl * drift * (1 - 0.15 * ex), r: -12 * (1 - S(t - T_LIGHT - 0.1, 18, 0.8)), y: -18 * Math.sin(Math.PI * seg(t, T_LIGHT + 0.1, T_LIGHT + 0.6)), o: (t >= T_LIGHT + 0.1 ? 1 : 0) * (1 - ex) });
      const q1 = rise(t, 5.7), q2 = rise(t, 6.35);
      tf(p1, { s: drift, y: q1.y - 30 * ex - 40 * seg(t, 5.7, T_EXIT), o: q1.o * (1 - ex) });
      tf(p2, { s: drift, y: q2.y - 30 * ex - 30 * seg(t, 6.35, T_EXIT), o: q2.o * (1 - ex) });

      // captions
      for (const c of capEls) c.l.forEach((g, i) => {
        const r = rise(t, c.a + 0.08 + i * 0.07), out = sp(t, c.b - 0.12, 40);
        tf(g, { y: r.y - 24 * out, o: r.o * (1 - out) });
      });

      // phone comes up, later sinks
      tf(ph, { y: track(1350, [[T_PHONE, 0, 11, 0.9], [T_CTA - 0.1, 1500, 12, 1]])(t), o: t >= T_PHONE ? 1 : 0 });
      stepOn.forEach((g, i) => { const k = S(t - STEPT[i], 24, 0.6); tf(g, { s: lerp(0.6, 1, k), o: clamp(k * 3, 0, 1) }); });
      conn.forEach((f, i) => tf(f, { sx: Math.max(0.001, clamp(S(t - STEPT[i + 1] + 0.25, 14, 1), 0, 1)) }));

      // 1: upload
      swap(c1, t, T_PHONE + 0.1, T_S2);
      const sw = T_CLICK1 + 0.08;
      tf(c1a, { o: 1 - sp(t, sw, 40), blur: 8 * sp(t, sw, 40), s: press(t, T_CLICK1, 0.96) });
      tf(c1b, { o: sp(t, sw + 0.05, 24), blur: 8 * (1 - sp(t, sw + 0.05, 24)) });
      const up = E.io3(seg(t, U0, U1));
      tf(bar, { sx: Math.max(0.001, up) });
      pct.inner.textContent = Math.round(100 * up) + '%';
      tf(pct, { o: 1 - sp(t, T_DONE1, 40) });
      const kd = S(t - T_DONE1, 26, 0.6); tf(done1, { s: kd, o: t >= T_DONE1 ? 1 : 0 });

      // 2: AI
      swap(c2, t, T_S2 + 0.1, T_S3);
      const kt = S(t - T_S2 - 0.2, 20, 0.62);
      tf(tile, { s: kt * (1 + 0.04 * Math.sin(Math.max(0, t - T_S2) * 6)), r: 6 * Math.sin(Math.max(0, t - T_S2) * 2.2), o: t >= T_S2 + 0.2 ? 1 : 0 });
      rows2.forEach((r, i) => { const q = rise(t, R2[i], 40, 24, 0.8); tf(r.g, { y: q.y, o: q.o }); const kc = S(t - R2[i] - 0.15, 28, 0.6); tf(r.ck, { s: kc, o: t >= R2[i] + 0.15 ? 1 : 0 }); });

      // 3: platforms
      swap(c3, t, T_S3 + 0.1, T_S4);
      pills.forEach((g, i) => { const k = S(t - R3[i], 26, 0.6); tf(g, { s: lerp(0.5, 1, k), o: clamp(k * 4, 0, 1) }); });
      const qb = rise(t, 13.95, 30); tf(banner, { y: qb.y, o: qb.o });
      const qs = rise(t, 14.05, 40); tf(sendB, { y: qs.y, o: qs.o, s: press(t, T_CLICK3) });

      // 4: live
      swap(c4, t, T_S4 + 0.1, T_CTA - 0.25);
      live.inner.textContent = String(R4.filter(x => t >= x).length);
      tf(live, { s: 1 + 0.15 * R4.reduce((a, x) => a + track(0, [[x, 1, 40, 1], [x + 0.08, 0, 18, 0.6]])(t), 0) });
      rows4.forEach((r, i) => { tf(r.g.dot, { s: 1 + 0.35 * Math.max(0, Math.sin((t - R4[i]) * 6 - i)) }); const q = rise(t, R4[i], 40, 24, 0.8); tf(r.g, { y: q.y, o: q.o }); const kc = S(t - R4[i] - 0.12, 28, 0.6); tf(r.ck, { s: kc, o: t >= R4[i] + 0.12 ? 1 : 0 }); });

      // call to action
      const kl = S(t - T_LOGO, 20, 0.62);
      tf(ctaLogo, { s: kl, r: -12 * (1 - S(t - T_LOGO, 16, 0.8)), o: t >= T_LOGO ? 1 : 0 });
      lam.spans.forEach((s, i) => { const r = rise(t, T_LET + i * 0.045, 40); tf(s, { y: r.y, o: r.o }); });
      const qc = rise(t, T_BTN, 60, 22, 0.8);
      tf(cta, { y: qc.y, o: qc.o, s: press(t, T_CLICK5, 0.95) });
      tf(sheen, { x: lerp(-220, 840, S(t - T_CLICK5 - 0.05, 9, 1)), skx: -20, o: t > T_CLICK5 ? 1 : 0 });
      const qu = rise(t, T_URL); tf(url, { y: qu.y, o: qu.o });

      // cursor
      const [cx, cy] = curP(t);
      const co = Math.max(vis(t, 8.65, 9.9), vis(t, 14.25, 15.3), vis(t, 18.8, 20.5));
      tf(cur, { x: cx, y: cy, o: co, s: press(t, T_CLICK1, 0.86) * press(t, T_CLICK3, 0.86) * press(t, T_CLICK5, 0.86) });

      // camera: a slow push that never stops
      tf(cam, { s: 1 + 0.03 * seg(t, T_LIGHT, 22) + 0.012 * Math.sin((t - T_LIGHT) * 1.3), y: -14 * Math.sin((t - T_LIGHT) * 0.9) });
    };
  });

  // ---- time warp for the voice-over: the scenes are written on the original 22 s timeline ("old" time).
  // Scenes are sped up or settled stretches slowed so each narration line (timing.json) fits its scene; knots are [old, new] seconds.
  const KN = [[0, 0], [1.45, 1.45], [2.85, 2.8], [3.05, 3.0], [4.7, 4.8], [5.3, 5.65], [6.8, 7.15], [7.7, 8.25], [7.8, 8.35],
    [10.55, 10.8], [12.3, 12.45], [13.0, 13.85], [13.05, 13.9], [14.25, 15.25], [15.05, 16.15], [15.45, 16.95],
    [16.7, 18.2], [17.85, 19.95], [20.2, 22.3], [22, DUR]];
  const warp = (t, i, o) => {
    for (let k = 1; k < KN.length; k++) if (t <= KN[k][i]) return lerp(KN[k - 1][o], KN[k][o], (t - KN[k - 1][i]) / (KN[k][i] - KN[k - 1][i]));
    return KN[KN.length - 1][o];
  };
  const coreSeek = window.seek;
  window.seek = t => coreSeek(warp(clamp(t, 0, DUR), 1, 0));
  window.ready = window.ready.then(r => { window.SFX = window.SFX.map(([t, k, g]) => [+warp(t, 0, 1).toFixed(4), k, g]); return r; });
})();
