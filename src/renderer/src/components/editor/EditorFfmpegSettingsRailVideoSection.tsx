import { uiText } from '../../locales/ui-text'
import type { EditorFfmpegSettingsRailProps } from './editor-ffmpeg-settings-rail-props'
import { EditorFfmpegSettingsRailVideoCodecFields } from './EditorFfmpegSettingsRailVideoCodecFields'
import { EditorFfmpegSettingsRailVideoFilterFields } from './EditorFfmpegSettingsRailVideoFilterFields'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- JSX section
export function EditorFfmpegSettingsRailVideoSection(props: EditorFfmpegSettingsRailProps) {
  const { panelOpen, persistMainWindowUiPanelToggle, editorFfmpegDetailBusy } = props

  return (
    <details
      className="app-settings-section"
      aria-label={uiText('editorFfmpegSectionVideo')}
      aria-describedby="editor-ffmpeg-settings-hint"
      aria-busy={editorFfmpegDetailBusy}
      open={panelOpen('ffmpegVideo')}
      onToggle={(e) => {
        persistMainWindowUiPanelToggle('ffmpegVideo', e.currentTarget.open)
      }}
    >
      <summary className="app-settings-summary" title={uiText('editorTooltipSectionVideo')}>
        {uiText('editorFfmpegSectionVideo')}
      </summary>
      <p id="ffmpegVideoSectionHint" className="app-settings-section-hint">
        {uiText('editorFfmpegSectionVideoHint')}
      </p>
      <div
        className="app-settings-grid"
        aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
      >
        <EditorFfmpegSettingsRailVideoCodecFields {...props} />
        <EditorFfmpegSettingsRailVideoFilterFields {...props} />
      </div>
    </details>
  )
}
