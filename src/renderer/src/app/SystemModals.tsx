import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_ENGINE_PATHS_REL } from '../../../shared/velorix-neon-theme-tokens'

import { ENGINE_IDS, type EngineId } from '../../../shared/engine-contract'

import { AboutModalBody } from './AboutModalBody'
import { CriticalCrashModalBody } from './CriticalCrashModalBody'
import { EncoderBenchmarkModalBody } from './EncoderBenchmarkModalBody'
import { ExportPresetNameModalBody } from './ExportPresetNameModalBody'
import { FfmpegErrorModalBody } from './FfmpegErrorModalBody'
import { FirstRunEnginesModalBody } from './FirstRunEnginesModalBody'
import { PluginsModalBody } from './PluginsModalBody'
import { QuitConfirmModalBody } from './QuitConfirmModalBody'
import { SYSTEM_MODAL_TITLES, SYSTEM_MODAL_WIDE, type SystemModalId } from './system-modal'
import { saveUserExportPreset } from '../lib/save-user-export-preset'
import { useAppShellStore } from '../stores/app-shell-store'

const ENGINE_LABELS: Record<EngineId, string> = {
  ffmpeg: 'FFmpeg',
  ffprobe: 'FFprobe',
  'yt-dlp': 'yt-dlp'
}

export function SystemModals(): JSX.Element | null {
  const activeModal = useAppShellStore((s) => s.activeModal)
  const closeModal = useAppShellStore((s) => s.closeModal)
  const processErrorDialog = useAppShellStore((s) => s.processErrorDialog)

  if (activeModal == null) {
    return null
  }

  const modalClass = [
    'app-modal',
    'vn-surface-glass',
    SYSTEM_MODAL_WIDE.has(activeModal) ? 'app-modal--wide' : '',
    activeModal === 'critical-crash' ? 'app-modal--danger' : ''
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className="app-modal-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closeModal()
        }
      }}
    >
      <div
        className={modalClass}
        role="dialog"
        aria-modal="true"
        aria-labelledby="system-modal-title"
      >
        <h2 id="system-modal-title" className="app-modal__title">
          {activeModal === 'critical-crash' && processErrorDialog != null
            ? processErrorDialog.title
            : SYSTEM_MODAL_TITLES[activeModal]}
        </h2>
        <ModalBody id={activeModal} />
        <ModalActions id={activeModal} onClose={closeModal} />
      </div>
    </div>
  )
}

function respondQuitConfirm(confirmed: boolean): void {
  const payload = useAppShellStore.getState().quitConfirmRequest
  const respond = window.velorix?.respondQuitConfirm
  if (payload != null && respond != null) {
    respond(payload.requestId, confirmed)
  }
  useAppShellStore.getState().setQuitConfirmRequest(null)
}

function ModalActions(props: { id: SystemModalId; onClose: () => void }): JSX.Element {
  const { id, onClose } = props
  if (id === 'quit-confirm') {
    return (
      <div className="app-modal__actions">
        <button
          type="button"
          className="app-btn"
          onClick={() => {
            respondQuitConfirm(false)
            onClose()
          }}
        >
          Отмена
        </button>
        <button
          type="button"
          className="app-btn app-btn-danger"
          onClick={() => {
            respondQuitConfirm(true)
            onClose()
          }}
        >
          Закрыть
        </button>
      </div>
    )
  }
  if (id === 'export-preset-name') {
    return (
      <div className="app-modal__actions">
        <button type="button" className="app-btn" onClick={onClose}>
          Отмена
        </button>
        <button
          type="button"
          className="app-btn app-btn-primary"
          onClick={() => {
            void saveUserExportPreset(useAppShellStore.getState().exportPresetDraftLabel).then(
              (result) => {
                if (result.ok) {
                  onClose()
                  return
                }
                useAppShellStore.getState().setExportPresetSaveNote(result.error)
              }
            )
          }}
        >
          Сохранить
        </button>
      </div>
    )
  }
  if (id === 'engine-paths') {
    return (
      <div className="app-modal__actions app-modal__actions--split">
        <button
          type="button"
          className="app-btn app-btn-secondary"
          onClick={() => {
            void useAppShellStore.getState().hydrateEnginePathDraft()
          }}
        >
          Сбросить по умолчанию
        </button>
        <div className="app-modal__actions-end">
          <button type="button" className="app-btn" onClick={onClose}>
            Отмена
          </button>
          <button
            type="button"
            className="app-btn app-btn-primary"
            onClick={() => {
              void useAppShellStore
                .getState()
                .persistEnginePathDraft()
                .then(() => onClose())
            }}
          >
            Сохранить
          </button>
        </div>
      </div>
    )
  }
  if (id === 'first-run-engines') {
    return (
      <div className="app-modal__actions">
        <button type="button" className="app-btn" onClick={onClose}>
          Пропустить
        </button>
        <button type="button" className="app-btn app-btn-primary" onClick={onClose}>
          Продолжить
        </button>
      </div>
    )
  }
  if (id === 'critical-crash') {
    const payload = useAppShellStore.getState().processErrorDialog
    return (
      <div className="app-modal__actions app-modal__actions--split">
        <div className="app-modal__actions-end">
          <button
            type="button"
            className="app-btn app-btn-secondary"
            disabled={payload == null}
            onClick={() => {
              if (payload == null) {
                return
              }
              void window.velorix?.clipboard?.writeText(payload.detail)
            }}
          >
            {payload?.copyLabel ?? 'Копировать'}
          </button>
          <button
            type="button"
            className="app-btn app-btn-secondary"
            onClick={() => {
              void window.velorix?.diagnostics?.openMainLog()
            }}
          >
            {payload?.openLogLabel ?? 'Журнал'}
          </button>
          <button
            type="button"
            className="app-btn app-btn-secondary"
            onClick={() => {
              void window.velorix?.diagnostics?.createSupportZip()
            }}
          >
            {payload?.supportZipLabel ?? 'Support ZIP'}
          </button>
        </div>
        <button type="button" className="app-btn app-btn-danger" onClick={onClose}>
          {payload?.closeLabel ?? 'Закрыть'}
        </button>
      </div>
    )
  }
  return (
    <div className="app-modal__actions">
      <button type="button" className="app-btn" onClick={onClose}>
        Закрыть
      </button>
    </div>
  )
}

function ModalBody(props: { id: SystemModalId }): JSX.Element {
  const { id } = props
  if (id === 'about') {
    return <AboutModalBody />
  }
  if (id === 'quit-confirm') {
    return <QuitConfirmModalBody />
  }
  if (id === 'ffmpeg-error') {
    return <FfmpegErrorModalBody />
  }
  if (id === 'engine-paths') {
    return <EnginePathsBody />
  }
  if (id === 'first-run-engines') {
    return <FirstRunEnginesModalBody />
  }
  if (id === 'critical-crash') {
    return <CriticalCrashModalBody />
  }
  if (id === 'encoder-benchmark') {
    return <EncoderBenchmarkModalBody />
  }
  if (id === 'plugins') {
    return <PluginsModalBody />
  }
  if (id === 'export-preset-name') {
    return <ExportPresetNameModalBodyConnected />
  }
  return <p className="app-modal__body">Неизвестное окно.</p>
}

function ExportPresetNameModalBodyConnected(): JSX.Element {
  const label = useAppShellStore((s) => s.exportPresetDraftLabel)
  const setLabel = useAppShellStore((s) => s.setExportPresetDraftLabel)
  const statusLine = useAppShellStore((s) => s.exportPresetSaveNote)
  return (
    <ExportPresetNameModalBody label={label} onLabelChange={setLabel} statusLine={statusLine} />
  )
}

function EnginePathsBody(): JSX.Element {
  const draft = useAppShellStore((s) => s.enginePathDraft)
  const setField = useAppShellStore((s) => s.setEnginePathDraftField)
  return (
    <div className="app-modal__body app-modal__body--stack">
      <p className="app-modal__hint">Эталон: {VELORIX_NEON_REFERENCE_ENGINE_PATHS_REL}</p>
      <ul className="app-modal__engines">
        {ENGINE_IDS.map((engineId) => {
          const path = draft[engineId] ?? ''
          const valid = path.length > 0
          return (
            <li key={engineId} className="app-modal__engine-row vn-surface-glass">
              <div className="app-modal__engine-head">
                <strong>{ENGINE_LABELS[engineId]}</strong>
                <span
                  className={`app-ui-showcase-status-pill${valid ? ' app-ui-showcase-status-pill--ready' : ''}`}
                >
                  {valid ? 'Валидно' : 'Не задано'}
                </span>
              </div>
              <div className="app-modal__engine-path-row">
                <input
                  type="text"
                  className="app-input"
                  value={path}
                  readOnly
                  aria-label={ENGINE_LABELS[engineId]}
                />
                <button
                  type="button"
                  className="app-btn app-btn-secondary"
                  onClick={() => {
                    void pickEnginePath(engineId, setField)
                  }}
                >
                  Обзор…
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

async function pickEnginePath(
  engineId: EngineId,
  setField: (id: EngineId, path: string) => void
): Promise<void> {
  const pick = window.velorix?.settings?.pickEngineExecutable
  if (pick == null) {
    return
  }
  const path = await pick(engineId)
  if (path != null && path.length > 0) {
    setField(engineId, path)
  }
}
