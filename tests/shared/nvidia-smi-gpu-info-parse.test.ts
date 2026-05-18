import { describe, expect, it } from 'vitest'

import { parseNvidiaSmiGpuInfo } from '../../src/shared/nvidia-smi-gpu-info-parse'

describe('parseNvidiaSmiGpuInfo', () => {
  it('parses name and driver from CSV line', () => {
    expect(parseNvidiaSmiGpuInfo('NVIDIA GeForce RTX 3060, 551.61\n')).toEqual({
      name: 'NVIDIA GeForce RTX 3060',
      driverVersion: '551.61'
    })
  })

  it('uses first non-empty line', () => {
    expect(parseNvidiaSmiGpuInfo('\nNVIDIA RTX 4090, 560.70\nNVIDIA RTX 3060, 551.61\n')).toEqual({
      name: 'NVIDIA RTX 4090',
      driverVersion: '560.70'
    })
  })

  it('returns null for empty', () => {
    expect(parseNvidiaSmiGpuInfo('')).toBeNull()
  })
})
