import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const HELP_ROOT = join(process.cwd(), 'Help')
const ASSETS_DIR = join(HELP_ROOT, 'assets')

const STABLE_HELP_DIAGRAMS = [
  'workspace-tabs-diagram.svg',
  'downloads-queue-overview.svg',
  'knowledge-dialog-toc.svg',
  'editor-preview-timeline.svg'
] as const

const MARKDOWN_IMAGE_RE = /!\[[^\]]*\]\((assets\/[^)\s]+)\)/g

/** Убирает примеры в `inline code` и fenced blocks — не реальные вставки картинок. */
function stripMarkdownCodeSamples(md: string): string {
  return md.replace(/```[\s\S]*?```/g, '').replace(/`[^`]*`/g, '')
}

function listMarkdownFiles(dir: string): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...listMarkdownFiles(full))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      out.push(full)
    }
  }
  return out
}

describe('Help assets references §15', () => {
  it('stable UI diagrams exist under Help/assets', () => {
    for (const name of STABLE_HELP_DIAGRAMS) {
      expect(existsSync(join(ASSETS_DIR, name)), name).toBe(true)
    }
  })

  it('every assets/ image in Help markdown exists on disk', () => {
    const missing: string[] = []
    for (const file of listMarkdownFiles(HELP_ROOT)) {
      const md = stripMarkdownCodeSamples(readFileSync(file, 'utf8'))
      for (const match of md.matchAll(MARKDOWN_IMAGE_RE)) {
        const rel = match[1]!
        const assetPath = join(HELP_ROOT, ...rel.split('/'))
        if (!existsSync(assetPath)) {
          missing.push(`${file}: ${rel}`)
        }
      }
    }
    expect(missing, missing.join('\n')).toEqual([])
  })
})
