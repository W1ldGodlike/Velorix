/**
 * §6.3 — порядок групп справочника argv (вкладка «Загрузки», pop-out, выпадающий список).
 * Синхрон с сортировкой подсказок в main (`ytdlp-commands-hints`).
 */
export const YTDLP_HINT_CATEGORY_ORDER: readonly string[] = [
  'Справка',
  'Форматы и кодеки',
  'Сеть и HTTP',
  'Доступ и cookies',
  'Загрузка: режим и файлы',
  'Плейлист и фильтры',
  'Субтитры, обложки и метаданные',
  'Вывод и лог',
  'Прочее'
]

export function categorySortRank(category: string): number {
  const idx = YTDLP_HINT_CATEGORY_ORDER.indexOf(category)
  return idx === -1 ? YTDLP_HINT_CATEGORY_ORDER.length - 1 : idx
}

/** Сортировка имён категорий для групп в UI. */
export function compareYtdlpHintCategoryKeys(a: string, b: string): number {
  const ra = categorySortRank(a)
  const rb = categorySortRank(b)
  if (ra !== rb) {
    return ra - rb
  }
  return a.localeCompare(b, 'ru')
}
