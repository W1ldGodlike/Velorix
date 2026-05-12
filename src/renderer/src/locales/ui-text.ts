import type { ProcessingHistoryKind, ProcessingHistoryOutcome } from '../../../shared/processing-history-contract'
import type { YtdlpDownloadHistoryOutcome } from '../../../shared/ytdlp-history-contract'

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
    maintenanceSummaryButton: 'Размер временных',
    maintenanceCleanButton: 'Очистить временное',
    maintenanceCleanPreviewButton: 'Очистить preview',
    maintenanceCleanPartialsButton: 'Очистить .part',
    maintenanceCleanFfmpegTempButton: 'Очистить ffmpeg temp',
    maintenanceConfirmButton: 'Подтвердить очистку',
    maintenanceConfirmHintTemplate:
      '{label}: удаляются только временные данные. Нажмите «Подтвердить очистку» ещё раз.',
    maintenanceCleanDoneTemplate: 'Очищено: {files} файлов, {bytes}',
    maintenanceSummaryTemplate: 'Временное: {bytes}',
    maintenanceSummaryWithDetailsTemplate: 'Временное: {bytes} ({details})',
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
    terminalPreviewFileTooltipOpen: 'Вставить токен «{token}» (путь текущего превью)',
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
    terminalHintsSearchPlaceholder: '--help, -i, crop',
    processingOutcomeSuccess: 'Готово',
    processingOutcomeError: 'Ошибка',
    processingOutcomeCancelled: 'Отмена',
    processingHistoryTitle: 'История обработок',
    processingHistorySectionHint:
      'Последние ffmpeg export, снимки кадров и авто-экспорт после загрузки.',
    processingHistoryWeeklyAria: 'Недельная сводка обработок',
    processingHistory7dPrefix: '7 дней:',
    processingHistoryChipOk: 'OK',
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
    processingHistoryQueryPlaceholder: 'Файл, статус, ошибка',
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
    downloadsHistoryChipOk: 'OK',
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
      'Готовлю файл для редактора… при необходимости будет создан WebM preview.',
    downloadsHistoryOpenHandlerDone: 'Файл открыт в редакторе',
    downloadsLogTitle: 'Живой лог',
    downloadsLogSave: 'Сохранить',
    downloadsLogEmpty: 'Лог появится после запуска строки yt-dlp.',
    workspaceTabsAria: 'Рабочие вкладки',
    workspaceTabEditor: 'Редактор',
    workspaceTabDownloads: 'Загрузки',
    workspaceTabTerminal: 'Терминал',
    workspaceTabDownloadsTooltip: 'Перейти во вкладку загрузок yt-dlp',
    workspaceTabTerminalTooltip: 'Безопасный CLI для ffmpeg, ffprobe и yt-dlp',
    downloadsMainAria: 'Вкладка загрузок',
    downloadsPageTitle: 'Загрузки',
    downloadsPageHint:
      'Эта вкладка — основной рабочий стол yt-dlp (очередь по центру, журнал и история под таблицей, настройки справа как в v0; при ширине окна примерно до 1100px панель настроек переносится под журнал с прокруткой, поля не теряются — сверху есть кнопка «К настройкам», чтобы сразу прокрутить к панели). Pop-out — дублирующее окно с тем же IPC и длинным справочником токенов в одном списке.',
    downloadsFromClipboard: 'Из буфера',
    downloadsPopOut: 'Pop-out',
    downloadsScrollToSettings: 'К настройкам',
    downloadsUrlPlaceholder: 'URL или несколько URL по строкам',
    downloadsUrlAria: 'URL для добавления в очередь загрузок',
    downloadsAddToQueue: 'Добавить в очередь',
    downloadsAddAndStart: 'Добавить и начать',
    downloadsStartQueue: 'Начать загрузку',
    downloadsStopQueue: 'Остановить',
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
    downloadsEmptyQueue:
      'Очередь пуста. Добавьте URL сверху или из быстрых действий редактора.',
    downloadsEmptyFilter:
      'В этом фильтре строк нет. Переключите статус выше или добавьте новые URL.',
    downloadsQueueAriaMoveUp: 'Поднять строку {id} выше',
    downloadsQueueAriaMoveDown: 'Опустить строку {id} ниже',
    downloadsQueueAriaRetryRow: 'Повторить загрузку строки {id}',
    downloadsQueueAriaStartRow: 'Старт строки {id}',
    downloadsQueueAriaOpenFile: 'Открыть файл строки {id}',
    downloadsQueueAriaOpenFolder: 'Открыть папку строки {id}',
    downloadsQueueAriaOpenInEditor: 'Открыть в редакторе вывод строки {id}',
    downloadsQueueAriaResumeYtdlp: 'Продолжить yt-dlp для строки {id}',
    downloadsQueueAriaPauseYtdlp: 'Пауза yt-dlp для строки {id}',
    downloadsQueueAriaRemoveRow: 'Удалить строку {id} из очереди',
    quickYtdlpAria: 'Быстрая загрузка yt-dlp',
    quickYtdlpSummary: 'Быстрая загрузка yt-dlp',
    quickYtdlpPlaceholder: 'URL или список URL — передать в менеджер загрузок',
    quickYtdlpHint:
      'Ссылка добавляется во вкладку «Загрузки»; несколько URL — по строкам.',
    quickYtdlpToDownloadsTab: 'Во вкладку',
    quickYtdlpDocFormats: 'Форматы',
    quickYtdlpDocOutputTemplate: 'Шаблон -o',
    quickYtdlpPasteClipboardTitle: 'Вставить текст из буфера обмена в поле URL',
    downloadsRailAria: 'Настройки загрузок',
    downloadsRailTitle: 'Настройки yt-dlp',
    downloadsRailSubtitle:
      'Секции и раскрытие совпадают с pop-out: те же ключи в `downloadsWindowUiPanels`. Доп. argv, превью команды и справочник токенов (поиск + описания) — здесь; отдельное окно менеджера — для очереди и полноэкранной работы с загрузками.',
    downloadsRailFormatSummary: 'Формат',
    downloadsRailFormatQualityLabel: 'Формат / качество',
    downloadsFormatHint:
      'Пресет `-f`; при «Только аудио» формат видео не применяется.',
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
    downloadsSubLangsHelp:
      'Один токен `--sub-langs` без пробелов (например ru,en или all).',
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
    downloadsImpersonateLabel: 'Подмена клиента',
    downloadsImpersonateOff: 'Выключено',
    downloadsCookiesProfileLabel: 'Профиль / контейнер (cookies из браузера)',
    downloadsCookiesProfilePlaceholder: 'например Default или Profile 1',
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
    downloadsQueueRetryHelp: 'Повторяет всю строку очереди при ненулевом exit code.',
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
    downloadsExtraArgsLabel: 'Дополнительные argv',
    downloadsExtraArgsHelp:
      'Без shell: токены как в справочнике; небезопасное отсекает парсер main.',
    downloadsInsertTokenLabel: 'Вставить токен из справочника',
    downloadsInsertTokenAria: 'Добавить токен в дополнительные argv',
    downloadsHintPickerPlaceholder: 'Выберите…',
    downloadsHintSearchLabel: 'Поиск по справочнику argv',
    downloadsHintSearchPlaceholder: 'Например: --cookies или --sub',
    downloadsHintSearchAria: 'Поиск по токенам и описаниям справочника argv',
    downloadsHintListAria: 'Справочник флагов с описаниями',
    downloadsHintsUnavailable: 'Справочник недоступен.',
    downloadsHintsNoMatches: 'Нет совпадений.',
    downloadsHintsSameAsPopoutHelp:
      'Те же подсказки, что в pop-out; клик по токену добавляет его в argv.',
    downloadsRailDocReadme: 'README',
    downloadsRailDocOutput: 'Шаблон вывода',
    downloadsRailDocPostprocess: 'Постобработка',
    downloadsCommandPreviewHelp: 'Превью команды (чтение)',
    downloadsOptionsLoading: 'Загружаю настройки yt-dlp…',
    downloadsRailRefreshOptions: 'Обновить настройки',
    downloadsRailStopCurrentRow: 'Остановить текущую',
    enginesSummaryReady: 'Движки: готовы',
    enginesSummaryMissing: 'Движки: не найдены',
    enginesSummaryError: 'Движки: ошибка проверки',
    enginesSummaryChecking: 'Движки: проверка…',
    topbarOpenFileTitle: 'Открыть локальный видеофайл',
    topbarOpenFileLabel: 'Открыть',
    topbarRotateCcwTitle:
      'Поворот против часовой: none → 90° CCW → 180° → 90° CW (экспорт §7.2)',
    topbarRotateCcwLabel: 'Поворот CCW',
    topbarRotateCwTitle: 'Поворот по часовой: none → 90° CW → 180° → 90° CCW (экспорт §7.2)',
    topbarRotateCwLabel: 'Поворот CW',
    topbarCropCycleTitle: 'Обрезка: нет → 1:1 → 16:9 → 4:3 (экспорт §7.2)',
    topbarCropLabel: 'Обрезка',
    topbarInspectorTitle:
      'Отдельное окно инспектора ffprobe (§9). Если файл открыт в превью — сразу подставится его путь.',
    topbarInspectorLabel: 'Инспектор',
    topbarSnapshotTitle: 'Сохранить текущий кадр превью в PNG или JPEG (ffmpeg)',
    topbarSnapshotLabel: 'Кадр',
    topbarSnapshotBusyLabel: 'Кадр…',
    topbarExportTitle: 'Сохранить фрагмент In–Out или весь файл (libx264/aac), нужен ffmpeg',
    topbarExportLabel: 'Экспорт',
    topbarExportBusyLabel: 'Экспорт…',
    topbarExportCancelTitle: 'Остановить текущий ffmpeg export',
    topbarExportCancelBusy: 'Отмена…',
    topbarExportCancelReady: 'Отменить экспорт',
    topbarEnginesDownloadTitle: 'Скачать yt-dlp и FFmpeg в папку приложения пользователя',
    topbarEnginesDownloadBusy: 'Загрузка…',
    topbarEnginesDownloadReady: 'Скачать движки',
    topbarEnginePathsTitle: 'Задать исполняемые файлы ffmpeg, ffprobe и yt-dlp вручную',
    topbarEnginePathsLabel: 'Пути к движкам',
    topbarKnowledgeLabel: 'База знаний',
    topbarAboutTitle: 'О программе и диагностика',
    topbarAboutLabel: 'О программе',
    topbarThemeToggleTitle: 'Переключить тёмную/светлую тему',
    topbarThemeUseLight: 'Светлая тема',
    topbarThemeUseDark: 'Тёмная тема',
    editorPreviewDropzoneAria: 'Область предпросмотра',
    editorPreviewVideoAriaTemplate: 'Предпросмотр: {name}',
    editorPreviewEmptyLead:
      'Нет источника — перетащите видеофайл сюда или «Открыть…» в меню «Файл» / кнопка сверху.',
    editorPreviewEmptyHint:
      'Локальный файл стримится через защищённую схему fluxmedia — только после выбора или DnD по пути из Electron.',
    editorFfmpegRailShowTitle: 'Показать настройки FFmpeg',
    editorFfmpegRailShowHidden: 'Развернуть панель настроек FFmpeg',
    editorFfmpegRailRestoreLabel: 'FFmpeg',
    editorFfmpegSettingsAria: 'Настройки FFmpeg',
    editorFfmpegSettingsTitle: 'Настройки FFmpeg',
    editorFfmpegSettingsSubtitle: 'Секции можно сворачивать, как в референсе v0.',
    editorFfmpegRailCollapseTitle: 'Свернуть панель (больше места для превью и таймлайна)',
    editorFfmpegRailCollapseHidden: 'Свернуть панель настроек FFmpeg',
    editorFfmpegSectionVideo: 'Видео',
    editorFfmpegSectionVideoHint:
      'Кодек, контейнер, CRF и видеобитрейт итогового файла экспорта §7.',
    editorFieldVideoCodec: 'Видеокодек',
    editorAriaVideoCodecExport: 'Видеокодек экспорта',
    editorFieldEncodePreset: 'Пресет скорости / CRF по умолчанию',
    editorAriaEncodePresetExport:
      'Пресет скорости кодирования экспорта (libx264/libx265 -preset)',
    editorFieldContainer: 'Контейнер',
    editorAriaContainerExport: 'Контейнер экспорта',
    editorFieldCrf: 'CRF',
    editorAriaCrfExport: 'CRF экспорта',
    editorCrfOptionPreset: 'CRF пресета',
    editorFieldVideoBitrate: 'Битрейт видео',
    editorAriaVideoBitrateExport: 'Битрейт видео экспорта',
    editorVideoBitrateOptionCrf: 'Видео CRF'
  },
  en: {
    aboutTitle: 'About',
    appLabel: 'Application',
    versionLabel: 'Version',
    loading: 'Loading…',
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
    processingHistoryQueryPlaceholder: 'File, status, error',
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
    downloadsHistoryEmpty:
      'No entries yet. Finished queue rows will appear here as they complete.',
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
    workspaceTabDownloadsTooltip: 'Open the yt-dlp downloads tab',
    workspaceTabTerminalTooltip: 'Safe CLI for ffmpeg, ffprobe, and yt-dlp',
    downloadsMainAria: 'Downloads tab',
    downloadsPageTitle: 'Downloads',
    downloadsPageHint:
      'This tab is the main yt-dlp desk (queue in the center, log and history under the table, settings on the right like v0; below ~1100px width the settings rail moves under the log with scrolling — fields stay reachable via “Scroll to settings” at the top). Pop-out is a second window with the same IPC and the full token reference list.',
    downloadsFromClipboard: 'From clipboard',
    downloadsPopOut: 'Pop-out',
    downloadsScrollToSettings: 'Scroll to settings',
    downloadsUrlPlaceholder: 'One URL per line, or multiple URLs',
    downloadsUrlAria: 'URLs to append to the download queue',
    downloadsAddToQueue: 'Add to queue',
    downloadsAddAndStart: 'Add and start',
    downloadsStartQueue: 'Start downloads',
    downloadsStopQueue: 'Stop',
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
    downloadsEmptyQueue:
      'Queue is empty. Add URLs above or use quick actions from the editor.',
    downloadsEmptyFilter:
      'No rows match this filter. Change the status chips above or add new URLs.',
    downloadsQueueAriaMoveUp: 'Move row {id} up',
    downloadsQueueAriaMoveDown: 'Move row {id} down',
    downloadsQueueAriaRetryRow: 'Retry download for row {id}',
    downloadsQueueAriaStartRow: 'Start row {id}',
    downloadsQueueAriaOpenFile: 'Open file for row {id}',
    downloadsQueueAriaOpenFolder: 'Open folder for row {id}',
    downloadsQueueAriaOpenInEditor: 'Open row {id} output in the editor',
    downloadsQueueAriaResumeYtdlp: 'Resume yt-dlp for row {id}',
    downloadsQueueAriaPauseYtdlp: 'Pause yt-dlp for row {id}',
    downloadsQueueAriaRemoveRow: 'Remove row {id} from the queue',
    quickYtdlpAria: 'Quick yt-dlp download',
    quickYtdlpSummary: 'Quick yt-dlp download',
    quickYtdlpPlaceholder: 'URL or list of URLs for the download manager',
    quickYtdlpHint:
      'Adds to the Downloads tab; enter multiple URLs as separate lines.',
    quickYtdlpToDownloadsTab: 'Send to tab',
    quickYtdlpDocFormats: 'Formats',
    quickYtdlpDocOutputTemplate: '-o template',
    quickYtdlpPasteClipboardTitle: 'Paste clipboard text into the URL field',
    downloadsRailAria: 'Download settings',
    downloadsRailTitle: 'yt-dlp settings',
    downloadsRailSubtitle:
      'Sections match the pop-out window (`downloadsWindowUiPanels`). Extra argv, command preview, and the token catalog (search + descriptions) live here; the separate manager window is for the queue and full-screen download work.',
    downloadsRailFormatSummary: 'Format',
    downloadsRailFormatQualityLabel: 'Format / quality',
    downloadsFormatHint:
      '`-f` preset; with “Audio only”, video format presets are not applied.',
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
    downloadsSubLangsHelp:
      'A single `--sub-langs` token without spaces (e.g. ru,en or all).',
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
    downloadsInsertTokenLabel: 'Insert token from catalog',
    downloadsInsertTokenAria: 'Append a token to extra argv',
    downloadsHintPickerPlaceholder: 'Select…',
    downloadsHintSearchLabel: 'Search argv catalog',
    downloadsHintSearchPlaceholder: 'e.g. --cookies or --sub',
    downloadsHintSearchAria: 'Search argv tokens and descriptions',
    downloadsHintListAria: 'Flag catalog with descriptions',
    downloadsHintsUnavailable: 'Catalog unavailable.',
    downloadsHintsNoMatches: 'No matches.',
    downloadsHintsSameAsPopoutHelp:
      'Same hints as pop-out; click a token to append it to argv.',
    downloadsRailDocReadme: 'README',
    downloadsRailDocOutput: 'Output template',
    downloadsRailDocPostprocess: 'Post-processing',
    downloadsCommandPreviewHelp: 'Command preview (read-only)',
    downloadsOptionsLoading: 'Loading yt-dlp settings…',
    downloadsRailRefreshOptions: 'Reload settings',
    downloadsRailStopCurrentRow: 'Stop current row',
    enginesSummaryReady: 'Engines: ready',
    enginesSummaryMissing: 'Engines: not found',
    enginesSummaryError: 'Engines: check error',
    enginesSummaryChecking: 'Engines: checking…',
    topbarOpenFileTitle: 'Open a local video file',
    topbarOpenFileLabel: 'Open',
    topbarRotateCcwTitle: 'Rotate CCW: none → 90° CCW → 180° → 90° CW (export §7.2)',
    topbarRotateCcwLabel: 'Rotate CCW',
    topbarRotateCwTitle: 'Rotate CW: none → 90° CW → 180° → 90° CCW (export §7.2)',
    topbarRotateCwLabel: 'Rotate CW',
    topbarCropCycleTitle: 'Crop: none → 1:1 → 16:9 → 4:3 (export §7.2)',
    topbarCropLabel: 'Crop',
    topbarInspectorTitle:
      'Separate ffprobe inspector window (§9). Uses the current preview path when a file is open.',
    topbarInspectorLabel: 'Inspector',
    topbarSnapshotTitle: 'Save the current preview frame as PNG or JPEG (ffmpeg)',
    topbarSnapshotLabel: 'Snapshot',
    topbarSnapshotBusyLabel: 'Snapshot…',
    topbarExportTitle: 'Save In–Out range or full file (libx264/aac); requires ffmpeg',
    topbarExportLabel: 'Export',
    topbarExportBusyLabel: 'Export…',
    topbarExportCancelTitle: 'Stop the current ffmpeg export',
    topbarExportCancelBusy: 'Cancelling…',
    topbarExportCancelReady: 'Cancel export',
    topbarEnginesDownloadTitle: 'Download yt-dlp and FFmpeg into the app user folder',
    topbarEnginesDownloadBusy: 'Downloading…',
    topbarEnginesDownloadReady: 'Download engines',
    topbarEnginePathsTitle: 'Manually set ffmpeg, ffprobe, and yt-dlp executables',
    topbarEnginePathsLabel: 'Engine paths',
    topbarKnowledgeLabel: 'Knowledge base',
    topbarAboutTitle: 'About and diagnostics',
    topbarAboutLabel: 'About',
    topbarThemeToggleTitle: 'Toggle dark / light theme',
    topbarThemeUseLight: 'Light theme',
    topbarThemeUseDark: 'Dark theme',
    editorPreviewDropzoneAria: 'Preview area',
    editorPreviewVideoAriaTemplate: 'Preview: {name}',
    editorPreviewEmptyLead:
      'No source — drop a video here or use Open… in the File menu / the top button.',
    editorPreviewEmptyHint:
      'Local files stream via the fluxmedia scheme only after a dialog pick or Electron path DnD.',
    editorFfmpegRailShowTitle: 'Show FFmpeg settings',
    editorFfmpegRailShowHidden: 'Expand FFmpeg settings panel',
    editorFfmpegRailRestoreLabel: 'FFmpeg',
    editorFfmpegSettingsAria: 'FFmpeg settings',
    editorFfmpegSettingsTitle: 'FFmpeg settings',
    editorFfmpegSettingsSubtitle: 'Sections can be collapsed like the v0 reference.',
    editorFfmpegRailCollapseTitle: 'Collapse panel (more room for preview and timeline)',
    editorFfmpegRailCollapseHidden: 'Collapse FFmpeg settings panel',
    editorFfmpegSectionVideo: 'Video',
    editorFfmpegSectionVideoHint: 'Codec, container, CRF, and video bitrate for export §7.',
    editorFieldVideoCodec: 'Video codec',
    editorAriaVideoCodecExport: 'Export video codec',
    editorFieldEncodePreset: 'Speed / default CRF preset',
    editorAriaEncodePresetExport: 'Export encoding speed preset (libx264/libx265 -preset)',
    editorFieldContainer: 'Container',
    editorAriaContainerExport: 'Export container',
    editorFieldCrf: 'CRF',
    editorAriaCrfExport: 'Export CRF',
    editorCrfOptionPreset: 'Preset CRF',
    editorFieldVideoBitrate: 'Video bitrate',
    editorAriaVideoBitrateExport: 'Export video bitrate',
    editorVideoBitrateOptionCrf: 'Video CRF'
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
  maxDd: number
}

export function formatTerminalIntroTail(vars: TerminalIntroTailVars): string {
  return UI_TEXT[activeUiLocale].terminalIntroTailTemplate
    .replace(/\{pageStep\}/g, String(vars.pageStep))
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

export function formatMaintenanceCleanDone(files: number, bytes: string): string {
  return UI_TEXT[activeUiLocale].maintenanceCleanDoneTemplate
    .replace(/\{files\}/g, String(files))
    .replace(/\{bytes\}/g, bytes)
}

export function formatMaintenanceConfirmHint(label: string): string {
  return UI_TEXT[activeUiLocale].maintenanceConfirmHintTemplate.replace(/\{label\}/g, label)
}

export function formatMaintenanceSummary(bytes: string, details?: string): string {
  const template =
    details && details.trim().length > 0
      ? UI_TEXT[activeUiLocale].maintenanceSummaryWithDetailsTemplate
      : UI_TEXT[activeUiLocale].maintenanceSummaryTemplate
  return template.replace(/\{bytes\}/g, bytes).replace(/\{details\}/g, details ?? '')
}

export function formatDownloadsHistoryTime(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) {
    return '—'
  }
  const loc = activeUiLocale === 'en' ? 'en-US' : 'ru-RU'
  return new Date(ms).toLocaleString(loc, {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export function formatProcessingDurationLabel(ms: number): string {
  const en = activeUiLocale === 'en'
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
