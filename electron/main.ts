import { app, BrowserWindow, ipcMain, shell } from "electron";
import * as path from "path";

const isDev = !!process.env.VITE_DEV_SERVER_URL;

function createWindow(): void {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1100,
    minHeight: 680,
    backgroundColor: "#0c0f14",
    frame: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: "deny" };
  });
}

app.whenReady().then(() => {
  ipcMain.handle("launcher:play", () => {
    return { ok: true, message: "Запуск игры (заглушка UI)" };
  });

  ipcMain.handle("launcher:open-folder", () => {
    return { ok: true, message: "Открытие папки игры (заглушка UI)" };
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
