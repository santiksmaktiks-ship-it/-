# Minecraft Launcher UI

UI лаунчера Minecraft, собранный на Electron + React + Vite + Tailwind CSS. Дизайн воссоздан по референсу из issue/скриншота (тёмная тема, левая панель с профилем, новости в центре, правая панель со статусом онлайн).

> Это UI-шаблон. Реальные действия "Играть" / "Папка с игрой" пока подключены как заглушки в `electron/main.ts` (IPC `launcher:play`, `launcher:open-folder`).

## Скриншот

Сборка интерфейса соответствует приложенному в задаче макету.

## Стек

- **Electron 33** — desktop runtime
- **React 18 + TypeScript** — UI
- **Vite 5** — dev server / bundling renderer
- **Tailwind CSS 3** — стили
- **lucide-react** — иконки
- **electron-builder** — упаковка в `.exe` (NSIS)

## Структура

```
electron/         # Electron main + preload (TypeScript -> dist-electron/)
src/              # React renderer
  components/     # TopBar, LeftPanel, CenterPanel, RightPanel, GrassBlock
  App.tsx, main.tsx, index.css
dist/             # Билд renderer (generated)
dist-electron/    # Билд main+preload (generated)
release/          # Собранные .exe / артефакты electron-builder
```

## Установка зависимостей

```bash
npm install
```

## Запуск в dev-режиме

```bash
npm run electron:dev
```

Откроется Electron-окно, привязанное к Vite dev-серверу на `http://localhost:5173` (горячая перезагрузка).

## Production сборка

```bash
npm run build      # собирает renderer + electron main
npm start          # запускает собранный билд через electron .
```

## Сборка `.exe` для Windows

```bash
npm run package
```

NSIS-инсталлятор `Minecraft Launcher Setup <version>.exe` появится в каталоге `release/`.

> Сборку `.exe` рекомендуется запускать на Windows. Кросс-сборка из Linux требует `wine` и не всегда корректно собирает иконку/подпись.

Если нужна не-установочная версия (просто папка с `.exe` без NSIS):

```bash
npm run package:dir
```

## Lint

```bash
npm run lint
```

## IPC API

Renderer обращается к main через `window.launcher`:

```ts
window.launcher.play()        // -> { ok, message }
window.launcher.openFolder()  // -> { ok, message }
```

Реальную логику запуска Minecraft нужно реализовать в `electron/main.ts` (ipcMain.handle для `launcher:play` и `launcher:open-folder`).
