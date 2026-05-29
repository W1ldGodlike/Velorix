import type { JSX } from 'react'

import type { SlideshowImageMock } from './slideshow-ref15-data'
import {
  SS_ACTIVE_TASKS,
  SS_IMAGES,
  SS_IMAGE_COUNT,
  SS_MUSIC,
  SS_OUTPUT_PATH,
  SS_RECENT,
  SS_RESOURCES,
  SS_SHORTCUTS,
  SS_TIMELINE_MARKS,
  SS_TRANSITIONS,
  SS_WORKSPACE_SUMMARY
} from './slideshow-ref15-data'

function SlideshowImageRow(props: { image: SlideshowImageMock }): JSX.Element {
  const { image } = props
  return (
    <div className={image.selected ? 'ss-seq-row ss-seq-row--selected' : 'ss-seq-row'}>
      <span className="ss-seq-row__thumb" aria-hidden />
      <div className="ss-seq-row__meta">
        <strong>{image.name}</strong>
        <span>
          {image.dims} · {image.size}
        </span>
      </div>
      <span className="ss-seq-row__dur">{image.duration}</span>
    </div>
  )
}

export function SlideshowUtilityRail(): JSX.Element {
  return (
    <aside className="ic-rail ss-rail" aria-label="Система">
      <div className="ic-rail__scroll">
        <section className="ic-rail__section vn-surface-glass">
          <h2 className="ic-rail__title">РЕСУРСЫ СИСТЕМЫ</h2>
          {SS_RESOURCES.map((res) => (
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
            {SS_SHORTCUTS.map((item) => (
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
            {SS_RECENT.map((item) => (
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
        {SS_ACTIVE_TASKS.map((task) => (
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
        <p className="ic-rail__damage">Проверка целостности · ETA 01:17:08</p>
      </section>
    </aside>
  )
}

export function SlideshowWorkspace(): JSX.Element {
  return (
    <div className="ss-workspace">
      <header className="ss-workspace__head">
        <div className="ss-workspace__head-main">
          <p className="ss-workspace__eyebrow">Слайдшоу · sequence</p>
          <h1>СЛАЙДШОУ ИЗ ИЗОБРАЖЕНИЙ</h1>
          <p>Создание видео из последовательности изображений с переходами и музыкой</p>
        </div>
        <div className="ss-workspace__head-tools">
          <span className="ss-workspace__head-chip">12 frames</span>
          <button type="button" className="vn-btn vn-btn--primary" disabled>
            Добавить изображения ▾
          </button>
        </div>
      </header>
      <p className="ss-workspace__summary">{SS_WORKSPACE_SUMMARY}</p>

      <div className="ss-workspace__scroll">
        <div className="ss-workspace__top">
          <section className="ss-seq vn-surface-glass" aria-labelledby="ss-seq-title">
            <h2 id="ss-seq-title">ПОСЛЕДОВАТЕЛЬНОСТЬ ИЗОБРАЖЕНИЙ ({SS_IMAGE_COUNT})</h2>
            <div className="ss-seq__list">
              {SS_IMAGES.map((image) => (
                <SlideshowImageRow key={image.id} image={image} />
              ))}
            </div>
            <footer className="ss-seq__foot">
              <span>Общая длительность: 00:00:48</span>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                Очистить всё
              </button>
            </footer>
          </section>

          <section className="ss-preview vn-surface-glass" aria-label="Превью">
            <div className="ss-preview__frame" aria-hidden />
            <div className="ss-preview__scrub">
              <span className="ss-preview__fill" aria-hidden />
            </div>
            <div className="ss-preview__controls">
              <button type="button" disabled aria-label="Назад">
                ⏮
              </button>
              <button type="button" disabled aria-label="Воспроизведение">
                ▶
              </button>
              <button type="button" disabled aria-label="Вперёд">
                ⏭
              </button>
              <span className="ss-preview__time">00:00:21 / 00:00:48</span>
              <span>16:9</span>
              <button type="button" disabled aria-label="На весь экран">
                ⛶
              </button>
            </div>
          </section>

          <section className="ss-settings vn-surface-glass" aria-labelledby="ss-settings-title">
            <h2 id="ss-settings-title">НАСТРОЙКИ СЛАЙДШОУ</h2>
            <label className="ss-field">
              <span>FPS</span>
              <span className="vn-input ss-field__select">30 ▾</span>
            </label>
            <label className="ss-field">
              <span>Длительность кадра</span>
              <span className="vn-input ss-field__select">4.0 сек ▾</span>
            </label>
            <label className="ss-field">
              <span>Переход по умолчанию</span>
              <span className="vn-input ss-field__select">Fade ▾</span>
            </label>
            <label className="ss-field">
              <span>Разрешение</span>
              <span className="vn-input ss-field__select">3840×2160 4K ▾</span>
            </label>
            <label className="ss-field">
              <span>Соотношение сторон</span>
              <span className="vn-input ss-field__select">16:9 ▾</span>
            </label>
            <label className="ss-kenburns">
              <span>Ken Burns</span>
              <span className="ic-toggle ic-toggle--on" aria-hidden />
            </label>
          </section>
        </div>

        <section className="ss-timeline vn-surface-glass" aria-label="Таймлайн">
          <div className="ss-timeline__ruler">
            {SS_TIMELINE_MARKS.map((mark) => (
              <span key={mark}>{mark}</span>
            ))}
          </div>
          <div className="ss-timeline__playhead" aria-hidden />
          <div className="ss-timeline__track">
            <span className="ss-timeline__label">Images</span>
            <div className="ss-timeline__thumbs" aria-hidden />
          </div>
          <div className="ss-timeline__track">
            <span className="ss-timeline__label">Transitions (fx)</span>
            <div className="ss-timeline__fx" aria-hidden />
          </div>
          <div className="ss-timeline__track ss-timeline__track--audio">
            <span className="ss-timeline__label">Music</span>
            <div className="ss-timeline__wave" aria-hidden />
            <span className="ss-timeline__vol">100%</span>
          </div>
        </section>

        <div className="ss-workspace__bottom">
          <section className="ss-transitions vn-surface-glass" aria-labelledby="ss-trans-title">
            <h2 id="ss-trans-title">ПЕРЕХОДЫ</h2>
            <div className="ss-transitions__grid">
              {SS_TRANSITIONS.map((tr) => (
                <button
                  key={tr.id}
                  type="button"
                  className={
                    tr.id === 'fade' ? 'ss-trans-btn ss-trans-btn--active' : 'ss-trans-btn'
                  }
                  disabled
                >
                  {tr.label}
                </button>
              ))}
            </div>
          </section>

          <section className="ss-music vn-surface-glass" aria-labelledby="ss-music-title">
            <h2 id="ss-music-title">МУЗЫКА</h2>
            <p className="ss-music__track">
              <strong>{SS_MUSIC.name}</strong>
              <span>{SS_MUSIC.duration}</span>
            </p>
            <button type="button" className="vn-btn vn-btn--secondary" disabled>
              Выбрать трек
            </button>
            <label className="ss-field">
              <span>Громкость</span>
              <span className="ng-field__slider" aria-hidden />
            </label>
            <label className="ss-check">
              <input type="checkbox" defaultChecked disabled readOnly />
              Loop
            </label>
            <label className="ss-check">
              <input type="checkbox" defaultChecked disabled readOnly />
              Fade out · 2.0s
            </label>
          </section>
        </div>
      </div>

      <footer className="ss-export-sticky">
        <label className="ss-field">
          <span>Формат</span>
          <span className="vn-input ss-field__select">MP4 H.264 ▾</span>
        </label>
        <label className="ss-field">
          <span>Качество</span>
          <span className="vn-input ss-field__select">High ▾</span>
        </label>
        <label className="ss-field">
          <span>Битрейт</span>
          <span className="vn-input ss-field__select">50 Mbps ▾</span>
        </label>
        <label className="ss-output">
          <span>Папка вывода</span>
          <div className="ic-output__row">
            <input className="vn-input" type="text" value={SS_OUTPUT_PATH} readOnly disabled />
            <button type="button" className="vn-btn vn-btn--secondary" disabled>
              Обзор…
            </button>
          </div>
        </label>
        <button type="button" className="vn-btn vn-btn--primary ss-export__btn" disabled>
          <span className="ss-glyph ss-glyph--export" aria-hidden />
          ЭКСПОРТ ВИДЕО
        </button>
      </footer>
    </div>
  )
}
