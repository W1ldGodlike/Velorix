# Ручная проверка Windows (pack:dir)

Проверка **собранного** приложения из `dist/win-unpacked/`, а не dev-сервера Vite. Автоматические шаги CI/релиза (`verify:win-unpacked`, `smoke:packaged-release`) **не заменяют** этот прогон.

## Подготовка

1. Движки в `bin/`: `npm run engines:prepare:win`, затем `npm run engines:doctor` (см. [`bin/README.md`](../bin/README.md)).
2. Сборка:

```powershell
npm run check:release
```

Или по шагам: `npm run pack:dir`, затем `npm run verify:win-unpacked` и `npm run smoke:packaged-release`.

В каталоге должны быть `Velorix.exe` и `resources/bin/{yt-dlp,ffmpeg,ffprobe}.exe`.

## Чеклист в приложении

**Настройки → Зависимости → Ручная проверка Windows (pack:dir)** — те же шаги можно скопировать в отчёт; они попадают в Support ZIP (`winPackagedSmoke:`).

## Копирование и локали

Кнопка **Скопировать** в packaged-панели выдаёт тот же формат, что Support ZIP: `owner:`, `automated:`, `doc:`, `ui:`, затем `step [id]:`, затем блок **§21 packaged e2e (CI vs owner)** (группы 2/0/9 и per-step `e2e <id>:`). При **английском UI** — строки из `locales/en/win-packaged-manual-smoke.json`. Блок packaged в полном пакете владельца — [about-support-logs.md](about-support-logs.md). **Planned GUI e2e** (0 шагов Playwright; owner manual — `open-file`, `ytdlp`, `editor-dl`, `snapshot`, `export`, `knowledge`, `support-zip`, `settings`). `npm run UI ZERO (Playwright removed)` (канон — `docs/VELORIX_NEON_THEME.md`). Dev: `npm run check:packaged-manual-smoke-parity`, `npm run check:packaged-e2e-scenarios-registry` (per-step `e2e launch:` в `releaseSmoke:`), `check:help-workflow-smoke-crosslinks` (44 статьи; partition: tail 42 + ffmpeg + knowledge, FAQ вне 44) — в `check:quiet`. §21 Playwright: `npm run UI ZERO (Playwright removed)` (канон — `docs/VELORIX_NEON_THEME.md`). UiHintSuffix: `formatPackagedGuiE2ePlaywrightUiHintSuffix` (0 settings + `aboutSupportZipDiagnosticsSectionsHint`; `check:owner-hardware-checklist-locale`, `check:support-bundle-terminal-hints`).

## Краткий порядок

1. Запустить `dist/win-unpacked/Velorix.exe`.
2. Статусбар: версии движков без «не найден».
3. Редактор: локальный файл, превью, scrub.
4. Загрузки: короткий URL, очередь до «Готово».
5. «В редактор» для готового файла.
6. Снимок кадра, экспорт MP4, спрайт §7.5 (rail FFmpeg).
7. База знаний и Support ZIP.
8. Закрыть и снова открыть exe — без падения.

Подробности сборки — [`docs/RELEASE.md`](../docs/RELEASE.md) (корень репозитория).

**Публикация вне dev:** подпись Authenticode через `signtool.exe`/CSC (`CSC_LINK`, `WIN_CSC_LINK`) — roadmap в [`docs/RELEASE.md`](../docs/RELEASE.md) §4; `pack:dir` может обходиться без подписи (`CSC_IDENTITY_AUTO_DISCOVERY=false`) до релиза.

Support ZIP `releaseSmoke:` на любой ОС перечисляет `dist/win-unpacked/` и layout `resources/*` (present/missing); dev-блок `terminalHints:` (§8) — удобно приложить к отчёту после `pack:dir`.

См. также [about-support-logs.md](about-support-logs.md) и [logging-and-diagnostics.md](logging-and-diagnostics.md).
