import type { EngineId } from './engine-contract'

export type EngineUpdateCheckItem = {
  id: EngineId
  /** Нормализованная версия из `--version` / `-version`. */
  currentVersion: string | null
  /** Версия с upstream (GitHub). */
  latestVersion: string | null
  updateAvailable: boolean
}

export type EnginesCheckUpdatesAndDownloadResult =
  | {
      ok: true
      platformSupported: boolean
      items: EngineUpdateCheckItem[]
      anyUpdateAvailable: boolean
      downloaded: boolean
    }
  | { ok: false; error: string }
