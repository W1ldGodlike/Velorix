/**
 * §6.2–§6.4 — whitelist-парсинг полей yt-dlp из settings/IPC (без копипасты `if (raw === …)`).
 */
import type {
  YtdlpCookiesBrowserId,
  YtdlpFormatPresetId,
  YtdlpImpersonateId,
  YtdlpQueueRetryProfileId,
  YtdlpSubtitlePresetId
} from './ytdlp-download-contract'
import { parseWhitelistEnum } from './parse-whitelist'
import { parseStoredWhitelistEnum } from './settings-stored-parse'

const YTDLP_BROWSER_IDS = ['chrome', 'edge', 'firefox'] as const

export function parseYtdlpFormatPreset(raw: unknown): YtdlpFormatPresetId {
  return parseWhitelistEnum(
    raw,
    ['editor_mp4', 'merge_bv_ba', 'best_single', 'default'],
    'editor_mp4'
  )
}

export function parseYtdlpSubtitlePreset(raw: unknown): YtdlpSubtitlePresetId {
  return parseWhitelistEnum(raw, ['manual', 'manual_auto'], 'none')
}

export function parseYtdlpCookiesBrowser(raw: unknown): YtdlpCookiesBrowserId | undefined {
  return parseStoredWhitelistEnum(raw, YTDLP_BROWSER_IDS)
}

export function parseYtdlpImpersonate(raw: unknown): YtdlpImpersonateId | undefined {
  return parseStoredWhitelistEnum(raw, YTDLP_BROWSER_IDS)
}

export function parseYtdlpQueueRetryProfile(raw: unknown): YtdlpQueueRetryProfileId {
  return parseWhitelistEnum(raw, ['light', 'normal', 'persistent'], 'off')
}

/** Строковый шаблон `-o` из settings (семантика — `validateFilenameTemplate` в main). */
export function parseYtdlpFilenameTemplateStored(raw: unknown): string | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim()
  if (t.length === 0) {
    return undefined
  }
  return t.length <= 480 ? t : t.slice(0, 480)
}
