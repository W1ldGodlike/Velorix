/** Подмножество CommonMark для статей `Help/*.md` (без таблиц/HTML): списки `-`/`+`/`*`, нумерация, перенос строки пункта при отступе ≥4 пробела или таб. */

export type { MdBlock, MdInline } from './knowledge-markdown-types'

export {
  isKnowledgeSafeAssetImageHref,
  isKnowledgeThematicBreak,
  isKnowledgeTrustedDataImageSrc,
  isKnowledgeTrustedImageSrc,
  knowledgeHelpAssetVelorixhelpUrl,
  knowledgeInternalSlugFromHref,
  normalizeKnowledgeMarkdownSource
} from './knowledge-markdown-assets'

export { parseKnowledgeMarkdown } from './knowledge-markdown-parse'
