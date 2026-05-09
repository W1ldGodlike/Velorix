# FluxAlloy project rules

- **Стек:** Electron + React + TypeScript; тяжёлая работа — в **main process**, узкий IPC через preload.
- **Доменная логика** (ffmpeg, yt-dlp, очереди) — в TypeScript в `src/main` и связанных модулях; стиль и имена — как в соседних файлах.
- Крупные файлы при необходимости разбивать; не ослаблять проверки бинарников (`Data/trusted_hashes.json`).
