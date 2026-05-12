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
      'Локальные статьи из Help/*.md; при интерфейсе EN, если есть пара Help/en/*.md, подставляется английский текст (иначе RU). Внешние https-ссылки открываются в браузере; ссылки на другие .md — внутри приложения.',
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
    terminalWorkspaceAriaLabel: 'Терминал CLI',
    terminalTitle: 'Терминал',
    terminalIntroLead:
      'Разрешены только префиксы ffmpeg, ffprobe и yt-dlp. Команда разбирается как argv, запускается через main без shell, а PATH дополняется папкой выбранного движка. В argv можно токен ',
    terminalIntroTailTemplate:
      ' — подставится путь текущего превью редактора (только если файл уже открыт через диалог или DnD). В строке ввода — компактный IntelliSense: стрелки вверх/вниз, Home/End, PgUp/PgDn (шаг {pageStep}), Shift+Tab — предыдущая позиция в списке, Tab и Enter — подставить активную подсказку (до {maxInline} подсказок из той же базы, что и справа). Рядом есть полный выпадающий список (до {maxDd} пунктов по категориям инструментов): в поле фильтра списка — стрелки вверх/вниз, Home/End, PgUp/PgDn (шаг {pageStep}), Enter — вставить выделенную подсказку в argv, Escape — сбросить фильтр (или убрать фокус, если фильтр уже пуст). В журнале вывода каждая строка с кнопкой «Копир.» при наведении (копирует ровно эту строку). ',
    terminalCommandInputAriaLabel: 'Команда CLI',
    terminalCommandPlaceholder: 'ffprobe -version',
    terminalPreviewFileButton: 'Превью-файл',
    terminalPreviewFileTooltipOpen:
      'Вставить токен «{token}» (путь текущего превью)',
    terminalPreviewFileTooltipNeedFile: 'Сначала откройте файл в редакторе',
    terminalRunButton: 'Выполнить',
    terminalRunningButton: 'Выполняю…',
    terminalDropdownInsertLabel: 'Вставить подсказку из полного списка',
    terminalDropdownFilterAria: 'Фильтр полного списка подсказок терминала',
    terminalDropdownFilterPlaceholder: 'Поиск по токену, summary или fullLine',
    terminalDropdownListAria: 'Полный список CLI подсказок',
    terminalDropdownEmpty: 'Ничего не найдено по фильтру.',
    terminalInlineSuggestAria: 'Подсказки argv',
    terminalHistoryAria: 'История команд терминала',
    terminalHistoryEmpty: 'История этой сессии пока пуста.',
    terminalExitCodeMsTemplate: 'code {code} · {ms} ms',
    terminalBlocked: 'blocked',
    terminalCopyLineTitle: 'Копировать эту строку',
    terminalCopyLineAriaTemplate: 'Копировать строку {n}',
    terminalCopyLineButton: 'Копир.',
    terminalHintsPanelAria: 'Подсказки CLI',
    terminalHintsSearchLabel: 'Поиск подсказок',
    terminalHintsSearchPlaceholder: '--help, -i, crop'
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
      'Local Help/*.md articles. With EN UI chrome, matching Help/en/*.md replaces article body when present (otherwise RU). External https links open in the browser; links to other .md files stay inside the app.',
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
    terminalWorkspaceAriaLabel: 'Terminal CLI',
    terminalTitle: 'Terminal',
    terminalIntroLead:
      'Only the ffmpeg, ffprobe, and yt-dlp prefixes are allowed. The command is parsed as argv, runs in the main process without a shell, and PATH is extended with the selected engine folder. In argv you can use the placeholder ',
    terminalIntroTailTemplate:
      ' — it expands to the current editor preview path (only when a file is already open via the dialog or DnD). The input line has compact IntelliSense: Up/Down, Home/End, PgUp/PgDn (step {pageStep}), Shift+Tab moves the selection up in the list, Tab and Enter insert the active suggestion (up to {maxInline} suggestions from the same catalog as on the right). Next to it is a full dropdown list (up to {maxDd} items grouped by tool): in the list filter field — Up/Down, Home/End, PgUp/PgDn (step {pageStep}), Enter inserts the selected suggestion into argv, Escape clears the filter (or blurs the field when the filter is already empty). Each line in the output log has a “Copy” hover button (copies exactly that line). ',
    terminalCommandInputAriaLabel: 'CLI command',
    terminalCommandPlaceholder: 'ffprobe -version',
    terminalPreviewFileButton: 'Preview file',
    terminalPreviewFileTooltipOpen: 'Insert the “{token}” token (current preview path)',
    terminalPreviewFileTooltipNeedFile: 'Open a file in the editor first',
    terminalRunButton: 'Run',
    terminalRunningButton: 'Running…',
    terminalDropdownInsertLabel: 'Insert a hint from the full list',
    terminalDropdownFilterAria: 'Filter for the full terminal hint list',
    terminalDropdownFilterPlaceholder: 'Search by token, summary, or fullLine',
    terminalDropdownListAria: 'Full CLI hint list',
    terminalDropdownEmpty: 'No hints match the filter.',
    terminalInlineSuggestAria: 'Argv suggestions',
    terminalHistoryAria: 'Terminal command history',
    terminalHistoryEmpty: 'No commands in this session yet.',
    terminalExitCodeMsTemplate: 'code {code} · {ms} ms',
    terminalBlocked: 'blocked',
    terminalCopyLineTitle: 'Copy this line',
    terminalCopyLineAriaTemplate: 'Copy line {n}',
    terminalCopyLineButton: 'Copy',
    terminalHintsPanelAria: 'CLI hints',
    terminalHintsSearchLabel: 'Filter hints',
    terminalHintsSearchPlaceholder: '--help, -i, crop'
  }
} as const

type UiTextKey = keyof (typeof UI_TEXT)['ru']

export function getUiLocale(): UiLocale {
  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('en')) {
    return 'en'
  }
  return 'ru'
}

const activeUiLocale = getUiLocale()

export function uiText(key: UiTextKey): string {
  return UI_TEXT[activeUiLocale][key]
}

export type TerminalIntroTailVars = {
  pageStep: number
  maxInline: number
  maxDd: number
}

export function formatTerminalIntroTail(vars: TerminalIntroTailVars): string {
  return UI_TEXT[activeUiLocale].terminalIntroTailTemplate.replace(/\{pageStep\}/g, String(vars.pageStep))
    .replace(/\{maxInline\}/g, String(vars.maxInline))
    .replace(/\{maxDd\}/g, String(vars.maxDd))
}

export function formatTerminalPreviewTooltip(token: string): string {
  return UI_TEXT[activeUiLocale].terminalPreviewFileTooltipOpen.replace(/\{token\}/g, token)
}

export function formatTerminalExitLine(code: number | null | undefined, ms: number): string {
  const codeStr = code === null || code === undefined ? 'n/a' : String(code)
  return UI_TEXT[activeUiLocale].terminalExitCodeMsTemplate
    .replace(/\{code\}/g, codeStr)
    .replace(/\{ms\}/g, String(ms))
}

export function formatTerminalCopyLineAria(lineNumber1Based: number): string {
  return UI_TEXT[activeUiLocale].terminalCopyLineAriaTemplate.replace(
    /\{n\}/g,
    String(lineNumber1Based)
  )
}
