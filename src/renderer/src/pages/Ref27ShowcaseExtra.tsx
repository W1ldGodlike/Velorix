import type { JSX } from 'react'

import { ShowcaseCard, StatusPill } from './ref27-showcase-shared'

/** ref.27 — доп. карточки (табы, модалки, меню, DnD, …). */
export function Ref27ShowcaseExtra(): JSX.Element {
  return (
    <>
      <ShowcaseCard title="Табы">
        <div className="app-ui-showcase-tabs" role="tablist">
          <button
            type="button"
            className="app-ui-showcase-tab app-ui-showcase-tab--active"
            role="tab"
          >
            Обработка
          </button>
          <button type="button" className="app-ui-showcase-tab" role="tab">
            Загрузки
          </button>
          <button type="button" className="app-ui-showcase-tab" role="tab">
            История
          </button>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Вкладки документов">
        <div className="app-ui-showcase-doc-tabs">
          <button type="button" className="app-ui-showcase-doc-tab app-ui-showcase-doc-tab--active">
            Project 001
          </button>
          <button type="button" className="app-ui-showcase-doc-tab">
            Project 002
          </button>
          <button type="button" className="app-ui-showcase-doc-tab">
            + Новый
          </button>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Поиск">
        <div className="app-ui-showcase-search">
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">По умолчанию</span>
            <input type="search" className="app-input" placeholder="Поиск по проектам…" />
          </label>
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">Фокус</span>
            <input
              type="search"
              className="app-input app-ui-showcase-force-focus"
              defaultValue="ffmpeg"
            />
          </label>
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">Ошибка</span>
            <input
              type="search"
              className="app-input app-ui-showcase-input-error"
              defaultValue="???query"
            />
          </label>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Модальное окно">
        <div className="app-ui-showcase-modal" role="dialog" aria-labelledby="ref27-modal-title">
          <h3 id="ref27-modal-title" className="app-ui-showcase-card-title">
            Удалить проект?
          </h3>
          <p className="app-settings-subtitle">
            Действие необратимо. Файлы на диске не удаляются автоматически.
          </p>
          <div className="app-ui-showcase-modal-actions">
            <button type="button" className="app-btn">
              Отмена
            </button>
            <button type="button" className="app-btn app-btn-danger">
              Удалить
            </button>
          </div>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Загрузка">
        <div className="app-ui-showcase-loading-ring">
          <div className="app-ui-showcase-loading-donut" aria-hidden>
            <span>76%</span>
          </div>
          <div>
            <strong>Экспорт видео</strong>
            <p className="app-settings-subtitle">Осталось ~2 мин</p>
          </div>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Контекстное меню">
        <div className="app-ui-showcase-menu" role="menu">
          <button type="button" className="app-ui-showcase-menu-item" role="menuitem">
            Открыть
          </button>
          <button type="button" className="app-ui-showcase-menu-item" role="menuitem">
            Переименовать
          </button>
          <button
            type="button"
            className="app-ui-showcase-menu-item app-ui-showcase-menu-item--danger"
            role="menuitem"
          >
            Удалить
          </button>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Дерево">
        <div className="app-ui-showcase-tree">
          <div className="app-ui-showcase-tree-item app-ui-showcase-tree-item--active">▾ Медиа</div>
          <div className="app-ui-showcase-tree-item app-ui-showcase-tree-item--nested">
            clip_001.mp4
          </div>
          <div className="app-ui-showcase-tree-item app-ui-showcase-tree-item--nested">
            clip_002.mov
          </div>
          <div className="app-ui-showcase-tree-item">▸ Экспорт</div>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Подсказка">
        <div className="app-ui-showcase-tooltip-wrap">
          <button type="button" className="app-btn app-btn-secondary">
            GPU
          </button>
          <div className="app-ui-showcase-tooltip" role="tooltip">
            RTX 4090 · 62 °C · нагрузка 48%
          </div>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Перетаскивание">
        <div className="app-ui-showcase-controls-stack">
          <div className="app-ui-showcase-dropzone">Перетащите файлы сюда</div>
          <div className="app-ui-showcase-dropzone app-ui-showcase-dropzone--active">
            Можно отпустить
          </div>
          <div className="app-ui-showcase-dropzone app-ui-showcase-dropzone--reject">
            Нельзя добавить
          </div>
          <div className="app-ui-showcase-drag-states">
            <span className="app-ui-showcase-drag-chip app-ui-showcase-drag-chip--ok">
              Can drop
            </span>
            <span className="app-ui-showcase-drag-chip app-ui-showcase-drag-chip--no">
              Cannot drop
            </span>
            <span className="app-ui-showcase-drag-chip">Moving</span>
          </div>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Боковая панель (состояния)">
        <div className="app-ui-showcase-sidebar-states">
          <div className="app-ui-showcase-sidebar-item">
            <span className="app-ui-showcase-sidebar-glyph" aria-hidden />
            Обработка
          </div>
          <div className="app-ui-showcase-sidebar-item app-ui-showcase-sidebar-item--hover">
            <span className="app-ui-showcase-sidebar-glyph" aria-hidden />
            Загрузки
          </div>
          <div className="app-ui-showcase-sidebar-item app-ui-showcase-sidebar-item--active">
            <span className="app-ui-showcase-sidebar-glyph" aria-hidden />
            Инструменты
          </div>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Плеер">
        <div className="app-ui-showcase-player">
          <button type="button" className="app-ui-showcase-icon-btn" aria-label="Назад">
            ◀
          </button>
          <button
            type="button"
            className="app-ui-showcase-icon-btn app-ui-showcase-icon-btn--primary"
            aria-label="Пауза"
          >
            ❚❚
          </button>
          <button type="button" className="app-ui-showcase-icon-btn" aria-label="Вперёд">
            ▶
          </button>
          <input
            type="range"
            className="app-ui-showcase-range vn-progress-neon"
            defaultValue={35}
            min={0}
            max={100}
            aria-label="Позиция"
          />
          <StatusPill label="00:12:34" tone="info" />
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="Аватары">
        <div className="app-ui-showcase-avatar-row">
          <span className="app-ui-showcase-avatar">
            VG
            <span className="app-ui-showcase-avatar-dot" aria-hidden />
          </span>
          <span className="app-ui-showcase-avatar">
            AI
            <span
              className="app-ui-showcase-avatar-dot app-ui-showcase-avatar-dot--away"
              aria-hidden
            />
          </span>
          <span className="app-ui-showcase-avatar">
            FX
            <span
              className="app-ui-showcase-avatar-dot app-ui-showcase-avatar-dot--busy"
              aria-hidden
            />
          </span>
        </div>
      </ShowcaseCard>

      <ShowcaseCard title="График">
        <div className="app-ui-showcase-sparkline" aria-hidden>
          <span style={{ height: '35%' }} />
          <span style={{ height: '55%' }} />
          <span style={{ height: '80%' }} />
          <span style={{ height: '45%' }} />
          <span style={{ height: '100%' }} />
          <span style={{ height: '60%' }} />
        </div>
      </ShowcaseCard>
    </>
  )
}
