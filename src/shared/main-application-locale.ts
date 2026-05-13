import type { DownloadsWindowUiLocale } from './downloads-window-ui-locale'

export type MainApplicationStrings = {
  saveTextInvalidRequest: string
  saveFileDefaultTitle: string
  saveTextInvalidContent: string
  saveTextTooLarge: string
  exportOutputPathMissing: string
  exportOutputBadMode: string
  exportOutputNotGranted: string
  exportOutputFileNotFound: string
  exportOutputNotAFile: string
  exportOutputStatFailed: string
  mainLogPathUnavailable: string
  mainLogNotCreatedYet: string
  supportZipSaveTitle: string
  supportZipFailTitle: string
  supportZipFailMessage: string
  processErrorTitle: string
  processErrorMessage: string
  processErrorCopyDetails: string
  processErrorOpenLog: string
  processErrorSupportZip: string
  processErrorClose: string
  processErrorMetaType: string
  processErrorMetaTime: string
  processErrorMetaVersion: string
  processErrorMetaPlatform: string
  menuFile: string
  menuOpen: string
  menuDownloadsManager: string
  menuPasteUrlDownloads: string
  menuSettings: string
  menuEnginePaths: string
  menuTools: string
  menuInspector: string
  menuOpenFolder: string
  menuOpenMainLog: string
  menuOpenSessionLog: string
  menuSupportZip: string
  menuView: string
  menuTheme: string
  menuThemeSystem: string
  menuThemeDark: string
  menuThemeLight: string
  menuInterfaceLanguage: string
  menuUiLangRussian: string
  menuUiLangEnglish: string
  menuHelp: string
  menuAbout: string
  menuDocumentation: string
  quitConfirmBoth: string
  quitConfirmExport: string
  quitConfirmDownloads: string
  quitStay: string
  quitAbort: string
  quitDialogTitle: string
  previewWebmNotCreated: string
  previewFfmpegMissingForWebm: string
  previewCannotOpenInPreview: string
  previewCannotOpenSourceInEditor: string
  previewMainWindowMissing: string
  openVideoNoWindow: string
  previewGrantEmptyPath: string
  previewGrantOpenFailed: string
  previewGrantSourceFailed: string
  mediaProbePathMissing: string
  mediaProbeNotGranted: string
  saveDialogFilterJson: string
  saveDialogFilterHtml: string
  saveDialogFilterText: string
  saveDialogFilterAll: string
  saveDialogWriteFailed: string
  diagnosticsUnknownFolder: string
  processingHistoryBadRequest: string
  processingHistoryIdMissing: string
  processingHistoryBadAction: string
  processingHistoryNoOutput: string
  processingHistoryEntryNotFound: string
  exportAlreadyRunning: string
  exportInvalidRequest: string
  exportInputMissing: string
  exportFileNotFound: string
  exportNotGrantedPath: string
  exportFfmpegMissing: string
  exportTwoPassRequiresBitrate: string
  exportTwoPassLibx264Only: string
  exportFfmpegExitedWithCode: string
  exportLibx264SecondPassProgress: string
  ffprobeAudioChannelsSuffix: string
  exportNoActiveWindow: string
  exportVideoDialogTitle: string
  exportFilterMp4: string
  exportFilterMkv: string
  exportFilterMov: string
  exportFilterAll: string
  snapshotSaveDialogTitle: string
  snapshotFilterPng: string
  snapshotFilterJpeg: string
  exportCancelNoActive: string
  exportOpenBadRequest: string
  openVideoDialogNoWindow: string
  openVideoDialogTitle: string
  openVideoDialogFilterVideo: string
  previewDialogGrantMediaFailed: string
  engineDownloadHttpFailedTemplate: string
  engineDownloadEmptyResponse: string
  engineDownloadWindowsOnly: string
  engineDownloadYtDlpProgress: string
  engineDownloadFfmpegProgressTemplate: string
  engineDownloadFfmpegSourceFallbackTemplate: string
  engineDownloadFfmpegAllSourcesFailedTemplate: string
  engineDownloadExtractFfmpeg: string
  engineDownloadFfmpegZipMissingBinaries: string
  engineDownloadDone: string
  engineDownloadSha256MismatchTemplate: string
  engineStatusMissingTemplate: string
  engineStatusRunFailedGeneric: string
  filterExecutables: string
  ipcInvalidRequest: string
  ipcNoActiveWindow: string
  diagFolderUserData: string
  diagFolderResources: string
  diagFolderBundledBin: string
  diagFolderUserBin: string
  diagFolderLogs: string
  diagFolderYtdlpDownloads: string
  diagFolderSystemTemp: string
  diagnosticsMaintenanceNoTargets: string
  knowledgeHelpNotFound: string
  knowledgeInvalidArticle: string
  knowledgeArticleNotFound: string
  ffprobeNotFound: string
  ffprobeRunFailed: string
  ffprobeInvalidJson: string
  ytdlpEngineNotFound: string
  ytdlpInvalidFilenameTemplate: string
  terminalArgvTokenTooLong: string
  terminalAtFileDisallowed: string
  terminalDangerChars: string
  terminalCommandMustBeString: string
  terminalEnterCommand: string
  terminalCommandTooLong: string
  terminalQuotesDisallowed: string
  terminalTooManyArgs: string
  terminalAllowedToolsOnly: string
  terminalCurrentFileNeedsPreview: string
  terminalCurrentFileNotGranted: string
  terminalEngineMissingInSettings: string
  terminalBlockedLogToolLine: string
  terminalLogTruncatedOlder: string
}

const RU: MainApplicationStrings = {
  saveTextInvalidRequest: 'Некорректные данные запроса',
  saveFileDefaultTitle: 'Сохранить файл',
  saveTextInvalidContent: 'Некорректное содержимое файла',
  saveTextTooLarge: 'Слишком большой текст для сохранения',
  exportOutputPathMissing: 'Не указан файл экспорта',
  exportOutputBadMode: 'Некорректное действие',
  exportOutputNotGranted: 'Нет доступа к этому результату экспорта',
  exportOutputFileNotFound: 'Файл экспорта не найден',
  exportOutputNotAFile: 'Путь экспорта не является файлом',
  exportOutputStatFailed: 'Не удалось проверить файл экспорта',
  mainLogPathUnavailable: 'Путь к журналу недоступен',
  mainLogNotCreatedYet: 'Файл main.log ещё не создан',
  supportZipSaveTitle: 'Собрать архив поддержки (Support ZIP)',
  supportZipFailTitle: 'Не удалось собрать архив поддержки (Support ZIP)',
  supportZipFailMessage: 'Не удалось собрать диагностический архив.',
  processErrorTitle: 'Ошибка FluxAlloy',
  processErrorMessage: 'В приложении произошла ошибка.',
  processErrorCopyDetails: 'Копировать подробности',
  processErrorOpenLog: 'Открыть журнал',
  processErrorSupportZip: 'Собрать архив поддержки (Support ZIP)',
  processErrorClose: 'Закрыть',
  processErrorMetaType: 'Тип',
  processErrorMetaTime: 'Время',
  processErrorMetaVersion: 'Версия',
  processErrorMetaPlatform: 'Платформа',
  menuFile: 'Файл',
  menuOpen: 'Открыть…',
  menuDownloadsManager: 'Менеджер загрузок (yt-dlp)…',
  menuPasteUrlDownloads: 'Вставить URL из буфера в менеджер…',
  menuSettings: 'Настройки',
  menuEnginePaths: 'Пути к движкам…',
  menuTools: 'Инструменты',
  menuInspector: 'Инспектор медиа (ffprobe)…',
  menuOpenFolder: 'Открыть папку…',
  menuOpenMainLog: 'Открыть main.log',
  menuOpenSessionLog: 'Открыть session.log',
  menuSupportZip: 'Собрать архив поддержки…',
  menuView: 'Вид',
  menuTheme: 'Тема',
  menuThemeSystem: 'Как в системе',
  menuThemeDark: 'Тёмная',
  menuThemeLight: 'Светлая',
  menuInterfaceLanguage: 'Язык интерфейса',
  menuUiLangRussian: 'Русский',
  menuUiLangEnglish: 'English',
  menuHelp: 'Справка',
  menuAbout: 'О программе FluxAlloy…',
  menuDocumentation: 'Документация FluxAlloy (ТЗ)',
  quitConfirmBoth:
    'Идёт экспорт видео и активная загрузка yt-dlp. Закрыть приложение и прервать задачи?',
  quitConfirmExport: 'Идёт экспорт видео. Закрыть приложение и прервать экспорт?',
  quitConfirmDownloads: 'Идёт активная загрузка yt-dlp. Закрыть приложение и прервать загрузку?',
  quitStay: 'Остаться',
  quitAbort: 'Закрыть и прервать',
  quitDialogTitle: 'FluxAlloy',
  previewWebmNotCreated: 'Превью WebM не было создано.',
  previewFfmpegMissingForWebm:
    'Файл не поддерживается встроенным предпросмотром, а ffmpeg для превью WebM не найден.',
  previewCannotOpenInPreview: 'Нельзя открыть этот файл в предпросмотре.',
  previewCannotOpenSourceInEditor: 'Нельзя открыть исходный файл в редакторе.',
  previewMainWindowMissing: 'Главное окно FluxAlloy не найдено.',
  openVideoNoWindow: 'Нет активного окна',
  previewGrantEmptyPath: 'Пустой путь',
  previewGrantOpenFailed: 'Не удалось открыть файл',
  previewGrantSourceFailed: 'Не удалось открыть исходный файл',
  mediaProbePathMissing: 'Не указан путь к медиафайлу',
  mediaProbeNotGranted:
    'Нет доступа к этому пути для анализа (сначала откройте файл в превью).',
  saveDialogFilterJson: 'JSON',
  saveDialogFilterHtml: 'HTML',
  saveDialogFilterText: 'Текстовые файлы',
  saveDialogFilterAll: 'Все файлы',
  saveDialogWriteFailed: 'Не удалось записать файл',
  diagnosticsUnknownFolder: 'Неизвестный каталог',
  processingHistoryBadRequest: 'Некорректный запрос',
  processingHistoryIdMissing: 'Не указана запись истории',
  processingHistoryBadAction: 'Некорректное действие',
  processingHistoryNoOutput: 'У записи нет файла результата',
  processingHistoryEntryNotFound: 'Запись истории не найдена',
  exportAlreadyRunning: 'Уже выполняется экспорт',
  exportInvalidRequest: 'Некорректный запрос',
  exportInputMissing: 'Не указан входной файл',
  exportFileNotFound: 'Файл не найден',
  exportNotGrantedPath: 'Нет доступа к файлу — откройте его через превью.',
  exportFfmpegMissing: 'ffmpeg не найден — установите движки.',
  exportTwoPassRequiresBitrate:
    'Двухпроходное кодирование доступно только с выбранным видеобитрейтом, не с CRF.',
  exportTwoPassLibx264Only:
    'Двухпроходное кодирование поддержано только для H.264 (libx264).',
  exportFfmpegExitedWithCode: 'ffmpeg завершился с кодом {code}',
  exportLibx264SecondPassProgress: 'Второй проход libx264…',
  ffprobeAudioChannelsSuffix: '{n} кан.',
  exportNoActiveWindow: 'Нет активного окна',
  exportVideoDialogTitle: 'Экспорт видео',
  exportFilterMp4: 'MP4',
  exportFilterMkv: 'Matroska',
  exportFilterMov: 'QuickTime',
  exportFilterAll: 'Все файлы',
  snapshotSaveDialogTitle: 'Сохранить кадр',
  snapshotFilterPng: 'PNG',
  snapshotFilterJpeg: 'JPEG',
  exportCancelNoActive: 'Нет активного экспорта',
  exportOpenBadRequest: 'Некорректный запрос',
  openVideoDialogNoWindow: 'Нет активного окна',
  openVideoDialogTitle: 'Открыть видео',
  openVideoDialogFilterVideo: 'Видео',
  previewDialogGrantMediaFailed:
    'Не удалось открыть файл (нет доступа или это не обычный файл)',
  engineDownloadHttpFailedTemplate: 'Загрузка не удалась: HTTP {status} {statusText}',
  engineDownloadEmptyResponse: 'Пустой ответ сервера',
  engineDownloadWindowsOnly:
    'Автозагрузка движков пока реализована только для Windows (см. ТЗ §3)',
  engineDownloadYtDlpProgress: 'Скачивание yt-dlp (GitHub)…',
  engineDownloadFfmpegProgressTemplate: 'Скачивание FFmpeg ({label})…',
  engineDownloadFfmpegSourceFallbackTemplate:
    'Источник FFmpeg {label} не сработал, пробую резервный…',
  engineDownloadFfmpegAllSourcesFailedTemplate:
    'Не удалось скачать FFmpeg ни из одного источника: {detail}',
  engineDownloadExtractFfmpeg: 'Распаковка FFmpeg…',
  engineDownloadFfmpegZipMissingBinaries: 'В архиве FFmpeg не найдены ffmpeg.exe / ffprobe.exe',
  engineDownloadDone: 'Загрузка движков завершена',
  engineDownloadSha256MismatchTemplate: 'SHA256 не совпал для {path}',
  engineStatusMissingTemplate: 'Не найден {exe} (ручной путь / встроенный каталог / userData/bin)',
  engineStatusRunFailedGeneric: 'Не удалось запустить движок',
  filterExecutables: 'Исполняемые файлы',
  ipcInvalidRequest: 'Некорректный запрос',
  ipcNoActiveWindow: 'Нет активного окна',
  diagFolderUserData: 'Папка настроек (userData)',
  diagFolderResources: 'Папка ресурсов приложения',
  diagFolderBundledBin: 'Папка bin в поставке',
  diagFolderUserBin: 'Папка bin в userData',
  diagFolderLogs: 'Папка журналов',
  diagFolderYtdlpDownloads: 'Каталог загрузок yt-dlp',
  diagFolderSystemTemp: 'Системная временная папка',
  diagnosticsMaintenanceNoTargets: 'Не выбраны категории обслуживания',
  knowledgeHelpNotFound: 'Каталог справки Help не найден',
  knowledgeInvalidArticle: 'Некорректная статья справки',
  knowledgeArticleNotFound: 'Статья справки не найдена',
  ffprobeNotFound: 'ffprobe не найден — установите движки через «Скачать движки».',
  ffprobeRunFailed: 'Ошибка ffprobe',
  ffprobeInvalidJson: 'Некорректный JSON ffprobe',
  ytdlpEngineNotFound: 'yt-dlp не найден — скачайте движки из главного окна',
  ytdlpInvalidFilenameTemplate:
    'Некорректный шаблон имени файла (-o): проверьте %(ext)s, отсутствие «..» и выход за каталог загрузки.',
  terminalArgvTokenTooLong: 'Один из токенов argv слишком длинный.',
  terminalAtFileDisallowed: 'Аргументы вида @файл запрещены.',
  terminalDangerChars:
    'Запрещены символы оболочки (shell): ; | & ` $ < >, а также управляющие символы.',
  terminalCommandMustBeString: 'Команда должна быть строкой.',
  terminalEnterCommand: 'Введите команду.',
  terminalCommandTooLong: 'Команда длиннее {max} символов.',
  terminalQuotesDisallowed:
    'Кавычки и строки оболочки (shell) не поддерживаются: вводите токены argv через пробел.',
  terminalTooManyArgs: 'Слишком много аргументов (макс. {max}).',
  terminalAllowedToolsOnly: 'Разрешены только префиксы ffmpeg, ffprobe и yt-dlp.',
  terminalCurrentFileNeedsPreview: 'Токен __CURRENT_FILE__ требует открытый файл в превью редактора.',
  terminalCurrentFileNotGranted:
    'Текущий файл превью не разрешён для подстановки в команду (откройте через диалог или перетаскивание).',
  terminalEngineMissingInSettings: 'Движок {tool} не найден в настройках или в каталоге bin.',
  terminalBlockedLogToolLine: '{tool} …',
  terminalLogTruncatedOlder: '[FluxAlloy] усечены старые записи журнала terminal-cli.log\n\n'
}

const EN: MainApplicationStrings = {
  saveTextInvalidRequest: 'Invalid request data',
  saveFileDefaultTitle: 'Save file',
  saveTextInvalidContent: 'Invalid file content',
  saveTextTooLarge: 'Text is too large to save',
  exportOutputPathMissing: 'Export file path is not set',
  exportOutputBadMode: 'Invalid action',
  exportOutputNotGranted: 'No access to this export result',
  exportOutputFileNotFound: 'Export file not found',
  exportOutputNotAFile: 'Export path is not a file',
  exportOutputStatFailed: 'Could not verify export file',
  mainLogPathUnavailable: 'Log path is unavailable',
  mainLogNotCreatedYet: 'main.log has not been created yet',
  supportZipSaveTitle: 'Create Support ZIP',
  supportZipFailTitle: 'Could not create Support ZIP',
  supportZipFailMessage: 'Could not create the diagnostic archive.',
  processErrorTitle: 'FluxAlloy error',
  processErrorMessage: 'An error occurred in the application.',
  processErrorCopyDetails: 'Copy details',
  processErrorOpenLog: 'Open log',
  processErrorSupportZip: 'Create Support ZIP',
  processErrorClose: 'Close',
  processErrorMetaType: 'Type',
  processErrorMetaTime: 'Time',
  processErrorMetaVersion: 'Version',
  processErrorMetaPlatform: 'Platform',
  menuFile: 'File',
  menuOpen: 'Open…',
  menuDownloadsManager: 'Download manager (yt-dlp)…',
  menuPasteUrlDownloads: 'Paste URL from clipboard into manager…',
  menuSettings: 'Settings',
  menuEnginePaths: 'Engine paths…',
  menuTools: 'Tools',
  menuInspector: 'Media inspector (ffprobe)…',
  menuOpenFolder: 'Open folder…',
  menuOpenMainLog: 'Open main.log',
  menuOpenSessionLog: 'Open session.log',
  menuSupportZip: 'Create Support ZIP…',
  menuView: 'View',
  menuTheme: 'Theme',
  menuThemeSystem: 'Match system',
  menuThemeDark: 'Dark',
  menuThemeLight: 'Light',
  menuInterfaceLanguage: 'Interface language',
  menuUiLangRussian: 'Russian',
  menuUiLangEnglish: 'English',
  menuHelp: 'Help',
  menuAbout: 'About FluxAlloy…',
  menuDocumentation: 'FluxAlloy documentation (spec)',
  quitConfirmBoth:
    'Video export and an active yt-dlp download are running. Quit and cancel these tasks?',
  quitConfirmExport: 'Video export is running. Quit and cancel export?',
  quitConfirmDownloads: 'An active yt-dlp download is running. Quit and cancel the download?',
  quitStay: 'Stay',
  quitAbort: 'Quit and cancel',
  quitDialogTitle: 'FluxAlloy',
  previewWebmNotCreated: 'WebM preview was not created.',
  previewFfmpegMissingForWebm:
    'This file is not supported by the built-in preview, and ffmpeg was not found for WebM preview.',
  previewCannotOpenInPreview: 'Cannot open this file in preview.',
  previewCannotOpenSourceInEditor: 'Cannot open the source file in the editor.',
  previewMainWindowMissing: 'FluxAlloy main window was not found.',
  openVideoNoWindow: 'No active window',
  previewGrantEmptyPath: 'Empty path',
  previewGrantOpenFailed: 'Could not open file',
  previewGrantSourceFailed: 'Could not open source file',
  mediaProbePathMissing: 'Media file path is not set',
  mediaProbeNotGranted: 'No access to this path for analysis (open the file in preview first).',
  saveDialogFilterJson: 'JSON',
  saveDialogFilterHtml: 'HTML',
  saveDialogFilterText: 'Text files',
  saveDialogFilterAll: 'All files',
  saveDialogWriteFailed: 'Could not write file',
  diagnosticsUnknownFolder: 'Unknown folder',
  processingHistoryBadRequest: 'Invalid request',
  processingHistoryIdMissing: 'History entry is not specified',
  processingHistoryBadAction: 'Invalid action',
  processingHistoryNoOutput: 'This entry has no output file',
  processingHistoryEntryNotFound: 'History entry not found',
  exportAlreadyRunning: 'Export is already running',
  exportInvalidRequest: 'Invalid request',
  exportInputMissing: 'Input file is not specified',
  exportFileNotFound: 'File not found',
  exportNotGrantedPath: 'No access to this file — open it via preview first.',
  exportFfmpegMissing: 'ffmpeg not found — install engines.',
  exportTwoPassRequiresBitrate:
    'Two-pass encoding is only available with a video bitrate, not with CRF.',
  exportTwoPassLibx264Only: 'Two-pass encoding is only supported for H.264 (libx264).',
  exportFfmpegExitedWithCode: 'ffmpeg exited with code {code}',
  exportLibx264SecondPassProgress: 'libx264 second pass…',
  ffprobeAudioChannelsSuffix: '{n} ch.',
  exportNoActiveWindow: 'No active window',
  exportVideoDialogTitle: 'Export video',
  exportFilterMp4: 'MP4',
  exportFilterMkv: 'Matroska',
  exportFilterMov: 'QuickTime',
  exportFilterAll: 'All files',
  snapshotSaveDialogTitle: 'Save frame',
  snapshotFilterPng: 'PNG',
  snapshotFilterJpeg: 'JPEG',
  exportCancelNoActive: 'No active export',
  exportOpenBadRequest: 'Invalid request',
  openVideoDialogNoWindow: 'No active window',
  openVideoDialogTitle: 'Open video',
  openVideoDialogFilterVideo: 'Video',
  previewDialogGrantMediaFailed:
    'Could not open the file (no access or it is not a regular file)',
  engineDownloadHttpFailedTemplate: 'Download failed: HTTP {status} {statusText}',
  engineDownloadEmptyResponse: 'Empty server response',
  engineDownloadWindowsOnly:
    'Automatic engine download is only implemented on Windows for now (see spec §3)',
  engineDownloadYtDlpProgress: 'Downloading yt-dlp (GitHub)…',
  engineDownloadFfmpegProgressTemplate: 'Downloading FFmpeg ({label})…',
  engineDownloadFfmpegSourceFallbackTemplate:
    'FFmpeg source {label} failed, trying fallback…',
  engineDownloadFfmpegAllSourcesFailedTemplate:
    'Could not download FFmpeg from any source: {detail}',
  engineDownloadExtractFfmpeg: 'Extracting FFmpeg…',
  engineDownloadFfmpegZipMissingBinaries: 'ffmpeg.exe / ffprobe.exe not found in the FFmpeg archive',
  engineDownloadDone: 'Engine download finished',
  engineDownloadSha256MismatchTemplate: 'SHA256 mismatch for {path}',
  engineStatusMissingTemplate: '{exe} not found (override/bundled/user bin)',
  engineStatusRunFailedGeneric: 'Could not run engine',
  filterExecutables: 'Executables',
  ipcInvalidRequest: 'Invalid request',
  ipcNoActiveWindow: 'No active window',
  diagFolderUserData: 'Settings folder (userData)',
  diagFolderResources: 'Application resources folder',
  diagFolderBundledBin: 'Bundled bin folder',
  diagFolderUserBin: 'UserData bin folder',
  diagFolderLogs: 'Logs folder',
  diagFolderYtdlpDownloads: 'yt-dlp downloads directory',
  diagFolderSystemTemp: 'System temporary folder',
  diagnosticsMaintenanceNoTargets: 'No maintenance categories selected',
  knowledgeHelpNotFound: 'Help folder not found',
  knowledgeInvalidArticle: 'Invalid help article',
  knowledgeArticleNotFound: 'Help article not found',
  ffprobeNotFound: 'ffprobe not found — install engines from the main window.',
  ffprobeRunFailed: 'ffprobe error',
  ffprobeInvalidJson: 'Invalid ffprobe JSON',
  ytdlpEngineNotFound: 'yt-dlp not found — download engines from the main window.',
  ytdlpInvalidFilenameTemplate:
    'Invalid output filename template (-o): ensure %(ext)s is present, no «..», and paths stay inside the download directory.',
  terminalArgvTokenTooLong: 'One of the argv tokens is too long.',
  terminalAtFileDisallowed: '@file-style arguments are not allowed.',
  terminalDangerChars: 'Shell metacharacters (; | & ` $ < >) and control characters are not allowed.',
  terminalCommandMustBeString: 'The command must be a string.',
  terminalEnterCommand: 'Enter a command.',
  terminalCommandTooLong: 'Command is longer than {max} characters.',
  terminalQuotesDisallowed:
    'Quotes and shell strings are not supported: enter argv tokens separated by spaces.',
  terminalTooManyArgs: 'Too many arguments (max {max}).',
  terminalAllowedToolsOnly: 'Only ffmpeg, ffprobe, and yt-dlp prefixes are allowed.',
  terminalCurrentFileNeedsPreview:
    'The __CURRENT_FILE__ token requires an open file in the editor preview.',
  terminalCurrentFileNotGranted:
    'The current preview file is not allowed for CLI substitution (open it via the dialog or drag-and-drop).',
  terminalEngineMissingInSettings: 'Engine {tool} was not found in settings/bin.',
  terminalBlockedLogToolLine: '{tool} …',
  terminalLogTruncatedOlder: '[FluxAlloy] truncated older terminal-cli.log entries\n\n'
}

export function getMainApplicationStrings(locale: DownloadsWindowUiLocale): MainApplicationStrings {
  return locale === 'en' ? EN : RU
}

export function formatTerminalEngineMissingInSettings(
  locale: DownloadsWindowUiLocale,
  tool: string
): string {
  return getMainApplicationStrings(locale).terminalEngineMissingInSettings.replace(/\{tool\}/g, tool)
}

export function formatPickEngineExecutableTitle(
  locale: DownloadsWindowUiLocale,
  engineId: string
): string {
  return locale === 'en' ? `Select executable: ${engineId}` : `Выберите исполняемый файл: ${engineId}`
}

export function formatMainProcessErrorClipboardHeader(
  locale: DownloadsWindowUiLocale,
  kind: 'uncaughtException' | 'unhandledRejection',
  appVersion: string,
  platform: string,
  arch: string
): { typeLine: string; timeLine: string; versionLine: string; platformLine: string } {
  const s = getMainApplicationStrings(locale)
  return {
    typeLine: `${s.processErrorMetaType}: ${kind}`,
    timeLine: `${s.processErrorMetaTime}: ${new Date().toISOString()}`,
    versionLine: `${s.processErrorMetaVersion}: ${appVersion}`,
    platformLine: `${s.processErrorMetaPlatform}: ${platform}/${arch}`
  }
}
