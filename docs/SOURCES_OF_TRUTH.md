# Источники истины (без противоречий)

Если меняете договорённость — обновите **все** связанные места **в одном коммите**. Не оставляйте «хвостов».

## Иерархия

| Приоритет | Где | Что хранится |
| --------- | --- | ------------ |
| 1 | [`.cursor/rules/`](../.cursor/rules/) + [`.cursor/skills/`](../.cursor/skills/) | Исполняемые запреты и команды. **Запрещено:** копировать в `.mdc` целиком тела NEON-чеклиста или журнала. |
| 2 | Шапка [`IMPLEMENTATION_JOURNAL.md`](../IMPLEMENTATION_JOURNAL.md) | Формат `J-NNN`, время, одна сводная за итерацию. |
| 3 | [`docs/VELORIX_NEON_THEME.md`](VELORIX_NEON_THEME.md) | **Навигатор агента:** Variant A, Phase D, refs **1–27**, анализ PNG, workstream'ы. |
| 3b | [`docs/IMPLEMENTATION_NEON_CHECKLIST.md`](IMPLEMENTATION_NEON_CHECKLIST.md) | **Активный чеклист:** sprint TODO (3–7 пунктов), snap.*, сводка VA/Phase D. **Не** дублирует NEON-трекер. |
| 4 | [`velorix-continue`](../.cursor/skills/velorix-continue/SKILL.md) + [`velorix-agent.mdc`](../.cursor/rules/velorix-agent.mdc) | **«продолжай» / `+`:** текущая задача → NEON → sprint TODO в NEON-чеклисте. Git по J — `velorix-agent.mdc`. |
| 5 | [`docs/ARCHITECTURE.md`](ARCHITECTURE.md) · [`docs/RELEASE.md`](RELEASE.md) | IPC, npm, packaging, вспомогательный стек (таблица). |
| 6 | [`scripts/cursor-automation/prompts/agent-contract.txt`](../scripts/cursor-automation/prompts/agent-contract.txt) | SDK-агент; синхрон с 1–4. |
| — | [`docs/archive/`](archive/) | **ARCHIVE:** `VELORIX_TZ.OLD.md`, `IMPLEMENTATION_CHECKLIST.OLD.md`, `UX_REFERENCE_V0.OLD.md` — **запрещено** как навигатор и spec. |

## При расхождении

1. **UI/UX / NEON / refs 1–27:** [`docs/VELORIX_NEON_THEME.md`](VELORIX_NEON_THEME.md) **важнее** архива и кода legacy UX.
2. **Код vs документ:** ориентир — код + NEON; архив **не** блокирует правильную реализацию.
3. Сверить глоссарий **«Приоритет rules vs шапка»** в `velorix-rules-explicit.mdc`.
4. Исправить **все** дубликаты **одним коммитом**.
5. `npm run check:journal` при правках журнала; `npm run check:checklist` при правках sprint TODO в NEON-чеклисте.

## Карта синхронизации

| Тема | Обновить вместе |
| --- | --- |
| Журнал / формат J | шапка `IMPLEMENTATION_JOURNAL.md`, `velorix-journal.mdc`, `agent-contract.txt` |
| Sprint TODO (NEON) | `docs/IMPLEMENTATION_NEON_CHECKLIST.md`, `velorix-checklist.mdc`, `agent-contract.txt`, `continue.txt`, `initial.txt` |
| Vitest snapshot | `AGENTS.md`, `README.md`, `docs/IMPLEMENTATION_NEON_CHECKLIST.md` (`snap.3`) |
| Продолжай / + | `velorix-continue` SKILL, `velorix-agent.mdc`, `velorix-rules-explicit.mdc`, SDK prompts → **NEON-трекер**, не архив |
| Git по J-NNN | глоссарий `velorix-rules-explicit.mdc`, `velorix-agent.mdc`, SDK prompts |
| VELORIX NEON | `VELORIX_NEON_THEME.md`, `docs/reference/`, `themes/velorix-neon/**`, `velorix-neon-theme-tokens.ts` |
| Вспомогательный стек | таблица в `docs/ARCHITECTURE.md`; при записи — NEON-чеклист § «Вспомогательный стек» |
| Архив TZ/старый чеклист | только `docs/archive/*`; **запрещены** `VELORIX_TZ.md` и `IMPLEMENTATION_CHECKLIST.md` в корне (`check:tz-artifacts`) |
| §19 signing | `release-code-signing-roadmap.ts`, `electron-builder.yml`, `RELEASE.md`, Help guards |
| Toolchain baseline | `toolchain-baseline-wip-handoff-meta.ts`, `package.json`, `AGENTS.md`, `README.md`, `ARCHITECTURE.md` |
| Docs / legacy links | `check:docs-governance`; `audit:orphan-scripts` |
| Удаление мешающего legacy | `velorix-simplicity.mdc` § «Рефакторинг и legacy», глоссарий `velorix-rules-explicit.mdc`, `velorix-agent.mdc`, `VELORIX_NEON_THEME.md` правило #7, SDK prompts |

Help UiHintSuffix — `formatPackagedGuiE2eHelpUiHintSuffix`; Playwright — `docs/RELEASE.md`, `planned-gui-e2e-steps.ts`.
