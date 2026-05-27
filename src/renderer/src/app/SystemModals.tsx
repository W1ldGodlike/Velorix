import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_ABOUT_REL } from '../../../shared/velorix-neon-theme-tokens'

import { SYSTEM_MODAL_TITLES, type SystemModalId } from './system-modal'
import { useAppShellStore } from '../stores/app-shell-store'

export function SystemModals(): JSX.Element | null {
  const activeModal = useAppShellStore((s) => s.activeModal)
  const closeModal = useAppShellStore((s) => s.closeModal)

  if (activeModal == null) {
    return null
  }

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
        className="app-modal vn-surface-glass"
        role="dialog"
        aria-modal="true"
        aria-labelledby="system-modal-title"
      >
        <h2 id="system-modal-title" className="app-modal__title">
          {SYSTEM_MODAL_TITLES[activeModal]}
        </h2>
        <ModalBody id={activeModal} />
        <div className="app-modal__actions">
          <button type="button" className="app-btn" onClick={closeModal}>
            {activeModal === 'quit-confirm' ? 'Отмена' : 'Закрыть'}
          </button>
          {activeModal === 'quit-confirm' ? (
            <button type="button" className="app-btn app-btn-danger">
              Закрыть
            </button>
          ) : null}
          {activeModal === 'export-preset-name' ? (
            <button type="button" className="app-btn app-btn-primary" onClick={closeModal}>
              Сохранить
            </button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

function ModalBody(props: { id: SystemModalId }): JSX.Element {
  const { id } = props
  if (id === 'about') {
    return (
      <div className="app-modal__body">
        <p className="app-modal__subtitle">VELORIX · UI ZERO rebuild</p>
        <p className="app-modal__hint">Эталон: {VELORIX_NEON_REFERENCE_ABOUT_REL}</p>
      </div>
    )
  }
  if (id === 'quit-confirm') {
    return <p className="app-modal__body">Завершить работу приложения?</p>
  }
  if (id === 'ffmpeg-error') {
    return (
      <p className="app-modal__body app-modal__body--error">
        Кодек не поддерживается для выбранного контейнера.
      </p>
    )
  }
  return (
    <label className="app-ui-showcase-field app-modal__body">
      <span className="app-ui-showcase-field-label">Имя пресета</span>
      <input type="text" className="app-input" defaultValue="Мой пресет" />
    </label>
  )
}
