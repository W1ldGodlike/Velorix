/** §10 — запланированная задача (каркас; watch folder + in-app backend). */
export const SCHEDULED_TASK_FORMAT_VERSION = 1

export const SCHEDULED_TASK_TRIGGERS = ['watch-folder'] as const
export type ScheduledTaskTrigger = (typeof SCHEDULED_TASK_TRIGGERS)[number]

export const SCHEDULED_TASK_BACKENDS = ['in-app', 'windows-task-scheduler'] as const
export type ScheduledTaskBackend = (typeof SCHEDULED_TASK_BACKENDS)[number]

export type ScheduledTaskDocument = {
  formatVersion: typeof SCHEDULED_TASK_FORMAT_VERSION
  id: string
  title: string
  enabled: boolean
  trigger: ScheduledTaskTrigger
  backend: ScheduledTaskBackend
  watchFolderPath: string
  scenarioId: string
  pollIntervalSec: number
  /** После обнаружения файла — запустить сценарий (ffmpeg), иначе только событие IPC. */
  executeScenarioOnDetect: boolean
  scheduleNote?: string
}

export type ScheduledTaskRegistryV1 = {
  formatVersion: typeof SCHEDULED_TASK_FORMAT_VERSION
  tasks: ScheduledTaskDocument[]
}

export type ScheduledTaskListItem = {
  id: string
  title: string
  enabled: boolean
  trigger: ScheduledTaskTrigger
  watchFolderPath: string
  scenarioId: string
  pollIntervalSec: number
  backend: ScheduledTaskBackend
  executeScenarioOnDetect: boolean
}

export const SCHEDULED_TASK_TEMPLATE_V1: ScheduledTaskDocument = {
  formatVersion: SCHEDULED_TASK_FORMAT_VERSION,
  id: 'task-watch-new',
  title: 'Мониторинг папки',
  enabled: false,
  trigger: 'watch-folder',
  backend: 'in-app',
  watchFolderPath: '',
  scenarioId: 'scenario-new',
  pollIntervalSec: 60,
  executeScenarioOnDetect: true
}
