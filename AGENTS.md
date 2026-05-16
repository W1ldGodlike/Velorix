# FluxAlloy — инструкции для агента

Краткая карта (подробности — в linked files):

1. **Всегда:** [`.cursor/rules/fluxalloy-core.mdc`](.cursor/rules/fluxalloy-core.mdc), [`fluxalloy-marathon.mdc`](.cursor/rules/fluxalloy-marathon.mdc)
2. **Иерархия без противоречий:** [`docs/SOURCES_OF_TRUTH.md`](docs/SOURCES_OF_TRUTH.md)
3. **Marathon / «продолжай»:** [`docs/AGENT_REANCHOR.md`](docs/AGENT_REANCHOR.md) — re-anchor каждые **10**, коммит каждые **5**, push каждые **10**, журнал **каждую** итерацию
4. **Продукт:** [`FLUXALLOY_TZ.md`](FLUXALLOY_TZ.md) (не править без просьбы)
5. **Спринт:** [`IMPLEMENTATION_CHECKLIST.md`](IMPLEMENTATION_CHECKLIST.md) → `## Ближайший TODO спринта`
6. **Журнал:** [`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md) — одна сводная `J-*` / итерация
7. **Справочник:** [`docs/AGENT_INSTRUCTIONS_AND_AGREEMENTS.md`](docs/AGENT_INSTRUCTIONS_AND_AGREEMENTS.md)
8. **SDK:** [`scripts/cursor-automation/prompts/agent-contract.txt`](scripts/cursor-automation/prompts/agent-contract.txt)

Проверки: `npm run check:quiet` перед коммитом; полный `npm run check` при необходимости.
