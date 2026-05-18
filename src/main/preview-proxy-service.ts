import { execFile } from 'child_process'
import { createHash } from 'crypto'
import { existsSync, mkdirSync, rmSync, statSync } from 'fs'
import { extname, join, normalize } from 'path'

import type { AppUiLocale } from '../shared/app-ui-locale'
import { getMainApplicationStrings } from '../shared/main-application-locale'
import { resolveAppPaths } from './app-paths'
import type { EnginePathOverrides } from './engine-service'
import { resolveEngineExecutablePath } from './engine-service'
import { scanFolderForFfmpegExportBatchVideos } from './ffmpeg-export-batch-folder-scan'
import { logInfo } from './logger-service'

export type PreviewProxyServiceAccess = {
  getEnginePathOverrides: () => EnginePathOverrides
  getUiLocale: () => AppUiLocale
  getMainAppStrings: () => {
    batchExportFolderEmpty: string
    previewGrantOpenFailed: string
  }
}

let access: PreviewProxyServiceAccess | null = null

export function configurePreviewProxyService(next: PreviewProxyServiceAccess): void {
  access = next
}

function requireAccess(): PreviewProxyServiceAccess {
  if (!access) {
    throw new Error('preview-proxy-service: configurePreviewProxyService not called')
  }
  return access
}

function isLikelyBrowserPlayableMedia(filePath: string): boolean {
  const ext = extname(filePath).toLowerCase()
  return ['.mp4', '.m4v', '.webm', '.ogg', '.ogv', '.mp3', '.wav', '.flac'].includes(ext)
}

const previewProxyJobs = new Map<string, Promise<string>>()

function runFfmpegPreviewProxy(ffmpeg: string, input: string, output: string): Promise<void> {
  const args = [
    '-y',
    '-i',
    input,
    '-map',
    '0:v:0',
    '-map',
    '0:a?',
    '-c:v',
    'libvpx',
    '-deadline',
    'realtime',
    '-cpu-used',
    '5',
    '-b:v',
    '2500k',
    '-vf',
    "scale=w='min(1280,iw)':h=-2",
    '-c:a',
    'libopus',
    '-b:a',
    '128k',
    output
  ]

  return new Promise((resolvePromise, reject) => {
    execFile(
      ffmpeg,
      args,
      { timeout: 20 * 60_000, windowsHide: true },
      (error, _stdout, stderr) => {
        if (error) {
          reject(new Error(stderr.trim() || error.message))
          return
        }
        resolvePromise()
      }
    )
  })
}

function isUsablePreviewCache(filePath: string): boolean {
  if (!existsSync(filePath)) {
    return false
  }
  try {
    const st = statSync(filePath)
    return st.isFile() && st.size > 0
  } catch {
    return false
  }
}

async function createWebmPreviewProxy(
  ffmpeg: string,
  absoluteFile: string,
  output: string
): Promise<string> {
  const loc = requireAccess().getUiLocale()
  rmSync(output, { force: true })
  logInfo('preview', `creating webm preview proxy for ${absoluteFile}`)
  await runFfmpegPreviewProxy(ffmpeg, absoluteFile, output)
  if (!isUsablePreviewCache(output)) {
    throw new Error(getMainApplicationStrings(loc).previewWebmNotCreated)
  }
  logInfo('preview', `webm preview proxy ready: ${output}`)
  return output
}

export function resolveUserPathToPreviewSourceFile(rawPath: string):
  | { ok: true; path: string }
  | {
      ok: false
      error: string
    } {
  const P = requireAccess().getMainAppStrings()
  const normalized = normalize(rawPath.trim())
  if (!existsSync(normalized)) {
    return { ok: false, error: P.previewGrantOpenFailed }
  }
  try {
    const st = statSync(normalized)
    if (st.isDirectory()) {
      const scanned = scanFolderForFfmpegExportBatchVideos(normalized)
      if (scanned.length === 0) {
        return { ok: false, error: P.batchExportFolderEmpty }
      }
      return { ok: true, path: scanned[0]! }
    }
    if (!st.isFile()) {
      return { ok: false, error: P.previewGrantOpenFailed }
    }
    return { ok: true, path: normalized }
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    }
  }
}

export async function ensurePreviewPlayableMedia(absoluteFile: string): Promise<string> {
  if (isLikelyBrowserPlayableMedia(absoluteFile)) {
    return absoluteFile
  }

  const svc = requireAccess()
  const paths = resolveAppPaths()
  const ffmpeg = resolveEngineExecutablePath(paths, 'ffmpeg', svc.getEnginePathOverrides())
  if (!ffmpeg) {
    throw new Error(
      getMainApplicationStrings(svc.getUiLocale()).previewFfmpegMissingForWebm
    )
  }

  const st = statSync(absoluteFile)
  const key = createHash('sha256')
    .update(absoluteFile)
    .update(String(st.mtimeMs))
    .update(String(st.size))
    .digest('hex')
    .slice(0, 24)
  const cacheDir = join(paths.userData, 'preview-cache')
  mkdirSync(cacheDir, { recursive: true })
  const output = join(cacheDir, `${key}.webm`)
  if (isUsablePreviewCache(output)) {
    return output
  }
  rmSync(output, { force: true })

  const existingJob = previewProxyJobs.get(output)
  if (existingJob) {
    return existingJob
  }
  const job = createWebmPreviewProxy(ffmpeg, absoluteFile, output).finally(() => {
    previewProxyJobs.delete(output)
  })
  previewProxyJobs.set(output, job)
  return job
}
