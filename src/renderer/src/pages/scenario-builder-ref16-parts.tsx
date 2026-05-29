import type { JSX } from 'react'

import {
  SB_CANVAS_NODES,
  SB_LOG_LINES,
  SB_LOG_TABS,
  SB_NODE_GROUPS,
  SB_WORKSPACE_SUMMARY
} from './scenario-builder-ref16-data'

export function ScenarioBuilderNodePalette(): JSX.Element {
  return (
    <aside className="sb-nodes vn-surface-glass" aria-label="Узлы">
      <div className="sb-nodes__scroll">
        <h2>УЗЛЫ</h2>
        {SB_NODE_GROUPS.map((group) => (
          <section key={group.id} className="sb-nodes__group">
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                <li key={item.id}>
                  <button type="button" className="sb-nodes__item" disabled>
                    <span className={`sb-glyph sb-glyph--${group.id}`} aria-hidden />
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
        <section className="sb-nodes__group">
          <h3>ПЕРЕМЕННЫЕ</h3>
          <p className="sb-nodes__vars-hint">Управление переменными сценария</p>
        </section>
      </div>
      <button type="button" className="vn-btn vn-btn--secondary sb-nodes__import-sticky" disabled>
        Импорт сценария
      </button>
    </aside>
  )
}

export function ScenarioBuilderCanvas(): JSX.Element {
  return (
    <div className="sb-canvas-wrap">
      <div className="sb-canvas__toolbar">
        <span className="vn-input sb-canvas__scenario">Новый сценарий ▾</span>
        <button type="button" disabled aria-label="Отменить">
          ↶
        </button>
        <button type="button" disabled aria-label="Повторить">
          ↷
        </button>
        <button type="button" className="vn-btn vn-btn--secondary" disabled>
          Тестировать
        </button>
        <button type="button" className="vn-btn vn-btn--primary" disabled>
          Запустить
        </button>
        <button type="button" className="vn-btn vn-btn--secondary" disabled>
          Сохранить ▾
        </button>
        <span className="sb-canvas__zoom">100%</span>
        <button type="button" disabled aria-label="Подогнать">
          ⊡
        </button>
      </div>
      <div className="sb-canvas vn-surface-glass" aria-label="Граф сценария">
        <svg className="sb-canvas__wires" aria-hidden>
          <path d="M 12% 18% H 22% V 16%" />
          <path d="M 30% 16% H 40%" />
          <path d="M 48% 16% H 58%" />
          <path d="M 66% 16% H 76%" />
          <path d="M 84% 12% V 8%" />
          <path d="M 84% 20% V 24%" />
        </svg>
        {SB_CANVAS_NODES.map((node) => (
          <article
            key={node.id}
            className={
              node.id === 'n4'
                ? 'sb-node sb-node--active vn-surface-glass'
                : 'sb-node vn-surface-glass'
            }
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            <strong>{node.label}</strong>
            <span className="sb-node__port sb-node__port--out">Выход</span>
            <span className="sb-node__port sb-node__port--in">Вход</span>
          </article>
        ))}
      </div>
    </div>
  )
}

export function ScenarioBuilderLogPanel(): JSX.Element {
  return (
    <footer className="sb-log vn-surface-glass">
      <div className="sb-log__tabs" role="tablist">
        {SB_LOG_TABS.map((tab, index) => (
          <button
            key={tab}
            type="button"
            className={index === 0 ? 'sb-log__tab sb-log__tab--active' : 'sb-log__tab'}
            disabled
          >
            {tab === 'log'
              ? 'ЛОГ ВЫПОЛНЕНИЯ'
              : tab === 'vars'
                ? 'ПЕРЕМЕННЫЕ'
                : tab === 'results'
                  ? 'РЕЗУЛЬТАТЫ'
                  : 'ОШИБКИ'}
          </button>
        ))}
      </div>
      <p className="sb-log__summary">6 записей · последняя: Конвертация 45%</p>
      <div className="sb-log__body">
        <ul className="sb-log__list">
          {SB_LOG_LINES.map((line) => (
            <li
              key={line.id}
              className={'selected' in line && line.selected ? 'sb-log__row--selected' : undefined}
            >
              <time>{line.time}</time>
              <span>{line.text}</span>
            </li>
          ))}
        </ul>
        <aside className="sb-minimap" aria-label="Мини-карта">
          <h3>МИНИ-КАРТА</h3>
          <div className="sb-minimap__view" aria-hidden />
        </aside>
      </div>
    </footer>
  )
}

export function ScenarioBuilderPropertiesRail(): JSX.Element {
  return (
    <aside className="sb-props vn-surface-glass" aria-label="Свойства узла">
      <header className="sb-props__head">
        <span className="sb-glyph sb-glyph--proc" aria-hidden />
        <div>
          <h2>Конвертация</h2>
          <p>Обработка медиафайлов</p>
        </div>
      </header>

      <div className="sb-props__scroll">
        <section className="sb-props__section">
          <h3>ОСНОВНЫЕ</h3>
          <label className="sb-props__field">
            <span>Имя узла</span>
            <input className="vn-input" type="text" value="Конвертация" readOnly disabled />
          </label>
          <label className="sb-props__field">
            <span>Тип операции</span>
            <span className="vn-input sb-props__select">Video to MP4 ▾</span>
          </label>
          <label className="sb-props__field">
            <span>Профиль</span>
            <span className="vn-input sb-props__select">High quality ▾</span>
          </label>
          <label className="sb-props__field">
            <span>Пресет</span>
            <span className="vn-input sb-props__select">Fast ▾</span>
          </label>
          <label className="sb-props__check">
            <input type="checkbox" defaultChecked disabled readOnly />
            Аппаратное ускорение
          </label>
          <label className="sb-props__field">
            <span>Параллельные потоки</span>
            <input className="vn-input" type="text" value="4" readOnly disabled />
          </label>
        </section>

        <section className="sb-props__section">
          <h3>ДОПОЛНИТЕЛЬНЫЕ</h3>
          <label className="sb-props__check">
            <input type="checkbox" defaultChecked disabled readOnly />
            Сохранять метаданные
          </label>
          <label className="sb-props__check">
            <input type="checkbox" defaultChecked disabled readOnly />
            Копировать субтитры
          </label>
          <label className="sb-props__check">
            <input type="checkbox" disabled readOnly />
            Оптимизировать для web
          </label>
        </section>

        <section className="sb-props__section">
          <h3>УСЛОВИЯ ВЫПОЛНЕНИЯ</h3>
          <div className="sb-props__cond-head">
            <span>Только если</span>
            <span className="ic-toggle ic-toggle--on" aria-hidden />
          </div>
          <label className="sb-props__field">
            <span>Статус</span>
            <span className="vn-input sb-props__select">Successfully ▾</span>
          </label>
          <label className="sb-props__field">
            <span>Мин. размер файла</span>
            <input className="vn-input" type="text" value="100 MB" readOnly disabled />
          </label>
        </section>
      </div>

      <footer className="sb-props__foot-sticky">
        <button type="button" className="vn-btn vn-btn--secondary" disabled>
          Отмена
        </button>
        <button type="button" className="vn-btn vn-btn--primary" disabled>
          Сохранить и закрыть
        </button>
      </footer>
    </aside>
  )
}

export function ScenarioBuilderWorkspace(): JSX.Element {
  return (
    <div className="sb-workspace">
      <header className="sb-workspace__head">
        <div className="sb-workspace__head-main">
          <p className="sb-workspace__eyebrow">Сценарии · builder</p>
          <h1>КОНСТРУКТОР СЦЕНАРИЕВ</h1>
          <p>Создание автоматизированных сценариев обработки и workflow</p>
        </div>
        <span className="sb-workspace__head-chip">8 nodes</span>
      </header>
      <p className="sb-workspace__summary">{SB_WORKSPACE_SUMMARY}</p>
      <div className="sb-workspace__body">
        <ScenarioBuilderNodePalette />
        <div className="sb-workspace__center">
          <ScenarioBuilderCanvas />
          <ScenarioBuilderLogPanel />
        </div>
        <ScenarioBuilderPropertiesRail />
      </div>
    </div>
  )
}
