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

export function formatOwnerManualSmokeChecklistSectionLines(opts: {
  shard: Record<string, string>
  label: string
  headerLine: string
  uiLine: string
  introKey: string
  checkIntroKey: string
  checklistKeys: readonly string[]
}): string[] {
  const shard = opts.shard
  return [
    opts.headerLine,
    opts.uiLine,
    `intro: ${t(shard, opts.introKey, opts.label)}`,
    `check: ${t(shard, opts.checkIntroKey, opts.label)}`,
    ...opts.checklistKeys.map((key) => `  - ${t(shard, key, opts.label)}`)
  ]
}
