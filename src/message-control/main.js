const { ipcMain } = require("electron");

ipcMain.on("sql", (event, query) => {
  setTimeout(() => {
    event.reply('sql', `Query was ${query}`);
  }, 1000);
})
