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

/** Deep-link из UI в базу знаний: логи, Support ZIP, диагностика (`Help/ru/about-support-logs.md`). */
export const KNOWLEDGE_SLUG_ABOUT_SUPPORT_LOGS = 'about-support-logs'

/** §15 / терминал — `Help/ru/ffmpeg-terminal-hints.md`. */
export const KNOWLEDGE_SLUG_FFMPEG_TERMINAL_HINTS = 'ffmpeg-terminal-hints'

/** Правая панель загрузок — `Help/ru/downloads-settings-rail.md`. */
export const KNOWLEDGE_SLUG_DOWNLOADS_SETTINGS_RAIL = 'downloads-settings-rail'

/** Пресеты и rail ffmpeg — `Help/ru/ffmpeg-rail-presets.md`. */
export const KNOWLEDGE_SLUG_FFMPEG_RAIL_PRESETS = 'ffmpeg-rail-presets'

/** Пакетный экспорт и очереди — `Help/ru/session-and-queues.md`. */
export const KNOWLEDGE_SLUG_SESSION_AND_QUEUES = 'session-and-queues'

/** §6.4 — история загрузок yt-dlp (вкладка и pop-out). */
export const KNOWLEDGE_SLUG_DOWNLOADS_WORKFLOW = 'downloads-workflow'

/** Инспектор ffprobe — `Help/ru/probe-and-inspector-basics.md`. */
export const KNOWLEDGE_SLUG_PROBE_AND_INSPECTOR = 'probe-and-inspector-basics'

/** FAQ — `Help/ru/faq-troubleshooting.md`. */
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

/** §10/§11 — планировщик, watch-folder, сценарии, запуск из редактора. */
export const KNOWLEDGE_SLUG_WORKFLOWS_PLANNER_SCENARIOS = 'workflows-planner-scenarios'

/** §13 — история обработки в правой FFmpeg-панели. */
export const KNOWLEDGE_SLUG_PROCESSING_HISTORY = 'processing-history'

/** §16/§1.1/§10 — единый ручной smoke владельца (HiDPI + HW + OS scheduler). */
export const KNOWLEDGE_SLUG_OWNER_MANUAL_SMOKE = 'owner-manual-smoke'

/** §14 — меню Проводника и Open with (Windows). */
export const KNOWLEDGE_SLUG_WINDOWS_SHELL_INTEGRATION = 'windows-shell-integration'
