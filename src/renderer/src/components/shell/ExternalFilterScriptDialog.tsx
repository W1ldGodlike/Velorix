import { useCallback, useEffect, useId, useState, type JSX } from 'react'

import type { ExternalFilterScriptKind } from '../../../../shared/external-filter-script-contract'
import { getUiLocale, uiText, uiTextVars } from '../../locales/ui-text'

export type ExternalFilterScriptDialogProps = {
  open: boolean
  onClose: () => void
  onStatus: (message: string) => void
  onApplied: () => void
  presentation?: 'dialog' | 'embedded'
  onExitEmbedded?: () => void
  showCancelAction?: boolean
}

export function ExternalFilterScriptDialog(
  props: ExternalFilterScriptDialogProps
): JSX.Element | null {
  const {
    open,
    onClose,
    onStatus,
    onApplied,
    presentation = 'dialog',
    onExitEmbedded,
    showCancelAction = true
  } = props
  const [kind, setKind] = useState<ExternalFilterScriptKind>('off')
  const [scriptPath, setScriptPath] = useState('')
  const [busy, setBusy] = useState(false)
  const dialogId = useId()

  useEffect(() => {
    if (!open) {
      return
    }
    void window.velorix.settings.get().then((s) => {
      const storedKind = s.ffmpegExportExternalFilterKind ?? 'off'
      setKind(storedKind === 'avisynth' || storedKind === 'vapoursynth' ? storedKind : 'off')
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
      const res = await window.velorix.externalFilterScript.pickFile({
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
      const res = await window.velorix.externalFilterScript.apply({
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
        onApplied()
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

  const exit = presentation === 'embedded' ? (onExitEmbedded ?? onClose) : onClose

  const renderExternalFilterChrome = (embedded: boolean): JSX.Element => (
    <div
      className={`app-modal external-filter-script-dialog${embedded ? ' external-filter-script-dialog-embedded' : ''}`}
      role={embedded ? 'region' : 'dialog'}
      aria-modal={embedded ? undefined : 'true'}
      aria-busy={busy}
      aria-labelledby={`${dialogId}-title`}
      aria-describedby={`${dialogId}-hint`}
      onMouseDown={
        embedded
          ? undefined
          : (e) => {
              e.stopPropagation()
            }
      }
    >
      <h2 id={`${dialogId}-title`} className="app-modal-title">
        {uiText('externalFilterScriptDialogTitle')}
      </h2>
      <p id={`${dialogId}-hint`} className="app-modal-hint">
        {uiText('externalFilterScriptDialogHint')}
      </p>
      <div className="app-settings-field-row">
        <label
          className="app-settings-label"
          htmlFor={`${dialogId}-kind`}
          title={uiText('externalFilterScriptKindTitle')}
        >
          {uiText('externalFilterScriptKindLabel')}
        </label>
        <select
          id={`${dialogId}-kind`}
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
        aria-describedby={`${dialogId}-hint`}
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
        {showCancelAction ? (
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={busy}
            title={uiText('externalFilterScriptCancelTitle')}
            onClick={exit}
          >
            {uiText('externalFilterScriptCancel')}
          </button>
        ) : null}
      </div>
    </div>
  )

  if (presentation === 'embedded') {
    return renderExternalFilterChrome(true)
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
      {renderExternalFilterChrome(false)}
    </div>
  )
}
