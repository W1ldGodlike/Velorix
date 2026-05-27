/**
 * Whitelist-парсинг полей settings.json (stored) — без копипасты `if (raw === …)`.
 */

/** Точное совпадение `raw` со строкой из whitelist; иначе `undefined` (поле не сохраняем). */
export function parseStoredWhitelistEnum<T extends string>(
  raw: unknown,
  allowed: readonly T[]
): T | undefined {
  if (typeof raw === 'string' && (allowed as readonly string[]).includes(raw)) {
    return raw as T
  }
  return undefined
}

/** Строка из JSON после trim; whitelist; иначе `undefined`. */
export function parseStoredTrimmedWhitelistEnum<T extends string>(
  raw: unknown,
  allowed: readonly T[]
): T | undefined {
  if (typeof raw !== 'string') {
    return undefined
  }
  const t = raw.trim()
  if ((allowed as readonly string[]).includes(t)) {
    return t as T
  }
  return undefined
}

export function parseStoredTheme(_raw: unknown): 'dark' {
  void _raw
  return 'dark'
}
