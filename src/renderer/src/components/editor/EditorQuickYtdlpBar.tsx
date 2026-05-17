import { useId } from 'react'
import type { Dispatch, JSX, SetStateAction } from 'react'

import {
  YTDLP_DOC_FORMAT_SELECTION,
  YTDLP_DOC_OUTPUT_TEMPLATE,
  YTDLP_DOC_README
} from '../../../../shared/external-doc-urls'
import { parseEditorUrlPasteBehavior } from '../../../../shared/editor-url-paste-behavior'
import type { EditorUrlPasteBehaviorId } from '../../../../shared/editor-url-paste-behavior'
import { IconDownload, IconQueuePlus } from '../LucideMiniIcons'
import { uiText } from '../../locales/ui-text'

export type EditorQuickYtdlpBarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  chromeBusy: boolean
  downloadsUrl: string
  setDownloadsUrl: Dispatch<SetStateAction<string>>
  editorUrlPasteBehavior: EditorUrlPasteBehaviorId
  setEditorUrlPasteBehavior: Dispatch<SetStateAction<EditorUrlPasteBehaviorId>>
  onEnqueueLines: () => void
  onDownloadFirstUrlOpenInEditor: () => void
}

export function EditorQuickYtdlpBar(props: EditorQuickYtdlpBarProps): JSX.Element {
  const {
    open,
    onOpenChange,
    chromeBusy,
    downloadsUrl,
    setDownloadsUrl,
    editorUrlPasteBehavior,
    setEditorUrlPasteBehavior,
    onEnqueueLines,
    onDownloadFirstUrlOpenInEditor
  } = props
  const quickYtdlpBarRegionBodyId = useId()

  return (
    <details
      className="app-url-bar"
      aria-label={uiText('quickYtdlpAria')}
      aria-describedby="quickYtdlpUrlHint"
      aria-busy={chromeBusy}
      open={open}
      onToggle={(e) => {
        onOpenChange(e.currentTarget.open)
      }}
    >
      <summary className="app-url-summary" aria-controls={quickYtdlpBarRegionBodyId}>
        {uiText('quickYtdlpSummary')}
      </summary>
      <div
        id={quickYtdlpBarRegionBodyId}
        className="app-url-body"
        role="region"
        aria-labelledby="quick-ytdlp-region-title"
        aria-busy={chromeBusy}
      >
        <h3 id="quick-ytdlp-region-title" className="app-visually-hidden">
          {uiText('quickYtdlpAria')}
        </h3>
        <div
          className="app-url-field"
          role="group"
          aria-label={uiText('quickYtdlpUrlFieldGroupAria')}
          aria-busy={chromeBusy}
        >
          <textarea
            className="app-downloads-url-input app-url-input"
            placeholder={uiText('quickYtdlpPlaceholder')}
            aria-labelledby="quick-ytdlp-region-title"
            aria-describedby="quickYtdlpUrlHint"
            value={downloadsUrl}
            rows={3}
            onChange={(e) => {
              setDownloadsUrl(e.target.value)
            }}
          />
          <p id="quickYtdlpUrlHint" className="app-url-hint">
            {uiText('quickYtdlpHint')}
          </p>
          <label className="app-field app-field-inline">
            <span>{uiText('editorUrlPasteBehaviorLabel')}</span>
            <select
              className="app-control"
              value={editorUrlPasteBehavior}
              aria-describedby="quickYtdlpUrlHint"
              onChange={(e) => {
                const v = parseEditorUrlPasteBehavior(e.target.value)
                setEditorUrlPasteBehavior(v)
                void window.fluxalloy.settings.setEditorUrlPasteBehavior(v).catch(console.error)
              }}
            >
              <option value="downloads_window">{uiText('editorUrlPasteBehaviorDownloads')}</option>
              <option value="download_open_editor">
                {uiText('editorUrlPasteBehaviorOpenEditor')}
              </option>
            </select>
          </label>
          <nav
            className="app-doc-inline-links app-url-bar-doc-links"
            aria-label={uiText('quickYtdlpDocNavAria')}
            aria-busy={chromeBusy}
          >
            <a href={YTDLP_DOC_README} target="_blank" rel="noreferrer">
              {uiText('docLinkYtDlpReadme')}
            </a>
            {' · '}
            <a href={YTDLP_DOC_FORMAT_SELECTION} target="_blank" rel="noreferrer">
              {uiText('quickYtdlpDocFormats')}
            </a>
            {' · '}
            <a href={YTDLP_DOC_OUTPUT_TEMPLATE} target="_blank" rel="noreferrer">
              {uiText('quickYtdlpDocOutputTemplate')}
            </a>
          </nav>
        </div>
        <div
          className="app-downloads-url-actions"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('quickYtdlpAria')}
          aria-busy={chromeBusy}
        >
          <button
            type="button"
            className="app-btn app-btn-primary app-btn-icon-leading"
            aria-describedby="quickYtdlpUrlHint"
            onClick={() => {
              onEnqueueLines()
            }}
          >
            <IconQueuePlus title="" size={17} />
            {uiText('quickYtdlpEnqueueLines')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-icon-leading"
            aria-describedby="quickYtdlpUrlHint"
            onClick={() => {
              onDownloadFirstUrlOpenInEditor()
            }}
          >
            <IconDownload title="" size={17} />
            {uiText('quickYtdlpDownloadOpenEditor')}
          </button>
        </div>
      </div>
    </details>
  )
}
