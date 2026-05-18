/** Merged UI_TEXT tables (ru/en) from §2.2 JSON shards (`locales/{locale}/*.json`). */
import { notifyUiTextShardsUpdated } from './ui-text-hot-reload'
import { buildUiTextTables, type UiTextTables } from './ui-text-strings-build'

export type { UiTextTables }

let uiTextTables: UiTextTables = buildUiTextTables()

/** Текущие таблицы (пересобираются при Vite HMR правок JSON в locales/). */
export function getUiTextTables(): UiTextTables {
  return uiTextTables
}

export function reloadUiTextTablesFromModules(): void {
  uiTextTables = buildUiTextTables()
}

export type UiTextKey = keyof UiTextTables['ru']

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    reloadUiTextTablesFromModules()
    notifyUiTextShardsUpdated()
  })
  if (import.meta.hot.data.uiTextHmrBooted) {
    notifyUiTextShardsUpdated()
  }
  import.meta.hot.data.uiTextHmrBooted = true
}
