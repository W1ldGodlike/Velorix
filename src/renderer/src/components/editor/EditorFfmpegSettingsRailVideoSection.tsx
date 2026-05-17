import { ffmpegExportAudioModeRequiresMkv } from '../../../../shared/ffmpeg-export-audio-mode'
import type {
  FfmpegExportContainerId,
  FfmpegExportEncodePresetId,
  FfmpegExportVideoCodecId,
  FfmpegExportVideoDebandId,
  FfmpegExportVideoDeinterlaceId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoGrainId,
  FfmpegExportVideoHisteqId,
  FfmpegExportVideoHueId,
  FfmpegExportVideoBlurId,
  FfmpegExportVideoLut3dId,
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoVignetteId
} from '../../../../shared/ffmpeg-export-contract'
import {
  cpuFfmpegVideoCodecRequiresMkv,
  ffmpegExportVideoCodecRequiresMov,
  isFfmpegHwAutoVideoCodec
} from '../../../../shared/ffmpeg-export-video-codec'
import { uiText } from '../../locales/ui-text'
import {
  EXPORT_CRF_OPTIONS,
  EXPORT_VIDEO_BITRATES
} from '../../editor-ffmpeg-settings-rail-constants'
import type { EditorFfmpegSettingsRailProps } from './editor-ffmpeg-settings-rail-props'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- JSX section
export function EditorFfmpegSettingsRailVideoSection(props: EditorFfmpegSettingsRailProps) {
  const {
    panelOpen,
    persistMainWindowUiPanelToggle,
    editorFfmpegDetailBusy,
    exportBusy,
    snapshotBusy,
    bumpManualExportEdit,
    hwEncoderProbe,
    exportVideoCodec,
    setExportVideoCodec,
    exportContainer,
    setExportContainer,
    exportAudioMode,
    exportEncodePreset,
    setExportEncodePreset,
    exportTwoPass,
    setExportTwoPass,
    setStatusHint,
    exportCrf,
    setExportCrf,
    exportVideoBitrate,
    setExportVideoBitrate,
    exportVideoDeinterlace,
    setExportVideoDeinterlace,
    exportVideoDenoise,
    setExportVideoDenoise,
    exportVideoDeband,
    setExportVideoDeband,
    exportVideoHisteq,
    setExportVideoHisteq,
    exportVideoLut3d,
    setExportVideoLut3d,
    exportVideoSharpen,
    setExportVideoSharpen,
    exportVideoEqPreset,
    setExportVideoEqPreset,
    exportVideoHue,
    setExportVideoHue,
    exportVideoGrain,
    setExportVideoGrain,
    exportVideoVignette,
    setExportVideoVignette,
    exportVideoBlur,
    setExportVideoBlur,
    ffmpegExportSelectOptions
  } = props

  return (
    <details
      className="app-settings-section"
      aria-label={uiText('editorFfmpegSectionVideo')}
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
      <div className="app-settings-grid" aria-describedby="ffmpegVideoSectionHint">
        <label
          className="app-field"
          title={
            uiText('editorTooltipVideoCodec') +
            (hwEncoderProbe?.ok === true && hwEncoderProbe.hwaccels.length > 0
              ? `\n${uiText('editorExportHwaccelsTitle')}: ${hwEncoderProbe.hwaccels.join(', ')}`
              : '')
          }
        >
          <span className="app-field-label-inline">
            {uiText('editorFieldVideoCodec')}
            {isFfmpegHwAutoVideoCodec(exportVideoCodec) ? (
              <span
                className="app-hw-auto-badge"
                title={
                  exportVideoCodec === 'hw_auto_hevc'
                    ? uiText('editorExportCodecHwAutoHevcBadgeTitle')
                    : uiText('editorExportCodecHwAutoBadgeTitle')
                }
              >
                {exportVideoCodec === 'hw_auto_hevc'
                  ? uiText('editorExportCodecHwAutoHevcBadge')
                  : uiText('editorExportCodecHwAutoBadge')}
              </span>
            ) : null}
          </span>
          <select
            className="app-control"
            value={exportVideoCodec}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportVideoCodecId
              setExportVideoCodec(v)
              if (cpuFfmpegVideoCodecRequiresMkv(v) && exportContainer !== 'mkv') {
                setExportContainer('mkv')
                void window.fluxalloy.settings.setFfmpegExportContainer('mkv').catch(console.error)
                setStatusHint(uiText('editorExportAutoContainerMkv'))
              }
              if (ffmpegExportVideoCodecRequiresMov(v) && exportContainer !== 'mov') {
                setExportContainer('mov')
                void window.fluxalloy.settings.setFfmpegExportContainer('mov').catch(console.error)
                setStatusHint(uiText('editorExportAutoContainerMov'))
              }
              if (v !== 'libx264' && exportTwoPass) {
                setExportTwoPass(false)
                void window.fluxalloy.settings.setFfmpegExportTwoPass(false).catch(console.error)
              }
              void window.fluxalloy.settings.setFfmpegExportVideoCodec(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.videoCodecs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorTooltipEncodePreset')}>
          <span>{uiText('editorFieldEncodePreset')}</span>
          <select
            className="app-control"
            title={uiText('editorTooltipEncodePreset')}
            value={exportEncodePreset}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportEncodePresetId
              setExportEncodePreset(v)
              void window.fluxalloy.settings.setFfmpegExportEncodePreset(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.encodePresets.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorTooltipContainer')}>
          <span>{uiText('editorFieldContainer')}</span>
          <select
            className="app-control"
            title={uiText('editorTooltipContainer')}
            value={exportContainer}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportContainerId
              setExportContainer(v)
              void window.fluxalloy.settings.setFfmpegExportContainer(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.containers.map((p) => (
              <option
                key={p.id}
                value={p.id}
                disabled={
                  (cpuFfmpegVideoCodecRequiresMkv(exportVideoCodec) && p.id !== 'mkv') ||
                  (ffmpegExportVideoCodecRequiresMov(exportVideoCodec) && p.id !== 'mov') ||
                  (ffmpegExportAudioModeRequiresMkv(exportAudioMode) && p.id !== 'mkv')
                }
              >
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorTooltipCrf')}>
          <span>{uiText('editorFieldCrf')}</span>
          <select
            className="app-control"
            title={uiText('editorTooltipCrf')}
            value={exportCrf === null ? 'preset' : String(exportCrf)}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const raw = e.target.value
              const next = raw === 'preset' ? null : Number(raw)
              setExportCrf(next)
              void window.fluxalloy.settings.setFfmpegExportCrf(next).catch(console.error)
            }}
          >
            <option value="preset">{uiText('editorCrfOptionPreset')}</option>
            {EXPORT_CRF_OPTIONS.map((v) => (
              <option key={v} value={v}>
                CRF {v}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorTooltipVideoBitrate')}>
          <span>{uiText('editorFieldVideoBitrate')}</span>
          <select
            className="app-control"
            title={uiText('editorTooltipVideoBitrate')}
            value={exportVideoBitrate === null ? 'crf' : exportVideoBitrate}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const raw = e.target.value
              const next = raw === 'crf' ? null : raw
              setExportVideoBitrate(next)
              if (next === null && exportTwoPass) {
                setExportTwoPass(false)
                void window.fluxalloy.settings.setFfmpegExportTwoPass(false).catch(console.error)
              }
              void window.fluxalloy.settings.setFfmpegExportVideoBitrate(next).catch(console.error)
            }}
          >
            <option value="crf">{uiText('editorVideoBitrateOptionCrf')}</option>
            {EXPORT_VIDEO_BITRATES.map((v) => (
              <option key={v} value={v}>
                Video {v}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorHintDeinterlace')}>
          <span>{uiText('editorFieldDeinterlace')}</span>
          <select
            className="app-control"
            title={uiText('editorHintDeinterlace')}
            value={exportVideoDeinterlace}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportVideoDeinterlaceId
              setExportVideoDeinterlace(v)
              void window.fluxalloy.settings.setFfmpegExportVideoDeinterlace(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.videoDeinterlace.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorHintDenoise')}>
          <span>{uiText('editorFieldDenoise')}</span>
          <select
            className="app-control"
            title={uiText('editorHintDenoise')}
            value={exportVideoDenoise}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportVideoDenoiseId
              setExportVideoDenoise(v)
              void window.fluxalloy.settings.setFfmpegExportVideoDenoise(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.videoDenoise.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorHintDeband')}>
          <span>{uiText('editorFieldDeband')}</span>
          <select
            className="app-control"
            title={uiText('editorHintDeband')}
            value={exportVideoDeband}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportVideoDebandId
              setExportVideoDeband(v)
              void window.fluxalloy.settings.setFfmpegExportVideoDeband(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.videoDeband.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorHintHisteq')}>
          <span>{uiText('editorFieldHisteq')}</span>
          <select
            className="app-control"
            title={uiText('editorHintHisteq')}
            value={exportVideoHisteq}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportVideoHisteqId
              setExportVideoHisteq(v)
              void window.fluxalloy.settings.setFfmpegExportVideoHisteq(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.videoHisteq.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorHintLut3d')}>
          <span>{uiText('editorFieldLut3d')}</span>
          <select
            className="app-control"
            title={uiText('editorHintLut3d')}
            value={exportVideoLut3d}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportVideoLut3dId
              setExportVideoLut3d(v)
              void window.fluxalloy.settings.setFfmpegExportVideoLut3d(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.videoLut3d.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorHintSharpen')}>
          <span>{uiText('editorFieldSharpen')}</span>
          <select
            className="app-control"
            title={uiText('editorHintSharpen')}
            value={exportVideoSharpen}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportVideoSharpenId
              setExportVideoSharpen(v)
              void window.fluxalloy.settings.setFfmpegExportVideoSharpen(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.videoSharpen.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorHintEq')}>
          <span>{uiText('editorFieldEq')}</span>
          <select
            className="app-control"
            title={uiText('editorHintEq')}
            value={exportVideoEqPreset}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportVideoEqPresetId
              setExportVideoEqPreset(v)
              void window.fluxalloy.settings.setFfmpegExportVideoEqPreset(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.videoEq.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorHintHue')}>
          <span>{uiText('editorFieldHue')}</span>
          <select
            className="app-control"
            title={uiText('editorHintHue')}
            value={exportVideoHue}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportVideoHueId
              setExportVideoHue(v)
              void window.fluxalloy.settings.setFfmpegExportVideoHue(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.videoHue.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorHintGrain')}>
          <span>{uiText('editorFieldGrain')}</span>
          <select
            className="app-control"
            title={uiText('editorHintGrain')}
            value={exportVideoGrain}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportVideoGrainId
              setExportVideoGrain(v)
              void window.fluxalloy.settings.setFfmpegExportVideoGrain(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.videoGrain.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorHintVignette')}>
          <span>{uiText('editorFieldVignette')}</span>
          <select
            className="app-control"
            title={uiText('editorHintVignette')}
            value={exportVideoVignette}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportVideoVignetteId
              setExportVideoVignette(v)
              void window.fluxalloy.settings.setFfmpegExportVideoVignette(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.videoVignette.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="app-field" title={uiText('editorHintBlur')}>
          <span>{uiText('editorFieldBlur')}</span>
          <select
            className="app-control"
            title={uiText('editorHintBlur')}
            value={exportVideoBlur}
            disabled={exportBusy || snapshotBusy}
            onChange={(e) => {
              bumpManualExportEdit()
              const v = e.target.value as FfmpegExportVideoBlurId
              setExportVideoBlur(v)
              void window.fluxalloy.settings.setFfmpegExportVideoBlur(v).catch(console.error)
            }}
          >
            {ffmpegExportSelectOptions.videoBlur.map((p) => (
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
