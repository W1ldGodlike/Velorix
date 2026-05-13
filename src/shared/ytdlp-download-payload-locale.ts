import type { DownloadsWindowUiLocale } from './downloads-window-ui-locale'
import type { YtdlpFormatPresetId, YtdlpQueueRetryProfileId } from './ytdlp-download-contract'

/** `<select>` labels for yt-dlp download options payload (main-safe). */
export function buildYtdlpFormatPresetChoices(
  locale: DownloadsWindowUiLocale
): Array<{ id: YtdlpFormatPresetId; label: string }> {
  if (locale === 'en') {
    return [
      { id: 'editor_mp4', label: 'MP4 for editor (H.264/AAC)' },
      { id: 'default', label: 'Default (yt-dlp)' },
      { id: 'merge_bv_ba', label: 'Best video + audio (merge)' },
      { id: 'best_single', label: 'Best single file (-f best)' }
    ]
  }
  return [
    { id: 'editor_mp4', label: 'MP4 для редактора (H.264/AAC)' },
    { id: 'default', label: 'По умолчанию (yt-dlp)' },
    { id: 'merge_bv_ba', label: 'Лучшее видео + аудио (слить)' },
    { id: 'best_single', label: 'Лучший один файл (-f best)' }
  ]
}

export function buildYtdlpQueueRetryProfileChoices(
  locale: DownloadsWindowUiLocale
): Array<{ id: YtdlpQueueRetryProfileId; label: string }> {
  if (locale === 'en') {
    return [
      { id: 'off', label: 'Off' },
      { id: 'light', label: 'Light (1 retry, 2.5 s)' },
      { id: 'normal', label: 'Normal (2 retries: 3 s + 8 s)' },
      { id: 'persistent', label: 'Persistent (3 retries: 5 s + 15 s + 45 s)' }
    ]
  }
  return [
    { id: 'off', label: 'Выключено' },
    { id: 'light', label: 'Лёгкий (1 повтор, 2.5 с)' },
    { id: 'normal', label: 'Обычный (2 повтора: 3 с + 8 с)' },
    { id: 'persistent', label: 'Устойчивый (3 повтора: 5 с + 15 с + 45 с)' }
  ]
}
