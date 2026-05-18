/**
 * §11 — ручной smoke конструктора сценариев (не CI UI).
 * Канон: locales/ru/workflow-scenario-manual-smoke.json + Help workflows-planner-scenarios.
 */

import ruWorkflowScenarioManualSmoke from '../../locales/ru/workflow-scenario-manual-smoke.json'
import { buildWorkflowScenarioManualSmokeChecklistFromLocaleShard } from './workflow-scenario-manual-smoke-checklist-build'
import { formatPackagedManualSmokeChecklistLines } from './packaged-manual-smoke-checklist-format'

export {
  buildWorkflowScenarioManualSmokeChecklistFromLocaleShard
} from './workflow-scenario-manual-smoke-checklist-build'

export const WORKFLOW_SCENARIO_MANUAL_SMOKE_CHECKLIST =
  buildWorkflowScenarioManualSmokeChecklistFromLocaleShard(
    ruWorkflowScenarioManualSmoke as Record<string, string>
  )

export function formatWorkflowScenarioManualSmokeChecklistLines(): string[] {
  return formatPackagedManualSmokeChecklistLines(WORKFLOW_SCENARIO_MANUAL_SMOKE_CHECKLIST, {
    ownerLine: 'ручной smoke конструктора сценариев (§11), не автоматизируется в CI UI',
    automatedLine: 'Vitest workflow-scenario-* / edge-mutations / layout',
    docLine: 'Help/workflows-planner-scenarios.md',
    uiLine: 'Сервис → Конструктор сценариев'
  })
}
