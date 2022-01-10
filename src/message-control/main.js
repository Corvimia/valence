const { ipcMain } = require("electron");

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("./src/test.sqlite");

ipcMain.on("sql", (event, query) => {
  setTimeout(() => {
    db.all(query, [], (error, data) => {
      event.reply('sql', { error, data });
    })
  }, 1);
})
