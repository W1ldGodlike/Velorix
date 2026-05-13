import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

import { app } from 'electron'
import { is } from '@electron-toolkit/utils'

import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import type { YtdlpCommandHintEntry } from '../shared/ytdlp-download-contract'
import { ytdlpHintTokenCategory } from '../shared/ytdlp-command-hint-token-categories'
import { categorySortRank, ytdlpHintsMiscCategoryLabel } from '../shared/ytdlp-hint-category-order'

export type { YtdlpCommandHintEntry } from '../shared/ytdlp-download-contract'

type RawYtdlpHintRow = {
  token: string
  summary: string
  /** Optional English summary; empty → fall back to `summary` for `en` UI. */
  summaryEn: string
  categoryFromJson: string | null
}

let rawMemo: RawYtdlpHintRow[] | undefined
const builtMemo: Partial<Record<DownloadsWindowUiLocale, YtdlpCommandHintEntry[]>> = {}

function resolveYtdlpCommandsJsonPath(): string | null {
  const resourcesPath = process.resourcesPath
  const packaged =
    typeof resourcesPath === 'string' && resourcesPath.length > 0
      ? join(resourcesPath, 'Data', 'ytdlp_commands.json')
      : null
  if (packaged !== null && !is.dev && existsSync(packaged)) {
    return packaged
  }
  const dev = join(app.getAppPath(), 'Data', 'ytdlp_commands.json')
  if (existsSync(dev)) {
    return dev
  }
  if (packaged !== null && existsSync(packaged)) {
    return packaged
  }
  return null
}

function loadRawYtdlpCommandHints(): RawYtdlpHintRow[] {
  if (rawMemo !== undefined) {
    return rawMemo
  }
  const path = resolveYtdlpCommandsJsonPath()
  if (!path) {
    rawMemo = []
    return rawMemo
  }
  try {
    const raw = readFileSync(path, 'utf-8')
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      rawMemo = []
      return rawMemo
    }
    const out: RawYtdlpHintRow[] = []
    for (const row of parsed) {
      if (!row || typeof row !== 'object') {
        continue
      }
      const o = row as { token?: unknown; summary?: unknown; summaryEn?: unknown; category?: unknown }
      if (typeof o.token !== 'string' || o.token.trim() === '') {
        continue
      }
      const summary = typeof o.summary === 'string' ? o.summary.trim().slice(0, 600) : ''
      const summaryEnRaw = typeof o.summaryEn === 'string' ? o.summaryEn.trim().slice(0, 600) : ''
      const summaryEn = summaryEnRaw.length > 0 ? summaryEnRaw : ''
      const token = o.token.trim()
      if (token.length > 160) {
        continue
      }
      const fromFile =
        typeof o.category === 'string' && o.category.trim().length > 0
          ? o.category.trim().slice(0, 80)
          : null
      out.push({ token, summary, summaryEn, categoryFromJson: fromFile })
    }
    rawMemo = out
    return rawMemo
  } catch {
    rawMemo = []
    return rawMemo
  }
}

/** Сортировка для UI: сначала порядок группы, затем токен. Экспорт для unit-тестов. */
export function sortYtdlpCommandHintsForUi(
  entries: YtdlpCommandHintEntry[],
  locale: DownloadsWindowUiLocale = 'ru'
): YtdlpCommandHintEntry[] {
  return [...entries].sort((a, b) => {
    const ra = categorySortRank(a.category, locale)
    const rb = categorySortRank(b.category, locale)
    if (ra !== rb) {
      return ra - rb
    }
    return a.token.localeCompare(b.token, locale === 'en' ? 'en' : 'ru')
  })
}

function buildYtdlpCommandHintsForLocale(locale: DownloadsWindowUiLocale): YtdlpCommandHintEntry[] {
  const misc = ytdlpHintsMiscCategoryLabel(locale)
  const raw = loadRawYtdlpCommandHints()
  const out: YtdlpCommandHintEntry[] = []
  for (const row of raw) {
    const fromFile = row.categoryFromJson
    const category =
      fromFile !== null && fromFile !== ''
        ? fromFile
        : (ytdlpHintTokenCategory(row.token, locale) ?? misc)
    const summary =
      locale === 'en' && row.summaryEn.length > 0 ? row.summaryEn : row.summary
    out.push({ token: row.token, summary, category })
  }
  return sortYtdlpCommandHintsForUi(out, locale)
}

/**
 * Читает справочник из `Data/ytdlp_commands.json` (dev — из репозитория, prod — extraResources).
 * Необязательное поле `summaryEn` задаёт текст подсказки для UI на английском; без него для `en` используется `summary`.
 * Ошибки чтения не роняют процесс: возвращается пустой список.
 */
export function getYtdlpCommandHints(
  locale: DownloadsWindowUiLocale = 'ru'
): YtdlpCommandHintEntry[] {
  const cached = builtMemo[locale]
  if (cached !== undefined) {
    return cached
  }
  const built = buildYtdlpCommandHintsForLocale(locale)
  builtMemo[locale] = built
  return built
}
