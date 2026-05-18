import type { JSX } from 'react'

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
      className="app-knowledge-link"
      disabled={disabled}
      title={tooltip}
      aria-label={label}
      aria-describedby={ariaDescribedBy}
      onClick={onOpen}
    >
      {label}
    </button>
  )
}
