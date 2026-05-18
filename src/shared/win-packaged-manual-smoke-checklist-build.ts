import type { FfmpegHwManualSmokeChecklistSection } from './ffmpeg-hw-manual-smoke-checklist-types'

export type WinPackagedManualSmokeLocaleShard = Record<string, string>

function t(shard: WinPackagedManualSmokeLocaleShard, key: string): string {
  const val = shard[key]
  if (typeof val !== 'string' || val.trim() === '') {
    throw new Error(`win-packaged-manual-smoke locale missing key: ${key}`)
  }
  return val
}

/** §3 — ручной smoke `dist/win-unpacked/` из locales win-packaged-manual-smoke.json. */
export function buildWinPackagedManualSmokeChecklistFromLocaleShard(
  shard: WinPackagedManualSmokeLocaleShard
): readonly FfmpegHwManualSmokeChecklistSection[] {
  return [
    {
      id: 'win-packaged',
      title: t(shard, 'winPackagedSmokeSectionTitle'),
      prerequisites: [
        t(shard, 'winPackagedSmokePrereq0'),
        t(shard, 'winPackagedSmokePrereq1'),
        t(shard, 'winPackagedSmokePrereq2')
      ],
      steps: [
        { id: 'launch', text: t(shard, 'winPackagedSmokeStep_launch') },
        { id: 'engines', text: t(shard, 'winPackagedSmokeStep_engines') },
        { id: 'open-file', text: t(shard, 'winPackagedSmokeStep_open_file') },
        { id: 'ytdlp', text: t(shard, 'winPackagedSmokeStep_ytdlp') },
        { id: 'editor-dl', text: t(shard, 'winPackagedSmokeStep_editor_from_dl') },
        { id: 'snapshot', text: t(shard, 'winPackagedSmokeStep_snapshot') },
        { id: 'export', text: t(shard, 'winPackagedSmokeStep_export') },
        { id: 'knowledge', text: t(shard, 'winPackagedSmokeStep_knowledge') },
        { id: 'support-zip', text: t(shard, 'winPackagedSmokeStep_support_zip') },
        { id: 'settings', text: t(shard, 'winPackagedSmokeStep_settings') }
      ],
      pass: [
        t(shard, 'winPackagedSmokePass0'),
        t(shard, 'winPackagedSmokePass1'),
        t(shard, 'winPackagedSmokePass2')
      ]
    }
  ]
}
