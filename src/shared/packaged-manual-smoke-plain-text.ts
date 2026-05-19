import type { AppUiLocale } from './app-ui-locale'
import { formatPackagedE2eSmokeDiagnosticLines } from './packaged-e2e-smoke-scenarios'
import enLinuxPackagedManualSmoke from '../../locales/en/linux-packaged-manual-smoke.json'
import enMacosPackagedManualSmoke from '../../locales/en/macos-packaged-manual-smoke.json'
import enWinPackagedManualSmoke from '../../locales/en/win-packaged-manual-smoke.json'
import {
  formatLinuxPackagedManualSmokeChecklistLines,
  formatLinuxPackagedManualSmokeChecklistLinesFromShard
} from './linux-packaged-manual-smoke-checklist'
import {
  formatMacosPackagedManualSmokeChecklistLines,
  formatMacosPackagedManualSmokeChecklistLinesFromShard
} from './macos-packaged-manual-smoke-checklist'
import {
  formatWinPackagedManualSmokeChecklistLines,
  formatWinPackagedManualSmokeChecklistLinesFromShard
} from './win-packaged-manual-smoke-checklist'

export type PackagedManualSmokePlatform = 'win' | 'linux' | 'macos'

/** §21 appendix для packaged Copy и ownerManualSmoke (один канон). */
export function appendPackagedManualSmokeE2ePlanLines(blocks: string[]): void {
  blocks.push(
    '',
    '=== §21 packaged e2e (CI vs owner) ===',
    ...formatPackagedE2eSmokeDiagnosticLines()
  )
}

/** Plain text для копирования из UI (owner:/automated:/doc:/ui: + steps + §21 e2e), как Support ZIP. */
export function getPackagedManualSmokePlainTextForUiLocale(
  platform: PackagedManualSmokePlatform,
  locale: AppUiLocale
): string {
  const blocks: string[] = []
  if (platform === 'win') {
    blocks.push(
      ...(locale === 'en'
        ? formatWinPackagedManualSmokeChecklistLinesFromShard(
            enWinPackagedManualSmoke as Record<string, string>
          )
        : formatWinPackagedManualSmokeChecklistLines())
    )
  } else if (platform === 'linux') {
    blocks.push(
      ...(locale === 'en'
        ? formatLinuxPackagedManualSmokeChecklistLinesFromShard(
            enLinuxPackagedManualSmoke as Record<string, string>
          )
        : formatLinuxPackagedManualSmokeChecklistLines())
    )
  } else {
    blocks.push(
      ...(locale === 'en'
        ? formatMacosPackagedManualSmokeChecklistLinesFromShard(
            enMacosPackagedManualSmoke as Record<string, string>
          )
        : formatMacosPackagedManualSmokeChecklistLines())
    )
  }
  appendPackagedManualSmokeE2ePlanLines(blocks)
  return blocks.join('\n')
}
