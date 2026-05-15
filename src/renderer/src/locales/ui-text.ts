import type {
  ProcessingHistoryKind,
  ProcessingHistoryOutcome
} from '../../../shared/processing-history-contract'
import {
  type DownloadsWindowUiLocale,
  parseDownloadsWindowUiLocale
} from '../../../shared/downloads-window-ui-locale'
import type { YtdlpDownloadHistoryOutcome } from '../../../shared/ytdlp-history-contract'
import {
  isYtdlpQueueStatusErrorLike,
  parseYtdlpQueueRetryPauseCounts,
  YTDLP_QUEUE_STATUS_CANCELLED,
  YTDLP_QUEUE_STATUS_DONE,
  YTDLP_QUEUE_STATUS_RUNNING,
  YTDLP_QUEUE_STATUS_WAITING,
  YTDLP_QUEUE_STATUS_RETRY_PAUSE_PREFIX
} from '../../../shared/ytdlp-queue-status'

type UiLocale = 'ru' | 'en'

/** Set from `settings.json` after preload `settings.get()`; until then — `navigator`. */
let uiLocaleOverride: UiLocale | undefined

function resolveUiLocaleFromNavigator(): UiLocale {
  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('en')) {
    return 'en'
  }
  return 'ru'
}

const UI_TEXT = {
  ru: {
    aboutTitle: 'О программе',
    appLabel: 'Приложение',
    versionLabel: 'Версия',
    loading: 'Загрузка…',
    rendererLogWindowErrorFallback: 'Неизвестная ошибка окна',
    rendererLogUnhandledRejectionFallback: 'Неизвестное отклонение промиса',
    logsFolderButton: 'Папка журналов',
    supportZipSaved: 'Архив поддержки (Support ZIP) сохранён',
    supportZipButton: 'Архив поддержки…',
    maintenanceSummaryButton: 'Размер временных',
    maintenanceCleanButton: 'Очистить временное',
    maintenanceCleanPreviewButton: 'Очистить кэш превью',
    maintenanceCleanPartialsButton: 'Очистить .part',
    maintenanceCleanFfmpegTempButton: 'Очистить временные ffmpeg',
    maintenanceConfirmButton: 'Подтвердить очистку',
    maintenanceConfirmHintTemplate:
      '{label}: удаляются только временные данные. Нажмите «Подтвердить очистку» ещё раз.',
    maintenanceCleanDoneTemplate: 'Очищено: {files} файлов, {bytes}',
    maintenanceSummaryTemplate: 'Временное: {bytes}',
    maintenanceSummaryWithDetailsTemplate: 'Временное: {bytes} ({details})',
    formatSelectionDoc: 'Выбор формата',
    docLinkYtDlpReadme: 'README yt-dlp',
    docLinkFfprobeShort: 'ffprobe',
    aboutRuntimeElectronLabel: 'Electron',
    aboutRuntimeChromiumLabel: 'Chromium',
    aboutRuntimeNodeLabel: 'Node',
    aboutMainLogButton: 'main.log',
    aboutMainLogOpenErrorTemplate: 'main.log: {error}',
    aboutTooltipLogsFolder:
      'Открыть папку журналов приложения в проводнике — там runtime-логи и трассировки.',
    aboutTooltipMainLog:
      'Открыть основной лог main-процесса в программе по умолчанию для текстовых файлов.',
    aboutTooltipSupportZip:
      'Собрать архив диагностики в выбранный файл: версии, настройки, пути. Удобно для поддержки или своего бэкапа.',
    aboutTooltipMaintenanceSummary:
      'Показать в строке состояния, сколько места занимают кэш превью, временные ffmpeg и незавершённые загрузки .part — без удаления.',
    aboutTooltipMaintenanceCleanAll:
      'Удалить все служебные временные данные приложения. Первый щелчок — подсказка, второй при «Подтвердить…» — реальная очистка.',
    aboutTooltipMaintenanceCleanPreview:
      'Очистить только кэш превью. Два шага: сначала подсказка, затем подтверждение.',
    aboutTooltipMaintenanceCleanPartials:
      'Удалить незавершённые yt-dlp .part / .ytdl в зоне загрузок. Два шага с подтверждением.',
    aboutTooltipMaintenanceCleanFfmpegTemp:
      'Очистить временные файлы ffmpeg после экспорта. Два шага с подтверждением.',
    aboutTooltipCloseAbout: 'Закрыть окно «О программе».',
    aboutKnowledgeSupportArticle: 'Справка: логи и диагностика',
    aboutKnowledgeSupportArticleTooltip:
      'Открыть статью справки про журналы, Support ZIP и очистку временных файлов.',
    aboutMaintenanceCleanErrorTemplate: '{label}: {error}',
    byteSizeZero: '0 Б',
    byteSizeUnitB: 'Б',
    byteSizeUnitKiB: 'КиБ',
    byteSizeUnitMiB: 'МиБ',
    byteSizeUnitGiB: 'ГиБ',
    maintenanceSnapshotLabelPreviewCache: 'кэш превью',
    maintenanceSnapshotLabelFfmpegTemp: 'временные ffmpeg',
    maintenanceSnapshotLabelYtdlpPartials: 'yt-dlp .part',
    closeButton: 'Закрыть',
    versionsAriaLabel: 'Версии среды',
    knowledgeTitle: 'База знаний',
    knowledgeHint:
      'Локальные статьи из Help/*.md; при интерфейсе EN, если есть пара Help/en/*.md, подставляется английский текст (иначе RU). Внешние https-ссылки открываются в браузере; ссылки на другие .md — внутри приложения.',
    knowledgeSearchPlaceholder: 'Поиск по статьям',
    knowledgeSearchTooltip:
      'Фильтр списка статей по заголовку, имени файла или короткому имени (slug) без учёта регистра.',
    knowledgeCloseTooltip: 'Закрыть окно справки (Esc или щелчок по фону).',
    knowledgeTopbarTooltip: 'Открыть локальную базу знаний (статьи из Help/*.md).',
    knowledgeTocAria: 'Оглавление справки',
    knowledgeArticleTerminalHintsLink: 'База знаний: подсказки терминала (ffmpeg / yt-dlp)',
    terminalKnowledgeDeepLinkTooltip:
      'Открыть статью с подсказками ffmpeg / yt-dlp для вкладки «Терминал».',
    knowledgeMdInternalLinkTooltip: 'Открыть связанную статью в этом окне.',
    knowledgeMdExternalLinkTooltip: 'Открыть ссылку в браузере (новая вкладка).',
    terminalWorkspaceAriaLabel: 'Панель терминала',
    terminalTitle: 'Терминал',
    terminalIntroLead:
      'Разрешены только префиксы ffmpeg, ffprobe и yt-dlp. Команда разбирается как argv, запускается в основном процессе (main) без оболочки (shell); каталог выбранного движка добавляется в PATH. В argv можно токен ',
    terminalIntroTailTemplate:
      ' — подставится путь текущего превью редактора (только если файл уже открыт через диалог или перетаскивание). В строке ввода при наборе — компактное автодополнение: стрелки вверх/вниз, Home/End, PgUp/PgDn (шаг {pageStep}), Shift+Tab — предыдущая позиция, Tab и Enter — подставить активную подсказку (до {maxInline} вариантов из той же базы, что и справа). Полный перечень — в боковой панели: «Поиск подсказок», клик по строке (если у подсказки есть готовая команда — подставится целиком). В журнале вывода у каждой строки — кнопка «Копир.» при наведении (копирует ровно эту строку). ',
    terminalCommandInputAriaLabel: 'Ввод команды терминала',
    terminalCommandPlaceholder: 'ffprobe -version',
    terminalPreviewFileButton: 'Превью-файл',
    terminalPreviewFileTooltipOpen: 'Вставить токен «{token}» (путь текущего превью)',
    terminalPreviewFileTooltipNeedFile: 'Сначала откройте файл в редакторе',
    terminalRunButton: 'Выполнить',
    terminalRunningButton: 'Выполняю…',
    terminalDropdownInsertLabel: 'Вставить подсказку из полного списка',
    terminalDropdownFilterAria: 'Фильтр полного списка подсказок терминала',
    terminalDropdownFilterPlaceholder: 'Токен, краткое описание или полная строка',
    terminalDropdownListAria: 'Полный список подсказок терминала',
    terminalDropdownEmpty: 'Ничего не найдено по фильтру.',
    terminalInlineSuggestAria: 'Подсказки по аргументам (argv)',
    terminalHistoryAria: 'История команд терминала',
    terminalHistoryEmpty: 'История этой сессии пока пуста.',
    terminalExitCodeMsTemplate: 'код {code} · {ms} мс',
    terminalBlocked: 'заблокировано',
    terminalCopyLineTitle: 'Копировать эту строку',
    terminalCopyLineAriaTemplate: 'Копировать строку {n}',
    terminalCopyLineButton: 'Копир.',
    terminalHintsPanelAria: 'Панель подсказок терминала',
    terminalHintsSearchLabel: 'Поиск подсказок',
    terminalHintsSearchPlaceholder: '--help, -i, crop',
    processingOutcomeSuccess: 'Готово',
    processingOutcomeError: 'Ошибка',
    processingOutcomeCancelled: 'Отмена',
    processingHistoryTitle: 'История обработок',
    processingHistorySectionHint:
      'Последние экспорты ffmpeg, снимки кадров и авто-экспорт после загрузки.',
    processingHistoryWeeklyAria: 'Недельная сводка обработок',
    processingHistory7dPrefix: '7 дней:',
    processingHistoryChipOk: 'ОК',
    processingHistoryChipErrors: 'Ошибки',
    processingHistoryChipCancelled: 'Отмена',
    processingHistoryChipTime: 'Время',
    processingHistoryKindAll: 'Все типы',
    processingHistoryKindExport: 'Экспорт',
    processingHistoryKindSnapshot: 'Кадры',
    processingHistoryKindAutoExport: 'Авто-экспорт',
    processingHistoryOutcomeAll: 'Все исходы',
    processingHistoryKindFilterAria: 'Тип обработки',
    processingHistoryOutcomeFilterAria: 'Исход обработки',
    processingHistoryQueryPlaceholder: 'Файл, кодек, статус, ошибка',
    processingHistoryQueryAria: 'Поиск по истории обработок',
    processingHistoryRefresh: 'Обновить',
    processingHistoryClear: 'Очистить',
    processingHistoryExportJson: 'Экспорт JSON',
    processingHistoryEmpty:
      'История пока пуста. Завершите экспорт или сохраните кадр, и запись появится здесь.',
    processingHistoryRepeat: 'Повторить',
    processingHistoryOpenFile: 'Файл',
    processingHistoryOpenFolder: 'Папка',
    processingHistoryOpenPreview: 'В превью',
    processingHistoryExportDialogTitle: 'Экспорт истории обработок',
    processingHistoryExportSaved: 'История обработок сохранена',
    processingHistoryOpenInputBusy: 'Открываю исходник из истории…',
    processingHistoryOpenInputDone: 'Исходник открыт в редакторе',
    processingHistoryOpenOutputPreviewDone: 'Результат обработки открыт в превью',
    downloadsHistoryTitle: 'История',
    downloadsHistoryWeeklyAria: 'Недельная сводка загрузок',
    downloadsHistory7dPrefix: '7 дней:',
    downloadsHistoryChipOk: 'ОК',
    downloadsHistoryChipErrors: 'Ошибки',
    downloadsHistoryChipCancelled: 'Отмена',
    downloadsHistoryOutcomeFilterLabel: 'Исход',
    downloadsHistoryFilterAll: 'Все',
    downloadsHistoryFilterSuccess: 'Успех',
    downloadsHistoryFilterError: 'Ошибка',
    downloadsHistoryFilterCancelled: 'Отмена',
    downloadsHistoryRefresh: 'Обновить',
    downloadsHistoryClear: 'Очистить',
    downloadsHistoryExportJson: 'Экспорт JSON',
    downloadsHistoryEmpty:
      'История пока пуста. После завершения строк здесь появятся последние результаты.',
    downloadsHistoryRepeat: 'Повторить',
    downloadsHistoryOpenFile: 'Файл',
    downloadsHistoryOpenFolder: 'Папка',
    downloadsHistoryOpenInEditor: 'В редактор',
    downloadsHistoryExportDialogTitle: 'Экспорт истории загрузок',
    downloadsHistoryExportSaved: 'История загрузок сохранена',
    downloadsHistoryRepeatQueued: 'URL из истории добавлен в очередь',
    downloadsHistoryRepeatNotAdded: 'URL не добавлен',
    downloadsHistoryOpenHandlerPreparing:
      'Готовлю файл для редактора… при необходимости будет создано превью WebM.',
    downloadsHistoryOpenHandlerDone: 'Файл открыт в редакторе',
    downloadsLogTitle: 'Журнал в реальном времени',
    downloadsLogSave: 'Сохранить',
    downloadsLogEmpty: 'Записи журнала появятся после запуска строки yt-dlp.',
    workspaceTabsAria: 'Рабочие вкладки',
    workspaceTabEditor: 'Редактор',
    workspaceTabDownloads: 'Загрузки',
    workspaceTabTerminal: 'Терминал',
    workspaceTabEditorTooltip:
      'Редактор: открыть видео с компьютера, посмотреть превью, выделить фрагмент на таймлайне и сохранить готовый файл. Справа панель «FFmpeg» задаёт качество картинки, звук и формат файла.',
    workspaceTabDownloadsTooltip:
      'Загрузки: очередь ссылок на ролики, журнал и настройки «как скачивать». Здесь выбирают качество, папку на диске, субтитры и поведение при ошибках сети.',
    workspaceTabTerminalTooltip:
      'Терминал: одна команда за раз для встроенных инструментов (обработка и загрузка). Обычному сценарию «открыть файл и сохранить» достаточно вкладки «Редактор».',
    downloadsMainAria: 'Вкладка загрузок',
    downloadsPageTitle: 'Загрузки',
    downloadsPageHint:
      'Эта вкладка — основной рабочий стол yt-dlp (очередь по центру, журнал и история под таблицей, настройки справа как в v0; при ширине окна примерно до 1100px панель настроек переносится под журнал с прокруткой, поля не теряются — сверху есть кнопка «К настройкам», чтобы сразу прокрутить к панели). Отдельное окно — дубликат с той же связью с основным процессом (main, IPC) и длинным справочником токенов в одном списке.',
    downloadsPopOut: 'Отдельное окно',
    downloadsScrollToSettings: 'К настройкам',
    downloadsUrlPlaceholder: 'URL или несколько URL по строкам',
    downloadsUrlAria: 'URL для добавления в очередь загрузок',
    downloadsAddToQueue: 'Добавить в очередь',
    downloadsStopQueue: 'Прервать загрузку',
    downloadsStopQueueTooltip:
      'Останавливает только текущий процесс yt-dlp. Очередь URL не очищается; можно снова запустить строку треугольником.',
    downloadsRemoveFinished: 'Убрать готовые',
    downloadsClearQueue: 'Очистить очередь',
    downloadsQueueClearedHint: 'Очередь очищена.',
    downloadsFinishedRemovedTemplate: 'Убрано завершённых строк: {n}',
    downloadsNoFinishedRowsHint: 'Завершённых строк нет.',
    downloadsOverviewAria: 'Сводка очереди загрузок',
    downloadsStatTotal: 'Всего',
    downloadsStatPending: 'Ожидает',
    downloadsFilterBarAria: 'Фильтр очереди по статусу',
    downloadsQueueFilterAll: 'Все',
    downloadsQueueFilterRunning: 'В работе',
    downloadsQueueFilterDone: 'Готово',
    downloadsQueueFilterError: 'Ошибки',
    downloadsQueueFilterCancelled: 'Отмена',
    downloadsTableColNum: '#',
    downloadsTableColTitleUrl: 'Название / URL',
    downloadsTableColFormat: 'Формат',
    downloadsTableColSize: 'Размер',
    downloadsTableColProgress: 'Прогресс',
    downloadsTableColSpeed: 'Скорость',
    downloadsTableColEta: 'Осталось',
    downloadsTableColStatus: 'Статус',
    downloadsTableColActions: 'Действия',
    downloadsEmptyQueue: 'Очередь пуста. Добавьте URL в поле выше.',
    downloadsEmptyFilter:
      'В этом фильтре строк нет. Переключите статус выше или добавьте новые URL.',
    downloadsQueueAriaMoveUp: 'Поднять выше в очереди',
    downloadsQueueAriaMoveDown: 'Опустить ниже в очереди',
    downloadsQueueAriaRetryRow: 'Повторить загрузку этой строки',
    downloadsQueueAriaStartRow: 'Скачать эту строку',
    downloadsQueueAriaOpenFile: 'Открыть скачанный файл',
    downloadsQueueAriaOpenFolder: 'Показать файл в папке',
    downloadsQueueOpenDownloadDirTitle:
      'Открыть папку загрузок yt-dlp (куда сохраняется файл; можно до окончания загрузки)',
    downloadsQueuePauseUnsupportedOsTitle:
      'Пауза yt-dlp недоступна в Windows (нужны SIGSTOP/SIGCONT на стороне ОС).',
    downloadsQueuePauseWaitingProcessTitle:
      'Пауза станет доступна сразу после запуска процесса yt-dlp',
    downloadsQueueAriaOpenInEditor: 'Открыть скачанный файл в FluxAlloy',
    downloadsQueueAriaResumeYtdlp: 'Продолжить yt-dlp',
    downloadsQueueAriaPauseYtdlp: 'Пауза yt-dlp',
    downloadsQueueAriaRemoveRow: 'Удалить из очереди',
    quickYtdlpAria: 'Быстрая загрузка yt-dlp',
    quickYtdlpSummary: 'Быстрая загрузка yt-dlp',
    quickYtdlpPlaceholder: 'URL или несколько URL по строкам (для кнопки ниже берётся первый)',
    quickYtdlpHint:
      'Кнопка ниже скачивает первый распознанный URL текущими настройками yt-dlp и открывает готовый файл в этом редакторе. Параллельно с другой загрузкой нельзя — дождитесь окончания или отмените её на вкладке «Загрузки».',
    quickYtdlpDownloadOpenEditor: 'Скачать и добавить в редактор',
    quickYtdlpDocFormats: 'Форматы',
    quickYtdlpDocOutputTemplate: 'Шаблон -o',
    downloadsRailAria: 'Настройки загрузок',
    downloadsRailTitle: 'Настройки yt-dlp',
    downloadsRailSubtitle:
      'Качество ролика, папка на диске, субтитры, поведение после загрузки и сеть. Секции можно сворачивать; те же значения используются в отдельном окне загрузок.',
    downloadsRailIntroTooltip:
      'Все поля здесь влияют на следующие загрузки из очереди. Наведите курсор на любой переключатель, список или кнопку — появится развёрнутая подсказка простыми словами.',
    downloadsRailFormatSummary: 'Формат',
    downloadsRailFormatQualityLabel: 'Формат / качество',
    downloadsFormatHint: 'Пресет `-f`; при «Только аудио» формат видео не применяется.',
    downloadsPlaylistSpan: 'Весь плейлист',
    downloadsPlaylistPillLabel: 'Весь плейлист',
    downloadsPlaylistHint: '`--yes-playlist` вместо одного видео.',
    downloadsAudioOnlySpan: 'Только аудио',
    downloadsAudioOnlyPillLabel: 'Только аудио',
    downloadsAudioOnlyHint: '`-x`, если нужен звук без видеодорожки.',
    downloadsSubtitlesLabel: 'Субтитры',
    downloadsSubPresetNone: 'Не скачивать',
    downloadsSubPresetManual: 'Ручные дорожки',
    downloadsSubPresetManualAuto: 'Ручные + авто',
    downloadsSubLangsHelp: 'Один токен `--sub-langs` без пробелов (например ru,en или all).',
    downloadsSubLangsLabel: 'Языки субтитров',
    downloadsSubLangsPlaceholder: 'ru,en или all',
    downloadsRailMetadataSummary: 'Метаданные',
    downloadsOpenAfterSuccessSpan: 'Открыть после успеха',
    downloadsOpenAfterSuccessPillLabel: 'Открыть после успеха',
    downloadsOpenAfterSuccessHint: 'Готовый файл сразу попадёт в редактор.',
    downloadsAutoExportSpan: 'Авто-экспорт после открытия',
    downloadsAutoExportPillLabel: 'Авто-экспорт после открытия',
    downloadsAutoExportHint:
      'После успешного открытия — ffmpeg в файл `…-export` рядом с загрузкой (параметры панели экспорта).',
    downloadsCookiesBrowserLabel: 'Cookies браузера',
    downloadsCookiesBrowserNone: 'Не использовать',
    downloadsYtdlpBrowserPrettyChrome: 'Chrome',
    downloadsYtdlpBrowserPrettyEdge: 'Edge',
    downloadsYtdlpBrowserPrettyFirefox: 'Firefox',
    downloadsYtdlpBrowserTokenChrome: 'chrome',
    downloadsYtdlpBrowserTokenEdge: 'edge',
    downloadsYtdlpBrowserTokenFirefox: 'firefox',
    downloadsImpersonateLabel: 'Подмена клиента',
    downloadsImpersonateOff: 'Выключено',
    downloadsCookiesProfileLabel: 'Профиль / контейнер (cookies из браузера)',
    downloadsCookiesProfilePlaceholder: 'имя профиля в Chrome, напр. Default или Profile 1',
    downloadsCookiesProfileHint:
      'Суффикс yt-dlp после двоеточия: `--cookies-from-browser` `chrome:…` (без префикса браузера в поле).',
    downloadsCookiesFileGroupAria: 'Файл cookies yt-dlp',
    downloadsCookiesNetscapeHelp: 'Файл cookies Netscape',
    downloadsCookiesFileNotSelected: 'Файл не выбран',
    downloadsCookiesFilePriorityHelp:
      'Файл имеет приоритет над cookies из браузера; используйте только доверенный экспорт cookies.',
    downloadsRailPick: 'Выбрать',
    downloadsRailSavingSummary: 'Сохранение',
    downloadsOutputDirAria: 'Каталог загрузок yt-dlp',
    downloadsOutputDirLabel: 'Каталог загрузок',
    downloadsOutputPathLoading: 'Загружаю путь…',
    downloadsOutputUseDefaultUserdata: 'Используется каталог по умолчанию в userData.',
    downloadsOutputUseCustom: 'Используется выбранный пользователем каталог.',
    downloadsRailOpenFolder: 'Открыть',
    downloadsOutputDefaultButton: 'По умолчанию',
    downloadsFilenameTemplateLabel: 'Шаблон имени',
    downloadsFilenameTemplateHelp: 'Нужен `%(ext)s`; путь наружу через `..` запрещён.',
    downloadsRailNetworkSummary: 'Сеть',
    downloadsQueueRetryLabel: 'Повтор строки очереди',
    downloadsQueueRetryHelp: 'Повторяет всю строку очереди при ненулевом коде выхода.',
    downloadsRateLimitLabel: 'Лимит скорости',
    downloadsRateLimitPlaceholder: '500K или 2M',
    downloadsRateLimitHelp: 'Ограничение скорости одним безопасным токеном.',
    downloadsYtdlpRetriesLabel: 'Повторы yt-dlp',
    downloadsYtdlpRetriesPlaceholder: '0–99',
    downloadsYtdlpRetriesHelp: 'Повторы самого yt-dlp (`--retries`).',
    downloadsFragmentRetriesLabel: 'Повторы фрагментов',
    downloadsFragmentRetriesPlaceholder: '0–99',
    downloadsFragmentRetriesHelp: 'Повторы фрагментов HLS/DASH.',
    downloadsRailExpertSummary: 'Эксперт и превью',
    downloadsExtraArgsLabel: 'Доп. аргументы (аргументы командной строки, argv)',
    downloadsExtraArgsHelp:
      'Без оболочки (shell): токены как в справочнике; небезопасное отсекает парсер в основном процессе (main).',
    downloadsHintCatalogIntro:
      'Ниже — краткий справочник флагов. Введите часть токена или описания, затем нажмите на флаг — он добавится в «Доп. аргументы». Под каждым пунктом — пояснение простыми словами.',
    downloadsHintCatalogFilterLabel: 'Поиск по справочнику аргументов (argv)',
    downloadsHintSearchPlaceholder: 'Например: --cookies или --sub',
    downloadsHintSearchAria: 'Поиск по токенам и описаниям справочника аргументов (argv)',
    downloadsHintListAria: 'Справочник флагов с описаниями',
    downloadsHintsUnavailable: 'Справочник недоступен.',
    downloadsHintsNoMatches: 'Нет совпадений.',
    downloadsHintsSameAsPopoutHelp:
      'Тот же справочник, что в отдельном окне загрузок: поиск и список; щелчок по флагу добавляет токен в argv.',
    downloadsRailDocOutput: 'Шаблон вывода',
    downloadsRailDocPostprocess: 'Постобработка',
    downloadsCommandPreviewHelp: 'Превью команды (чтение)',
    downloadsOptionsLoading: 'Загружаю настройки yt-dlp…',
    downloadsRailRefreshOptions: 'Обновить настройки',
    downloadsTooltipSectionFormat:
      'Какой вариант ролика скачивать по умолчанию: только звук или видео+звук, весь плейлист или одно видео, нужны ли субтитры и на каких языках.',
    downloadsTooltipSectionMetadata:
      'Что делать после успешной загрузки, как «представиться» сайту и как подтянуть вход без пароля (через браузер или файл cookies). Всё это нужно редко, но помогает, если сайт просит авторизацию.',
    downloadsTooltipSectionSaving:
      'Куда складывать файлы на диске и как назвать папку и имя файла. Путь по умолчанию безопасный; свой каталог удобен, если хотите складывать всё в «Загрузки» или на другой диск.',
    downloadsTooltipSectionNetwork:
      'Поведение при обрывах и лимиты скорости: чтобы не забивать канал или чтобы программа чаще пробовала заново при плохой сети.',
    downloadsTooltipSectionExpert:
      'Дополнительные параметры для опытных пользователей, справочник флагов и предпросмотр итоговой команды. Не обязательно трогать, если обычная загрузка уже работает.',
    downloadsTooltipFormatPresetSelect:
      'Готовый профиль «что скачивать»: ближе к исходному качеству, компактнее или только звук. Если включено «Только аудио», выбор про видео не используется.',
    downloadsTooltipPlaylistSwitch:
      'Если ссылка ведёт на плейлист, включите — скачается вся цепочка роликов. Выключите, если нужен только один ролик из списка.',
    downloadsTooltipAudioOnlySwitch:
      'Сохранить только звук (например музыку или подкаст) без видеодорожки — файл станет легче.',
    downloadsTooltipSubtitlesSelect:
      'Нужны ли текстовые дорожки вместе с видео и насколько агрессивно их подбирать. «Не скачивать» ускоряет и упрощает файл.',
    downloadsTooltipSubLangsInput:
      'Список языков субтитров через запятую или слово «все». Оставьте пустым или «не скачивать», если субтитры не нужны.',
    downloadsTooltipOpenAfterSuccess:
      'После удачной загрузки сразу открыть файл в этом приложении, чтобы посмотреть или дальше экспортировать.',
    downloadsTooltipAutoExport:
      'После открытия загруженного файла автоматически сохранить второй файл по правилам панели «FFmpeg» редактора — удобно, если всегда нужен один и тот же формат «на выход».',
    downloadsTooltipCookiesBrowser:
      'Разрешить программе взять «куки» входа из выбранного браузера, чтобы скачать то, что видите залогиненным в окне браузера. Не используйте на чужом компьютере.',
    downloadsTooltipImpersonate:
      'Сайт иногда отдаёт разное качество в зависимости от того, кем кажется программа. Оставьте «выключено», если всё уже качается нормально.',
    downloadsTooltipCookiesProfile:
      'Если в браузере несколько профилей, укажите имя нужного — иначе возьмется основной. Обычно поле можно не трогать.',
    downloadsTooltipCookiesPick:
      'Выбрать файл с сохранёнными cookies (если вы заранее экспортировали их из браузера). Имеет приоритет над «cookies из браузера».',
    downloadsTooltipCookiesClear:
      'Убрать выбранный файл cookies и снова полагаться только на браузер или настройки по умолчанию.',
    downloadsTooltipOutputOpenFolder:
      'Открыть текущую папку загрузок в проводнике, чтобы увидеть уже скачанные файлы.',
    downloadsTooltipOutputPick: 'Выбрать другую папку на диске, куда складывать новые загрузки.',
    downloadsTooltipOutputDefault:
      'Вернуть встроенную папку приложения — удобно, если экспериментировали с путём и хотите всё как раньше.',
    downloadsTooltipFilenameTemplate:
      'Как назвать файл: в шаблоне должно быть место для расширения, иначе разные сайты могут перезаписать друг друга. Не используйте «..», чтобы не вылезти из папки.',
    downloadsTooltipQueueRetrySelect:
      'Сколько раз автоматически перезапускать всю строку очереди, если загрузка упала с ошибкой. Полезно при нестабильном интернете.',
    downloadsTooltipRateLimitInput:
      'Ограничить скорость скачивания, чтобы не мешать другим устройствам в доме. Оставьте пустым, если лимит не нужен.',
    downloadsTooltipRetriesInput:
      'Сколько раз подряд программа будет заново пробовать соединиться при обрыве до того, как покажет ошибку.',
    downloadsTooltipFragmentRetriesInput:
      'То же для мелких кусочков длинного ролика — повысьте, если обрывается на середине большого файла.',
    downloadsTooltipExtraArgsTextarea:
      'Сюда можно добавить особые параметры загрузки по одному слову, как в справочнике ниже. Неверные комбинации программа отфильтрует ради безопасности.',
    downloadsTooltipHintSearchInput:
      'Сузить список: введите часть флага или слова из описания. Нажмите на флаг в списке — токен добавится в «Доп. аргументы».',
    downloadsTooltipRefreshFooter:
      'Подтянуть настройки с диска, если меняли их в другом окне или вручную в файле.',
    enginesSummaryReady: 'Движки: готовы',
    enginesSummaryMissing: 'Движки: не найдены',
    enginesSummaryError: 'Движки: ошибка проверки',
    enginesSummaryChecking: 'Движки: проверка…',
    engineDisplayNameFfmpeg: 'ffmpeg',
    engineDisplayNameFfprobe: 'ffprobe',
    engineDisplayNameYtdlp: 'yt-dlp',
    commonUnicodeEllipsis: '…',
    enginesVersionLineErrorMark: '!',
    uiPlaceholderDash: '—',
    commonNotApplicableShort: 'н/д',
    topbarProductName: 'FluxAlloy',
    topbarOpenFileTitle:
      'Выбрать видео с компьютера: оно появится в превью и на таймлайне, дальше можно резать и сохранять.',
    topbarOpenFileLabel: 'Открыть',
    topbarInspectorTitle:
      'Отдельное окно: полная сводка ffprobe (дорожки, главы, JSON), экспорт текстовых/HTML сводок. Если ролик уже открыт в редакторе — подставится тот же файл.',
    topbarInspectorLabel: 'Инспектор',
    topbarExportCancelTitle:
      'Остановить текущее сохранение: частичный файл удалится, исходник на диске не пострадает.',
    topbarExportCancelBusy: 'Отмена…',
    topbarExportCancelReady: 'Отменить экспорт',
    topbarEnginesDownloadTitle:
      'Скачать недостающие встроенные инструменты в служебную папку пользователя — удобно на чистой системе.',
    topbarEnginesDownloadBusy: 'Загрузка…',
    topbarEnginesDownloadReady: 'Скачать движки',
    topbarEnginePathsTitle:
      'Указать вручную, где лежат программы сжатия и загрузки, если не хотите пользоваться встроенными или автопоиском.',
    topbarEnginePathsLabel: 'Пути к движкам',
    topbarKnowledgeLabel: 'База знаний',
    topbarAboutTitle: 'О программе и диагностика',
    topbarAboutLabel: 'О программе',
    topbarThemeToggleTitle: 'Переключить тёмную/светлую тему',
    topbarThemeUseLight: 'Светлая тема',
    topbarThemeUseDark: 'Тёмная тема',
    topbarUiLocaleSwitchToEnglishTitle: 'Переключить интерфейс на English',
    topbarUiLocaleSwitchToRussianTitle: 'Переключить интерфейс на русский',
    topbarUiLocaleVisuallyHiddenRu: 'Текущий язык интерфейса: русский',
    topbarUiLocaleVisuallyHiddenEn: 'Текущий язык интерфейса: English',
    editorPreviewDropzoneAria: 'Область предпросмотра',
    editorPreviewVideoAriaTemplate: 'Предпросмотр: {name}',
    editorPreviewEmptyLead:
      'Нет источника — перетащите видеофайл сюда или «Открыть…» в меню «Файл» / кнопка сверху.',
    editorPreviewEmptyHint:
      'Локальный файл стримится через защищённую схему fluxmedia — только после выбора или перетаскивания по пути из Electron.',
    editorFfmpegRailShowTitle:
      'Развернуть правую панель «настройки сохранения»: там качество видео, звук, пресеты под сайты и предпросмотр команды.',
    editorFfmpegRailShowHidden: 'Развернуть панель настроек FFmpeg',
    editorFfmpegRailRestoreLabel: 'FFmpeg',
    editorFfmpegSettingsAria: 'Настройки FFmpeg',
    editorFfmpegSettingsTitle: 'Настройки FFmpeg',
    editorFfmpegSettingsSubtitle:
      'Здесь задаётся, как будет выглядеть и звучать сохранённый ролик. Секции можно сворачивать, чтобы не загромождать экран.',
    editorFfmpegRailCollapseTitle:
      'Свернуть панель настроек сохранения, чтобы больше места осталось под превью и таймлайн. Параметры не сбрасываются.',
    editorFfmpegRailCollapseHidden: 'Свернуть панель настроек FFmpeg',
    editorTooltipFfmpegPanelIntro:
      'Эта панель не ломает исходный файл: она только описывает будущий результат при нажатии «Экспорт» или при автосохранении после загрузки. Меняйте параметры спокойно, пока не нажали сохранение.',
    editorTooltipSectionVideo:
      'Блок «Видео»: способ сжатия картинки, упаковка в файл и дополнительные шаги «подчистить» кадр (полосы, шум, цвет). Чем сильнее эффекты, тем дольше ждать готовый файл.',
    editorTooltipSectionFormat:
      'Блок «Формат»: размер кадра, скорость смены картинок, поворот и обрезка. Удобно подогнать ролик под площадку (например квадрат или широкий экран) до сохранения.',
    editorTooltipSectionAudio:
      'Блок «Аудио и кадр»: громкость и чистота звука, отдельный снимок кадра, субтитры и служебные подписи в файле. Если звук не нужен — можно полностью отключить дорожку.',
    editorTooltipSectionPresets:
      'Блок «Пресеты»: готовые наборы под популярные сайты и ваши собственные сохранённые комбинации. Выбор пресета подставляет все поля сразу; дальше можно подправить вручную.',
    editorTooltipSectionOutput:
      'Блок «Вывод»: как программа собирает команду сохранения, куда предложит положить файл и быстрые действия с последним результатом.',
    editorTooltipVideoCodec:
      'Выбор «движка» для сжатия картинки. Один вариант чуть старее и совместим почти везде; другой даёт меньший размер при той же чёткости, но старые устройства могут не открыть без обновления.',
    editorTooltipEncodePreset:
      'Насколько быстро программа будет упаковывать видео при сохранении. «Быстрее и легче файл» — дольше ждать, «лучше картинка» — тяжелее файл и дольше кодирование. Для обычных роликов чаще хватает середины.',
    editorTooltipContainer:
      'Тип «коробки» для готового файла. Универсальные варианты открываются почти везде; один из вариантов удобен для техники Apple. Если сомневаетесь — оставляйте тот, что стоит по умолчанию.',
    editorTooltipCrf:
      'Тонкая настройка качества картинки при сохранении без жёсткого лимита размера. Меньшее число — чище картинка и тяжелее файл; большее — наоборот. «Как в пресете» — довериться выбранной скорости выше.',
    editorTooltipVideoBitrate:
      'Жёсткий «потолок» объёма видео в секунду. Удобно, когда нужен предсказуемый размер файла. Если выбран этот режим, отдельная шкала качества выше не действует.',
    editorTooltipResolution:
      'Насколько крупным будет кадр по вертикали. «Как в исходнике» — не уменьшать и не растягивать; остальные варианты уменьшают картинку, чтобы файл стал легче.',
    editorTooltipFps:
      'Сколько картинок в секунду в сохранённом ролике. «Как в исходнике» — не менять; фиксированные значения подходят, если площадка просит строго 30 или 25 кадров.',
    editorTooltipRotation:
      'Поворот или зеркало всего кадра перед сохранением. Удобно, если ролик снят «на бок» или нужно отразить картинку.',
    editorTooltipCrop:
      'Отрезать края по шаблону (квадрат, широкий формат и т.д.) до сжатия. Исходный файл на диске не меняется — обрезка только в готовом результате.',
    editorTooltipAacBitrate:
      'Насколько подробно сохраняется звук. Большее значение — богаче музыка и голос, но тяжелее файл. Для речи и простого монтажа часто хватает середины списка.',
    editorTooltipSnapshotFormat:
      'В каком виде сохраняется отдельный снимок кадра: с максимальной чёткостью без потерь или компактнее, чуть сжимая картинку.',
    editorTooltipUserPresetSelectFallback:
      'Выберите строку, чтобы подставить готовый набор полей. У встроенных пресетов есть короткое описание под курсором; свои пресеты вы сохраняете сами кнопкой «+ Пресет».',
    editorTooltipPresetAdd:
      'Запомнить текущие поля панели под новым именем. Так можно держать несколько «профилей» под разные задачи, не настраивая всё заново.',
    editorTooltipPresetRename:
      'Переименовать выбранный собственный пресет. Встроенные названия трогать нельзя — они обновляются вместе с программой.',
    editorTooltipPresetOverwrite:
      'Записать текущие поля поверх выбранного собственного пресета. Полезно, если вы подобрали настройки и хотите обновить сохранённый профиль.',
    editorTooltipPresetDelete:
      'Удалить выбранный собственный пресет из списка. Встроенные строки удалить нельзя.',
    editorTooltipExportCommandPreview:
      'Показывает, какие шаги программа выполнит при сохранении. Это для прозрачности: можно скопировать строку, если нужно повторить то же вне программы.',
    editorTooltipExportLastFile:
      'Открыть последний сохранённый ролик в том же предпросмотре, чтобы быстро проверить результат.',
    editorTooltipExportLastFolder:
      'Открыть папку, где лежит последний сохранённый ролик — например чтобы перетащить файл в мессенджер.',
    editorTooltipCopyExportPath:
      'Скопировать полный путь к последнему сохранённому файлу в буфер обмена — удобно вставить в другое приложение.',
    editorTooltipExportOpenPreview:
      'Открыть последний сохранённый ролик снова в этом окне предпросмотра, не ища файл в папке.',
    editorTooltipSnapshotLastFile: 'Открыть последний сохранённый снимок кадра отдельно от видео.',
    editorTooltipSnapshotLastFolder: 'Показать папку с последним снимком кадра.',
    editorTooltipSnapshotCopyPath: 'Скопировать путь к последнему снимку кадра.',
    editorTooltipTwoPass:
      'Режим «два прохода» сначала анализирует весь ролик, потом сохраняет с более ровным размером файла. Имеет смысл только при выбранном «жёстком» битрейте видео и совместимом кодеке; займёт примерно вдвое больше времени.',
    editorTooltipNoAudio:
      'Включите, если нужен ролик только с картинкой: звук в готовом файле не будет. Полезно для заставок или если звук добавите позже в другой программе.',
    editorTooltipStripMetadata:
      'Убрать из готового файла «паспорт» — название, автора, обложку и другие скрытые подписи. Иногда так просят площадки или нужно не светить личные данные.',
    editorTooltipStripChapters:
      'Убрать метки разделов внутри ролика, чтобы файл шёл одной дорожкой без глав в плеере.',
    editorFfmpegSectionVideo: 'Видео',
    editorFfmpegSectionVideoHint:
      'Здесь решается, насколько «тяжёлым» будет готовое видео: способ сжатия, упаковка в файл и дополнительная обработка картинки.',
    editorFieldVideoCodec: 'Видеокодек',
    editorAriaVideoCodecExport: 'Способ сжатия картинки при сохранении',
    editorFieldEncodePreset: 'Скорость и качество по умолчанию',
    editorAriaEncodePresetExport:
      'Насколько долго крутится сохранение и насколько плотно сжимается картинка',
    editorFieldContainer: 'Тип файла',
    editorAriaContainerExport: 'В каком виде упаковать готовый ролик',
    editorFieldCrf: 'Тонкая настройка качества',
    editorAriaCrfExport: 'Тонкая настройка качества картинки',
    editorCrfOptionPreset: 'Как в пресете скорости',
    editorFieldVideoBitrate: 'Ограничение размера видео',
    editorAriaVideoBitrateExport: 'Жёсткий лимит объёма видео в секунду',
    editorVideoBitrateOptionCrf: 'Без жёсткого лимита (качество из шкалы выше)',
    editorFieldDeinterlace: 'Сглаживание «гребёнки»',
    editorAriaDeinterlace: 'Сглаживание чересстрочного видео',
    editorHintDeinterlace:
      'Старые камеры и ТВ иногда сохраняют картинку «через строку» — при движении появляются тонкие полоски. Первый режим убирает их, почти не меняя плавность; второй делает картинку ещё мягче, но может изменить ощущение скорости движения.',
    editorFieldDenoise: 'Шумоподавление',
    editorAriaDenoise: 'Шумоподавление',
    editorHintDenoise:
      'Убирает мелкую «крупинку» и цветовой шум, особенно в тени. Сильнее — чище картинка, но мелкие детали (волосы, текстура) могут стать мыльнее.',
    editorFieldDeband: 'Сглаживание полос',
    editorAriaDeband: 'Сглаживание полос на градиентах',
    editorHintDeband:
      'На небе, светлых стенах и тенях иногда видны ступеньки вместо плавного перехода цвета. Эта настройка смягчает такие ступеньки; сильный режим может слегка «размазать» очень тонкие детали.',
    editorFieldHisteq: 'Выравнивание яркости',
    editorAriaHisteq: 'Выравнивание общей яркости',
    editorHintHisteq:
      'Если весь кадр в целом слишком тёмный или «засвеченный», эта опция мягко подтянет баланс света. Не путать с ручной цветокоррекцией — эффект глобальный по кадру.',
    editorFieldLut3d: 'Цветовой стиль',
    editorAriaLut3d: 'Готовый цветовой стиль',
    editorHintLut3d:
      'Готовые «кино»-оттенки: теплее, холоднее или контрастнее без ручной настройки каждого ползунка. Подберите по вкусу; «выкл» возвращает исходные цвета.',
    editorFieldSharpen: 'Резкость',
    editorAriaSharpen: 'Резкость краёв',
    editorHintSharpen:
      'Делает контуры чуть отчётливее. Слабый режим почти незаметен; сильный может дать светлый ореол вокруг резких границ.',
    editorFieldEq: 'Цвет',
    editorAriaEq: 'Готовые цветовые оттенки',
    editorHintEq:
      'Простые пресеты «теплее / холоднее / ярче / мягче» для быстрого настроения настроения ролика без графиков.',
    editorFieldHue: 'Оттенок и насыщенность',
    editorAriaHue: 'Сдвиг оттенка и насыщенности',
    editorHintHue:
      'Слегка сдвигает общий цветовой тон или добавляет насыщенность. Полезно, если картинка кажется «мышиной» или, наоборот, слишком кислотной.',
    editorFieldGrain: 'Зерно',
    editorAriaGrain: 'Зерно по кадру',
    editorHintGrain:
      'Добавляет лёгкую живую текстуру, похожую на плёнку. Уместно для художественного эффекта; для чистого репортажа чаще оставляют выкл.',
    editorFieldVignette: 'Виньетка',
    editorAriaVignette: 'Затемнение краёв',
    editorHintVignette:
      'Слегка затемняет углы кадра, уводя взгляд к центру. Сильная виньетка заметно «закрывает» края.',
    editorFieldBlur: 'Размытие',
    editorAriaBlur: 'Лёгкое размытие',
    editorHintBlur:
      'Равномерно смягчает детали по всему кадру — как будто чуть неточно наведли резкость. Для портретов иногда приятно; для текста на экране обычно вредно.',
    editorFfmpegSectionFrameLayout: 'Формат',
    editorFfmpegSectionFrameLayoutHint:
      'Размер картинки, сколько кадров в секунду, поворот и обрезка до сжатия — удобно подогнать ролик под площадку.',
    editorFieldResolution: 'Разрешение',
    editorAriaResolutionExport: 'Размер готового кадра',
    editorFieldFps: 'Кадров в секунду',
    editorAriaFpsExport: 'Скорость смены кадров в сохранённом файле',
    editorFpsOptionSource: 'Как в исходнике',
    editorExportFpsOptionTemplate: '{value} к/с',
    editorTwoPassSpan: 'Два прохода',
    editorTwoPassPillLabel: 'Двухпроходное сохранение',
    editorTwoPassHint:
      'Работает только в связке «совместимый широкий формат видео» + выбранное ограничение размера видео выше. Если включена только «тонкая настройка качества» или выбран экономящий трафик формат — переключатель недоступен.',
    editorFieldRotation: 'Поворот',
    editorAriaRotationExport: 'Поворот или зеркало',
    editorFieldCrop: 'Обрезка',
    editorAriaCropExport: 'Шаблон обрезки кадра',
    editorFfmpegSectionAudio: 'Аудио и кадр',
    editorFfmpegSectionAudioHint:
      'Звуковая дорожка, громкость, отдельный снимок кадра и поведение субтитров в готовом файле.',
    editorNoAudioSpan: 'Без аудио',
    editorNoAudioPillLabel: 'Без аудио',
    editorNoAudioHint:
      'Включите, если в готовом файле не должно быть звука вообще — например заставка или подготовка под озвучку снаружи.',
    editorFieldAacBitrate: 'Качество звука',
    editorAriaAacBitrate: 'Насколько подробно сохраняется звук',
    editorFieldAudioGain: 'Громкость аудио',
    editorAriaAudioGain: 'Сдвиг громкости',
    editorHintAudioGain:
      'Поднять или опустить громкость всей дорожки целиком. Не действует, если звук отключён переключателем выше.',
    editorFieldAudioNormalize: 'Выравнивание громкости',
    editorAriaAudioNormalize: 'Автоматическое выравнивание громкости',
    editorHintAudioNormalize:
      'Делает тихие и громкие места ближе друг к другу по ощущению. «Подкаст» — спокойный уровень как у радио; «динамика» — мягче подтягивает шёпот, но может чуть менять «живость» записи.',
    editorFieldSnapshotFormat: 'Формат кадра',
    editorAriaSnapshotFormat: 'Формат отдельного снимка',
    editorStripMetadataSpan: 'Удалить метаданные',
    editorStripMetadataPillLabel: 'Удалить скрытые подписи файла',
    editorStripMetadataHint:
      'Убирает из готового файла название, автора, обложку и другие служебные поля, которые плеер показывает как «информацию о ролике».',
    editorStripChaptersSpan: 'Удалить главы',
    editorStripChaptersPillLabel: 'Удалить разделы внутри ролика',
    editorStripChaptersHint:
      'Убирает метки разделов, по которым плеер прыгает по главам. Сама картинка и звук не режутся — только навигация.',
    editorFieldExportSubtitles: 'Субтитры',
    editorAriaExportSubtitles: 'Сохранять ли текстовые дорожки',
    editorHintExportSubtitles:
      '«Не сохранять» — в итоговом файле обычно остаётся только картинка и звук. «Сохранить» пытается перенести текстовые субтитры; на некоторых типах файлов это может быть недоступно — тогда дорожка пропадёт.',
    editorSnapshotLastFile: 'Файл кадра',
    editorSnapshotLastFolder: 'Папка',
    editorCopy: 'Копировать',
    editorPillSwitchOn: 'Вкл',
    editorPillSwitchOff: 'Выкл',
    appDialogCancel: 'Отмена',
    appDialogSave: 'Сохранить',
    editorExportEncodeBalance: 'Баланс',
    editorExportEncodeSmaller: 'Меньше размер',
    editorExportEncodeQuality: 'Качество',
    editorExportCodecH264: 'H.264 (libx264)',
    editorExportCodecH265: 'H.265 (libx265)',
    editorExportCodecVp9: 'VP9 (libvpx-vp9, только MKV)',
    editorExportCodecSvtav1: 'AV1 (libsvtav1, только MKV)',
    editorExportCodecAomav1: 'AV1 (libaom-av1, только MKV)',
    editorExportAutoContainerMkv: 'Контейнер переключён на MKV (VP9/AV1 CPU).',
    editorExportCodecHwAuto: 'Авто (лучший H.264/AV1 HW или CPU)',
    editorExportCodecHwAutoBadge: 'АВТО',
    editorExportCodecHwAutoBadgeTitle:
      'При экспорте: NVENC → AMF → QSV → VideoToolbox → VAAPI (H.264), затем AV1 NVENC/AMF/QSV, иначе libx264.',
    editorExportCodecHwAutoHevc: 'Авто HEVC (лучший HEVC/AV1 HW или libx265)',
    editorExportCodecHwAutoHevcBadge: 'АВТО HEVC',
    editorExportCodecHwAutoHevcBadgeTitle:
      'При экспорте: HEVC NVENC → AMF → QSV → VideoToolbox → VAAPI, затем AV1 NVENC/AMF/QSV, иначе libx265.',
    editorExportHwaccelsTitle: 'Аппаратные методы (ffmpeg -hwaccels)',
    editorExportContainerMp4: 'MP4',
    editorExportContainerMkv: 'MKV',
    editorExportContainerMov: 'MOV',
    editorExportScaleSource: 'Размер исходный',
    editorExportScale480p: '480p',
    editorExportScale720p: '720p',
    editorExportScale1080p: '1080p',
    editorExportTransformNone: 'Поворот: нет',
    editorExportTransformCw90: '↻ 90°',
    editorExportTransformCcw90: '↺ 90°',
    editorExportTransformR180: '180°',
    editorExportTransformHflip: 'Зеркало H',
    editorExportTransformVflip: 'Зеркало V',
    editorExportCropNone: 'Обрезка: нет',
    editorExportCropCenterSquare: 'Обрезка 1:1',
    editorExportCropCenter169: 'Обрезка 16:9',
    editorExportCropCenter43: 'Обрезка 4:3',
    editorExportAudioGainM12: '−12 дБ',
    editorExportAudioGainM9: '−9 дБ',
    editorExportAudioGainM6: '−6 дБ',
    editorExportAudioGainM3: '−3 дБ',
    editorExportAudioGain0: '0 дБ (выкл.)',
    editorExportAudioGainP3: '+3 дБ',
    editorExportAudioGainP6: '+6 дБ',
    editorExportAudioGainP9: '+9 дБ',
    editorExportAudioGainP12: '+12 дБ',
    editorExportSubtitleDrop: 'Не сохранять',
    editorExportSubtitleCopy: 'Сохранить (режим copy / mov_text)',
    editorExportDeinterlaceOff: 'Деинтерлейс: выкл.',
    editorExportDeinterlaceFrame: 'Кадр (yadif: режим send_frame)',
    editorExportDeinterlaceField: 'Поле (yadif: режим send_field, 2×)',
    editorExportDenoiseOff: 'Шумоподавление: выкл.',
    editorExportDenoiseLight: 'Лёгкое (hqdn3d=1.5)',
    editorExportDenoiseMedium: 'Среднее (hqdn3d=3)',
    editorExportDenoiseStrong: 'Сильное (hqdn3d=5)',
    editorExportSharpenOff: 'Резкость: выкл.',
    editorExportSharpenLight: 'Лёгкая (unsharp 0.6)',
    editorExportSharpenMedium: 'Средняя (unsharp 1.0)',
    editorExportSharpenStrong: 'Сильная (unsharp 1.5)',
    editorExportDebandOff: 'Deband: выкл.',
    editorExportDebandLight: 'Лёгкий (параметр range=12)',
    editorExportDebandMedium: 'Средний (параметр range=20)',
    editorExportDebandStrong: 'Сильный (параметр range=28)',
    editorExportHisteqOff: 'Histeq: выкл.',
    editorExportHisteqLight: 'Лёгкая (strength 0.14)',
    editorExportHisteqMedium: 'Средняя (strength 0.26)',
    editorExportHisteqStrong: 'Сильная (strength 0.40)',
    editorExportLut3dOff: '3D LUT: выкл.',
    editorExportLut3dFilmWarm: 'Кино теплее (lut3d)',
    editorExportLut3dFilmCool: 'Кино холоднее (lut3d)',
    editorExportLut3dPunch: 'Контраст (lut3d)',
    editorExportEqOff: 'Цвет: выкл.',
    editorExportEqWarm: 'Теплее',
    editorExportEqCool: 'Холоднее',
    editorExportEqVivid: 'Насыщенно',
    editorExportEqFlat: 'Мягко/flat',
    editorExportHueOff: 'Оттенок: выкл.',
    editorExportHueWarmShift: 'Сдвиг теплее',
    editorExportHueCoolShift: 'Сдвиг холоднее',
    editorExportHueSatBoost: 'Насыщенность +',
    editorExportGrainOff: 'Зерно: выкл.',
    editorExportGrainLight: 'Лёгкое (noise 2)',
    editorExportGrainMedium: 'Среднее (noise 5)',
    editorExportGrainStrong: 'Сильное (noise 9)',
    editorExportVignetteOff: 'Виньетка: выкл.',
    editorExportVignetteLight: 'Лёгкая (PI/3)',
    editorExportVignetteMedium: 'Средняя (PI/5)',
    editorExportVignetteStrong: 'Сильная (PI/10)',
    editorExportBlurOff: 'Размытие: выкл.',
    editorExportBlurLight: 'Лёгкое (gblur σ=1)',
    editorExportBlurMedium: 'Среднее (gblur σ=2.5)',
    editorExportBlurStrong: 'Сильное (gblur σ=5)',
    editorExportAudioNormOff: 'Нормализация: выкл.',
    editorExportAudioNormLoudnorm: 'EBU R128 (loudnorm)',
    editorExportAudioNormDynaudnorm: 'Динамическая (dynaudnorm)',
    editorExportSnapshotPng: 'Кадр PNG',
    editorExportSnapshotJpg: 'Кадр JPEG',
    editorExportUserPresetsMaxStatus:
      'Не более 8 своих пресетов (встроенные пресеты платформ не считаются).',
    editorExportUserPresetsMaxTotalStatus:
      'Список пресетов в настройках заполнен по лимиту — удалите или переименуйте лишнее.',
    editorExportPresetDefaultName: 'Мой пресет',
    editorExportPresetDialogTitleCreate: 'Новый пресет экспорта',
    editorExportPresetDialogTitleRename: 'Имя пресета',
    editorExportPresetDialogHint:
      'Имя хранится только в настройках FluxAlloy и помогает быстро возвращаться к набору FFmpeg-параметров.',
    editorExportPresetNameLabel: 'Имя',
    editorExportPresetErrorEmpty: 'Введите имя пресета.',
    editorExportPresetErrorMax: 'Не более 8 своих пресетов (встроенные не считаются).',
    editorExportPresetErrorMaxTotal: 'Список пресетов в настройках заполнен по лимиту.',
    editorEnginePathsDialogTitle: 'Пути к движкам',
    editorEnginePathsDialogHint:
      'Полный путь к каждому исполняемому файлу имеет приоритет над встроенным каталогом и загрузкой в userData/bin. Оставьте поле пустым и сохраните — сброс на авто-поиск.',
    editorEnginePathPlaceholderAuto: 'Авто',
    editorEnginePathBrowse: 'Выбрать…',
    editorEnginePathClear: 'Сбросить',
    editorEnginePathsRemoveDownloadedTooltip:
      'Удалить только скачанные копии из userData/bin. Встроенные resources/bin и ручные пути не трогаются.',
    editorEnginePathsRemoveDownloaded: 'Удалить скачанные',
    statusTerminalCliExitOk: 'Терминал: код {code}',
    statusTerminalCliFailed: 'Терминал: {error}',
    statusTerminalOutputLineCopied: 'Строка вывода скопирована',
    statusTerminalOutputLineCopyFailed: 'Не удалось скопировать строку',
    statusVideoMediaErrAborted: 'загрузка отменена',
    statusVideoMediaErrNetwork: 'сетевая ошибка',
    statusVideoMediaErrDecode: 'ошибка декодирования',
    statusVideoMediaErrSrcNotSupported: 'формат не поддерживается',
    statusVideoMediaErrUnknown: 'неизвестная ошибка',
    statusVideoPlayFailed: 'Видео не удалось воспроизвести: {detail}',
    statusVideoDirectOpenFailedBlobTrying:
      'Видео не открылось напрямую, пробую безопасный предпросмотр через временный URL (blob)…',
    statusVideoBlobFallbackActive: 'Видео переведено на предпросмотр через временный URL (blob).',
    statusVideoPlayFailedAfterFallback:
      'Видео не удалось воспроизвести: {detail}; запасной вариант тоже не сработал.',
    statusPreviewProbeFailedTemplate: 'Метаданные ffprobe недоступны: {error}',
    statusDownloadsUrlsAdded: 'Добавлено в очередь URL: {n}',
    statusDownloadsQueueNoUrlsParsed: 'В тексте не найдено ни одного URL для очереди.',
    statusDownloadOpenEditorWorking: 'Скачиваю первый URL из поля…',
    statusDownloadOpenEditorSuccess: 'Файл открыт в редакторе.',
    statusDownloadOpenEditorNeedUrl: 'Введите URL в поле выше.',
    statusExportProgress: 'Экспорт · {tail}',
    statusEnginesDownloadPreparing: 'Подготовка загрузки…',
    statusErrorWithDetail: 'Ошибка: {detail}',
    statusEnginesDownloadedOk: 'Движки загружены',
    statusEnginesDownloadFailedGeneric: 'Ошибка загрузки',
    statusEnginesClearingUserBin: 'Удаляю скачанные движки из userData/bin…',
    statusEnginesUserBinRemovedCount: 'Удалено скачанных движков: {n}',
    statusEnginesUserBinNothingRemoved: 'Скачанных движков в userData/bin не было',
    statusEnginesClearUserBinFailedGeneric: 'Не удалось удалить скачанные движки',
    statusEnginePathsSaved: 'Пути к движкам сохранены',
    statusSnapshotInProgress: 'Снимок кадра…',
    statusSnapshotSaved: 'Кадр сохранён: {name}',
    statusSnapshotFailedWithDetail: 'Кадр: {detail}',
    statusSnapshotFailedGeneric: 'Кадр: ошибка',
    statusSnapshotExceptionGeneric: 'Ошибка снимка',
    statusExportPreparing: 'Подготовка экспорта…',
    statusExportSaved: 'Экспорт завершён: {name}',
    statusExportCancelled: 'Экспорт отменён',
    statusExportFailedWithDetail: 'Экспорт: {detail}',
    statusExportFailedGeneric: 'Экспорт: ошибка',
    statusExportExceptionGeneric: 'Ошибка экспорта',
    statusExportCancelling: 'Отмена экспорта…',
    statusExportOpenedInPreview: 'Экспорт открыт в превью',
    statusExportPathCopied: 'Путь экспорта скопирован',
    statusExportPathCopyFailed: 'Не удалось скопировать путь экспорта',
    statusSnapshotPathCopied: 'Путь кадра скопирован',
    statusSnapshotPathCopyFailed: 'Не удалось скопировать путь кадра',
    statusFfmpegCommandCopied: 'Команда ffmpeg скопирована',
    statusFfmpegCommandCopyFailed: 'Не удалось скопировать команду ffmpeg',
    statusDndGrantFailed: 'Перетаскивание: {error}',
    downloadsQueueRowStatusWaiting: 'Ожидание',
    downloadsQueueRowStatusRunning: 'Загрузка…',
    downloadsQueueRowStatusDone: 'Готово',
    downloadsQueueRowStatusCancelled: 'Отменено',
    downloadsQueueRowStatusRetryTemplate: 'Пауза перед повтором ({cur}/{max})…',
    downloadsQueueRowStatusRetryUnknown: 'Пауза перед повтором',
    editorFfmpegSectionPresets: 'Пресеты',
    editorFfmpegSectionPresetsHint:
      'Готовые наборы под TikTok, YouTube, Shorts, ВК, Reels, Telegram, Discord, iPhone и архив, плюс ваши сохранённые комбинации. Встроенные строки нельзя переименовать или удалить.',
    editorFieldUserPreset: 'Пользовательский пресет',
    editorAriaUserPreset: 'Пользовательский пресет экспорта',
    editorUserPresetPlaceholder: 'Пресет: —',
    editorPresetAdd: '+ Пресет',
    editorPresetRename: 'Имя',
    editorPresetOverwrite: 'Обновить',
    editorPresetDelete: 'Удалить',
    editorBuiltinPresetLockedHint:
      'Встроенные пресеты нельзя переименовать, обновить или удалить — создайте свой пресет.',
    editorFfmpegSectionOutput: 'Вывод',
    editorFfmpegSectionOutputHint:
      'Показать, как программа соберёт сохранение; кнопка «Экспорт» вверху откроет диалог «Сохранить как…»; ниже — быстрые действия с последним готовым файлом.',
    editorExportCommandPreviewSummary: 'Превью команды сохранения',
    editorAriaExportFfmpegCommand: 'Текст команды сохранения',
    editorCopyFfmpegCommandTitle:
      'Скопировать текст команды в буфер — если нужно выполнить то же сохранение вручную или показать специалисту.',
    editorExportLastFile: 'Файл',
    editorExportLastFolder: 'Папка',
    editorCopyExportPath: 'Копировать путь',
    editorExportPreviewPass1: '# Проход 1',
    editorExportPreviewPass2: '# Проход 2',
    editorExportPreviewHintNoSource:
      'Источник не выбран — в превью используются плейсхолдеры <input>/<output>.',
    editorExportPreviewHintTwoPass:
      'Двухпроход: итоговый файл пишет только вторая команда; журнал passlog — во временном каталоге основного процесса (main).',
    editorExportPreviewHintTrimAppliedTemplate: 'Маркеры In/Out подставлены: -ss {in} -t {t}.',
    editorExportPreviewHintTrimFull:
      'Маркеры покрывают почти весь файл — ffmpeg запустится без -ss/-t.',
    editorExportPreviewHintTrimWaiting:
      'Маркеры In/Out появятся, как только таймлайн сообщит диапазон.',
    inspectorStandaloneBrandAria: 'FluxAlloy инспектор',
    inspectorStandaloneHeaderTitle: 'Инспектор',
    inspectorStandaloneTopbarEngineLabel: 'ffprobe',
    inspectorStandaloneOpenPickTitle:
      'Выбрать локальный медиафайл (тот же белый список расширений, что у превью)',
    inspectorStandaloneOpenVisuallyHidden: 'Открыть файл…',
    inspectorStandaloneFfprobeRefreshTitle: 'Повторно запустить ffprobe для текущего файла',
    inspectorStandaloneFfprobeRefreshDisabledTitle: 'Нет файла для обновления',
    inspectorStandaloneFfprobeRefreshVisuallyHidden: 'Обновить ffprobe',
    inspectorStandaloneAboutDiagnosticsTitle: 'О программе и быстрые действия диагностики',
    inspectorStandaloneThemeToggleTitle: 'Переключить тему (синхронно с главным окном)',
    inspectorStandaloneEmptyHint:
      'Перетащите видеофайл сюда или нажмите «Открыть…». При запуске из меню подставляется последний файл из превью (если он ещё на диске).',
    inspectorWindowDocumentTitle: 'FluxAlloy — инспектор',
    probePanelAriaLabel: 'Расширенная сводка ffprobe',
    probePanelOverviewHint:
      'Раскрываемые блоки: экспорт текстовой/HTML сводки, таблицы дорожек и глав, сырой JSON ffprobe; в таблицах доступны контекстное меню и копирование ячеек.',
    probeDurationUnknown: 'длительность неизвестна',
    probeDurationSecShort: '{sec} с',
    probeDurationClockApprox: '{clock} · {total} с',
    probeSummaryAudioFragmentTemplate: ' · аудио {codec}',
    probeBitrateMbpsTemplate: '{value} Мбит/с',
    probeBitrateKbpsTemplate: '{value} кбит/с',
    probeFfprobeDocLink: 'Документация ffprobe (все опции)',
    probeClipboardCopied: 'Скопировано в буфер',
    probeClipboardCopyFailed: 'Не удалось скопировать',
    probeSaveJsonDialogTitle: 'Сохранить JSON ffprobe',
    probeSaveSummaryTxtDialogTitle: 'Сохранить сводку ffprobe (TXT)',
    probeSaveSummaryHtmlDialogTitle: 'Сохранить сводку ffprobe (HTML)',
    probeSavedPathTemplate: 'Сохранено: {path}',
    probeSectionExportSummary: 'Экспорт сводки (TXT / HTML)',
    probeSectionExportSummaryHint:
      'Текст или HTML со сводкой ffprobe («человеческое» оглавление и ключевые поля дорожек).',
    probeSaveSummaryTxtButton: 'Сохранить сводку TXT…',
    probeSaveSummaryHtmlButton: 'Сохранить сводку HTML…',
    probeSectionTracksTemplate: 'Дорожки ({count})',
    probeTracksCaption: 'Дорожки медиафайла по данным ffprobe',
    probeTrackRowMenuHint: 'ПКМ, Enter или Shift+F10 — действия с дорожкой',
    probeThIndex: '#',
    probeThType: 'Тип',
    probeThCodec: 'Кодек',
    probeThPixFmt: 'Форм. пикс.',
    probeThSar: 'SAR',
    probeThDar: 'DAR',
    probeThColorSpace: 'Цв. пространство',
    probeThPrimaries: 'Осн. цвета',
    probeThTransfer: 'Передача цвета',
    probeThRange: 'Диапазон',
    probeThBitrate: 'Битрейт',
    probeThDisposition: 'Свойства дорожки',
    probeThLanguage: 'Язык',
    probeThTrackTitle: 'Заголовок',
    probeThDetails: 'Сведения',
    probeTrackKindVideo: 'Видео',
    probeTrackKindAudio: 'Аудио',
    probeTrackKindSubtitle: 'Субтитры',
    probeTrackKindAttachment: 'Вложение',
    probeTrackKindData: 'Данные',
    probeTrackKindOther: 'Прочее',
    probeChapterDurationSecTemplate: '{dur} с',
    probeSectionChaptersTemplate: 'Главы ({count})',
    probeChaptersCaption: 'Главы медиафайла по данным ffprobe',
    probeChapterRowMenuHint: 'ПКМ, Enter или Shift+F10 — действия с главой',
    probeThChapterId: 'ИД',
    probeThChapterStart: 'Начало',
    probeThChapterEnd: 'Конец',
    probeThChapterDuration: 'Длительность',
    probeThChapterTitle: 'Заголовок',
    probeSectionRawJson: 'JSON ffprobe',
    probeRawJsonHint:
      'Вывод только для чтения; скопируйте или сохраните для поддержки или внешнего парсера.',
    probeCopyJsonButton: 'Копировать JSON',
    probeSaveJsonButton: 'Сохранить JSON…',
    probeRawJsonPreAria: 'Сырой JSON ffprobe',
    probeContextMenuAria: 'Действия со строкой ffprobe',
    probeCtxCopyRowTab: 'Копировать строку (табуляция)',
    probeCtxCopyCodec: 'Копировать кодек',
    probeCtxCopyPixFmt: 'Копировать формат пикселей',
    probeCtxCopySar: 'Копировать SAR',
    probeCtxCopyDar: 'Копировать DAR',
    probeCtxCopyColorSpace: 'Копировать цветовое пространство',
    probeCtxCopyColorPrimaries: 'Копировать основные цвета',
    probeCtxCopyColorTransfer: 'Копировать передачу цвета',
    probeCtxCopyColorRange: 'Копировать диапазон цвета',
    probeCtxCopyBitrate: 'Копировать битрейт',
    probeCtxCopyDisposition: 'Копировать свойства дорожки',
    probeCtxCopyDetail: 'Копировать сведения',
    probeCtxCopyLanguage: 'Копировать язык',
    probeCtxCopyTrackTitle: 'Копировать заголовок дорожки',
    probeCtxCopyChapterTitle: 'Копировать заголовок',
    videoTimelineZoomRowAria: 'Масштаб временной шкалы',
    videoTimelineZoomOutTitle: 'Отдалить шкалу (показать больший интервал времени)',
    videoTimelineZoomInTitle: 'Приблизить шкалу под точную позицию',
    videoTimelineZoomReadoutTitle: 'Видимый диапазон перемотки (scrub) и полоски маркеров',
    videoTimelineZoomReadoutTemplate: 'Масштаб ×{mul} · {start} — {end}',
    videoTimelineRulerAria: 'Линейка времени окна воспроизведения: щелчок или стрелки для перехода',
    videoTimelineRulerValuetextTemplate: '{current} в окне {winStart} — {winEnd}',
    videoTimelineMediaFactsAria: 'Сводка медиа по ffprobe и позиция',
    videoTimelineVideoStreamTitle: 'Первый видеопоток ffprobe',
    videoTimelineVideoLabel: 'Видео:',
    videoTimelineAudioStreamTitle: 'Первая аудиодорожка ffprobe',
    videoTimelineAudioLabel: 'Аудио:',
    videoTimelinePositionTitle: 'Текущее время; номер кадра — оценка по к/с из строки дорожки',
    videoTimelinePositionLabel: 'Позиция:',
    videoTimelineFrameApproxSuffixTemplate: ' · кадр ~{frame}',
    videoTimelineMarkersOutsideWindowTitle:
      'Маркеры In–Out вне видимого окна шкалы — отдалите масштаб.',
    videoTimelineMarkerStripAria: 'Фрагмент экспорта (In–Out): выделение мышью по дорожке',
    videoTimelineMarkerStripDragTitle:
      'Перетащите по дорожке, чтобы выделить фрагмент; короткий щелчок — перемотать к этому месту',
    videoTimelineUnifiedPaneAria:
      'Единая шкала времени и обрезка: щелчок — перемотка, перетаскивание — выделение фрагмента, края выделения — маркеры In и Out',
    videoTimelineUnifiedPaneHintTitle:
      'Щелчок — перемотка; перетаскивание — выделить фрагмент; у зелёной и красной линии — перетащите маркеры In/Out',
    videoTimelineInHandleDragTitle: 'Перетащите, чтобы сдвинуть маркер In (начало фрагмента)',
    videoTimelineOutHandleDragTitle: 'Перетащите, чтобы сдвинуть маркер Out (конец фрагмента)',
    videoTimelineIoAria: 'Маркеры In / Out',
    videoTimelineTrimReadoutTitle:
      'Диапазон для экспорта (раздел 7.1): передаётся в ffmpeg как -ss/-t',
    videoTimelineExportJumpTitle:
      'Открыть панель экспорта FFmpeg: вывод, превью команды (маркеры In/Out в -ss/-t)',
    videoTimelineExportJumpButton: 'Обрезать → экспорт',
    videoTimelineInHereTitle:
      'Поставить маркер In (начало фрагмента для экспорта) на текущее время воспроизведения',
    videoTimelineInHereButton: 'Поставить In',
    videoTimelineOutHereTitle:
      'Поставить маркер Out (конец фрагмента для экспорта) на текущее время воспроизведения',
    videoTimelineOutHereButton: 'Поставить Out',
    videoTimelineResetTrimTitle: 'Сбросить обрезку (весь файл)',
    videoTimelineResetTrimButton: 'Сбросить обрезку',
    videoTimelineToolbarAria: 'Таймлайн: In, Out, переход к экспорту, масштаб',
    videoTimelineToolbarIn: '← IN',
    videoTimelineToolbarOut: 'OUT →',
    videoTimelineToolbarTrim: 'Обрезать',
    videoTimelineBadgeInTemplate: 'IN: {t}',
    videoTimelineBadgeOutTemplate: 'OUT: {t}',
    videoTimelineBadgeInAriaTemplate: 'Маркер In, время {t}',
    videoTimelineBadgeOutAriaTemplate: 'Маркер Out, время {t}',
    videoTimelineTrimDurationToolbar: 'Длительность: {span}',
    videoTimelineToolbarCenterTitle:
      'Длительность выбранного фрагмента и текущая позиция воспроизведения',
    videoTimelineStartExport: 'Начать экспорт',
    videoTimelineStartExportTitle:
      'Экспортировать файл с текущими настройками FFmpeg (выбор папки)',
    videoTimelineSaveFrame: 'Сохранить кадр',
    videoTimelineSaveFrameBusy: 'Сохраняю кадр…',
    videoTimelineSaveFrameTitle:
      'Сохранить текущий кадр в отдельный файл. Формат (PNG/JPEG и т.д.) — в панели справа, раздел «Аудио и кадр».',
    videoTimelineFooterAria: 'Краткая сводка видео и звука по данным анализа файла',
    previewTransportToolbarAria: 'Транспорт предпросмотра',
    previewTransportMinusSecTitle: 'Минус {sec} с',
    previewTransportPlusSecTitle: 'Плюс {sec} с',
    previewTransportUnmuteTitle: 'Включить звук',
    timelineWaveformWebAudioUnavailable:
      'Аудиографика браузера (Web Audio API) недоступна в этом контексте.',
    timelineWaveformMediaResponseErrorTemplate: 'Ответ медиа: {status}',
    timelineWaveformDisabledLargeFile: 'Форма волны отключена для крупного файла (защита памяти).',
    timelineWaveformAudioLongerHintTemplate: 'Аудио ~{audioSec} с (видео {videoSec} с).',
    timelineWaveformDecodeFailedHint:
      'Не удалось построить форму волны (формат без доступного аудио или ошибка декодера).',
    timelineWaveformUnavailableLongTemplate:
      'Длинный клип (> {max} с) — форму волны не строим (защита памяти).',
    timelineWaveformAriaUnavailable: 'Форма волны недоступна',
    timelineWaveformAriaEnvelope: 'Огибающая формы волны',
    timelineWaveformLoading: 'Форма волны…',
    miniIconFolderOpen: 'Открыть файл',
    miniIconFolderOpenEllipsis: 'Открыть файл…',
    miniIconRefreshCw: 'Обновить',
    miniIconDownload: 'Загрузки',
    miniIconClipboardPaste: 'Вставить из буфера',
    miniIconPopOutWindow: 'Открыть отдельное окно загрузок',
    miniIconFilm: 'Инспектор',
    miniIconHome: 'Каталог по умолчанию',
    miniIconZoomOut: 'Уменьшить масштаб таймлайна',
    miniIconZoomIn: 'Увеличить масштаб таймлайна',
    miniIconCircleHelp: 'О программе',
    miniIconBook: 'База знаний',
    miniIconImage: 'Снимок кадра',
    miniIconSave: 'Экспорт',
    miniIconSettings: 'Пути к движкам',
    miniIconSun: 'Светлая тема',
    miniIconMoon: 'Тёмная тема',
    miniIconSkipBack: 'В начало',
    miniIconChevronLeft: 'Назад на 5 сек',
    miniIconChevronRight: 'Вперёд на 5 сек',
    miniIconSkipForward: 'В конец',
    miniIconPlay: 'Воспроизвести',
    miniIconPauseUi: 'Пауза',
    miniIconVolume2: 'Громкость',
    miniIconVolumeX: 'Без звука',
    miniIconMaximize2: 'Полноэкранный предпросмотр',
    miniIconRotateCcw: 'Шаг поворота против часовой (как FFmpeg §7.2)',
    miniIconRotateCw: 'Шаг поворота по часовой (как FFmpeg §7.2)',
    miniIconScissors: 'Следующий пресет обрезки crop (§7.2)',
    miniIconQueueChevronUp: 'Выше',
    miniIconQueueChevronDown: 'Ниже',
    miniIconQueuePlus: 'Добавить',
    miniIconQueueRetry: 'Повтор',
    miniIconQueueFile: 'Открыть файл',
    miniIconQueueOutbound: 'Открыть в редакторе',
    miniIconQueueTrash: 'Удалить из очереди',
    miniIconQueueX: 'Очистить'
  },
  en: {
    aboutTitle: 'About',
    appLabel: 'Application',
    versionLabel: 'Version',
    loading: 'Loading…',
    rendererLogWindowErrorFallback: 'Unknown window error',
    rendererLogUnhandledRejectionFallback: 'Unknown promise rejection',
    logsFolderButton: 'Logs folder',
    supportZipSaved: 'Support ZIP saved',
    supportZipButton: 'Support ZIP…',
    maintenanceSummaryButton: 'Temp size',
    maintenanceCleanButton: 'Clean temp',
    maintenanceCleanPreviewButton: 'Clean preview',
    maintenanceCleanPartialsButton: 'Clean .part',
    maintenanceCleanFfmpegTempButton: 'Clean ffmpeg temp',
    maintenanceConfirmButton: 'Confirm cleanup',
    maintenanceConfirmHintTemplate:
      '{label}: only temporary data will be removed. Click “Confirm cleanup” once more.',
    maintenanceCleanDoneTemplate: 'Cleaned: {files} files, {bytes}',
    maintenanceSummaryTemplate: 'Temporary data: {bytes}',
    maintenanceSummaryWithDetailsTemplate: 'Temporary data: {bytes} ({details})',
    formatSelectionDoc: 'Format selection',
    docLinkYtDlpReadme: 'yt-dlp README',
    docLinkFfprobeShort: 'ffprobe',
    aboutRuntimeElectronLabel: 'Electron',
    aboutRuntimeChromiumLabel: 'Chromium',
    aboutRuntimeNodeLabel: 'Node',
    aboutMainLogButton: 'main.log',
    aboutMainLogOpenErrorTemplate: 'main.log: {error}',
    aboutTooltipLogsFolder:
      'Open the app logs folder in the file manager — runtime logs and traces live there.',
    aboutTooltipMainLog:
      'Open the main process log (main.log) with your default text editor or viewer.',
    aboutTooltipSupportZip:
      'Build a diagnostics ZIP to a path you choose: versions, settings, paths. Handy for support or your own backup.',
    aboutTooltipMaintenanceSummary:
      'Show in the status line how much space preview cache, ffmpeg temp, and unfinished yt-dlp .part files use — no deletion yet.',
    aboutTooltipMaintenanceCleanAll:
      'Delete all app-managed temporary data. First click shows a hint; second click while the button reads “Confirm…” performs the wipe.',
    aboutTooltipMaintenanceCleanPreview:
      'Clear preview cache only. Two-step flow: hint first, then confirm.',
    aboutTooltipMaintenanceCleanPartials:
      'Remove unfinished yt-dlp .part / .ytdl artifacts in the download area. Two-step confirm.',
    aboutTooltipMaintenanceCleanFfmpegTemp:
      'Clear ffmpeg temp files created during exports. Two-step confirm.',
    aboutTooltipCloseAbout: 'Close the About dialog.',
    aboutKnowledgeSupportArticle: 'Help: logs and diagnostics',
    aboutKnowledgeSupportArticleTooltip:
      'Open the in-app article about logs, Support ZIP, and cleaning temporary files.',
    aboutMaintenanceCleanErrorTemplate: '{label}: {error}',
    byteSizeZero: '0 B',
    byteSizeUnitB: 'B',
    byteSizeUnitKiB: 'KiB',
    byteSizeUnitMiB: 'MiB',
    byteSizeUnitGiB: 'GiB',
    maintenanceSnapshotLabelPreviewCache: 'preview cache',
    maintenanceSnapshotLabelFfmpegTemp: 'ffmpeg temp',
    maintenanceSnapshotLabelYtdlpPartials: 'yt-dlp .part',
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
      ' — it expands to the current editor preview path (only when a file is already open via the dialog or DnD). While typing, the input shows compact IntelliSense: Up/Down, Home/End, PgUp/PgDn (step {pageStep}), Shift+Tab moves the selection up, Tab and Enter insert the active suggestion (up to {maxInline} items from the same catalog as the sidebar). The full catalog is in the right-hand panel: use “Filter hints”, click a row (when a hint has a full command line, it replaces the whole line). Each line in the output log has a “Copy” hover button (copies exactly that line). ',
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
    terminalHintsSearchPlaceholder: '--help, -i, crop',
    processingOutcomeSuccess: 'Done',
    processingOutcomeError: 'Error',
    processingOutcomeCancelled: 'Cancelled',
    processingHistoryTitle: 'Processing history',
    processingHistorySectionHint:
      'Recent ffmpeg exports, frame snapshots, and post-download auto-exports.',
    processingHistoryWeeklyAria: 'Seven-day processing summary',
    processingHistory7dPrefix: '7 days:',
    processingHistoryChipOk: 'OK',
    processingHistoryChipErrors: 'Errors',
    processingHistoryChipCancelled: 'Cancelled',
    processingHistoryChipTime: 'Time',
    processingHistoryKindAll: 'All types',
    processingHistoryKindExport: 'Export',
    processingHistoryKindSnapshot: 'Frames',
    processingHistoryKindAutoExport: 'Auto export',
    processingHistoryOutcomeAll: 'All outcomes',
    processingHistoryKindFilterAria: 'Processing type',
    processingHistoryOutcomeFilterAria: 'Outcome',
    processingHistoryQueryPlaceholder: 'File, codec, status, error',
    processingHistoryQueryAria: 'Search processing history',
    processingHistoryRefresh: 'Refresh',
    processingHistoryClear: 'Clear',
    processingHistoryExportJson: 'Export JSON',
    processingHistoryEmpty:
      'No entries yet. Finish an export or save a frame to see it listed here.',
    processingHistoryRepeat: 'Retry',
    processingHistoryOpenFile: 'File',
    processingHistoryOpenFolder: 'Folder',
    processingHistoryOpenPreview: 'Open in preview',
    processingHistoryExportDialogTitle: 'Export processing history',
    processingHistoryExportSaved: 'Processing history saved',
    processingHistoryOpenInputBusy: 'Opening source from history…',
    processingHistoryOpenInputDone: 'Source opened in the editor',
    processingHistoryOpenOutputPreviewDone: 'Output opened in preview',
    downloadsHistoryTitle: 'History',
    downloadsHistoryWeeklyAria: 'Seven-day downloads summary',
    downloadsHistory7dPrefix: '7 days:',
    downloadsHistoryChipOk: 'OK',
    downloadsHistoryChipErrors: 'Errors',
    downloadsHistoryChipCancelled: 'Cancelled',
    downloadsHistoryOutcomeFilterLabel: 'Outcome',
    downloadsHistoryFilterAll: 'All',
    downloadsHistoryFilterSuccess: 'Success',
    downloadsHistoryFilterError: 'Error',
    downloadsHistoryFilterCancelled: 'Cancelled',
    downloadsHistoryRefresh: 'Refresh',
    downloadsHistoryClear: 'Clear',
    downloadsHistoryExportJson: 'Export JSON',
    downloadsHistoryEmpty: 'No entries yet. Finished queue rows will appear here as they complete.',
    downloadsHistoryRepeat: 'Retry',
    downloadsHistoryOpenFile: 'File',
    downloadsHistoryOpenFolder: 'Folder',
    downloadsHistoryOpenInEditor: 'Open in editor',
    downloadsHistoryExportDialogTitle: 'Export download history',
    downloadsHistoryExportSaved: 'Download history saved',
    downloadsHistoryRepeatQueued: 'URL from history added to the queue',
    downloadsHistoryRepeatNotAdded: 'URL was not added',
    downloadsHistoryOpenHandlerPreparing:
      'Preparing file for the editor… a WebM preview may be created if needed.',
    downloadsHistoryOpenHandlerDone: 'File opened in the editor',
    downloadsLogTitle: 'Live log',
    downloadsLogSave: 'Save',
    downloadsLogEmpty: 'The log will appear after you start a yt-dlp queue row.',
    workspaceTabsAria: 'Workspace tabs',
    workspaceTabEditor: 'Editor',
    workspaceTabDownloads: 'Downloads',
    workspaceTabTerminal: 'Terminal',
    workspaceTabEditorTooltip:
      'Editor: open a video from your PC, preview it, pick a range on the timeline, and save a finished file. The FFmpeg panel on the right sets picture quality, audio, and file format.',
    workspaceTabDownloadsTooltip:
      'Downloads: a queue of links, a live log, and settings for how downloads work — quality, save folder, subtitles, and what to do when the network drops.',
    workspaceTabTerminalTooltip:
      'Terminal: run one command at a time for the built-in tools (processing and downloading). For the common “open a file and export” flow, use the Editor tab.',
    downloadsMainAria: 'Downloads tab',
    downloadsPageTitle: 'Downloads',
    downloadsPageHint:
      'This tab is the main yt-dlp desk (queue in the center, log and history under the table, settings on the right like v0; below ~1100px width the settings rail moves under the log with scrolling — fields stay reachable via “Scroll to settings” at the top). Pop-out is a second window with the same IPC and the full token reference list.',
    downloadsPopOut: 'Pop-out',
    downloadsScrollToSettings: 'Scroll to settings',
    downloadsUrlPlaceholder: 'One URL per line, or multiple URLs',
    downloadsUrlAria: 'URLs to append to the download queue',
    downloadsAddToQueue: 'Add to queue',
    downloadsStopQueue: 'Cancel download',
    downloadsStopQueueTooltip:
      'Stops only the current yt-dlp process. The URL queue is kept; start a row again with the triangle.',
    downloadsRemoveFinished: 'Remove finished',
    downloadsClearQueue: 'Clear queue',
    downloadsQueueClearedHint: 'Queue cleared.',
    downloadsFinishedRemovedTemplate: 'Removed finished rows: {n}',
    downloadsNoFinishedRowsHint: 'No finished rows to remove.',
    downloadsOverviewAria: 'Download queue summary',
    downloadsStatTotal: 'Total',
    downloadsStatPending: 'Pending',
    downloadsFilterBarAria: 'Queue status filter',
    downloadsQueueFilterAll: 'All',
    downloadsQueueFilterRunning: 'Running',
    downloadsQueueFilterDone: 'Done',
    downloadsQueueFilterError: 'Errors',
    downloadsQueueFilterCancelled: 'Cancelled',
    downloadsTableColNum: '#',
    downloadsTableColTitleUrl: 'Title / URL',
    downloadsTableColFormat: 'Format',
    downloadsTableColSize: 'Size',
    downloadsTableColProgress: 'Progress',
    downloadsTableColSpeed: 'Speed',
    downloadsTableColEta: 'ETA',
    downloadsTableColStatus: 'Status',
    downloadsTableColActions: 'Actions',
    downloadsEmptyQueue: 'Queue is empty. Add URLs in the field above.',
    downloadsEmptyFilter:
      'No rows match this filter. Change the status chips above or add new URLs.',
    downloadsQueueAriaMoveUp: 'Move up in queue',
    downloadsQueueAriaMoveDown: 'Move down in queue',
    downloadsQueueAriaRetryRow: 'Retry this download',
    downloadsQueueAriaStartRow: 'Download this row',
    downloadsQueueAriaOpenFile: 'Open downloaded file',
    downloadsQueueAriaOpenFolder: 'Show file in folder',
    downloadsQueueOpenDownloadDirTitle:
      'Open yt-dlp download folder (destination from settings; works before the download finishes)',
    downloadsQueuePauseUnsupportedOsTitle:
      'Pausing yt-dlp is not available on Windows (OS-level SIGSTOP/SIGCONT).',
    downloadsQueuePauseWaitingProcessTitle:
      'Pause becomes available once the yt-dlp process has started',
    downloadsQueueAriaOpenInEditor: 'Open downloaded file in FluxAlloy',
    downloadsQueueAriaResumeYtdlp: 'Resume yt-dlp',
    downloadsQueueAriaPauseYtdlp: 'Pause yt-dlp',
    downloadsQueueAriaRemoveRow: 'Remove from queue',
    quickYtdlpAria: 'Quick yt-dlp download',
    quickYtdlpSummary: 'Quick yt-dlp download',
    quickYtdlpPlaceholder: 'One URL per line (the button below uses the first recognized URL)',
    quickYtdlpHint:
      'The button below downloads the first recognized URL with your current yt-dlp settings and opens the finished file in this editor. You cannot run it while another download is active — wait or cancel it on the Downloads tab.',
    quickYtdlpDownloadOpenEditor: 'Download and open in editor',
    quickYtdlpDocFormats: 'Formats',
    quickYtdlpDocOutputTemplate: '-o template',
    downloadsRailAria: 'Download settings',
    downloadsRailTitle: 'yt-dlp settings',
    downloadsRailSubtitle:
      'Video quality, save folder, subtitles, after-download actions, and network behavior. Sections collapse; the same values apply in the pop-out downloads window.',
    downloadsRailIntroTooltip:
      'These fields affect upcoming downloads from the queue. Hover any switch, list, or button for a longer plain-language explanation.',
    downloadsRailFormatSummary: 'Format',
    downloadsRailFormatQualityLabel: 'Format / quality',
    downloadsFormatHint: '`-f` preset; with “Audio only”, video format presets are not applied.',
    downloadsPlaylistSpan: 'Full playlist',
    downloadsPlaylistPillLabel: 'Full playlist',
    downloadsPlaylistHint: '`--yes-playlist` instead of a single video.',
    downloadsAudioOnlySpan: 'Audio only',
    downloadsAudioOnlyPillLabel: 'Audio only',
    downloadsAudioOnlyHint: '`-x` when you need audio without a video track.',
    downloadsSubtitlesLabel: 'Subtitles',
    downloadsSubPresetNone: 'Do not download',
    downloadsSubPresetManual: 'Manual tracks',
    downloadsSubPresetManualAuto: 'Manual + auto',
    downloadsSubLangsHelp: 'A single `--sub-langs` token without spaces (e.g. ru,en or all).',
    downloadsSubLangsLabel: 'Subtitle languages',
    downloadsSubLangsPlaceholder: 'ru,en or all',
    downloadsRailMetadataSummary: 'Metadata',
    downloadsOpenAfterSuccessSpan: 'Open after success',
    downloadsOpenAfterSuccessPillLabel: 'Open after success',
    downloadsOpenAfterSuccessHint: 'Completed files open in the editor immediately.',
    downloadsAutoExportSpan: 'Auto-export after open',
    downloadsAutoExportPillLabel: 'Auto-export after open',
    downloadsAutoExportHint:
      'After a successful open — ffmpeg writes `…-export` next to the download (uses the export panel settings).',
    downloadsCookiesBrowserLabel: 'Browser cookies',
    downloadsCookiesBrowserNone: 'Do not use',
    downloadsYtdlpBrowserPrettyChrome: 'Chrome',
    downloadsYtdlpBrowserPrettyEdge: 'Edge',
    downloadsYtdlpBrowserPrettyFirefox: 'Firefox',
    downloadsYtdlpBrowserTokenChrome: 'chrome',
    downloadsYtdlpBrowserTokenEdge: 'edge',
    downloadsYtdlpBrowserTokenFirefox: 'firefox',
    downloadsImpersonateLabel: 'Client impersonation',
    downloadsImpersonateOff: 'Off',
    downloadsCookiesProfileLabel: 'Profile / container (browser cookies)',
    downloadsCookiesProfilePlaceholder: 'e.g. Default or Profile 1',
    downloadsCookiesProfileHint:
      'yt-dlp suffix after the colon: `--cookies-from-browser` `chrome:…` (do not type the browser prefix in this field).',
    downloadsCookiesFileGroupAria: 'yt-dlp cookies file',
    downloadsCookiesNetscapeHelp: 'Netscape cookies file',
    downloadsCookiesFileNotSelected: 'No file selected',
    downloadsCookiesFilePriorityHelp:
      'File cookies override browser cookies; only use trusted cookie exports.',
    downloadsRailPick: 'Select',
    downloadsRailSavingSummary: 'Saving',
    downloadsOutputDirAria: 'yt-dlp download directory',
    downloadsOutputDirLabel: 'Download directory',
    downloadsOutputPathLoading: 'Loading path…',
    downloadsOutputUseDefaultUserdata: 'Using the default directory under userData.',
    downloadsOutputUseCustom: 'Using a user-selected directory.',
    downloadsRailOpenFolder: 'Open',
    downloadsOutputDefaultButton: 'Default',
    downloadsFilenameTemplateLabel: 'Filename template',
    downloadsFilenameTemplateHelp: '`%(ext)s` is required; `..` path escapes are blocked.',
    downloadsRailNetworkSummary: 'Network',
    downloadsQueueRetryLabel: 'Queue row retry',
    downloadsQueueRetryHelp: 'Re-runs the whole queue row on a non-zero exit code.',
    downloadsRateLimitLabel: 'Rate limit',
    downloadsRateLimitPlaceholder: '500K or 2M',
    downloadsRateLimitHelp: 'Single safe token for download speed limiting.',
    downloadsYtdlpRetriesLabel: 'yt-dlp retries',
    downloadsYtdlpRetriesPlaceholder: '0–99',
    downloadsYtdlpRetriesHelp: 'yt-dlp `--retries`.',
    downloadsFragmentRetriesLabel: 'Fragment retries',
    downloadsFragmentRetriesPlaceholder: '0–99',
    downloadsFragmentRetriesHelp: 'HLS/DASH fragment retries.',
    downloadsRailExpertSummary: 'Expert & preview',
    downloadsExtraArgsLabel: 'Extra argv',
    downloadsExtraArgsHelp:
      'No shell: tokens as in the catalog; unsafe tokens are rejected in main.',
    downloadsHintCatalogIntro:
      'Short reference of flags below. Type part of a token or description, then click a flag — it is appended to “Extra arguments”. Each row includes a plain-language note.',
    downloadsHintCatalogFilterLabel: 'Search the argv catalog',
    downloadsHintSearchPlaceholder: 'e.g. --cookies or --sub',
    downloadsHintSearchAria: 'Search argv tokens and descriptions',
    downloadsHintListAria: 'Flag catalog with descriptions',
    downloadsHintsUnavailable: 'Catalog unavailable.',
    downloadsHintsNoMatches: 'No matches.',
    downloadsHintsSameAsPopoutHelp:
      'Same catalog as the download pop-out: search and list; click a flag to append the token to argv.',
    downloadsRailDocOutput: 'Output template',
    downloadsRailDocPostprocess: 'Post-processing',
    downloadsCommandPreviewHelp: 'Command preview (read-only)',
    downloadsOptionsLoading: 'Loading yt-dlp settings…',
    downloadsRailRefreshOptions: 'Reload settings',
    downloadsTooltipSectionFormat:
      'Default “what to download”: audio-only vs video+audio, whole playlist vs single item, subtitles and languages.',
    downloadsTooltipSectionMetadata:
      'After-download behavior, how to identify to the site, and optional login hints via browser cookies or a cookie file. Rarely needed until a site asks for sign-in.',
    downloadsTooltipSectionSaving:
      'Where files land on disk and how names are built. The built-in folder is safe; pick your own if you want everything in Downloads or another drive.',
    downloadsTooltipSectionNetwork:
      'Retry behavior and optional speed limits — spare your connection or ask the app to try harder on flaky Wi‑Fi.',
    downloadsTooltipSectionExpert:
      'Extra parameters for advanced users, a flag catalog, and a read-only command preview. Skip if normal downloads already work.',
    downloadsTooltipFormatPresetSelect:
      'A bundled profile for what to fetch: closer to source quality, smaller, or audio-only. When “Audio only” is on, video choices are ignored.',
    downloadsTooltipPlaylistSwitch:
      'If the URL is a playlist, turn this on to fetch the whole series; turn off for a single item only.',
    downloadsTooltipAudioOnlySwitch:
      'Save sound without a video track — lighter files for music or podcasts.',
    downloadsTooltipSubtitlesSelect:
      'Whether to pull text tracks with the video and how aggressively to match them. “Do not download” keeps things simpler and faster.',
    downloadsTooltipSubLangsInput:
      'Comma-separated subtitle languages or “all”. Leave empty or use “do not download” when subtitles are not needed.',
    downloadsTooltipOpenAfterSuccess:
      'After a successful download, open the file here so you can preview or export it immediately.',
    downloadsTooltipAutoExport:
      'After the file opens, automatically save a second file using the Editor FFmpeg panel — handy when you always need the same finished format.',
    downloadsTooltipCookiesBrowser:
      'Let the app reuse login cookies from the selected browser so private pages download like in your logged-in window. Avoid on shared PCs.',
    downloadsTooltipImpersonate:
      'Some sites vary quality by client type. Leave off unless you are troubleshooting a picky source.',
    downloadsTooltipCookiesProfile:
      'If the browser has multiple profiles, name the right one; otherwise the default profile is used. Often you can leave this blank.',
    downloadsTooltipCookiesPick:
      'Choose a cookie file you exported earlier. It overrides browser-based cookies when set.',
    downloadsTooltipCookiesClear:
      'Remove the chosen cookie file and fall back to browser or defaults.',
    downloadsTooltipOutputOpenFolder:
      'Open the current download folder in the file manager to inspect finished files.',
    downloadsTooltipOutputPick: 'Choose a different folder for upcoming downloads.',
    downloadsTooltipOutputDefault: 'Restore the app’s built-in download folder after experiments.',
    downloadsTooltipFilenameTemplate:
      'How output files are named — the template must leave room for the extension so different sites do not collide. Do not use “..” to jump out of the folder.',
    downloadsTooltipQueueRetrySelect:
      'How many times to restart the whole queue row after a non-zero failure — helpful on unstable networks.',
    downloadsTooltipRateLimitInput:
      'Cap download speed so the rest of the household keeps bandwidth. Leave empty for no limit.',
    downloadsTooltipRetriesInput: 'How many reconnect attempts before surfacing an error.',
    downloadsTooltipFragmentRetriesInput:
      'Same idea for small pieces of long streams — raise if big files stall mid-way.',
    downloadsTooltipExtraArgsTextarea:
      'Optional extra words for advanced tuning, as in the catalog below. Unsafe combinations are filtered for safety.',
    downloadsTooltipHintSearchInput:
      'Filter the list by token or description text. Click a flag in the list to append that token to “Extra arguments”.',
    downloadsTooltipRefreshFooter:
      'Reload settings from disk after changes in another window or manual edits.',
    enginesSummaryReady: 'Engines: ready',
    enginesSummaryMissing: 'Engines: not found',
    enginesSummaryError: 'Engines: check error',
    enginesSummaryChecking: 'Engines: checking…',
    engineDisplayNameFfmpeg: 'ffmpeg',
    engineDisplayNameFfprobe: 'ffprobe',
    engineDisplayNameYtdlp: 'yt-dlp',
    commonUnicodeEllipsis: '…',
    enginesVersionLineErrorMark: '!',
    uiPlaceholderDash: '—',
    commonNotApplicableShort: 'n/a',
    topbarProductName: 'FluxAlloy',
    topbarOpenFileTitle:
      'Pick a video from your PC — it appears in the preview and timeline for trimming and export.',
    topbarOpenFileLabel: 'Open',
    topbarInspectorTitle:
      'Separate window: full ffprobe summary (tracks, chapters, JSON) and TXT/HTML export. If a clip is already open in the editor, the same file is used.',
    topbarInspectorLabel: 'Inspector',
    topbarExportCancelTitle:
      'Stop the current save job; any partial output is removed. The source file on disk stays untouched.',
    topbarExportCancelBusy: 'Cancelling…',
    topbarExportCancelReady: 'Cancel export',
    topbarEnginesDownloadTitle:
      'Download missing built-in tools into your user app folder — handy on a fresh machine.',
    topbarEnginesDownloadBusy: 'Downloading…',
    topbarEnginesDownloadReady: 'Download engines',
    topbarEnginePathsTitle:
      'Point the app to custom tool locations if you do not want the bundled copies or auto-discovery.',
    topbarEnginePathsLabel: 'Engine paths',
    topbarKnowledgeLabel: 'Knowledge base',
    topbarAboutTitle: 'About and diagnostics',
    topbarAboutLabel: 'About',
    topbarThemeToggleTitle: 'Toggle dark / light theme',
    topbarThemeUseLight: 'Light theme',
    topbarThemeUseDark: 'Dark theme',
    topbarUiLocaleSwitchToEnglishTitle: 'Switch interface to English',
    topbarUiLocaleSwitchToRussianTitle: 'Switch interface to Russian',
    topbarUiLocaleVisuallyHiddenRu: 'Current interface language: Russian',
    topbarUiLocaleVisuallyHiddenEn: 'Current interface language: English',
    editorPreviewDropzoneAria: 'Preview area',
    editorPreviewVideoAriaTemplate: 'Preview: {name}',
    editorPreviewEmptyLead:
      'No source — drop a video here or use Open… in the File menu / the top button.',
    editorPreviewEmptyHint:
      'Local files stream via the fluxmedia scheme only after a dialog pick or Electron path DnD.',
    editorFfmpegRailShowTitle:
      'Expand the right-hand “save settings” panel: video/audio quality, site presets, and command preview.',
    editorFfmpegRailShowHidden: 'Expand FFmpeg settings panel',
    editorFfmpegRailRestoreLabel: 'FFmpeg',
    editorFfmpegSettingsAria: 'FFmpeg settings',
    editorFfmpegSettingsTitle: 'FFmpeg settings',
    editorFfmpegSettingsSubtitle:
      'Choose how the saved clip will look and sound. You can collapse sections to keep the screen tidy.',
    editorFfmpegRailCollapseTitle:
      'Collapse the save-settings panel for more preview and timeline space. Your values stay saved.',
    editorFfmpegRailCollapseHidden: 'Collapse FFmpeg settings panel',
    editorTooltipFfmpegPanelIntro:
      'This panel does not change the source file on disk — it only describes the result when you export or when an auto-export runs after a download. Adjust freely until you save.',
    editorTooltipSectionVideo:
      'Video: how the picture is compressed, packed into a file, and optional cleanup (banding, noise, color). Stronger effects usually mean longer waits.',
    editorTooltipSectionFormat:
      'Layout: frame size, frame rate, rotation, and crop. Useful to match a platform (square or widescreen) before saving.',
    editorTooltipSectionAudio:
      'Audio & frame snapshot: loudness and cleanup, a still frame export, subtitles, and optional container tags. You can turn the audio track off entirely.',
    editorTooltipSectionPresets:
      'Presets: ready-made bundles for popular sites plus your own saved combinations. Picking a preset fills all fields; you can still tweak manually.',
    editorTooltipSectionOutput:
      'Output: how the save command is built, where the app will suggest saving, and quick actions for the last result.',
    editorTooltipVideoCodec:
      'Pick the picture “engine”. One option is widely compatible; another can make smaller files at similar sharpness, but very old devices may struggle.',
    editorTooltipEncodePreset:
      'Trade-off between encoding time and file size/quality. “Smaller file” waits longer; “higher quality” is heavier and slower. The middle option fits most clips.',
    editorTooltipContainer:
      'The file “wrapper” type. Common choices open almost everywhere; one option is handy for Apple devices. If unsure, keep the default.',
    editorTooltipCrf:
      'Fine quality control without a hard size cap. Lower numbers look cleaner but weigh more; higher numbers shrink the file. “Use preset” follows the speed choice above.',
    editorTooltipVideoBitrate:
      'A hard cap on video data per second — predictable file size. When this is active, the separate quality slider above is not used.',
    editorTooltipResolution:
      'How tall the frame is. “Source” keeps the original size; other choices shrink the picture to make the file lighter.',
    editorTooltipFps:
      'Frames per second in the saved clip. “Source” keeps the original rate; fixed values help when a site asks for exactly 30 or 25 fps.',
    editorTooltipRotation:
      'Rotate or mirror the whole frame before saving — handy for sideways footage or reflections.',
    editorTooltipCrop:
      'Cut edges using a template (square, widescreen, etc.) before compression. The original file on disk stays untouched.',
    editorTooltipAacBitrate:
      'How rich the saved audio is. Higher values sound fuller but increase size. Mid values are enough for speech and simple edits.',
    editorTooltipSnapshotFormat:
      'How a single captured frame is saved: maximum sharpness without compression, or a smaller JPEG.',
    editorTooltipUserPresetSelectFallback:
      'Pick a row to load a full set of fields. Built-in presets show a short description under the cursor; you create your own with “+ Preset”.',
    editorTooltipPresetAdd:
      'Save the current panel fields under a new name — handy for several recurring workflows.',
    editorTooltipPresetRename:
      'Rename the selected custom preset. Built-in names are fixed and update with the app.',
    editorTooltipPresetOverwrite:
      'Overwrite the selected custom preset with the current fields when you have tuned settings and want to refresh the saved profile.',
    editorTooltipPresetDelete:
      'Remove the selected custom preset from the list. Built-in rows cannot be deleted.',
    editorTooltipExportCommandPreview:
      'Shows the steps the app will run when saving — for transparency. You can copy the line if you need the same steps elsewhere.',
    editorTooltipExportLastFile:
      'Open the last saved clip in the same preview to quickly check the result.',
    editorTooltipExportLastFolder:
      'Open the folder that contains the last saved clip — for example to drag the file into a messenger.',
    editorTooltipCopyExportPath:
      'Copy the full path of the last saved clip to the clipboard for another app.',
    editorTooltipExportOpenPreview:
      'Open the last saved clip again in this preview without hunting for the file.',
    editorTooltipSnapshotLastFile: 'Open the last saved frame snapshot separately from the video.',
    editorTooltipSnapshotLastFolder: 'Show the folder of the last frame snapshot.',
    editorTooltipSnapshotCopyPath: 'Copy the path of the last frame snapshot.',
    editorTooltipTwoPass:
      'Two-pass mode first scans the whole clip, then writes with steadier file size. It only makes sense with a fixed video bitrate and a compatible codec; expect roughly double the wait.',
    editorTooltipNoAudio:
      'Turn on for picture-only output — no sound in the saved file. Useful for bumpers or when you will add audio later elsewhere.',
    editorTooltipStripMetadata:
      'Remove hidden tags like title, artist, or cover art from the finished file. Some sites ask for this, or you may want less personal data in the file.',
    editorTooltipStripChapters:
      'Remove chapter markers so the file plays as one continuous stream without sections in the player.',
    editorFfmpegSectionVideo: 'Video',
    editorFfmpegSectionVideoHint:
      'How heavy the finished video will be: compression style, file packaging, and optional picture cleanup.',
    editorFieldVideoCodec: 'Video codec',
    editorAriaVideoCodecExport: 'How the picture is compressed when saving',
    editorFieldEncodePreset: 'Speed and default quality',
    editorAriaEncodePresetExport: 'How long saving runs and how tightly the picture is packed',
    editorFieldContainer: 'File type',
    editorAriaContainerExport: 'How the finished clip is packaged',
    editorFieldCrf: 'Fine quality',
    editorAriaCrfExport: 'Fine-grained picture quality',
    editorCrfOptionPreset: 'Match the speed preset',
    editorFieldVideoBitrate: 'Video size cap',
    editorAriaVideoBitrateExport: 'Hard limit on video data per second',
    editorVideoBitrateOptionCrf: 'No hard cap (use the quality slider above)',
    editorFieldDeinterlace: 'Comb smoothing',
    editorAriaDeinterlace: 'Smooth interlaced video',
    editorHintDeinterlace:
      'Older TV/camera footage sometimes stores alternating lines — motion shows thin “combs”. The first mode removes them with little change to smoothness; the second is smoother but can change how motion feels.',
    editorFieldDenoise: 'Denoise',
    editorAriaDenoise: 'Reduce noise',
    editorHintDenoise:
      'Removes speckle and color grain, especially in shadows. Stronger settings clean more but can soften fine hair, fabric, or text.',
    editorFieldDeband: 'Reduce banding',
    editorAriaDeband: 'Smooth color steps',
    editorHintDeband:
      'Skies, walls, and shadows sometimes show steps instead of smooth gradients. This softens those steps; strong modes can slightly blur very fine detail.',
    editorFieldHisteq: 'Brightness balance',
    editorAriaHisteq: 'Overall brightness balance',
    editorHintHisteq:
      'When the whole frame feels too dark or blown out, this gently rebalances light. It is a global pass, not full manual color grading.',
    editorFieldLut3d: 'Color look',
    editorAriaLut3d: 'Preset color look',
    editorHintLut3d:
      'Built-in cinematic looks — warmer, cooler, or punchier without tweaking many sliders. Off returns the original colors.',
    editorFieldSharpen: 'Sharpen',
    editorAriaSharpen: 'Edge sharpening',
    editorHintSharpen:
      'Makes edges a bit crisper. Mild is subtle; strong can add bright halos around sharp edges.',
    editorFieldEq: 'Color',
    editorAriaEq: 'Simple color moods',
    editorHintEq:
      'Quick moods: warmer, cooler, brighter, or softer — handy for vibe without graphs.',
    editorFieldHue: 'Hue & saturation',
    editorAriaHue: 'Hue shift and saturation',
    editorHintHue:
      'Nudges the overall color cast or boosts saturation — useful if the image feels dull or overly neon.',
    editorFieldGrain: 'Film grain',
    editorAriaGrain: 'Grain overlay',
    editorHintGrain:
      'Adds subtle texture like film stock. Nice for stylized looks; usually off for clean documentary footage.',
    editorFieldVignette: 'Vignette',
    editorAriaVignette: 'Edge darkening',
    editorHintVignette:
      'Darkens corners to draw the eye to the center. Strong vignettes noticeably close in the frame.',
    editorFieldBlur: 'Blur',
    editorAriaBlur: 'Light blur',
    editorHintBlur:
      'Softens detail evenly — like a slight missed focus. Can flatter portraits; usually bad for on-screen text.',
    editorFfmpegSectionFrameLayout: 'Layout',
    editorFfmpegSectionFrameLayoutHint:
      'Frame size, frames per second, rotation, and crop before compression — match a platform before saving.',
    editorFieldResolution: 'Resolution',
    editorAriaResolutionExport: 'Output frame size',
    editorFieldFps: 'Frames per second',
    editorAriaFpsExport: 'Frame rate in the saved file',
    editorFpsOptionSource: 'Match source',
    editorExportFpsOptionTemplate: '{value} fps',
    editorTwoPassSpan: 'Two-pass',
    editorTwoPassPillLabel: 'Two-pass encoding',
    editorTwoPassHint:
      'Only works with the widely compatible video format plus a fixed video size cap above. If you rely only on the fine quality slider or a space-saving format, the switch stays disabled.',
    editorFieldRotation: 'Rotate',
    editorAriaRotationExport: 'Rotate or mirror',
    editorFieldCrop: 'Crop',
    editorAriaCropExport: 'Crop template',
    editorFfmpegSectionAudio: 'Audio & frame',
    editorFfmpegSectionAudioHint:
      'Audio track, loudness, separate frame snapshots, and subtitle behavior in the finished file.',
    editorNoAudioSpan: 'No audio',
    editorNoAudioPillLabel: 'No audio',
    editorNoAudioHint:
      'Turn on when the saved file should have no sound at all — bumpers or prep for voice-over elsewhere.',
    editorFieldAacBitrate: 'Audio quality',
    editorAriaAacBitrate: 'How rich the saved audio is',
    editorFieldAudioGain: 'Audio gain',
    editorAriaAudioGain: 'Loudness shift',
    editorHintAudioGain:
      'Boosts or lowers the entire track. Ignored when “No audio” is enabled above.',
    editorFieldAudioNormalize: 'Loudness leveling',
    editorAriaAudioNormalize: 'Automatic loudness leveling',
    editorHintAudioNormalize:
      'Pulls quiet and loud parts closer in perceived volume. “Broadcast” aims for steady radio-like levels; “dynamic” gently lifts whispers but can slightly change the “live” feel.',
    editorFieldSnapshotFormat: 'Snapshot format',
    editorAriaSnapshotFormat: 'Still frame format',
    editorStripMetadataSpan: 'Strip metadata',
    editorStripMetadataPillLabel: 'Remove hidden file tags',
    editorStripMetadataHint:
      'Removes title, artist, cover art, and other hidden tags players show as “file info”.',
    editorStripChaptersSpan: 'Strip chapters',
    editorStripChaptersPillLabel: 'Remove in-file chapters',
    editorStripChaptersHint:
      'Removes chapter jump points; the video/audio itself is not cut — only navigation markers.',
    editorFieldExportSubtitles: 'Subtitles',
    editorAriaExportSubtitles: 'Keep text subtitles or not',
    editorHintExportSubtitles:
      '“Do not keep” usually leaves only picture and sound. “Keep” tries to carry text subtitles; a few file types cannot hold them, so the track may still disappear.',
    editorSnapshotLastFile: 'Snapshot file',
    editorSnapshotLastFolder: 'Folder',
    editorCopy: 'Copy',
    editorPillSwitchOn: 'On',
    editorPillSwitchOff: 'Off',
    appDialogCancel: 'Cancel',
    appDialogSave: 'Save',
    editorExportEncodeBalance: 'Balanced',
    editorExportEncodeSmaller: 'Smaller file',
    editorExportEncodeQuality: 'Quality',
    editorExportCodecH264: 'H.264 (libx264)',
    editorExportCodecH265: 'H.265 (libx265)',
    editorExportCodecVp9: 'VP9 (libvpx-vp9, MKV only)',
    editorExportCodecSvtav1: 'AV1 (libsvtav1, MKV only)',
    editorExportCodecAomav1: 'AV1 (libaom-av1, MKV only)',
    editorExportAutoContainerMkv: 'Container switched to MKV (VP9/AV1 CPU).',
    editorExportCodecHwAuto: 'Auto (best H.264/AV1 HW or CPU)',
    editorExportCodecHwAutoBadge: 'AUTO',
    editorExportCodecHwAutoBadgeTitle:
      'At export: NVENC → AMF → QSV → VideoToolbox → VAAPI (H.264), then AV1 NVENC/AMF/QSV, else libx264.',
    editorExportCodecHwAutoHevc: 'Auto HEVC (best HEVC/AV1 HW or libx265)',
    editorExportCodecHwAutoHevcBadge: 'AUTO HEVC',
    editorExportCodecHwAutoHevcBadgeTitle:
      'At export: HEVC NVENC → AMF → QSV → VideoToolbox → VAAPI, then AV1 NVENC/AMF/QSV, else libx265.',
    editorExportHwaccelsTitle: 'Hardware acceleration (ffmpeg -hwaccels)',
    editorExportContainerMp4: 'MP4',
    editorExportContainerMkv: 'MKV',
    editorExportContainerMov: 'MOV',
    editorExportScaleSource: 'Source size',
    editorExportScale480p: '480p',
    editorExportScale720p: '720p',
    editorExportScale1080p: '1080p',
    editorExportTransformNone: 'Rotate: none',
    editorExportTransformCw90: '↻ 90°',
    editorExportTransformCcw90: '↺ 90°',
    editorExportTransformR180: '180°',
    editorExportTransformHflip: 'Mirror H',
    editorExportTransformVflip: 'Mirror V',
    editorExportCropNone: 'Crop: none',
    editorExportCropCenterSquare: 'Crop 1:1',
    editorExportCropCenter169: 'Crop 16:9',
    editorExportCropCenter43: 'Crop 4:3',
    editorExportAudioGainM12: '−12 dB',
    editorExportAudioGainM9: '−9 dB',
    editorExportAudioGainM6: '−6 dB',
    editorExportAudioGainM3: '−3 dB',
    editorExportAudioGain0: '0 dB (off)',
    editorExportAudioGainP3: '+3 dB',
    editorExportAudioGainP6: '+6 dB',
    editorExportAudioGainP9: '+9 dB',
    editorExportAudioGainP12: '+12 dB',
    editorExportSubtitleDrop: 'Do not keep',
    editorExportSubtitleCopy: 'Keep (copy / mov_text)',
    editorExportDeinterlaceOff: 'Deinterlace: off',
    editorExportDeinterlaceFrame: 'Frame (yadif send_frame)',
    editorExportDeinterlaceField: 'Field (yadif send_field, 2×)',
    editorExportDenoiseOff: 'Denoise: off',
    editorExportDenoiseLight: 'Light (hqdn3d=1.5)',
    editorExportDenoiseMedium: 'Medium (hqdn3d=3)',
    editorExportDenoiseStrong: 'Strong (hqdn3d=5)',
    editorExportSharpenOff: 'Sharpen: off',
    editorExportSharpenLight: 'Light (unsharp 0.6)',
    editorExportSharpenMedium: 'Medium (unsharp 1.0)',
    editorExportSharpenStrong: 'Strong (unsharp 1.5)',
    editorExportDebandOff: 'Deband: off',
    editorExportDebandLight: 'Light (range=12)',
    editorExportDebandMedium: 'Medium (range=20)',
    editorExportDebandStrong: 'Strong (range=28)',
    editorExportHisteqOff: 'Histeq: off',
    editorExportHisteqLight: 'Light (strength 0.14)',
    editorExportHisteqMedium: 'Medium (strength 0.26)',
    editorExportHisteqStrong: 'Strong (strength 0.40)',
    editorExportLut3dOff: '3D LUT: off',
    editorExportLut3dFilmWarm: 'Film warmer (lut3d)',
    editorExportLut3dFilmCool: 'Film cooler (lut3d)',
    editorExportLut3dPunch: 'Punchy contrast (lut3d)',
    editorExportEqOff: 'Color: off',
    editorExportEqWarm: 'Warmer',
    editorExportEqCool: 'Cooler',
    editorExportEqVivid: 'More vivid',
    editorExportEqFlat: 'Softer / flat',
    editorExportHueOff: 'Hue: off',
    editorExportHueWarmShift: 'Shift warmer',
    editorExportHueCoolShift: 'Shift cooler',
    editorExportHueSatBoost: 'Saturation +',
    editorExportGrainOff: 'Grain: off',
    editorExportGrainLight: 'Light (noise 2)',
    editorExportGrainMedium: 'Medium (noise 5)',
    editorExportGrainStrong: 'Strong (noise 9)',
    editorExportVignetteOff: 'Vignette: off',
    editorExportVignetteLight: 'Light (PI/3)',
    editorExportVignetteMedium: 'Medium (PI/5)',
    editorExportVignetteStrong: 'Strong (PI/10)',
    editorExportBlurOff: 'Blur: off',
    editorExportBlurLight: 'Light (gblur σ=1)',
    editorExportBlurMedium: 'Medium (gblur σ=2.5)',
    editorExportBlurStrong: 'Strong (gblur σ=5)',
    editorExportAudioNormOff: 'Normalization: off',
    editorExportAudioNormLoudnorm: 'EBU R128 (loudnorm)',
    editorExportAudioNormDynaudnorm: 'Dynamic (dynaudnorm)',
    editorExportSnapshotPng: 'PNG frame',
    editorExportSnapshotJpg: 'JPEG frame',
    editorExportUserPresetsMaxStatus:
      'At most 8 custom presets (built-in platform presets do not count).',
    editorExportUserPresetsMaxTotalStatus:
      'The preset list in settings is full — remove or clean up entries.',
    editorExportPresetDefaultName: 'My preset',
    editorExportPresetDialogTitleCreate: 'New export preset',
    editorExportPresetDialogTitleRename: 'Preset name',
    editorExportPresetDialogHint:
      'The name is stored only in FluxAlloy settings and helps you return quickly to this FFmpeg parameter set.',
    editorExportPresetNameLabel: 'Name',
    editorExportPresetErrorEmpty: 'Enter a preset name.',
    editorExportPresetErrorMax: 'At most 8 custom presets (built-ins do not count).',
    editorExportPresetErrorMaxTotal: 'The preset list in settings is full.',
    editorEnginePathsDialogTitle: 'Engine paths',
    editorEnginePathsDialogHint:
      'A full path to each executable overrides the bundled directory and downloads in userData/bin. Leave empty and save to reset to auto-discovery.',
    editorEnginePathPlaceholderAuto: 'Auto',
    editorEnginePathBrowse: 'Browse…',
    editorEnginePathClear: 'Clear',
    editorEnginePathsRemoveDownloadedTooltip:
      'Remove only downloaded copies from userData/bin. Bundled resources/bin and manual paths are untouched.',
    editorEnginePathsRemoveDownloaded: 'Remove downloaded',
    statusTerminalCliExitOk: 'CLI: exit code {code}',
    statusTerminalCliFailed: 'CLI: {error}',
    statusTerminalOutputLineCopied: 'Output line copied',
    statusTerminalOutputLineCopyFailed: 'Could not copy output line',
    statusVideoMediaErrAborted: 'aborted',
    statusVideoMediaErrNetwork: 'network error',
    statusVideoMediaErrDecode: 'decode error',
    statusVideoMediaErrSrcNotSupported: 'format not supported',
    statusVideoMediaErrUnknown: 'unknown error',
    statusVideoPlayFailed: 'Could not play video: {detail}',
    statusVideoDirectOpenFailedBlobTrying: 'Direct playback failed; trying a safe blob fallback…',
    statusVideoBlobFallbackActive: 'Switched preview to blob fallback.',
    statusVideoPlayFailedAfterFallback:
      'Could not play video: {detail}; blob fallback also failed.',
    statusPreviewProbeFailedTemplate: 'ffprobe metadata unavailable: {error}',
    statusDownloadsUrlsAdded: 'Added URLs: {n}',
    statusDownloadsQueueNoUrlsParsed: 'No URLs found for the queue.',
    statusDownloadOpenEditorWorking: 'Downloading the first URL from the field…',
    statusDownloadOpenEditorSuccess: 'File opened in the editor.',
    statusDownloadOpenEditorNeedUrl: 'Enter a URL in the field above.',
    statusExportProgress: 'Export · {tail}',
    statusEnginesDownloadPreparing: 'Preparing download…',
    statusErrorWithDetail: 'Error: {detail}',
    statusEnginesDownloadedOk: 'Engines downloaded',
    statusEnginesDownloadFailedGeneric: 'Engine download failed',
    statusEnginesClearingUserBin: 'Removing downloaded engines from userData/bin…',
    statusEnginesUserBinRemovedCount: 'Removed downloaded engine files: {n}',
    statusEnginesUserBinNothingRemoved: 'No downloaded engines in userData/bin',
    statusEnginesClearUserBinFailedGeneric: 'Could not remove downloaded engines',
    statusEnginePathsSaved: 'Engine paths saved',
    statusSnapshotInProgress: 'Capturing frame…',
    statusSnapshotSaved: 'Frame saved: {name}',
    statusSnapshotFailedWithDetail: 'Frame: {detail}',
    statusSnapshotFailedGeneric: 'Frame: error',
    statusSnapshotExceptionGeneric: 'Frame capture error',
    statusExportPreparing: 'Preparing export…',
    statusExportSaved: 'Export finished: {name}',
    statusExportCancelled: 'Export cancelled',
    statusExportFailedWithDetail: 'Export: {detail}',
    statusExportFailedGeneric: 'Export: error',
    statusExportExceptionGeneric: 'Export error',
    statusExportCancelling: 'Cancelling export…',
    statusExportOpenedInPreview: 'Export opened in preview',
    statusExportPathCopied: 'Export path copied',
    statusExportPathCopyFailed: 'Could not copy export path',
    statusSnapshotPathCopied: 'Frame path copied',
    statusSnapshotPathCopyFailed: 'Could not copy frame path',
    statusFfmpegCommandCopied: 'ffmpeg command copied',
    statusFfmpegCommandCopyFailed: 'Could not copy ffmpeg command',
    statusDndGrantFailed: 'Drag-and-drop: {error}',
    downloadsQueueRowStatusWaiting: 'Waiting',
    downloadsQueueRowStatusRunning: 'Downloading…',
    downloadsQueueRowStatusDone: 'Done',
    downloadsQueueRowStatusCancelled: 'Cancelled',
    downloadsQueueRowStatusRetryTemplate: 'Retry pause ({cur}/{max})…',
    downloadsQueueRowStatusRetryUnknown: 'Retry pause',
    editorFfmpegSectionPresets: 'Presets',
    editorFfmpegSectionPresetsHint:
      'Built-ins for TikTok, YouTube, Shorts, VK, Reels, Telegram, Discord, iPhone, and archive, plus your saved mixes. Built-in rows cannot be renamed or deleted.',
    editorFieldUserPreset: 'User preset',
    editorAriaUserPreset: 'User export preset',
    editorUserPresetPlaceholder: 'Preset: —',
    editorPresetAdd: '+ Preset',
    editorPresetRename: 'Rename',
    editorPresetOverwrite: 'Overwrite',
    editorPresetDelete: 'Delete',
    editorBuiltinPresetLockedHint:
      'Built-in presets cannot be renamed, overwritten, or deleted — save your own preset.',
    editorFfmpegSectionOutput: 'Output',
    editorFfmpegSectionOutputHint:
      'See how the save command is built; the Export button opens a Save dialog; below are quick actions for the last finished file.',
    editorExportCommandPreviewSummary: 'Save command preview',
    editorAriaExportFfmpegCommand: 'Save command text',
    editorCopyFfmpegCommandTitle:
      'Copy the command text to the clipboard — handy to rerun manually or share with support.',
    editorExportLastFile: 'File',
    editorExportLastFolder: 'Folder',
    editorCopyExportPath: 'Copy path',
    editorExportPreviewPass1: '# Pass 1',
    editorExportPreviewPass2: '# Pass 2',
    editorExportPreviewHintNoSource:
      'No source selected — preview uses <input>/<output> placeholders.',
    editorExportPreviewHintTwoPass:
      'Two-pass: only the second pass writes the output file; see main for passlog temp paths.',
    editorExportPreviewHintTrimAppliedTemplate: 'In/Out markers applied: -ss {in} -t {t}.',
    editorExportPreviewHintTrimFull:
      'Markers cover almost the entire file — ffmpeg runs without -ss/-t.',
    editorExportPreviewHintTrimWaiting: 'In/Out markers appear once the timeline reports a range.',
    inspectorStandaloneBrandAria: 'FluxAlloy inspector',
    inspectorStandaloneHeaderTitle: 'Inspector',
    inspectorStandaloneTopbarEngineLabel: 'ffprobe',
    inspectorStandaloneOpenPickTitle: 'Pick a local media file (same allowlist as preview)',
    inspectorStandaloneOpenVisuallyHidden: 'Open file…',
    inspectorStandaloneFfprobeRefreshTitle: 'Run ffprobe again for the current file',
    inspectorStandaloneFfprobeRefreshDisabledTitle: 'No file to refresh',
    inspectorStandaloneFfprobeRefreshVisuallyHidden: 'Refresh ffprobe',
    inspectorStandaloneAboutDiagnosticsTitle: 'About and quick diagnostics actions',
    inspectorStandaloneThemeToggleTitle: 'Toggle theme (in sync with the main window)',
    inspectorStandaloneEmptyHint:
      'Drop a video file here or click “Open…”. When launched from the menu, the last preview file is used if it is still on disk.',
    inspectorWindowDocumentTitle: 'FluxAlloy — Inspector',
    probePanelAriaLabel: 'Extended ffprobe summary',
    probePanelOverviewHint:
      'Collapsible sections: export a text/HTML summary, track and chapter tables, raw ffprobe JSON; tables offer a context menu and copying cell values.',
    probeDurationUnknown: 'duration unknown',
    probeDurationSecShort: '{sec} s',
    probeDurationClockApprox: '{clock} · {total} s',
    probeSummaryAudioFragmentTemplate: ' · audio {codec}',
    probeBitrateMbpsTemplate: '{value} Mb/s',
    probeBitrateKbpsTemplate: '{value} kb/s',
    probeFfprobeDocLink: 'ffprobe documentation (all options)',
    probeClipboardCopied: 'Copied to clipboard',
    probeClipboardCopyFailed: 'Copy failed',
    probeSaveJsonDialogTitle: 'Save ffprobe JSON',
    probeSaveSummaryTxtDialogTitle: 'Save ffprobe summary (TXT)',
    probeSaveSummaryHtmlDialogTitle: 'Save ffprobe summary (HTML)',
    probeSavedPathTemplate: 'Saved: {path}',
    probeSectionExportSummary: 'Export summary (TXT / HTML)',
    probeSectionExportSummaryHint:
      'Plain text or HTML with an ffprobe summary (a readable outline and key stream fields).',
    probeSaveSummaryTxtButton: 'Save summary as TXT…',
    probeSaveSummaryHtmlButton: 'Save summary as HTML…',
    probeSectionTracksTemplate: 'Tracks ({count})',
    probeTracksCaption: 'Media streams from ffprobe',
    probeTrackRowMenuHint: 'Right-click, Enter, or Shift+F10 — track actions',
    probeThIndex: '#',
    probeThType: 'Type',
    probeThCodec: 'Codec',
    probeThPixFmt: 'Pix_fmt',
    probeThSar: 'SAR',
    probeThDar: 'DAR',
    probeThColorSpace: 'Color space',
    probeThPrimaries: 'Primaries',
    probeThTransfer: 'Transfer',
    probeThRange: 'Range',
    probeThBitrate: 'Bitrate',
    probeThDisposition: 'Disposition',
    probeThLanguage: 'Language',
    probeThTrackTitle: 'Title',
    probeThDetails: 'Details',
    probeTrackKindVideo: 'Video',
    probeTrackKindAudio: 'Audio',
    probeTrackKindSubtitle: 'Subtitles',
    probeTrackKindAttachment: 'Attachment',
    probeTrackKindData: 'Data',
    probeTrackKindOther: 'Other',
    probeChapterDurationSecTemplate: '{dur} s',
    probeSectionChaptersTemplate: 'Chapters ({count})',
    probeChaptersCaption: 'Chapters from ffprobe',
    probeChapterRowMenuHint: 'Right-click, Enter, or Shift+F10 — chapter actions',
    probeThChapterId: 'id',
    probeThChapterStart: 'Start',
    probeThChapterEnd: 'End',
    probeThChapterDuration: 'Duration',
    probeThChapterTitle: 'Title',
    probeSectionRawJson: 'ffprobe JSON',
    probeRawJsonHint: 'Read-only output; copy or save it for support or an external parser.',
    probeCopyJsonButton: 'Copy JSON',
    probeSaveJsonButton: 'Save JSON…',
    probeRawJsonPreAria: 'Raw ffprobe JSON',
    probeContextMenuAria: 'ffprobe row actions',
    probeCtxCopyRowTab: 'Copy row (tab-separated)',
    probeCtxCopyCodec: 'Copy codec',
    probeCtxCopyPixFmt: 'Copy pix_fmt',
    probeCtxCopySar: 'Copy SAR',
    probeCtxCopyDar: 'Copy DAR',
    probeCtxCopyColorSpace: 'Copy color_space',
    probeCtxCopyColorPrimaries: 'Copy color_primaries',
    probeCtxCopyColorTransfer: 'Copy color_transfer',
    probeCtxCopyColorRange: 'Copy color_range',
    probeCtxCopyBitrate: 'Copy bitrate',
    probeCtxCopyDisposition: 'Copy disposition',
    probeCtxCopyDetail: 'Copy details',
    probeCtxCopyLanguage: 'Copy language',
    probeCtxCopyTrackTitle: 'Copy stream title',
    probeCtxCopyChapterTitle: 'Copy title',
    videoTimelineZoomRowAria: 'Timeline zoom',
    videoTimelineZoomOutTitle: 'Zoom out (show a longer time range)',
    videoTimelineZoomInTitle: 'Zoom in for finer scrubbing',
    videoTimelineZoomReadoutTitle: 'Visible scrub range and marker strip',
    videoTimelineZoomReadoutTemplate: 'Scale ×{mul} · {start} — {end}',
    videoTimelineRulerAria: 'Playback window time ruler: click or arrow keys to seek',
    videoTimelineRulerValuetextTemplate: '{current} in window {winStart} — {winEnd}',
    videoTimelineMediaFactsAria: 'ffprobe media summary and playhead',
    videoTimelineVideoStreamTitle: 'First ffprobe video stream',
    videoTimelineVideoLabel: 'Video:',
    videoTimelineAudioStreamTitle: 'First ffprobe audio track',
    videoTimelineAudioLabel: 'Audio:',
    videoTimelinePositionTitle:
      'Current time; frame index estimated from stream frame rate in the track row',
    videoTimelinePositionLabel: 'Position:',
    videoTimelineFrameApproxSuffixTemplate: ' · frame ~{frame}',
    videoTimelineMarkersOutsideWindowTitle: 'In/Out is outside the current window — zoom out.',
    videoTimelineMarkerStripAria: 'Export range (In–Out): drag on the track to select',
    videoTimelineMarkerStripDragTitle:
      'Drag on the track to select a range; a short click seeks to that time',
    videoTimelineUnifiedPaneAria:
      'Unified time ruler and trim: click to seek, drag to select a range, drag the green/red trim lines for In/Out',
    videoTimelineUnifiedPaneHintTitle:
      'Click to seek; drag to select a range; drag the green and red trim lines to move In/Out',
    videoTimelineInHandleDragTitle: 'Drag to move the In marker (export range start)',
    videoTimelineOutHandleDragTitle: 'Drag to move the Out marker (export range end)',
    videoTimelineIoAria: 'In / Out markers',
    videoTimelineTrimReadoutTitle: 'Export range (section 7.1): passed to ffmpeg as -ss / -t',
    videoTimelineExportJumpTitle:
      'Open the FFmpeg export panel: output and command preview (In/Out as -ss/-t)',
    videoTimelineExportJumpButton: 'Trim → export',
    videoTimelineInHereTitle: 'Set the In marker (export range start) to the current playhead time',
    videoTimelineInHereButton: 'Set In',
    videoTimelineOutHereTitle: 'Set the Out marker (export range end) to the current playhead time',
    videoTimelineOutHereButton: 'Set Out',
    videoTimelineResetTrimTitle: 'Reset trim (full file)',
    videoTimelineResetTrimButton: 'Reset trim',
    videoTimelineToolbarAria: 'Timeline: In, Out, jump to export, zoom',
    videoTimelineToolbarIn: '← IN',
    videoTimelineToolbarOut: 'OUT →',
    videoTimelineToolbarTrim: 'Trim',
    videoTimelineBadgeInTemplate: 'IN: {t}',
    videoTimelineBadgeOutTemplate: 'OUT: {t}',
    videoTimelineBadgeInAriaTemplate: 'In marker at {t}',
    videoTimelineBadgeOutAriaTemplate: 'Out marker at {t}',
    videoTimelineTrimDurationToolbar: 'Duration: {span}',
    videoTimelineToolbarCenterTitle: 'Selected range duration and current playback position',
    videoTimelineStartExport: 'Start export',
    videoTimelineStartExportTitle: 'Export with current FFmpeg settings (pick save location)',
    videoTimelineSaveFrame: 'Save frame',
    videoTimelineSaveFrameBusy: 'Saving frame…',
    videoTimelineSaveFrameTitle:
      'Save the current frame to a separate image file. Format (PNG/JPEG, etc.) is in the right panel under Audio & frame.',
    videoTimelineFooterAria: 'Short video and audio summary from file analysis',
    previewTransportToolbarAria: 'Preview transport',
    previewTransportMinusSecTitle: 'Minus {sec} s',
    previewTransportPlusSecTitle: 'Plus {sec} s',
    previewTransportUnmuteTitle: 'Unmute',
    timelineWaveformWebAudioUnavailable: 'Web Audio is not available in this context.',
    timelineWaveformMediaResponseErrorTemplate: 'Media response: {status}',
    timelineWaveformDisabledLargeFile: 'Waveform disabled for large files (memory guard).',
    timelineWaveformAudioLongerHintTemplate: 'Audio ~{audioSec}s (video {videoSec}s).',
    timelineWaveformDecodeFailedHint:
      'Could not build a waveform (no decodable audio or decoder error).',
    timelineWaveformUnavailableLongTemplate:
      'Long clip (> {max}s) — waveform is not built (memory guard).',
    timelineWaveformAriaUnavailable: 'Waveform unavailable',
    timelineWaveformAriaEnvelope: 'Waveform envelope',
    timelineWaveformLoading: 'Waveform…',
    miniIconFolderOpen: 'Open file',
    miniIconFolderOpenEllipsis: 'Open file…',
    miniIconRefreshCw: 'Refresh',
    miniIconDownload: 'Downloads',
    miniIconClipboardPaste: 'Paste from clipboard',
    miniIconPopOutWindow: 'Open downloads in a separate window',
    miniIconFilm: 'Inspector',
    miniIconHome: 'Default download folder',
    miniIconZoomOut: 'Zoom timeline out',
    miniIconZoomIn: 'Zoom timeline in',
    miniIconCircleHelp: 'About',
    miniIconBook: 'Knowledge base',
    miniIconImage: 'Frame capture',
    miniIconSave: 'Export',
    miniIconSettings: 'Engine paths',
    miniIconSun: 'Light theme',
    miniIconMoon: 'Dark theme',
    miniIconSkipBack: 'Go to start',
    miniIconChevronLeft: 'Back 5 seconds',
    miniIconChevronRight: 'Forward 5 seconds',
    miniIconSkipForward: 'Go to end',
    miniIconPlay: 'Play',
    miniIconPauseUi: 'Pause',
    miniIconVolume2: 'Volume',
    miniIconVolumeX: 'Mute',
    miniIconMaximize2: 'Fullscreen preview',
    miniIconRotateCcw: 'Rotate counter-clockwise (FFmpeg §7.2)',
    miniIconRotateCw: 'Rotate clockwise (FFmpeg §7.2)',
    miniIconScissors: 'Next crop preset (§7.2)',
    miniIconQueueChevronUp: 'Move up',
    miniIconQueueChevronDown: 'Move down',
    miniIconQueuePlus: 'Add',
    miniIconQueueRetry: 'Retry',
    miniIconQueueFile: 'Open file',
    miniIconQueueOutbound: 'Open in editor',
    miniIconQueueTrash: 'Remove from queue',
    miniIconQueueX: 'Clear'
  }
} as const

type UiTextKey = keyof (typeof UI_TEXT)['ru']

export function getUiLocale(): UiLocale {
  return uiLocaleOverride ?? resolveUiLocaleFromNavigator()
}

/**
 * Sync renderer UI strings with persisted `uiLocale` (or persist navigator default once).
 * Caller should bump React state after this so components re-read `getUiLocale()` / `uiText()`.
 */
export function applyPersistedUiLocale(loaded: { uiLocale?: unknown }): {
  resolved: DownloadsWindowUiLocale
  shouldPersist: boolean
} {
  const fromFile = parseDownloadsWindowUiLocale(loaded.uiLocale)
  if (fromFile !== undefined) {
    uiLocaleOverride = fromFile
    return { resolved: fromFile, shouldPersist: false }
  }
  const resolved = resolveUiLocaleFromNavigator()
  uiLocaleOverride = resolved
  return { resolved, shouldPersist: true }
}

/** После `settings.setUiLocale` или события main `uiLocaleChanged`. */
export function setUiLocaleForSession(locale: DownloadsWindowUiLocale): void {
  uiLocaleOverride = locale
}

export type MiniIconTitleKey = {
  [K in UiTextKey]: K extends `miniIcon${string}` ? K : never
}[UiTextKey]

export function miniIconTitle(key: MiniIconTitleKey): string {
  return UI_TEXT[getUiLocale()][key]
}

export function uiText(key: UiTextKey): string {
  return UI_TEXT[getUiLocale()][key]
}

export function uiTextVars(key: UiTextKey, vars: Record<string, string | number>): string {
  let s = uiText(key)
  for (const [k, v] of Object.entries(vars)) {
    s = s.split(`{${k}}`).join(String(v))
  }
  return s
}

export type TerminalIntroTailVars = {
  pageStep: number
  maxInline: number
}

export function formatTerminalIntroTail(vars: TerminalIntroTailVars): string {
  return UI_TEXT[getUiLocale()].terminalIntroTailTemplate
    .replace(/\{pageStep\}/g, String(vars.pageStep))
    .replace(/\{maxInline\}/g, String(vars.maxInline))
}

export function formatTerminalPreviewTooltip(token: string): string {
  return UI_TEXT[getUiLocale()].terminalPreviewFileTooltipOpen.replace(/\{token\}/g, token)
}

export function formatTerminalExitLine(code: number | null | undefined, ms: number): string {
  const codeStr =
    code === null || code === undefined ? uiText('commonNotApplicableShort') : String(code)
  return UI_TEXT[getUiLocale()].terminalExitCodeMsTemplate
    .replace(/\{code\}/g, codeStr)
    .replace(/\{ms\}/g, String(ms))
}

export function formatTerminalCopyLineAria(lineNumber1Based: number): string {
  return UI_TEXT[getUiLocale()].terminalCopyLineAriaTemplate.replace(
    /\{n\}/g,
    String(lineNumber1Based)
  )
}

export function formatMaintenanceCleanDone(files: number, bytes: string): string {
  return UI_TEXT[getUiLocale()].maintenanceCleanDoneTemplate
    .replace(/\{files\}/g, String(files))
    .replace(/\{bytes\}/g, bytes)
}

export function formatMaintenanceConfirmHint(label: string): string {
  return UI_TEXT[getUiLocale()].maintenanceConfirmHintTemplate.replace(/\{label\}/g, label)
}

export function formatMaintenanceSummary(bytes: string, details?: string): string {
  const template =
    details && details.trim().length > 0
      ? UI_TEXT[getUiLocale()].maintenanceSummaryWithDetailsTemplate
      : UI_TEXT[getUiLocale()].maintenanceSummaryTemplate
  return template.replace(/\{bytes\}/g, bytes).replace(/\{details\}/g, details ?? '')
}

/** Двоичные степени 1024 с локализованными суффиксами (см. `byteSize*` в `UI_TEXT`). */
export function formatUiBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return uiText('byteSizeZero')
  }
  const units = [
    uiText('byteSizeUnitB'),
    uiText('byteSizeUnitKiB'),
    uiText('byteSizeUnitMiB'),
    uiText('byteSizeUnitGiB')
  ]
  let value = bytes
  let unitIndex = 0
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024
    unitIndex += 1
  }
  return `${value >= 10 || unitIndex === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[unitIndex]}`
}

export function formatDownloadsHistoryTime(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) {
    return uiText('uiPlaceholderDash')
  }
  const loc = getUiLocale() === 'en' ? 'en-US' : 'ru-RU'
  return new Date(ms).toLocaleString(loc, {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatProcessingDurationLabel(ms: number): string {
  const en = getUiLocale() === 'en'
  if (!Number.isFinite(ms) || ms <= 0) {
    return en ? '0s' : '0с'
  }
  const totalSec = Math.round(ms / 1000)
  const min = Math.floor(totalSec / 60)
  const sec = totalSec % 60
  if (min <= 0) {
    return en ? `${sec}s` : `${sec}с`
  }
  const h = Math.floor(min / 60)
  const m = min % 60
  if (en) {
    return h > 0 ? `${h}h ${m}m` : `${m}m ${sec}s`
  }
  return h > 0 ? `${h}ч ${m}м` : `${m}м ${sec}с`
}

export function formatDownloadsHistoryOutcomeLabel(outcome: YtdlpDownloadHistoryOutcome): string {
  if (outcome === 'success') {
    return uiText('processingOutcomeSuccess')
  }
  if (outcome === 'cancelled') {
    return uiText('processingOutcomeCancelled')
  }
  return uiText('processingOutcomeError')
}

export function formatProcessingHistoryOutcomeLabel(outcome: ProcessingHistoryOutcome): string {
  return formatDownloadsHistoryOutcomeLabel(outcome)
}

export function formatProcessingHistoryKindLabel(kind: ProcessingHistoryKind): string {
  if (kind === 'ffmpegSnapshot') {
    return uiText('processingHistoryKindSnapshot')
  }
  if (kind === 'autoExport') {
    return uiText('processingHistoryKindAutoExport')
  }
  return uiText('processingHistoryKindExport')
}

/** Localized label for a persisted yt-dlp queue row `status` string (§6). */
export function formatDownloadsQueueRowStatus(status: string): string {
  if (status === YTDLP_QUEUE_STATUS_WAITING) {
    return uiText('downloadsQueueRowStatusWaiting')
  }
  if (status === YTDLP_QUEUE_STATUS_RUNNING) {
    return uiText('downloadsQueueRowStatusRunning')
  }
  if (status === YTDLP_QUEUE_STATUS_DONE) {
    return uiText('downloadsQueueRowStatusDone')
  }
  if (status === YTDLP_QUEUE_STATUS_CANCELLED) {
    return uiText('downloadsQueueRowStatusCancelled')
  }
  const retry = parseYtdlpQueueRetryPauseCounts(status)
  if (retry !== null) {
    return uiTextVars('downloadsQueueRowStatusRetryTemplate', { cur: retry.cur, max: retry.max })
  }
  if (status.startsWith(YTDLP_QUEUE_STATUS_RETRY_PAUSE_PREFIX)) {
    return uiText('downloadsQueueRowStatusRetryUnknown')
  }
  if (isYtdlpQueueStatusErrorLike(status)) {
    return status
  }
  return status
}
