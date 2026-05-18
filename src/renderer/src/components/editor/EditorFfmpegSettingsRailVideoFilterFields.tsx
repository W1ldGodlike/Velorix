import type { JSX } from 'react'

import type {
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
import { uiText } from '../../locales/ui-text'
import type { EditorFfmpegSettingsRailProps } from './editor-ffmpeg-settings-rail-props'

export function EditorFfmpegSettingsRailVideoFilterFields(
  props: EditorFfmpegSettingsRailProps
): JSX.Element {
  const {
    exportBusy,
    snapshotBusy,
    bumpManualExportEdit,
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
    <>
      <label className="app-field" title={uiText('editorHintDeinterlace')}>
        <span>{uiText('editorFieldDeinterlace')}</span>
        <select
          className="app-control"
          aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
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
          aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
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
          aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
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
          aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
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
          aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
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
          aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
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
          aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
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
          aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
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
          aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
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
          aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
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
          aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
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
    </>
  )
}
