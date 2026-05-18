import type {
  FfmpegHwManualSmokeChecklistSection,
  FfmpegHwManualSmokePlatformId
} from './ffmpeg-hw-manual-smoke-checklist-types'

export type HwManualSmokeLocaleShard = Record<string, string>

function t(shard: HwManualSmokeLocaleShard, key: string): string {
  const val = shard[key]
  if (typeof val !== 'string' || val.trim() === '') {
    throw new Error(`hw-manual-smoke locale missing key: ${key}`)
  }
  return val
}

/** Собирает чеклист §16 из плоского shard locales/{ru,en}/hw-manual-smoke.json. */
export function buildFfmpegHwManualSmokeChecklistFromLocaleShard(
  shard: HwManualSmokeLocaleShard
): readonly FfmpegHwManualSmokeChecklistSection[] {
  return [
    {
      id: 'win-nvenc',
      title: t(shard, 'hwManualSmokeSectionWinTitle'),
      prerequisites: [
        t(shard, 'hwManualSmokeWinPrereq0'),
        t(shard, 'hwManualSmokeWinPrereq1'),
        t(shard, 'hwManualSmokeWinPrereq2')
      ],
      steps: [
        { id: 'nvenc-probe', text: t(shard, 'hwManualSmokeWinStep_nvenc_probe') },
        { id: 'nvenc-manual', text: t(shard, 'hwManualSmokeWinStep_nvenc_manual') },
        { id: 'nvenc-auto', text: t(shard, 'hwManualSmokeWinStep_nvenc_auto') },
        { id: 'nvenc-benchmark', text: t(shard, 'hwManualSmokeWinStep_nvenc_benchmark') },
        { id: 'nvenc-filters', text: t(shard, 'hwManualSmokeWinStep_nvenc_filters') }
      ],
      pass: [
        t(shard, 'hwManualSmokeWinPass0'),
        t(shard, 'hwManualSmokeWinPass1'),
        t(shard, 'hwManualSmokeWinPass2')
      ]
    },
    {
      id: 'linux-vaapi',
      title: t(shard, 'hwManualSmokeSectionLinuxTitle'),
      prerequisites: [
        t(shard, 'hwManualSmokeLinuxPrereq0'),
        t(shard, 'hwManualSmokeLinuxPrereq1'),
        t(shard, 'hwManualSmokeLinuxPrereq2')
      ],
      steps: [
        { id: 'vaapi-probe', text: t(shard, 'hwManualSmokeLinuxStep_vaapi_probe') },
        { id: 'vaapi-manual', text: t(shard, 'hwManualSmokeLinuxStep_vaapi_manual') },
        { id: 'vaapi-auto', text: t(shard, 'hwManualSmokeLinuxStep_vaapi_auto') },
        { id: 'vaapi-av1', text: t(shard, 'hwManualSmokeLinuxStep_vaapi_av1') },
        { id: 'vaapi-benchmark', text: t(shard, 'hwManualSmokeLinuxStep_vaapi_benchmark') }
      ],
      pass: [
        t(shard, 'hwManualSmokeLinuxPass0'),
        t(shard, 'hwManualSmokeLinuxPass1'),
        t(shard, 'hwManualSmokeLinuxPass2')
      ]
    }
  ]
}

export function formatFfmpegHwManualSmokeChecklistPlainText(
  sections: readonly FfmpegHwManualSmokeChecklistSection[]
): string {
  const blocks: string[] = []
  for (const section of sections) {
    const underline = '='.repeat(Math.min(48, section.title.length))
    blocks.push(section.title + '\n' + underline)
    blocks.push('\nPrerequisites:')
    for (const p of section.prerequisites) {
      blocks.push('  - ' + p)
    }
    blocks.push('\nSteps:')
    section.steps.forEach((step, i) => {
      blocks.push('  ' + String(i + 1) + '. [' + step.id + '] ' + step.text)
    })
    blocks.push('\nPass criteria:')
    for (const rule of section.pass) {
      blocks.push('  - ' + rule)
    }
    blocks.push('')
  }
  return blocks.join('\n').trimEnd()
}

export function resolvePrimaryHwManualSmokeSectionId(): FfmpegHwManualSmokePlatformId | null {
  if (typeof navigator === 'undefined') {
    return null
  }
  const platform = navigator.platform?.toLowerCase() ?? ''
  const ua = navigator.userAgent.toLowerCase()
  if (platform.includes('win') || ua.includes('windows')) {
    return 'win-nvenc'
  }
  if (platform.includes('linux') || ua.includes('linux')) {
    return 'linux-vaapi'
  }
  return null
}

export function orderHwManualSmokeSectionsForDisplay(
  sections: readonly FfmpegHwManualSmokeChecklistSection[],
  primaryId: FfmpegHwManualSmokePlatformId | null
): readonly FfmpegHwManualSmokeChecklistSection[] {
  if (primaryId === null) {
    return sections
  }
  const primary = sections.find((s) => s.id === primaryId)
  const rest = sections.filter((s) => s.id !== primaryId)
  return primary ? [primary, ...rest] : sections
}
