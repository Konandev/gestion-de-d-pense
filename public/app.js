/* ==========================================================
   Mon Budget — front-end (vanilla JS + Chart.js)
   ========================================================== */

/* ---------- Icônes (style Lucide) ---------- */
const ICONS = {
  wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
  home: '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  'plus-circle': '<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>',
  receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 17.5v-11"/>',
  tag: '<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',
  'bar-chart': '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  download: '<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',
  'sun-moon': '<path d="M12 8a2.83 2.83 0 0 0 4 4 4 4 0 1 1-4-4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/>',
  copyright: '<circle cx="12" cy="12" r="10"/><path d="M14.83 14.83a4 4 0 1 1 0-5.66"/>',
  menu: '<path d="M4 6h16"/><path d="M4 12h16"/><path d="M4 18h16"/>',
  calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
  'chevron-down': '<path d="m6 9 6 6 6-6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  card: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
  filter: '<path d="M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z"/>',
  sheet: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m8 13 4 4"/><path d="m12 13-4 4"/>',
  'file-text': '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',
  'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  save: '<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>',
  edit: '<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  'arrow-up-right': '<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  'arrow-down-right': '<path d="m7 7 10 10"/><path d="M17 8v9H8"/>',
  utensils: '<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',
  bus: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  film: '<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/>',
  building: '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M12 6h.01"/><path d="M16 6h.01"/><path d="M8 10h.01"/><path d="M12 10h.01"/><path d="M16 10h.01"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/>',
  cap: '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  more: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
};

const svg = (name) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

function paintIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach((el) => {
    if (!el.dataset.painted || el.dataset.painted !== el.dataset.icon) {
      el.innerHTML = svg(el.dataset.icon);
      el.dataset.painted = el.dataset.icon;
    }
  });
}

/* ---------- Catégories ---------- */
const CATEGORIES = {
  Alimentation: { color: '#3b82f6', icon: 'utensils' },
  Transport:    { color: '#f59e0b', icon: 'bus' },
  Loisirs:      { color: '#22c55e', icon: 'film' },
  Logement:     { color: '#8b5cf6', icon: 'building' },
  Santé:        { color: '#ef4565', icon: 'heart' },
  Éducation:    { color: '#14b8a6', icon: 'cap' },
  Autres:       { color: '#94a3b8', icon: 'more' },
};
const CAT_NAMES = Object.keys(CATEGORIES);

/* ---------- Utilitaires ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const nf = new Intl.NumberFormat('fr-FR');
const fcfa = (n) => nf.format(n).replace(/\u202f/g, '\u00a0') + '\u00a0FCFA';
const num = (n) => nf.format(n).replace(/\u202f/g, '\u00a0');
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const pad = (n) => String(n).padStart(2, '0');
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const monthOf = (iso) => iso.slice(0, 7);
const monthLabel = (ym) => { const [y, m] = ym.split('-').map(Number); return new Date(y, m - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }); };
const shortMonth = (ym) => { const [y, m] = ym.split('-').map(Number); return new Date(y, m - 1, 1).toLocaleDateString('fr-FR', { month: 'short' }); };
const dateLabel = (iso) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }); };

async function api(url, opts) {
  const res = await fetch(url, opts && opts.body ? { ...opts, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(opts.body) } : opts);
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error((data.errors && data.errors.join(' ')) || 'Une erreur est survenue.');
  return data;
}

let toastTimer;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2400);
}

/* ---------- État ---------- */
const state = {
  month: monthOf(todayISO()),
  category: '',
  view: 'dashboard',
  editingId: null,
  summary: null,
};
let donutChart = null;
let barChart = null;

/* ---------- Thème ---------- */
function setTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  localStorage.setItem('theme', t);
  $('#themeToggle').checked = t === 'dark';
  $('#themeBtn').dataset.icon = t === 'dark' ? 'moon' : 'sun';
  paintIcons();
  if (state.view === 'stats') renderStats();
  updateDonutBorder();
}
const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

/* ---------- Navigation ---------- */
function showView(name) {
  if (!$('#view-' + name)) name = 'dashboard';
  state.view = name;
  $$('.view').forEach((v) => (v.hidden = v.id !== 'view-' + name));
  $$('[data-view]').forEach((a) => a.classList.toggle('active', a.dataset.view === name));
  closeMenu();
  window.scrollTo({ top: 0 });
  refresh();
}
window.addEventListener('hashchange', () => showView(location.hash.slice(1) || 'dashboard'));

function openMenu() { $('#sidebar').classList.add('open'); $('#scrim').classList.add('show'); }
function closeMenu() { $('#sidebar').classList.remove('open'); $('#scrim').classList.remove('show'); }

/* ---------- Requêtes ---------- */
const qs = (extra = {}) => new URLSearchParams({ month: state.month, ...(state.category ? { category: state.category } : {}), ...extra }).toString();

async function refresh() {
  syncControls();
  try {
    if (state.view === 'dashboard') {
      const [summary, recent] = await Promise.all([api('/api/summary?' + qs()), api('/api/expenses?' + qs({ limit: 5 }))]);
      state.summary = summary;
      renderKpis(summary);
      renderDonut(summary);
      renderRows($('#recentBody'), recent);
    } else if (state.view === 'expenses') {
      renderRows($('#allBody'), await api('/api/expenses?' + qs()));
    } else if (state.view === 'categories') {
      state.summary = await api('/api/summary?month=' + state.month);
      renderCategories(state.summary);
    } else if (state.view === 'stats') {
      await renderStats();
    }
  } catch (e) {
    toast(e.message);
  }
  updateExportLinks();
}

/* ---------- Contrôles (mois / filtres) ---------- */
function monthOptions() {
  const set = new Set([state.month]);
  const d = new Date();
  for (let i = 0; i < 12; i++) {
    set.add(`${d.getFullYear()}-${pad(d.getMonth() + 1)}`);
    d.setMonth(d.getMonth() - 1);
  }
  return [...set].sort().reverse();
}

function syncControls() {
  $('#monthInput').value = state.month;
  $('#monthText').textContent = monthLabel(state.month);

  const fm = $('#fMonth');
  fm.innerHTML = monthOptions().map((m) => `<option value="${m}">${monthLabel(m).replace(/^./, (c) => c.toUpperCase())}</option>`).join('');
  fm.value = state.month;

  const fc = $('#fCategory');
  fc.innerHTML = '<option value="">Toutes les catégories</option>' + CAT_NAMES.map((c) => `<option>${c}</option>`).join('');
  fc.value = state.category;
}

function updateExportLinks() {
  const q = qs();
  ['1', '2'].forEach((n) => {
    $('#xlsxBtn' + n).href = '/api/export/excel?' + q;
    $('#csvBtn' + n).href = '/api/export/csv?' + q;
  });
}

/* ---------- Rendu : KPI ---------- */
function delta(el, text, dir) {
  el.className = 'kpi-delta ' + (dir || 'muted');
  el.innerHTML = (dir === 'up' ? svg('arrow-up-right') : dir === 'down' ? svg('arrow-down-right') : '') + `<span>${text}</span>`;
}
const sign = (n) => (n > 0 ? '+' : n < 0 ? '−' : '') + Math.abs(n).toString().replace('.', ',');

function renderKpis(s) {
  $('#kTotal').textContent = fcfa(s.total);
  $('#kCount').textContent = s.count;
  $('#kAvg').textContent = fcfa(s.average);
  $('#kMax').textContent = fcfa(s.max);

  const pctDelta = (el, v) => {
    if (v === null) return delta(el, 'Aucune donnée le mois dernier');
    delta(el, `${sign(v)}% par rapport au mois dernier`, v > 0 ? 'up' : v < 0 ? 'down' : '');
  };
  // Pour des dépenses, une hausse est signalée en rouge, une baisse en vert
  const flip = (el) => { if (el.classList.contains('up')) { el.classList.replace('up', 'down'); } else if (el.classList.contains('down')) { el.classList.replace('down', 'up'); } };
  pctDelta($('#kTotalD'), s.delta.total); flip($('#kTotalD'));
  pctDelta($('#kAvgD'), s.delta.average); flip($('#kAvgD'));

  const c = s.delta.count;
  delta($('#kCountD'), `${sign(c)} par rapport au mois dernier`, c > 0 ? 'up' : c < 0 ? 'down' : '');
  $('#kMaxD').className = 'kpi-delta muted';
  $('#kMaxD').textContent = s.maxCategory || '—';
}

/* ---------- Rendu : donut ---------- */
function updateDonutBorder() {
  if (donutChart) {
    donutChart.data.datasets[0].borderColor = getComputedStyle(document.documentElement).getPropertyValue('--card').trim();
    donutChart.update('none');
  }
}

function renderDonut(s) {
  const rows = s.byCategory;
  const total = rows.reduce((a, r) => a + r.total, 0);
  $('#donutTotal').textContent = num(total);

  $('#legend').innerHTML = rows.length
    ? rows.map((r) => `<li><span class="dot" style="background:${CATEGORIES[r.category].color}"></span>${esc(r.category)}<span class="amt">${num(r.total)} (${(r.total / total * 100).toFixed(1).replace('.', ',')}%)</span></li>`).join('')
    : '<li class="empty">Aucune dépense ce mois-ci.</li>';

  const data = rows.length ? rows.map((r) => r.total) : [1];
  const colors = rows.length ? rows.map((r) => CATEGORIES[r.category].color) : ['#d6deea'];
  const border = getComputedStyle(document.documentElement).getPropertyValue('--card').trim();

  if (!donutChart) {
    donutChart = new Chart($('#donut'), {
      type: 'doughnut',
      data: { labels: [], datasets: [{ data, backgroundColor: colors, borderColor: border, borderWidth: 3, hoverOffset: 4 }] },
      options: {
        cutout: '70%', responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => ` ${c.label} : ${fcfa(c.parsed)}` } } },
      },
    });
  }
  const ds = donutChart.data.datasets[0];
  donutChart.data.labels = rows.length ? rows.map((r) => r.category) : ['Aucune dépense'];
  ds.data = data; ds.backgroundColor = colors; ds.borderColor = border;
  donutChart.options.plugins.tooltip.enabled = rows.length > 0;
  donutChart.update();
}

/* ---------- Rendu : tableau ---------- */
function badge(cat) {
  const c = CATEGORIES[cat] || CATEGORIES.Autres;
  return `<span class="badge" style="background:${c.color}22;color:${c.color}"><span data-icon="${c.icon}"></span><span style="color:var(--text)">${esc(cat)}</span></span>`;
}

function renderRows(tbody, rows) {
  if (!rows.length) {
    tbody._rows = [];
    tbody.innerHTML = '<tr class="empty-row"><td colspan="5">Aucune dépense pour cette période. Ajoutez-en une avec le bouton +.</td></tr>';
    return;
  }
  tbody.innerHTML = rows.map((r) => `
    <tr>
      <td>${dateLabel(r.date)}</td>
      <td>${badge(r.category)}</td>
      <td class="num">${fcfa(r.amount)}</td>
      <td class="note">${esc(r.note)}</td>
      <td><div class="row-actions">
        <button class="act edit" data-edit="${r.id}" aria-label="Modifier" data-icon="edit"></button>
        <button class="act del" data-del="${r.id}" aria-label="Supprimer" data-icon="trash"></button>
      </div></td>
    </tr>`).join('');
  tbody._rows = rows;
  paintIcons(tbody);
}

/* ---------- Rendu : catégories ---------- */
function renderCategories(s) {
  const map = Object.fromEntries(s.byCategory.map((r) => [r.category, r.total]));
  const total = s.byCategory.reduce((a, r) => a + r.total, 0);
  $('#catGrid').innerHTML = CAT_NAMES.map((name) => {
    const c = CATEGORIES[name], v = map[name] || 0, p = total ? v / total * 100 : 0;
    return `<article class="card cat-card">
      <div class="top"><span class="cat-ico" style="background:${c.color}22;color:${c.color}" data-icon="${c.icon}"></span>${name}</div>
      <div class="amount">${fcfa(v)}</div>
      <div class="bar-track"><div class="bar-fill" style="width:${p}%;background:${c.color}"></div></div>
      <div class="sub">${p.toFixed(1).replace('.', ',')}% des dépenses de ${monthLabel(state.month)}</div>
    </article>`;
  }).join('');
  paintIcons($('#catGrid'));
}

/* ---------- Rendu : statistiques ---------- */
async function renderStats() {
  const data = await api('/api/monthly?months=6&month=' + state.month);
  const css = getComputedStyle(document.documentElement);
  const grid = css.getPropertyValue('--border').trim();
  const text = css.getPropertyValue('--muted').trim();

  if (barChart) barChart.destroy();
  barChart = new Chart($('#bars'), {
    type: 'bar',
    data: {
      labels: data.map((d) => shortMonth(d.month)),
      datasets: [{ data: data.map((d) => d.total), backgroundColor: data.map((d) => (d.month === state.month ? '#2f6bff' : '#2f6bff66')), borderRadius: 8, maxBarThickness: 56 }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => ' ' + fcfa(c.parsed.y) } } },
      scales: {
        x: { grid: { display: false }, ticks: { color: text } },
        y: { beginAtZero: true, grid: { color: grid }, border: { display: false }, ticks: { color: text, callback: (v) => num(v) } },
      },
    },
  });
}

/* ---------- Modale ---------- */
const modal = $('#modal');

function openModal(exp) {
  state.editingId = exp ? exp.id : null;
  $('#modalTitle').textContent = exp ? 'Modifier la dépense' : 'Ajouter une dépense';
  $('#category').innerHTML = CAT_NAMES.map((c) => `<option>${c}</option>`).join('');
  $('#amount').value = exp ? exp.amount : '';
  $('#category').value = exp ? exp.category : state.category || CAT_NAMES[0];
  $('#date').value = exp ? exp.date : (monthOf(todayISO()) === state.month ? todayISO() : state.month + '-01');
  $('#note').value = exp ? exp.note : '';
  $('#formError').hidden = true;
  closeMenu();
  modal.showModal();
  $('#amount').focus();
}
const closeModal = () => modal.close();

$('#closeModal').addEventListener('click', closeModal);
$('#cancelModal').addEventListener('click', closeModal);
modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); }); // clic sur le fond

$('#expenseForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = {
    amount: Number($('#amount').value),
    category: $('#category').value,
    date: $('#date').value,
    note: $('#note').value,
  };
  const err = $('#formError');
  if (!Number.isInteger(body.amount) || body.amount <= 0) { err.textContent = 'Saisissez un montant entier supérieur à 0.'; err.hidden = false; return $('#amount').focus(); }
  if (!body.date) { err.textContent = 'Choisissez une date.'; err.hidden = false; return; }

  try {
    const editing = state.editingId;
    await api(editing ? `/api/expenses/${editing}` : '/api/expenses', { method: editing ? 'PUT' : 'POST', body });
    closeModal();
    // Affiche le mois de la dépense enregistrée pour que l'utilisateur la voie tout de suite
    state.month = monthOf(body.date);
    if (state.category && state.category !== body.category) state.category = '';
    toast(editing ? 'Dépense modifiée' : 'Dépense enregistrée');
    refresh();
  } catch (ex) {
    err.textContent = ex.message; err.hidden = false;
  }
});

/* ---------- Événements globaux ---------- */
document.addEventListener('click', async (e) => {
  const add = e.target.closest('[data-action="add"]');
  if (add) return openModal();

  const edit = e.target.closest('[data-edit]');
  if (edit) {
    const rows = edit.closest('tbody')._rows || [];
    const exp = rows.find((r) => r.id === Number(edit.dataset.edit));
    if (exp) openModal(exp);
    return;
  }

  const del = e.target.closest('[data-del]');
  if (del) {
    if (!confirm('Supprimer cette dépense ?')) return;
    try {
      await api('/api/expenses/' + del.dataset.del, { method: 'DELETE' });
      toast('Dépense supprimée');
      refresh();
    } catch (ex) { toast(ex.message); }
  }
});

$('#monthInput').addEventListener('change', (e) => { if (e.target.value) { state.month = e.target.value; refresh(); } });
$('#applyFilters').addEventListener('click', () => { state.category = $('#fCategory').value; state.month = $('#fMonth').value; refresh(); });
$('#themeToggle').addEventListener('change', (e) => setTheme(e.target.checked ? 'dark' : 'light'));
$('#themeBtn').addEventListener('click', () => setTheme(isDark() ? 'light' : 'dark'));
$('#menuBtn').addEventListener('click', openMenu);
$('#scrim').addEventListener('click', closeMenu);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

/* ---------- Démarrage ---------- */
$('#year').textContent = new Date().getFullYear();
paintIcons();
setTheme(document.documentElement.getAttribute('data-theme'));
showView(location.hash.slice(1) || 'dashboard');
