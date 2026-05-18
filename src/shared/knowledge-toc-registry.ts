import type { KnowledgeArticleListItem } from './knowledge-contract'

/** PROGRAM GATE E5 — порядок «новичок → эксперт» (7 разделов). */
export type KnowledgeTocSectionId =
  | 'start'
  | 'downloads'
  | 'editor'
  | 'terminal'
  | 'inspector'
  | 'engines'
  | 'faq'
  | 'other'

export interface KnowledgeTocSectionSpec {
  id: KnowledgeTocSectionId
  /** Ключ `ui-text` для заголовка группы в оглавлении. */
  titleKey: string
  slugs: readonly string[]
}

export const KNOWLEDGE_TOC_SECTIONS: readonly KnowledgeTocSectionSpec[] = [
  {
    id: 'start',
    titleKey: 'knowledgeTocSectionStart',
    slugs: [
      'getting-started',
      'workspace-tabs',
      'appearance-language-theme',
      'keyboard-shortcuts',
      'knowledge-base-howto'
    ]
  },
  {
    id: 'downloads',
    titleKey: 'knowledgeTocSectionDownloads',
    slugs: [
      'downloads-workflow',
      'downloads-settings-rail',
      'downloads-dragdrop',
      'session-and-queues',
      'processing-url-combo'
    ]
  },
  {
    id: 'editor',
    titleKey: 'knowledgeTocSectionEditor',
    slugs: [
      'editor-workflow',
      'workflows-planner-scenarios',
      'ffmpeg-rail-presets',
      'processing-history',
      'processing-social-presets',
      'processing-advanced-fields',
      'extract-frames'
    ]
  },
  {
    id: 'terminal',
    titleKey: 'knowledgeTocSectionTerminal',
    slugs: ['tools-terminal-inspector', 'ffmpeg-terminal-hints']
  },
  {
    id: 'inspector',
    titleKey: 'knowledgeTocSectionInspector',
    slugs: ['probe-and-inspector-basics']
  },
  {
    id: 'engines',
    titleKey: 'knowledgeTocSectionEngines',
    slugs: [
      'engines-update-paths',
      'hardware-encoding',
      'packaged-windows-smoke',
      'packaged-linux-smoke',
      'packaged-macos-smoke',
      'logging-and-diagnostics',
      'about-support-logs'
    ]
  },
  {
    id: 'faq',
    titleKey: 'knowledgeTocSectionFaq',
    slugs: ['faq-troubleshooting']
  }
] as const

const KNOWLEDGE_TOC_OTHER: KnowledgeTocSectionSpec = {
  id: 'other',
  titleKey: 'knowledgeTocSectionOther',
  slugs: []
}

/** Все slug из реестра (без `other`). */
export const KNOWLEDGE_TOC_REGISTRY_SLUGS: readonly string[] = KNOWLEDGE_TOC_SECTIONS.flatMap(
  (section) => section.slugs
)

export interface KnowledgeTocGroupedSection {
  spec: KnowledgeTocSectionSpec
  articles: KnowledgeArticleListItem[]
}

/**
 * Группирует статьи по разделам E5; неизвестные slug — в конец («Прочее»).
 */
export function groupKnowledgeArticlesByToc(
  articles: readonly KnowledgeArticleListItem[]
): KnowledgeTocGroupedSection[] {
  const bySlug = new Map(articles.map((article) => [article.slug, article]))
  const used = new Set<string>()
  const groups: KnowledgeTocGroupedSection[] = []

  for (const spec of KNOWLEDGE_TOC_SECTIONS) {
    const sectionArticles: KnowledgeArticleListItem[] = []
    for (const slug of spec.slugs) {
      const article = bySlug.get(slug)
      if (article) {
        sectionArticles.push(article)
        used.add(slug)
      }
    }
    if (sectionArticles.length > 0) {
      groups.push({ spec, articles: sectionArticles })
    }
  }

  const orphans = articles.filter((article) => !used.has(article.slug))
  if (orphans.length > 0) {
    groups.push({ spec: KNOWLEDGE_TOC_OTHER, articles: [...orphans] })
  }

  return groups
}
