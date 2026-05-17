import type { JSX } from 'react'
import { createPortal } from 'react-dom'
import {
  formatProbeChapterRowTsv,
  formatProbeTrackRowTsv,
  formatProbeBitrateLine
} from './media-probe-panel-helpers'
import { uiText } from '../locales/ui-text'

import type { PreviewProbeBodyCtx } from './use-preview-probe-body'

export function PreviewProbeBodyContextMenu({
  ctx
}: {
  ctx: PreviewProbeBodyCtx
}): JSX.Element | null {
  const { probeTableMenu, probeTableMenuRef, copyProbeCellAndDismiss } = ctx

  return probeTableMenu
    ? createPortal(
        <div
          ref={probeTableMenuRef}
          role="menu"
          aria-label={uiText('probeContextMenuAria')}
          aria-describedby="probePanelOverviewHint"
          className="app-probe-context-menu"
          style={{ left: probeTableMenu.x, top: probeTableMenu.y }}
        >
          {probeTableMenu.variant === 'track' ? (
            <>
              <button
                type="button"
                role="menuitem"
                className="app-probe-context-menu-item"
                aria-describedby="probePanelOverviewHint"
                onClick={() => {
                  void copyProbeCellAndDismiss(formatProbeTrackRowTsv(probeTableMenu.row))
                }}
              >
                {uiText('probeCtxCopyRowTab')}
              </button>
              <button
                type="button"
                role="menuitem"
                className="app-probe-context-menu-item"
                aria-describedby="probePanelOverviewHint"
                onClick={() => {
                  void copyProbeCellAndDismiss(probeTableMenu.row.codec)
                }}
              >
                {uiText('probeCtxCopyCodec')}
              </button>
              {probeTableMenu.row.pixelFormat ? (
                <button
                  type="button"
                  role="menuitem"
                  className="app-probe-context-menu-item"
                  aria-describedby="probePanelOverviewHint"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.pixelFormat ?? '')
                  }}
                >
                  {uiText('probeCtxCopyPixFmt')}
                </button>
              ) : null}
              {probeTableMenu.row.sampleAspectRatio ? (
                <button
                  type="button"
                  role="menuitem"
                  className="app-probe-context-menu-item"
                  aria-describedby="probePanelOverviewHint"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.sampleAspectRatio ?? '')
                  }}
                >
                  {uiText('probeCtxCopySar')}
                </button>
              ) : null}
              {probeTableMenu.row.displayAspectRatio ? (
                <button
                  type="button"
                  role="menuitem"
                  className="app-probe-context-menu-item"
                  aria-describedby="probePanelOverviewHint"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.displayAspectRatio ?? '')
                  }}
                >
                  {uiText('probeCtxCopyDar')}
                </button>
              ) : null}
              {probeTableMenu.row.colorSpace ? (
                <button
                  type="button"
                  role="menuitem"
                  className="app-probe-context-menu-item"
                  aria-describedby="probePanelOverviewHint"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.colorSpace ?? '')
                  }}
                >
                  {uiText('probeCtxCopyColorSpace')}
                </button>
              ) : null}
              {probeTableMenu.row.colorPrimaries ? (
                <button
                  type="button"
                  role="menuitem"
                  className="app-probe-context-menu-item"
                  aria-describedby="probePanelOverviewHint"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.colorPrimaries ?? '')
                  }}
                >
                  {uiText('probeCtxCopyColorPrimaries')}
                </button>
              ) : null}
              {probeTableMenu.row.colorTransfer ? (
                <button
                  type="button"
                  role="menuitem"
                  className="app-probe-context-menu-item"
                  aria-describedby="probePanelOverviewHint"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.colorTransfer ?? '')
                  }}
                >
                  {uiText('probeCtxCopyColorTransfer')}
                </button>
              ) : null}
              {probeTableMenu.row.colorRange ? (
                <button
                  type="button"
                  role="menuitem"
                  className="app-probe-context-menu-item"
                  aria-describedby="probePanelOverviewHint"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.colorRange ?? '')
                  }}
                >
                  {uiText('probeCtxCopyColorRange')}
                </button>
              ) : null}
              {formatProbeBitrateLine(probeTableMenu.row.streamBitrateKbps) ? (
                <button
                  type="button"
                  role="menuitem"
                  className="app-probe-context-menu-item"
                  aria-describedby="probePanelOverviewHint"
                  onClick={() => {
                    void copyProbeCellAndDismiss(
                      formatProbeBitrateLine(probeTableMenu.row.streamBitrateKbps) ?? ''
                    )
                  }}
                >
                  {uiText('probeCtxCopyBitrate')}
                </button>
              ) : null}
              {probeTableMenu.row.dispositionSummary.trim() !== '' ? (
                <button
                  type="button"
                  role="menuitem"
                  className="app-probe-context-menu-item"
                  aria-describedby="probePanelOverviewHint"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.dispositionSummary)
                  }}
                >
                  {uiText('probeCtxCopyDisposition')}
                </button>
              ) : null}
              <button
                type="button"
                role="menuitem"
                className="app-probe-context-menu-item"
                aria-describedby="probePanelOverviewHint"
                onClick={() => {
                  void copyProbeCellAndDismiss(probeTableMenu.row.detail)
                }}
              >
                {uiText('probeCtxCopyDetail')}
              </button>
              {probeTableMenu.row.language ? (
                <button
                  type="button"
                  role="menuitem"
                  className="app-probe-context-menu-item"
                  aria-describedby="probePanelOverviewHint"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.language ?? '')
                  }}
                >
                  {uiText('probeCtxCopyLanguage')}
                </button>
              ) : null}
              {probeTableMenu.row.titleTag ? (
                <button
                  type="button"
                  role="menuitem"
                  className="app-probe-context-menu-item"
                  aria-describedby="probePanelOverviewHint"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.titleTag ?? '')
                  }}
                >
                  {uiText('probeCtxCopyTrackTitle')}
                </button>
              ) : null}
            </>
          ) : (
            <>
              <button
                type="button"
                role="menuitem"
                className="app-probe-context-menu-item"
                aria-describedby="probePanelOverviewHint"
                onClick={() => {
                  void copyProbeCellAndDismiss(formatProbeChapterRowTsv(probeTableMenu.row))
                }}
              >
                {uiText('probeCtxCopyRowTab')}
              </button>
              {probeTableMenu.row.title ? (
                <button
                  type="button"
                  role="menuitem"
                  className="app-probe-context-menu-item"
                  aria-describedby="probePanelOverviewHint"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.title ?? '')
                  }}
                >
                  {uiText('probeCtxCopyChapterTitle')}
                </button>
              ) : null}
            </>
          )}
        </div>,
        document.body
      )
    : null
}
