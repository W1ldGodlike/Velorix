import type { JSX } from 'react'

import {
  CC_AUTOSAVE,
  CC_CRASH_REPORT_LINES,
  CC_DIAG_ITEMS,
  CC_ERROR_CODE,
  CC_MAIN_CHIP,
  CC_MAIN_SUMMARY,
  CC_PROJECT,
  CC_QUICK_INFO,
  CC_RECOVERY_ACTIONS,
  CC_RECOMMENDATION,
  CC_STACK_LINES,
  CC_STATUS_CARDS
} from './critical-crash-ref23-data'
import { PROCESSING_NAV } from './processing-ref1-data'

export function CriticalCrashSidebar(): JSX.Element {
  return (
    <aside className="cc-sidebar" aria-label="Навигация">
      <div className="tools-sidebar__brand">
        <span className="processing-sidebar__mark" aria-hidden>
          V
        </span>
        <div className="processing-sidebar__brand-text">
          <div className="processing-sidebar__logo vn-text-gradient">VELORIX</div>
          <p className="processing-sidebar__version">v1.7.0</p>
        </div>
        <span className="processing-sidebar__brand-edition">PRO</span>
      </div>
      <nav className="processing-nav cc-sidebar__nav">
        {PROCESSING_NAV.map((item) => (
          <span key={item.slug} className="processing-nav__item">
            <span
              className={`processing-nav__icon processing-nav__icon--${item.slug} processing-glyph`}
              aria-hidden
            />
            {item.label}
          </span>
        ))}
      </nav>
      <div className="tools-sidebar__gpu vn-surface-glass">
        <div className="processing-sidebar__gpu-head">
          <span className="processing-sidebar__gpu-glyph processing-glyph" aria-hidden />
          <div>
            <strong>NVIDIA RTX 4090</strong>
            <span>24GB GDDR6X</span>
          </div>
        </div>
        <p className="tools-sidebar__gpu-stats">Load 98% · Temp 71°C · Memory 22.1 / 24.0 GB</p>
        <div className="processing-sidebar__gpu-spark" aria-hidden />
      </div>
      <section className="tools-sidebar__system vn-surface-glass" aria-label="Система">
        <h2 className="processing-sidebar__section-title">Система</h2>
        <div className="processing-sidebar__rings">
          <div className="processing-ring processing-ring--cpu">
            <span>CPU</span>
            <em>79%</em>
          </div>
          <div className="processing-ring processing-ring--ram">
            <span>RAM</span>
            <em>83%</em>
          </div>
          <div className="processing-ring processing-ring--disk">
            <span>Disk</span>
            <em>64%</em>
          </div>
        </div>
        <div className="processing-sidebar__utilities tools-sidebar__utilities">
          <button
            type="button"
            className="processing-util-btn processing-util-btn--search processing-glyph"
            disabled
            title="Поиск"
          />
          <button
            type="button"
            className="processing-util-btn processing-util-btn--settings processing-glyph"
            disabled
            title="Настройки"
          />
          <button
            type="button"
            className="processing-util-btn processing-util-btn--notify processing-glyph"
            disabled
            title="Уведомления"
          />
          <button
            type="button"
            className="processing-util-btn processing-util-btn--power processing-glyph"
            disabled
            title="Выход"
          />
        </div>
      </section>
    </aside>
  )
}

export function CriticalCrashMain(): JSX.Element {
  return (
    <main className="cc-main" id="ref23">
      <header className="cc-hero">
        <span className="cc-hero__icon" aria-hidden>
          !
        </span>
        <div className="cc-hero__head-main">
          <p className="cc-hero__eyebrow">Crash · recovery</p>
          <h1>КРИТИЧЕСКИЙ СБОЙ ПРИЛОЖЕНИЯ</h1>
          <p>Velorix столкнулся с критической ошибкой и был принудительно завершён</p>
          <span className="cc-hero__code">КОД ОШИБКИ: {CC_ERROR_CODE}</span>
        </div>
        <div className="cc-hero__head-tools">
          <span className="cc-hero__head-chip">{CC_MAIN_CHIP}</span>
        </div>
      </header>
      <p className="cc-main__summary">{CC_MAIN_SUMMARY}</p>

      <div className="cc-main__scroll">
        <div className="cc-status-row">
          {CC_STATUS_CARDS.map((card) => (
            <article
              key={card.id}
              className={
                card.id === 'app'
                  ? `cc-status cc-status--${card.tone} cc-status--selected vn-surface-glass`
                  : `cc-status cc-status--${card.tone} vn-surface-glass`
              }
            >
              <span className={`cc-status__icon cc-status__icon--${card.icon}`} aria-hidden />
              <strong>{card.title}</strong>
              <span>{card.detail}</span>
            </article>
          ))}
        </div>

        <div className="cc-pair">
          <section className="cc-panel vn-surface-glass" aria-labelledby="cc-report-title">
            <h2 id="cc-report-title">
              <span className="cc-panel__glyph cc-panel__glyph--danger" aria-hidden />
              ОТЧЁТ О СБОЕ
            </h2>
            <ul className="cc-report">
              {CC_CRASH_REPORT_LINES.map((line) => (
                <li
                  key={line.id}
                  className={
                    'selected' in line && line.selected ? 'cc-log__row--selected' : undefined
                  }
                >
                  <code>{line.text}</code>
                </li>
              ))}
            </ul>
          </section>
          <section className="cc-panel vn-surface-glass" aria-labelledby="cc-stack-title">
            <div className="cc-panel__head">
              <h2 id="cc-stack-title">
                <span className="cc-panel__glyph cc-panel__glyph--stack" aria-hidden />
                СТЕК ВЫЗОВОВ
              </h2>
              <button type="button" className="vn-btn vn-btn--secondary cc-panel__copy" disabled>
                Копировать стек
              </button>
            </div>
            <ul className="cc-stack">
              {CC_STACK_LINES.map((line) => (
                <li
                  key={line.id}
                  className={
                    'selected' in line && line.selected ? 'cc-log__row--selected' : undefined
                  }
                >
                  <code>{line.text}</code>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="cc-info-row">
          <article className="cc-info vn-surface-glass">
            <h3>Последний активный проект</h3>
            <span className="cc-info__icon cc-info__icon--folder" aria-hidden />
            <strong>{CC_PROJECT.name}</strong>
            <p>{CC_PROJECT.path}</p>
            <em className="cc-info__bad">{CC_PROJECT.status}</em>
          </article>
          <article className="cc-info vn-surface-glass">
            <h3>Автосохранение</h3>
            <div className="cc-autosave" aria-hidden>
              <span>{CC_AUTOSAVE.percent}%</span>
            </div>
            <p>{CC_AUTOSAVE.hint}</p>
            <button type="button" className="vn-btn vn-btn--secondary" disabled>
              Открыть автосейвы
            </button>
          </article>
          <article className="cc-info vn-surface-glass">
            <h3>Системная диагностика</h3>
            <ul className="cc-diag">
              {CC_DIAG_ITEMS.map((item) => (
                <li
                  key={item.id}
                  className={item.status === 'fail' ? 'cc-diag__row--fail' : undefined}
                >
                  <span className={`cc-diag__mark cc-diag__mark--${item.status}`} aria-hidden />
                  <span>{item.label}</span>
                  <em>{item.note}</em>
                </li>
              ))}
            </ul>
          </article>
          <article className="cc-info vn-surface-glass">
            <h3>Краткая информация</h3>
            <dl className="cc-quick">
              {CC_QUICK_INFO.map((row) => (
                <div key={row.id}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </article>
        </div>

        <section className="cc-reco vn-surface-glass" aria-label="Рекомендации">
          <span className="cc-reco__icon" aria-hidden>
            !
          </span>
          <p>{CC_RECOMMENDATION}</p>
          <div className="cc-reco__actions">
            <button type="button" className="vn-btn vn-btn--secondary" disabled>
              Экспортировать логи
            </button>
            <button type="button" className="vn-btn vn-btn--secondary" disabled>
              Копировать отчёт
            </button>
          </div>
        </section>
      </div>

      <div className="cc-recovery-sticky">
        {CC_RECOVERY_ACTIONS.map((action) => (
          <button
            key={action.id}
            type="button"
            className={
              action.highlight
                ? 'cc-recovery__btn cc-recovery__btn--highlight vn-surface-glass'
                : 'cc-recovery__btn vn-surface-glass'
            }
            disabled
          >
            <strong>{action.title}</strong>
            <span>{action.detail}</span>
          </button>
        ))}
      </div>
    </main>
  )
}
