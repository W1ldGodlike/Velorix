/** Mock file maintenance UI for ref.12 (not backend model). */

export const FM_MODAL_CHIP = 'REMUX' as const

export const FM_MODAL_SUMMARY = '4 операции · REMUX REPAIR активна' as const

/** @deprecated Use FM_MODAL_SUMMARY */
export const FM_MODAL_META = FM_MODAL_SUMMARY

export type FileMaintenanceOperationId = 'remux' | 'integrity' | 'hash' | 'metadata'

export type FileMaintenanceOperationMock = {
  id: FileMaintenanceOperationId
  title: string
  hint: string
  active?: boolean
}

export type FileMaintenanceParamMock = {
  id: string
  label: string
  on: boolean
}

export type FileMaintenanceInfoRowMock = {
  id: string
  label: string
  value: string
  tone?: 'low-risk'
}

export type FileMaintenanceMetaMock = {
  id: string
  label: string
  value: string
}

export const FM_FILE = {
  name: 'НОВЫЙ СЕЗОН_01_2160p_HDR.mkv',
  path: 'D:\\Velorix\\Projects\\NOVYY_SEZON\\source\\НОВЫЙ СЕЗОН_01_2160p_HDR.mkv'
} as const

export const FM_FILE_META: readonly FileMaintenanceMetaMock[] = [
  { id: 'm1', label: 'Размер', value: '18.64 GB' },
  { id: 'm2', label: 'Формат', value: 'Matroska MKV' },
  { id: 'm3', label: 'Длительность', value: '01:36:53:08' },
  { id: 'm4', label: 'Разрешение', value: '3840×2160 · 4K' },
  { id: 'm5', label: 'Кодеки', value: 'H.265 / AAC · 5.1' }
]

export const FM_OPERATIONS: readonly FileMaintenanceOperationMock[] = [
  {
    id: 'remux',
    title: 'REMUX REPAIR',
    hint: 'Восстановление контейнера без перекодирования повреждённого видео',
    active: true
  },
  {
    id: 'integrity',
    title: 'INTEGRITY CHECK',
    hint: 'Проверка целостности и воспроизводимости файла'
  },
  {
    id: 'hash',
    title: 'MD5 / SHA256',
    hint: 'Вычисление контрольной суммы для верификации'
  },
  {
    id: 'metadata',
    title: 'REBUILD METADATA',
    hint: 'Очистка и корректировка метаданных контейнера'
  }
]

export const FM_ACTIVE_OPERATION = FM_OPERATIONS[0]!

export const FM_PARAMS: readonly FileMaintenanceParamMock[] = [
  { id: 'p1', label: 'Пропускать пустые временные метки', on: true },
  { id: 'p2', label: 'Восстанавливать потерянные метки', on: true },
  { id: 'p3', label: 'Исправить moov atom в начале', on: true },
  { id: 'p4', label: 'Fast-start для стриминга', on: true }
]

export const FM_INFO_ROWS: readonly FileMaintenanceInfoRowMock[] = [
  { id: 'i1', label: 'Тип операции', value: 'Remux Repair' },
  { id: 'i2', label: 'Метод', value: 'Без перекодирования' },
  { id: 'i3', label: 'Риск потери данных', value: 'Низкий', tone: 'low-risk' },
  { id: 'i4', label: 'Время выполнения', value: '~2–5 мин' },
  { id: 'i5', label: 'Временное хранилище', value: '2.1 GB' }
]

export const FM_OUTPUT_PATH =
  'D:\\Velorix\\Projects\\NOVYY_SEZON\\output\\НОВЫЙ СЕЗОН_01_2160p_HDR_REPAIRED.mkv'

export const FM_BACKUP_NOTE =
  'Рекомендуется создать резервную копию исходного файла перед запуском операции'
