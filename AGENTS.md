# FluxAlloy — инструкции для агента

**Роль:** pragmatic senior engineer maintaining a real desktop application with limited complexity budget — [`fluxalloy-core.mdc`](.cursor/rules/fluxalloy-core.mdc).

**Toolchain:** Electron 42, Vite 8, TS 6, ESLint 9 — `package.json`; lock — `tests/shared/toolchain-baseline-package.test.ts` (журнал **J-1354**).

**Rules:** [`fluxalloy-rules-explicit.mdc`](.cursor/rules/fluxalloy-rules-explicit.mdc), [`fluxalloy-core.mdc`](.cursor/rules/fluxalloy-core.mdc), [`fluxalloy-agent.mdc`](.cursor/rules/fluxalloy-agent.mdc), [`fluxalloy-simplicity.mdc`](.cursor/rules/fluxalloy-simplicity.mdc).

**Skills:** [продолжай / +](.cursor/skills/fluxalloy-continue/SKILL.md), [journal-entry](.cursor/skills/fluxalloy-journal-entry/SKILL.md), [checklist-audit](.cursor/skills/fluxalloy-checklist-audit/SKILL.md), [release](.cursor/skills/fluxalloy-release/SKILL.md).

**Индекс:** [`docs/SOURCES_OF_TRUTH.md`](docs/SOURCES_OF_TRUTH.md) · [`IMPLEMENTATION_CHECKLIST.md`](IMPLEMENTATION_CHECKLIST.md) · [`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md) · [`FLUXALLOY_TZ.md`](FLUXALLOY_TZ.md) (без правок без явной просьбы) · SDK [`agent-contract.txt`](scripts/cursor-automation/prompts/agent-contract.txt)

**Проверки:** `npm run check:quiet` — **35** шагов (lint, typecheck, Vitest, doc guards, `check:scripts-wiring`); снимок **263** test files / **1860** tests — [`IMPLEMENTATION_CHECKLIST.md`](IMPLEMENTATION_CHECKLIST.md) (`snap.17`, Vitest lock). Help §15: 44 workflow — user footer (`formatPackagedE2eHelpWorkflowCrosslinksWorkflowUserFooter`); dev §21 — owner/about/logging; sync `node scripts/maint/sync-help-workflow-user-footers.mjs`. После локального `npm run build` — вернуть `src/shared/app-build-info.json` → `dev` ([`docs/RELEASE.md`](docs/RELEASE.md) §1). `npm run audit:moderate` не в `check:quiet` — [`docs/RELEASE.md`](docs/RELEASE.md) §1.

**Git по J-NNN:** `NNN % 5` → commit, `NNN % 10` → push (любой чат); **следующий commit по J** **J-1580**, **следующий push по J** **J-1580** — [`fluxalloy-agent.mdc`](.cursor/rules/fluxalloy-agent.mdc).

**§19 signing · §21 Help:** канон — [`docs/RELEASE.md`](docs/RELEASE.md) §1/§4; карта — [`docs/SOURCES_OF_TRUTH.md`](docs/SOURCES_OF_TRUTH.md); lock — `tests/shared/toolchain-baseline-package.test.ts`.

## Cursor Cloud

Node 24 (nvm), npm; корневой [`.npmrc`](.npmrc) — `legacy-peer-deps=true` ([`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) § npm). Lint/typecheck/audits на Linux VM — команды в `package.json` / README.

**Тесты:** канонический gate — CI **`windows-latest`**; на Linux часть путей `*.exe` / `win-unpacked` может отличаться.

**Dev:** `electron.vite.config.ts` — плагин `fix:esm-shim` (ложный static import в `renderer-state-approach.ts`). Electron: `xvfb-run --auto-servernum npm run dev`.
