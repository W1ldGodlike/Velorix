import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { basename, extname, join, normalize, relative } from 'path'

import type {
  KnowledgeArticleListItem,
  KnowledgeArticleListResult,
  KnowledgeArticleResult
} from '../../../shared/knowledge-contract'
import type { AppUiLocale } from '../../../shared/app-ui-locale'
import { getMainApplicationStrings } from '../../../shared/main-application-locale'
import { isKnowledgeSafeAssetImageHref } from '../../../shared/knowledge-markdown'

const HELP_FILE_RE = /^[a-z0-9][a-z0-9-]*\.md$/i
const MAX_ARTICLE_BYTES = 256 * 1024
const HELP_RU_SUBDIR = 'ru'
const HELP_EN_SUBDIR = 'en'

function parseReadArticleRequest(raw: unknown): {
  slug: unknown
  preferredUiLocale?: 'ru' | 'en'
} {
  if (typeof raw === 'string') {
    return { slug: raw }
  }
  if (raw !== null && typeof raw === 'object' && 'slug' in raw) {
    const rec = raw as Record<string, unknown>
    const loc = rec['preferredUiLocale']
    const preferredUiLocale = loc === 'en' || loc === 'ru' ? loc : undefined
    const slug = rec['slug']
    return preferredUiLocale !== undefined ? { slug, preferredUiLocale } : { slug }
  }
  return { slug: raw }
}

function titleFromMarkdown(fileName: string, markdown: string): string {
  const firstHeading = markdown
    .split(/\r?\n/, 12)
    .map((line) => line.trim())
    .find((line) => /^#\s+/.test(line))
  if (firstHeading) {
    return firstHeading.replace(/^#\s+/, '').trim()
  }
  return basename(fileName, '.md')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (s) => s.toUpperCase())
}

function safeHelpFileName(slug: unknown): string | null {
  if (typeof slug !== 'string') {
    return null
  }
  const clean = slug.trim().replace(/\.md$/i, '')
  if (!/^[a-z0-9][a-z0-9-]*$/i.test(clean)) {
    return null
  }
  return `${clean}.md`
}

export function resolveKnowledgeHelpDirectory(candidates: readonly string[]): string | null {
  for (const dir of candidates) {
    if (existsSync(dir) && statSync(dir).isDirectory()) {
      return dir
    }
  }
  return null
}

function readHelpMarkdown(helpDir: string, fileName: string): string | null {
  const abs = normalize(join(helpDir, fileName))
  const normalizedDir = normalize(helpDir)
  if (!abs.startsWith(normalizedDir)) {
    return null
  }
  if (!existsSync(abs) || !statSync(abs).isFile()) {
    return null
  }
  if (statSync(abs).size > MAX_ARTICLE_BYTES) {
    return null
  }
  return readFileSync(abs, 'utf8')
}

const MAX_INLINED_HELP_ASSET_BYTES = 512 * 1024

const HELP_ASSET_IMG_MD_RE =
  /!\[([^\]]*)\]\((assets\/[a-z0-9][a-z0-9._/-]*\.(?:png|jpg|jpeg|gif|webp|svg))\)/gi

const MIME_FOR_HELP_ASSET_EXT: Record<string, string> = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
}

/**
 * Встраивает мелкие `Help/assets/*` в markdown как `data:image/*;base64,...`, чтобы `<img>` в
 * Chromium не зависел от кастомной схемы `fluxhelp:` (CSP/загрузка с dev-сервера).
 */
function inlineKnowledgeMarkdownAssetImages(helpDir: string, markdown: string): string {
  const root = normalize(helpDir)
  return markdown.replace(HELP_ASSET_IMG_MD_RE, (full, alt: string, href: string) => {
    const cleanHref = href.replace(/^\.\//, '')
    if (!isKnowledgeSafeAssetImageHref(cleanHref)) {
      return full
    }
    const abs = normalize(join(helpDir, cleanHref))
    const rel = relative(root, abs).replace(/\\/g, '/')
    if (!rel.startsWith('assets/') || rel.includes('/../')) {
      return full
    }
    if (!existsSync(abs) || !statSync(abs).isFile()) {
      return full
    }
    if (statSync(abs).size > MAX_INLINED_HELP_ASSET_BYTES) {
      return full
    }
    const mime = MIME_FOR_HELP_ASSET_EXT[extname(abs).toLowerCase()]
    if (!mime) {
      return full
    }
    const buf = readFileSync(abs)
    return `![${alt}](data:${mime};base64,${buf.toString('base64')})`
  })
}

export function buildKnowledgeHelpDirCandidates(opts: {
  cwd: string
  appPath: string
  resourcesPath: string
  isPackaged: boolean
}): string[] {
  return opts.isPackaged
    ? [join(opts.resourcesPath, 'Help'), join(opts.appPath, 'Help'), join(opts.cwd, 'Help')]
    : [join(opts.cwd, 'Help'), join(opts.appPath, 'Help'), join(opts.resourcesPath, 'Help')]
}

export function listKnowledgeArticles(
  helpDirCandidates: readonly string[],
  locale: AppUiLocale = 'ru'
): KnowledgeArticleListResult {
  const helpDir = resolveKnowledgeHelpDirectory(helpDirCandidates)
  if (helpDir === null) {
    return { ok: false, error: getMainApplicationStrings(locale).knowledgeHelpNotFound }
  }
  const articles: KnowledgeArticleListItem[] = []
  const listLocale: AppUiLocale = locale
  const ruDir = normalize(join(helpDir, HELP_RU_SUBDIR))
  const enDir = normalize(join(helpDir, HELP_EN_SUBDIR))
  const helpRoot = normalize(helpDir)
  const hasRuDir = ruDir.startsWith(helpRoot) && existsSync(ruDir) && statSync(ruDir).isDirectory()
  const hasEnDir = enDir.startsWith(helpRoot) && existsSync(enDir) && statSync(enDir).isDirectory()
  const listDir = listLocale === 'en' && hasEnDir ? enDir : hasRuDir ? ruDir : helpRoot

  for (const fileName of readdirSync(listDir)
    .filter((f) => HELP_FILE_RE.test(f))
    .sort()) {
    let markdown: string | null = null
    if (listLocale === 'en' && hasEnDir) {
      markdown = readHelpMarkdown(enDir, fileName)
    }
    if (markdown === null && hasRuDir) {
      markdown = readHelpMarkdown(ruDir, fileName)
    }
    if (markdown === null) {
      markdown = readHelpMarkdown(helpDir, fileName)
    }
    if (markdown === null) {
      continue
    }
    articles.push({
      slug: basename(fileName, '.md'),
      fileName,
      title: titleFromMarkdown(fileName, markdown)
    })
  }
  return { ok: true, articles }
}

export function readKnowledgeArticle(
  helpDirCandidates: readonly string[],
  raw: unknown,
  fallbackLocale: AppUiLocale = 'ru'
): KnowledgeArticleResult {
  const { slug: rawSlug, preferredUiLocale } = parseReadArticleRequest(raw)
  const locale = preferredUiLocale ?? fallbackLocale
  const fileName = safeHelpFileName(rawSlug)
  if (fileName === null) {
    return { ok: false, error: getMainApplicationStrings(locale).knowledgeInvalidArticle }
  }
  const helpDir = resolveKnowledgeHelpDirectory(helpDirCandidates)
  if (helpDir === null) {
    return { ok: false, error: getMainApplicationStrings(locale).knowledgeHelpNotFound }
  }

  let markdown: string | null = null
  let resolvedFileName = fileName

  const ruDir = normalize(join(helpDir, HELP_RU_SUBDIR))
  const enDir = normalize(join(helpDir, HELP_EN_SUBDIR))
  const helpRoot = normalize(helpDir)
  const hasRuDir = ruDir.startsWith(helpRoot) && existsSync(ruDir) && statSync(ruDir).isDirectory()
  const hasEnDir = enDir.startsWith(helpRoot) && existsSync(enDir) && statSync(enDir).isDirectory()

  if (preferredUiLocale === 'en' && hasEnDir) {
    markdown = readHelpMarkdown(enDir, fileName)
    if (markdown !== null) {
      resolvedFileName = `${HELP_EN_SUBDIR}/${fileName}`
    }
  }

  if (markdown === null && hasRuDir) {
    markdown = readHelpMarkdown(ruDir, fileName)
    if (markdown !== null) {
      resolvedFileName = `${HELP_RU_SUBDIR}/${fileName}`
    }
  }

  if (markdown === null) {
    markdown = readHelpMarkdown(helpDir, fileName)
    resolvedFileName = fileName
  }

  if (markdown === null) {
    return { ok: false, error: getMainApplicationStrings(locale).knowledgeArticleNotFound }
  }
  const title = titleFromMarkdown(resolvedFileName, markdown)
  markdown = inlineKnowledgeMarkdownAssetImages(helpDir, markdown)
  return {
    ok: true,
    article: {
      slug: basename(fileName, '.md'),
      fileName: resolvedFileName,
      title
    },
    markdown
  }
}
