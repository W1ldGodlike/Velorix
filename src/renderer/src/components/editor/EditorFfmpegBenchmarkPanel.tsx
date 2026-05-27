import { useCallback, useEffect, useState } from 'react'
import type { JSX } from 'react'

import type { FfmpegExportBenchmarkResult } from '../../../../shared/ffmpeg-export-benchmark-contract'
import { FFMPEG_EXPORT_BENCHMARK_SAMPLE_SEC } from '../../../../shared/ffmpeg-export-benchmark-contract'
import {
  FFMPEG_EXPORT_BENCHMARK_LOAD_THRESHOLD_MAX,
  FFMPEG_EXPORT_BENCHMARK_LOAD_THRESHOLD_MIN
} from '../../../../shared/ffmpeg-export-benchmark-load-threshold'
import type { FfmpegExportVideoCodecId } from '../../../../shared/ffmpeg-export-contract'
import {
  formatFfmpegBenchmarkBytes,
  formatFfmpegBenchmarkEtaMmSs
} from '../../../../shared/ffmpeg-export-benchmark-metrics'
import { getUiLocale, uiText, uiTextVars } from '../../locales/ui-text'
import type { EditorFfmpegSettingsRailProps } from './editor-ffmpeg-settings-rail-props'
import { useAppShellStore } from '../../stores/app-shell-store'

export type EditorFfmpegBenchmarkPanelProps = Pick<
  EditorFfmpegSettingsRailProps,
  | 'previewMediaPath'
  | 'previewProbeDurationSec'
  | 'buildCurrentFfmpegExportOverrides'
  | 'exportBusy'
  | 'exportCancelBusy'
  | 'batchExportBusy'
  | 'snapshotBusy'
  | 'ffmpegExportSelectOptions'
  | 'exportVideoCodec'
  | 'setExportVideoCodec'
  | 'bumpManualExportEdit'
  | 'setStatusHint'
  | 'exportBenchmarkLoadThreshold'
  | 'setExportBenchmarkLoadThreshold'
> & {
  describedById?: string
}

function codecLabel(
  codec: FfmpegExportVideoCodecId,
  options: EditorFfmpegSettingsRailProps['ffmpegExportSelectOptions']
): string {
  return options.videoCodecs.find((p) => p.id === codec)?.label ?? codec
}

export function EditorFfmpegBenchmarkPanel(props: EditorFfmpegBenchmarkPanelProps): JSX.Element {
  const {
    previewMediaPath,
    previewProbeDurationSec,
    buildCurrentFfmpegExportOverrides,
    exportBusy,
    exportCancelBusy,
    batchExportBusy,
    snapshotBusy,
    ffmpegExportSelectOptions,
    exportVideoCodec,
    setExportVideoCodec,
    bumpManualExportEdit,
    setStatusHint,
    exportBenchmarkLoadThreshold,
    setExportBenchmarkLoadThreshold,
    describedById = 'ffmpegVideoSectionHint editor-ffmpeg-settings-hint'
  } = props

  const [benchmarkBusy, setBenchmarkBusy] = useState(false)
  const [progressLabel, setProgressLabel] = useState<string | null>(null)
  const [result, setResult] = useState<FfmpegExportBenchmarkResult | null>(null)
  const setLastFfmpegError = useAppShellStore((s) => s.setLastFfmpegError)

  const chromeBusy =
    exportBusy || exportCancelBusy || batchExportBusy || snapshotBusy || benchmarkBusy
  const canRun = previewMediaPath !== null && previewMediaPath.length > 0 && !chromeBusy

  useEffect(() => {
    const off = window.velorix.export.onBenchmarkProgress((p) => {
      setProgressLabel(
        uiTextVars('editorExportBenchmarkProgress', {
          index: String(p.index),
          total: String(p.total),
          codec: codecLabel(p.videoCodec, ffmpegExportSelectOptions)
        })
      )
    })
    return off
  }, [ffmpegExportSelectOptions])

  const handleRunBenchmark = useCallback((): void => {
    if (!previewMediaPath || benchmarkBusy) {
      return
    }
    setLastFfmpegError(null)
    setBenchmarkBusy(true)
    setResult(null)
    setProgressLabel(uiText('editorExportBenchmarkStarting'))
    void window.velorix.export
      .runBenchmark({
        inputPath: previewMediaPath,
        uiLocale: getUiLocale(),
        probeDurationSec: previewProbeDurationSec,
        ...buildCurrentFfmpegExportOverrides()
      })
      .then((res) => {
        setResult(res)
        if (res.ok) {
          setStatusHint(uiText('editorExportBenchmarkDone'))
        } else if ('cancelled' in res && res.cancelled) {
          setStatusHint(uiText('editorExportBenchmarkCancelled'))
        } else if ('error' in res) {
          setLastFfmpegError({ source: 'benchmark', detail: res.error })
          setStatusHint(uiTextVars('editorExportBenchmarkFailed', { detail: res.error }))
        }
      })
      .catch((e) => {
        const detail = e instanceof Error ? e.message : String(e)
        setLastFfmpegError({ source: 'benchmark', detail })
        setStatusHint(uiTextVars('editorExportBenchmarkFailed', { detail }))
      })
      .finally(() => {
        setBenchmarkBusy(false)
        setProgressLabel(null)
      })
  }, [
    benchmarkBusy,
    buildCurrentFfmpegExportOverrides,
    previewMediaPath,
    previewProbeDurationSec,
    setLastFfmpegError,
    setStatusHint
  ])

  const applyCodec = useCallback(
    (codec: FfmpegExportVideoCodecId): void => {
      bumpManualExportEdit()
      setExportVideoCodec(codec)
      void window.velorix.settings.setFfmpegExportVideoCodec(codec).catch(console.error)
    },
    [bumpManualExportEdit, setExportVideoCodec]
  )

  return (
    <div
      className="app-field app-field-benchmark"
      role="group"
      aria-label={uiText('editorExportBenchmarkGroupAria')}
      aria-describedby={describedById}
      aria-busy={benchmarkBusy}
    >
      <div
        className="app-benchmark-toolbar"
        role="toolbar"
        aria-label={uiText('editorExportBenchmarkToolbarAria')}
      >
        <button
          type="button"
          className="app-btn app-btn-compact"
          title={uiText('editorExportBenchmarkButtonTitle')}
          disabled={!canRun}
          aria-busy={benchmarkBusy}
          onClick={handleRunBenchmark}
        >
          {benchmarkBusy
            ? uiText('editorExportBenchmarkRunning')
            : uiText('editorExportBenchmarkButton')}
        </button>
        <span className="app-settings-section-hint app-benchmark-hint">
          {uiTextVars('editorExportBenchmarkSampleHint', {
            seconds: String(FFMPEG_EXPORT_BENCHMARK_SAMPLE_SEC)
          })}
        </span>
        <label
          className="app-field app-benchmark-threshold"
          title={uiText('editorExportBenchmarkThresholdTitle')}
        >
          <span>{uiText('editorExportBenchmarkThresholdLabel')}</span>
          <input
            type="number"
            className="app-control app-control-narrow"
            min={FFMPEG_EXPORT_BENCHMARK_LOAD_THRESHOLD_MIN}
            max={FFMPEG_EXPORT_BENCHMARK_LOAD_THRESHOLD_MAX}
            step={5}
            aria-label={uiText('editorExportBenchmarkThresholdLabel')}
            title={uiText('editorExportBenchmarkThresholdTitle')}
            value={exportBenchmarkLoadThreshold}
            disabled={chromeBusy}
            onChange={(e) => {
              const n = Number(e.target.value)
              if (!Number.isFinite(n)) {
                return
              }
              const clamped = Math.min(
                FFMPEG_EXPORT_BENCHMARK_LOAD_THRESHOLD_MAX,
                Math.max(FFMPEG_EXPORT_BENCHMARK_LOAD_THRESHOLD_MIN, Math.round(n))
              )
              setExportBenchmarkLoadThreshold(clamped)
              void window.velorix.settings
                .setFfmpegExportBenchmarkLoadThreshold(clamped)
                .catch(console.error)
            }}
          />
        </label>
      </div>
      {progressLabel !== null ? (
        <p className="app-settings-section-hint" role="status" aria-live="polite">
          {progressLabel}
        </p>
      ) : null}
      {result?.ok === true ? (
        <div
          className="app-benchmark-results"
          aria-label={uiText('editorExportBenchmarkTableAria')}
        >
          {result.onlyAvailable ? (
            <p className="app-settings-section-hint">
              {uiText('editorExportBenchmarkOnlyAvailable')}
            </p>
          ) : null}
          {result.recommendedIgnoredLoadThreshold ? (
            <p className="app-settings-section-hint" role="status">
              {uiTextVars('editorExportBenchmarkThresholdFallback', {
                threshold: String(result.loadThresholdPercent)
              })}
            </p>
          ) : null}
          <table className="app-benchmark-table">
            <thead>
              <tr>
                <th scope="col">{uiText('editorExportBenchmarkColCodec')}</th>
                <th scope="col">{uiText('editorExportBenchmarkColFps')}</th>
                <th scope="col">{uiText('editorExportBenchmarkColCpu')}</th>
                <th scope="col">{uiText('editorExportBenchmarkColGpu')}</th>
                <th scope="col">{uiText('editorExportBenchmarkColEta')}</th>
                <th scope="col">{uiText('editorExportBenchmarkColSize')}</th>
                <th scope="col">{uiText('editorExportBenchmarkColTime')}</th>
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => {
                const recommended = row.videoCodec === result.recommendedCodec && row.ok
                const label = codecLabel(row.videoCodec, ffmpegExportSelectOptions)
                return (
                  <tr
                    key={row.videoCodec}
                    className={
                      recommended
                        ? 'app-benchmark-row-recommended'
                        : row.ok
                          ? undefined
                          : 'app-benchmark-row-error'
                    }
                  >
                    <td>
                      <button
                        type="button"
                        className="app-benchmark-codec-pick"
                        title={
                          row.ok
                            ? uiText('editorExportBenchmarkPickCodecTitle')
                            : (row.error ?? uiText('editorExportBenchmarkRowFailed'))
                        }
                        disabled={!row.ok || chromeBusy}
                        aria-pressed={exportVideoCodec === row.videoCodec}
                        onClick={() => {
                          if (row.ok) {
                            applyCodec(row.videoCodec)
                          }
                        }}
                      >
                        {recommended ? (
                          <span className="app-benchmark-recommended-badge" aria-hidden>
                            ★
                          </span>
                        ) : null}
                        <span>{label}</span>
                        {recommended ? (
                          <span className="app-visually-hidden">
                            {uiText('editorExportBenchmarkRecommended')}
                          </span>
                        ) : null}
                      </button>
                    </td>
                    <td>{row.ok && row.avgFps !== null ? row.avgFps.toFixed(1) : '—'}</td>
                    <td>
                      {row.ok && row.cpuLoadPeakPercent !== null
                        ? uiTextVars('editorExportBenchmarkCpuPeak', {
                            peak: String(row.cpuLoadPeakPercent)
                          })
                        : '—'}
                    </td>
                    <td>
                      {row.ok && row.gpuLoadPeakPercent !== null
                        ? uiTextVars('editorExportBenchmarkGpuPeak', {
                            peak: String(row.gpuLoadPeakPercent)
                          })
                        : '—'}
                    </td>
                    <td>{row.ok ? formatFfmpegBenchmarkEtaMmSs(row.estimatedFullSec) : '—'}</td>
                    <td>
                      {row.ok && row.outputBytes !== null
                        ? formatFfmpegBenchmarkBytes(row.outputBytes)
                        : '—'}
                    </td>
                    <td>
                      {row.ok && row.elapsedMs !== null
                        ? uiTextVars('editorExportBenchmarkTrialSec', {
                            sec: String((row.elapsedMs / 1000).toFixed(1))
                          })
                        : (row.error ?? '—')}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
