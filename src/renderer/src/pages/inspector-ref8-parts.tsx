import type { JSX } from 'react'

import {
  INSPECTOR_ANALYSIS,
  INSPECTOR_FILE,
  INSPECTOR_FILMSTRIP,
  INSPECTOR_STREAMS,
  INSPECTOR_TECH_AUDIO,
  INSPECTOR_TECH_VIDEO,
  INSPECTOR_TIMECODE,
  INSPECTOR_TOOLS
} from './inspector-ref8-data'

export function InspectorPreviewPlayer(): JSX.Element {
  return (
    <section className="inspector-player vn-surface-glass" aria-label="Превью">
      <div className="inspector-player__scene" aria-hidden />
      <div className="inspector-player__transport">
        <button type="button" className="inspector-transport-btn" disabled title="Play">
          <span className="inspector-glyph inspector-glyph--play processing-glyph" />
        </button>
        <button type="button" className="inspector-transport-btn" disabled title="Skip">
          <span className="inspector-glyph inspector-glyph--skip processing-glyph" />
        </button>
        <div className="inspector-player__scrub" aria-hidden>
          <span className="inspector-player__scrub-fill" />
        </div>
        <span className="inspector-player__tc">
          {INSPECTOR_TIMECODE.current} / {INSPECTOR_TIMECODE.total}
        </span>
        <button type="button" className="inspector-transport-btn" disabled title="Screenshot">
          <span className="inspector-glyph inspector-glyph--camera processing-glyph" />
        </button>
      </div>
    </section>
  )
}

export function InspectorOverviewPanels(): JSX.Element {
  const f = INSPECTOR_FILE
  return (
    <div className="inspector-overview">
      <InspectorPreviewPlayer />
      <section className="inspector-panel vn-surface-glass">
        <h2>Основная информация</h2>
        <dl className="inspector-kv">
          <div>
            <dt>Файл</dt>
            <dd>{f.name}</dd>
          </div>
          <div>
            <dt>Путь</dt>
            <dd className="inspector-kv__path">{f.path}</dd>
          </div>
          <div>
            <dt>Контейнер</dt>
            <dd>{f.container}</dd>
          </div>
          <div>
            <dt>Длительность</dt>
            <dd>{f.duration}</dd>
          </div>
          <div>
            <dt>Размер</dt>
            <dd>{f.size}</dd>
          </div>
          <div>
            <dt>Создан / изменён</dt>
            <dd>
              {f.created} · {f.modified}
            </dd>
          </div>
          <div>
            <dt>Программа</dt>
            <dd>{f.app}</dd>
          </div>
          <div>
            <dt>MD5</dt>
            <dd>{f.md5}</dd>
          </div>
        </dl>
        <button type="button" className="inspector-link-btn" disabled>
          Показать все метаданные
        </button>
      </section>
      <section className="inspector-panel vn-surface-glass">
        <h2>Потоки</h2>
        <ul className="inspector-streams">
          {INSPECTOR_STREAMS.map((s) => (
            <li
              key={s.id}
              className={
                s.active ? 'inspector-stream inspector-stream--active' : 'inspector-stream'
              }
            >
              <strong>{s.label}</strong>
              <span>{s.detail}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="inspector-panel vn-surface-glass">
        <h2>Анализ видео</h2>
        <dl className="inspector-kv inspector-kv--compact">
          {INSPECTOR_ANALYSIS.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>
      <section className="inspector-scopes vn-surface-glass">
        <div className="inspector-scope">
          <h2>Гистограмма RGB</h2>
          <div className="inspector-scope__chart inspector-scope__chart--hist" aria-hidden />
        </div>
        <div className="inspector-scope">
          <h2>Вектороскоп</h2>
          <div className="inspector-scope__chart inspector-scope__chart--vector" aria-hidden />
        </div>
      </section>
      <section className="inspector-filmstrip vn-surface-glass" aria-label="Превью кадров">
        <h2>Превью кадров</h2>
        <div className="inspector-filmstrip__row">
          {INSPECTOR_FILMSTRIP.map((frame) => (
            <figure key={frame.id} className="inspector-filmstrip__thumb">
              <span className="inspector-filmstrip__img" aria-hidden />
              <figcaption>{frame.time}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  )
}

export function InspectorTechRail(): JSX.Element {
  return (
    <aside className="inspector-rail" aria-label="Технические детали">
      <div className="inspector-rail__scroll">
        <section className="inspector-rail__section vn-surface-glass">
          <header className="inspector-rail__head">
            <h2>Технические детали</h2>
            <button type="button" className="inspector-link-btn" disabled>
              Копировать всё
            </button>
          </header>
          <h3>Video Stream #1</h3>
          <dl className="inspector-kv inspector-kv--rail">
            {INSPECTOR_TECH_VIDEO.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <h3>Audio Stream #1</h3>
          <dl className="inspector-kv inspector-kv--rail">
            {INSPECTOR_TECH_AUDIO.map((row) => (
              <div key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
      <section className="inspector-rail__tools-sticky vn-surface-glass" aria-label="Инструменты">
        <h2>Инструменты</h2>
        <ul className="inspector-tools">
          {INSPECTOR_TOOLS.map((tool) => (
            <li key={tool}>
              <button type="button" className="inspector-tools__btn" disabled>
                {tool}
              </button>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  )
}
