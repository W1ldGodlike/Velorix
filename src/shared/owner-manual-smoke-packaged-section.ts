/**
 * §3 — packaged smoke в едином ownerManualSmoke (по платформе main).
 */

import type { AppUiLocale } from './app-ui-locale'
import enLinuxPackagedManualSmoke from '../../locales/en/linux-packaged-manual-smoke.json'
import enMacosPackagedManualSmoke from '../../locales/en/macos-packaged-manual-smoke.json'
import enWinPackagedManualSmoke from '../../locales/en/win-packaged-manual-smoke.json'
import ruLinuxPackagedManualSmoke from '../../locales/ru/linux-packaged-manual-smoke.json'
import ruMacosPackagedManualSmoke from '../../locales/ru/macos-packaged-manual-smoke.json'
import ruWinPackagedManualSmoke from '../../locales/ru/win-packaged-manual-smoke.json'
import { formatLinuxPackagedManualSmokeChecklistLinesFromShard } from './linux-packaged-manual-smoke-checklist'
import { formatMacosPackagedManualSmokeChecklistLinesFromShard } from './macos-packaged-manual-smoke-checklist'
import {
  isNativeMainLinux,
  isNativeMainMacos,
  isNativeMainWindows,
  type NativeMainPlatformFamily
} from './native-main-platform'
import { readPackagedManualSmokeBundleHeadingFromShard } from './packaged-manual-smoke-meta'
import type { PackagedManualSmokeLocaleShard } from './packaged-manual-smoke-checklist-build'
import type { PackagedManualSmokeLocaleKeyPrefix } from './packaged-manual-smoke-step-ids'
import { formatWinPackagedManualSmokeChecklistLinesFromShard } from './win-packaged-manual-smoke-checklist'

export type OwnerManualSmokePackagedPlatform = 'win' | 'linux' | 'macos'

export type OwnerManualSmokePackagedSection = {
  platform: OwnerManualSmokePackagedPlatform
  heading: string
  lines: readonly string[]
}

type PackagedPlatformConfig = {
  platform: OwnerManualSmokePackagedPlatform
  prefix: PackagedManualSmokeLocaleKeyPrefix
  formatLines: (shard: PackagedManualSmokeLocaleShard) => string[]
  ruShard: PackagedManualSmokeLocaleShard
  enShard: PackagedManualSmokeLocaleShard
}

const PACKAGED_BY_FAMILY: Record<NativeMainPlatformFamily, PackagedPlatformConfig | null> = {
  windows: {
    platform: 'win',
    prefix: 'winPackagedSmoke',
    formatLines: formatWinPackagedManualSmokeChecklistLinesFromShard,
    ruShard: ruWinPackagedManualSmoke as PackagedManualSmokeLocaleShard,
    enShard: enWinPackagedManualSmoke as PackagedManualSmokeLocaleShard
  },
  linux: {
    platform: 'linux',
    prefix: 'linuxPackagedSmoke',
    formatLines: formatLinuxPackagedManualSmokeChecklistLinesFromShard,
    ruShard: ruLinuxPackagedManualSmoke as PackagedManualSmokeLocaleShard,
    enShard: enLinuxPackagedManualSmoke as PackagedManualSmokeLocaleShard
  },
  macos: {
    platform: 'macos',
    prefix: 'macosPackagedSmoke',
    formatLines: formatMacosPackagedManualSmokeChecklistLinesFromShard,
    ruShard: ruMacosPackagedManualSmoke as PackagedManualSmokeLocaleShard,
    enShard: enMacosPackagedManualSmoke as PackagedManualSmokeLocaleShard
  },
  other: null
}

function familyFromPlatform(platform: NodeJS.Platform): NativeMainPlatformFamily | null {
  if (isNativeMainWindows(platform)) {
    return 'windows'
  }
  if (isNativeMainLinux(platform)) {
    return 'linux'
  }
  if (isNativeMainMacos(platform)) {
    return 'macos'
  }
  return null
}

function sectionFromConfig(
  config: PackagedPlatformConfig,
  shard: PackagedManualSmokeLocaleShard
): OwnerManualSmokePackagedSection {
  return {
    platform: config.platform,
    heading: readPackagedManualSmokeBundleHeadingFromShard(shard, config.prefix),
    lines: config.formatLines(shard)
  }
}

function resolvePackagedConfig(platform: NodeJS.Platform): PackagedPlatformConfig | null {
  const family = familyFromPlatform(platform)
  if (!family) {
    return null
  }
  return PACKAGED_BY_FAMILY[family]
}

/** Чеклист packaged smoke для UI locale (renderer owner bundle copy). */
export function getOwnerManualSmokePackagedSectionForUiLocale(
  locale: AppUiLocale,
  platform: NodeJS.Platform = process.platform
): OwnerManualSmokePackagedSection | null {
  const config = resolvePackagedConfig(platform)
  if (!config) {
    return null
  }
  const shard = locale === 'en' ? config.enShard : config.ruShard
  return sectionFromConfig(config, shard)
}

/** Чеклист packaged smoke для текущей ОС (main / Support ZIP ownerManualSmoke, канон ru). */
export function getOwnerManualSmokePackagedSection(
  platform: NodeJS.Platform = process.platform
): OwnerManualSmokePackagedSection | null {
  const config = resolvePackagedConfig(platform)
  if (!config) {
    return null
  }
  return sectionFromConfig(config, config.ruShard)
}
