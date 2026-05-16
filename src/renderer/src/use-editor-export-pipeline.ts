import { useMemo } from 'react'
import type { MutableRefObject, RefObject } from 'react'

import {
  buildFfmpegExportPreviewCommand,
  type FfmpegExportPreviewInput
} from '../../shared/ffmpeg-export-argv'
import type {
  FfmpegExportContainerId,
  FfmpegExportVideoCodecId
} from '../../shared/ffmpeg-export-contract'
import { parseFfmpegExportExtraArgsLine } from '../../shared/ffmpeg-export-extra-args'
import type { RestoredSourceInfo } from '../../shared/preview-dialog-contract'
import type { MediaProbeSuccess } from '../../shared/ffprobe-contract'
import { getUiLocale, uiText, uiTextVars } from './locales/ui-text'

export type UseEditorExportPipelineDeps = {
  setStatusHint: (hint: string | null) => void
  preview: RestoredSourceInfo | null
  probeInfo: MediaProbeSuccess | null
  trimRange: { inSec: number; outSec: number } | null
  trimSnapshotRef: MutableRefObject<{
    path: string | null
    range: { inSec: number; outSec: number }
  } | null>
  videoRef: RefObject<HTMLVideoElement | null>
  exportBusy: boolean
  setExportBusy: (busy: boolean) => void
  exportCancelBusy: boolean
  setExportCancelBusy: (busy: boolean) => void
  batchExportBusy: boolean
  snapshotBusy: boolean
  setSnapshotBusy: (busy: boolean) => void
  refreshProcessingHistory: () => Promise<void>
  buildCurrentFfmpegExportOverrides: () => Record<string, unknown>
  exportContainer: FfmpegExportContainerId
  exportEncodePreset: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['encodePreset']
  exportVideoCodecResolvedForPreview: Exclude<
    FfmpegExportVideoCodecId,
    'hw_auto' | 'hw_auto_hevc'
  >
  exportCrf: number | null
  exportVideoBitrate: string | null
  exportAudioMode: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['audioMode']
  exportAudioBitrate: string
  exportFps: number | null
  exportScalePreset: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['scalePreset']
  exportVideoTransform: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoTransform']
  exportCropPreset: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['cropPreset']
  exportTwoPass: boolean
  exportEconomyMode: boolean
  exportHwaccelDecodeForPreview: string | null
  exportExtraArgsParsed: ReturnType<typeof parseFfmpegExportExtraArgsLine>
  exportAudioGainDb: number
  exportStripMetadata: boolean
  exportStripChapters: boolean
  exportSubtitleMode: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['subtitleMode']
  exportVideoDeinterlace: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoDeinterlace']
  exportVideoDenoise: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoDenoise']
  exportVideoDeband: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoDeband']
  exportVideoHisteq: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoHisteq']
  lutCubePathForPreview: string | null
  exportVideoSharpen: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoSharpen']
  exportVideoEqPreset: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoEqPreset']
  exportVideoHue: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoHue']
  exportVideoGrain: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoGrain']
  exportVideoVignette: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoVignette']
  exportVideoBlur: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['videoBlur']
  exportAudioNormalize: Parameters<typeof buildFfmpegExportPreviewCommand>[0]['audioNormalize']
  lastExportPath: string | null
  setLastExportPath: (path: string | null) => void
  lastSnapshotPath: string | null
  setLastSnapshotPath: (path: string | null) => void
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- flat pipeline API for App.tsx
export function useEditorExportPipeline(deps: UseEditorExportPipelineDeps) {
  const {
    setStatusHint,
    preview,
    probeInfo,
    trimRange,
    trimSnapshotRef,
    videoRef,
    exportBusy,
    setExportBusy,
    exportCancelBusy,
    setExportCancelBusy,
    batchExportBusy,
    snapshotBusy,
    setSnapshotBusy,
    refreshProcessingHistory,
    buildCurrentFfmpegExportOverrides,
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
    lastExportPath,
    setLastExportPath,
    lastSnapshotPath,
    setLastSnapshotPath
  } = deps

  async function handleSnapshot(): Promise<void> {
    if (!preview || exportBusy || snapshotBusy) {
      return
    }
    const el = videoRef.current
    const timeSec = el && Number.isFinite(el.currentTime) ? Math.max(0, el.currentTime) : 0
    setLastSnapshotPath(null)
    setSnapshotBusy(true)
    setStatusHint(uiText('statusSnapshotInProgress'))
    try {
      const res = await window.fluxalloy.preview.snapshotFrame({
        inputPath: preview.path,
        timeSec,
        uiLocale: getUiLocale()
      })
      void refreshProcessingHistory()
      if (res.ok) {
        const savedName = res.path.split(/[\\/]/).pop() || res.path
        setLastSnapshotPath(res.path)
        setStatusHint(uiTextVars('statusSnapshotSaved', { name: savedName }))
      } else if ('cancelled' in res && res.cancelled) {
        setStatusHint(null)
      } else if ('error' in res) {
        setStatusHint(uiTextVars('statusSnapshotFailedWithDetail', { detail: res.error }))
      } else {
        setStatusHint(uiText('statusSnapshotFailedGeneric'))
      }
    } catch (e) {
      setStatusHint(e instanceof Error ? e.message : uiText('statusSnapshotExceptionGeneric'))
    } finally {
      setSnapshotBusy(false)
    }
  }

  async function handleExport(): Promise<void> {
    if (!preview || exportBusy || batchExportBusy || snapshotBusy) {
      return
    }
    setExportBusy(true)
    setLastExportPath(null)
    setStatusHint(uiText('statusExportPreparing'))
    try {
      const trimSnap =
        trimSnapshotRef.current?.path === preview.path ? trimSnapshotRef.current.range : null
      const res = await window.fluxalloy.export.start({
        inputPath: preview.path,
        uiLocale: getUiLocale(),
        ...(trimSnap != null ? { trim: trimSnap } : {}),
        probeDurationSec: probeInfo?.durationSec ?? null,
        ...buildCurrentFfmpegExportOverrides()
      })
      void refreshProcessingHistory()
      if (res.ok) {
        const savedName = res.path.split(/[\\/]/).pop() || res.path
        setLastExportPath(res.path)
        setStatusHint(uiTextVars('statusExportSaved', { name: savedName }))
      } else if ('cancelled' in res && res.cancelled) {
        setStatusHint(uiText('statusExportCancelled'))
      } else if ('error' in res) {
        setStatusHint(uiTextVars('statusExportFailedWithDetail', { detail: res.error }))
      } else {
        setStatusHint(uiText('statusExportFailedGeneric'))
      }
    } catch (e) {
      setStatusHint(e instanceof Error ? e.message : uiText('statusExportExceptionGeneric'))
    } finally {
      setExportBusy(false)
      setExportCancelBusy(false)
    }
  }

  async function handleCancelExport(): Promise<void> {
    if (!exportBusy || exportCancelBusy) {
      return
    }
    setExportCancelBusy(true)
    setStatusHint(uiText('statusExportCancelling'))
    const res = await window.fluxalloy.export.cancel()
    if (!res.ok) {
      setExportCancelBusy(false)
      setStatusHint(uiTextVars('statusExportFailedWithDetail', { detail: res.error }))
    }
  }

  async function handleOpenLastExport(mode: 'file' | 'folder' | 'preview'): Promise<void> {
    if (!lastExportPath || exportBusy || snapshotBusy) {
      return
    }
    const res = await window.fluxalloy.export.openOutput(lastExportPath, mode)
    if (!res.ok) {
      setStatusHint(uiTextVars('statusExportFailedWithDetail', { detail: res.error }))
    } else if (mode === 'preview') {
      setStatusHint(uiText('statusExportOpenedInPreview'))
    }
  }

  async function handleCopyLastExportPath(): Promise<void> {
    if (!lastExportPath) {
      return
    }
    const res = await window.fluxalloy.clipboard.writeText(lastExportPath)
    setStatusHint(res.ok ? uiText('statusExportPathCopied') : uiText('statusExportPathCopyFailed'))
  }

  async function handleOpenLastSnapshot(mode: 'file' | 'folder'): Promise<void> {
    if (!lastSnapshotPath || exportBusy || snapshotBusy) {
      return
    }
    const res = await window.fluxalloy.export.openOutput(lastSnapshotPath, mode)
    if (!res.ok) {
      setStatusHint(uiTextVars('statusSnapshotFailedWithDetail', { detail: res.error }))
    }
  }

  async function handleCopyLastSnapshotPath(): Promise<void> {
    if (!lastSnapshotPath) {
      return
    }
    const res = await window.fluxalloy.clipboard.writeText(lastSnapshotPath)
    setStatusHint(
      res.ok ? uiText('statusSnapshotPathCopied') : uiText('statusSnapshotPathCopyFailed')
    )
  }

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

  async function handleCopyExportPreview(): Promise<void> {
    const text = exportPreview.pass1Command
      ? `${exportPreview.pass1Command}\n\n${exportPreviewCommand}`
      : exportPreviewCommand
    const r = await window.fluxalloy.clipboard.writeText(text)
    setStatusHint(
      r.ok ? uiText('statusFfmpegCommandCopied') : uiText('statusFfmpegCommandCopyFailed')
    )
  }

  return {
    handleSnapshot,
    handleExport,
    handleCancelExport,
    handleOpenLastExport,
    handleCopyLastExportPath,
    handleOpenLastSnapshot,
    handleCopyLastSnapshotPath,
    exportPreview,
    exportPreviewCommand,
    exportPreviewHint,
    handleCopyExportPreview
  }
}
