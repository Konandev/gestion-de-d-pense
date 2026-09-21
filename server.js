const express = require('express');
const path = require('path');
const ExcelJS = require('exceljs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

const CATEGORIES = ['Alimentation', 'Transport', 'Loisirs', 'Logement', 'Santé', 'Éducation', 'Autres'];

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- helpers ---------- */

const isMonth = (s) => /^\d{4}-(0[1-9]|1[0-2])$/.test(s || '');
const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s || '') && !Number.isNaN(Date.parse(s));

function prevMonth(month) {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 2, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

// Builds a WHERE clause from optional ?month= and ?category= filters.
function buildFilter(q) {
  const where = [];
  const params = [];
  if (isMonth(q.month)) {
    where.push("substr(date, 1, 7) = ?");
    params.push(q.month);
  }
  if (q.category && CATEGORIES.includes(q.category)) {
    where.push('category = ?');
    params.push(q.category);
  }
  return { sql: where.length ? 'WHERE ' + where.join(' AND ') : '', params };
}

function validate(body) {
  const amount = Number(body.amount);
  const category = String(body.category || '');
  const date = String(body.date || '');
  const note = String(body.note || '').trim().slice(0, 200);
  const errors = [];
  if (!Number.isInteger(amount) || amount <= 0) errors.push('Le montant doit être un entier positif.');
  if (!CATEGORIES.includes(category)) errors.push('Catégorie invalide.');
  if (!isDate(date)) errors.push('Date invalide.');
  return { errors, value: { amount, category, date, note } };
}

/* ---------- API ---------- */

app.get('/api/categories', (_req, res) => res.json(CATEGORIES));

app.get('/api/expenses', (req, res) => {
  const { sql, params } = buildFilter(req.query);
  const limit = Number.parseInt(req.query.limit, 10);
  const rows = db
    .prepare(`SELECT id, amount, category, date, note FROM expenses ${sql} ORDER BY date DESC, id DESC ${limit > 0 ? 'LIMIT ' + limit : ''}`)
    .all(...params);
  res.json(rows);
});

app.post('/api/expenses', (req, res) => {
  const { errors, value } = validate(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const info = db
    .prepare('INSERT INTO expenses (amount, category, date, note) VALUES (@amount, @category, @date, @note)')
    .run(value);
  res.status(201).json({ id: info.lastInsertRowid, ...value });
});

app.put('/api/expenses/:id', (req, res) => {
  const { errors, value } = validate(req.body);
  if (errors.length) return res.status(400).json({ errors });
  const info = db
    .prepare('UPDATE expenses SET amount=@amount, category=@category, date=@date, note=@note WHERE id=@id')
    .run({ ...value, id: req.params.id });
  if (!info.changes) return res.status(404).json({ errors: ['Dépense introuvable.'] });
  res.json({ id: Number(req.params.id), ...value });
});

app.delete('/api/expenses/:id', (req, res) => {
  const info = db.prepare('DELETE FROM expenses WHERE id = ?').run(req.params.id);
  if (!info.changes) return res.status(404).json({ errors: ['Dépense introuvable.'] });
  res.status(204).end();
});

// Résumé du dashboard : totaux, comparaison au mois précédent, répartition par catégorie
app.get('/api/summary', (req, res) => {
  const month = isMonth(req.query.month) ? req.query.month : currentMonth();
  const category = CATEGORIES.includes(req.query.category) ? req.query.category : null;

  const catClause = category ? 'AND category = ?' : '';
  const monthParams = (m) => (category ? [m, category] : [m]);

  const agg = (m) =>
    db
      .prepare(`SELECT COALESCE(SUM(amount),0) AS total, COUNT(*) AS count, COALESCE(MAX(amount),0) AS max
                FROM expenses WHERE substr(date,1,7) = ? ${catClause}`)
      .get(...monthParams(m));

  const cur = agg(month);
  const prev = agg(prevMonth(month));

  const biggest = cur.count
    ? db
        .prepare(`SELECT category FROM expenses WHERE substr(date,1,7) = ? ${catClause} ORDER BY amount DESC, id DESC LIMIT 1`)
        .get(...monthParams(month))
    : null;

  // La répartition par catégorie ignore le filtre catégorie (sinon un seul secteur)
  const byCategory = db
    .prepare(`SELECT category, SUM(amount) AS total FROM expenses WHERE substr(date,1,7) = ? GROUP BY category ORDER BY total DESC`)
    .all(month);

  const pct = (a, b) => (b > 0 ? Math.round(((a - b) / b) * 1000) / 10 : null);

  res.json({
    month,
    total: cur.total,
    count: cur.count,
    average: cur.count ? Math.round(cur.total / cur.count) : 0,
    max: cur.max,
    maxCategory: biggest ? biggest.category : null,
    prev: { total: prev.total, count: prev.count, average: prev.count ? Math.round(prev.total / prev.count) : 0 },
    delta: {
      total: pct(cur.total, prev.total),
      count: cur.count - prev.count,
      average: pct(cur.count ? cur.total / cur.count : 0, prev.count ? prev.total / prev.count : 0),
    },
    byCategory,
  });
});

// Évolution sur les N derniers mois (page Statistiques)
app.get('/api/monthly', (req, res) => {
  const months = Math.min(Math.max(Number.parseInt(req.query.months, 10) || 6, 1), 24);
  const end = isMonth(req.query.month) ? req.query.month : currentMonth();
  const list = [end];
  while (list.length < months) list.unshift(prevMonth(list[0]));
  const stmt = db.prepare('SELECT COALESCE(SUM(amount),0) AS total FROM expenses WHERE substr(date,1,7) = ?');
  res.json(list.map((m) => ({ month: m, total: stmt.get(m).total })));
});

/* ---------- Exports ---------- */

function exportRows(query) {
  const { sql, params } = buildFilter(query);
  return db.prepare(`SELECT date, category, amount, note FROM expenses ${sql} ORDER BY date DESC, id DESC`).all(...params);
}

const exportName = (q, ext) => `depenses-${isMonth(q.month) ? q.month : 'toutes'}.${ext}`;

app.get('/api/export/excel', async (req, res) => {
  const rows = exportRows(req.query);
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Mon Budget';
  const ws = wb.addWorksheet('Dépenses', { views: [{ state: 'frozen', ySplit: 1 }] });

  ws.columns = [
    { header: 'Date', key: 'date', width: 14 },
    { header: 'Catégorie', key: 'category', width: 18 },
    { header: 'Montant (FCFA)', key: 'amount', width: 18, style: { numFmt: '#,##0' } },
    { header: 'Note', key: 'note', width: 40 },
  ];
  rows.forEach((r) => ws.addRow({ ...r, date: new Date(r.date + 'T00:00:00Z') }));
  ws.getColumn('date').numFmt = 'dd/mm/yyyy';

  const head = ws.getRow(1);
  head.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  head.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F2A44' } };
  head.alignment = { vertical: 'middle' };
  head.height = 22;

  const totalRow = ws.addRow({ date: 'Total', amount: { formula: `SUM(C2:C${rows.length + 1})` } });
  totalRow.font = { bold: true };
  totalRow.getCell('amount').numFmt = '#,##0';
  ws.autoFilter = { from: 'A1', to: 'D1' };

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${exportName(req.query, 'xlsx')}"`);
  await wb.xlsx.write(res);
  res.end();
});

app.get('/api/export/csv', (req, res) => {
  const rows = exportRows(req.query);
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = ['Date;Catégorie;Montant (FCFA);Note', ...rows.map((r) => [r.date, esc(r.category), r.amount, esc(r.note)].join(';'))];
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="${exportName(req.query, 'csv')}"`);
  res.send('\uFEFF' + lines.join('\r\n')); // BOM pour qu'Excel lise bien les accents
});

app.listen(PORT, () => console.log(`Mon Budget → http://localhost:${PORT}`));
