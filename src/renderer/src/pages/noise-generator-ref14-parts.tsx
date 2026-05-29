import type { JSX } from 'react'

import type { NoiseGenTypeMock } from './noise-generator-ref14-data'
import {
  NG_ACTIVE_TASKS,
  NG_CENTER_SUMMARY,
  NG_OUTPUT_PATH,
  NG_RECENT,
  NG_RESOURCES,
  NG_SHORTCUTS,
  NG_SPECTRUM_MARKS,
  NG_TYPES,
  NG_WAVEFORM_MARKS
} from './noise-generator-ref14-data'

function NoiseTypeCard(props: { type: NoiseGenTypeMock }): JSX.Element {
  const { type } = props
  return (
    <button
      type="button"
      className={
        type.active
          ? 'ng-type-card ng-type-card--active vn-surface-glass'
          : 'ng-type-card vn-surface-glass'
      }
      disabled
      aria-pressed={type.active ?? false}
    >
      {type.active ? (
        <span className="ng-glyph ng-glyph--check" aria-hidden />
      ) : (
        <span className={`ng-glyph ng-glyph--type ng-glyph--type-${type.id}`} aria-hidden />
      )}
      <strong>{type.title}</strong>
      <span>{type.hint}</span>
    </button>
  )
}

export function NoiseGeneratorUtilityRail(): JSX.Element {
  return (
    <aside className="ic-rail ng-rail" aria-label="Система и задачи">
      <div className="ic-rail__scroll">
        <section className="ic-rail__section vn-surface-glass">
          <h2 className="ic-rail__title">РЕСУРСЫ СИСТЕМЫ</h2>
          {NG_RESOURCES.map((res) => (
            <div key={res.id} className="ic-resource">
              <div className="ic-resource__head">
                <span>{res.label}</span>
                <em>{res.percent}%</em>
              </div>
              <div className="ic-resource__bar">
                <span className="ic-resource__fill" style={{ width: `${res.percent}%` }} />
              </div>
            </div>
          ))}
        </section>
        <section className="ic-rail__section vn-surface-glass">
          <h2 className="ic-rail__title">БЫСТРЫЙ ДОСТУП</h2>
          <ul className="ic-shortcuts">
            {NG_SHORTCUTS.map((item) => (
              <li key={item.keys}>
                <span>{item.action}</span>
                <kbd>{item.keys}</kbd>
              </li>
            ))}
          </ul>
        </section>
        <section className="ic-rail__section vn-surface-glass">
          <h2 className="ic-rail__title">НЕДАВНИЕ ДЕЙСТВИЯ</h2>
          <ul className="ic-recent">
            {NG_RECENT.map((item) => (
              <li key={item.id}>
                <strong>{item.label}</strong>
                <time>{item.time}</time>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="ic-rail__tasks-sticky vn-surface-glass" aria-label="Активные задачи">
        <h2 className="ic-rail__title">АКТИВНЫЕ ЗАДАЧИ</h2>
        {NG_ACTIVE_TASKS.map((task) => (
          <div key={task.id} className="ic-resource">
            <div className="ic-resource__head">
              <span>{task.label}</span>
              <em>{task.percent}%</em>
            </div>
            <div className="ic-resource__bar">
              <span className="ic-resource__fill" style={{ width: `${task.percent}%` }} />
            </div>
          </div>
        ))}
        <p className="ic-rail__damage">ETA 01:17:08 · проверка повреждений</p>
      </section>
    </aside>
  )
}

export function NoiseGeneratorCenter(): JSX.Element {
  return (
    <section className="ng-center" aria-label="Генератор шума">
      <header className="ng-center__head">
        <div className="ng-center__head-main">
          <p className="ng-center__eyebrow">Аудио · synth</p>
          <h1>ГЕНЕРАТОР ШУМА / ТИШИНЫ</h1>
          <p>Синтез аудио-сигналов для тестов, маскировки и пост-продакшена</p>
        </div>
        <span className="ng-center__head-chip">48 kHz</span>
      </header>
      <p className="ng-center__summary">{NG_CENTER_SUMMARY}</p>

      <div className="ng-center__scroll">
        <div className="ng-wave vn-surface-glass" aria-label="Осциллограмма">
          <div className="ng-wave__y">
            <span>1.0</span>
            <span>0</span>
            <span>-1.0</span>
          </div>
          <div className="ng-wave__plot">
            <div className="ng-wave__curve" aria-hidden />
            <span className="ng-wave__playhead" aria-hidden />
          </div>
          <div className="ng-wave__x">
            {NG_WAVEFORM_MARKS.map((mark) => (
              <span key={mark}>{mark}</span>
            ))}
          </div>
          <p className="ng-wave__time">00:00:05.000</p>
        </div>

        <div className="ng-center__row">
          <section className="ng-types" aria-labelledby="ng-types-title">
            <h2 id="ng-types-title">ТИП ГЕНЕРАЦИИ</h2>
            <div className="ng-types__grid">
              {NG_TYPES.map((type) => (
                <NoiseTypeCard key={type.id} type={type} />
              ))}
            </div>
          </section>

          <section className="ng-settings vn-surface-glass" aria-labelledby="ng-settings-title">
            <h2 id="ng-settings-title">НАСТРОЙКИ ГЕНЕРАЦИИ</h2>
            <label className="ng-field">
              <span>Длительность</span>
              <input className="vn-input" type="text" value="00:01:00.000" readOnly disabled />
            </label>
            <label className="ng-field">
              <span>Частота дискретизации</span>
              <span className="vn-input ng-field__select">48 000 Hz ▾</span>
            </label>
            <label className="ng-field">
              <span>Каналы</span>
              <span className="vn-input ng-field__select">Stereo ▾</span>
            </label>
            <label className="ng-field">
              <span>Громкость</span>
              <span className="ng-field__slider" aria-hidden />
              <em>-12.0 dB</em>
            </label>
            <div className="ng-fade">
              <span>Fade In / Out</span>
              <div className="ng-fade__row">
                <input className="vn-input" type="text" value="2.0 s" readOnly disabled />
                <span className="ng-glyph ng-glyph--link" aria-hidden />
                <input className="vn-input" type="text" value="2.0 s" readOnly disabled />
              </div>
            </div>
          </section>
        </div>

        <div className="ng-spectrum vn-surface-glass" aria-label="Спектр">
          <div className="ng-spectrum__plot" aria-hidden />
          <div className="ng-spectrum__x">
            {NG_SPECTRUM_MARKS.map((mark) => (
              <span key={mark}>{mark}</span>
            ))}
          </div>
        </div>
      </div>

      <footer className="ng-export-sticky">
        <div className="ng-export__formats">
          <label className="ng-field">
            <span>Формат</span>
            <span className="vn-input ng-field__select">WAV ▾</span>
          </label>
          <label className="ng-field">
            <span>Битность</span>
            <span className="vn-input ng-field__select">24-bit PCM ▾</span>
          </label>
        </div>
        <label className="ng-output">
          <span>ПУТЬ ВЫВОДА</span>
          <div className="ic-output__row">
            <input className="vn-input" type="text" value={NG_OUTPUT_PATH} readOnly disabled />
            <button type="button" className="vn-btn vn-btn--secondary" disabled>
              Обзор…
            </button>
          </div>
        </label>
        <button type="button" className="vn-btn vn-btn--primary ng-export__btn" disabled>
          <span className="ng-glyph ng-glyph--export" aria-hidden />
          ЭКСПОРТ WAV
        </button>
      </footer>
    </section>
  )
}
