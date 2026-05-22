/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Maintainer: prefix IMPLEMENTATION_CHECKLIST bullets with **N.M.K** (TZ § hierarchy).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { REPO_ROOT } from '../lib/repo-root.mjs'

const CHECKLIST = join(REPO_ROOT, 'IMPLEMENTATION_CHECKLIST.md')

const META_COUNTERS = {
  '## Текущий снимок проекта': 'snap',
  '## Ближайший TODO спринта': 'sprint'
}

/** @returns {string | null} */
function extractSectionId(heading) {
  const m = heading.match(/§([0-9]+)/)
  return m ? m[1] : null
}

/** @returns {string | null} */
function extractSubsectionId(heading) {
  const m = heading.match(/§([0-9]+(?:\.[0-9]+|[A-Z])?(?:\.[0-9]+)?)/)
  return m ? m[1] : null
}

/** @param {string} line */
function stripOldPrefix(line) {
  return line.replace(/^(- \[[x~! ]\]\s+)\*\*[^*]+\*\*\s+/, '$1')
}

/** @param {string} text @returns {string} */
function processChecklist(text) {
  const lines = text.split('\n')
  const out = []
  let baseSection = null
  let subsectionPrefix = null
  let counter = 0
  let metaKey = null

  for (const line of lines) {
    if (line.startsWith('## ')) {
      metaKey = META_COUNTERS[line] ?? null
      baseSection = extractSectionId(line)
      subsectionPrefix = null
      counter = 0
      out.push(line)
      continue
    }

    if (line.startsWith('### ')) {
      metaKey = null
      if (line === '### Этапы') {
        subsectionPrefix = '0.E'
        baseSection = null
      } else {
        subsectionPrefix = extractSubsectionId(line)
        baseSection = null
      }
      counter = 0
      out.push(line)
      continue
    }

    const stage = line.match(/^(\d+)\. (\[[x~! ]\]) (.*)$/)
    if (stage && subsectionPrefix === '0.E') {
      out.push(`- ${stage[2]} **0.E.${stage[1]}** ${stage[3]}`)
      continue
    }

    const bullet = line.match(/^- (\[[x~! ]\]\s+)(.*)$/)
    if (bullet) {
      counter += 1
      let prefix
      if (metaKey) prefix = metaKey
      else if (subsectionPrefix) prefix = subsectionPrefix
      else if (baseSection) prefix = baseSection
      else {
        out.push(line)
        counter -= 1
        continue
      }
      const clean = stripOldPrefix(line)
      const m = clean.match(/^- (\[[x~! ]\]\s+)(.*)$/)
      out.push(`- ${m[1]}**${prefix}.${counter}** ${m[2]}`)
      continue
    }

    out.push(line)
  }

  return out.join('\n')
}

writeFileSync(CHECKLIST, processChecklist(readFileSync(CHECKLIST, 'utf8')))
console.log('[number-implementation-checklist] OK')
