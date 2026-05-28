import { useEffect, useState, type JSX } from 'react'

import {
  formatAboutBuildIdDisplay,
  formatBuiltAtUtcLine,
  readAppBuildInfo
} from '../../../shared/app-build-info'
import { KNOWLEDGE_SLUG_ABOUT_SUPPORT_LOGS } from '../../../shared/knowledge-contract'
import { VELORIX_NEON_REFERENCE_ABOUT_REL } from '../../../shared/velorix-neon-theme-tokens'

import { formatEnginesStatusLine } from '../lib/format-engines-status-line'
import { useAppShellStore } from '../stores/app-shell-store'

/** ref.11 — «О программе»: build info + статус движков. */
export function AboutModalBody(): JSX.Element {
  const closeModal = useAppShellStore((s) => s.closeModal)
  const setPendingKnowledgeSlug = useAppShellStore((s) => s.setPendingKnowledgeSlug)
  const setWorkspaceTab = useAppShellStore((s) => s.setWorkspaceTab)
  const build = readAppBuildInfo()
  const builtLine = formatBuiltAtUtcLine(build.builtAtUtc)
  const [enginesLine, setEnginesLine] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function load(): Promise<void> {
      const getStatus = window.velorix?.engines?.getStatus
      if (getStatus == null) {
        return
      }
      const snapshot = await getStatus('ru')
      if (!cancelled) {
        setEnginesLine(formatEnginesStatusLine(snapshot))
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  function openSupportLogsArticle(): void {
    setPendingKnowledgeSlug(KNOWLEDGE_SLUG_ABOUT_SUPPORT_LOGS)
    closeModal()
    setWorkspaceTab('knowledge')
  }

  return (
    <div className="app-modal__body">
      <p className="app-modal__subtitle">VELORIX · UI ZERO rebuild</p>
      <p className="app-modal__hint">
        Сборка {formatAboutBuildIdDisplay(build.buildId)}
        {builtLine != null ? ` · ${builtLine}` : ''}
      </p>
      {enginesLine != null ? <p className="app-modal__hint">{enginesLine}</p> : null}
      <p className="app-modal__hint">Эталон: {VELORIX_NEON_REFERENCE_ABOUT_REL}</p>
      <button type="button" className="app-btn app-btn-secondary" onClick={openSupportLogsArticle}>
        Справка: логи и диагностика
      </button>
    </div>
  )
}
