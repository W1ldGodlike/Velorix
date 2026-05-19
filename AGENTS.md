# FluxAlloy — инструкции для агента

**Всегда (rules):** [`fluxalloy-rules-explicit.mdc`](.cursor/rules/fluxalloy-rules-explicit.mdc), [`fluxalloy-core.mdc`](.cursor/rules/fluxalloy-core.mdc), [`fluxalloy-agent.mdc`](.cursor/rules/fluxalloy-agent.mdc).

**Skills (по задаче):** [marathon](.cursor/skills/fluxalloy-marathon/SKILL.md), [journal-entry](.cursor/skills/fluxalloy-journal-entry/SKILL.md), [checklist-audit](.cursor/skills/fluxalloy-checklist-audit/SKILL.md), [release](.cursor/skills/fluxalloy-release/SKILL.md).

**Индекс:** [`docs/SOURCES_OF_TRUTH.md`](docs/SOURCES_OF_TRUTH.md) · **Marathon:** [`docs/AGENT_MARATHON.md`](docs/AGENT_MARATHON.md) · **Спринт:** [`IMPLEMENTATION_CHECKLIST.md`](IMPLEMENTATION_CHECKLIST.md) · **Журнал:** [`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md) · **ТЗ:** [`FLUXALLOY_TZ.md`](FLUXALLOY_TZ.md) (без правок без явной просьбы) · **SDK:** [`agent-contract.txt`](scripts/cursor-automation/prompts/agent-contract.txt)

**Проверки:** `npm run check:quiet` перед cadence-commit (`J-NNN`: `NNN % 5` commit, `NNN % 10` push); полный `npm run check` — релиз или по запросу.

**Help §21:** `npm run check:help-workflow-smoke-crosslinks` (44 workflow; tail 42 HelpCrosslinksCountTail + ffmpeg FfmpegTerminalWorkflowClause + knowledge KnowledgeHubDevClause (FAQ 2 in tail, outside 44)); registry `check:help-smoke-guards-package-json` requires `partition:` in all 44 workflow Help.

## Cursor Cloud specific instructions

**Окружение:** Node.js 24 (nvm), npm. Зависимости: `npm install`.

**Lint / typecheck / audits:** все проходят на Linux Cloud VM без ограничений. Команды — в `package.json scripts` и README.

**Тесты:** `npm run test` — 267/273 suite pass; 6 файлов (`tests/main/app-data-root.test.ts`, `tests/main/ytdlp-download-options.test.ts`, `tests/main/ffmpeg-progress-smoke.test.ts`, `tests/shared/packaged-ffprobe-smoke-core.test.ts`, `tests/shared/packaged-ffmpeg-smoke.test.ts`, `tests/shared/packaged-ytdlp-smoke.test.ts`) падают из-за Windows-специфичных assert'ов (`.exe` пути, `process.platform === 'win32'`). Это ожидаемо на Linux.

**Build / dev mode:** работает после workaround в `electron.vite.config.ts` (плагин `fix:esm-shim`). Без него electron-vite's `vite:esm-shim` ложно срабатывает на строку `"no Node path import"` в `renderer-state-approach.ts` (regex `ESMStaticImportRe` принимает конец строки за static import), вставляя CJS shim в середину кода. Fix удаляет сломанный плагин из pipeline и вставляет shim корректно.

**Запуск Electron (если понадобится):** требуется `xvfb-run` (уже установлен). Команда: `xvfb-run --auto-servernum npm run dev`.
