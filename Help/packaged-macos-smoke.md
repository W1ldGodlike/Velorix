# Ручной smoke macOS (pack:mac:dir)

Проверка **собранного** `FluxAlloy.app` из `dist/mac-arm64/` (или `dist/mac/`, `dist/mac-x64/`), а не dev-сервера Vite. Автоматическая проверка дерева **`npm run verify:mac-unpacked`** **не заменяет** этот прогон.

## Подготовка

1. Положите `ffmpeg`, `ffprobe`, `yt-dlp` в `bin/` (см. [`bin/README.md`](../bin/README.md)), затем `npm run engines:doctor`.
2. Сборка и layout:

```bash
npm run build
npm run pack:mac:dir
npm run verify:mac-unpacked
```

В бандле должны быть `Contents/MacOS/FluxAlloy` и `Contents/Resources/bin/`.

## Чеклист в приложении

**Настройки → Зависимости → Ручной smoke macOS (pack:mac:dir)** — шаги можно скопировать; они попадают в Support ZIP (`macosPackagedSmoke:`).

## Копирование и локали

**Скопировать** — формат Support ZIP (`owner:` / `step [id]:`). EN UI — `locales/en/macos-packaged-manual-smoke.json`. Полный пакет — [owner-manual-smoke.md](owner-manual-smoke.md). Dev: `check:packaged-manual-smoke-parity`, `check:packaged-e2e-scenarios-registry` (§21; per-step `e2e <id>:` в `releaseSmoke:`, напр. `e2e launch:`) — в `check:quiet`.

## Краткий порядок

1. Открыть `FluxAlloy.app`.
2. Статусбар, редактор, загрузки, снимок, экспорт, спрайт §7.5, мини-плеер §4.3 при busy-задачах, база знаний, Support ZIP.
3. Выйти и снова открыть бандл — без падения.

Подробности — [`docs/RELEASE.md`](../docs/RELEASE.md) §4.2.

Support ZIP `releaseSmoke:` на любой ОС перечисляет кандидаты `FluxAlloy.app` и layout `Contents/Resources/*` (present/missing) — удобно приложить к отчёту после `pack:mac:dir`.

См. также [about-support-logs.md](about-support-logs.md) и [packaged-windows-smoke.md](packaged-windows-smoke.md).
