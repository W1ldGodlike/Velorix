import type { JSX } from 'react'

import type { EbEncoderRowMock } from './encoder-benchmark-ref24-data'
import {
  EB_CENTER_SUMMARY,
  EB_HEAD_CHIP,
  EB_CHART_CURSOR,
  EB_CODEC_BADGES,
  EB_CPU_LOAD,
  EB_ENCODER_ROWS,
  EB_FRAME_STATS,
  EB_GPU_INFO,
  EB_GPU_LOAD,
  EB_KPIS,
  EB_PROFILE,
  EB_RAIL_ACTIONS,
  EB_RAM_DISK,
  EB_TABS,
  EB_TEMP_PROFILE,
  EB_TEST_DETAILS
} from './encoder-benchmark-ref24-data'

function EncoderTableRow(props: { row: EbEncoderRowMock }): JSX.Element {
  const { row } = props
  return (
    <tr
      className={
        row.selected ? `eb-row eb-row--${row.tone} eb-row--selected` : `eb-row eb-row--${row.tone}`
      }
    >
      <td>{row.rank}</td>
      <td>{row.codec}</td>
      <td>{row.fps}</td>
      <td>{row.time}</td>
      <td>{row.size}</td>
      <td>{row.vmaf}</td>
      <td>{row.energy}</td>
    </tr>
  )
}

export function EncoderBenchmarkCenter(): JSX.Element {
  return (
    <div className="eb-center">
      <header className="eb-center__head">
        <div className="eb-center__head-main">
          <p className="eb-center__eyebrow">Бенчмарк · encoders</p>
          <h1>Бенчмарк кодеров</h1>
          <p>Сравнение скорости и эффективности аппаратных и программных кодеров</p>
        </div>
        <div className="eb-center__head-tools">
          <span className="eb-center__head-chip">{EB_HEAD_CHIP}</span>
          <button type="button" className="vn-btn vn-btn--primary eb-center__start" disabled>
            <span className="eb-glyph eb-glyph--play" aria-hidden />
            Запустить тест
          </button>
        </div>
      </header>
      <p className="eb-center__summary">{EB_CENTER_SUMMARY}</p>

      <div className="eb-center__scroll">
        <div className="eb-toolbar">
          <nav className="eb-tabs" aria-label="Разделы бенчмарка">
            {EB_TABS.map((tab) => (
              <span
                key={tab.id}
                className={tab.active ? 'eb-tabs__item eb-tabs__item--active' : 'eb-tabs__item'}
              >
                {tab.label}
              </span>
            ))}
          </nav>
          <span className="vn-input eb-profile">Профиль: {EB_PROFILE} ▾</span>
        </div>

        <div className="eb-kpis">
          {EB_KPIS.map((kpi) => (
            <article key={kpi.id} className={`eb-kpi vn-surface-glass eb-kpi--${kpi.icon}`}>
              <span className={`eb-kpi__icon eb-kpi__icon--${kpi.icon}`} aria-hidden />
              <div>
                <h2>{kpi.title}</h2>
                <strong>{kpi.value}</strong>
                <span>{kpi.sub}</span>
              </div>
              <div className="eb-kpi__spark" aria-hidden />
            </article>
          ))}
        </div>

        <div className="eb-mid">
          <section className="eb-table-wrap vn-surface-glass" aria-labelledby="eb-table-title">
            <h2 id="eb-table-title">Сравнение кодеров</h2>
            <table className="eb-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Кодек / пресет</th>
                  <th>Скорость (FPS)</th>
                  <th>Время</th>
                  <th>Размер (GB)</th>
                  <th>Качество (VMAF)</th>
                  <th>Энергоэфф.</th>
                </tr>
              </thead>
              <tbody>
                {EB_ENCODER_ROWS.map((row) => (
                  <EncoderTableRow key={row.id} row={row} />
                ))}
              </tbody>
            </table>
          </section>
          <section className="eb-chart-panel vn-surface-glass" aria-labelledby="eb-rt-title">
            <div className="eb-chart-panel__head">
              <h2 id="eb-rt-title">Производительность в реальном времени</h2>
              <span className="eb-chart-legend">
                <em className="eb-chart-legend__on">FPS</em>
                <em>%</em>
                <em>ms</em>
              </span>
            </div>
            <div className="eb-chart eb-chart--lines" aria-hidden>
              <span className="eb-chart__cursor">
                {EB_CHART_CURSOR.at}: {EB_CHART_CURSOR.fps}
              </span>
            </div>
          </section>
        </div>

        <section className="eb-load vn-surface-glass" aria-labelledby="eb-load-title">
          <h2 id="eb-load-title">Нагрузка системы</h2>
          <div className="eb-load__grid">
            <article className="eb-load__gpu">
              <header>
                <strong>{EB_GPU_LOAD.name}</strong>
                <em>{EB_GPU_LOAD.load}%</em>
              </header>
              <div className="eb-chart eb-chart--area eb-chart--purple" aria-hidden />
              <dl className="eb-load__stats">
                <div>
                  <dt>VRAM</dt>
                  <dd>{EB_GPU_LOAD.vram}</dd>
                </div>
                <div>
                  <dt>Temp</dt>
                  <dd>{EB_GPU_LOAD.temp}</dd>
                </div>
                <div>
                  <dt>Power</dt>
                  <dd>{EB_GPU_LOAD.power}</dd>
                </div>
                <div>
                  <dt>Core</dt>
                  <dd>{EB_GPU_LOAD.core}</dd>
                </div>
                <div>
                  <dt>Mem</dt>
                  <dd>{EB_GPU_LOAD.mem}</dd>
                </div>
                <div>
                  <dt>Bandwidth</dt>
                  <dd>{EB_GPU_LOAD.bandwidth}</dd>
                </div>
              </dl>
            </article>
            <article className="eb-load__cpu">
              <header>
                <strong>{EB_CPU_LOAD.name}</strong>
                <em>{EB_CPU_LOAD.load}%</em>
              </header>
              <div className="eb-chart eb-chart--area eb-chart--blue" aria-hidden />
              <dl className="eb-load__stats">
                <div>
                  <dt>Max thread</dt>
                  <dd>{EB_CPU_LOAD.thread}</dd>
                </div>
                <div>
                  <dt>Avg freq</dt>
                  <dd>{EB_CPU_LOAD.freq}</dd>
                </div>
                <div>
                  <dt>Temp</dt>
                  <dd>{EB_CPU_LOAD.temp}</dd>
                </div>
                <div>
                  <dt>Power</dt>
                  <dd>{EB_CPU_LOAD.power}</dd>
                </div>
                <div>
                  <dt>Packets/s</dt>
                  <dd>{EB_CPU_LOAD.packets}</dd>
                </div>
              </dl>
            </article>
            <div className="eb-load__rings">
              {EB_RAM_DISK.map((item) => (
                <div key={item.id} className={`eb-mini-ring eb-mini-ring--${item.id}`}>
                  <em>{item.percent}%</em>
                  <span>{item.label}</span>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="eb-frame vn-surface-glass" aria-labelledby="eb-frame-title">
          <div className="eb-frame__head">
            <h2 id="eb-frame-title">Frame time</h2>
            <dl className="eb-frame__stats">
              {EB_FRAME_STATS.map((stat) => (
                <div key={stat.id}>
                  <dt>{stat.label}</dt>
                  <dd>{stat.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="eb-chart eb-chart--scatter" aria-hidden />
        </section>
      </div>
    </div>
  )
}

export function EncoderBenchmarkRail(): JSX.Element {
  return (
    <aside className="eb-rail" aria-label="Информация и действия">
      <div className="eb-rail__scroll">
        <section className="eb-rail__section vn-surface-glass">
          <h2 className="eb-rail__title">Видеокарта</h2>
          <dl className="eb-rail__dl">
            {EB_GPU_INFO.map((row) => (
              <div key={row.id}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="eb-rail__section vn-surface-glass">
          <h2 className="eb-rail__title">Поддержка кодеков</h2>
          <div className="eb-codecs">
            {EB_CODEC_BADGES.map((badge) => (
              <span key={badge} className="eb-codecs__badge">
                {badge}
              </span>
            ))}
          </div>
        </section>
        <section className="eb-rail__section vn-surface-glass">
          <h2 className="eb-rail__title">Температурный профиль</h2>
          <div className="eb-temp-spark" aria-hidden />
          <p className="eb-temp-labels">
            Min {EB_TEMP_PROFILE.min} · Avg {EB_TEMP_PROFILE.avg} · Max {EB_TEMP_PROFILE.max}
          </p>
        </section>
        <section className="eb-rail__section vn-surface-glass">
          <h2 className="eb-rail__title">Параметры теста</h2>
          <dl className="eb-rail__dl">
            {EB_TEST_DETAILS.map((row) => (
              <div key={row.id}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
      <section className="eb-rail__actions-sticky vn-surface-glass" aria-label="Действия">
        {EB_RAIL_ACTIONS.map((label) => (
          <button
            key={label}
            type="button"
            className="vn-btn vn-btn--secondary eb-rail__btn"
            disabled
          >
            {label}
          </button>
        ))}
      </section>
    </aside>
  )
}
