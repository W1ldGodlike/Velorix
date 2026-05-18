import type { EngineId } from './engine-contract'
import type { AppUiLocale } from './app-ui-locale'

/** argv-токен: main подставляет абсолютный путь текущего превью (`isGrantedMediaPath`). */
export const TERMINAL_CURRENT_FILE_PLACEHOLDER = '__CURRENT_FILE__'

export type TerminalToolId = EngineId

export type TerminalCommandHintEntry = {
  token: string
  summary: string
  tool: TerminalToolId
  /** Если задано, щелчок по подсказке подставляет целую argv-строку вместо одного токена. */
  fullLine?: string
  /** Примеры из `Data/*_commands.json` (ТЗ §8). */
  examples?: readonly string[]
  /** Ссылка на документацию из JSON-каталога. */
  docUrl?: string
}

export type TerminalRunRequest = {
  line: string
  /** Путь открытого в редакторе файла; подставляется вместо `TERMINAL_CURRENT_FILE_PLACEHOLDER` в argv. */
  currentFilePath?: string | null
  /** Локаль UI для текстов ошибок валидации (main). */
  uiLocale?: AppUiLocale
}

export type TerminalRunResult =
  | {
      ok: true
      tool: TerminalToolId
      args: string[]
      code: number | null
      stdout: string
      stderr: string
      elapsedMs: number
    }
  | { ok: false; error: string }
