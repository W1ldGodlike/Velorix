/**
 * §19 — ожидаемое дерево `dist/linux-unpacked/` после `pack:linux:dir` (stat-only).
 * Bundled engines в CI могут отсутствовать (ручной `bin/` перед релизом).
 */
import { join } from 'node:path'

export const LINUX_UNPACKED_EXECUTABLE_NAMES = ['velorix', 'Velorix'] as const

export const LINUX_UNPACKED_BUNDLED_ENGINE_FILES = ['yt-dlp', 'ffmpeg', 'ffprobe'] as const

export type LinuxUnpackedLayoutCheck = {
  path: string
  kind: 'file' | 'dir'
  label: string
}

export function linuxUnpackedLayoutRoot(repoRoot: string): string {
  return join(repoRoot, 'dist', 'linux-unpacked')
}

export function linuxUnpackedExecutableCandidates(unpackedRoot: string): string[] {
  return LINUX_UNPACKED_EXECUTABLE_NAMES.map((name) => join(unpackedRoot, name))
}

export function listLinuxUnpackedLayoutChecks(unpackedRoot: string): LinuxUnpackedLayoutCheck[] {
  const bundledBin = join(unpackedRoot, 'resources', 'bin')
  return [
    { path: bundledBin, kind: 'dir', label: 'resources/bin' },
    {
      path: join(unpackedRoot, 'resources', 'VELORIX_TZ.md'),
      kind: 'file',
      label: 'resources/VELORIX_TZ.md'
    },
    {
      path: join(unpackedRoot, 'resources', 'Data', 'trusted_hashes.json'),
      kind: 'file',
      label: 'resources/Data/trusted_hashes.json'
    },
    { path: join(unpackedRoot, 'resources', 'Help'), kind: 'dir', label: 'resources/Help' }
  ]
}

export type LinuxUnpackedLayoutStatDeps = {
  fileNonEmpty: (path: string) => Promise<boolean> | boolean
  dirExists: (path: string) => Promise<boolean> | boolean
}

async function resolveBool(value: Promise<boolean> | boolean): Promise<boolean> {
  return await value
}

/** Список человекочитаемых ошибок; пустой массив — layout OK. */
export async function collectLinuxUnpackedLayoutFailures(
  unpackedRoot: string,
  deps: LinuxUnpackedLayoutStatDeps
): Promise<string[]> {
  const errors: string[] = []
  const exeCandidates = linuxUnpackedExecutableCandidates(unpackedRoot)
  let exeOk = false
  for (const path of exeCandidates) {
    if (await resolveBool(deps.fileNonEmpty(path))) {
      exeOk = true
      break
    }
  }
  if (!exeOk) {
    errors.push(
      `Нет исполняемого файла приложения (${LINUX_UNPACKED_EXECUTABLE_NAMES.join(' или ')}) в ${unpackedRoot}. Сначала: npm run build && npm run pack:linux:dir.`
    )
  }

  for (const check of listLinuxUnpackedLayoutChecks(unpackedRoot)) {
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

/** Информационные строки: движки в `resources/bin` (не блокируют CI-каркас). */
export async function listLinuxUnpackedOptionalEngineWarnings(
  unpackedRoot: string,
  deps: LinuxUnpackedLayoutStatDeps
): Promise<string[]> {
  const bundledBin = join(unpackedRoot, 'resources', 'bin')
  if (!(await resolveBool(deps.dirExists(bundledBin)))) {
    return []
  }
  const warnings: string[] = []
  for (const name of LINUX_UNPACKED_BUNDLED_ENGINE_FILES) {
    const path = join(bundledBin, name)
    if (!(await resolveBool(deps.fileNonEmpty(path)))) {
      warnings.push(`optional: resources/bin/${name} missing (положите в bin/ перед релизом)`)
    }
  }
  return warnings
}

/** §18 Support ZIP — подсказки verify без запуска pack:linux:dir. */
export function formatLinuxUnpackedLayoutVerifyDiagnosticLines(
  repoRoot: string,
  existsSync: (path: string) => boolean
): string[] {
  const unpackedRoot = linuxUnpackedLayoutRoot(repoRoot)
  const exePresent = linuxUnpackedExecutableCandidates(unpackedRoot).some((p) => existsSync(p))
  return [
    'command: npm run verify:linux-unpacked (после pack:linux:dir на Linux)',
    'checks: app executable, resources/bin (dir), VELORIX_TZ.md, Data/trusted_hashes.json, Help/',
    'optional engines: ffmpeg, ffprobe, yt-dlp in resources/bin (ручной bin/ перед release)',
    'env: VELORIX_SKIP_PACK_VERIFY',
    `layout: app executable (${exePresent ? 'present' : 'missing'})`,
    ...listLinuxUnpackedLayoutChecks(unpackedRoot).map((check) => {
      const present = check.kind === 'dir' ? existsSync(check.path) : existsSync(check.path)
      return `layout: ${check.label} (${present ? 'present' : 'missing'})`
    })
  ]
}
