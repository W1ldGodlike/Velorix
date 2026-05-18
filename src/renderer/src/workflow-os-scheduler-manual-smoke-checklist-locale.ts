import type { AppUiLocale } from '../../shared/app-ui-locale'
import type { FfmpegHwManualSmokeChecklistSection } from '../../shared/ffmpeg-hw-manual-smoke-checklist-types'
import { buildWorkflowOsSchedulerManualSmokeChecklistFromLocaleShard } from '../../shared/workflow-os-scheduler-manual-smoke-checklist-build'
import { WORKFLOW_OS_SCHEDULER_MANUAL_SMOKE_CHECKLIST } from '../../shared/workflow-os-scheduler-manual-smoke-checklist'
import enWorkflowOsSchedulerManualSmoke from '@locales/en/workflow-os-scheduler-manual-smoke.json'
import ruWorkflowOsSchedulerManualSmoke from '@locales/ru/workflow-os-scheduler-manual-smoke.json'

export type WorkflowOsSchedulerSmokeCapabilities = {
  windowsTaskScheduler?: boolean
  macosLaunchd?: boolean
  linuxSystemdUserTimer?: boolean
}

function resolvePlatforms(
  caps: WorkflowOsSchedulerSmokeCapabilities | undefined
): readonly ('win' | 'macos' | 'linux')[] | undefined {
  if (!caps) {
    return undefined
  }
  const platforms: ('win' | 'macos' | 'linux')[] = []
  if (caps.windowsTaskScheduler) {
    platforms.push('win')
  }
  if (caps.macosLaunchd) {
    platforms.push('macos')
  }
  if (caps.linuxSystemdUserTimer) {
    platforms.push('linux')
  }
  return platforms.length > 0 ? platforms : undefined
}

export function getWorkflowOsSchedulerManualSmokeChecklistForUiLocale(
  locale: AppUiLocale,
  caps?: WorkflowOsSchedulerSmokeCapabilities
): readonly FfmpegHwManualSmokeChecklistSection[] {
  const platforms = resolvePlatforms(caps)
  if (locale === 'en') {
    return buildWorkflowOsSchedulerManualSmokeChecklistFromLocaleShard(
      enWorkflowOsSchedulerManualSmoke as Record<string, string>,
      platforms ? { platforms } : undefined
    )
  }
  if (!platforms) {
    return WORKFLOW_OS_SCHEDULER_MANUAL_SMOKE_CHECKLIST
  }
  return buildWorkflowOsSchedulerManualSmokeChecklistFromLocaleShard(
    ruWorkflowOsSchedulerManualSmoke as Record<string, string>,
    { platforms }
  )
}
