/**
 * §2.1/§19 — dist/mac-arm64/FluxAlloy.app (и др. mac*) после pack:mac:dir (stat-only).
 */
import { join } from 'node:path'

export const MACOS_APP_BUNDLE_DIR_NAME = 'FluxAlloy.app'

export const MACOS_PACK_OUTPUT_DIR_NAMES = ['mac', 'mac-arm64', 'mac-x64'] as const

export const MACOS_APP_EXECUTABLE_NAMES = ['FluxAlloy', 'fluxalloy'] as const

export type MacosUnpackedLayoutCheck = {
  path: string
  kind: 'file' | 'dir'
  label: string
}

export function macosAppBundleCandidates(repoRoot: string): string[] {
  return MACOS_PACK_OUTPUT_DIR_NAMES.map((dir) =>
    join(repoRoot, 'dist', dir, MACOS_APP_BUNDLE_DIR_NAME)
  )
}

export function macosAppExecutableCandidates(bundleRoot: string): string[] {
  return MACOS_APP_EXECUTABLE_NAMES.map((name) => join(bundleRoot, 'Contents', 'MacOS', name))
}

export function listMacosUnpackedLayoutChecks(bundleRoot: string): MacosUnpackedLayoutCheck[] {
  const resources = join(bundleRoot, 'Contents', 'Resources')
  return [
    {
      path: join(resources, 'bin'),
      kind: 'dir',
      label: 'Contents/Resources/bin'
    },
    {
      path: join(resources, 'FLUXALLOY_TZ.md'),
      kind: 'file',
      label: 'Contents/Resources/FLUXALLOY_TZ.md'
    },
    {
      path: join(resources, 'Data', 'trusted_hashes.json'),
      kind: 'file',
      label: 'Contents/Resources/Data/trusted_hashes.json'
    },
    { path: join(resources, 'Help'), kind: 'dir', label: 'Contents/Resources/Help' }
  ]
}

export type MacosUnpackedLayoutStatDeps = {
  fileNonEmpty: (path: string) => Promise<boolean> | boolean
  dirExists: (path: string) => Promise<boolean> | boolean
}

async function resolveBool(value: Promise<boolean> | boolean): Promise<boolean> {
  return await value
}

export async function resolveMacosAppBundleRoot(
  candidates: string[],
  deps: Pick<MacosUnpackedLayoutStatDeps, 'dirExists'>
): Promise<string | null> {
  for (const path of candidates) {
    if (await resolveBool(deps.dirExists(path))) {
      return path
    }
  }
  return null
}

export async function collectMacosUnpackedLayoutFailures(
  bundleRoot: string,
  deps: MacosUnpackedLayoutStatDeps
): Promise<string[]> {
  const errors: string[] = []
  let exeOk = false
  for (const path of macosAppExecutableCandidates(bundleRoot)) {
    if (await resolveBool(deps.fileNonEmpty(path))) {
      exeOk = true
      break
    }
  }
  if (!exeOk) {
    errors.push(
      `Нет исполняемого файла в ${bundleRoot}/Contents/MacOS (${MACOS_APP_EXECUTABLE_NAMES.join(' или ')}). Сначала: npm run build && npm run pack:mac:dir.`
    )
  }
  for (const check of listMacosUnpackedLayoutChecks(bundleRoot)) {
    if (check.kind === 'dir') {
      if (!(await resolveBool(deps.dirExists(check.path)))) {
        errors.push(`Нет каталога ${check.path} (${check.label}).`)
      }
      continue
    }
    if (!(await resolveBool(deps.fileNonEmpty(check.path)))) {
      errors.push(`Нет или пустой ${check.path} (${check.label}).`)
    }
  }
  return errors
}

export function formatMacosUnpackedLayoutVerifyDiagnosticLines(repoRoot: string): string[] {
  return [
    'command: npm run verify:mac-unpacked (после pack:mac:dir на macOS)',
    'checks: FluxAlloy.app/Contents/MacOS, Resources/bin, FLUXALLOY_TZ.md, Data, Help',
    'env: FLUXALLOY_SKIP_PACK_VERIFY',
    `candidates: ${macosAppBundleCandidates(repoRoot).join(' | ')}`
  ]
}
