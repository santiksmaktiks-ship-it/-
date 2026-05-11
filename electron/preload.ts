import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("launcher", {
  play: () => ipcRenderer.invoke("launcher:play"),
  openFolder: () => ipcRenderer.invoke("launcher:open-folder"),
});
