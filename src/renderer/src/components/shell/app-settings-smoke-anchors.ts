/** Якоря секций настроек (прокрутка внутри модалки). */
export const APP_SETTINGS_THEME_ANCHOR = 'app-settings-general-theme'
export const APP_SETTINGS_HIDPI_ANCHOR = 'app-settings-general-hidpi'
export const APP_SETTINGS_WIN_SHELL_ANCHOR = 'app-settings-general-win-shell'

export function scrollToSettingsAnchor(anchorId: string): void {
  document.getElementById(anchorId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
