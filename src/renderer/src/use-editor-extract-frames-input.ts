import { useCallback, useState } from 'react'

import type { AppUiLocale } from '../../shared/app-ui-locale'
import { getUiLocale, uiText } from './locales/ui-text'

export function useEditorExtractFramesInput(params: {
  previewMediaPath: string | null
  previewProbeDurationSec: number | null
  setStatusHint: (hint: string | null) => void
}): {
  inputPath: string | null
  durationSec: number
  followPreview: boolean
  pickVideoFile: () => Promise<void>
  usePreviewSource: () => void
  inputDisplayName: string
} {
  const { previewMediaPath, previewProbeDurationSec, setStatusHint } = params
  const [followPreview, setFollowPreview] = useState(true)
  const [pickedPath, setPickedPath] = useState<string | null>(null)
  const [pickedDurationSec, setPickedDurationSec] = useState(0)

  const inputPath = followPreview ? previewMediaPath : pickedPath
  const durationSec = followPreview ? (previewProbeDurationSec ?? 0) : pickedDurationSec

  const pickVideoFile = useCallback(async (): Promise<void> => {
    const result = await window.fluxalloy.preview.openFileDialog(getUiLocale() as AppUiLocale)
    if (!result.ok) {
      if ('error' in result && typeof result.error === 'string' && result.error.length > 0) {
        setStatusHint(result.error)
      }
      return
    }
    setFollowPreview(false)
    setPickedPath(result.path)
    setStatusHint(uiText('editorExtractFramesProbing'))
    const probe = await window.fluxalloy.preview.probe(result.path)
    if (!probe.ok) {
      setStatusHint(probe.error)
      return
    }
    setPickedDurationSec(probe.durationSec ?? 0)
    setStatusHint(null)
  }, [setStatusHint])

  const usePreviewSource = useCallback((): void => {
    setFollowPreview(true)
    setPickedPath(null)
    setPickedDurationSec(0)
  }, [])

  const inputDisplayName =
    inputPath !== null && inputPath.length > 0
      ? inputPath.replace(/^.*[/\\]/, '')
      : uiText('editorExtractFramesNoFile')

  return {
    inputPath,
    durationSec,
    followPreview,
    pickVideoFile,
    usePreviewSource,
    inputDisplayName
  }
}
