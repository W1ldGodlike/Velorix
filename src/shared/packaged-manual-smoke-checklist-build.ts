import type {
  FfmpegHwManualSmokeChecklistSection,
  FfmpegHwManualSmokePlatformId
} from './ffmpeg-hw-manual-smoke-checklist-types'

export type PackagedManualSmokeLocaleShard = Record<string, string>

export type PackagedManualSmokeLocaleKeyPrefix =
  | 'winPackagedSmoke'
  | 'linuxPackagedSmoke'
  | 'macosPackagedSmoke'

function t(shard: PackagedManualSmokeLocaleShard, key: string): string {
  const val = shard[key]
  if (typeof val !== 'string' || val.trim() === '') {
    throw new Error(`packaged-manual-smoke locale missing key: ${key}`)
  }
  return val
}

/** §3 — ручной smoke packaged (Win / Linux / macOS) из locales *-packaged-manual-smoke.json. */
export function buildPackagedManualSmokeChecklistFromLocaleShard(
  shard: PackagedManualSmokeLocaleShard,
  opts: {
    sectionId: FfmpegHwManualSmokePlatformId
    localeKeyPrefix: PackagedManualSmokeLocaleKeyPrefix
  }
): readonly FfmpegHwManualSmokeChecklistSection[] {
  const p = opts.localeKeyPrefix
  return [
    {
      id: opts.sectionId,
      title: t(shard, `${p}SectionTitle`),
      prerequisites: [
        t(shard, `${p}Prereq0`),
        t(shard, `${p}Prereq1`),
        t(shard, `${p}Prereq2`)
      ],
      steps: [
        { id: 'launch', text: t(shard, `${p}Step_launch`) },
        { id: 'engines', text: t(shard, `${p}Step_engines`) },
        { id: 'open-file', text: t(shard, `${p}Step_open_file`) },
        { id: 'ytdlp', text: t(shard, `${p}Step_ytdlp`) },
        { id: 'editor-dl', text: t(shard, `${p}Step_editor_from_dl`) },
        { id: 'snapshot', text: t(shard, `${p}Step_snapshot`) },
        { id: 'export', text: t(shard, `${p}Step_export`) },
        { id: 'knowledge', text: t(shard, `${p}Step_knowledge`) },
        { id: 'support-zip', text: t(shard, `${p}Step_support_zip`) },
        { id: 'settings', text: t(shard, `${p}Step_settings`) }
      ],
      pass: [
        t(shard, `${p}Pass0`),
        t(shard, `${p}Pass1`),
        t(shard, `${p}Pass2`)
      ]
    }
  ]
}
