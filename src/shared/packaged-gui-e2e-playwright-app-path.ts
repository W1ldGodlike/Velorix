/**
 * §21 — путь к packaged FluxAlloy для Playwright GUI e2e (env или dist/win-unpacked).
 */
import { existsSync } from 'node:fs'
import { join } from 'node:path'

import { winUnpackedLayoutRoot } from './win-unpacked-layout-verify.ts'

export const PACKAGED_GUI_E2E_APP_ENV_VAR = 'FLUXALLOY_E2E_APP' as const

const WIN_APP_EXE = 'FluxAlloy.exe' as const

/** Resolved packaged app for Playwright, or null (tests stay skipped). */
export function resolvePackagedGuiE2eAppPath(repoRoot: string): string | null {
  const fromEnv = process.env[PACKAGED_GUI_E2E_APP_ENV_VAR]?.trim()
  if (fromEnv && existsSync(fromEnv)) {
    return fromEnv
  }

  if (process.platform === 'win32') {
    const candidate = join(winUnpackedLayoutRoot(repoRoot), WIN_APP_EXE)
    if (existsSync(candidate)) {
      return candidate
    }
  }

  return null
}

export function formatPackagedGuiE2eAppPathHint(repoRoot: string): string {
  const resolved = resolvePackagedGuiE2eAppPath(repoRoot)
  if (resolved) {
    return `FLUXALLOY_E2E_APP: ${resolved}`
  }
  return `FLUXALLOY_E2E_APP: unset (win: npm run pack:dir → dist/win-unpacked/${WIN_APP_EXE})`
}
