/**
 * §21 — Playwright GUI e2e deferred: registry count, reserved npm name, diagnostics wiring.
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY,
  PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT,
  PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS,
  formatPackagedGuiE2ePlaywrightArchitectureUiHintsClause,
  formatPackagedGuiE2ePlaywrightArchitectureScaffoldClause,
  formatPackagedGuiE2ePlaywrightArchitectureStepByIdClause,
  formatPackagedGuiE2ePlaywrightArchitectureWiringHandoffClause,
  formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine,
  formatPackagedGuiE2ePlaywrightAboutSupportLogsHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightLoggingPlannedGuiScopeClause,
  formatPackagedGuiE2ePlaywrightPlannerScenariosHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightPackagedSmokeHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightFfmpegTerminalHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightKnowledgeHubHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightAgentsMdHelpPlaywrightSection,
  formatPackagedGuiE2ePlaywrightRootReadmePlaywrightSection,
  formatPackagedGuiE2ePlaywrightSourcesOfTruthHelpUiHintsNote,
  formatPackagedGuiE2ePlaywrightSourcesOfTruthScaffoldNote,
  formatPackagedGuiE2ePlaywrightSourcesOfTruthStepByIdNote,
  formatPackagedGuiE2ePlaywrightSourcesOfTruthWiringHandoffNote,
  formatPackagedGuiE2ePlaywrightBinReadmeUiHintsLine,
  formatPackagedGuiE2ePlaywrightBinReadmeScaffoldLine,
  formatPackagedGuiE2ePlaywrightBinReadmeStepByIdLine,
  formatPackagedGuiE2ePlaywrightBinReadmeWiringHandoffLine,
  PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE,
  formatPackagedGuiE2ePlaywrightReleaseCopyAppendixUiTail,
  formatPackagedGuiE2ePlaywrightReleaseDeferredBullet,
  formatPackagedGuiE2ePlaywrightReleaseOwnerVisualSmokeLocaleLine,
  formatPackagedGuiE2ePlaywrightReleaseScenariosRegistryLine,
  formatPackagedGuiE2ePlaywrightReleaseScaffoldBullet,
  formatPackagedGuiE2ePlaywrightReleaseStepByIdBullet,
  formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet,
  formatPackagedGuiE2ePlaywrightOperationalNotesRow,
  formatPackagedGuiE2ePlaywrightUiHintSuffix
} from '../src/shared/packaged-gui-e2e-playwright-meta.ts'
import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_TERMINAL_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KNOWLEDGE_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GETTING_STARTED_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_PATHS,
  formatPackagedE2eHelpWorkflowCrosslinksGettingStartedPackagedSmokeParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksAgentsMdFullHelpLine,
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmePlaywrightDeferredLine,
  formatPackagedE2eHelpWorkflowCrosslinksReleaseHelpWorkflowCrosslinksLine,
  formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeScaffoldClause,
  formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause,
  formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWiringHandoffClause
} from '../src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts'
import { PACKAGED_E2E_SMOKE_REGISTRY } from '../src/shared/packaged-e2e-smoke-registry.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- hub Help guard helper
function assertHubWiringHandoff(rel, text, locale) {
  const wiring = formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWiringHandoffClause(locale)
  if (!text.includes(wiring)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${rel} must include formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeWiringHandoffClause(${locale})`
    )
    process.exit(1)
  }
}

const packageScripts =
  JSON.parse(fs.readFileSync(path.join(REPO_ROOT, 'package.json'), 'utf8')).scripts ?? {}

const plannedIds = PACKAGED_E2E_SMOKE_REGISTRY.filter(
  (s) => s.automation === 'planned-gui-e2e'
).map((s) => s.stepId)

if (plannedIds.length !== PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT) {
  console.error(
    `[check:packaged-gui-e2e-playwright-deferred] planned-gui-e2e count ${plannedIds.length} !== ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT}`
  )
  process.exit(1)
}

if (typeof packageScripts[PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT] === 'string') {
  console.error(
    `[check:packaged-gui-e2e-playwright-deferred] package.json must not define ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT} until Playwright is wired`
  )
  process.exit(1)
}

const agentsMdText = fs.readFileSync(path.join(REPO_ROOT, 'AGENTS.md'), 'utf8')
const agentsPlaywrightSection = formatPackagedGuiE2ePlaywrightAgentsMdHelpPlaywrightSection()
const agentsFullHelpLine =
  formatPackagedE2eHelpWorkflowCrosslinksAgentsMdFullHelpLine(agentsPlaywrightSection)
if (!agentsMdText.includes(agentsFullHelpLine)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] AGENTS.md must include formatPackagedE2eHelpWorkflowCrosslinksAgentsMdFullHelpLine(formatPackagedGuiE2ePlaywrightAgentsMdHelpPlaywrightSection())'
  )
  process.exit(1)
}

const rootReadmeText = fs.readFileSync(path.join(REPO_ROOT, 'README.md'), 'utf8')
const rootReadmeSection = formatPackagedGuiE2ePlaywrightRootReadmePlaywrightSection()
if (!rootReadmeText.includes(rootReadmeSection)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] README.md must include formatPackagedGuiE2ePlaywrightRootReadmePlaywrightSection()'
  )
  process.exit(1)
}

const sourcesText = fs.readFileSync(path.join(REPO_ROOT, 'docs/SOURCES_OF_TRUTH.md'), 'utf8')
const sourcesNote = formatPackagedGuiE2ePlaywrightSourcesOfTruthHelpUiHintsNote()
if (!sourcesText.includes(sourcesNote)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/SOURCES_OF_TRUTH.md must include formatPackagedGuiE2ePlaywrightSourcesOfTruthHelpUiHintsNote()'
  )
  process.exit(1)
}
const sourcesScaffoldNote = formatPackagedGuiE2ePlaywrightSourcesOfTruthScaffoldNote()
if (!sourcesText.includes(sourcesScaffoldNote)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/SOURCES_OF_TRUTH.md must include formatPackagedGuiE2ePlaywrightSourcesOfTruthScaffoldNote()'
  )
  process.exit(1)
}
const sourcesStepByIdNote = formatPackagedGuiE2ePlaywrightSourcesOfTruthStepByIdNote()
if (!sourcesText.includes(sourcesStepByIdNote)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/SOURCES_OF_TRUTH.md must include formatPackagedGuiE2ePlaywrightSourcesOfTruthStepByIdNote()'
  )
  process.exit(1)
}
const sourcesWiringNote = formatPackagedGuiE2ePlaywrightSourcesOfTruthWiringHandoffNote()
if (!sourcesText.includes(sourcesWiringNote)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/SOURCES_OF_TRUTH.md must include formatPackagedGuiE2ePlaywrightSourcesOfTruthWiringHandoffNote()'
  )
  process.exit(1)
}

for (const locale of ['en', 'ru']) {
  const aboutRel = locale === 'en' ? 'Help/en/about-support-logs.md' : 'Help/about-support-logs.md'
  const aboutHelpText = fs.readFileSync(path.join(REPO_ROOT, aboutRel), 'utf8')
  const aboutUiSuffix = formatPackagedGuiE2ePlaywrightAboutSupportLogsHelpUiHintSuffix(locale)
  if (!aboutHelpText.includes(aboutUiSuffix)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${aboutRel} must include formatPackagedGuiE2ePlaywrightAboutSupportLogsHelpUiHintSuffix(${locale})`
    )
    process.exit(1)
  }
  const aboutStepById =
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale)
  if (!aboutHelpText.includes(aboutStepById)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${aboutRel} must include formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(${locale})`
    )
    process.exit(1)
  }
  assertHubWiringHandoff(aboutRel, aboutHelpText, locale)
  const loggingRel =
    locale === 'en' ? 'Help/en/logging-and-diagnostics.md' : 'Help/logging-and-diagnostics.md'
  const loggingHelpText = fs.readFileSync(path.join(REPO_ROOT, loggingRel), 'utf8')
  const loggingScopeClause = formatPackagedGuiE2ePlaywrightLoggingPlannedGuiScopeClause(locale)
  if (!loggingHelpText.includes(loggingScopeClause)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${loggingRel} must include formatPackagedGuiE2ePlaywrightLoggingPlannedGuiScopeClause(${locale})`
    )
    process.exit(1)
  }
  const loggingUiSuffix = formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix(locale)
  if (!loggingHelpText.includes(loggingUiSuffix)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${loggingRel} must include formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix(${locale})`
    )
    process.exit(1)
  }
  const loggingStepById =
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale)
  if (!loggingHelpText.includes(loggingStepById)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${loggingRel} must include formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(${locale})`
    )
    process.exit(1)
  }
  assertHubWiringHandoff(loggingRel, loggingHelpText, locale)
  const plannerRel =
    locale === 'en'
      ? 'Help/en/workflows-planner-scenarios.md'
      : 'Help/workflows-planner-scenarios.md'
  const plannerHelpText = fs.readFileSync(path.join(REPO_ROOT, plannerRel), 'utf8')
  const plannerUiSuffix = formatPackagedGuiE2ePlaywrightPlannerScenariosHelpUiHintSuffix(locale)
  if (!plannerHelpText.includes(plannerUiSuffix)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${plannerRel} must include formatPackagedGuiE2ePlaywrightPlannerScenariosHelpUiHintSuffix(${locale})`
    )
    process.exit(1)
  }
  const plannerStepById =
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale)
  if (!plannerHelpText.includes(plannerStepById)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${plannerRel} must include formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(${locale})`
    )
    process.exit(1)
  }
  assertHubWiringHandoff(plannerRel, plannerHelpText, locale)
}
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  const packagedHelpText = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8')
  const packagedUiSuffix = formatPackagedGuiE2ePlaywrightPackagedSmokeHelpUiHintSuffix(locale)
  if (!packagedHelpText.includes(packagedUiSuffix)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${rel} must include formatPackagedGuiE2ePlaywrightPackagedSmokeHelpUiHintSuffix(${locale})`
    )
    process.exit(1)
  }
  const packagedStepById =
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale)
  if (!packagedHelpText.includes(packagedStepById)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${rel} must include formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(${locale})`
    )
    process.exit(1)
  }
  assertHubWiringHandoff(rel, packagedHelpText, locale)
}
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_TERMINAL_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  const ffmpegHelpText = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8')
  const ffmpegUiSuffix = formatPackagedGuiE2ePlaywrightFfmpegTerminalHelpUiHintSuffix(locale)
  if (!ffmpegHelpText.includes(ffmpegUiSuffix)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${rel} must include formatPackagedGuiE2ePlaywrightFfmpegTerminalHelpUiHintSuffix(${locale})`
    )
    process.exit(1)
  }
  const ffmpegScaffold =
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeScaffoldClause(locale)
  if (!ffmpegHelpText.includes(ffmpegScaffold)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${rel} must include formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeScaffoldClause(${locale})`
    )
    process.exit(1)
  }
  const ffmpegStepById =
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale)
  if (!ffmpegHelpText.includes(ffmpegStepById)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${rel} must include formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(${locale})`
    )
    process.exit(1)
  }
  assertHubWiringHandoff(rel, ffmpegHelpText, locale)
}
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KNOWLEDGE_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  const knowledgeHelpText = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8')
  const knowledgeUiSuffix = formatPackagedGuiE2ePlaywrightKnowledgeHubHelpUiHintSuffix(locale)
  if (!knowledgeHelpText.includes(knowledgeUiSuffix)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${rel} must include formatPackagedGuiE2ePlaywrightKnowledgeHubHelpUiHintSuffix(${locale})`
    )
    process.exit(1)
  }
  const knowledgeScaffold =
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeScaffoldClause(locale)
  if (!knowledgeHelpText.includes(knowledgeScaffold)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${rel} must include formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeScaffoldClause(${locale})`
    )
    process.exit(1)
  }
  const knowledgeStepById =
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale)
  if (!knowledgeHelpText.includes(knowledgeStepById)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${rel} must include formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(${locale})`
    )
    process.exit(1)
  }
  assertHubWiringHandoff(rel, knowledgeHelpText, locale)
}
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GETTING_STARTED_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  const gettingStartedText = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8')
  const paragraph =
    formatPackagedE2eHelpWorkflowCrosslinksGettingStartedPackagedSmokeParagraph(locale)
  if (!gettingStartedText.includes(paragraph)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${rel} must include formatPackagedE2eHelpWorkflowCrosslinksGettingStartedPackagedSmokeParagraph(${locale})`
    )
    process.exit(1)
  }
}
for (const rel of PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  const ownerHelpText = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8')
  const stepByIdClause =
    formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(locale)
  if (!ownerHelpText.includes(stepByIdClause)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${rel} must include formatPackagedE2eHelpWorkflowCrosslinksOwnerManualSmokeStepByIdClause(${locale})`
    )
    process.exit(1)
  }
  assertHubWiringHandoff(rel, ownerHelpText, locale)
}

const binReadmeText = fs.readFileSync(path.join(REPO_ROOT, 'bin/README.md'), 'utf8')
const binUiHintsLine = formatPackagedGuiE2ePlaywrightBinReadmeUiHintsLine()
if (!binReadmeText.includes('check:packaged-gui-e2e-playwright-deferred')) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] bin/README.md must mention check:packaged-gui-e2e-playwright-deferred'
  )
  process.exit(1)
}
if (!binReadmeText.includes(binUiHintsLine)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] bin/README.md must include formatPackagedGuiE2ePlaywrightBinReadmeUiHintsLine()'
  )
  process.exit(1)
}
const binPlaywrightDeferredLine =
  formatPackagedE2eHelpWorkflowCrosslinksBinReadmePlaywrightDeferredLine()
if (!binReadmeText.includes(binPlaywrightDeferredLine)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] bin/README.md must include formatPackagedE2eHelpWorkflowCrosslinksBinReadmePlaywrightDeferredLine()'
  )
  process.exit(1)
}
const binScaffoldLine = formatPackagedGuiE2ePlaywrightBinReadmeScaffoldLine()
if (!binReadmeText.includes(binScaffoldLine)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] bin/README.md must include formatPackagedGuiE2ePlaywrightBinReadmeScaffoldLine()'
  )
  process.exit(1)
}
const binStepByIdLine = formatPackagedGuiE2ePlaywrightBinReadmeStepByIdLine()
if (!binReadmeText.includes(binStepByIdLine)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] bin/README.md must include formatPackagedGuiE2ePlaywrightBinReadmeStepByIdLine()'
  )
  process.exit(1)
}
const binWiringLine = formatPackagedGuiE2ePlaywrightBinReadmeWiringHandoffLine()
if (!binReadmeText.includes(binWiringLine)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] bin/README.md must include formatPackagedGuiE2ePlaywrightBinReadmeWiringHandoffLine()'
  )
  process.exit(1)
}
const scaffoldPath = path.join(REPO_ROOT, PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE)
if (!fs.existsSync(scaffoldPath)) {
  console.error(
    `[check:packaged-gui-e2e-playwright-deferred] missing ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE}`
  )
  process.exit(1)
}
const scaffoldText = fs.readFileSync(scaffoldPath, 'utf8')
if (!scaffoldText.includes('PACKAGED_E2E_PLANNED_GUI_STEP_IDS')) {
  console.error(
    `[check:packaged-gui-e2e-playwright-deferred] ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE} must export PACKAGED_E2E_PLANNED_GUI_STEP_IDS (as PLANNED_GUI_E2E_STEP_IDS)`
  )
  process.exit(1)
}
if (!scaffoldText.includes('PLANNED_GUI_E2E_SCENARIOS')) {
  console.error(
    `[check:packaged-gui-e2e-playwright-deferred] ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE} must export PLANNED_GUI_E2E_SCENARIOS`
  )
  process.exit(1)
}
if (!scaffoldText.includes('PLANNED_GUI_E2E_STEP_BY_ID')) {
  console.error(
    `[check:packaged-gui-e2e-playwright-deferred] ${PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_SCENARIOS_MODULE} must export PLANNED_GUI_E2E_STEP_BY_ID`
  )
  process.exit(1)
}

const operationalNotesText = fs.readFileSync(
  path.join(REPO_ROOT, 'docs/AGENT_OPERATIONAL_NOTES.md'),
  'utf8'
)
const operationalNotesRow = formatPackagedGuiE2ePlaywrightOperationalNotesRow()
if (!operationalNotesText.includes(operationalNotesRow)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/AGENT_OPERATIONAL_NOTES.md must include formatPackagedGuiE2ePlaywrightOperationalNotesRow()'
  )
  process.exit(1)
}

const packagingText = fs.readFileSync(
  path.join(REPO_ROOT, 'src/shared/platform-packaging-scripts.ts'),
  'utf8'
)
const diag = formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine()
const scenariosText = fs.readFileSync(
  path.join(REPO_ROOT, 'src/shared/packaged-e2e-smoke-scenarios.ts'),
  'utf8'
)
if (!scenariosText.includes('formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine()')) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] packaged-e2e-smoke-scenarios.ts must call formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine() in formatPackagedE2eSmokeDiagnosticLines (Copy/releaseSmoke appendix)'
  )
  process.exit(1)
}
if (!scenariosText.includes('formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine()')) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] packaged-e2e-smoke-scenarios.ts must call formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine() in formatPackagedE2eSmokeDiagnosticLines'
  )
  process.exit(1)
}
if (!scenariosText.includes('formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine()')) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] packaged-e2e-smoke-scenarios.ts must call formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine() in formatPackagedE2eSmokeDiagnosticLines'
  )
  process.exit(1)
}
if (!packagingText.includes('formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine()')) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] platform-packaging-scripts.ts must call formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine()'
  )
  process.exit(1)
}
for (const rel of [
  'src/shared/packaged-manual-smoke-plain-text.ts',
  'src/shared/packaged-release-smoke.ts'
]) {
  const text = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8')
  if (!text.includes('formatPackagedE2eSmokeDiagnosticLines')) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${rel} must use formatPackagedE2eSmokeDiagnosticLines (Playwright deferred diagnostic in appendix)`
    )
    process.exit(1)
  }
}
const checkReleaseText = fs.readFileSync(
  path.join(REPO_ROOT, 'src/shared/check-release-scripts.ts'),
  'utf8'
)
if (!checkReleaseText.includes('formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine()')) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] check-release-scripts.ts must call formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine()'
  )
  process.exit(1)
}
if (!checkReleaseText.includes('formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine()')) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] check-release-scripts.ts must call formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine()'
  )
  process.exit(1)
}
if (!checkReleaseText.includes('formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine()')) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] check-release-scripts.ts must call formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine()'
  )
  process.exit(1)
}
if (!packagingText.includes('formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine()')) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] platform-packaging-scripts.ts must call formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine()'
  )
  process.exit(1)
}
if (!packagingText.includes('formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine()')) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] platform-packaging-scripts.ts must call formatPackagedGuiE2ePlaywrightScaffoldDiagnosticLine()'
  )
  process.exit(1)
}

const releaseText = fs.readFileSync(path.join(REPO_ROOT, 'docs/RELEASE.md'), 'utf8')
const scenariosRegistryLine = formatPackagedGuiE2ePlaywrightReleaseScenariosRegistryLine()
if (!releaseText.includes(scenariosRegistryLine)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/RELEASE.md must include formatPackagedGuiE2ePlaywrightReleaseScenariosRegistryLine()'
  )
  process.exit(1)
}
const ownerVisualLine = formatPackagedGuiE2ePlaywrightReleaseOwnerVisualSmokeLocaleLine()
const deferredBullet = formatPackagedGuiE2ePlaywrightReleaseDeferredBullet()
if (!releaseText.includes(ownerVisualLine)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/RELEASE.md must include formatPackagedGuiE2ePlaywrightReleaseOwnerVisualSmokeLocaleLine()'
  )
  process.exit(1)
}
if (!releaseText.includes(deferredBullet)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/RELEASE.md must include formatPackagedGuiE2ePlaywrightReleaseDeferredBullet()'
  )
  process.exit(1)
}
const scaffoldBullet = formatPackagedGuiE2ePlaywrightReleaseScaffoldBullet()
if (!releaseText.includes(scaffoldBullet)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/RELEASE.md must include formatPackagedGuiE2ePlaywrightReleaseScaffoldBullet()'
  )
  process.exit(1)
}
const stepByIdBullet = formatPackagedGuiE2ePlaywrightReleaseStepByIdBullet()
if (!releaseText.includes(stepByIdBullet)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/RELEASE.md must include formatPackagedGuiE2ePlaywrightReleaseStepByIdBullet()'
  )
  process.exit(1)
}
const wiringHandoffBullet = formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet()
if (!releaseText.includes(wiringHandoffBullet)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/RELEASE.md must include formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet()'
  )
  process.exit(1)
}
const copyAppendixTail = formatPackagedGuiE2ePlaywrightReleaseCopyAppendixUiTail()
if (!releaseText.includes(copyAppendixTail)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/RELEASE.md must include formatPackagedGuiE2ePlaywrightReleaseCopyAppendixUiTail()'
  )
  process.exit(1)
}
const helpWorkflowLine = formatPackagedE2eHelpWorkflowCrosslinksReleaseHelpWorkflowCrosslinksLine()
if (!releaseText.includes(helpWorkflowLine)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/RELEASE.md must include formatPackagedE2eHelpWorkflowCrosslinksReleaseHelpWorkflowCrosslinksLine()'
  )
  process.exit(1)
}

const architectureText = fs.readFileSync(path.join(REPO_ROOT, 'docs/ARCHITECTURE.md'), 'utf8')
const architectureUiClause = formatPackagedGuiE2ePlaywrightArchitectureUiHintsClause()
if (!architectureText.includes(architectureUiClause)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/ARCHITECTURE.md must include formatPackagedGuiE2ePlaywrightArchitectureUiHintsClause()'
  )
  process.exit(1)
}
const architectureScaffoldClause = formatPackagedGuiE2ePlaywrightArchitectureScaffoldClause()
if (!architectureText.includes(architectureScaffoldClause)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/ARCHITECTURE.md must include formatPackagedGuiE2ePlaywrightArchitectureScaffoldClause()'
  )
  process.exit(1)
}
const architectureStepByIdClause = formatPackagedGuiE2ePlaywrightArchitectureStepByIdClause()
if (!architectureText.includes(architectureStepByIdClause)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/ARCHITECTURE.md must include formatPackagedGuiE2ePlaywrightArchitectureStepByIdClause()'
  )
  process.exit(1)
}
const architectureWiringClause = formatPackagedGuiE2ePlaywrightArchitectureWiringHandoffClause()
if (!architectureText.includes(architectureWiringClause)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/ARCHITECTURE.md must include formatPackagedGuiE2ePlaywrightArchitectureWiringHandoffClause()'
  )
  process.exit(1)
}

if (PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS.length !== 4) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS must list 4 settings.json keys'
  )
  process.exit(1)
}
for (const locale of ['ru', 'en']) {
  for (const key of PACKAGED_GUI_E2E_PLAYWRIGHT_SETTINGS_UI_HINT_KEYS) {
    const suffix = formatPackagedGuiE2ePlaywrightUiHintSuffix(key, locale)
    if (!suffix.includes(PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT)) {
      console.error(
        `[check:packaged-gui-e2e-playwright-deferred] formatPackagedGuiE2ePlaywrightUiHintSuffix(${key}, ${locale}) must mention ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT}`
      )
      process.exit(1)
    }
  }
  const aboutSuffix = formatPackagedGuiE2ePlaywrightUiHintSuffix(
    PACKAGED_GUI_E2E_PLAYWRIGHT_ABOUT_UI_HINT_KEY,
    locale
  )
  if (!aboutSuffix.includes(PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_CHECK_NPM_SCRIPT)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] about UI hint suffix (${locale}) must mention deferred check script`
    )
    process.exit(1)
  }
}

console.log(
  `[check:packaged-gui-e2e-playwright-deferred] OK (${plannedIds.length} planned-gui-e2e; ${PACKAGED_GUI_E2E_PLAYWRIGHT_DEFERRED_NPM_SCRIPT} deferred; ${diag})`
)
