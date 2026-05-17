import 'dotenv/config'

import { Agent, CursorAgentError, type AgentOptions } from '@cursor/sdk'

import { automationRoot, projectRoot, stopFlagPath } from './paths.js'
import { readBooleanSetting, readIntegerSetting, SDK_AUTOMATION_SETTINGS } from './sdk-settings.js'
import {
  ensureStopFlagFile,
  loadPrompt,
  parseArgs,
  readStdinIfNotTty,
  shouldStopByFlag
} from './run-loop-cli.js'
import {
  readRunErrorRetryConfig,
  readStepRetryLimits,
  runStepWithRetries,
  runWithConnectionRetries,
  sleep
} from './run-loop-retry.js'
import {
  buildSessionRestartPrompt,
  normalizeVerboseMode,
  streamVerboseAssistantText,
  warnIfExpensiveSessionConfig
} from './run-loop-verbose.js'

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
  opts = { ...opts, verbose: normalizeVerboseMode(opts) }
  warnIfExpensiveSessionConfig(opts)

  const apiKey = process.env.CURSOR_API_KEY?.trim()
  if (!apiKey) {
    console.error('Нет CURSOR_API_KEY. См. README: ключ из Cursor Dashboard / service account.')
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

  try {
    let completedSteps = 0
    let sessionIndex = 0

    while (completedSteps < opts.maxSteps) {
      if (shouldStopByFlag()) {
        console.error(`STOP=1 (${stopFlagPath}) — выход перед шагом ${completedSteps + 1}.`)

        return 0
      }

      sessionIndex++
      const sessionRemaining = opts.maxSteps - completedSteps
      const sessionSteps = Math.min(opts.sessionMaxSteps, sessionRemaining)
      console.error(
        `SDK-сессия ${sessionIndex}: Agent.create на ${sessionSteps} итерац. (завершено ${completedSteps}/${opts.maxSteps})`
      )

      const agent = await runWithConnectionRetries(
        `Agent.create (сессия ${sessionIndex})`,
        stepRetry.maxAttempts,
        stepRetry.baseDelayMs,
        () => Agent.create(baseAgentOptions)
      )

      try {
        for (let stepInSession = 0; stepInSession < sessionSteps; stepInSession++) {
          if (shouldStopByFlag()) {
            console.error(`STOP=1 (${stopFlagPath}) — выход перед шагом ${completedSteps + 1}.`)
            return 0
          }

          const globalStep = completedSteps + 1
          console.error(
            `Итерация ${globalStep}/${opts.maxSteps} (сессия ${sessionIndex}, шаг ${stepInSession + 1}/${sessionSteps})…`
          )

          const promptText =
            globalStep === 1
              ? (stdinPrompt ?? initialDisk)
              : stepInSession === 0
                ? buildSessionRestartPrompt({
                    continuePrompt: continueDisk,
                    completedSteps,
                    maxSteps: opts.maxSteps,
                    sessionIndex,
                    sessionMaxSteps: sessionSteps
                  })
                : continueDisk

          const result = await runStepWithRetries(
            `Итерация ${globalStep}/${opts.maxSteps}`,
            runErrorRetry.maxAttempts,
            runErrorRetry.baseDelayMs,
            { retryAnyRunError: runErrorRetry.retryAnyRunError },
            async () =>
              await runWithConnectionRetries(
                `Итерация ${globalStep}/${opts.maxSteps} send+wait`,
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
          completedSteps++

          await sleep(
            readIntegerSetting(
              process.env.STEP_DELAY_MS,
              SDK_AUTOMATION_SETTINGS.defaultStepDelayMs,
              {
                min: SDK_AUTOMATION_SETTINGS.minStepDelayMs
              }
            )
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
      } finally {
        await agent[Symbol.asyncDispose]()
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
  }
}

void main()
  .then((code) => {
    process.exitCode = code
  })
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })

