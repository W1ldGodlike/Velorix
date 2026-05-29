/** Section registry for ref.27 UI Components kit (mock; 31 blocks per PNG grid). */

export type Kit27SectionKind =
  | 'buttons'
  | 'inputs'
  | 'dropdown'
  | 'checkboxes'
  | 'radio'
  | 'slider'
  | 'badges'
  | 'tabs'
  | 'toasts'
  | 'avatars'
  | 'table'
  | 'tree'
  | 'context-menu'
  | 'tooltip'
  | 'breadcrumbs'
  | 'modal'
  | 'modal-loading'
  | 'skeleton'
  | 'dropzone'
  | 'drag-states'
  | 'command-palette'
  | 'player'
  | 'timeline'
  | 'dropdown-open'
  | 'search'
  | 'typography'
  | 'spacing'
  | 'colors'
  | 'icons-line'
  | 'statusbar'
  | 'brand'

export type Kit27Section = {
  num: string
  title: string
  kind: Kit27SectionKind
  wide?: boolean
}

export const KIT27_SECTIONS: readonly Kit27Section[] = [
  { num: '01', title: 'КНОПКИ', kind: 'buttons' },
  { num: '02', title: 'ПОЛЯ ВВОДА', kind: 'inputs' },
  { num: '03', title: 'ВЫПАДАЮЩИЕ СПИСКИ', kind: 'dropdown' },
  { num: '04', title: 'ЧЕКБОКСЫ', kind: 'checkboxes' },
  { num: '05', title: 'РАДИОКНОПКИ', kind: 'radio' },
  { num: '06', title: 'СЛАЙДЕРЫ', kind: 'slider' },
  { num: '07', title: 'ИНДИКАТОРЫ СОСТОЯНИЙ', kind: 'badges' },
  { num: '08', title: 'ВКЛАДКИ', kind: 'tabs' },
  { num: '09', title: 'ТОСТ УВЕДОМЛЕНИЯ', kind: 'toasts' },
  { num: '10', title: 'АВАТАРЫ И ИКОНКИ', kind: 'avatars' },
  { num: '11', title: 'ТАБЛИЦЫ (СПИСКИ)', kind: 'table', wide: true },
  { num: '12', title: 'ДЕРЕВОВИДНОЕ МЕНЮ', kind: 'tree' },
  { num: '13', title: 'КОНТЕКСТНОЕ МЕНЮ', kind: 'context-menu' },
  { num: '14', title: 'ВСПЛЫВАЮЩИЕ ПОДСКАЗКИ', kind: 'tooltip' },
  { num: '15', title: 'НАВИГАЦИЯ / КРОШКИ', kind: 'breadcrumbs' },
  { num: '16', title: 'МОДАЛЬНОЕ ОКНО', kind: 'modal' },
  { num: '17', title: 'МОДАЛЬНОЕ ОКНО (ЗАГРУЗКА)', kind: 'modal-loading' },
  { num: '18', title: 'СКЕЛЕТОН', kind: 'skeleton' },
  { num: '19', title: 'ПЕРЕТАСКИВАНИЕ', kind: 'dropzone', wide: true },
  { num: '20', title: 'СОСТОЯНИЯ ПЕРЕТАСКИВАНИЯ', kind: 'drag-states' },
  { num: '21', title: 'КОМАНДНАЯ ПАЛИТРА', kind: 'command-palette', wide: true },
  { num: '22', title: 'ПАНЕЛЬ ПРОИГРЫВАТЕЛЯ', kind: 'player' },
  { num: '23', title: 'ТАЙМЛАЙН — СОСТОЯНИЯ', kind: 'timeline', wide: true },
  { num: '24', title: 'ДРОПДАУН МЕНЮ (ОТКРЫТО)', kind: 'dropdown-open' },
  { num: '25', title: 'ПОИСК — СОСТОЯНИЯ', kind: 'search' },
  { num: '26', title: 'ТИПОГРАФИКА', kind: 'typography' },
  { num: '27', title: 'ОТСТУПЫ / ПЛОТНОСТЬ', kind: 'spacing' },
  { num: '28', title: 'ЦВЕТА И GLOW', kind: 'colors' },
  { num: '29', title: 'ИКОНКИ (STROKE)', kind: 'icons-line' },
  { num: '30', title: 'СТРОКА СОСТОЯНИЯ', kind: 'statusbar', wide: true },
  { num: '31', title: 'БРЕНД / LOGO', kind: 'brand' }
]
