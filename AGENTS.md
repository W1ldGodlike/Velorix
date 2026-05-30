# Velorix — инструкции для агента

**Роль:** pragmatic senior engineer maintaining a real desktop application with limited complexity budget — [`velorix-core.mdc`](.cursor/rules/velorix-core.mdc).

**Toolchain:** Electron 42, Vite 8, TS 6, ESLint 9 — `package.json`; lock — `tests/shared/toolchain-baseline-package.test.ts` (журнал **J-1354**).

**Rules:** [`velorix-rules-explicit.mdc`](.cursor/rules/velorix-rules-explicit.mdc), [`velorix-core.mdc`](.cursor/rules/velorix-core.mdc), [`velorix-agent.mdc`](.cursor/rules/velorix-agent.mdc), [`velorix-no-git-restore.mdc`](.cursor/rules/velorix-no-git-restore.mdc) (**блокер:** ничего не восстанавливать из git без явной просьбы владельца), [`velorix-simplicity.mdc`](.cursor/rules/velorix-simplicity.mdc) — **удалять** legacy, который мешает задаче; не копить из осторожности.

**Skills:** [продолжай / +](.cursor/skills/velorix-continue/SKILL.md), [journal-entry](.cursor/skills/velorix-journal-entry/SKILL.md), [checklist-audit](.cursor/skills/velorix-checklist-audit/SKILL.md), [release](.cursor/skills/velorix-release/SKILL.md).

**Работа агента (UI/UX):** [`docs/VELORIX_NEON_THEME.md`](docs/VELORIX_NEON_THEME.md) — NEON, Phase D, refs 1–27 **строго по порядку** (сейчас **только ref.1** до 1:1 vs PNG); sprint — [`docs/IMPLEMENTATION_NEON_CHECKLIST.md`](docs/IMPLEMENTATION_NEON_CHECKLIST.md).

**Индекс:** [`docs/SOURCES_OF_TRUTH.md`](docs/SOURCES_OF_TRUTH.md) · [`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md) · [`docs/IMPLEMENTATION_NEON_CHECKLIST.md`](docs/IMPLEMENTATION_NEON_CHECKLIST.md) · [`docs/archive/`](docs/archive/) (старые ТЗ/чеклист — **не** навигатор) · SDK [`agent-contract.txt`](scripts/cursor-automation/prompts/agent-contract.txt)

**Проверки:** `npm run check:quiet` — один `[check:quiet] OK` при успехе; шаги — `CHECK_QUIET_VERBOSE=1`. `npm run test` — `[test] OK (…)` или полный вывод при падении. **ref.1 visual sign-off:** `npm run build` → `npm run neon:ref:visual ref1` (артефакты `.neon-ref-visual/latest/`; подробности — `VELORIX_REF_VISUAL_VERBOSE=1`). Demo PNG ref.1: `docs/reference/velorix-neon-ref1-demo-*.png`; thumbs — `npm run ref1:demo:thumbs`. Снимок **247** test files / **1794** tests — NEON-чеклист `snap.3`.

**Git author (локально, без `--global`):** `user.name` **W1ldGodlike**, `user.email` **W1ld.Godlike@gmail.com**.

**Git по J-NNN:** `NNN % 5` → commit, `NNN % 10` → push (любой чат); **следующий commit по J** **J-1735**, **следующий push по J** **J-1740** — [`velorix-agent.mdc`](.cursor/rules/velorix-agent.mdc).

**§19 signing · §21 Help:** канон — [`docs/RELEASE.md`](docs/RELEASE.md) §1/§4; карта — [`docs/SOURCES_OF_TRUTH.md`](docs/SOURCES_OF_TRUTH.md); lock — `tests/shared/toolchain-baseline-package.test.ts`.

## Cursor Cloud

Node 24 (nvm), npm; корневой [`.npmrc`](.npmrc) — `legacy-peer-deps=true` ([`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) § npm). Lint/typecheck/audits на Linux VM — команды в `package.json` / README.

**Тесты:** канонический gate — CI **`windows-latest`**; на Linux часть путей `*.exe` / `win-unpacked` может отличаться.

**Dev:** `electron.vite.config.ts` — плагин `fix:esm-shim` (ложный static import в `renderer-state-approach.ts`). Electron: `xvfb-run --auto-servernum npm run dev`.
