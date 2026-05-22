# Velorix — инструкции для агента

**Роль:** pragmatic senior engineer maintaining a real desktop application with limited complexity budget — [`velorix-core.mdc`](.cursor/rules/velorix-core.mdc).

**Toolchain:** Electron 42, Vite 8, TS 6, ESLint 9 — `package.json`; lock — `tests/shared/toolchain-baseline-package.test.ts` (журнал **J-1354**).

**Rules:** [`velorix-rules-explicit.mdc`](.cursor/rules/velorix-rules-explicit.mdc), [`velorix-core.mdc`](.cursor/rules/velorix-core.mdc), [`velorix-agent.mdc`](.cursor/rules/velorix-agent.mdc), [`velorix-simplicity.mdc`](.cursor/rules/velorix-simplicity.mdc).

**Skills:** [продолжай / +](.cursor/skills/velorix-continue/SKILL.md), [journal-entry](.cursor/skills/velorix-journal-entry/SKILL.md), [checklist-audit](.cursor/skills/velorix-checklist-audit/SKILL.md), [release](.cursor/skills/velorix-release/SKILL.md).

**Индекс:** [`docs/SOURCES_OF_TRUTH.md`](docs/SOURCES_OF_TRUTH.md) · [`IMPLEMENTATION_CHECKLIST.md`](IMPLEMENTATION_CHECKLIST.md) · [`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md) · [`VELORIX_TZ.md`](VELORIX_TZ.md) (без правок без явной просьбы) · SDK [`agent-contract.txt`](scripts/cursor-automation/prompts/agent-contract.txt)

**Проверки:** `npm run check:quiet` — **35** шагов (lint, typecheck, Vitest, doc guards, `check:scripts-wiring`); снимок **260** test files / **1851** tests — [`IMPLEMENTATION_CHECKLIST.md`](IMPLEMENTATION_CHECKLIST.md) (`snap.17`, Vitest lock). Help §15: 44 workflow — user footer (`formatPackagedE2eHelpWorkflowCrosslinksWorkflowUserFooter`); dev §21 — owner/about/logging; sync `node scripts/maint/sync-help-workflow-user-footers.mjs`. После локального `npm run build` — вернуть `src/shared/app-build-info.json` → `dev` ([`docs/RELEASE.md`](docs/RELEASE.md) §1). `npm run audit:moderate` не в `check:quiet` — [`docs/RELEASE.md`](docs/RELEASE.md) §1.

**Git по J-NNN:** `NNN % 5` → commit, `NNN % 10` → push (любой чат); **следующий commit по J** **J-1610**, **следующий push по J** **J-1610** — [`velorix-agent.mdc`](.cursor/rules/velorix-agent.mdc).

**§19 signing · §21 Help:** канон — [`docs/RELEASE.md`](docs/RELEASE.md) §1/§4; карта — [`docs/SOURCES_OF_TRUTH.md`](docs/SOURCES_OF_TRUTH.md); lock — `tests/shared/toolchain-baseline-package.test.ts`.

## Cursor Cloud

Node 24 (nvm), npm; корневой [`.npmrc`](.npmrc) — `legacy-peer-deps=true` ([`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) § npm). Lint/typecheck/audits на Linux VM — команды в `package.json` / README.

**Тесты:** канонический gate — CI **`windows-latest`**; на Linux часть путей `*.exe` / `win-unpacked` может отличаться.

**Dev:** `electron.vite.config.ts` — плагин `fix:esm-shim` (ложный static import в `renderer-state-approach.ts`). Electron: `xvfb-run --auto-servernum npm run dev`.
