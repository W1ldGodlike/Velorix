import type { FfmpegHwManualSmokeChecklistSection } from './ffmpeg-hw-manual-smoke-checklist-types'

export type WorkflowScenarioManualSmokeLocaleShard = Record<string, string>

const PREFIX = 'workflowScenarioSmoke'

function t(shard: WorkflowScenarioManualSmokeLocaleShard, key: string): string {
  const val = shard[key]
  if (typeof val !== 'string' || val.trim() === '') {
    throw new Error(`workflow-scenario-manual-smoke locale missing key: ${key}`)
  }
  return val
}

/** §11 — ручная проверка конструктора сценариев из locales workflow-scenario-manual-smoke.json. */
export function buildWorkflowScenarioManualSmokeChecklistFromLocaleShard(
  shard: WorkflowScenarioManualSmokeLocaleShard
): readonly FfmpegHwManualSmokeChecklistSection[] {
  const p = PREFIX
  return [
    {
      id: 'scenario-builder',
      title: t(shard, `${p}SectionTitle`),
      prerequisites: [t(shard, `${p}Prereq0`), t(shard, `${p}Prereq1`), t(shard, `${p}Prereq2`)],
      steps: [
        { id: 'open-builder', text: t(shard, `${p}Step_open_builder`) },
        { id: 'add-link', text: t(shard, `${p}Step_add_link`) },
        { id: 'save', text: t(shard, `${p}Step_save`) },
        { id: 'editor-run', text: t(shard, `${p}Step_editor_run`) },
        { id: 'url-run', text: t(shard, `${p}Step_url_run`) },
        { id: 'planner', text: t(shard, `${p}Step_planner`) }
      ],
      pass: [t(shard, `${p}Pass0`), t(shard, `${p}Pass1`), t(shard, `${p}Pass2`)]
    }
  ]
}
