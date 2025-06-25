// localStore.js
// Dumbest workaround I've ever done
import * as SQLite from 'expo-sqlite';

let db;

export const initAppDB = async () => {
  db = await SQLite.openDatabaseAsync('app.db');

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS pairs (
      vkey TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );`
  );
  console.log("Created the table")

  return db;
};

export const saveValue = async (key, value) => {
  if (!db) db = await openDatabaseAsync('people.db');
  await db.runAsync(
      'INSERT INTO pairs (vkey, value) VALUES (?, ?) ON CONFLICT(vkey) DO UPDATE SET value = EXCLUDED.value',
      key,value
  );
  console.log("logged the values")

  const result = await db.getAllAsync('SELECT * FROM pairs WHERE vkey = ?', key)
  console.log(result)
}

export const getValue = async (key) => {
  if (!db) db = await openDatabaseAsync('people.db');
  const result = await db.getFirstAsync('SELECT * FROM pairs WHERE vkey = ?', key)
  console.log("ahdfadjh" + result.value)
  return result.value
    
}
