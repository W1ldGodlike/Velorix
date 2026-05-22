/**
 * §10 — ручная проверка OS scheduler watch-folder (не CI).
 * Канон: locales/ru/workflow-os-scheduler-manual-smoke.json + docs/RELEASE.md §4.3.
 */

import ruWorkflowOsSchedulerManualSmoke from '../../locales/ru/workflow-os-scheduler-manual-smoke.json'
import { buildWorkflowOsSchedulerManualSmokeChecklistFromLocaleShard } from './workflow-os-scheduler-manual-smoke-checklist-build'
import { formatPackagedManualSmokeChecklistLines } from './packaged-manual-smoke-checklist-format'

export { buildWorkflowOsSchedulerManualSmokeChecklistFromLocaleShard } from './workflow-os-scheduler-manual-smoke-checklist-build'

export const WORKFLOW_OS_SCHEDULER_MANUAL_SMOKE_CHECKLIST =
  buildWorkflowOsSchedulerManualSmokeChecklistFromLocaleShard(
    ruWorkflowOsSchedulerManualSmoke as Record<string, string>
  )

export function formatWorkflowOsSchedulerManualSmokeChecklistLines(): string[] {
  return formatPackagedManualSmokeChecklistLines(WORKFLOW_OS_SCHEDULER_MANUAL_SMOKE_CHECKLIST, {
    ownerLine: 'ручная проверка OS scheduler watch-folder (§10), не автоматизируется в CI UI',
    automatedLine:
      'n/a — owner-only; Vitest buildWorkflowOsSchedulerManualSmokeChecklistFromLocaleShard',
    docLine: 'docs/RELEASE.md §4.3',
    uiLine: 'Сервис → Планировщик задач → чеклист OS scheduler'
  })
}
