import type {
  FfmpegExportUserPreset,
  FfmpegExportUserPresetSnapshot
} from './ffmpeg-export-contract'
import { FFMPEG_EXPORT_USER_PRESETS_MAX_ENTRIES } from './ffmpeg-export-contract'

const BUILTIN_PREFIX = 'velorix-builtin-'

/** Встроенные пресеты экспорта (§7.2): id с префиксом `velorix-builtin-` резервируются под код приложения. */
export function isBuiltinExportUserPresetId(id: string): boolean {
  return id.startsWith(BUILTIN_PREFIX)
}

/**
 * §7.2 — при загрузке настроек: актуальные встроенные из кода + только пользовательские строки из JSON
 * (любые `velorix-builtin-*` из файла игнорируются, в т.ч. устаревшие share-mp4 / compact-mp4 / quality-mkv).
 */
export function mergeBuiltinFfmpegExportUserPresetsFromFile(
  fromFile: FfmpegExportUserPreset[],
  locale: 'ru' | 'en'
): FfmpegExportUserPreset[] {
  const builtins = getBuiltinFfmpegExportUserPresets(locale)
  const extras = fromFile.filter((p) => !isBuiltinExportUserPresetId(p.id))
  return [...builtins, ...extras].slice(0, FFMPEG_EXPORT_USER_PRESETS_MAX_ENTRIES)
}

function S(
  over: Partial<FfmpegExportUserPresetSnapshot> &
    Pick<FfmpegExportUserPresetSnapshot, 'encodePreset' | 'container'>
): FfmpegExportUserPresetSnapshot {
  return {
    crf: null,
    videoBitrate: null,
    audioMode: 'aac',
    audioBitrate: '192k',
    fps: null,
    scalePreset: 'source',
    videoTransform: 'none',
    cropPreset: 'none',
    ...over
  }
}

/**
 * §7.2 / VELORIX_TZ.md §7.2 — встроенные пресеты платформ (TikTok, YouTube, …).
 * Значения — типичный H.264+AAC и масштаб под загрузку; вертикаль 9:16 задаётся отдельно в монтаже.
 */
export function getBuiltinFfmpegExportUserPresets(locale: 'ru' | 'en'): FfmpegExportUserPreset[] {
  const en = locale === 'en'
  const L = (ru: string, e: string): string => (en ? e : ru)
  const H = (ru: string, e: string): string => (en ? e : ru)

  return [
    {
      id: `${BUILTIN_PREFIX}tiktok`,
      label: L('TikTok', 'TikTok'),
      hint: H(
        'H.264 + AAC, MP4, до 1080p и 30 к/с — типичные требования загрузки. Вертикаль 9:16 — кадрированием до экспорта.',
        'H.264 + AAC in MP4, up to 1080p and 30 fps — common upload defaults. Use 9:16 framing before export.'
      ),
      snapshot: S({ encodePreset: 'balance', container: 'mp4', scalePreset: '1080p', fps: 30 })
    },
    {
      id: `${BUILTIN_PREFIX}youtube`,
      label: L('YouTube', 'YouTube'),
      hint: H(
        'Длинные ролики: H.264 + AAC, MP4, 1080p при необходимости уменьшить исходник.',
        'Long-form: H.264 + AAC, MP4, 1080p when downscaling from higher sources.'
      ),
      snapshot: S({ encodePreset: 'balance', container: 'mp4', scalePreset: '1080p' })
    },
    {
      id: `${BUILTIN_PREFIX}youtube-shorts`,
      label: L('YouTube Shorts', 'YouTube Shorts'),
      hint: H(
        'Короткие вертикальные ролики: 1080p и 30 к/с; соотношение 9:16 — в кадре до кодирования.',
        'Short vertical clips: 1080p and 30 fps; 9:16 is handled in the frame before encode.'
      ),
      snapshot: S({ encodePreset: 'balance', container: 'mp4', scalePreset: '1080p', fps: 30 })
    },
    {
      id: `${BUILTIN_PREFIX}vk-video`,
      label: L('ВК Видео', 'VK Video'),
      hint: H(
        'Универсальная загрузка ВК: H.264 + AAC, MP4, 1080p.',
        'VK long video: H.264 + AAC, MP4, 1080p.'
      ),
      snapshot: S({ encodePreset: 'balance', container: 'mp4', scalePreset: '1080p' })
    },
    {
      id: `${BUILTIN_PREFIX}vk-story`,
      label: L('ВК История', 'VK Stories'),
      hint: H(
        'Истории: чуть компактнее файл — 720p, пресет «меньше размер», AAC 128k.',
        'Stories: smaller files — 720p, smaller encode preset, AAC 128k.'
      ),
      snapshot: S({
        encodePreset: 'smaller',
        container: 'mp4',
        scalePreset: '720p',
        fps: 30,
        audioBitrate: '128k'
      })
    },
    {
      id: `${BUILTIN_PREFIX}instagram-reels`,
      label: L('Instagram Reels', 'Instagram Reels'),
      hint: H(
        'Reels: H.264 + AAC, MP4, 1080p и 30 к/с; кадр 9:16 — отдельным шагом.',
        'Reels: H.264 + AAC, MP4, 1080p and 30 fps; 9:16 framing is a separate step.'
      ),
      snapshot: S({ encodePreset: 'balance', container: 'mp4', scalePreset: '1080p', fps: 30 })
    },
    {
      id: `${BUILTIN_PREFIX}telegram-channel`,
      label: L('Telegram канал', 'Telegram channel'),
      hint: H(
        'Канал: совместимый MP4, 1080p, стандартный баланс качества и размера.',
        'Channels: compatible MP4, 1080p, balanced quality/size.'
      ),
      snapshot: S({ encodePreset: 'balance', container: 'mp4', scalePreset: '1080p' })
    },
    {
      id: `${BUILTIN_PREFIX}telegram-compress`,
      label: L('Сжатие для Telegram', 'Compress for Telegram'),
      hint: H(
        'Чаты и лимиты размера: 720p, пресет «меньше размер», AAC 128k.',
        'Chats and size limits: 720p, smaller encode preset, AAC 128k.'
      ),
      snapshot: S({
        encodePreset: 'smaller',
        container: 'mp4',
        scalePreset: '720p',
        audioBitrate: '128k'
      })
    },
    {
      id: `${BUILTIN_PREFIX}discord-compress`,
      label: L('Сжатие для Discord', 'Compress for Discord'),
      hint: H(
        'Лимиты вложений: 720p, более сильное сжатие видео, AAC 128k.',
        'Attachment limits: 720p, stronger video compression, AAC 128k.'
      ),
      snapshot: S({
        encodePreset: 'smaller',
        container: 'mp4',
        scalePreset: '720p',
        audioBitrate: '128k'
      })
    },
    {
      id: `${BUILTIN_PREFIX}iphone`,
      label: L('Экспорт в iPhone', 'Export for iPhone'),
      hint: H(
        'Контейнер MOV, H.264 + AAC, 1080p; аудио 256k для запаса по качеству на устройстве.',
        'MOV container, H.264 + AAC, 1080p; 256k AAC for headroom on device playback.'
      ),
      snapshot: S({
        encodePreset: 'balance',
        container: 'mov',
        scalePreset: '1080p',
        audioBitrate: '256k'
      })
    },
    {
      id: `${BUILTIN_PREFIX}archive`,
      label: L('Архивное сжатие', 'Archive encode'),
      hint: H(
        'Максимум качества в пределах приложения: MKV, пресет «выше качество», исходный размер кадра, AAC 320k.',
        'Best quality within app defaults: MKV, quality preset, source resolution, AAC 320k.'
      ),
      snapshot: S({
        encodePreset: 'quality',
        container: 'mkv',
        scalePreset: 'source',
        audioBitrate: '320k'
      })
    }
  ]
}
