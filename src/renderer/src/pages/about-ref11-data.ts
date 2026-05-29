/** Mock about modal UI for ref.11 (not backend model). */

export const ABOUT_MODAL_CHIP = 'v1.7.0 PRO' as const

export const ABOUT_MODAL_SUMMARY = '4 компонента · лицензия активна' as const

/** @deprecated Use ABOUT_MODAL_SUMMARY */
export const ABOUT_MODAL_META = ABOUT_MODAL_SUMMARY

export type AboutFeatureMock = {
  id: string
  title: string
  hint: string
  kind: 'fast' | 'reliable' | 'powerful' | 'flexible'
}

export type AboutVersionRowMock = {
  id: string
  label: string
  value: string
  kind?: 'license-active'
}

export type AboutComponentMock = {
  id: string
  name: string
  version: string
  status: 'ok' | 'warn'
}

export type AboutActionMock = {
  id: string
  title: string
  hint: string
  kind: 'logs' | 'support' | 'cache'
}

export const ABOUT_FEATURES: readonly AboutFeatureMock[] = [
  { id: 'f1', title: 'БЫСТРЫЙ', hint: 'Оптимизирован для скорости', kind: 'fast' },
  { id: 'f2', title: 'НАДЁЖНЫЙ', hint: 'Стабильность и безопасность', kind: 'reliable' },
  { id: 'f3', title: 'МОЩНЫЙ', hint: 'GPU ускорение и ИИ модули', kind: 'powerful' },
  { id: 'f4', title: 'ГИБКИЙ', hint: 'Плагины и расширения', kind: 'flexible' }
]

export const ABOUT_VERSION_ROWS: readonly AboutVersionRowMock[] = [
  { id: 'v1', label: 'Версия приложения', value: 'v1.7.0' },
  { id: 'v2', label: 'Сборка', value: '2024.05.01.3155' },
  { id: 'v3', label: 'Дата сборки', value: '1 мая 2024 г., 23:14:55' },
  { id: 'v4', label: 'Платформа', value: 'Windows 11 Pro 23H2 (22631.3155)' },
  { id: 'v5', label: 'Архитектура', value: 'x64' },
  { id: 'v6', label: 'Язык интерфейса', value: 'Русский (ru-RU)' },
  { id: 'v7', label: 'Лицензия', value: 'Профессиональная' },
  { id: 'v8', label: 'Статус лицензии', value: 'Активна', kind: 'license-active' }
]

export const ABOUT_COMPONENTS: readonly AboutComponentMock[] = [
  { id: 'c1', name: 'FFmpeg', version: '6.1.1-essentials_build', status: 'ok' },
  { id: 'c2', name: 'yt-dlp', version: '2024.05.01', status: 'ok' },
  { id: 'c3', name: 'Python', version: '3.11.8 (embed)', status: 'ok' },
  { id: 'c4', name: 'Node.js', version: '20.11.1 (embed)', status: 'ok' }
]

export const ABOUT_ACTIONS: readonly AboutActionMock[] = [
  { id: 'a1', title: 'ЭКСПОРТ ЛОГОВ', hint: 'Сохранить системные логи', kind: 'logs' },
  { id: 'a2', title: 'SUPPORT ZIP', hint: 'Создать архив для поддержки', kind: 'support' },
  { id: 'a3', title: 'ОЧИСТИТЬ КЭШ', hint: 'Удалить временные данные', kind: 'cache' }
]

export const ABOUT_LEGAL_LINKS = [
  { id: 'l1', label: 'Лицензионное соглашение' },
  { id: 'l2', label: 'Политика конфиденциальности' }
] as const
