import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_E2E_COUNT } from '../../src/shared/packaged-e2e-help-workflow-crosslinks-meta'
import { PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT } from '../../src/shared/packaged-gui-e2e-playwright-meta'
import {
  formatReleaseCodeSigningRoadmapSdkAutomationReadmeLine,
  formatReleaseCodeSigningRoadmapSdkContractClause,
  formatReleaseCodeSigningRoadmapSdkContractSigningIndexedClause,
  formatReleaseCodeSigningRoadmapSdkContractElectronBuilderClause,
  formatReleaseCodeSigningRoadmapSdkContinuePromptElectronBuilderFragment,
  formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock,
  formatReleaseCodeSigningRoadmapSdkAutomationReadmeElectronBuilderLine,
  formatReleaseCodeSigningRoadmapAgentsElectronBuilderBullet,
  formatReleaseCodeSigningRoadmapAgentsSigningIndexedBullet,
  formatReleaseCodeSigningRoadmapReadmeElectronBuilderLine,
  formatReleaseCodeSigningRoadmapReadmeSigningIndexedLine,
  formatReleaseCodeSigningRoadmapSourcesSigningIndexElectronBuilderFragment,
  formatReleaseCodeSigningRoadmapSourcesSigningIndexedFragment,
  formatReleaseCodeSigningRoadmapChecklistSprintSection19Line,
  RELEASE_CODE_SIGNING_SPRINT_INDEXED_JOURNAL_SPAN,
  formatReleaseCodeSigningRoadmapSdkAutomationReadmeSigningIndexedLine,
  formatReleaseCodeSigningRoadmapSdkAutomationReadmeChecklistSprintLine,
  formatReleaseCodeSigningRoadmapSdkContinuePromptSprintChecklistSection19Fragment,
  formatReleaseCodeSigningRoadmapOperationalNotesRow,
  formatReleaseCodeSigningRoadmapOperationalNotesSigningIndexedRow,
  formatReleaseCodeSigningRoadmapOperationalNotesElectronBuilderRow,
  formatReleaseCodeSigningRoadmapArchitectureElectronBuilderClause,
  formatReleaseCodeSigningRoadmapArchitectureSigningIndexedClause,
  formatReleaseCodeSigningRoadmapReleaseSigningIndexedParagraph,
  formatReleaseCodeSigningRoadmapElectronBuilderYmlPointer,
  formatReleaseCodeSigningRoadmapElectronBuilderYmlSigningComment,
  getReleaseCodeSigningElectronBuilderYmlComments
} from '../../src/shared/release-code-signing-roadmap'
import {
  formatToolchainBaselineWipHandoffAgentsCadenceLine,
  formatToolchainBaselineWipHandoffArchitectureClause,
  formatToolchainBaselineWipHandoffCoreMarathonWipFragment,
  formatToolchainBaselineWipHandoffMarathonSkillCadenceCalendar,
  formatToolchainBaselineWipHandoffMarathonSkillRow,
  formatToolchainBaselineWipHandoffOperationalNotesCell,
  formatToolchainBaselineWipHandoffMarathonHandoffWipParagraph,
  formatToolchainBaselineWipHandoffPreCommitScopeParagraph,
  formatToolchainBaselineWipHandoffPreCommitGitMessage,
  formatToolchainBaselineWipHandoffReleaseParagraph,
  formatToolchainBaselineWipHandoffSdkContractClause,
  formatToolchainBaselineWipHandoffSdkContractJournalCadenceFragment,
  formatToolchainBaselineWipHandoffSdkContractWipCadenceClause,
  formatToolchainBaselineWipHandoffMarathonCadenceJ1545PrepParagraph,
  formatToolchainBaselineWipHandoffMarathonCadenceJ1545Paragraph,
  formatToolchainBaselineWipHandoffMarathonCadenceJ1546Paragraph,
  formatToolchainBaselineWipHandoffMarathonCadenceJ1547Paragraph,
  formatToolchainBaselineWipHandoffMarathonCadenceJ1550PrepParagraph,
  formatToolchainBaselineWipHandoffMarathonCadenceJ1550Paragraph,
  formatToolchainBaselineWipHandoffMarathonCadenceJ1550JournalAlignParagraph,
  formatToolchainBaselineWipHandoffMarathonCadenceJ1551Paragraph,
  formatToolchainBaselineWipHandoffMarathonCadenceJ1553Paragraph,
  formatToolchainBaselineWipHandoffMarathonCadenceJ1554JournalAlignParagraph,
  formatToolchainBaselineWipHandoffMarathonCadenceJ1555Paragraph,
  formatToolchainBaselineWipHandoffMarathonCadenceJ1555PrepParagraph,
  formatToolchainBaselineWipHandoffMarathonCadenceJ1556JournalAlignParagraph,
  formatToolchainBaselineWipHandoffMarathonCadenceJ1560PrepParagraph,
  formatToolchainBaselineWipHandoffSdkContinuePromptPreCommitJournalReminderFragment,
  formatToolchainBaselineWipHandoffSdkContinuePromptJ1550PrepFragment,
  formatToolchainBaselineWipHandoffSdkContinuePromptJ1555PrepFragment,
  formatToolchainBaselineWipHandoffSdkContinuePromptJ1560PrepFragment,
  formatToolchainBaselineWipHandoffChecklistSprintWave5Line,
  formatToolchainBaselineWipHandoffSourcesSprintChecklistFragment,
  formatToolchainBaselineWipHandoffSdkContinuePromptSprintChecklistWave5Fragment,
  formatToolchainBaselineWipHandoffSdkAutomationReadmeChecklistSprintLine,
  formatToolchainBaselineWipHandoffSdkPromptWipFragment,
  formatToolchainBaselineWipHandoffSdkPromptWave5DependabotFragment,
  formatToolchainBaselineWipHandoffSdkReadmeWipFragment,
  formatToolchainBaselineWipHandoffSourcesNextCadenceCommit,
  formatToolchainBaselineWipHandoffSourcesPriority7Fragment,
  TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE,
  TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE
} from '../../src/shared/toolchain-baseline-wip-handoff-meta'
import {
  formatPackagedGuiE2ePlaywrightChecklistSprintSection21Line,
  formatPackagedGuiE2ePlaywrightSdkAutomationReadmeChecklistSprintLine,
  formatPackagedGuiE2ePlaywrightSdkContinuePromptSprintChecklistFragment,
  formatPackagedGuiE2ePlaywrightSourcesSprintChecklistFragment
} from '../../src/shared/packaged-gui-e2e-playwright-meta'

describe('toolchain baseline governance (plan + CI)', () => {
  it('TOOLCHAIN_BASELINE_UPGRADE_PLAN is выполнен with documented final majors', () => {
    const plan = readFileSync('docs/TOOLCHAIN_BASELINE_UPGRADE_PLAN.md', 'utf8')
    expect(plan).toContain('**Статус:** **выполнен**')
    expect(plan).toContain('**42.2.x**')
    expect(plan).toContain('**8.0.13**')
    expect(plan).toContain('**6.0.3**')
    expect(plan).toContain('legacy-peer-deps=true')
    expect(plan).toContain('npm run check:quiet')
  })

  it('fluxalloy-marathon SKILL WIP row matches post-J-1440 cadence (27+ paths)', () => {
    const skill = readFileSync('.cursor/skills/fluxalloy-marathon/SKILL.md', 'utf8')
    expect(skill).toContain(formatToolchainBaselineWipHandoffMarathonSkillCadenceCalendar())
    expect(skill).toMatch(/J-1440.*отложен/)
    expect(skill).toContain(formatToolchainBaselineWipHandoffMarathonSkillRow())
    expect(skill).toContain('gate **J-1440**')
  })

  it('fluxalloy-core.mdc marathon row matches post-J-1440 cadence calendar', () => {
    const core = readFileSync('.cursor/rules/fluxalloy-core.mdc', 'utf8')
    expect(core).toContain(TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE)
    expect(core).toMatch(/J-1440.*отложен/)
    expect(core).toContain(formatToolchainBaselineWipHandoffCoreMarathonWipFragment())
    expect(core).toContain('gate **J-1440**')
  })

  it('AGENTS, IMPLEMENTATION_CHECKLIST, AGENT_MARATHON, and README Vitest snapshot align (Windows gate)', () => {
    const agents = readFileSync('AGENTS.md', 'utf8')
    const checklist = readFileSync('IMPLEMENTATION_CHECKLIST.md', 'utf8')
    const marathon = readFileSync('docs/AGENT_MARATHON.md', 'utf8')
    const readme = readFileSync('README.md', 'utf8')
    const files = agents.match(/\*\*(\d+)\*\* test files/)?.[1]
    const tests = agents.match(/\*\*(\d+)\*\* tests/)?.[1]
    expect(files, 'AGENTS.md: **N** test files').toBeTruthy()
    expect(tests, 'AGENTS.md: **N** tests').toBeTruthy()
    expect(agents).toContain(`**${files}** test files`)
    expect(agents).toContain(`**${tests}** tests`)
    expect(checklist).toContain(`**\`${files}\` файлов / \`${tests}\` тестов**`)
    expect(checklist).toContain(formatReleaseCodeSigningRoadmapChecklistSprintSection19Line())
    expect(checklist).toContain(formatPackagedGuiE2ePlaywrightChecklistSprintSection21Line())
    expect(checklist).toContain(formatToolchainBaselineWipHandoffChecklistSprintWave5Line())
    expect(RELEASE_CODE_SIGNING_SPRINT_INDEXED_JOURNAL_SPAN).toBe('J-1511..1545')
    expect(marathon).toContain(`**${files}** files / **${tests}** tests`)
    expect(readme).toContain(`**${files}** test files`)
    expect(readme).toContain(`**${tests}** tests`)
    expect(readme).toContain(formatReleaseCodeSigningRoadmapReadmeSigningIndexedLine())
    expect(readme).toContain(formatReleaseCodeSigningRoadmapReadmeElectronBuilderLine())
  })

  it('AGENTS.md and fluxalloy-core document выполнен toolchain archive', () => {
    const agents = readFileSync('AGENTS.md', 'utf8')
    expect(agents).toContain('docs/TOOLCHAIN_BASELINE_UPGRADE_PLAN.md')
    expect(agents).toContain('статус «выполнен»')
    expect(agents).toContain('toolchain-baseline-package.test.ts')
    expect(agents).toContain('toolchain-baseline-governance.test.ts')
    expect(agents).toContain(formatReleaseCodeSigningRoadmapAgentsSigningIndexedBullet())
    expect(agents).toContain(formatReleaseCodeSigningRoadmapAgentsElectronBuilderBullet())
    const core = readFileSync('.cursor/rules/fluxalloy-core.mdc', 'utf8')
    expect(core).toContain('TOOLCHAIN_BASELINE_UPGRADE_PLAN.md')
    expect(core).toContain('статус **не** «выполнен»')
  })

  it('check:quiet pipeline includes renderer-state and platform-packaging guards', () => {
    const quiet = readFileSync('scripts/run-quiet-check.mjs', 'utf8')
    expect(quiet).toContain('renderer-state-approach')
    expect(quiet).toContain('check:renderer-state-approach')
    expect(quiet).toContain('platform-packaging-scripts')
    expect(quiet).toContain('check:platform-packaging-scripts')
  })

  it('SOURCES_OF_TRUTH marathon sync table + Vitest snapshot row + post-J-1440 cadence', () => {
    const sources = readFileSync('docs/SOURCES_OF_TRUTH.md', 'utf8')
    expect(sources).toMatch(new RegExp(`Marathon \\/ bump.*${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE}`))
    expect(sources).toMatch(/Cadence Git.*J-1440.*отложен/)
    expect(sources).toMatch(/\| Vitest snapshot \(Windows gate\) \|/)
    expect(sources).toContain('toolchain-baseline-governance.test.ts')
    expect(sources).toContain('AGENTS.md')
    expect(sources).toContain('README.md')
  })

  it('AGENT_OPERATIONAL_NOTES and SOURCES_OF_TRUTH index toolchain baseline', () => {
    const ops = readFileSync('docs/AGENT_OPERATIONAL_NOTES.md', 'utf8')
    expect(ops).toContain('legacy-peer-deps=true')
    expect(ops).toContain('TOOLCHAIN_BASELINE_UPGRADE_PLAN.md')
    expect(ops).toContain('npm ci')
    expect(ops).toMatch(/WIP baseline commit.*27/)
    expect(ops).toContain('J-1440')
    expect(ops).toContain(formatToolchainBaselineWipHandoffOperationalNotesCell())
    const sources = readFileSync('docs/SOURCES_OF_TRUTH.md', 'utf8')
    expect(sources).toContain('TOOLCHAIN_BASELINE_UPGRADE_PLAN.md')
    expect(sources).toContain('.npmrc')
    expect(sources).toContain('AGENT_MARATHON.md')
    expect(sources).toMatch(/\| §19 signing roadmap \(win\/linux\/mac\) \|/)
    expect(sources).toContain('release-code-signing-roadmap.ts')
    expect(sources).toContain('check:help-packaged-smoke-docs')
    expect(ops).toContain(formatReleaseCodeSigningRoadmapOperationalNotesRow())
    expect(ops).toContain(formatReleaseCodeSigningRoadmapOperationalNotesSigningIndexedRow())
    expect(ops).toContain(formatReleaseCodeSigningRoadmapOperationalNotesElectronBuilderRow())
    expect(ops).toContain('check:help-owner-smoke-docs')
    expect(ops).toContain('strict signing in `check:help-workflow-smoke-crosslinks`')
    expect(sources).toContain('AGENT_OPERATIONAL_NOTES.md')
    expect(sources).toContain('bin/README.md')
    expect(sources).toContain('AGENTS.md')
    expect(sources).toContain('README.md')
    expect(sources).toContain('agent-contract.txt')
    expect(sources).toContain('scripts/cursor-automation/README.md')
    expect(sources).toContain('continue.txt')
    expect(sources).toContain('check-release-scripts.ts')
    expect(sources).toContain('getting-started.md')
    expect(sources).toContain('getting-started-signing-roadmap-clause')
    expect(sources).toContain('knowledge-signing-roadmap-clause')
    expect(sources).toContain('planner-signing-roadmap-clause')
    expect(sources).toContain('ffmpeg-signing-roadmap-clause')
    expect(sources).toContain(
      formatReleaseCodeSigningRoadmapSourcesSigningIndexElectronBuilderFragment()
    )
    expect(sources).toContain(formatReleaseCodeSigningRoadmapSourcesSigningIndexedFragment())
    expect(sources).toContain(formatToolchainBaselineWipHandoffSourcesSprintChecklistFragment())
    expect(sources).toContain(formatPackagedGuiE2ePlaywrightSourcesSprintChecklistFragment())
    expect(sources).toContain('logging-and-diagnostics.md')
    expect(sources).toContain('workflows-planner-scenarios.md')
    expect(sources).toContain('ffmpeg-terminal-hints.md')
    expect(sources).toContain('planner-diagnostics-paragraph')
  })

  it('ARCHITECTURE.md documents fix:esm-shim, legacy-peer-deps, toolchain plan, and WIP handoff', () => {
    const arch = readFileSync('docs/ARCHITECTURE.md', 'utf8')
    expect(arch).toContain('fix:esm-shim')
    expect(arch).toContain('renderer-state-approach.ts')
    expect(arch).toContain('electron-vite-build-meta')
    expect(arch).toContain('legacy-peer-deps=true')
    expect(arch).toContain('TOOLCHAIN_BASELINE_UPGRADE_PLAN.md')
    expect(arch).toContain(formatToolchainBaselineWipHandoffArchitectureClause())
    expect(arch).toContain(formatReleaseCodeSigningRoadmapArchitectureElectronBuilderClause())
    expect(arch).toContain(formatReleaseCodeSigningRoadmapArchitectureSigningIndexedClause())
    expect(arch).toContain('toolchain-baseline-wip-handoff-meta.ts')
    const yml = readFileSync('electron-builder.yml', 'utf8')
    expect(yml).toContain(formatReleaseCodeSigningRoadmapElectronBuilderYmlSigningComment())
    const ymlComments = getReleaseCodeSigningElectronBuilderYmlComments()
    expect(ymlComments).toHaveLength(9)
    for (const comment of ymlComments) {
      expect(yml).toContain(comment)
    }
  })

  it('RELEASE.md documents legacy-peer-deps and toolchain plan', () => {
    const release = readFileSync('docs/RELEASE.md', 'utf8')
    expect(release).toContain('release-code-signing-roadmap.ts')
    expect(release).toContain('check:help-packaged-smoke-docs')
    expect(release).toContain('legacy-peer-deps=true')
    expect(release).toContain('TOOLCHAIN_BASELINE_UPGRADE_PLAN.md')
    expect(release).toContain('27')
    expect(release).toContain('J-1440')
    expect(release).toContain(formatToolchainBaselineWipHandoffReleaseParagraph())
    expect(release).toContain(formatReleaseCodeSigningRoadmapReleaseSigningIndexedParagraph())
    expect(release).toContain(formatReleaseCodeSigningRoadmapElectronBuilderYmlPointer())
    expect(release).not.toMatch(/NSIS, portable и zip/)
    expect(release).not.toMatch(/NSIS\/portable\/zip/)
    expect(release).toContain('Electron 42')
    expect(release).toContain('### 4.2 macOS (pack:mac:dir)')
    expect(release).toContain('публикации за пределами dev-сборки')
    expect(release).toContain('Apple Notary Service')
    expect(release).toContain('Developer ID Application')
    expect(release).toContain('notarytool')
    expect(release).toContain('stapler staple')
    expect(release).toContain('spctl')
    expect(release).toContain('CSC_IDENTITY_AUTO_DISCOVERY')
    expect(release).toContain('CSC_LINK')
    expect(release).toContain('signtool verify')
    expect(release).toContain('SmartScreen')
    expect(release).toContain('### 4.1 Linux (pack:linux:dir)')
    expect(release).toContain('gpg --verify')
    expect(release).toContain('AppImage')
  })

  it('README documents legacy-peer-deps, Node .nvmrc, and toolchain plan', () => {
    const readme = readFileSync('README.md', 'utf8')
    expect(readme).toContain('legacy-peer-deps=true')
    expect(readme).toContain('.nvmrc')
    expect(readme).toContain('TOOLCHAIN_BASELINE_UPGRADE_PLAN.md')
    expect(readme).toContain('≥ 20.19')
  })

  it('.nvmrc major satisfies package.json engines.node floor', () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
      engines?: { node?: string }
    }
    expect(pkg.engines?.node).toBe('>=20.19.0')
    const nvmMajor = Number(readFileSync('.nvmrc', 'utf8').trim())
    expect(nvmMajor).toBeGreaterThanOrEqual(20)
  })

  it('SDK agent-contract and cursor-automation README reference выполнен toolchain', () => {
    const contract = readFileSync('scripts/cursor-automation/prompts/agent-contract.txt', 'utf8')
    expect(contract).toContain('выполнен')
    expect(contract).toContain('TOOLCHAIN_BASELINE_UPGRADE_PLAN.md')
    expect(contract).toContain(formatReleaseCodeSigningRoadmapSdkContractClause())
    expect(contract).toContain(formatReleaseCodeSigningRoadmapSdkContractSigningIndexedClause())
    expect(contract).toContain(formatReleaseCodeSigningRoadmapSdkContractElectronBuilderClause())
    const sdkReadme = readFileSync('scripts/cursor-automation/README.md', 'utf8')
    expect(sdkReadme).toContain('legacy-peer-deps=true')
    expect(sdkReadme).toContain('TOOLCHAIN_BASELINE_UPGRADE_PLAN.md')
    expect(sdkReadme).toContain(formatReleaseCodeSigningRoadmapSdkAutomationReadmeLine())
    expect(sdkReadme).toContain(
      formatReleaseCodeSigningRoadmapSdkAutomationReadmeSigningIndexedLine()
    )
    expect(sdkReadme).toContain(
      formatReleaseCodeSigningRoadmapSdkAutomationReadmeElectronBuilderLine()
    )
    expect(sdkReadme).toContain(
      formatReleaseCodeSigningRoadmapSdkAutomationReadmeChecklistSprintLine()
    )
    expect(sdkReadme).toContain(
      formatPackagedGuiE2ePlaywrightSdkAutomationReadmeChecklistSprintLine()
    )
    expect(sdkReadme).toContain(
      formatToolchainBaselineWipHandoffSdkAutomationReadmeChecklistSprintLine()
    )
    expect(sdkReadme).toContain(formatToolchainBaselineWipHandoffSdkReadmeWipFragment())
    expect(sdkReadme).toContain(formatToolchainBaselineWipHandoffSourcesNextCadenceCommit())
    expect(sdkReadme).toMatch(/J-1440.*отложен/)
    const continuePrompt = readFileSync('scripts/cursor-automation/prompts/continue.txt', 'utf8')
    expect(continuePrompt).toContain(TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE)
    expect(continuePrompt).toMatch(/J-1440.*отложен/)
    expect(continuePrompt).toContain(formatToolchainBaselineWipHandoffSdkPromptWipFragment())
    expect(continuePrompt).toContain(
      formatToolchainBaselineWipHandoffSdkPromptWave5DependabotFragment()
    )
    expect(continuePrompt).toContain(
      formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock()
    )
    expect(continuePrompt).toContain(
      formatReleaseCodeSigningRoadmapSdkContinuePromptElectronBuilderFragment()
    )
    expect(continuePrompt).toContain(
      formatReleaseCodeSigningRoadmapSdkContinuePromptSprintChecklistSection19Fragment()
    )
    expect(continuePrompt).toContain(
      formatPackagedGuiE2ePlaywrightSdkContinuePromptSprintChecklistFragment()
    )
    expect(continuePrompt).toContain(
      formatToolchainBaselineWipHandoffSdkContinuePromptSprintChecklistWave5Fragment()
    )
    expect(continuePrompt).toContain(
      formatToolchainBaselineWipHandoffSdkContinuePromptJ1550PrepFragment()
    )
    expect(continuePrompt).toContain(
      formatToolchainBaselineWipHandoffSdkContinuePromptJ1555PrepFragment()
    )
    expect(continuePrompt).toContain(
      formatToolchainBaselineWipHandoffSdkContinuePromptJ1560PrepFragment()
    )
    const initialPrompt = readFileSync('scripts/cursor-automation/prompts/initial.txt', 'utf8')
    expect(initialPrompt).toContain(TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE)
    expect(initialPrompt).toMatch(/J-1440.*отложен/)
    expect(initialPrompt).toContain(formatToolchainBaselineWipHandoffSdkPromptWipFragment())
    expect(initialPrompt).toContain(
      formatToolchainBaselineWipHandoffSdkPromptWave5DependabotFragment()
    )
    expect(initialPrompt).toContain(
      formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock()
    )
    expect(initialPrompt).toContain(
      formatReleaseCodeSigningRoadmapSdkContinuePromptElectronBuilderFragment()
    )
    expect(initialPrompt).toContain(
      formatReleaseCodeSigningRoadmapSdkContinuePromptSprintChecklistSection19Fragment()
    )
    expect(initialPrompt).toContain(
      formatPackagedGuiE2ePlaywrightSdkContinuePromptSprintChecklistFragment()
    )
    expect(initialPrompt).toContain(
      formatToolchainBaselineWipHandoffSdkContinuePromptSprintChecklistWave5Fragment()
    )
    expect(initialPrompt).toContain(
      formatToolchainBaselineWipHandoffSdkContinuePromptJ1550PrepFragment()
    )
    expect(initialPrompt).toContain(
      formatToolchainBaselineWipHandoffSdkContinuePromptJ1555PrepFragment()
    )
    expect(initialPrompt).toContain(
      formatToolchainBaselineWipHandoffSdkContinuePromptJ1560PrepFragment()
    )
  })

  it('agent-contract and SOURCES_OF_TRUTH reference post-J-1440 cadence', () => {
    const contract = readFileSync('scripts/cursor-automation/prompts/agent-contract.txt', 'utf8')
    expect(contract).toContain(TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE)
    expect(contract).toMatch(/J-1440.*отложен/)
    expect(contract).toContain(formatToolchainBaselineWipHandoffSdkContractClause())
    expect(contract).toContain(formatToolchainBaselineWipHandoffSdkContractJournalCadenceFragment())
    expect(contract).toContain(formatToolchainBaselineWipHandoffSdkContractWipCadenceClause())
    expect(contract).toContain('gate J-1440')
    const sources = readFileSync('docs/SOURCES_OF_TRUTH.md', 'utf8')
    expect(sources).toContain(TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE)
    expect(sources).toMatch(/J-1440.*отложен/)
    expect(sources).toContain(formatToolchainBaselineWipHandoffSourcesPriority7Fragment())
    expect(sources).toContain('toolchain-baseline-wip-handoff-meta.ts')
  })

  it('AGENTS.md and agent-contract share the same WIP gate label', () => {
    const agents = readFileSync('AGENTS.md', 'utf8')
    const contract = readFileSync('scripts/cursor-automation/prompts/agent-contract.txt', 'utf8')
    const agentsGate = agents.match(/gate \*\*J-(\d+)\*\*/)?.[1]
    const contractGate = contract.match(/gate J-(\d+)/)?.[1]
    expect(agentsGate).toBe(contractGate)
  })

  it('AGENTS.md and README WIP cadence align with post-J-1540 calendar', () => {
    const agents = readFileSync('AGENTS.md', 'utf8')
    expect(agents).toContain(formatToolchainBaselineWipHandoffAgentsCadenceLine())
    const continuePrompt = readFileSync('scripts/cursor-automation/prompts/continue.txt', 'utf8')
    const initialPrompt = readFileSync('scripts/cursor-automation/prompts/initial.txt', 'utf8')
    const marathon = readFileSync('docs/AGENT_MARATHON.md', 'utf8')
    expect(marathon).toContain(formatToolchainBaselineWipHandoffPreCommitGitMessage())
    expect(marathon).toContain(TOOLCHAIN_BASELINE_WIP_JOURNAL_RANGE)
    const scope = formatToolchainBaselineWipHandoffPreCommitScopeParagraph()
    expect(marathon).toContain(scope)
    expect(scope).toContain('packaged-gui-e2e-playwright-meta')
    expect(scope).toContain('planned-gui-e2e-steps.ts')
    expect(scope).toContain('planned-gui-e2e-steps.test.ts')
    expect(marathon).toContain(formatToolchainBaselineWipHandoffMarathonHandoffWipParagraph())
    const handoff = formatToolchainBaselineWipHandoffMarathonHandoffWipParagraph()
    expect(handoff).toContain('packaged-gui-e2e-playwright-meta.ts')
    expect(handoff).toContain('J-1546..1556')
    expect(marathon).toContain(formatToolchainBaselineWipHandoffMarathonCadenceJ1545PrepParagraph())
    expect(marathon).toContain(formatToolchainBaselineWipHandoffMarathonCadenceJ1545Paragraph())
    expect(marathon).toContain(formatToolchainBaselineWipHandoffMarathonCadenceJ1546Paragraph())
    expect(marathon).toContain(formatToolchainBaselineWipHandoffMarathonCadenceJ1547Paragraph())
    expect(marathon).toContain(formatToolchainBaselineWipHandoffMarathonCadenceJ1550PrepParagraph())
    expect(marathon).toContain(formatToolchainBaselineWipHandoffMarathonCadenceJ1550Paragraph())
    expect(marathon).toContain(
      formatToolchainBaselineWipHandoffMarathonCadenceJ1550JournalAlignParagraph()
    )
    expect(marathon).toContain(formatToolchainBaselineWipHandoffMarathonCadenceJ1551Paragraph())
    expect(marathon).toContain(formatToolchainBaselineWipHandoffMarathonCadenceJ1555PrepParagraph())
    expect(marathon).toContain(formatToolchainBaselineWipHandoffMarathonCadenceJ1553Paragraph())
    expect(marathon).toContain(
      formatToolchainBaselineWipHandoffMarathonCadenceJ1554JournalAlignParagraph()
    )
    expect(marathon).toContain(formatToolchainBaselineWipHandoffMarathonCadenceJ1555Paragraph())
    expect(marathon).toContain(
      formatToolchainBaselineWipHandoffMarathonCadenceJ1556JournalAlignParagraph()
    )
    expect(marathon).toContain(formatToolchainBaselineWipHandoffMarathonCadenceJ1560PrepParagraph())
    expect(continuePrompt).toContain(
      formatToolchainBaselineWipHandoffSdkContinuePromptPreCommitJournalReminderFragment()
    )
    expect(initialPrompt).toContain(
      formatToolchainBaselineWipHandoffSdkContinuePromptPreCommitJournalReminderFragment()
    )
    expect(TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE).toBe('J-1560')
    expect(marathon).toContain(`**Следующий cadence:** **${TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE}**`)
    for (const file of ['AGENTS.md', 'README.md']) {
      const text = readFileSync(file, 'utf8')
      expect(text).toContain(TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE)
      expect(text).toMatch(/J-1440.*отложен/)
      expect(text).toContain('27')
    }
  })

  it('help-workflow crosslinks planned GUI count matches Playwright meta', () => {
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_PLANNED_GUI_E2E_COUNT).toBe(
      PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT
    )
  })

  it('SDK continue and initial prompts reference post-J-1440 cadence', () => {
    for (const rel of [
      'scripts/cursor-automation/prompts/continue.txt',
      'scripts/cursor-automation/prompts/initial.txt'
    ]) {
      const text = readFileSync(rel, 'utf8')
      expect(text).toContain(TOOLCHAIN_BASELINE_WIP_NEXT_CADENCE)
      expect(text).toMatch(/J-1440.*отложен/)
    }
  })

  it('CI uses .nvmrc Node 24; windows check job and linux quiet gate', () => {
    expect(readFileSync('.nvmrc', 'utf8').trim()).toBe('24')
    const ci = readFileSync('.github/workflows/ci.yml', 'utf8')
    expect(ci).toContain('runs-on: windows-latest')
    expect(ci).toContain('node-version-file: .nvmrc')
    expect(ci).toContain('npm run check')
    expect(ci).toContain('npm run check:quiet')
    expect(ci).toContain('runs-on: ubuntu-latest')
  })
})
