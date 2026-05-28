import {
  KNOWLEDGE_SLUG_ABOUT_SUPPORT_LOGS,
  KNOWLEDGE_SLUG_FFMPEG_RAIL_PRESETS,
  KNOWLEDGE_SLUG_PROBE_AND_INSPECTOR,
  KNOWLEDGE_SLUG_PROCESSING_HISTORY,
  KNOWLEDGE_SLUG_SESSION_AND_QUEUES
} from '../../../shared/knowledge-contract'

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
  | { type: 'batch-export-cancel' }
  | { type: 'batch-export-clear-completed' }
  | { type: 'batch-export-retry-failed' }
  | { type: 'batch-export-start' }
  | { type: 'start-preview-export' }
  | { type: 'export-trim-full-file' }
  | { type: 'seek-export-trim-in' }
  | { type: 'seek-export-trim-out' }
  | { type: 'toggle-preview-play' }
  | { type: 'export-preset-name' }
  | { type: 'open-knowledge-slug'; slug: string }
  | { type: 'dev-showcase'; target: 'ref27' | 'ref26' | 'ref1' }

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
    id: 'batch-export-cancel',
    label: 'Отменить пакетный экспорт',
    hint: 'Обработка',
    action: { type: 'batch-export-cancel' }
  },
  {
    id: 'batch-export-clear-completed',
    label: 'Пакет — очистить завершённые',
    hint: 'Обработка',
    action: { type: 'batch-export-clear-completed' }
  },
  {
    id: 'batch-export-retry-failed',
    label: 'Пакет — повторить ошибки',
    hint: 'Обработка',
    action: { type: 'batch-export-retry-failed' }
  },
  {
    id: 'batch-export-start',
    label: 'Пакетный экспорт — запустить',
    hint: 'Обработка',
    action: { type: 'batch-export-start' }
  },
  {
    id: 'start-preview-export',
    label: 'Экспорт открытого файла',
    hint: 'Обработка · FFmpeg rail',
    action: { type: 'start-preview-export' }
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
    id: 'toggle-preview-play',
    label: 'Превью — play/pause',
    hint: 'Обработка · как Space',
    action: { type: 'toggle-preview-play' }
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
  {
    id: 'open-help',
    label: 'Справка — быстрый каталог',
    hint: 'Help → База знаний',
    action: { type: 'workspace-tab', tab: 'help' }
  },
  {
    id: 'knowledge-support-logs',
    label: 'Справка: логи и диагностика',
    hint: 'База знаний',
    action: { type: 'open-knowledge-slug', slug: KNOWLEDGE_SLUG_ABOUT_SUPPORT_LOGS }
  },
  {
    id: 'knowledge-ffmpeg-presets',
    label: 'Справка: пресеты FFmpeg rail',
    hint: 'База знаний',
    action: { type: 'open-knowledge-slug', slug: KNOWLEDGE_SLUG_FFMPEG_RAIL_PRESETS }
  },
  {
    id: 'knowledge-probe-inspector',
    label: 'Справка: probe и инспектор',
    hint: 'База знаний',
    action: { type: 'open-knowledge-slug', slug: KNOWLEDGE_SLUG_PROBE_AND_INSPECTOR }
  },
  {
    id: 'knowledge-session-queues',
    label: 'Справка: пакет и очереди',
    hint: 'База знаний',
    action: { type: 'open-knowledge-slug', slug: KNOWLEDGE_SLUG_SESSION_AND_QUEUES }
  },
  {
    id: 'knowledge-processing-history',
    label: 'Справка: журнал обработки',
    hint: 'База знаний',
    action: { type: 'open-knowledge-slug', slug: KNOWLEDGE_SLUG_PROCESSING_HISTORY }
  },
  { id: 'about', label: 'О программе', action: { type: 'modal', id: 'about' } },
  { id: 'toggle-rail', label: 'Показать/скрыть правый rail', action: { type: 'toggle-rail' } },
  {
    id: 'dev-showcase-ref27',
    label: 'UI kit ref.27',
    hint: 'Dev bootstrap',
    action: { type: 'dev-showcase', target: 'ref27' }
  },
  {
    id: 'dev-showcase-ref26',
    label: 'UI states ref.26',
    hint: 'Dev bootstrap',
    action: { type: 'dev-showcase', target: 'ref26' }
  },
  {
    id: 'dev-showcase-ref1',
    label: 'Вернуться в Neon shell (ref.1)',
    hint: 'Dev bootstrap',
    action: { type: 'dev-showcase', target: 'ref1' }
  },
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
