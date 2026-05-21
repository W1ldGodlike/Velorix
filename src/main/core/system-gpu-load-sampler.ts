import { spawn } from 'child_process'

import { parseNvidiaSmiGpuUtilizationPercent } from '../../shared/nvidia-smi-gpu-util-parse'

const NVIDIA_SMI_QUERY = ['--query-gpu=utilization.gpu', '--format=csv,noheader,nounits'] as const

/**
 * Периодический опрос `nvidia-smi` во время encode (NVIDIA; иначе null).
 */
export class SystemGpuLoadSampler {
  private peak = 0
  private sum = 0
  private samples = 0
  private timer: ReturnType<typeof setInterval> | null = null
  private busy = false

  constructor(private readonly nvidiaSmiPath: string) {}

  start(intervalMs = 500): void {
    this.stop()
    this.timer = setInterval(() => {
      void this.sampleOnce()
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

  private sampleOnce(): Promise<void> {
    if (this.busy) {
      return Promise.resolve()
    }
    this.busy = true
    return new Promise((resolve) => {
      const child = spawn(this.nvidiaSmiPath, [...NVIDIA_SMI_QUERY], {
        windowsHide: true,
        stdio: ['ignore', 'pipe', 'ignore']
      })
      let out = ''
      child.stdout?.setEncoding('utf8')
      child.stdout?.on('data', (chunk: string) => {
        out += chunk
      })
      child.on('error', () => {
        this.busy = false
        resolve()
      })
      child.on('close', () => {
        const pct = parseNvidiaSmiGpuUtilizationPercent(out)
        if (pct !== null) {
          this.peak = Math.max(this.peak, pct)
          this.sum += pct
          this.samples += 1
        }
        this.busy = false
        resolve()
      })
    })
  }
}

export function probeNvidiaSmiOnce(
  nvidiaSmiPath = 'nvidia-smi'
): Promise<{ ok: true; path: string } | { ok: false }> {
  return new Promise((resolve) => {
    const child = spawn(nvidiaSmiPath, [...NVIDIA_SMI_QUERY], {
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'ignore']
    })
    let settled = false
    const done = (ok: boolean): void => {
      if (settled) {
        return
      }
      settled = true
      resolve(ok ? { ok: true, path: nvidiaSmiPath } : { ok: false })
    }
    const timer = setTimeout(() => {
      try {
        child.kill()
      } catch {
        /* ignore */
      }
      done(false)
    }, 2500)
    child.on('error', () => {
      clearTimeout(timer)
      done(false)
    })
    child.on('close', (code) => {
      clearTimeout(timer)
      done(code === 0)
    })
  })
}
