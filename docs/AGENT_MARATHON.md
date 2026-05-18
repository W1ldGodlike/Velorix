# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1160)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-19 |
| Ветка | `main` |
| Снимок тестов | **256** files / **1760** tests |
| Спринт | owner-smoke §16 (hub+packaged, приёмка владельца); §2.2 locales [~]; Mini Player §4.3 [x] код; §19 parity guard [~]; e2e §21 |

**Последние J:** [J-1158](../IMPLEMENTATION_JOURNAL.md) packaged `Step_mini_player`; [J-1159](../IMPLEMENTATION_JOURNAL.md) `check:packaged-manual-smoke-parity`; [J-1160](../IMPLEMENTATION_JOURNAL.md) cadence commit/push J-1156..1159.

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
