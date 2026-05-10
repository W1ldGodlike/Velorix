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
  let maxSteps = Number.parseInt(process.env.MAX_STEPS ?? '5', 10)
  if (!Number.isFinite(maxSteps) || maxSteps < 1) {
    maxSteps = 5
  }
  let verbose = process.env.VERBOSE === '1' || process.env.VERBOSE === 'true'
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
  MAX_STEPS            число итераций (по умолчанию 5)
  LOOP_STEP_RETRY_MAX  число попыток одной итерации при временных SDK/transport-сбоях на цепочке send → stream → wait (по умолчанию 10)
  LOOP_STEP_RETRY_BASE_MS  базовая пауза перед повтором, мс, растёт экспоненциально (по умолчанию 2000)
  LOOP_RETRY_RUN_ERROR по умолчанию включено: после wait() при status=error снова отправляется тот же шаг (та же итерация). Выключить: 0|false|no|off
  LOOP_RUN_ERROR_RETRY_MAX  макс. попыток на одну итерацию при status=error (по умолчанию как LOOP_STEP_RETRY_MAX)
  LOOP_RUN_ERROR_RETRY_BASE_MS  базовая пауза между такими повторами (по умолчанию как LOOP_STEP_RETRY_BASE_MS)
  VERBOSE=1            стрим текста assistant в stdout
  PROMPTS_DIR          каталог с initial.txt и continue.txt
  CURSOR_MODEL          ID модели (по умолчанию default)

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
  const maxAttemptsRaw = Number.parseInt(process.env.LOOP_STEP_RETRY_MAX ?? '10', 10)
  const maxAttempts =
    Number.isFinite(maxAttemptsRaw) && maxAttemptsRaw >= 1
      ? Math.min(100, Math.floor(maxAttemptsRaw))
      : 10

  const baseDelayMsRaw = Number.parseInt(process.env.LOOP_STEP_RETRY_BASE_MS ?? '2000', 10)
  const baseDelayMs =
    Number.isFinite(baseDelayMsRaw) && baseDelayMsRaw >= 200 ? baseDelayMsRaw : 2000

  return { maxAttempts, baseDelayMs }
}

/** Повтор при любом `status=error` после wait включён по умолчанию; выключается через `LOOP_RETRY_RUN_ERROR=0`. */
function readLoopRetryRunErrorEnabled(): boolean {
  const v = process.env.LOOP_RETRY_RUN_ERROR?.trim().toLowerCase()
  if (v === undefined || v === '') {
    return true
  }
  return !['0', 'false', 'no', 'off'].includes(v)
}

/**
 * Повторы после wait() при status=error: по умолчанию любые; при LOOP_RETRY_RUN_ERROR=0 —
 * только эвристика «очень короткий run» (см. isLikelyTransientRunError).
 */
function readRunErrorRetryConfig(stepRetry: { maxAttempts: number; baseDelayMs: number }): {
  retryAnyRunError: boolean
  maxAttempts: number
  baseDelayMs: number
} {
  const retryAnyRunError = readLoopRetryRunErrorEnabled()

  const maxRaw = Number.parseInt(
    process.env.LOOP_RUN_ERROR_RETRY_MAX ?? String(stepRetry.maxAttempts),
    10
  )
  const maxAttempts =
    Number.isFinite(maxRaw) && maxRaw >= 1 ? Math.min(100, Math.floor(maxRaw)) : stepRetry.maxAttempts

  const baseRaw = Number.parseInt(
    process.env.LOOP_RUN_ERROR_RETRY_BASE_MS ?? String(stepRetry.baseDelayMs),
    10
  )
  const baseDelayMs =
    Number.isFinite(baseRaw) && baseRaw >= 200 ? baseRaw : stepRetry.baseDelayMs

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
      const delayMs = Math.min(60_000, Math.round(baseDelayMs * Math.pow(2, attempt)))
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
    result.durationMs < 5000
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

    const delayMs = Math.min(60_000, Math.round(baseDelayMs * Math.pow(2, attempt)))
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
    writeFileSync(stopFlagPath, '0\n', 'utf-8')
  }
}

function shouldStopByFlag(): boolean {
  if (!existsSync(stopFlagPath)) {
    return false
  }

  const value = readFileSync(stopFlagPath, 'utf-8').trim()
  // Совместимость со старым пустым STOP: пустой файл тоже останавливает цикл.
  return value === '' || value === '1' || value.toLowerCase() === 'true'
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

  const modelId = (process.env.CURSOR_MODEL ?? 'default').trim() || 'default'

  const initialDisk = loadPrompt('initial.txt', opts.promptsDir)
  const continueDisk = loadPrompt('continue.txt', opts.promptsDir)

  console.error(`cwd агента (корень репо): ${projectRoot}`)
  console.error(`папка автоматизации: ${automationRoot}`)

  const baseAgentOptions: AgentOptions = {
    apiKey,
    model: { id: modelId },
    local: {
      cwd: projectRoot,
      ...(process.env.SETTING_SOURCES_ALL === '1' ? { settingSources: ['all'] } : {})
    }
  }

  const stepRetry = readStepRetryLimits()
  const runErrorRetry = readRunErrorRetryConfig(stepRetry)
  if (opts.verbose && runErrorRetry.retryAnyRunError) {
    console.error(
      `Повторы при status=error: до ${runErrorRetry.maxAttempts} отправок того же шага (отключить: LOOP_RETRY_RUN_ERROR=0).`
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

      await sleep(Number.parseInt(process.env.STEP_DELAY_MS ?? '400', 10) || 400)

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
