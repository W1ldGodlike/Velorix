/** Mock critical crash screen UI for ref.23 (not backend crash reporter). */

export const CC_MAIN_CHIP = '0x41A7' as const

export const CC_MAIN_SUMMARY = 'VRX_CRASH_0x000041A7 · Access Violation · автосейв 72%' as const

export const CC_ERROR_CODE = 'VRX_CRASH_0x000041A7'

export const CC_STATUS_CARDS = [
  {
    id: 'app',
    icon: 'crash',
    title: 'Аварийное завершение',
    detail: 'Сегодня, 14:35:21',
    tone: 'danger'
  },
  {
    id: 'ver',
    icon: 'laptop',
    title: 'Velorix 1.7.0 (build 17025)',
    detail: 'Стабильная ветка',
    tone: 'neutral'
  },
  {
    id: 'os',
    icon: 'windows',
    title: 'Windows 10/11 (64-bit)',
    detail: 'Build 22631',
    tone: 'neutral'
  },
  {
    id: 'gpu',
    icon: 'shield',
    title: 'NVIDIA RTX 4090 (24GB)',
    detail: 'Драйвер 552.22',
    tone: 'ok'
  },
  {
    id: 'sys',
    icon: 'warn',
    title: 'Нестабильно',
    detail: 'Требуется диагностика',
    tone: 'danger'
  }
] as const

export const CC_CRASH_REPORT_LINES = [
  { id: 'r1', text: 'Тип ошибки: Access Violation (0xC0000005)', selected: true },
  { id: 'r2', text: 'Модуль: velorix-media-core.dll' },
  { id: 'r3', text: 'Адрес: 0x00007FF6A3B4F1D3' },
  { id: 'r4', text: 'Поток: MainWorker Thread (ID: 0x3A7C)' },
  { id: 'r5', text: 'Описание: Попытка чтения/записи недопустимой области памяти.' }
] as const

export const CC_STACK_LINES = [
  {
    id: 's0',
    text: '00  0x00007FF6A3B4F1D3  velorix-media-core.dll  MediaPipeline::processFrame',
    selected: true
  },
  { id: 's1', text: '01  0x00007FF6A2C8E420  velorix-engine.dll      ExportWorker::run' },
  { id: 's2', text: '02  0x00007FF6A1A90311  velorix-core.dll        TaskQueue::dispatch' },
  { id: 's3', text: '03  0x00007FF9B2E14A2F  ntdll.dll               RtlUserThreadStart' },
  { id: 's4', text: '04  0x00007FF9B0D8257D  KERNEL32.DLL            BaseThreadInitThunk' },
  { id: 's5', text: '05  0x00007FF9B2E0AA68  ntdll.dll               RtlUserThreadStart' },
  { id: 's6', text: '06  0x00007FF6A0F12B90  velorix-ui.dll          MainWindow::onCrash' }
] as const

export const CC_DIAG_ITEMS = [
  { id: 'mem', label: 'Память', status: 'ok' as const, note: 'Проверка завершена' },
  { id: 'vram', label: 'Видеопамять', status: 'warn' as const, note: 'Работает нестабильно' },
  { id: 'disk', label: 'Диск', status: 'ok' as const, note: 'Проверка завершена' },
  { id: 'ffmpeg', label: 'FFmpeg', status: 'fail' as const, note: 'Ошибка инициализации' },
  { id: 'ytdlp', label: 'yt-dlp', status: 'ok' as const, note: 'Проверка завершена' },
  { id: 'net', label: 'Интернет', status: 'fail' as const, note: 'Ошибки обнаружены' }
] as const

export const CC_QUICK_INFO = [
  { id: 'time', label: 'Время сбоя', value: '14:35:21' },
  { id: 'uptime', label: 'Время работы', value: '02:17:43' },
  { id: 'files', label: 'Обработано файлов', value: '127' },
  { id: 'task', label: 'Текущая задача', value: 'H.265 (NVENC) 4K' },
  { id: 'progress', label: 'Прогресс', value: '78.9% (1214/1538 кадров)' }
] as const

export const CC_RECOMMENDATION =
  'РЕКОМЕНДАЦИИ: Рекомендуется перезапустить приложение в безопасном режиме, проверить драйвер GPU и экспортировать логи для диагностики.'

export const CC_RECOVERY_ACTIONS = [
  {
    id: 'recovery',
    title: 'Режим восстановления',
    detail: 'Запустить с восстановлением данных',
    highlight: true
  },
  {
    id: 'safe',
    title: 'Безопасный режим',
    detail: 'Запустить только с базовыми функциями',
    highlight: false
  },
  {
    id: 'restart',
    title: 'Перезапуск',
    detail: 'Обычный перезапуск Velorix',
    highlight: false
  },
  {
    id: 'logs',
    title: 'Папка диагностики',
    detail: 'Просмотр логов и системных файлов',
    highlight: false
  },
  {
    id: 'report',
    title: 'Отправить отчёт',
    detail: 'Помочь улучшить Velorix',
    highlight: false
  }
] as const

export const CC_PROJECT = {
  name: 'НОВЫЙ СЕЗОН.vlrp',
  path: 'D:\\Projects\\Velorix\\НОВЫЙ СЕЗОН.vlrp',
  status: 'Повреждён'
} as const

export const CC_AUTOSAVE = {
  percent: 72,
  hint: 'Найдено временных файлов. Возможно восстановление данных.'
} as const

export const CC_STATUS_READY = 'Сбой · режим восстановления' as const

export type CriticalCrashStatusAccent = 'cyan' | 'magenta'

export type CriticalCrashStatusRow = {
  label: string
  value: string
  accent?: CriticalCrashStatusAccent
  mono?: boolean
}

export const CC_STATUS_ROWS: readonly CriticalCrashStatusRow[] = [
  {
    label: 'Проект',
    value: 'НОВЫЙ СЕЗОН.vlxr · 01:36:53:08 · 3840×2160 (4K) · 174,708 · TC 00:00:00:00',
    mono: true
  },
  { label: 'Движки', value: 'FFmpeg 6.1.1 · NVIDIA GeForce RTX 4090', accent: 'cyan' }
]
