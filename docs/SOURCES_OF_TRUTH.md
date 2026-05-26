# Источники истины (без противоречий)

Если меняете договорённость — обновите **все** связанные места **в одном коммите**. Не оставляйте «хвостов» (старое в одном файле, новое в другом).

## Иерархия

| Приоритет | Где                                                                                                               | Что хранится                                                                                                                                                                    |
| --------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1         | [`.cursor/rules/`](../.cursor/rules/) + [`.cursor/skills/`](../.cursor/skills/)                                   | **alwaysApply:** `VELORIX-rules-explicit`, `VELORIX-core`, `VELORIX-agent`, `VELORIX-simplicity`. **Workflows:** skills `VELORIX-*`. **Запрещено:** копировать в `.mdc` целиком ТЗ, тело чеклиста или журнала — агент **открывает файл** и читает нужный фрагмент; в rules только **исполняемые** запреты и команды. |
| 2         | Шапка [`IMPLEMENTATION_JOURNAL.md`](../IMPLEMENTATION_JOURNAL.md)                                                 | Канон **формата** журнала (`J-NNN`, время, одна сводная за итерацию).                                                                                                           |
| 3         | Шапка [`IMPLEMENTATION_CHECKLIST.md`](../IMPLEMENTATION_CHECKLIST.md)                                             | Канон **формата** чеклиста и блока «Ближайший TODO спринта».                                                                                                                    |
| 3b        | [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](../IMPLEMENTATION_MANUAL_VERIFICATION.md)                               | Ручная проверка на железе (владелец); агент **не** берёт в спринт.                                                                                                             |
| 4         | [`.cursor/skills/velorix-continue/`](../.cursor/skills/velorix-continue/SKILL.md) + [`velorix-agent.mdc`](../.cursor/rules/velorix-agent.mdc) | **«продолжай» и `+` — равнозначные команды**: текущая задача или спринт; **Git по J-NNN** — глоссарий + **следующий commit/push по J** в `velorix-agent.mdc` (**J-1580**).                                                                                                            |
| 4b        | [`velorix-agent.mdc`](../.cursor/rules/velorix-agent.mdc) + `check:ui-surfaces-guard`                           | UI, audit, среда; один renderer; `ui-text` / `locales/**`; без HTML-pop-out.                                                                                                   |
| 5         | [`VELORIX_TZ.md`](../VELORIX_TZ.md)                                                                           | Канон **продукта** (требования). В rules **не** копируется целиком — только чтение нужного §. **Не редактировать** без явной просьбы владельца.                                 |
| 6         | [`scripts/cursor-automation/prompts/agent-contract.txt`](../scripts/cursor-automation/prompts/agent-contract.txt) | SDK-агент; синхронизировать с 1–4 при смене процесса; git по J — **следующий commit по J** **J-1580** (`velorix-agent.mdc`).                                                                                                      |
| 7         | [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) · [`docs/RELEASE.md`](RELEASE.md) · [`docs/VELORIX_NEON_THEME.md`](VELORIX_NEON_THEME.md) | IPC/renderer, npm/toolchain, packaging, release/build; **VELORIX NEON** — эталоны PNG (реф. 1–27), **вариант A** (единственный UI), workstream'ы shell/recovery/components и cleanup buckets legacy-theme/pop-out.                                                                 |

## При расхождении

1. Сверить с таблицей приоритетов и глоссарием **«Приоритет rules vs шапка»** в `velorix-rules-explicit.mdc` (формат → шапка `IMPLEMENTATION_*`; процесс → `.mdc`).
2. Исправить **все** дубликаты **одним коммитом**.
3. Прогнать `npm run check:journal` и `npm run check:checklist` при правках журнала/спринта.

## Карта синхронизации (сжатая группировка)

При правке темы обнови **все перечисленные в строке** в **одном коммите** (или ближайшем `git commit` по `J-NNN`, `NNN % 5 === 0`).

| Тема | Обновить вместе |
| --- | --- |
| Журнал / формат J | шапка `IMPLEMENTATION_JOURNAL.md`, `velorix-journal.mdc`, `agent-contract.txt` |
| Спринт TODO | шапка `IMPLEMENTATION_CHECKLIST.md`, `velorix-checklist.mdc`, `agent-contract.txt`; sprint Wave 5 — formatToolchainBaselineWipHandoffChecklistSprintWave5Line |
| Vitest snapshot (Windows gate) | `AGENTS.md` (**канон** числа test files / tests под `npm run check:quiet`), `README.md`, снимок в `IMPLEMENTATION_CHECKLIST.md` |
| §19 signing roadmap (win/linux/mac) | `src/shared/release-code-signing-roadmap.ts`, `electron-builder.yml`, `docs/RELEASE.md` §4/§4.1/§4.2, Help packaged/owner + strict crosslinks guards; SDK prompts |
| Baseline handoff (на main) | `toolchain-baseline-wip-handoff-meta.ts`, `RELEASE.md` §1, `ARCHITECTURE.md` § npm, `AGENTS.md`, `README.md`, SDK prompts; lock majors — `toolchain-baseline-package.test.ts` |
| Продолжай / + | [`.cursor/skills/velorix-continue/SKILL.md`](../.cursor/skills/velorix-continue/SKILL.md), `velorix-agent.mdc`, `velorix-rules-explicit.mdc`, `continue.txt`, `initial.txt`, `agent-contract.txt` (**«продолжай» и `+` равнозначны**) |
| Git по J-NNN | глоссарий `velorix-rules-explicit.mdc`, `velorix-agent.mdc`, `agent-contract.txt`, `continue.txt`, `initial.txt` |
| Итерация / микро-J / пакет | `velorix-agent.mdc`, skill `velorix-continue`, `velorix-journal.mdc`, skills `velorix-journal-entry` |
| Язык правил / глоссарий | `velorix-rules-explicit.mdc`, все `.mdc` где термин; строка иерархии §1 выше; `npm run check:rules-explicit` |
| Простота governance | `velorix-simplicity.mdc`, `AGENTS.md`, `agent-contract.txt` |
| Новый skill | `.cursor/skills/<name>/SKILL.md`, `AGENTS.md`, эта таблица |
| Audit кода репо | `velorix-agent.mdc`, `scripts/audit-scope.config.mjs`, `docs/audit-manifest.json`, `npm run audit:inventory` + `audit:inventory-sync`; при затронутых путях — `audit:structural` / `audit:copy-paste` |
| Продуктовый код: IPC / main / preload | `velorix-electron.mdc`, `velorix-react.mdc`, `src/shared/ipc-channels.ts`, main + preload + renderer + тесты, `docs/ARCHITECTURE.md` |
| UI / copy / Help / packaged e2e / terminal hints | доменные `src/**`, `tests/**`, `Help/**`, `locales/**`; guards перечислены в `npm run check:quiet` (`scripts/gate/run-quiet-check.mjs`) — не дублировать полный список здесь |
| VELORIX NEON (единственный UI, вариант A) | [`docs/VELORIX_NEON_THEME.md`](VELORIX_NEON_THEME.md) § «Вариант A», refs 1–27 + workstream'ы / cleanup buckets, [`docs/reference/`](reference/), `themes/velorix-neon/**`, `velorix-neon-theme-tokens.ts`; legacy `dark`/`light` — **удалить** по завершении переноса; **запрещено** `UX_REFERENCE_V0.OLD.md` |
| Renderer Zustand (§2.2) | `src/shared/renderer-state-approach.ts`, `src/renderer/src/stores/`, `docs/ARCHITECTURE.md` |
| Docs / legacy links | `npm run check:docs-governance` в `check:quiet`; `audit:orphan-scripts` при чистке `scripts/` |
| Приоритет rules vs шапка | `velorix-rules-explicit.mdc` → синхрон шапок `IMPLEMENTATION_*` при смене формата |
| Среда агента / ответ в чате | `velorix-agent.mdc`, `agent-contract.txt` |
| Toolchain baseline (выполнен) | `package.json` / `package-lock.json`, [`tests/shared/toolchain-baseline-package.test.ts`](../tests/shared/toolchain-baseline-package.test.ts), [`AGENTS.md`](../AGENTS.md), [`velorix-core.mdc`](../.cursor/rules/velorix-core.mdc), корневой [`README.md`](../README.md), [`.npmrc`](../.npmrc), [`docs/RELEASE.md`](RELEASE.md) §1, [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) § npm (**J-1354**, **J-1559** — план; **J-1562** — удалён AGENT_MARATHON; **J-1563** — ops/handoff; **J-1564** — срез тестов/guards; **J-1570** — git по J обязателен) |

Help UiHintSuffix (4 §15 anchors, 6 packaged) — `formatPackagedGuiE2ePlaywright*HelpUiHintSuffix`; AGENTS — slim domains pointer only

Playwright: `tests/e2e/gui/planned-gui-e2e-steps.ts` + `planned-gui-e2e-step-runners.ts` + `planned-gui-e2e.spec.ts`; `npm run test:e2e:gui` → `scripts/e2e/run-planned-gui-e2e-playwright.mjs`

PLANNED_GUI_E2E_STEP_BY_ID — `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine` in Copy/releaseSmoke (registry `note` per planned-gui-e2e step)

Playwright run: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet` (`test:e2e:gui`; manual **21.x** on hardware)
