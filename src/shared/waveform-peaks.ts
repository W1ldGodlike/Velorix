/**
 * Downsampling огибающей громкости для компактной отрисовки waveform в UI редактора.
 * Чистая функция — пригодна для Vitest без Electron/React.
 */

export function computeWaveformPeakEnvelopeMono(
  samples: Float32Array,
  bucketCount: number
): readonly number[] {
  if (!Number.isFinite(bucketCount) || bucketCount <= 0) {
    return []
  }
  const n = samples.length
  if (n === 0) {
    return Array.from({ length: bucketCount }, (): number => 0)
  }

  const out: number[] = []
  const block = n / bucketCount

  for (let b = 0; b < bucketCount; b++) {
    const start = Math.floor(b * block)
    const end = Math.min(n, Math.floor((b + 1) * block))
    let m = 0
    for (let i = start; i < end; i++) {
      const v = Math.abs(samples[i] ?? 0)
      if (v > m) {
        m = v
      }
    }
    out.push(m)
  }

  let maxPeak = 0
  for (const v of out) {
    if (v > maxPeak) {
      maxPeak = v
    }
  }
  if (maxPeak < 1e-9) {
    return out.map(() => 0)
  }
  return out.map((v) => v / maxPeak)
}
