import type { JSX } from 'react'

import type { EnginePathMock } from './engine-paths-ref19-data'
import {
  ENG_ENGINES,
  ENG_MODAL_CHIP,
  ENG_MODAL_SUMMARY,
  ENG_SUMMARY
} from './engine-paths-ref19-data'
import { AboutToolsBackdrop } from './about-ref11-parts'

function EnginePathRow(props: { engine: EnginePathMock }): JSX.Element {
  const { engine } = props
  return (
    <article
      className={
        engine.selected ? 'eng-row eng-row--selected vn-surface-glass' : 'eng-row vn-surface-glass'
      }
    >
      <header className="eng-row__head">
        <div>
          <h3>{engine.name}</h3>
          <p>{engine.description}</p>
        </div>
        {engine.valid ? (
          <span className="eng-row__valid">
            <span className="eng-glyph eng-glyph--ok" aria-hidden />
            Валидно
          </span>
        ) : null}
      </header>
      <div className="eng-row__path">
        <input className="vn-input" type="text" value={engine.path} readOnly disabled />
        <button type="button" className="vn-btn vn-btn--secondary" disabled>
          Обзор…
        </button>
      </div>
      <p className="eng-row__version">Обнаружена версия: {engine.version}</p>
    </article>
  )
}

export function EnginePathsModal(): JSX.Element {
  return (
    <div className="eng-modal" role="dialog" aria-labelledby="eng-modal-title" id="ref19">
      <header className="eng-modal__head">
        <div className="eng-modal__head-main">
          <p className="eng-modal__eyebrow">Движки · paths</p>
          <h2 id="eng-modal-title">ПУТИ К ДВИЖКАМ</h2>
          <p>Настройка путей к внешним утилитам FFmpeg, FFprobe и yt-dlp</p>
        </div>
        <div className="eng-modal__head-tools">
          <span className="eng-modal__head-chip">{ENG_MODAL_CHIP}</span>
          <button type="button" className="eng-modal__close" aria-label="Закрыть" disabled>
            ✕
          </button>
        </div>
      </header>
      <p className="eng-modal__summary">{ENG_MODAL_SUMMARY}</p>

      <div className="eng-modal__scroll">
        {ENG_ENGINES.map((engine) => (
          <EnginePathRow key={engine.id} engine={engine} />
        ))}
      </div>

      <footer className="eng-modal__summary-sticky">
        <p>
          <strong>{ENG_SUMMARY.status}</strong>
        </p>
        <p>
          Последняя проверка: {ENG_SUMMARY.lastCheck} · {ENG_SUMMARY.checkStats}
        </p>
        <div className="eng-modal__actions-sticky">
          <button type="button" className="vn-btn vn-btn--secondary" disabled>
            Сбросить по умолчанию
          </button>
          <button type="button" className="vn-btn vn-btn--secondary" disabled>
            Отмена
          </button>
          <button type="button" className="vn-btn vn-btn--primary" disabled>
            Сохранить изменения
          </button>
        </div>
      </footer>
    </div>
  )
}

export function EnginePathsSceneBackdrop(): JSX.Element {
  return <AboutToolsBackdrop />
}
