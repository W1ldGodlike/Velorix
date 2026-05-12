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

export type KnowledgeArticleResult =
  | KnowledgeArticleReadResult
  | { ok: false; error: string }
