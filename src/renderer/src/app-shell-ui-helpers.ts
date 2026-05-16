import { uiText } from './locales/ui-text'

export function previewVideoMediaErrorDetailLabel(code: number): string {
  switch (code) {
    case 1:
      return uiText('statusVideoMediaErrAborted')
    case 2:
      return uiText('statusVideoMediaErrNetwork')
    case 3:
      return uiText('statusVideoMediaErrDecode')
    case 4:
      return uiText('statusVideoMediaErrSrcNotSupported')
    default:
      return uiText('statusVideoMediaErrUnknown')
  }
}

export function clipboardLooksLikeDownloadsPayload(text: string): boolean {
  const t = text.trim()
  if (t.length < 12) {
    return false
  }
  const lines = t.split(/\r?\n/)
  return lines.some((line) => {
    const x = line.trim()
    return /^https?:\/\//i.test(x) || (/^[\w.-]+\.[a-z]{2,}\//i.test(x) && x.includes('/'))
  })
}

export function basenameForAriaLabel(absPath: string): string {
  const n = absPath.replace(/\\/g, '/')
  const i = n.lastIndexOf('/')
  return i >= 0 ? n.slice(i + 1) : n
}

export function domTargetIsTextField(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) {
    return false
  }
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
    return true
  }
  return target.isContentEditable
}
