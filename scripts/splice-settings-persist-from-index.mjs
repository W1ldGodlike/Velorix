import { readFileSync, writeFileSync } from 'node:fs'

const p = 'src/main/index.ts'
const lines = readFileSync(p, 'utf8').split(/\r?\n/)

/** 1-based inclusive ranges to remove (persist moved to settings-ipc-persist.ts) */
const remove = [
  [544, 555],
  [556, 586],
  [1012, 1039],
  [1049, 1070],
  [1073, 1593]
]

const removeSet = new Set()
for (const [a, b] of remove) {
  for (let i = a; i <= b; i++) removeSet.add(i)
}

const kept = lines.filter((_, idx) => !removeSet.has(idx + 1))
writeFileSync(p, kept.join('\n'))
console.log('[splice-settings-persist] removed', removeSet.size, 'lines')
