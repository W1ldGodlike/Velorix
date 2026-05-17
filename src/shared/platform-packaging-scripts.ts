/**
 * §19 — npm-скрипты упаковки по платформам (Support ZIP / guard-тесты).
 */

export const BUILD_MAC_NPM_SCRIPT = 'build:mac'
export const BUILD_LINUX_NPM_SCRIPT = 'build:linux'
export const BUILD_WIN_NPM_SCRIPT = 'build:win'

/** Подсказки без запуска electron-builder. */
export function formatPlatformPackagingDiagnosticLines(): string[] {
  return [
    `windows: npm run check:release | check:release:local | release:win* (engines:prepare:win + doctor)`,
    `mac: npm run ${BUILD_MAC_NPM_SCRIPT} (electron-builder --mac; dmg; engines/bin вручную)`,
    `linux: npm run ${BUILD_LINUX_NPM_SCRIPT} (AppImage + deb; engines/bin вручную)`,
    'engines: авто-загрузка prepare — Windows x64; macOS/Linux: положить ffmpeg/ffprobe/yt-dlp в bin/ + engines:doctor',
    'smoke skips: FLUXALLOY_SKIP_PACK_VERIFY, FLUXALLOY_SKIP_FFPROBE_SMOKE, FLUXALLOY_SKIP_FFMPEG_SMOKE, FLUXALLOY_SKIP_YTDLP_SMOKE',
    'config: electron-builder.yml targets win (nsis/portable/zip), mac (dmg), linux (AppImage, deb)'
  ]
}
