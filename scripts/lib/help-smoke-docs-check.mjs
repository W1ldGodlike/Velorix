/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Shared helpers for §15 Help smoke doc guards (`check:help-*-smoke-docs`).
 */
import fs from 'node:fs'
import path from 'node:path'

export function checkHelpSmokeDocFiles(repoRoot, logPrefix, files, snippets, label) {
  let failed = false
  for (const rel of files) {
    const text = fs.readFileSync(path.join(repoRoot, rel), 'utf8')
    const missing = snippets.filter((s) => !text.includes(s))
    if (missing.length > 0) {
      failed = true
      console.error(`[${logPrefix}] ${label} ${rel} missing: ${missing.join(', ')}`)
    }
  }
  return failed
}

export function checkHelpSmokeDocSnippet(repoRoot, logPrefix, rel, snippet, label) {
  const text = fs.readFileSync(path.join(repoRoot, rel), 'utf8')
  if (!text.includes(snippet)) {
    console.error(`[${logPrefix}] ${label} ${rel} missing: ${snippet}`)
    return true
  }
  return false
}
