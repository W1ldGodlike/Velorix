/**
 * §19/§18 — Support ZIP: цепочка `smoke:packaged-release` и layout `dist/win-unpacked/`.
 */
import { formatCheckReleaseScriptDiagnosticLines } from './check-release-scripts'
import { formatBundledEnginesTrustedHashDiagnosticLines } from './bundled-engines-trusted-hashes'
import { listPackagedAppExeCandidatePaths } from './packaged-app-smoke'
import { formatWinUnpackedLayoutVerifyDiagnosticLines } from './win-unpacked-layout-verify'

/** §18 Support ZIP — `releaseSmoke:` без запуска pack:dir. */
export function buildSupportZipPackagedReleaseLines(
  repoRoot: string,
  existsSync: (path: string) => boolean
): string[] {
  const layout = formatWinUnpackedLayoutVerifyDiagnosticLines(repoRoot, existsSync)
  const layoutTail = layout.filter((line) => !line.startsWith('command: npm run verify'))
  return [
    ...formatCheckReleaseScriptDiagnosticLines(),
    'command: npm run smoke:packaged-release (check:release after pack:dir)',
    'steps: verify:win-unpacked → smoke:packaged-app → smoke:packaged-engines (ffprobe, yt-dlp, ffmpeg)',
    'env skips: FLUXALLOY_SKIP_PACK_VERIFY, FLUXALLOY_SKIP_*_SMOKE (per engine script)',
    ...formatBundledEnginesTrustedHashDiagnosticLines(),
    ...listPackagedAppExeCandidatePaths(repoRoot).map(
      (p) => `app-candidate: ${p} (${existsSync(p) ? 'present' : 'missing'})`
    ),
    ...layoutTail
  ]
}
