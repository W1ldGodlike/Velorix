/**
 * UI copy for the pop-out downloads manager (`buildDownloadsHtml` in main).
 * Kept main-safe (no renderer imports).
 */
export type DownloadsWindowUiLocale = 'ru' | 'en'

export function parseDownloadsWindowUiLocale(v: unknown): DownloadsWindowUiLocale | undefined {
  if (v === 'en' || v === 'ru') {
    return v
  }
  return undefined
}

/** Map Electron/Chromium `app.getLocale()` (or similar) to downloads UI locale. */
export function downloadsWindowUiLocaleFromSystemLocale(systemLocale: string): DownloadsWindowUiLocale {
  return systemLocale.toLowerCase().startsWith('en') ? 'en' : 'ru'
}

export type DownloadsTopbarClusterCopy = {
  toolbarAria: string
  inspector: string
  focusUrl: string
  mainEditor: string
  enginePaths: string
  about: string
}

/** All user-visible strings for the downloads pop-out HTML + embedded script. */
export type DownloadsWindowUiStrings = {
  htmlLang: string
  pageTitle: string
  windowTitle: string
  workspaceTabsAria: string
  editorTabDisabledTitle: string
  editorTabLabel: string
  downloadsTabLabel: string
  queueSectionAria: string
  urlsLabel: string
  urlsHint: string
  addToQueue: string
  startAllTitle: string
  startAll: string
  pauseToolbarTitleDefault: string
  pauseLabel: string
  cancelTitle: string
  cancel: string
  clearQueue: string
  clearFinished: string
  statusFilterLabel: string
  optQueueAll: string
  optQueueWaiting: string
  optQueueRunning: string
  optQueueDone: string
  optQueueError: string
  optQueueCancelled: string
  queueFilterHint: string
  queueToolbarHint: string
  queueSummaryInitial: string
  scrollToSettingsTitle: string
  scrollToSettings: string
  queueTableCaption: string
  thNum: string
  thTitle: string
  thFmt: string
  thSize: string
  thProg: string
  thSpd: string
  thEta: string
  thStatus: string
  thActions: string
  historySummary: string
  historySectionHint: string
  refreshHistory: string
  clearHistory: string
  historyOutcomeLabel: string
  histOptAll: string
  histOptSuccess: string
  histOptError: string
  histOptCancelled: string
  historyFilterHint: string
  historyTableCaption: string
  histThFinished: string
  histThName: string
  histThUrl: string
  histThOutcome: string
  histThCode: string
  histThStatus: string
  logSummary: string
  logSectionHint: string
  saveLog: string
  clearLogViewTitle: string
  clearLogView: string
  logPreAriaLabel: string
  railAria: string
  railTitle: string
  railSubtitle: string
  formatSummary: string
  formatSectionHint: string
  formatQualityLabel: string
  playlistAudioGroupAria: string
  wholePlaylistLabel: string
  wholePlaylistAria: string
  audioOnlyLabel: string
  audioOnlyAria: string
  subtitlesLabel: string
  subOptNone: string
  subOptManual: string
  subOptManualAuto: string
  subLangsLabel: string
  subLangsPlaceholder: string
  metadataSummary: string
  metadataSectionHint: string
  cookiesLabel: string
  cookiesNone: string
  cookiesChrome: string
  cookiesEdge: string
  cookiesFirefox: string
  cookiesProfileLabel: string
  cookiesProfilePlaceholder: string
  cookiesFileLabel: string
  pickEllipsis: string
  clearCookiesTitle: string
  clearCookies: string
  impersonateLabel: string
  impersonateOff: string
  openInHandlerPillLabel: string
  openInHandlerAria: string
  autoExportPillLabel: string
  autoExportAria: string
  savingSummary: string
  savingSectionHint: string
  outDirLabel: string
  openOutTitle: string
  openOut: string
  pickOut: string
  resetOutTitle: string
  resetOut: string
  tmplLabel: string
  applyOpts: string
  tmplReset: string
  networkSummary: string
  networkSectionHint: string
  rateLimitLabel: string
  rateLimitPlaceholder: string
  retriesLabel: string
  retriesPlaceholder: string
  fragmentRetriesLabel: string
  queueRetryLabel: string
  queueRetryOff: string
  queueRetryLight: string
  queueRetryNormal: string
  queueRetryPersistent: string
  expertSummary: string
  expertSectionHintBeforeLinks: string
  expertSectionHintAfterLinks: string
  docFormats: string
  docOutputTemplate: string
  docPostprocess: string
  extraArgsLabel: string
  extraArgsPlaceholder: string
  previewOutDirLabel: string
  previewOutDirPlaceholder: string
  argsPreviewLabel: string
  argsPreviewAria: string
  hintsPanelSummary: string
  hintInsertLabel: string
  hintInsertPlaceholder: string
  hintFilterLabel: string
  hintFilterPlaceholder: string
  hintFilterAria: string
  hintListAria: string
  footerNote: string
  topbarCluster: DownloadsTopbarClusterCopy
  /** Pill switch */
  pillOn: string
  pillOff: string
  hintCategoryFallback: string
  outcomeSuccess: string
  outcomeCancelled: string
  outcomeError: string
  historyEmpty: string
  historyNoMatchingFilter: string
  confirmClearHistory: string
  hintSelectEmpty: string
  hintSelectPlaceholder: string
  hintsCatalogUnavailable: string
  hintsCatalogUnavailableShort: string
  hintsNoMatches: string
  queueTotal: string
  queueWaiting: string
  queueRunning: string
  queueDone: string
  queueErrors: string
  queueCancelled: string
  queueEmpty: string
  queueNoMatchingFilter: string
  rowCancelYtdlp: string
  rowResumeYtdlp: string
  rowPauseYtdlp: string
  rowStartThisLine: string
  rowRetryDownload: string
  rowOpenInFlux: string
  rowOpenFile: string
  rowShowInFolder: string
  rowMoveUp: string
  rowMoveDown: string
  rowRemoveFromQueue: string
  histReenqueueUrl: string
  histOpenInFlux: string
  histOpenFile: string
  histShowInFolder: string
  pauseUnsupportedWinTitle: string
  pauseTitleSigstop: string
  resumeTitleSigcont: string
  /** Main toolbar pause button when a job is paused (SIGCONT). */
  pauseToolbarResume: string
  logEmptyAlert: string
  logLinesWord: string
}

const RU: DownloadsWindowUiStrings = {
  htmlLang: 'ru',
  pageTitle: 'FluxAlloy — менеджер загрузок',
  windowTitle: 'FluxAlloy — загрузки',
  workspaceTabsAria: 'Рабочие вкладки',
  editorTabDisabledTitle: 'Редактор находится в главном окне',
  editorTabLabel: 'Редактор',
  downloadsTabLabel: 'Загрузки',
  queueSectionAria: 'Очередь загрузок',
  urlsLabel: 'Введите URL (каждый с новой строки)',
  urlsHint:
    'Ссылки по строкам или перетаскивание текста/URL. Очередь последовательная §6. Если окно узкое (примерно до 960px), панель настроек yt-dlp переносится под очередь — в тулбаре есть «К настройкам».',
  addToQueue: 'Добавить в очередь',
  startAllTitle: 'Скачать все строки со статусом «Ожидание»',
  startAll: 'Начать загрузку',
  pauseToolbarTitleDefault: 'Приостановить загрузку (POSIX); на Windows недоступно',
  pauseLabel: 'Пауза',
  cancelTitle: 'Отменить текущую загрузку yt-dlp',
  cancel: 'Отмена',
  clearQueue: 'Очистить очередь',
  clearFinished: 'Убрать завершённые',
  statusFilterLabel: 'Статус',
  optQueueAll: 'Все',
  optQueueWaiting: 'Ожидание',
  optQueueRunning: 'В работе',
  optQueueDone: 'Готово',
  optQueueError: 'Ошибки',
  optQueueCancelled: 'Отмена',
  queueFilterHint:
    'Фильтр только для отображения таблицы; порядок очереди в основном процессе (main) не меняется.',
  queueToolbarHint:
    'Управление активной yt-dlp-задачей и содержимым очереди §6; пауза возможна только на платформах без ограничения yt-dlp.',
  queueSummaryInitial: 'Всего: 0',
  scrollToSettingsTitle: 'Прокрутить к панели настроек yt-dlp',
  scrollToSettings: 'К настройкам',
  queueTableCaption: 'Очередь загрузок yt-dlp',
  thNum: '#',
  thTitle: 'Название',
  thFmt: 'Формат',
  thSize: 'Размер',
  thProg: 'Прогресс',
  thSpd: 'Скорость',
  thEta: 'Осталось',
  thStatus: 'Статус',
  thActions: 'Действия',
  historySummary: 'История загрузок',
  historySectionHint:
    'Завершённые загрузки из userData §6; обновление и очистка трогают файл истории, фильтр «Исход» — только отображение таблицы.',
  refreshHistory: 'Обновить',
  clearHistory: 'Очистить историю',
  historyOutcomeLabel: 'Исход',
  histOptAll: 'Все',
  histOptSuccess: 'Успех',
  histOptError: 'Ошибка',
  histOptCancelled: 'Отмена',
  historyFilterHint: 'Фильтр только для отображения таблицы истории.',
  historyTableCaption: 'История завершённых загрузок',
  histThFinished: 'Завершено',
  histThName: 'Имя',
  histThUrl: 'Ссылка',
  histThOutcome: 'Исход',
  histThCode: 'Код',
  histThStatus: 'Статус',
  logSummary: 'Журнал операций',
  logSectionHint:
    'Потоковый вывод yt-dlp (stdout и stderr); «Очистить вид» убирает только текст в окне, «Сохранить журнал» — запись в файл по выбору.',
  saveLog: 'Сохранить журнал…',
  clearLogViewTitle: 'Очистить только текст на экране (файл не трогаем)',
  clearLogView: 'Очистить вид',
  logPreAriaLabel: 'Вывод yt-dlp: stdout и stderr',
  railAria: 'Настройки загрузки',
  railTitle: 'Настройки загрузки',
  railSubtitle:
    'Секции совпадают со встроенной вкладкой «Загрузки»: формат, метаданные, сохранение, сеть.',
  formatSummary: 'Формат',
  formatSectionHint:
    'Пресеты -f/-x, субтитры и сохранённые опции yt-dlp (userData/settings.json); шаблон -o ниже должен содержать %(ext)s.',
  formatQualityLabel: 'Формат / качество (-f)',
  playlistAudioGroupAria: 'Плейлист и аудио',
  wholePlaylistLabel: 'Весь плейлист',
  wholePlaylistAria: 'Весь плейлист',
  audioOnlyLabel: 'Только аудио',
  audioOnlyAria: 'Только аудио',
  subtitlesLabel: 'Субтитры §6.2',
  subOptNone: 'Не скачивать',
  subOptManual: 'Ручные дорожки (--write-subs)',
  subOptManualAuto: 'Ручные + автосгенерированные (--write-auto-subs)',
  subLangsLabel: 'Языки субтитров',
  subLangsPlaceholder: 'ru,en или all',
  metadataSummary: 'Метаданные',
  metadataSectionHint:
    'Cookies из браузера или файла Netscape, маскировка User-Agent §6; автозапуск в обработчик §6.4 и опционально ffmpeg-экспорт §7.2 в соседний файл.',
  cookiesLabel: 'Cookies §6.2',
  cookiesNone: 'Не использовать',
  cookiesChrome: 'Из браузера: Chrome',
  cookiesEdge: 'Из браузера: Edge',
  cookiesFirefox: 'Из браузера: Firefox',
  cookiesProfileLabel: 'Профиль / контейнер',
  cookiesProfilePlaceholder: 'имя профиля в Chrome, напр. Default или Profile 1',
  cookiesFileLabel: 'Файл cookies:',
  pickEllipsis: 'Выбрать…',
  clearCookiesTitle: 'Убрать файл из настроек',
  clearCookies: 'Очистить',
  impersonateLabel: 'Подмена клиента',
  impersonateOff: 'Выключено',
  openInHandlerPillLabel: 'Открывать результат в обработчике',
  openInHandlerAria: 'Открывать результат в обработчике после успеха',
  autoExportPillLabel: 'Затем авто-экспорт',
  autoExportAria: 'После авто-открытия запустить экспорт в файл рядом с загрузкой',
  savingSummary: 'Сохранение',
  savingSectionHint:
    'Целевой каталог yt-dlp, шаблон имени (-o); кнопка «Сохранить параметры» записывает настройки в userData/settings.json §6.',
  outDirLabel: 'Каталог загрузок:',
  openOutTitle: 'Открыть текущий каталог загрузок в проводнике',
  openOut: 'Открыть',
  pickOut: 'Выбрать…',
  resetOutTitle: 'Использовать каталог по умолчанию в userData',
  resetOut: 'По умолчанию',
  tmplLabel: 'Шаблон имени (-o)',
  applyOpts: 'Сохранить параметры',
  tmplReset: 'Шаблон по умолчанию',
  networkSummary: 'Сеть',
  networkSectionHint:
    'Ограничение скорости скачивания, параметры yt-dlp и профиль автоповтора строки очереди при ошибке §6.4.',
  rateLimitLabel: 'Ограничение скорости (--limit-rate)',
  rateLimitPlaceholder: '500K или 2M',
  retriesLabel: 'Повторы при ошибках (--retries)',
  retriesPlaceholder: '0–99',
  fragmentRetriesLabel: 'Повторы фрагментов (--fragment-retries)',
  queueRetryLabel: 'Повтор строки при сбое',
  queueRetryOff: 'Выключено',
  queueRetryLight: 'Лёгкий (1 повтор, 2.5 с)',
  queueRetryNormal: 'Обычный (2 повтора: 3 с + 8 с)',
  queueRetryPersistent: 'Устойчивый (3 повтора: 5 с + 15 с + 45 с)',
  expertSummary: 'Эксперт и превью',
  expertSectionHintBeforeLinks:
    'Белый список аргументов §6.3: правки здесь добавляются к финальной командной строке yt-dlp; ниже живое превью аргументов (argv). То же поле — во вкладке «Загрузки» главного окна. Онлайн:',
  expertSectionHintAfterLinks: '.',
  docFormats: 'форматы',
  docOutputTemplate: 'шаблон вывода',
  docPostprocess: 'постобработка',
  extraArgsLabel: 'Дополнительные аргументы (без оболочки)',
  extraArgsPlaceholder: 'Например: --write-sub --sub-lang ru',
  previewOutDirLabel: 'Другой каталог для превью пути шаблона -o',
  previewOutDirPlaceholder: 'Только путь в строке для превью аргументов (argv)',
  argsPreviewLabel: 'Превью аргументов (argv)',
  argsPreviewAria: 'Превью аргументов командной строки yt-dlp (argv)',
  hintsPanelSummary: 'Справочник флагов',
  hintInsertLabel: 'Вставить флаг из справочника',
  hintInsertPlaceholder: 'Выберите флаг — он добавится в «Дополнительные аргументы»…',
  hintFilterLabel: 'Поиск по токенам и описаниям',
  hintFilterPlaceholder: 'Например: --cookies или --sub',
  hintFilterAria: 'Поиск по токенам и описаниям справочника аргументов (argv)',
  hintListAria: 'Справочник флагов с описаниями',
  footerNote:
    'Отдельный preload IPC только для этого окна. yt-dlp запускается из main через spawn без оболочки.',
  topbarCluster: {
    toolbarAria: 'Действия',
    inspector: 'Инспектор ffprobe §9',
    focusUrl: 'К полю URL (лента ввода §6)',
    mainEditor: 'Главное окно (редактор)',
    enginePaths: 'Пути к движкам ffmpeg / yt-dlp / ffprobe',
    about: 'О программе'
  },
  pillOn: 'Вкл',
  pillOff: 'Выкл',
  hintCategoryFallback: 'Прочее',
  outcomeSuccess: 'Успех',
  outcomeCancelled: 'Отмена',
  outcomeError: 'Ошибка',
  historyEmpty: 'Записей пока нет',
  historyNoMatchingFilter: 'Нет записей с таким исходом',
  confirmClearHistory: 'Удалить все записи истории загрузок?',
  hintSelectEmpty: 'Справочник недоступен',
  hintSelectPlaceholder: 'Выберите флаг — добавить в поле…',
  hintsCatalogUnavailable: 'Справочник недоступен.',
  hintsCatalogUnavailableShort: 'Справочник недоступен',
  hintsNoMatches: 'Нет совпадений.',
  queueTotal: 'Всего:',
  queueWaiting: 'ждёт:',
  queueRunning: 'в работе:',
  queueDone: 'готово:',
  queueErrors: 'ошибок:',
  queueCancelled: 'отменено:',
  queueEmpty: 'Очередь пуста',
  queueNoMatchingFilter: 'Нет строк с таким статусом',
  rowCancelYtdlp: 'Отменить текущую загрузку yt-dlp (эта строка)',
  rowResumeYtdlp: 'Продолжить загрузку (SIGCONT)',
  rowPauseYtdlp: 'Приостановить загрузку (SIGSTOP)',
  rowStartThisLine: 'Скачать только эту строку',
  rowRetryDownload: 'Сбросить статус и скачать эту строку заново',
  rowOpenInFlux: 'Открыть скачанный файл в FluxAlloy',
  rowOpenFile: 'Открыть скачанный файл',
  rowShowInFolder: 'Показать файл в папке',
  rowMoveUp: 'Переместить строку вверх в очереди',
  rowMoveDown: 'Переместить строку вниз в очереди',
  rowRemoveFromQueue: 'Удалить строку из очереди',
  histReenqueueUrl: 'Добавить этот URL в очередь повторно',
  histOpenInFlux: 'Открыть скачанный файл в FluxAlloy',
  histOpenFile: 'Открыть скачанный файл',
  histShowInFolder: 'Показать файл в папке',
  pauseUnsupportedWinTitle: 'Пауза процесса yt-dlp недоступна в Windows (нужны SIGSTOP/SIGCONT).',
  pauseTitleSigstop: 'Приостановить текущую загрузку yt-dlp (SIGSTOP)',
  resumeTitleSigcont: 'Возобновить загрузку yt-dlp (SIGCONT)',
  pauseToolbarResume: 'Продолжить',
  logEmptyAlert: 'Журнал пуст — пока нечего сохранять.',
  logLinesWord: 'стр.',
}

const EN: DownloadsWindowUiStrings = {
  htmlLang: 'en',
  pageTitle: 'FluxAlloy — download manager',
  windowTitle: 'FluxAlloy — downloads',
  workspaceTabsAria: 'Workspace tabs',
  editorTabDisabledTitle: 'The editor lives in the main window',
  editorTabLabel: 'Editor',
  downloadsTabLabel: 'Downloads',
  queueSectionAria: 'Download queue',
  urlsLabel: 'Enter URLs (one per line)',
  urlsHint:
    'One URL per line or drop text/URLs. The queue runs sequentially. If the window is narrow (about up to 960px), yt-dlp settings move below the queue — use “To settings” in the toolbar.',
  addToQueue: 'Add to queue',
  startAllTitle: 'Download all rows waiting in the queue',
  startAll: 'Start download',
  pauseToolbarTitleDefault: 'Pause download (POSIX); not available on Windows',
  pauseLabel: 'Pause',
  cancelTitle: 'Cancel the current yt-dlp download',
  cancel: 'Cancel',
  clearQueue: 'Clear queue',
  clearFinished: 'Remove finished',
  statusFilterLabel: 'Status',
  optQueueAll: 'All',
  optQueueWaiting: 'Waiting',
  optQueueRunning: 'Running',
  optQueueDone: 'Done',
  optQueueError: 'Errors',
  optQueueCancelled: 'Cancelled',
  queueFilterHint: 'Display-only filter; queue order in main is unchanged.',
  queueToolbarHint:
    'Controls the active yt-dlp job and queue contents; pause works only where SIGSTOP/SIGCONT are supported.',
  queueSummaryInitial: 'Total: 0',
  scrollToSettingsTitle: 'Scroll to yt-dlp settings',
  scrollToSettings: 'To settings',
  queueTableCaption: 'yt-dlp download queue',
  thNum: '#',
  thTitle: 'Title',
  thFmt: 'Format',
  thSize: 'Size',
  thProg: 'Progress',
  thSpd: 'Speed',
  thEta: 'ETA',
  thStatus: 'Status',
  thActions: 'Actions',
  historySummary: 'Download history',
  historySectionHint:
    'Finished downloads from userData; refresh/clear touch the history file. The outcome filter is display-only.',
  refreshHistory: 'Refresh',
  clearHistory: 'Clear history',
  historyOutcomeLabel: 'Outcome',
  histOptAll: 'All',
  histOptSuccess: 'Success',
  histOptError: 'Error',
  histOptCancelled: 'Cancelled',
  historyFilterHint: 'Display-only filter for the history table.',
  historyTableCaption: 'Finished download history',
  histThFinished: 'Finished',
  histThName: 'Name',
  histThUrl: 'URL',
  histThOutcome: 'Outcome',
  histThCode: 'Code',
  histThStatus: 'Status',
  logSummary: 'Operation log',
  logSectionHint:
    'Streaming stdout/stderr from yt-dlp. “Clear view” only clears on-screen text; “Save log…” writes to a file you pick.',
  saveLog: 'Save log…',
  clearLogViewTitle: 'Clear on-screen text only (does not delete files)',
  clearLogView: 'Clear view',
  logPreAriaLabel: 'yt-dlp stdout and stderr',
  railAria: 'Download settings',
  railTitle: 'Download settings',
  railSubtitle: 'Sections mirror the in-app tab: format, metadata, saving, network.',
  formatSummary: 'Format',
  formatSectionHint:
    'Presets for -f/-x, subtitles, and saved yt-dlp options (userData/settings.json). The -o template below must include %(ext)s.',
  formatQualityLabel: 'Format / quality (-f)',
  playlistAudioGroupAria: 'Playlist and audio',
  wholePlaylistLabel: 'Full playlist',
  wholePlaylistAria: 'Full playlist',
  audioOnlyLabel: 'Audio only',
  audioOnlyAria: 'Audio only',
  subtitlesLabel: 'Subtitles',
  subOptNone: 'Do not download',
  subOptManual: 'Manual tracks (--write-subs)',
  subOptManualAuto: 'Manual + auto-generated (--write-auto-subs)',
  subLangsLabel: 'Subtitle languages',
  subLangsPlaceholder: 'ru,en or all',
  metadataSummary: 'Metadata',
  metadataSectionHint:
    'Browser or Netscape cookies file, client impersonation; optional open-in-handler after success and ffmpeg export beside the download.',
  cookiesLabel: 'Cookies',
  cookiesNone: 'Do not use',
  cookiesChrome: 'From browser: Chrome',
  cookiesEdge: 'From browser: Edge',
  cookiesFirefox: 'From browser: Firefox',
  cookiesProfileLabel: 'Profile / container',
  cookiesProfilePlaceholder: 'e.g. Default or Profile 1',
  cookiesFileLabel: 'Cookies file:',
  pickEllipsis: 'Choose…',
  clearCookiesTitle: 'Remove file from settings',
  clearCookies: 'Clear',
  impersonateLabel: 'Client impersonation',
  impersonateOff: 'Off',
  openInHandlerPillLabel: 'Open result in handler',
  openInHandlerAria: 'Open downloaded file in handler after success',
  autoExportPillLabel: 'Then auto-export',
  autoExportAria: 'After auto-open, run export to a file next to the download',
  savingSummary: 'Saving',
  savingSectionHint:
    'yt-dlp output directory and filename template (-o). “Save settings” writes to userData/settings.json.',
  outDirLabel: 'Download folder:',
  openOutTitle: 'Open the current download folder in the file manager',
  openOut: 'Open',
  pickOut: 'Choose…',
  resetOutTitle: 'Use the default folder under userData',
  resetOut: 'Default',
  tmplLabel: 'Filename template (-o)',
  applyOpts: 'Save settings',
  tmplReset: 'Reset template',
  networkSummary: 'Network',
  networkSectionHint:
    'Rate limit, yt-dlp retry options, and automatic row retry profile after failures.',
  rateLimitLabel: 'Rate limit (--limit-rate)',
  rateLimitPlaceholder: '500K or 2M',
  retriesLabel: 'Retries on errors (--retries)',
  retriesPlaceholder: '0–99',
  fragmentRetriesLabel: 'Fragment retries (--fragment-retries)',
  queueRetryLabel: 'Row retry on failure',
  queueRetryOff: 'Off',
  queueRetryLight: 'Light (1 retry, 2.5 s)',
  queueRetryNormal: 'Normal (2 retries: 3 s + 8 s)',
  queueRetryPersistent: 'Persistent (3 retries: 5 s + 15 s + 45 s)',
  expertSummary: 'Expert argv',
  expertSectionHintBeforeLinks:
    'Allow-listed arguments: edits here are appended to the final yt-dlp argv; live preview below. Same argv field as the Downloads tab in the main window. Online:',
  expertSectionHintAfterLinks: '.',
  docFormats: 'formats',
  docOutputTemplate: 'output template',
  docPostprocess: 'post-processing',
  extraArgsLabel: 'Extra arguments (no shell)',
  extraArgsPlaceholder: 'e.g. --write-sub --sub-lang ru',
  previewOutDirLabel: 'Different folder for -o preview',
  previewOutDirPlaceholder: 'Preview argv path string only',
  argsPreviewLabel: 'Argv preview',
  argsPreviewAria: 'yt-dlp argv preview',
  hintsPanelSummary: 'Flag reference',
  hintInsertLabel: 'Insert flag from reference',
  hintInsertPlaceholder: 'Pick a flag — it will be appended to “Extra arguments”…',
  hintFilterLabel: 'Search tokens and descriptions',
  hintFilterPlaceholder: 'e.g. --cookies or --sub',
  hintFilterAria: 'Search the argv reference by token or description',
  hintListAria: 'Flag reference with descriptions',
  footerNote:
    'Dedicated preload IPC for this window only. yt-dlp is spawned from main without a shell.',
  topbarCluster: {
    toolbarAria: 'Actions',
    inspector: 'ffprobe inspector',
    focusUrl: 'Focus URL field (input strip)',
    mainEditor: 'Main editor window',
    enginePaths: 'Paths to ffmpeg / yt-dlp / ffprobe',
    about: 'About'
  },
  pillOn: 'On',
  pillOff: 'Off',
  hintCategoryFallback: 'Other',
  outcomeSuccess: 'Success',
  outcomeCancelled: 'Cancelled',
  outcomeError: 'Error',
  historyEmpty: 'No entries yet',
  historyNoMatchingFilter: 'No entries for this outcome',
  confirmClearHistory: 'Delete all download history entries?',
  hintSelectEmpty: 'Reference unavailable',
  hintSelectPlaceholder: 'Pick a flag — append to field…',
  hintsCatalogUnavailable: 'Reference unavailable.',
  hintsCatalogUnavailableShort: 'Reference unavailable',
  hintsNoMatches: 'No matches.',
  queueTotal: 'Total:',
  queueWaiting: 'waiting:',
  queueRunning: 'running:',
  queueDone: 'done:',
  queueErrors: 'errors:',
  queueCancelled: 'cancelled:',
  queueEmpty: 'Queue is empty',
  queueNoMatchingFilter: 'No rows for this status',
  rowCancelYtdlp: 'Cancel current yt-dlp download (this row)',
  rowResumeYtdlp: 'Resume download (SIGCONT)',
  rowPauseYtdlp: 'Pause download (SIGSTOP)',
  rowStartThisLine: 'Download this row only',
  rowRetryDownload: 'Reset status and download this row again',
  rowOpenInFlux: 'Open downloaded file in FluxAlloy',
  rowOpenFile: 'Open downloaded file',
  rowShowInFolder: 'Show file in folder',
  rowMoveUp: 'Move row up in queue',
  rowMoveDown: 'Move row down in queue',
  rowRemoveFromQueue: 'Remove row from queue',
  histReenqueueUrl: 'Enqueue this URL again',
  histOpenInFlux: 'Open downloaded file in FluxAlloy',
  histOpenFile: 'Open downloaded file',
  histShowInFolder: 'Show file in folder',
  pauseUnsupportedWinTitle: 'Pausing yt-dlp is not available on Windows (SIGSTOP/SIGCONT required).',
  pauseTitleSigstop: 'Pause current yt-dlp download (SIGSTOP)',
  resumeTitleSigcont: 'Resume yt-dlp download (SIGCONT)',
  pauseToolbarResume: 'Resume',
  logEmptyAlert: 'Log is empty — nothing to save yet.',
  logLinesWord: 'lines'
}

export function getDownloadsWindowUiStrings(locale: DownloadsWindowUiLocale): DownloadsWindowUiStrings {
  return locale === 'en' ? EN : RU
}

/** JSON-serialized into the pop-out document as `DL_I18N` for the embedded script. */
export function buildDownloadsWindowScriptI18nJson(locale: DownloadsWindowUiLocale): string {
  const s = getDownloadsWindowUiStrings(locale)
  return JSON.stringify({
    pillOn: s.pillOn,
    pillOff: s.pillOff,
    hintCategoryFallback: s.hintCategoryFallback,
    outcomeSuccess: s.outcomeSuccess,
    outcomeCancelled: s.outcomeCancelled,
    outcomeError: s.outcomeError,
    historyEmpty: s.historyEmpty,
    historyNoMatchingFilter: s.historyNoMatchingFilter,
    confirmClearHistory: s.confirmClearHistory,
    hintSelectEmpty: s.hintSelectEmpty,
    hintSelectPlaceholder: s.hintSelectPlaceholder,
    hintsCatalogUnavailable: s.hintsCatalogUnavailable,
    hintsCatalogUnavailableShort: s.hintsCatalogUnavailableShort,
    hintsNoMatches: s.hintsNoMatches,
    queueTotal: s.queueTotal,
    queueWaiting: s.queueWaiting,
    queueRunning: s.queueRunning,
    queueDone: s.queueDone,
    queueErrors: s.queueErrors,
    queueCancelled: s.queueCancelled,
    queueEmpty: s.queueEmpty,
    queueNoMatchingFilter: s.queueNoMatchingFilter,
    rowCancelYtdlp: s.rowCancelYtdlp,
    rowResumeYtdlp: s.rowResumeYtdlp,
    rowPauseYtdlp: s.rowPauseYtdlp,
    rowStartThisLine: s.rowStartThisLine,
    rowRetryDownload: s.rowRetryDownload,
    rowOpenInFlux: s.rowOpenInFlux,
    rowOpenFile: s.rowOpenFile,
    rowShowInFolder: s.rowShowInFolder,
    rowMoveUp: s.rowMoveUp,
    rowMoveDown: s.rowMoveDown,
    rowRemoveFromQueue: s.rowRemoveFromQueue,
    histReenqueueUrl: s.histReenqueueUrl,
    histOpenInFlux: s.histOpenInFlux,
    histOpenFile: s.histOpenFile,
    histShowInFolder: s.histShowInFolder,
    pauseUnsupportedWinTitle: s.pauseUnsupportedWinTitle,
    pauseTitleSigstop: s.pauseTitleSigstop,
    resumeTitleSigcont: s.resumeTitleSigcont,
    pauseToolbarResume: s.pauseToolbarResume,
    toolbarPause: s.pauseLabel,
    logEmptyAlert: s.logEmptyAlert,
    logLinesWord: s.logLinesWord
  })
}
