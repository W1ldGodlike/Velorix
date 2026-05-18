import { CursorAgentError } from '@cursor/sdk'

import { readBooleanSetting, readIntegerSetting, SDK_AUTOMATION_SETTINGS } from './sdk-settings.js'

export function sleep(ms: number): Promise<void> {
  return new Promise((r) => {
    setTimeout(r, ms)
  })
}

export function readStepRetryLimits(): { maxAttempts: number; baseDelayMs: number } {
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
export function readLoopRetryRunErrorEnabled(): boolean {
  return readBooleanSetting(
    process.env.LOOP_RETRY_RUN_ERROR,
    SDK_AUTOMATION_SETTINGS.retryAnyRunErrorDefault
  )
}

/**
 * Повторы после wait() при status=error: по умолчанию только эвристика «очень короткий run»
 * (см. isLikelyTransientRunError); любой error-run повторяется только с LOOP_RETRY_RUN_ERROR=1.
 */
export function readRunErrorRetryConfig(stepRetry: { maxAttempts: number; baseDelayMs: number }): {
  retryAnyRunError: boolean
  maxAttempts: number
  baseDelayMs: number
} {
  const retryAnyRunError = readLoopRetryRunErrorEnabled()

  const maxAttempts = readIntegerSetting(
    process.env.LOOP_RUN_ERROR_RETRY_MAX,
    stepRetry.maxAttempts,
    {
      min: 1,
      max: SDK_AUTOMATION_SETTINGS.maxRetryAttemptsCap
    }
  )
  const baseDelayMs = readIntegerSetting(
    process.env.LOOP_RUN_ERROR_RETRY_BASE_MS,
    stepRetry.baseDelayMs,
    { min: SDK_AUTOMATION_SETTINGS.minRetryBaseDelayMs }
  )

  return { retryAnyRunError, maxAttempts, baseDelayMs }
}

export function isLikelyTransientTransportError(error: unknown): boolean {
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

export function isRetryableConnectionFailure(error: unknown): boolean {
  if (error instanceof CursorAgentError) {
    return error.isRetryable === true
  }
  return isLikelyTransientTransportError(error)
}

/**
 * Повторяет действие при сбоях, которые не означают «run уже отработал с error»:
 * сеть, недоступный API, retryable CursorAgentError. Номер итерации цикла при этом не увеличивается.
 */
export async function runWithConnectionRetries<T>(
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

export interface AgentRunResultLike {
  id: string
  status: string
  durationMs?: number
}

export function isLikelyTransientRunError(result: AgentRunResultLike): boolean {
  return (
    result.status === 'error' &&
    typeof result.durationMs === 'number' &&
    result.durationMs > 0 &&
    result.durationMs < SDK_AUTOMATION_SETTINGS.transientRunErrorMaxDurationMs
  )
}

export function shouldRetryAfterRunError(
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

export async function runStepWithRetries<T extends AgentRunResultLike>(
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

    const detail = typeof result.durationMs === 'number' ? ` (${result.durationMs} мс)` : ''

    if (attempt >= maxAttempts - 1) {
      console.error(
        `${describe}: run ${result.id} status=error${detail}, попытки исчерпаны (${maxAttempts}).`
      )
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
