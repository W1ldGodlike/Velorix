import { useCallback, useEffect, useState, type JSX } from 'react'

import type { ExternalFilterScriptKind } from '../../../../shared/external-filter-script-contract'
import { getUiLocale, uiText, uiTextVars } from '../../locales/ui-text'

export type ExternalFilterScriptDialogProps = {
  open: boolean
  onClose: () => void
  onStatus: (message: string) => void
  onApplied: () => void
}

export function ExternalFilterScriptDialog(props: ExternalFilterScriptDialogProps): JSX.Element | null {
  const { open, onClose, onStatus, onApplied } = props
  const [kind, setKind] = useState<ExternalFilterScriptKind>('off')
  const [scriptPath, setScriptPath] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!open) {
      return
    }
    void window.fluxalloy.settings.get().then((s) => {
      const storedKind = s.ffmpegExportExternalFilterKind ?? 'off'
      setKind(
        storedKind === 'avisynth' || storedKind === 'vapoursynth' ? storedKind : 'off'
      )
      setScriptPath(s.ffmpegExportExternalFilterScriptPath ?? '')
    })
  }, [open])

  const pickScript = useCallback(async (): Promise<void> => {
    if (kind === 'off' || busy) {
      onStatus(uiText('externalFilterScriptPickRequiresKind'))
      return
    }
    setBusy(true)
    try {
      const res = await window.fluxalloy.externalFilterScript.pickFile({
        kind,
        uiLocale: getUiLocale()
      })
      if (res.ok) {
        setScriptPath(res.path)
        onStatus(
          uiTextVars('externalFilterScriptFileSelected', {
            name: res.path.replace(/^.*[/\\]/, '')
          })
        )
      } else if ('error' in res) {
        onStatus(res.error)
      }
    } finally {
      setBusy(false)
    }
  }, [busy, kind, onStatus])

  const save = useCallback(async (): Promise<void> => {
    if (busy) {
      return
    }
    setBusy(true)
    try {
      const res = await window.fluxalloy.externalFilterScript.apply({
        kind,
        scriptPath: kind === 'off' ? null : scriptPath,
        uiLocale: getUiLocale()
      })
      if (res.ok) {
        onStatus(
          kind === 'off'
            ? uiText('externalFilterScriptCleared')
            : uiText('externalFilterScriptSaved')
        )
        onClose()
      } else if ('error' in res) {
        onStatus(res.error)
      }
    } finally {
      setBusy(false)
    }
  }, [busy, kind, onApplied, onClose, onStatus, scriptPath])

  if (!open) {
    return null
  }

  return (
    <div
      className="app-modal-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (busy) {
          return
        }
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        className="app-modal"
        role="dialog"
        aria-modal="true"
        aria-busy={busy}
        aria-labelledby="external-filter-script-title"
        aria-describedby="external-filter-script-hint"
        onMouseDown={(e) => {
          e.stopPropagation()
        }}
      >
        <h2 id="external-filter-script-title" className="app-modal-title">
          {uiText('externalFilterScriptDialogTitle')}
        </h2>
        <p id="external-filter-script-hint" className="app-modal-hint">
          {uiText('externalFilterScriptDialogHint')}
        </p>
        <div className="app-settings-field-row">
          <label
            className="app-settings-label"
            htmlFor="external-filter-kind"
            title={uiText('externalFilterScriptKindTitle')}
          >
            {uiText('externalFilterScriptKindLabel')}
          </label>
          <select
            id="external-filter-kind"
            className="app-settings-select"
            title={uiText('externalFilterScriptKindTitle')}
            disabled={busy}
            value={kind}
            onChange={(e) => {
              setKind(e.target.value as ExternalFilterScriptKind)
            }}
          >
            <option value="off">{uiText('externalFilterScriptKindOff')}</option>
            <option value="avisynth">{uiText('externalFilterScriptKindAvs')}</option>
            <option value="vapoursynth">{uiText('externalFilterScriptKindVpy')}</option>
          </select>
        </div>
        <p className="app-modal-hint" title={scriptPath}>
          {scriptPath.length > 0
            ? scriptPath.replace(/^.*[/\\]/, '')
            : uiText('externalFilterScriptNoFile')}
        </p>
        <div
          className="app-settings-benchmark-actions"
          role="toolbar"
          aria-label={uiText('externalFilterScriptToolbarAria')}
          aria-describedby="external-filter-script-hint"
        >
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={busy || kind === 'off'}
            title={uiText('externalFilterScriptPickTitle')}
            onClick={() => {
              void pickScript()
            }}
          >
            {uiText('externalFilterScriptPick')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-primary app-btn-compact"
            disabled={busy}
            title={uiText('externalFilterScriptSaveTitle')}
            onClick={() => {
              void save()
            }}
          >
            {uiText('externalFilterScriptSave')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={busy}
            title={uiText('externalFilterScriptCancelTitle')}
            onClick={onClose}
          >
            {uiText('externalFilterScriptCancel')}
          </button>
        </div>
      </div>
    </div>
  )
}