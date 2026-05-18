/** §4.C / §16 — разбор `nvidia-smi --query-gpu=name,driver_version`. */

export type NvidiaSmiGpuInfo = {
  name: string
  driverVersion: string
}

/** Первая строка CSV (primary GPU). */
export function parseNvidiaSmiGpuInfo(text: string): NvidiaSmiGpuInfo | null {
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (line.length === 0) {
      continue
    }
    const comma = line.indexOf(',')
    if (comma < 0) {
      continue
    }
    const name = line.slice(0, comma).trim()
    const driverVersion = line.slice(comma + 1).trim()
    if (name.length === 0 || driverVersion.length === 0) {
      continue
    }
    return { name, driverVersion }
  }
  return null
}
