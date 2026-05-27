import { useCallback, useEffect, useMemo, useState, type JSX } from 'react'

import { applyOpenMediaPick } from '../lib/apply-open-media-pick'
import { useAppShellStore } from '../stores/app-shell-store'
import { filterCommandPaletteItems, type CommandPaletteAction } from './command-palette'

export function CommandPalette(): JSX.Element | null {
  const open = useAppShellStore((s) => s.commandPaletteOpen)
  const setCommandPaletteOpen = useAppShellStore((s) => s.setCommandPaletteOpen)
  const [query, setQuery] = useState('')

  const closePalette = useCallback((): void => {
    setQuery('')
    setCommandPaletteOpen(false)
  }, [setCommandPaletteOpen])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent): void {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        const next = !useAppShellStore.getState().commandPaletteOpen
        if (next) {
          setQuery('')
        }
        setCommandPaletteOpen(next)
      }
      if (event.key === 'Escape' && useAppShellStore.getState().commandPaletteOpen) {
        closePalette()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [closePalette, setCommandPaletteOpen])

  const items = useMemo(() => filterCommandPaletteItems(query), [query])

  if (!open) {
    return null
  }

  return (
    <div
      className="command-palette-backdrop"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          closePalette()
        }
      }}
    >
      <div
        className="command-palette vn-surface-glass"
        role="dialog"
        aria-modal="true"
        aria-label="Командная палитра"
      >
        <input
          type="search"
          className="app-input command-palette__input"
          placeholder="Поиск команд… (Ctrl+K)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <ul className="command-palette__list">
          {items.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                className="command-palette__item"
                onClick={() => {
                  void runCommandAction(item.action)
                  closePalette()
                }}
              >
                <span>{item.label}</span>
                {item.hint != null ? (
                  <span className="command-palette__hint">{item.hint}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

async function runCommandAction(action: CommandPaletteAction): Promise<void> {
  const store = useAppShellStore.getState()
  if (action.type === 'workspace-tab') {
    store.setWorkspaceTab(action.tab)
    return
  }
  if (action.type === 'toggle-rail') {
    store.setRailOpen(!store.railOpen)
    return
  }
  if (action.type === 'modal') {
    if (action.id === 'engine-paths') {
      await store.hydrateEnginePathDraft()
    }
    store.openModal(action.id)
    return
  }
  if (action.type === 'clear-export-trim') {
    store.setExportTrim(null)
    store.setWorkspaceTab('processing')
    return
  }
  if (action.type === 'batch-export-pick') {
    const pick = window.velorix?.batchExport?.pickFiles
    if (pick != null) {
      await pick()
    }
    store.setWorkspaceTab('processing')
    return
  }
  const picked = await applyOpenMediaPick({
    setMediaSource: store.setMediaSource,
    setMediaProbe: store.setMediaProbe,
    openModal: store.openModal
  })
  if (picked) {
    store.setWorkspaceTab('processing')
  }
}
