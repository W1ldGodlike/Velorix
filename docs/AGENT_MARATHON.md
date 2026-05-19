# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1300)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-19 |
| Ветка | `main` @ `PLACEHOLDER_HASH` (cadence commit+push J-1296..1300, J-1300) |
| Снимок тестов | **273** files / **1834** tests |
| Спринт | §15/§21 workflow **44** (partition в formatters: packaged/settings/logging/about); §8 `terminalHints:` 24 Help; owner-smoke на железе; GUI Playwright позже |

**Последние J:** [J-1298](../IMPLEMENTATION_JOURNAL.md) logging `LoggingClause`; [J-1299](../IMPLEMENTATION_JOURNAL.md) about-support partition; [J-1300](../IMPLEMENTATION_JOURNAL.md) cadence commit+push J-1296..1300.

**Следующий cadence:** commit **J-1305**; push + re-anchor **J-1310**.

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
