import type { FfmpegHwManualSmokeChecklistSection } from './ffmpeg-hw-manual-smoke-checklist-types'

export type WindowsShellManualSmokeLocaleShard = Record<string, string>

const PREFIX = 'windowsShellSmoke'

function t(shard: WindowsShellManualSmokeLocaleShard, key: string): string {
  const val = shard[key]
  if (typeof val !== 'string' || val.trim() === '') {
    throw new Error(`windows-shell-manual-smoke locale missing key: ${key}`)
  }
  return val
}

/** §14 — ручная проверка Проводника Windows из locales windows-shell-manual-smoke.json. */
export function buildWindowsShellManualSmokeChecklistFromLocaleShard(
  shard: WindowsShellManualSmokeLocaleShard
): readonly FfmpegHwManualSmokeChecklistSection[] {
  const p = PREFIX
  return [
    {
      id: 'win-shell',
      title: t(shard, `${p}SectionTitle`),
      prerequisites: [t(shard, `${p}Prereq0`), t(shard, `${p}Prereq1`), t(shard, `${p}Prereq2`)],
      steps: [
        { id: 'enable-menu', text: t(shard, `${p}Step_enable_menu`) },
        { id: 'context-open', text: t(shard, `${p}Step_context_open`) },
        { id: 'quick-mp4', text: t(shard, `${p}Step_quick_mp4`) },
        { id: 'open-with', text: t(shard, `${p}Step_open_with`) },
        { id: 'default-apps', text: t(shard, `${p}Step_default_apps`) },
        { id: 'unregister', text: t(shard, `${p}Step_unregister`) }
      ],
      pass: [t(shard, `${p}Pass0`), t(shard, `${p}Pass1`), t(shard, `${p}Pass2`)]
    }
  ]
}
