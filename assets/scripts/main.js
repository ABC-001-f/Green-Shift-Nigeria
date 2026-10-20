/* ==========================================================================
   Green Shift Nigeria — main script
   1. Helpers            6. Hero city scene
   2. Loader & nav       7. Power Shift calculator
   3. Pointer effects    8. DrainGuard radar
   4. Reveal & counters  9. Loop & Lean
   5. Range fills       10. Checklist & finale
   ========================================================================== */

(() => {
  'use strict';

  /* ---------- 1. Helpers ---------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const FINE = matchMedia('(pointer: fine)').matches;

  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const naira = v => '₦' + Math.round(v).toLocaleString('en-NG');
  const fmt = (v, dp = 0) => Number(v).toLocaleString('en-NG', { minimumFractionDigits: dp, maximumFractionDigits: dp });

  function tween(el, to, format, ms = 800) {
    const from = el._v ?? 0;
    el._v = to;
    cancelAnimationFrame(el._raf);
    if (RM) { el.textContent = format(to); return; }
    const t0 = performance.now();
    const step = now => {
      const k = Math.min((now - t0) / ms, 1);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = format(from + (to - from) * e);
      if (k < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
  }

  function toast(msg, type = 'ok', icon = 'fa-circle-check') {
    const t = document.createElement('div');
    t.className = 'toast' + (type === 'warn' ? ' warn' : '');
    t.innerHTML = `<i class="fa-solid ${icon}"></i><span>${msg}</span>`;
    $('#toasts').appendChild(t);
    setTimeout(() => {
      t.classList.add('out');
      t.addEventListener('animationend', () => t.remove(), { once: true });
    }, 4200);
  }

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* storage unavailable */ } }
  };

  /* ---------- 2. Loader & nav ---------- */
  document.body.classList.add('loading');
  const finishLoad = () => {
    $('#loader').classList.add('done');
    document.body.classList.remove('loading');
    document.body.classList.add('ready');
  };
  window.addEventListener('load', () => setTimeout(finishLoad, RM ? 0 : 900));
  setTimeout(finishLoad, 3500); // never trap the page behind a slow font/CDN

  const nav = $('#nav');
  const bar = $('#progressBar');
  let lastY = 0;
  function onScroll() {
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle('scrolled', y > 40);
    nav.classList.toggle('hide', y > 700 && y > lastY + 4 && !$('#navLinks').classList.contains('open'));
    if (y < lastY - 4 || y < 700) nav.classList.remove('hide');
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const menuBtn = $('#menuBtn');
  const navLinks = $('#navLinks');
  menuBtn.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', open);
  });
  $$('a', navLinks).forEach(a => a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
  }));

  const linkFor = id => $(`.nav-links a[href="#${id}"]`);
  const sectionSpy = new IntersectionObserver(entries => {
    entries.forEach(en => {
      const a = linkFor(en.target.id);
      if (a && en.isIntersecting) {
        $$('.nav-links a').forEach(x => x.classList.remove('active'));
        a.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['power', 'drain', 'habits', 'act', 'story'].forEach(id => sectionSpy.observe(document.getElementById(id)));

  /* ---------- 3. Pointer effects ---------- */
  if (FINE && !RM) {
    const glow = $('#cursorGlow');
    glow.classList.add('on');
    let gx = innerWidth / 2, gy = innerHeight / 2, tx = gx, ty = gy;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; }, { passive: true });
    (function follow() {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      glow.style.transform = `translate(${gx}px, ${gy}px)`;
      requestAnimationFrame(follow);
    })();

    document.addEventListener('pointermove', e => {
      const card = e.target.closest('.card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }, { passive: true });

    $$('.tilt').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `rotateX(${-py * 7}deg) rotateY(${px * 9}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    $$('.magnetic').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${dx * 0.22}px, ${dy * 0.3}px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- 4. Reveal & counters ---------- */
  const revealer = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add('in');
      $$('[data-count]', en.target).forEach(runCounter);
      revealer.unobserve(en.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('[data-reveal]').forEach(el => revealer.observe(el));

  function runCounter(el) {
    if (el._done) return;
    el._done = true;
    tween(el, Number(el.dataset.count), v => fmt(v), 1800);
  }

  /* ---------- 5. Range fills ---------- */
  function paintRange(r) {
    const p = ((r.value - r.min) / (r.max - r.min)) * 100;
    r.style.setProperty('--p', p + '%');
  }
  $$('input[type="range"]').forEach(r => {
    paintRange(r);
    r.addEventListener('input', () => paintRange(r));
  });

  /* ---------- 6. Hero city scene ---------- */
  const cv = $('#scene');
  const ctx = cv.getContext('2d');
  const shift = $('#shift');
  let W = 0, H = 0, front = [], back = [], smoke = [], motes = [], birds = [];
  let cur = 0, tgt = 0, t = 0, heroVisible = true, lastHud = -1;

  const hex = h => [0, 2, 4].map(i => parseInt(h.slice(1 + i, 3 + i), 16));
  const mix = (a, b, k) => {
    const x = hex(a), y = hex(b);
    return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * k)).join(',')})`;
  };

  function buildScene() {
    const d = Math.min(devicePixelRatio || 1, 2);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * d; cv.height = H * d;
    ctx.setTransform(d, 0, 0, d, 0, 0);

    let seed = 7;
    const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const row = (minW, varW, minH, varH, gap) => {
      const out = [];
      let x = -20;
      while (x < W + 20) {
        const w = minW + r() * varW;
        const h = H * (minH + r() * varH);
        const win = Array.from({ length: 24 }, () => r() > 0.45);
        out.push({ x, w, h, win, gen: r() > 0.5 });
        x += w + gap;
      }
      return out;
    };
    back = row(50, 90, 0.22, 0.3, 2);
    front = row(40, 70, 0.1, 0.26, 5);
  }

  function drawScene() {
    t++;
    cur += (tgt - cur) * (RM ? 1 : 0.05);
    const s = cur;

    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, mix('#2a2420', '#4fa6d6', s));
    sky.addColorStop(0.65, mix('#6b5236', '#bfe3ef', s));
    sky.addColorStop(1, mix('#9b7440', '#ffe3a3', s));
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // sun
    const sx = W * 0.76, sy = H * (0.62 - 0.4 * s), sr = Math.min(W, H) * 0.075;
    ctx.globalAlpha = 0.2 + 0.8 * s;
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr * 6);
    glow.addColorStop(0, 'rgba(255,220,120,.9)');
    glow.addColorStop(0.25, 'rgba(255,195,80,.3)');
    glow.addColorStop(1, 'rgba(255,195,80,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
    ctx.beginPath();
    ctx.arc(sx, sy, sr * (0.8 + 0.2 * s), 0, Math.PI * 2);
    ctx.fillStyle = mix('#c99a5a', '#ffd768', s);
    ctx.fill();
    ctx.globalAlpha = 1;

    if (s > 0.05) {
      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(t * 0.002);
      ctx.strokeStyle = `rgba(255,225,130,${0.35 * s})`;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      for (let i = 0; i < 16; i++) {
        ctx.rotate(Math.PI / 8);
        ctx.beginPath();
        ctx.moveTo(sr * 1.5, 0);
        ctx.lineTo(sr * (2.1 + 0.5 * Math.sin(t * 0.03 + i)), 0);
        ctx.stroke();
      }
      ctx.restore();
    }

    // birds
    if (!RM && s > 0.55 && Math.random() < 0.008 && birds.length < 8) {
      birds.push({ x: -30, y: H * (0.12 + Math.random() * 0.25), v: 0.8 + Math.random() * 0.8, p: Math.random() * 6, sz: 5 + Math.random() * 4 });
    }
    birds = birds.filter(b => b.x < W + 40);
    ctx.strokeStyle = `rgba(30,50,60,${clamp((s - 0.4) * 2, 0, 0.8)})`;
    ctx.lineWidth = 1.6;
    birds.forEach(b => {
      b.x += b.v; b.p += 0.18;
      const f = Math.sin(b.p) * b.sz * 0.6;
      ctx.beginPath();
      ctx.moveTo(b.x - b.sz, b.y - f);
      ctx.quadraticCurveTo(b.x - b.sz / 2, b.y - 2, b.x, b.y);
      ctx.quadraticCurveTo(b.x + b.sz / 2, b.y - 2, b.x + b.sz, b.y - f);
      ctx.stroke();
    });

    // distant skyline
    ctx.fillStyle = mix('#3d352e', '#5e9c8c', s);
    ctx.globalAlpha = 0.75;
    back.forEach(b => ctx.fillRect(b.x, H - b.h, b.w, b.h));
    ctx.globalAlpha = 1;

    // front blocks
    front.forEach(b => {
      const top = H - b.h;
      ctx.fillStyle = mix('#1c1916', '#163d32', s);
      ctx.fillRect(b.x, top, b.w, b.h);
      ctx.fillStyle = mix('#f0b24b', '#c4f1df', s);
      for (let i = 0; i < 24; i++) {
        if (!b.win[i]) continue;
        const col = i % 3, rowI = Math.floor(i / 3);
        const wy = top + 12 + rowI * 18;
        if (wy > H - 12) break;
        ctx.globalAlpha = 0.85 - 0.35 * s;
        ctx.fillRect(b.x + 8 + col * ((b.w - 16) / 3), wy, 7, 9);
      }
      ctx.globalAlpha = 1;
      if (s > 0.02) {
        ctx.save();
        ctx.translate(b.x + b.w * 0.5, top);
        ctx.rotate(-0.32);
        ctx.fillStyle = `rgba(38,110,170,${s})`;
        ctx.fillRect(-b.w * 0.32, -5, b.w * 0.64, 6);
        ctx.fillStyle = `rgba(255,255,255,${0.55 * s})`;
        ctx.fillRect(-b.w * 0.32, -5, b.w * 0.64, 1.5);
        ctx.restore();
      }
    });

    if (!RM) {
      if (Math.random() < (1 - s) * 0.95) {
        const b = front[Math.floor(Math.random() * front.length)];
        if (b && b.gen) smoke.push({ x: b.x + b.w * 0.5, y: H - b.h, vx: (Math.random() - 0.3) * 0.5, vy: -0.5 - Math.random() * 0.6, r: 6, a: 0.5 });
      }
      if (Math.random() < s * 0.6) {
        const b = front[Math.floor(Math.random() * front.length)];
        if (b) motes.push({ x: b.x + Math.random() * b.w, y: H - b.h, vy: -0.4 - Math.random() * 0.6, a: 1 });
      }
    }

    smoke = smoke.filter(p => p.a > 0.01);
    smoke.forEach(p => {
      p.x += p.vx + Math.sin(t * 0.02 + p.y) * 0.2;
      p.y += p.vy;
      p.r += 0.28;
      p.a *= 0.985 * (1 - 0.02 * s) - 0.002 * s;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(40,36,32,${Math.max(p.a, 0) * 0.7})`;
      ctx.fill();
    });
    if (smoke.length > 420) smoke.splice(0, 60);

    motes = motes.filter(p => p.a > 0.02);
    motes.forEach(p => {
      p.y += p.vy;
      p.a -= 0.008;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,236,150,${p.a})`;
      ctx.fill();
    });

    ctx.fillStyle = `rgba(70,58,44,${0.4 * (1 - s)})`;
    ctx.fillRect(0, 0, W, H);

    updateHud(s);
  }

  function loop() {
    if (heroVisible) drawScene();
    requestAnimationFrame(loop);
  }

  const hudAir = $('#hudAir'), hudAirTag = $('#hudAirTag');
  const hudNoise = $('#hudNoise'), hudNoiseTag = $('#hudNoiseTag');
  const hudCo2 = $('#hudCo2'), hudCo2Tag = $('#hudCo2Tag');
  const setTag = (el, text, cls) => { el.textContent = text; el.className = 'hud-tag ' + cls; };

  function updateHud(s) {
    const k = Math.round(s * 100);
    if (k === lastHud) return;
    lastHud = k;
    const air = Math.round(182 - 146 * s);
    const noise = Math.round(78 - 40 * s);
    const co2 = Math.round(100 - 92 * s);
    hudAir.textContent = air;
    hudNoise.textContent = noise + ' dB';
    hudCo2.textContent = co2 + '%';
    setTag(hudAirTag, air > 150 ? 'Unhealthy' : air > 100 ? 'Poor' : air > 50 ? 'Moderate' : 'Good', air > 100 ? '' : air > 50 ? 'mid' : 'good');
    setTag(hudNoiseTag, noise > 70 ? 'Loud' : noise > 52 ? 'Busy' : 'Calm', noise > 70 ? '' : noise > 52 ? 'mid' : 'good');
    setTag(hudCo2Tag, co2 > 95 ? 'Today' : `−${100 - co2}%`, co2 > 70 ? '' : co2 > 35 ? 'mid' : 'good');
    $('#shiftPct').textContent = k + '% solar';

    const shifted = s > 0.5;
    if (shifted !== document.body.classList.contains('shifted')) {
      document.body.classList.toggle('shifted', shifted);
      $('#modeLabel').textContent = shifted ? 'Solar' : 'Smoke';
      $('#modeSwitch').setAttribute('aria-pressed', shifted);
      $('.mode-thumb').innerHTML = `<i class="fa-solid ${shifted ? 'fa-sun' : 'fa-smog'}"></i>`;
    }
  }

  shift.addEventListener('input', () => { tgt = shift.value / 100; });

  function animateShift(to) {
    const from = Number(shift.value);
    const t0 = performance.now();
    const ms = RM ? 0 : 1400;
    const step = now => {
      const k = ms ? Math.min((now - t0) / ms, 1) : 1;
      const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
      shift.value = from + (to - from) * e;
      paintRange(shift);
      tgt = shift.value / 100;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  $('#modeSwitch').addEventListener('click', () => animateShift(document.body.classList.contains('shifted') ? 0 : 100));
  $('#finaleShift').addEventListener('click', () => setTimeout(() => animateShift(100), RM ? 0 : 700));

  new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; }).observe($('.hero'));
  addEventListener('resize', buildScene);
  buildScene();
  loop();

  /* ---------- 7. Power Shift calculator ---------- */
  const ZN = {
    A: { s: 6.2, t: 'Extreme heat shortens battery life, so keep batteries shaded and ventilated. Harmattan dust cuts panel output; clean panels regularly.' },
    B: { s: 5.6, t: 'Heavy rain and lightning are real risks. Use surge protection and keep the inverter and batteries above flood level.' },
    C: { s: 4.8, t: 'Humidity corrodes connectors. Use weatherproof mounts and sealed fittings, and check for shade from trees.' },
    D: { s: 4.5, t: 'Flooding and salt air are major issues. Raise equipment above likely flood levels and use corrosion-rated hardware.' }
  };
  const regions = {
    A: 'Sokoto,Kebbi,Zamfara,Katsina,Kano,Jigawa,Yobe,Borno,Bauchi,Gombe',
    B: 'Kaduna,Niger,Kwara,Kogi,Benue,Plateau,Nasarawa,Taraba,Adamawa,FCT',
    C: 'Abia,Anambra,Ebonyi,Enugu,Imo,Ekiti,Ogun,Ondo,Osun,Oyo,Edo',
    D: 'Lagos,Rivers,Bayelsa,Delta,Akwa Ibom,Cross River'
  };
  const ST = Object.entries(regions)
    .flatMap(([z, list]) => list.split(',').map(n => [n.trim(), z]))
    .sort((a, b) => a[0].localeCompare(b[0]));

  const stSel = $('#st');
  stSel.innerHTML = ST.map(([n]) => `<option value="${n}">${n}</option>`).join('');
  stSel.value = 'Lagos';

  const num = id => Number($(id).value) || 0;
  let chartTimer;

  function drawLine(path) {
    const L = path.getTotalLength();
    path.style.transition = 'none';
    path.style.strokeDasharray = L;
    path.style.strokeDashoffset = RM ? 0 : L;
    path.getBoundingClientRect();
    if (!RM) {
      path.style.transition = 'stroke-dashoffset 1.3s cubic-bezier(.2,.7,.2,1)';
      path.style.strokeDashoffset = 0;
    }
  }

  function chart(cost, sys, pay) {
    const X = m => 44 + (m / 60) * 536;
    const max = Math.max(cost * 60, sys) * 1.1;
    const Y = v => 236 - (v / max) * 206;
    let g = '';
    for (let i = 0; i <= 5; i++) {
      const y = Y((max / 1.1) * i / 5);
      g += `<line class="ax" x1="44" x2="580" y1="${y}" y2="${y}"/>`;
      g += `<text class="ct" x="${X(i * 12)}" y="260" text-anchor="middle">${i ? 'Year ' + i : 'Today'}</text>`;
    }
    $('#grid').innerHTML = g;
    $('#pGen').setAttribute('d', `M${X(0)} ${Y(0)}L${X(60)} ${Y(cost * 60)}`);
    $('#aGen').setAttribute('d', `M${X(0)} ${Y(0)}L${X(60)} ${Y(cost * 60)}L${X(60)} ${Y(0)}Z`);
    $('#pSol').setAttribute('d', `M${X(0)} ${Y(sys)}L${X(60)} ${Y(sys)}`);
    $('#cross').innerHTML = pay <= 60
      ? `<line x1="${X(pay)}" x2="${X(pay)}" y1="${Y(sys)}" y2="236" stroke="#34d399" stroke-dasharray="3 4" opacity=".6"/>
         <circle class="break-dot" cx="${X(pay)}" cy="${Y(sys)}" r="7" fill="#34d399" stroke="#060a09" stroke-width="3"/>
         <text class="ct" x="${X(pay)}" y="${Y(sys) - 16}" text-anchor="middle" style="fill:#34d399;font-weight:800">Break-even</text>`
      : '';
    drawLine($('#pGen'));
    drawLine($('#pSol'));
  }

  function setMeter(id, pct) {
    const color = pct > 70 ? 'var(--leaf)' : pct > 45 ? 'var(--sun)' : 'var(--danger)';
    $('#' + id).textContent = pct + '%';
    const b = $('#' + id + 'Bar');
    b.style.width = pct + '%';
    b.style.background = color;
  }

  function calc() {
    const kva = num('#kva'), hrs = num('#hrs'), pr = num('#pr');
    $('#kvaO').textContent = kva + ' kVA';
    $('#hrsO').textContent = hrs + ' h';
    $('#prO').textContent = naira(pr);

    const kwhDay = kva * num('#aLoad') * hrs;
    const lit = kwhDay * num('#aLkwh') * 30;
    const cost = lit * pr;
    const co2 = lit * 12 * num('#aCo2');
    const trees = co2 / (num('#aTree') || 1);

    const [name, zone] = ST[stSel.selectedIndex] || ['Lagos', 'D'];
    const z = ZN[zone];
    const sys = kwhDay * num('#aSol') * (0.5 + 2.5 / z.s);
    const pay = cost > 0 ? sys / cost : Infinity;

    tween($('#oMonth'), cost, naira);
    tween($('#oL'), lit, v => fmt(v));
    tween($('#oCo2'), co2, v => fmt(v));

    const save5 = cost * 60 - sys;
    $('#verdict').innerHTML = pay <= 60
      ? `Solar could pay for itself in about <em>${pay < 12 ? Math.max(1, Math.round(pay)) + ' months' : (pay / 12).toFixed(1) + ' years'}</em>, then save you <em>${naira(save5)}</em> by year five.`
      : `At these numbers solar takes <em>${(pay / 12).toFixed(1)} years</em> to pay back. Try more hours or a higher petrol price to find the tipping point.`;

    const T = $('#trees');
    if (T.children.length !== 60) T.innerHTML = '<s></s>'.repeat(60);
    const n = Math.min(60, Math.round(trees));
    [...T.children].forEach((leaf, i) => setTimeout(() => leaf.classList.toggle('on', i < n), RM ? 0 : i * 14));
    $('#treeCap').textContent = `It would take about ${fmt(trees)} trees a whole year to absorb what this generator releases${trees > 60 ? ' (first 60 shown)' : ''}.`;

    // street impact meters
    const e = Math.pow(clamp((kva * hrs) / 90, 0, 1), 0.7);
    setMeter('mAir', Math.round(100 - 85 * e));
    setMeter('mTree', Math.round(100 - 70 * e));
    setMeter('mLung', Math.round(100 - 90 * e));
    const pill = $('#impactPill');
    pill.textContent = e > 0.55 ? 'High exposure' : e > 0.3 ? 'Moderate exposure' : 'Low exposure';
    pill.className = 'pill ' + (e > 0.55 ? '' : e > 0.3 ? 'mid' : 'good');

    // personalised warnings
    const daily = Math.round(lit / 30);
    const notes = [];
    if (hrs >= 10) notes.push(['fa-clock', `<b>${hrs} hours a day</b> is a long time near exhaust. Keep the generator outdoors, well away from windows, doors and vents.`]);
    if (daily >= 5) notes.push(['fa-fire', `You burn about <b>${daily} litres a day</b>. Keep only what you need, in approved containers, away from heat and living spaces.`]);
    notes.push(['fa-location-dot', `<b>${name}:</b> ${z.t}`]);
    notes.push(['fa-solar-panel', `<a href="https://www.google.com/maps/search/${encodeURIComponent('solar installers in ' + name + ', Nigeria')}" target="_blank" rel="noopener">Find solar installers in ${name}</a> or <a href="https://globalsolaratlas.info" target="_blank" rel="noopener">check sunshine at your exact location</a>.`]);
    $('#mine').innerHTML = notes.map(([i, h]) => `<div class="alert"><i class="fa-solid ${i}"></i><div>${h}</div></div>`).join('');
    $('#stNote').textContent = `About ${z.s} peak sun hours a day (regional estimate).`;

    clearTimeout(chartTimer);
    chartTimer = setTimeout(() => chart(cost, sys, pay), RM ? 0 : 220);
  }

  ['#st', '#kva', '#hrs', '#pr', '#aLkwh', '#aLoad', '#aCo2', '#aTree', '#aSol'].forEach(id => {
    $(id).addEventListener('input', calc);
    $(id).addEventListener('change', calc);
  });
  calc();

  /* ---------- 8. DrainGuard radar ---------- */
  const zones = [
    { key: 'awka',   name: 'Awka — Zik Avenue',        short: 'Awka',          lon: 7.07, lat: 6.21,  blockage: 88, rain: 2,  mix: '82% PET plastic, 18% silt' },
    { key: 'lagos',  name: 'Lagos — VI / Lekki drain', short: 'Lagos',         lon: 3.38, lat: 6.52,  blockage: 82, rain: 4,  mix: 'Packaging, nylon, debris' },
    { key: 'ibadan', name: 'Ibadan — Bodija Market',   short: 'Ibadan',        lon: 3.90, lat: 7.38,  blockage: 74, rain: 3,  mix: 'Market organics, plastics' },
    { key: 'ph',     name: 'Port Harcourt — Aba Road', short: 'Port Harcourt', lon: 7.00, lat: 4.82,  blockage: 65, rain: 6,  mix: 'Scrap metal, organic silt' },
    { key: 'kano',   name: 'Kano — Sabon Gari',        short: 'Kano',          lon: 8.52, lat: 12.00, blockage: 35, rain: 24, mix: 'Sand, household scrap' }
  ];
  const byKey = k => zones.find(z => z.key === k);
  let rainOn = true, selKey = 'awka', cleared = 0, diverted = 0, photoReady = false;

  const P = (lon, lat) => [((lon - 2.5) / 12.5) * 500, ((14.2 - lat) / 10.2) * 410];
  const path = pts => pts.map(([lo, la], i) => (i ? 'L' : 'M') + P(lo, la).map(v => v.toFixed(1)).join(' ')).join('') ;

  const nigeria = [[2.69,6.37],[2.72,7.8],[2.8,9.0],[3.6,10.3],[3.6,11.7],[4.1,13.5],[5.5,13.9],[6.9,13.1],[8.1,13.3],[9.6,12.8],[10.7,13.4],[12.3,13.1],[13.6,13.7],[14.1,13.1],[14.6,12.0],[14.2,11.3],[13.3,10.1],[13.2,9.0],[12.4,8.5],[11.8,7.0],[11.0,6.5],[10.2,7.0],[9.7,6.5],[8.8,5.8],[8.5,4.8],[7.3,4.4],[6.0,4.3],[5.0,5.5],[4.3,6.3]];
  const niger = [[3.6,11.7],[4.5,10.5],[5.5,9.2],[6.74,7.8],[6.75,6.2],[6.3,4.8]];
  const benue = [[13.4,9.3],[11.5,9.0],[9.5,8.3],[8.0,7.9],[6.74,7.8]];

  const risk = z => {
    const rf = (1 - Math.min(z.rain, 24) / 24) * (rainOn ? 1 : 0.25);
    return Math.round(((z.blockage / 100) * 6.5 + rf * 3.5) * 10) / 10;
  };
  const level = r => r >= 8 ? 'critical' : r >= 6.5 ? 'high' : r >= 4 ? 'moderate' : 'low';
  const levelColor = { critical: '#f2674d', high: '#f5b942', moderate: '#fde68a', low: '#34d399' };
  const statusOf = z => z.cleared ? ['Cleared', 'done'] : z.dispatched ? ['Crew en route', 'done'] : [level(risk(z)).replace(/^./, c => c.toUpperCase()), level(risk(z))];

  const svg = $('#mapSvg');
  const SVGNS = 'http://www.w3.org/2000/svg';
  function buildMap() {
    const [cx, cy] = [250, 205];
    svg.innerHTML = `
      ${[60, 120, 180, 240].map(r => `<circle class="ring-line" cx="${cx}" cy="${cy}" r="${r}"/>`).join('')}
      <path class="land" d="${path(nigeria)}Z"/>
      <path class="river" d="${path(niger)}"/>
      <path class="river" d="${path(benue)}"/>
      <g id="pins"></g>`;
    const g = $('#pins', svg);
    zones.forEach(z => {
      const [x, y] = P(z.lon, z.lat);
      const pin = document.createElementNS(SVGNS, 'g');
      pin.setAttribute('class', 'pin');
      pin.setAttribute('tabindex', '0');
      pin.setAttribute('role', 'button');
      pin.dataset.key = z.key;
      pin.innerHTML = `
        <circle class="halo" cx="${x}" cy="${y}" r="8" opacity=".6"/>
        <circle class="core" cx="${x}" cy="${y}" r="6" stroke="#050c0d" stroke-width="2"/>
        <text class="lbl" x="${x + 14}" y="${y + 4}">${z.short}</text>
        <text class="val" x="${x + 14}" y="${y + 18}"></text>`;
      pin.addEventListener('click', () => selectZone(z.key));
      pin.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectZone(z.key); } });
      g.appendChild(pin);
    });
  }

  function renderDrain() {
    // pins
    $$('.pin', svg).forEach(pin => {
      const z = byKey(pin.dataset.key);
      const r = risk(z);
      const c = z.cleared ? '#38bdf8' : levelColor[level(r)];
      pin.querySelector('.halo').setAttribute('fill', c);
      pin.querySelector('.core').setAttribute('fill', c);
      const v = pin.querySelector('.val');
      v.textContent = z.cleared ? 'cleared' : `risk ${r.toFixed(1)}`;
      v.setAttribute('fill', c);
      pin.classList.toggle('sel', z.key === selKey);
      pin.setAttribute('aria-label', `${z.name}, risk ${r.toFixed(1)} of 10`);
    });

    // queue
    const sorted = [...zones].sort((a, b) => (a.cleared - b.cleared) || (risk(b) - risk(a)));
    $('#queue').innerHTML = sorted.map((z, i) => {
      const r = risk(z);
      const [label, cls] = statusOf(z);
      return `<li class="q-row${z.key === selKey ? ' sel' : ''}" data-key="${z.key}" style="animation-delay:${i * 50}ms" tabindex="0">
        <span class="q-rank">#0${i + 1}</span>
        <span class="q-name"><b>${z.name}</b><small>${z.blockage}% blocked · ${z.rain >= 24 ? 'no rain soon' : 'rain in ' + z.rain + ' h'}</small></span>
        <span class="q-bar"><i style="width:${r * 10}%;background:${z.cleared ? '#38bdf8' : levelColor[level(r)]}"></i></span>
        <span class="q-status bg-${cls}">${label}</span>
      </li>`;
    }).join('');

    // selection footer
    const z = byKey(selKey);
    const r = risk(z);
    const [label, cls] = statusOf(z);
    $('#selName').textContent = z.name;
    const st = $('#selStatus');
    st.textContent = `${label} · ${r.toFixed(1)}/10`;
    st.className = cls === 'done' ? 'water' : 'lv-' + cls;
    $('#zoneSelect').value = selKey;
    $('#clearedCount').textContent = cleared;
    $('#divertedCount').textContent = fmt(diverted);
  }

  $('#queue').addEventListener('click', e => {
    const row = e.target.closest('.q-row');
    if (row) selectZone(row.dataset.key);
  });
  $('#queue').addEventListener('keydown', e => {
    const row = e.target.closest('.q-row');
    if (row && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); selectZone(row.dataset.key); }
  });

  function selectZone(key) {
    selKey = key;
    renderDrain();
  }

  $('#zoneSelect').innerHTML = zones.map(z => `<option value="${z.key}">${z.name}</option>`).join('');
  $('#zoneSelect').addEventListener('change', e => selectZone(e.target.value));

  $('#rainBtn').addEventListener('click', () => {
    rainOn = !rainOn;
    const b = $('#rainBtn');
    b.classList.toggle('on', rainOn);
    b.setAttribute('aria-pressed', rainOn);
    b.innerHTML = rainOn
      ? '<i class="fa-solid fa-cloud-showers-heavy"></i> <span>Forecast: heavy rain</span>'
      : '<i class="fa-solid fa-sun"></i> <span>Forecast: dry spell</span>';
    $('#rain').classList.toggle('on', rainOn);
    renderDrain();
    toast(rainOn ? 'Heavy rain forecast: queue re-ranked by flood risk.' : 'Dry spell: urgency drops, so crews can work through the backlog.', rainOn ? 'warn' : 'ok', rainOn ? 'fa-cloud-showers-heavy' : 'fa-sun');
  });

  // photo input
  const drop = $('#drop'), fileInput = $('#fileInput');
  function showPreview(src) {
    $('#previewImg').src = src;
    $('#dropEmpty').hidden = true;
    $('#dropPreview').hidden = false;
    photoReady = true;
  }
  function readFile(file) {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => showPreview(e.target.result);
    reader.readAsDataURL(file);
  }
  fileInput.addEventListener('change', e => readFile(e.target.files[0]));
  ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('drag'); }));
  ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('drag'); }));
  drop.addEventListener('drop', e => readFile(e.dataTransfer.files[0]));

  const sampleSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 240">
    <defs><linearGradient id="w" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#3b4a3f"/><stop offset="1" stop-color="#1d2620"/></linearGradient></defs>
    <rect width="400" height="240" fill="#6b6359"/>
    <rect y="0" width="400" height="70" fill="#8a8277"/>
    <path d="M0 70 L400 70 L360 240 L40 240 Z" fill="#4a443d"/>
    <path d="M30 120 L370 120 L352 240 L48 240 Z" fill="url(#w)"/>
    <g opacity=".95">
      <rect x="80" y="140" width="46" height="16" rx="7" fill="#7dd3fc" transform="rotate(-18 103 148)"/>
      <rect x="140" y="160" width="52" height="17" rx="8" fill="#e2e8f0" transform="rotate(12 166 168)"/>
      <rect x="210" y="132" width="44" height="15" rx="7" fill="#86efac" transform="rotate(-6 232 140)"/>
      <rect x="250" y="176" width="56" height="18" rx="8" fill="#93c5fd" transform="rotate(22 278 185)"/>
      <rect x="110" y="190" width="40" height="14" rx="6" fill="#fca5a5" transform="rotate(-30 130 197)"/>
      <path d="M180 200 q20 -24 46 -6 q14 10 -6 22 q-24 12 -40 -16Z" fill="#cbd5e1" opacity=".8"/>
      <path d="M290 130 q24 -10 34 8 q6 14 -16 16 q-20 2 -18 -24Z" fill="#fde68a" opacity=".8"/>
      <circle cx="320" cy="205" r="9" fill="#f8fafc"/>
    </g>
    <rect x="12" y="12" width="132" height="24" rx="6" fill="#000" opacity=".55"/>
    <text x="22" y="29" font-family="monospace" font-size="12" fill="#38bdf8">SAMPLE · DRAIN 014</text>
  </svg>`;
  $('#sampleBtn').addEventListener('click', e => {
    e.preventDefault();
    e.stopPropagation();
    showPreview('data:image/svg+xml;charset=utf-8,' + encodeURIComponent(sampleSvg));
  });

  const sev = $('#severity');
  const sevLabel = v => `${v}%`;
  sev.addEventListener('input', () => {
    const v = Number(sev.value);
    const o = $('#severityO');
    o.textContent = sevLabel(v);
    o.style.color = v > 80 ? 'var(--danger)' : v > 50 ? 'var(--sun)' : 'var(--leaf)';
  });
  sev.dispatchEvent(new Event('input'));

  $('#reportForm').addEventListener('submit', e => {
    e.preventDefault();
    const btn = $('#submitBtn');
    if (btn.disabled) return;
    if (!photoReady) $('#sampleBtn').click();

    const z = byKey($('#zoneSelect').value);
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> <span>Scanning photo…</span>';
    drop.classList.add('scanning');

    setTimeout(() => {
      drop.classList.remove('scanning');
      z.blockage = Number(sev.value);
      z.cleared = false;
      z.dispatched = false;

      const notes = $('#notes').value.toLowerCase();
      const plastic = /plastic|bottle|nylon|sachet|pure water/.test(notes);
      const r = risk(z);
      const lv = level(r);
      const kg = Math.round(z.blockage * 3);
      const conf = (88 + Math.random() * 9).toFixed(1);

      $('#aiConf').textContent = `Confidence ${conf}%`;
      $('#aiMix').textContent = plastic ? 'Mostly PET bottles & sachets' : z.mix;
      const aiRisk = $('#aiRisk');
      aiRisk.textContent = `${lv.toUpperCase()} · ${r.toFixed(1)}/10`;
      aiRisk.className = 'lv-' + lv;
      const rainTxt = rainOn && z.rain < 24 ? `about ${z.rain} h before heavy rain` : 'with no heavy rain due';
      $('#aiRec').textContent = {
        critical: `“Dispatch a crew to ${z.short} now, ${rainTxt}. Clearing it removes roughly ${kg} kg of waste from the channel.”`,
        high: `“Schedule ${z.short} within 24 hours, ${rainTxt}. Estimated ${kg} kg of waste to remove.”`,
        moderate: `“Add ${z.short} to this week’s route. Ask residents to keep sachets out of the gutter.”`,
        low: `“Monitor ${z.short}; re-check after the next rain.”`
      }[lv];

      const out = $('#aiOut');
      out.classList.remove('flash');
      void out.offsetWidth;
      out.classList.add('flash');

      selectZone(z.key);
      btn.disabled = false;
      btn.classList.add('done');
      btn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Report logged and ranked</span>';
      toast(`Report logged: ${z.short} is now <b>${lv}</b> risk (${r.toFixed(1)}/10).`, lv === 'critical' || lv === 'high' ? 'warn' : 'ok', 'fa-satellite-dish');
      setTimeout(() => {
        btn.classList.remove('done');
        btn.innerHTML = '<i class="fa-solid fa-microchip"></i> <span>Run risk assessment</span>';
      }, 2600);
    }, RM ? 200 : 1600);
  });

  $('#dispatchBtn').addEventListener('click', () => {
    const z = byKey(selKey);
    if (z.cleared) { toast(`${z.short} is already clear.`, 'ok', 'fa-circle-info'); return; }
    if (z.dispatched) { toast(`A crew is already on the way to ${z.short}.`, 'ok', 'fa-truck'); return; }
    const before = risk(z);
    const ticket = 'DG-' + Math.floor(1000 + Math.random() * 9000);
    z.dispatched = true;
    renderDrain();
    toast(`Crew dispatched to ${z.short}. Ticket <b>#${ticket}</b>.`, 'ok', 'fa-truck');

    setTimeout(() => {
      const kg = Math.round(z.blockage * 3);
      z.blockage = 8;
      z.dispatched = false;
      z.cleared = true;
      cleared++;
      diverted += kg;
      renderDrain();
      toast(`${z.short} cleared: ${kg} kg of waste removed and risk down from ${before.toFixed(1)} to ${risk(z).toFixed(1)}.`, 'ok', 'fa-circle-check');
    }, RM ? 400 : 2800);
  });

  buildMap();
  renderDrain();
  $('#rain').classList.add('on');

  /* ---------- 9. Loop & Lean ---------- */
  // per single action: water L, energy kWh, waste kg, co2 kg
  const habits = {
    repair:     { label: 'Repair, don’t replace', icon: 'fa-screwdriver-wrench', title: 'Repair before replace',   base: 94, water: 0,  energy: 3.5, waste: 1.9, co2: 2.1, rec: 'Repairing keeps materials in use longer and keeps waste out of landfill. When a fix is practical, it is usually the highest-impact choice.' },
    laundry:    { label: 'Cold-water laundry',   icon: 'fa-shirt',              title: 'Low-energy laundry',      base: 86, water: 0,  energy: 1.4, waste: 0,   co2: 0.7, rec: 'Most of a hot wash’s energy goes into heating water. Cold cycles still get everyday clothes clean.' },
    shower:     { label: 'Shorter shower',       icon: 'fa-shower',             title: 'Water-smart shower',      base: 81, water: 68, energy: 1.1, waste: 0,   co2: 0.4, rec: 'Cutting two minutes saves water and the fuel used to heat or pump it, which adds up in borehole and tank homes.' },
    bottle:     { label: 'Reusable bottle',      icon: 'fa-bottle-water',       title: 'Reusable bottle win',     base: 89, water: 0,  energy: 0.8, waste: 0.8, co2: 0.9, rec: 'Every refill is a sachet or PET bottle that never reaches a gutter or a drain.' },
    takeout:    { label: 'Bring a container',    icon: 'fa-box-open',           title: 'No single-use packaging', base: 87, water: 0,  energy: 0.5, waste: 1.0, co2: 0.7, rec: 'Bringing your own container to the buka cuts disposable packs and nylon bags at the source.' },
    dishwasher: { label: 'Wash in a basin',      icon: 'fa-sink',               title: 'Basin, not running tap',  base: 83, water: 23, energy: 0.3, waste: 0,   co2: 0.2, rec: 'Washing dishes in a filled basin instead of under a running tap saves a surprising amount of water.' }
  };
  let habitKey = 'repair';
  const chips = $('#habitChips');
  chips.innerHTML = Object.entries(habits).map(([k, h]) =>
    `<button type="button" class="chip-btn" role="radio" aria-checked="${k === habitKey}" data-key="${k}"><i class="fa-solid ${h.icon}"></i>${h.label}</button>`
  ).join('');
  chips.addEventListener('click', e => {
    const b = e.target.closest('.chip-btn');
    if (!b) return;
    habitKey = b.dataset.key;
    $$('.chip-btn', chips).forEach(c => c.setAttribute('aria-checked', c === b));
    calcHabit();
  });

  const ring = $('#ringFg');
  const C = 2 * Math.PI * 52;
  ring.style.strokeDasharray = C;
  ring.style.strokeDashoffset = C;

  function calcHabit() {
    const h = habits[habitKey];
    const n = Number($('#freq').value);
    $('#freqO').textContent = n + (n === 1 ? ' time' : ' times');
    const wk = { water: h.water * n, energy: h.energy * n, waste: h.waste * n, co2: h.co2 * n };
    const score = Math.min(99, Math.round(h.base * 0.75 + n * 2));
    ring.style.strokeDashoffset = C * (1 - score / 100);
    tween($('#habitScore'), score, v => Math.round(v));
    $('#habitTitle').textContent = h.title;
    $('#habitRec').textContent = h.rec;
    tween($('#hWater'), wk.water * 52, v => fmt(v));
    tween($('#hEnergy'), wk.energy * 52, v => fmt(v));
    tween($('#hWaste'), wk.waste * 52, v => fmt(v, 1));
    tween($('#hCo2'), wk.co2 * 52, v => fmt(v, 1));
    $('#habitWeek').textContent = `Each week: ${fmt(wk.water)} L water · ${fmt(wk.energy, 1)} kWh · ${fmt(wk.waste, 1)} kg waste · ${fmt(wk.co2, 1)} kg CO₂. Rough averages for planning.`;
  }
  $('#freq').addEventListener('input', calcHabit);

  new IntersectionObserver(([en], obs) => {
    if (en.isIntersecting) { calcHabit(); obs.disconnect(); }
  }, { threshold: 0.3 }).observe($('.habit-result'));
  $('#habitTitle').textContent = habits[habitKey].title;
  $('#habitRec').textContent = habits[habitKey].rec;

  /* ---------- 10. Checklist & finale ---------- */
  const actions = [
    ['Check generator placement.', 'Outdoors, away from windows, doors and vents; never indoors.'],
    ['Check fuel and fire risks.', 'Keep petrol away from heat and living spaces; never refuel a hot engine.'],
    ['Inspect cables and connections.', 'Stop using damaged cables and ask an electrician about unsafe wiring.'],
    ['Record a week of generator use.', 'Running hours, litres bought and the pump price.'],
    ['Cut avoidable energy use.', 'Switch off idle equipment and swap to LED bulbs.'],
    ['Report one blocked drain.', 'Use DrainGuard above, or tell your LGA sanitation office.'],
    ['Compare two solar quotes.', 'Ask for a load assessment, itemised costs, warranties and battery details.'],
    ['Save emergency contacts.', 'Keep 112 and your LGA guidance handy.']
  ];
  const saved = store.get('gs-checklist', []);
  const list = $('#checklist');
  list.innerHTML = actions.map(([b, s], i) => `
    <label class="check-row">
      <input type="checkbox" data-i="${i}" ${saved.includes(i) ? 'checked' : ''} />
      <span class="check-box"><i class="fa-solid fa-check"></i></span>
      <span class="check-text"><b>${b}</b> ${s}</span>
    </label>`).join('');

  const checkRing = $('#checkRing');
  const CC = 2 * Math.PI * 20;
  checkRing.style.strokeDasharray = CC;

  function updateChecks(celebrate) {
    const boxes = $$('input', list);
    const done = boxes.filter(b => b.checked);
    const pct = Math.round((done.length / boxes.length) * 100);
    checkRing.style.strokeDashoffset = CC * (1 - pct / 100);
    $('#checkPct').textContent = pct + '%';
    $('#checkCount').textContent = `${done.length} of ${boxes.length} done`;
    store.set('gs-checklist', done.map(b => Number(b.dataset.i)));
    if (celebrate && done.length === boxes.length) {
      confetti();
      toast('All eight done. Your household just made the shift.', 'ok', 'fa-trophy');
    }
  }
  list.addEventListener('change', () => updateChecks(true));
  updateChecks(false);

  function confetti() {
    if (RM || !document.body.animate) return;
    const colors = ['#34d399', '#f5b942', '#38bdf8', '#a7f3d0', '#ffd977', '#f2674d'];
    for (let i = 0; i < 90; i++) {
      const c = document.createElement('i');
      c.className = 'confetti';
      c.style.background = colors[i % colors.length];
      document.body.appendChild(c);
      const x0 = innerWidth / 2 + (Math.random() - 0.5) * 200;
      const x1 = x0 + (Math.random() - 0.5) * innerWidth * 0.9;
      const y1 = innerHeight * (0.6 + Math.random() * 0.5);
      const rot = (Math.random() - 0.5) * 1080;
      c.animate([
        { transform: `translate(${x0}px, ${innerHeight * 0.3}px) rotate(0) scale(1)`, opacity: 1 },
        { transform: `translate(${(x0 + x1) / 2}px, ${innerHeight * 0.05}px) rotate(${rot / 2}deg)`, opacity: 1, offset: 0.3 },
        { transform: `translate(${x1}px, ${y1}px) rotate(${rot}deg) scale(.6)`, opacity: 0 }
      ], { duration: 1800 + Math.random() * 1200, easing: 'cubic-bezier(.2,.6,.4,1)' }).onfinish = () => c.remove();
    }
  }
})();
