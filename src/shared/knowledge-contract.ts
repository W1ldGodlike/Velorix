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

/** §15 / терминал — `Help/ffmpeg-terminal-hints.md`. */
export const KNOWLEDGE_SLUG_FFMPEG_TERMINAL_HINTS = 'ffmpeg-terminal-hints'

/** Правая панель загрузок — `Help/downloads-settings-rail.md`. */
export const KNOWLEDGE_SLUG_DOWNLOADS_SETTINGS_RAIL = 'downloads-settings-rail'

/** Пресеты и rail ffmpeg — `Help/ffmpeg-rail-presets.md`. */
export const KNOWLEDGE_SLUG_FFMPEG_RAIL_PRESETS = 'ffmpeg-rail-presets'

/** Пакетный экспорт и очереди — `Help/session-and-queues.md`. */
export const KNOWLEDGE_SLUG_SESSION_AND_QUEUES = 'session-and-queues'

/** Инспектор ffprobe — `Help/probe-and-inspector-basics.md`. */
export const KNOWLEDGE_SLUG_PROBE_AND_INSPECTOR = 'probe-and-inspector-basics'

/** FAQ — `Help/faq-troubleshooting.md`. */
export const KNOWLEDGE_SLUG_FAQ_TROUBLESHOOTING = 'faq-troubleshooting'

/** §16 — аппаратные кодеры и ручной smoke в настройках. */
export const KNOWLEDGE_SLUG_HARDWARE_ENCODING = 'hardware-encoding'

/** §1.1 — тема, язык, HiDPI-панель в настройках. */
export const KNOWLEDGE_SLUG_APPEARANCE_LANGUAGE_THEME = 'appearance-language-theme'

/** §3 — ручной smoke packaged Win после pack:dir. */
export const KNOWLEDGE_SLUG_PACKAGED_WINDOWS_SMOKE = 'packaged-windows-smoke'

/** §3 — ручной smoke packaged Linux после pack:linux:dir. */
export const KNOWLEDGE_SLUG_PACKAGED_LINUX_SMOKE = 'packaged-linux-smoke'

/** §3 — ручной smoke packaged macOS после pack:mac:dir. */
export const KNOWLEDGE_SLUG_PACKAGED_MACOS_SMOKE = 'packaged-macos-smoke'
