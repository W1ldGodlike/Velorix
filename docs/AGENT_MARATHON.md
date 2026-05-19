# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1260)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-19 |
| Ветка | `main` @ cadence commit J-1256..1259 (push J-1260) |
| Снимок тестов | **273** files / **1829** tests |
| Спринт | §8 Help 24 статей + meta formatters (logging/about/ffmpeg/tools); About ZIP hint 24 Help; owner-smoke на железе; GUI Playwright позже |

**Последние J:** [J-1257](../IMPLEMENTATION_JOURNAL.md) about-support `terminalHints:` bullet; [J-1258](../IMPLEMENTATION_JOURNAL.md) About ZIP hint + HW Help; [J-1259](../IMPLEMENTATION_JOURNAL.md) ffmpeg/tools Help 24 guards sync.

**Следующий cadence:** commit **J-1265**; push + re-anchor **J-1270**.

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
