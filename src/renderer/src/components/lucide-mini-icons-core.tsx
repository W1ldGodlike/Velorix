/* eslint-disable react-refresh/only-export-components -- shared stroke renderer + icon factory */
import type { JSX, ReactNode } from 'react'

import type { StrokePrim } from '../../../shared/lucide-downloads-icons'
import { miniIconTitle, type MiniIconTitleKey } from '../locales/ui-text'

export function renderStrokeParts(parts: readonly StrokePrim[]): JSX.Element[] {
  return parts.map((p, i): JSX.Element => {
    switch (p.tag) {
      case 'path':
        return <path key={i} d={p.attr.d} />
      case 'polyline':
        return <polyline key={i} points={p.attr.points} />
      case 'polygon':
        return <polygon key={i} points={p.attr.points} />
      case 'line':
        return <line key={i} x1={p.attr.x1} y1={p.attr.y1} x2={p.attr.x2} y2={p.attr.y2} />
      case 'rect':
        return (
          <rect
            key={i}
            x={p.attr.x}
            y={p.attr.y}
            width={p.attr.width}
            height={p.attr.height}
            rx={p.attr.rx}
          />
        )
      case 'circle':
        return <circle key={i} cx={p.attr.cx} cy={p.attr.cy} r={p.attr.r} />
      default: {
        const _e: never = p
        return _e
      }
    }
  })
}

export function SvgBase({
  title,
  size = 20,
  children
}: {
  title?: string
  size?: number
  children: ReactNode
}): JSX.Element {
  const labeled = title !== undefined && title.length > 0
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={labeled ? undefined : true}
      role={labeled ? 'img' : undefined}
    >
      {labeled ? <title>{title}</title> : null}
      {children}
    </svg>
  )
}

export type LucideMiniIconProps = { title?: string; size?: number }

export function createLucideMiniIcon(
  parts: readonly StrokePrim[],
  opts: { titleKey?: MiniIconTitleKey; defaultSize?: number } = {}
): (props: LucideMiniIconProps) => JSX.Element {
  const defaultSize = opts.defaultSize ?? 20
  return function LucideMiniIcon({ title, size = defaultSize }: LucideMiniIconProps): JSX.Element {
    const resolvedTitle = title ?? (opts.titleKey !== undefined ? miniIconTitle(opts.titleKey) : '')
    return (
      <SvgBase title={resolvedTitle} size={size}>
        {renderStrokeParts(parts)}
      </SvgBase>
    )
  }
}
