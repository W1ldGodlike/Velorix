import type { FfmpegHwManualSmokeChecklistSection } from './ffmpeg-hw-manual-smoke-checklist-types'

export type WorkflowOsSchedulerManualSmokeLocaleShard = Record<string, string>

type OsSchedulerSmokePlatform = 'win' | 'macos' | 'linux'

const PLATFORM_SPECS: readonly {
  platform: OsSchedulerSmokePlatform
  sectionId: 'win-scheduler' | 'macos-scheduler' | 'linux-scheduler'
  prefix: string
}[] = [
  { platform: 'win', sectionId: 'win-scheduler', prefix: 'workflowOsSmokeWin' },
  { platform: 'macos', sectionId: 'macos-scheduler', prefix: 'workflowOsSmokeMac' },
  { platform: 'linux', sectionId: 'linux-scheduler', prefix: 'workflowOsSmokeLinux' }
]

function t(shard: WorkflowOsSchedulerManualSmokeLocaleShard, key: string): string {
  const val = shard[key]
  if (typeof val !== 'string' || val.trim() === '') {
    throw new Error(`workflow-os-scheduler-manual-smoke locale missing key: ${key}`)
  }
  return val
}

/** §10 — ручная проверка OS scheduler (watch-folder) из locales workflow-os-scheduler-manual-smoke.json. */
export function buildWorkflowOsSchedulerManualSmokeChecklistFromLocaleShard(
  shard: WorkflowOsSchedulerManualSmokeLocaleShard,
  opts?: { platforms?: readonly OsSchedulerSmokePlatform[] }
): readonly FfmpegHwManualSmokeChecklistSection[] {
  const allowed = opts?.platforms
  return PLATFORM_SPECS.filter((spec) => !allowed || allowed.includes(spec.platform)).map(
    (spec) => {
      const p = spec.prefix
      return {
        id: spec.sectionId,
        title: t(shard, `${p}SectionTitle`),
        prerequisites: [t(shard, `${p}Prereq0`), t(shard, `${p}Prereq1`), t(shard, `${p}Prereq2`)],
        steps: [
          { id: 'planner-task', text: t(shard, `${p}Step_planner_task`) },
          { id: 'verify-os', text: t(shard, `${p}Step_verify_os`) },
          { id: 'drop-file', text: t(shard, `${p}Step_drop_file`) },
          { id: 'detect-run', text: t(shard, `${p}Step_detect_run`) },
          { id: 'headless-tick', text: t(shard, `${p}Step_headless_tick`) },
          { id: 'url-scenario', text: t(shard, `${p}Step_url_scenario`) }
        ],
        pass: [t(shard, `${p}Pass0`), t(shard, `${p}Pass1`), t(shard, `${p}Pass2`)]
      }
    }
  )
}
