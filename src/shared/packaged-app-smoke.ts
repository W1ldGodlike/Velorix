/**
 * §19 — пути к распакованному Windows-приложению после `pack:dir`.
 */
import { join } from 'node:path'

export function packagedWinUnpackedRoot(rootDir: string): string {
  return join(rootDir, 'dist', 'win-unpacked')
}

export function listPackagedAppExeCandidatePaths(rootDir: string): string[] {
  const fromEnv =
    typeof process.env['FLUXALLOY_APP_EXE_PATH'] === 'string'
      ? process.env['FLUXALLOY_APP_EXE_PATH'].trim()
      : ''
  const unpacked = packagedWinUnpackedRoot(rootDir)
  const candidates: string[] = []
  if (fromEnv.length > 0) {
    candidates.push(fromEnv)
  }
  candidates.push(join(unpacked, 'FluxAlloy.exe'))
  return candidates
}

export function packagedAppAsarPath(rootDir: string): string {
  return join(packagedWinUnpackedRoot(rootDir), 'resources', 'app.asar')
}

/** stdout из `ELECTRON_RUN_AS_NODE` probe: непустая строка версии Electron. */
export function isMinimalPackagedAppElectronVersionOutput(text: string): boolean {
  const t = text.trim()
  return /^\d+\.\d+/.test(t)
}

/** §18/§19 Support ZIP — подсказки smoke:packaged-app без запуска exe. */
export function formatPackagedAppSmokeDiagnosticLines(): string[] {
  return [
    'command: npm run smoke:packaged-app (part of smoke:packaged-release)',
    'check: ELECTRON_RUN_AS_NODE version stdout matches isMinimalPackagedAppElectronVersionOutput',
    'env: FLUXALLOY_APP_EXE_PATH, FLUXALLOY_SKIP_PACK_VERIFY (packaged-release chain)',
    'dev quiet: npm run check:quiet includes check:terminal-summaries-ru (§8 terminal RU summaries 0/0)'
  ]
}
