# Ручной smoke Linux (pack:linux:dir)

Проверка **собранного** приложения из `dist/linux-unpacked/`, а не dev-сервера Vite. Автоматическая проверка дерева **`npm run verify:linux-unpacked`** **не заменяет** этот прогон.

## Подготовка

1. Положите `ffmpeg`, `ffprobe`, `yt-dlp` в `bin/` (см. [`bin/README.md`](../bin/README.md)), затем `npm run engines:doctor`.
2. Сборка и layout:

```bash
npm run build
npm run pack:linux:dir
npm run verify:linux-unpacked
```

В каталоге должны быть `fluxalloy` или `FluxAlloy` и `resources/bin/{yt-dlp,ffmpeg,ffprobe}`.

## Чеклист в приложении

**Настройки → Зависимости → Ручной smoke Linux (pack:linux:dir)** — те же шаги можно скопировать в отчёт; они попадают в Support ZIP (`linuxPackagedSmoke:`).

## Копирование и локали

**Скопировать** в packaged-панели — формат как Support ZIP (`owner:` / `step [id]:` + **§21 packaged e2e (CI vs owner)**). EN UI — `locales/en/linux-packaged-manual-smoke.json`. Полный пакет — [owner-manual-smoke.md](owner-manual-smoke.md). Dev: `check:packaged-manual-smoke-parity`, `check:packaged-e2e-scenarios-registry` (§21; per-step `e2e <id>:` в `releaseSmoke:`, напр. `e2e launch:`), `check:help-workflow-smoke-crosslinks` — в `check:quiet`.

## Краткий порядок

1. Запустить бинарник из `dist/linux-unpacked/`.
2. Статусбар: версии движков без «не найден».
3. Редактор, загрузки, снимок, экспорт, спрайт §7.5, мини-плеер §4.3 при busy-задачах, база знаний, Support ZIP.
4. Закрыть и снова открыть — без падения.

Подробности — [`docs/RELEASE.md`](../docs/RELEASE.md) §4.1.

Support ZIP `releaseSmoke:` на любой ОС перечисляет `dist/linux-unpacked/` и layout `resources/*` (present/missing); dev-блок `terminalHints:` (§8) — удобно приложить к отчёту после `pack:linux:dir`.

См. также [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md) и [packaged-windows-smoke.md](packaged-windows-smoke.md). §21 planned GUI e2e (8 шагов) — [owner-manual-smoke.md](owner-manual-smoke.md); канон stepId: `PACKAGED_E2E_PLANNED_GUI_STEP_IDS`.
