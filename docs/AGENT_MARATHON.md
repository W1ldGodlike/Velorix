# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1310)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-19 |
| Ветка | `main` @ `5df4e29` (cadence `e075989` J-1306..1310 + re-anchor J-1310; rebase на `d2dbe99`; prior `0a6e246` J-1305) |
| Снимок тестов | **273** files / **1833** tests |
| Спринт | §21 registry/guards + `partition:` во всех **44** workflow [x]; GUI Playwright (8 steps) [ ]; §8 `terminalHints:` 24 Help; owner-smoke/packaged на железе — владелец |

**Последние J:** [J-1308](../IMPLEMENTATION_JOURNAL.md) AgentsMd/registry formatters; [J-1309](../IMPLEMENTATION_JOURNAL.md) README `RootReadmePartitionLine`; [J-1310](../IMPLEMENTATION_JOURNAL.md) cadence commit+push J-1306..1310.

**Следующий cadence:** commit **J-1315**; push + re-anchor **J-1320**.

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
