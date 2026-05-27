import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_UI_COMPONENTS_REL } from '../../../shared/velorix-neon-theme-tokens'

import { Ref27PrimitivesPalette } from './Ref27PrimitivesPalette'
import { Ref27ShowcaseExtra } from './Ref27ShowcaseExtra'
import { PillSwitch, ShowcaseCard, StatusPill } from './ref27-showcase-shared'
import type { StatusTone } from './ref27-showcase-shared'

const TABLE_ROWS: Array<{
  name: string
  status: string
  size: string
  date: string
  tone: StatusTone
}> = [
  { name: 'Project 001', status: 'Готово', size: '246 GB', date: '14.05.2026', tone: 'ready' },
  {
    name: 'Project 002',
    status: 'Обработка',
    size: '18.8 GB',
    date: '13.05.2026',
    tone: 'processing'
  },
  { name: 'Project 003', status: 'Ошибка', size: '8.7 GB', date: '12.05.2026', tone: 'error' },
  { name: 'Project 004', status: 'Внимание', size: '1.1 GB', date: '11.05.2026', tone: 'attention' }
]

const COMMAND_ROWS = [
  { label: 'Открыть медиа', shortcut: 'Ctrl+K' },
  { label: 'Повторить экспорт', shortcut: 'Ctrl+K' },
  { label: 'Открыть инспектор', shortcut: 'Ctrl+K' }
] as const

const TOAST_SAMPLES: Array<{ title: string; body: string; tone: StatusTone }> = [
  { title: 'Экспорт завершён', body: 'Файл сохранён в папку вывода.', tone: 'ready' },
  { title: 'Проверьте настройки', body: 'Битрейт выше рекомендуемого.', tone: 'attention' },
  { title: 'Ошибка FFmpeg', body: 'Кодек не поддерживается.', tone: 'error' },
  { title: 'Обновление доступно', body: 'Сборка 1.7.1 готова к установке.', tone: 'info' }
]

const PROGRESS_SAMPLES = [
  { label: '32%', value: 32 },
  { label: '70%', value: 70 },
  { label: '100%', value: 100 }
] as const

/** ref.27 — UI Components / States (components grid; ref.26 states — отдельный срез). */
export function Ref27ComponentsPage(): JSX.Element {
  return (
    <section
      className="app-tools-workspace-shell app-ui-showcase-shell"
      aria-label="UI Components"
      aria-describedby="ref27-hint"
    >
      <header className="app-tools-workspace-head">
        <div className="app-tools-workspace-copy">
          <h1 className="app-settings-title">UI Components / States</h1>
          <p id="ref27-hint" className="app-settings-subtitle">
            Эталон: {VELORIX_NEON_REFERENCE_UI_COMPONENTS_REL} — rebuild UI ZERO (neon.1).
          </p>
        </div>
      </header>

      <div className="app-ui-showcase-grid" role="list">
        <Ref27PrimitivesPalette />
        <ShowcaseCard title="Кнопки">
          <div className="app-ui-showcase-button-row">
            <button type="button" className="app-btn app-btn-primary">
              Primary
            </button>
            <button type="button" className="app-btn app-btn-secondary">
              Secondary
            </button>
            <button type="button" className="app-btn">
              Default
            </button>
            <button type="button" className="app-btn app-btn-warn">
              Warning
            </button>
            <button type="button" className="app-btn app-btn-danger">
              Danger
            </button>
            <button type="button" className="app-btn" disabled>
              Disabled
            </button>
          </div>
        </ShowcaseCard>

        <ShowcaseCard title="Переключатели и чекбоксы">
          <div className="app-ui-showcase-controls-stack">
            <div className="app-ui-showcase-toggle-row">
              <PillSwitch label="По умолчанию" active={false} />
              <PillSwitch label="Активно" active />
              <PillSwitch label="Отключено" active={false} disabled />
            </div>
            <div className="app-ui-showcase-checkbox-row">
              <label>
                <input type="checkbox" /> По умолчанию
              </label>
              <label>
                <input type="checkbox" defaultChecked /> Выбрано
              </label>
              <label>
                <input type="checkbox" disabled /> Отключено
              </label>
              <label>
                <input type="radio" name="ref27-radio" defaultChecked /> Активно
              </label>
              <label>
                <input type="radio" name="ref27-radio" /> По умолчанию
              </label>
            </div>
          </div>
        </ShowcaseCard>

        <ShowcaseCard title="Поля ввода">
          <div className="app-ui-showcase-field-grid">
            <label className="app-ui-showcase-field">
              <span className="app-ui-showcase-field-label">По умолчанию</span>
              <input type="text" className="app-input" defaultValue="Project 001" />
            </label>
            <label className="app-ui-showcase-field">
              <span className="app-ui-showcase-field-label">Фокус</span>
              <input
                type="text"
                className="app-input app-ui-showcase-force-focus"
                defaultValue="Ctrl+K"
              />
            </label>
            <label className="app-ui-showcase-field">
              <span className="app-ui-showcase-field-label">Ошибка</span>
              <input
                type="text"
                className="app-input app-ui-showcase-input-error"
                defaultValue="Неверный путь"
              />
            </label>
            <label className="app-ui-showcase-field">
              <span className="app-ui-showcase-field-label">Успех</span>
              <input
                type="text"
                className="app-input app-ui-showcase-input-success"
                defaultValue="Путь проверен"
              />
            </label>
            <label className="app-ui-showcase-field">
              <span className="app-ui-showcase-field-label">Отключено</span>
              <input type="text" className="app-input" defaultValue="—" disabled />
            </label>
          </div>
        </ShowcaseCard>

        <ShowcaseCard title="Выпадающие списки">
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">Пресет экспорта</span>
            <select className="app-settings-select" defaultValue="h264">
              <option value="h264">H.264 — MP4</option>
              <option value="hevc">HEVC — MP4</option>
              <option value="prores">ProRes — MOV</option>
            </select>
          </label>
        </ShowcaseCard>

        <ShowcaseCard title="Бейджи">
          <div className="app-ui-showcase-badge-row">
            <span className="app-ui-showcase-badge app-ui-showcase-badge--accent">NEON</span>
            <span className="app-ui-showcase-badge">Beta</span>
            <span className="app-ui-showcase-badge app-ui-showcase-badge--count">99+</span>
            <StatusPill label="Готово" tone="ready" />
            <StatusPill label="Ожидание" tone="info" />
          </div>
        </ShowcaseCard>

        <ShowcaseCard title="Тосты">
          <div className="app-ui-showcase-toast-stack">
            {TOAST_SAMPLES.map((toast) => (
              <div
                key={toast.title}
                className={`app-ui-showcase-toast app-ui-showcase-toast--${toast.tone}`}
              >
                <strong>{toast.title}</strong>
                <p>{toast.body}</p>
              </div>
            ))}
          </div>
        </ShowcaseCard>

        <ShowcaseCard title="Прогресс">
          <div className="app-ui-showcase-progress-stack">
            {PROGRESS_SAMPLES.map((row) => (
              <div key={row.label} className="app-ui-showcase-progress-row">
                <span>{row.label}</span>
                <div className="app-ui-showcase-progress-track">
                  <span
                    className="app-ui-showcase-progress-fill"
                    style={{ width: `${row.value}%` }}
                  />
                </div>
              </div>
            ))}
            <label className="app-ui-showcase-field">
              <span className="app-ui-showcase-field-label">Слайдер</span>
              <input
                type="range"
                className="app-ui-showcase-range vn-progress-neon"
                defaultValue={50}
                min={0}
                max={100}
              />
            </label>
          </div>
        </ShowcaseCard>

        <ShowcaseCard title="Карточки списка">
          <div className="app-ui-showcase-card-grid">
            <div className="app-ui-showcase-item-card">
              <strong>Project 001</strong>
              <span>Обычная</span>
            </div>
            <div className="app-ui-showcase-item-card app-ui-showcase-item-card--selected">
              <strong>Project 002</strong>
              <span>Выбрана</span>
            </div>
            <div className="app-ui-showcase-item-card app-ui-showcase-item-card--active">
              <strong>Project 003</strong>
              <span>Активная</span>
            </div>
            <div className="app-ui-showcase-item-card app-ui-showcase-item-card--disabled">
              <strong>Project 004</strong>
              <span>Отключена</span>
            </div>
          </div>
        </ShowcaseCard>

        <ShowcaseCard title="Таблица">
          <div className="app-ui-showcase-table-wrap">
            <table className="app-ui-showcase-table">
              <thead>
                <tr>
                  <th scope="col">Имя</th>
                  <th scope="col">Статус</th>
                  <th scope="col">Размер</th>
                  <th scope="col">Дата</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_ROWS.map((row) => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>
                      <StatusPill label={row.status} tone={row.tone} />
                    </td>
                    <td>{row.size}</td>
                    <td>{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ShowcaseCard>

        <ShowcaseCard title="Таймлайн (фрагмент)">
          <div className="app-ui-showcase-timeline">
            <div className="app-ui-showcase-timeline-strip">
              <span className="app-ui-showcase-timeline-segment" />
              <span className="app-ui-showcase-timeline-segment app-ui-showcase-timeline-segment--selected" />
              <span className="app-ui-showcase-timeline-segment" />
            </div>
            <div className="app-ui-showcase-timeline-badges">
              <StatusPill label="V1" tone="info" />
              <StatusPill label="A1" tone="processing" />
            </div>
          </div>
        </ShowcaseCard>

        <ShowcaseCard title="Командная палитра">
          <div className="app-ui-showcase-palette">
            {COMMAND_ROWS.map((row) => (
              <button key={row.label} type="button" className="app-ui-showcase-palette-row">
                <span>{row.label}</span>
                <span className="app-ui-showcase-palette-shortcut">{row.shortcut}</span>
              </button>
            ))}
          </div>
        </ShowcaseCard>

        <ShowcaseCard title="Строка состояния">
          <div className="app-ui-showcase-statusbar">
            <span>Project 001 · 00:12:34 · 3840×2160</span>
            <span className="app-ui-showcase-statusbar-sep" aria-hidden />
            <StatusPill label="Готово" tone="ready" />
            <span className="app-ui-showcase-statusbar-sep" aria-hidden />
            <StatusPill label="Обработка" tone="processing" />
          </div>
        </ShowcaseCard>

        <ShowcaseCard title="Скелетон">
          <div className="app-ui-showcase-skeleton-card" aria-hidden>
            <span className="app-ui-showcase-skeleton app-ui-showcase-skeleton--title" />
            <span className="app-ui-showcase-skeleton app-ui-showcase-skeleton--line" />
            <span className="app-ui-showcase-skeleton app-ui-showcase-skeleton--line app-ui-showcase-skeleton--line-short" />
            <span className="app-ui-showcase-skeleton app-ui-showcase-skeleton--bar" />
          </div>
        </ShowcaseCard>

        <Ref27ShowcaseExtra />
      </div>
    </section>
  )
}
