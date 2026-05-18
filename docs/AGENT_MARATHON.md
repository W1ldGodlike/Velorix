# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1165)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-19 |
| Ветка | `main` |
| Снимок тестов | **260** files / **1768** tests |
| Спринт | owner-smoke locales RU+EN (theme/HiDPI/packaged); guards parity/visual/platform; приёмка на железе; §19 packaging; e2e §21 |

**Последние J:** [J-1163](../IMPLEMENTATION_JOURNAL.md) packaged UI copy plain-text; [J-1164](../IMPLEMENTATION_JOURNAL.md) `check:platform-packaging-scripts`; [J-1165](../IMPLEMENTATION_JOURNAL.md) cadence commit J-1161..1164.

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
