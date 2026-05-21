import { useCallback, useEffect, useMemo } from 'react'

import { parseFfmpegExportExtraArgsLine } from '../../shared/ffmpeg-export-extra-args'
import { resolveFfmpegExportHwaccelForDecode } from '../../shared/ffmpeg-export-hw-decode'
import {
  isFfmpegHwExportVideoCodec,
  probeRunnableHwSnapshot,
  resolveFfmpegExportVideoCodecForArgv
} from '../../shared/ffmpeg-export-video-codec'
import type { AppSettings } from '../../shared/settings-contract'
import { buildEditorExportSelectOptions } from './editor-export-select-options'
import {
  buildEditorExportUserPresetSnapshot,
  buildEditorFfmpegExportOverrides
} from './editor-export-settings-snapshot-build'
import type { EditorExportSettingsFieldState } from './editor-export-settings-field-state'
import type { EditorExportSettingsDerivedBundle } from './editor-export-settings-derived-types'
import { resolveExternalFilterScriptForPreview } from '../../shared/external-filter-script-resolve-preview'
import { hydrateEditorExportFieldsFromSettings } from './editor-export-settings-hydrate'
import { buildEditorExportStatusbarCodecDisplay } from './editor-export-statusbar-codec'
import { getUiLocale, uiText, uiTextVars } from './locales/ui-text'

export function useEditorExportSettingsDerived(
  fields: EditorExportSettingsFieldState
): EditorExportSettingsDerivedBundle {
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
    setExportBenchmarkLoadThreshold,
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
    setSelectedUserPresetId,
    exportExternalFilterKind,
    exportExternalFilterScriptPath,
    setExportExternalFilterKind,
    setExportExternalFilterScriptPath
  } = fields

  const ffmpegExportSelectOptions = useMemo(
    () => buildEditorExportSelectOptions(hwEncoderProbe, exportVideoCodec),
    [hwEncoderProbe, exportVideoCodec]
  )
  const exportVideoCodecResolvedForPreview = useMemo(
    () =>
      resolveFfmpegExportVideoCodecForArgv(
        exportVideoCodec,
        probeRunnableHwSnapshot(hwEncoderProbe)
      ),
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
  const externalFilterForPreview = useMemo(
    () =>
      resolveExternalFilterScriptForPreview({
        ffmpegExportExternalFilterKind: exportExternalFilterKind,
        ffmpegExportExternalFilterScriptPath: exportExternalFilterScriptPath
      }),
    [exportExternalFilterKind, exportExternalFilterScriptPath]
  )
  const exportCodecStatusbarCodec = useMemo(
    () =>
      buildEditorExportStatusbarCodecDisplay({
        exportVideoCodec,
        resolvedCodec: exportVideoCodecResolvedForPreview,
        hwEncoderProbe,
        exportHwDecode,
        exportHwaccelDecode: exportHwaccelDecodeForPreview,
        uiText: (key: string) => (uiText as (k: string) => string)(key),
        uiTextVars: (key: string, vars: Record<string, string>) =>
          (uiTextVars as (k: string, v: Record<string, string>) => string)(key, vars)
      }),
    [
      exportVideoCodec,
      exportVideoCodecResolvedForPreview,
      hwEncoderProbe,
      exportHwDecode,
      exportHwaccelDecodeForPreview
    ]
  )
  const exportCodecStatusbarLabel = exportCodecStatusbarCodec.label
  const exportCodecStatusbarTitle = exportCodecStatusbarCodec.title
  const exportCodecStatusbarAria = exportCodecStatusbarCodec.ariaLabel

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
        if (r.ok === true && probeRunnableHwSnapshot(r)[codec]) {
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
      setExportBenchmarkLoadThreshold,
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
      setExportVideoLut3d,
      setExportExternalFilterKind,
      setExportExternalFilterScriptPath
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
    exportCodecStatusbarTitle,
    exportCodecStatusbarAria,
    refetchHwEncoders,
    hydrateExportFieldsFromSettings,
    bumpManualExportEdit,
    buildCurrentExportSnapshot,
    buildCurrentFfmpegExportOverrides,
    externalFilterForPreview
  }
}
