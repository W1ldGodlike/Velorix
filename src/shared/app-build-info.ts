import buildInfoJson from './app-build-info.json'

export type AppBuildInfo = {
  buildId: string
  builtAtUtc: string | null
}

const DEFAULT_BUILD_INFO: AppBuildInfo = { buildId: 'dev', builtAtUtc: null }

export function readAppBuildInfo(): AppBuildInfo {
  const raw = buildInfoJson as Partial<AppBuildInfo>
  const buildId =
    typeof raw.buildId === 'string' && raw.buildId.trim().length > 0
      ? raw.buildId.trim()
      : DEFAULT_BUILD_INFO.buildId
  const builtAtUtc =
    typeof raw.builtAtUtc === 'string' && raw.builtAtUtc.trim().length > 0
      ? raw.builtAtUtc.trim()
      : null
  return { buildId, builtAtUtc }
}

/** ISO UTC для Support ZIP и логов (без локали). */
export function formatBuiltAtUtcLine(builtAtUtc: string | null): string | null {
  if (!builtAtUtc) {
    return null
  }
  const d = new Date(builtAtUtc)
  if (Number.isNaN(d.getTime())) {
    return builtAtUtc
  }
  return d
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d{3}Z$/, ' UTC')
}

export function formatAboutBuildIdDisplay(buildId: string): string {
  const id = buildId.trim()
  return id.length > 0 ? id : 'unknown'
}

export function buildSupportZipBuildInfoLines(info: AppBuildInfo): string[] {
  const lines = [`buildId: ${formatAboutBuildIdDisplay(info.buildId)}`]
  const built = formatBuiltAtUtcLine(info.builtAtUtc)
  if (built) {
    lines.push(`builtAtUtc: ${built}`)
  }
  return lines
}
