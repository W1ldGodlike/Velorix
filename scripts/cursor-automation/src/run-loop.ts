import 'dotenv/config'

import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { Agent, CursorAgentError, type AgentOptions } from '@cursor/sdk'

import {
  automationRoot,
  projectRoot,
  promptsDirDefault,
  stopFlagPath
} from './paths.js'
import {
  readBooleanSetting,
  readIntegerSetting,
  SDK_AUTOMATION_SETTINGS
} from './sdk-settings.js'

function readStdinIfNotTty(): Promise<string | null> {
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

function loadPrompt(fileName: string, promptDir: string): string {
  const path = join(promptDir, fileName)
  if (!existsSync(path)) {
    throw new Error(`Нет файла промпта: ${path}`)
  }
  return readFileSync(path, 'utf-8').trimEnd()
}

function parseArgs(argv: string[]): {
  once: boolean
  maxSteps: number
  verbose: boolean
  promptsDir: string
} {
  let once = false
  let maxSteps = readIntegerSetting(process.env.MAX_STEPS, SDK_AUTOMATION_SETTINGS.defaultMaxSteps, {
    min: 1
  })
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
  LOOP_STEP_RETRY_MAX  число попыток одной итерации при временных SDK/transport-сбоях на цепочке send → stream → wait (по умолчанию ${SDK_AUTOMATION_SETTINGS.defaultStepRetryMaxAttempts})
  LOOP_STEP_RETRY_BASE_MS  базовая пауза перед повтором, мс, растёт экспоненциально (по умолчанию ${SDK_AUTOMATION_SETTINGS.defaultStepRetryBaseDelayMs})
  LOOP_RETRY_RUN_ERROR повторять любой status=error той же итерацией. По умолчанию 0; включить: 1|true|yes|on
  LOOP_RUN_ERROR_RETRY_MAX  макс. попыток на одну итерацию при status=error (по умолчанию как LOOP_STEP_RETRY_MAX)
  LOOP_RUN_ERROR_RETRY_BASE_MS  базовая пауза между такими повторами (по умолчанию как LOOP_STEP_RETRY_BASE_MS)
  STEP_DELAY_MS        пауза между итерациями цикла (мс, по умолчанию ${SDK_AUTOMATION_SETTINGS.defaultStepDelayMs})
  SETTING_SOURCES_ALL=1  local.settingSources: ['all'] в SDK (обычно не нужно)
  VERBOSE=1            стрим текста assistant в stdout (также yes/on)
  PROMPTS_DIR          каталог с initial.txt и continue.txt
  CURSOR_MODEL          ID модели (по умолчанию ${SDK_AUTOMATION_SETTINGS.defaultModelId})

Примеры:
  npm run loop
  npm run once
  npm run loop -- --max-steps 10 --verbose

Стоп между итерациями:
  создать файл ${stopFlagPath} со значением 1
  1 = остановить перед следующей итерацией, 0 = продолжать работу
`)

      process.exit(0)
    } else {
      throw new Error(`Неизвестный аргумент: ${a} (справка: --help)`)
    }
  }

  return { once, maxSteps, verbose, promptsDir }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => {
    setTimeout(r, ms)
  })
}

function readStepRetryLimits(): { maxAttempts: number; baseDelayMs: number } {
  const maxAttempts = readIntegerSetting(
    process.env.LOOP_STEP_RETRY_MAX,
    SDK_AUTOMATION_SETTINGS.defaultStepRetryMaxAttempts,
    { min: 1, max: SDK_AUTOMATION_SETTINGS.maxRetryAttemptsCap }
  )
  const baseDelayMs = readIntegerSetting(
    process.env.LOOP_STEP_RETRY_BASE_MS,
    SDK_AUTOMATION_SETTINGS.defaultStepRetryBaseDelayMs,
    { min: SDK_AUTOMATION_SETTINGS.minRetryBaseDelayMs }
  )

  return { maxAttempts, baseDelayMs }
}

/** Полный повтор любого `status=error` включается только явно: `LOOP_RETRY_RUN_ERROR=1`. */
function readLoopRetryRunErrorEnabled(): boolean {
  return readBooleanSetting(
    process.env.LOOP_RETRY_RUN_ERROR,
    SDK_AUTOMATION_SETTINGS.retryAnyRunErrorDefault
  )
}

/**
 * Повторы после wait() при status=error: по умолчанию только эвристика «очень короткий run»
 * (см. isLikelyTransientRunError); любой error-run повторяется только с LOOP_RETRY_RUN_ERROR=1.
 */
function readRunErrorRetryConfig(stepRetry: { maxAttempts: number; baseDelayMs: number }): {
  retryAnyRunError: boolean
  maxAttempts: number
  baseDelayMs: number
} {
  const retryAnyRunError = readLoopRetryRunErrorEnabled()

  const maxAttempts = readIntegerSetting(process.env.LOOP_RUN_ERROR_RETRY_MAX, stepRetry.maxAttempts, {
    min: 1,
    max: SDK_AUTOMATION_SETTINGS.maxRetryAttemptsCap
  })
  const baseDelayMs = readIntegerSetting(
    process.env.LOOP_RUN_ERROR_RETRY_BASE_MS,
    stepRetry.baseDelayMs,
    { min: SDK_AUTOMATION_SETTINGS.minRetryBaseDelayMs }
  )

  return { retryAnyRunError, maxAttempts, baseDelayMs }
}

function isLikelyTransientTransportError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false
  }
  const ex = error as NodeJS.ErrnoException
  const code = typeof ex.code === 'string' ? ex.code : ''
  const msg = error.message.toLowerCase()
  return (
    code === 'ECONNRESET' ||
    code === 'ETIMEDOUT' ||
    code === 'ENOTFOUND' ||
    code === 'EAI_AGAIN' ||
    code === 'ECONNREFUSED' ||
    msg.includes('fetch failed') ||
    msg.includes('network error') ||
    msg.includes('socket hang up')
  )
}

function isRetryableConnectionFailure(error: unknown): boolean {
  if (error instanceof CursorAgentError) {
    return error.isRetryable === true
  }
  return isLikelyTransientTransportError(error)
}

/**
 * Повторяет действие при сбоях, которые не означают «run уже отработал с error»:
 * сеть, недоступный API, retryable CursorAgentError. Номер итерации цикла при этом не увеличивается.
 */
async function runWithConnectionRetries<T>(
  describe: string,
  maxAttempts: number,
  baseDelayMs: number,
  fn: () => Promise<T>
): Promise<T> {
  let attempt = 0
  while (true) {
    try {
      return await fn()
    } catch (error) {
      if (!isRetryableConnectionFailure(error)) {
        throw error
      }
      if (attempt >= maxAttempts - 1) {
        const msg = error instanceof Error ? error.message : String(error)
        console.error(`${describe}: исчерпано ${maxAttempts} попыток. Последняя ошибка: ${msg}`)
        throw error
      }
      const delayMs = Math.min(
        SDK_AUTOMATION_SETTINGS.maxRetryDelayMs,
        Math.round(baseDelayMs * Math.pow(2, attempt))
      )
      attempt++
      const msg = error instanceof Error ? error.message : String(error)
      console.error(
        `${describe}: временный сбой (повтор ${attempt}/${maxAttempts} через ${delayMs} мс) — ${msg}`
      )
      await sleep(delayMs)
    }
  }
}

interface AgentRunResultLike {
  id: string
  status: string
  durationMs?: number
}

function isLikelyTransientRunError(result: AgentRunResultLike): boolean {
  return (
    result.status === 'error' &&
    typeof result.durationMs === 'number' &&
    result.durationMs > 0 &&
    result.durationMs < SDK_AUTOMATION_SETTINGS.transientRunErrorMaxDurationMs
  )
}

function shouldRetryAfterRunError(
  result: AgentRunResultLike,
  cfg: { retryAnyRunError: boolean }
): boolean {
  if (result.status !== 'error') {
    return false
  }
  if (cfg.retryAnyRunError) {
    return true
  }
  return isLikelyTransientRunError(result)
}

async function runStepWithRetries<T extends AgentRunResultLike>(
  describe: string,
  maxAttempts: number,
  baseDelayMs: number,
  runErrorCfg: { retryAnyRunError: boolean },
  fn: () => Promise<T>
): Promise<T> {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = await fn()
    if (!shouldRetryAfterRunError(result, runErrorCfg)) {
      return result
    }

    const detail =
      typeof result.durationMs === 'number'
        ? ` (${result.durationMs} мс)`
        : ''

    if (attempt >= maxAttempts - 1) {
      console.error(`${describe}: run ${result.id} status=error${detail}, попытки исчерпаны (${maxAttempts}).`)
      return result
    }

    const delayMs = Math.min(
      SDK_AUTOMATION_SETTINGS.maxRetryDelayMs,
      Math.round(baseDelayMs * Math.pow(2, attempt))
    )
    console.error(
      `${describe}: run ${result.id} status=error${detail}, повтор ${attempt + 1}/${maxAttempts} через ${delayMs} мс.`
    )
    await sleep(delayMs)
  }

  throw new Error(`${describe}: не удалось выполнить runStepWithRetries`)
}

function ensureStopFlagFile(): void {
  if (!existsSync(stopFlagPath)) {
    // STOP локальный и игнорируется Git, поэтому создаём явный переключатель при запуске.
    writeFileSync(stopFlagPath, SDK_AUTOMATION_SETTINGS.defaultStopFlagValue, 'utf-8')
  }
}

function shouldStopByFlag(): boolean {
  if (!existsSync(stopFlagPath)) {
    return false
  }

  const value = readFileSync(stopFlagPath, 'utf-8').trim()
  // Совместимость со старым пустым STOP: пустой файл тоже останавливает цикл.
  return value === '' || readBooleanSetting(value, false)
}

async function streamVerboseAssistantText(run: { stream(): AsyncIterable<unknown> }): Promise<void> {
  for await (const msg of run.stream()) {
    if (
      typeof msg === 'object' &&
      msg !== null &&
      (msg as { type?: unknown }).type === 'assistant'
    ) {
      const assistant = msg as {
        message?: { content?: Array<{ type?: string; text?: string }> }
      }

      const content = assistant.message?.content
      if (!Array.isArray(content)) {
        continue
      }
      for (const block of content) {
        const t = block.text
        if (block.type === 'text' && typeof t === 'string') {
          await new Promise<void>((resolve, reject): void => {
            process.stdout.write(t, (err) => {
              if (err) {
                reject(err)
              } else {
                resolve()
              }
            })
          })
        }
      }
    }

    const mType =
      typeof msg === 'object' && msg !== null && typeof (msg as { type?: unknown }).type !== 'undefined'
        ? String((msg as { type?: unknown }).type)
        : ''
    if (
      typeof msg === 'object' &&
      msg !== null &&
      mType === 'thinking' &&
      typeof (msg as { text?: unknown }).text === 'string'
    ) {
      process.stderr.write(`\n[thinking] ${(msg as { text: string }).text}\n`)
    }
  }

  console.log('')
}

async function main(): Promise<number> {
  const argv = process.argv.slice(2)
  let opts: ReturnType<typeof parseArgs>

  try {
    opts = parseArgs(argv)
  } catch (e) {
    console.error(e instanceof Error ? e.message : e)
    return 64
  }

  const stdinPrompt = await readStdinIfNotTty()

  const apiKey = process.env.CURSOR_API_KEY?.trim()
  if (!apiKey) {
    console.error(
      'Нет CURSOR_API_KEY. См. README: ключ из Cursor Dashboard / service account.'
    )
    return 1
  }

  ensureStopFlagFile()

  const modelId =
    (process.env.CURSOR_MODEL ?? SDK_AUTOMATION_SETTINGS.defaultModelId).trim() ||
    SDK_AUTOMATION_SETTINGS.defaultModelId

  const initialDisk = loadPrompt('initial.txt', opts.promptsDir)
  const continueDisk = loadPrompt('continue.txt', opts.promptsDir)

  console.error(`cwd агента (корень репо): ${projectRoot}`)
  console.error(`папка автоматизации: ${automationRoot}`)

  const baseAgentOptions: AgentOptions = {
    apiKey,
    model: { id: modelId },
    local: {
      cwd: projectRoot,
      ...(readBooleanSetting(
        process.env.SETTING_SOURCES_ALL,
        SDK_AUTOMATION_SETTINGS.settingSourcesAllDefault
      )
        ? { settingSources: ['all'] }
        : {})
    }
  }

  const stepRetry = readStepRetryLimits()
  const runErrorRetry = readRunErrorRetryConfig(stepRetry)
  if (opts.verbose && runErrorRetry.retryAnyRunError) {
    console.error(
      `Повторы любого status=error: до ${runErrorRetry.maxAttempts} отправок того же шага.`
    )
  }

  if (opts.once) {
    try {
      const promptText = stdinPrompt ?? initialDisk
      const result = await runStepWithRetries(
        'Шаг одиночный (Agent.prompt)',
        runErrorRetry.maxAttempts,
        runErrorRetry.baseDelayMs,
        { retryAnyRunError: runErrorRetry.retryAnyRunError },
        () =>
          runWithConnectionRetries(
            'Шаг одиночный (Agent.prompt)',
            stepRetry.maxAttempts,
            stepRetry.baseDelayMs,
            () => Agent.prompt(promptText, baseAgentOptions)
          )
      )
      console.error(`Шаг одиночный: статус=${result.status}, run=${result.id}`)

      if (result.status === 'finished') {
        return 0
      }
      if (result.status === 'cancelled') {
        return 130
      }
      return 2

    } catch (e) {
      if (e instanceof CursorAgentError) {
        console.error(`SDK: ${e.message} (retryable=${e.isRetryable})`)
        return 1
      }
      throw e
    }

  }

  const agent = await runWithConnectionRetries(
    'Agent.create',
    stepRetry.maxAttempts,
    stepRetry.baseDelayMs,
    () => Agent.create(baseAgentOptions)
  )

  try {

    for (let step = 0; step < opts.maxSteps; step++) {
      if (shouldStopByFlag()) {

        console.error(`STOP=1 (${stopFlagPath}) — выход перед шагом ${step + 1}.`)

        return 0
      }

      console.error(`Итерация ${step + 1}/${opts.maxSteps}…`)

      const promptText = step === 0 ? (stdinPrompt ?? initialDisk) : continueDisk

      const result = await runStepWithRetries(
        `Итерация ${step + 1}/${opts.maxSteps}`,
        runErrorRetry.maxAttempts,
        runErrorRetry.baseDelayMs,
        { retryAnyRunError: runErrorRetry.retryAnyRunError },
        async () =>
          await runWithConnectionRetries(
            `Итерация ${step + 1}/${opts.maxSteps} send+wait`,
            stepRetry.maxAttempts,
            stepRetry.baseDelayMs,
            async () => {
              const run = await agent.send(promptText)
              console.error(`  Run id: ${run.id}`)

              if (opts.verbose && run.supports('stream')) {
                await streamVerboseAssistantText(run)
              }

              return await run.wait()
            }
          )
      )

      console.error(`  Статус: ${result.status} (run ${result.id})`)

      await sleep(
        readIntegerSetting(process.env.STEP_DELAY_MS, SDK_AUTOMATION_SETTINGS.defaultStepDelayMs, {
          min: SDK_AUTOMATION_SETTINGS.minStepDelayMs
        })
      )

      if (result.status === 'error') {

        console.error('Агент завершил шаг с error — прекращаем цикл.')

        return 2
      }

      if (result.status === 'cancelled') {

        console.error('Отменено — прекращаем цикл.')

        return 130
      }

    }

    console.error(`Достигнут лимит итераций (${opts.maxSteps}).`)

    return 0

  } catch (e) {
    if (e instanceof CursorAgentError) {

      console.error(`SDK: ${e.message} (retryable=${e.isRetryable})`)

      return 1
    }
    throw e
  } finally {
    await agent[Symbol.asyncDispose]()
  }


}

void main().then((code) => {
  process.exitCode = code
}).catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
