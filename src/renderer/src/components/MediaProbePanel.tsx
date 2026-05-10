import { useEffect, useRef, useState } from 'react'
import type { JSX } from 'react'
import { createPortal } from 'react-dom'

import type {
  MediaProbeChapterRow,
  MediaProbeSuccess,
  MediaProbeTrackRow
} from '../../../shared/ffprobe-contract'
import {
  defaultFfprobeJsonFileName,
  defaultFfprobeSummaryHtmlFileName,
  defaultFfprobeSummaryTxtFileName,
  formatProbeSummaryHtmlDocument,
  formatProbeSummaryPlainText
} from '../../../shared/ffprobe-summary-export'
import { formatProbeChapterTimecode } from '../../../shared/ffprobe-timecode'

type ProbeTableContextMenu =
  | null
  | { variant: 'track'; x: number; y: number; row: MediaProbeTrackRow }
  | { variant: 'chapter'; x: number; y: number; row: MediaProbeChapterRow }

function clampProbeTableMenuPosition(clientX: number, clientY: number): { x: number; y: number } {
  const margin = 8
  const estW = 260
  const estH = Math.min(420, Math.max(180, window.innerHeight - margin * 2))
  const x = Math.min(Math.max(margin, clientX), Math.max(margin, window.innerWidth - estW - margin))
  const y = Math.min(
    Math.max(margin, clientY),
    Math.max(margin, window.innerHeight - estH - margin)
  )
  return { x, y }
}

function keyboardProbeMenuPosition(el: HTMLElement): { x: number; y: number } {
  const rect = el.getBoundingClientRect()
  return clampProbeTableMenuPosition(rect.left + 24, rect.top + 24)
}

function formatProbeTrackRowTsv(row: MediaProbeTrackRow): string {
  const lang = row.language ?? ''
  const title = row.titleTag ?? ''
  const br = formatBitrateLine(row.streamBitrateKbps) ?? ''
  const disp = row.dispositionSummary.replace(/\t/g, ' ')
  const pix = (row.pixelFormat ?? '').replace(/\t/g, ' ')
  const sar = (row.sampleAspectRatio ?? '').replace(/\t/g, ' ')
  const dar = (row.displayAspectRatio ?? '').replace(/\t/g, ' ')
  const cs = (row.colorSpace ?? '').replace(/\t/g, ' ')
  const cprim = (row.colorPrimaries ?? '').replace(/\t/g, ' ')
  const ctr = (row.colorTransfer ?? '').replace(/\t/g, ' ')
  const crng = (row.colorRange ?? '').replace(/\t/g, ' ')
  return `${row.index}\t${trackKindRu(row.kind)}\t${row.codec}\t${pix}\t${sar}\t${dar}\t${cs}\t${cprim}\t${ctr}\t${crng}\t${br}\t${disp}\t${lang}\t${title}\t${row.detail}`
}

function formatProbeChapterRowTsv(ch: MediaProbeChapterRow): string {
  const dur = formatChapterDurationSec(ch.endSec, ch.startSec)
  const title = ch.title ?? ''
  return `${ch.index}\t${formatProbeChapterTimecode(ch.startSec)}\t${formatProbeChapterTimecode(ch.endSec)}\t${dur}\t${title}`
}

function formatChapterDurationSec(endSec: number, startSec: number): string {
  const dur = endSec - startSec
  return Number.isFinite(dur) && dur >= 0 ? `${dur.toFixed(2)} с` : '—'
}

function formatProbeDuration(sec: number | null): string {
  if (sec === null || !Number.isFinite(sec)) {
    return 'длительность ?'
  }
  if (sec < 60) {
    return `${sec.toFixed(1)} с`
  }
  const s = Math.floor(sec)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(r).padStart(2, '0')} · ${Math.round(sec)} с`
  }
  return `${m}:${String(r).padStart(2, '0')} · ${Math.round(sec)} с`
}

function formatBitrateLine(kbps: number | null): string | null {
  if (kbps === null || !Number.isFinite(kbps)) {
    return null
  }
  if (kbps >= 10_000) {
    return `${(kbps / 1000).toFixed(2)} Mb/s`
  }
  return `${Math.round(kbps)} kb/s`
}

function trackKindRu(kind: MediaProbeTrackRow['kind']): string {
  switch (kind) {
    case 'video':
      return 'Видео'
    case 'audio':
      return 'Аудио'
    case 'subtitle':
      return 'Субтитры'
    case 'attachment':
      return 'Вложение'
    case 'data':
      return 'Данные'
    default:
      return 'Прочее'
  }
}

function formatProbeJsonForDisplay(raw: string): string {
  try {
    return JSON.stringify(JSON.parse(raw) as unknown, null, 2)
  } catch {
    return raw
  }
}

/** Ключи `details` под превью; в главном окне мапятся на `MainWindowUiPanelState` через `App.tsx`. */
export type PreviewProbeSectionKey = 'exportSummary' | 'tracks' | 'chapters' | 'rawJson'

const PREVIEW_PROBE_SECTION_DEFAULTS: Record<PreviewProbeSectionKey, boolean> = {
  exportSummary: false,
  tracks: false,
  chapters: false,
  rawJson: false
}

/** Таблица дорожек, главы и JSON §9 — используется в превью и в отдельном окне инспектора. */
export function PreviewProbeBody({
  probeInfo,
  mediaPathForDefaultSave,
  probeSectionOpen,
  onProbeSectionToggle
}: {
  probeInfo: MediaProbeSuccess
  mediaPathForDefaultSave?: string
  probeSectionOpen?: Partial<Record<PreviewProbeSectionKey, boolean>>
  onProbeSectionToggle?: (key: PreviewProbeSectionKey, open: boolean) => void
}): JSX.Element {
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

  const [probeToolbarTip, setProbeToolbarTip] = useState<string | null>(null)
  const [probeTableMenu, setProbeTableMenu] = useState<ProbeTableContextMenu>(null)
  const probeTableMenuRef = useRef<HTMLDivElement | null>(null)
  const bitrateLabel = formatBitrateLine(probeInfo.bitrateKbps)
  const formatTooltip =
    probeInfo.formatLongName && probeInfo.formatName !== probeInfo.formatLongName
      ? probeInfo.formatLongName
      : undefined

  async function handleCopyProbeJson(): Promise<void> {
    const text = formatProbeJsonForDisplay(probeInfo.rawJson)
    const r = await window.fluxalloy.clipboard.writeText(text)
    setProbeToolbarTip(r.ok ? 'Скопировано в буфер' : 'Не удалось скопировать')
    window.setTimeout(() => {
      setProbeToolbarTip(null)
    }, 2200)
  }

  async function handleSaveProbeJson(): Promise<void> {
    const text = formatProbeJsonForDisplay(probeInfo.rawJson)
    const defaultFileName = defaultFfprobeJsonFileName(mediaPathForDefaultSave)
    const r = await window.fluxalloy.saveTextWithDialog({
      title: 'Сохранить JSON ffprobe',
      defaultFileName,
      content: text
    })
    if (r.ok) {
      setProbeToolbarTip(`Сохранено: ${r.path}`)
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
    const text = formatProbeSummaryPlainText(probeInfo)
    const r = await window.fluxalloy.saveTextWithDialog({
      title: 'Сохранить сводку ffprobe (TXT)',
      defaultFileName: defaultFfprobeSummaryTxtFileName(mediaPathForDefaultSave),
      content: text
    })
    if (r.ok) {
      setProbeToolbarTip(`Сохранено: ${r.path}`)
    } else if ('cancelled' in r && r.cancelled) {
      /* noop */
    } else if ('error' in r) {
      setProbeToolbarTip(r.error)
    }
    window.setTimeout(() => setProbeToolbarTip(null), 2800)
  }

  async function handleSaveSummaryHtml(): Promise<void> {
    const html = formatProbeSummaryHtmlDocument(probeInfo)
    const r = await window.fluxalloy.saveTextWithDialog({
      title: 'Сохранить сводку ffprobe (HTML)',
      defaultFileName: defaultFfprobeSummaryHtmlFileName(mediaPathForDefaultSave),
      content: html
    })
    if (r.ok) {
      setProbeToolbarTip(`Сохранено: ${r.path}`)
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
    setProbeToolbarTip(r.ok ? 'Скопировано в буфер' : 'Не удалось скопировать')
    setProbeTableMenu(null)
    window.setTimeout(() => setProbeToolbarTip(null), 2200)
  }

  return (
    <>
      <div
        className="app-preview-probe-stack"
        role="region"
        aria-label="Расширенная сводка ffprobe"
        aria-describedby="probePanelOverviewHint"
      >
        <p id="probePanelOverviewHint" className="app-visually-hidden">
          Раскрываемые блоки §9: экспорт текстовой/HTML сводки, таблицы дорожек и глав, сырой JSON
          ffprobe; в таблицах доступны контекстное меню и копирование ячеек.
        </p>
        <div className="app-preview-probe-summary-line">
          <span title={formatTooltip}>
            {formatProbeDuration(probeInfo.durationSec)}
            {probeInfo.video
              ? ` · ${probeInfo.video.width}×${probeInfo.video.height} · ${probeInfo.video.codec}`
              : ''}
            {probeInfo.audioCodec ? ` · аудио ${probeInfo.audioCodec}` : ''}
            {probeInfo.formatName ? ` · ${probeInfo.formatName}` : ''}
            {bitrateLabel ? ` · ${bitrateLabel}` : ''}
          </span>
        </div>
        {probeToolbarTip ? (
          <div className="app-probe-copy-tip app-probe-tip-global">{probeToolbarTip}</div>
        ) : null}
        <details
          className="app-probe-details"
          open={sectionOpen('exportSummary')}
          onToggle={(e) => {
            persistOrLocalSectionToggle('exportSummary', e.currentTarget.open)
          }}
        >
          <summary className="app-probe-summary">Экспорт сводки (TXT / HTML)</summary>
          <p id="probeExportSummaryHint" className="app-probe-toolbar-hint">
            Текст или HTML со сводкой ffprobe («человеческое» оглавление и ключевые поля дорожек).
          </p>
          <div className="app-probe-json-toolbar">
            <button
              type="button"
              className="app-btn app-btn-compact"
              aria-describedby="probeExportSummaryHint"
              onClick={() => {
                void handleSaveSummaryTxt()
              }}
            >
              Сохранить сводку TXT…
            </button>
            <button
              type="button"
              className="app-btn app-btn-compact"
              aria-describedby="probeExportSummaryHint"
              onClick={() => {
                void handleSaveSummaryHtml()
              }}
            >
              Сохранить сводку HTML…
            </button>
          </div>
        </details>
        {probeInfo.tracks.length > 0 ? (
          <details
            className="app-probe-details"
            open={sectionOpen('tracks')}
            onToggle={(e) => {
              persistOrLocalSectionToggle('tracks', e.currentTarget.open)
            }}
          >
            <summary className="app-probe-summary">Дорожки ({probeInfo.tracks.length})</summary>
            <div className="app-probe-table-wrap">
              <table className="app-probe-table">
                <caption className="app-visually-hidden">
                  Дорожки медиафайла по данным ffprobe
                </caption>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Тип</th>
                    <th scope="col">Кодек</th>
                    <th scope="col">Pix_fmt</th>
                    <th scope="col">SAR</th>
                    <th scope="col">DAR</th>
                    <th scope="col">Цв.простран.</th>
                    <th scope="col">Primaries</th>
                    <th scope="col">Transfer</th>
                    <th scope="col">Диапазон</th>
                    <th scope="col">Битрейт</th>
                    <th scope="col">Disposition</th>
                    <th scope="col">Язык</th>
                    <th scope="col">Заголовок</th>
                    <th scope="col">Сведения</th>
                  </tr>
                </thead>
                <tbody>
                  {probeInfo.tracks.map((row) => (
                    <tr
                      key={`track-${row.index}`}
                      tabIndex={0}
                      title="ПКМ, Enter или Shift+F10 — действия с дорожкой"
                      onContextMenu={(e) => {
                        e.preventDefault()
                        const p = clampProbeTableMenuPosition(e.clientX, e.clientY)
                        setProbeTableMenu({ variant: 'track', x: p.x, y: p.y, row })
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === 'Enter' ||
                          e.key === 'ContextMenu' ||
                          (e.shiftKey && e.key === 'F10')
                        ) {
                          e.preventDefault()
                          const p = keyboardProbeMenuPosition(e.currentTarget)
                          setProbeTableMenu({ variant: 'track', x: p.x, y: p.y, row })
                        }
                      }}
                    >
                      <td>{row.index}</td>
                      <td>{trackKindRu(row.kind)}</td>
                      <td className="app-probe-table-mono">{row.codec}</td>
                      <td className="app-probe-table-mono">{row.pixelFormat ?? '—'}</td>
                      <td className="app-probe-table-mono">{row.sampleAspectRatio ?? '—'}</td>
                      <td className="app-probe-table-mono">{row.displayAspectRatio ?? '—'}</td>
                      <td className="app-probe-table-mono">{row.colorSpace ?? '—'}</td>
                      <td className="app-probe-table-mono">{row.colorPrimaries ?? '—'}</td>
                      <td className="app-probe-table-mono">{row.colorTransfer ?? '—'}</td>
                      <td className="app-probe-table-mono">{row.colorRange ?? '—'}</td>
                      <td title={formatBitrateLine(row.streamBitrateKbps) ?? undefined}>
                        {formatBitrateLine(row.streamBitrateKbps) ?? '—'}
                      </td>
                      <td
                        title={
                          row.dispositionSummary.trim() !== '' ? row.dispositionSummary : undefined
                        }
                      >
                        {row.dispositionSummary.trim() !== '' ? row.dispositionSummary : '—'}
                      </td>
                      <td>{row.language ?? '—'}</td>
                      <td>{row.titleTag ?? '—'}</td>
                      <td>{row.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        ) : null}
        {probeInfo.chapters.length > 0 ? (
          <details
            className="app-probe-details"
            open={sectionOpen('chapters')}
            onToggle={(e) => {
              persistOrLocalSectionToggle('chapters', e.currentTarget.open)
            }}
          >
            <summary className="app-probe-summary">Главы ({probeInfo.chapters.length})</summary>
            <div className="app-probe-table-wrap">
              <table className="app-probe-table">
                <caption className="app-visually-hidden">
                  Главы медиафайла по данным ffprobe
                </caption>
                <thead>
                  <tr>
                    <th scope="col">id</th>
                    <th scope="col">Начало</th>
                    <th scope="col">Конец</th>
                    <th scope="col">Длительность</th>
                    <th scope="col">Заголовок</th>
                  </tr>
                </thead>
                <tbody>
                  {probeInfo.chapters.map((ch) => (
                    <tr
                      key={`chapter-${ch.index}-${ch.startSec}`}
                      tabIndex={0}
                      title="ПКМ, Enter или Shift+F10 — действия с главой"
                      onContextMenu={(e) => {
                        e.preventDefault()
                        const p = clampProbeTableMenuPosition(e.clientX, e.clientY)
                        setProbeTableMenu({ variant: 'chapter', x: p.x, y: p.y, row: ch })
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === 'Enter' ||
                          e.key === 'ContextMenu' ||
                          (e.shiftKey && e.key === 'F10')
                        ) {
                          e.preventDefault()
                          const p = keyboardProbeMenuPosition(e.currentTarget)
                          setProbeTableMenu({ variant: 'chapter', x: p.x, y: p.y, row: ch })
                        }
                      }}
                    >
                      <td>{ch.index}</td>
                      <td className="app-probe-table-mono">
                        {formatProbeChapterTimecode(ch.startSec)}
                      </td>
                      <td className="app-probe-table-mono">
                        {formatProbeChapterTimecode(ch.endSec)}
                      </td>
                      <td>{formatChapterDurationSec(ch.endSec, ch.startSec)}</td>
                      <td>{ch.title ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        ) : null}
        {probeInfo.rawJson.length > 0 ? (
          <details
            className="app-probe-details"
            open={sectionOpen('rawJson')}
            onToggle={(e) => {
              persistOrLocalSectionToggle('rawJson', e.currentTarget.open)
            }}
          >
            <summary className="app-probe-summary">JSON ffprobe</summary>
            <p id="probeRawJsonHint" className="app-probe-toolbar-hint">
              Вывод только для чтения; скопируйте или сохраните для поддержки или внешнего парсера.
            </p>
            <div className="app-probe-json-toolbar">
              <button
                type="button"
                className="app-btn app-btn-compact"
                aria-describedby="probeRawJsonHint"
                onClick={() => {
                  void handleCopyProbeJson()
                }}
              >
                Копировать JSON
              </button>
              <button
                type="button"
                className="app-btn app-btn-compact"
                aria-describedby="probeRawJsonHint"
                onClick={() => {
                  void handleSaveProbeJson()
                }}
              >
                Сохранить JSON…
              </button>
            </div>
            <pre
              className="app-probe-json-pre"
              aria-label="Сырой JSON ffprobe"
              aria-describedby="probeRawJsonHint"
            >
              {formatProbeJsonForDisplay(probeInfo.rawJson)}
            </pre>
          </details>
        ) : null}
      </div>
      {probeTableMenu
        ? createPortal(
            <div
              ref={probeTableMenuRef}
              role="group"
              aria-label="Действия со строкой ffprobe"
              className="app-probe-context-menu"
              style={{ left: probeTableMenu.x, top: probeTableMenu.y }}
            >
              {probeTableMenu.variant === 'track' ? (
                <>
                  <button
                    type="button"
                    className="app-probe-context-menu-item"
                    onClick={() => {
                      void copyProbeCellAndDismiss(formatProbeTrackRowTsv(probeTableMenu.row))
                    }}
                  >
                    Копировать строку (табуляция)
                  </button>
                  <button
                    type="button"
                    className="app-probe-context-menu-item"
                    onClick={() => {
                      void copyProbeCellAndDismiss(probeTableMenu.row.codec)
                    }}
                  >
                    Копировать кодек
                  </button>
                  {probeTableMenu.row.pixelFormat ? (
                    <button
                      type="button"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.pixelFormat ?? '')
                      }}
                    >
                      Копировать pix_fmt
                    </button>
                  ) : null}
                  {probeTableMenu.row.sampleAspectRatio ? (
                    <button
                      type="button"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.sampleAspectRatio ?? '')
                      }}
                    >
                      Копировать SAR
                    </button>
                  ) : null}
                  {probeTableMenu.row.displayAspectRatio ? (
                    <button
                      type="button"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.displayAspectRatio ?? '')
                      }}
                    >
                      Копировать DAR
                    </button>
                  ) : null}
                  {probeTableMenu.row.colorSpace ? (
                    <button
                      type="button"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.colorSpace ?? '')
                      }}
                    >
                      Копировать color_space
                    </button>
                  ) : null}
                  {probeTableMenu.row.colorPrimaries ? (
                    <button
                      type="button"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.colorPrimaries ?? '')
                      }}
                    >
                      Копировать color_primaries
                    </button>
                  ) : null}
                  {probeTableMenu.row.colorTransfer ? (
                    <button
                      type="button"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.colorTransfer ?? '')
                      }}
                    >
                      Копировать color_transfer
                    </button>
                  ) : null}
                  {probeTableMenu.row.colorRange ? (
                    <button
                      type="button"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.colorRange ?? '')
                      }}
                    >
                      Копировать color_range
                    </button>
                  ) : null}
                  {formatBitrateLine(probeTableMenu.row.streamBitrateKbps) ? (
                    <button
                      type="button"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(
                          formatBitrateLine(probeTableMenu.row.streamBitrateKbps) ?? ''
                        )
                      }}
                    >
                      Копировать битрейт
                    </button>
                  ) : null}
                  {probeTableMenu.row.dispositionSummary.trim() !== '' ? (
                    <button
                      type="button"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.dispositionSummary)
                      }}
                    >
                      Копировать disposition
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="app-probe-context-menu-item"
                    onClick={() => {
                      void copyProbeCellAndDismiss(probeTableMenu.row.detail)
                    }}
                  >
                    Копировать сведения
                  </button>
                  {probeTableMenu.row.language ? (
                    <button
                      type="button"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.language ?? '')
                      }}
                    >
                      Копировать язык
                    </button>
                  ) : null}
                  {probeTableMenu.row.titleTag ? (
                    <button
                      type="button"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.titleTag ?? '')
                      }}
                    >
                      Копировать заголовок дорожки
                    </button>
                  ) : null}
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="app-probe-context-menu-item"
                    onClick={() => {
                      void copyProbeCellAndDismiss(formatProbeChapterRowTsv(probeTableMenu.row))
                    }}
                  >
                    Копировать строку (табуляция)
                  </button>
                  {probeTableMenu.row.title ? (
                    <button
                      type="button"
                      className="app-probe-context-menu-item"
                      onClick={() => {
                        void copyProbeCellAndDismiss(probeTableMenu.row.title ?? '')
                      }}
                    >
                      Копировать заголовок
                    </button>
                  ) : null}
                </>
              )}
            </div>,
            document.body
          )
        : null}
    </>
  )
}
