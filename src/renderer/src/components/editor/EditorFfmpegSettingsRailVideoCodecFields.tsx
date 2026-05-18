import { ffmpegExportAudioModeRequiresMkv } from '../../../../shared/ffmpeg-export-audio-mode'
import type {
  FfmpegExportContainerId,
  FfmpegExportEncodePresetId,
  FfmpegExportVideoCodecId
} from '../../../../shared/ffmpeg-export-contract'
import {
  cpuFfmpegVideoCodecRequiresMkv,
  ffmpegExportVideoCodecRequiresMov,
  isFfmpegHwAutoVideoCodec
} from '../../../../shared/ffmpeg-export-video-codec'
import { buildEditorExportCodecDetailTooltip } from '../../editor-export-codec-tooltip'
import { formatEditorExportHwCodecHint } from '../../editor-export-hw-codec-hint'
import { probeSnapshotOrEmpty, resolveFfmpegExportVideoCodecForArgv } from '../../../../shared/ffmpeg-export-video-codec'
import { uiText, uiTextVars } from '../../locales/ui-text'
import {
  EXPORT_CRF_OPTIONS,
  EXPORT_VIDEO_BITRATES
} from '../../editor-ffmpeg-settings-rail-constants'
import type { EditorFfmpegSettingsRailProps } from './editor-ffmpeg-settings-rail-props'
import { EditorFfmpegBenchmarkPanel } from './EditorFfmpegBenchmarkPanel'
import { EditorExtractFramesPanel } from './EditorExtractFramesPanel'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- field grid fragment
export function EditorFfmpegSettingsRailVideoCodecFields(props: EditorFfmpegSettingsRailProps) {
  const {
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
    exportHwDecode,
    ffmpegExportSelectOptions
  } = props

  const codecUi = {
    uiText: (key: string) => (uiText as (k: string) => string)(key),
    uiTextVars: (key: string, vars: Record<string, string>) =>
      (uiTextVars as (k: string, v: Record<string, string>) => string)(key, vars)
  }
  const hwCodecHint = formatEditorExportHwCodecHint(
    exportVideoCodec,
    hwEncoderProbe,
    exportHwDecode,
    codecUi
  )
  const resolvedVideoCodec = resolveFfmpegExportVideoCodecForArgv(
    exportVideoCodec,
    probeSnapshotOrEmpty(hwEncoderProbe)
  )
  const videoCodecFieldTitle =
    uiText('editorTooltipVideoCodec') +
    '\n\n' +
    buildEditorExportCodecDetailTooltip({
      exportVideoCodec,
      resolvedCodec: resolvedVideoCodec,
      hwEncoderProbe,
      exportHwDecode,
      exportHwaccelDecode: null,
      ...codecUi
    })
  const videoCodecDescribedBy =
    hwCodecHint !== null
      ? 'ffmpegVideoSectionHint ffmpegHwCodecHint editor-ffmpeg-settings-hint'
      : 'ffmpegVideoSectionHint editor-ffmpeg-settings-hint'

  return (
    <>
      <label className="app-field" title={videoCodecFieldTitle}>
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
          aria-describedby={videoCodecDescribedBy}
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
      {hwCodecHint !== null ? (
        <p id="ffmpegHwCodecHint" className="app-settings-section-hint">
          {hwCodecHint}
        </p>
      ) : null}
      <EditorFfmpegBenchmarkPanel {...props} />
      <EditorExtractFramesPanel {...props} />
      <label className="app-field" title={uiText('editorTooltipEncodePreset')}>
        <span>{uiText('editorFieldEncodePreset')}</span>
        <select
          className="app-control"
          aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
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
          aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
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
          aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
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
          aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
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
    </>
  )
}
