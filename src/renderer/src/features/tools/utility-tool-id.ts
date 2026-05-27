/** Sub-views inside workspace tab «Инструменты» (refs 12–17, 24–25). */

export type UtilityToolId =
  | 'hub'
  | 'maint'
  | 'img'
  | 'noise'
  | 'slide'
  | 'scenario'
  | 'script'
  | 'bench'
  | 'plugins'

export const UTILITY_TOOL_LABELS: Record<Exclude<UtilityToolId, 'hub'>, string> = {
  maint: 'Обслуживание файлов',
  img: 'Конвертация изображений',
  noise: 'Генератор шума/тишины',
  slide: 'Слайдшоу',
  scenario: 'Конструктор сценариев',
  script: 'Внешний script-filter',
  bench: 'Бенчмарк кодеров',
  plugins: 'Плагины'
}
