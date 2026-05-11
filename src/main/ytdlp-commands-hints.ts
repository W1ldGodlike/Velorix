import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

import { app } from 'electron'
import { is } from '@electron-toolkit/utils'

import type { YtdlpCommandHintEntry } from '../shared/ytdlp-download-contract'
import { categorySortRank } from '../shared/ytdlp-hint-category-order'

export type { YtdlpCommandHintEntry } from '../shared/ytdlp-download-contract'

/**
 * Базовая классификация токенов справочника §6.3.
 * Поле `category` в JSON (`Data/ytdlp_commands.json`) при наличии переопределяет значение отсюда.
 */
const YTDLP_HINT_TOKEN_CATEGORY: Readonly<Record<string, string>> = {
  '--help': 'Справка',
  '-F': 'Форматы и кодеки',
  '-f': 'Форматы и кодеки',
  '--list-formats': 'Форматы и кодеки',
  '-g': 'Форматы и кодеки',
  best: 'Форматы и кодеки',
  '--merge-output-format': 'Форматы и кодеки',
  '-x': 'Форматы и кодеки',
  '--audio-format': 'Форматы и кодеки',
  '--proxy': 'Сеть и HTTP',
  '--limit-rate': 'Сеть и HTTP',
  '--no-check-certificates': 'Сеть и HTTP',
  '--user-agent': 'Сеть и HTTP',
  '--referer': 'Сеть и HTTP',
  '--add-header': 'Сеть и HTTP',
  '--socket-timeout': 'Сеть и HTTP',
  '--retries': 'Сеть и HTTP',
  '--fragment-retries': 'Сеть и HTTP',
  '--concurrent-fragments': 'Сеть и HTTP',
  '-N': 'Сеть и HTTP',
  '--impersonate': 'Доступ и cookies',
  chrome: 'Доступ и cookies',
  '--cookies': 'Доступ и cookies',
  '--cookies-from-browser': 'Доступ и cookies',
  '--ap-mso': 'Доступ и cookies',
  '--continue': 'Загрузка: режим и файлы',
  '--no-live': 'Загрузка: режим и файлы',
  '--skip-download': 'Загрузка: режим и файлы',
  '--download-sections': 'Загрузка: режим и файлы',
  '--no-part': 'Загрузка: режим и файлы',
  '--no-overwrites': 'Загрузка: режим и файлы',
  '--restrict-filenames': 'Загрузка: режим и файлы',
  '--windows-filenames': 'Загрузка: режим и файлы',
  '-o': 'Загрузка: режим и файлы',
  '-a': 'Загрузка: режим и файлы',
  '--playlist-end': 'Плейлист и фильтры',
  '--playlist-items': 'Плейлист и фильтры',
  '--no-playlist': 'Плейлист и фильтры',
  '--dateafter': 'Плейлист и фильтры',
  '--extractor-args': 'Плейлист и фильтры',
  '--geo-bypass': 'Плейлист и фильтры',
  '--write-subs': 'Субтитры, обложки и метаданные',
  '--embed-subs': 'Субтитры, обложки и метаданные',
  '--write-thumbnail': 'Субтитры, обложки и метаданные',
  '--write-info-json': 'Субтитры, обложки и метаданные',
  '--write-description': 'Субтитры, обложки и метаданные',
  '--write-comments': 'Субтитры, обложки и метаданные',
  '--embed-metadata': 'Субтитры, обложки и метаданные',
  '--embed-thumbnail': 'Субтитры, обложки и метаданные',
  '--ffmpeg-location': 'Субтитры, обложки и метаданные',
  '--newline': 'Вывод и лог',
  '--progress': 'Вывод и лог',
  '--no-warnings': 'Вывод и лог'
}

/** Сортировка для UI: сначала порядок группы, затем токен. Экспорт для unit-тестов. */
export function sortYtdlpCommandHintsForUi(
  entries: YtdlpCommandHintEntry[]
): YtdlpCommandHintEntry[] {
  return [...entries].sort((a, b) => {
    const ra = categorySortRank(a.category)
    const rb = categorySortRank(b.category)
    if (ra !== rb) {
      return ra - rb
    }
    return a.token.localeCompare(b.token, 'ru')
  })
}

let memo: YtdlpCommandHintEntry[] | undefined

function resolveYtdlpCommandsJsonPath(): string | null {
  const packaged = join(process.resourcesPath, 'Data', 'ytdlp_commands.json')
  if (!is.dev && existsSync(packaged)) {
    return packaged
  }
  const dev = join(app.getAppPath(), 'Data', 'ytdlp_commands.json')
  if (existsSync(dev)) {
    return dev
  }
  if (existsSync(packaged)) {
    return packaged
  }
  return null
}

/**
 * Читает справочник из `Data/ytdlp_commands.json` (dev — из репозитория, prod — extraResources).
 * Ошибки чтения не роняют процесс: возвращается пустой список.
 */
export function getYtdlpCommandHints(): YtdlpCommandHintEntry[] {
  if (memo !== undefined) {
    return memo
  }
  const path = resolveYtdlpCommandsJsonPath()
  if (!path) {
    memo = []
    return memo
  }
  try {
    const raw = readFileSync(path, 'utf-8')
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) {
      memo = []
      return memo
    }
    const out: YtdlpCommandHintEntry[] = []
    for (const row of parsed) {
      if (!row || typeof row !== 'object') {
        continue
      }
      const o = row as { token?: unknown; summary?: unknown; category?: unknown }
      if (typeof o.token !== 'string' || o.token.trim() === '') {
        continue
      }
      const summary = typeof o.summary === 'string' ? o.summary.trim().slice(0, 600) : ''
      const token = o.token.trim()
      if (token.length > 160) {
        continue
      }
      const fromFile =
        typeof o.category === 'string' && o.category.trim().length > 0
          ? o.category.trim().slice(0, 80)
          : ''
      const category = fromFile !== '' ? fromFile : (YTDLP_HINT_TOKEN_CATEGORY[token] ?? 'Прочее')
      out.push({ token, summary, category })
    }
    memo = sortYtdlpCommandHintsForUi(out)
    return memo
  } catch {
    memo = []
    return memo
  }
}
