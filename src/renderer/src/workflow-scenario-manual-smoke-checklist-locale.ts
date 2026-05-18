import type { AppUiLocale } from '../../shared/app-ui-locale'
import type { FfmpegHwManualSmokeChecklistSection } from '../../shared/ffmpeg-hw-manual-smoke-checklist-types'
import { buildWorkflowScenarioManualSmokeChecklistFromLocaleShard } from '../../shared/workflow-scenario-manual-smoke-checklist-build'
import { WORKFLOW_SCENARIO_MANUAL_SMOKE_CHECKLIST } from '../../shared/workflow-scenario-manual-smoke-checklist'
import enWorkflowScenarioManualSmoke from '@locales/en/workflow-scenario-manual-smoke.json'

export function getWorkflowScenarioManualSmokeChecklistForUiLocale(
  locale: AppUiLocale
): readonly FfmpegHwManualSmokeChecklistSection[] {
  if (locale === 'en') {
    return buildWorkflowScenarioManualSmokeChecklistFromLocaleShard(
      enWorkflowScenarioManualSmoke as Record<string, string>
    )
  }
  return WORKFLOW_SCENARIO_MANUAL_SMOKE_CHECKLIST
}
