import * as sqlite3 from "sqlite3";

sqlite3.verbose();

const db = new sqlite3.Database("test.db", err => {

  if (err) {
    return console.error(err.message);
  }
  console.log("Successful connection to the database 'test.db'");
});

const createPlayersSql = `CREATE TABLE IF NOT EXISTS Players (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);`;

db.run(createPlayersSql, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful creation of the 'Players' table");
});

const createCharactersSql = `CREATE TABLE IF NOT EXISTS Characters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  playerId INTEGER
);`;

db.run(createCharactersSql, err => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful creation of the 'Characters' table");
});

function all<S>(query, args): Promise<S> {
  return new Promise((resolve, reject) => {
    db.all(query, args, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows as S);
    });
  });
}

async function run(query, args): Promise<void> {
  return new Promise((resolve, reject) => {
    db.all(query, args, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

export default {
  all,
  run
};
