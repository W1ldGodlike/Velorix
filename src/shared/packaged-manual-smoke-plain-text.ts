import type { AppUiLocale } from './app-ui-locale'
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

/** Plain text для копирования из UI (owner:/automated:/doc:/ui: + steps), как Support ZIP. */
export function getPackagedManualSmokePlainTextForUiLocale(
  platform: PackagedManualSmokePlatform,
  locale: AppUiLocale
): string {
  if (platform === 'win') {
    const lines =
      locale === 'en'
        ? formatWinPackagedManualSmokeChecklistLinesFromShard(
            enWinPackagedManualSmoke as Record<string, string>
          )
        : formatWinPackagedManualSmokeChecklistLines()
    return lines.join('\n')
  }
  if (platform === 'linux') {
    const lines =
      locale === 'en'
        ? formatLinuxPackagedManualSmokeChecklistLinesFromShard(
            enLinuxPackagedManualSmoke as Record<string, string>
          )
        : formatLinuxPackagedManualSmokeChecklistLines()
    return lines.join('\n')
  }
  const lines =
    locale === 'en'
      ? formatMacosPackagedManualSmokeChecklistLinesFromShard(
          enMacosPackagedManualSmoke as Record<string, string>
        )
      : formatMacosPackagedManualSmokeChecklistLines()
  return lines.join('\n')
}
