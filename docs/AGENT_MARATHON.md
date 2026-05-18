# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1185)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-19 |
| Ветка | `main` (cadence commit J-1181..1185) |
| Снимок тестов | **264** files / **1781** tests |
| Спринт | §21 per-step e2e + registry↔CI; Help/guards/locales; §19 releaseSmoke; приёмка на железе; GUI Playwright позже |

**Последние J:** [J-1183](../IMPLEMENTATION_JOURNAL.md) packaged Help×6 + owner intro; [J-1184](../IMPLEMENTATION_JOURNAL.md) `PACKAGED_E2E_CI_SMOKE_SCRIPTS` ↔ `ci.yml`; [J-1185](../IMPLEMENTATION_JOURNAL.md) cadence commit J-1181..1185.

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
