import { existsSync, mkdtempSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { spawnSync } from 'node:child_process'

import type { ElectronApplication, Page } from 'playwright'
import { _electron as electron } from '@playwright/test'

import { resolvePackagedGuiE2eAppPath } from '../../../src/shared/packaged-gui-e2e-playwright-app-path'

export function resolvePlannedGuiE2eExecutable(): string | null {
  return resolvePackagedGuiE2eAppPath(process.cwd())
}

/** Короткий MP4 для open-file / snapshot / export (рядом с packaged ffmpeg). */
export function createPlannedGuiE2eSampleMp4(executablePath: string): string {
  const dir = mkdtempSync(join(tmpdir(), 'VELORIX-e2e-media-'))
  const out = join(dir, 'sample-e2e.mp4')
  const ffmpeg = join(dirname(executablePath), 'resources', 'bin', 'ffmpeg.exe')
  if (!existsSync(ffmpeg)) {
    writeFileSync(out, '', 'utf-8')
    return out
  }
  const result = spawnSync(
    ffmpeg,
    [
      '-hide_banner',
      '-loglevel',
      'error',
      '-f',
      'lavfi',
      '-i',
      'color=c=black:s=160x120:d=1',
      '-c:v',
      'libx264',
      '-t',
      '1',
      '-y',
      out
    ],
    { encoding: 'utf-8', timeout: 60_000 }
  )
  if (result.status !== 0 || !existsSync(out) || statSync(out).size < 100) {
    throw new Error(`ffmpeg sample failed: ${result.stderr || result.stdout || result.status}`)
  }
  return out
}

export async function launchPackagedVELORIX(executablePath: string): Promise<ElectronApplication> {
  return electron.launch({
    executablePath,
    env: {
      ...process.env,
      VELORIX_E2E: '1'
    }
  })
}

export async function waitForMainShell(page: Page): Promise<void> {
  await page.waitForSelector('#workspace-tab-processing', { timeout: 60_000 })
}

export async function openLocalVideoViaTopbar(page: Page, mediaPath: string): Promise<void> {
  const openBtn = page.locator('button[title*="Pick a video"], button[title*="Выбрать видео"]')
  const [fileChooser] = await Promise.all([
    page.waitForEvent('filechooser', { timeout: 15_000 }),
    openBtn.click()
  ])
  await fileChooser.setFiles(mediaPath)
  await page.locator('video.app-preview-video').waitFor({ state: 'visible', timeout: 30_000 })
}
