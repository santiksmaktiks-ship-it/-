# JARVIS AI Windows

Модульный Windows AI-assistant.

## Архитектура
- main.py — запуск
- jarvis/ai/ — AI, распознавание речи и TTS
- jarvis/audio/ — микрофон, устройства, запись и проигрывание
- jarvis/chat/ — контекст и память диалога
- jarvis/commands/ — маршрутизация команд
- jarvis/memory/ — локальное хранилище
- jarvis/security/ — работа с секретами
- jarvis/core/ — события, состояние, логирование
- jarvis/ui/ — интерфейс
- jarvis/utils/ — системные утилиты
- jarvis/config.py — настройки

API key вводится в Settings и не коммитится в GitHub.

Сборка: GitHub Actions создаёт JarvisAI.exe.
