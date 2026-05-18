import { describe, expect, it } from 'vitest'

import { parseNvidiaSmiGpuUtilizationPercent } from '../../src/shared/nvidia-smi-gpu-util-parse'

describe('parseNvidiaSmiGpuUtilizationPercent', () => {
  it('parses single line', () => {
    expect(parseNvidiaSmiGpuUtilizationPercent('42\n')).toBe(42)
  })

  it('takes max across GPUs', () => {
    expect(parseNvidiaSmiGpuUtilizationPercent('12\n87\n')).toBe(87)
  })

  it('returns null for empty', () => {
    expect(parseNvidiaSmiGpuUtilizationPercent('')).toBeNull()
  })
})
