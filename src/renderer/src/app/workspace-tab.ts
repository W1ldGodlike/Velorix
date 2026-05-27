/** Workspace routes for NEON shell (ref.1–10). */

export type WorkspaceTab =
  | 'processing'
  | 'downloads'
  | 'history'
  | 'planner'
  | 'knowledge'
  | 'settings'
  | 'scenarios'
  | 'inspector'
  | 'terminal'
  | 'tools'

export const WORKSPACE_TABS: WorkspaceTab[] = [
  'processing',
  'downloads',
  'history',
  'planner',
  'scenarios',
  'inspector',
  'terminal',
  'tools',
  'knowledge',
  'settings'
]

export const WORKSPACE_TAB_LABELS: Record<WorkspaceTab, string> = {
  processing: 'Обработка',
  downloads: 'Загрузки',
  history: 'История',
  planner: 'Планировщик',
  scenarios: 'Сценарии',
  inspector: 'Инспектор',
  terminal: 'Терминал',
  tools: 'Инструменты',
  knowledge: 'База знаний',
  settings: 'Настройки'
}
