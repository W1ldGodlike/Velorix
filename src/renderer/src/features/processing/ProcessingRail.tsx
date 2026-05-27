import { useState, type JSX } from 'react'

import type { FfmpegExportEncodePresetId } from '../../../../shared/ffmpeg-export-contract'

import { startPreviewMediaExport } from '../../lib/start-preview-media-export'
import { useAppShellStore } from '../../stores/app-shell-store'
import { useExportProgressNote } from './use-export-progress-note'
import { useFfmpegExportSettings } from './use-ffmpeg-export-settings'

export function ProcessingRail(): JSX.Element {
  const openModal = useAppShellStore((s) => s.openModal)
  const mediaSource = useAppShellStore((s) => s.mediaSource)
  const mediaProbe = useAppShellStore((s) => s.mediaProbe)
  const exportTrim = useAppShellStore((s) => s.exportTrim)
  const [exportBusy, setExportBusy] = useState(false)
  const [exportNote, setExportNote] = useState<string | null>(null)
  const [lastExportPath, setLastExportPath] = useState<string | null>(null)
  const exportProgressNote = useExportProgressNote(exportBusy)
  const { view, reload, setCrf, setVideoCodec, setContainer, setEncodePreset, setAudioMode } =
    useFfmpegExportSettings()
  const setExportPresetDraftLabel = useAppShellStore((s) => s.setExportPresetDraftLabel)
  const userPresets = view?.ffmpegExportUserPresets ?? []

  const displayExportNote = exportBusy ? (exportProgressNote ?? 'Экспорт…') : exportNote

  const codec = view?.ffmpegExportVideoCodec ?? 'libx264'
  const container = view?.ffmpegExportContainer ?? 'mp4'
  const crf = view?.ffmpegExportCrf ?? 18
  const encodePreset: FfmpegExportEncodePresetId =
    view?.ffmpegExportEncodePreset === 'smaller' || view?.ffmpegExportEncodePreset === 'quality'
      ? view.ffmpegExportEncodePreset
      : 'balance'
  const audioMode = view?.ffmpegExportAudioMode ?? 'aac'

  return (
    <aside className="processing-rail vn-surface-glass">
      <h2 className="processing-rail__title">Настройки FFmpeg</h2>
      <details className="processing-rail__section" open>
        <summary>Видео</summary>
        <div className="processing-rail__section-body">
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">Кодек</span>
            <select
              className="app-settings-select"
              value={codec}
              onChange={(e) => void setVideoCodec(e.target.value as typeof codec)}
            >
              <option value="libx264">H.264 (libx264)</option>
              <option value="libx265">H.265 (libx265)</option>
              <option value="hw_auto">HW auto</option>
              <option value="hw_auto_hevc">HW HEVC</option>
            </select>
          </label>
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">CRF</span>
            <input
              type="number"
              className="app-input"
              value={crf}
              min={0}
              max={51}
              onChange={(e) => {
                const next = Number(e.target.value)
                if (!Number.isNaN(next)) {
                  void setCrf(next)
                }
              }}
            />
          </label>
        </div>
      </details>
      <details className="processing-rail__section">
        <summary>Аудио</summary>
        <div className="processing-rail__section-body">
          <select
            className="app-settings-select"
            value={audioMode}
            onChange={(e) => void setAudioMode(e.target.value as typeof audioMode)}
          >
            <option value="aac">AAC</option>
            <option value="libopus">Opus</option>
            <option value="copy">Copy</option>
            <option value="none">Без аудио</option>
          </select>
        </div>
      </details>
      <details className="processing-rail__section">
        <summary>Формат</summary>
        <div className="processing-rail__section-body">
          <select
            className="app-settings-select"
            value={container}
            onChange={(e) => void setContainer(e.target.value as typeof container)}
          >
            <option value="mp4">MP4</option>
            <option value="mkv">MKV</option>
            <option value="mov">MOV</option>
          </select>
        </div>
      </details>
      <details className="processing-rail__section">
        <summary>Пресеты</summary>
        <div className="processing-rail__section-body">
          {userPresets.length > 0 ? (
            <label className="app-ui-showcase-field">
              <span className="app-ui-showcase-field-label">Платформы / свои</span>
              <select
                className="app-settings-select"
                defaultValue=""
                onChange={(e) => {
                  const id = e.target.value
                  if (id.length === 0) {
                    return
                  }
                  const preset = userPresets.find((row) => row.id === id)
                  const apply = window.velorix?.settings?.applyFfmpegExportSnapshot
                  if (preset == null || apply == null) {
                    return
                  }
                  void apply(preset.snapshot).then(() => reload())
                  e.target.value = ''
                }}
              >
                <option value="">Применить пресет…</option>
                {userPresets.map((preset) => (
                  <option key={preset.id} value={preset.id}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">Качество кодирования</span>
            <select
              className="app-settings-select"
              value={encodePreset}
              onChange={(e) => {
                const next = e.target.value
                if (next === 'balance' || next === 'smaller' || next === 'quality') {
                  void setEncodePreset(next)
                }
              }}
            >
              <option value="balance">Баланс</option>
              <option value="smaller">Меньший размер</option>
              <option value="quality">Качество</option>
            </select>
          </label>
        </div>
      </details>
      <button
        type="button"
        className="app-btn app-btn-primary processing-rail__export"
        disabled={exportBusy || mediaSource == null}
        onClick={() => {
          if (mediaSource == null) {
            setExportNote('Сначала откройте медиа в превью')
            return
          }
          setExportBusy(true)
          setExportNote(null)
          void startPreviewMediaExport({
            inputPath: mediaSource.path,
            mediaProbe,
            exportTrim,
            settings: view
          }).then((result) => {
            if (result?.ok) {
              setLastExportPath(result.path)
              setExportNote(`Готово: ${result.path}`)
            } else if (result != null && !result.ok && 'error' in result) {
              setExportNote(result.error)
            }
            setExportBusy(false)
          })
        }}
      >
        {exportBusy ? 'Экспорт…' : 'Начать экспорт'}
      </button>
      <button
        type="button"
        className="app-btn app-btn-secondary"
        disabled={!exportBusy}
        onClick={() => {
          void window.velorix?.export?.cancel?.().then(() => {
            setExportBusy(false)
            setExportNote('Экспорт отменён')
          })
        }}
      >
        Отменить экспорт
      </button>
      <div className="processing-rail__output-actions">
        <button
          type="button"
          className="app-btn app-btn-secondary"
          disabled={lastExportPath == null}
          onClick={() => {
            const path = lastExportPath
            const open = window.velorix?.export?.openOutput
            if (path == null || open == null) {
              return
            }
            void open(path, 'file').then((result) => {
              if (!result.ok) {
                setExportNote(result.error)
              }
            })
          }}
        >
          Открыть файл
        </button>
        <button
          type="button"
          className="app-btn app-btn-secondary"
          disabled={lastExportPath == null}
          onClick={() => {
            const path = lastExportPath
            const open = window.velorix?.export?.openOutput
            if (path == null || open == null) {
              return
            }
            void open(path, 'folder').then((result) => {
              if (!result.ok) {
                setExportNote(result.error)
              }
            })
          }}
        >
          Показать в папке
        </button>
      </div>
      <button
        type="button"
        className="app-btn app-btn-secondary"
        onClick={() => {
          setExportPresetDraftLabel('Мой пресет')
          openModal('export-preset-name')
        }}
      >
        Имя пресета
      </button>
      {exportTrim != null ? (
        <p className="processing-rail__trim-hint">
          Экспорт: {exportTrim.inSec.toFixed(1)}–{exportTrim.outSec.toFixed(1)} с
        </p>
      ) : null}
      {displayExportNote != null ? (
        <p className="processing-rail__export-note">{displayExportNote}</p>
      ) : null}
      <p className="processing-rail__footer">
        {view == null ? 'Загрузка настроек…' : `Кодек: ${codec} · ${container.toUpperCase()}`}
      </p>
    </aside>
  )
}
