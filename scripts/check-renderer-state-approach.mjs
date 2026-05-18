/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §2.2 — renderer на Zustand (канон renderer-state-approach.ts).
 */
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

import { REPO_ROOT } from './lib/repo-root.mjs'

const APPROACH_PATH = join(REPO_ROOT, 'src', 'shared', 'renderer-state-approach.ts')
const APP_ROOT = join(REPO_ROOT, 'src', 'renderer', 'src', 'components', 'shell', 'AppRoot.tsx')
const APP_TSX = join(REPO_ROOT, 'src', 'renderer', 'src', 'App.tsx')
const ARCHITECTURE_PATH = join(REPO_ROOT, 'docs', 'ARCHITECTURE.md')
const STORES_DIR = join(REPO_ROOT, 'src', 'renderer', 'src', 'stores')

const BANNED_COMPOSITION_RE =
  /\b(useAppComposition|useAppCompositionState|useAppCompositionLocalState|useAppCompositionIntegrations)\b/

const REQUIRED_STORE_FILES = [
  'app-shell-store.ts',
  'downloads-store.ts',
  'export-settings-store.ts',
  'panels-store.ts',
  'reset-all-stores.ts'
]

function extractConstArray(source, name) {
  const re = new RegExp(`export const ${name} = \\[([\\s\\S]*?)\\] as const`)
  const m = source.match(re)
  if (!m) {
    return null
  }
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1])
}

function walkTs(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) {
      walkTs(full, acc)
    } else if (/\.(ts|tsx)$/.test(name)) {
      acc.push(full)
    }
  }
  return acc
}

function main() {
  const violations = []
  const approachSrc = readFileSync(APPROACH_PATH, 'utf8')
  const approach = approachSrc.match(/export const RENDERER_STATE_APPROACH = '([^']+)'/)?.[1]
  const shellEntry = approachSrc.match(/export const RENDERER_SHELL_ENTRY = '([^']+)'/)?.[1]
  const stores = extractConstArray(approachSrc, 'RENDERER_ZUSTAND_STORES')

  if (approach !== 'zustand' || !shellEntry || !stores?.length) {
    violations.push('renderer-state-approach.ts: missing zustand constants')
  }

  const appRootBody = readFileSync(APP_ROOT, 'utf8')
  if (!appRootBody.includes('AppStoreBootstrap') || !appRootBody.includes('<AppShellLayout')) {
    violations.push('AppRoot.tsx: must bootstrap stores and render AppShellLayout')
  }
  if (appRootBody.includes('useAppShellController')) {
    violations.push('AppRoot.tsx: useAppShellController belongs inside AppShellLayout')
  }

  const appBody = readFileSync(APP_TSX, 'utf8')
  if (!appBody.includes('AppRoot')) {
    violations.push('App.tsx: must render AppRoot')
  }
  if (BANNED_COMPOSITION_RE.test(appBody)) {
    violations.push('App.tsx: legacy useAppComposition* is banned')
  }

  for (const file of REQUIRED_STORE_FILES) {
    try {
      readFileSync(join(STORES_DIR, file), 'utf8')
    } catch {
      violations.push(`missing store file: src/renderer/src/stores/${file}`)
    }
  }

  for (const rel of [
    'src/renderer/src/use-app-composition.ts',
    'src/renderer/src/use-app-composition-state.ts',
    'src/renderer/src/use-app-composition-local-state.ts',
    'src/renderer/src/use-app-composition-integrations.ts',
    'src/renderer/src/use-app-shell-props.ts',
    'src/renderer/src/use-app-shell-props-input.ts',
    'src/renderer/src/use-app-shell-controller.ts',
    'src/renderer/src/use-app-shell-props-input-workspace-terminal-downloads.ts',
    'docs/ZUSTAND_MIGRATION_CHECKLIST.md',
    'docs/ZUSTAND_MIGRATION_CHECKLIST_DONE.md',
    'scripts/check-zustand-migration-gate.mjs',
    'src/renderer/src/app-workspace-main-props-types.ts',
    'src/renderer/src/use-app-workspace-main-props.ts',
    'src/renderer/src/use-app-workspace-main-container.ts',
    'src/renderer/src/locales/resolve-ui-text.ts'
  ]) {
    try {
      readFileSync(join(REPO_ROOT, rel), 'utf8')
      violations.push(`legacy file must be removed: ${rel}`)
    } catch {
      /* ok */
    }
  }

  const rendererRoot = join(REPO_ROOT, 'src', 'renderer', 'src')
  const storesRoot = join(rendererRoot, 'stores') + join('')
  for (const full of walkTs(rendererRoot)) {
    if (full.startsWith(storesRoot)) {
      continue
    }
    const body = readFileSync(full, 'utf8')
    if (BANNED_COMPOSITION_RE.test(body)) {
      const rel = full.startsWith(REPO_ROOT) ? full.slice(REPO_ROOT.length + 1) : full
      violations.push(`${rel}: legacy useAppComposition* is banned`)
    }
  }

  const arch = readFileSync(ARCHITECTURE_PATH, 'utf8')
  if (!arch.includes('Zustand') || !arch.includes('renderer-state-approach.ts')) {
    violations.push('ARCHITECTURE.md: missing § Состояние renderer / Zustand')
  }

  if (violations.length > 0) {
    console.error('[renderer-state-approach] violations:')
    for (const v of violations) {
      console.error(`  ${v}`)
    }
    process.exit(1)
  }
  console.log('[renderer-state-approach] OK')
}

main()
