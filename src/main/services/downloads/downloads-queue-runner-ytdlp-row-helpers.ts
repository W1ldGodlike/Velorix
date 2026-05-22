import type { AppUiLocale } from '../../../shared/app-ui-locale'
import { downloadsRunnerAbortMessage } from '../../../shared/downloads-velorix-log-locale'

/** Реже дергать таблицу/IPC: полоса и подпись прогресса обновляются не чаще этого интервала. */
export const DOWNLOADS_PROGRESS_UI_MIN_INTERVAL_MS = 1000
/** В лог UI: строки `[download] … NN%` — не чаще чем на этот шаг по проценту (плюс «тишина» ниже). */
export const DOWNLOADS_PROGRESS_LOG_MIN_PERCENT_STEP = 0.1
/** …или раз в столько мс, если процент почти не двигается (чтобы лог не «замер»). */
export const DOWNLOADS_PROGRESS_LOG_MAX_SILENCE_MS = 2500

export function isAbort(e: unknown): boolean {
  return e instanceof Error && e.name === 'AbortError'
}

export function abortErr(locale: AppUiLocale): Error {
  const e = new Error(downloadsRunnerAbortMessage(locale))
  e.name = 'AbortError'
  return e
}

/** Пауза между повторами §6.4; отмена — тем же `AbortSignal`, что и у текущей загрузки. */
export function delayWithAbort(
  ms: number,
  signal: AbortSignal,
  locale: AppUiLocale
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(abortErr(locale))
      return
    }
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort)
      resolve()
    }, ms)
    const onAbort = (): void => {
      clearTimeout(timer)
      signal.removeEventListener('abort', onAbort)
      reject(abortErr(locale))
    }
    signal.addEventListener('abort', onAbort, { once: true })
  })
}
