import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  getPort: () => ipcRenderer.invoke('get-port'),
  platform: process.platform,
});
