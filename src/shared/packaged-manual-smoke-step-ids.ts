/** §3 packaged owner-smoke — единый набор шагов для win/linux/macos (locales + build). */

export const PACKAGED_MANUAL_SMOKE_LOCALE_PREFIXES = [
  'winPackagedSmoke',
  'linuxPackagedSmoke',
  'macosPackagedSmoke'
] as const

export type PackagedManualSmokeLocaleKeyPrefix =
  (typeof PACKAGED_MANUAL_SMOKE_LOCALE_PREFIXES)[number]

/** Суффиксы ключей Step_* в locales packaged-manual-smoke.json. */
export const PACKAGED_MANUAL_SMOKE_STEP_SUFFIXES = [
  'launch',
  'engines',
  'open_file',
  'ytdlp',
  'editor_from_dl',
  'snapshot',
  'export',
  'video_sprite',
  'mini_player',
  'knowledge',
  'support_zip',
  'settings'
] as const

/** id в чеклисте (kebab) ↔ суффикс locale-ключа. */
export const PACKAGED_MANUAL_SMOKE_STEPS: ReadonlyArray<{
  id: string
  suffix: (typeof PACKAGED_MANUAL_SMOKE_STEP_SUFFIXES)[number]
}> = [
  { id: 'launch', suffix: 'launch' },
  { id: 'engines', suffix: 'engines' },
  { id: 'open-file', suffix: 'open_file' },
  { id: 'ytdlp', suffix: 'ytdlp' },
  { id: 'editor-dl', suffix: 'editor_from_dl' },
  { id: 'snapshot', suffix: 'snapshot' },
  { id: 'export', suffix: 'export' },
  { id: 'video-sprite', suffix: 'video_sprite' },
  { id: 'mini-player', suffix: 'mini_player' },
  { id: 'knowledge', suffix: 'knowledge' },
  { id: 'support-zip', suffix: 'support_zip' },
  { id: 'settings', suffix: 'settings' }
]

export function packagedManualSmokeStepLocaleKey(
  prefix: (typeof PACKAGED_MANUAL_SMOKE_LOCALE_PREFIXES)[number],
  stepSuffix: (typeof PACKAGED_MANUAL_SMOKE_STEP_SUFFIXES)[number]
): string {
  return `${prefix}Step_${stepSuffix}`
}

/** Суффиксы meta-ключей (owner/automated/doc/ui/bundle heading) в packaged-manual-smoke.json. */
export const PACKAGED_MANUAL_SMOKE_META_SUFFIXES = [
  'OwnerLine',
  'AutomatedLine',
  'DocLine',
  'UiLine',
  'BundleHeading'
] as const

export type PackagedManualSmokeMetaSuffix = (typeof PACKAGED_MANUAL_SMOKE_META_SUFFIXES)[number]

export function packagedManualSmokeMetaLocaleKey(
  prefix: PackagedManualSmokeLocaleKeyPrefix,
  metaSuffix: PackagedManualSmokeMetaSuffix
): string {
  return `${prefix}${metaSuffix}`
}
