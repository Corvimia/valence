// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { contextBridge, ipcRenderer } = require("electron");

// As an example, here we use the exposeInMainWorld API to expose the browsers
// and node versions to the main window.
// They'll be accessible at "window.versions".
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("sql", {
    send: query => {
      ipcRenderer.send("sql", query);
    },
    receive: func => {
      // TODO: handle concurrentize communication with an array that tracks all of the callbacks for all "current" queries
      ipcRenderer.on("sql", (event, ...args) => func(...args));
    }
  });
});
