import { readFileSync } from 'node:fs'

const t = readFileSync('tests/shared/terminal-contract-scenarios.test.ts', 'utf8')
const re = /expect\(lines\.some\(\(l\) => l\.includes\('((?:\\'|[^'])*)'\)\)\)\.toBe\(true\)/g
const found = new Set()
let m
while ((m = re.exec(t)) !== null) {
  found.add(m[1].replace(/\\'/g, "'"))
}
const sorted = [...found].sort()
console.log(sorted.length)
for (const s of sorted) {
  console.log(JSON.stringify(s))
}
