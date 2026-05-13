import type { DownloadsWindowUiLocale } from './downloads-window-ui-locale'

/** User-visible IPC / dialog strings for downloads (main process). */
export type DownloadsWindowIpcStrings = {
  fileOutsideDownloadDir: string
  handlerNotConnected: string
  invalidSender: string
  invalidUrlText: string
  ytdlpOptionsNotConnected: string
  invalidData: string
  filenameTemplateMustBeString: string
  playlistMustBeBoolean: string
  audioOnlyMustBeBoolean: string
  subLangsMustBeString: string
  cookiesBrowserMustBeString: string
  invalidCookiesBrowserValue: string
  cookiesBrowserProfileMustBeString: string
  impersonateMustBeString: string
  invalidImpersonateValue: string
  rateLimitMustBeString: string
  retriesMustBeString: string
  fragmentRetriesMustBeString: string
  extraArgsMustBeString: string
  openInHandlerFlagMustBeBoolean: string
  autoExportFlagMustBeBoolean: string
  nothingToSave: string
  pickDirectoryNotConnected: string
  noWindow: string
  clearDirectoryNotConnected: string
  pickCookiesNotConnected: string
  clearCookiesNotConnected: string
  logEmpty: string
  saveLogDialogTitle: string
  saveLogFilterLog: string
  saveLogFilterText: string
  badOpenFileRequest: string
  queueRowNoOutputPath: string
  badOpenHistoryRequest: string
  historyEntryNoOutputPath: string
  invalidRowId: string
  invalidHistoryId: string
  invalidMoveDirection: string
  cannotMoveRowThatWay: string
  rowNotFound: string
  cannotRetryWhileRunning: string
  failedToResetRow: string
  mergeUiPanelsNotConnected: string
  mainWindowNotFound: string
  /** Queue runner */
  downloadAlreadyRunning: string
  /** Редактор: быстрый yt-dlp «скачать и открыть» */
  downloadOpenEditorNotReady: string
  noWaitingRowsInQueue: string
  startRowOnlyWaiting: string
  /** Pause / resume (yt-dlp child) */
  pauseOsUnsupported: string
  noActiveYtdlpDownload: string
  ytdlpAlreadyPaused: string
  ytdlpNotPaused: string
  /** Log line prefixes (optional EN for log stream) */
  logYtdlpPausedSigstop: string
  logYtdlpResumedSigcont: string
}

const RU: DownloadsWindowIpcStrings = {
  fileOutsideDownloadDir: 'Файл не найден или находится вне каталога загрузок.',
  handlerNotConnected: 'Обработчик FluxAlloy не подключён.',
  invalidSender: 'Недопустимый отправитель',
  invalidUrlText: 'Некорректный текст URL',
  ytdlpOptionsNotConnected: 'Опции yt-dlp не подключены',
  invalidData: 'Некорректные данные',
  filenameTemplateMustBeString: 'Шаблон имени должен быть строкой',
  playlistMustBeBoolean: 'Поле плейлиста должно быть логическим значением (boolean).',
  audioOnlyMustBeBoolean: 'Поле «только аудио» должно быть логическим значением (boolean).',
  subLangsMustBeString: 'Языки субтитров должны быть строкой',
  cookiesBrowserMustBeString: 'Поле cookies браузера должно быть строкой',
  invalidCookiesBrowserValue: 'Недопустимое значение браузера для cookies',
  cookiesBrowserProfileMustBeString: 'Профиль cookies браузера должен быть строкой',
  impersonateMustBeString: 'Поле подмены клиента (impersonate) должно быть строкой',
  invalidImpersonateValue: 'Недопустимое значение подмены клиента (impersonate)',
  rateLimitMustBeString: 'Ограничение скорости должно быть строкой',
  retriesMustBeString: 'Количество повторов должно быть строкой',
  fragmentRetriesMustBeString: 'Количество повторов фрагментов должно быть строкой',
  extraArgsMustBeString: 'Доп. аргументы должны быть строкой',
  openInHandlerFlagMustBeBoolean:
    'Флаг авто-открытия в обработчике должен быть логическим значением (boolean).',
  autoExportFlagMustBeBoolean:
    'Флаг авто-экспорта после открытия должен быть логическим значением (boolean).',
  nothingToSave: 'Нечего сохранять',
  pickDirectoryNotConnected: 'Выбор каталога не подключён',
  noWindow: 'Нет окна',
  clearDirectoryNotConnected: 'Сброс каталога не подключён',
  pickCookiesNotConnected: 'Выбор файла cookies не подключён',
  clearCookiesNotConnected: 'Сброс cookies-файла не подключён',
  logEmpty: 'Журнал пуст',
  saveLogDialogTitle: 'Сохранить журнал yt-dlp',
  saveLogFilterLog: 'Журнал',
  saveLogFilterText: 'Текст',
  badOpenFileRequest: 'Некорректный запрос открытия файла',
  queueRowNoOutputPath: 'У этой строки нет сохранённого пути к файлу.',
  badOpenHistoryRequest: 'Некорректный запрос открытия файла',
  historyEntryNoOutputPath: 'У этой записи истории нет сохранённого пути к файлу.',
  invalidRowId: 'Некорректный идентификатор строки',
  invalidHistoryId: 'Некорректный идентификатор истории',
  invalidMoveDirection: 'Некорректное направление перемещения',
  cannotMoveRowThatWay: 'Строку нельзя переместить в этом направлении',
  rowNotFound: 'Строка не найдена',
  cannotRetryWhileRunning: 'Нельзя повторить строку, пока она выполняется.',
  failedToResetRow: 'Не удалось сбросить строку',
  mergeUiPanelsNotConnected: 'Сохранение раскладки панелей не подключено.',
  mainWindowNotFound: 'Главное окно редактора не найдено.',
  downloadAlreadyRunning:
    'Уже выполняется загрузка. Отмените текущую или дождитесь окончания.',
  downloadOpenEditorNotReady:
    'Загрузка не завершилась успешно — файл в редактор не открыт. Текущий статус строки:',
  noWaitingRowsInQueue: 'В очереди нет строк со статусом «Ожидание».',
  startRowOnlyWaiting: 'Старт доступен только для строк со статусом «Ожидание».',
  pauseOsUnsupported:
    'Пауза процесса yt-dlp на этой ОС не поддерживается (нужны SIGSTOP/SIGCONT).',
  noActiveYtdlpDownload: 'Нет активной загрузки yt-dlp.',
  ytdlpAlreadyPaused: 'Загрузка уже приостановлена.',
  ytdlpNotPaused: 'Загрузка не на паузе.',
  logYtdlpPausedSigstop: '[FluxAlloy] Процесс yt-dlp приостановлен (SIGSTOP).',
  logYtdlpResumedSigcont: '[FluxAlloy] Процесс yt-dlp возобновлён (SIGCONT).'
}

const EN: DownloadsWindowIpcStrings = {
  fileOutsideDownloadDir: 'File not found or outside the download directory.',
  handlerNotConnected: 'FluxAlloy handler is not connected.',
  invalidSender: 'Invalid sender',
  invalidUrlText: 'Invalid URL text',
  ytdlpOptionsNotConnected: 'yt-dlp options are not connected',
  invalidData: 'Invalid data',
  filenameTemplateMustBeString: 'Filename template must be a string',
  playlistMustBeBoolean: 'Playlist field must be a boolean',
  audioOnlyMustBeBoolean: 'Audio-only field must be a boolean',
  subLangsMustBeString: 'Subtitle languages must be a string',
  cookiesBrowserMustBeString: 'Cookies browser field must be a string',
  invalidCookiesBrowserValue: 'Invalid browser value for cookies',
  cookiesBrowserProfileMustBeString: 'Cookies browser profile must be a string',
  impersonateMustBeString: 'Impersonate field must be a string',
  invalidImpersonateValue: 'Invalid impersonate value',
  rateLimitMustBeString: 'Rate limit must be a string',
  retriesMustBeString: 'Retries must be a string',
  fragmentRetriesMustBeString: 'Fragment retries must be a string',
  extraArgsMustBeString: 'Extra arguments must be a string',
  openInHandlerFlagMustBeBoolean: 'Open-in-handler flag must be a boolean',
  autoExportFlagMustBeBoolean: 'Auto-export-after-open flag must be a boolean',
  nothingToSave: 'Nothing to save',
  pickDirectoryNotConnected: 'Directory picker is not connected',
  noWindow: 'No window',
  clearDirectoryNotConnected: 'Directory reset is not connected',
  pickCookiesNotConnected: 'Cookies file picker is not connected',
  clearCookiesNotConnected: 'Cookies file reset is not connected',
  logEmpty: 'Log is empty',
  saveLogDialogTitle: 'Save yt-dlp log',
  saveLogFilterLog: 'Log',
  saveLogFilterText: 'Text',
  badOpenFileRequest: 'Invalid open-file request',
  queueRowNoOutputPath: 'This queue row has no saved output path.',
  badOpenHistoryRequest: 'Invalid history open request',
  historyEntryNoOutputPath: 'This history entry has no saved output path.',
  invalidRowId: 'Invalid row id',
  invalidHistoryId: 'Invalid history id',
  invalidMoveDirection: 'Invalid move direction',
  cannotMoveRowThatWay: 'Cannot move the row in that direction',
  rowNotFound: 'Row not found',
  cannotRetryWhileRunning: 'Cannot retry a row while it is running.',
  failedToResetRow: 'Failed to reset the row',
  mergeUiPanelsNotConnected: 'Panel layout persistence is not connected.',
  mainWindowNotFound: 'Main editor window not found.',
  downloadAlreadyRunning:
    'A download is already running. Cancel it or wait until it finishes.',
  downloadOpenEditorNotReady:
    'Download did not finish successfully — the file was not opened in the editor. Row status:',
  noWaitingRowsInQueue: 'There are no rows waiting in the queue.',
  startRowOnlyWaiting: 'Start is only available for rows in the waiting state.',
  pauseOsUnsupported:
    'Pausing yt-dlp is not supported on this OS (SIGSTOP/SIGCONT required).',
  noActiveYtdlpDownload: 'No active yt-dlp download.',
  ytdlpAlreadyPaused: 'Download is already paused.',
  ytdlpNotPaused: 'Download is not paused.',
  logYtdlpPausedSigstop: '[FluxAlloy] yt-dlp process paused (SIGSTOP).',
  logYtdlpResumedSigcont: '[FluxAlloy] yt-dlp process resumed (SIGCONT).'
}

export function getDownloadsWindowIpcStrings(locale: DownloadsWindowUiLocale): DownloadsWindowIpcStrings {
  return locale === 'en' ? EN : RU
}
