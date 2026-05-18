/**
 * §3 — packaged smoke в едином ownerManualSmoke (по платформе main).
 */

import { formatLinuxPackagedManualSmokeChecklistLines } from './linux-packaged-manual-smoke-checklist'
import { formatMacosPackagedManualSmokeChecklistLines } from './macos-packaged-manual-smoke-checklist'
import {
  isNativeMainLinux,
  isNativeMainMacos,
  isNativeMainWindows,
  type NativeMainPlatformFamily
} from './native-main-platform'
import { formatWinPackagedManualSmokeChecklistLines } from './win-packaged-manual-smoke-checklist'

export type OwnerManualSmokePackagedSection = {
  heading: string
  lines: readonly string[]
}

function sectionForFamily(family: NativeMainPlatformFamily): OwnerManualSmokePackagedSection | null {
  if (family === 'windows') {
    return {
      heading: '=== Packaged Win (pack:dir) ===',
      lines: formatWinPackagedManualSmokeChecklistLines()
    }
  }
  if (family === 'linux') {
    return {
      heading: '=== Packaged Linux (pack:linux:dir) ===',
      lines: formatLinuxPackagedManualSmokeChecklistLines()
    }
  }
  if (family === 'macos') {
    return {
      heading: '=== Packaged macOS (pack:mac:dir) ===',
      lines: formatMacosPackagedManualSmokeChecklistLines()
    }
  }
  return null
}

/** Чеклист packaged smoke для текущей ОС (main / Support ZIP ownerManualSmoke). */
export function getOwnerManualSmokePackagedSection(
  platform: NodeJS.Platform = process.platform
): OwnerManualSmokePackagedSection | null {
  if (isNativeMainWindows(platform)) {
    return sectionForFamily('windows')
  }
  if (isNativeMainLinux(platform)) {
    return sectionForFamily('linux')
  }
  if (isNativeMainMacos(platform)) {
    return sectionForFamily('macos')
  }
  return null
}
