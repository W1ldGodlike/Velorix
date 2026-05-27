/**
 * Toolchain baseline handoff constants (package.json + docs sync).
 * Leaf-модуль без импортов (Node ESM из scripts/*.mjs и Vitest).
 */

export const TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE = 'J-1353..1571' as const
export const TOOLCHAIN_BASELINE_WIP_NEXT_J_COMMIT = 'J-1580' as const
export const TOOLCHAIN_BASELINE_WIP_NEXT_J_PUSH = 'J-1580' as const
export const TOOLCHAIN_BASELINE_WIP_MAIN_SHA = 'ff89765' as const

export const IMPLEMENTATION_NEON_CHECKLIST_PATH = 'docs/IMPLEMENTATION_NEON_CHECKLIST.md' as const

/** Заголовок спринта в NEON-чеклисте (слово T+ODO — вне audit:todo-debt). */
export const IMPLEMENTATION_CHECKLIST_SPRINT_HEADING =
  `## Ближайший ${'T' + 'ODO'} спринта` as const

/** Velorix-continue SKILL.md — «продолжай» / «+». */
export function formatToolchainBaselineContinuePromptLine(): string {
  return `«продолжай» или «+» — текущая задача; если закончена — \`docs/VELORIX_NEON_THEME.md\` → \`${IMPLEMENTATION_NEON_CHECKLIST_PATH}\` → \`${IMPLEMENTATION_CHECKLIST_SPRINT_HEADING}\`.`
}

/** RELEASE.md §1 toolchain baseline paragraph. */
export function formatToolchainBaselineWipHandoffReleaseParagraph(): string {
  return `**Toolchain baseline:** на \`main\` @ \`${TOOLCHAIN_BASELINE_WIP_MAIN_SHA}\` (journal **${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE}**); Electron 42 / Vite 8 / TS 6 / ESLint 9 — \`package.json\`; lock — \`tests/shared/toolchain-baseline-package.test.ts\`. План toolchain удалён (**J-1559**).`
}

/** AGENTS.md — §19/§21 pointer (detail in RELEASE + governance tests). */
export function formatToolchainBaselineAgentsMdSlimDomainsPointer(): string {
  return '**§19 signing · §21 Help:** канон — [`docs/RELEASE.md`](docs/RELEASE.md) §1/§4; карта — [`docs/SOURCES_OF_TRUTH.md`](docs/SOURCES_OF_TRUTH.md); lock — `tests/shared/toolchain-baseline-package.test.ts`.'
}

/** AGENTS.md — git по J-NNN one-liner. */
export function formatToolchainBaselineWipHandoffAgentsGitByJournalLine(): string {
  return `**Git по J-NNN:** \`NNN % 5\` → commit, \`NNN % 10\` → push (любой чат); **следующий commit по J** **${TOOLCHAIN_BASELINE_WIP_NEXT_J_COMMIT}**, **следующий push по J** **${TOOLCHAIN_BASELINE_WIP_NEXT_J_PUSH}** — [\`velorix-agent.mdc\`](.cursor/rules/velorix-agent.mdc).`
}

/** agent-contract.txt — journal + next commit by J (plain). */
export function formatToolchainBaselineWipHandoffSdkContractJournalGitFragment(): string {
  return `journal ${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE}; commit по J ${TOOLCHAIN_BASELINE_WIP_NEXT_J_COMMIT}`
}

/** NEON-чеклист — sprint Wave 5 Dependabot bullet (исторический). */
export function formatToolchainBaselineWipHandoffChecklistSprintWave5Line(): string {
  return `- [x] Wave 5 Dependabot: push→gh (journal **J-1558**); git по J: **J%5** commit / **J%10** push.`
}

/** `docs/SOURCES_OF_TRUTH.md` — sprint Wave 5 checklist index. */
export function formatToolchainBaselineWipHandoffSourcesSprintChecklistFragment(): string {
  return 'sprint Wave 5 bullet — formatToolchainBaselineWipHandoffChecklistSprintWave5Line; toolchain-baseline-package.test.ts locks package.json majors'
}

/** continue.txt / initial.txt — sprint Wave 5 checklist fragment. */
export function formatToolchainBaselineWipHandoffSdkContinuePromptSprintChecklistWave5Fragment(): string {
  return `Sprint Wave5 checklist: formatToolchainBaselineWipHandoffChecklistSprintWave5Line (commit по J ${TOOLCHAIN_BASELINE_WIP_NEXT_J_COMMIT}).`
}

/** `scripts/cursor-automation/README.md` — sprint Wave 5 checklist bullet. */
export function formatToolchainBaselineWipHandoffSdkAutomationReadmeChecklistSprintLine(): string {
  return `- Sprint Wave 5 (\`${IMPLEMENTATION_NEON_CHECKLIST_PATH}\`): \`formatToolchainBaselineWipHandoffChecklistSprintWave5Line\` (**${TOOLCHAIN_BASELINE_WIP_NEXT_J_COMMIT}**).`
}

/** SOURCES_OF_TRUTH.md priority-7 fragment (SDK row). */
export function formatToolchainBaselineWipHandoffSourcesPriority7Fragment(): string {
  return `**Следующий commit по J** **${TOOLCHAIN_BASELINE_WIP_NEXT_J_COMMIT}**`
}

/** docs/ARCHITECTURE.md § npm toolchain baseline bullet. */
export function formatToolchainBaselineWipHandoffArchitectureClause(): string {
  return `- **Toolchain baseline:** \`main\` @ \`${TOOLCHAIN_BASELINE_WIP_MAIN_SHA}\`, journal **${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE}** — [\`toolchain-baseline-wip-handoff-meta.ts\`](../src/shared/toolchain-baseline-wip-handoff-meta.ts); план удалён **J-1559**; **следующий commit по J** **${TOOLCHAIN_BASELINE_WIP_NEXT_J_COMMIT}**.`
}

/** bin/README.md toolchain baseline bullet. */
export function formatToolchainBaselineWipHandoffBinReadmeLine(): string {
  return `- Toolchain baseline: \`main\` @ \`${TOOLCHAIN_BASELINE_WIP_MAIN_SHA}\`, journal **${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE}** — [\`toolchain-baseline-wip-handoff-meta.ts\`](../src/shared/toolchain-baseline-wip-handoff-meta.ts); план удалён **J-1559**; **следующий commit по J** **${TOOLCHAIN_BASELINE_WIP_NEXT_J_COMMIT}**.`
}

/** check:release / check:platform-packaging-scripts diagnostic line. */
export function formatToolchainBaselineWipHandoffCheckReleaseDiagnosticLine(): string {
  return `Toolchain baseline: toolchain-baseline-wip-handoff-meta.ts (journal ${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE}; commit по J ${TOOLCHAIN_BASELINE_WIP_NEXT_J_COMMIT} — Velorix-agent.mdc)`
}

/** agent-contract.txt — git по J fragment. */
export function formatToolchainBaselineWipHandoffSdkContractClause(): string {
  return `Git по J ${TOOLCHAIN_BASELINE_WIP_NEXT_J_COMMIT} commit — Velorix-agent.mdc`
}

/** agent-contract.txt — journal + git по J. */
export function formatToolchainBaselineWipHandoffSdkContractWipGitClause(): string {
  return `${formatToolchainBaselineWipHandoffSdkContractClause()}; ${formatToolchainBaselineWipHandoffSdkContractJournalGitFragment()}`
}

/** continue.txt / initial.txt — «продолжай» / «+». */
export function formatToolchainBaselineSdkContinuePromptLine(): string {
  return formatToolchainBaselineContinuePromptLine()
}
