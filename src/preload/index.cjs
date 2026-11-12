const { contextBridge, ipcRenderer } = require('electron');

async function invoke(channel, payload = {}) {
  const response = await ipcRenderer.invoke(channel, payload);
  if (!response || response.ok !== true) throw new Error(response?.error?.message || 'Не удалось выполнить операцию.');
  return response.data;
}

contextBridge.exposeInMainWorld('niva', Object.freeze({
  getInfo: () => invoke('app:info'),
  listProfiles: () => invoke('profiles:list'),
  createProfile: (input) => invoke('profiles:create', input),
  activateProfile: (id) => invoke('profiles:activate', { id }),
  deleteProfile: (id) => invoke('profiles:delete', { id }),
  getSettings: () => invoke('settings:get'),
  updateSettings: (patch) => invoke('settings:update', patch),
  openDataFolder: () => invoke('app:open-data-folder'),
  openOfficialLauncher: () => invoke('launcher:open-official'),
}));
