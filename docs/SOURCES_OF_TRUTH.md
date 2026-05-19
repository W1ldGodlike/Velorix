# Источники истины (без противоречий)

Если меняете договорённость — обновите **все** связанные места **в одном коммите**. Не оставляйте «хвостов» (старое в одном файле, новое в другом).

## Иерархия

| Приоритет | Где                                                                                                               | Что хранится                                                                                                                                                                    |
| --------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1         | [`.cursor/rules/`](../.cursor/rules/) + [`.cursor/skills/`](../.cursor/skills/)                                   | **alwaysApply:** `fluxalloy-rules-explicit`, `fluxalloy-core`, `fluxalloy-agent`, `fluxalloy-simplicity`. **Workflows:** skills `fluxalloy-*`. **Запрещено:** копировать в `.mdc` целиком ТЗ, тело чеклиста или журнала — агент **открывает файл** и читает нужный фрагмент; в rules только **исполняемые** запреты и команды. |
| 2         | Шапка [`IMPLEMENTATION_JOURNAL.md`](../IMPLEMENTATION_JOURNAL.md)                                                 | Канон **формата** журнала (`J-NNN`, время, одна сводная за итерацию).                                                                                                           |
| 3         | Шапка [`IMPLEMENTATION_CHECKLIST.md`](../IMPLEMENTATION_CHECKLIST.md)                                             | Канон **формата** чеклиста и блока «Ближайший TODO спринта».                                                                                                                    |
| 4         | [`docs/AGENT_MARATHON.md`](AGENT_MARATHON.md) + skill [`fluxalloy-marathon`](../.cursor/skills/fluxalloy-marathon/SKILL.md) | Marathon («продолжай», SDK): крупный срез, sprint, `agent:session -- bump`. **Cadence Git** — глоссарий + `fluxalloy-agent.mdc`.                                                                                                            |
| 4b        | [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + `check:ui-surfaces-guard`                           | UI, audit, среда; один renderer; `ui-text` / `locales/**`; без HTML-pop-out.                                                                                                   |
| 5         | [`FLUXALLOY_TZ.md`](../FLUXALLOY_TZ.md)                                                                           | Канон **продукта** (требования). В rules **не** копируется целиком — только чтение нужного §. **Не редактировать** без явной просьбы владельца.                                 |
| 6         | [`docs/AGENT_OPERATIONAL_NOTES.md`](AGENT_OPERATIONAL_NOTES.md)                                                   | **Operational notes** (CSP, медиа, yt-dlp). Исполняемое — `fluxalloy-agent.mdc` + skills.                                                                                       |
| 7         | [`scripts/cursor-automation/prompts/agent-contract.txt`](../scripts/cursor-automation/prompts/agent-contract.txt) | То же поведение для SDK-агента; синхронизировать с 1–4 при смене процесса.                                                                                                      |

## При расхождении

1. Сверить с таблицей приоритетов и глоссарием **«Приоритет rules vs шапка»** в `fluxalloy-rules-explicit.mdc` (формат → шапка `IMPLEMENTATION_*`; процесс marathon/audit → `.mdc`).
2. Исправить **все** дубликаты **одним коммитом**.
3. Прогнать `npm run check:journal` и `npm run check:checklist` при правках журнала/спринта.

## Карта синхронизации (сжатая группировка)

При правке темы обнови **все перечисленные в строке** в **одном коммите** (или ближайшем cadence commit по `J-NNN`).

| Тема | Обновить вместе |
| --- | --- |
| Журнал / формат J | шапка `IMPLEMENTATION_JOURNAL.md`, `fluxalloy-journal.mdc`, `agent-contract.txt`; при смене re-anchor snapshot — таблица в `docs/AGENT_MARATHON.md` |
| Спринт TODO | шапка `IMPLEMENTATION_CHECKLIST.md`, `fluxalloy-checklist.mdc`, `agent-contract.txt` |
| Marathon / bump / крупный срез | skill `fluxalloy-marathon`, `docs/AGENT_MARATHON.md`, `scripts/cursor-automation/prompts/continue.txt`, `agent-contract.txt` |
| Cadence Git (J-NNN) | глоссарий `fluxalloy-rules-explicit.mdc`, `fluxalloy-agent.mdc`, `agent-contract.txt`, `continue.txt`, `initial.txt` |
| Итерация / микро-J / пакет | `fluxalloy-agent.mdc`, skill `fluxalloy-marathon`, `fluxalloy-journal.mdc`, skills `fluxalloy-journal-entry` |
| Язык правил / глоссарий | `fluxalloy-rules-explicit.mdc`, все `.mdc` где термин; строка иерархии §1 выше; `npm run check:rules-explicit` |
| Простота governance | `fluxalloy-simplicity.mdc`, `AGENTS.md`, `agent-contract.txt` |
| Новый skill | `.cursor/skills/<name>/SKILL.md`, `AGENTS.md`, эта таблица |
| Audit кода репо | `fluxalloy-agent.mdc`, `scripts/audit-scope.config.mjs`, `docs/audit-manifest.json`, `npm run audit:inventory` + `audit:inventory-sync`; при затронутых путях — `audit:structural` / `audit:copy-paste` |
| Продуктовый код: IPC / main / preload | `fluxalloy-electron.mdc`, `fluxalloy-react.mdc`, `src/shared/ipc-channels.ts`, main + preload + renderer + тесты, `docs/ARCHITECTURE.md` |
| UI / copy / Help / packaged e2e / terminal hints | доменные `src/**`, `tests/**`, `Help/**`, `locales/**`; guards перечислены в `npm run check:quiet` (`scripts/run-quiet-check.mjs`) — не дублировать полный список здесь |
| Renderer Zustand (§2.2) | `src/shared/renderer-state-approach.ts`, `src/renderer/src/stores/`, `docs/ARCHITECTURE.md` |
| Mini Player / smoke шаги | контракты и окна в `src/**`, JSON smoke и Help по чеклисту §4.3 / §19 |
| Docs / legacy links | `npm run check:docs-governance` в `check:quiet`; `audit:orphan-scripts` при чистке `scripts/` |
| Handoff (опционально) | `docs/AGENT_SESSION_HANDOFF.md` |
| Приоритет rules vs шапка | `fluxalloy-rules-explicit.mdc` → синхрон шапок `IMPLEMENTATION_*` при смене формата |
| Среда агента / ответ в чате | `fluxalloy-agent.mdc`, `agent-contract.txt` |
| Operational notes | `docs/AGENT_OPERATIONAL_NOTES.md` + затронутый код в `src/main` / renderer |

Help UiHintSuffix (AGENTS, 4 §15 anchors, 6 packaged) — `formatPackagedGuiE2ePlaywright*HelpUiHintSuffix`
