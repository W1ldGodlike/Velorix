# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1240)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-19 |
| Ветка | `main` @ `e2246c1` (cadence commit+push J-1236..1240) |
| Снимок тестов | **272** files / **1823** tests |
| Спринт | §8 `terminal-contract-hints-meta` + 6 terminal guards в `check:quiet` + UI/locales hint; owner-smoke на железе; GUI Playwright позже |

**Последние J:** [J-1238](../IMPLEMENTATION_JOURNAL.md) `appSettingsTerminalHintsGuardHint` + `check:terminal-hints-locale`; [J-1239](../IMPLEMENTATION_JOURNAL.md) about-support + bin/README DRY; [J-1240](../IMPLEMENTATION_JOURNAL.md) cadence commit+push J-1236..1240, re-anchor.

**Следующий cadence:** commit **J-1245**; push + re-anchor **J-1250**.

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
