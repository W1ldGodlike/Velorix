import type { JSX } from 'react'
import { createPortal } from 'react-dom'
import {
  formatProbeChapterRowTsv,
  formatProbeTrackRowTsv,
  formatProbeBitrateLine
} from './media-probe-panel-helpers'
import { uiText } from '../locales/ui-text'
import type { UiTextKey } from '../locales/ui-text-strings'

import type { PreviewProbeBodyCtx } from './use-preview-probe-body'

function ProbeContextMenuItem({
  labelKey,
  onClick
}: {
  labelKey: UiTextKey
  onClick: () => void
}): JSX.Element {
  const label = uiText(labelKey)
  return (
    <button
      type="button"
      role="menuitem"
      className="app-probe-context-menu-item"
      aria-describedby="probePanelOverviewHint"
      title={label}
      aria-label={label}
      onClick={onClick}
    >
      {label}
    </button>
  )
}

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
              <ProbeContextMenuItem
                labelKey="probeCtxCopyRowTab"
                onClick={() => {
                  void copyProbeCellAndDismiss(formatProbeTrackRowTsv(probeTableMenu.row))
                }}
              />
              <ProbeContextMenuItem
                labelKey="probeCtxCopyCodec"
                onClick={() => {
                  void copyProbeCellAndDismiss(probeTableMenu.row.codec)
                }}
              />
              {probeTableMenu.row.pixelFormat ? (
                <ProbeContextMenuItem
                  labelKey="probeCtxCopyPixFmt"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.pixelFormat ?? '')
                  }}
                />
              ) : null}
              {probeTableMenu.row.sampleAspectRatio ? (
                <ProbeContextMenuItem
                  labelKey="probeCtxCopySar"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.sampleAspectRatio ?? '')
                  }}
                />
              ) : null}
              {probeTableMenu.row.displayAspectRatio ? (
                <ProbeContextMenuItem
                  labelKey="probeCtxCopyDar"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.displayAspectRatio ?? '')
                  }}
                />
              ) : null}
              {probeTableMenu.row.colorSpace ? (
                <ProbeContextMenuItem
                  labelKey="probeCtxCopyColorSpace"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.colorSpace ?? '')
                  }}
                />
              ) : null}
              {probeTableMenu.row.colorPrimaries ? (
                <ProbeContextMenuItem
                  labelKey="probeCtxCopyColorPrimaries"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.colorPrimaries ?? '')
                  }}
                />
              ) : null}
              {probeTableMenu.row.colorTransfer ? (
                <ProbeContextMenuItem
                  labelKey="probeCtxCopyColorTransfer"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.colorTransfer ?? '')
                  }}
                />
              ) : null}
              {probeTableMenu.row.colorRange ? (
                <ProbeContextMenuItem
                  labelKey="probeCtxCopyColorRange"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.colorRange ?? '')
                  }}
                />
              ) : null}
              {formatProbeBitrateLine(probeTableMenu.row.streamBitrateKbps) ? (
                <ProbeContextMenuItem
                  labelKey="probeCtxCopyBitrate"
                  onClick={() => {
                    void copyProbeCellAndDismiss(
                      formatProbeBitrateLine(probeTableMenu.row.streamBitrateKbps) ?? ''
                    )
                  }}
                />
              ) : null}
              {probeTableMenu.row.dispositionSummary.trim() !== '' ? (
                <ProbeContextMenuItem
                  labelKey="probeCtxCopyDisposition"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.dispositionSummary)
                  }}
                />
              ) : null}
              <ProbeContextMenuItem
                labelKey="probeCtxCopyDetail"
                onClick={() => {
                  void copyProbeCellAndDismiss(probeTableMenu.row.detail)
                }}
              />
              {probeTableMenu.row.language ? (
                <ProbeContextMenuItem
                  labelKey="probeCtxCopyLanguage"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.language ?? '')
                  }}
                />
              ) : null}
              {probeTableMenu.row.titleTag ? (
                <ProbeContextMenuItem
                  labelKey="probeCtxCopyTrackTitle"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.titleTag ?? '')
                  }}
                />
              ) : null}
            </>
          ) : (
            <>
              <ProbeContextMenuItem
                labelKey="probeCtxCopyRowTab"
                onClick={() => {
                  void copyProbeCellAndDismiss(formatProbeChapterRowTsv(probeTableMenu.row))
                }}
              />
              {probeTableMenu.row.title ? (
                <ProbeContextMenuItem
                  labelKey="probeCtxCopyChapterTitle"
                  onClick={() => {
                    void copyProbeCellAndDismiss(probeTableMenu.row.title ?? '')
                  }}
                />
              ) : null}
            </>
          )}
        </div>,
        document.body
      )
    : null
}
