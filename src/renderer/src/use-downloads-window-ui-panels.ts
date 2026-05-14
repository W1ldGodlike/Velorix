import { useCallback, useState } from 'react'

import type { DownloadsWindowUiPanelState } from '../../shared/settings-contract'

export type DownloadsRailPanelKey = 'format' | 'metadata' | 'saving' | 'network' | 'expert'
export type DownloadsRailPanelsState = Record<DownloadsRailPanelKey, boolean>

const DOWNLOADS_RAIL_PANEL_DEFAULTS: DownloadsRailPanelsState = {
  format: true,
  metadata: true,
  saving: true,
  network: false,
  expert: false
}

/**
 * §2.2 — единая точка управления раскрытием панелей вкладки «Загрузки» в главном окне.
 * Все fallback-поведения совпадают с `downloads-window.ts`: отсутствие ключа = defaultOpen.
 */
export function useDownloadsWindowUiPanels(): {
  downloadsEmbeddedHistoryOpen: boolean
  downloadsEmbeddedLogOpen: boolean
  downloadsRailPanels: DownloadsRailPanelsState
  hydrateDownloadsWindowUiPanels: (patch: DownloadsWindowUiPanelState | null | undefined) => void
  persistDownloadsEmbeddedHistoryOpen: (nextOpen: boolean) => void
  persistDownloadsEmbeddedLogOpen: (nextOpen: boolean) => void
  persistDownloadsRailPanelToggle: (key: DownloadsRailPanelKey, nextOpen: boolean) => void
} {
  const [downloadsEmbeddedHistoryOpen, setDownloadsEmbeddedHistoryOpen] = useState(true)
  const [downloadsEmbeddedLogOpen, setDownloadsEmbeddedLogOpen] = useState(true)
  const [downloadsRailPanels, setDownloadsRailPanels] = useState<DownloadsRailPanelsState>(
    DOWNLOADS_RAIL_PANEL_DEFAULTS
  )

  const hydrateDownloadsWindowUiPanels = useCallback(
    (patch: DownloadsWindowUiPanelState | null | undefined): void => {
      setDownloadsEmbeddedHistoryOpen(patch?.history !== false)
      setDownloadsEmbeddedLogOpen(patch?.log !== false)
      setDownloadsRailPanels({
        format:
          typeof patch?.format === 'boolean' ? patch.format : DOWNLOADS_RAIL_PANEL_DEFAULTS.format,
        metadata:
          typeof patch?.metadata === 'boolean'
            ? patch.metadata
            : DOWNLOADS_RAIL_PANEL_DEFAULTS.metadata,
        saving:
          typeof patch?.saving === 'boolean' ? patch.saving : DOWNLOADS_RAIL_PANEL_DEFAULTS.saving,
        network:
          typeof patch?.network === 'boolean'
            ? patch.network
            : DOWNLOADS_RAIL_PANEL_DEFAULTS.network,
        expert:
          typeof patch?.expert === 'boolean' ? patch.expert : DOWNLOADS_RAIL_PANEL_DEFAULTS.expert
      })
    },
    []
  )

  const persistDownloadsEmbeddedHistoryOpen = useCallback((nextOpen: boolean): void => {
    setDownloadsEmbeddedHistoryOpen(nextOpen)
    void window.fluxalloy.downloads.mergeUiPanels({ history: nextOpen }).then((res) => {
      if (!res.ok) {
        console.error(res.error)
      }
    })
  }, [])

  const persistDownloadsEmbeddedLogOpen = useCallback((nextOpen: boolean): void => {
    setDownloadsEmbeddedLogOpen(nextOpen)
    void window.fluxalloy.downloads.mergeUiPanels({ log: nextOpen }).then((res) => {
      if (!res.ok) {
        console.error(res.error)
      }
    })
  }, [])

  const persistDownloadsRailPanelToggle = useCallback(
    (key: DownloadsRailPanelKey, nextOpen: boolean): void => {
      setDownloadsRailPanels((prev) => ({ ...prev, [key]: nextOpen }))
      void window.fluxalloy.downloads.mergeUiPanels({ [key]: nextOpen }).then((res) => {
        if (!res.ok) {
          console.error(res.error)
        }
      })
    },
    []
  )

  return {
    downloadsEmbeddedHistoryOpen,
    downloadsEmbeddedLogOpen,
    downloadsRailPanels,
    hydrateDownloadsWindowUiPanels,
    persistDownloadsEmbeddedHistoryOpen,
    persistDownloadsEmbeddedLogOpen,
    persistDownloadsRailPanelToggle
  }
}
