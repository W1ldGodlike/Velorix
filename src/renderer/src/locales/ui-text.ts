type UiLocale = 'ru' | 'en'

const UI_TEXT = {
  ru: {
    aboutTitle: 'О программе',
    appLabel: 'Приложение',
    versionLabel: 'Версия',
    loading: 'Загрузка…',
    logsFolderButton: 'Папка логов',
    supportZipSaved: 'Support ZIP сохранён',
    supportZipButton: 'Support ZIP…',
    formatSelectionDoc: 'Выбор формата',
    closeButton: 'Закрыть',
    versionsAriaLabel: 'Версии среды'
  },
  en: {
    aboutTitle: 'About',
    appLabel: 'Application',
    versionLabel: 'Version',
    loading: 'Loading…',
    logsFolderButton: 'Logs folder',
    supportZipSaved: 'Support ZIP saved',
    supportZipButton: 'Support ZIP…',
    formatSelectionDoc: 'Format selection',
    closeButton: 'Close',
    versionsAriaLabel: 'Runtime versions'
  }
} as const

type UiTextKey = keyof (typeof UI_TEXT)['ru']

function resolveUiLocale(): UiLocale {
  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('en')) {
    return 'en'
  }
  return 'ru'
}

const activeUiLocale = resolveUiLocale()

export function uiText(key: UiTextKey): string {
  return UI_TEXT[activeUiLocale][key]
}
