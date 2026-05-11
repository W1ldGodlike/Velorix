/**
 * Единая точка настройки Cursor SDK automation.
 *
 * `.env` хранит секреты и локальные override-значения, а дефолты/политика поведения
 * живут здесь, чтобы не размазывать их по `run-loop.ts`.
 */

export const SDK_AUTOMATION_SETTINGS = {
  /** Модель SDK по умолчанию. `auto` для локального SDK здесь не используем. */
  defaultModelId: 'default',

  /** Сколько шагов делает `npm run loop`, если не передан `--max-steps` и нет `MAX_STEPS`. */
  defaultMaxSteps: 5,

  /**
   * Сколько итераций держать в одном `Agent.create(...)`.
   *
   * Длинный один Agent удобен как чат `+`, но conversation/cache context быстро раздувается:
   * на 200/300 шагах это превращается в миллионы cache-read tokens на каждый следующий run.
   * Поэтому long loop режется на короткие SDK-сессии, сохраняя общий MAX_STEPS.
   */
  defaultSessionMaxSteps: 1,

  /** Печатать stream assistant/thinking по умолчанию; обычно выключено, чтобы лог был компактнее. */
  defaultVerbose: false,

  /** Максимум символов stream-лога при VERBOSE=1; дальше вывод режется до конца run. */
  defaultVerboseMaxChars: 8000,

  /** На длинных циклах verbose раздувает terminal logs; выше лимита он выключается без явного override. */
  verboseLongLoopMaxSteps: 20,

  /** На длинных циклах предупреждаем о дорогом cache-read, если сессия держит слишком много шагов. */
  sessionStepsLongLoopWarnAt: 4,

  /** Пауза между успешными итерациями цикла, мс. */
  defaultStepDelayMs: 400,

  /** Минимально допустимая пауза между шагами, мс, чтобы случайный `0` не устроил tight loop. */
  minStepDelayMs: 0,

  /** Повторы SDK/transport-сбоев (`CursorAgentError.isRetryable`, сеть) на один send/wait. */
  defaultStepRetryMaxAttempts: 10,

  /** Верхняя граница для retry-счётчиков, чтобы ошибка в env не дала бесконечный цикл. */
  maxRetryAttemptsCap: 100,

  /** Базовая пауза SDK/transport retry, мс; дальше растёт экспоненциально. */
  defaultStepRetryBaseDelayMs: 2000,

  /** Минимальная базовая пауза retry, мс. */
  minRetryBaseDelayMs: 200,

  /** Максимальная пауза retry после экспоненциального роста, мс. */
  maxRetryDelayMs: 60_000,

  /**
   * Полный повтор любого `result.status === "error"` по умолчанию выключен.
   * Включайте `LOOP_RETRY_RUN_ERROR=1`, только если готовы к повторной отправке того же шага.
   */
  retryAnyRunErrorDefault: false,

  /** Быстрый error-run считаем похожим на transient SDK/runtime-сбой и повторяем даже без полного retry. */
  transientRunErrorMaxDurationMs: 5000,

  /** Локальный SDK не подхватывает ambient settings, пока явно не задан `SETTING_SOURCES_ALL=1`. */
  settingSourcesAllDefault: false,

  /** Значение, которое создаётся в локальном STOP-файле при старте. */
  defaultStopFlagValue: '0\n',

  /** Значения boolean-настроек, которые считаются включением. */
  booleanTrueValues: ['1', 'true', 'yes', 'on'],

  /** Значения boolean-настроек, которые считаются выключением. */
  booleanFalseValues: ['0', 'false', 'no', 'off']
} as const

export function readBooleanSetting(raw: string | undefined, defaultValue: boolean): boolean {
  const value = raw?.trim().toLowerCase()
  if (!value) {
    return defaultValue
  }
  if ((SDK_AUTOMATION_SETTINGS.booleanTrueValues as readonly string[]).includes(value)) {
    return true
  }
  if ((SDK_AUTOMATION_SETTINGS.booleanFalseValues as readonly string[]).includes(value)) {
    return false
  }
  return defaultValue
}

export function readIntegerSetting(
  raw: string | undefined,
  defaultValue: number,
  opts: { min: number; max?: number }
): number {
  const parsed = Number.parseInt(raw ?? String(defaultValue), 10)
  if (!Number.isFinite(parsed) || parsed < opts.min) {
    return defaultValue
  }
  const normalized = Math.floor(parsed)
  return typeof opts.max === 'number' ? Math.min(opts.max, normalized) : normalized
}
