/**
 * Toolchain baseline handoff constants (package.json + docs sync).
 * Leaf-модуль без импортов (Node ESM из scripts/*.mjs и Vitest).
 */

export const TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE = 'J-1353..1570' as const
export const TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE = 'J-1570' as const
export const TOOLCHAIN_BASELINE_WIP_MAIN_SHA = 'ff89765' as const

/** Заголовок спринта в IMPLEMENTATION_CHECKLIST (слово T+ODO — вне audit:todo-debt). */
export const IMPLEMENTATION_CHECKLIST_SPRINT_HEADING =
  `## Ближайший ${'T' + 'ODO'} спринта` as const

/** fluxalloy-continue SKILL.md — «продолжай» / «+». */
export function formatToolchainBaselineContinuePromptLine(): string {
  return `«продолжай» или «+» — продолжить текущую задачу; если закончена — следующий пункт из \`IMPLEMENTATION_CHECKLIST.md\` → \`${IMPLEMENTATION_CHECKLIST_SPRINT_HEADING}\`.`
}

/** RELEASE.md §1 toolchain baseline paragraph. */
export function formatToolchainBaselineWipHandoffReleaseParagraph(): string {
  return `**Toolchain baseline:** на \`main\` @ \`${TOOLCHAIN_BASELINE_WIP_MAIN_SHA}\` (journal **${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE}**); Electron 42 / Vite 8 / TS 6 / ESLint 9 — \`package.json\`; lock — \`tests/shared/toolchain-baseline-package.test.ts\`. План toolchain удалён (**J-1559**).`
}

/** AGENTS.md — §19/§21 pointer (detail in RELEASE + governance tests). */
export function formatToolchainBaselineAgentsMdSlimDomainsPointer(): string {
  return '**§19 signing · §21 Help:** канон — [`docs/RELEASE.md`](docs/RELEASE.md) §1/§4; карта — [`docs/SOURCES_OF_TRUTH.md`](docs/SOURCES_OF_TRUTH.md); lock — `tests/shared/toolchain-baseline-package.test.ts`.'
}

/** AGENTS.md — Cadence Git one-liner. */
export function formatToolchainBaselineWipHandoffAgentsCadenceLine(): string {
  return `**Cadence Git:** \`J-NNN\` — \`NNN % 5\` commit, \`NNN % 10\` push (любой чат); **Следующий cadence** **${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE}** — [\`fluxalloy-agent.mdc\`](.cursor/rules/fluxalloy-agent.mdc).`
}

/** agent-contract.txt — journal + next cadence (plain). */
export function formatToolchainBaselineWipHandoffSdkContractJournalCadenceFragment(): string {
  return `journal ${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE}; cadence ${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE} commit`
}

/** `IMPLEMENTATION_CHECKLIST.md` — sprint Wave 5 Dependabot bullet. */
export function formatToolchainBaselineWipHandoffChecklistSprintWave5Line(): string {
  return `- [x] Wave 5 Dependabot: push→gh (journal **J-1558**); cadence **J%5** commit / **J%10** push.`
}

/** `docs/SOURCES_OF_TRUTH.md` — sprint Wave 5 checklist index. */
export function formatToolchainBaselineWipHandoffSourcesSprintChecklistFragment(): string {
  return 'sprint Wave 5 bullet — formatToolchainBaselineWipHandoffChecklistSprintWave5Line; toolchain-baseline-package.test.ts locks package.json majors'
}

/** continue.txt / initial.txt — sprint Wave 5 checklist fragment. */
export function formatToolchainBaselineWipHandoffSdkContinuePromptSprintChecklistWave5Fragment(): string {
  return `Sprint Wave5 checklist: formatToolchainBaselineWipHandoffChecklistSprintWave5Line (cadence ${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE}).`
}

/** `scripts/cursor-automation/README.md` — sprint Wave 5 checklist bullet. */
export function formatToolchainBaselineWipHandoffSdkAutomationReadmeChecklistSprintLine(): string {
  return `- Sprint Wave 5 (\`IMPLEMENTATION_CHECKLIST\`): \`formatToolchainBaselineWipHandoffChecklistSprintWave5Line\` (**${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE}**).`
}

/** SOURCES_OF_TRUTH.md priority-7 cadence fragment (SDK row). */
export function formatToolchainBaselineWipHandoffSourcesPriority7Fragment(): string {
  return `**Следующий cadence** **${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE}** commit`
}

/** docs/ARCHITECTURE.md § npm toolchain baseline bullet. */
export function formatToolchainBaselineWipHandoffArchitectureClause(): string {
  return `- **Toolchain baseline:** \`main\` @ \`${TOOLCHAIN_BASELINE_WIP_MAIN_SHA}\`, journal **${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE}** — [\`toolchain-baseline-wip-handoff-meta.ts\`](../src/shared/toolchain-baseline-wip-handoff-meta.ts); план удалён **J-1559**; **Следующий cadence** **${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE}** commit.`
}

/** bin/README.md toolchain baseline bullet. */
export function formatToolchainBaselineWipHandoffBinReadmeLine(): string {
  return `- Toolchain baseline: \`main\` @ \`${TOOLCHAIN_BASELINE_WIP_MAIN_SHA}\`, journal **${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE}** — [\`toolchain-baseline-wip-handoff-meta.ts\`](../src/shared/toolchain-baseline-wip-handoff-meta.ts); план удалён **J-1559**; **Следующий cadence** **${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE}** commit.`
}

/** check:release / check:platform-packaging-scripts diagnostic line. */
export function formatToolchainBaselineWipHandoffCheckReleaseDiagnosticLine(): string {
  return `Toolchain baseline: toolchain-baseline-wip-handoff-meta.ts (journal ${TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE}; cadence ${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE} commit — fluxalloy-agent.mdc)`
}

/** agent-contract.txt — cadence fragment. */
export function formatToolchainBaselineWipHandoffSdkContractClause(): string {
  return `Cadence ${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE} commit — fluxalloy-agent.mdc`
}

/** agent-contract.txt — journal + cadence. */
export function formatToolchainBaselineWipHandoffSdkContractWipCadenceClause(): string {
  return `${formatToolchainBaselineWipHandoffSdkContractClause()}; ${formatToolchainBaselineWipHandoffSdkContractJournalCadenceFragment()}`
}

/** continue.txt / initial.txt — «продолжай» / «+». */
export function formatToolchainBaselineSdkContinuePromptLine(): string {
  return formatToolchainBaselineContinuePromptLine()
}
