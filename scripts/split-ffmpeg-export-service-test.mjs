import { execSync } from 'node:child_process'
import fs from 'node:fs'

const rel = 'tests/main/ffmpeg-export-service.test.ts'
const lines = execSync(`git show HEAD:${rel}`, { encoding: 'utf8' }).split(/\r?\n/)

const imports = lines.slice(0, 37).join('\n')

const header = `${imports}

describe('ffmpeg export pure helpers', () => {
`

const footer = `
})
`

const slices = [
  { out: rel, from: 40, to: 127 },
  {
    out: 'tests/main/ffmpeg-export-service-user-preset.test.ts',
    from: 128,
    to: 292
  },
  {
    out: 'tests/main/ffmpeg-export-service-snapshot-merge.test.ts',
    from: 294,
    to: 591
  },
  {
    out: 'tests/main/ffmpeg-export-service-presets-catalog.test.ts',
    from: 593,
    to: 643
  }
]

for (const { out, from, to } of slices) {
  const body = lines.slice(from - 1, to).join('\n')
  fs.writeFileSync(out, header + body + footer)
}

console.log('split ffmpeg-export-service.test OK')
