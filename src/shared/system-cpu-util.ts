/**
 * §16 — оценка загрузки CPU по дельте `os.cpus()` (без внешних зависимостей).
 */

import os from 'node:os'

export type CpuTimesAggregate = { idle: number; total: number }

export function readCpuTimesAggregate(): CpuTimesAggregate {
  let idle = 0
  let total = 0
  for (const cpu of os.cpus()) {
    const times = cpu.times
    idle += times.idle
    total += times.user + times.nice + times.sys + times.idle + times.irq
  }
  return { idle, total }
}

export function computeCpuUtilPercent(prev: CpuTimesAggregate, next: CpuTimesAggregate): number {
  const idleDelta = next.idle - prev.idle
  const totalDelta = next.total - prev.total
  if (totalDelta <= 0) {
    return 0
  }
  const used = 1 - idleDelta / totalDelta
  return Math.min(100, Math.max(0, Math.round(used * 100)))
}

/** Периодический замер загрузки CPU во время длительной операции (encode/benchmark). */
export class SystemCpuLoadSampler {
  private peak = 0
  private sum = 0
  private samples = 0
  private prev: CpuTimesAggregate
  private timer: ReturnType<typeof setInterval> | null = null

  constructor() {
    this.prev = readCpuTimesAggregate()
  }

  start(intervalMs = 400): void {
    this.stop()
    this.timer = setInterval(() => {
      const next = readCpuTimesAggregate()
      const pct = computeCpuUtilPercent(this.prev, next)
      this.prev = next
      this.peak = Math.max(this.peak, pct)
      this.sum += pct
      this.samples += 1
    }, intervalMs)
  }

  stop(): { peakPercent: number | null; avgPercent: number | null } {
    if (this.timer !== null) {
      clearInterval(this.timer)
      this.timer = null
    }
    if (this.samples === 0) {
      return { peakPercent: null, avgPercent: null }
    }
    return {
      peakPercent: this.peak,
      avgPercent: Math.round(this.sum / this.samples)
    }
  }
}
