import type { FfmpegHwManualSmokeChecklistSection } from './ffmpeg-hw-manual-smoke-checklist-types'

export type MiniPlayerManualSmokeLocaleShard = Record<string, string>

const PREFIX = 'miniPlayerSmoke'

function t(shard: MiniPlayerManualSmokeLocaleShard, key: string): string {
  const val = shard[key]
  if (typeof val !== 'string' || val.trim() === '') {
    throw new Error(`mini-player-manual-smoke locale missing key: ${key}`)
  }
  return val
}

/** §4.3 — ручной smoke Mini Player из locales mini-player-manual-smoke.json. */
export function buildMiniPlayerManualSmokeChecklistFromLocaleShard(
  shard: MiniPlayerManualSmokeLocaleShard
): readonly FfmpegHwManualSmokeChecklistSection[] {
  const p = PREFIX
  return [
    {
      id: 'mini-player',
      title: t(shard, `${p}SectionTitle`),
      prerequisites: [t(shard, `${p}Prereq0`), t(shard, `${p}Prereq1`)],
      steps: [
        { id: 'open', text: t(shard, `${p}Step_open`) },
        { id: 'progress', text: t(shard, `${p}Step_progress`) },
        { id: 'context-menu', text: t(shard, `${p}Step_context_menu`) },
        { id: 'session', text: t(shard, `${p}Step_session`) }
      ],
      pass: [t(shard, `${p}Pass0`), t(shard, `${p}Pass1`), t(shard, `${p}Pass2`)]
    }
  ]
}
