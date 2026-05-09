/**
 * Канон §3 ТЗ: yt-dlp — GitHub Releases, ffmpeg — сборки gyan.dev.
 *
 * Конкретные URL держим здесь централизованно; версии можно зафиксировать через
 * непустые SHA256 в `Data/trusted_hashes.json` после проверки релизов.
 */
export const ENGINE_SOURCES_WINDOWS = {
  ytDlpExeUrl: 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe',

  /** Essentials: ffmpeg + ffprobe, меньше чем «full». */
  ffmpegEssentialsZipUrl: 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip'
} as const
