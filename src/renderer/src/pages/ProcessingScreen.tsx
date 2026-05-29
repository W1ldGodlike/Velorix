import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_PROCESSING_REL } from '../../../shared/velorix-neon-theme-tokens'
import { NeonWindowChrome } from '../components/NeonWindowChrome'

const NAV = [
  'Обработка',
  'Загрузки',
  'Терминал',
  'История',
  'Инспектор',
  'Планировщик',
  'Сценарии',
  'Инструменты',
  'Настройки',
  'База знаний'
] as const

const V1_CLIPS = ['city_night_4k.mp4', 'drive_sequence.mov', 'neon_building.mp4']
const A1_CLIPS = ['music_background.mp3', 'ambience_city.wav']

/** ref.1 — Обработка / editor (mock NLE + FFmpeg rail; not sign-off). */
export function ProcessingScreen(): JSX.Element {
  return (
    <NeonWindowChrome>
      <div className="processing-shell" id="ref1" data-ref={VELORIX_NEON_REFERENCE_PROCESSING_REL}>
        <aside className="processing-sidebar" aria-label="Навигация">
          <div className="processing-sidebar__logo vn-text-gradient">VELORIX</div>
          <nav className="processing-nav">
            {NAV.map((label) => (
              <span
                key={label}
                className={
                  label === 'Обработка'
                    ? 'processing-nav__item processing-nav__item--active'
                    : 'processing-nav__item'
                }
                aria-current={label === 'Обработка' ? 'page' : undefined}
              >
                {label}
              </span>
            ))}
          </nav>
          <div className="processing-sidebar__gpu vn-surface-glass">
            <strong>NVIDIA RTX 3090</strong>
            <span>24 GB · Load 68% · 58°C</span>
            <div className="neon-kit__row" style={{ marginTop: '0.5rem' }}>
              <span>CPU 18%</span>
              <span>RAM 42%</span>
              <span>Disk 38%</span>
            </div>
          </div>
        </aside>

        <section className="processing-center" aria-label="Редактор">
          <header className="processing-center__head">
            <h1>Обработка</h1>
            <p>Профессиональная обработка и монтаж медиафайлов</p>
          </header>
          <div className="processing-preview" aria-label="Превью">
            <span className="processing-preview__badge">4K ULTRA HD</span>
            <div className="processing-preview__transport">
              <button type="button" className="vn-btn vn-btn--secondary" disabled aria-hidden>
                ⏮
              </button>
              <button type="button" className="vn-btn vn-btn--primary" aria-label="Воспроизведение">
                ▶
              </button>
              <button type="button" className="vn-btn vn-btn--secondary" disabled aria-hidden>
                ⏭
              </button>
              <span
                style={{
                  marginLeft: 'auto',
                  fontFamily: 'var(--vn-font-mono)',
                  fontSize: 'var(--vn-font-size-sm)'
                }}
              >
                01:36:53:08
              </span>
            </div>
          </div>
          <div className="processing-timeline" aria-label="Таймлайн">
            <div className="processing-timeline__toolbar">
              <button
                type="button"
                className="vn-btn vn-btn--secondary"
                disabled
                title="Монтаж — mock"
              >
                ✂
              </button>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                🗑
              </button>
              <button type="button" className="vn-btn vn-btn--secondary" disabled>
                🔗
              </button>
            </div>
            {(['V1', 'V2', 'V3'] as const).map((track) => (
              <div key={track} className="processing-timeline__track">
                <span className="processing-timeline__label">{track}</span>
                <div className="processing-timeline__lane">
                  {(track === 'V1' ? V1_CLIPS : ['—']).map((clip) => (
                    <span key={clip} className="processing-clip">
                      {clip}
                    </span>
                  ))}
                </div>
              </div>
            ))}
            {(['A1', 'A2'] as const).map((track) => (
              <div key={track} className="processing-timeline__track">
                <span className="processing-timeline__label">{track}</span>
                <div className="processing-timeline__lane">
                  {(track === 'A1' ? A1_CLIPS : ['sfx.wav']).map((clip) => (
                    <span key={clip} className="processing-clip processing-clip--audio">
                      {clip}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="processing-rail" aria-label="FFmpeg">
          <h2 className="processing-rail__title">НАСТРОЙКИ FFMPEG</h2>
          <details className="processing-rail__section vn-surface-glass" open>
            <summary>Видео</summary>
            <dl className="processing-rail__kv">
              <dt>Кодек</dt>
              <dd>H.264</dd>
              <dt>CRF</dt>
              <dd>18</dd>
              <dt>Разрешение</dt>
              <dd>3840×2160</dd>
              <dt>NVENC</dt>
              <dd>Вкл</dd>
            </dl>
          </details>
          <details className="processing-rail__section vn-surface-glass">
            <summary>Аудио</summary>
            <p className="processing-rail__kv">AAC 320k — mock</p>
          </details>
          <details className="processing-rail__section vn-surface-glass">
            <summary>Формат</summary>
            <p className="processing-rail__kv">MP4 — mock</p>
          </details>
          <div className="processing-rail__export">
            <button
              type="button"
              className="vn-btn vn-btn--primary"
              style={{ width: '100%' }}
              disabled
            >
              НАЧАТЬ ЭКСПОРТ
            </button>
            <p
              style={{
                marginTop: '0.5rem',
                fontSize: 'var(--vn-font-size-xs)',
                color: 'var(--fa-text-muted)'
              }}
            >
              YouTube 4K Premium — mock
            </p>
          </div>
        </aside>

        <footer className="processing-statusbar">
          <span>
            <strong>Проект:</strong> НОВЫЙ СЕЗОН.vlxr
          </span>
          <span>
            <strong>Длительность:</strong> 01:36:53:08
          </span>
          <span>
            <strong>Кадры:</strong> 174,708
          </span>
          <span>
            <strong>FFmpeg:</strong> 6.1.1
          </span>
          <span>
            <strong>GPU:</strong> RTX 4080
          </span>
        </footer>
      </div>
    </NeonWindowChrome>
  )
}
