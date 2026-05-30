import type { JSX } from 'react'
import { NeonSidebarBrand } from '../components/NeonBrandLogo'

import type { FirstRunEngineMock } from './first-run-ref20-data'
import {
  FR_ENGINES,
  FR_MAIN_SUMMARY,
  FR_SCAN_PATHS,
  FR_STATUS_READY,
  FR_STATUS_ROWS,
  FR_STEPS,
  FR_SYSTEM_SPECS
} from './first-run-ref20-data'

function FirstRunEngineRow(props: { engine: FirstRunEngineMock }): JSX.Element {
  const { engine } = props
  const isDetected = engine.status === 'detected'
  return (
    <article
      className={
        engine.selected
          ? 'fr-engine fr-engine--selected vn-surface-glass'
          : isDetected
            ? 'fr-engine vn-surface-glass'
            : 'fr-engine fr-engine--missing vn-surface-glass'
      }
    >
      <header className="fr-engine__head">
        <strong>{engine.name}</strong>
        <span
          className={
            isDetected
              ? 'fr-engine__status fr-engine__status--ok'
              : 'fr-engine__status fr-engine__status--warn'
          }
        >
          {isDetected ? 'Обнаружен' : 'Требуется установка'}
        </span>
      </header>
      <dl className="fr-engine__meta">
        <div>
          <dt>Версия</dt>
          <dd>{engine.version}</dd>
        </div>
        <div>
          <dt>Путь</dt>
          <dd>{engine.path}</dd>
        </div>
      </dl>
      <button type="button" className="vn-btn vn-btn--secondary" disabled>
        {isDetected ? 'Изменить путь' : 'Установить'}
      </button>
    </article>
  )
}

export function FirstRunEnginesWizard(): JSX.Element {
  return (
    <div className="fr-wizard">
      <header className="fr-wizard__hero">
        <NeonSidebarBrand
          className="fr-wizard__brand processing-sidebar__brand"
          tagline="Мультимедиа инструмент нового поколения"
        />
        <div className="fr-wizard__hero-art" aria-hidden />
      </header>

      <div className="fr-wizard__body">
        <aside className="fr-steps vn-surface-glass" aria-label="Шаги мастера">
          <ol>
            {FR_STEPS.map((step, index) => (
              <li
                key={step.id}
                className={
                  step.id === 's1' ? 'fr-steps__item fr-steps__item--active' : 'fr-steps__item'
                }
              >
                <span className="fr-steps__num">{index + 1}</span>
                {step.label}
              </li>
            ))}
          </ol>
          <section className="fr-steps__info">
            <h2>ПОЧЕМУ НУЖНЫ ДВИЖКИ?</h2>
            <p>
              Velorix использует внешние движки для обработки медиа — это обеспечивает максимальную
              совместимость и производительность.
            </p>
          </section>
        </aside>

        <main className="fr-main">
          <header className="fr-main__head">
            <div className="fr-main__head-main">
              <p className="fr-main__eyebrow">Первый запуск · wizard</p>
              <h1>ДОБРО ПОЖАЛОВАТЬ В VELORIX</h1>
            </div>
            <span className="fr-main__head-chip">2/3</span>
          </header>
          <p className="fr-main__summary">{FR_MAIN_SUMMARY}</p>

          <div className="fr-main__scroll">
            <section className="fr-section" aria-labelledby="fr-engines-title">
              <h2 id="fr-engines-title">НЕОБХОДИМЫЕ ДВИЖКИ</h2>
              <div className="fr-engines">
                {FR_ENGINES.map((engine) => (
                  <FirstRunEngineRow key={engine.id} engine={engine} />
                ))}
              </div>
            </section>

            <section className="fr-section vn-surface-glass" aria-labelledby="fr-install-title">
              <h2 id="fr-install-title">УСТАНОВКА ДВИЖКОВ</h2>
              <button type="button" className="vn-btn vn-btn--primary" disabled>
                Установить все недостающие
              </button>
              <label className="fr-check">
                <input type="checkbox" defaultChecked disabled readOnly />
                Создать резервную копию существующих файлов
              </label>
              <span className="vn-input fr-field__select">Дополнительные параметры ▾</span>
            </section>

            <section className="fr-section vn-surface-glass" aria-labelledby="fr-scan-title">
              <h2 id="fr-scan-title">ДЕТЕКТИРОВАНИЕ БИНАРНИКОВ</h2>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Сканировать систему
              </button>
              <ul className="fr-scan-list">
                {FR_SCAN_PATHS.map((path, index) => (
                  <li
                    key={path}
                    className={index === 2 ? 'fr-scan-list__row--selected' : undefined}
                  >
                    <span className="fr-scan-list__ok" aria-hidden>
                      ✓
                    </span>
                    {path}
                    <em>Проверено</em>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </main>
      </div>

      <footer className="tools-statusbar fr-wizard__status" aria-label="Статус">
        <span className="tools-statusbar__ready">
          <span className="tools-statusbar__dot" aria-hidden />
          {FR_STATUS_READY}
        </span>
        <div className="tools-statusbar__center">
          {FR_STATUS_ROWS.map((row) => (
            <span
              key={row.label}
              className={`tools-statusbar__item${row.accent ? ` tools-statusbar__item--${row.accent}` : ''}`}
            >
              <strong>{row.label}:</strong>{' '}
              {row.mono ? <em className="tools-statusbar__tc">{row.value}</em> : row.value}
            </span>
          ))}
        </div>
      </footer>

      <footer className="fr-foot-sticky">
        <dl className="fr-specs">
          {FR_SYSTEM_SPECS.map((spec) => (
            <div key={spec.id} className="fr-specs__row">
              <dt>{spec.label}</dt>
              <dd>{spec.value}</dd>
            </div>
          ))}
        </dl>
        <div className="fr-foot__nav">
          <button type="button" className="fr-foot__skip" disabled>
            Пропустить настройку
          </button>
          <button type="button" className="vn-btn vn-btn--primary fr-foot__continue" disabled>
            <strong>Продолжить</strong>
            <span>Перейти к следующему шагу</span>
          </button>
        </div>
      </footer>
    </div>
  )
}
