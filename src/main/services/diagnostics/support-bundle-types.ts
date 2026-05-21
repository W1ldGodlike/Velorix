export interface SupportBundleRuntimeInfo {
  appVersion: string
  buildInfoLines: readonly string[]
  electronVersion: string
  chromeVersion: string
  nodeVersion: string
  platform: string
  arch: string
  /** `app.getLocale()` — для отчётов о локализации UI. */
  appLocale: string
  /** `app.getSystemLocale()` при наличии, иначе совпадает с appLocale. */
  systemLocale: string
  processId: number
  currentWorkingDirectory: string
  /** Basename `process.execPath` (без полного пути к exe). */
  execBasename: string
  packaged: boolean
  /** Кратко: размеры экрана, workArea, scaleFactor (§1.1 DPI / §9 диагностика). */
  primaryDisplayLine: string
  userData: string
  resources: string
  logFile: string | null
  logBackupFile: string | null
  /** §18 — лог текущей сессии (`session.log`), дублирует строки с `main.log`. */
  sessionLogFile: string | null
  /** §8 — последние прогонки вкладки «Терминал» (stderr и блокировки). */
  terminalCliLogFile: string | null
  crashDumps: string | null
  /** §3/§9 — `ffmpeg` / `ffprobe` / `yt-dlp`: state, путь, первая строка `-version`. */
  engineDiagnosticLines: readonly string[]
  /** §8 — dev guards для terminal-contract-hints shards (check:quiet). */
  terminalHintsLines: readonly string[]
  /** §19 — подсказки `smoke:packaged-release` и наличие `dist/win-unpacked`. */
  releaseSmokeLines: readonly string[]
  /** §9/§18 — packaged ffprobe smoke: кандидаты путей и команда проверки. */
  ffprobeSmokeLines: readonly string[]
  /** §2.2 — hot-reload uiLocale (IPC + renderer session). */
  uiLocaleIpcLines: readonly string[]
  localeJsonCatalogLines: readonly string[]
  rendererStateLines: readonly string[]
  uiDpiLines: readonly string[]
  /** §16 — ручной smoke HW encode (чеклист владельца, не CI). */
  hwManualSmokeChecklistLines: readonly string[]
  /** §3 — ручной smoke packaged Win (чеклист владельца, не CI UI). */
  winPackagedSmokeChecklistLines: readonly string[]
  /** §3 — ручной smoke packaged Linux. */
  linuxPackagedSmokeChecklistLines: readonly string[]
  /** §3 — ручной smoke packaged macOS. */
  macosPackagedSmokeChecklistLines: readonly string[]
  /** §10 — ручной smoke OS scheduler watch-folder. */
  workflowOsSchedulerSmokeChecklistLines: readonly string[]
  /** §16/§1.1/§10 — единый пакет owner smoke (HiDPI + HW + OS scheduler). */
  ownerManualSmokeBundleLines: readonly string[]
}

export interface DiagnosticsPruneOptions {
  directory: string | null
  maxAgeMs: number
  keepNewest: number
  fileNamePattern?: RegExp
}

export interface ZipEntryInput {
  name: string
  data: Buffer
  mtime?: Date
}

export interface DirectoryUsageStats {
  files: number
  directories: number
  bytes: number
}

export const MAX_BUNDLE_FILE_BYTES = 512 * 1024
export const MAX_CRASH_DUMP_FILES = 8
