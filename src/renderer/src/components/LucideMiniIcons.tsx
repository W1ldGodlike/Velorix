import type { JSX, ReactNode } from 'react'

/** Единые 24×24 lucide-подобные stroke-иконки для topbar (MIT paths lucide-icons). */

function SvgBase({
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

export function IconFolderOpen({
  title = 'Открыть файл',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      <path d="m6 14 1.45-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.55 6a2 2 0 0 1-1.94 1.5H4a2 2 0 0 1-2-2V5c0-1.1.9-2 2-2h3.93a2 2 0 0 1 1.66.89l.82 1.24a2 2 0 0 0 1.66.89H18a2 2 0 0 1 2 2v2" />
    </SvgBase>
  )
}

export function IconDownload({
  title = 'Загрузки',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" x2="12" y1="15" y2="3" />
    </SvgBase>
  )
}

export function IconFilm({
  title = 'Инспектор',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7 3v18" />
      <path d="M3 7.5h4" />
      <path d="M3 12h18" />
      <path d="M3 16.5h4" />
      <path d="M17 3v18" />
      <path d="M17 7.5h4" />
      <path d="M17 16.5h4" />
    </SvgBase>
  )
}

export function IconImage({
  title = 'Снимок кадра',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </SvgBase>
  )
}

export function IconSave({
  title = 'Экспорт',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      <path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9.2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </SvgBase>
  )
}

export function IconBan({ title = '', size = 20 }: { title?: string; size?: number }): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      <circle cx="12" cy="12" r="10" />
      <path d="m4.9 4.9 14.2 14.2" />
    </SvgBase>
  )
}

export function IconCloudDownload({
  title = '',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      <path d="M12 13v8l-4-4" />
      <path d="m12 21 4-4" />
      <path d="M4.393 15.269A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.436 8.284" />
    </SvgBase>
  )
}

export function IconSettings({
  title = 'Пути к движкам',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </SvgBase>
  )
}

export function IconSun({
  title = 'Светлая тема',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </SvgBase>
  )
}

export function IconMoon({
  title = 'Тёмная тема',
  size = 20
}: {
  title?: string
  size?: number
}): JSX.Element {
  return (
    <SvgBase title={title} size={size}>
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
    </SvgBase>
  )
}
