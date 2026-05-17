import { useEffect, useId, useRef, useState } from 'react'

import { formatFfprobeContainerDiagnosticsCompactLine } from '../../../shared/ffprobe-container-format'
import {
  defaultFfprobeJsonFileName,
  defaultFfprobeSummaryHtmlFileName,
  defaultFfprobeSummaryTxtFileName,
  formatProbeSummaryHtmlDocument,
  formatProbeSummaryPlainText
} from '../../../shared/ffprobe-summary-export'
import { getUiLocale, uiText, uiTextVars } from '../locales/ui-text'
import {
  formatProbeBitrateLine,
  formatProbeJsonForDisplay,
  PREVIEW_PROBE_SECTION_DEFAULTS,
  type PreviewProbeSectionKey,
  type ProbeTableContextMenu
} from './media-probe-panel-helpers'
import type { PreviewProbeBodyProps } from './preview-probe-body-props'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- ReturnType exported as PreviewProbeBodyCtx
export function usePreviewProbeBody({
  probeInfo,
  mediaPathForDefaultSave,
  probeSectionOpen,
  onProbeSectionToggle,
  probeRefreshing = false
}: PreviewProbeBodyProps) {
  const persistedProbeSections = typeof onProbeSectionToggle === 'function'
  const [localProbeSections, setLocalProbeSections] = useState(PREVIEW_PROBE_SECTION_DEFAULTS)

  function sectionOpen(key: PreviewProbeSectionKey): boolean {
    if (persistedProbeSections) {
      const v = probeSectionOpen?.[key]
      return typeof v === 'boolean' ? v : PREVIEW_PROBE_SECTION_DEFAULTS[key]
    }
    return localProbeSections[key]
  }

  function persistOrLocalSectionToggle(key: PreviewProbeSectionKey, open: boolean): void {
    if (persistedProbeSections && onProbeSectionToggle) {
      onProbeSectionToggle(key, open)
    } else {
      setLocalProbeSections((prev) => ({ ...prev, [key]: open }))
    }
  }

  const dash = uiText('uiPlaceholderDash')

  const probeExportSummaryRegionId = useId()
  const probeTracksRegionId = useId()
  const probeChaptersRegionId = useId()
  const probeRawJsonRegionId = useId()

  const [probeToolbarTip, setProbeToolbarTip] = useState<string | null>(null)
  const [probeTableMenu, setProbeTableMenu] = useState<ProbeTableContextMenu>(null)
  const probeTableMenuRef = useRef<HTMLDivElement | null>(null)
  const diagnosticsCompact = formatFfprobeContainerDiagnosticsCompactLine(probeInfo)
  const bitrateLabel =
    diagnosticsCompact?.includes('br ') === true
      ? null
      : formatProbeBitrateLine(probeInfo.bitrateKbps)
  const formatTooltip =
    probeInfo.formatLongName && probeInfo.formatName !== probeInfo.formatLongName
      ? probeInfo.formatLongName
      : undefined

  async function handleCopyProbeJson(): Promise<void> {
    const text = formatProbeJsonForDisplay(probeInfo.rawJson)
    const r = await window.fluxalloy.clipboard.writeText(text)
    setProbeToolbarTip(r.ok ? uiText('probeClipboardCopied') : uiText('probeClipboardCopyFailed'))
    window.setTimeout(() => {
      setProbeToolbarTip(null)
    }, 2200)
  }

  async function handleSaveProbeJson(): Promise<void> {
    const text = formatProbeJsonForDisplay(probeInfo.rawJson)
    const defaultFileName = defaultFfprobeJsonFileName(mediaPathForDefaultSave)
    const r = await window.fluxalloy.saveTextWithDialog({
      title: uiText('probeSaveJsonDialogTitle'),
      defaultFileName,
      content: text
    })
    if (r.ok) {
      setProbeToolbarTip(uiTextVars('probeSavedPathTemplate', { path: r.path }))
    } else if ('cancelled' in r && r.cancelled) {
      // пользователь закрыл диалог — без сообщения
    } else if ('error' in r) {
      setProbeToolbarTip(r.error)
    }
    window.setTimeout(() => {
      setProbeToolbarTip(null)
    }, 2800)
  }

  async function handleSaveSummaryTxt(): Promise<void> {
    const text = formatProbeSummaryPlainText(probeInfo, getUiLocale())
    const r = await window.fluxalloy.saveTextWithDialog({
      title: uiText('probeSaveSummaryTxtDialogTitle'),
      defaultFileName: defaultFfprobeSummaryTxtFileName(mediaPathForDefaultSave),
      content: text
    })
    if (r.ok) {
      setProbeToolbarTip(uiTextVars('probeSavedPathTemplate', { path: r.path }))
    } else if ('cancelled' in r && r.cancelled) {
      /* noop */
    } else if ('error' in r) {
      setProbeToolbarTip(r.error)
    }
    window.setTimeout(() => setProbeToolbarTip(null), 2800)
  }

  async function handleSaveSummaryHtml(): Promise<void> {
    const html = formatProbeSummaryHtmlDocument(probeInfo, getUiLocale())
    const r = await window.fluxalloy.saveTextWithDialog({
      title: uiText('probeSaveSummaryHtmlDialogTitle'),
      defaultFileName: defaultFfprobeSummaryHtmlFileName(mediaPathForDefaultSave),
      content: html
    })
    if (r.ok) {
      setProbeToolbarTip(uiTextVars('probeSavedPathTemplate', { path: r.path }))
    } else if ('cancelled' in r && r.cancelled) {
      /* noop */
    } else if ('error' in r) {
      setProbeToolbarTip(r.error)
    }
    window.setTimeout(() => setProbeToolbarTip(null), 2800)
  }

  useEffect(() => {
    if (!probeTableMenu) {
      return
    }
    const close = (): void => setProbeTableMenu(null)
    window.setTimeout(() => {
      const first = probeTableMenuRef.current?.querySelector<HTMLButtonElement>('button')
      first?.focus()
    }, 0)
    const onPointerDown = (ev: PointerEvent): void => {
      const root = probeTableMenuRef.current
      if (root && ev.target instanceof Node && root.contains(ev.target)) {
        return
      }
      close()
    }
    const onKey = (ev: KeyboardEvent): void => {
      if (ev.key === 'Escape') {
        close()
      }
    }
    window.addEventListener('pointerdown', onPointerDown, true)
    window.addEventListener('keydown', onKey, true)
    return (): void => {
      window.removeEventListener('pointerdown', onPointerDown, true)
      window.removeEventListener('keydown', onKey, true)
    }
  }, [probeTableMenu])

  async function copyProbeCellAndDismiss(text: string): Promise<void> {
    const r = await window.fluxalloy.clipboard.writeText(text)
    setProbeToolbarTip(r.ok ? uiText('probeClipboardCopied') : uiText('probeClipboardCopyFailed'))
    setProbeTableMenu(null)
    window.setTimeout(() => setProbeToolbarTip(null), 2200)
  }
  return {
    probeInfo,
    probeRefreshing,
    sectionOpen,
    persistOrLocalSectionToggle,
    dash,
    probeExportSummaryRegionId,
    probeTracksRegionId,
    probeChaptersRegionId,
    probeRawJsonRegionId,
    probeToolbarTip,
    probeTableMenu,
    setProbeTableMenu,
    probeTableMenuRef,
    diagnosticsCompact,
    bitrateLabel,
    formatTooltip,
    handleCopyProbeJson,
    handleSaveProbeJson,
    handleSaveSummaryTxt,
    handleSaveSummaryHtml,
    copyProbeCellAndDismiss
  }
}

export type PreviewProbeBodyCtx = ReturnType<typeof usePreviewProbeBody>
