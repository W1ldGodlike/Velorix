import type { AppUiLocale } from './app-ui-locale'
import { mergeBuiltinFfmpegExportUserPresetsFromFile } from './builtin-ffmpeg-export-user-presets'
import type { AppSettings } from './settings-contract'

/** §2.2 — при смене `uiLocale` подменяем встроенные пресеты экспорта на подписи нового языка. */
export function patchAppSettingsUiLocale(settings: AppSettings, locale: AppUiLocale): AppSettings {
  return {
    ...settings,
    uiLocale: locale,
    ffmpegExportUserPresets: mergeBuiltinFfmpegExportUserPresetsFromFile(
      settings.ffmpegExportUserPresets ?? [],
      locale
    )
  }
}
