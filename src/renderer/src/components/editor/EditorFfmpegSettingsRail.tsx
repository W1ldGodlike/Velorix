import type { Dispatch, SetStateAction } from 'react'

import { isBuiltinExportUserPresetId } from '../../../../shared/builtin-ffmpeg-export-user-presets'
import type { FfmpegExportPreviewResult } from '../../../../shared/ffmpeg-export-argv'
import {
  ffmpegExportAudioModeAllowsFilters,
  ffmpegExportAudioModeRequiresMkv,
  ffmpegExportAudioModeUsesBitrate
} from '../../../../shared/ffmpeg-export-audio-mode'
import type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportUserPreset,
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
  FfmpegExportVideoTransformId,
  FfmpegExportVideoVignetteId
} from '../../../../shared/ffmpeg-export-contract'
import {
  cpuFfmpegVideoCodecRequiresMkv,
  ffmpegExportVideoCodecRequiresMov,
  isFfmpegHwAutoVideoCodec
} from '../../../../shared/ffmpeg-export-video-codec'
import type { FfmpegHwEncodersProbeResult } from '../../../../shared/ffmpeg-hw-encoder-probe'
import type { FfmpegSnapshotFormatId } from '../../../../shared/ffmpeg-snapshot-contract'
import type {
  ProcessingHistoryEntry,
  ProcessingHistoryFilter,
  ProcessingHistoryWeeklySummary
} from '../../../../shared/processing-history-contract'
import type { AppSettings } from '../../../../shared/settings-contract'
import { ProcessingHistoryPanel } from '../ProcessingHistoryPanel'
import { PillSwitch } from '../PillSwitch'
import { IconChevronRight } from '../LucideMiniIcons'
import type { MainWindowUiPanelKey } from '../../use-main-window-ui-panels'
import type { FfmpegExportSelectOptions } from '../../use-editor-export-settings'
import { uiText, uiTextVars } from '../../locales/ui-text'

const EXPORT_CRF_OPTIONS = [18, 20, 23, 26, 28, 30] as const
const EXPORT_VIDEO_BITRATES = ['1000k', '2500k', '5000k', '8000k', '12000k', '20000k'] as const
const EXPORT_AUDIO_BITRATES = ['96k', '128k', '160k', '192k', '256k', '320k'] as const
const EXPORT_FPS_OPTIONS = [24, 25, 30, 50, 60] as const

export type EditorFfmpegSettingsRailProps = {
  panelOpen: (key: MainWindowUiPanelKey) => boolean
  persistMainWindowUiPanelToggle: (key: MainWindowUiPanelKey, nextOpen: boolean) => void
  onCollapseRail: () => void
  setStatusHint: (hint: string | null) => void
  editorFfmpegDetailBusy: boolean
  exportBusy: boolean
  exportCancelBusy: boolean
  snapshotBusy: boolean
  probePending: boolean
  hwEncoderProbe: FfmpegHwEncodersProbeResult | null
  exportEncodePreset: FfmpegExportEncodePresetId
  setExportEncodePreset: Dispatch<SetStateAction<FfmpegExportEncodePresetId>>
  exportVideoCodec: FfmpegExportVideoCodecId
  setExportVideoCodec: Dispatch<SetStateAction<FfmpegExportVideoCodecId>>
  exportContainer: FfmpegExportContainerId
  setExportContainer: Dispatch<SetStateAction<FfmpegExportContainerId>>
  exportCrf: number | null
  setExportCrf: Dispatch<SetStateAction<number | null>>
  exportVideoBitrate: string | null
  setExportVideoBitrate: Dispatch<SetStateAction<string | null>>
  exportAudioMode: FfmpegExportAudioModeId
  setExportAudioMode: Dispatch<SetStateAction<FfmpegExportAudioModeId>>
  exportAudioBitrate: string
  setExportAudioBitrate: Dispatch<SetStateAction<string>>
  exportFps: number | null
  setExportFps: Dispatch<SetStateAction<number | null>>
  exportVideoTransform: FfmpegExportVideoTransformId
  setExportVideoTransform: Dispatch<SetStateAction<FfmpegExportVideoTransformId>>
  exportCropPreset: FfmpegExportCropPresetId
  setExportCropPreset: Dispatch<SetStateAction<FfmpegExportCropPresetId>>
  exportScalePreset: FfmpegExportScalePresetId
  setExportScalePreset: Dispatch<SetStateAction<FfmpegExportScalePresetId>>
  exportTwoPass: boolean
  setExportTwoPass: Dispatch<SetStateAction<boolean>>
  exportEconomyMode: boolean
  setExportEconomyMode: Dispatch<SetStateAction<boolean>>
  exportHwDecode: boolean
  setExportHwDecode: Dispatch<SetStateAction<boolean>>
  exportExtraArgsLine: string
  setExportExtraArgsLine: Dispatch<SetStateAction<string>>
  exportAudioGainDb: number
  setExportAudioGainDb: Dispatch<SetStateAction<number>>
  exportStripMetadata: boolean
  setExportStripMetadata: Dispatch<SetStateAction<boolean>>
  exportStripChapters: boolean
  setExportStripChapters: Dispatch<SetStateAction<boolean>>
  exportSubtitleMode: FfmpegExportSubtitleModeId
  setExportSubtitleMode: Dispatch<SetStateAction<FfmpegExportSubtitleModeId>>
  exportVideoDeinterlace: FfmpegExportVideoDeinterlaceId
  setExportVideoDeinterlace: Dispatch<SetStateAction<FfmpegExportVideoDeinterlaceId>>
  exportVideoDenoise: FfmpegExportVideoDenoiseId
  setExportVideoDenoise: Dispatch<SetStateAction<FfmpegExportVideoDenoiseId>>
  exportVideoDeband: FfmpegExportVideoDebandId
  setExportVideoDeband: Dispatch<SetStateAction<FfmpegExportVideoDebandId>>
  exportVideoHisteq: FfmpegExportVideoHisteqId
  setExportVideoHisteq: Dispatch<SetStateAction<FfmpegExportVideoHisteqId>>
  exportVideoLut3d: FfmpegExportVideoLut3dId
  setExportVideoLut3d: Dispatch<SetStateAction<FfmpegExportVideoLut3dId>>
  exportVideoSharpen: FfmpegExportVideoSharpenId
  setExportVideoSharpen: Dispatch<SetStateAction<FfmpegExportVideoSharpenId>>
  exportVideoEqPreset: FfmpegExportVideoEqPresetId
  setExportVideoEqPreset: Dispatch<SetStateAction<FfmpegExportVideoEqPresetId>>
  exportVideoHue: FfmpegExportVideoHueId
  setExportVideoHue: Dispatch<SetStateAction<FfmpegExportVideoHueId>>
  exportVideoGrain: FfmpegExportVideoGrainId
  setExportVideoGrain: Dispatch<SetStateAction<FfmpegExportVideoGrainId>>
  exportVideoVignette: FfmpegExportVideoVignetteId
  setExportVideoVignette: Dispatch<SetStateAction<FfmpegExportVideoVignetteId>>
  exportVideoBlur: FfmpegExportVideoBlurId
  setExportVideoBlur: Dispatch<SetStateAction<FfmpegExportVideoBlurId>>
  exportAudioNormalize: FfmpegExportAudioNormalizeId
  setExportAudioNormalize: Dispatch<SetStateAction<FfmpegExportAudioNormalizeId>>
  exportUserPresets: FfmpegExportUserPreset[]
  selectedUserPresetId: string | null
  setSelectedUserPresetId: Dispatch<SetStateAction<string | null>>
  selectedExportUserPreset: FfmpegExportUserPreset | undefined
  lastExportPath: string | null
  lastSnapshotPath: string | null
  snapshotFormat: FfmpegSnapshotFormatId
  setSnapshotFormat: Dispatch<SetStateAction<FfmpegSnapshotFormatId>>
  ffmpegExportSelectOptions: FfmpegExportSelectOptions
  exportExtraArgsParsed: { ok: true; args: string[] } | { ok: false; error: string }
  hydrateExportFieldsFromSettings: (loaded: AppSettings) => void
  bumpManualExportEdit: () => void
  handleSaveExportUserPreset: () => void
  handleDeleteExportUserPreset: () => void
  handleRenameExportUserPreset: () => void
  handleOverwriteExportUserPreset: () => void
  exportPreview: FfmpegExportPreviewResult
  exportPreviewCommand: string
  exportPreviewHint: () => string
  handleCopyExportPreview: () => Promise<void>
  handleOpenLastExport: (mode: 'file' | 'folder' | 'preview') => Promise<void>
  handleCopyLastExportPath: () => Promise<void>
  handleOpenLastSnapshot: (mode: 'file' | 'folder') => Promise<void>
  handleCopyLastSnapshotPath: () => Promise<void>
  processingHistory: ProcessingHistoryEntry[]
  setProcessingHistory: Dispatch<SetStateAction<ProcessingHistoryEntry[]>>
  processingHistoryBusy: boolean
  processingHistoryFilter: ProcessingHistoryFilter
  processingHistoryWeeklySummary: ProcessingHistoryWeeklySummary | null
  setProcessingHistoryWeeklySummary: Dispatch<SetStateAction<ProcessingHistoryWeeklySummary | null>>
  applyProcessingHistoryFilter: (next: ProcessingHistoryFilter) => void
  refreshProcessingHistory: (filter?: ProcessingHistoryFilter) => Promise<void>
  exportVisibleProcessingHistory: () => Promise<void>
  reportBatchPathsAdded: (counts: { added: number; skipped: number }, emptyMsg?: string) => void
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- flat rail API for App.tsx
export function EditorFfmpegSettingsRail(props: EditorFfmpegSettingsRailProps) {
  const {
    panelOpen,
    persistMainWindowUiPanelToggle,
    onCollapseRail,
    setStatusHint,
    editorFfmpegDetailBusy,
    exportBusy,
    exportCancelBusy,
    snapshotBusy,
    probePending,
    hwEncoderProbe,
    exportEncodePreset,
    setExportEncodePreset,
    exportVideoCodec,
    setExportVideoCodec,
    exportContainer,
    setExportContainer,
    exportCrf,
    setExportCrf,
    exportVideoBitrate,
    setExportVideoBitrate,
    exportAudioMode,
    setExportAudioMode,
    exportAudioBitrate,
    setExportAudioBitrate,
    exportFps,
    setExportFps,
    exportVideoTransform,
    setExportVideoTransform,
    exportCropPreset,
    setExportCropPreset,
    exportScalePreset,
    setExportScalePreset,
    exportTwoPass,
    setExportTwoPass,
    exportEconomyMode,
    setExportEconomyMode,
    exportHwDecode,
    setExportHwDecode,
    exportExtraArgsLine,
    setExportExtraArgsLine,
    exportAudioGainDb,
    setExportAudioGainDb,
    exportStripMetadata,
    setExportStripMetadata,
    exportStripChapters,
    setExportStripChapters,
    exportSubtitleMode,
    setExportSubtitleMode,
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
    exportAudioNormalize,
    setExportAudioNormalize,
    exportUserPresets,
    selectedUserPresetId,
    setSelectedUserPresetId,
    selectedExportUserPreset,
    lastExportPath,
    lastSnapshotPath,
    snapshotFormat,
    setSnapshotFormat,
    ffmpegExportSelectOptions,
    exportExtraArgsParsed,
    hydrateExportFieldsFromSettings,
    bumpManualExportEdit,
    handleSaveExportUserPreset,
    handleDeleteExportUserPreset,
    handleRenameExportUserPreset,
    handleOverwriteExportUserPreset,
    exportPreview,
    exportPreviewCommand,
    exportPreviewHint,
    handleCopyExportPreview,
    handleOpenLastExport,
    handleCopyLastExportPath,
    handleOpenLastSnapshot,
    handleCopyLastSnapshotPath,
    processingHistory,
    setProcessingHistory,
    processingHistoryBusy,
    processingHistoryFilter,
    processingHistoryWeeklySummary,
    setProcessingHistoryWeeklySummary,
    applyProcessingHistoryFilter,
    refreshProcessingHistory,
    exportVisibleProcessingHistory,
    reportBatchPathsAdded
  } = props
  return (
    <aside
      className="app-settings-panel"
      aria-label={uiText('editorFfmpegSettingsAria')}
      aria-busy={exportBusy || snapshotBusy || exportCancelBusy || probePending}
    >
      <div
        className="app-settings-panel-head"
        role="group"
        aria-label={uiText('editorFfmpegPanelHeadGroupAria')}
        aria-busy={exportBusy || snapshotBusy || exportCancelBusy || probePending}
      >
        <div>
          <h2 className="app-settings-title">{uiText('editorFfmpegSettingsTitle')}</h2>
          <p
            className="app-settings-subtitle"
            title={uiText('editorTooltipFfmpegPanelIntro')}
          >
            {uiText('editorFfmpegSettingsSubtitle')}
          </p>
        </div>
        <div
          className="app-settings-panel-head-trailing"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('editorFfmpegRailHeaderToolbarAria')}
          aria-busy={exportBusy || snapshotBusy || exportCancelBusy || probePending}
        >
          <button
            type="button"
            className="app-icon-btn app-settings-rail-collapse-btn"
            onClick={() => {
              onCollapseRail()
            }}
            title={uiText('editorFfmpegRailCollapseTitle')}
          >
            <IconChevronRight title="" size={18} />
            <span className="app-visually-hidden">
              {uiText('editorFfmpegRailCollapseHidden')}
            </span>
          </button>
        </div>
      </div>
    
      <div
        role="region"
        aria-label={uiText('editorFfmpegRailSectionsRegionAria')}
        aria-busy={editorFfmpegDetailBusy}
      >
        <details
          className="app-settings-section"
          aria-label={uiText('editorFfmpegSectionVideo')}
          aria-busy={editorFfmpegDetailBusy}
          open={panelOpen('ffmpegVideo')}
          onToggle={(e) => {
            persistMainWindowUiPanelToggle('ffmpegVideo', e.currentTarget.open)
          }}
        >
          <summary
            className="app-settings-summary"
            title={uiText('editorTooltipSectionVideo')}
          >
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
                    void window.fluxalloy.settings
                      .setFfmpegExportContainer('mkv')
                      .catch(console.error)
                    setStatusHint(uiText('editorExportAutoContainerMkv'))
                  }
                  if (ffmpegExportVideoCodecRequiresMov(v) && exportContainer !== 'mov') {
                    setExportContainer('mov')
                    void window.fluxalloy.settings
                      .setFfmpegExportContainer('mov')
                      .catch(console.error)
                    setStatusHint(uiText('editorExportAutoContainerMov'))
                  }
                  if (v !== 'libx264' && exportTwoPass) {
                    setExportTwoPass(false)
                    void window.fluxalloy.settings
                      .setFfmpegExportTwoPass(false)
                      .catch(console.error)
                  }
                  void window.fluxalloy.settings
                    .setFfmpegExportVideoCodec(v)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportEncodePreset(v)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportContainer(v)
                    .catch(console.error)
                }}
              >
                {ffmpegExportSelectOptions.containers.map((p) => (
                  <option
                    key={p.id}
                    value={p.id}
                    disabled={
                      (cpuFfmpegVideoCodecRequiresMkv(exportVideoCodec) &&
                        p.id !== 'mkv') ||
                      (ffmpegExportVideoCodecRequiresMov(exportVideoCodec) &&
                        p.id !== 'mov') ||
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
                  void window.fluxalloy.settings
                    .setFfmpegExportCrf(next)
                    .catch(console.error)
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
                    void window.fluxalloy.settings
                      .setFfmpegExportTwoPass(false)
                      .catch(console.error)
                  }
                  void window.fluxalloy.settings
                    .setFfmpegExportVideoBitrate(next)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportVideoDeinterlace(v)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportVideoDenoise(v)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportVideoDeband(v)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportVideoHisteq(v)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportVideoLut3d(v)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportVideoSharpen(v)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportVideoEqPreset(v)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportVideoHue(v)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportVideoGrain(v)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportVideoVignette(v)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportVideoBlur(v)
                    .catch(console.error)
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
    
        <details
          className="app-settings-section"
          aria-label={uiText('editorFfmpegSectionFrameLayout')}
          aria-busy={editorFfmpegDetailBusy}
          open={panelOpen('ffmpegFormat')}
          onToggle={(e) => {
            persistMainWindowUiPanelToggle('ffmpegFormat', e.currentTarget.open)
          }}
        >
          <summary
            className="app-settings-summary"
            title={uiText('editorTooltipSectionFormat')}
          >
            {uiText('editorFfmpegSectionFrameLayout')}
          </summary>
          <p id="ffmpegFormatSectionHint" className="app-settings-section-hint">
            {uiText('editorFfmpegSectionFrameLayoutHint')}
          </p>
          <div className="app-settings-grid" aria-describedby="ffmpegFormatSectionHint">
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
                  void window.fluxalloy.settings
                    .setFfmpegExportScalePreset(v)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportFps(next)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportTwoPass(v)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportEconomyMode(v)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportHwDecode(v)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportVideoTransform(v)
                    .catch(console.error)
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
                  void window.fluxalloy.settings
                    .setFfmpegExportCropPreset(v)
                    .catch(console.error)
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
    
        <details
          className="app-settings-section"
          aria-label={uiText('editorFfmpegSectionAudio')}
          aria-busy={editorFfmpegDetailBusy}
          open={panelOpen('ffmpegAudio')}
          onToggle={(e) => {
            persistMainWindowUiPanelToggle('ffmpegAudio', e.currentTarget.open)
          }}
        >
          <summary
            className="app-settings-summary"
            title={uiText('editorTooltipSectionAudio')}
          >
            {uiText('editorFfmpegSectionAudio')}
          </summary>
          <p id="ffmpegAudioSectionHint" className="app-settings-section-hint">
            {uiText('editorFfmpegSectionAudioHint')}
          </p>
          <div className="app-settings-grid" aria-describedby="ffmpegAudioSectionHint">
            <label
              className="app-field"
              title={uiText('editorTooltipAudioMode')}
              aria-describedby="ffmpegAudioSectionHint ffmpegAudioModeSelectHint"
            >
              <span>{uiText('editorFieldAudioMode')}</span>
              <select
                className="app-control"
                title={uiText('editorTooltipAudioMode')}
                value={exportAudioMode}
                disabled={exportBusy || snapshotBusy}
                onChange={(e) => {
                  bumpManualExportEdit()
                  const v = e.target.value as FfmpegExportAudioModeId
                  setExportAudioMode(v)
                  if (ffmpegExportAudioModeRequiresMkv(v) && exportContainer !== 'mkv') {
                    setExportContainer('mkv')
                    void window.fluxalloy.settings
                      .setFfmpegExportContainer('mkv')
                      .catch(console.error)
                    setStatusHint(uiText('editorExportAutoContainerMkv'))
                  }
                  void window.fluxalloy.settings
                    .setFfmpegExportAudioMode(v)
                    .catch(console.error)
                }}
              >
                {ffmpegExportSelectOptions.audioModes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
              <span id="ffmpegAudioModeSelectHint" className="app-visually-hidden">
                {uiText('editorExportAudioModeSelectHint')}
              </span>
            </label>
            <label className="app-field" title={uiText('editorTooltipAacBitrate')}>
              <span>{uiText('editorFieldAacBitrate')}</span>
              <select
                className="app-control"
                title={uiText('editorTooltipAacBitrate')}
                value={exportAudioBitrate}
                disabled={
                  exportBusy ||
                  snapshotBusy ||
                  !ffmpegExportAudioModeUsesBitrate(exportAudioMode)
                }
                onChange={(e) => {
                  bumpManualExportEdit()
                  const v = e.target.value
                  setExportAudioBitrate(v)
                  void window.fluxalloy.settings
                    .setFfmpegExportAudioBitrate(v)
                    .catch(console.error)
                }}
              >
                {EXPORT_AUDIO_BITRATES.map((v) => (
                  <option key={v} value={v}>
                    AAC {v}
                  </option>
                ))}
              </select>
            </label>
            <label className="app-field" title={uiText('editorHintAudioGain')}>
              <span>{uiText('editorFieldAudioGain')}</span>
              <select
                className="app-control"
                title={uiText('editorHintAudioGain')}
                value={String(exportAudioGainDb)}
                disabled={
                  exportBusy ||
                  snapshotBusy ||
                  !ffmpegExportAudioModeAllowsFilters(exportAudioMode)
                }
                onChange={(e) => {
                  bumpManualExportEdit()
                  const parsed = Number(e.target.value)
                  const v = Number.isFinite(parsed) ? Math.trunc(parsed) : 0
                  setExportAudioGainDb(v)
                  void window.fluxalloy.settings
                    .setFfmpegExportAudioGainDb(v === 0 ? null : v)
                    .catch(console.error)
                }}
              >
                {ffmpegExportSelectOptions.audioGainOptions.map((p) => (
                  <option key={p.value} value={String(p.value)}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="app-field" title={uiText('editorHintAudioNormalize')}>
              <span>{uiText('editorFieldAudioNormalize')}</span>
              <select
                className="app-control"
                title={uiText('editorHintAudioNormalize')}
                value={exportAudioNormalize}
                disabled={
                  exportBusy ||
                  snapshotBusy ||
                  !ffmpegExportAudioModeAllowsFilters(exportAudioMode)
                }
                onChange={(e) => {
                  bumpManualExportEdit()
                  const v = e.target.value as FfmpegExportAudioNormalizeId
                  setExportAudioNormalize(v)
                  void window.fluxalloy.settings
                    .setFfmpegExportAudioNormalize(v)
                    .catch(console.error)
                }}
              >
                {ffmpegExportSelectOptions.audioNormalize.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="app-field" title={uiText('editorTooltipSnapshotFormat')}>
              <span>{uiText('editorFieldSnapshotFormat')}</span>
              <select
                className="app-control"
                title={uiText('editorTooltipSnapshotFormat')}
                value={snapshotFormat}
                disabled={exportBusy || snapshotBusy}
                onChange={(e) => {
                  const v = e.target.value === 'jpg' ? 'jpg' : 'png'
                  setSnapshotFormat(v)
                  void window.fluxalloy.settings
                    .setFfmpegSnapshotFormat(v)
                    .catch(console.error)
                }}
              >
                {ffmpegExportSelectOptions.snapshotFormats.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="app-field app-field-switch">
              <span>{uiText('editorStripMetadataSpan')}</span>
              <PillSwitch
                label={uiText('editorStripMetadataPillLabel')}
                tooltip={uiText('editorTooltipStripMetadata')}
                checked={exportStripMetadata}
                describedBy="ffmpegAudioSectionHint ffmpegStripMetadataHint"
                disabled={exportBusy || snapshotBusy}
                onToggle={() => {
                  bumpManualExportEdit()
                  const next = !exportStripMetadata
                  setExportStripMetadata(next)
                  void window.fluxalloy.settings
                    .setFfmpegExportStripMetadata(next)
                    .catch(console.error)
                }}
              />
              <span id="ffmpegStripMetadataHint" className="app-visually-hidden">
                {uiText('editorStripMetadataHint')}
              </span>
            </div>
            <div className="app-field app-field-switch">
              <span>{uiText('editorStripChaptersSpan')}</span>
              <PillSwitch
                label={uiText('editorStripChaptersPillLabel')}
                tooltip={uiText('editorTooltipStripChapters')}
                checked={exportStripChapters}
                describedBy="ffmpegAudioSectionHint ffmpegStripChaptersHint"
                disabled={exportBusy || snapshotBusy}
                onToggle={() => {
                  bumpManualExportEdit()
                  const next = !exportStripChapters
                  setExportStripChapters(next)
                  void window.fluxalloy.settings
                    .setFfmpegExportStripChapters(next)
                    .catch(console.error)
                }}
              />
              <span id="ffmpegStripChaptersHint" className="app-visually-hidden">
                {uiText('editorStripChaptersHint')}
              </span>
            </div>
            <label className="app-field" title={uiText('editorHintExportSubtitles')}>
              <span>{uiText('editorFieldExportSubtitles')}</span>
              <select
                className="app-control"
                title={uiText('editorHintExportSubtitles')}
                value={exportSubtitleMode}
                disabled={exportBusy || snapshotBusy}
                onChange={(e) => {
                  bumpManualExportEdit()
                  const v: FfmpegExportSubtitleModeId =
                    e.target.value === 'copy' ? 'copy' : 'drop'
                  setExportSubtitleMode(v)
                  void window.fluxalloy.settings
                    .setFfmpegExportSubtitleMode(v)
                    .catch(console.error)
                }}
              >
                {ffmpegExportSelectOptions.subtitleModes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          {lastSnapshotPath ? (
            <div
              className="app-settings-actions"
              role="toolbar"
              aria-orientation="horizontal"
              aria-label={uiText('editorSnapshotLastActionsToolbarAria')}
              aria-busy={exportBusy || snapshotBusy || probePending}
            >
              <button
                type="button"
                className="app-btn app-btn-compact"
                disabled={exportBusy || snapshotBusy}
                aria-describedby="ffmpegAudioSectionHint"
                title={uiText('editorTooltipSnapshotLastFile')}
                onClick={() => {
                  void handleOpenLastSnapshot('file')
                }}
              >
                {uiText('editorSnapshotLastFile')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-compact"
                disabled={exportBusy || snapshotBusy}
                aria-describedby="ffmpegAudioSectionHint"
                title={uiText('editorTooltipSnapshotLastFolder')}
                onClick={() => {
                  void handleOpenLastSnapshot('folder')
                }}
              >
                {uiText('editorSnapshotLastFolder')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-compact"
                disabled={exportBusy || snapshotBusy}
                aria-describedby="ffmpegAudioSectionHint"
                title={uiText('editorTooltipSnapshotCopyPath')}
                onClick={() => {
                  void handleCopyLastSnapshotPath()
                }}
              >
                {uiText('editorCopy')}
              </button>
            </div>
          ) : null}
        </details>
    
        <details
          className="app-settings-section"
          aria-label={uiText('editorFfmpegSectionPresets')}
          aria-busy={editorFfmpegDetailBusy}
          open={panelOpen('ffmpegPresets')}
          onToggle={(e) => {
            persistMainWindowUiPanelToggle('ffmpegPresets', e.currentTarget.open)
          }}
        >
          <summary
            className="app-settings-summary"
            title={uiText('editorTooltipSectionPresets')}
          >
            {uiText('editorFfmpegSectionPresets')}
          </summary>
          <p id="ffmpegPresetsSectionHint" className="app-settings-section-hint">
            {uiText('editorFfmpegSectionPresetsHint')}
          </p>
          <div className="app-settings-stack" aria-describedby="ffmpegPresetsSectionHint">
            <label
              className="app-field"
              title={
                selectedExportUserPreset?.hint?.trim() ||
                uiText('editorTooltipUserPresetSelectFallback')
              }
            >
              <span>{uiText('editorFieldUserPreset')}</span>
              <select
                className="app-control"
                title={
                  selectedExportUserPreset?.hint?.trim() ||
                  uiText('editorTooltipUserPresetSelectFallback')
                }
                value={selectedUserPresetId ?? ''}
                disabled={exportBusy || snapshotBusy}
                onChange={(e) => {
                  const v = e.target.value
                  if (v === '') {
                    setSelectedUserPresetId(null)
                    return
                  }
                  const preset = exportUserPresets.find((p) => p.id === v)
                  if (!preset) {
                    return
                  }
                  void window.fluxalloy.settings
                    .applyFfmpegExportSnapshot(preset.snapshot)
                    .then((s) => {
                      hydrateExportFieldsFromSettings(s)
                      setSelectedUserPresetId(v)
                    })
                    .catch(console.error)
                }}
              >
                <option value="">{uiText('editorUserPresetPlaceholder')}</option>
                {exportUserPresets.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <div
              className="app-settings-actions"
              role="toolbar"
              aria-orientation="horizontal"
              aria-label={uiText('editorExportPresetsActionsToolbarAria')}
              aria-busy={exportBusy || snapshotBusy || probePending}
            >
              <button
                type="button"
                className="app-btn app-btn-compact"
                disabled={exportBusy || snapshotBusy}
                aria-describedby="ffmpegPresetsSectionHint"
                title={uiText('editorTooltipPresetAdd')}
                onClick={() => {
                  handleSaveExportUserPreset()
                }}
              >
                {uiText('editorPresetAdd')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-compact"
                disabled={
                  exportBusy ||
                  snapshotBusy ||
                  !selectedUserPresetId ||
                  (selectedUserPresetId != null &&
                    isBuiltinExportUserPresetId(selectedUserPresetId))
                }
                aria-describedby="ffmpegPresetsSectionHint"
                title={uiText('editorTooltipPresetRename')}
                onClick={() => {
                  handleRenameExportUserPreset()
                }}
              >
                {uiText('editorPresetRename')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-compact"
                disabled={
                  exportBusy ||
                  snapshotBusy ||
                  !selectedUserPresetId ||
                  (selectedUserPresetId != null &&
                    isBuiltinExportUserPresetId(selectedUserPresetId))
                }
                aria-describedby="ffmpegPresetsSectionHint"
                title={uiText('editorTooltipPresetOverwrite')}
                onClick={() => {
                  handleOverwriteExportUserPreset()
                }}
              >
                {uiText('editorPresetOverwrite')}
              </button>
              <button
                type="button"
                className="app-btn app-btn-compact"
                disabled={
                  exportBusy ||
                  snapshotBusy ||
                  !selectedUserPresetId ||
                  (selectedUserPresetId != null &&
                    isBuiltinExportUserPresetId(selectedUserPresetId))
                }
                aria-describedby="ffmpegPresetsSectionHint"
                title={uiText('editorTooltipPresetDelete')}
                onClick={() => {
                  handleDeleteExportUserPreset()
                }}
              >
                {uiText('editorPresetDelete')}
              </button>
            </div>
          </div>
        </details>
    
        <details
          id="editor-ffmpeg-export-output"
          className="app-settings-section"
          aria-label={uiText('editorFfmpegSectionOutput')}
          aria-busy={editorFfmpegDetailBusy}
          open={panelOpen('ffmpegOutput')}
          onToggle={(e) => {
            persistMainWindowUiPanelToggle('ffmpegOutput', e.currentTarget.open)
          }}
        >
          <summary
            className="app-settings-summary"
            title={uiText('editorTooltipSectionOutput')}
          >
            {uiText('editorFfmpegSectionOutput')}
          </summary>
          <p id="ffmpegOutputSectionHint" className="app-settings-section-hint">
            {uiText('editorFfmpegSectionOutputHint')}
          </p>
          <div className="app-settings-stack" aria-describedby="ffmpegOutputSectionHint">
            <label
              className="app-field app-field-block"
              title={uiText('editorExportExtraArgsHint')}
            >
              <span>{uiText('editorExportExtraArgsLabel')}</span>
              <textarea
                className="app-downloads-url-input app-control"
                value={exportExtraArgsLine}
                placeholder={uiText('editorExportExtraArgsPlaceholder')}
                rows={2}
                disabled={exportBusy || snapshotBusy}
                onChange={(e) => {
                  bumpManualExportEdit()
                  const v = e.target.value
                  setExportExtraArgsLine(v)
                  void window.fluxalloy.settings
                    .setFfmpegExportExtraArgsLine(v)
                    .catch(console.error)
                }}
              />
              <span className="app-settings-section-hint">
                {uiText('editorExportExtraArgsHint')}
              </span>
              {!exportExtraArgsParsed.ok ? (
                <span className="app-field-error" role="alert">
                  {uiTextVars('editorExportExtraArgsParseError', {
                    detail: exportExtraArgsParsed.error
                  })}
                </span>
              ) : null}
            </label>
            <details
              className="app-export-preview app-export-preview-nested"
              aria-label={uiText('editorExportPreviewDetailsAria')}
              aria-busy={editorFfmpegDetailBusy}
              open={panelOpen('exportCommandPreview')}
              onToggle={(e) => {
                persistMainWindowUiPanelToggle('exportCommandPreview', e.currentTarget.open)
              }}
            >
              <summary
                className="app-export-preview-summary"
                title={uiText('editorTooltipExportCommandPreview')}
              >
                {uiText('editorExportCommandPreviewSummary')}
              </summary>
              <div
                className="app-export-preview-body"
                role="region"
                aria-label={uiText('editorExportPreviewBodyRegionAria')}
                aria-busy={exportBusy || snapshotBusy || probePending}
              >
                <pre
                  className="app-export-preview-pre"
                  aria-label={uiText('editorAriaExportFfmpegCommand')}
                  aria-describedby="exportCommandPreviewHint"
                >
                  {exportPreview.pass1Command
                    ? `${uiText('editorExportPreviewPass1')}\n${exportPreview.pass1Command}\n\n${uiText('editorExportPreviewPass2')}\n${exportPreviewCommand}`
                    : exportPreviewCommand}
                </pre>
                <div
                  className="app-export-preview-actions"
                  role="toolbar"
                  aria-orientation="horizontal"
                  aria-label={uiText('editorExportPreviewActionsToolbarAria')}
                  aria-busy={exportBusy || snapshotBusy || probePending}
                >
                  <button
                    type="button"
                    className="app-btn app-btn-compact"
                    onClick={() => {
                      void handleCopyExportPreview()
                    }}
                    title={uiText('editorCopyFfmpegCommandTitle')}
                    aria-describedby="exportCommandPreviewHint"
                  >
                    {uiText('editorCopy')}
                  </button>
                  <span id="exportCommandPreviewHint" className="app-export-preview-hint">
                    {exportPreviewHint()}
                  </span>
                </div>
              </div>
            </details>
            {lastExportPath ? (
              <div
                className="app-settings-actions"
                role="toolbar"
                aria-orientation="horizontal"
                aria-label={uiText('editorExportLastOutputActionsToolbarAria')}
                aria-busy={exportBusy || snapshotBusy || probePending}
              >
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  disabled={exportBusy || snapshotBusy}
                  aria-describedby="ffmpegOutputSectionHint"
                  title={uiText('editorTooltipExportLastFile')}
                  onClick={() => {
                    void handleOpenLastExport('file')
                  }}
                >
                  {uiText('editorExportLastFile')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  disabled={exportBusy || snapshotBusy}
                  aria-describedby="ffmpegOutputSectionHint"
                  title={uiText('editorTooltipExportLastFolder')}
                  onClick={() => {
                    void handleOpenLastExport('folder')
                  }}
                >
                  {uiText('editorExportLastFolder')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  disabled={exportBusy || snapshotBusy}
                  aria-describedby="ffmpegOutputSectionHint"
                  title={uiText('editorTooltipExportOpenPreview')}
                  onClick={() => {
                    void handleOpenLastExport('preview')
                  }}
                >
                  {uiText('processingHistoryOpenPreview')}
                </button>
                <button
                  type="button"
                  className="app-btn app-btn-compact"
                  disabled={exportBusy || snapshotBusy}
                  aria-describedby="ffmpegOutputSectionHint"
                  title={uiText('editorTooltipCopyExportPath')}
                  onClick={() => {
                    void handleCopyLastExportPath()
                  }}
                >
                  {uiText('editorCopyExportPath')}
                </button>
              </div>
            ) : null}
          </div>
        </details>
      </div>
      <ProcessingHistoryPanel
        open={panelOpen('processingHistory')}
        busy={processingHistoryBusy}
        entries={processingHistory}
        filter={processingHistoryFilter}
        weeklySummary={processingHistoryWeeklySummary}
        onToggle={(nextOpen) => {
          persistMainWindowUiPanelToggle('processingHistory', nextOpen)
        }}
        onFilterChange={applyProcessingHistoryFilter}
        onRefresh={() => {
          void refreshProcessingHistory()
        }}
        onClear={() => {
          void window.fluxalloy.processingHistory.clear().then((res) => {
            if (!res.ok) {
              setStatusHint(res.error)
              return
            }
            setProcessingHistory([])
            void window.fluxalloy.processingHistory
              .weeklySummary()
              .then(setProcessingHistoryWeeklySummary)
          })
        }}
        onExportVisible={() => {
          void exportVisibleProcessingHistory()
        }}
        onOpenOutput={(id, mode) => {
          void window.fluxalloy.processingHistory.openOutput(id, mode).then((res) => {
            if (!res.ok) {
              setStatusHint(res.error)
            } else if (mode === 'preview') {
              setStatusHint(uiText('processingHistoryOpenOutputPreviewDone'))
            }
          })
        }}
        onOpenInputInHandler={(id) => {
          setStatusHint(uiText('processingHistoryOpenInputBusy'))
          void window.fluxalloy.processingHistory.openInputInHandler(id).then((res) => {
            setStatusHint(res.ok ? uiText('processingHistoryOpenInputDone') : res.error)
          })
        }}
        onAddInputToBatch={(id) => {
          void window.fluxalloy.batchExport.addFromHistoryInputs([id]).then((res) => {
            if (!res.ok) {
              setStatusHint(res.error)
              return
            }
            reportBatchPathsAdded(res)
          })
        }}
      />
    </aside>
  )
}
