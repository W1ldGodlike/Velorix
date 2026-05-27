import type { JSX, ReactNode } from 'react'

import {
  VELORIX_NEON_REFERENCE_ENCODER_BENCHMARK_REL,
  VELORIX_NEON_REFERENCE_EXTERNAL_SCRIPT_FILTER_REL,
  VELORIX_NEON_REFERENCE_FILE_MAINTENANCE_REL,
  VELORIX_NEON_REFERENCE_IMAGE_CONVERSION_REL,
  VELORIX_NEON_REFERENCE_NOISE_GENERATOR_REL,
  VELORIX_NEON_REFERENCE_PLUGINS_REL,
  VELORIX_NEON_REFERENCE_SCENARIO_BUILDER_REL,
  VELORIX_NEON_REFERENCE_SLIDESHOW_REL
} from '../../../../shared/velorix-neon-theme-tokens'

import { useAppShellStore } from '../../stores/app-shell-store'
import { UTILITY_TOOL_LABELS, type UtilityToolId } from './utility-tool-id'

function UtilityScreenFrame(props: {
  title: string
  subtitle: string
  children: ReactNode
  actions?: ReactNode
}): JSX.Element {
  const setToolsView = useAppShellStore((s) => s.setToolsView)
  const { title, subtitle, children, actions } = props
  return (
    <div className="utility-screen portal-screen">
      <header className="portal-screen__head utility-screen__head">
        <div>
          <button
            type="button"
            className="app-btn app-btn-secondary utility-screen__back"
            onClick={() => setToolsView('hub')}
          >
            ← Инструменты
          </button>
          <h1 className="portal-screen__title">{title}</h1>
          <p className="portal-screen__subtitle">{subtitle}</p>
        </div>
        {actions != null ? <div className="utility-screen__head-actions">{actions}</div> : null}
      </header>
      {children}
    </div>
  )
}

export function FileMaintenanceScreen(): JSX.Element {
  return (
    <UtilityScreenFrame
      title="Обслуживание файлов"
      subtitle={`Эталон: ${VELORIX_NEON_REFERENCE_FILE_MAINTENANCE_REL}`}
      actions={
        <button type="button" className="app-btn app-btn-secondary">
          Выбрать файл
        </button>
      }
    >
      <div className="utility-screen__hero vn-surface-glass">
        <p className="utility-screen__file-name">НОВЫЙ СЕЗОН_01_2160p_HDR.mkv</p>
        <p className="utility-screen__file-path">
          D:\Projects\VELORIX\Media\НОВЫЙ СЕЗОН_01_2160p_HDR.mkv
        </p>
        <dl className="utility-screen__meta-grid">
          <div>
            <dt>Размер</dt>
            <dd>18.64 GB</dd>
          </div>
          <div>
            <dt>Формат</dt>
            <dd>Matroska MKV</dd>
          </div>
          <div>
            <dt>Длительность</dt>
            <dd>01:36:53:08</dd>
          </div>
          <div>
            <dt>Разрешение</dt>
            <dd>3840×2160 · 4K</dd>
          </div>
        </dl>
      </div>
      <div className="utility-screen__workspace">
        <ul className="utility-screen__ops vn-surface-glass">
          <li className="utility-screen__op utility-screen__op--active">REMUX REPAIR</li>
          <li className="utility-screen__op">INTEGRITY CHECK</li>
          <li className="utility-screen__op">MD5 / SHA256</li>
          <li className="utility-screen__op">REBUILD METADATA</li>
        </ul>
        <section className="utility-screen__panel vn-surface-glass">
          <h2>Remux repair</h2>
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">Copy mode</span>
            <input type="checkbox" className="app-ui-showcase-checkbox" defaultChecked />
          </label>
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">Восстановить таймкоды</span>
            <input type="checkbox" className="app-ui-showcase-checkbox" defaultChecked />
          </label>
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">Восстановить главы</span>
            <input type="checkbox" className="app-ui-showcase-checkbox" defaultChecked />
          </label>
        </section>
        <aside className="utility-screen__info vn-surface-glass">
          <p>
            Риск:{' '}
            <span className="app-ui-showcase-status-pill app-ui-showcase-status-pill--ready">
              Низкий
            </span>
          </p>
          <p>~2–5 мин · temp 2.1 GB</p>
        </aside>
      </div>
      <footer className="utility-screen__footer">
        <input
          type="text"
          className="app-input utility-screen__path"
          defaultValue="D:\Projects\VELORIX\Media\НОВЫЙ СЕЗОН_01_2160p_HDR_REPAIRED.mkv"
          aria-label="Выходной файл"
        />
        <button type="button" className="app-btn app-btn-secondary">
          Показать лог
        </button>
        <button type="button" className="app-btn app-btn-primary">
          Запустить операцию
        </button>
      </footer>
    </UtilityScreenFrame>
  )
}

export function ImageConversionScreen(): JSX.Element {
  return (
    <UtilityScreenFrame
      title="Конвертация изображений"
      subtitle={`Эталон: ${VELORIX_NEON_REFERENCE_IMAGE_CONVERSION_REL}`}
      actions={
        <button type="button" className="app-btn app-btn-primary">
          Добавить файлы
        </button>
      }
    >
      <div className="utility-screen__split">
        <div className="utility-screen__stack">
          <div className="utility-screen__dropzone vn-surface-glass">
            Перетащите изображения или нажмите для выбора (JPG, PNG, WEBP, BMP, TIFF)
          </div>
          <table className="utility-screen__table vn-surface-glass">
            <thead>
              <tr>
                <th>Файл</th>
                <th>Разрешение</th>
                <th>Формат</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>cover_4k.jpg</td>
                <td>3840×2160</td>
                <td>JPG</td>
                <td>Готов</td>
              </tr>
              <tr>
                <td>thumb.png</td>
                <td>1280×720</td>
                <td>PNG</td>
                <td>Готов</td>
              </tr>
            </tbody>
          </table>
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">Папка вывода</span>
            <input
              type="text"
              className="app-input"
              defaultValue="D:\Projects\VELORIX\Media\Converted\Images\"
            />
          </label>
        </div>
      </div>
    </UtilityScreenFrame>
  )
}

export function NoiseGeneratorScreen(): JSX.Element {
  return (
    <UtilityScreenFrame
      title="Генератор шума/тишины"
      subtitle={`Эталон: ${VELORIX_NEON_REFERENCE_NOISE_GENERATOR_REL}`}
    >
      <div className="utility-screen__workspace utility-screen__workspace--form">
        <section className="utility-screen__panel vn-surface-glass">
          <h2>Тип сигнала</h2>
          <select className="app-settings-select" defaultValue="silence">
            <option value="silence">Тишина</option>
            <option value="pink">Розовый шум</option>
            <option value="white">Белый шум</option>
          </select>
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">Длительность (с)</span>
            <input type="number" className="app-input" defaultValue={10} min={1} />
          </label>
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">Частота дискретизации</span>
            <select className="app-settings-select" defaultValue="48000">
              <option value="48000">48 kHz</option>
              <option value="44100">44.1 kHz</option>
            </select>
          </label>
        </section>
        <aside className="utility-screen__wave vn-surface-glass" aria-hidden>
          <div className="utility-screen__wave-bars">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </aside>
      </div>
      <footer className="utility-screen__footer">
        <button type="button" className="app-btn app-btn-primary">
          Сгенерировать WAV
        </button>
      </footer>
    </UtilityScreenFrame>
  )
}

export function SlideshowScreen(): JSX.Element {
  return (
    <UtilityScreenFrame
      title="Слайдшоу"
      subtitle={`Эталон: ${VELORIX_NEON_REFERENCE_SLIDESHOW_REL}`}
      actions={
        <button type="button" className="app-btn app-btn-secondary">
          Добавить кадры
        </button>
      }
    >
      <div className="utility-screen__workspace">
        <ul className="utility-screen__slides vn-surface-glass">
          <li>frame_001.jpg · 5 с</li>
          <li>frame_002.jpg · 5 с</li>
          <li>frame_003.jpg · 5 с</li>
        </ul>
        <section className="utility-screen__panel vn-surface-glass">
          <h2>Параметры</h2>
          <label className="app-ui-showcase-field">
            <span className="app-ui-showcase-field-label">FPS</span>
            <input type="number" className="app-input" defaultValue={30} />
          </label>
          <select className="app-settings-select" defaultValue="mp4">
            <option value="mp4">MP4 · H.264</option>
            <option value="mkv">MKV</option>
          </select>
        </section>
      </div>
      <footer className="utility-screen__footer">
        <button type="button" className="app-btn app-btn-primary">
          Собрать видео
        </button>
      </footer>
    </UtilityScreenFrame>
  )
}

export function ScenarioBuilderScreen(): JSX.Element {
  return (
    <UtilityScreenFrame
      title="Конструктор сценариев"
      subtitle={`Эталон: ${VELORIX_NEON_REFERENCE_SCENARIO_BUILDER_REL}`}
      actions={
        <button type="button" className="app-btn app-btn-primary">
          + Узел
        </button>
      }
    >
      <div className="utility-screen__canvas vn-surface-glass" aria-label="Граф сценария">
        <div className="utility-screen__node">Download</div>
        <div className="utility-screen__edge" aria-hidden />
        <div className="utility-screen__node utility-screen__node--active">FFmpeg encode</div>
        <div className="utility-screen__edge" aria-hidden />
        <div className="utility-screen__node">Export</div>
      </div>
    </UtilityScreenFrame>
  )
}

export function ExternalScriptFilterScreen(): JSX.Element {
  return (
    <UtilityScreenFrame
      title="Внешний script-filter"
      subtitle={`Эталон: ${VELORIX_NEON_REFERENCE_EXTERNAL_SCRIPT_FILTER_REL}`}
    >
      <div className="utility-screen__workspace utility-screen__workspace--form">
        <label className="app-ui-showcase-field">
          <span className="app-ui-showcase-field-label">Скрипт (.lua / .js)</span>
          <input type="text" className="app-input" defaultValue="D:\Velorix\filters\denoise.lua" />
        </label>
        <textarea
          className="app-input utility-screen__script"
          rows={8}
          defaultValue={'-- external filter\nfunction process(frame)\n  return frame\nend'}
          aria-label="Тело скрипта"
        />
      </div>
      <footer className="utility-screen__footer">
        <button type="button" className="app-btn app-btn-secondary">
          Проверить
        </button>
        <button type="button" className="app-btn app-btn-primary">
          Применить к превью
        </button>
      </footer>
    </UtilityScreenFrame>
  )
}

export function EncoderBenchmarkScreen(): JSX.Element {
  return (
    <UtilityScreenFrame
      title="Бенчмарк кодеров"
      subtitle={`Эталон: ${VELORIX_NEON_REFERENCE_ENCODER_BENCHMARK_REL}`}
    >
      <table className="utility-screen__table vn-surface-glass">
        <thead>
          <tr>
            <th>Кодек</th>
            <th>FPS</th>
            <th>Размер</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>libx264</td>
            <td>42</td>
            <td>1.2 GB</td>
          </tr>
          <tr>
            <td>h264_nvenc</td>
            <td>118</td>
            <td>1.1 GB</td>
          </tr>
        </tbody>
      </table>
      <footer className="utility-screen__footer">
        <button type="button" className="app-btn app-btn-primary">
          Запустить бенчмарк
        </button>
      </footer>
    </UtilityScreenFrame>
  )
}

export function PluginsScreen(): JSX.Element {
  return (
    <UtilityScreenFrame title="Плагины" subtitle={`Эталон: ${VELORIX_NEON_REFERENCE_PLUGINS_REL}`}>
      <ul className="utility-screen__plugins vn-surface-glass">
        <li>
          <strong>velorix-ytdlp-hooks</strong> · включён
        </li>
        <li>
          <strong>neon-export-presets</strong> · выкл
        </li>
      </ul>
    </UtilityScreenFrame>
  )
}

export function UtilityToolScreen(props: { view: Exclude<UtilityToolId, 'hub'> }): JSX.Element {
  switch (props.view) {
    case 'maint':
      return <FileMaintenanceScreen />
    case 'img':
      return <ImageConversionScreen />
    case 'noise':
      return <NoiseGeneratorScreen />
    case 'slide':
      return <SlideshowScreen />
    case 'scenario':
      return <ScenarioBuilderScreen />
    case 'script':
      return <ExternalScriptFilterScreen />
    case 'bench':
      return <EncoderBenchmarkScreen />
    case 'plugins':
      return <PluginsScreen />
    default:
      return <FileMaintenanceScreen />
  }
}

export function UtilityToolRail(props: { view: Exclude<UtilityToolId, 'hub'> }): JSX.Element {
  const label = UTILITY_TOOL_LABELS[props.view]
  return (
    <aside className="portal-rail vn-surface-glass utility-rail">
      <h2 className="portal-rail__title">{label}</h2>
      <p className="portal-rail__hint">Ресурсы системы · bootstrap</p>
      <ul className="utility-rail__bars">
        <li>
          <span>CPU</span>
          <span className="utility-rail__bar" style={{ width: '18%' }} />
        </li>
        <li>
          <span>GPU</span>
          <span className="utility-rail__bar" style={{ width: '42%' }} />
        </li>
        <li>
          <span>RAM</span>
          <span className="utility-rail__bar" style={{ width: '38%' }} />
        </li>
      </ul>
      <p className="portal-rail__hint">Активные задачи: Render 68% · Export 42%</p>
    </aside>
  )
}

export function ImageConversionRail(): JSX.Element {
  return (
    <aside className="portal-rail vn-surface-glass utility-rail">
      <h2 className="portal-rail__title">Настройки</h2>
      <label className="app-ui-showcase-field">
        <span className="app-ui-showcase-field-label">Формат</span>
        <select className="app-settings-select" defaultValue="png">
          <option value="png">PNG</option>
          <option value="jpg">JPG</option>
          <option value="webp">WEBP</option>
        </select>
      </label>
      <label className="app-ui-showcase-field">
        <span className="app-ui-showcase-field-label">Качество</span>
        <input type="range" className="app-ui-showcase-range vn-progress-neon" defaultValue={85} />
      </label>
      <button type="button" className="app-btn app-btn-primary">
        Конвертировать (3)
      </button>
    </aside>
  )
}
