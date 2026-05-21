import type { JSX } from 'react'

import { IconCircleHelp } from './LucideMiniIcons'

export function KnowledgeDeepLinkButton({
  label,
  tooltip,
  disabled = false,
  ariaDescribedBy,
  onOpen
}: {
  label: string
  tooltip: string
  disabled?: boolean
  ariaDescribedBy?: string
  onOpen: () => void
}): JSX.Element {
  return (
    <button
      type="button"
      className="app-icon-btn app-knowledge-help-btn"
      disabled={disabled}
      title={tooltip}
      aria-label={label}
      aria-describedby={ariaDescribedBy}
      onClick={onOpen}
    >
      <IconCircleHelp title="" size={18} />
    </button>
  )
}
