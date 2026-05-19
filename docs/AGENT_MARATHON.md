# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1270)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-19 |
| Ветка | `main` @ `00f863b` (cadence commit+push J-1266..1269, J-1270) |
| Снимок тестов | **273** files / **1830** tests |
| Спринт | §8/§15 workflow Help `terminalHints:` (30 тем); crosslinks guard **44** + `terminalHints:` snippets; `formatPackagedE2eHelpWorkflowCrosslinksLoggingClause`; owner-smoke на железе; GUI Playwright позже |

**Последние J:** [J-1268](../IMPLEMENTATION_JOURNAL.md) docs 44 workflow; [J-1269](../IMPLEMENTATION_JOURNAL.md) §8↔§21 logging DRY; [J-1270](../IMPLEMENTATION_JOURNAL.md) cadence commit+push J-1266..1269.

**Следующий cadence:** commit **J-1275**; push + re-anchor **J-1280**.

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
