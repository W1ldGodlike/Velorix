import type {
  FfmpegExportCropPresetId,
  FfmpegExportScalePresetId,
  FfmpegExportVideoTransformId
} from '../../../../shared/ffmpeg-export-contract'
import { PillSwitch } from '../PillSwitch'
import { uiText, uiTextVars } from '../../locales/ui-text'
import { EXPORT_FPS_OPTIONS } from '../../editor-ffmpeg-settings-rail-constants'
import type { EditorFfmpegSettingsRailProps } from './editor-ffmpeg-settings-rail-props'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- JSX section
export function EditorFfmpegSettingsRailFormatSection(props: EditorFfmpegSettingsRailProps) {
  const {
    panelOpen,
    persistMainWindowUiPanelToggle,
    editorFfmpegDetailBusy,
    exportBusy,
    snapshotBusy,
    bumpManualExportEdit,
    exportScalePreset,
    setExportScalePreset,
    exportFps,
    setExportFps,
    exportTwoPass,
    setExportTwoPass,
    exportVideoBitrate,
    exportVideoCodec,
    exportEconomyMode,
    setExportEconomyMode,
    exportHwDecode,
    setExportHwDecode,
    exportVideoTransform,
    setExportVideoTransform,
    exportCropPreset,
    setExportCropPreset,
    ffmpegExportSelectOptions
  } = props
  return (
    <details
      className="app-settings-section"
      aria-label={uiText('editorFfmpegSectionFrameLayout')}
      aria-describedby="editor-ffmpeg-settings-hint"
      aria-busy={editorFfmpegDetailBusy}
      open={panelOpen('ffmpegFormat')}
      onToggle={(e) => {
        persistMainWindowUiPanelToggle('ffmpegFormat', e.currentTarget.open)
      }}
    >
      <summary className="app-settings-summary" title={uiText('editorTooltipSectionFormat')}>
        {uiText('editorFfmpegSectionFrameLayout')}
      </summary>
      <p id="ffmpegFormatSectionHint" className="app-settings-section-hint">
        {uiText('editorFfmpegSectionFrameLayoutHint')}
      </p>
      <div
        className="app-settings-grid"
        aria-describedby="ffmpegFormatSectionHint editor-ffmpeg-settings-hint"
      >
        <label className="app-field" title={uiText('editorTooltipResolution')}>
          <span>{uiText('editorFieldResolution')}</span>
          <select
            className="app-control"
            title={uiText('editorTooltipResolution')}
            value={exportScalePreset}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportScalePresetId
              setExportScalePreset(v)
              void window.fluxalloy.settings.setFfmpegExportScalePreset(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.scalePresets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorTooltipFps')}>
          <span>{uiText('editorFieldFps')}</span>
          <select
            className="app-control"
            title={uiText('editorTooltipFps')}
            value={exportFps === null ? 'source' : String(exportFps)}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const raw = e.target.value
              const next = raw === 'source' ? null : Number(raw)
              setExportFps(next)
              void window.fluxalloy.settings.setFfmpegExportFps(next).catch(console.error)
            }}
          >
            <option value="source">{uiText('editorFpsOptionSource')}</option>
            {EXPORT_FPS_OPTIONS.map((v) => (
              <option key={v} value={v}>
                {uiTextVars('editorExportFpsOptionTemplate', { value: String(v) })}
              </option>
            ))}
          </select>
        </label>
        <div className="app-field app-field-switch">
          <span>{uiText('editorTwoPassSpan')}</span>
          <PillSwitch
            label={uiText('editorTwoPassPillLabel')}
            tooltip={uiText('editorTooltipTwoPass')}
            checked={exportTwoPass && exportVideoBitrate !== null}
            describedBy="ffmpegFormatSectionHint ffmpegTwoPassUiHint"
            disabled={
              exportBusy ||
              snapshotBusy ||
              exportVideoBitrate === null ||
              exportVideoCodec !== 'libx264'
            }
            onToggle={() => {
              if (exportVideoBitrate === null) {
                return
              }
              bumpManualExportEdit()
              const v = !exportTwoPass
              setExportTwoPass(v)
              void window.fluxalloy.settings.setFfmpegExportTwoPass(v).catch(console.error)
            }}
          />
          <span id="ffmpegTwoPassUiHint" className="app-visually-hidden">
            {uiText('editorTwoPassHint')}
          </span>
        </div>
        <div className="app-field app-field-switch">
          <span>{uiText('editorEconomyModeSpan')}</span>
          <PillSwitch
            label={uiText('editorEconomyModePillLabel')}
            tooltip={uiText('editorTooltipEconomyMode')}
            checked={exportEconomyMode}
            describedBy="ffmpegFormatSectionHint ffmpegEconomyModeUiHint"
            disabled={exportBusy || snapshotBusy}
            onToggle={() => {
              bumpManualExportEdit()
              const v = !exportEconomyMode
              setExportEconomyMode(v)
              void window.fluxalloy.settings.setFfmpegExportEconomyMode(v).catch(console.error)
            }}
          />
          <span id="ffmpegEconomyModeUiHint" className="app-visually-hidden">
            {uiText('editorEconomyModeHint')}
          </span>
        </div>
        <div className="app-field app-field-switch">
          <span>{uiText('editorHwDecodeSpan')}</span>
          <PillSwitch
            label={uiText('editorHwDecodePillLabel')}
            tooltip={uiText('editorTooltipHwDecode')}
            checked={exportHwDecode}
            describedBy="ffmpegFormatSectionHint ffmpegHwDecodeUiHint"
            disabled={exportBusy || snapshotBusy}
            onToggle={() => {
              bumpManualExportEdit()
              const v = !exportHwDecode
              setExportHwDecode(v)
              void window.fluxalloy.settings.setFfmpegExportHwDecode(v).catch(console.error)
            }}
          />
          <span id="ffmpegHwDecodeUiHint" className="app-visually-hidden">
            {uiText('editorHwDecodeHint')}
          </span>
        </div>
        <label className="app-field" title={uiText('editorTooltipRotation')}>
          <span>{uiText('editorFieldRotation')}</span>
          <select
            className="app-control"
            title={uiText('editorTooltipRotation')}
            value={exportVideoTransform}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportVideoTransformId
              setExportVideoTransform(v)
              void window.fluxalloy.settings.setFfmpegExportVideoTransform(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.videoTransforms.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorTooltipCrop')}>
          <span>{uiText('editorFieldCrop')}</span>
          <select
            className="app-control"
            title={uiText('editorTooltipCrop')}
            value={exportCropPreset}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportCropPresetId
              setExportCropPreset(v)
              void window.fluxalloy.settings.setFfmpegExportCropPreset(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.cropPresets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </details>
  )
}
