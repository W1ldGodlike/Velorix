import { useCallback, useState } from 'react'
import type { JSX } from 'react'

import {
  buildEditorVideoSpritePayload,
  editorVideoSpriteScheduleErrorHint,
  runEditorVideoSprite
} from '../../editor-video-sprite-action'
import { useEditorExtractFramesInput } from '../../use-editor-extract-frames-input'
import { uiText } from '../../locales/ui-text'
import type { EditorFfmpegSettingsRailProps } from './editor-ffmpeg-settings-rail-props'

export function EditorVideoSpritePanel(props: EditorFfmpegSettingsRailProps): JSX.Element {
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

  const [columns, setColumns] = useState('4')
  const [rows, setRows] = useState('3')
  const [burnTimestamps, setBurnTimestamps] = useState(true)

  const chromeBusy =
    exportBusy || exportCancelBusy || batchExportBusy || snapshotBusy || extractFramesBusy
  const canRun = inputPath !== null && inputPath.length > 0 && !chromeBusy

  const handleGenerate = useCallback((): void => {
    if (!inputPath || extractFramesBusy) {
      return
    }
    const payload = buildEditorVideoSpritePayload({
      inputPath,
      durationSec,
      format: snapshotFormat,
      columnsText: columns,
      rowsText: rows,
      burnTimestamps
    })
    if (payload === null) {
      setStatusHint(editorVideoSpriteScheduleErrorHint('invalid_grid'))
      return
    }
    setExtractFramesBusy(true)
    setStatusHint(uiText('editorVideoSpriteStarting'))
    void runEditorVideoSprite({ payload, setStatusHint }).finally(() => {
      setExtractFramesBusy(false)
    })
  }, [
    columns,
    durationSec,
    extractFramesBusy,
    inputPath,
    rows,
    burnTimestamps,
    setExtractFramesBusy,
    setStatusHint,
    snapshotFormat
  ])

  return (
    <div
      className="app-settings-benchmark app-settings-video-sprite"
      role="group"
      aria-label={uiText('editorVideoSpriteGroupAria')}
      aria-describedby="ffmpegVideoSectionHint editor-ffmpeg-settings-hint"
      aria-busy={extractFramesBusy}
    >
      <p className="app-settings-section-hint">{uiText('editorVideoSpriteHint')}</p>
      <p className="app-modal-hint app-settings-extract-frames-source-path" title={inputPath ?? ''}>
        {inputDisplayName}
      </p>
      <div className="app-settings-grid app-settings-grid--tight">
        <label className="app-field" title={uiText('editorVideoSpriteColumnsTitle')}>
          <span className="app-field-label">{uiText('editorVideoSpriteColumnsLabel')}</span>
          <input
            className="app-control"
            type="number"
            min={1}
            max={20}
            step={1}
            value={columns}
            disabled={chromeBusy}
            onChange={(e) => {
              setColumns(e.target.value)
            }}
          />
        </label>
        <label className="app-field" title={uiText('editorVideoSpriteRowsTitle')}>
          <span className="app-field-label">{uiText('editorVideoSpriteRowsLabel')}</span>
          <input
            className="app-control"
            type="number"
            min={1}
            max={20}
            step={1}
            value={rows}
            disabled={chromeBusy}
            onChange={(e) => {
              setRows(e.target.value)
            }}
          />
        </label>
        <label
          className="app-field app-field-checkbox"
          title={uiText('editorVideoSpriteBurnTimestampsTitle')}
        >
          <input
            type="checkbox"
            checked={burnTimestamps}
            disabled={chromeBusy}
            onChange={(e) => {
              setBurnTimestamps(e.target.checked)
            }}
          />
          <span className="app-field-label">{uiText('editorVideoSpriteBurnTimestampsLabel')}</span>
        </label>
      </div>
      <div className="app-settings-benchmark-actions">
        <button
          type="button"
          className="app-btn app-btn-primary"
          disabled={!canRun}
          title={uiText('editorVideoSpriteRunTitle')}
          onClick={handleGenerate}
        >
          {extractFramesBusy ? uiText('editorVideoSpriteBusy') : uiText('editorVideoSpriteRun')}
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
      </div>
    </div>
  )
}
