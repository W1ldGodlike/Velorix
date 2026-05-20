# Operational notes (FluxAlloy)

**Исполняемое поведение агента** — [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + skills [`.cursor/skills/fluxalloy-*/`](../.cursor/skills/). Карта: [`AGENTS.md`](../AGENTS.md), иерархия: [`SOURCES_OF_TRUTH.md`](SOURCES_OF_TRUTH.md).

**Этот файл** — заметки при отладке конкретных зон. **Не** дублирует rules. **При конфликте** побеждают `.mdc` + шапки `IMPLEMENTATION_*`.

Архитектура: [`docs/ARCHITECTURE.md`](ARCHITECTURE.md). Медиа/CSP: `src/renderer/index.html`, `src/main/media-protocol.ts`.

---

## Операционные заметки

| Тема             | Заметка                                                                                                                                                                           |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| CSP              | `src/renderer/index.html` — `media-src` / `connect-src`; при падении `<video>` / `fetch` — CSP + способ отдачи файла в main                                                       |
| Медиа URL        | Allowlist/grant в main; схема `fluxmedia://` и/или локальный HTTP — согласованность с `media-protocol.ts`                                                                         |
| yt-dlp Windows   | UTF-8 stdout для путей с кириллицей; не откатывать обёртки без причины                                                                                                            |
| Очередь загрузок | `{ ok, error }` в IPC; снапшоты — main window и downloads, **если** оба окна в сценарии                                                                                           |
| Движки           | bundled-first, `npm run engines:prepare:win`, `Data/trusted_hashes.json` — не ослаблять (§3 ТЗ, `fluxalloy-core.mdc`)                                                             |
| Долгие jobs      | Превью, transcode, export — статус в UI и `app-data/logs/main.log`                                                                                                                |
| LF в исходниках  | Только LF (`.editorconfig`, `.gitattributes`). **Запрещено:** `Set-Content` / правка файлов с CRLF — `npm run format` или `prettier --write`; guard: `npm run check:line-endings` |
| Coverage         | `npm run test:coverage` — отчёт в консоли; каталог `coverage/` удаляется в конце (`scripts/clean-coverage-dir.mjs`). Локально можно `node scripts/clean-coverage-dir.mjs`         |
| Maint split      | Одноразовые `split-*` / `migrate-*` **не** коммитить — удалить после применения; guard: `npm run check:maint-scripts-layout`                                                          |
| npm install / CI | Корневой [`.npmrc`](../.npmrc): `legacy-peer-deps=true` (Vite 8 vs peer `electron-vite` ^7). GitHub Actions: **`npm ci`** в job **`check`** и **`linux-packaging`** ([`.github/workflows/ci.yml`](../.github/workflows/ci.yml)) — оба читают тот же `.npmrc`. Канон — [`docs/TOOLCHAIN_BASELINE_UPGRADE_PLAN.md`](TOOLCHAIN_BASELINE_UPGRADE_PLAN.md). |
| `npm run build` | Пишет `src/shared/app-build-info.json` (SHA/время). Перед `npm run check` / commit после локального build — вернуть **`{"buildId":"dev","builtAtUtc":null}`** (тесты `app-build-info`; **J-1386**). |
| WIP baseline commit | **27**+ paths на `main` @ `ac5821c`; journal **J-1353..1556**; один commit — [`docs/AGENT_MARATHON.md`](AGENT_MARATHON.md) §Pre-commit (gate **J-1440** push отложен; владелец: «commit»/«push»). |
| Dependabot wave 5 | После **`git push`** baseline toolchain на `main`: `gh auth login`, закрыть PR #4,#6,#7,#11–#15 ([`docs/TOOLCHAIN_BASELINE_UPGRADE_PLAN.md`](TOOLCHAIN_BASELINE_UPGRADE_PLAN.md) §Git; спринт Wave 5 [~] в [`IMPLEMENTATION_CHECKLIST.md`](../IMPLEMENTATION_CHECKLIST.md); предрелизный чеклист [`RELEASE.md`](RELEASE.md) §1). |
| §21 Playwright GUI e2e (deferred) | Scaffold `tests/e2e/gui/planned-gui-e2e-steps.ts` exports `PLANNED_GUI_E2E_STEP_IDS, PLANNED_GUI_E2E_SCENARIOS, PLANNED_GUI_E2E_STEP_BY_ID` (8 steps); Copy/releaseSmoke `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`. Reserved `test:e2e:gui` — **not** in `package.json` until wired. Wiring: [`docs/RELEASE.md`](RELEASE.md) — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet`. Guards: `npm run check:packaged-gui-e2e-playwright-deferred` (in `check:quiet`). |
| §19 publish signing (win/linux/mac) | Roadmaps in [`docs/RELEASE.md`](RELEASE.md) §4/§4.1/§4.2; Help packaged win/linux/macos + §15 hub — `check:help-packaged-smoke-docs`, `check:help-owner-smoke-docs`, strict signing in `check:help-workflow-smoke-crosslinks`. formatters — [`release-code-signing-roadmap.ts`](../src/shared/release-code-signing-roadmap.ts). Dev `pack:*:dir` may skip signing until publish. |
| §19 signing indexed | SDK `continue.txt` / `initial.txt` / `agent-contract.txt` — `formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock` / `formatReleaseCodeSigningRoadmapSdkContractSigningIndexedClause`; Support ZIP — `formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine` (`check:release` / `check:platform-packaging-scripts`). Packaging indexed: `electron-builder.yml` (**9** §19 yaml comments; J-1520..1539). |
| §19 electron-builder.yml | [`electron-builder.yml`](../electron-builder.yml) — win **nsis** + **zip** (no `portable`); mac/linux targets; **9** §19 yaml comments (`getReleaseCodeSigningElectronBuilderYmlComments`); diagnostics — `check:release` / `check:platform-packaging-scripts` (`formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine`). |

**Если** меняете поведение по строке таблицы **и** владелец ведёт playbook **то** обновить эту таблицу **или** `docs/ARCHITECTURE.md` в том же коммите.

---

_2026-05-16: бывш. `AGENT_INSTRUCTIONS_AND_AGREEMENTS.md` → `AGENT_OPERATIONAL_NOTES.md`. Исполняемое: `fluxalloy-agent.mdc` (J-1132 GOV B)._
