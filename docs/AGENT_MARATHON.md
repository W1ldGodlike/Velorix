# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1200)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-19 |
| Ветка | `main` (cadence commit+push J-1196..1200) |
| Снимок тестов | **266** files / **1785** tests |
| Спринт | Help §21 crosslinks guard **26** статей; owner-smoke на железе; GUI Playwright §21 позже; §19 packaged mac/linux приёмка — владелец |

**Последние J:** [J-1198](../IMPLEMENTATION_JOURNAL.md) processing-history/shell Help; [J-1199](../IMPLEMENTATION_JOURNAL.md) dragdrop/terminal-hints Help; [J-1200](../IMPLEMENTATION_JOURNAL.md) cadence commit+push J-1196..1200.

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
