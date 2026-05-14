import type { DownloadsWindowUiLocale } from './downloads-window-ui-locale'

/**
 * §6.3 — порядок групп справочника argv (вкладка «Загрузки», pop-out, выпадающий список).
 * Синхрон с сортировкой подсказок в main (`sortYtdlpCommandHintsForUi`).
 */
export const YTDLP_HINT_CATEGORY_ORDER: readonly string[] = [
  'Справка',
  'Форматы и кодеки',
  'Сеть и HTTP',
  'Доступ и cookies',
  'Загрузка: режим и файлы',
  'Плейлист и фильтры',
  'Субтитры, обложки и метаданные',
  'Вывод и журнал',
  'Прочее'
]

/** Parallel order for English category labels from `ytdlp-command-hint-token-categories`. */
export const YTDLP_HINT_CATEGORY_ORDER_EN: readonly string[] = [
  'Help',
  'Formats & codecs',
  'Network & HTTP',
  'Access & cookies',
  'Download: mode & files',
  'Playlist & filters',
  'Subtitles, thumbnails & metadata',
  'Output & logging',
  'Other'
]

export function ytdlpHintsMiscCategoryLabel(locale: DownloadsWindowUiLocale): string {
  return locale === 'en' ? 'Other' : 'Прочее'
}

export function getYtdlpHintCategoryOrder(locale: DownloadsWindowUiLocale): readonly string[] {
  return locale === 'en' ? YTDLP_HINT_CATEGORY_ORDER_EN : YTDLP_HINT_CATEGORY_ORDER
}

export function categorySortRank(category: string, locale: DownloadsWindowUiLocale = 'ru'): number {
  const order = getYtdlpHintCategoryOrder(locale)
  const idx = order.indexOf(category)
  return idx === -1 ? order.length - 1 : idx
}

/** Сортировка имён категорий для групп в UI. */
export function compareYtdlpHintCategoryKeys(
  a: string,
  b: string,
  locale: DownloadsWindowUiLocale = 'ru'
): number {
  const ra = categorySortRank(a, locale)
  const rb = categorySortRank(b, locale)
  if (ra !== rb) {
    return ra - rb
  }
  return a.localeCompare(b, locale === 'en' ? 'en' : 'ru')
}
