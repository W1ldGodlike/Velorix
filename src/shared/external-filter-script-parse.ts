import type { ExternalFilterScriptKind } from './external-filter-script-contract'

const KINDS: readonly ExternalFilterScriptKind[] = ['off', 'avisynth', 'vapoursynth']

export function parseExternalFilterScriptKind(raw: unknown): ExternalFilterScriptKind {
  if (typeof raw !== 'string') {
    return 'off'
  }
  const v = raw.trim() as ExternalFilterScriptKind
  return KINDS.includes(v) ? v : 'off'
}

export function parseExternalFilterScriptPathStored(raw: unknown): string | null {
  if (typeof raw !== 'string') {
    return null
  }
  const t = raw.trim()
  return t.length > 0 && t.length <= 4096 ? t : null
}

export function externalFilterScriptExtensionForKind(
  kind: ExternalFilterScriptKind
): '.avs' | '.vpy' | null {
  if (kind === 'avisynth') {
    return '.avs'
  }
  if (kind === 'vapoursynth') {
    return '.vpy'
  }
  return null
}

export function externalFilterScriptPathMatchesKind(
  scriptPath: string,
  kind: ExternalFilterScriptKind
): boolean {
  const ext = externalFilterScriptExtensionForKind(kind)
  if (ext === null) {
    return false
  }
  return scriptPath.trim().toLowerCase().endsWith(ext)
}
