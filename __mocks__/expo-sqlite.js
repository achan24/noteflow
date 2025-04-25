// Enhanced expo-sqlite mock for multi-table support and better error/edge handling
const dbState = {};

function getTable(table) {
  if (!dbState[table]) dbState[table] = [];
  return dbState[table];
}

const REQUIRED_FIELDS = {
  videos: ['id', 'url', 'title', 'tags', 'slices'],
  music_tracks: ['id', 'url', 'title', 'duration', 'tags'],
};

const mockTransaction = jest.fn((cb) => cb({
  executeSql: function () {
    // Support variable arguments: (sql, params, success, error)
    const args = Array.from(arguments);
    const sql = args[0];
    const params = args[1] || [];
    const success = args[2];
    const error = args[3];
    try {
      // Handle DROP TABLE
      if (/DROP TABLE IF EXISTS (\w+)/i.test(sql)) {
        const [, table] = sql.match(/DROP TABLE IF EXISTS (\w+)/i);
        dbState[table] = [];
        success && success(null, { rowsAffected: 0 });
        return;
      }
      // Handle CREATE TABLE
      if (/CREATE TABLE IF NOT EXISTS (\w+)/i.test(sql)) {
        success && success(null, { rowsAffected: 0 });
        return;
      }
      // INSERT
      if (/INSERT INTO (\w+)/i.test(sql)) {
        const [, table] = sql.match(/INSERT INTO (\w+)/i);
        const tableArr = getTable(table);
        // Get columns from SQL
        const colsMatch = sql.match(/\(([^)]+)\)/);
        const cols = colsMatch ? colsMatch[1].split(',').map(c => c.trim()) : [];
        const row = {};
        for (let i = 0; i < cols.length; i++) {
          let val = params[i];
          // Try to parse JSON fields
          if (['tags', 'slices'].includes(cols[i])) {
            try { val = val !== undefined ? JSON.parse(val) : []; } catch { val = []; }
          }
          row[cols[i]] = val;
        }
        // Simulate required fields
        const required = REQUIRED_FIELDS[table] || [];
        const missing = required.find((field) => row[field] === undefined);
        if (missing) {
          if (typeof error === 'function') {
            console.log(`[expo-sqlite mock] Error callback called for missing field: ${missing}`);
            error({ message: `Missing required field: ${missing}` });
          }
          return;
        }
        // Simulate primary key constraint on 'id'
        if (row.id && tableArr.some(r => r.id === row.id)) {
          success && success(null, { rowsAffected: 0 });
          return;
        }
        tableArr.push(row);
        success && success(null, { rowsAffected: 1 });
        return;
      }
      // SELECT by id
      if (/SELECT \* FROM (\w+) WHERE id = \?/i.test(sql)) {
        const [, table] = sql.match(/SELECT \* FROM (\w+) WHERE id = \?/i);
        const tableArr = getTable(table);
        const row = tableArr.find((v) => v.id === params[0]);
        const rows = row ? [row] : [];
        success && success(null, { rows: { length: rows.length, _array: rows } });
        return;
      }
      // SELECT all
      if (/SELECT \* FROM (\w+)/i.test(sql)) {
        const [, table] = sql.match(/SELECT \* FROM (\w+)/i);
        const tableArr = getTable(table);
        success && success(null, { rows: { length: tableArr.length, _array: tableArr } });
        return;
      }
      // UPDATE title
      if (/UPDATE (\w+) SET title = \? WHERE id = \?/i.test(sql)) {
        const [, table] = sql.match(/UPDATE (\w+) SET title = \? WHERE id = \?/i);
        const tableArr = getTable(table);
        const idx = tableArr.findIndex((v) => v.id === params[1]);
        if (idx >= 0) tableArr[idx].title = params[0];
        success && success(null, { rowsAffected: idx >= 0 ? 1 : 0 });
        return;
      }
      // DELETE by id
      if (/DELETE FROM (\w+) WHERE id = \?/i.test(sql)) {
        const [, table] = sql.match(/DELETE FROM (\w+) WHERE id = \?/i);
        const tableArr = getTable(table);
        const before = tableArr.length;
        dbState[table] = tableArr.filter((v) => v.id !== params[0]);
        const after = dbState[table].length;
        success && success(null, { rowsAffected: before - after });
        return;
      }
      // Simulate SQL errors
      if (/ERROR SQL/i.test(sql)) {
        if (typeof error === 'function') {
          console.log('[expo-sqlite mock] Error callback called for simulated SQL error');
          error({ message: 'Simulated SQL error' });
        }
        return;
      }
      // Default: return empty result
      success && success(null, { rows: { length: 0, _array: [] } });
    } catch (err) {
      if (typeof arguments[3] === 'function') arguments[3](err);
    }
  }
}));

module.exports = {
  openDatabase: jest.fn(() => ({
    transaction: mockTransaction,
    close: jest.fn(),
  })),
};
