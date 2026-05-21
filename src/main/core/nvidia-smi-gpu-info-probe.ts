import { execFile } from 'child_process'

import {
  parseNvidiaSmiGpuInfo,
  type NvidiaSmiGpuInfo
} from '../../shared/nvidia-smi-gpu-info-parse'

const QUERY_ARGS = ['--query-gpu=name,driver_version', '--format=csv,noheader,nounits'] as const

const EXEC_OPTS = {
  timeout: 4000,
  windowsHide: true,
  maxBuffer: 64 * 1024
} as const

/** Один вызов `nvidia-smi`; при отсутствии NVIDIA — `null`. */
export function probeNvidiaSmiGpuInfo(
  nvidiaSmiPath = 'nvidia-smi'
): Promise<NvidiaSmiGpuInfo | null> {
  return new Promise((resolve) => {
    execFile(nvidiaSmiPath, [...QUERY_ARGS], EXEC_OPTS, (err, stdout) => {
      if (err) {
        resolve(null)
        return
      }
      resolve(parseNvidiaSmiGpuInfo(String(stdout ?? '')))
    })
  })
}
