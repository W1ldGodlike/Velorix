import { useCallback, useEffect, useRef, useState, type JSX, type MouseEvent } from 'react'

import type { MiniPlayerSnapshot } from '../../shared/mini-player-snapshot-contract'
import {
  MiniPlayerContextMenu,
  type MiniPlayerContextMenuState
} from './components/MiniPlayerContextMenu'
import { uiText } from './locales/ui-text'

const idleSnapshot: MiniPlayerSnapshot = {
  hasActiveWork: false,
  exportActive: false,
  downloadActive: false,
  detailLine: '',
  progressPercent: null,
  alwaysOnTop: true
}

export function MiniPlayerStandaloneApp(): JSX.Element {
  const [snapshot, setSnapshot] = useState<MiniPlayerSnapshot>(idleSnapshot)
  const [alwaysOnTop, setAlwaysOnTop] = useState(true)
  const [contextMenu, setContextMenu] = useState<MiniPlayerContextMenuState>(null)
  const contextMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    document.title = uiText('miniPlayerWindowDocumentTitle')
  }, [])

  useEffect(() => {
    let cancelled = false
    void window.velorix.miniPlayer.getSnapshot().then((s) => {
      if (!cancelled) {
        setSnapshot(s)
        setAlwaysOnTop(s.alwaysOnTop)
      }
    })
    const off = window.velorix.miniPlayer.onSnapshot((s) => {
      setSnapshot(s)
      setAlwaysOnTop(s.alwaysOnTop)
    })
    return (): void => {
      cancelled = true
      off()
    }
  }, [])

  const statusLabel = snapshot.hasActiveWork
    ? snapshot.detailLine.trim() ||
      (snapshot.exportActive && snapshot.downloadActive
        ? `${uiText('miniPlayerStatusExport')} · ${uiText('miniPlayerStatusDownload')}`
        : snapshot.exportActive
          ? uiText('miniPlayerStatusExport')
          : uiText('miniPlayerStatusDownload'))
    : uiText('miniPlayerStatusIdle')

  const progressWidth =
    snapshot.progressPercent !== null
      ? `${snapshot.progressPercent}%`
      : snapshot.hasActiveWork
        ? '40%'
        : '0%'

  const onToggleTop = useCallback(() => {
    void window.velorix.miniPlayer.setAlwaysOnTop(!alwaysOnTop).then((r) => {
      setAlwaysOnTop(r.alwaysOnTop)
    })
  }, [alwaysOnTop])

  const onContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY })
  }, [])

  return (
    <div
      className="app-mini-player"
      role="region"
      aria-label={uiText('miniPlayerWindowDocumentTitle')}
      onContextMenu={onContextMenu}
    >
      <div className="app-mini-player-bar" aria-live="polite">
        <span className="app-mini-player-status">{statusLabel}</span>
        <div className="app-mini-player-progress" aria-hidden={!snapshot.hasActiveWork}>
          <div className="app-mini-player-progress-fill" style={{ width: progressWidth }} />
        </div>
      </div>
      <div className="app-mini-player-actions" role="toolbar" aria-orientation="horizontal">
        <button
          type="button"
          className="app-btn app-btn-compact"
          onClick={() => {
            void window.velorix.miniPlayer.focusMain()
          }}
        >
          {uiText('miniPlayerRestoreMain')}
        </button>
        <button type="button" className="app-btn app-btn-compact" onClick={onToggleTop}>
          {uiText('miniPlayerAlwaysOnTop')}
          {alwaysOnTop ? ' ✓' : ''}
        </button>
        <button
          type="button"
          className="app-btn app-btn-compact"
          onClick={() => {
            void window.velorix.miniPlayer.hide()
          }}
        >
          {uiText('miniPlayerClose')}
        </button>
      </div>
      <MiniPlayerContextMenu
        menu={contextMenu}
        menuRef={contextMenuRef}
        alwaysOnTop={alwaysOnTop}
        onDismiss={() => setContextMenu(null)}
        onToggleAlwaysOnTop={onToggleTop}
        onRestoreMain={() => {
          void window.velorix.miniPlayer.focusMain()
        }}
        onClose={() => {
          void window.velorix.miniPlayer.hide()
        }}
      />
    </div>
  )
}
