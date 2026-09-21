// Données de démonstration : node seed.js
const db = require('./db');
const now = new Date();
const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
const pym = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;

const data = [
  [25000, 'Alimentation', `${ym}-15`, 'Courses du week-end'],
  [15000, 'Transport', `${ym}-14`, 'Taxi'],
  [20000, 'Loisirs', `${ym}-12`, 'Cinéma'],
  [60000, 'Logement', `${ym}-10`, 'Loyer'],
  [15000, 'Alimentation', `${ym}-08`, 'Marché'],
  [30000, 'Transport', `${ym}-05`, 'Abonnement bus'],
  [5000, 'Loisirs', `${ym}-03`, 'Café entre amis'],
  [15000, 'Autres', `${ym}-02`, 'Recharge et internet'],
  [55000, 'Logement', `${pym}-10`, 'Loyer'],
  [32000, 'Alimentation', `${pym}-18`, 'Courses'],
  [18000, 'Transport', `${pym}-09`, 'Carburant'],
  [12000, 'Loisirs', `${pym}-21`, 'Sortie'],
];

db.exec('DELETE FROM expenses');
const ins = db.prepare('INSERT INTO expenses (amount, category, date, note) VALUES (?,?,?,?)');
db.transaction(() => data.forEach((r) => ins.run(...r)))();
console.log(`${data.length} dépenses insérées.`);
