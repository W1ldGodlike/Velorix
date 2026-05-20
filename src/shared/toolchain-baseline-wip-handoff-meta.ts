/**
 * WIP baseline handoff (toolchain + docs до push на main).
 * Leaf-модуль без импортов (Node ESM из scripts/*.mjs и Vitest).
 */

export const TOOLCHAIN_BASELINE_WIP_PATH_COUNT = 27 as const
export const TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE = 'J-1353..1556' as const
export const TOOLCHAIN_BASELINE_WIP_GATE = 'J-1440' as const
export const TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE = 'J-1560' as const
export const TOOLCHAIN_BASELINE_WIP_MAIN_SHA = 'ac5821c' as const

function formatToolchainBaselineWipHandoffMarkdownPathLabel(): string {
  return `**${TOOLCHAIN_BASELINE_WIP_PATH_COUNT}**+`
}

function formatToolchainBaselineWipHandoffPlainPathLabel(): string {
  return `${TOOLCHAIN_BASELINE_WIP_PATH_COUNT}+`
}

/** RELEASE.md §1 WIP baseline paragraph. */
export function formatToolchainBaselineWipHandoffReleaseParagraph(): string {
  return `**WIP baseline (до push):** незакоммиченный toolchain + docs (${formatToolchainBaselineWipHandoffMarkdownPathLabel()} paths, journal **${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE}**) — один commit по [\`docs/AGENT_MARATHON.md\`](AGENT_MARATHON.md) §Pre-commit (gate **${TOOLCHAIN_BASELINE_WIP_GATE}** push отложен; владелец: «commit»/«push»).`
}

/** AGENT_OPERATIONAL_NOTES.md WIP baseline commit cell. */
export function formatToolchainBaselineWipHandoffOperationalNotesCell(): string {
  return `${formatToolchainBaselineWipHandoffMarkdownPathLabel()} paths на \`main\` @ \`${TOOLCHAIN_BASELINE_WIP_MAIN_SHA}\`; journal **${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE}**; один commit — [\`docs/AGENT_MARATHON.md\`](AGENT_MARATHON.md) §Pre-commit (gate **${TOOLCHAIN_BASELINE_WIP_GATE}** push отложен; владелец: «commit»/«push»).`
}

/** fluxalloy-marathon SKILL.md WIP toolchain + docs row cell. */
export function formatToolchainBaselineWipHandoffMarathonSkillRow(): string {
  return `§Pre-commit + §Cadence J-1380 в [\`docs/AGENT_MARATHON.md\`](../../../docs/AGENT_MARATHON.md); ${formatToolchainBaselineWipHandoffMarkdownPathLabel()} paths, gate **${TOOLCHAIN_BASELINE_WIP_GATE}**; \`main\` @ \`${TOOLCHAIN_BASELINE_WIP_MAIN_SHA}\` до commit`
}

/** fluxalloy-core.mdc AGENT_MARATHON table WIP fragment. */
export function formatToolchainBaselineWipHandoffCoreMarathonWipFragment(): string {
  return `WIP (${formatToolchainBaselineWipHandoffMarkdownPathLabel()} paths, gate **${TOOLCHAIN_BASELINE_WIP_GATE}**)`
}

/** AGENTS.md Cadence override WIP line (without leading label). */
export function formatToolchainBaselineWipHandoffAgentsCadenceLine(): string {
  return `**WIP** (${formatToolchainBaselineWipHandoffPlainPathLabel()} paths, gate **${TOOLCHAIN_BASELINE_WIP_GATE}**, handoff freeze **J-1394**): [\`docs/AGENT_MARATHON.md\`](docs/AGENT_MARATHON.md) §Pre-commit; git отложен. **Следующий cadence** **${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE}** (commit); WIP push — по «push» (§Pre-commit; ${TOOLCHAIN_BASELINE_WIP_GATE} push отложен).`
}

/** README.md / SOURCES WIP markdown fragment (paths + gate). */
export function formatToolchainBaselineWipHandoffMarkdownPathsGateFragment(): string {
  return `WIP (${formatToolchainBaselineWipHandoffMarkdownPathLabel()} paths, gate **${TOOLCHAIN_BASELINE_WIP_GATE}**)`
}

/** agent-contract.txt WIP clause (plain). */
export function formatToolchainBaselineWipHandoffSdkContractClause(): string {
  return `WIP (${formatToolchainBaselineWipHandoffPlainPathLabel()} paths, gate ${TOOLCHAIN_BASELINE_WIP_GATE})`
}

/** agent-contract.txt — WIP journal span + next cadence commit (plain). */
export function formatToolchainBaselineWipHandoffSdkContractJournalCadenceFragment(): string {
  return `journal ${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE}; cadence ${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE} commit (${TOOLCHAIN_BASELINE_WIP_GATE} push отложен)`
}

/** agent-contract.txt Cadence override WIP line (plain). */
export function formatToolchainBaselineWipHandoffSdkContractWipCadenceClause(): string {
  return `${formatToolchainBaselineWipHandoffSdkContractClause()}; ${formatToolchainBaselineWipHandoffSdkContractJournalCadenceFragment()}; §Pre-commit + §Cadence J-1380 в docs/AGENT_MARATHON.md`
}

/** AGENT_MARATHON.md — Cadence J-1544 prep J-1545 commit-ready (historical; next cadence frozen at J-1545). */
export function formatToolchainBaselineWipHandoffMarathonCadenceJ1545PrepParagraph(): string {
  return 'Точка **J-1544** (prep **J-1545** commit): `check:quiet` зелёный (**280** / **1901**); SDK `agent-contract` `formatToolchainBaselineWipHandoffSdkContractJournalCadenceFragment`; §19 signing+packaging indexed (J-1511..1542); journal **J-1353..1542** + §Pre-commit heredoc. **`git commit` не выполнен** (владелец: «commit» в чате). **Следующий cadence:** **J-1545** (commit). **Push** — по «push» (J-1440 отложен).'
}

/** continue.txt / initial.txt WIP fragment (plain). */
export function formatToolchainBaselineWipHandoffSdkPromptWipFragment(): string {
  return `WIP (${formatToolchainBaselineWipHandoffPlainPathLabel()} paths)`
}

/** continue.txt / initial.txt — Wave 5 Dependabot sprint fragment. */
export function formatToolchainBaselineWipHandoffSdkPromptWave5DependabotFragment(): string {
  return '**Wave 5 Dependabot** [~]: docs `RELEASE` §1 + план; закрытие PR после push на `main` — `agent-contract.txt`, план §Git'
}

/** `IMPLEMENTATION_CHECKLIST.md` — sprint Wave 5 Dependabot bullet. */
export function formatToolchainBaselineWipHandoffChecklistSprintWave5Line(): string {
  return `- [~] Wave 5 Dependabot: push→gh §Git; cadence git отложен; «commit»/«push» → \`AGENT_MARATHON\` §Pre-commit (${formatToolchainBaselineWipHandoffPlainPathLabel()} paths, ${TOOLCHAIN_BASELINE_WIP_GATE}); **${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE}** commit / push по «push».`
}

/** `docs/SOURCES_OF_TRUTH.md` — sprint Wave 5 checklist index. */
export function formatToolchainBaselineWipHandoffSourcesSprintChecklistFragment(): string {
  return 'sprint Wave 5 bullet — formatToolchainBaselineWipHandoffChecklistSprintWave5Line; Vitest toolchain-baseline-governance.test.ts locks §19/§21/Wave5 checklist formatters'
}

/** continue.txt / initial.txt — sprint Wave 5 checklist fragment. */
export function formatToolchainBaselineWipHandoffSdkContinuePromptSprintChecklistWave5Fragment(): string {
  return `Sprint Wave5 checklist: formatToolchainBaselineWipHandoffChecklistSprintWave5Line (cadence ${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE}).`
}

/** `scripts/cursor-automation/README.md` — sprint Wave 5 checklist bullet. */
export function formatToolchainBaselineWipHandoffSdkAutomationReadmeChecklistSprintLine(): string {
  return `- Sprint Wave 5 (\`IMPLEMENTATION_CHECKLIST\`): \`formatToolchainBaselineWipHandoffChecklistSprintWave5Line\` (${formatToolchainBaselineWipHandoffPlainPathLabel()} paths; **${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE}**).`
}

/** scripts/cursor-automation/README.md WIP toolchain paragraph fragment. */
export function formatToolchainBaselineWipHandoffSdkReadmeWipFragment(): string {
  return `**WIP** toolchain + docs (${formatToolchainBaselineWipHandoffMarkdownPathLabel()} paths, gate **${TOOLCHAIN_BASELINE_WIP_GATE}**)`
}

/** SOURCES_OF_TRUTH.md priority-7 WIP fragment. */
export function formatToolchainBaselineWipHandoffSourcesPriority7Fragment(): string {
  return `**WIP** (${formatToolchainBaselineWipHandoffPlainPathLabel()} paths, gate **${TOOLCHAIN_BASELINE_WIP_GATE}**)`
}

/** docs/ARCHITECTURE.md § npm WIP baseline bullet. */
export function formatToolchainBaselineWipHandoffArchitectureClause(): string {
  return `- **WIP baseline (до push):** journal **${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE}**, ${formatToolchainBaselineWipHandoffMarkdownPathLabel()} paths — [\`toolchain-baseline-wip-handoff-meta.ts\`](../src/shared/toolchain-baseline-wip-handoff-meta.ts); commit/push — [\`AGENT_MARATHON.md\`](AGENT_MARATHON.md) §Pre-commit (gate **${TOOLCHAIN_BASELINE_WIP_GATE}** push отложен; **Следующий cadence** **${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE}** commit).`
}

/** check:release / Support ZIP diagnostic line. */
export function formatToolchainBaselineWipHandoffCheckReleaseDiagnosticLine(): string {
  return `WIP baseline handoff: toolchain-baseline-wip-handoff-meta.ts (${formatToolchainBaselineWipHandoffPlainPathLabel()} paths, journal ${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE}, gate ${TOOLCHAIN_BASELINE_WIP_GATE}; AGENT_MARATHON §Pre-commit)`
}

function formatToolchainBaselineWipHandoffDiagnosticsJournalSpan(): string {
  const end = TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE.split('..')[1]
  return end ? `J-1513..${end}` : 'J-1513..1521'
}

/** AGENT_MARATHON.md §Cadence J-1380 — WIP commit path scope (ориентир). */
export function formatToolchainBaselineWipHandoffPreCommitScopeParagraph(): string {
  return '**Охват WIP (ориентир):** `package.json` / `package-lock.json`, `tsconfig.web.json`, `.npmrc`, `electron-builder.yml`, `AGENTS.md`, `README.md`, `docs/{RELEASE,ARCHITECTURE,AGENT_MARATHON,SOURCES_OF_TRUTH,AGENT_OPERATIONAL_NOTES,TOOLCHAIN_BASELINE_UPGRADE_PLAN}.md`, `IMPLEMENTATION_{CHECKLIST,JOURNAL}.md`, `src/shared/{toolchain-baseline-wip-handoff-meta,release-code-signing-roadmap,packaged-gui-e2e-playwright-meta,platform-packaging-scripts,check-release-scripts}.ts`, `.cursor/rules/*`, `.cursor/skills/fluxalloy-marathon/SKILL.md`, `scripts/cursor-automation/{README,prompts/*}`, `tests/e2e/gui/{planned-gui-e2e-steps.ts,planned-gui-e2e-steps.test.ts}`, `tests/shared/{toolchain-baseline-governance,packaged-e2e-*,platform-packaging-scripts,check-release-scripts}*.test.ts`, `docs/audit-manifest.json`.'
}

/** AGENT_MARATHON.md §Handoff WIP — синхронизированные entry points (freeze J-1394). */
export function formatToolchainBaselineWipHandoffMarathonHandoffWipParagraph(): string {
  return 'Синхронизированы: `AGENTS.md`, `README.md`, `SOURCES_OF_TRUTH.md`, `RELEASE.md` §1/§4, `ARCHITECTURE.md`, `AGENT_OPERATIONAL_NOTES.md`, `bin/README.md`, `electron-builder.yml`, `release-code-signing-roadmap.ts` (§19 signing+packaging indexed J-1511..1545), `packaged-gui-e2e-playwright-meta.ts`, `toolchain-baseline-wip-handoff-meta.ts`, `fluxalloy-core.mdc`, `fluxalloy-agent.mdc`, `fluxalloy-checklist.mdc`, `fluxalloy-journal.mdc`, marathon `SKILL.md`, SDK prompts + `scripts/cursor-automation/README.md` + `agent-contract.txt` (sprint checklist indexed J-1546..1556; `MarathonCadenceJ1555Paragraph` + `MarathonCadenceJ1556JournalAlignParagraph`; prep `MarathonCadenceJ1560PrepParagraph`), план §Актуализация. Дальнейшие marathon-итерации без «commit» — только продуктовый код или явная просьба владельца.'
}

/** AGENT_MARATHON.md — Cadence J-1551 (§Pre-commit scope + Handoff WIP; frozen at J-1551). */
export function formatToolchainBaselineWipHandoffMarathonCadenceJ1551Paragraph(): string {
  return 'Точка **J-1551**: `check:quiet` зелёный (**280** / **1901**); `formatToolchainBaselineWipHandoffPreCommitScopeParagraph` (+ `packaged-gui-e2e-playwright-meta`, `planned-gui-e2e-steps`, governance tests); `MarathonHandoffWipParagraph` sprint checklist J-1546..1550; WIP journal **J-1353..1551**. **`git commit` не выполнен** (владелец: «commit» в чате). **Следующий cadence:** **J-1555** (commit). **Push** — по «push» (J-1440 отложен).'
}

/** AGENT_MARATHON.md — Cadence J-1552 prep J-1555 commit-ready (historical; next cadence frozen at J-1555). */
export function formatToolchainBaselineWipHandoffMarathonCadenceJ1555PrepParagraph(): string {
  return 'Точка **J-1552** (prep **J-1555** commit): `check:quiet` зелёный (**280** / **1901**); §Pre-commit scope + `planned-gui-e2e-steps.test.ts`; `formatToolchainBaselineWipHandoffPreCommitGitMessage` + §Pre-commit heredoc; journal **J-1353..1551** + SDK `SdkContinuePromptJ1555PrepFragment`. **`git commit` не выполнен** (владелец: «commit» в чате). **Следующий cadence:** **J-1555** (commit). **Push** — по «push» (J-1440 отложен).'
}

/** continue.txt / initial.txt — prep J-1555 WIP commit fragment (frozen at J-1552). */
export function formatToolchainBaselineWipHandoffSdkContinuePromptJ1555PrepFragment(): string {
  return 'Prep J-1555 commit: docs/AGENT_MARATHON §Pre-commit + formatToolchainBaselineWipHandoffPreCommitGitMessage; journal J-1353..1551 (обновить до последней J перед commit).'
}

/** AGENT_MARATHON.md — Cadence J-1553 (audit:moderate prep J-1555 cadence). */
export function formatToolchainBaselineWipHandoffMarathonCadenceJ1553Paragraph(): string {
  return 'Точка **J-1553**: `check:quiet` зелёный (**280** / **1901**); prep **J-1555** cadence: `npm run audit:moderate` — **0** vulnerabilities; freeze `MarathonCadenceJ1555PrepParagraph` + §Pre-commit heredoc; WIP journal **J-1353..1552**. **`git commit` не выполнен** (владелец: «commit» в чате). **Следующий cadence:** **J-1555** (commit). **Push** — по «push» (J-1440 отложен).'
}

/** AGENT_MARATHON.md — Cadence J-1554 journal align (prep J-1555 cadence). */
export function formatToolchainBaselineWipHandoffMarathonCadenceJ1554JournalAlignParagraph(): string {
  return 'Точка **J-1554** (journal align): `check:quiet` зелёный (**280** / **1901**); WIP journal **J-1353..1554** sync (prep J-1552..1553 + `MarathonCadenceJ1555Paragraph`); `SdkContinuePromptPreCommitJournalReminderFragment` в `continue.txt`/`initial.txt`. **`git commit` не выполнен** (владелец: «commit» в чате). **Следующий cadence:** **J-1555** (commit). **Push** — по «push» (J-1440 отложен).'
}

/** AGENT_MARATHON.md — Cadence J-1555 (J%5 — git отложен; frozen at J-1555). */
export function formatToolchainBaselineWipHandoffMarathonCadenceJ1555Paragraph(): string {
  return 'Точка **J-1555** (`NNN % 5 === 0`): `check:quiet` зелёный (**280** / **1901**); `npm run audit:moderate` — **0** vulnerabilities; governance календарь **Следующий cadence → J-1560**; WIP journal **J-1353..1555** + §Pre-commit heredoc (`formatToolchainBaselineWipHandoffPreCommitGitMessage`); prep J-1552..1553 (Playwright scaffold test + audit prep). **`git commit` не выполнен** (владелец: «commit» в чате). **Следующий cadence:** **J-1560** (commit). **Push** — по «push» (J-1440 отложен).'
}

/** AGENT_MARATHON.md — Cadence J-1556 journal align (J-1555 governance + stamp; frozen at J-1556). */
export function formatToolchainBaselineWipHandoffMarathonCadenceJ1556JournalAlignParagraph(): string {
  return 'Точка **J-1556** (journal align): `check:quiet` зелёный (**280** / **1901**); WIP journal **J-1353..1556** sync (J-1555 cadence governance + J-1556 stamp); `SdkContinuePromptPreCommitJournalReminderFragment` в `continue.txt`/`initial.txt`. **`git commit` не выполнен** (владелец: «commit» в чате). **Следующий cadence:** **J-1560** (commit). **Push** — по «push» (J-1440 отложен).'
}

/** AGENT_MARATHON.md — Cadence J-1558 prep J-1560 commit-ready (historical; next cadence frozen at J-1560). */
export function formatToolchainBaselineWipHandoffMarathonCadenceJ1560PrepParagraph(): string {
  return 'Точка **J-1558** (prep **J-1560** commit): `check:quiet` зелёный (**280** / **1901**); `formatToolchainBaselineWipHandoffPreCommitGitMessage` + §Pre-commit heredoc; journal **J-1353..1557** + SDK `SdkContinuePromptJ1560PrepFragment`. **`git commit` не выполнен** (владелец: «commit» в чате). **Следующий cadence:** **J-1560** (commit). **Push** — по «push» (J-1440 отложен).'
}

/** continue.txt / initial.txt — prep J-1560 WIP commit fragment (frozen at J-1558). */
export function formatToolchainBaselineWipHandoffSdkContinuePromptJ1560PrepFragment(): string {
  return 'Prep J-1560 commit: docs/AGENT_MARATHON §Pre-commit + formatToolchainBaselineWipHandoffPreCommitGitMessage; journal J-1353..1557 (обновить до последней J перед commit).'
}

/** AGENT_MARATHON.md — Cadence J-1545 (J%5 — git отложен; frozen at J-1545). */
export function formatToolchainBaselineWipHandoffMarathonCadenceJ1545Paragraph(): string {
  return 'Точка **J-1545** (`NNN % 5 === 0`): `check:quiet` зелёный (**280** / **1901**); `npm run audit:moderate` — **0** vulnerabilities; governance календарь **Следующий cadence → J-1550**; WIP journal **J-1353..1545** + §Pre-commit heredoc (`formatToolchainBaselineWipHandoffPreCommitGitMessage`). **`git commit` не выполнен** (владелец: «commit» в чате). **Следующий cadence:** **J-1550** (commit). **Push** — по «push» (J-1440 отложен).'
}

/** AGENT_MARATHON.md — Cadence J-1546 (sprint checklist formatters; frozen at J-1546). */
export function formatToolchainBaselineWipHandoffMarathonCadenceJ1546Paragraph(): string {
  return 'Точка **J-1546**: `check:quiet` зелёный (**280** / **1901**); sprint checklist formatters (`formatReleaseCodeSigningRoadmapChecklistSprintSection19Line` J-1511..1545, `formatPackagedGuiE2ePlaywrightChecklistSprintSection21Line`, `formatToolchainBaselineWipHandoffChecklistSprintWave5Line`); WIP journal **J-1353..1546** + §Pre-commit heredoc. **`git commit` не выполнен** (владелец: «commit» в чате). **Следующий cadence:** **J-1550** (commit). **Push** — по «push» (J-1440 отложен).'
}

/** AGENT_MARATHON.md — Cadence J-1547 (SDK sprint checklist index; frozen at J-1547). */
export function formatToolchainBaselineWipHandoffMarathonCadenceJ1547Paragraph(): string {
  return 'Точка **J-1547**: `check:quiet` зелёный (**280** / **1901**); SDK/SOURCES sprint checklist index (`SdkContinuePromptSprintChecklist*`, `SdkAutomationReadmeChecklistSprintLine`; §19/§21/Wave5); WIP journal **J-1353..1547** + §Pre-commit heredoc. **`git commit` не выполнен** (владелец: «commit» в чате). **Следующий cadence:** **J-1550** (commit). **Push** — по «push» (J-1440 отложен).'
}

/** AGENT_MARATHON.md — Cadence J-1548 prep J-1550 commit-ready (historical; next cadence frozen at J-1550). */
export function formatToolchainBaselineWipHandoffMarathonCadenceJ1550PrepParagraph(): string {
  return 'Точка **J-1548** (prep **J-1550** commit): `check:quiet` зелёный (**280** / **1901**); sprint checklist indexed (J-1546..1547); `formatToolchainBaselineWipHandoffPreCommitGitMessage` + §Pre-commit heredoc; journal **J-1353..1547** + SDK `SdkContinuePromptJ1550PrepFragment`. **`git commit` не выполнен** (владелец: «commit» в чате). **Следующий cadence:** **J-1550** (commit). **Push** — по «push» (J-1440 отложен).'
}

/** continue.txt / initial.txt — prep J-1550 WIP commit fragment (frozen at J-1548). */
export function formatToolchainBaselineWipHandoffSdkContinuePromptJ1550PrepFragment(): string {
  return 'Prep J-1550 commit: docs/AGENT_MARATHON §Pre-commit + formatToolchainBaselineWipHandoffPreCommitGitMessage; journal J-1353..1547 (обновить до последней J перед commit).'
}

/** AGENT_MARATHON.md — Cadence J-1550 (J%5 — git отложен; frozen at J-1550). */
export function formatToolchainBaselineWipHandoffMarathonCadenceJ1550Paragraph(): string {
  return 'Точка **J-1550** (`NNN % 5 === 0`): `check:quiet` зелёный (**280** / **1901**); `npm run audit:moderate` — **0** vulnerabilities; governance календарь **Следующий cadence → J-1555**; WIP journal **J-1353..1550** + §Pre-commit heredoc (`formatToolchainBaselineWipHandoffPreCommitGitMessage`); sprint checklist indexed (J-1546..1548). **`git commit` не выполнен** (владелец: «commit» в чате). **Следующий cadence:** **J-1555** (commit). **Push** — по «push» (J-1440 отложен).'
}

/** AGENT_MARATHON.md — Cadence J-1550 journal align (J-1549 governance + J-1550 stamp). */
export function formatToolchainBaselineWipHandoffMarathonCadenceJ1550JournalAlignParagraph(): string {
  return 'Точка **J-1550** (journal align): `check:quiet` зелёный (**280** / **1901**); WIP journal **J-1353..1550** sync (J-1549 cadence governance + J-1550 stamp); `SdkContinuePromptPreCommitJournalReminderFragment` в `continue.txt`/`initial.txt`. **`git commit` не выполнен** (владелец: «commit» в чате). **Следующий cadence:** **J-1555** (commit). **Push** — по «push» (J-1440 отложен).'
}

/** continue.txt / initial.txt — перед WIP commit обновить journal span. */
export function formatToolchainBaselineWipHandoffSdkContinuePromptPreCommitJournalReminderFragment(): string {
  return `WIP commit: journal ${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE} (обновить TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE до последней J перед commit).`
}

/** AGENT_MARATHON.md §Pre-commit PowerShell git commit message (single line). */
export function formatToolchainBaselineWipHandoffPreCommitGitMessage(): string {
  return `toolchain baseline: Electron 42, Vite 8, TS 6, ESLint 9; .npmrc; plan выполнен; journal ${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE}; §19 signing roadmaps indexed (J-1501..1511 docs index sync); WIP handoff meta + diagnostics (${formatToolchainBaselineWipHandoffDiagnosticsJournalSpan()}); Wave 5 docs + Cadence governance (J-1510 → ${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE})`
}

/** fluxalloy-marathon SKILL.md Cadence calendar cell fragment. */
export function formatToolchainBaselineWipHandoffMarathonSkillCadenceCalendar(): string {
  return `**${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE}** commit; ${TOOLCHAIN_BASELINE_WIP_GATE} push отложен — владелец: «commit»/«push»`
}

/** SOURCES_OF_TRUTH.md marathon/cadence rows — next commit J-NNN. */
export function formatToolchainBaselineWipHandoffSourcesNextCadenceCommit(): string {
  return `**${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE}** commit`
}

/** bin/README.md WIP baseline bullet (after §19 signing). */
export function formatToolchainBaselineWipHandoffBinReadmeLine(): string {
  return `- WIP baseline (до push): journal **${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE}**, ${formatToolchainBaselineWipHandoffMarkdownPathLabel()} paths — [\`toolchain-baseline-wip-handoff-meta.ts\`](../src/shared/toolchain-baseline-wip-handoff-meta.ts); commit — [\`docs/AGENT_MARATHON.md\`](../docs/AGENT_MARATHON.md) §Pre-commit (gate **${TOOLCHAIN_BASELINE_WIP_GATE}** push отложен; **Следующий cadence** **${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE}** commit).`
}
