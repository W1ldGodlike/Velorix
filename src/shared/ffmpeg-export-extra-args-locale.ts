/**
 * §7.2 — тексты ошибок парсера дополнительных argv ffmpeg-экспорта.
 */

import type { AppUiLocale } from './app-ui-locale'

export type FfmpegExportExtraArgsCopy = {
  lineTooLong: (max: number) => string
  tooManyTokens: (max: number) => string
  tokenTooLong: (max: number) => string
  tokenDangerChars: string
  tokenAtFile: string
  tokenForbidden: (token: string) => string
}

export const FFMPEG_EXPORT_EXTRA_ARGS_COPY_RU: FfmpegExportExtraArgsCopy = {
  lineTooLong: (max) => `Строка длиннее ${max} символов`,
  tooManyTokens: (max) => `Слишком много токенов (макс. ${max})`,
  tokenTooLong: (max) => `Токен длиннее ${max} символов`,
  tokenDangerChars: 'Недопустимые символы в токене',
  tokenAtFile: 'Аргументы из файла (@…) запрещены',
  tokenForbidden: (t) => `Токен запрещён (конфликт с экспортом): ${t}`
}

export const FFMPEG_EXPORT_EXTRA_ARGS_COPY_EN: FfmpegExportExtraArgsCopy = {
  lineTooLong: (max) => `Line is longer than ${max} characters`,
  tooManyTokens: (max) => `Too many tokens (max ${max})`,
  tokenTooLong: (max) => `Token is longer than ${max} characters`,
  tokenDangerChars: 'Invalid characters in token',
  tokenAtFile: 'File-based arguments (@…) are not allowed',
  tokenForbidden: (t) => `Token is forbidden (conflicts with export): ${t}`
}

export function getFfmpegExportExtraArgsCopy(
  locale: AppUiLocale = 'ru'
): FfmpegExportExtraArgsCopy {
  return locale === 'en' ? FFMPEG_EXPORT_EXTRA_ARGS_COPY_EN : FFMPEG_EXPORT_EXTRA_ARGS_COPY_RU
}
