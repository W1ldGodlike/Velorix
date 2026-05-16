/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Инвентаризация IPC: реестр ipc-channels.ts и регистрации ipcMain.handle в src/main.
 */
import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const channelsPath = 'src/shared/ipc-channels.ts'
const text = readFileSync(channelsPath, 'utf8')
const registry = new Set([...text.matchAll(/:\s*'([^']+)'/g)].map((m) => m[1]))

function walkTs(dir, out = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name)
    if (ent.isDirectory()) walkTs(p, out)
    else if (ent.name.endsWith('.ts')) out.push(p)
  }
  return out
}

const byFile = {}
const handleRe = /ipcMain\.handle\(/g
for (const file of walkTs('src/main')) {
  const body = readFileSync(file, 'utf8')
  const n = (body.match(handleRe) ?? []).length
  if (n > 0) byFile[file.replace(/\\/g, '/')] = n
}

const handleTotal = Object.values(byFile).reduce((a, b) => a + b, 0)

console.log(`[audit:ipc-architecture] registry channels: ${registry.size}`)
console.log(`[audit:ipc-architecture] ipcMain.handle total: ${handleTotal}`)
for (const [f, n] of Object.entries(byFile).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${n}\t${f}`)
}
console.log(
  '[audit:ipc-architecture] OK (inventory; invoke uses mainWindowIpc/downloadsIpc constants — string literal handles not required)'
)
