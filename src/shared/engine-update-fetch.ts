/**
 * §3 — запрос последних версий движков с GitHub (Windows auto-download).
 */

const GITHUB_API = {
  ytDlpLatest: 'https://api.github.com/repos/yt-dlp/yt-dlp/releases/latest',
  ffmpegBuildsLatest: 'https://api.github.com/repos/BtbN/FFmpeg-Builds/releases/latest'
} as const

function userAgent(): string {
  return 'VELORIX/0.1.0 (engine update check; Electron)'
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': userAgent(),
      Accept: 'application/vnd.github+json'
    },
    signal: AbortSignal.timeout(20_000)
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
  return response.json() as Promise<unknown>
}

export async function fetchLatestYtDlpVersionToken(): Promise<string | null> {
  const data = (await fetchJson(GITHUB_API.ytDlpLatest)) as { tag_name?: string }
  const tag = typeof data.tag_name === 'string' ? data.tag_name.trim() : ''
  if (tag === '') {
    return null
  }
  return tag.replace(/^v/i, '')
}

export async function fetchLatestFfmpegVersionToken(): Promise<string | null> {
  const data = (await fetchJson(GITHUB_API.ffmpegBuildsLatest)) as {
    name?: string
    body?: string
  }
  const blob = `${typeof data.name === 'string' ? data.name : ''}\n${
    typeof data.body === 'string' ? data.body : ''
  }`
  const m =
    blob.match(/ffmpeg[^0-9]*(\d+\.\d+(?:\.\d+)?)/i) ??
    blob.match(/(?:^|\s)(\d+\.\d+(?:\.\d+)?)(?:\s|$)/)
  return m?.[1] ?? null
}
