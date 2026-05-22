const SLUG_RE = /^[a-z0-9][a-z0-9-]*$/i

/** Разрешённые пути картинок в статьях: только `Help/assets/**` с безопасным именем файла. */
const KNOWLEDGE_ASSET_IMAGE_RE =
  /^(?:\.\/)?assets\/[a-z0-9][a-z0-9._/-]*\.(?:png|jpg|jpeg|gif|webp|svg)$/i

export function isKnowledgeSafeAssetImageHref(href: string): boolean {
  const t = href.trim()
  if (t.includes('..') || t.includes('\\')) {
    return false
  }
  return KNOWLEDGE_ASSET_IMAGE_RE.test(t)
}

const KNOWLEDGE_DATA_IMAGE_BASE64_MAX_CHARS = 700_000

/** Разрешённые `data:image/*;base64,...` из main (в base64 нет `)`, markdown-парсер не ломается). */
export function isKnowledgeTrustedDataImageSrc(href: string): boolean {
  const t = href.trim()
  if (t.length === 0 || t.length > KNOWLEDGE_DATA_IMAGE_BASE64_MAX_CHARS) {
    return false
  }
  return /^data:image\/(?:svg\+xml|png|jpeg|gif|webp);base64,[A-Za-z0-9+/]+=*$/i.test(t)
}

export function isKnowledgeTrustedImageSrc(href: string): boolean {
  return isKnowledgeSafeAssetImageHref(href) || isKnowledgeTrustedDataImageSrc(href)
}

/** URL для `<img src>` в Electron (схема регистрируется в main). */
export function knowledgeHelpAssetVelorixhelpUrl(href: string): string {
  const t = href.trim()
  if (t.startsWith('data:')) {
    return t
  }
  const clean = t.replace(/^\.\//, '')
  return `velorixhelp:///${clean
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')}`
}

export function normalizeKnowledgeMarkdownSource(raw: string): string {
  return raw.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
}

/** Строка целиком — thematic break (CommonMark-подобно: `---`, `* * *`, `___` и варианты с пробелами). */
export function isKnowledgeThematicBreak(trimmed: string): boolean {
  if (trimmed.length < 3) {
    return false
  }
  return (
    /^(?:\*[ \t]*){3,}$/.test(trimmed) ||
    /^(?:-[ \t]*){3,}$/.test(trimmed) ||
    /^(?:_[ \t]*){3,}$/.test(trimmed)
  )
}

/** Безопасные внутренние ссылки вида `foo.md` / `./foo.md` → slug; иначе `null`. */
export function knowledgeInternalSlugFromHref(href: string): string | null {
  const t = href.trim()
  if (t.length === 0) {
    return null
  }
  if (/^[a-z][a-z+.-]*:/i.test(t)) {
    return null
  }
  const base = t.split(/[/\\]/).pop() ?? t
  const slug = base.replace(/\.md$/i, '')
  if (!SLUG_RE.test(slug)) {
    return null
  }
  return slug
}
