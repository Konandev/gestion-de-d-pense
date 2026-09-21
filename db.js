const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'budget.db'));
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    amount     INTEGER NOT NULL CHECK (amount > 0),
    category   TEXT    NOT NULL,
    date       TEXT    NOT NULL,          -- YYYY-MM-DD
    note       TEXT    NOT NULL DEFAULT '',
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );
  CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
`);

module.exports = db;
