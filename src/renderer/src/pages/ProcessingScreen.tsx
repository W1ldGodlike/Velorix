import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_PROCESSING_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

import {
  A1_CLIPS,
  A2_CLIPS,
  PROCESSING_NAV,
  TIMELINE_RULER_MARKS,
  V1_CLIPS,
  V2_CLIPS,
  V3_CLIPS
} from './processing-ref1-data'
import { RailField, TrackRow } from './processing-ref1-parts'

/** ref.1 — Обработка / editor (mock NLE + FFmpeg rail; not sign-off). */
export function ProcessingScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="processing-shell" id="ref1" data-ref={VELORIX_NEON_REFERENCE_PROCESSING_REL}>
        <aside className="processing-sidebar" aria-label="Навигация">
          <div className="processing-sidebar__brand">
            <span className="processing-sidebar__mark" aria-hidden>
              V
            </span>
            <div>
              <div className="processing-sidebar__logo vn-text-gradient">VELORIX</div>
              <p className="processing-sidebar__version">v1.7.0</p>
            </div>
          </div>
          <section className="processing-sidebar__nav-block" aria-label="Проект">
            <h2 className="processing-sidebar__section-title">ПРОЕКТ</h2>
            <nav className="processing-nav">
              {PROCESSING_NAV.map((item) => (
                <span
                  key={item.slug}
                  className={
                    item.slug === 'processing'
                      ? 'processing-nav__item processing-nav__item--active'
                      : 'processing-nav__item'
                  }
                  aria-current={item.slug === 'processing' ? 'page' : undefined}
                >
                  <span
                    className={`processing-nav__icon processing-nav__icon--${item.slug} processing-glyph`}
                    aria-hidden
                  />
                  {item.label}
                </span>
              ))}
            </nav>
          </section>
          <section
            className="processing-sidebar__project vn-surface-glass"
            aria-label="Активный проект"
          >
            <p className="processing-sidebar__project-name processing-sidebar__project-name--active">
              НОВЫЙ СЕЗОН
            </p>
            <p className="processing-sidebar__project-meta">16:9 · 4K · 60 fps</p>
            <div className="processing-sidebar__storage">
              <span>1.2 / 2.0 TB</span>
              <div className="processing-sidebar__storage-bar">
                <div className="processing-sidebar__storage-fill processing-sidebar__storage-fill--60" />
              </div>
            </div>
          </section>
          <div className="processing-sidebar__gpu vn-surface-glass">
            <div className="processing-sidebar__gpu-head">
              <span className="processing-sidebar__gpu-glyph processing-glyph" aria-hidden />
              <div>
                <strong>NVIDIA RTX 3090</strong>
                <span>24 GB GDDR6X</span>
              </div>
            </div>
            <p className="processing-sidebar__gpu-stats">Загрузка: 68% · Температура: 58°C</p>
            <div className="processing-sidebar__gpu-spark" aria-hidden />
          </div>
          <section className="processing-sidebar__system vn-surface-glass" aria-label="Система">
            <h2 className="processing-sidebar__section-title">Система</h2>
            <div className="processing-sidebar__rings">
              <div className="processing-ring processing-ring--cpu">
                <span>CPU</span>
                <em>18%</em>
              </div>
              <div className="processing-ring processing-ring--ram">
                <span>RAM</span>
                <em>42%</em>
              </div>
              <div className="processing-ring processing-ring--disk">
                <span>Disk</span>
                <em>38%</em>
              </div>
            </div>
            <div className="processing-sidebar__utilities">
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
                className="processing-util-btn processing-util-btn--power processing-glyph"
                disabled
                title="Выход"
              />
            </div>
          </section>
        </aside>

        <section className="processing-center" aria-label="Редактор">
          <header className="processing-center__head">
            <div>
              <h1>Обработка</h1>
              <p>Профессиональная обработка и монтаж медиафайлов</p>
            </div>
          </header>
          <div className="processing-center__body">
            <div className="processing-preview" aria-label="Превью">
              <div className="processing-preview__scene" aria-hidden>
                <span className="processing-preview__car" />
                <span className="processing-preview__watermark">VELORIX</span>
              </div>
              <div className="processing-preview__chrome">
                <span className="processing-preview__zoom">70%</span>
                <button type="button" className="processing-preview__fit" disabled>
                  Вписать ▾
                </button>
                <span className="processing-preview__chrome-spacer" />
                <button
                  type="button"
                  className="processing-preview__chrome-btn"
                  disabled
                  aria-hidden
                >
                  <span className="processing-chrome-glyph processing-chrome-glyph--search processing-glyph" />
                </button>
                <button
                  type="button"
                  className="processing-preview__chrome-btn"
                  disabled
                  aria-hidden
                >
                  <span className="processing-chrome-glyph processing-chrome-glyph--fullscreen processing-glyph" />
                </button>
                <button
                  type="button"
                  className="processing-preview__chrome-btn"
                  disabled
                  aria-hidden
                >
                  <span className="processing-chrome-glyph processing-chrome-glyph--close processing-glyph" />
                </button>
              </div>
              <span className="processing-preview__badge">4K ULTRA HD</span>
              <div className="processing-preview__transport">
                <button type="button" className="processing-preview__tc-box" disabled>
                  01:36:53:08
                  <span className="processing-preview__tc-chevron" aria-hidden>
                    ▾
                  </span>
                </button>
                <button
                  type="button"
                  className="vn-btn vn-btn--secondary vn-btn--icon"
                  disabled
                  aria-hidden
                >
                  <span className="processing-media-glyph processing-media-glyph--skip-start processing-glyph" />
                </button>
                <button
                  type="button"
                  className="vn-btn vn-btn--secondary vn-btn--icon"
                  disabled
                  aria-hidden
                >
                  <span className="processing-media-glyph processing-media-glyph--rewind processing-glyph" />
                </button>
                <button
                  type="button"
                  className="vn-btn vn-btn--primary vn-btn--icon vn-btn--play"
                  aria-label="Пауза"
                >
                  <span className="processing-media-glyph processing-media-glyph--pause processing-glyph" />
                </button>
                <button
                  type="button"
                  className="vn-btn vn-btn--secondary vn-btn--icon"
                  disabled
                  aria-hidden
                >
                  <span className="processing-media-glyph processing-media-glyph--forward processing-glyph" />
                </button>
                <button
                  type="button"
                  className="vn-btn vn-btn--secondary vn-btn--icon"
                  disabled
                  aria-hidden
                >
                  <span className="processing-media-glyph processing-media-glyph--skip-end processing-glyph" />
                </button>
                <span className="processing-preview__transport-tools" aria-hidden>
                  <span className="processing-transport-glyph processing-transport-glyph--camera processing-glyph" />
                  <span className="processing-transport-glyph processing-transport-glyph--pip processing-glyph" />
                  <span className="processing-transport-glyph processing-transport-glyph--crop processing-glyph" />
                </span>
                <label className="processing-preview__volume">
                  <span className="processing-volume-glyph processing-glyph" aria-hidden />
                  <span className="sr-only">Громкость</span>
                  <input type="range" min={0} max={100} defaultValue={72} disabled />
                </label>
              </div>
            </div>
            <div className="processing-timeline" aria-label="Таймлайн">
              <div className="processing-timeline__top">
                <div className="processing-timeline__toolbar">
                  <button
                    type="button"
                    className="vn-btn vn-btn--secondary vn-btn--icon processing-timeline__tool--active"
                    disabled
                    title="Выделение"
                  >
                    <span className="processing-tool-glyph processing-tool-glyph--select processing-glyph" />
                  </button>
                  <button
                    type="button"
                    className="vn-btn vn-btn--secondary vn-btn--icon"
                    disabled
                    title="Blade"
                  >
                    <span className="processing-tool-glyph processing-tool-glyph--blade processing-glyph" />
                  </button>
                  <button
                    type="button"
                    className="vn-btn vn-btn--secondary vn-btn--icon"
                    disabled
                    title="Удалить"
                  >
                    <span className="processing-tool-glyph processing-tool-glyph--delete processing-glyph" />
                  </button>
                  <button
                    type="button"
                    className="vn-btn vn-btn--secondary vn-btn--icon"
                    disabled
                    title="Связать"
                  >
                    <span className="processing-tool-glyph processing-tool-glyph--link processing-glyph" />
                  </button>
                  <button
                    type="button"
                    className="vn-btn vn-btn--secondary vn-btn--icon"
                    disabled
                    title="Группа"
                  >
                    <span className="processing-tool-glyph processing-tool-glyph--group processing-glyph" />
                  </button>
                  <button
                    type="button"
                    className="vn-btn vn-btn--secondary vn-btn--icon"
                    disabled
                    title="Привязка"
                  >
                    <span className="processing-tool-glyph processing-tool-glyph--snap processing-glyph" />
                  </button>
                  <button
                    type="button"
                    className="vn-btn vn-btn--secondary vn-btn--icon"
                    disabled
                    title="Облако"
                  >
                    <span className="processing-tool-glyph processing-tool-glyph--cloud processing-glyph" />
                  </button>
                </div>
                <label className="processing-timeline__zoom">
                  <span className="sr-only">Масштаб таймлайна</span>
                  <span className="processing-timeline__zoom-btn" aria-hidden>
                    −
                  </span>
                  <input type="range" min={0} max={100} defaultValue={42} disabled />
                  <span className="processing-timeline__zoom-btn" aria-hidden>
                    +
                  </span>
                </label>
              </div>
              <div className="processing-timeline__body">
                <div
                  className="processing-timeline__playhead processing-timeline__playhead--38"
                  aria-hidden
                >
                  <span className="processing-timeline__playhead-bubble">01:36:53:08</span>
                </div>
                <div className="processing-timeline__ruler" aria-hidden>
                  <div className="processing-timeline__ruler-ticks" />
                  <div className="processing-timeline__ruler-labels">
                    {TIMELINE_RULER_MARKS.map((mark) => (
                      <span key={mark}>{mark}</span>
                    ))}
                  </div>
                </div>
                <TrackRow id="V3" clips={V3_CLIPS} />
                <TrackRow id="V2" clips={V2_CLIPS} />
                <TrackRow id="V1" clips={V1_CLIPS} active />
                <TrackRow id="A1" clips={A1_CLIPS} audio trackHint="Высокая громк." />
                <TrackRow id="A2" clips={A2_CLIPS} audio showEnvelope />
              </div>
            </div>
          </div>
        </section>

        <aside className="processing-rail" aria-label="FFmpeg">
          <header className="processing-rail__head">
            <div>
              <h2 className="processing-rail__title">НАСТРОЙКИ FFMPEG</h2>
              <p className="processing-rail__subtitle">Профессиональная обработка медиафайлов</p>
            </div>
            <button type="button" className="processing-rail__help" disabled title="Справка">
              ?
            </button>
          </header>
          <details className="processing-rail__section vn-surface-glass" open>
            <summary>ВИДЕО</summary>
            <div className="processing-rail__fields">
              <RailField label="Кодек" value="H.264 (libx264)" />
              <RailField label="Профиль" value="High" />
              <RailField label="Уровень" value="4.1" />
              <RailField label="Пресет" value="Slow" />
              <div className="processing-rail__field processing-rail__field--slider">
                <span className="processing-rail__field-label">CRF</span>
                <span className="processing-rail__slider-mock">
                  <span className="processing-rail__slider-fill processing-rail__slider-fill--crf" />
                  <em>18</em>
                </span>
              </div>
              <RailField label="Разрешение" value="3840×2160 (4K)" />
              <div className="processing-rail__field processing-rail__field--fps">
                <span className="processing-rail__field-label">Частота кадров</span>
                <span className="processing-rail__fps">
                  <span className="processing-rail__select" aria-disabled>
                    60
                    <span className="processing-rail__chevron" aria-hidden>
                      ▾
                    </span>
                  </span>
                  <span className="processing-rail__fps-unit">fps</span>
                </span>
              </div>
              <label className="processing-rail__toggle">
                <span>Двухпроходное кодирование</span>
                <span className="processing-rail__toggle-value">
                  <em>ON</em>
                  <span
                    className="processing-rail__switch processing-rail__switch--on"
                    aria-hidden
                  />
                </span>
              </label>
              <RailField label="Аппаратное ускорение" value="NVIDIA NVENC" />
            </div>
          </details>
          <details className="processing-rail__section vn-surface-glass">
            <summary>АУДИО</summary>
            <div className="processing-rail__fields">
              <RailField label="Кодек" value="AAC" />
              <RailField label="Битрейт" value="320k" />
            </div>
          </details>
          <details className="processing-rail__section vn-surface-glass">
            <summary>ФОРМАТ</summary>
            <div className="processing-rail__fields">
              <RailField label="Контейнер" value="MP4" />
            </div>
          </details>
          <details className="processing-rail__section vn-surface-glass">
            <summary>ПРЕСЕТЫ</summary>
            <p className="processing-rail__hint">YouTube 4K Premium</p>
          </details>
          <details className="processing-rail__section vn-surface-glass">
            <summary>СЦЕНАРИИ</summary>
            <p className="processing-rail__hint">— mock</p>
          </details>
          <details className="processing-rail__section vn-surface-glass">
            <summary>ФИЛЬТРЫ</summary>
            <p className="processing-rail__hint">— mock</p>
          </details>
          <details className="processing-rail__section vn-surface-glass">
            <summary>МЕТАДАННЫЕ</summary>
            <p className="processing-rail__hint">— mock</p>
          </details>
          <div className="processing-rail__export">
            <button
              type="button"
              className="vn-btn vn-btn--primary processing-rail__export-btn"
              disabled
            >
              <span className="processing-rail__export-icon processing-glyph" aria-hidden />
              НАЧАТЬ ЭКСПОРТ
            </button>
            <div className="processing-rail__preset-card vn-surface-glass">
              <strong>YouTube 4K Premium</strong>
              <p>
                H.264 / AAC / 3840×2160 / 60fps
                <span className="processing-rail__preset-gear processing-glyph" aria-hidden />
              </p>
            </div>
          </div>
        </aside>

        <footer className="processing-statusbar">
          <div className="processing-statusbar__left">
            <span className="processing-statusbar__ready">
              <span className="processing-statusbar__dot" aria-hidden />
              Готово
            </span>
          </div>
          <div className="processing-statusbar__center">
            <span>
              <strong>Проект:</strong> НОВЫЙ СЕЗОН.vlxr
            </span>
            <span>
              <strong>Длительность:</strong> 01:36:53:08
            </span>
            <span>
              <strong>Разрешение:</strong> 3840×2160 (4K)
            </span>
            <span>
              <strong>Кадров:</strong> 174 708
            </span>
            <span>
              <strong>Выделение:</strong> 00:00:00:00
            </span>
          </div>
          <div className="processing-statusbar__right">
            <span>
              <strong>FFmpeg:</strong> 6.1.1
            </span>
            <span>
              <strong>GPU:</strong> NVIDIA GeForce RTX 4080
            </span>
          </div>
        </footer>
      </div>
    </NeonWindowChrome>
  )
}
