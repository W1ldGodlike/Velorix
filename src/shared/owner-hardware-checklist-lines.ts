/**
 * Общий формат строк owner theme/HiDPI smoke для Support ZIP.
 */

function t(shard: Record<string, string>, key: string, label: string): string {
  const v = shard[key]
  if (typeof v !== 'string' || v.trim().length === 0) {
    throw new Error(`${label} missing key: ${key}`)
  }
  return v
}

export function formatOwnerHardwareChecklistSectionLines(opts: {
  shard: Record<string, string>
  label: string
  headerKey: string
  uiKey: string
  introKey: string
  checkIntroKey: string
  checklistKeys: readonly string[]
}): string[] {
  const shard = opts.shard
  return [
    t(shard, opts.headerKey, opts.label),
    t(shard, opts.uiKey, opts.label),
    `intro: ${t(shard, opts.introKey, opts.label)}`,
    `check: ${t(shard, opts.checkIntroKey, opts.label)}`,
    ...opts.checklistKeys.map((key) => `  - ${t(shard, key, opts.label)}`)
  ]
}
