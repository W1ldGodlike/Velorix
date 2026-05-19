# Marathon — snapshot

Процедура итерации: skill [`.cursor/skills/fluxalloy-marathon/SKILL.md`](../.cursor/skills/fluxalloy-marathon/SKILL.md). Cadence Git и журнал: [`.cursor/rules/fluxalloy-agent.mdc`](../.cursor/rules/fluxalloy-agent.mdc), глоссарий [`.cursor/rules/fluxalloy-rules-explicit.mdc`](../.cursor/rules/fluxalloy-rules-explicit.mdc).

**Счётчик loop:** `npm run agent:session -- bump` → `docs/.agent-session.json`. **Не** триггер Git.

## Re-anchor (J-1350)

| Поле | Значение |
| --- | --- |
| Дата | 2026-05-20 |
| Ветка | `main` @ `1a18b6a` (cadence J-1349..1350: governance prompts, SOURCES, rules, AGENT_GOVERNANCE plan, AGENTS/README cadence override) |
| Снимок тестов | **276** files / **1854** tests |
| Спринт | §21 Help/guards [x]; GUI Playwright [~]; owner-smoke / packaged mac+linux на железе — владелец |

**Последние J:** [J-1348](../IMPLEMENTATION_JOURNAL.md) governance plan §13; [J-1349](../IMPLEMENTATION_JOURNAL.md) governance пакеты 1–2; [J-1350](../IMPLEMENTATION_JOURNAL.md) governance пакет 3 + validation.

**Следующий cadence:** push + re-anchor **J-1360**.

## Новый чат

«продолжай» / `+` — см. skill marathon. Handoff по просьбе владельца: [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md). SDK: [`continue.txt`](../scripts/cursor-automation/prompts/continue.txt).
