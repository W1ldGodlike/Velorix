import { execFile } from 'child_process'

import { nativeMainCurrentPlatform } from '../shared/native-main-platform'

const EXEC_OPTS = {
  timeout: 6000,
  windowsHide: true,
  maxBuffer: 256 * 1024
} as const

function parseNonEmptyLines(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
}

function probeGpuAdapterNamesWindows(): Promise<string[]> {
  const ps =
    'Get-CimInstance Win32_VideoController | ForEach-Object { $_.Name } | Where-Object { $_ }'
  return new Promise((resolve) => {
    execFile(
      'powershell.exe',
      ['-NoProfile', '-NonInteractive', '-Command', ps],
      EXEC_OPTS,
      (err, stdout) => {
        if (err) {
          resolve([])
          return
        }
        resolve(parseNonEmptyLines(String(stdout ?? '')))
      }
    )
  })
}

function probeGpuAdapterNamesLinux(): Promise<string[]> {
  return new Promise((resolve) => {
    execFile('lspci', ['-nn'], EXEC_OPTS, (err, stdout) => {
      if (err) {
        resolve([])
        return
      }
      const names: string[] = []
      for (const line of parseNonEmptyLines(String(stdout ?? ''))) {
        if (!/\b(VGA|3D|Display)\b/i.test(line)) {
          continue
        }
        names.push(line)
      }
      resolve(names)
    })
  })
}

function probeGpuAdapterNamesDarwin(): Promise<string[]> {
  return new Promise((resolve) => {
    execFile('system_profiler', ['SPDisplaysDataType'], EXEC_OPTS, (err, stdout) => {
      if (err) {
        resolve([])
        return
      }
      const names: string[] = []
      for (const line of String(stdout ?? '').split(/\r?\n/)) {
        const m = /^\s*(Chipset Model|Model):\s*(.+)$/i.exec(line)
        if (m?.[2]) {
          names.push(m[2].trim())
        }
      }
      resolve(names)
    })
  })
}

/** Имена GPU-адаптеров для фильтра бенчмарка (без shell, таймаут). */
export async function probeGpuAdapterNames(
  platform: NodeJS.Platform = nativeMainCurrentPlatform()
): Promise<string[]> {
  if (platform === 'win32') {
    return probeGpuAdapterNamesWindows()
  }
  if (platform === 'linux') {
    return probeGpuAdapterNamesLinux()
  }
  if (platform === 'darwin') {
    return probeGpuAdapterNamesDarwin()
  }
  return []
}
