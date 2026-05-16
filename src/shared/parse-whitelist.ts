/**
 * Парсинг enum-like значений из IPC/settings без копипасты `if (raw === 'a' || …)`.
 */
export function parseWhitelistEnum<T extends string>(
  raw: unknown,
  allowed: readonly T[],
  fallback: T
): T {
  if (typeof raw === 'string' && (allowed as readonly string[]).includes(raw)) {
    return raw as T
  }
  return fallback
}
