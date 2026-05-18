# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1175)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-19 |
| Ветка | `main` (cadence commit J-1171..1175) |
| Снимок тестов | **264** files / **1775** tests |
| Спринт | §21 e2e registry + owner bundle/Help/UI; приёмка на железе; §19 macOS/Linux; GUI e2e позже |

**Последние J:** [J-1173](../IMPLEMENTATION_JOURNAL.md) UI e2e guard hints; [J-1174](../IMPLEMENTATION_JOURNAL.md) owner bundle §21 appendix; [J-1175](../IMPLEMENTATION_JOURNAL.md) cadence commit J-1171..1175.

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
