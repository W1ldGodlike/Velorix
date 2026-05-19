# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1235)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-19 |
| Ветка | `main` (cadence commit J-1231..1235) |
| Снимок тестов | **268** files / **1812** tests |
| Спринт | §21 crosslinks meta + snippet registries + `help-smoke-docs-check` + 4 Help guards (quiet: registry→workflow→owner→packaged); owner-smoke на железе; GUI Playwright позже |

**Последние J:** [J-1233](../IMPLEMENTATION_JOURNAL.md) `check:help-smoke-guards-package-json`; [J-1234](../IMPLEMENTATION_JOURNAL.md) quiet step order + bin/README guards; [J-1235](../IMPLEMENTATION_JOURNAL.md) cadence commit J-1231..1235, ARCHITECTURE.

**Следующий cadence:** commit **J-1240** (J-1236..1240); push + re-anchor **J-1240**.

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
