/**
 * Strip dev tails from workflow Help articles; append user crosslink footer.
 * Run: node scripts/maint/sync-help-workflow-user-footers.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FAQ_HELP_PATHS,
  formatPackagedE2eHelpWorkflowCrosslinksWorkflowUserFooter
} from '../lib/help-workflow-crosslinks-meta.mjs'

const SYNC_HELP_PATHS = [
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINK_ARTICLE_PATHS,
  ...PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_FAQ_HELP_PATHS
]
import { REPO_ROOT } from '../lib/repo-root.mjs'

const DEV_LINE_RE =
  /§21 e2e|check:help-workflow|partition:|releaseSmoke:|terminalHints:|formatPackaged|PLANNED_GUI|Playwright scaffold|dev-блок|dev block|check:packaged-gui|§19 publish|notarytool|Wiring:|registry `note`|Help:\s*`check:/i

const SEE_ALSO_HEADING_RE = /^## (См\. также|See also|Further|Дальше)\s*$/i

let changed = 0
for (const rel of SYNC_HELP_PATHS) {
  const locale = rel.includes('/en/') ? 'en' : 'ru'
  const footer = formatPackagedE2eHelpWorkflowCrosslinksWorkflowUserFooter(locale)
  const abs = path.join(REPO_ROOT, rel)
  const lines = fs.readFileSync(abs, 'utf8').split(/\r?\n/)
  const kept = []
  for (const line of lines) {
    if (DEV_LINE_RE.test(line)) {
      continue
    }
    kept.push(line)
  }
  while (kept.length > 0 && kept[kept.length - 1].trim() === '') {
    kept.pop()
  }
  const seeIdx = kept.findIndex((line) => SEE_ALSO_HEADING_RE.test(line.trim()))
  if (seeIdx >= 0) {
    kept.splice(seeIdx)
    while (kept.length > 0 && kept[kept.length - 1].trim() === '') {
      kept.pop()
    }
  }
  const heading = locale === 'ru' ? '## См. также' : '## See also'
  kept.push('')
  kept.push(heading)
  kept.push('')
  kept.push(footer)

  if (rel.endsWith('getting-started.md')) {
    const appearanceLink =
      locale === 'ru'
        ? '- Тема, язык, HiDPI — [appearance-language-theme.md](appearance-language-theme.md)'
        : '- Theme, language, HiDPI — [appearance-language-theme.md](appearance-language-theme.md)'
    if (!kept.some((l) => l.includes('appearance-language-theme.md'))) {
      const faqIdx = kept.findIndex((l) => l.includes('faq-troubleshooting.md'))
      const insertAt = faqIdx >= 0 ? faqIdx : kept.length - 3
      kept.splice(insertAt, 0, appearanceLink)
    }
  }

  if (rel.endsWith('knowledge-base-howto.md')) {
    const themeSection =
      locale === 'ru'
        ? [
            '',
            '## Тема и масштаб экрана',
            '',
            '- [appearance-language-theme.md](appearance-language-theme.md)',
            '- [about-support-logs.md](about-support-logs.md) (Support ZIP `ownerHardwareChecklist:`)'
          ]
        : [
            '',
            '## Theme and display scale',
            '',
            '- [appearance-language-theme.md](appearance-language-theme.md)',
            '- [about-support-logs.md](about-support-logs.md) (Support ZIP `ownerHardwareChecklist:`)'
          ]
    if (!kept.some((l) => l.includes('appearance-language-theme.md'))) {
      const seeAlsoIdx = kept.findIndex((l) => SEE_ALSO_HEADING_RE.test(l.trim()))
      kept.splice(seeAlsoIdx >= 0 ? seeAlsoIdx : kept.length, 0, ...themeSection)
    }
  }

  const next = `${kept.join('\n').trimEnd()}\n`
  const prev = fs.readFileSync(abs, 'utf8')
  if (next !== prev) {
    fs.writeFileSync(abs, next)
    changed++
  }
}

console.log(
  `[sync-help-workflow-user-footers] updated ${changed}/${SYNC_HELP_PATHS.length} Help files`
)
