import { useCallback, useEffect, useState, type JSX } from 'react'

import { uiText } from '../../locales/ui-text'

export function WindowsExplorerContextMenuSettings(props: {
  sectionHintId: string
  shellBusy: boolean
  onStatus: (message: string) => void
}): JSX.Element | null {
  const { sectionHintId, shellBusy, onStatus } = props
  const [supported, setSupported] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(() => {
    void window.fluxalloy.settings.windowsExplorerContextMenuStatus().then((st) => {
      setSupported(st.supported)
      setEnabled(st.enabledInSettings)
      setRegistered(st.registered)
    })
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  if (!supported) {
    return null
  }

  const disabled = shellBusy || busy

  return (
    <fieldset className="app-settings-fieldset" disabled={disabled} aria-describedby={sectionHintId}>
      <legend>{uiText('appSettingsExplorerMenuLegend')}</legend>
      <p className="app-modal-hint">{uiText('appSettingsExplorerMenuHint')}</p>
      <label className="app-settings-checkbox-row">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => {
            const next = event.currentTarget.checked
            setBusy(true)
            void window.fluxalloy.settings
              .setWindowsExplorerContextMenuEnabled(next)
              .then((res) => {
                if (!res.ok) {
                  onStatus(res.error)
                  return
                }
                setEnabled(next)
                refresh()
                onStatus(
                  next
                    ? uiText('appSettingsExplorerMenuEnabledDone')
                    : uiText('appSettingsExplorerMenuDisabledDone')
                )
              })
              .finally(() => {
                setBusy(false)
              })
          }}
        />
        <span>{uiText('appSettingsExplorerMenuCheckbox')}</span>
      </label>
      <div className="app-settings-row-actions" role="group" aria-label={uiText('appSettingsExplorerMenuLegend')}>
        <button
          type="button"
          className="app-btn app-btn-compact"
          title={uiText('appSettingsExplorerMenuRegister')}
          disabled={disabled}
          onClick={() => {
            setBusy(true)
            void window.fluxalloy.settings
              .registerWindowsExplorerContextMenuNow()
              .then((res) => {
                onStatus(res.ok ? uiText('appSettingsExplorerMenuRegisterDone') : res.error)
                refresh()
              })
              .finally(() => {
                setBusy(false)
              })
          }}
        >
          {uiText('appSettingsExplorerMenuRegister')}
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact"
          title={uiText('appSettingsExplorerMenuUnregister')}
          disabled={disabled || !registered}
          onClick={() => {
            setBusy(true)
            void window.fluxalloy.settings.unregisterWindowsExplorerContextMenu().then(() => {
              setEnabled(false)
              refresh()
              onStatus(uiText('appSettingsExplorerMenuUnregisterDone'))
            }).finally(() => {
              setBusy(false)
            })
          }}
        >
          {uiText('appSettingsExplorerMenuUnregister')}
        </button>
      </div>
      {registered ? (
        <p className="app-modal-hint" role="status">
          {uiText('appSettingsExplorerMenuRegisteredStatus')}
        </p>
      ) : null}
    </fieldset>
  )
}
