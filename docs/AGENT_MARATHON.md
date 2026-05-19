# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1250)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-19 |
| Ветка | `main` @ `8c9db6d` (cadence commit+push J-1245..1250) |
| Снимок тестов | **273** files / **1827** tests |
| Спринт | §18 Support ZIP `terminalHints:` + 7 terminal guards + 12 Help; Settings/About ZIP aria; owner-smoke на железе; GUI Playwright позже |

**Последние J:** [J-1252](../IMPLEMENTATION_JOURNAL.md) packaged smoke Help 20 статей; [J-1253](../IMPLEMENTATION_JOURNAL.md) faq-troubleshooting guard 22; [J-1254](../IMPLEMENTATION_JOURNAL.md) owner-manual-smoke guard 24.

**Следующий cadence:** push + re-anchor **J-1260** (commit **J-1255** — локально).

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
