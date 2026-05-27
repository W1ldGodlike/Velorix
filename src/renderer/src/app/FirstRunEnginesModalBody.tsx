import { useEffect, useState, type JSX } from 'react'

import { ENGINE_IDS, type EnginesStatusSnapshot } from '../../../shared/engine-contract'
import { VELORIX_NEON_REFERENCE_FIRST_RUN_ENGINES_REL } from '../../../shared/velorix-neon-theme-tokens'

import { countHwEncoders } from '../lib/count-hw-encoders'
import { isEngineReady } from '../lib/format-engines-status-line'
import { useAppShellStore } from '../stores/app-shell-store'

/** ref.20 — мастер первого запуска: статус ffmpeg/ffprobe/yt-dlp + HW probe. */
export function FirstRunEnginesModalBody(): JSX.Element {
  const [snapshot, setSnapshot] = useState<EnginesStatusSnapshot | null>(null)
  const [hwCount, setHwCount] = useState<number | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      const getStatus = window.velorix?.engines?.getStatus
      if (getStatus == null) {
        setLoadError('engines.getStatus недоступен')
        return
      }
      const status = await getStatus('ru')
      setSnapshot(status)
      const probe = window.velorix?.engines?.probeHwEncoders
      if (probe != null) {
        const hw = await probe()
        if (hw.ok) {
          setHwCount(countHwEncoders(hw.snapshot))
        }
      }
    })()
  }, [])

  const engineSteps = ENGINE_IDS.map((id) => {
    const ready = snapshot != null && isEngineReady(snapshot, id)
    const label = snapshot?.engines[id].displayName ?? id
    return { id, label, ready }
  })
  const gpuReady = hwCount != null && hwCount > 0

  return (
    <div className="app-modal__body app-modal__body--stack">
      <p>Мастер первого запуска — проверка внешних движков.</p>
      {loadError != null ? <p className="app-modal__body--error">{loadError}</p> : null}
      <ol className="app-modal__steps">
        {engineSteps.map((step) => (
          <li key={step.id} className={step.ready ? 'app-modal__step--done' : ''}>
            {step.label}
            {step.ready ? ' ✓' : ''}
          </li>
        ))}
        <li className={gpuReady ? 'app-modal__step--done' : ''}>
          Проверка GPU (HW-кодеки)
          {gpuReady ? ` ✓ (${String(hwCount)})` : hwCount === 0 ? ' — не найдено' : ''}
        </li>
      </ol>
      <div className="app-modal__actions-inline">
        <button
          type="button"
          className="app-btn app-btn-secondary"
          onClick={() => {
            void useAppShellStore
              .getState()
              .hydrateEnginePathDraft()
              .then(() => {
                useAppShellStore.getState().openModal('engine-paths')
              })
          }}
        >
          Пути к движкам…
        </button>
      </div>
      <p className="app-modal__hint">Эталон: {VELORIX_NEON_REFERENCE_FIRST_RUN_ENGINES_REL}</p>
    </div>
  )
}
