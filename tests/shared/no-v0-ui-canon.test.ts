import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const REPO = process.cwd()

/** Пути, где запрещён канон v0 (NEON — единственный визуальный ориентир). */
const SCAN_ROOTS = [
  'src',
  join('.cursor', 'rules'),
  join('scripts', 'cursor-automation', 'prompts')
] as const

const FORBIDDEN_RE =
  /\bUX_REFERENCE_V0\.md\b|v0-VELORIX|v0\.vercel|\bv0-референс\b|\bv0-топбар\b|\bv0-style\b|§\d[\d.]*\/v0\b/gi

function walkFiles(dir: string, out: string[]): void {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    const st = statSync(full)
    if (st.isDirectory()) {
      walkFiles(full, out)
    } else if (/\.(ts|tsx|css|mdc|txt|mjs)$/i.test(name)) {
      out.push(full)
    }
  }
}

describe('no v0 UI canon in product paths', () => {
  it('src, rules, SDK prompts contain no v0 reference strings', () => {
    const hits: string[] = []
    for (const root of SCAN_ROOTS) {
      const abs = join(REPO, root)
      const files: string[] = []
      walkFiles(abs, files)
      for (const file of files) {
        const text = readFileSync(file, 'utf8')
        FORBIDDEN_RE.lastIndex = 0
        if (FORBIDDEN_RE.test(text)) {
          hits.push(file.replace(/\\/g, '/').replace(`${REPO}/`.replace(/\\/g, '/'), ''))
        }
      }
    }
    expect(hits, `v0 canon must not steer NEON UI:\n${hits.join('\n')}`).toEqual([])
  })
})
