import type { AppPaths } from './app-paths'
import type { AppUiLocale } from '../shared/app-ui-locale'
import type { EngineId, EnginePathOverrides } from '../shared/engine-contract'
import { ENGINE_IDS } from '../shared/engine-contract'
import type {
  EngineUpdateCheckItem,
  EnginesCheckUpdatesAndDownloadResult
} from '../shared/engine-update-check-contract'
import { isEngineUpdateAvailable, parseEngineVersionToken } from '../shared/engine-version-parse'
import type { EngineDownloadProgress } from '../shared/engine-download-contract'
import {
  fetchLatestFfmpegVersionToken,
  fetchLatestYtDlpVersionToken
} from '../shared/engine-update-fetch'
import { getMainApplicationStrings } from '../shared/main-application-locale'
import { downloadEnginesWindows } from './engine-download'
import { getEnginesStatus } from './engine-service'
import type { TrustedHashesFile } from './trusted-hashes-store'
import { isNativeMainEngineAutoDownloadSupported } from './platform'

function buildItem(
  id: EngineId,
  currentRaw: string | null,
  latest: string | null
): EngineUpdateCheckItem {
  const current = parseEngineVersionToken(id, currentRaw)
  return {
    id,
    currentVersion: current,
    latestVersion: latest,
    updateAvailable: isEngineUpdateAvailable(current, latest)
  }
}

export async function checkEngineUpdates(
  paths: AppPaths,
  overrides: EnginePathOverrides | undefined,
  locale: AppUiLocale
): Promise<
  | { ok: true; items: EngineUpdateCheckItem[]; anyUpdateAvailable: boolean }
  | { ok: false; error: string }
> {
  const snapshot = await getEnginesStatus(paths, overrides, locale)
  let latestYt: string | null = null
  let latestFf: string | null = null
  try {
    ;[latestYt, latestFf] = await Promise.all([
      fetchLatestYtDlpVersionToken(),
      fetchLatestFfmpegVersionToken()
    ])
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    return { ok: false, error: msg }
  }

  const items: EngineUpdateCheckItem[] = ENGINE_IDS.map((id) => {
    const engine = snapshot.engines[id]
    const currentRaw = engine.version
    if (id === 'yt-dlp') {
      return buildItem(id, currentRaw, latestYt)
    }
    return buildItem(id, currentRaw, latestFf)
  })

  const anyUpdateAvailable =
    items.some((item) => item.updateAvailable) ||
    ENGINE_IDS.some((id) => snapshot.engines[id].state === 'missing')

  return { ok: true, items, anyUpdateAvailable }
}

export async function runEnginesCheckUpdatesAndDownload(
  paths: AppPaths,
  trusted: TrustedHashesFile,
  overrides: EnginePathOverrides | undefined,
  onProgress: (p: EngineDownloadProgress) => void,
  locale: AppUiLocale
): Promise<EnginesCheckUpdatesAndDownloadResult> {
  const checked = await checkEngineUpdates(paths, overrides, locale)
  if (!isNativeMainEngineAutoDownloadSupported()) {
    if (!checked.ok) {
      const S = getMainApplicationStrings(locale)
      return {
        ok: false,
        error: S.engineUpdateCheckFailedTemplate.replace('{detail}', checked.error)
      }
    }
    return {
      ok: true,
      platformSupported: false,
      items: checked.items,
      anyUpdateAvailable: checked.anyUpdateAvailable,
      downloaded: false
    }
  }

  if (!checked.ok) {
    const S = getMainApplicationStrings(locale)
    return {
      ok: false,
      error: S.engineUpdateCheckFailedTemplate.replace('{detail}', checked.error)
    }
  }

  if (!checked.anyUpdateAvailable) {
    return {
      ok: true,
      platformSupported: true,
      items: checked.items,
      anyUpdateAvailable: false,
      downloaded: false
    }
  }

  try {
    await downloadEnginesWindows(paths, trusted, onProgress, locale)
    return {
      ok: true,
      platformSupported: true,
      items: checked.items,
      anyUpdateAvailable: true,
      downloaded: true
    }
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    return { ok: false, error: msg }
  }
}
