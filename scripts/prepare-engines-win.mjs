/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { createHash } from 'node:crypto'
import { createReadStream, createWriteStream, existsSync } from 'node:fs'
import { mkdir, readdir, rm, stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execFile } from 'node:child_process'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'

import extract from 'extract-zip'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const binDir = join(rootDir, 'bin')
const cacheDir = join(binDir, '.cache')
const trustedHashesPath = join(rootDir, 'Data', 'trusted_hashes.json')

const ytDlpSource = {
  id: 'yt-dlp',
  label: 'yt-dlp GitHub',
  url: 'https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp.exe',
  hashKey: 'yt-dlp.exe'
}

const ffmpegZipSources = [
  {
    id: 'btbn-github',
    label: 'GitHub BtbN',
    url: 'https://github.com/BtbN/FFmpeg-Builds/releases/latest/download/ffmpeg-master-latest-win64-gpl.zip',
    hashKey: 'ffmpeg-master-latest-win64-gpl.zip'
  },
  {
    id: 'gyan-dev',
    label: 'gyan.dev',
    url: 'https://www.gyan.dev/ffmpeg/builds/ffmpeg-release-essentials.zip',
    hashKey: 'ffmpeg-release-essentials.zip'
  }
]

function log(message) {
  console.log(`[engines] ${message}`)
}

function isWindows() {
  return process.platform === 'win32'
}

/** Принудительно перекачать/пересобрать `bin/*.exe`, даже если файлы уже есть (см. `run-prepare-engines-force.mjs`). */
function enginesForce() {
  const v = process.env.FLUXALLOY_ENGINES_FORCE
  return v === '1' || (typeof v === 'string' && v.trim().toLowerCase() === 'true')
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

async function assertSha256Optional(path, expected) {
  if (typeof expected !== 'string' || expected.trim() === '') {
    return
  }
  const actual = await sha256File(path)
  if (actual.toLowerCase() !== expected.trim().toLowerCase()) {
    throw new Error(`SHA256 mismatch for ${path}`)
  }
}

async function loadTrustedHashes() {
  try {
    const raw = await import('node:fs/promises').then((fs) =>
      fs.readFile(trustedHashesPath, 'utf-8')
    )
    return JSON.parse(raw)
  } catch {
    return {}
  }
}

function trustedHashFor(file, source) {
  const windows = file['windows-x64']
  const nested = windows?.[source.hashKey]
  if (typeof nested === 'string' && nested.trim() !== '') {
    return nested.trim()
  }
  if (source.id === 'yt-dlp' && typeof file.YtDlpSha256 === 'string') {
    return file.YtDlpSha256.trim()
  }
  if (source.id === 'gyan-dev' && typeof file.FfmpegSha256 === 'string') {
    return file.FfmpegSha256.trim()
  }
  return undefined
}

async function downloadToFile(url, destPath) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': 'FluxAlloy/0.1.0 (prepare-engines-win)', Accept: '*/*' }
  })
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`)
  }

  const total = Number(response.headers.get('content-length') ?? 0)
  let received = 0
  let lastPercent = -1
  const rawBody = response.body
  if (!rawBody) {
    throw new Error('Empty response body')
  }

  await mkdir(dirname(destPath), { recursive: true })
  const nodeReadable = Readable.fromWeb(rawBody)
  if (total > 0) {
    nodeReadable.on('data', (chunk) => {
      received += Buffer.isBuffer(chunk) ? chunk.length : Buffer.byteLength(chunk)
      const percent = Math.min(99, Math.floor((received / total) * 100))
      if (percent >= lastPercent + 10) {
        lastPercent = percent
        log(`download ${percent}%`)
      }
    })
  }
  await pipeline(nodeReadable, createWriteStream(destPath))
}

async function findExe(root, fileName) {
  const target = fileName.toLowerCase()
  async function walk(dir) {
    const entries = await readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const full = join(dir, entry.name)
      if (entry.isDirectory()) {
        const nested = await walk(full)
        if (nested) {
          return nested
        }
      } else if (entry.name.toLowerCase() === target) {
        return full
      }
    }
    return null
  }
  return walk(root)
}

function readVersion(exePath, args) {
  return new Promise((resolveVersion, reject) => {
    execFile(exePath, args, { timeout: 8000, windowsHide: true }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(stderr.trim() || error.message))
        return
      }
      resolveVersion(
        stdout
          .split(/\r?\n/)
          .find((line) => line.trim())
          ?.trim() ?? exePath
      )
    })
  })
}

async function ensureYtDlp(trusted) {
  const target = join(binDir, 'yt-dlp.exe')
  if (enginesForce() && (await fileExistsNonEmpty(target))) {
    log('FLUXALLOY_ENGINES_FORCE: удаляю yt-dlp.exe перед повторной загрузкой')
    await rm(target, { force: true })
  }
  if (await fileExistsNonEmpty(target)) {
    log('yt-dlp.exe already exists')
    return
  }

  log(`downloading ${ytDlpSource.label}`)
  await downloadToFile(ytDlpSource.url, target)
  await assertSha256Optional(target, trustedHashFor(trusted, ytDlpSource))
}

async function ensureFfmpeg(trusted) {
  const ffmpegTarget = join(binDir, 'ffmpeg.exe')
  const ffprobeTarget = join(binDir, 'ffprobe.exe')
  if (enginesForce()) {
    if ((await fileExistsNonEmpty(ffmpegTarget)) || (await fileExistsNonEmpty(ffprobeTarget))) {
      log('FLUXALLOY_ENGINES_FORCE: удаляю ffmpeg.exe / ffprobe.exe перед повторной загрузкой')
      await rm(ffmpegTarget, { force: true })
      await rm(ffprobeTarget, { force: true })
    }
  }
  if ((await fileExistsNonEmpty(ffmpegTarget)) && (await fileExistsNonEmpty(ffprobeTarget))) {
    log('ffmpeg.exe and ffprobe.exe already exist')
    return
  }

  await rm(cacheDir, { recursive: true, force: true })
  await mkdir(cacheDir, { recursive: true })

  let lastError = null
  for (const source of ffmpegZipSources) {
    const zipPath = join(cacheDir, source.hashKey)
    const extractDir = join(cacheDir, `extract-${source.id}`)
    try {
      log(`downloading FFmpeg from ${source.label}`)
      await downloadToFile(source.url, zipPath)
      await assertSha256Optional(zipPath, trustedHashFor(trusted, source))

      await rm(extractDir, { recursive: true, force: true })
      await mkdir(extractDir, { recursive: true })
      log(`extracting FFmpeg from ${source.label}`)
      await extract(zipPath, { dir: extractDir })

      const ffmpegFound = await findExe(extractDir, 'ffmpeg.exe')
      const ffprobeFound = await findExe(extractDir, 'ffprobe.exe')
      if (!ffmpegFound || !ffprobeFound) {
        throw new Error('archive does not contain ffmpeg.exe / ffprobe.exe')
      }

      await import('node:fs/promises').then(async (fs) => {
        await fs.copyFile(ffmpegFound, ffmpegTarget)
        await fs.copyFile(ffprobeFound, ffprobeTarget)
      })
      const wx = trusted['windows-x64']
      const exeFfmpeg =
        wx && typeof wx['ffmpeg.exe'] === 'string' ? wx['ffmpeg.exe'].trim() : undefined
      const exeFfprobe =
        wx && typeof wx['ffprobe.exe'] === 'string' ? wx['ffprobe.exe'].trim() : undefined
      await assertSha256Optional(ffmpegTarget, exeFfmpeg || undefined)
      await assertSha256Optional(ffprobeTarget, exeFfprobe || undefined)
      return
    } catch (error) {
      lastError = error
      log(`${source.label} failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  throw lastError ?? new Error('No FFmpeg source succeeded')
}

async function main() {
  if (!isWindows()) {
    log('Windows-only engine bootstrap skipped on this platform')
    return
  }

  await mkdir(binDir, { recursive: true })
  const trusted = await loadTrustedHashes()
  await ensureYtDlp(trusted)
  await ensureFfmpeg(trusted)

  const versions = await Promise.all([
    readVersion(join(binDir, 'ffmpeg.exe'), ['-version']),
    readVersion(join(binDir, 'ffprobe.exe'), ['-version']),
    readVersion(join(binDir, 'yt-dlp.exe'), ['--version'])
  ])
  log(`ready: ${versions.map((line) => line.split(/\s+/).slice(0, 3).join(' ')).join(' | ')}`)

  if (existsSync(cacheDir)) {
    await rm(cacheDir, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error(
    `[engines] failed: ${error instanceof Error ? error.stack || error.message : String(error)}`
  )
  process.exitCode = 1
})
