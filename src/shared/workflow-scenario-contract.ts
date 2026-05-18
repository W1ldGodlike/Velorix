/** §11 — пользовательский сценарий (цепочка блоков). */
export const WORKFLOW_SCENARIO_FORMAT_VERSION = 1

export const WORKFLOW_SCENARIO_NODE_KINDS = ['download', 'process', 'save'] as const
export type WorkflowScenarioNodeKind = (typeof WORKFLOW_SCENARIO_NODE_KINDS)[number]

export type WorkflowScenarioNode = {
  id: string
  kind: WorkflowScenarioNodeKind
  label: string
  /** Для `download`: URL для yt-dlp (цепочка «скачать → обработать»). */
  sourceUrl?: string
  /** Зарезервировано: id пресета yt-dlp из настроек. */
  ytdlpPresetRef?: string
  /** Зарезервировано: id пользовательского пресета ffmpeg. */
  ffmpegPresetRef?: string
  /** Для `save`: каталог выхода (пусто — из настроек приложения). */
  outputDirectory?: string
}

export type WorkflowScenarioEdge = {
  from: string
  to: string
}

export type WorkflowScenarioDocument = {
  formatVersion: typeof WORKFLOW_SCENARIO_FORMAT_VERSION
  id: string
  title: string
  updatedAt: string
  nodes: WorkflowScenarioNode[]
  edges: WorkflowScenarioEdge[]
}

export type WorkflowScenarioRegistryV1 = {
  formatVersion: typeof WORKFLOW_SCENARIO_FORMAT_VERSION
  scenarios: WorkflowScenarioDocument[]
}

export type WorkflowScenarioListItem = {
  id: string
  title: string
  updatedAt: string
  nodeCount: number
}

export const WORKFLOW_SCENARIO_TEMPLATE_V1: WorkflowScenarioDocument = {
  formatVersion: WORKFLOW_SCENARIO_FORMAT_VERSION,
  id: 'scenario-new',
  title: 'Новый сценарий',
  updatedAt: '',
  nodes: [
    { id: 'download-1', kind: 'download', label: 'Скачать' },
    { id: 'process-1', kind: 'process', label: 'Обработать' },
    { id: 'save-1', kind: 'save', label: 'Сохранить в папку', outputDirectory: '' }
  ],
  edges: [
    { from: 'download-1', to: 'process-1' },
    { from: 'process-1', to: 'save-1' }
  ]
}
