# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1330)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-19 |
| Ветка | `main` @ `2188aa9` (cadence J-1326..1330 §21 Playwright UI registry/docs) |
| Снимок тестов | **276** files / **1851** tests |
| Спринт | §21 UI hints settings/owner/about/ARCHITECTURE/RELEASE/bin [x]; `test:e2e:gui` в package.json [ ]; owner-smoke/packaged на железе — владелец |

**Последние J:** [J-1328](../IMPLEMENTATION_JOURNAL.md) RELEASE Playwright bullets; [J-1329](../IMPLEMENTATION_JOURNAL.md) bin/README + RELEASE copy; [J-1330](../IMPLEMENTATION_JOURNAL.md) cadence commit+push J-1326..1330.

**Следующий cadence:** commit **J-1335**.

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
