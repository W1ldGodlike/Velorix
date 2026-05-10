import 'dotenv/config'

import { existsSync, readFileSync } from 'fs'
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

  if (opts.once) {
    try {
      const promptText = stdinPrompt ?? initialDisk
      const result = await Agent.prompt(promptText, baseAgentOptions)
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

  const agent = await Agent.create(baseAgentOptions)

  try {

    for (let step = 0; step < opts.maxSteps; step++) {
      if (shouldStopByFlag()) {

        console.error(`STOP=1 (${stopFlagPath}) — выход перед шагом ${step + 1}.`)

        return 0
      }

      console.error(`Итерация ${step + 1}/${opts.maxSteps}…`)

      const promptText = step === 0 ? (stdinPrompt ?? initialDisk) : continueDisk

      const run = await agent.send(promptText)
      console.error(`  Run id: ${run.id}`)

      if (opts.verbose && run.supports('stream')) {
        await streamVerboseAssistantText(run)
      }

      const result = await run.wait()

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
