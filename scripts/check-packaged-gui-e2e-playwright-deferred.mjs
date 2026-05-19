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
  formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine,
  formatPackagedGuiE2ePlaywrightAboutSupportLogsHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightPlannerScenariosHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightPackagedSmokeHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightFfmpegTerminalHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightKnowledgeHubHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightAgentsMdUiHintsTail,
  formatPackagedGuiE2ePlaywrightRootReadmePlaywrightSection,
  formatPackagedGuiE2ePlaywrightSourcesOfTruthHelpUiHintsNote,
  formatPackagedGuiE2ePlaywrightBinReadmeUiHintsLine,
  formatPackagedGuiE2ePlaywrightReleaseCopyAppendixUiTail,
  formatPackagedGuiE2ePlaywrightReleaseDeferredBullet,
  formatPackagedGuiE2ePlaywrightReleaseOwnerVisualSmokeLocaleLine,
  formatPackagedGuiE2ePlaywrightUiHintSuffix
} from '../src/shared/packaged-gui-e2e-playwright-meta.ts'
import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ALL_PACKAGED_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FFMPEG_TERMINAL_HELP_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_KNOWLEDGE_HELP_PATHS
} from '../src/shared/packaged-e2e-help-workflow-crosslinks-meta.ts'
import { PACKAGED_E2E_SMOKE_REGISTRY } from '../src/shared/packaged-e2e-smoke-registry.ts'
import { REPO_ROOT } from './lib/repo-root.mjs'

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
const agentsUiTail = formatPackagedGuiE2ePlaywrightAgentsMdUiHintsTail()
if (!agentsMdText.includes(agentsUiTail)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] AGENTS.md must include formatPackagedGuiE2ePlaywrightAgentsMdUiHintsTail()'
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
  const loggingRel =
    locale === 'en' ? 'Help/en/logging-and-diagnostics.md' : 'Help/logging-and-diagnostics.md'
  const loggingHelpText = fs.readFileSync(path.join(REPO_ROOT, loggingRel), 'utf8')
  const loggingUiSuffix = formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix(locale)
  if (!loggingHelpText.includes(loggingUiSuffix)) {
    console.error(
      `[check:packaged-gui-e2e-playwright-deferred] ${loggingRel} must include formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix(${locale})`
    )
    process.exit(1)
  }
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
if (!packagingText.includes('formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine()')) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] platform-packaging-scripts.ts must call formatPackagedGuiE2ePlaywrightDeferredDiagnosticLine()'
  )
  process.exit(1)
}

const releaseText = fs.readFileSync(path.join(REPO_ROOT, 'docs/RELEASE.md'), 'utf8')
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
const copyAppendixTail = formatPackagedGuiE2ePlaywrightReleaseCopyAppendixUiTail()
if (!releaseText.includes(copyAppendixTail)) {
  console.error(
    '[check:packaged-gui-e2e-playwright-deferred] docs/RELEASE.md must include formatPackagedGuiE2ePlaywrightReleaseCopyAppendixUiTail()'
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
