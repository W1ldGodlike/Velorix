import type { JSX } from 'react'

import type { ScenarioCardMock, ScenarioRunMock } from './scenarios-ref7-data'
import { SCENARIO_DETAIL } from './scenarios-ref7-data'

export function ScenarioCardView(props: { card: ScenarioCardMock }): JSX.Element {
  const { card } = props
  return (
    <article
      className={
        card.selected
          ? 'scenario-card scenario-card--selected vn-surface-glass'
          : 'scenario-card vn-surface-glass'
      }
    >
      <header className="scenario-card__head">
        <span
          className={`scenario-glyph scenario-glyph--${card.kind} processing-glyph`}
          aria-hidden
        />
        <div>
          <h3>{card.title}</h3>
          <p>{card.description}</p>
        </div>
        <button type="button" className="scenario-card__menu" disabled title="Ещё">
          <span className="scenario-glyph scenario-glyph--menu processing-glyph" aria-hidden />
        </button>
      </header>
      <ul className="scenario-card__tags">
        {card.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
      <footer className="scenario-card__foot">
        <span
          className={
            card.active
              ? 'scenario-card__status scenario-card__status--active'
              : 'scenario-card__status'
          }
        >
          <span className="scenario-status-dot processing-glyph" aria-hidden />
          {card.active ? 'Активен' : 'Выкл.'}
        </span>
        <time>{card.lastUsed}</time>
      </footer>
    </article>
  )
}

export function ScenarioRunRow(props: { run: ScenarioRunMock }): JSX.Element {
  const { run } = props
  return (
    <tr
      className={
        run.selected ? 'scenario-runs__row scenario-runs__row--selected' : 'scenario-runs__row'
      }
    >
      <td className="scenario-runs__cell scenario-runs__cell--name">
        <span
          className={`scenario-glyph scenario-glyph--${run.kind} processing-glyph`}
          aria-hidden
        />
        {run.title}
      </td>
      <td className={`scenario-runs__cell scenario-runs__cell--${run.status}`}>
        {run.statusLabel}
      </td>
      <td className="scenario-runs__cell">
        <div className="scenario-runs__bar" aria-hidden>
          <span
            className={`scenario-runs__fill scenario-runs__fill--${run.status}`}
            style={{ width: `${run.percent}%` }}
          />
        </div>
        <span>{run.percent}%</span>
      </td>
      <td className="scenario-runs__cell scenario-runs__cell--mono">{run.started}</td>
      <td className="scenario-runs__cell scenario-runs__cell--mono">{run.duration}</td>
      <td className="scenario-runs__cell">{run.result}</td>
    </tr>
  )
}

export function ScenarioDetailRail(): JSX.Element {
  const d = SCENARIO_DETAIL
  return (
    <aside className="scenario-rail" aria-label="Информация о сценарии">
      <header className="scenario-rail__head">
        <h2>Информация о сценарии</h2>
        <button type="button" className="scenario-rail__close" disabled aria-label="Закрыть">
          ×
        </button>
      </header>
      <div className="scenario-rail__scroll">
        <section className="scenario-rail__hero vn-surface-glass">
          <span
            className={`scenario-glyph scenario-glyph--${d.kind} scenario-glyph--lg processing-glyph`}
            aria-hidden
          />
          <div>
            <h3>{d.title}</h3>
            <span className="scenario-rail__active">
              <span className="scenario-status-dot processing-glyph" aria-hidden />
              Активен
            </span>
          </div>
        </section>
        <dl className="scenario-rail__meta vn-surface-glass">
          <div>
            <dt>ID</dt>
            <dd>{d.id}</dd>
          </div>
          <div>
            <dt>Создан</dt>
            <dd>{d.created}</dd>
          </div>
          <div>
            <dt>Обновлён</dt>
            <dd>{d.updated}</dd>
          </div>
        </dl>
        <section className="scenario-rail__section vn-surface-glass">
          <p>{d.description}</p>
          <ul className="scenario-rail__tags">
            {d.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
            <li className="scenario-rail__tag-add">+</li>
          </ul>
          <dl className="scenario-rail__params">
            {d.params.map((p) => (
              <div key={p.label}>
                <dt>{p.label}</dt>
                <dd>{p.value}</dd>
              </div>
            ))}
          </dl>
          <button type="button" className="scenario-rail__link" disabled>
            Показать все параметры
          </button>
        </section>
        <section className="scenario-rail__stats vn-surface-glass">
          <h3>Статистика использования</h3>
          <p>
            <strong>{d.stats.runs}</strong> запусков ·{' '}
            <em className="scenario-stat--ok">
              {d.stats.success} ({d.stats.successRate})
            </em>{' '}
            ·{' '}
            <em className="scenario-stat--err">
              {d.stats.errors} ({d.stats.errorRate})
            </em>
          </p>
          <p>
            Объём: <strong>{d.stats.volume}</strong> · Сэкономлено:{' '}
            <strong>{d.stats.timeSaved}</strong>
          </p>
        </section>
      </div>
      <section
        className="scenario-rail__actions-sticky vn-surface-glass"
        aria-label="Действия сценария"
      >
        <button type="button" className="scenario-rail__run" disabled>
          Запустить сценарий
        </button>
        <button type="button" className="scenario-rail__action" disabled>
          Редактировать
        </button>
        <button type="button" className="scenario-rail__action" disabled>
          Дублировать
        </button>
        <button type="button" className="scenario-rail__action" disabled>
          Экспорт сценария
        </button>
        <button type="button" className="scenario-rail__delete" disabled>
          Удалить сценарий
        </button>
      </section>
    </aside>
  )
}
