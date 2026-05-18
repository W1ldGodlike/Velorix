/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §2.2 — renderer остаётся на hooks-composition (канон renderer-state-approach.ts).
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { REPO_ROOT } from './lib/repo-root.mjs'

const APPROACH_PATH = join(REPO_ROOT, 'src', 'shared', 'renderer-state-approach.ts')
const APP_TSX = join(REPO_ROOT, 'src', 'renderer', 'src', 'App.tsx')
const COMPOSITION_PATH = join(REPO_ROOT, 'src', 'renderer', 'src', 'use-app-composition.ts')
const ARCHITECTURE_PATH = join(REPO_ROOT, 'docs', 'ARCHITECTURE.md')

const HOOK_FILES = {
  useAppCompositionLocalState: 'src/renderer/src/use-app-composition-local-state.ts',
  useAppCompositionIntegrations: 'src/renderer/src/use-app-composition-integrations.ts',
  useAppCompositionState: 'src/renderer/src/use-app-composition-state.ts',
  useAppShellPropsInput: 'src/renderer/src/use-app-shell-props-input.ts',
  useAppShellProps: 'src/renderer/src/use-app-shell-props.ts'
}

const BANNED_STORE_RE =
  /\b(from\s+['"](?:zustand|jotai|@reduxjs\/toolkit|redux|react-redux)['"]|require\s*\(\s*['"](?:zustand|jotai|redux)['"]\s*\))/

function readRepo(rel) {
  return readFileSync(join(REPO_ROOT, rel), 'utf8')
}

function extractConstArray(source, name) {
  const re = new RegExp(`export const ${name} = \\[([\\s\\S]*?)\\] as const`)
  const m = source.match(re)
  if (!m) {
    return null
  }
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1])
}

function main() {
  const violations = []
  const approachSrc = readFileSync(APPROACH_PATH, 'utf8')
  const rootHook = approachSrc.match(
    /export const RENDERER_COMPOSITION_ROOT_HOOK = '([^']+)'/
  )?.[1]
  const layerHooks = extractConstArray(approachSrc, 'RENDERER_STATE_LAYER_HOOKS')
  const approach = approachSrc.match(/export const RENDERER_STATE_APPROACH = '([^']+)'/)?.[1]

  if (approach !== 'hooks-composition' || !rootHook || !layerHooks?.length) {
    violations.push('renderer-state-approach.ts: missing hooks-composition constants')
  }

  for (const hook of layerHooks ?? []) {
    const rel = HOOK_FILES[hook]
    if (!rel) {
      violations.push(`RENDERER_STATE_LAYER_HOOKS: no file map for ${hook}`)
      continue
    }
    const body = readRepo(rel)
    if (!new RegExp(`export function ${hook}\\b`).test(body)) {
      violations.push(`${rel}: expected export function ${hook}`)
    }
  }

  const compositionBody = readFileSync(COMPOSITION_PATH, 'utf8')
  if (!new RegExp(`export function ${rootHook}\\b`).test(compositionBody)) {
    violations.push(`use-app-composition.ts: expected export function ${rootHook}`)
  }
  if (!compositionBody.includes('useAppCompositionState')) {
    violations.push('use-app-composition.ts: must call useAppCompositionState')
  }

  const appBody = readFileSync(APP_TSX, 'utf8')
  if (!appBody.includes(`import { ${rootHook} }`)) {
    violations.push('App.tsx: must import composition root hook')
  }
  if (/\buseState\s*\(/.test(appBody) || /\buseReducer\s*\(/.test(appBody)) {
    violations.push('App.tsx: keep state in composition hooks, not App.tsx')
  }

  const arch = readFileSync(ARCHITECTURE_PATH, 'utf8')
  if (!arch.includes('hooks-composition') || !arch.includes('renderer-state-approach.ts')) {
    violations.push('ARCHITECTURE.md: missing § Состояние renderer / renderer-state-approach')
  }

  for (const rel of Object.values(HOOK_FILES)) {
    if (BANNED_STORE_RE.test(readRepo(rel))) {
      violations.push(`${rel}: global store library import is banned (§2.2)`)
    }
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
