import { useCallback, useEffect, useState, type JSX } from 'react'

import { KNOWLEDGE_SLUG_WINDOWS_SHELL_INTEGRATION } from '../../../../shared/knowledge-contract'
import { uiText } from '../../locales/ui-text'
import { KnowledgeDeepLinkButton } from '../KnowledgeDeepLinkButton'

export function WindowsExplorerContextMenuSettings(props: {
  sectionHintId: string
  shellBusy: boolean
  onStatus: (message: string) => void
  onOpenKnowledgeArticle?: (slug: string) => void
}): JSX.Element | null {
  const { sectionHintId, shellBusy, onStatus, onOpenKnowledgeArticle } = props
  const [supported, setSupported] = useState(false)
  const [enabled, setEnabled] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [openWithEnabled, setOpenWithEnabled] = useState(false)
  const [openWithRegistered, setOpenWithRegistered] = useState(false)
  const [busy, setBusy] = useState(false)

  const refresh = useCallback(() => {
    void Promise.all([
      window.fluxalloy.settings.windowsExplorerContextMenuStatus(),
      window.fluxalloy.settings.windowsFileAssociationStatus()
    ]).then(([menuSt, openWithSt]) => {
      setSupported(menuSt.supported)
      setEnabled(menuSt.enabledInSettings)
      setRegistered(menuSt.registered)
      setOpenWithEnabled(openWithSt.enabledInSettings)
      setOpenWithRegistered(openWithSt.registered)
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
      <div className="app-settings-hw-smoke-header">
        <h3 className="app-settings-hidpi-title">{uiText('appSettingsExplorerMenuLegend')}</h3>
        {onOpenKnowledgeArticle ? (
          <KnowledgeDeepLinkButton
            label={uiText('knowledgeDeepLinkWindowsShellLabel')}
            tooltip={uiText('knowledgeDeepLinkWindowsShellTooltip')}
            ariaDescribedBy={sectionHintId}
            disabled={disabled}
            onOpen={() => {
              onOpenKnowledgeArticle(KNOWLEDGE_SLUG_WINDOWS_SHELL_INTEGRATION)
            }}
          />
        ) : null}
      </div>
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
      <p className="app-modal-hint app-settings-section-hint">{uiText('appSettingsOpenWithHint')}</p>
      <label className="app-settings-checkbox-row">
        <input
          type="checkbox"
          checked={openWithEnabled}
          onChange={(event) => {
            const next = event.currentTarget.checked
            setBusy(true)
            void window.fluxalloy.settings
              .setWindowsFileAssociationEnabled(next)
              .then((res) => {
                if (!res.ok) {
                  onStatus(res.error)
                  return
                }
                setOpenWithEnabled(next)
                refresh()
                onStatus(
                  next
                    ? uiText('appSettingsOpenWithEnabledDone')
                    : uiText('appSettingsOpenWithDisabledDone')
                )
              })
              .finally(() => {
                setBusy(false)
              })
          }}
        />
        <span>{uiText('appSettingsOpenWithCheckbox')}</span>
      </label>
      <div className="app-settings-row-actions" role="group" aria-label={uiText('appSettingsOpenWithLegend')}>
        <button
          type="button"
          className="app-btn app-btn-compact"
          title={uiText('appSettingsOpenWithRegister')}
          disabled={disabled}
          onClick={() => {
            setBusy(true)
            void window.fluxalloy.settings
              .registerWindowsFileAssociationNow()
              .then((res) => {
                onStatus(res.ok ? uiText('appSettingsOpenWithRegisterDone') : res.error)
                refresh()
              })
              .finally(() => {
                setBusy(false)
              })
          }}
        >
          {uiText('appSettingsOpenWithRegister')}
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact"
          title={uiText('appSettingsOpenWithUnregister')}
          disabled={disabled || !openWithRegistered}
          onClick={() => {
            setBusy(true)
            void window.fluxalloy.settings.unregisterWindowsFileAssociation().then(() => {
              setOpenWithEnabled(false)
              refresh()
              onStatus(uiText('appSettingsOpenWithUnregisterDone'))
            }).finally(() => {
              setBusy(false)
            })
          }}
        >
          {uiText('appSettingsOpenWithUnregister')}
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact"
          title={uiText('appSettingsOpenWithDefaultApps')}
          disabled={disabled}
          onClick={() => {
            void window.fluxalloy.settings.openWindowsDefaultAppsSettings().then((res) => {
              onStatus(
                res.ok ? uiText('appSettingsOpenWithDefaultAppsDone') : res.error
              )
            })
          }}
        >
          {uiText('appSettingsOpenWithDefaultApps')}
        </button>
      </div>
      {openWithRegistered ? (
        <p className="app-modal-hint" role="status">
          {uiText('appSettingsOpenWithRegisteredStatus')}
        </p>
      ) : null}
    </fieldset>
  )
}
