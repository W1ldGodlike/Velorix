# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1150)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-18 |
| Ветка | `main` |
| Снимок тестов | **250** files / **1745** tests |
| Спринт | owner-smoke §16; §2.2 locales + export preview hints [~]; Mini Player §4.3; macOS/Linux §19; e2e §21 |

**Последние J:** [J-1148](../IMPLEMENTATION_JOURNAL.md#j-1148) export preview hint keys + locale guard; [J-1149](../IMPLEMENTATION_JOURNAL.md#j-1149) `editor-export-preview-hint-resolve`; [J-1150](../IMPLEMENTATION_JOURNAL.md#j-1150) cadence commit/push J-1146..1149.

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
