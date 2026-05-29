import type { JSX, ReactNode } from 'react'

export function NeonWindowChrome(props: { children: ReactNode }): JSX.Element {
  const { children } = props

  const onMinimize = (): void => {
    void window.velorix.shell.requestMinimize()
  }

  const onClose = (): void => {
    void window.velorix.shell.requestClose()
  }

  return (
    <div className="neon-chrome-shell">
      <header className="neon-window-chrome">
        <span className="neon-window-chrome__brand vn-text-gradient">VELORIX</span>
        <div className="neon-window-chrome__controls">
          <button
            type="button"
            className="neon-window-chrome__btn"
            aria-label="Свернуть"
            onClick={onMinimize}
          >
            ─
          </button>
          <button
            type="button"
            className="neon-window-chrome__btn neon-window-chrome__btn--close"
            aria-label="Закрыть"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </header>
      <div className="neon-chrome-shell__body">{children}</div>
    </div>
  )
}
