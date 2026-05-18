import type { FfmpegHwManualSmokeChecklistSection } from './ffmpeg-hw-manual-smoke-checklist-types'

export type EditorVideoSpriteManualSmokeLocaleShard = Record<string, string>

const PREFIX = 'editorVideoSpriteSmoke'

function t(shard: EditorVideoSpriteManualSmokeLocaleShard, key: string): string {
  const val = shard[key]
  if (typeof val !== 'string' || val.trim() === '') {
    throw new Error(`editor-video-sprite-manual-smoke locale missing key: ${key}`)
  }
  return val
}

/** §7.5 — ручной smoke спрайта из locales editor-video-sprite-manual-smoke.json. */
export function buildEditorVideoSpriteManualSmokeChecklistFromLocaleShard(
  shard: EditorVideoSpriteManualSmokeLocaleShard
): readonly FfmpegHwManualSmokeChecklistSection[] {
  const p = PREFIX
  return [
    {
      id: 'video-sprite',
      title: t(shard, `${p}SectionTitle`),
      prerequisites: [t(shard, `${p}Prereq0`), t(shard, `${p}Prereq1`)],
      steps: [
        { id: 'open-panel', text: t(shard, `${p}Step_open_panel`) },
        { id: 'burn-timestamps', text: t(shard, `${p}Step_burn_timestamps`) },
        { id: 'generate', text: t(shard, `${p}Step_generate`) },
        { id: 'verify-file', text: t(shard, `${p}Step_verify_file`) }
      ],
      pass: [t(shard, `${p}Pass0`), t(shard, `${p}Pass1`), t(shard, `${p}Pass2`)]
    }
  ]
}
