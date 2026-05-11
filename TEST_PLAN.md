# Test Plan — Minecraft Launcher UI (PR #1)

## What changed
Brand-new Electron + React + Vite + Tailwind UI for a Minecraft launcher, designed to match a user-supplied screenshot. Renderer is in `src/`, Electron main/preload in `electron/`.

**Latest update:** the version row in the `Быстрый запуск` card now reads `Версия` (was `Последняя версия`) and clicking it opens a dropdown listbox with versions from `1.21.5` down to `1.7.10`.

## Primary flow
Launch the production-built Electron app (`npm run build && electron .`) and verify the rendered window matches the reference screenshot **structurally and textually**, and that the `Играть` / `Запустить игру` / `Папка с игрой` buttons fire the IPC stubs without crashing.

## Adversarial assertions
Each assertion is chosen so a broken implementation (missing component, wrong text, IPC unwired) would fail visibly.

1. **App boots and renders**
   - **Action:** Run `electron .` from `/home/ubuntu/repos/minecraft-launcher` after `npm run build`.
   - **Pass:** A window titled "Minecraft Launcher" opens with dark background; no "white screen" / blank renderer.
   - **Fail signal if broken:** white/empty window, missing preload error in stderr, renderer fails to load.

2. **Top bar present with exact labels**
   - **Pass:** Top bar shows in this order: logo `N` tile (left), 5 nav tabs reading exactly `Главная`, `Новости`, `Настройки`, `Моды`, `Профиль`, with `Главная` visually highlighted (blue pill). Three colored dots (red/yellow/green) on the right.
   - **Fail signal if broken:** any of those Cyrillic labels missing or wrong, no active highlight, no dots.

3. **Left panel — profile + actions**
   - **Pass:** Grass-block icon at top; rows `Игрок · Онлайн` (with green dot), `Установки`, `Моды`; big blue `Играть` button; bottom row of 3 social tiles labeled `Discord`, `VK`, `YouTube`.
   - **Fail signal if broken:** any of these missing, wrong order, no green dot on "Онлайн".

4. **Center — news hero + quick launch**
   - **Pass:** News card shows the badge `новость`, title `Обновление лаунчера`, body containing both `Мы улучшили производительность` and `и добавили новые функции`, a `Подробнее` button, and 3 dot indicators (1st active). Below: `Быстрый запуск` header with rocket icon, row `Версия / 1.20.4` with grass-block icon (label MUST read `Версия`, NOT `Последняя версия`), and exactly two action buttons: `Запустить игру` (primary, wider, blue) and `Папка с игрой` (secondary, with folder icon).
   - **Fail signal if broken:** wrong label (`Последняя версия`), missing default version `1.20.4`, only one action button, missing pagination dots.

4b. **Version dropdown — open / list / select / close**
   - **Action:** Click the version row (the one labeled `Версия`).
   - **Pass:** A popover opens directly beneath the row containing a scrollable list with `1.21.5` at the top and `1.7.10` at the bottom. The currently selected version (`1.20.4`) is highlighted with a check icon. Clicking another version (e.g. `1.7.10`) updates the subtitle text under `Версия` to the chosen version and closes the popover. Clicking outside closes the popover without changing selection.
   - **Fail signal if broken:** dropdown does not open, list does not contain `1.21.5` and `1.7.10`, selection does not update the subtitle, popover stays open after selection or outside click.

5. **Right panel — online status + useful**
   - **Pass:** Card `Онлайн статус` with blue indicator dot, big number `2537`, subtitle `игроков онлайн`, and a `Серверы` button with chevron. Below: header `Полезное` with 3 rows: `Инструкции` (book icon), `Поддержка` (help icon), `Наш сайт` (globe icon).
   - **Fail signal if broken:** wrong number, missing label "игроков онлайн", missing/extra rows in "Полезное".

6. **IPC stubs wired**
   - **Action:** Click `Играть` (left panel) and `Запустить игру` (center) and `Папка с игрой`.
   - **Pass:** No uncaught exception in main or renderer console (devtools); the `ipcMain.handle` returns the stub `{ ok: true, message: ... }` (verified by printing the resolved promise from devtools console or by absence of "Error: No handler registered" in main log).
   - **Fail signal if broken:** "Uncaught (in promise) Error: No handler registered for 'launcher:play'" or app crash.

7. **No console errors / unhandled rejections**
   - **Pass:** Renderer DevTools console is free of red errors after initial paint. Main process stderr is clean.
   - **Fail signal if broken:** any red error / warnings about missing modules, failed preload, CSP violations, missing icons.

## Out of scope (explicitly not testing)
- Actual `.exe` build via `electron-builder --win nsis` from this Linux VM (cross-compile to Windows requires wine; user is expected to package on Windows). The build pipeline is verified by `npm run build` succeeding.
- Real Minecraft launching logic — the IPC handlers are intentional stubs in this PR.

## Recording
A continuous Electron-window recording covering points 1–7 above, with `annotate_recording` markers per assertion.
