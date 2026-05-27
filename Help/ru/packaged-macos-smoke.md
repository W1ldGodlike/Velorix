# Ручная проверка macOS (pack:mac:dir)

Проверка **собранного** `Velorix.app` из `dist/mac-arm64/` (или `dist/mac/`, `dist/mac-x64/`), а не dev-сервера Vite. Автоматическая проверка дерева **`npm run verify:mac-unpacked`** **не заменяет** этот прогон.

## Подготовка

1. Положите `ffmpeg`, `ffprobe`, `yt-dlp` в `bin/` (см. [`bin/README.md`](../bin/README.md)), затем `npm run engines:doctor`.
2. Сборка и layout:

```bash
npm run build
npm run pack:mac:dir
npm run verify:mac-unpacked
```

В бандле должны быть `Contents/MacOS/Velorix` и `Contents/Resources/bin/`.

**Linux/CI сборка:** при `npm run build` на Linux/CI нужен плагин `fix:esm-shim` (канон `electron-vite-build-meta.ts`, [`electron.vite.config.ts`](../electron.vite.config.ts)); CI `linux-packaging` — только Linux. Локально на macOS: `build` → `pack:mac:dir`.

## Чеклист в приложении

**Настройки → Зависимости → Ручная проверка macOS (pack:mac:dir)** — шаги можно скопировать; они попадают в Support ZIP (`macosPackagedSmoke:`).

## Копирование и локали

**Скопировать** — формат Support ZIP (`owner:` / `step [id]:` + **§21 packaged e2e (CI vs owner)**). EN UI — `locales/en/macos-packaged-manual-smoke.json`. Полный пакет — [about-support-logs.md](about-support-logs.md). **Planned GUI e2e** (0 шагов Playwright; owner manual — `open-file`, `ytdlp`, `editor-dl`, `snapshot`, `export`, `knowledge`, `support-zip`, `settings`). `npm run UI ZERO (Playwright removed)` (канон — `docs/VELORIX_NEON_THEME.md`). Dev: `check:packaged-manual-smoke-parity`, `check:packaged-e2e-scenarios-registry` (§21; per-step `e2e <id>:` в `releaseSmoke:`, напр. `e2e launch:`), `check:help-workflow-smoke-crosslinks` (44 статьи; partition: tail 42 + ffmpeg + knowledge, FAQ вне 44) — в `check:quiet`. §21 Playwright: `npm run UI ZERO (Playwright removed)` (канон — `docs/VELORIX_NEON_THEME.md`). UiHintSuffix: `formatPackagedGuiE2ePlaywrightUiHintSuffix` (0 settings + `aboutSupportZipDiagnosticsSectionsHint`; `check:owner-hardware-checklist-locale`, `check:support-bundle-terminal-hints`).

## Краткий порядок

1. Открыть `Velorix.app`.
2. Статусбар, редактор, загрузки, снимок, экспорт, спрайт §7.5, база знаний, Support ZIP.
3. Выйти и снова открыть бандл — без падения.

Подробности — [`docs/RELEASE.md`](../docs/RELEASE.md) §4.2.

**Публикация вне dev:** подпись Developer ID, hardened runtime, notarization (`notarytool`, `stapler staple`) — roadmap в [`docs/RELEASE.md`](../docs/RELEASE.md) §4.2; `pack:mac:dir` может обходиться без подписи до релиза.

Support ZIP `releaseSmoke:` на любой ОС перечисляет кандидаты `Velorix.app` и layout `Contents/Resources/*` (present/missing); dev-блок `terminalHints:` (§8) — удобно приложить к отчёту после `pack:mac:dir`.

См. также [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md) и [packaged-windows-smoke.md](packaged-windows-smoke.md). §21 planned GUI e2e (0 шагов) — Playwright приостановлен (UI ZERO); owner manual — [about-support-logs.md](about-support-logs.md); канон — `docs/VELORIX_NEON_THEME.md`.
