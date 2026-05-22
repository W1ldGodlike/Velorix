/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §3 — macOS/Linux: скачивает `bin/yt-dlp`, `bin/ffmpeg`, `bin/ffprobe` (BtbN tar.xz + yt-dlp).
 * Вызывается с хоста darwin/linux; иначе — только подсказки через `prepare-engines-bundled-first.mjs`.
 */
import { createHash } from 'node:crypto'
import {
  chmod,
  copyFile,
  createReadStream,
  createWriteStream,
  mkdir,
  readdir,
  rm,
  stat
} from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const binDir = join(rootDir, 'bin')
const cacheDir = join(binDir, '.cache-unix')
const trustedHashesPath = join(rootDir, 'Data', 'trusted_hashes.json')

const ytDlpUrl = 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp'

/** @type {Record<'mac' | 'linux', { label: string; ffmpegArch: () => string }>} */
export const UNIX_PREPARE_PLATFORMS = {
  mac: {
    label: 'macOS',
    ffmpegArch: () => (process.arch === 'arm64' ? 'macosarm64' : 'macos64')
  },
  linux: {
    label: 'Linux',
    ffmpegArch: () => 'linux64'
  }
}

function log(message) {
  console.log(`[engines] ${message}`)
}

function enginesForce() {
  const v = process.env.FLUXALLOY_ENGINES_FORCE
  return v === '1' || (typeof v === 'string' && v.trim().toLowerCase() === 'true')
}

function engineDownloadTimeoutMs() {
  const raw = process.env.FLUXALLOY_ENGINE_DOWNLOAD_TIMEOUT_MS
  const n = raw != null ? Number.parseInt(String(raw).trim(), 10) : Number.NaN
  return Number.isFinite(n) && n > 0 ? n : 600_000
}

async function fileExistsNonEmpty(path) {
  try {
    const s = await stat(path)
    return s.isFile() && s.size > 0
  } catch {
    return false
  }
}

async function sha256File(path) {
  return new Promise((resolveHash, reject) => {
    const hash = createHash('sha256')
    createReadStream(path)
      .on('error', reject)
      .on('data', (chunk) => hash.update(chunk))
      .on('end', () => resolveHash(hash.digest('hex')))
  })
}

async function loadTrustedHashes() {
  try {
    const { readFile } = await import('node:fs/promises')
    return JSON.parse(await readFile(trustedHashesPath, 'utf-8'))
  } catch {
    return {}
  }
}

async function downloadToFile(url, destPath) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': 'FluxAlloy/0.1.0 (prepare-engines-unix)', Accept: '*/*' },
    signal: AbortSignal.timeout(engineDownloadTimeoutMs())
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`)
  }
  await mkdir(dirname(destPath), { recursive: true })
  const rawBody = response.body
  if (!rawBody) {
    throw new Error('Empty response body')
  }
  await pipeline(Readable.fromWeb(rawBody), createWriteStream(destPath))
}

async function findUnixBinary(root, baseName) {
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        const nested = await walk(full)
        if (nested) {
          return nested
        }
      } else if (entry.name === baseName) {
        return full
      }
    }
    return null
  }
  return walk(root)
}

function extractTarXz(archivePath, destDir) {
  const r = spawnSync('tar', ['-xJf', archivePath, '-C', destDir], { stdio: 'inherit' })
  if (r.status !== 0) {
    throw new Error(`tar -xJf failed (exit ${r.status ?? 'unknown'})`)
  }
}

async function ensureExecutable(filePath) {
  await chmod(filePath, 0o755)
}

function ffmpegTarUrl(archKey) {
  return `https://github.com/BtbN/FFmpeg-Builds/releases/latest/download/ffmpeg-master-latest-${archKey}-gpl.tar.xz`
}

async function ensureYtDlp() {
  const target = join(binDir, 'yt-dlp')
  if (enginesForce() && (await fileExistsNonEmpty(target))) {
    log('FLUXALLOY_ENGINES_FORCE: удаляю yt-dlp перед повторной загрузкой')
    await rm(target, { force: true })
  }
  if (await fileExistsNonEmpty(target)) {
    log('yt-dlp already exists')
    return
  }
  log('downloading yt-dlp')
  await downloadToFile(ytDlpUrl, target)
  await ensureExecutable(target)
}

async function ensureFfmpeg(platformKey) {
  const ffmpegTarget = join(binDir, 'ffmpeg')
  const ffprobeTarget = join(binDir, 'ffprobe')
  if (enginesForce()) {
    if ((await fileExistsNonEmpty(ffmpegTarget)) || (await fileExistsNonEmpty(ffprobeTarget))) {
      log('FLUXALLOY_ENGINES_FORCE: удаляю ffmpeg / ffprobe перед повторной загрузкой')
      await rm(ffmpegTarget, { force: true })
      await rm(ffprobeTarget, { force: true })
    }
  }
  if ((await fileExistsNonEmpty(ffmpegTarget)) && (await fileExistsNonEmpty(ffprobeTarget))) {
    log('ffmpeg and ffprobe already exist')
    return
  }

  const archKey = UNIX_PREPARE_PLATFORMS[platformKey].ffmpegArch()
  const archiveName = `ffmpeg-master-latest-${archKey}-gpl.tar.xz`
  const archivePath = join(cacheDir, archiveName)
  const extractDir = join(cacheDir, `extract-${archKey}`)

  await rm(cacheDir, { recursive: true, force: true })
  await mkdir(cacheDir, { recursive: true })

  log(`downloading FFmpeg (${UNIX_PREPARE_PLATFORMS[platformKey].label}, ${archKey})`)
  await downloadToFile(ffmpegTarUrl(archKey), archivePath)

  await rm(extractDir, { recursive: true, force: true })
  await mkdir(extractDir, { recursive: true })
  log('extracting FFmpeg tar.xz')
  extractTarXz(archivePath, extractDir)

  const ffmpegFound = await findUnixBinary(extractDir, 'ffmpeg')
  const ffprobeFound = await findUnixBinary(extractDir, 'ffprobe')
  if (!ffmpegFound || !ffprobeFound) {
    throw new Error('archive does not contain ffmpeg / ffprobe')
  }

  await copyFile(ffmpegFound, ffmpegTarget)
  await copyFile(ffprobeFound, ffprobeTarget)
  await ensureExecutable(ffmpegTarget)
  await ensureExecutable(ffprobeTarget)

  const trusted = await loadTrustedHashes()
  const section =
    platformKey === 'mac'
      ? trusted.darwin && typeof trusted.darwin === 'object'
        ? trusted.darwin
        : {}
      : trusted['linux-x64'] && typeof trusted['linux-x64'] === 'object'
        ? trusted['linux-x64']
        : {}
  const expectedFfmpeg = typeof section.ffmpeg === 'string' ? section.ffmpeg.trim() : ''
  const expectedFfprobe = typeof section.ffprobe === 'string' ? section.ffprobe.trim() : ''
  if (expectedFfmpeg !== '') {
    const actual = await sha256File(ffmpegTarget)
    if (actual.toLowerCase() !== expectedFfmpeg.toLowerCase()) {
      throw new Error('SHA256 mismatch for ffmpeg')
    }
  }
  if (expectedFfprobe !== '') {
    const actual = await sha256File(ffprobeTarget)
    if (actual.toLowerCase() !== expectedFfprobe.toLowerCase()) {
      throw new Error('SHA256 mismatch for ffprobe')
    }
  }
}

function hostMatchesPlatform(platformKey) {
  return (
    (platformKey === 'mac' && process.platform === 'darwin') ||
    (platformKey === 'linux' && process.platform === 'linux')
  )
}

function printHelp(platformKey) {
  const p = UNIX_PREPARE_PLATFORMS[platformKey]
  console.log(`prepare-engines-unix (${p.label}) — загрузка yt-dlp + ffmpeg/ffprobe в bin/.

Только на ${p.label}-хосте: npm run engines:prepare:${platformKey}
FLUXALLOY_ENGINES_FORCE=1 — перекачать
FLUXALLOY_ENGINE_DOWNLOAD_TIMEOUT_MS — таймаут HTTP (мс)

После загрузки: npm run engines:doctor`)
}

/** @param {'mac' | 'linux'} platformKey */
export async function runUnixEnginePrepare(platformKey) {
  if (!UNIX_PREPARE_PLATFORMS[platformKey]) {
    throw new Error(`unknown platform: ${platformKey}`)
  }
  if (!hostMatchesPlatform(platformKey)) {
    log(
      `${UNIX_PREPARE_PLATFORMS[platformKey].label} prepare skipped on ${process.platform} (run on target OS)`
    )
    return
  }

  await mkdir(binDir, { recursive: true })
  if (process.env.FLUXALLOY_ENGINE_DOWNLOAD_TIMEOUT_MS) {
    log(`FLUXALLOY_ENGINE_DOWNLOAD_TIMEOUT_MS=${engineDownloadTimeoutMs()} ms`)
  }
  await ensureYtDlp()
  await ensureFfmpeg(platformKey)
  log('unix engines ready — npm run engines:doctor')
  await rm(cacheDir, { recursive: true, force: true })
}

async function main() {
  const platformKey = process.argv[2]
  if (!platformKey || !UNIX_PREPARE_PLATFORMS[platformKey]) {
    console.error('Usage: node scripts/release/prepare-engines-unix.mjs mac|linux [--help]')
    process.exit(1)
  }
  if (process.argv.includes('--help')) {
    printHelp(platformKey)
    return
  }
  await runUnixEnginePrepare(platformKey)
}

main().catch((error) => {
  console.error(
    `[engines] failed: ${error instanceof Error ? error.stack || error.message : String(error)}`
  )
  process.exitCode = 1
})
