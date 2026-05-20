---
name: fluxalloy-marathon
description: Runs FluxAlloy marathon iterations (продолжай, agent loop, SDK). Sprint TODO, крупный срез, check quiet, J cadence commit every 5 and push every 10, re-anchor, agent session bump.
---

# Marathon (FluxAlloy)

## Когда применять

Пользователь написал «продолжай» / `+`, или `npm run agent:loop`, или шаг SDK automation.

## Каждая итерация

1. `IMPLEMENTATION_CHECKLIST.md` → `## Ближайший TODO спринта`.
2. Один § `FLUXALLOY_TZ.md` при продуктовой работе; ТЗ без запроса владельца не править.
3. **Крупный срез** (глоссарий: прогресс sprint **или** `src/`/`tests/` + зелёный quiet).
4. `npm run check:quiet` → exit 0 до Git cadence.
5. **Если diff в репо:** `npm run journal:stamp` → одна строка `J-NNN` (skill `fluxalloy-journal-entry`).
6. `npm run agent:session -- bump` — последний шаг.

## Cadence Git (по номеру J)

После записи `J-NNN` в журнал (**любой** чат — Cursor, marathon, SDK):

| Условие | Действие |
| --- | --- |
| `NNN % 5 === 0` и quiet зелёный | `git commit` (полное сообщение-предложение) |
| `NNN % 10 === 0` | также `git push` (без force main/master), re-anchor |
| Календарь `J%5` / `J%10` | Таблица re-anchor в [`docs/AGENT_MARATHON.md`](../../../docs/AGENT_MARATHON.md), поле **Следующий cadence** (**J-1560** commit; J-1440 push отложен — владелец: «commit»/«push») |
| WIP toolchain + docs | §Pre-commit + §Cadence J-1380 в [`docs/AGENT_MARATHON.md`](../../../docs/AGENT_MARATHON.md); **27**+ paths, gate **J-1440**; `main` @ `ac5821c` до commit |

**Re-anchor:** обнови таблицу в `docs/AGENT_MARATHON.md`; в отчёте **`re-anchor OK`**. `docs/SOURCES_OF_TRUTH.md` и блок `## Ближайший TODO` — только если менялась иерархия §1 `SOURCES_OF_TRUTH`, список skills в `AGENTS.md`, **или снимок Vitest** (стр. «Vitest snapshot (Windows gate)» в Карте синхронизации `SOURCES_OF_TRUTH`).

## Запрещено

Микро-J, микро-срез, drive-by, `prettier .` по всему репо, выдуманные метки времени в журнале, HTML pop-out, параллельные UI-строки вне `ui-text`/`locales/**`.

## Ссылки

[`docs/AGENT_MARATHON.md`](../../../docs/AGENT_MARATHON.md). Глоссарий: `.cursor/rules/fluxalloy-rules-explicit.mdc`. Cadence в rules: `fluxalloy-agent.mdc`.
