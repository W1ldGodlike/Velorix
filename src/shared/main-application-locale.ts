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
  filterExecutables: string
  ipcInvalidRequest: string
  ipcNoActiveWindow: string
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
  supportZipSaveTitle: 'Собрать Support ZIP',
  supportZipFailTitle: 'Не удалось собрать Support ZIP',
  supportZipFailMessage: 'Не удалось собрать диагностический архив.',
  processErrorTitle: 'Ошибка FluxAlloy',
  processErrorMessage: 'В приложении произошла ошибка.',
  processErrorCopyDetails: 'Копировать детали',
  processErrorOpenLog: 'Открыть лог',
  processErrorSupportZip: 'Собрать Support ZIP',
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
  menuSupportZip: 'Собрать Support ZIP…',
  menuView: 'Вид',
  menuTheme: 'Тема',
  menuThemeSystem: 'Как в системе',
  menuThemeDark: 'Тёмная',
  menuThemeLight: 'Светлая',
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
  previewWebmNotCreated: 'WebM preview не был создан.',
  previewFfmpegMissingForWebm:
    'Файл не поддерживается встроенным предпросмотром, а ffmpeg для WebM preview не найден.',
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
  filterExecutables: 'Исполняемые файлы',
  ipcInvalidRequest: 'Некорректный запрос',
  ipcNoActiveWindow: 'Нет активного окна'
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
  filterExecutables: 'Executables',
  ipcInvalidRequest: 'Invalid request',
  ipcNoActiveWindow: 'No active window'
}

export function getMainApplicationStrings(locale: DownloadsWindowUiLocale): MainApplicationStrings {
  return locale === 'en' ? EN : RU
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
