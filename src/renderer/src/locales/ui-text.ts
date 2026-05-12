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
    versionsAriaLabel: 'Версии среды',
    knowledgeTitle: 'База знаний',
    knowledgeHint:
      'Локальные статьи из Help/*.md. Тексты пока на русском; интерфейс окна следует языку системы (EN/RU). Внешние https-ссылки открываются в браузере; ссылки на другие .md — внутри приложения.',
    knowledgeSearchPlaceholder: 'Поиск по статьям',
    knowledgeSearchTooltip:
      'Фильтр списка статей по заголовку, имени файла или slug (без учёта регистра).',
    knowledgeCloseTooltip: 'Закрыть окно справки (Esc или клик по фону).',
    knowledgeTopbarTooltip: 'Открыть локальную базу знаний (статьи из Help/*.md).',
    knowledgeTocAria: 'Оглавление справки',
    knowledgeArticleTerminalHintsLink: 'База знаний: подсказки терминала (ffmpeg / yt-dlp)',
    terminalKnowledgeDeepLinkTooltip:
      'Открыть статью с подсказками ffmpeg / yt-dlp для вкладки «Терминал».',
    knowledgeMdInternalLinkTooltip: 'Открыть связанную статью в этом окне.',
    knowledgeMdExternalLinkTooltip: 'Открыть ссылку в браузере (новая вкладка).',
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
    versionsAriaLabel: 'Runtime versions',
    knowledgeTitle: 'Knowledge base',
    knowledgeHint:
      'Local Help/*.md articles. Article text is RU-first; this dialog chrome follows your UI locale (EN/RU). External https links open in the browser; links to other .md files stay inside the app.',
    knowledgeSearchPlaceholder: 'Search articles',
    knowledgeSearchTooltip:
      'Filter the article list by title, file name, or slug (case-insensitive).',
    knowledgeCloseTooltip: 'Close help (Esc or click the backdrop).',
    knowledgeTopbarTooltip: 'Open the local knowledge base (Help/*.md articles).',
    knowledgeTocAria: 'Help table of contents',
    knowledgeArticleTerminalHintsLink: 'Knowledge: terminal hints (ffmpeg / yt-dlp)',
    terminalKnowledgeDeepLinkTooltip:
      'Open the ffmpeg / yt-dlp hints article for the Terminal tab.',
    knowledgeMdInternalLinkTooltip: 'Open the linked article here.',
    knowledgeMdExternalLinkTooltip: 'Open link in the browser (new tab).',
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
