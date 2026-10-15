// ── Page switching
function showPage(name, btn) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  btn.classList.add('active');
  if (name === 'dashboard') renderDashboard();
}

// ── Slider background update
function updateBg(el) {
  const pct = ((el.value - el.min) / (el.max - el.min)) * 100;
  el.style.background = `linear-gradient(to right, var(--green) ${pct}%, var(--border2) ${pct}%)`;
}

// ── Fill level sync with bin visual
function syncFill(val) {
  document.getElementById('fill_val').textContent = val + '%';
  document.getElementById('hero-fill').style.height = val + '%';
  document.getElementById('hero-pct').textContent = val + '%';
  document.getElementById('overflow-badge').style.display = val >= 90 ? 'block' : 'none';
  const fill = document.getElementById('hero-fill');
  if (val >= 90)      fill.style.background = 'linear-gradient(to top, #b71c1c, var(--red))';
  else if (val >= 80) fill.style.background = 'linear-gradient(to top, #e65100, var(--amber))';
  else                fill.style.background = 'linear-gradient(to top, #00c853, var(--green))';
  updateBg(document.getElementById('fill_level'));
}

window.addEventListener('load', () => {
  updateBg(document.getElementById('fill_level'));
  updateBg(document.getElementById('humidity'));
});

// ── PREDICTION LOGIC (derived from dataset: Fill_Level >= 80 → Collection Required)
function predict() {
  const fill   = parseFloat(document.getElementById('fill_level').value);
  const weight = parseFloat(document.getElementById('weight').value);
  const loc    = document.getElementById('location').value;
  const wtype  = document.getElementById('waste_type').value;
  const temp   = parseFloat(document.getElementById('temperature').value);
  const hum    = parseFloat(document.getElementById('humidity').value);

  const isYes = fill >= 80;

  let priority, confidence;
  if (isYes) {
    if (fill >= 96)      { priority = 'Critical'; confidence = 99.5; }
    else                 { priority = 'High';     confidence = 97.0; }
  } else {
    if (fill >= 60)      { priority = 'Low';  confidence = 91.0; }
    else                 { priority = 'None'; confidence = 98.5; }
  }

  // Verdict box
  const v = document.getElementById('verdict');
  v.className = 'verdict ' + (isYes ? 'yes' : 'no');
  v.innerHTML = `
    <div class="v-icon">${isYes ? '🚛' : '✅'}</div>
    <div class="v-main">${isYes ? 'Collection Required!' : 'No Collection Needed'}</div>
    <div class="v-sub">${isYes
      ? `Fill level at ${fill}% — dispatch a vehicle to this location immediately.`
      : `Fill level at ${fill}% — bin is within safe limits, no action required.`
    }</div>`;

  // Confidence bar
  document.getElementById('conf-pct').textContent = confidence + '%';
  document.getElementById('conf-fill').style.width = confidence + '%';

  // Priority badge
  const pb = document.getElementById('prio');
  pb.textContent = priority.toUpperCase();
  pb.className = 'prio ' + priority;

  // Info cells
  document.getElementById('r-loc').textContent    = loc;
  document.getElementById('r-wt').textContent     = wtype;
  document.getElementById('r-fill').textContent   = fill + '%';
  document.getElementById('r-weight').textContent = weight + ' kg';
  document.getElementById('r-temp').textContent   = temp + ' °C';
  document.getElementById('r-hum').textContent    = hum + '%';
}

// ── DASHBOARD CHARTS
const PAL = ['#00e676','#448aff','#ffab00','#ff5252','#e040fb','#00e5ff','#69f0ae'];

function renderDashboard() {
  renderBar('waste-chart',
    {Mixed:14.5, Organic:14.4, Plastic:14.3, Paper:14.3, Glass:14.2, Metal:14.2, 'E-waste':14.1});
  renderBar('loc-chart',
    {Hospital:12.8, Residential:12.6, School:12.5, Market:12.5, Industrial:12.4, Park:12.4, 'Sector A':12.4, 'Sector B':12.4});
  renderDonut('prio-chart',
    {Low:60.0, High:15.1, Critical:5.0, Medium:19.9},
    {Low:'#00e676', High:'#ffab00', Critical:'#ff5252', Medium:'#448aff'});
  renderDonut('coll-chart',
    {No:78.95, Yes:21.05},
    {No:'#448aff', Yes:'#00e676'});
}

function renderBar(id, data) {
  const el  = document.getElementById(id);
  const max = Math.max(...Object.values(data));
  el.innerHTML = Object.entries(data).map(([k,v],i) => `
    <div class="bar-row">
      <div class="bar-name">${k}</div>
      <div class="bar-track"><div class="bar-fill" style="background:${PAL[i%PAL.length]}" data-w="${(v/max*100).toFixed(1)}"></div></div>
      <div class="bar-pct">${v}%</div>
    </div>`).join('');
  setTimeout(() => el.querySelectorAll('.bar-fill').forEach(b => b.style.width = b.dataset.w + '%'), 80);
}

function renderDonut(id, data, colors) {
  const el = document.getElementById(id);
  const R = 50, CX = 60, CY = 60, SW = 18;
  const circ = 2 * Math.PI * R;
  const entries = Object.entries(data);
  const total = entries.reduce((s,[,v]) => s+v, 0);
  let off = 0;
  const segs = entries.map(([k,v]) => {
    const dash = (v/total)*circ;
    const s = {k, v:v.toFixed(1), c:colors[k]||PAL[0], dash, offset: circ-off};
    off += dash; return s;
  });
  el.innerHTML = `
    <svg width="120" height="120" viewBox="0 0 120 120" style="flex-shrink:0">
      <circle cx="${CX}" cy="${CY}" r="${R}" fill="none" stroke="var(--border)" stroke-width="${SW}"/>
      ${segs.map(s=>`<circle cx="${CX}" cy="${CY}" r="${R}" fill="none"
        stroke="${s.c}" stroke-width="${SW}"
        stroke-dasharray="${s.dash} ${circ-s.dash}"
        stroke-dashoffset="${s.offset}"
        transform="rotate(-90 ${CX} ${CY})"/>`).join('')}
    </svg>
    <div class="donut-legend">
      ${segs.map(s=>`<div class="legend-row">
        <div class="legend-dot" style="background:${s.c}"></div>
        <span>${s.k}</span>
        <span class="legend-val">${s.v}%</span>
      </div>`).join('')}
    </div>`;
}
