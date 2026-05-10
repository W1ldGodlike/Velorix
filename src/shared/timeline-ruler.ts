/**
 * Равномерные деления для компактной time ruler редактора (§1.1 / `docs/UX_REFERENCE_V0.md`).
 * Pure helper без React/Electron — удобен для Vitest.
 */

/** Выбирает «красивый» шаг (сек) для ~targetTickCount меток на отрезке `windowLenSec`. */
export function pickTimelineRulerStepSec(windowLenSec: number, targetTickCount = 6): number {
  const w = Number(windowLenSec)
  if (!Number.isFinite(w) || w <= 0) {
    return 1
  }
  const raw = w / Math.max(2, Math.floor(targetTickCount))
  if (!Number.isFinite(raw) || raw <= 0) {
    return 1
  }
  const exponent = Math.floor(Math.log10(raw))
  const fraction = raw / 10 ** exponent
  let nf = 10
  if (fraction < 1.5) {
    nf = 1
  } else if (fraction < 3) {
    nf = 2
  } else if (fraction < 7) {
    nf = 5
  }
  return nf * 10 ** exponent
}

/** Список временных меток внутри [windowStartSec, windowEndSec] с шагом `stepSec`. */
export function buildTimelineRulerTicks(
  windowStartSec: number,
  windowEndSec: number,
  stepSec: number
): readonly number[] {
  const a = Number(windowStartSec)
  const b = Number(windowEndSec)
  const step = Number(stepSec)
  if (!Number.isFinite(a) || !Number.isFinite(b) || b <= a || !Number.isFinite(step) || step <= 0) {
    return []
  }
  const eps = Math.max(step * 1e-9, 1e-6)
  const ticks: number[] = []
  const nStart = Math.ceil((a - eps) / step)
  for (let i = 0; i < 256; i++) {
    const t = nStart * step + i * step
    if (t > b + eps) break
    ticks.push(t)
  }
  return ticks
}
