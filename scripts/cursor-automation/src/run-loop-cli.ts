import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { promptsDirDefault, stopFlagPath } from './paths.js'
import { readBooleanSetting, readIntegerSetting, SDK_AUTOMATION_SETTINGS } from './sdk-settings.js'

export function readStdinIfNotTty(): Promise<string | null> {
  if (process.stdin.isTTY) {
    return Promise.resolve(null)
  }
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = []
    process.stdin.on('data', (c: Buffer | string) => {
      chunks.push(typeof c === 'string' ? Buffer.from(c, 'utf-8') : c)
    })
    process.stdin.on('end', () => {
      const s = Buffer.concat(chunks).toString('utf-8').trim()
      resolve(s.length > 0 ? s : null)
    })
    process.stdin.on('error', reject)
  })
}

export function loadPrompt(fileName: string, promptDir: string): string {
  const path = join(promptDir, fileName)
  if (!existsSync(path)) {
    throw new Error(`Нет файла промпта: ${path}`)
  }
  return readFileSync(path, 'utf-8').trimEnd()
}

export function parseArgs(argv: string[]): {
  once: boolean
  maxSteps: number
  sessionMaxSteps: number
  verbose: boolean
  promptsDir: string
} {
  let once = false
  let maxSteps = readIntegerSetting(
    process.env.MAX_STEPS,
    SDK_AUTOMATION_SETTINGS.defaultMaxSteps,
    {
      min: 1
    }
  )
  let sessionMaxSteps = readIntegerSetting(
    process.env.SDK_SESSION_STEPS,
    SDK_AUTOMATION_SETTINGS.defaultSessionMaxSteps,
    { min: 1 }
  )
  let verbose = readBooleanSetting(process.env.VERBOSE, SDK_AUTOMATION_SETTINGS.defaultVerbose)
  let promptsDir =
    process.env.PROMPTS_DIR && process.env.PROMPTS_DIR.trim() !== ''
      ? process.env.PROMPTS_DIR
      : promptsDirDefault

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--once') {
      once = true
    } else if (a === '--verbose' || a === '-v') {
      verbose = true
    } else if (a === '--max-steps' || a === '-n') {
      const raw = argv[i + 1]
      if (!raw) {
        throw new Error(`Ожидалось число после ${a}`)
      }
      const n = Number.parseInt(raw, 10)
      if (!Number.isFinite(n) || n < 1) {
        throw new Error(`Некорректное число шагов: ${raw}`)
      }
      maxSteps = n
      i++
    } else if (a === '--session-steps') {
      const raw = argv[i + 1]
      if (!raw) {
        throw new Error(`Ожидалось число после ${a}`)
      }
      const n = Number.parseInt(raw, 10)
      if (!Number.isFinite(n) || n < 1) {
        throw new Error(`Некорректное число шагов SDK-сессии: ${raw}`)
      }
      sessionMaxSteps = n
      i++
    } else if (a === '--prompts-dir') {
      const dir = argv[i + 1]
      if (!dir) {
        throw new Error(`Ожидался путь после --prompts-dir`)
      }
      promptsDir = dir
      i++
    } else if (a === '--help' || a === '-h') {
      console.log(`FluxAlloy Cursor automation (локальный SDK-агент)

Переменные окружения:
  CURSOR_API_KEY       обязательна
  MAX_STEPS            число итераций (по умолчанию ${SDK_AUTOMATION_SETTINGS.defaultMaxSteps})
  SDK_SESSION_STEPS    сколько итераций держать в одном Agent.create (по умолчанию ${SDK_AUTOMATION_SETTINGS.defaultSessionMaxSteps})
  LOOP_STEP_RETRY_MAX  число попыток одной итерации при временных SDK/transport-сбоях на цепочке send → stream → wait (по умолчанию ${SDK_AUTOMATION_SETTINGS.defaultStepRetryMaxAttempts})
  LOOP_STEP_RETRY_BASE_MS  базовая пауза перед повтором, мс, растёт экспоненциально (по умолчанию ${SDK_AUTOMATION_SETTINGS.defaultStepRetryBaseDelayMs})
  LOOP_RETRY_RUN_ERROR повторять любой status=error той же итерацией. По умолчанию 0; включить: 1|true|yes|on
  LOOP_RUN_ERROR_RETRY_MAX  макс. попыток на одну итерацию при status=error (по умолчанию как LOOP_STEP_RETRY_MAX)
  LOOP_RUN_ERROR_RETRY_BASE_MS  базовая пауза между такими повторами (по умолчанию как LOOP_STEP_RETRY_BASE_MS)
  STEP_DELAY_MS        пауза между итерациями цикла (мс, по умолчанию ${SDK_AUTOMATION_SETTINGS.defaultStepDelayMs})
  SETTING_SOURCES_ALL=1  local.settingSources: ['all'] в SDK (обычно не нужно)
  VERBOSE=1            стрим текста assistant в stdout (также yes/on)
  VERBOSE_MAX_CHARS    лимит stream-лога при VERBOSE=1 (по умолчанию ${SDK_AUTOMATION_SETTINGS.defaultVerboseMaxChars})
  SDK_ALLOW_VERBOSE_LONG_LOOP=1  разрешить --verbose при MAX_STEPS > ${SDK_AUTOMATION_SETTINGS.verboseLongLoopMaxSteps}
  PROMPTS_DIR          каталог с initial.txt и continue.txt
  CURSOR_MODEL          ID модели (по умолчанию ${SDK_AUTOMATION_SETTINGS.defaultModelId})

Примеры:
  npm run loop
  npm run loop:cheap
  npm run once
  npm run loop -- --max-steps 10 --verbose
  npm run loop -- --max-steps 300 --session-steps 1

Стоп между итерациями:
  создать файл ${stopFlagPath} со значением 1
  1 = остановить перед следующей итерацией, 0 = продолжать работу
`)

      process.exit(0)
    } else {
      throw new Error(`Неизвестный аргумент: ${a} (справка: --help)`)
    }
  }

  return { once, maxSteps, sessionMaxSteps, verbose, promptsDir }
}

export function ensureStopFlagFile(): void {
  if (!existsSync(stopFlagPath)) {
    // STOP локальный и игнорируется Git, поэтому создаём явный переключатель при запуске.
    writeFileSync(stopFlagPath, SDK_AUTOMATION_SETTINGS.defaultStopFlagValue, 'utf-8')
  }
}

export function shouldStopByFlag(): boolean {
  if (!existsSync(stopFlagPath)) {
    return false
  }

  const value = readFileSync(stopFlagPath, 'utf-8').trim()
  // Совместимость со старым пустым STOP: пустой файл тоже останавливает цикл.
  return value === '' || readBooleanSetting(value, false)
}
