import type { KnowledgeArticleListItem } from '../../../shared/knowledge-contract'

/** Первая статья или pending slug из Help (ref.5 / X.3). */
export function pickInitialKnowledgeSlug(
  visible: KnowledgeArticleListItem[],
  pending: string | null
): string | null {
  if (visible.length === 0) {
    return null
  }
  if (pending != null && visible.some((article) => article.slug === pending)) {
    return pending
  }
  return visible[0]!.slug
}
