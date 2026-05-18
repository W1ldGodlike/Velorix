/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Parse `ui-text-strings-{locale}-NN.ts` export object into key → string map.
 */

/**
 * @param {string} raw
 * @returns {string | null}
 */
export function parseTsStringLiteral(raw) {
  const trimmed = raw.trim().replace(/,\s*$/, '')
  if (trimmed.startsWith("'")) {
    let out = ''
    let i = 1
    while (i < trimmed.length) {
      const ch = trimmed[i]
      if (ch === '\\' && i + 1 < trimmed.length) {
        const next = trimmed[i + 1]
        if (next === "'") {
          out += "'"
          i += 2
          continue
        }
        if (next === '\\') {
          out += '\\'
          i += 2
          continue
        }
        out += ch + next
        i += 2
        continue
      }
      if (ch === "'") {
        if (i !== trimmed.length - 1) {
          return null
        }
        return out
      }
      out += ch
      i++
    }
    return null
  }
  return null
}

/**
 * @param {string} content
 * @returns {Map<string, string>}
 */
export function parseUiTextTsPart(content) {
  const map = new Map()
  const lines = content.split('\n')
  let i = 0
  while (i < lines.length) {
    const prop = lines[i].match(/^ {2}([a-zA-Z][\w$]*):\s*(.*)$/)
    if (!prop) {
      i++
      continue
    }
    const key = prop[1]
    let rest = prop[2]
    i++
    const chunks = []
    if (rest.trim()) {
      chunks.push(rest.trim())
    }
    while (i < lines.length) {
      if (/^ {2}[a-zA-Z][\w$]*:/.test(lines[i])) {
        break
      }
      if (/^} as const/.test(lines[i].trim())) {
        break
      }
      const t = lines[i].trim()
      if (t) {
        chunks.push(t)
      }
      i++
    }
    const raw = chunks.join(' ')
    const val = parseTsStringLiteral(raw)
    if (val !== null) {
      map.set(key, val)
    }
  }
  return map
}

/**
 * @param {string} content
 * @param {Set<string>} jsonKeys
 * @returns {string}
 */
export function pruneUiTextTsPart(content, jsonKeys) {
  const lines = content.split('\n')
  const out = []
  let i = 0
  while (i < lines.length) {
    const prop = lines[i].match(/^ {2}([a-zA-Z][\w$]*):\s*(.*)$/)
    if (!prop) {
      out.push(lines[i])
      i++
      continue
    }
    const key = prop[1]
    const start = i
    i++
    while (i < lines.length) {
      if (/^ {2}[a-zA-Z][\w$]*:/.test(lines[i])) {
        break
      }
      if (/^} as const/.test(lines[i].trim())) {
        break
      }
      i++
    }
    if (!jsonKeys.has(key)) {
      for (let j = start; j < i; j++) {
        out.push(lines[j])
      }
    }
  }
  return out.join('\n')
}
