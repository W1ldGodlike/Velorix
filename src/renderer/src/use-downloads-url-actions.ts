import { useCallback } from 'react'

import { uiText, uiTextVars } from './locales/ui-text'
import type { WorkspaceTab } from './app-terminal-hint-ui'

export type UseDownloadsUrlActionsDeps = {
  downloadsUrl: string
  setDownloadsUrl: (next: string) => void
  setWorkspaceTab: (tab: WorkspaceTab) => void
  setStatusHint: (hint: string | null) => void
}

export function useDownloadsUrlActions(deps: UseDownloadsUrlActionsDeps): {
  handleAddDownloadsFromMain: () => Promise<void>
  handleQuickYtdlpEnqueueLines: () => Promise<void>
  handleDownloadFirstUrlOpenInEditor: () => Promise<void>
} {
  const { downloadsUrl, setDownloadsUrl, setWorkspaceTab, setStatusHint } = deps

  const handleAddDownloadsFromMain = useCallback(async (): Promise<void> => {
    const text = downloadsUrl.trim()
    if (text.length === 0) {
      setWorkspaceTab('downloads')
      return
    }
    const addRes = await window.fluxalloy.downloads.addLines(text)
    setWorkspaceTab('downloads')
    if (!addRes.ok) {
      setStatusHint(addRes.error)
      return
    }
    const added = addRes.added
    setStatusHint(
      added > 0
        ? uiTextVars('statusDownloadsUrlsAdded', { n: String(added) })
        : uiText('statusDownloadsQueueNoUrlsParsed')
    )
    if (added > 0) {
      setDownloadsUrl('')
    }
  }, [downloadsUrl, setDownloadsUrl, setStatusHint, setWorkspaceTab])

  const handleQuickYtdlpEnqueueLines = useCallback(async (): Promise<void> => {
    const text = downloadsUrl.trim()
    if (text.length === 0) {
      setStatusHint(uiText('statusDownloadsQueueNoUrlsParsed'))
      return
    }
    const addRes = await window.fluxalloy.downloads.addLines(text)
    if (!addRes.ok) {
      setStatusHint(addRes.error)
      return
    }
    const added = addRes.added
    setStatusHint(
      added > 0
        ? uiTextVars('statusDownloadsUrlsAdded', { n: String(added) })
        : uiText('statusDownloadsQueueNoUrlsParsed')
    )
    if (added > 0) {
      setDownloadsUrl('')
    }
  }, [downloadsUrl, setDownloadsUrl, setStatusHint])

  const handleDownloadFirstUrlOpenInEditor = useCallback(async (): Promise<void> => {
    const text = downloadsUrl.trim()
    if (text.length === 0) {
      setStatusHint(uiText('statusDownloadOpenEditorNeedUrl'))
      return
    }
    setStatusHint(uiText('statusDownloadOpenEditorWorking'))
    const res = await window.fluxalloy.downloads.downloadFirstUrlOpenInMainEditor(text)
    if (!res.ok) {
      setStatusHint(res.error)
      return
    }
    setWorkspaceTab('editor')
    setStatusHint(uiText('statusDownloadOpenEditorSuccess'))
    setDownloadsUrl('')
  }, [downloadsUrl, setDownloadsUrl, setStatusHint, setWorkspaceTab])

  return {
    handleAddDownloadsFromMain,
    handleQuickYtdlpEnqueueLines,
    handleDownloadFirstUrlOpenInEditor
  }
}
