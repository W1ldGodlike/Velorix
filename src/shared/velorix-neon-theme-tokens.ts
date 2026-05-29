/**
 * VELORIX NEON — design token registry for guards and documentation.
 * CSS values — post PURGE v3: создать в `src/renderer/src/assets/neon/` при ui.1 (сейчас файлов нет).
 */

export const VELORIX_NEON_THEME_ID = 'velorix-neon' as const

/** Каталог эталонных PNG/mockup (новые референсы — только сюда). */
export const VELORIX_REFERENCE_ASSETS_DIR = 'docs/reference' as const

/**
 * Реф. 1 — экран «Обработка» / редактор (`workspaceTab` processing).
 * Канон shell chrome (sidebar + center + rail + statusbar) для сверки refs 2–27.
 */
export const VELORIX_NEON_REFERENCE_PROCESSING_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-processing.png` as const

/** Эталон иконки приложения (V + lightning, magenta→cyan gradient). Упаковка: `resources/icon.png`. */
export const VELORIX_NEON_APP_ICON_REFERENCE_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-app-icon-reference.png` as const

/** Эталон горизонтального логотипа: mark слева + wordmark «VELORIX» справа. */
export const VELORIX_NEON_LOGO_WORDMARK_REFERENCE_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-logo-wordmark-reference.png` as const

/** Эталон вертикального логотипа: mark сверху + wordmark «VELORIX» снизу (центр). */
export const VELORIX_NEON_LOGO_STACKED_REFERENCE_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-logo-stacked-reference.png` as const

/** Эталон экрана «Загрузки» (менеджер yt-dlp): трёхколоночный layout + детали + статистика. */
export const VELORIX_NEON_REFERENCE_DOWNLOADS_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-downloads.png` as const

/** Эталон экрана «История»: единая лента событий + аналитика + фильтры. */
export const VELORIX_NEON_REFERENCE_HISTORY_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-history.png` as const

/** Эталон экрана «Планировщик»: расписание задач, week grid, очередь исполнения. */
export const VELORIX_NEON_REFERENCE_PLANNER_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-planner.png` as const

/** Эталон экрана «База знаний»: поиск, каталог статей, превью, вложения. */
export const VELORIX_NEON_REFERENCE_KNOWLEDGE_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-knowledge.png` as const

/** Эталон экрана «Настройки»: вкладки, карточки опций, системный rail. */
export const VELORIX_NEON_REFERENCE_SETTINGS_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-settings.png` as const

/** Эталон экрана «Сценарии»: каталог automation, grid, выполнения, детали. */
export const VELORIX_NEON_REFERENCE_SCENARIOS_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-scenarios.png` as const

/** Эталон экрана «Инспектор» (медиа): ffprobe dashboard, scopes, кадры — не FFmpeg export rail. */
export const VELORIX_NEON_REFERENCE_INSPECTOR_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-inspector.png` as const

/** Эталон экрана «Терминал»: логи ffmpeg, вкладки, CLI, настройки вывода. */
export const VELORIX_NEON_REFERENCE_TERMINAL_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-terminal.png` as const

/** Эталон экрана «Инструменты»: хаб карточек утилит + быстрые действия (реф. 10). */
export const VELORIX_NEON_REFERENCE_TOOLS_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-tools.png` as const

/** Эталон модалки «О программе» (реф. 11). */
export const VELORIX_NEON_REFERENCE_ABOUT_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-about.png` as const

/** Эталон «Обслуживание файлов»: remux, integrity, hashes (реф. 12). */
export const VELORIX_NEON_REFERENCE_FILE_MAINTENANCE_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-file-maintenance.png` as const

/** Эталон «Конвертация изображений» (реф. 13). */
export const VELORIX_NEON_REFERENCE_IMAGE_CONVERSION_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-image-conversion.png` as const

/** Эталон «Генератор шума/тишины» (реф. 14). */
export const VELORIX_NEON_REFERENCE_NOISE_GENERATOR_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-noise-generator.png` as const

/** Эталон «Слайдшоу из изображений» (реф. 15). */
export const VELORIX_NEON_REFERENCE_SLIDESHOW_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-slideshow.png` as const

/** Эталон «Конструктор сценариев» (узлы, canvas; ≠ каталог реф. 7). */
export const VELORIX_NEON_REFERENCE_SCENARIO_BUILDER_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-scenario-builder.png` as const

/** Эталон «Внешний script-filter» (реф. 17). */
export const VELORIX_NEON_REFERENCE_EXTERNAL_SCRIPT_FILTER_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-external-script-filter.png` as const

/** Эталон модалки «Имя пресета экспорта» (фон: конвертация видео; реф. 18). */
export const VELORIX_NEON_REFERENCE_EXPORT_PRESET_NAME_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-export-preset-name.png` as const

/** Эталон «Пути к движкам» (реф. 19). */
export const VELORIX_NEON_REFERENCE_ENGINE_PATHS_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-engine-paths.png` as const

/** Эталон первого запуска / установка движков (реф. 20). */
export const VELORIX_NEON_REFERENCE_FIRST_RUN_ENGINES_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-first-run-engines.png` as const

/** Эталон диалога «Закрыть Velorix?» (реф. 21). */
export const VELORIX_NEON_REFERENCE_QUIT_CONFIRM_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-quit-confirm.png` as const

/** Эталон диалога ошибки ffmpeg/yt-dlp (реф. 22). */
export const VELORIX_NEON_REFERENCE_FFMPEG_ERROR_DIALOG_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-ffmpeg-error-dialog.png` as const

/** Эталон экрана «Критический сбой приложения» (реф. 23). */
export const VELORIX_NEON_REFERENCE_CRITICAL_CRASH_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-critical-crash.png` as const

/** Эталон экрана «Бенчмарк кодеров» (реф. 24). */
export const VELORIX_NEON_REFERENCE_ENCODER_BENCHMARK_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-encoder-benchmark.png` as const

/** Эталон экрана «Плагины» (реф. 25). */
export const VELORIX_NEON_REFERENCE_PLUGINS_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-plugins.png` as const

/** Эталон доски состояний UI / showcase (реф. 26). */
export const VELORIX_NEON_REFERENCE_UI_STATE_SHOWCASE_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-ui-state-showcase.png` as const

/** Эталон набора компонентов UI / states (реф. 27). */
export const VELORIX_NEON_REFERENCE_UI_COMPONENTS_REL =
  `${VELORIX_REFERENCE_ASSETS_DIR}/velorix-neon-reference-ui-components.png` as const

/** Все эталонные PNG экранов/модалок NEON (порядок реф. 1–27 где применимо). */
export const VELORIX_NEON_REFERENCE_SCREEN_RELS = [
  VELORIX_NEON_REFERENCE_PROCESSING_REL,
  VELORIX_NEON_REFERENCE_DOWNLOADS_REL,
  VELORIX_NEON_REFERENCE_HISTORY_REL,
  VELORIX_NEON_REFERENCE_PLANNER_REL,
  VELORIX_NEON_REFERENCE_KNOWLEDGE_REL,
  VELORIX_NEON_REFERENCE_SETTINGS_REL,
  VELORIX_NEON_REFERENCE_SCENARIOS_REL,
  VELORIX_NEON_REFERENCE_INSPECTOR_REL,
  VELORIX_NEON_REFERENCE_TERMINAL_REL,
  VELORIX_NEON_REFERENCE_TOOLS_REL,
  VELORIX_NEON_REFERENCE_ABOUT_REL,
  VELORIX_NEON_REFERENCE_FILE_MAINTENANCE_REL,
  VELORIX_NEON_REFERENCE_IMAGE_CONVERSION_REL,
  VELORIX_NEON_REFERENCE_NOISE_GENERATOR_REL,
  VELORIX_NEON_REFERENCE_SLIDESHOW_REL,
  VELORIX_NEON_REFERENCE_SCENARIO_BUILDER_REL,
  VELORIX_NEON_REFERENCE_EXTERNAL_SCRIPT_FILTER_REL,
  VELORIX_NEON_REFERENCE_EXPORT_PRESET_NAME_REL,
  VELORIX_NEON_REFERENCE_ENGINE_PATHS_REL,
  VELORIX_NEON_REFERENCE_FIRST_RUN_ENGINES_REL,
  VELORIX_NEON_REFERENCE_QUIT_CONFIRM_REL,
  VELORIX_NEON_REFERENCE_FFMPEG_ERROR_DIALOG_REL,
  VELORIX_NEON_REFERENCE_CRITICAL_CRASH_REL,
  VELORIX_NEON_REFERENCE_ENCODER_BENCHMARK_REL,
  VELORIX_NEON_REFERENCE_PLUGINS_REL,
  VELORIX_NEON_REFERENCE_UI_STATE_SHOWCASE_REL,
  VELORIX_NEON_REFERENCE_UI_COMPONENTS_REL
] as const

/** Primitive color tokens (--vn-color-*). */
export const VELORIX_NEON_PRIMITIVE_COLOR_TOKENS = [
  '--vn-color-void',
  '--vn-color-midnight',
  '--vn-color-violet-rich',
  '--vn-color-magenta-neon',
  '--vn-color-cyan-electric',
  '--vn-color-text-bright',
  '--vn-color-success-matrix'
] as const

/** Gradient tokens (--vn-gradient-*). */
export const VELORIX_NEON_GRADIENT_TOKENS = [
  '--vn-gradient-bg-vertical',
  '--vn-gradient-surface',
  '--vn-gradient-accent-primary',
  '--vn-gradient-progress',
  '--vn-gradient-border-illuminated'
] as const

/** Glow tokens (--vn-glow-*). */
export const VELORIX_NEON_GLOW_TOKENS = [
  '--vn-glow-accent-soft',
  '--vn-glow-accent-medium',
  '--vn-glow-accent-strong',
  '--vn-glow-inner-panel',
  '--vn-glow-focus-ring',
  '--vn-glow-playhead'
] as const

/** Shadow tokens (--vn-shadow-*). */
export const VELORIX_NEON_SHADOW_TOKENS = [
  '--vn-shadow-elevation-1',
  '--vn-shadow-elevation-2',
  '--vn-shadow-elevation-3',
  '--vn-shadow-elevation-4',
  '--vn-shadow-panel-lift'
] as const

/** Glass tokens (--vn-glass-* / --vn-backdrop-*). */
export const VELORIX_NEON_GLASS_TOKENS = [
  '--vn-glass-blur-md',
  '--vn-glass-surface',
  '--vn-backdrop-filter-panel'
] as const

/** Motion tokens (--vn-duration-* / --vn-ease-*). */
export const VELORIX_NEON_MOTION_TOKENS = [
  '--vn-duration-fast',
  '--vn-duration-normal',
  '--vn-ease-out-cinematic',
  '--vn-transition-colors'
] as const

/** Extended §5 semantic aliases (--fa-neon-*). */
export const VELORIX_NEON_SEMANTIC_ALIAS_TOKENS = [
  '--fa-neon-bg-atmosphere',
  '--fa-neon-bg-ambient',
  '--fa-neon-accent-gradient',
  '--fa-neon-glow-accent',
  '--fa-neon-shadow-panel',
  '--fa-neon-glass-panel'
] as const

export const VELORIX_NEON_CSS_ROOT = 'src/renderer/src/assets/neon' as const

/** ui.1 rebuild — token pack + kit boards (sign-off vs PNG отдельно). */
export const VELORIX_NEON_CSS_FILES = [
  'index.css',
  '01-primitives.css',
  '02-typography.css',
  '03-spacing.css',
  '04-gradients.css',
  '05-glow.css',
  '06-shadows.css',
  '07-glass.css',
  '08-borders.css',
  '09-motion.css',
  '10-semantic-bridge.css',
  '11-atmosphere.css',
  '12-utilities.css'
] as const
