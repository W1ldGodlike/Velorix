import { useCallback, useEffect, useMemo } from 'react'

import { parseFfmpegExportExtraArgsLine } from '../../shared/ffmpeg-export-extra-args'
import { resolveFfmpegExportHwaccelForDecode } from '../../shared/ffmpeg-export-hw-decode'
import {
  isFfmpegHwExportVideoCodec,
  probeSnapshotOrEmpty,
  resolveFfmpegExportVideoCodecForArgv
} from '../../shared/ffmpeg-export-video-codec'
import type { AppSettings } from '../../shared/settings-contract'
import { buildEditorExportSelectOptions } from './editor-export-select-options'
import {
  buildEditorExportUserPresetSnapshot,
  buildEditorFfmpegExportOverrides
} from './editor-export-settings-snapshot-build'
import type { EditorExportSettingsFieldState } from './editor-export-settings-field-state'
import { hydrateEditorExportFieldsFromSettings } from './editor-export-settings-hydrate'
import { getUiLocale, uiTextVars } from './locales/ui-text'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- derived export-settings bundle
export function useEditorExportSettingsDerived(fields: EditorExportSettingsFieldState) {
  const {
    exportEncodePreset,
    setExportEncodePreset,
    exportVideoCodec,
    setExportVideoCodec,
    hwEncoderProbe,
    setHwEncoderProbe,
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
    setEditorUrlPasteBehavior,
    setBatchOutputSuffix,
    setBatchOutputDirectory,
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
    setLutCubePathForPreview,
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
    setSelectedUserPresetId
  } = fields

  const ffmpegExportSelectOptions = useMemo(
    () => buildEditorExportSelectOptions(hwEncoderProbe, exportVideoCodec),
    [hwEncoderProbe, exportVideoCodec]
  )
  const exportVideoCodecResolvedForPreview = useMemo(
    () =>
      resolveFfmpegExportVideoCodecForArgv(exportVideoCodec, probeSnapshotOrEmpty(hwEncoderProbe)),
    [exportVideoCodec, hwEncoderProbe]
  )
  const exportExtraArgsParsed = useMemo(
    () => parseFfmpegExportExtraArgsLine(exportExtraArgsLine, getUiLocale()),
    [exportExtraArgsLine]
  )
  const exportHwaccelDecodeForPreview = useMemo(() => {
    if (!exportHwDecode) {
      return null
    }
    const hwaccels = hwEncoderProbe?.ok === true ? hwEncoderProbe.hwaccels : []
    return resolveFfmpegExportHwaccelForDecode(exportVideoCodecResolvedForPreview, hwaccels)
  }, [exportHwDecode, hwEncoderProbe, exportVideoCodecResolvedForPreview])
  const exportCodecStatusbarLabel = useMemo(() => {
    let label = uiTextVars('editorStatusbarCodec', { codec: exportVideoCodecResolvedForPreview })
    if (exportHwaccelDecodeForPreview) {
      label += uiTextVars('editorStatusbarHwDecode', { method: exportHwaccelDecodeForPreview })
    }
    return label
  }, [exportVideoCodecResolvedForPreview, exportHwaccelDecodeForPreview])

  const refetchHwEncoders = useCallback((): Promise<void> => {
    return window.fluxalloy.engines.probeHwEncoders().then((r) => {
      setHwEncoderProbe(r)
      setExportVideoCodec((codec) => {
        if (codec === 'hw_auto' || codec === 'hw_auto_hevc') {
          return codec
        }
        if (!isFfmpegHwExportVideoCodec(codec)) {
          return codec
        }
        if (r.ok === true && r.snapshot[codec]) {
          return codec
        }
        void window.fluxalloy.settings.setFfmpegExportVideoCodec('libx264').catch(console.error)
        return 'libx264'
      })
    })
  }, [setExportVideoCodec, setHwEncoderProbe])

  useEffect(() => {
    void refetchHwEncoders()
  }, [refetchHwEncoders])

  const hydrateExportFieldsFromSettings = useCallback((loaded: AppSettings) => {
    hydrateEditorExportFieldsFromSettings(loaded, {
      setExportEncodePreset,
      setExportCrf,
      setExportVideoBitrate,
      setExportVideoCodec,
      setExportContainer,
      setExportAudioMode,
      setExportTwoPass,
      setExportEconomyMode,
      setExportHwDecode,
      setExportExtraArgsLine,
      setEditorUrlPasteBehavior,
      setBatchOutputSuffix,
      setBatchOutputDirectory,
      setExportAudioBitrate,
      setExportFps,
      setExportVideoTransform,
      setExportCropPreset,
      setExportScalePreset,
      setExportAudioGainDb,
      setExportStripMetadata,
      setExportStripChapters,
      setExportSubtitleMode,
      setExportVideoDeinterlace,
      setExportVideoDenoise,
      setExportVideoDeband,
      setExportVideoHisteq,
      setExportVideoSharpen,
      setExportVideoEqPreset,
      setExportVideoHue,
      setExportVideoGrain,
      setExportVideoVignette,
      setExportVideoBlur,
      setExportAudioNormalize,
      setExportVideoLut3d
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only hydrate (pre-split)
  }, [])

  useEffect(() => {
    let cancelled = false
    void window.fluxalloy.export.resolveBundledLutCubePath(exportVideoLut3d).then((p) => {
      if (!cancelled) {
        setLutCubePathForPreview(p)
      }
    })
    return () => {
      cancelled = true
    }
  }, [exportVideoLut3d, setLutCubePathForPreview])

  const bumpManualExportEdit = useCallback(() => {
    setSelectedUserPresetId(null)
  }, [setSelectedUserPresetId])

  const exportSnapshotFields = useMemo(
    () => ({
      exportEncodePreset,
      exportVideoCodec,
      exportContainer,
      exportCrf,
      exportVideoBitrate,
      exportAudioMode,
      exportAudioBitrate,
      exportFps,
      exportScalePreset,
      exportVideoTransform,
      exportCropPreset,
      exportTwoPass,
      exportEconomyMode,
      exportHwDecode,
      exportExtraArgsLine,
      exportAudioGainDb,
      exportStripMetadata,
      exportStripChapters,
      exportSubtitleMode,
      exportVideoDeinterlace,
      exportVideoDenoise,
      exportVideoDeband,
      exportVideoHisteq,
      exportVideoLut3d,
      exportVideoSharpen,
      exportVideoEqPreset,
      exportVideoHue,
      exportVideoGrain,
      exportVideoVignette,
      exportVideoBlur,
      exportAudioNormalize
    }),
    [
      exportEncodePreset,
      exportVideoCodec,
      exportContainer,
      exportCrf,
      exportVideoBitrate,
      exportAudioMode,
      exportAudioBitrate,
      exportFps,
      exportScalePreset,
      exportVideoTransform,
      exportCropPreset,
      exportTwoPass,
      exportEconomyMode,
      exportHwDecode,
      exportExtraArgsLine,
      exportAudioGainDb,
      exportStripMetadata,
      exportStripChapters,
      exportSubtitleMode,
      exportVideoDeinterlace,
      exportVideoDenoise,
      exportVideoDeband,
      exportVideoHisteq,
      exportVideoLut3d,
      exportVideoSharpen,
      exportVideoEqPreset,
      exportVideoHue,
      exportVideoGrain,
      exportVideoVignette,
      exportVideoBlur,
      exportAudioNormalize
    ]
  )

  const buildCurrentExportSnapshot = useCallback(
    () => buildEditorExportUserPresetSnapshot(exportSnapshotFields),
    [exportSnapshotFields]
  )

  const buildCurrentFfmpegExportOverrides = useCallback(
    () => buildEditorFfmpegExportOverrides(exportSnapshotFields),
    [exportSnapshotFields]
  )

  return {
    ffmpegExportSelectOptions,
    exportVideoCodecResolvedForPreview,
    exportExtraArgsParsed,
    exportHwaccelDecodeForPreview,
    exportCodecStatusbarLabel,
    refetchHwEncoders,
    hydrateExportFieldsFromSettings,
    bumpManualExportEdit,
    buildCurrentExportSnapshot,
    buildCurrentFfmpegExportOverrides
  }
}
