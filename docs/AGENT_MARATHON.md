# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1230)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-19 |
| Ветка | `main` (cadence commit+push J-1226..1230) |
| Снимок тестов | **267** files / **1808** tests |
| Спринт | §21 crosslinks meta (34+6+8, formatters, 4 Help guards); owner-smoke на железе; GUI Playwright позже |

**Последние J:** [J-1228](../IMPLEMENTATION_JOURNAL.md) diagnostic line + `OWNER_GUARD_HELP_PATHS`; [J-1229](../IMPLEMENTATION_JOURNAL.md) bin/README dev line + owner guard Vitest; [J-1230](../IMPLEMENTATION_JOURNAL.md) cadence commit+push J-1226..1230, ARCHITECTURE/RELEASE.

**Следующий cadence:** commit **J-1235** (J-1231..1235); push + re-anchor **J-1240**.

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
