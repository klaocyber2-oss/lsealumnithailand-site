{
  // mobile menu
  const btn = document.querySelector('.menu'), nav = document.querySelector('.nav');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
  }

  // cover slideshow
  const slides = [...document.querySelectorAll('.slides img')], dots = document.querySelector('.dots');
  if (slides.length > 1 && dots) {
    let cur = 0, timer = 0;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    dots.innerHTML = slides.map((im, i) => `<button type="button" aria-label="Show photo ${i + 1}: ${im.alt.replace(/"/g, '')}"></button>`).join('');
    const btns = [...dots.children];
    const go = (i) => {
      cur = (i + slides.length) % slides.length;
      slides.forEach((im, k) => { if (k === cur) im.loading = 'eager'; im.classList.toggle('on', k === cur); });
      btns.forEach((b, k) => b.setAttribute('aria-current', k === cur));
      const cr = document.querySelector('.cover .credit'), im = slides[cur];
      if (cr) { cr.hidden = !im.dataset.credit; cr.textContent = im.dataset.credit || ''; cr.href = im.dataset.creditUrl || '#'; }
    };
    const auto = () => { clearInterval(timer); if (!still) timer = setInterval(() => go(cur + 1), 6000); };
    btns.forEach((b, i) => b.addEventListener('click', () => { go(i); auto(); }));
    go(0); auto();
  }

  // footer year
  for (const y of document.querySelectorAll('[data-year]')) y.textContent = new Date().getFullYear();

  // Map: UK and Thailand, with the great-circle route London -> Bangkok (home page)
  const fig = document.querySelector('.route .fig');
  if (fig) {
    const svg = fig.querySelector('svg');
    const LDN = [-0.1165, 51.5144], BKK = [100.5018, 13.7563];
    const rad = Math.PI / 180, C = Math.cos(35 * rad);
    // points along the great circle (true shortest path on the globe)
    const vec = ([lon, lat]) => [Math.cos(lat * rad) * Math.cos(lon * rad), Math.cos(lat * rad) * Math.sin(lon * rad), Math.sin(lat * rad)];
    const A = vec(LDN), B = vec(BKK), om = Math.acos(A[0] * B[0] + A[1] * B[1] + A[2] * B[2]);
    const route = [];
    for (let i = 0; i <= 64; i++) {
      const t = i / 64, f1 = Math.sin((1 - t) * om) / Math.sin(om), f2 = Math.sin(t * om) / Math.sin(om);
      const v = [f1 * A[0] + f2 * B[0], f1 * A[1] + f2 * B[1], f1 * A[2] + f2 * B[2]];
      route.push([Math.atan2(v[1], v[0]) / rad, Math.asin(v[2]) / rad]);
    }
    let geo = null, prog = 0;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const placePlane = () => {
      const arc = svg.querySelector('#routeArc'), plane = svg.querySelector('#plane');
      if (!arc || !plane) return;
      arc.style.strokeDashoffset = 1 - prog;
      const L = arc.getTotalLength(), q = Math.min(prog, 0.999);
      const a = arc.getPointAtLength(q * L), b2 = arc.getPointAtLength(Math.min(L, q * L + 2));
      const ang = Math.atan2(b2.y - a.y, b2.x - a.x) * 180 / Math.PI;
      plane.setAttribute('transform', `translate(${a.x.toFixed(1)},${a.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${fig.clientWidth < 560 ? 0.8 : 1.1})`);
      plane.style.opacity = prog > 0 && prog < 1 ? 1 : 0;
      svg.querySelector('.pulse')?.classList.toggle('on', prog >= 1);
    };
    const draw = () => {
      const W = fig.clientWidth, H = fig.clientHeight, small = W < 560;
      const padX = small ? 24 : 64, padY = 56;
      const l = -12, r = 110, t = 60, b = 4;
      const k = Math.min((W - 2 * padX) / ((r - l) * C), (H - 2 * padY) / (t - b));
      const ox = (W - (r - l) * C * k) / 2 - l * C * k, oy = (H - (t - b) * k) / 2 + t * k;
      const P = ([lon, lat]) => [ox + lon * C * k, oy - lat * k];
      const path = (rings) => rings.map(ring => 'M' + ring.map(p => P(p).map(n => n.toFixed(1)).join(',')).join('L') + 'Z').join('');
      const [x0, y0] = P(LDN), [x1, y1] = P(BKK);
      const gap = small ? 6 : 9, dr = small ? 1.1 : 1.6;
      const lab = 'fill="#fff" stroke="#E0112B" stroke-width="6" stroke-linejoin="round" paint-order="stroke"';
      const ukLeft = P([-11.5, 0])[0] - 8, thLeft = P([96.6, 0])[0];
      const ldnLeft = ukLeft > 190;
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      svg.innerHTML = `
        <defs><pattern id="dots" width="${gap}" height="${gap}" patternUnits="userSpaceOnUse">
          <circle cx="${gap / 2}" cy="${gap / 2}" r="${dr}" fill="#fff" fill-opacity=".5"/></pattern></defs>
        ${geo ? `<path d="${path(geo.land)}" fill="url(#dots)"/>
        <path class="land uk" d="${path(geo.uk)}" fill="#fff"><title>United Kingdom: where it started, at LSE on Houghton Street</title></path>
        <path class="land th" d="${path(geo.th)}" fill="#fff"><title>Thailand: home to 1,192 LSE alumni</title></path>` : ''}
        <path class="arc ghost" d="M${route.map(p => P(p).map(n => n.toFixed(1)).join(',')).join('L')}"/>
        <path class="arc" id="routeArc" pathLength="1" style="stroke-dashoffset:${1 - prog}" d="M${route.map(p => P(p).map(n => n.toFixed(1)).join(',')).join('L')}"/>
        <circle cx="${x0}" cy="${y0}" r="6" fill="#E0112B" stroke="#fff" stroke-width="3"/>
        <circle class="pulse${prog >= 1 ? ' on' : ''}" cx="${x1}" cy="${y1}" r="10" fill="none" stroke="#fff" stroke-width="2"/>
        <circle cx="${x1}" cy="${y1}" r="6" fill="#E0112B" stroke="#fff" stroke-width="3"/>
        <g id="plane" style="opacity:${prog > 0 && prog < 1 ? 1 : 0}"><path d="M12,0C12,1.2 10.5,1.6 9,1.6L3,1.6L-3,11L-6,11L-2,1.6L-8,1.6L-10.5,4.5L-12.5,4.5L-11,0L-12.5,-4.5L-10.5,-4.5L-8,-1.6L-2,-1.6L-6,-11L-3,-11L3,-1.6L9,-1.6C10.5,-1.6 12,-1.2 12,0Z" fill="#fff" stroke="#B30E22" stroke-width=".8"/></g>
        <text x="${ldnLeft ? ukLeft : x0 + 14}" y="${ldnLeft ? y0 - 4 : y0 + 34}" font-size="${small ? 16 : 20}" font-weight="700" text-anchor="${ldnLeft ? 'end' : 'start'}" ${lab}>United Kingdom</text>
        <text x="${ldnLeft ? ukLeft : x0 + 14}" y="${ldnLeft ? y0 + 18 : y0 + 54}" font-size="14" text-anchor="${ldnLeft ? 'end' : 'start'}" ${lab}>LSE, Houghton Street</text>
        <text x="${thLeft}" y="${y1 + 30}" font-size="${small ? 16 : 20}" font-weight="700" text-anchor="end" ${lab}>Thailand</text>
        <text x="${thLeft}" y="${y1 + 50}" font-size="14" text-anchor="end" ${lab}>Bangkok</text>`;
      placePlane();
    };
    const ro = new ResizeObserver(draw);
    ro.observe(fig);
    fetch(fig.dataset.map).then(r => r.json()).then(d => { geo = d; draw(); }).catch(() => {});

    // the journey: plane flies London -> Bangkok, distance and alumni figures count up
    const fmt = (n) => Math.round(n).toLocaleString('en-GB');
    const counters = [...document.querySelectorAll('.route [data-count]')];
    const setCounts = (pPlane, pCount) => {
      for (const el of counters) {
        const target = +el.dataset.count, p = el.dataset.follow ? pPlane : pCount;
        el.textContent = fmt(target * p);
      }
    };
    const ease = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    let raf = 0;
    const fly = () => {
      cancelAnimationFrame(raf);
      if (reduce) { prog = 1; placePlane(); setCounts(1, 1); return; }
      const t0 = performance.now(), dur = 3600;
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        prog = ease(t); placePlane(); setCounts(prog, easeOut(t));
        if (t < 1) raf = requestAnimationFrame(step);
      };
      prog = 0; setCounts(0, 0); raf = requestAnimationFrame(step);
    };
    const band = document.querySelector('.route');
    if ('IntersectionObserver' in window && !reduce) {
      setCounts(0, 0);
      const io = new IntersectionObserver((es) => {
        if (es.some(e => e.isIntersecting)) { io.disconnect(); fly(); }
      }, { threshold: 0.35 });
      io.observe(band);
    } else { prog = 1; setCounts(1, 1); }
    document.querySelector('.replay')?.addEventListener('click', fly);
    fig.addEventListener('click', fly);
  }

  // event tabs
  const tabs = document.querySelectorAll('.tabs [role=tab]');
  const show = (id) => {
    for (const t of tabs) {
      const on = t.dataset.panel === id;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.dataset.panel).hidden = !on;
    }
  };
  if (tabs.length) {
    for (const t of tabs) t.addEventListener('click', () => { show(t.dataset.panel); try { history.replaceState(null, '', '#' + t.dataset.panel); } catch (e) {} });
    const start = location.hash.slice(1);
    if (start && document.getElementById(start)) show(start);
  }

  // gentle reveal on scroll
  const rv = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver((es) => {
      for (const e of es) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px' });
    for (const el of rv) io.observe(el);
  } else for (const el of rv) el.classList.add('in');
}
