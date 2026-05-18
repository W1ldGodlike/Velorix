/**
 * §16 — разбор `nvidia-smi --query-gpu=utilization.gpu` (без spawn; main вызывает CLI).
 */

/** Максимальный процент загрузки GPU из stdout nvidia-smi (одна или несколько строк). */
export function parseNvidiaSmiGpuUtilizationPercent(stdout: string): number | null {
  let max: number | null = null
  for (const rawLine of stdout.split(/\r?\n/)) {
    const t = rawLine.trim().replace(/%/g, '')
    if (t.length === 0) {
      continue
    }
    const n = Number(t)
    if (!Number.isFinite(n) || n < 0) {
      continue
    }
    const pct = Math.min(100, Math.round(n))
    if (max === null || pct > max) {
      max = pct
    }
  }
  return max
}
