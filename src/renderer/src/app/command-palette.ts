import type { SystemModalId } from './system-modal'
import type { WorkspaceTab } from './workspace-tab'
import { WORKSPACE_TAB_LABELS, WORKSPACE_TABS } from './workspace-tab'

export type CommandPaletteAction =
  | { type: 'workspace-tab'; tab: WorkspaceTab }
  | { type: 'open-media' }
  | { type: 'toggle-rail' }
  | { type: 'modal'; id: SystemModalId }

export type CommandPaletteItem = {
  id: string
  label: string
  hint?: string
  action: CommandPaletteAction
}

const NAV_COMMANDS: CommandPaletteItem[] = WORKSPACE_TABS.map((tab) => ({
  id: `nav-${tab}`,
  label: WORKSPACE_TAB_LABELS[tab],
  hint: 'Перейти',
  action: { type: 'workspace-tab', tab }
}))

export const COMMAND_PALETTE_ITEMS: CommandPaletteItem[] = [
  { id: 'open-media', label: 'Открыть медиа…', hint: 'Обработка', action: { type: 'open-media' } },
  {
    id: 'engine-paths',
    label: 'Пути к движкам',
    hint: 'Настройки',
    action: { type: 'modal', id: 'engine-paths' }
  },
  { id: 'about', label: 'О программе', action: { type: 'modal', id: 'about' } },
  { id: 'toggle-rail', label: 'Показать/скрыть правый rail', action: { type: 'toggle-rail' } },
  ...NAV_COMMANDS
]

export function filterCommandPaletteItems(
  query: string,
  items: CommandPaletteItem[] = COMMAND_PALETTE_ITEMS
): CommandPaletteItem[] {
  const q = query.trim().toLowerCase()
  if (q.length === 0) {
    return items
  }
  return items.filter((item) => {
    const hay = `${item.label} ${item.hint ?? ''}`.toLowerCase()
    return hay.includes(q)
  })
}
