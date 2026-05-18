import type { AppUiLocale } from './app-ui-locale'

/** Минимальная форма таблиц UI_TEXT (тесты и renderer). */
export type UiTextTablesLike = {
  readonly ru: Readonly<Record<string, string>>
  readonly en: Readonly<Record<string, string>>
}

/** RU/EN fallback, затем ключ (§6.4). */
export function resolveUiTextKey(
  tables: UiTextTablesLike,
  locale: AppUiLocale,
  key: string
): string {
  const primary = tables[locale][key]
  if (primary !== undefined && primary !== '') {
    return primary
  }
  if (locale !== 'en') {
    const en = tables.en[key]
    if (en !== undefined && en !== '') {
      return en
    }
  }
  return key
}
