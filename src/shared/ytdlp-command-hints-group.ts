import type { YtdlpCommandHintEntry } from './ytdlp-download-contract'
import { compareYtdlpHintCategoryKeys } from './ytdlp-hint-category-order'

/**
 * §6.3 — группировка подсказок argv для UI (вкладка «Загрузки» и pop-out):
 * категории по фиксированному порядку §6.3 (`compareYtdlpHintCategoryKeys`), внутри группы — порядок в `hints`.
 */
export function groupYtdlpCommandHintsByCategory(
  hints: readonly YtdlpCommandHintEntry[] | undefined,
  query?: string
): Array<[string, YtdlpCommandHintEntry[]]> {
  if (!hints?.length) return []
  const q = query?.trim().toLowerCase() ?? ''
  const m = new Map<string, YtdlpCommandHintEntry[]>()
  for (const h of hints) {
    if (q) {
      const hay = `${h.token} ${h.summary ?? ''}`.toLowerCase()
      if (!hay.includes(q)) continue
    }
    const cat = h.category?.trim() ? h.category : 'Прочее'
    const list = m.get(cat) ?? []
    list.push(h)
    m.set(cat, list)
  }
  return [...m.entries()].sort(([a], [b]) => compareYtdlpHintCategoryKeys(a, b))
}
