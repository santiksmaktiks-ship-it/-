import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const electronCli = require.resolve('electron/cli.js');
const serverUrl = 'http://127.0.0.1:5173';
const vite = spawn(process.execPath, [require.resolve('vite/bin/vite.js'), '--host', '127.0.0.1', '--port', '5173', '--strictPort'], { stdio: 'inherit' });
let electron = null;
let stopping = false;
function stop(code = 0) {
  if (stopping) return;
  stopping = true;
  if (electron && !electron.killed) electron.kill();
  if (!vite.killed) vite.kill();
  process.exitCode = code;
}
process.on('SIGINT', () => stop(0));
process.on('SIGTERM', () => stop(0));
vite.on('exit', (code) => { if (!stopping && code !== 0) stop(code || 1); });
for (let attempt = 0; attempt < 90; attempt += 1) {
  if (vite.exitCode !== null) stop(vite.exitCode || 1);
  try { const response = await fetch(serverUrl); if (response.ok) break; } catch { /* Vite is starting. */ }
  if (attempt === 89) { console.error('Vite did not become ready within 45 seconds.'); stop(1); }
  await new Promise((resolve) => setTimeout(resolve, 500));
}
if (stopping) process.exit(process.exitCode || 1);
electron = spawn(process.execPath, [electronCli, '.'], { stdio: 'inherit', env: { ...process.env, NIVA_DEV_SERVER_URL: serverUrl } });
electron.on('exit', (code) => stop(code || 0));
