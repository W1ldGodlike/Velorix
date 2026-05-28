import type { SystemModalId } from './system-modal'
import type { WorkspaceTab } from './workspace-tab'
import { WORKSPACE_TAB_LABELS, WORKSPACE_TABS } from './workspace-tab'

export type CommandPaletteAction =
  | { type: 'workspace-tab'; tab: WorkspaceTab }
  | { type: 'open-media' }
  | { type: 'toggle-rail' }
  | { type: 'modal'; id: SystemModalId }
  | { type: 'clear-export-trim' }
  | { type: 'batch-export-pick' }
  | { type: 'batch-export-from-downloads' }
  | { type: 'export-trim-full-file' }
  | { type: 'seek-export-trim-in' }
  | { type: 'seek-export-trim-out' }
  | { type: 'export-preset-name' }

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
    id: 'clear-export-trim',
    label: 'Сбросить диапазон экспорта',
    hint: 'Обработка',
    action: { type: 'clear-export-trim' }
  },
  {
    id: 'batch-export-pick',
    label: 'Пакетный экспорт — выбрать файлы…',
    hint: 'Обработка',
    action: { type: 'batch-export-pick' }
  },
  {
    id: 'batch-export-from-downloads',
    label: 'Пакетный экспорт — готовые загрузки',
    hint: 'Загрузки → Обработка',
    action: { type: 'batch-export-from-downloads' }
  },
  {
    id: 'export-trim-full-file',
    label: 'Экспорт всего открытого файла',
    hint: 'Инспектор → Обработка',
    action: { type: 'export-trim-full-file' }
  },
  {
    id: 'seek-export-trim-in',
    label: 'Перейти к In',
    hint: 'Обработка · превью',
    action: { type: 'seek-export-trim-in' }
  },
  {
    id: 'seek-export-trim-out',
    label: 'Перейти к Out',
    hint: 'Обработка · превью',
    action: { type: 'seek-export-trim-out' }
  },
  {
    id: 'engine-paths',
    label: 'Пути к движкам',
    hint: 'Настройки',
    action: { type: 'modal', id: 'engine-paths' }
  },
  {
    id: 'first-run-engines',
    label: 'Первый запуск / движки',
    hint: 'Настройки',
    action: { type: 'modal', id: 'first-run-engines' }
  },
  {
    id: 'encoder-benchmark',
    label: 'Бенчмарк кодеров',
    hint: 'Обработка',
    action: { type: 'modal', id: 'encoder-benchmark' }
  },
  {
    id: 'export-preset-name',
    label: 'Сохранить пресет экспорта…',
    hint: 'Обработка',
    action: { type: 'export-preset-name' }
  },
  {
    id: 'plugins',
    label: 'Плагины',
    hint: 'Инструменты',
    action: { type: 'modal', id: 'plugins' }
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
