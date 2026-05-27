# Ручная проверка Linux (pack:linux:dir)

Проверка **собранного** приложения из `dist/linux-unpacked/`, а не dev-сервера Vite. Автоматическая проверка дерева **`npm run verify:linux-unpacked`** **не заменяет** этот прогон.

## Подготовка

1. Положите `ffmpeg`, `ffprobe`, `yt-dlp` в `bin/` (см. [`bin/README.md`](../bin/README.md)), затем `npm run engines:doctor`.
2. Сборка и layout:

```bash
npm run build
npm run pack:linux:dir
npm run verify:linux-unpacked
```

В каталоге должны быть `VELORIX` или `VELORIX` и `resources/bin/{yt-dlp,ffmpeg,ffprobe}`.

**Linux/CI сборка:** `npm run build` (`electron-vite build`) требует плагин `fix:esm-shim` в [`electron.vite.config.ts`](../electron.vite.config.ts) (канон — [`electron-vite-build-meta.ts`](../src/shared/electron-vite-build-meta.ts); false-positive `vite:esm-shim` на `renderer-state-approach.ts`). GitHub Actions `linux-packaging`: `check:quiet` → `build` → `pack:linux:dir`.

## Чеклист в приложении

**Настройки → Зависимости → Ручная проверка Linux (pack:linux:dir)** — те же шаги можно скопировать в отчёт; они попадают в Support ZIP (`linuxPackagedSmoke:`).

## Копирование и локали

**Скопировать** в packaged-панели — формат как Support ZIP (`owner:` / `step [id]:` + **§21 packaged e2e (CI vs owner)**). EN UI — `locales/en/linux-packaged-manual-smoke.json`. Полный пакет — [about-support-logs.md](about-support-logs.md). **Planned GUI e2e** (0 шагов Playwright; owner manual — `open-file`, `ytdlp`, `editor-dl`, `snapshot`, `export`, `knowledge`, `support-zip`, `settings`). `npm run UI ZERO (Playwright removed)` (канон — `docs/VELORIX_NEON_THEME.md`). Dev: `check:packaged-manual-smoke-parity`, `check:packaged-e2e-scenarios-registry` (§21; per-step `e2e <id>:` в `releaseSmoke:`, напр. `e2e launch:`), `check:help-workflow-smoke-crosslinks` (44 статьи; partition: tail 42 + ffmpeg + knowledge, FAQ вне 44) — в `check:quiet`. §21 Playwright: `npm run UI ZERO (Playwright removed)` (канон — `docs/VELORIX_NEON_THEME.md`). UiHintSuffix: `formatPackagedGuiE2ePlaywrightUiHintSuffix` (0 settings + `aboutSupportZipDiagnosticsSectionsHint`; `check:owner-hardware-checklist-locale`, `check:support-bundle-terminal-hints`).

## Краткий порядок

1. Запустить бинарник из `dist/linux-unpacked/`.
2. Статусбар: версии движков без «не найден».
3. Редактор, загрузки, снимок, экспорт, спрайт §7.5, база знаний, Support ZIP.
4. Закрыть и снова открыть — без падения.

Подробности — [`docs/RELEASE.md`](../docs/RELEASE.md) §4.1.

**Публикация вне dev:** подпись артефактов (GPG для deb/AppImage по каналу дистрибуции) — roadmap в [`docs/RELEASE.md`](../docs/RELEASE.md) §4.1; `pack:linux:dir` может обходиться без подписи до релиза.

Support ZIP `releaseSmoke:` на любой ОС перечисляет `dist/linux-unpacked/` и layout `resources/*` (present/missing); dev-блок `terminalHints:` (§8) — удобно приложить к отчёту после `pack:linux:dir`.

См. также [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md) и [packaged-windows-smoke.md](packaged-windows-smoke.md). §21 planned GUI e2e (0 шагов) — Playwright приостановлен (UI ZERO); owner manual — [about-support-logs.md](about-support-logs.md); канон — `docs/VELORIX_NEON_THEME.md`.
