import type { TerminalCommandHintEntry, TerminalToolId } from './terminal-contract'

/** §8 — максимум строк в компактном IntelliSense под полем argv (терминал). */
export const DEFAULT_TERMINAL_INLINE_SUGGEST_MAX = 14

/** §8 — шаг PgUp/PgDn в списке подсказок (не больше длины списка). */
export const DEFAULT_TERMINAL_INLINE_SUGGEST_PAGE_STEP = 5

/**
 * Навигация по индексу подсказки: при смене фильтра `prevIndex` может быть больше длины списка —
 * сначала приводим к последнему допустимому, затем шаг/Home/End/PageUp/PageDown.
 */
export function stepTerminalSuggestIndex(
  prevIndex: number,
  listLength: number,
  step: 'up' | 'down' | 'home' | 'end' | 'pageUp' | 'pageDown',
  pageSize: number = DEFAULT_TERMINAL_INLINE_SUGGEST_PAGE_STEP
): number {
  if (listLength <= 0) {
    return 0
  }
  const last = listLength - 1
  const cur = Math.min(prevIndex, last)
  if (step === 'home') {
    return 0
  }
  if (step === 'end') {
    return last
  }
  const jump = Math.max(1, Math.min(pageSize, listLength))
  if (step === 'pageDown') {
    return Math.min(last, cur + jump)
  }
  if (step === 'pageUp') {
    return Math.max(0, cur - jump)
  }
  if (step === 'down') {
    return Math.min(last, cur + 1)
  }
  return Math.max(0, cur - 1)
}

const TERMINAL_TOOLS: readonly TerminalToolId[] = ['ffmpeg', 'ffprobe', 'yt-dlp']

function isTerminalToolId(value: string): value is TerminalToolId {
  return (TERMINAL_TOOLS as readonly string[]).includes(value)
}

/** Убирает декоративный префикс сценарных токенов (`· …`) для сопоставления с argv. */
export function normalizeTerminalHintToken(token: string): string {
  return token.replace(/^\s*·\s*/u, '').trim()
}

/**
 * §8 — подсказки в строке ввода терминала (IntelliSense v1): фильтрация по текущему argv-токену
 * и по префиксу `fullLine` для сценарных шаблонов.
 */
/** Подставляет выбранную подсказку в argv-строку (последний токен или целиком `fullLine`). */
export function applyTerminalInlinePick(params: {
  line: string
  hint: TerminalCommandHintEntry
}): string {
  const { line, hint } = params
  if (typeof hint.fullLine === 'string' && hint.fullLine.trim().length > 0) {
    return hint.fullLine
  }
  const token = normalizeTerminalHintToken(hint.token)
  if (!token) {
    return line
  }
  const hadTrailingSpace = /\s$/.test(line)
  const trimmedRight = line.replace(/\s+$/, '')
  const lastSpace = trimmedRight.lastIndexOf(' ')
  const head = lastSpace >= 0 ? trimmedRight.slice(0, lastSpace + 1) : ''
  const lastTok = lastSpace >= 0 ? trimmedRight.slice(lastSpace + 1) : trimmedRight

  if (hadTrailingSpace) {
    return `${trimmedRight} ${token} `
  }
  if (head === '') {
    const lt = lastTok.toLowerCase()
    if (isTerminalToolId(lt) && token.startsWith('-')) {
      return `${lastTok} ${token} `
    }
    return `${token} `
  }
  return `${head}${token} `
}

export function filterTerminalInlineSuggestions(params: {
  line: string
  hints: readonly TerminalCommandHintEntry[]
  max?: number
}): TerminalCommandHintEntry[] {
  const max = params.max ?? DEFAULT_TERMINAL_INLINE_SUGGEST_MAX
  const hints = params.hints
  const raw = params.line
  const endsWithSpace = /\s$/.test(raw)
  const trimmed = raw.trim()
  if (trimmed.length === 0) {
    return []
  }

  const parts = trimmed.split(/\s+/).filter(Boolean)
  const firstRaw = parts[0] ?? ''
  const firstLower = firstRaw.toLowerCase()

  const pick = (pred: (h: TerminalCommandHintEntry) => boolean): TerminalCommandHintEntry[] => {
    const out: TerminalCommandHintEntry[] = []
    const seen = new Set<string>()
    for (const h of hints) {
      if (!pred(h)) {
        continue
      }
      const key = `${h.tool}\0${h.token}\0${h.fullLine ?? ''}`
      if (seen.has(key)) {
        continue
      }
      seen.add(key)
      out.push(h)
      if (out.length >= max) {
        break
      }
    }
    return out
  }

  const toolHintsFor = (tool: TerminalToolId): TerminalCommandHintEntry[] =>
    pick((h) => h.tool === tool)

  // Один токен: либо уже известный инструмент (как после пробела), либо префикс имени/токена.
  if (parts.length === 1 && !endsWithSpace) {
    if (isTerminalToolId(firstLower)) {
      return toolHintsFor(firstLower)
    }
    return pick((h) => {
      const toolLc = h.tool.toLowerCase()
      if (toolLc.startsWith(firstLower) && firstLower.length >= 2) {
        return true
      }
      const t = normalizeTerminalHintToken(h.token).toLowerCase()
      if (t.startsWith(firstLower)) {
        return true
      }
      const fl = h.fullLine?.trim().toLowerCase() ?? ''
      const tl = trimmed.toLowerCase()
      if (fl.startsWith(tl) && fl.length > tl.length) {
        return true
      }
      return false
    })
  }

  if (parts.length >= 1 && endsWithSpace) {
    if (!isTerminalToolId(firstLower)) {
      return []
    }
    return toolHintsFor(firstLower)
  }

  const tool = parts[0]!.toLowerCase()
  if (!isTerminalToolId(tool)) {
    return []
  }
  const prefix = parts[parts.length - 1]!.toLowerCase()
  const lineLower = trimmed.toLowerCase()
  return pick((h) => {
    if (h.tool !== tool) {
      return false
    }
    const nt = normalizeTerminalHintToken(h.token).toLowerCase()
    if (nt.startsWith(prefix)) {
      return true
    }
    const fl = h.fullLine?.trim().toLowerCase() ?? ''
    if (fl.startsWith(lineLower) && fl.length > trimmed.length) {
      return true
    }
    return false
  })
}
