import type { JSX } from 'react'

import type { ImageConversionFileMock } from './image-conversion-ref13-data'
import {
  IC_ACTIVE_TASKS,
  IC_FILES,
  IC_FILES_SUMMARY,
  IC_FORMAT_QUICK,
  IC_OUTPUT_PATH,
  IC_RECENT,
  IC_RESOURCES,
  IC_SHORTCUTS
} from './image-conversion-ref13-data'

function ImageConversionFileRow(props: { file: ImageConversionFileMock }): JSX.Element {
  const { file } = props
  return (
    <div
      className={
        file.checked
          ? 'ic-file-row ic-file-row--selected vn-surface-glass'
          : 'ic-file-row vn-surface-glass'
      }
    >
      <input
        type="checkbox"
        className="ic-file-row__check"
        checked={file.checked}
        disabled
        readOnly
      />
      <span className="ic-file-row__thumb" aria-hidden />
      <div className="ic-file-row__meta">
        <strong>{file.name}</strong>
        <span>
          {file.dims} · {file.size} · {file.format}
        </span>
      </div>
      <span className="ic-file-row__status">
        <span className="ic-file-row__dot" aria-hidden />
        Готов к конвертации
      </span>
      <button type="button" className="ic-file-row__remove" aria-label="Удалить" disabled>
        ✕
      </button>
    </div>
  )
}

export function ImageConversionSettingsRail(): JSX.Element {
  return (
    <aside className="ic-rail" aria-label="Настройки конвертации">
      <div className="ic-rail__scroll">
        <section className="ic-rail__section vn-surface-glass">
          <h2 className="ic-rail__title">РЕСУРСЫ СИСТЕМЫ</h2>
          {IC_RESOURCES.map((res) => (
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
          <h2 className="ic-rail__title">НАСТРОЙКИ КОНВЕРТАЦИИ</h2>
          <label className="ic-field">
            <span>Формат вывода</span>
            <span className="vn-input ic-field__select">PNG ▾</span>
          </label>
          <div className="ic-format-quick">
            {IC_FORMAT_QUICK.map((fmt) => (
              <button
                key={fmt}
                type="button"
                className={
                  fmt === 'PNG'
                    ? 'ic-format-quick__btn ic-format-quick__btn--active'
                    : 'ic-format-quick__btn'
                }
                disabled
              >
                {fmt}
              </button>
            ))}
          </div>

          <div className="ic-resize">
            <div className="ic-resize__head">
              <strong>ИЗМЕНЕНИЕ РАЗМЕРА</strong>
              <span className="ic-toggle ic-toggle--on" aria-hidden />
            </div>
            <label className="ic-resize__opt">
              <input type="radio" name="ic-resize" defaultChecked disabled />
              Процент
              <span className="ic-resize__slider" aria-hidden />
              <em>100%</em>
            </label>
            <label className="ic-resize__opt">
              <input type="radio" name="ic-resize" disabled />
              Ширина
              <em>1920 px</em>
            </label>
            <label className="ic-resize__opt">
              <input type="radio" name="ic-resize" disabled />
              Высота
              <em>1080 px</em>
            </label>
            <label className="ic-resize__opt">
              <input type="radio" name="ic-resize" disabled />
              Произвольный
              <em>1920×1080</em>
            </label>
            <label className="ic-resize__aspect">
              <input type="checkbox" defaultChecked disabled readOnly />
              Сохранять пропорции
            </label>
          </div>

          <div className="ic-compress">
            <strong>КОМПРЕССИЯ</strong>
            <label className="ic-field">
              <span>Качество</span>
              <span className="ic-compress__slider" aria-hidden />
              <em>85%</em>
            </label>
            <label className="ic-field">
              <span>Метод сжатия</span>
              <span className="vn-input ic-field__select">Оптимизированный ▾</span>
            </label>
            <label className="ic-resize__aspect">
              <input type="checkbox" defaultChecked disabled readOnly />
              Прогрессивный рендеринг
            </label>
          </div>
        </section>

        <section className="ic-rail__section vn-surface-glass">
          <h2 className="ic-rail__title">БЫСТРЫЙ ДОСТУП</h2>
          <ul className="ic-shortcuts">
            {IC_SHORTCUTS.map((item) => (
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
            {IC_RECENT.map((item) => (
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
        {IC_ACTIVE_TASKS.map((task) => (
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
        <p className="ic-rail__damage">
          Проверка на повреждения · ETA 01:17:08
          <button type="button" className="vn-btn vn-btn--secondary" disabled>
            Проверить
          </button>
        </p>
      </section>
    </aside>
  )
}

export function ImageConversionCenter(): JSX.Element {
  return (
    <section className="ic-center" aria-label="Конвертация изображений">
      <header className="ic-center__head">
        <div className="ic-center__head-main">
          <p className="ic-center__eyebrow">Изображения · batch</p>
          <h1>КОНВЕРТАЦИЯ ИЗОБРАЖЕНИЙ</h1>
          <p>Профессиональный инструмент пакетной конвертации и оптимизации изображений</p>
        </div>
        <span className="ic-center__head-chip">PNG 85%</span>
      </header>
      <p className="ic-center__summary">{IC_FILES_SUMMARY}</p>

      <div className="ic-center__scroll">
        <div className="ic-drop vn-surface-glass">
          <span className="ic-glyph ic-glyph--drop" aria-hidden />
          <p>
            Перетащите изображения сюда
            <br />
            или нажмите для выбора файлов
          </p>
          <span className="ic-drop__formats">JPG · PNG · WEBP · BMP · TIFF</span>
        </div>

        <section className="ic-files" aria-labelledby="ic-files-title">
          <h2 id="ic-files-title">ФАЙЛЫ ({IC_FILES.length})</h2>
          <div className="ic-files__list">
            {IC_FILES.map((file) => (
              <ImageConversionFileRow key={file.id} file={file} />
            ))}
          </div>
        </section>
      </div>

      <footer className="ic-center__foot-sticky">
        <label className="ic-output">
          <span>ПАПКА ВЫВОДА</span>
          <div className="ic-output__row">
            <input className="vn-input" type="text" value={IC_OUTPUT_PATH} readOnly disabled />
            <button type="button" className="vn-btn vn-btn--secondary" disabled>
              Обзор…
            </button>
          </div>
          <label className="ic-output__open">
            <input type="checkbox" defaultChecked disabled readOnly />
            Открыть папку после завершения
          </label>
        </label>
        <button type="button" className="vn-btn vn-btn--primary ic-center__convert" disabled>
          <span className="ic-glyph ic-glyph--convert" aria-hidden />
          КОНВЕРТИРОВАТЬ ({IC_FILES.length})
        </button>
      </footer>
    </section>
  )
}
