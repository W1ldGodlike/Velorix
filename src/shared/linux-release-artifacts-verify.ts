/**
 * §2.1/§19 — артефакты после `npm run build:linux` (AppImage + deb в `dist/`).
 */
import { join } from 'node:path'

import { formatElectronViteEsmShimFixDiagnosticLine } from './electron-vite-build-meta'

export function distDirectory(repoRoot: string): string {
  return join(repoRoot, 'dist')
}

/** Ожидаемые суффиксы релизных файлов electron-builder (linux target). */
export const LINUX_RELEASE_ARTIFACT_SUFFIXES = ['.AppImage', '.deb'] as const

export type LinuxReleaseArtifactStatDeps = {
  listDistFileNames: (distDir: string) => string[]
}

/**
 * Проверяет наличие хотя бы одного `.AppImage` и одного `.deb` в `dist/`.
 * Имена зависят от `productName`/`version` в electron-builder.yml — матч по суффиксу.
 */
export function collectLinuxReleaseArtifactFailures(
  distDir: string,
  deps: LinuxReleaseArtifactStatDeps
): string[] {
  const names = deps.listDistFileNames(distDir)
  const errors: string[] = []
  for (const suffix of LINUX_RELEASE_ARTIFACT_SUFFIXES) {
    const found = names.some((n) => n.endsWith(suffix))
    if (!found) {
      errors.push(
        `В ${distDir} нет файла *${suffix} (ожидается после npm run build:linux на Linux).`
      )
    }
  }
  return errors
}

export function formatLinuxReleaseArtifactsDiagnosticLines(repoRoot: string): string[] {
  return [
    'command: npm run build:linux && npm run verify:linux-release',
    formatElectronViteEsmShimFixDiagnosticLine(),
    'checks: dist/*.AppImage и dist/*.deb (имена по electron-builder.yml)',
    'note: CI job linux-packaging — check:quiet + build + pack:linux:dir (не build:linux); полный build:linux локально',
    `dist: ${distDirectory(repoRoot)}`
  ]
}
