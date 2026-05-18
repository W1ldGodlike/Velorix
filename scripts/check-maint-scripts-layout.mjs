/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Запрещает одноразовые split/migrate/splice в scripts/ — после применения удалять, не хранить в репо.
 */
import { readdirSync } from 'node:fs'
import { join } from 'node:path'

import { REPO_ROOT } from './lib/repo-root.mjs'

const SCRIPTS_ROOT = join(REPO_ROOT, 'scripts')

const BANNED_ROOT_NAMES = new Set([
  'build-settings-ipc-persist.mjs',
  'collect-terminal-preview-substrings.mjs',
  'collect-terminal-preview-predicates.mjs',
  'apply-terminal-preview-predicate-each.mjs',
  'apply-terminal-preview-substring-each.mjs'
])

const BANNED_PREFIXES = ['split-', 'migrate-', 'extract-', 'splice-']

function main() {
  const violations = []
  for (const name of readdirSync(SCRIPTS_ROOT)) {
    if (!name.endsWith('.mjs')) {
      continue
    }
    if (BANNED_ROOT_NAMES.has(name)) {
      violations.push(`scripts/${name}`)
      continue
    }
    if (BANNED_PREFIXES.some((p) => name.startsWith(p))) {
      violations.push(`scripts/${name}`)
    }
  }

  if (violations.length > 0) {
    console.error(
      '[check:maint-scripts-layout] FAILED — remove one-shot maint scripts (git history only)'
    )
    for (const rel of violations.sort()) {
      console.error(`  ${rel}`)
    }
    process.exit(1)
  }

  console.log('[check:maint-scripts-layout] OK')
}

main()
