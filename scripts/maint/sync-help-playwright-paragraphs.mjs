/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §21 — sync Help owner/packaged/logging paragraphs from formatters (one-shot maintainer).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import {
  formatPackagedE2eHelpWorkflowCrosslinksAboutSupportReleaseSmokeDevParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksLoggingDevParagraph,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedCopyPlannedGuiTail,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedMacLinuxCopyDevClause,
  formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCopyDevClause
} from '../lib/help-workflow-crosslinks-meta.mjs'
import {
  formatPackagedGuiE2ePlaywrightAboutSupportLogsHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix,
  formatPackagedGuiE2ePlaywrightLoggingPlannedGuiScopeClause,
  formatPackagedGuiE2ePlaywrightPackagedSmokeHelpUiHintSuffix
} from '../../src/shared/packaged-gui-e2e-playwright-meta.ts'
import { REPO_ROOT } from '../lib/repo-root.mjs'

const LOG_PREFIX = 'sync-help-playwright-paragraphs'

function replaceFromMarker(text, marker, replacement) {
  const start = text.indexOf(marker)
  if (start < 0) {
    throw new Error(`marker not found: ${marker}`)
  }
  let end = text.indexOf('\n\n', start)
  if (end < 0) {
    end = text.length
  } else {
    end += 2
  }
  return (
    text.slice(0, start) +
    replacement.trimEnd() +
    (end < text.length ? '\n\n' + text.slice(end).trimStart() : '')
  )
}

function replaceLinePrefix(text, prefix, replacement) {
  const re = new RegExp(`^${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?$`, 'm')
  if (!re.test(text)) {
    throw new Error(`line prefix not found: ${prefix}`)
  }
  return text.replace(re, replacement.trimEnd())
}

function syncPackagedWin(rel, locale) {
  const path = join(REPO_ROOT, rel)
  const tail = formatPackagedE2eHelpWorkflowCrosslinksPackagedCopyPlannedGuiTail(
    locale,
    formatPackagedE2eHelpWorkflowCrosslinksPackagedWinCopyDevClause(locale),
    formatPackagedGuiE2ePlaywrightPackagedSmokeHelpUiHintSuffix(locale)
  )
  writeFileSync(path, replaceFromMarker(readFileSync(path, 'utf8'), '**Planned GUI e2e**', tail))
  console.log(`[${LOG_PREFIX}] ${rel} packaged-tail`)
}

function syncPackagedMacLinux(rel, locale) {
  const path = join(REPO_ROOT, rel)
  const tail = formatPackagedE2eHelpWorkflowCrosslinksPackagedCopyPlannedGuiTail(
    locale,
    formatPackagedE2eHelpWorkflowCrosslinksPackagedMacLinuxCopyDevClause(locale),
    formatPackagedGuiE2ePlaywrightPackagedSmokeHelpUiHintSuffix(locale)
  )
  writeFileSync(path, replaceFromMarker(readFileSync(path, 'utf8'), '**Planned GUI e2e**', tail))
  console.log(`[${LOG_PREFIX}] ${rel} packaged-tail`)
}

function syncAbout(rel, locale) {
  const path = join(REPO_ROOT, rel)
  const paragraph = formatPackagedE2eHelpWorkflowCrosslinksAboutSupportReleaseSmokeDevParagraph(
    locale,
    formatPackagedGuiE2ePlaywrightAboutSupportLogsHelpUiHintSuffix(locale)
  )
  const text = readFileSync(path, 'utf8')
  const marker = locale === 'ru' ? '- **`releaseSmoke:`**' : '- **`releaseSmoke:`**'
  const start = text.indexOf(marker)
  if (start < 0) {
    throw new Error(`${rel}: releaseSmoke bullet not found`)
  }
  const devStart = text.indexOf('dev:', start)
  const nextBullet = text.indexOf('\n-', devStart)
  const end = nextBullet < 0 ? text.length : nextBullet
  const head = text.slice(0, devStart)
  const tail = text.slice(end)
  writeFileSync(path, head + paragraph.trimStart() + tail)
  console.log(`[${LOG_PREFIX}] ${rel} about-dev`)
}

function syncLogging(rel, locale) {
  const path = join(REPO_ROOT, rel)
  const paragraph = formatPackagedE2eHelpWorkflowCrosslinksLoggingDevParagraph(
    locale,
    formatPackagedGuiE2ePlaywrightLoggingPlannedGuiScopeClause(locale),
    formatPackagedGuiE2ePlaywrightLoggingDiagnosticsHelpUiHintSuffix(locale)
  )
  writeFileSync(path, replaceLinePrefix(readFileSync(path, 'utf8'), 'Dev:', paragraph))
  console.log(`[${LOG_PREFIX}] ${rel} logging-dev`)
}

syncAbout('Help/ru/about-support-logs.md', 'ru')
syncAbout('Help/en/about-support-logs.md', 'en')
syncLogging('Help/ru/logging-and-diagnostics.md', 'ru')
syncLogging('Help/en/logging-and-diagnostics.md', 'en')
syncPackagedWin('Help/ru/packaged-windows-smoke.md', 'ru')
syncPackagedWin('Help/en/packaged-windows-smoke.md', 'en')
syncPackagedMacLinux('Help/ru/packaged-linux-smoke.md', 'ru')
syncPackagedMacLinux('Help/en/packaged-linux-smoke.md', 'en')
syncPackagedMacLinux('Help/ru/packaged-macos-smoke.md', 'ru')
syncPackagedMacLinux('Help/en/packaged-macos-smoke.md', 'en')

console.log(`[${LOG_PREFIX}] OK`)
