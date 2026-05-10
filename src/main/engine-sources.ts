/**
 * Канон §3 ТЗ: в релизе движки должны быть bundled в `resources/bin`.
 * Сетевые источники ниже — fallback/update, если bundled/user override недоступны
 * или пользователь явно обновляет движки из приложения.
 *
 * Конкретные URL держим здесь централизованно; версии можно зафиксировать через
 * непустые SHA256 в `Data/trusted_hashes.json` после проверки релизов.
 */
export const ENGINE_SOURCES_WINDOWS = {
  ytDlpExeUrl: 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe',

  /** Список источников FFmpeg: GitHub mirror первым, gyan.dev — резерв. */
  ffmpegZipSources: [
    {
      id: 'btbn-github',
      label: 'GitHub BtbN',
      url: 'https://github.com/BtbN/FFmpeg-Builds/releases/latest/download/ffmpeg-master-latest-win64-gpl.zip'
    },
    {
      id: 'gyan-dev',
      label: 'gyan.dev',
      url: 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip'
    }
  ]
} as const
