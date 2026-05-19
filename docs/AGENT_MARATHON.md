# Marathon: «продолжай» / SDK loop

**Когда:** «продолжай», `+`, `npm run agent:loop`.

**Исполняемое и cadence:** project skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md) + [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc) + глоссарий [`fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`). **Не** триггер Git.

**Git cadence** (любой чат, не только marathon): новая **J-NNN** → `NNN % 5` commit, `NNN % 10` push + re-anchor после `check:quiet` — [`fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий.

**Журнал:** одна **J** только если в итерации был diff в репо — skill [`fluxalloy-journal-entry`](../.cursor/skills/fluxalloy-journal-entry/SKILL.md).

## Re-anchor (J-1290)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-19 |
| Ветка | `main` @ `e1e6f3e` (cadence commit+push J-1286..1289, J-1290) |
| Снимок тестов | **273** files / **1834** tests |
| Спринт | §15/§21 workflow **44** (partition: tail 42 + ffmpeg + knowledge; FAQ вне 44); §8 `terminalHints:` 24 Help; `bin/README` partition; owner-smoke на железе; GUI Playwright позже |

**Последние J:** [J-1292](../IMPLEMENTATION_JOURNAL.md) `FfmpegTerminalWorkflowClause`; [J-1293](../IMPLEMENTATION_JOURNAL.md) `bin/README` partition; [J-1294](../IMPLEMENTATION_JOURNAL.md) `README.md`/`AGENTS.md` §21 guards.

**Следующий cadence:** commit **J-1295**; push + re-anchor **J-1300**.

## Новый чат

«продолжай» / `+` достаточно. Handoff: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK prompt: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
