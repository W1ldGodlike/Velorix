import { useCallback, useState } from 'react'

import type { FfmpegFramesExtractModeId } from '../../../../shared/ffmpeg-frames-extract-contract'
import {
  buildEditorExtractFramesPayload,
  editorExtractFramesInvalidManualHint,
  runEditorExtractFrames
} from '../../editor-extract-frames-action'
import { useEditorExtractFramesInput } from '../../use-editor-extract-frames-input'
import { uiText, uiTextVars } from '../../locales/ui-text'
import type { EditorFfmpegSettingsRailProps } from './editor-ffmpeg-settings-rail-props'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- panel fragment
export function EditorExtractFramesPanel(props: EditorFfmpegSettingsRailProps) {
  const {
    previewMediaPath,
    previewProbeDurationSec,
    snapshotFormat,
    exportBusy,
    exportCancelBusy,
    batchExportBusy,
    snapshotBusy,
    extractFramesBusy,
    setExtractFramesBusy,
    setStatusHint
  } = props

  const {
    inputPath,
    durationSec,
    followPreview,
    pickVideoFile,
    usePreviewSource,
    inputDisplayName
  } = useEditorExtractFramesInput({
    previewMediaPath,
    previewProbeDurationSec,
    setStatusHint
  })

  const [mode, setMode] = useState<FfmpegFramesExtractModeId>('interval')
  const [intervalSec, setIntervalSec] = useState('2')
  const [frameCount, setFrameCount] = useState('12')
  const [manualTimesText, setManualTimesText] = useState('0, 5, 10')
  const [progressIndex, setProgressIndex] = useState(0)
  const [progressTotal, setProgressTotal] = useState(0)
  const [progressLabel, setProgressLabel] = useState<string | null>(null)

  const chromeBusy =
    exportBusy || exportCancelBusy || batchExportBusy || snapshotBusy || extractFramesBusy
  const canRun = inputPath !== null && inputPath.length > 0 && !chromeBusy
  const progressPct =
    progressTotal > 0 ? Math.min(100, Math.round((progressIndex / progressTotal) * 100)) : 0

  const handleExtract = useCallback((): void => {
    if (!inputPath || extractFramesBusy) {
      return
    }
    const payload = buildEditorExtractFramesPayload({
      inputPath,
      durationSec,
      format: snapshotFormat,
      ui: { mode, intervalSec, frameCount, manualTimesText }
    })
    if (payload === null) {
      setStatusHint(editorExtractFramesInvalidManualHint())
      return
    }
    setExtractFramesBusy(true)
    setProgressIndex(0)
    setProgressTotal(0)
    setProgressLabel(uiText('editorExtractFramesStarting'))
    void runEditorExtractFrames({
      payload,
      onProgress: (p) => {
        setProgressIndex(p.index)
        setProgressTotal(p.total)
        setProgressLabel(
          uiTextVars('editorExtractFramesProgress', {
            index: String(p.index),
            total: String(p.total),
            time: String(Math.round(p.timeSec * 10) / 10)
          })
        )
      },
      setStatusHint
    }).finally(() => {
      setExtractFramesBusy(false)
      setProgressLabel(null)
      setProgressIndex(0)
      setProgressTotal(0)
    })
  }, [
    durationSec,
    extractFramesBusy,
    frameCount,
    inputPath,
    intervalSec,
    manualTimesText,
    mode,
    setExtractFramesBusy,
    setStatusHint,
    snapshotFormat
  ])

  return (
    <div
      className="app-settings-benchmark app-settings-extract-frames"
      role="group"
      aria-label={uiText('editorExtractFramesGroupAria')}
      aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
      aria-busy={extractFramesBusy}
    >
      <p className="app-settings-section-hint">{uiText('editorExtractFramesHint')}</p>
      <div
        className="app-settings-extract-frames-source"
        role="group"
        aria-label={uiText('editorExtractFramesSourceAria')}
      >
        <span className="app-field-label">{uiText('editorExtractFramesSourceLabel')}</span>
        <p className="app-modal-hint app-settings-extract-frames-source-path" title={inputPath ?? ''}>
          {inputDisplayName}
        </p>
        <div
          className="app-settings-benchmark-actions app-settings-extract-frames-source-actions"
          role="toolbar"
          aria-label={uiText('editorExtractFramesSourceToolbarAria')}
        >
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={chromeBusy}
            title={uiText('editorExtractFramesPickVideoTitle')}
            onClick={() => {
              void pickVideoFile()
            }}
          >
            {uiText('editorExtractFramesPickVideo')}
          </button>
          {!followPreview && previewMediaPath ? (
            <button
              type="button"
              className="app-btn app-btn-compact"
              disabled={chromeBusy}
              title={uiText('editorExtractFramesUsePreviewTitle')}
              onClick={usePreviewSource}
            >
              {uiText('editorExtractFramesUsePreview')}
            </button>
          ) : null}
        </div>
      </div>
      <div className="app-settings-grid app-settings-grid--tight">
        <label className="app-field" title={uiText('editorExtractFramesModeTitle')}>
          <span className="app-field-label">{uiText('editorExtractFramesModeLabel')}</span>
          <select
            className="app-select"
            value={mode}
            disabled={chromeBusy}
            onChange={(e) => {
              setMode(e.target.value as FfmpegFramesExtractModeId)
            }}
          >
            <option value="interval">{uiText('editorExtractFramesModeInterval')}</option>
            <option value="count">{uiText('editorExtractFramesModeCount')}</option>
            <option value="manual">{uiText('editorExtractFramesModeManual')}</option>
          </select>
        </label>
        {mode === 'interval' ? (
          <label className="app-field" title={uiText('editorExtractFramesIntervalTitle')}>
            <span className="app-field-label">{uiText('editorExtractFramesIntervalLabel')}</span>
            <input
              className="app-input"
              type="number"
              min={0.25}
              step={0.25}
              value={intervalSec}
              disabled={chromeBusy}
              onChange={(e) => {
                setIntervalSec(e.target.value)
              }}
            />
          </label>
        ) : null}
        {mode === 'count' ? (
          <label className="app-field" title={uiText('editorExtractFramesCountTitle')}>
            <span className="app-field-label">{uiText('editorExtractFramesCountLabel')}</span>
            <input
              className="app-input"
              type="number"
              min={1}
              max={200}
              step={1}
              value={frameCount}
              disabled={chromeBusy}
              onChange={(e) => {
                setFrameCount(e.target.value)
              }}
            />
          </label>
        ) : null}
      </div>
      {mode === 'manual' ? (
        <label className="app-field app-field--full" title={uiText('editorExtractFramesManualTitle')}>
          <span className="app-field-label">{uiText('editorExtractFramesManualLabel')}</span>
          <textarea
            className="app-input app-input-multiline"
            rows={3}
            value={manualTimesText}
            disabled={chromeBusy}
            placeholder={uiText('editorExtractFramesManualPlaceholder')}
            onChange={(e) => {
              setManualTimesText(e.target.value)
            }}
          />
        </label>
      ) : null}
      <div
        className="app-settings-benchmark-actions"
        role="toolbar"
        aria-label={uiText('editorExtractFramesToolbarAria')}
      >
        <button
          type="button"
          className="app-btn app-btn-compact"
          disabled={!canRun}
          title={uiText('editorExtractFramesRunTitle')}
          onClick={handleExtract}
        >
          {extractFramesBusy ? uiText('editorExtractFramesBusy') : uiText('editorExtractFramesRun')}
        </button>
        {extractFramesBusy ? (
          <button
            type="button"
            className="app-btn app-btn-compact app-btn-danger"
            title={uiText('editorExtractFramesCancelTitle')}
            onClick={() => {
              void window.fluxalloy.export.cancel()
            }}
          >
            {uiText('topbarExportCancelReady')}
          </button>
        ) : null}
      </div>
      {extractFramesBusy && progressTotal > 0 ? (
        <div className="app-downloads-progress app-extract-frames-progress">
          <div className="app-downloads-progress-bar-row">
            <span
              className="app-downloads-progress-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={progressTotal}
              aria-valuenow={progressIndex}
              aria-label={uiText('editorExtractFramesProgressAria')}
            >
              <span
                className="app-downloads-progress-fill"
                style={{ width: `${progressPct}%` }}
              />
            </span>
            <span className="app-downloads-progress-pct">{progressPct}%</span>
          </div>
        </div>
      ) : null}
      {progressLabel ? (
        <p className="app-modal-hint" role="status" aria-live="polite">
          {progressLabel}
        </p>
      ) : null}
    </div>
  )
}