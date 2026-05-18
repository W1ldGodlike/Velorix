# FluxAlloy — инструкции для агента

**Всегда (rules):** [`fluxalloy-rules-explicit.mdc`](.cursor/rules/fluxalloy-rules-explicit.mdc), [`fluxalloy-core.mdc`](.cursor/rules/fluxalloy-core.mdc), [`fluxalloy-agent.mdc`](.cursor/rules/fluxalloy-agent.mdc).

**Skills (по задаче):** [marathon](.cursor/skills/fluxalloy-marathon/SKILL.md), [journal-entry](.cursor/skills/fluxalloy-journal-entry/SKILL.md), [checklist-audit](.cursor/skills/fluxalloy-checklist-audit/SKILL.md), [release](.cursor/skills/fluxalloy-release/SKILL.md).

**Индекс:** [`docs/SOURCES_OF_TRUTH.md`](docs/SOURCES_OF_TRUTH.md) · **Marathon:** [`docs/AGENT_MARATHON.md`](docs/AGENT_MARATHON.md) · **Спринт:** [`IMPLEMENTATION_CHECKLIST.md`](IMPLEMENTATION_CHECKLIST.md) · **Журнал:** [`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md) · **ТЗ:** [`FLUXALLOY_TZ.md`](FLUXALLOY_TZ.md) (без правок без явной просьбы) · **SDK:** [`agent-contract.txt`](scripts/cursor-automation/prompts/agent-contract.txt)

**Проверки:** `npm run check:quiet` перед cadence-commit (`J-NNN`: `NNN % 5` commit, `NNN % 10` push); полный `npm run check` — релиз или по запросу.
