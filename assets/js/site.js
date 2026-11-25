{
  // mobile menu
  const btn = document.querySelector('.menu'), nav = document.querySelector('.nav');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open);
    });
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
    let geo = null;
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
        <path d="${path(geo.uk)}" fill="#fff"/>
        <path d="${path(geo.th)}" fill="#fff"/>` : ''}
        <path class="arc" pathLength="1" d="M${route.map(p => P(p).map(n => n.toFixed(1)).join(',')).join('L')}"/>
        <circle cx="${x0}" cy="${y0}" r="6" fill="#E0112B" stroke="#fff" stroke-width="3"/>
        <circle cx="${x1}" cy="${y1}" r="6" fill="#E0112B" stroke="#fff" stroke-width="3"/>
        <text x="${ldnLeft ? ukLeft : x0 + 14}" y="${ldnLeft ? y0 - 4 : y0 + 34}" font-size="${small ? 16 : 20}" font-weight="700" text-anchor="${ldnLeft ? 'end' : 'start'}" ${lab}>United Kingdom</text>
        <text x="${ldnLeft ? ukLeft : x0 + 14}" y="${ldnLeft ? y0 + 18 : y0 + 54}" font-size="14" text-anchor="${ldnLeft ? 'end' : 'start'}" ${lab}>LSE, Houghton Street</text>
        <text x="${thLeft}" y="${y1 + 30}" font-size="${small ? 16 : 20}" font-weight="700" text-anchor="end" ${lab}>Thailand</text>
        <text x="${thLeft}" y="${y1 + 50}" font-size="14" text-anchor="end" ${lab}>Bangkok</text>`;
    };
    const ro = new ResizeObserver(draw);
    ro.observe(fig);
    fetch(fig.dataset.map).then(r => r.json()).then(d => { geo = d; draw(); }).catch(() => {});
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
