// database.js
import * as SQLite from 'expo-sqlite';

let db;

export const initDB = async () => {
  db = await SQLite.openDatabaseAsync('people.db');

  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS people (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      blood_group TEXT NOT NULL,
      gender TEXT NOT NULL
    );`
  );

  return db;
};

export const insertPerson = async (name, age, bloodGroup, gender) => {
  if (!db) db = await openDatabaseAsync('people.db');
  await db.runAsync(
    'INSERT INTO people (name, age, blood_group, gender) VALUES (?, ?, ?, ?);',
    name,
    age,
    bloodGroup,
    gender
  );
};

export const fetchPeople = async () => {
  if (!db) db = await openDatabaseAsync('people.db');
  const result = await db.getAllAsync('SELECT * FROM people;');
  return result;
};

export const clearPeople = async () => {
  if (!db) db = await openDatabaseAsync('people.db');
  await db.runAsync('DELETE FROM people;');
};

