import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_UI_STATE_SHOWCASE_REL } from '../../../shared/velorix-neon-theme-tokens'

import { PillSwitch, StatusPill } from './ref27-showcase-shared'
import type { ForcedState } from './ref26-states-shared'
import { Ref26StatesExtra } from './Ref26StatesExtra'
import { StateMatrix, StatesSection } from './ref26-states-shared'

function btnClass(force: ForcedState, base: string): string {
  return [base, force].filter(Boolean).join(' ')
}

/** ref.26 — UI States Showcase (матрица default/hover/active/focus/disabled). */
export function Ref26StatesPage(): JSX.Element {
  return (
    <section
      className="app-tools-workspace-shell app-ui-showcase-shell"
      aria-label="UI States Showcase"
      aria-describedby="ref26-hint"
    >
      <header className="app-tools-workspace-head">
        <div className="app-tools-workspace-copy">
          <h1 className="app-settings-title">UI States Showcase</h1>
          <p id="ref26-hint" className="app-settings-subtitle">
            Эталон: {VELORIX_NEON_REFERENCE_UI_STATE_SHOWCASE_REL} — neon.2 (состояния).
          </p>
        </div>
      </header>

      <div className="app-ui-showcase-grid" role="list">
        <StatesSection title="Кнопки — состояния">
          <div className="app-ui-states-stack">
            <StateMatrix>
              {(force, disabled) => (
                <button
                  type="button"
                  className={btnClass(force, 'app-btn app-btn-primary')}
                  disabled={disabled}
                >
                  Primary
                </button>
              )}
            </StateMatrix>
            <StateMatrix>
              {(force, disabled) => (
                <button type="button" className={btnClass(force, 'app-btn')} disabled={disabled}>
                  Default
                </button>
              )}
            </StateMatrix>
            <StateMatrix>
              {(force, disabled) => (
                <button
                  type="button"
                  className={btnClass(force, 'app-btn app-btn-secondary')}
                  disabled={disabled}
                >
                  Secondary
                </button>
              )}
            </StateMatrix>
            <StateMatrix>
              {(force, disabled) => (
                <button
                  type="button"
                  className={btnClass(force, 'app-btn app-btn-danger')}
                  disabled={disabled}
                >
                  Danger
                </button>
              )}
            </StateMatrix>
          </div>
        </StatesSection>

        <StatesSection title="Sidebar nav (ref.1)">
          <StateMatrix>
            {(force, disabled) => (
              <button
                type="button"
                className={[
                  'neon-shell__nav-btn',
                  force === 'app-ui-state--active' ? 'is-active' : force
                ]
                  .filter(Boolean)
                  .join(' ')}
                disabled={disabled}
              >
                <span className="neon-shell__nav-glyph" aria-hidden />
                Обработка
              </button>
            )}
          </StateMatrix>
        </StatesSection>

        <StatesSection title="Поля ввода">
          <StateMatrix>
            {(force, disabled) => (
              <input
                type="text"
                className={btnClass(force, 'app-input')}
                defaultValue="Project"
                disabled={disabled}
                readOnly={force === 'app-ui-state--focus'}
              />
            )}
          </StateMatrix>
        </StatesSection>

        <StatesSection title="Выпадающий список">
          <StateMatrix>
            {(force, disabled) => (
              <select
                className={btnClass(force, 'app-settings-select')}
                disabled={disabled}
                defaultValue="h264"
              >
                <option value="h264">H.264</option>
                <option value="hevc">HEVC</option>
              </select>
            )}
          </StateMatrix>
        </StatesSection>

        <StatesSection title="Слайдер">
          <StateMatrix>
            {(force, disabled) => (
              <input
                type="range"
                className={btnClass(force, 'app-ui-showcase-range vn-progress-neon')}
                defaultValue={force === 'app-ui-state--active' ? 72 : 40}
                disabled={disabled}
              />
            )}
          </StateMatrix>
        </StatesSection>

        <StatesSection title="Чекбоксы / радио">
          <StateMatrix>
            {(force, disabled) => (
              <label className={force}>
                <input
                  type="checkbox"
                  defaultChecked={force === 'app-ui-state--active'}
                  disabled={disabled}
                />{' '}
                Чек
              </label>
            )}
          </StateMatrix>
        </StatesSection>

        <StatesSection title="Переключатели">
          <StateMatrix>
            {(force, disabled) => (
              <span className={force}>
                <PillSwitch
                  label="ON"
                  active={force === 'app-ui-state--active' || force === 'app-ui-state--focus'}
                  disabled={disabled}
                />
              </span>
            )}
          </StateMatrix>
        </StatesSection>

        <StatesSection title="Индикаторы">
          <div className="app-ui-states-status-row">
            <StatusPill label="Готово" tone="ready" />
            <StatusPill label="Обработка" tone="processing" />
            <StatusPill label="Внимание" tone="attention" />
            <StatusPill label="Ошибка" tone="error" />
            <StatusPill label="Инфо" tone="info" />
          </div>
          <StateMatrix>
            {(force, disabled) => (
              <span className={force} aria-disabled={disabled}>
                <StatusPill label="Готово" tone="ready" />
              </span>
            )}
          </StateMatrix>
        </StatesSection>

        <StatesSection title="Карточки">
          <StateMatrix>
            {(force, disabled) => (
              <div
                className={[
                  'app-ui-showcase-item-card',
                  force,
                  force === 'app-ui-state--active' ? 'app-ui-showcase-item-card--selected' : ''
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-disabled={disabled}
              >
                <strong>Clip</strong>
                <span>1.2 GB</span>
              </div>
            )}
          </StateMatrix>
        </StatesSection>

        <StatesSection title="Прогресс">
          <StateMatrix>
            {(force, disabled) => (
              <div className="app-ui-showcase-progress-row" style={{ width: '100%' }}>
                <span>{force === 'app-ui-state--disabled' ? '—' : '70%'}</span>
                <div className="app-ui-showcase-progress-track">
                  <span
                    className="app-ui-showcase-progress-fill"
                    style={{ width: disabled ? '0%' : '70%', opacity: disabled ? 0.4 : 1 }}
                  />
                </div>
              </div>
            )}
          </StateMatrix>
        </StatesSection>

        <StatesSection title="Загрузка">
          <div className="app-ui-states-loading-row">
            <div className="app-ui-states-spinner" aria-hidden />
            <div className="app-ui-states-dots" aria-hidden>
              <span />
              <span />
              <span />
            </div>
            <div className="app-ui-states-bar-loader" aria-hidden />
          </div>
        </StatesSection>

        <StatesSection title="Тосты">
          <div className="app-ui-showcase-toast-stack">
            <div className="app-ui-showcase-toast app-ui-showcase-toast--ready">
              <strong>Успех</strong>
              <p>Файл добавлен.</p>
            </div>
            <div className="app-ui-showcase-toast app-ui-showcase-toast--error">
              <strong>Ошибка</strong>
              <p>Загрузка прервана.</p>
            </div>
          </div>
        </StatesSection>

        <StatesSection title="Успех / ошибка">
          <div className="app-ui-states-feedback">
            <div className="app-ui-states-feedback-icon app-ui-states-feedback-icon--ok">
              <strong>✓</strong>
              <span>Файлы добавлены</span>
            </div>
            <div className="app-ui-states-feedback-icon app-ui-states-feedback-icon--err">
              <strong>×</strong>
              <span>Ошибка загрузки</span>
            </div>
          </div>
        </StatesSection>

        <Ref26StatesExtra />
      </div>
    </section>
  )
}
