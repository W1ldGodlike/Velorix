import { useMemo } from 'react'

import { buildFfmpegExportPreviewCommand } from '../../shared/ffmpeg-export-argv'
import { uiText, uiTextVars } from './locales/ui-text'
import type {
  EditorExportPipelinePreviewDeps,
  FfmpegExportPreviewInput
} from './use-editor-export-pipeline-deps'

export function useEditorExportPipelinePreview(
  deps: EditorExportPipelinePreviewDeps
): {
  exportPreview: ReturnType<typeof buildFfmpegExportPreviewCommand>
  exportPreviewCommand: string
  exportPreviewHint: () => string
} {
  const {
    preview,
    probeInfo,
    trimRange,
    exportContainer,
    exportEncodePreset,
    exportVideoCodecResolvedForPreview,
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
    exportHwaccelDecodeForPreview,
    exportExtraArgsParsed,
    exportAudioGainDb,
    exportStripMetadata,
    exportStripChapters,
    exportSubtitleMode,
    exportVideoDeinterlace,
    exportVideoDenoise,
    exportVideoDeband,
    exportVideoHisteq,
    lutCubePathForPreview,
    exportVideoSharpen,
    exportVideoEqPreset,
    exportVideoHue,
    exportVideoGrain,
    exportVideoVignette,
    exportVideoBlur,
    exportAudioNormalize,
    externalFilterForPreview
  } = deps

  /**
   * §7.2 — live preview команды ffmpeg для текущих параметров toolbar и таймлайна.
   * Сборка argv и решение про `-ss/-t` лежат в `src/shared/ffmpeg-export-argv.ts`
   * (`buildFfmpegExportPreviewCommand` + `shouldApplyFfmpegExportTrim`),
   * чтобы превью совпадало с тем, что пошло бы в реальный spawn `runFfmpegExportJob`.
   */
  const exportPreview = useMemo(() => {
    const sourcePath = preview?.path ?? null
    let outputPath: string | null = null
    if (sourcePath !== null) {
      const stem = sourcePath.replace(/\.[^.]+$/, '')
      outputPath = `${stem}-export.${exportContainer}`
    }
    const previewInput = {
      encodePreset: exportEncodePreset,
      videoCodec: exportVideoCodecResolvedForPreview,
      container: exportContainer,
      crf: exportCrf,
      videoBitrate: exportVideoBitrate,
      audioMode: exportAudioMode,
      audioBitrate: exportAudioBitrate,
      fps: exportFps,
      scalePreset: exportScalePreset,
      videoTransform: exportVideoTransform,
      cropPreset: exportCropPreset,
      twoPass:
        exportTwoPass &&
        exportVideoBitrate !== null &&
        exportVideoCodecResolvedForPreview === 'libx264',
      economyMode: exportEconomyMode,
      ...(exportHwaccelDecodeForPreview !== null
        ? { hwaccelDecode: exportHwaccelDecodeForPreview }
        : {}),
      ...(exportExtraArgsParsed.ok && exportExtraArgsParsed.args.length > 0
        ? { extraArgs: exportExtraArgsParsed.args }
        : {}),
      audioGainDb: exportAudioGainDb === 0 ? null : exportAudioGainDb,
      stripMetadata: exportStripMetadata,
      stripChapters: exportStripChapters,
      subtitleMode: exportSubtitleMode,
      videoDeinterlace: exportVideoDeinterlace,
      videoDenoise: exportVideoDenoise,
      videoDeband: exportVideoDeband,
      videoHisteq: exportVideoHisteq,
      ...(lutCubePathForPreview !== null && lutCubePathForPreview.trim() !== ''
        ? { videoLut3dCubeAbsPath: lutCubePathForPreview.trim() }
        : {}),
      videoSharpen: exportVideoSharpen,
      videoEqPreset: exportVideoEqPreset,
      videoHue: exportVideoHue,
      videoGrain: exportVideoGrain,
      videoVignette: exportVideoVignette,
      videoBlur: exportVideoBlur,
      audioNormalize: exportAudioNormalize,
      ...(externalFilterForPreview.kind === 'avisynth' ||
      externalFilterForPreview.kind === 'vapoursynth'
        ? externalFilterForPreview.scriptAbsPath
          ? {
              externalFilterKind: externalFilterForPreview.kind,
              externalFilterScriptAbsPath: externalFilterForPreview.scriptAbsPath
            }
          : {}
        : {}),
      inputPath: sourcePath,
      outputPath,
      trim: trimRange,
      probeDurationSec: probeInfo?.durationSec ?? null
    }
    return buildFfmpegExportPreviewCommand(previewInput as FfmpegExportPreviewInput)
  }, [
    preview?.path,
    exportEncodePreset,
    exportVideoCodecResolvedForPreview,
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
    exportHwaccelDecodeForPreview,
    exportExtraArgsParsed,
    exportAudioGainDb,
    exportStripMetadata,
    exportStripChapters,
    exportSubtitleMode,
    exportVideoDeinterlace,
    exportVideoDenoise,
    exportVideoDeband,
    exportVideoHisteq,
    lutCubePathForPreview,
    exportVideoSharpen,
    exportVideoEqPreset,
    exportVideoHue,
    exportVideoGrain,
    exportVideoVignette,
    exportVideoBlur,
    exportAudioNormalize,
    externalFilterForPreview,
    trimRange,
    probeInfo?.durationSec
  ])

  const exportPreviewCommand = exportPreview.command

  function exportPreviewHint(): string {
    if (!exportExtraArgsParsed.ok) {
      return uiTextVars('editorExportExtraArgsParseError', { detail: exportExtraArgsParsed.error })
    }
    if (!preview) {
      return uiText('editorExportPreviewHintNoSource')
    }
    if (
      (externalFilterForPreview.kind === 'avisynth' ||
        externalFilterForPreview.kind === 'vapoursynth') &&
      externalFilterForPreview.scriptAbsPath
    ) {
      return uiTextVars('editorExportPreviewHintExternalFilter', {
        kind: externalFilterForPreview.kind,
        path: externalFilterForPreview.scriptAbsPath
      })
    }
    if (exportPreview.pass1Command) {
      return uiText('editorExportPreviewHintTwoPass')
    }
    if (exportPreview.appliedTrim && trimRange !== null) {
      const span = Math.max(0, trimRange.outSec - trimRange.inSec)
      return uiTextVars('editorExportPreviewHintTrimAppliedTemplate', {
        in: trimRange.inSec.toFixed(2),
        t: span.toFixed(2)
      })
    }
    if (trimRange !== null && probeInfo?.durationSec) {
      return uiText('editorExportPreviewHintTrimFull')
    }
    return uiText('editorExportPreviewHintTrimWaiting')
  }

  return { exportPreview, exportPreviewCommand, exportPreviewHint }
}
