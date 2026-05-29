import type { JSX } from 'react'

import type { PluginRowMock } from './plugins-ref25-data'
import {
  PL_CENTER_SUMMARY,
  PL_HEAD_CHIP,
  PL_PERMISSIONS,
  PL_PLUGINS,
  PL_RAIL_ACTIONS,
  PL_SELECTED,
  PL_TABS
} from './plugins-ref25-data'

function PluginTableRow(props: { plugin: PluginRowMock }): JSX.Element {
  const { plugin } = props
  return (
    <tr className={plugin.selected ? 'pl-row pl-row--selected' : 'pl-row'}>
      <td>
        <div className="pl-row__plugin">
          <span className={`pl-row__abbr pl-row__abbr--${plugin.abbrTone}`}>{plugin.abbr}</span>
          <div>
            <strong>{plugin.name}</strong>
            <span>{plugin.description}</span>
          </div>
        </div>
      </td>
      <td>{plugin.version}</td>
      <td>{plugin.category}</td>
      <td>{plugin.developer}</td>
      <td>
        <span
          className={
            plugin.enabled
              ? 'pl-row__status pl-row__status--on'
              : 'pl-row__status pl-row__status--off'
          }
        >
          {plugin.enabled ? 'Включен' : 'Выключен'}
        </span>
        <span className={plugin.enabled ? 'pl-toggle pl-toggle--on' : 'pl-toggle'} aria-hidden />
      </td>
      <td>
        <button type="button" className="pl-row__menu" aria-label="Действия" disabled>
          ⋮
        </button>
      </td>
    </tr>
  )
}

export function PluginsCenter(): JSX.Element {
  return (
    <div className="pl-center">
      <header className="pl-center__head">
        <div className="pl-center__head-main">
          <p className="pl-center__eyebrow">Плагины · manager</p>
          <h1>
            <span className="pl-glyph pl-glyph--puzzle" aria-hidden />
            ПЛАГИНЫ
          </h1>
          <p>Управляйте установленными плагинами Velorix</p>
        </div>
        <div className="pl-center__head-tools">
          <span className="pl-center__head-chip">{PL_HEAD_CHIP}</span>
          <button type="button" className="vn-btn vn-btn--secondary pl-center__install" disabled>
            Установить из файла
          </button>
        </div>
      </header>
      <p className="pl-center__summary">{PL_CENTER_SUMMARY}</p>

      <div className="pl-center__scroll">
        <div className="pl-toolbar">
          <nav className="pl-tabs" aria-label="Разделы плагинов">
            {PL_TABS.map((tab) => (
              <span
                key={tab.id}
                className={tab.active ? 'pl-tabs__item pl-tabs__item--active' : 'pl-tabs__item'}
              >
                {tab.label}
                {tab.badge !== null ? <em>{tab.badge}</em> : null}
              </span>
            ))}
          </nav>
        </div>

        <div className="pl-filters">
          <span className="vn-input pl-filters__search">Поиск плагинов…</span>
          <span className="vn-input pl-filters__select">Все категории ▾</span>
          <span className="vn-input pl-filters__select">Сортировать: Имя (А-Я) ▾</span>
          <span className="pl-view">
            <span className="pl-view__btn pl-view__btn--active" aria-hidden />
            <span className="pl-view__btn" aria-hidden />
          </span>
        </div>

        <section className="pl-table-wrap vn-surface-glass" aria-labelledby="pl-table-title">
          <h2 id="pl-table-title">УСТАНОВЛЕННЫЕ ПЛАГИНЫ (9)</h2>
          <table className="pl-table">
            <thead>
              <tr>
                <th>Плагин</th>
                <th>Версия</th>
                <th>Категория</th>
                <th>Разработчик</th>
                <th>Статус</th>
                <th aria-label="Действия" />
              </tr>
            </thead>
            <tbody>
              {PL_PLUGINS.map((plugin) => (
                <PluginTableRow key={plugin.id} plugin={plugin} />
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <footer className="pl-sandbox-sticky vn-surface-glass">
        <div>
          <h3>ПЕСОЧНИЦА</h3>
          <p>
            Песочница позволяет безопасно тестировать плагины без доступа к системе и основному
            проекту.
          </p>
        </div>
        <span className="pl-sandbox-sticky__badge">Изолированная среда · Активна</span>
        <button type="button" className="vn-btn vn-btn--primary" disabled>
          Открыть песочницу
        </button>
      </footer>
    </div>
  )
}

export function PluginsDetailRail(): JSX.Element {
  return (
    <aside className="pl-rail" aria-label="Детали плагина">
      <div className="pl-rail__scroll">
        <h2 className="pl-rail__title">ДЕТАЛИ ПЛАГИНА</h2>
        <header className="pl-rail__identity vn-surface-glass">
          <span className={`pl-rail__abbr pl-rail__abbr--${PL_SELECTED.abbrTone}`}>
            {PL_SELECTED.abbr}
          </span>
          <div>
            <strong>{PL_SELECTED.name}</strong>
            <span className="pl-rail__enabled">Включен</span>
            <em>{PL_SELECTED.version}</em>
          </div>
        </header>
        <p className="pl-rail__desc">{PL_SELECTED.description}</p>
        <dl className="pl-rail__meta vn-surface-glass">
          <div>
            <dt>Разработчик</dt>
            <dd>{PL_SELECTED.developer}</dd>
          </div>
          <div>
            <dt>Категория</dt>
            <dd>{PL_SELECTED.category}</dd>
          </div>
          <div>
            <dt>Установлен</dt>
            <dd>{PL_SELECTED.installed}</dd>
          </div>
          <div>
            <dt>Размер</dt>
            <dd>{PL_SELECTED.size}</dd>
          </div>
          <div>
            <dt>Совместимость</dt>
            <dd>{PL_SELECTED.compatibility}</dd>
          </div>
          <div>
            <dt>ID</dt>
            <dd>{PL_SELECTED.pluginId}</dd>
          </div>
        </dl>
        <section className="pl-rail__section vn-surface-glass">
          <h3>ВЕРСИЯ</h3>
          <p>
            Текущая: {PL_SELECTED.version} · Последняя: {PL_SELECTED.latest}
          </p>
          <span className="pl-rail__ok">{PL_SELECTED.versionStatus}</span>
        </section>
        <section className="pl-rail__section vn-surface-glass">
          <h3>ПЕСОЧНИЦА</h3>
          <p>{PL_SELECTED.sandboxStatus}</p>
          <p>{PL_SELECTED.sandboxLastRun}</p>
          <span className="pl-rail__ok">{PL_SELECTED.sandboxResult}</span>
        </section>
        <section className="pl-rail__section vn-surface-glass">
          <h3>РАЗРЕШЕНИЯ</h3>
          <ul className="pl-perms">
            {PL_PERMISSIONS.map((perm) => (
              <li key={perm}>
                <span aria-hidden>✓</span>
                {perm}
              </li>
            ))}
          </ul>
          <button type="button" className="vn-btn vn-btn--secondary pl-rail__perm-btn" disabled>
            Настроить разрешения
          </button>
        </section>
      </div>
      <section className="pl-rail__actions-sticky vn-surface-glass" aria-label="Действия">
        {PL_RAIL_ACTIONS.map((label, index) => (
          <button
            key={label}
            type="button"
            className={
              index === 0
                ? 'vn-btn pl-rail__disable'
                : index === 2
                  ? 'vn-btn pl-rail__delete'
                  : 'vn-btn vn-btn--secondary'
            }
            disabled
          >
            {label}
          </button>
        ))}
      </section>
    </aside>
  )
}
