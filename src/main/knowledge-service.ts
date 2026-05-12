import { existsSync, readdirSync, readFileSync, statSync } from 'fs'
import { basename, join, normalize } from 'path'

import type {
  KnowledgeArticleListItem,
  KnowledgeArticleListResult,
  KnowledgeArticleResult
} from '../shared/knowledge-contract'

const HELP_FILE_RE = /^[a-z0-9][a-z0-9-]*\.md$/i
const MAX_ARTICLE_BYTES = 256 * 1024

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

function resolveHelpDir(candidates: readonly string[]): string | null {
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

export function listKnowledgeArticles(helpDirCandidates: readonly string[]): KnowledgeArticleListResult {
  const helpDir = resolveHelpDir(helpDirCandidates)
  if (helpDir === null) {
    return { ok: false, error: 'Каталог Help не найден' }
  }
  const articles: KnowledgeArticleListItem[] = []
  for (const fileName of readdirSync(helpDir).filter((f) => HELP_FILE_RE.test(f)).sort()) {
    const markdown = readHelpMarkdown(helpDir, fileName)
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
  rawSlug: unknown
): KnowledgeArticleResult {
  const fileName = safeHelpFileName(rawSlug)
  if (fileName === null) {
    return { ok: false, error: 'Некорректная статья справки' }
  }
  const helpDir = resolveHelpDir(helpDirCandidates)
  if (helpDir === null) {
    return { ok: false, error: 'Каталог Help не найден' }
  }
  const markdown = readHelpMarkdown(helpDir, fileName)
  if (markdown === null) {
    return { ok: false, error: 'Статья справки не найдена' }
  }
  return {
    ok: true,
    article: {
      slug: basename(fileName, '.md'),
      fileName,
      title: titleFromMarkdown(fileName, markdown)
    },
    markdown
  }
}
