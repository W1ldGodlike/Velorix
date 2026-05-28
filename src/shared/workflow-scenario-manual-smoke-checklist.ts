/**
 * §11 — ручная проверка конструктора сценариев (не CI UI).
 * Канон: locales/ru/workflow-scenario-manual-smoke.json + Help workflows-planner-scenarios.
 */

import ruWorkflowScenarioManualSmoke from './post-purge-manual-smoke/ru/workflow-scenario-manual-smoke.json'
import { buildWorkflowScenarioManualSmokeChecklistFromLocaleShard } from './workflow-scenario-manual-smoke-checklist-build'
import { formatPackagedManualSmokeChecklistLines } from './packaged-manual-smoke-checklist-format'

export { buildWorkflowScenarioManualSmokeChecklistFromLocaleShard } from './workflow-scenario-manual-smoke-checklist-build'

export const WORKFLOW_SCENARIO_MANUAL_SMOKE_CHECKLIST =
  buildWorkflowScenarioManualSmokeChecklistFromLocaleShard(
    ruWorkflowScenarioManualSmoke as Record<string, string>
  )

export function formatWorkflowScenarioManualSmokeChecklistLines(): string[] {
  return formatPackagedManualSmokeChecklistLines(WORKFLOW_SCENARIO_MANUAL_SMOKE_CHECKLIST, {
    ownerLine: 'ручная проверка конструктора сценариев (§11), не автоматизируется в CI UI',
    automatedLine: 'Vitest workflow-scenario-* / edge-mutations / layout',
    docLine: 'Help/ru/workflows-planner-scenarios.md',
    uiLine: 'Сервис → Конструктор сценариев'
  })
}
