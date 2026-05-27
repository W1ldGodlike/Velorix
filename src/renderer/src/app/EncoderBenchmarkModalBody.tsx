import { useState, type JSX } from 'react'

import type { FfmpegExportBenchmarkRow } from '../../../shared/ffmpeg-export-benchmark-contract'
import { VELORIX_NEON_REFERENCE_ENCODER_BENCHMARK_REL } from '../../../shared/velorix-neon-theme-tokens'

import { useAppShellStore } from '../stores/app-shell-store'
import { readEncodePresetForExport } from '../lib/read-encode-preset-for-export'

function formatRowCodec(row: FfmpegExportBenchmarkRow): string {
  return row.videoCodec
}

function formatRowFps(row: FfmpegExportBenchmarkRow): string {
  if (!row.ok || row.avgFps == null) {
    return '—'
  }
  return row.avgFps.toFixed(1)
}

function formatRowSize(row: FfmpegExportBenchmarkRow): string {
  if (!row.ok || row.outputBytes == null) {
    return '—'
  }
  const mb = row.outputBytes / (1024 * 1024)
  return `${mb.toFixed(1)} MB`
}

/** ref.24 — бенчмарк кодеров на открытом медиа (`export.runBenchmark`). */
export function EncoderBenchmarkModalBody(): JSX.Element {
  const mediaSource = useAppShellStore((s) => s.mediaSource)
  const mediaProbe = useAppShellStore((s) => s.mediaProbe)
  const [busy, setBusy] = useState(false)
  const [progressLine, setProgressLine] = useState<string | null>(null)
  const [rows, setRows] = useState<FfmpegExportBenchmarkRow[] | null>(null)
  const [recommended, setRecommended] = useState<string | null>(null)
  const [errorLine, setErrorLine] = useState<string | null>(null)

  async function handleRun(): Promise<void> {
    const run = window.velorix?.export?.runBenchmark
    if (run == null) {
      setErrorLine('export.runBenchmark недоступен')
      return
    }
    if (mediaSource == null) {
      setErrorLine('Откройте медиафайл на вкладке «Обработка».')
      return
    }
    setBusy(true)
    setErrorLine(null)
    setRows(null)
    setRecommended(null)
    setProgressLine('Подготовка…')

    const onProgress = window.velorix?.export?.onBenchmarkProgress
    const unsub =
      onProgress != null
        ? onProgress((payload) => {
            setProgressLine(
              `${String(payload.index + 1)}/${String(payload.total)} · ${payload.videoCodec} — ${payload.message}`
            )
          })
        : null

    const settings = (await window.velorix?.settings?.get?.()) ?? null
    const duration = mediaProbe?.durationSec
    const probeDurationSec =
      duration != null && Number.isFinite(duration) && duration > 0 ? duration : null
    const encodePreset = readEncodePresetForExport(settings?.ffmpegExportEncodePreset)

    const result = await run({
      inputPath: mediaSource.path,
      uiLocale: 'ru',
      probeDurationSec,
      ...(encodePreset != null ? { encodePreset } : {}),
      ...(settings?.ffmpegExportContainer != null
        ? { container: settings.ffmpegExportContainer }
        : {}),
      ...(settings?.ffmpegExportCrf != null ? { crf: settings.ffmpegExportCrf } : {})
    })

    unsub?.()
    setBusy(false)
    setProgressLine(null)

    if (!result.ok) {
      if ('cancelled' in result && result.cancelled) {
        setErrorLine('Отменено')
      } else {
        setErrorLine('error' in result ? result.error : 'Ошибка бенчмарка')
      }
      return
    }
    setRows(result.rows)
    setRecommended(result.recommendedCodec)
  }

  return (
    <div className="app-modal__body app-modal__body--stack">
      <p className="app-modal__hint">
        Источник: {mediaSource?.name ?? 'не выбран'}
        {recommended != null ? ` · рекомендуется ${recommended}` : ''}
      </p>
      {progressLine != null ? <p className="app-modal__status">{progressLine}</p> : null}
      {errorLine != null ? <p className="app-modal__body--error">{errorLine}</p> : null}
      <table className="app-modal__table vn-surface-glass">
        <thead>
          <tr>
            <th>Кодек</th>
            <th>FPS</th>
            <th>Размер</th>
          </tr>
        </thead>
        <tbody>
          {rows != null && rows.length > 0 ? (
            rows.map((row) => (
              <tr key={row.videoCodec}>
                <td>{formatRowCodec(row)}</td>
                <td>{formatRowFps(row)}</td>
                <td>{formatRowSize(row)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3}>Нажмите «Запустить» для прогона на коротком семпле.</td>
            </tr>
          )}
        </tbody>
      </table>
      <p className="app-modal__hint">Эталон: {VELORIX_NEON_REFERENCE_ENCODER_BENCHMARK_REL}</p>
      <button
        type="button"
        className="app-btn app-btn-primary app-modal__run-bench"
        disabled={busy}
        onClick={() => void handleRun()}
      >
        {busy ? 'Идёт прогон…' : 'Запустить'}
      </button>
    </div>
  )
}
