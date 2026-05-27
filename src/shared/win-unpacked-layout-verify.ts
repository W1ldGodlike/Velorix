/**
 * §19 — ожидаемое дерево `dist/win-unpacked/` после `pack:dir` (stat-only, без shell).
 */
import { join } from 'node:path'

export const WIN_UNPACKED_BUNDLED_ENGINE_FILES = [
  'yt-dlp.exe',
  'ffmpeg.exe',
  'ffprobe.exe'
] as const

export type WinUnpackedLayoutCheck = {
  path: string
  kind: 'file' | 'dir'
  label: string
}

export function winUnpackedLayoutRoot(repoRoot: string): string {
  return join(repoRoot, 'dist', 'win-unpacked')
}

export function listWinUnpackedLayoutChecks(unpackedRoot: string): WinUnpackedLayoutCheck[] {
  const bundledBin = join(unpackedRoot, 'resources', 'bin')
  const checks: WinUnpackedLayoutCheck[] = [
    { path: join(unpackedRoot, 'Velorix.exe'), kind: 'file', label: 'Velorix.exe' },
    { path: bundledBin, kind: 'dir', label: 'resources/bin' }
  ]
  for (const name of WIN_UNPACKED_BUNDLED_ENGINE_FILES) {
    checks.push({
      path: join(bundledBin, name),
      kind: 'file',
      label: `resources/bin/${name}`
    })
  }
  checks.push(
    {
      path: join(unpackedRoot, 'resources', 'VELORIX_NEON_THEME.md'),
      kind: 'file',
      label: 'resources/VELORIX_NEON_THEME.md'
    },
    {
      path: join(unpackedRoot, 'resources', 'Data', 'trusted_hashes.json'),
      kind: 'file',
      label: 'resources/Data/trusted_hashes.json'
    },
    { path: join(unpackedRoot, 'resources', 'Help'), kind: 'dir', label: 'resources/Help' }
  )
  return checks
}

export type WinUnpackedLayoutStatDeps = {
  fileNonEmpty: (path: string) => Promise<boolean> | boolean
  dirExists: (path: string) => Promise<boolean> | boolean
}

async function resolveBool(value: Promise<boolean> | boolean): Promise<boolean> {
  return await value
}

/** Список человекочитаемых ошибок; пустой массив — layout OK. */
export async function collectWinUnpackedLayoutFailures(
  unpackedRoot: string,
  deps: WinUnpackedLayoutStatDeps
): Promise<string[]> {
  const errors: string[] = []
  for (const check of listWinUnpackedLayoutChecks(unpackedRoot)) {
    if (check.kind === 'dir') {
      if (!(await resolveBool(deps.dirExists(check.path)))) {
        errors.push(`Нет каталога ${check.path} (${check.label}).`)
      }
      continue
    }
    if (!(await resolveBool(deps.fileNonEmpty(check.path)))) {
      const hint =
        check.label.startsWith('resources/bin/') && check.label !== 'resources/bin'
          ? ' Перед pack:dir выполните npm run engines:prepare:win.'
          : check.label === 'Velorix.exe'
            ? ' Сначала: npm run build && npm run pack:dir (или npm run check:release).'
            : ''
      errors.push(`Нет или пустой ${check.path} (${check.label}).${hint}`)
    }
  }
  return errors
}

/** §18 Support ZIP — подсказки verify без запуска pack:dir. */
export function formatWinUnpackedLayoutVerifyDiagnosticLines(
  repoRoot: string,
  existsSync: (path: string) => boolean
): string[] {
  const unpackedRoot = winUnpackedLayoutRoot(repoRoot)
  return [
    'command: npm run verify:win-unpacked (part of check:release / smoke:packaged-release)',
    'checks: Velorix.exe, resources/bin engines, VELORIX_NEON_THEME.md, Data/trusted_hashes.json, Help/',
    'env: VELORIX_SKIP_PACK_VERIFY',
    'dev quiet: npm run check:quiet includes check:terminal-summaries-ru (§8 terminal RU summaries 0/0)',
    ...listWinUnpackedLayoutChecks(unpackedRoot).map((check) => {
      const present = check.kind === 'dir' ? existsSync(check.path) : existsSync(check.path)
      return `layout: ${check.label} (${present ? 'present' : 'missing'})`
    })
  ]
}
