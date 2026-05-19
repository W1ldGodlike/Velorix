# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1280)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-19 |
| Ветка | `main` @ `7be4b9a` (cadence commit+push J-1276..1279, J-1280) |
| Снимок тестов | **273** files / **1834** tests |
| Спринт | §15 Help crosslinks **44** (`HelpCrosslinksCountTail`, `PackagedCrosslinksQuietSuffix`, packaged linux/macos); §8 `terminalHints:` guards 24 Help; owner-smoke на железе; GUI Playwright §21 позже |

**Последние J:** [J-1278](../IMPLEMENTATION_JOURNAL.md) downloads-workflow 44 tail; [J-1279](../IMPLEMENTATION_JOURNAL.md) SOURCES/ARCHITECTURE formatters; [J-1280](../IMPLEMENTATION_JOURNAL.md) cadence commit+push J-1276..1279.

**Следующий cadence:** commit **J-1285**; push + re-anchor **J-1290**.

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
