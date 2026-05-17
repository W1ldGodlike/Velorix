import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const rel = 'tests/main/ffprobe-service.test.ts'
const lines = execSync(`git show HEAD:${rel}`, { encoding: 'utf8' }).split(/\r?\n/)

const header = `import { describe, expect, it } from 'vitest'

import { buildTrackRows } from '../../src/main/ffprobe-service'

describe('ffprobe-service buildTrackRows', () => {
`

const footer = `
})
`

const entry = `import { describe, expect, it } from 'vitest'

import { FFPROBE_TRACK_DETAIL_CASES } from '../fixtures/ffprobe-track-detail-cases'
import { trackDetailAt } from '../fixtures/ffprobe-track-rows-helpers'

describe('ffprobe-service buildTrackRows (detail cases)', () => {
  it.each(FFPROBE_TRACK_DETAIL_CASES)('$label', ({ streams, duration, row, contains, notContains, notMatch }) => {
    const detail = trackDetailAt(streams, row, duration)
    for (const token of contains) {
      expect(detail).toContain(token)
    }
    for (const token of notContains ?? []) {
      expect(detail).not.toContain(token)
    }
    if (notMatch) {
      expect(detail).not.toMatch(notMatch)
    }
  })
})
`

/** 1-based inclusive line ranges from original file (body inside describe). */
const slices = [
  {
    out: 'tests/main/ffprobe-service-track-rows-fields.test.ts',
    from: 21,
    to: 239
  },
  {
    out: 'tests/main/ffprobe-service-track-rows-color-meta.test.ts',
    from: 241,
    to: 546
  },
  {
    out: 'tests/main/ffprobe-service-track-rows-side-data.test.ts',
    from: 548,
    to: 740
  }
]

for (const { out, from, to } of slices) {
  const body = lines.slice(from - 1, to).join('\n')
  fs.writeFileSync(path.join(out), header + body + footer)
}

fs.writeFileSync(rel, entry)
console.log('split ffprobe-service.test OK')
