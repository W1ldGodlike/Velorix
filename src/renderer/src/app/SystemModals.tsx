import type { JSX } from 'react'

import {
  VELORIX_NEON_REFERENCE_CRITICAL_CRASH_REL,
  VELORIX_NEON_REFERENCE_ENGINE_PATHS_REL
} from '../../../shared/velorix-neon-theme-tokens'

import { ENGINE_IDS, type EngineId } from '../../../shared/engine-contract'

import { AboutModalBody } from './AboutModalBody'
import { EncoderBenchmarkModalBody } from './EncoderBenchmarkModalBody'
import { FirstRunEnginesModalBody } from './FirstRunEnginesModalBody'
import { QuitConfirmModalBody } from './QuitConfirmModalBody'
import { SYSTEM_MODAL_TITLES, SYSTEM_MODAL_WIDE, type SystemModalId } from './system-modal'
import { useAppShellStore } from '../stores/app-shell-store'

const ENGINE_LABELS: Record<EngineId, string> = {
  ffmpeg: 'FFmpeg',
  ffprobe: 'FFprobe',
  'yt-dlp': 'yt-dlp'
}

export function SystemModals(): JSX.Element | null {
  const activeModal = useAppShellStore((s) => s.activeModal)
  const closeModal = useAppShellStore((s) => s.closeModal)

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
          {SYSTEM_MODAL_TITLES[activeModal]}
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
          Закрыть
        </button>
        <button type="button" className="app-btn app-btn-primary" onClick={onClose}>
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
    return (
      <div className="app-modal__actions">
        <button type="button" className="app-btn app-btn-secondary">
          Копировать лог
        </button>
        <button type="button" className="app-btn app-btn-danger" onClick={onClose}>
          Закрыть
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
    return (
      <p className="app-modal__body app-modal__body--error">
        Кодек не поддерживается для выбранного контейнера.
      </p>
    )
  }
  if (id === 'engine-paths') {
    return <EnginePathsBody />
  }
  if (id === 'first-run-engines') {
    return <FirstRunEnginesModalBody />
  }
  if (id === 'critical-crash') {
    return (
      <div className="app-modal__body">
        <p className="app-modal__body--error">Приложение не может продолжить работу.</p>
        <pre className="app-modal__stack" aria-label="Стек сбоя">
          {`Error: renderer unhandled rejection\n  at NeonShell (NeonShell.tsx)\n  at renderRoot (main.tsx)`}
        </pre>
        <p className="app-modal__hint">Эталон: {VELORIX_NEON_REFERENCE_CRITICAL_CRASH_REL}</p>
      </div>
    )
  }
  if (id === 'encoder-benchmark') {
    return <EncoderBenchmarkModalBody />
  }
  if (id === 'plugins') {
    return <p className="app-modal__body">Управление плагинами (ref.25) — отдельный срез.</p>
  }
  return (
    <label className="app-ui-showcase-field app-modal__body">
      <span className="app-ui-showcase-field-label">Имя пресета</span>
      <input type="text" className="app-input" defaultValue="Мой пресет" />
    </label>
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
