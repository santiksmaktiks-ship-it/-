const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeProfileInput, createProfileRecord, activateProfile, removeProfile } = require('../src/shared/profile-model.cjs');
const sample = { name: '  Survival  ', loader: 'fabric', gameVersion: '1.21.10' };

test('normalizes a valid profile', () => {
  assert.deepEqual(normalizeProfileInput(sample), { name: 'Survival', loader: 'fabric', gameVersion: '1.21.10' });
});
test('rejects empty and control-character names', () => {
  assert.throws(() => normalizeProfileInput({ ...sample, name: '   ' }), /Название/);
  assert.throws(() => normalizeProfileInput({ ...sample, name: 'Bad\nName' }), /Название/);
});
test('rejects unknown loaders and oversized versions', () => {
  assert.throws(() => normalizeProfileInput({ ...sample, loader: 'offline' }), /загрузчик/);
  assert.throws(() => normalizeProfileInput({ ...sample, gameVersion: 'x'.repeat(33) }), /Версия/);
});
test('creates a profile with supplied test identity', () => {
  const profile = createProfileRecord(sample, { id: 'profile-1', createdAt: '2026-11-12T00:00:00.000Z' });
  assert.equal(profile.id, 'profile-1');
  assert.equal(profile.name, 'Survival');
  assert.equal(profile.loader, 'fabric');
});
test('activates only an existing profile', () => {
  const state = { activeProfileId: null, profiles: [{ id: 'a' }] };
  assert.equal(activateProfile(state, 'a').activeProfileId, 'a');
  assert.throws(() => activateProfile(state, 'missing'), /не найден/);
});
test('deleting active profile selects next profile and never touches game files', () => {
  const state = { activeProfileId: 'a', profiles: [{ id: 'a' }, { id: 'b' }] };
  const next = removeProfile(state, 'a');
  assert.deepEqual(next.profiles, [{ id: 'b' }]);
  assert.equal(next.activeProfileId, 'b');
  assert.throws(() => removeProfile(next, 'missing'), /не найден/);
});
