export interface KnowledgeArticleListItem {
  slug: string
  title: string
  fileName: string
}

export interface KnowledgeArticleReadResult {
  ok: true
  article: KnowledgeArticleListItem
  markdown: string
}

export type KnowledgeArticleListResult =
  | { ok: true; articles: KnowledgeArticleListItem[] }
  | { ok: false; error: string }

export type KnowledgeArticleResult = KnowledgeArticleReadResult | { ok: false; error: string }

/** Строка — только `slug`; объект — опциональный `preferredUiLocale` для выбора `Help/en/*.md`. */
export type KnowledgeReadArticleRequest = string | { slug: string; preferredUiLocale?: 'ru' | 'en' }

/** Список статей: заголовки из `Help/en/*.md` при `preferredUiLocale: 'en'`, если файл есть. */
export type KnowledgeListArticlesRequest = { preferredUiLocale?: 'ru' | 'en' } | undefined

/** Deep-link из UI в базу знаний: логи, Support ZIP, диагностика (`Help/about-support-logs.md`). */
export const KNOWLEDGE_SLUG_ABOUT_SUPPORT_LOGS = 'about-support-logs'
