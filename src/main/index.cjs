const { app, BrowserWindow, Menu, ipcMain, shell, session } = require('electron');
const { z } = require('zod');
const { randomUUID } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { promises: fsp } = require('node:fs');
const { pathToFileURL } = require('node:url');
const { createProfileRecord, activateProfile, removeProfile } = require('../shared/profile-model.cjs');

const STORE_VERSION = 1;
const OFFICIAL_DOWNLOAD_URL = 'https://www.minecraft.net/en-us/download.jsp';
const PROFILE_SCHEMA = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(32),
  loader: z.enum(['vanilla', 'fabric', 'forge', 'neoforge', 'quilt']),
  gameVersion: z.string().min(1).max(32),
  createdAt: z.string().datetime(),
});
const SETTINGS_SCHEMA = z.object({ theme: z.enum(['dark', 'light']), reduceMotion: z.boolean() });
const STORE_SCHEMA = z.object({
  version: z.literal(STORE_VERSION),
  activeProfileId: z.string().uuid().nullable(),
  profiles: z.array(PROFILE_SCHEMA),
  settings: SETTINGS_SCHEMA,
}).superRefine((store, context) => {
  if (store.activeProfileId && !store.profiles.some((p) => p.id === store.activeProfileId)) {
    context.addIssue({ code: 'custom', message: 'Активный профиль отсутствует в списке.' });
  }
  const ids = new Set();
  for (const profile of store.profiles) {
    if (ids.has(profile.id)) {
      context.addIssue({ code: 'custom', message: 'Обнаружен повторяющийся ID профиля.' });
      break;
    }
    ids.add(profile.id);
  }
});
const EMPTY_INPUT = z.object({}).strict();
const CREATE_PROFILE_INPUT = z.object({
  name: z.string().trim().min(1).max(32),
  loader: z.enum(['vanilla', 'fabric', 'forge', 'neoforge', 'quilt']),
  gameVersion: z.string().trim().min(1).max(32),
}).strict();
const PROFILE_ID_INPUT = z.object({ id: z.string().uuid() }).strict();
const SETTINGS_INPUT = z.object({
  theme: z.enum(['dark', 'light']).optional(),
  reduceMotion: z.boolean().optional(),
}).strict().refine((v) => Object.keys(v).length > 0, 'Настройки не изменены.');

let mainWindow = null;
let mutationQueue = Promise.resolve();
const isDev = !app.isPackaged;

function getStorePath() {
  return path.join(app.getPath('userData'), 'niva-state.json');
}

function getDefaultStore() {
  return { version: STORE_VERSION, activeProfileId: null, profiles: [], settings: { theme: 'dark', reduceMotion: false } };
}

async function writeStore(value) {
  const parsed = STORE_SCHEMA.safeParse(value);
  if (!parsed.success) throw new Error('Внутренняя проверка локальных данных не пройдена.');
  const storePath = getStorePath();
  await fsp.mkdir(path.dirname(storePath), { recursive: true });
  const tempPath = `${storePath}.${randomUUID()}.tmp`;
  try {
    await fsp.writeFile(tempPath, `${JSON.stringify(parsed.data, null, 2)}\n`, { encoding: 'utf8', mode: 0o600, flag: 'wx' });
    await fsp.rename(tempPath, storePath);
  } catch (error) {
    await fsp.rm(tempPath, { force: true }).catch(() => {});
    throw error;
  }
}

async function readStore() {
  const storePath = getStorePath();
  try {
    const raw = await fsp.readFile(storePath, 'utf8');
    const parsed = STORE_SCHEMA.safeParse(JSON.parse(raw));
    if (!parsed.success) throw new Error('Локальные данные NIVA повреждены или имеют неизвестный формат. Исходный файл сохранён без изменений.');
    return parsed.data;
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      const initial = getDefaultStore();
      await writeStore(initial);
      return initial;
    }
    throw error;
  }
}

function transact(mutator) {
  const operation = mutationQueue.then(async () => {
    const current = await readStore();
    const next = await mutator(current);
    await writeStore(next);
    return next;
  });
  mutationQueue = operation.catch(() => {});
  return operation;
}

function registerHandler(channel, schema, handler) {
  ipcMain.handle(channel, async (event, rawInput = {}) => {
    if (!mainWindow || event.sender !== mainWindow.webContents || event.senderFrame !== event.sender.mainFrame) {
      return { ok: false, error: { code: 'FORBIDDEN', message: 'Недопустимый источник IPC-запроса.' } };
    }
    const parsed = schema.safeParse(rawInput);
    if (!parsed.success) return { ok: false, error: { code: 'INVALID_INPUT', message: 'Проверьте введённые данные.' } };
    try {
      return { ok: true, data: await handler(parsed.data) };
    } catch (error) {
      console.error(`[NIVA] ${channel}:`, error instanceof Error ? error.message : 'Unknown error');
      return { ok: false, error: { code: 'OPERATION_FAILED', message: error instanceof Error ? error.message : 'Операция не выполнена.' } };
    }
  });
}

function registerIpc() {
  registerHandler('app:info', EMPTY_INPUT, async () => ({
    version: app.getVersion(), platform: process.platform, userDataPath: app.getPath('userData'), packaged: app.isPackaged,
  }));
  registerHandler('profiles:list', EMPTY_INPUT, async () => {
    const store = await readStore();
    return { profiles: store.profiles, activeProfileId: store.activeProfileId };
  });
  registerHandler('profiles:create', CREATE_PROFILE_INPUT, async (input) => {
    const profile = createProfileRecord(input);
    await transact((store) => ({
      ...store,
      profiles: [...store.profiles, profile],
      activeProfileId: store.activeProfileId || profile.id,
    }));
    return profile;
  });
  registerHandler('profiles:activate', PROFILE_ID_INPUT, async ({ id }) => {
    await transact((store) => activateProfile(store, id));
    return { activeProfileId: id };
  });
  registerHandler('profiles:delete', PROFILE_ID_INPUT, async ({ id }) => {
    await transact((store) => removeProfile(store, id));
    return { deleted: true };
  });
  registerHandler('settings:get', EMPTY_INPUT, async () => (await readStore()).settings);
  registerHandler('settings:update', SETTINGS_INPUT, async (patch) => {
    const next = await transact((store) => ({ ...store, settings: { ...store.settings, ...patch } }));
    return next.settings;
  });
  registerHandler('app:open-data-folder', EMPTY_INPUT, async () => {
    await fsp.mkdir(app.getPath('userData'), { recursive: true });
    const error = await shell.openPath(app.getPath('userData'));
    if (error) throw new Error(`Не удалось открыть папку данных: ${error}`);
    return { opened: true };
  });
  registerHandler('launcher:open-official', EMPTY_INPUT, async () => {
    if (process.platform === 'win32') {
      const candidates = [
        path.join(process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)', 'Minecraft Launcher', 'MinecraftLauncher.exe'),
        path.join(process.env.ProgramFiles || 'C:\\Program Files', 'Minecraft Launcher', 'MinecraftLauncher.exe'),
        path.join(process.env.LOCALAPPDATA || '', 'Programs', 'Minecraft Launcher', 'MinecraftLauncher.exe'),
      ];
      const found = candidates.find((candidate) => candidate && fs.existsSync(candidate));
      if (found) {
        const error = await shell.openPath(found);
        if (!error) return { opened: true, destination: 'installed-launcher' };
      }
    }
    await shell.openExternal(OFFICIAL_DOWNLOAD_URL);
    return {
      opened: true,
      destination: 'official-download-page',
      message: 'Официальный лаунчер не найден по стандартному пути. Открыл страницу загрузки Minecraft.',
    };
  });
}

function applySecurityHeaders() {
  const devConnect = isDev ? " http://127.0.0.1:5173 ws://127.0.0.1:5173" : '';
  const policy = [
    "default-src 'self'", "script-src 'self'", "style-src 'self'", "img-src 'self' data:",
    `connect-src 'self'${devConnect}`, "font-src 'self' data:", "object-src 'none'",
    "base-uri 'self'", "form-action 'none'", "frame-ancestors 'none'",
  ].join('; ');
  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const responseHeaders = { ...details.responseHeaders };
    responseHeaders['Content-Security-Policy'] = [policy];
    callback({ responseHeaders });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1240, height: 800, minWidth: 980, minHeight: 680, show: false,
    backgroundColor: '#0b1224', autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.cjs'),
      contextIsolation: true, nodeIntegration: false, sandbox: true, webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });
  mainWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
  mainWindow.webContents.on('will-navigate', (event, targetUrl) => {
    const allowedDevUrl = isDev && targetUrl.startsWith('http://127.0.0.1:5173/');
    const rendererFileUrl = pathToFileURL(path.join(__dirname, '../../dist/index.html')).href;
    if (!allowedDevUrl && targetUrl !== rendererFileUrl) event.preventDefault();
  });
  mainWindow.webContents.on('will-attach-webview', (event) => event.preventDefault());
  mainWindow.once('ready-to-show', () => mainWindow && mainWindow.show());
  mainWindow.on('closed', () => { mainWindow = null; });
  if (isDev && process.env.NIVA_DEV_SERVER_URL) mainWindow.loadURL(process.env.NIVA_DEV_SERVER_URL);
  else mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
}

app.setAppUserModelId('com.niva.launcher');
app.whenReady().then(() => {
  Menu.setApplicationMenu(null);
  applySecurityHeaders();
  registerIpc();
  createWindow();
  app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
}).catch((error) => {
  console.error('[NIVA] Application startup failed:', error instanceof Error ? error.message : 'Unknown error');
  app.quit();
});
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
process.on('uncaughtException', (error) => console.error('[NIVA] Uncaught exception:', error.message));
process.on('unhandledRejection', (reason) => console.error('[NIVA] Unhandled rejection:', reason instanceof Error ? reason.message : 'Unknown rejection'));
