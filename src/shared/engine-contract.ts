/** IPC/UI модель статусов движков ffmpeg/ffprobe/yt-dlp §3 (без резолва путей). */

export type EngineId = 'ffmpeg' | 'ffprobe' | 'yt-dlp'

/** Стабильный порядок обхода движков (настройки, IPC, статусбар); синхронизируй с `EngineId`. */
export const ENGINE_IDS = ['ffmpeg', 'ffprobe', 'yt-dlp'] as const satisfies readonly EngineId[]
export type EngineState = 'missing' | 'checking' | 'ready' | 'error'

/** Явные пути из настроек: полный путь к исполняемому файлу (имеет приоритет над bundled/user bin). */
export type EnginePathOverrides = Partial<Record<EngineId, string>>

/** Patch для IPC: `null` или пустая строка сбрасывают override для ключа. */
export type EnginePathOverridesPatch = Partial<Record<EngineId, string | null>>

export interface EngineStatus {
  /** Стабильный ID для IPC/UI; не зависит от расширения `.exe` на Windows. */
  id: EngineId
  /** Состояние для UI: renderer не должен гадать по тексту ошибки или пути. */
  state: EngineState
  /** Человекочитаемое имя для статуса/настроек; отдельно от имени файла. */
  displayName: string
  /** Реальное имя файла под текущую ОС (`ffmpeg.exe` на Windows, `ffmpeg` на Unix). */
  executableName: string
  /** Найденный путь, если бинарник существует хотя бы в одном из известных `bin`. */
  path: string | null
  /** Первая строка `--version`; позже пригодится для сравнения обновлений. */
  version: string | null
  /** Краткая причина `missing/error`, которую можно безопасно показать пользователю. */
  message: string | null
}

export interface EnginesStatusSnapshot {
  /** Время проверки: важно, когда UI позже будет обновлять статус по кнопке/таймеру. */
  checkedAt: string
  /** Статусы всех обязательных движков, индексированные по стабильному EngineId. */
  engines: Record<EngineId, EngineStatus>
}
