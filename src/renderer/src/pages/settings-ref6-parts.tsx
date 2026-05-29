import type { JSX } from 'react'

import type { SettingsCardMock } from './settings-ref6-data'
import { SETTINGS_ABOUT, SETTINGS_QUICK_ACTIONS, SETTINGS_RESOURCES } from './settings-ref6-data'

export function SettingsToggle(props: { label: string; on: boolean }): JSX.Element {
  const { label, on } = props
  return (
    <div className="settings-field settings-field--toggle">
      <span>{label}</span>
      <span
        className={on ? 'settings-toggle settings-toggle--on' : 'settings-toggle'}
        aria-hidden
      />
    </div>
  )
}

export function SettingsSelect(props: { label: string; value: string }): JSX.Element {
  const { label, value } = props
  return (
    <div className="settings-field">
      <span>{label}</span>
      <span className="settings-select" aria-disabled>
        {value}
      </span>
    </div>
  )
}

export function SettingsPath(props: { label: string; path: string }): JSX.Element {
  const { label, path } = props
  return (
    <div className="settings-field settings-field--path">
      <span>{label}</span>
      <span className="settings-path">
        <em>{path}</em>
        <span className="settings-path-glyph processing-glyph" aria-hidden />
      </span>
    </div>
  )
}

export function SettingsCard(props: { card: SettingsCardMock }): JSX.Element {
  const { card } = props
  return (
    <section className="settings-card vn-surface-glass">
      <h2>{card.title}</h2>
      {card.selects?.map((row) => (
        <SettingsSelect key={row.label} label={row.label} value={row.value} />
      ))}
      {card.toggles?.map((row) => (
        <SettingsToggle key={row.label} label={row.label} on={row.on} />
      ))}
      {card.paths?.map((row) => (
        <SettingsPath key={row.label} label={row.label} path={row.path} />
      ))}
      {card.button ? (
        <button type="button" className="vn-btn vn-btn--secondary settings-card__btn" disabled>
          {card.button}
        </button>
      ) : null}
    </section>
  )
}

export function SettingsSystemRail(): JSX.Element {
  const about = SETTINGS_ABOUT
  const res = SETTINGS_RESOURCES
  return (
    <aside className="settings-rail" aria-label="Система">
      <div className="settings-rail__scroll">
        <section className="settings-rail__section vn-surface-glass">
          <h2 className="settings-rail__title">О системе</h2>
          <div className="settings-about">
            <span className="processing-sidebar__mark settings-about__mark" aria-hidden>
              V
            </span>
            <dl>
              <div>
                <dt>Версия</dt>
                <dd>{about.version}</dd>
              </div>
              <div>
                <dt>Сборка</dt>
                <dd>{about.build}</dd>
              </div>
              <div>
                <dt>Платформа</dt>
                <dd>{about.platform}</dd>
              </div>
              <div>
                <dt>Движок</dt>
                <dd>{about.engine}</dd>
              </div>
            </dl>
          </div>
          <button type="button" className="settings-rail__link" disabled>
            Проверить обновления
          </button>
        </section>
        <section className="settings-rail__section vn-surface-glass">
          <h2 className="settings-rail__title">Ресурсы системы</h2>
          <dl className="settings-resources">
            <div>
              <dt>ОС</dt>
              <dd>{res.os}</dd>
            </div>
            <div>
              <dt>CPU</dt>
              <dd>{res.cpu}</dd>
            </div>
            <div>
              <dt>RAM</dt>
              <dd>{res.ram}</dd>
            </div>
            <div>
              <dt>GPU</dt>
              <dd>{res.gpu}</dd>
            </div>
          </dl>
          {res.disks.map((disk) => (
            <div key={disk.id} className="settings-disk">
              <div className="settings-disk__head">
                <strong>{disk.label}</strong>
                <span>
                  {disk.free} свободно из {disk.total}
                </span>
              </div>
              <div className="settings-disk__bar" aria-hidden>
                <span className="settings-disk__fill" style={{ width: `${disk.percent}%` }} />
              </div>
            </div>
          ))}
        </section>
      </div>
      <section
        className="settings-rail__quick-sticky vn-surface-glass"
        aria-label="Быстрые действия"
      >
        <h2 className="settings-rail__title">Быстрые действия</h2>
        <ul className="settings-quick">
          {SETTINGS_QUICK_ACTIONS.map((action) => (
            <li key={action}>
              <button type="button" className="settings-quick__btn" disabled>
                {action}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}
