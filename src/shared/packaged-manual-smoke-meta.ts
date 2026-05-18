import type { PackagedManualSmokeLocaleShard } from './packaged-manual-smoke-checklist-build'
import type { PackagedManualSmokeChecklistMeta } from './packaged-manual-smoke-checklist-format'
import {
  packagedManualSmokeMetaLocaleKey,
  type PackagedManualSmokeLocaleKeyPrefix,
  type PackagedManualSmokeMetaSuffix
} from './packaged-manual-smoke-step-ids'

function t(shard: PackagedManualSmokeLocaleShard, key: string): string {
  const val = shard[key]
  if (typeof val !== 'string' || val.trim() === '') {
    throw new Error(`packaged-manual-smoke locale missing key: ${key}`)
  }
  return val
}

export function buildPackagedManualSmokeMetaFromShard(
  shard: PackagedManualSmokeLocaleShard,
  prefix: PackagedManualSmokeLocaleKeyPrefix
): PackagedManualSmokeChecklistMeta {
  const metaKey = (suffix: PackagedManualSmokeMetaSuffix): string =>
    packagedManualSmokeMetaLocaleKey(prefix, suffix)
  return {
    ownerLine: t(shard, metaKey('OwnerLine')),
    automatedLine: t(shard, metaKey('AutomatedLine')),
    docLine: t(shard, metaKey('DocLine')),
    uiLine: t(shard, metaKey('UiLine'))
  }
}

export function readPackagedManualSmokeBundleHeadingFromShard(
  shard: PackagedManualSmokeLocaleShard,
  prefix: PackagedManualSmokeLocaleKeyPrefix
): string {
  return t(shard, packagedManualSmokeMetaLocaleKey(prefix, 'BundleHeading'))
}
