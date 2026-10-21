// LOOK AT ME, the real flow, 1080x1920, 31.2 s. Times follow the one-take voice-over (voice/lines.json + 0.6 s, mix.py).
// 1. money burns (canvas fire), the embers pull into one point, a circle of light opens on the logo.
// 2. the logo flies into the app header; the campaign wizard scrolls as it is filled (video, business, goal, budget).
// 3. the strategy summary builds itself; publish slides into the dashboard; the AI agent analyses, updates, stops waste.
// 4. the header logo flies out into the call to action. Every caption is the exact line the voice is saying.
// The app screens follow the real lookatme.site screens (wizard, campaign summary, control panel).
(() => {
  'use strict';
  const GRAD = 'linear-gradient(135deg, #3B5BEB 0%, #9333EA 55%, #DB2777 100%)';
  const GRAD_X = 'linear-gradient(90deg, #3B5BEB 0%, #9333EA 50%, #DB2777 100%)';
  const RUB = { font: F.RUBIK };
  const HERO = { font: F.D, weight: 900 };
  const gradText = { background: GRAD_X, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', padding: '0 0.04em' };
  const press = (t, tc, k = 0.94) => track(1, [[tc, k, 40, 1], [tc + 0.12, 1, 26, 0.7]])(t);
  const pop = (t, t0, wn = 26, z = 0.6) => ({ s: S(t - t0, wn, z), o: t >= t0 ? 1 : 0 });
  const V = [[0.19, 4.01], [4.71, 6.05], [6.6, 7.76], [8.09, 9.45], [9.91, 11.4], [11.81, 14.92], [15.52, 17.41], [17.75, 23.35], [24.06, 28.1]]
    .map(([a, b]) => [a + 0.6, b + 0.6]);

  const LOGO_IMG = new Image(); LOGO_IMG.src = window.LOGO; PRELOAD.push(LOGO_IMG.decode());
  function logo(parent, cx, cy, size, shadow = true) {
    const g = grp(parent, cx, cy);
    if (shadow) box(g, 0, size * 0.1, size * 0.92, size * 0.92, { borderRadius: '22%', background: 'rgba(91,33,182,0.28)', filter: `blur(${size * 0.12}px)` });
    const b = box(g, 0, 0, size, size, { borderRadius: '21.3%', overflow: 'hidden' });
    const im = LOGO_IMG.cloneNode(); Object.assign(im.style, { width: '100%', height: '100%', display: 'block' }); b.appendChild(im);
    return g;
  }
  function card(parent, x, y, w, h, o = {}) {
    if (o.shadow) rect(parent, x + 10, y + 24, w - 20, h, { borderRadius: (o.r || 32) + 'px', background: o.shadow, filter: 'blur(30px)' });
    return rect(parent, x, y, w, h, Object.assign({ borderRadius: (o.r || 32) + 'px', background: o.bg || C.WHITE, boxSizing: 'border-box', border: '2px solid ' + C.LINE }, o.css || {}));
  }
  // a switch like the ones in the control panel: knob slides, track changes colour
  function toggle(parent, cx, cy, on) {
    const g = grp(parent, cx, cy);
    const off = box(g, 0, 0, 72, 40, { borderRadius: '20px', background: '#D9D6E3' });
    const tr = box(g, 0, 0, 72, 40, { borderRadius: '20px', background: on });
    const knob = box(g, 0, 0, 32, 32, { borderRadius: '50%', background: C.WHITE, boxShadow: '0 2px 6px rgba(0,0,0,0.2)' });
    return { g, tr, knob, set: k => { tf(tr, { o: k }); tf(knob, { x: lerp(-16, 16, k) }); } };
  }

  // ================================ 1. money burns ================================
  const T_PULL = V[0][1] + 0.1, T_OPEN = T_PULL + 0.35;
  scene('burn', 0, T_OPEN + 2.2, { bg: C.INK }, (root) => {
    const cam = grp(root, W / 2, H / 2), w = grp(cam, -W / 2, -H / 2);
    const ctx = canvas2d(w, 0, 0, W, H);
    // five bills fanned around the centre, each with its own colour, angle and moment of ignition
    const BILLS = [[540, 760, -14, '#4C7DD9', '200', 0.05], [560, 700, 9, '#E58A3A', '100', 0.35], [520, 820, -3, '#3FA36B', '50', 0.65],
      [600, 640, 18, '#4C7DD9', '200', 0.95], [480, 880, -22, '#E58A3A', '100', 1.25]];
    const BW = 460, BH = 230, BURN = 3.0;
    const front = (b, p, x, t) => BH * (1 - p) + 16 * vnoise(x * 0.025 + t * 1.6, b) + 10 * vnoise(x * 0.07 - t * 2.3, b + 9);
    function bill(b, [cx, cy, rot, col, val, ti], t) {
      const p = clamp((t - ti) / BURN, 0, 1.15);
      if (p >= 1.12) return;
      const fall = 40 * Math.sin(t * 0.8 + b) + 30 * t, sway = 3 * Math.sin(t * 1.1 + b * 2);
      ctx.save(); ctx.translate(cx, cy + fall); ctx.rotate((rot + sway) * Math.PI / 180); ctx.translate(-BW / 2, -BH / 2);
      // what is left of the bill: everything above the burning front
      ctx.beginPath(); ctx.moveTo(0, -40);
      for (let x = 0; x <= BW; x += 12) ctx.lineTo(x, front(b, p, x, t));
      ctx.lineTo(BW, -40); ctx.closePath();
      ctx.save(); ctx.clip();
      ctx.fillStyle = col; ctx.beginPath(); ctx.roundRect(0, 0, BW, BH, 18); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(14, 14, BW - 28, BH - 28, 12); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.beginPath(); ctx.arc(BW * 0.28, BH / 2, 62, 0, 7); ctx.fill();
      ctx.fillStyle = '#FFFFFF'; ctx.direction = 'ltr'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '700 84px Rubik'; ctx.fillText(val, BW * 0.66, BH / 2 + 4);
      ctx.font = '700 64px Rubik'; ctx.fillText('₪', BW * 0.28, BH / 2 + 4);
      // charring just above the front
      const g = ctx.createLinearGradient(0, BH * (1 - p) - 50, 0, BH * (1 - p) + 20);
      g.addColorStop(0, 'rgba(40,20,10,0)'); g.addColorStop(1, 'rgba(40,20,10,0.85)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, BW, BH);
      ctx.restore();
      if (p > 0 && p < 1.08) {
        // glowing edge and flames along the front
        ctx.globalCompositeOperation = 'lighter';
        ctx.strokeStyle = 'rgba(255,170,60,0.9)'; ctx.lineWidth = 5; ctx.beginPath();
        for (let x = 0; x <= BW; x += 12) { const y = front(b, p, x, t); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.stroke();
        for (let i = 0; i < 26; i++) {
          const x = (i + 0.5) * BW / 26 + 8 * vnoise(i + t * 3, b), y0 = front(b, p, x, t);
          const life = (t * (1.6 + hash(i + b * 31)) + hash(i * 7 + b)) % 1;
          const y = y0 - life * (70 + 60 * hash(i + b)), r = (1 - life) * (26 + 18 * hash(i * 3 + b));
          const fg = ctx.createRadialGradient(x, y, 0, x, y, r);
          fg.addColorStop(0, 'rgba(255,230,140,0.75)'); fg.addColorStop(0.4, 'rgba(255,140,40,0.45)'); fg.addColorStop(1, 'rgba(255,60,20,0)');
          ctx.fillStyle = fg; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.restore();
    }
    // embers rising from the fire; they are pulled into one point before the light opens
    const EMB = 150;
    function embers(t, pull) {
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < EMB; i++) {
        const life = (t * (0.35 + 0.4 * hash(i)) + hash(i * 13)) % 1;
        let x = 340 + 400 * hash(i * 5) + 60 * vnoise(t * 0.8 + i, 3), y = 1000 - life * 760;
        x = lerp(x, 540, pull); y = lerp(y, 860, pull);
        const r = (2 + 4 * hash(i * 17)) * (1 - 0.5 * life) * (1 - 0.6 * pull);
        ctx.fillStyle = `rgba(255,${150 + 80 * hash(i)},60,${(1 - life) * 0.9 * Math.min(1, t / 0.4)})`;
        ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    // spend chip at the top: the number keeps climbing, the results stay at zero
    const chip = grp(w, 540, 330);
    box(chip, 0, 0, 820, 104, { borderRadius: '52px', background: '#1E1B33', border: '2px solid #3A3658', boxSizing: 'border-box' });
    const spent = txt(chip, '₪0', Object.assign({ x: 330, y: 2, size: 46, weight: 700, color: '#FF9F5A', align: 'r', dir: 'ltr' }, RUB));
    txt(chip, 'הוצאה', Object.assign({ x: 120, y: 2, size: 34, weight: 500, color: C.MUTED, align: 'r' }, RUB));
    txt(chip, 'תוצאות: 0', Object.assign({ x: -360, y: 2, size: 38, weight: 700, color: C.RED, align: 'l' }, RUB));
    // captions on a dark band
    const band = rect(w, 0, 1180, W, 740, { background: 'linear-gradient(180deg, rgba(15,13,31,0) 0%, rgba(15,13,31,0.92) 35%, #0F0D1F 100%)' });
    const Q1 = 'הכסף שלכם נשרף על שיווק ממומן,', Q2 = 'והתוצאות לא מגיעות?';
    const zq = Math.min(fit(Q1, HERO, 760, 92), fit(Q2, HERO, 680, 92));
    const q1 = txt(w, Q1, Object.assign({ x: 540, y: 1380, size: zq, color: C.WHITE }, HERO));
    const q2 = txt(w, Q2, Object.assign({ x: 540, y: 1490, size: zq, color: '#FF8A4C' }, HERO));
    const T_Q2 = V[0][0] + 2.57;
    sfx(0.05, 'whoosh', 0.5); BILLS.forEach((b, i) => i && sfx(b[5], 'thud', 0.35)); sfx(T_PULL, 'rise', 0.5);

    return t => {
      ctx.clearRect(0, 0, W, H);
      const pull = E.io3(seg(t, T_PULL, T_OPEN + 0.2));
      ctx.save(); ctx.translate(540, 860); ctx.scale(1 - 0.85 * pull, 1 - 0.85 * pull); ctx.rotate(pull * 0.6); ctx.translate(-540, -860);
      ctx.globalAlpha = 1 - pull;
      BILLS.forEach((b, i) => bill(i + 1, b, t));
      ctx.restore(); ctx.globalAlpha = 1;
      embers(t, pull);
      tf(chip, { o: clamp(S(t - 0.15, 18, 1), 0, 1) * (1 - pull), y: -20 * (1 - S(t - 0.15, 18, 1)) });
      spent.inner.textContent = '₪' + Math.round(3240 * E.o3(seg(t, 0.2, V[0][1]))).toLocaleString('en-US');
      tf(band, { o: 1 - pull });
      const r1 = rise(t, V[0][0]); tf(q1, { y: r1.y, o: r1.o * (1 - pull) });
      const r2 = rise(t, T_Q2); tf(q2, { y: r2.y, o: r2.o * (1 - pull) });
      tf(cam, { s: 1.02 + 0.04 * seg(t, 0, T_PULL), y: 8 * Math.sin(t * 1.3) });
    };
  });

  // ============================ 2-4. light: the app, the agent, the call to action ============================
  const T_PHONE = V[2][0] - 0.35, T_CTA = V[8][0] - 0.25;
  scene('light', T_OPEN, DUR, { bg: C.PAPER }, (root) => {
    div(root, { width: W + 'px', height: H + 'px', background:
      'radial-gradient(900px 700px at 90% 8%, rgba(219,39,119,0.10), transparent 70%), radial-gradient(900px 800px at 5% 92%, rgba(59,91,235,0.10), transparent 70%)' });
    const cam = grp(root, W / 2, H / 2), w = grp(cam, -W / 2, -H / 2);
    const T_LAND = T_OPEN + 0.25;

    // ---- reveal ----
    const ring = box(w, 540, 860, 300, 300, { borderRadius: '50%', border: '6px solid #C084FC', boxSizing: 'border-box' });
    const meet = txt(w, 'תכירו את', Object.assign({ x: 540, y: 600, size: 96, color: C.INK2 }, HERO));
    const rName = letters(w, 'LOOK AT ME', { x: 540, y: 1110, size: fit('LOOK AT ME', { font: F.LAT, weight: 900 }, 720, 120), font: F.LAT, weight: 900, color: C.INK2, dir: 'ltr' });
    sfx(T_LAND, 'impact', 0.7); sfx(T_LAND + 0.02, 'sparkle', 0.5);

    // ---- captions above the phone: exactly the voice ----
    const caps = [
      [V[2][0], V[3][0], ['מעלים את הפרסומת,']],
      [V[3][0], V[4][0], ['כותבים בקצרה על העסק,']],
      [V[4][0], V[5][0], ['בוחרים תקציב ומטרה,']],
      [V[5][0], V[6][0], ['והמערכת בונה לכם', 'אסטרטגיית שיווק מלאה.']],
      [V[6][0], V[7][0], ['עם מעקב מלא אחרי התוצאות,']],
      [V[7][0], T_CTA, ['וסוכן AI שמנתח את ביצועי הקמפיין,', 'מעדכן, ומונע בזבוז של כסף.']],
    ];
    const zc = Math.min(...caps.flatMap(c => c[2].map(s => fit(s, HERO, 860, 90))));
    const capEls = caps.map(([a, b, ls]) => ({ a, b, l: ls.map((s, i) => txt(w, s, Object.assign({ x: 540, y: ls.length === 1 ? 420 : 350 + i * 120, size: zc, color: C.INK2, css: i === ls.length - 1 ? gradText : {} }, HERO))) }));

    // ---- the phone: the site header, then a clipped screen area ----
    const PX = 130, PW = 820, PT = 600;
    const ph = grp(w, 0, 0);
    card(ph, PX, PT, PW, 1500, { r: 72, shadow: 'rgba(76,29,149,0.22)', css: { border: '3px solid ' + C.LINE } });
    const hdrLogo = logo(ph, 870, 668, 60, false);
    txt(ph, 'LOOK AT ME', { x: 830, y: 670, size: 28, font: F.LAT, weight: 900, color: C.INK2, align: 'r', dir: 'ltr' });
    // nav: home, control panel, start campaign; the active pill slides between the last two
    const NAV = [['חזור', 570], ['לוח בקרה', 462], ['התחל קמפיין', 330]];
    const navPill = box(ph, 0, 668, 160, 54, { borderRadius: '16px', background: GRAD_X });
    const navTx = NAV.map(([s, x]) => [txt(ph, s, Object.assign({ x, y: 669, size: 24, weight: 500, color: C.GREY }, RUB)), txt(ph, s, Object.assign({ x, y: 669, size: 24, weight: 700, color: C.WHITE }, RUB))]);
    const avatar = box(ph, 185, 668, 50, 50, { borderRadius: '50%', background: GRAD });
    icon(ph, P.person, 185, 668, 28, C.WHITE, 2);
    rect(ph, PX + 30, 722, PW - 60, 2, { background: C.LINE });
    const clip = rect(ph, PX + 3, 726, PW - 6, 830, { overflow: 'hidden' });   // ends above the Reels caption area
    const pages = grp(clip, -PX - 3, -726);
    const page = () => grp(pages, 0, 0);
    const fly = logo(w, 0, 0, 300);

    // step indicator like the wizard: upload & details, AI recommendations, edit & publish (step 1 on the right)
    function steps(parent, y) {
      const XS = [800, 540, 280], LB = ['העלאת סרטון ופרטי עסק', 'המלצות AI מתקדמות', 'עריכה ופרסום'], IC = [['M12 15V4', 'M7.5 8.5L12 4l4.5 4.5', 'M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15'], P.star4, P.send];
      rect(parent, 320, y - 2, 440, 4, { background: C.LINE });
      const fill = rect(parent, 320, y - 2, 440, 4, { background: C.PURPLE, transformOrigin: '100% 50%' });   // progress runs right to left
      const nodes = XS.map((x, i) => {
        box(parent, x, y, 64, 64, { borderRadius: '18px', background: '#F7F3FF' });
        icon(parent, IC[i], x, y, 30, C.LILAC, 2);
        const on = grp(parent, x, y);
        box(on, 0, 0, 64, 64, { borderRadius: '18px', background: C.PURPLE });
        const ic = icon(on, IC[i], 0, 0, 30, C.WHITE, 2);
        const ck = icon(on, P.check, 0, 0, 30, C.WHITE, 3);
        txt(parent, LB[i], Object.assign({ x, y: y + 56, size: 20, weight: 500, color: C.PURPLE }, RUB));
        return { on, ic, ck };
      });
      return { fill, nodes };
    }

    // ---- page A: the wizard, one long form that scrolls while it is filled ----
    const pA = page(), A = grp(pA, 0, 0);
    const A1 = grp(A, 0, 0), A2 = grp(A, 0, 0), A3 = grp(A, 0, 0);   // top, upload, lower part: each hidden once it is scrolled out of view
    const stA = steps(A1, 790);
    txt(A1, 'העלאת סרטון לניתוח AI', Object.assign({ x: 870, y: 905, size: 30, weight: 700, color: C.INK2, align: 'r' }, RUB));
    rect(A2, 190, 940, 700, 250, { borderRadius: '28px', border: '3px dashed #C084FC', boxSizing: 'border-box', background: 'rgba(245,240,255,0.6)' });
    const upA = grp(A2, 0, 0);
    box(upA, 540, 1015, 80, 80, { borderRadius: '22px', background: '#F3E8FF' });
    icon(upA, ['M12 15V4', 'M7.5 8.5L12 4l4.5 4.5', 'M4 15v3.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V15'], 540, 1015, 40, C.PURPLE, 2);
    txt(upA, 'לחץ להעלאת סרטון', Object.assign({ x: 540, y: 1092, size: 32, weight: 700, color: C.PURPLE }, RUB));
    txt(upA, 'MP4, MOV, AVI עד 4GB', Object.assign({ x: 540, y: 1140, size: 22, weight: 400, color: C.GREY }, RUB));
    const upB = grp(A2, 0, 0);
    const thumb = grp(upB, 470, 1050);
    box(thumb, 0, 0, 200, 130, { borderRadius: '18px', background: 'linear-gradient(135deg, #F59E0B, #DB2777)' });
    box(thumb, 0, 0, 52, 52, { borderRadius: '50%', background: 'rgba(255,255,255,0.9)' });
    icon(thumb, P.play, 3, 0, 24, C.PINK, 2, C.PINK);
    txt(upB, 'פרסומת.mp4', Object.assign({ x: 820, y: 1015, size: 30, weight: 700, color: C.INK2, align: 'r', dir: 'ltr' }, RUB));
    rect(upB, 600, 1060, 220, 14, { borderRadius: '7px', background: C.LINE });
    const bar = rect(upB, 600, 1060, 220, 14, { borderRadius: '7px', background: GRAD_X, transformOrigin: '0 50%' });
    const okUp = grp(upB, 795, 1115);
    box(okUp, 0, 0, 44, 44, { borderRadius: '50%', background: C.GREEN });
    icon(okUp, P.check, 0, 0, 26, C.WHITE, 3);
    // business description
    const ta = rect(A, 190, 1225, 700, 170, { borderRadius: '24px', background: C.WHITE, border: '2px solid ' + C.LINE, boxSizing: 'border-box' });
    const ph1 = txt(A, 'ספר לנו על העסק שלך...', Object.assign({ x: 860, y: 1268, size: 28, weight: 400, color: '#A3A0B5', align: 'r' }, RUB));
    const DESC = ['מאפייה שכונתית בתל אביב.', 'מאפים טריים כל בוקר.'];
    const descO = Object.assign({ size: 30, weight: 500, color: C.INK2, align: 'r' }, RUB);
    const desc = DESC.map((s, i) => txt(A, '', Object.assign({ x: 860, y: 1268 + i * 46 }, descO)));
    txt(A, 'תיאור מפורט = המלצות מדויקות', Object.assign({ x: 860, y: 1422, size: 22, weight: 400, color: C.GREY, align: 'r' }, RUB));
    // connected platforms
    rect(A, 190, 1460, 700, 76, { borderRadius: '20px', background: '#F0FDF4', border: '2px solid #BBF7D0', boxSizing: 'border-box' });
    txt(A, 'הכל מחובר, מוכן לשליחה', Object.assign({ x: 860, y: 1499, size: 26, weight: 700, color: '#15803D', align: 'r' }, RUB));
    ['TikTok', 'Google', 'Facebook'].forEach((s, i) => {
      const x = 250 + i * 118;
      box(A, x, 1498, 108, 42, { borderRadius: '21px', background: C.WHITE, border: '2px solid #BBF7D0', boxSizing: 'border-box' });
      txt(A, s, Object.assign({ x, y: 1499, size: 19, weight: 700, color: '#15803D', dir: 'ltr' }, RUB));
    });
    // goal
    txt(A3, 'מטרת הקמפיין', Object.assign({ x: 850, y: 1590, size: 30, weight: 700, color: C.INK2, align: 'r' }, RUB));
    const GOALS = [['לידים', 775, P.person], ['מכירות', 540, ['M5 6h15l-2 8H7z', 'M5 6L4 3H2', 'M9 19.5h.01M16 19.5h.01']], ['חשיפה', 305, P.search]];
    const goals = GOALS.map(([s, x, ic]) => {
      const g = grp(A3, x, 1680);
      box(g, 0, 0, 220, 120, { borderRadius: '22px', background: C.WHITE, border: '2px solid ' + C.LINE, boxSizing: 'border-box' });
      const sel = box(g, 0, 0, 220, 120, { borderRadius: '22px', background: '#F7F1FF', border: '4px solid ' + C.PURPLE, boxSizing: 'border-box' });
      icon(g, ic, 0, -20, 36, C.PURPLE, 2);
      txt(g, s, Object.assign({ x: 0, y: 30, size: 26, weight: 700, color: C.INK2 }, RUB));
      return { g, sel };
    });
    // daily budget
    txt(A3, 'תקציב יומי', Object.assign({ x: 850, y: 1790, size: 30, weight: 700, color: C.INK2, align: 'r' }, RUB));
    rect(A3, 340, 1820, 550, 80, { borderRadius: '20px', background: C.WHITE, border: '2px solid ' + C.LINE, boxSizing: 'border-box' });
    const budO = Object.assign({ x: 860, y: 1861, size: 34, weight: 700, color: C.INK2, align: 'r', dir: 'ltr' }, RUB);
    const bud = txt(A3, '', budO);
    const budCaret = rect(A3, 0, 1840, 3, 40, { background: C.PURPLE });
    rect(A3, 190, 1820, 130, 80, { borderRadius: '20px', background: C.WHITE, border: '2px solid ' + C.LINE, boxSizing: 'border-box' });
    txt(A3, 'ILS ₪', Object.assign({ x: 255, y: 1861, size: 28, weight: 700, color: C.INK2, dir: 'ltr' }, RUB));
    txt(A3, 'AI יחלק את התקציב באופן מיטבי', Object.assign({ x: 860, y: 1935, size: 22, weight: 400, color: C.GREY, align: 'r' }, RUB));
    const next = grp(A3, 275, 2010);
    box(next, 0, 0, 170, 76, { borderRadius: '20px', background: C.PURPLE });
    txt(next, 'הבא', Object.assign({ x: 18, y: 1, size: 30, weight: 700, color: C.WHITE }, RUB));
    icon(next, 'M19 12H5M11 6l-6 6 6 6', -46, 0, 28, C.WHITE, 2.4);
    // the dragged video file lives above the phone
    const file = grp(w, 0, 0);
    box(file, 0, 0, 250, 92, { borderRadius: '22px', background: C.WHITE, border: '2px solid ' + C.LINE, boxSizing: 'border-box', boxShadow: '0 18px 40px rgba(76,29,149,0.25)' });
    icon(file, P.file, 82, 0, 38, C.PURPLE, 2);
    txt(file, 'פרסומת.mp4', Object.assign({ x: -25, y: 1, size: 28, weight: 700, color: C.INK2, dir: 'ltr' }, RUB));
    const L3 = V[2][0], L4 = V[3][0], L5 = V[4][0], L6 = V[5][0];
    const T_GRAB = L3 + 0.3, T_DROP = L3 + 0.95, U0 = T_DROP + 0.05, U1 = T_DROP + 0.6;
    const T_TYPE = [L4 + 0.05, L4 + 0.65], T_GOAL = L5 + 0.35, T_BUD = L5 + 0.75, T_NEXT = L6 - 0.25;
    const scrollA = track(0, [[L5 - 0.25, 600, 10, 1]]);
    sfx(T_DROP, 'thud', 0.5); sfx(U1 + 0.05, 'tick', 0.5); sfx(T_GOAL, 'click', 0.7); sfx(T_NEXT, 'click', 0.8);
    [0, 6, 12, 18].forEach(k => sfx(T_TYPE[0] + k / 22, 'key', 0.25));

    // ---- page B: the campaign summary builds itself ----
    const pB = page();
    const stB = steps(pB, 790);
    box(pB, 540, 905, 70, 70, { borderRadius: '20px', background: '#F3E8FF' });
    icon(pB, P.check, 540, 905, 34, C.PURPLE, 3);
    txt(pB, 'סיכום הקמפיין', Object.assign({ x: 540, y: 962, size: 36, weight: 700, color: C.INK2 }, RUB));
    txt(pB, 'בדקו את הפרטים לפני ההשקה', Object.assign({ x: 540, y: 1016, size: 22, weight: 400, color: C.GREY }, RUB));
    card(pB, 190, 1040, 700, 330);
    icon(pB, P.star4, 860, 1085, 28, C.PURPLE, 2);
    txt(pB, 'אסטרטגיית פלטפורמות', Object.assign({ x: 835, y: 1085, size: 28, weight: 700, color: C.INK2, align: 'r' }, RUB));
    const STRAT = [['Facebook', 'F', '#1877F2', 'פרסום ויזואלי עם מיקוד מתקדם', 40], ['Google', 'G', '#EA4335', 'לקוחות שמחפשים מאפייה עכשיו', 40], ['TikTok', 'T', '#111111', 'תוכן ויראלי לקהל צעיר', 20]];
    const strat = STRAT.map(([n, l, col, d, pc], i) => {
      const g = grp(pB, 0, 0), y = 1150 + i * 84;
      box(g, 845, y, 52, 52, { borderRadius: '14px', background: col });
      txt(g, l, { x: 845, y: y + 1, size: 28, font: F.LAT, weight: 900, color: C.WHITE, dir: 'ltr' });
      txt(g, n, Object.assign({ x: 805, y: y - 19, size: 26, weight: 700, color: C.INK2, align: 'r', dir: 'ltr' }, RUB));
      txt(g, d, Object.assign({ x: 805, y: y + 24, size: 20, weight: 400, color: C.GREY, align: 'r' }, RUB));
      const pill = box(g, 262, y - 18, 92, 36, { borderRadius: '18px', background: '#F3E8FF' });
      const pct = txt(g, '0%', Object.assign({ x: 262, y: y - 17, size: 22, weight: 700, color: C.PURPLE, dir: 'ltr' }, RUB));
      const amt = txt(g, '₪0', Object.assign({ x: 262, y: y + 24, size: 20, weight: 500, color: C.GREY, dir: 'ltr' }, RUB));
      return { g, pct, amt, pc };
    });
    card(pB, 190, 1385, 700, 100);
    txt(pB, 'תוכן הפרסומת', Object.assign({ x: 860, y: 1408, size: 26, weight: 700, color: C.INK2, align: 'r' }, RUB));
    const COPY = 'מאפים טריים כל בוקר! בואו לטעום אצלנו.';
    const adCopy = txt(pB, '', Object.assign({ x: 860, y: 1460, size: 26, weight: 500, color: C.INK2, align: 'r' }, RUB));
    const pub = grp(pB, 540, 1530);
    box(pub, 0, 0, 700, 84, { borderRadius: '22px', background: GRAD_X });
    txt(pub, 'פרסם קמפיין', Object.assign({ x: -20, y: 1, size: 32, weight: 700, color: C.WHITE }, RUB));
    icon(pub, P.send, 110, 0, 32, C.WHITE, 2);
    const T_STR = L6 + 0.45, T_COPY = L6 + 1.6, T_PUB = V[6][0] - 0.45;
    STRAT.forEach((_, i) => sfx(T_STR + i * 0.22, 'pop', 0.35));
    sfx(T_PUB, 'click', 0.8);

    // ---- page C: the control panel and the AI agent ----
    const pC = page();
    const TABS = [['ביצועים', 805], ['חיבור פלטפורמות', 630], ['העלאת קמפיין', 445], ['המלצות AI', 285]];
    rect(pC, 190, 760, 700, 64, { borderRadius: '18px', background: '#F3F0FA' });
    box(pC, 805, 792, 150, 52, { borderRadius: '14px', background: C.PURPLE });
    TABS.forEach(([s, x], i) => txt(pC, s, Object.assign({ x, y: 793, size: 21, weight: i ? 500 : 700, color: i ? C.GREY : C.WHITE }, RUB)));
    const STATS = [['הוצאה (היום)', 152, v => '₪' + v, '#3B5BEB', 690, 940], ['קמפיינים פעילים', 3, v => v + '', '#9333EA', 390, 940],
      ['קליקים (היום)', 232, v => v + '', '#F59E0B', 690, 1130], ['CTR ממוצע', 1.2, v => v.toFixed(1) + '%', '#16A34A', 390, 1130]];
    const stats = STATS.map(([lab, val, fmt, col, x, y], i) => {
      const g = grp(pC, 0, 0);
      card(g, x - 145, y - 85, 290, 170, { r: 26 });
      txt(g, lab, Object.assign({ x: x + 120, y: y - 58, size: 22, weight: 500, color: C.GREY, align: 'r' }, RUB));
      const v = txt(g, fmt(0), Object.assign({ x: x + 120, y: y + 2, size: 42, weight: 700, color: C.INK2, align: 'r', dir: 'ltr' }, RUB));
      const sv = svgBox(g, x - 120, y + 20, 140, 50);
      const pts = [0.8, 0.75, 0.82, 0.5, 0.6, 0.3, 0.35, 0.1].map((q, k) => `${k * 20},${q * 50}`).join(' ');
      const pl = svgEl('polyline', sv, { points: pts, fill: 'none', stroke: col, 'stroke-width': 4, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
      const L = pl.getTotalLength(); pl.setAttribute('stroke-dasharray', L);
      return { g, v, val, fmt, pl, L };
    });
    // campaign rows: platform, name and status, clicks, cost per click, AI switch
    rect(pC, 190, 1235, 700, 340, { borderRadius: '26px', background: C.WHITE, border: '2px solid ' + C.LINE, boxSizing: 'border-box' });
    [['קמפיין', 860, 'r'], ['קליקים', 560, 'c'], ['CPC', 445, 'c'], ['AI', 300, 'c']].forEach(([s, x, al]) => txt(pC, s, Object.assign({ x, y: 1268, size: 20, weight: 500, color: C.GREY, align: al, dir: s === 'CPC' || s === 'AI' ? 'ltr' : 'rtl' }, RUB)));
    const ROWS = [['F', '#1877F2', 9, '₪3.44'], ['G', '#EA4335', 85, '₪0.81'], ['T', '#111111', 138, '₪0.38']];
    const rows = ROWS.map(([l, col, clk, cpc], i) => {
      const g = grp(pC, 0, 0), y = 1330 + i * 82;
      box(g, 845, y, 46, 46, { borderRadius: '12px', background: col });
      txt(g, l, { x: 845, y: y + 1, size: 24, font: F.LAT, weight: 900, color: C.WHITE, dir: 'ltr' });
      txt(g, 'המאפייה של מאיה', Object.assign({ x: 808, y: y - 15, size: 22, weight: 700, color: C.INK2, align: 'r' }, RUB));
      const stOn = txt(g, 'פעיל', Object.assign({ x: 808, y: y + 21, size: 18, weight: 500, color: C.GREEN, align: 'r' }, RUB));
      const stOff = txt(g, 'מושהה', Object.assign({ x: 808, y: y + 21, size: 18, weight: 500, color: C.GREY, align: 'r' }, RUB));
      txt(g, clk + '', Object.assign({ x: 560, y, size: 24, weight: 700, color: C.INK2, dir: 'ltr' }, RUB));
      txt(g, cpc, Object.assign({ x: 445, y, size: 24, weight: 700, color: i === 0 ? C.RED : C.INK2, dir: 'ltr' }, RUB));
      const ai = toggle(g, 300, y, C.PURPLE);
      return { g, stOn, stOff, ai };
    });
    // the agent panel slides up over the bottom of the screen
    const agent = grp(pC, 0, 0);
    card(agent, 175, 1180, 730, 420, { r: 34, shadow: 'rgba(76,29,149,0.25)', css: { border: '2px solid #DDD3F5' } });
    const av = grp(agent, 845, 1238);
    box(av, 0, 0, 64, 64, { borderRadius: '50%', background: GRAD });
    icon(av, P.star4, 0, 0, 32, C.WHITE, 2);
    txt(agent, 'סוכן AI', Object.assign({ x: 795, y: 1218, size: 30, weight: 700, color: C.INK2, align: 'r' }, RUB));
    const anal = txt(agent, 'מנתח את ביצועי הקמפיין', Object.assign({ x: 795, y: 1264, size: 22, weight: 500, color: C.PURPLE, align: 'r' }, RUB));
    const LINES = [
      ['פייסבוק: עלות לקליק גבוהה, ₪3.44', C.RED],
      ['גוגל: הכי משתלם, ₪0.81 לקליק', C.GREEN],
      ['העברתי ₪30 מפייסבוק לגוגל', C.PURPLE],
    ];
    const aLines = LINES.map(([s, col], i) => {
      const g = grp(agent, 0, 0), y = 1320 + i * 58;
      box(g, 855, y, 16, 16, { borderRadius: '50%', background: col });
      txt(g, s, Object.assign({ x: 830, y, size: 26, weight: i === 2 ? 700 : 500, color: C.INK2, align: 'r' }, RUB));
      return g;
    });
    const saved = grp(agent, 540, 1505);
    box(saved, 0, 0, 640, 70, { borderRadius: '35px', background: C.GREEN });
    icon(saved, P.check, 190, 0, 30, C.WHITE, 3);
    txt(saved, 'בזבוז הכסף נעצר', Object.assign({ x: -20, y: 1, size: 30, weight: 700, color: C.WHITE }, RUB));
    const L7 = V[6][0], L8 = V[7][0];
    const T_AI_ON = [L8 + 0.1, L8 + 0.28, L8 + 0.46], T_AGENT = L8 + 1.7, T_LINES = [L8 + 2.15, L8 + 2.75, L8 + 3.95], T_SAVE = L8 + 4.9;
    T_AI_ON.forEach((x, i) => sfx(x, 'tick', 0.5 - i * 0.08)); sfx(T_AGENT, 'pop', 0.5); T_LINES.forEach(x => sfx(x, 'popHi', 0.35)); sfx(T_SAVE, 'success', 0.7);

    // ---- call to action ----
    const L9 = V[8][0];
    const lam = letters(w, 'LOOK AT ME', { x: 540, y: 775, size: 118, font: F.LAT, weight: 900, color: C.INK2, dir: 'ltr' });
    const T1 = 'שיווק חכם,', T2 = 'במקום אחד.', zt = Math.min(fit(T1, HERO, 720, 104), fit(T2, HERO, 720, 104));
    const tg1 = txt(w, T1, Object.assign({ x: 540, y: 955, size: zt, color: C.INK2 }, HERO));
    const tg2 = txt(w, T2, Object.assign({ x: 540, y: 1080, size: zt, color: C.INK2, css: gradText }, HERO));
    const cta = grp(w, 540, 1290);
    box(cta, 0, 24, 700, 150, { borderRadius: '48px', background: 'rgba(147,51,234,0.38)', filter: 'blur(34px)' });
    const ctaBox = box(cta, 0, 0, 760, 160, { borderRadius: '48px', background: GRAD_X, overflow: 'hidden' });
    const sheen = rect(ctaBox, 0, -40, 160, 240, { background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))' });
    txt(cta, 'נסו עכשיו', Object.assign({ x: 30, y: 2, size: 70, weight: 700, color: C.WHITE }, RUB));
    icon(cta, 'M19 12H5M11 6l-6 6 6 6', -160, 0, 58, C.WHITE, 2.4);   // forward in Hebrew points left
    const url = txt(w, 'lookatme.site', { x: 540, y: 1475, size: 84, font: F.LAT, weight: 700, color: C.PURPLE, dir: 'ltr' });
    const T_TAG1 = L9 + 0.9, T_TAG2 = L9 + 2.04, T_URL = L9 + 2.5, T_BTN = L9 + 3.2, T_CLICK = L9 + 3.65;
    sfx(T_CLICK, 'click', 0.9); sfx(T_CLICK + 0.05, 'sparkle', 0.5);

    // ---- cursor ----
    const cur = cursor(w, 58, C.INK2, C.WHITE);
    const fileP = t => { const k = E.io3(seg(t, T_GRAB, T_DROP)); return [lerp(720, 560, k), lerp(1480, 1060, k) - 60 * Math.sin(Math.PI * k)]; };
    const PATH = [   // [time, x, y] in page coordinates (before scroll); the cursor glides between them
      [T_DROP + 0.25, 600, 1080], [T_GOAL - 0.4, 560, 1380], [T_GOAL, 545, 1690 - 600], [T_BUD - 0.15, 700, 1870 - 600],
      [T_NEXT - 0.35, 300, 2015 - 600], [T_NEXT, 285, 2018 - 600], [T_NEXT + 0.5, 500, 1520], [T_PUB - 0.4, 560, 1545], [T_PUB, 545, 1537]];
    const curPos = t => {
      if (t < T_DROP + 0.25) { const [x, y] = fileP(t); return [x + 40, y + 20]; }
      for (let i = 1; i < PATH.length; i++) if (t < PATH[i][0]) {
        const k = E.io3(seg(t, PATH[i - 1][0], PATH[i][0])); return [lerp(PATH[i - 1][1], PATH[i][1], k), lerp(PATH[i - 1][2], PATH[i][2], k)];
      }
      if (t < T_CTA) return [545, 1537];
      return [lerp(560, 600, seg(t, T_BTN, T_CLICK)), lerp(1500, 1300, E.io3(seg(t, T_BTN - 0.3, T_CLICK)))];
    };

    return t => {
      // light opens as a circle; the area grows evenly so the frame never flashes
      const uOpen = seg(t, T_OPEN, T_OPEN + 2.0), rOpen = 1160 * Math.sqrt(E.smooth(uOpen));
      root.style.clipPath = uOpen >= 1 ? 'none' : `circle(${rOpen.toFixed(1)}px at 540px 860px)`;

      const kr = S(t - T_LAND, 20, 0.6), ex = sp(t, T_PHONE - 0.25, 30);
      const ru = seg(t, T_LAND, T_LAND + 0.6);
      tf(ring, { s: 0.9 + 1.4 * E.o3(ru), o: (1 - ru) * (t >= T_LAND ? 1 : 0) });
      const am = rise(t, V[1][0]); tf(meet, { y: am.y - 40 * ex, o: am.o * (1 - ex) });
      tf(rName, { o: t < T_PHONE + 0.5 ? 1 : 0 });
      rName.spans.forEach((s, i) => { const r = rise(t, V[1][0] + 0.5 + i * 0.04, 40); tf(s, { y: r.y + 40 * ex, o: r.o * (1 - ex) }); });

      // the logo flies into the header and, at the end, out to the call to action
      const fIn = E.io3(seg(t, T_PHONE - 0.05, T_PHONE + 0.5)), fOut = E.io3(seg(t, T_CTA - 0.1, T_CTA + 0.5));
      const phY = track(1350, [[T_PHONE, 0, 11, 0.9], [T_CTA, 1500, 12, 1]])(t);
      const hx = 870, hy = 668 + phY;
      let fx = lerp(540, hx, fIn), fy = lerp(860, hy, fIn), fs = lerp(1, 60 / 300, fIn);
      if (t >= T_CTA - 0.1) { fx = lerp(hx, 540, fOut); fy = lerp(668, 560, fOut); fs = lerp(60 / 300, 240 / 300, fOut); }
      const inHeader = t >= T_PHONE + 0.5 && t < T_CTA - 0.1;
      tf(fly, { x: fx, y: fy, s: fs * (t < T_PHONE ? kr : 1), r: -12 * (1 - S(t - T_LAND, 16, 0.8)), o: t >= T_LAND && !inHeader ? 1 : 0 });
      tf(hdrLogo, { o: inHeader ? 1 : 0 });

      for (const c of capEls) c.l.forEach((g, i) => {
        const r = rise(t, c.a + i * 0.07), out = sp(t, c.b - 0.12, 40);
        tf(g, { y: r.y - 24 * out, o: r.o * (1 - out) });
      });

      // phone, header nav (the pill slides from "start campaign" to "control panel" on publish), pages
      tf(ph, { y: phY, o: t >= T_PHONE - 0.1 ? 1 : 0 });
      const navK = clamp(S(t - T_PUB - 0.1, 14, 0.85), 0, 1.05);
      tf(navPill, { x: lerp(330, 462, navK), sx: lerp(1.12, 0.92, navK) });
      navTx.forEach(([g0, g1], i) => { const on = i === 2 ? 1 - navK : i === 1 ? navK : 0; tf(g0, { o: 1 - on }); tf(g1, { o: on }); });
      const PAGE_T = [T_PHONE, T_NEXT + 0.1, T_PUB + 0.15];
      const curP = track(0, PAGE_T.slice(1).map((x, i) => [x, i + 1, 12, 0.94]))(t);
      [pA, pB, pC].forEach((p, i) => { const d = i - curP; tf(p, { x: -d * 240, s: 1 - 0.04 * Math.min(1, Math.abs(d)), o: clamp(1 - 1.4 * Math.abs(d), 0, 1) }); });   // a short slide with a crossfade: the screen is never empty

      // page A
      const sc = scrollA(t); tf(A, { y: -sc });
      tf(A1, { o: 1 - seg(sc, 100, 170) }); tf(A2, { o: 1 - seg(sc, 380, 460) }); tf(A3, { o: sc > 20 ? 1 : 0 });
      [stA, stB].forEach((st, j) => {
        const done = j === 0 ? [0, 0, 0] : [1, 1, 1];
        st.nodes.forEach((n, i) => {
          const tOn = j === 0 ? (i === 0 ? 0 : 1e9) : T_NEXT + 0.35 + i * 0.25;
          tf(n.on, pop(t, tOn, 26, 0.65)); tf(n.ic, { o: j === 1 ? 0 : 1 }); tf(n.ck, { o: done[i] });
        });
        tf(st.fill, { sx: Math.max(0.001, j === 0 ? 0 : E.io3(seg(t, T_NEXT + 0.35, T_NEXT + 0.85))) });
      });
      const drop = sp(t, T_DROP, 30); tf(upA, { o: 1 - drop }); tf(upB, { o: drop });
      tf(bar, { sx: Math.max(0.001, E.io3(seg(t, U0, U1))) }); tf(okUp, pop(t, U1 + 0.05));
      const [flx, fly_] = fileP(t);
      tf(file, { x: flx, y: fly_ + phY, s: (1 - 0.6 * sp(t, T_DROP, 26)) * (1 + 0.06 * Math.sin(Math.PI * seg(t, T_GRAB, T_DROP))), o: t >= T_GRAB - 0.15 && t < T_DROP + 0.2 ? 1 - seg(t, T_DROP + 0.05, T_DROP + 0.2) : 0, r: -6 * Math.sin(Math.PI * seg(t, T_GRAB, T_DROP)) });
      let typing = false;
      desc.forEach((d, i) => {
        const s = DESC[i], n = typed(t, T_TYPE[i], [...s].length, 24); d.inner.textContent = [...s].slice(0, n).join('');
        if (t >= T_TYPE[i] && n < [...s].length) typing = true;
      });
      tf(ph1, { o: t < T_TYPE[0] ? 1 : 0 });
      ta.style.borderColor = typing ? '#C084FC' : C.LINE;
      goals.forEach((g, i) => { const on = i === 1 && t >= T_GOAL; tf(g.sel, { o: on ? 1 : 0 }); tf(g.g, { s: i === 1 ? press(t, T_GOAL, 0.94) : 1 }); });
      const nb = typed(t, T_BUD, 3, 10); bud.inner.textContent = '200'.slice(0, nb);
      tf(budCaret, { x: 860 - (nb ? measure('200'.slice(0, nb), budO).w : 0) - 6, o: t >= T_BUD - 0.2 && t < T_NEXT && Math.floor(t * 4) % 2 === 0 ? 1 : 0 });
      tf(next, { s: press(t, T_NEXT, 0.92) });

      // page B
      strat.forEach((r, i) => {
        const q = rise(t, T_STR + i * 0.22, 30); tf(r.g, { y: q.y, o: q.o });
        const k = E.o3(seg(t, T_STR + i * 0.22, T_STR + i * 0.22 + 0.7));
        r.pct.inner.textContent = Math.round(r.pc * k) + '%'; r.amt.inner.textContent = '₪' + Math.round(2 * r.pc * k);
      });
      adCopy.inner.textContent = [...COPY].slice(0, typed(t, T_COPY, [...COPY].length, 30)).join('');
      tf(pub, { s: press(t, T_PUB, 0.94) });

      // page C
      stats.forEach((s, i) => {
        const k = E.o3(seg(t, L7 + 0.1 + i * 0.12, L7 + 1.1 + i * 0.12));
        s.v.inner.textContent = s.fmt(s.val % 1 ? s.val * k : Math.round(s.val * k));
        s.pl.setAttribute('stroke-dashoffset', s.L * (1 - k));
        const q = rise(t, L7 - 0.15 + i * 0.08, 30); tf(s.g, { y: q.y, o: q.o });
      });
      rows.forEach((r, i) => {
        const q = rise(t, L7 + 0.5 + i * 0.12, 30); tf(r.g, { y: q.y, o: q.o });
        r.ai.set(clamp(S(t - T_AI_ON[i], 20, 0.8), 0, 1));
        const paused = i === 0 && t >= T_SAVE - 0.3;
        tf(r.stOn, { o: paused ? 0 : 1 }); tf(r.stOff, { o: paused ? 1 : 0 });
      });
      const ag = clamp(S(t - T_AGENT, 12, 0.9), 0, 1.1); tf(agent, { y: 450 * (1 - ag), o: t >= T_AGENT ? 1 : 0 });
      anal.style.opacity = String(0.55 + 0.45 * Math.abs(Math.sin(t * 3)));
      aLines.forEach((g, i) => { const q = rise(t, T_LINES[i], 30, 24, 0.8); tf(g, { y: q.y, o: q.o }); });
      tf(saved, pop(t, T_SAVE, 24, 0.62));

      // call to action
      tf(lam, { o: t >= L9 ? 1 : 0 });
      lam.spans.forEach((s, i) => { const r = rise(t, L9 + 0.05 + i * 0.045, 40); tf(s, { y: r.y, o: r.o }); });
      const a1 = rise(t, T_TAG1); tf(tg1, { y: a1.y, o: a1.o });
      const a2 = rise(t, T_TAG2); tf(tg2, { y: a2.y, o: a2.o });
      const qu = rise(t, T_URL); tf(url, { y: qu.y, o: qu.o });
      const qc = rise(t, T_BTN, 60, 22, 0.8); tf(cta, { y: qc.y, o: qc.o, s: press(t, T_CLICK, 0.95) });
      tf(sheen, { x: lerp(-220, 840, S(t - T_CLICK - 0.05, 9, 1)), skx: -20, o: t > T_CLICK ? 1 : 0 });

      // cursor
      const [cx, cy] = curPos(t);
      const co = Math.max(vis(t, T_GRAB - 0.25, T_NEXT + 0.45), vis(t, T_PUB - 0.7, T_PUB + 0.4), vis(t, T_BTN - 0.3, T_CLICK + 1.0));
      tf(cur, { x: cx, y: cy + (t < T_CTA ? phY : 0), o: co, s: press(t, T_GOAL, 0.86) * press(t, T_NEXT, 0.86) * press(t, T_PUB, 0.86) * press(t, T_CLICK, 0.86) });

      tf(cam, { s: 1 + 0.03 * seg(t, T_OPEN, DUR) + 0.008 * Math.sin((t - T_OPEN) * 1.3), y: -10 * Math.sin((t - T_OPEN) * 0.9) });
    };
  });
})();
