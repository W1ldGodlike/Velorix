# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1320)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-19 |
| Ветка | `main` @ `27a3d2b` (cadence J-1316..1320 §21 Playwright deferred) |
| Снимок тестов | **276** files / **1840** tests |
| Спринт | §21 registry/guards + Help (owner/about/packaged/logging) + `check:packaged-gui-e2e-playwright-deferred` [x]; GUI Playwright `test:e2e:gui` в package.json [ ]; owner-smoke/packaged на железе — владелец |

**Последние J:** [J-1318](../IMPLEMENTATION_JOURNAL.md) packaged Help Playwright; [J-1319](../IMPLEMENTATION_JOURNAL.md) help-smoke-guards registry/quiet order; [J-1320](../IMPLEMENTATION_JOURNAL.md) cadence commit+push J-1316..1320.

**Следующий cadence:** commit **J-1325**.

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
