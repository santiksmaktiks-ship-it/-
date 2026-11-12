const { randomUUID } = require('node:crypto');

const LOADERS = Object.freeze(['vanilla', 'fabric', 'forge', 'neoforge', 'quilt']);

function normalizeProfileInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    throw new TypeError('Некорректные данные профиля.');
  }
  const name = typeof input.name === 'string' ? input.name.trim() : '';
  const loader = input.loader;
  const gameVersion = typeof input.gameVersion === 'string' ? input.gameVersion.trim() : '';

  if (name.length < 1 || name.length > 32 || /[\u0000-\u001f\u007f]/.test(name)) {
    throw new TypeError('Название должно содержать от 1 до 32 печатных символов.');
  }
  if (!LOADERS.includes(loader)) throw new TypeError('Выбран неизвестный загрузчик.');
  if (gameVersion.length < 1 || gameVersion.length > 32 || /[\u0000-\u001f\u007f]/.test(gameVersion)) {
    throw new TypeError('Версия Minecraft должна содержать от 1 до 32 печатных символов.');
  }
  return { name, loader, gameVersion };
}

function createProfileRecord(input, options = {}) {
  return {
    id: options.id || randomUUID(),
    ...normalizeProfileInput(input),
    createdAt: options.createdAt || new Date().toISOString(),
  };
}

function activateProfile(state, id) {
  if (!state.profiles.some((profile) => profile.id === id)) throw new TypeError('Профиль не найден.');
  return { ...state, activeProfileId: id };
}

function removeProfile(state, id) {
  const profiles = state.profiles.filter((profile) => profile.id !== id);
  if (profiles.length === state.profiles.length) throw new TypeError('Профиль не найден.');
  const activeProfileId = state.activeProfileId === id ? (profiles[0]?.id ?? null) : state.activeProfileId;
  return { ...state, profiles, activeProfileId };
}

module.exports = { LOADERS, normalizeProfileInput, createProfileRecord, activateProfile, removeProfile };
