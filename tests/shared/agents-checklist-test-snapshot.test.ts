import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/** Парсит «N test files / M tests» из snap.3 и AGENTS.md. */
function parseTestSnapshot(text: string): { files: number; tests: number } | null {
  const m = text.match(/\*{0,2}(\d+)\*{0,2}\s+test files\s*\/\s*\*{0,2}(\d+)\*{0,2}\s+tests/)
  return m ? { files: Number(m[1]), tests: Number(m[2]) } : null
}

describe('AGENTS.md ↔ IMPLEMENTATION_NEON_CHECKLIST snap.3', () => {
  it('test file and test counts match between AGENTS and neon checklist', () => {
    const agents = readFileSync('AGENTS.md', 'utf8')
    const checklist = readFileSync('docs/IMPLEMENTATION_NEON_CHECKLIST.md', 'utf8')
    const fromAgents = parseTestSnapshot(agents)
    const fromChecklist = parseTestSnapshot(checklist)
    expect(fromAgents).not.toBeNull()
    expect(fromChecklist).not.toBeNull()
    expect(fromAgents).toEqual(fromChecklist)
  })
})
