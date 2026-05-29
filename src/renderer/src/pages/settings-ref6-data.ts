/** Mock settings UI for ref.6 (not backend model). */

import type { ProcessingNavSlug } from './processing-ref1-data'

export const SETTINGS_ACTIVE_NAV: ProcessingNavSlug = 'settings'

export const SETTINGS_CENTER_SUMMARY =
  '6 карточек · вкладка Основные · Velorix Dark · NVENC' as const

export const SETTINGS_TABS = [
  { id: 'general', label: 'Основные', active: true },
  { id: 'performance', label: 'Производительность' },
  { id: 'interface', label: 'Интерфейс' },
  { id: 'processing', label: 'Обработка' },
  { id: 'integrations', label: 'Интеграции' },
  { id: 'storage', label: 'Хранилище' },
  { id: 'advanced', label: 'Расширенные' }
] as const

export type SettingsToggleMock = {
  label: string
  on: boolean
}

export type SettingsSelectMock = {
  label: string
  value: string
}

export type SettingsPathMock = {
  label: string
  path: string
}

export type SettingsCardMock = {
  id: string
  title: string
  selects?: readonly SettingsSelectMock[]
  toggles?: readonly SettingsToggleMock[]
  paths?: readonly SettingsPathMock[]
  button?: string
}

export const SETTINGS_GENERAL_CARDS: readonly SettingsCardMock[] = [
  {
    id: 'c1',
    title: 'Язык и внешний вид',
    selects: [
      { label: 'Язык интерфейса', value: 'Русский ▾' },
      { label: 'Тема', value: 'Velorix Dark ▾' },
      { label: 'Плотность', value: 'Комфортная ▾' },
      { label: 'Масштаб', value: '100% ▾' }
    ],
    toggles: [
      { label: 'Следовать системе', on: false },
      { label: 'Анимации интерфейса', on: true },
      { label: 'Glow и neon-эффекты', on: true }
    ]
  },
  {
    id: 'c2',
    title: 'Поведение системы',
    selects: [
      { label: 'При закрытии', value: 'Свернуть в трей ▾' },
      { label: 'Проверка обновлений', value: 'Ежедневно ▾' },
      { label: 'Уведомления', value: 'Все события ▾' }
    ],
    toggles: [
      { label: 'Запуск при старте ОС', on: true },
      { label: 'Свернуть в трей', on: true },
      { label: 'Свернуть при запуске задач', on: false },
      { label: 'Подтверждать удаление', on: true },
      { label: 'Звуковые уведомления', on: true }
    ]
  },
  {
    id: 'c3',
    title: 'Рабочие папки',
    paths: [
      { label: 'Проекты', path: 'D:\\Velorix\\Projects' },
      { label: 'Загрузки', path: 'D:\\Velorix\\Downloads' },
      { label: 'Вывод', path: 'D:\\Velorix\\Output' },
      { label: 'Temp', path: 'D:\\Velorix\\Temp' }
    ],
    button: 'Восстановить папки по умолчанию'
  },
  {
    id: 'c4',
    title: 'Настройки обработки по умолчанию',
    selects: [
      { label: 'Видео', value: 'H.265 ▾' },
      { label: 'Аудио', value: 'AAC ▾' },
      { label: 'Контейнер', value: 'MP4 ▾' },
      { label: 'HW accel', value: 'NVENC NVIDIA ▾' },
      { label: 'Приоритет', value: 'Высокий ▾' },
      { label: 'Потоки', value: 'Auto (16) ▾' },
      { label: 'Color', value: 'Rec. 709 ▾' },
      { label: 'Deinterlace', value: 'YADIF ▾' }
    ],
    toggles: [{ label: '10-bit color', on: true }],
    button: 'Параметры кодирования по умолчанию'
  },
  {
    id: 'c5',
    title: 'Кэш и производительность',
    selects: [
      { label: 'RAM cache', value: '16 GB ▾' },
      { label: 'Max memory', value: '80% ▾' },
      { label: 'Очистка кэша', value: 'При нехватке памяти ▾' },
      { label: 'HW decode', value: 'Включено ▾' },
      { label: 'HW encode', value: 'Включено ▾' }
    ],
    toggles: [
      { label: 'GPU optimization', on: true },
      { label: 'Pre-analysis файлов', on: true }
    ],
    button: 'Очистить кэш'
  },
  {
    id: 'c6',
    title: 'Сохранение и резервное копирование',
    selects: [
      { label: 'Автосохранение', value: 'Каждые 5 мин ▾' },
      { label: 'Версий', value: '10 ▾' }
    ],
    toggles: [
      { label: 'Резервное копирование', on: true },
      { label: 'Экспорт логов при ошибке', on: true }
    ],
    paths: [{ label: 'Папка backup', path: 'D:\\Velorix\\Backups' }],
    button: 'Создать резервную копию сейчас'
  }
]

export const SETTINGS_ABOUT = {
  version: '2.1.0',
  build: '2024.05.28',
  platform: 'Windows 11',
  engine: 'Electron 28.2.0'
} as const

export const SETTINGS_RESOURCES = {
  os: 'Windows 11 Pro 23H2',
  cpu: 'Intel Core i9-13900K',
  ram: '64 GB DDR5',
  gpu: 'NVIDIA RTX 3090 24 GB',
  disks: [
    { id: 'c', label: 'Диск C:', used: '1.45 TB', total: '1.86 TB', free: '412 GB', percent: 78 },
    { id: 'd', label: 'Диск D:', used: '2.1 TB', total: '3.64 TB', free: '1.54 TB', percent: 58 }
  ]
} as const

export const SETTINGS_QUICK_ACTIONS = [
  'Сбросить все настройки',
  'Восстановить из backup',
  'Открыть папку конфигурации',
  'Показать системные логи',
  'Настройки уведомлений'
] as const

export const SETTINGS_CARD_COUNT = 6 as const

export const SETTINGS_STATUS_READY = 'Готово' as const

export type SettingsStatusAccent = 'cyan' | 'magenta'

export type SettingsStatusRow = {
  label: string
  value: string
  accent?: SettingsStatusAccent
  mono?: boolean
}

export const SETTINGS_STATUS_ROWS: readonly SettingsStatusRow[] = [
  { label: 'Версия', value: '2.1.0', accent: 'cyan' },
  { label: 'Профиль', value: 'Velorix Dark', accent: 'magenta' },
  { label: 'Папки', value: 'D:\\Velorix\\Projects', mono: true }
]
