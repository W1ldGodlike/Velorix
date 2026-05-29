import type { JSX } from 'react'

import {
  ESF_ACTIVE_TASKS,
  ESF_CENTER_SUMMARY,
  ESF_COMMAND_PREVIEW,
  ESF_ENV_LINES,
  ESF_LOG_LINES,
  ESF_PROGRESS,
  ESF_RECENT,
  ESF_RESOURCES,
  ESF_SCRIPT_ARGS,
  ESF_SCRIPT_PATH,
  ESF_VALIDATION,
  ESF_WORK_DIR
} from './external-script-ref17-data'

export function ExternalScriptUtilityRail(): JSX.Element {
  return (
    <aside className="ic-rail esf-rail" aria-label="Система">
      <div className="ic-rail__scroll">
        <section className="ic-rail__section vn-surface-glass">
          <h2 className="ic-rail__title">РЕСУРСЫ СИСТЕМЫ</h2>
          {ESF_RESOURCES.map((res) => (
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
          <h2 className="ic-rail__title">НЕДАВНИЕ ДЕЙСТВИЯ</h2>
          <ul className="ic-recent">
            {ESF_RECENT.map((item) => (
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
        {ESF_ACTIVE_TASKS.map((task) => (
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
      </section>
    </aside>
  )
}

export function ExternalScriptCenter(): JSX.Element {
  return (
    <section className="esf-center" aria-label="Внешний script-filter">
      <header className="esf-center__head">
        <div className="esf-center__head-main">
          <p className="esf-center__eyebrow">Script-filter · Python</p>
          <h1>ВНЕШНИЙ SCRIPT-FILTER</h1>
          <p>Запуск внешних скриптов и фильтров для обработки видео</p>
        </div>
        <span className="esf-center__head-chip">OK</span>
      </header>
      <p className="esf-center__summary">{ESF_CENTER_SUMMARY}</p>

      <div className="esf-center__scroll">
        <div className="esf-grid">
          <article className="esf-card vn-surface-glass">
            <h2>ПУТЬ К СКРИПТУ</h2>
            <div className="ic-output__row">
              <input className="vn-input" type="text" value={ESF_SCRIPT_PATH} readOnly disabled />
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Обзор…
              </button>
            </div>
            <p className="esf-ok">Скрипт найден и доступен</p>
          </article>

          <article className="esf-card vn-surface-glass">
            <h2>АРГУМЕНТЫ СКРИПТА</h2>
            <textarea className="vn-input esf-textarea" value={ESF_SCRIPT_ARGS} readOnly disabled />
            <p className="esf-hint">Переменные: $input, $output, $project, $temp</p>
          </article>

          <article className="esf-card vn-surface-glass">
            <h2>РАБОЧАЯ ДИРЕКТОРИЯ</h2>
            <input className="vn-input" type="text" value={ESF_WORK_DIR} readOnly disabled />
          </article>

          <article className="esf-card vn-surface-glass">
            <h2>ПЕРЕМЕННЫЕ ОКРУЖЕНИЯ</h2>
            <ul className="esf-env">
              {ESF_ENV_LINES.map((line) => (
                <li key={line}>
                  <code>{line}</code>
                </li>
              ))}
            </ul>
          </article>

          <article className="esf-card vn-surface-glass esf-card--validation">
            <h2>ВАЛИДАЦИЯ СКРИПТА</h2>
            <ul className="esf-validation">
              {ESF_VALIDATION.map((item) => (
                <li key={item.id}>
                  <span className="esf-validation__ok" aria-hidden>
                    ✓
                  </span>
                  {item.label}
                </li>
              ))}
            </ul>
            <p className="esf-ok">Скрипт готов к выполнению</p>
          </article>

          <article className="esf-card vn-surface-glass esf-card--preview">
            <h2>ПРЕДПРОСМОТР КОМАНДЫ</h2>
            <pre className="esf-preview">{ESF_COMMAND_PREVIEW}</pre>
          </article>
        </div>
      </div>

      <article className="esf-exec-sticky vn-surface-glass" aria-labelledby="esf-exec-title">
        <header className="esf-exec__head">
          <h2 id="esf-exec-title">ВЫПОЛНЕНИЕ</h2>
          <div className="esf-exec__timing">
            <span>{ESF_PROGRESS.elapsed}</span>
            <span>осталось {ESF_PROGRESS.remaining}</span>
          </div>
        </header>
        <div className="esf-exec__progress">
          <span className="esf-exec__fill" style={{ width: `${ESF_PROGRESS.percent}%` }} />
          <em>{ESF_PROGRESS.percent}%</em>
        </div>
        <ul className="esf-log" aria-label="Лог выполнения">
          {ESF_LOG_LINES.map((line) => (
            <li
              key={line.id}
              className={'selected' in line && line.selected ? 'esf-log__row--selected' : undefined}
            >
              {line.text}
            </li>
          ))}
        </ul>
        <footer className="esf-exec__actions-sticky">
          <button type="button" className="vn-btn vn-btn--secondary" disabled>
            Тестовый запуск
          </button>
          <button type="button" className="vn-btn vn-btn--secondary" disabled>
            Остановить
          </button>
          <button type="button" className="vn-btn vn-btn--primary" disabled>
            Запустить
          </button>
        </footer>
      </article>
    </section>
  )
}
