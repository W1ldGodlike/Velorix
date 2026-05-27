import { useState, type JSX } from 'react'

import { IconCopy, IconPlay, IconRefreshCw, IconSave } from '../LucideMiniIcons'
import { uiText } from '../../locales/ui-text'

export type UiShowcaseWorkspaceMode = 'states' | 'components'

type StatusTone = 'ready' | 'processing' | 'attention' | 'error' | 'info'

const TABLE_ROWS: Array<{
  name: string
  statusKey:
    | 'uiShowcaseStateReady'
    | 'uiShowcaseStateProcessing'
    | 'uiShowcaseStateAttention'
    | 'uiShowcaseStateError'
  size: string
  date: string
  tone: StatusTone
}> = [
  {
    name: 'Project 001',
    statusKey: 'uiShowcaseStateReady',
    size: '246 GB',
    date: '14.05.2026',
    tone: 'ready'
  },
  {
    name: 'Project 002',
    statusKey: 'uiShowcaseStateProcessing',
    size: '18.8 GB',
    date: '13.05.2026',
    tone: 'processing'
  },
  {
    name: 'Project 003',
    statusKey: 'uiShowcaseStateError',
    size: '8.7 GB',
    date: '12.05.2026',
    tone: 'error'
  },
  {
    name: 'Project 004',
    statusKey: 'uiShowcaseStateAttention',
    size: '1.1 GB',
    date: '11.05.2026',
    tone: 'attention'
  }
]

const COMMAND_KEYS: Array<
  'uiShowcaseCommandOpenMedia' | 'uiShowcaseCommandRetryExport' | 'uiShowcaseCommandOpenInspector'
> = ['uiShowcaseCommandOpenMedia', 'uiShowcaseCommandRetryExport', 'uiShowcaseCommandOpenInspector']

function renderStatusPill(
  key:
    | 'uiShowcaseStateReady'
    | 'uiShowcaseStateProcessing'
    | 'uiShowcaseStateAttention'
    | 'uiShowcaseStateError'
    | 'uiShowcaseStateInfo',
  tone: StatusTone
): JSX.Element {
  return (
    <span className={`app-ui-showcase-status-pill app-ui-showcase-status-pill--${tone}`}>
      {uiText(key)}
    </span>
  )
}

function renderToggle(
  labelKey: 'uiShowcaseStateDefault' | 'uiShowcaseStateActive' | 'uiShowcaseStateDisabled',
  active: boolean,
  disabled?: boolean
): JSX.Element {
  return (
    <button
      type="button"
      className={`app-pill-switch${active ? ' app-pill-switch-on' : ''}`}
      disabled={disabled}
    >
      <span className="app-pill-switch-knob" aria-hidden />
      <span className="app-pill-switch-text">{uiText(labelKey)}</span>
    </button>
  )
}

export function UiShowcaseWorkspacePanel(props: {
  initialMode: UiShowcaseWorkspaceMode
  onClose: () => void
}): JSX.Element {
  const { initialMode, onClose } = props
  const [mode, setMode] = useState<UiShowcaseWorkspaceMode>(initialMode)

  const renderStatesShowcase = (): JSX.Element => (
    <div className="app-ui-showcase-grid" role="list" aria-label={uiText('uiShowcaseTabStates')}>
      <section className="app-ui-showcase-card" role="listitem">
        <h3 className="app-ui-showcase-card-title">{uiText('uiShowcaseSectionButtons')}</h3>
        <div className="app-ui-showcase-button-row">
          <button type="button" className="app-btn">
            {uiText('uiShowcaseStateDefault')}
          </button>
          <button type="button" className="app-btn app-btn-primary">
            {uiText('uiShowcaseStatePrimary')}
          </button>
          <button type="button" className="app-btn app-btn-warn">
            {uiText('uiShowcaseStateWarning')}
          </button>
          <button type="button" className="app-btn app-btn-danger">
            {uiText('uiShowcaseStateDanger')}
          </button>
          <button type="button" className="app-btn app-ui-showcase-force-focus">
            {uiText('uiShowcaseStateFocused')}
          </button>
          <button type="button" className="app-btn" disabled>
            {uiText('uiShowcaseStateDisabled')}
          </button>
        </div>
      </section>

      <section className="app-ui-showcase-card" role="listitem">
        <h3 className="app-ui-showcase-card-title">{uiText('uiShowcaseSectionFields')}</h3>
        <div className="app-ui-showcase-field-grid">
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">{uiText('uiShowcaseStateDefault')}</span>
            <input className="app-input" readOnly value={uiText('uiShowcaseSampleInput')} />
          </label>
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">{uiText('uiShowcaseStateFocused')}</span>
            <input
              className="app-input app-ui-showcase-force-focus"
              readOnly
              value={uiText('uiShowcaseSampleSearch')}
            />
          </label>
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">{uiText('uiShowcaseStateError')}</span>
            <input
              className="app-input app-ui-showcase-input-error"
              readOnly
              value={uiText('uiShowcaseSampleEmpty')}
            />
          </label>
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">{uiText('uiShowcaseStateSuccess')}</span>
            <input
              className="app-input app-ui-showcase-input-success"
              readOnly
              value={uiText('uiShowcaseSampleInput')}
            />
          </label>
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">{uiText('uiShowcaseSectionSelect')}</span>
            <select className="app-settings-select" defaultValue="selected">
              <option value="default">{uiText('uiShowcaseStateDefault')}</option>
              <option value="selected">{uiText('uiShowcaseStateSelected')}</option>
              <option value="active">{uiText('uiShowcaseStateActive')}</option>
            </select>
          </label>
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">{uiText('uiShowcaseStateDisabled')}</span>
            <select className="app-settings-select" disabled defaultValue="disabled">
              <option value="disabled">{uiText('uiShowcaseStateDisabled')}</option>
            </select>
          </label>
        </div>
      </section>

      <section className="app-ui-showcase-card" role="listitem">
        <h3 className="app-ui-showcase-card-title">{uiText('uiShowcaseSectionFeedback')}</h3>
        <div className="app-ui-showcase-toast-stack">
          <article className="app-ui-showcase-toast app-ui-showcase-toast--ready">
            {renderStatusPill('uiShowcaseStateReady', 'ready')}
            <p>{uiText('uiShowcaseToastReady')}</p>
          </article>
          <article className="app-ui-showcase-toast app-ui-showcase-toast--attention">
            {renderStatusPill('uiShowcaseStateAttention', 'attention')}
            <p>{uiText('uiShowcaseToastAttention')}</p>
          </article>
          <article className="app-ui-showcase-toast app-ui-showcase-toast--error">
            {renderStatusPill('uiShowcaseStateError', 'error')}
            <p>{uiText('uiShowcaseToastError')}</p>
          </article>
          <article className="app-ui-showcase-toast app-ui-showcase-toast--info">
            {renderStatusPill('uiShowcaseStateInfo', 'info')}
            <p>{uiText('uiShowcaseToastInfo')}</p>
          </article>
        </div>
      </section>

      <section className="app-ui-showcase-card" role="listitem">
        <h3 className="app-ui-showcase-card-title">{uiText('uiShowcaseSectionProgress')}</h3>
        <div className="app-ui-showcase-progress-stack">
          {[12, 45, 78, 100].map((value) => (
            <div key={value} className="app-ui-showcase-progress-row">
              <span>{`${value}%`}</span>
              <div className="app-ui-showcase-progress-track" aria-hidden>
                <span className="app-ui-showcase-progress-fill" style={{ width: `${value}%` }} />
              </div>
            </div>
          ))}
          <input
            className="app-ui-showcase-range"
            type="range"
            min={0}
            max={100}
            value={72}
            readOnly
          />
        </div>
      </section>

      <section className="app-ui-showcase-card" role="listitem">
        <h3 className="app-ui-showcase-card-title">{uiText('uiShowcaseSectionCards')}</h3>
        <div className="app-ui-showcase-card-grid">
          <article className="app-ui-showcase-item-card">
            <span className="app-settings-badge">{uiText('uiShowcaseStateDefault')}</span>
            <strong>Project 001</strong>
            <span>24.6 GB</span>
          </article>
          <article className="app-ui-showcase-item-card app-ui-showcase-item-card--selected">
            <span className="app-settings-badge">{uiText('uiShowcaseStateSelected')}</span>
            <strong>Project 002</strong>
            <span>18.8 GB</span>
          </article>
          <article className="app-ui-showcase-item-card app-ui-showcase-item-card--active">
            <span className="app-settings-badge">{uiText('uiShowcaseStateActive')}</span>
            <strong>Project 003</strong>
            <span>8.7 GB</span>
          </article>
          <article className="app-ui-showcase-item-card app-ui-showcase-item-card--disabled">
            <span className="app-settings-badge">{uiText('uiShowcaseStateDisabled')}</span>
            <strong>Project 004</strong>
            <span>1.1 GB</span>
          </article>
        </div>
      </section>

      <section className="app-ui-showcase-card" role="listitem">
        <h3 className="app-ui-showcase-card-title">{uiText('uiShowcaseSectionTimeline')}</h3>
        <div className="app-ui-showcase-timeline">
          <div className="app-ui-showcase-timeline-strip" aria-hidden>
            <span className="app-ui-showcase-timeline-segment" />
            <span className="app-ui-showcase-timeline-segment app-ui-showcase-timeline-segment--selected" />
            <span className="app-ui-showcase-timeline-segment" />
          </div>
          <div className="app-ui-showcase-timeline-badges">
            <span className="app-timeline-badge app-timeline-badge--in">IN 00:12</span>
            <span className="app-timeline-badge app-timeline-badge--out">OUT 01:24</span>
          </div>
        </div>
      </section>
    </div>
  )

  const renderComponentsShowcase = (): JSX.Element => (
    <div
      className="app-ui-showcase-grid"
      role="list"
      aria-label={uiText('uiShowcaseTabComponents')}
    >
      <section className="app-ui-showcase-card" role="listitem">
        <h3 className="app-ui-showcase-card-title">{uiText('uiShowcaseSectionControls')}</h3>
        <div className="app-ui-showcase-controls-stack">
          <div className="app-ui-showcase-button-row">
            <button type="button" className="app-btn app-btn-icon-leading">
              <IconPlay title="" size={16} />
              <span>{uiText('uiShowcaseCommandOpenMedia')}</span>
            </button>
            <button type="button" className="app-btn app-btn-primary app-btn-icon-leading">
              <IconSave title="" size={16} />
              <span>{uiText('uiShowcaseActionSave')}</span>
            </button>
            <button type="button" className="app-btn app-btn-icon-leading">
              <IconCopy title="" size={16} />
              <span>{uiText('uiShowcaseActionCopy')}</span>
            </button>
            <button type="button" className="app-btn app-btn-warn app-btn-icon-leading">
              <IconRefreshCw title="" size={16} />
              <span>{uiText('uiShowcaseActionRefresh')}</span>
            </button>
          </div>
          <div className="app-ui-showcase-toggle-row">
            {renderToggle('uiShowcaseStateDefault', false)}
            {renderToggle('uiShowcaseStateActive', true)}
            {renderToggle('uiShowcaseStateDisabled', false, true)}
          </div>
          <div className="app-ui-showcase-checkbox-row">
            <label>
              <input type="checkbox" /> {uiText('uiShowcaseStateDefault')}
            </label>
            <label>
              <input type="checkbox" defaultChecked /> {uiText('uiShowcaseStateSelected')}
            </label>
            <label>
              <input type="radio" name="ui-showcase-radio" defaultChecked />{' '}
              {uiText('uiShowcaseStateActive')}
            </label>
            <label>
              <input type="radio" name="ui-showcase-radio" /> {uiText('uiShowcaseStateDefault')}
            </label>
          </div>
        </div>
      </section>

      <section className="app-ui-showcase-card" role="listitem">
        <h3 className="app-ui-showcase-card-title">{uiText('uiShowcaseSectionTable')}</h3>
        <div className="app-ui-showcase-table-wrap">
          <table className="app-ui-showcase-table">
            <thead>
              <tr>
                <th scope="col">{uiText('uiShowcaseTableColumnName')}</th>
                <th scope="col">{uiText('uiShowcaseTableColumnStatus')}</th>
                <th scope="col">{uiText('uiShowcaseTableColumnSize')}</th>
                <th scope="col">{uiText('uiShowcaseTableColumnDate')}</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row) => (
                <tr key={row.name}>
                  <td>{row.name}</td>
                  <td>{renderStatusPill(row.statusKey, row.tone)}</td>
                  <td>{row.size}</td>
                  <td>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="app-ui-showcase-card" role="listitem">
        <h3 className="app-ui-showcase-card-title">{uiText('uiShowcaseSectionPalette')}</h3>
        <div className="app-ui-showcase-palette">
          {COMMAND_KEYS.map((key) => (
            <button key={key} type="button" className="app-ui-showcase-palette-row">
              <span>{uiText(key)}</span>
              <span className="app-ui-showcase-palette-shortcut">Ctrl+K</span>
            </button>
          ))}
        </div>
      </section>

      <section className="app-ui-showcase-card" role="listitem">
        <h3 className="app-ui-showcase-card-title">{uiText('uiShowcaseSectionStatusbar')}</h3>
        <div className="app-ui-showcase-statusbar">
          {renderStatusPill('uiShowcaseStateReady', 'ready')}
          <span className="app-ui-showcase-statusbar-sep" />
          {renderStatusPill('uiShowcaseStateProcessing', 'processing')}
          <span className="app-ui-showcase-statusbar-sep" />
          {renderStatusPill('uiShowcaseStateInfo', 'info')}
        </div>
      </section>

      <section className="app-ui-showcase-card" role="listitem">
        <h3 className="app-ui-showcase-card-title">{uiText('uiShowcaseSectionSkeleton')}</h3>
        <div className="app-ui-showcase-skeleton-card" aria-hidden>
          <span className="app-ui-showcase-skeleton app-ui-showcase-skeleton--title" />
          <span className="app-ui-showcase-skeleton app-ui-showcase-skeleton--line" />
          <span className="app-ui-showcase-skeleton app-ui-showcase-skeleton--line app-ui-showcase-skeleton--line-short" />
          <span className="app-ui-showcase-skeleton app-ui-showcase-skeleton--bar" />
        </div>
      </section>
    </div>
  )

  return (
    <section
      className="app-tools-workspace-shell app-ui-showcase-shell"
      aria-label={uiText('uiShowcaseTitle')}
      aria-describedby="app-ui-showcase-hint"
    >
      <div className="app-tools-workspace-head">
        <div className="app-tools-workspace-copy">
          <h2 className="app-settings-title">{uiText('uiShowcaseTitle')}</h2>
          <p
            id="app-ui-showcase-hint"
            className="app-settings-subtitle"
            title={uiText('uiShowcaseSubtitle')}
          >
            {uiText('uiShowcaseSubtitle')}
          </p>
        </div>
        <div className="app-tools-workspace-card-actions">
          <button
            type="button"
            className={`app-btn${mode === 'states' ? ' app-btn-primary' : ''}`}
            onClick={() => {
              setMode('states')
            }}
          >
            {uiText('uiShowcaseTabStates')}
          </button>
          <button
            type="button"
            className={`app-btn${mode === 'components' ? ' app-btn-primary' : ''}`}
            onClick={() => {
              setMode('components')
            }}
          >
            {uiText('uiShowcaseTabComponents')}
          </button>
          <button type="button" className="app-btn" onClick={onClose}>
            {uiText('closeButton')}
          </button>
        </div>
      </div>
      {mode === 'states' ? renderStatesShowcase() : renderComponentsShowcase()}
    </section>
  )
}
