import type { DownloadsWindowUiLocale } from './downloads-window-ui-locale'

/** User-facing validation copy for yt-dlp CLI fields (main-safe). */
export type YtdlpCliValidationCopy = {
  cookiesProfileTooLong: (maxLen: number) => string
  cookiesProfileControlChars: string
  tokenTooLong: (max: number) => string
  tokenDangerChars: string
  tokenAtFile: string
  tokenPathsForbidden: string
  tokenOutputDup: string
  tokenBatchForbidden: string
  tokenCookiesDup: string
  tokenCookiesFromBrowserDup: string
  tokenImpersonateDup: string
  tokenLimitRateDup: string
  tokenShortRDup: string
  tokenRetriesDup: string
  tokenFragmentRetriesDup: string
  forbiddenRuntimeFlag: (flag: string) => string
  lineTooLong: (max: number) => string
  tooManyTokens: (max: number) => string
  cookiesPathNotAbsolute: string
  cookiesFileNotFound: string
  cookiesPathNotFile: string
  cookiesStatFailed: string

  /** Merge-patch type errors (IPC save / draft). */
  patchFilenameTemplateMustBeString: string
  patchSubLangsMustBeString: string
  patchCookiesBrowserProfileMustBeString: string
  patchRateLimitMustBeString: string
  patchRetriesLineMustBeString: string
  patchFragmentRetriesLineMustBeString: string
  patchExtraArgsLineMustBeString: string

  /** `validateYtdlpCookiesFilePath` (picker / absolute path). */
  cookiesPickerPathEmpty: string
  cookiesPickerPathTooLong: string
  cookiesPickerNeedAbsolute: string
  cookiesPickerFileNotFound: string
  cookiesPickerNotAFile: string
  cookiesPickerReadFailed: string

  subLangsTooLong: string
  subLangsInvalidCharset: string

  rateLimitTooLong: string
  rateLimitInvalidFormat: string

  retriesMustBeInteger99: string
  fragmentRetriesMustBeInteger99: string

  filenameEmpty: string
  filenameTooLong480: string
  filenameForbiddenTrajectory: string
  filenameMustContainExt: string

  dialogYtdlpOutputDirTitle: string
  dialogYtdlpCookiesFileTitle: string
  dialogFilterTextFiles: string
  dialogFilterAllFiles: string
  pickerOutputDirNeedAbsolute: string
  pickerCookiesNeedAbsoluteFile: string
}

const ru: YtdlpCliValidationCopy = {
  cookiesProfileTooLong: (maxLen) =>
    `Профиль браузера для cookies слишком длинный (макс. ${maxLen} символов).`,
  cookiesProfileControlChars:
    'Профиль браузера для cookies не должен содержать управляющие символы.',
  tokenTooLong: (max) => `Токен длиннее ${max} символов.`,
  tokenDangerChars:
    'Запрещены символы оболочки (shell): ; | & `, кавычки и аналогичные конструкции.',
  tokenAtFile: 'Аргументы вида @файл запрещены.',
  tokenPathsForbidden: 'Каталоги вывода задаются настройками FluxAlloy; -P/--paths запрещены.',
  tokenOutputDup: 'Шаблон вывода задаётся полем выше; не дублируйте -o/--output.',
  tokenBatchForbidden: 'Пакетные файлы (-a/--batch-file) здесь запрещены.',
  tokenCookiesDup: 'Cookies задаются в блоке §6.2; не дублируйте --cookies.',
  tokenCookiesFromBrowserDup:
    'Источник cookies задаётся в §6.2; не дублируйте --cookies-from-browser.',
  tokenImpersonateDup:
    'Подмена клиента (--impersonate) задаётся в блоке §6.2; не дублируйте --impersonate.',
  tokenLimitRateDup:
    'Ограничение скорости задаётся отдельным полем §6.2; не дублируйте --limit-rate.',
  tokenShortRDup: 'Ограничение скорости задаётся отдельным полем §6.2; не дублируйте -r.',
  tokenRetriesDup: 'Количество повторов задаётся отдельным полем §6.2; не дублируйте --retries.',
  tokenFragmentRetriesDup:
    'Повторы фрагментов задаются отдельным полем §6.4; не дублируйте --fragment-retries.',
  forbiddenRuntimeFlag: (flag) =>
    `Флаг ${flag} запрещён в доп. аргументах: он может запускать внешние команды, менять пути выполнения или подгружать конфигурацию.`,
  lineTooLong: (max) => `Строка длиннее ${max} символов.`,
  tooManyTokens: (max) => `Слишком много аргументов (макс. ${max}).`,
  cookiesPathNotAbsolute:
    'Путь к cookies не абсолютный — выберите файл через «Выбрать…» или очистите поле.',
  cookiesFileNotFound:
    'Файл cookies не найден — исправьте путь или очистите; браузерный источник до исправления не используется.',
  cookiesPathNotFile:
    'Путь cookies не указывает на обычный файл; браузерный источник до исправления не используется.',
  cookiesStatFailed:
    'Не удалось проверить файл cookies; браузерный источник до исправления не используется.',

  patchFilenameTemplateMustBeString: 'Шаблон имени файла должен быть строкой.',
  patchSubLangsMustBeString: 'Языки субтитров должны быть строкой.',
  patchCookiesBrowserProfileMustBeString: 'Профиль cookies браузера должен быть строкой.',
  patchRateLimitMustBeString: 'Ограничение скорости должно быть строкой.',
  patchRetriesLineMustBeString: 'Количество повторов должно быть строкой.',
  patchFragmentRetriesLineMustBeString: 'Количество повторов фрагментов должно быть строкой.',
  patchExtraArgsLineMustBeString: 'Дополнительные аргументы должны быть строкой.',

  cookiesPickerPathEmpty: 'Путь к файлу cookies пуст.',
  cookiesPickerPathTooLong: 'Путь слишком длинный.',
  cookiesPickerNeedAbsolute: 'Нужен абсолютный путь к файлу cookies.',
  cookiesPickerFileNotFound: 'Файл cookies не найден.',
  cookiesPickerNotAFile: 'Указанный путь не является файлом.',
  cookiesPickerReadFailed: 'Не удалось прочитать файл cookies.',

  subLangsTooLong: 'Строка --sub-langs слишком длинная (макс. 160 символов).',
  subLangsInvalidCharset: 'Для --sub-langs допустимы только буквы, цифры и символы ,.*+-_',

  rateLimitTooLong: 'Ограничение скорости слишком длинное.',
  rateLimitInvalidFormat:
    'Формат скорости: число и необязательный суффикс K/M/G, например 500K или 2M.',

  retriesMustBeInteger99: 'Количество повторов должно быть целым числом от 0 до 99.',
  fragmentRetriesMustBeInteger99:
    'Количество повторов фрагментов должно быть целым числом от 0 до 99.',

  filenameEmpty: 'Шаблон имени не может быть пустым.',
  filenameTooLong480: 'Шаблон слишком длинный (макс. 480 символов).',
  filenameForbiddenTrajectory:
    'Недопустимые символы или попытка выхода из каталога (.., абсолютный путь).',
  filenameMustContainExt:
    'Шаблон должен содержать %(ext)s — иначе yt-dlp не сможет подставить расширение.',

  dialogYtdlpOutputDirTitle: 'Каталог загрузок yt-dlp',
  dialogYtdlpCookiesFileTitle: 'Файл cookies для yt-dlp (формат Netscape)',
  dialogFilterTextFiles: 'Текстовые файлы',
  dialogFilterAllFiles: 'Все файлы',
  pickerOutputDirNeedAbsolute: 'Нужен абсолютный путь к каталогу',
  pickerCookiesNeedAbsoluteFile: 'Нужен абсолютный путь к файлу'
}

const en: YtdlpCliValidationCopy = {
  cookiesProfileTooLong: (maxLen) =>
    `Browser cookies profile is too long (max ${maxLen} characters).`,
  cookiesProfileControlChars: 'Browser cookies profile must not contain control characters.',
  tokenTooLong: (max) => `Token is longer than ${max} characters.`,
  tokenDangerChars: 'Shell metacharacters are not allowed (; | & ` quotes, etc.).',
  tokenAtFile: '@file-style arguments are not allowed.',
  tokenPathsForbidden: 'Output directories are set in FluxAlloy; -P/--paths are not allowed.',
  tokenOutputDup: 'Output template is set above; do not duplicate -o/--output.',
  tokenBatchForbidden: 'Batch files (-a/--batch-file) are not allowed here.',
  tokenCookiesDup: 'Cookies are configured in the downloads settings; do not duplicate --cookies.',
  tokenCookiesFromBrowserDup:
    'Cookies source is configured in the downloads settings; do not duplicate --cookies-from-browser.',
  tokenImpersonateDup:
    'Impersonate is configured in the downloads settings; do not duplicate --impersonate.',
  tokenLimitRateDup:
    'Rate limit has its own field in downloads settings; do not duplicate --limit-rate.',
  tokenShortRDup: 'Rate limit has its own field in downloads settings; do not duplicate -r.',
  tokenRetriesDup: 'Retries are set in downloads settings; do not duplicate --retries.',
  tokenFragmentRetriesDup:
    'Fragment retries have their own field; do not duplicate --fragment-retries.',
  forbiddenRuntimeFlag: (flag) =>
    `Flag ${flag} is not allowed in extra args: it may run external commands, change runtime paths, or load configuration.`,
  lineTooLong: (max) => `Line is longer than ${max} characters.`,
  tooManyTokens: (max) => `Too many arguments (max ${max}).`,
  cookiesPathNotAbsolute:
    'Cookies path is not absolute — pick a file with “Browse…” or clear the field.',
  cookiesFileNotFound:
    'Cookies file was not found — fix the path or clear it; browser cookies stay disabled until fixed.',
  cookiesPathNotFile:
    'Cookies path is not a regular file; browser cookies stay disabled until fixed.',
  cookiesStatFailed:
    'Could not verify the cookies file; browser cookies stay disabled until fixed.',

  patchFilenameTemplateMustBeString: 'Filename template must be a string.',
  patchSubLangsMustBeString: 'Subtitle languages must be a string.',
  patchCookiesBrowserProfileMustBeString: 'Browser cookies profile must be a string.',
  patchRateLimitMustBeString: 'Rate limit must be a string.',
  patchRetriesLineMustBeString: 'Retries must be a string.',
  patchFragmentRetriesLineMustBeString: 'Fragment retries must be a string.',
  patchExtraArgsLineMustBeString: 'Extra arguments must be a string.',

  cookiesPickerPathEmpty: 'Cookies file path is empty.',
  cookiesPickerPathTooLong: 'Path is too long.',
  cookiesPickerNeedAbsolute: 'Cookies file path must be absolute.',
  cookiesPickerFileNotFound: 'Cookies file was not found.',
  cookiesPickerNotAFile: 'The path is not a regular file.',
  cookiesPickerReadFailed: 'Could not read the cookies file.',

  subLangsTooLong: '--sub-langs line is too long (max 160 characters).',
  subLangsInvalidCharset:
    'For --sub-langs, only letters, digits and ,.*+-_ characters are allowed.',

  rateLimitTooLong: 'Rate limit value is too long.',
  rateLimitInvalidFormat:
    'Rate limit format: a number with an optional K/M/G suffix, e.g. 500K or 2M.',

  retriesMustBeInteger99: 'Retries must be an integer from 0 to 99.',
  fragmentRetriesMustBeInteger99: 'Fragment retries must be an integer from 0 to 99.',

  filenameEmpty: 'Filename template cannot be empty.',
  filenameTooLong480: 'Filename template is too long (max 480 characters).',
  filenameForbiddenTrajectory:
    'Invalid characters or attempt to escape the output directory (.., absolute path).',
  filenameMustContainExt:
    'Template must include %(ext)s so yt-dlp can substitute the file extension.',

  dialogYtdlpOutputDirTitle: 'yt-dlp download folder',
  dialogYtdlpCookiesFileTitle: 'yt-dlp cookies file (Netscape format)',
  dialogFilterTextFiles: 'Text files',
  dialogFilterAllFiles: 'All files',
  pickerOutputDirNeedAbsolute: 'An absolute directory path is required.',
  pickerCookiesNeedAbsoluteFile: 'An absolute file path is required.'
}

export function getYtdlpCliValidationCopy(locale: DownloadsWindowUiLocale): YtdlpCliValidationCopy {
  return locale === 'en' ? en : ru
}
