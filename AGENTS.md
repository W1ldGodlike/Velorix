# FluxAlloy — инструкции для агента

Краткая карта (подробности — в linked files):

1. **Всегда:** [`fluxalloy-rules-explicit.mdc`](.cursor/rules/fluxalloy-rules-explicit.mdc), [`fluxalloy-core.mdc`](.cursor/rules/fluxalloy-core.mdc), [`fluxalloy-agent-runtime.mdc`](.cursor/rules/fluxalloy-agent-runtime.mdc), [`fluxalloy-marathon.mdc`](.cursor/rules/fluxalloy-marathon.mdc), [`fluxalloy-iteration-batch.mdc`](.cursor/rules/fluxalloy-iteration-batch.mdc), [`fluxalloy-project-audit.mdc`](.cursor/rules/fluxalloy-project-audit.mdc), [`fluxalloy-ui-surfaces.mdc`](.cursor/rules/fluxalloy-ui-surfaces.mdc).
2. **Иерархия:** [`docs/SOURCES_OF_TRUTH.md`](docs/SOURCES_OF_TRUTH.md)
3. **Marathon / «продолжай»:** [`docs/AGENT_MARATHON.md`](docs/AGENT_MARATHON.md) — `bump` в конце; cadence **после** bump: коммит при `% 5 === 0`, push при `% 10 === 0`
4. **Продукт:** [`FLUXALLOY_TZ.md`](FLUXALLOY_TZ.md) — **запрещено** правки без явной просьбы владельца в чате
5. **Спринт:** [`IMPLEMENTATION_CHECKLIST.md`](IMPLEMENTATION_CHECKLIST.md) → `## Ближайший TODO спринта`
6. **Журнал:** [`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md) — **одна** `J-NNN` на итерацию
7. **Operational notes:** [`docs/AGENT_OPERATIONAL_NOTES.md`](docs/AGENT_OPERATIONAL_NOTES.md) — CSP, медиа, yt-dlp (открывать при отладке)
8. **SDK:** [`scripts/cursor-automation/prompts/agent-contract.txt`](scripts/cursor-automation/prompts/agent-contract.txt)

**Проверки:** `npm run check:quiet` перед коммитом marathon (audit-скрипты + `check:rules-explicit` + `check:ui-surfaces-guard`). Полный `npm run check` — перед релизом или по запросу владельца.
