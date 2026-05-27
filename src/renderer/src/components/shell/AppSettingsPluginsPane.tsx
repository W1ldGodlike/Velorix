import { useCallback, useEffect, useState, type JSX } from 'react'

import type { ExternalFilterScriptKind } from '../../../../shared/external-filter-script-contract'
import { uiText } from '../../locales/ui-text'
import { ExternalFilterScriptDialog } from './ExternalFilterScriptDialog'

function formatExternalFilterKind(kind: ExternalFilterScriptKind): string {
  if (kind === 'avisynth') {
    return uiText('externalFilterScriptKindAvs')
  }
  if (kind === 'vapoursynth') {
    return uiText('externalFilterScriptKindVpy')
  }
  return uiText('externalFilterScriptKindOff')
}

export function AppSettingsPluginsPane(props: {
  sectionHintId: string
  onStatus: (message: string) => void
  onApplied: () => void
}): JSX.Element {
  const { sectionHintId, onStatus, onApplied } = props
  const [kind, setKind] = useState<ExternalFilterScriptKind>('off')
  const [scriptPath, setScriptPath] = useState<string | null>(null)

  const refreshPluginSettings = useCallback((): void => {
    void window.velorix.settings.get().then((settings) => {
      const storedKind = settings.ffmpegExportExternalFilterKind
      setKind(storedKind === 'avisynth' || storedKind === 'vapoursynth' ? storedKind : 'off')
      const storedPath = settings.ffmpegExportExternalFilterScriptPath?.trim()
      setScriptPath(storedPath && storedPath.length > 0 ? storedPath : null)
    })
  }, [])

  useEffect(() => {
    refreshPluginSettings()
  }, [refreshPluginSettings])

  const enabled = kind !== 'off' && scriptPath !== null

  return (
    <section
      className="app-settings-system-card"
      aria-labelledby="app-settings-plugins-title"
      aria-describedby={sectionHintId}
    >
      <div className="app-settings-row">
        <span id="app-settings-plugins-title" className="app-settings-row-label">
          {uiText('appSettingsPluginsTitle')}
        </span>
      </div>
      <p className="app-modal-hint">{uiText('appSettingsPluginsHint')}</p>
      <div className="app-settings-system-meta">
        <div className="app-settings-system-meta-row">
          <span className="app-settings-system-meta-label">
            {uiText('appSettingsPluginsStatusLabel')}
          </span>
          <span className="app-settings-system-meta-value">
            {enabled ? uiText('appSettingsPluginsEnabled') : uiText('appSettingsPluginsDisabled')}
          </span>
        </div>
        <div className="app-settings-system-meta-row">
          <span className="app-settings-system-meta-label">
            {uiText('appSettingsPluginsKindLabel')}
          </span>
          <span className="app-settings-system-meta-value">{formatExternalFilterKind(kind)}</span>
        </div>
        <div className="app-settings-system-meta-row">
          <span className="app-settings-system-meta-label">
            {uiText('appSettingsPluginsFileLabel')}
          </span>
          <code className="app-settings-path-value">
            {scriptPath ?? uiText('appSettingsPluginsEmptyFile')}
          </code>
        </div>
      </div>
      <ExternalFilterScriptDialog
        open
        presentation="embedded"
        showCancelAction={false}
        onClose={() => {}}
        onStatus={onStatus}
        onApplied={() => {
          refreshPluginSettings()
          onApplied()
        }}
      />
    </section>
  )
}
