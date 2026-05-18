import {
  WORKFLOW_SCENARIO_FORMAT_VERSION,
  type WorkflowScenarioDocument
} from './workflow-scenario-contract'

export type WorkflowScenarioTemplateId = 'local-file-process' | 'url-download-process'

export type WorkflowScenarioTemplateSpec = {
  id: WorkflowScenarioTemplateId
  /** Ключ `ui-text` / `workflow.json`. */
  titleKey: string
  hintKey: string
  build: () => WorkflowScenarioDocument
}

export const WORKFLOW_SCENARIO_TEMPLATES: readonly WorkflowScenarioTemplateSpec[] = [
  {
    id: 'local-file-process',
    titleKey: 'workflowTemplateLocalTitle',
    hintKey: 'workflowTemplateLocalHint',
    build: () => ({
      formatVersion: WORKFLOW_SCENARIO_FORMAT_VERSION,
      id: 'scenario-local',
      title: 'Локальный файл → ffmpeg',
      updatedAt: '',
      nodes: [
        { id: 'download-1', kind: 'download', label: 'Локальный файл' },
        { id: 'process-1', kind: 'process', label: 'Обработать' },
        { id: 'save-1', kind: 'save', label: 'Сохранить', outputDirectory: '' }
      ],
      edges: [
        { from: 'download-1', to: 'process-1' },
        { from: 'process-1', to: 'save-1' }
      ]
    })
  },
  {
    id: 'url-download-process',
    titleKey: 'workflowTemplateUrlTitle',
    hintKey: 'workflowTemplateUrlHint',
    build: () => ({
      formatVersion: WORKFLOW_SCENARIO_FORMAT_VERSION,
      id: 'scenario-url',
      title: 'URL → скачать → ffmpeg',
      updatedAt: '',
      nodes: [
        {
          id: 'download-1',
          kind: 'download',
          label: 'Скачать URL',
          sourceUrl: 'https://'
        },
        { id: 'process-1', kind: 'process', label: 'Обработать' },
        { id: 'save-1', kind: 'save', label: 'Сохранить', outputDirectory: '' }
      ],
      edges: [
        { from: 'download-1', to: 'process-1' },
        { from: 'process-1', to: 'save-1' }
      ]
    })
  }
] as const
