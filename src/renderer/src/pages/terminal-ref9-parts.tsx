import type { JSX } from 'react'

import { TERMINAL_LOG_LINES, TERMINAL_RAIL } from './terminal-ref9-data'

export function TerminalLogView(): JSX.Element {
  return (
    <div className="terminal-log vn-surface-glass" aria-label="Лог">
      <pre className="terminal-log__body">
        {TERMINAL_LOG_LINES.map((line) => (
          <span key={line} className="terminal-log__line">
            {line}
          </span>
        ))}
      </pre>
    </div>
  )
}

export function TerminalSettingsRail(): JSX.Element {
  const r = TERMINAL_RAIL
  return (
    <aside className="terminal-rail" aria-label="Настройки терминала">
      <div className="terminal-rail__scroll">
        <section className="terminal-rail__section vn-surface-glass">
          <h2 className="terminal-rail__title">Вывод</h2>
          <div className="terminal-rail__field">
            <span>Уровень логов</span>
            <span className="terminal-select" aria-disabled>
              {r.logLevel}
            </span>
          </div>
          <TerminalToggle label="Цветной вывод" on={r.colorOutput} />
          <TerminalToggle label="Временные метки" on={r.timestamps} />
          <TerminalToggle label="Автопрокрутка" on={r.autoscroll} />
          <TerminalToggle label="Ограничить строки" on={r.limitLines} />
          <div className="terminal-rail__field">
            <span>Макс. строк</span>
            <span className="terminal-select" aria-disabled>
              {r.maxLines}
            </span>
          </div>
        </section>
        <section className="terminal-rail__section vn-surface-glass">
          <h2 className="terminal-rail__title">Фильтры</h2>
          <TerminalToggle label="Только ошибки" on={r.errorsOnly} />
          <div className="terminal-rail__field terminal-rail__field--stack">
            <span>Include</span>
            <span className="terminal-input" aria-disabled>
              {r.includeFilter || '—'}
            </span>
          </div>
          <div className="terminal-rail__field terminal-rail__field--stack">
            <span>Exclude</span>
            <span className="terminal-input" aria-disabled>
              {r.excludeFilter || '—'}
            </span>
          </div>
        </section>
      </div>
      <section className="terminal-rail__save-sticky vn-surface-glass" aria-label="Сохранение">
        <h2 className="terminal-rail__title">Сохранение</h2>
        <TerminalToggle label="Сохранять в файл" on={r.saveToFile} />
        <div className="terminal-rail__field terminal-rail__field--stack">
          <span>Путь</span>
          <span className="terminal-input" aria-disabled>
            {r.savePath}
          </span>
        </div>
        <button type="button" className="vn-btn vn-btn--secondary terminal-rail__save" disabled>
          Сохранить сейчас
        </button>
      </section>
    </aside>
  )
}

function TerminalToggle(props: { label: string; on: boolean }): JSX.Element {
  const { label, on } = props
  return (
    <div className="terminal-rail__field terminal-rail__field--toggle">
      <span>{label}</span>
      <span
        className={on ? 'terminal-toggle terminal-toggle--on' : 'terminal-toggle'}
        aria-hidden
      />
    </div>
  )
}
