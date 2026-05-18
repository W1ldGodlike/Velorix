/** §11 — нормализация URL для блока «Скачать» в сценарии. */
export function normalizeWorkflowScenarioSourceUrl(raw: string): string | null {
  const t = raw.trim()
  if (t.length < 8) {
    return null
  }
  if (/^https?:\/\//i.test(t)) {
    return t
  }
  if (/^[a-z0-9.-]+\.[a-z]{2,}(\/|$)/i.test(t) && /\//.test(t)) {
    return `https://${t.replace(/^\/+/, '')}`
  }
  if (/^www\./i.test(t)) {
    return `https://${t}`
  }
  return null
}

export function resolveWorkflowScenarioDownloadSourceUrl(
  nodes: readonly { kind: string; sourceUrl?: string }[]
): string | null {
  const download = nodes.find((n) => n.kind === 'download')
  if (!download?.sourceUrl) {
    return null
  }
  return normalizeWorkflowScenarioSourceUrl(download.sourceUrl)
}
