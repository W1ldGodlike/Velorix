import {
  useCallback,
  useRef,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction
} from 'react'

import type { WorkspaceTab } from './app-terminal-hint-ui'
import {
  clipboardLooksLikeDownloadsPayload,
  previewVideoMediaErrorDetailLabel
} from './app-shell-ui-helpers'
import { getUiLocale, uiText, uiTextVars } from './locales/ui-text'
import type { EditorUrlPasteBehaviorId } from '../../shared/editor-url-paste-behavior'
import type { MediaProbeSuccess } from '../../shared/ffprobe-contract'
import type { RestoredSourceInfo } from '../../shared/preview-dialog-contract'
import type { MainWindowUiPanelKey } from './stores/panels-store'
import { useAppShellStore } from './stores/app-shell-store'

type PreviewOpenedPayload = RestoredSourceInfo

export type UseAppPreviewWorkspaceDeps = {
  preview: PreviewOpenedPayload | null
  setPreview: Dispatch<SetStateAction<PreviewOpenedPayload | null>>
  previewBlobUrl: string | null
  setPreviewBlobUrl: Dispatch<SetStateAction<string | null>>
  setProbeInfo: Dispatch<SetStateAction<MediaProbeSuccess | null>>
  setProbeError: Dispatch<SetStateAction<string | null>>
  setStatusHint: Dispatch<SetStateAction<string | null>>
  setWorkspaceTab: Dispatch<SetStateAction<WorkspaceTab>>
  persistMainWindowUiPanelToggle: (key: MainWindowUiPanelKey, open: boolean) => void
  editorUrlPasteBehavior: EditorUrlPasteBehaviorId
  setDownloadsUrl: Dispatch<SetStateAction<string>>
}

export function useAppPreviewWorkspace(deps: UseAppPreviewWorkspaceDeps): {
  trimSnapshotRef: MutableRefObject<{
    path: string | null
    range: { inSec: number; outSec: number }
  } | null>
  trimRange: { inSec: number; outSec: number } | null
  currentSourcePath: string | null
  previewPlaybackUrl: string | null
  applyPreview: (payload: PreviewOpenedPayload) => void
  handlePreviewVideoError: (video: HTMLVideoElement) => void
  handlePreviewVideoLoaded: (video: HTMLVideoElement) => void
  onTrimRangeSnapshot: (range: { inSec: number; outSec: number }) => void
  jumpToTrimExport: () => void
  handlePreviewDrop: (files: FileList | null, dataTransfer?: DataTransfer | null) => Promise<void>
} {
  const {
    preview,
    setPreview,
    previewBlobUrl,
    setPreviewBlobUrl,
    setProbeInfo,
    setProbeError,
    setStatusHint,
    setWorkspaceTab,
    persistMainWindowUiPanelToggle,
    editorUrlPasteBehavior,
    setDownloadsUrl
  } = deps

  const previewTrimPath = useAppShellStore((s) => s.previewTrimPath)
  const previewTrimRange = useAppShellStore((s) => s.previewTrimRange)
  const setPreviewTrimSnapshot = useAppShellStore((s) => s.setPreviewTrimSnapshot)

  const trimSnapshotRef = useRef<{
    path: string | null
    range: { inSec: number; outSec: number }
  } | null>(null)

  const currentSourcePath = preview?.path ?? null
  const previewPlaybackUrl = previewBlobUrl ?? preview?.mediaUrl ?? null
  const trimRange =
    previewTrimPath === currentSourcePath && previewTrimRange !== null ? previewTrimRange : null

  const applyPreview = useCallback(
    (payload: PreviewOpenedPayload): void => {
      setProbeInfo(null)
      setProbeError(null)
      setStatusHint(null)
      setPreview(payload)
      setWorkspaceTab('processing')
    },
    [setPreview, setProbeError, setProbeInfo, setStatusHint, setWorkspaceTab]
  )

  const handlePreviewVideoError = useCallback(
    (video: HTMLVideoElement): void => {
      if (!preview) {
        return
      }
      const mediaError = video.error
      const code = mediaError?.code ?? 0
      const detail = previewVideoMediaErrorDetailLabel(code)
      window.velorix.log.send({
        level: 'error',
        scope: 'preview/video',
        message: `video element error code=${code} detail=${detail} path=${preview.path} mediaUrl=${preview.mediaUrl} playbackUrl=${previewBlobUrl ?? preview.mediaUrl}`
      })
      if (previewBlobUrl) {
        setStatusHint(uiTextVars('statusVideoPlayFailed', { detail }))
        return
      }

      setStatusHint(uiText('statusVideoDirectOpenFailedBlobTrying'))
      void fetch(preview.mediaUrl)
        .then(async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
          }
          const blob = await response.blob()
          const blobUrl = URL.createObjectURL(blob)
          setPreviewBlobUrl((current) => {
            if (current) {
              URL.revokeObjectURL(current)
            }
            return blobUrl
          })
          setStatusHint(uiText('statusVideoBlobFallbackActive'))
          window.velorix.log.send({
            level: 'info',
            scope: 'preview/video',
            message: `blob fallback ready size=${blob.size} type=${blob.type || 'unknown'} path=${preview.path}`
          })
        })
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : String(error)
          setStatusHint(uiTextVars('statusVideoPlayFailedAfterFallback', { detail }))
          window.velorix.log.send({
            level: 'error',
            scope: 'preview/video',
            message: `blob fallback failed error=${message} path=${preview.path} mediaUrl=${preview.mediaUrl}`
          })
        })
    },
    [preview, previewBlobUrl, setPreviewBlobUrl, setStatusHint]
  )

  const handlePreviewVideoLoaded = useCallback(
    (video: HTMLVideoElement): void => {
      if (!preview) {
        return
      }
      window.velorix.log.send({
        level: 'info',
        scope: 'preview/video',
        message: `video metadata loaded duration=${video.duration || 0} size=${video.videoWidth}x${video.videoHeight} path=${preview.path} playbackUrl=${previewBlobUrl ?? preview.mediaUrl}`
      })
    },
    [preview, previewBlobUrl]
  )

  const onTrimRangeSnapshot = useCallback(
    (range: { inSec: number; outSec: number }) => {
      trimSnapshotRef.current = { path: currentSourcePath, range }
      if (
        previewTrimPath === currentSourcePath &&
        previewTrimRange !== null &&
        Math.abs(previewTrimRange.inSec - range.inSec) < 1e-3 &&
        Math.abs(previewTrimRange.outSec - range.outSec) < 1e-3
      ) {
        return
      }
      setPreviewTrimSnapshot(currentSourcePath, range)
    },
    [currentSourcePath, previewTrimPath, previewTrimRange, setPreviewTrimSnapshot]
  )

  const jumpToTrimExport = useCallback((): void => {
    persistMainWindowUiPanelToggle('ffmpegSettingsRailOpen', true)
    persistMainWindowUiPanelToggle('ffmpegOutput', true)
    persistMainWindowUiPanelToggle('exportCommandPreview', true)
    const scroll = (): void => {
      document.getElementById('editor-ffmpeg-export-output')?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scroll()
        window.setTimeout(scroll, 160)
      })
    })
  }, [persistMainWindowUiPanelToggle])

  const handlePreviewDrop = useCallback(
    async (files: FileList | null, dataTransfer?: DataTransfer | null): Promise<void> => {
      const file = files?.[0]
      if (!file) {
        const urlText = dataTransfer?.getData('text/plain')?.trim() ?? ''
        if (clipboardLooksLikeDownloadsPayload(urlText)) {
          if (editorUrlPasteBehavior === 'download_open_editor') {
            setDownloadsUrl(urlText)
            setStatusHint(uiText('statusDownloadOpenEditorWorking'))
            const res = await window.velorix.downloads.downloadFirstUrlOpenInMainEditor(urlText)
            if (!res.ok) {
              setStatusHint(res.error)
              return
            }
            setDownloadsUrl('')
            setStatusHint(uiText('statusDownloadOpenEditorSuccess'))
          } else {
            void window.velorix.downloads.openWindow({ text: urlText, uiLocale: getUiLocale() })
          }
        }
        return
      }
      const absolutePath = window.velorix.preview.getPathForFile(file)
      const granted = await window.velorix.preview.grantPath(absolutePath)
      if (!granted.ok) {
        setStatusHint(uiTextVars('statusDndGrantFailed', { error: granted.error }))
        return
      }
      applyPreview(granted)
    },
    [applyPreview, editorUrlPasteBehavior, setDownloadsUrl, setStatusHint]
  )

  return {
    trimSnapshotRef,
    trimRange,
    currentSourcePath,
    previewPlaybackUrl,
    applyPreview,
    handlePreviewVideoError,
    handlePreviewVideoLoaded,
    onTrimRangeSnapshot,
    jumpToTrimExport,
    handlePreviewDrop
  }
}
