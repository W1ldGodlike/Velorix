import type { JSX } from 'react'

import { VELORIX_NEON_REFERENCE_TERMINAL_REL } from '../../../../shared/velorix-neon-theme-tokens'

const LOG_LINES = [
  '[ffmpeg] Input #0, mov,mp4, from clip_001.mp4',
  '[ffmpeg] Stream mapping: v:0 -> h264, a:0 -> aac',
  'frame=  842 fps=118 q=28.0 size=  2048kB time=00:00:35.12',
  'frame= 1204 fps=121 q=28.0 size=  3072kB time=00:00:50.24'
] as const

export function TerminalScreen(): JSX.Element {
  return (
    <div className="portal-screen terminal-screen">
      <header className="portal-screen__head">
        <h1 className="portal-screen__title">Терминал</h1>
        <p className="portal-screen__subtitle">Эталон: {VELORIX_NEON_REFERENCE_TERMINAL_REL}</p>
      </header>
      <div className="terminal-screen__log vn-surface-glass" role="log" aria-live="polite">
        {LOG_LINES.map((line) => (
          <code key={line}>{line}</code>
        ))}
      </div>
      <form
        className="terminal-screen__input-row vn-surface-glass"
        onSubmit={(e) => e.preventDefault()}
      >
        <span className="terminal-screen__prompt" aria-hidden>
          ›
        </span>
        <input
          type="text"
          className="app-input terminal-screen__input"
          placeholder="ffmpeg -i …"
          spellCheck={false}
        />
        <button type="submit" className="app-btn app-btn-primary">
          Выполнить
        </button>
      </form>
    </div>
  )
}

export function TerminalRail(): JSX.Element {
  return (
    <aside className="portal-rail vn-surface-glass terminal-rail">
      <h2 className="portal-rail__title">Подсказки</h2>
      <div className="terminal-rail__hints">
        <button type="button" className="app-btn app-btn-secondary">
          -hide_banner
        </button>
        <button type="button" className="app-btn app-btn-secondary">
          -map 0:v:0
        </button>
        <button type="button" className="app-btn app-btn-secondary">
          -crf 23
        </button>
      </div>
      <h2 className="portal-rail__title">Настройки</h2>
      <label className="app-ui-showcase-field">
        <span className="app-ui-showcase-field-label">Лог</span>
        <select className="app-settings-select" defaultValue="ffmpeg">
          <option value="ffmpeg">FFmpeg</option>
          <option value="ytdlp">yt-dlp</option>
        </select>
      </label>
    </aside>
  )
}
