export type OpenDownloadedInMainHandlerFn = (
  absoluteFile: string
) => Promise<{ ok: true } | { ok: false; error: string }>

export type AfterDownloadOpenedInMainHandlerFn = (absoluteFile: string, rowId: number) => void

export type AfterDownloadEnqueueBatchFn = (absoluteFile: string, rowId: number) => void

/** Mutable runner state shared between `downloads-queue-runner` and `downloads-queue-runner-ytdlp-row`. */
export const downloadsQueueRunnerState = {
  activeAbort: null as AbortController | null,
  /** Строка очереди, для которой сейчас крутится yt-dlp (лог паузы §6.4). */
  activeRunnerRowId: null as number | null,
  sequentialBusy: false,
  notifySnapshot: (): void => {},
  /** Из index.ts: то же открытие в preview, что кнопка «В обработчик» в окне загрузок. */
  openDownloadedFileInMainHandlerHook: null as OpenDownloadedInMainHandlerFn | null,
  /** §6.4 → §7.2: после успешного авто-открытия (например авто-эспорт). */
  afterDownloadOpenedInMainHandlerHook: null as AfterDownloadOpenedInMainHandlerFn | null,
  /** §7.4 — после успешной загрузки добавить файл в пакетный экспорт. */
  afterDownloadEnqueueBatchHook: null as AfterDownloadEnqueueBatchFn | null
}
