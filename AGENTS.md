# FluxAlloy — инструкции для агента

**Первая роль:** pragmatic senior engineer maintaining a real desktop application with limited complexity budget; исполняемое правило — [`fluxalloy-core.mdc`](.cursor/rules/fluxalloy-core.mdc).

**Toolchain:** миграция baseline завершена — см. [`docs/TOOLCHAIN_BASELINE_UPGRADE_PLAN.md`](docs/TOOLCHAIN_BASELINE_UPGRADE_PLAN.md) (статус «выполнен»; Electron 42, Vite 8, TS 6, ESLint 9). Удаление файла плана — только по явной просьбе «удали план toolchain».

**Dependabot wave 5 (спринт [~]):** после **`git push`** baseline на `main` — `gh` и закрытие PR по §Git плана; см. также [`docs/RELEASE.md`](docs/RELEASE.md) §1 и [`docs/AGENT_OPERATIONAL_NOTES.md`](docs/AGENT_OPERATIONAL_NOTES.md).

**Всегда (rules):** [`fluxalloy-rules-explicit.mdc`](.cursor/rules/fluxalloy-rules-explicit.mdc), [`fluxalloy-core.mdc`](.cursor/rules/fluxalloy-core.mdc), [`fluxalloy-agent.mdc`](.cursor/rules/fluxalloy-agent.mdc), [`fluxalloy-simplicity.mdc`](.cursor/rules/fluxalloy-simplicity.mdc).

**Skills (по задаче):** [marathon](.cursor/skills/fluxalloy-marathon/SKILL.md), [journal-entry](.cursor/skills/fluxalloy-journal-entry/SKILL.md), [checklist-audit](.cursor/skills/fluxalloy-checklist-audit/SKILL.md), [release](.cursor/skills/fluxalloy-release/SKILL.md).

**Индекс:** [`docs/SOURCES_OF_TRUTH.md`](docs/SOURCES_OF_TRUTH.md) · **Marathon:** [`docs/AGENT_MARATHON.md`](docs/AGENT_MARATHON.md) · **Спринт:** [`IMPLEMENTATION_CHECKLIST.md`](IMPLEMENTATION_CHECKLIST.md) · **Журнал:** [`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md) · **ТЗ:** [`FLUXALLOY_TZ.md`](FLUXALLOY_TZ.md) (без правок без явной просьбы) · **SDK:** [`agent-contract.txt`](scripts/cursor-automation/prompts/agent-contract.txt)

**Проверки:** `npm run check:quiet` перед cadence-commit (`J-NNN`: `NNN % 5` commit, `NNN % 10` push); `npm run check` — алиас на тот же gate (релиз или по запросу). Перед WIP-commit: `npm run build` (Vite 8) — **J-1386** OK; после build — `src/shared/app-build-info.json` → **`dev`** ([`docs/AGENT_OPERATIONAL_NOTES.md`](docs/AGENT_OPERATIONAL_NOTES.md)). **`npm run audit:moderate`** не входит в `check:quiet` (см. README «Первичная настройка», [`docs/RELEASE.md`](docs/RELEASE.md) §1, job **check** в [`ci.yml`](.github/workflows/ci.yml)).

**Cadence override:** если владелец явно «не коммитить» / «без коммита» / «не пушить» в этом чате — `git commit` / `git push` не делать (приоритет над J%5/J%10; см. [`fluxalloy-agent.mdc`](.cursor/rules/fluxalloy-agent.mdc) §Cadence). **WIP** (27+ paths, gate **J-1440**, handoff freeze **J-1394**): [`docs/AGENT_MARATHON.md`](docs/AGENT_MARATHON.md) §Pre-commit; git отложен. **Следующий cadence** **J-1560** (commit); WIP push — по «push» (§Pre-commit; J-1440 push отложен).

**Help §21:** `npm run check:help-workflow-smoke-crosslinks` (44 workflow; tail 42 HelpCrosslinksCountTail + ffmpeg FfmpegTerminalWorkflowClause + knowledge KnowledgeHubDevClause (FAQ 2 in tail, outside 44); 44/44 strict packaged-smoke formatters (`STRICT_PACKAGED_SMOKE_HELP_PATHS`)); registry `check:help-smoke-guards-package-json` requires `partition:` in all 44 workflow Help. **Playwright GUI e2e (deferred):** `check:packaged-gui-e2e-playwright-deferred` — reserved `test:e2e:gui` (8 planned-gui-e2e; not in package.json yet). **Playwright scaffold:** `tests/e2e/gui/planned-gui-e2e-steps.ts` + `tests/e2e/gui/planned-gui-e2e-steps.test.ts` (8 steps; `PLANNED_GUI_E2E_STEP_IDS, PLANNED_GUI_E2E_SCENARIOS, PLANNED_GUI_E2E_STEP_BY_ID`). **Playwright step notes:** `PLANNED_GUI_E2E_STEP_BY_ID` in `tests/e2e/gui/planned-gui-e2e-steps.ts`; Copy/releaseSmoke — `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`. **Playwright wiring:** `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet` (after owner-smoke on hardware). UI hints: `formatPackagedGuiE2ePlaywrightUiHintSuffix` (`check:owner-visual-smoke-locale`, `check:support-bundle-terminal-hints`).

**§19 publish signing (win/linux/mac):** [`release-code-signing-roadmap.ts`](src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](docs/RELEASE.md) §4/§4.1/§4.2; Help packaged win/linux/macos + §15 hub — `check:help-packaged-smoke-docs`, `check:help-owner-smoke-docs`, strict signing in `check:help-workflow-smoke-crosslinks`. dev `pack:*:dir` may skip until publish.

**§19 signing indexed:** Help §15 hub + `check:help-packaged-smoke-docs` + `check:help-owner-smoke-docs` + strict signing crosslinks; SDK `continue.txt` / `initial.txt` / `agent-contract.txt` — `formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock` / `formatReleaseCodeSigningRoadmapSdkContractSigningIndexedClause`; diagnostics — `check:release` / `check:platform-packaging-scripts` (`formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine`). Packaging indexed: `electron-builder.yml` (**9** §19 yaml comments; J-1520..1539).

**§19 packaging (`electron-builder.yml`):** win **nsis** + **zip** (no `portable`); **9** inline §19 yaml comments — `getReleaseCodeSigningElectronBuilderYmlComments` in [`release-code-signing-roadmap.ts`](src/shared/release-code-signing-roadmap.ts); diagnostics in `check:release` / `check:platform-packaging-scripts`.

## Cursor Cloud specific instructions

**Окружение:** Node.js 24 (nvm), npm. Зависимости: `npm install` или `npm ci` — в корне [`.npmrc`](.npmrc) задано `legacy-peer-deps=true` (Vite 8 vs peer `electron-vite`; см. [`docs/TOOLCHAIN_BASELINE_UPGRADE_PLAN.md`](docs/TOOLCHAIN_BASELINE_UPGRADE_PLAN.md)).

**Lint / typecheck / audits:** все проходят на Linux Cloud VM без ограничений. Команды — в `package.json scripts` и README.

**Тесты:** на **Windows** полный `npm run test` / `npm run check:quiet`: **280** test files, **1901** tests (снимок — [`IMPLEMENTATION_CHECKLIST.md`](IMPLEMENTATION_CHECKLIST.md); toolchain lock — `tests/shared/toolchain-baseline-package.test.ts`, `toolchain-baseline-governance.test.ts`). В **Cursor Cloud (Linux)** часть тестов с ожиданиями под Windows (пути `*.exe`, `win-unpacked` и т.п.) может расходиться с локальным Windows; канонический gate — job **`windows-latest`** в [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

**Build / dev mode:** работает после workaround в `electron.vite.config.ts` (плагин `fix:esm-shim`). Без него electron-vite's `vite:esm-shim` ложно срабатывает на строку `"no Node path import"` в `renderer-state-approach.ts` (regex `ESMStaticImportRe` принимает конец строки за static import), вставляя CJS shim в середину кода. Fix удаляет сломанный плагин из pipeline и вставляет shim корректно.

**Запуск Electron (если понадобится):** требуется `xvfb-run` (уже установлен). Команда: `xvfb-run --auto-servernum npm run dev`.
