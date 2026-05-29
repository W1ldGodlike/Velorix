/** Section registry for ref.26 UI States showcase (mock; 31 blocks per PNG grid). */

export type Kit26SectionKind =
  | 'buttons-states'
  | 'inputs-states'
  | 'dropdown-states'
  | 'checkbox-states'
  | 'toggle-states'
  | 'slider-states'
  | 'badge-states'
  | 'toast-states'
  | 'tabs-states'
  | 'cards-states'
  | 'progress'
  | 'loaders'
  | 'skeleton'
  | 'context-menu'
  | 'dropzone'
  | 'result-icons'
  | 'timeline-states'
  | 'tooltip'
  | 'search-states'
  | 'modal-states'
  | 'command-palette'
  | 'player-states'
  | 'export-stages'
  | 'sidebar-active'
  | 'panel-collapse'
  | 'focus-states'
  | 'empty-state'
  | 'list-hover'
  | 'list-active'
  | 'list-disabled'
  | 'motion-hint'

export type Kit26Section = {
  num: string
  title: string
  kind: Kit26SectionKind
  wide?: boolean
}

export const KIT26_SECTIONS: readonly Kit26Section[] = [
  { num: '01', title: 'КНОПКИ', kind: 'buttons-states' },
  { num: '02', title: 'ПОЛЯ ВВОДА', kind: 'inputs-states' },
  { num: '03', title: 'ВЫПАДАЮЩИЕ СПИСКИ', kind: 'dropdown-states' },
  { num: '04', title: 'ЧЕКБОКСЫ', kind: 'checkbox-states' },
  { num: '05', title: 'ПЕРЕКЛЮЧАТЕЛИ', kind: 'toggle-states' },
  { num: '06', title: 'СЛАЙДЕРЫ', kind: 'slider-states' },
  { num: '07', title: 'ИНДИКАТОРЫ', kind: 'badge-states' },
  { num: '08', title: 'ТОСТЫ', kind: 'toast-states' },
  { num: '09', title: 'ВКЛАДКИ', kind: 'tabs-states' },
  { num: '10', title: 'КАРТОЧКИ — СОСТОЯНИЯ', kind: 'cards-states' },
  { num: '11', title: 'ПРОГРЕСС / ЗАГРУЗКА', kind: 'progress' },
  { num: '12', title: 'ЗАГРУЗКА — СОСТОЯНИЯ', kind: 'loaders' },
  { num: '13', title: 'СКЕЛЕТОН ЗАГРУЗКИ', kind: 'skeleton' },
  { num: '14', title: 'КОНТЕКСТНОЕ МЕНЮ', kind: 'context-menu' },
  { num: '15', title: 'ПЕРЕТАСКИВАНИЕ', kind: 'dropzone', wide: true },
  { num: '16', title: 'УСПЕШНО / ОШИБКА', kind: 'result-icons' },
  { num: '17', title: 'ТАЙМЛАЙН — СОСТОЯНИЯ', kind: 'timeline-states', wide: true },
  { num: '18', title: 'ПОДСКАЗКИ', kind: 'tooltip' },
  { num: '19', title: 'ПОИСК — СОСТОЯНИЯ', kind: 'search-states' },
  { num: '20', title: 'МОДАЛЬНОЕ ОКНО', kind: 'modal-states' },
  { num: '21', title: 'КОМАНДНАЯ ПАЛИТРА', kind: 'command-palette', wide: true },
  { num: '22', title: 'ПЛЕЕР — УПРАВЛЕНИЕ', kind: 'player-states' },
  { num: '23', title: 'РЕНДЕР / ЭКСПОРТ', kind: 'export-stages', wide: true },
  { num: '24', title: 'АКТИВНЫЙ SIDEBAR ITEM', kind: 'sidebar-active' },
  { num: '25', title: 'EXPAND / COLLAPSE', kind: 'panel-collapse' },
  { num: '26', title: 'FOCUS RING', kind: 'focus-states' },
  { num: '27', title: 'ПУСТОЕ СОСТОЯНИЕ', kind: 'empty-state' },
  { num: '28', title: 'HOVER СПИСКА', kind: 'list-hover' },
  { num: '29', title: 'ACTIVE СТРОКА', kind: 'list-active' },
  { num: '30', title: 'DISABLED', kind: 'list-disabled' },
  { num: '31', title: 'MOTION', kind: 'motion-hint' }
]
