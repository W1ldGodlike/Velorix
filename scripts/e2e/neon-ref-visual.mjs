#!/usr/bin/env node
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * NEON sign-off tooling: Electron capture + pixel diff vs docs/reference/*.png
 *
 * Usage:
 *   node scripts/e2e/neon-ref-visual.mjs capture ref1
 *   node scripts/e2e/neon-ref-visual.mjs diff ref1 [--threshold=0.02]
 *   node scripts/e2e/neon-ref-visual.mjs run ref1
 *
 * Requires: `npm run build` (out/main) or pass --skip-build if out/ exists.
 * Close other Velorix instances (single-instance lock).
 * Capture: IDE monitor workArea (как prod / как Cursor), shell body vs ref scaled at diff.
 * Override: VELORIX_REF_VISUAL_DISPLAY=primary|ide|<index> or VELORIX_REF_VISUAL_DISPLAY_POINT=x,y
 */
import { spawnSync } from 'node:child_process'
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  unlinkSync,
  writeFileSync
} from 'node:fs'
import { join } from 'node:path'

import pixelmatch from 'pixelmatch'
import { PNG } from 'pngjs'
import { _electron as electron } from 'playwright'
import sharp from 'sharp'

import { REPO_ROOT } from '../lib/repo-root.mjs'
import {
  NEON_REF_VISUAL_CAPTURE_HIDE_CSS,
  NEON_REF_VISUAL_OUTPUT_DIR,
  resolveNeonRefVisualTarget
} from './neon-ref-visual-config.mjs'
import { resolveNeonRefVisualDisplayHint } from './neon-ref-visual-display.mjs'

const LOG = '[neon:ref:visual]'
const HISTORY_KEEP = 5
const VERBOSE = process.env.VELORIX_REF_VISUAL_VERBOSE === '1'

function vlog(...args) {
  if (VERBOSE) {
    console.log(...args)
  }
}

function usage() {
  console.log(`Usage:
  node scripts/e2e/neon-ref-visual.mjs capture <refId> [--skip-build]
  node scripts/e2e/neon-ref-visual.mjs diff <refId> [--threshold=0.02]
  node scripts/e2e/neon-ref-visual.mjs run <refId> [--threshold=0.02] [--skip-build]`)
}

/** @param {string} rel posix path from repo root */
function absFromRepo(rel) {
  return join(REPO_ROOT, ...rel.split('/'))
}

function ensureBuilt(skipBuild) {
  const mainOut = join(REPO_ROOT, 'out', 'main', 'index.js')
  if (existsSync(mainOut)) {
    console.log(
      `${LOG} using existing out/main${skipBuild ? ' (--skip-build)' : ' (npm run build to refresh)'}`
    )
    return
  }
  console.log(`${LOG} out/main missing — running npm run build…`)
  const r = spawnSync('npm', ['run', 'build'], { cwd: REPO_ROOT, stdio: 'inherit', shell: true })
  if (r.status !== 0) {
    throw new Error('npm run build failed')
  }
}

/** @typedef {{ data: Buffer, width: number, height: number }} RgbaImage */

/** @param {string} filePath */
async function readRgbaImage(filePath) {
  const { data, info } = await sharp(filePath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  return { data, width: info.width, height: info.height }
}

/** @param {PNG} png @param {string} filePath */
function writePng(png, filePath) {
  writeFileSync(filePath, PNG.sync.write(png))
}

function outputPaths(refId) {
  const base = join(REPO_ROOT, NEON_REF_VISUAL_OUTPUT_DIR)
  const latest = join(base, 'latest')
  const history = join(base, 'history', refId)
  mkdirSync(latest, { recursive: true })
  mkdirSync(history, { recursive: true })
  return {
    capture: join(latest, `${refId}-capture.png`),
    diff: join(latest, `${refId}-diff.png`),
    report: join(latest, `${refId}-report.json`),
    historyDir: history
  }
}

/** @param {string} historyDir @param {string} srcCapture */
function rotateHistory(historyDir, srcCapture) {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  const dest = join(historyDir, `${stamp}.png`)
  copyFileSync(srcCapture, dest)
  const files = readdirSync(historyDir)
    .filter((f) => f.endsWith('.png'))
    .map((f) => ({ f, mtime: statSync(join(historyDir, f)).mtimeMs }))
    .sort((a, b) => b.mtime - a.mtime)
  for (const entry of files.slice(HISTORY_KEEP)) {
    unlinkSync(join(historyDir, entry.f))
  }
}

/** @param {import('playwright').ElectronApplication} app */
async function forceCloseElectron(app) {
  try {
    await app.evaluate(({ app: electronApp }) => {
      electronApp.exit(0)
    })
  } catch {
    // window may already be gone
  }

  const proc = app.process()
  if (proc && !proc.killed) {
    proc.kill('SIGKILL')
  }

  try {
    await Promise.race([
      app.close(),
      new Promise((resolve) => {
        setTimeout(resolve, 750)
      })
    ])
  } catch {
    if (proc && !proc.killed) {
      proc.kill('SIGKILL')
    }
  }
}

/**
 * @param {{ mode: string, point: { x: number, y: number } | null, displayIndex: number | null }} hint
 */
async function resolveCaptureWorkArea(app, hint) {
  return app.evaluate(({ screen }, displayHint) => {
    const displays = screen.getAllDisplays().sort((a, b) => a.bounds.x - b.bounds.x)

    /** @param {Electron.Display} d */
    const pack = (d) => {
      const { x, y, width, height } = d.workArea
      return { x, y, width, height, id: d.id, label: d.label ?? String(d.id) }
    }

    if (displayHint.mode === 'primary') {
      return { ...pack(screen.getPrimaryDisplay()), mode: displayHint.mode }
    }

    if (displayHint.displayIndex != null) {
      const idx = Math.min(displayHint.displayIndex, displays.length - 1)
      const d = displays[idx]
      if (!d) {
        throw new Error(`no displays available`)
      }
      return { ...pack(d), mode: displayHint.mode, index: idx }
    }

    if (displayHint.mode === 'fhd' || displayHint.mode === 'fhd-non-primary') {
      const primaryId = screen.getPrimaryDisplay().id
      const isFhd = (d) => d.workArea.width >= 1900 && d.workArea.width <= 1940
      const fhd = displays.filter(isFhd)
      const preferNonPrimary = displayHint.mode === 'fhd-non-primary'
      const pick =
        (preferNonPrimary ? fhd.find((d) => d.id !== primaryId) : fhd[0]) ??
        (preferNonPrimary ? displays.find((d) => d.id !== primaryId) : null) ??
        fhd[0] ??
        screen.getPrimaryDisplay()
      return { ...pack(pick), mode: displayHint.mode }
    }

    if (displayHint.point) {
      const d = screen.getDisplayNearestPoint(displayHint.point)
      return { ...pack(d), mode: displayHint.mode }
    }

    return { ...pack(screen.getPrimaryDisplay()), mode: 'primary-fallback' }
  }, hint)
}

/**
 * @param {import('./neon-ref-visual-config.mjs').NeonRefVisualTarget} target
 * @param {string} capturePath
 */
async function captureRef(target, capturePath) {
  const electronBin =
    process.platform === 'win32'
      ? join(REPO_ROOT, 'node_modules', 'electron', 'dist', 'electron.exe')
      : join(REPO_ROOT, 'node_modules', 'electron', 'dist', 'electron')

  if (!existsSync(electronBin)) {
    throw new Error(`electron binary missing: ${electronBin}`)
  }

  const mainEntry = join(REPO_ROOT, 'out', 'main', 'index.js')
  if (!existsSync(mainEntry)) {
    throw new Error('out/main/index.js missing — run npm run build')
  }

  const refPngPath = absFromRepo(target.pngRel)
  const refImg = await readRgbaImage(refPngPath)
  vlog(
    `${LOG} reference native ${refImg.width}x${refImg.height} ← ${target.pngRel} (scaled at diff)`
  )

  const displayHint = await resolveNeonRefVisualDisplayHint()
  const refVisualAppData = join(REPO_ROOT, NEON_REF_VISUAL_OUTPUT_DIR, 'app-data')
  const displayPointEnv =
    displayHint.point != null
      ? `${displayHint.point.x},${displayHint.point.y}`
      : process.env.VELORIX_REF_VISUAL_DISPLAY_POINT

  const app = await electron.launch({
    executablePath: electronBin,
    args: [mainEntry, '--force-device-scale-factor=1'],
    cwd: REPO_ROOT,
    env: {
      ...process.env,
      ELECTRON_DISABLE_SECURITY_WARNINGS: 'true',
      VELORIX_REF_VISUAL: '1',
      VELORIX_APP_DATA: refVisualAppData,
      ...(displayPointEnv ? { VELORIX_REF_VISUAL_DISPLAY_POINT: displayPointEnv } : {})
    }
  })

  try {
    const page = await app.firstWindow()
    await page.waitForLoadState('domcontentloaded')
    if (target.hash && target.hash !== '#ref1') {
      await page.evaluate((hash) => {
        window.location.hash = hash
      }, target.hash)
    }
    await page.waitForSelector(target.shellSelector, { timeout: 60_000 })
    await page.addStyleTag({ content: NEON_REF_VISUAL_CAPTURE_HIDE_CSS })

    const demoSprites = page.locator('.processing-preview__scene-demo, .processing-clip__film-demo')
    const spriteCount = await demoSprites.count()
    if (spriteCount > 0) {
      for (let attempt = 0; attempt < 40; attempt += 1) {
        const loaded = await demoSprites.evaluateAll((nodes) =>
          nodes.every(
            (node) => node instanceof HTMLImageElement && node.complete && node.naturalWidth > 0
          )
        )
        if (loaded) {
          break
        }
        await page.waitForTimeout(250)
      }
    }

    await page.waitForTimeout(400)

    const workArea = await resolveCaptureWorkArea(app, displayHint)

    vlog(
      `${LOG} display ${workArea.mode} workArea ${workArea.width}x${workArea.height} @ (${workArea.x},${workArea.y}) id=${workArea.id}`
    )

    await page.waitForTimeout(500)
    const captureSelector = target.captureSelector ?? target.bodySelector
    await page.locator(captureSelector).screenshot({
      path: capturePath,
      animations: 'disabled',
      scale: 'css'
    })

    const captured = await readRgbaImage(capturePath)
    vlog(`${LOG} captured ${captureSelector} ${captured.width}x${captured.height} → ${capturePath}`)
  } finally {
    await forceCloseElectron(app)
  }
}

/**
 * @param {string} refId
 * @param {number} threshold
 */
async function diffRef(refId, threshold) {
  const target = resolveNeonRefVisualTarget(refId)
  const paths = outputPaths(refId)
  const refPath = absFromRepo(target.pngRel)

  if (!existsSync(paths.capture)) {
    throw new Error(`capture missing: ${paths.capture} — run capture first`)
  }

  const imgCap = await readRgbaImage(paths.capture)
  const refNative = await readRgbaImage(refPath)
  const refScaledPath = `${paths.capture}.ref-scaled.png`
  await sharp(refPath)
    .resize(imgCap.width, imgCap.height, { fit: 'fill' })
    .png()
    .toFile(refScaledPath)
  const imgRef = await readRgbaImage(refScaledPath)
  unlinkSync(refScaledPath)

  const diff = new PNG({ width: imgCap.width, height: imgCap.height })
  const mismatched = pixelmatch(imgRef.data, imgCap.data, diff.data, imgCap.width, imgCap.height, {
    threshold: 0.1,
    includeAA: false
  })

  writePng(diff, paths.diff)

  const total = imgCap.width * imgCap.height
  const ratio = mismatched / total
  const report = {
    refId,
    reference: target.pngRel,
    referenceNativeWidth: refNative.width,
    referenceNativeHeight: refNative.height,
    capture: paths.capture.replace(/\\/g, '/'),
    diff: paths.diff.replace(/\\/g, '/'),
    width: imgCap.width,
    height: imgCap.height,
    mismatchedPixels: mismatched,
    totalPixels: total,
    mismatchRatio: ratio,
    mismatchPercent: Number((ratio * 100).toFixed(3)),
    passThreshold: threshold,
    pass: ratio <= threshold,
    capturedAt: new Date().toISOString()
  }

  writeFileSync(paths.report, `${JSON.stringify(report, null, 2)}\n`)

  if (VERBOSE) {
    console.log(`${LOG} diff ${report.mismatchPercent}% (${mismatched}/${total} px)`)
    console.log(`${LOG} diff image → ${paths.diff}`)
    console.log(`${LOG} report → ${paths.report}`)
    console.log(`${LOG} ${report.pass ? 'PASS' : 'FAIL'} (threshold ${threshold * 100}%)`)
  } else {
    console.log(
      `${LOG} ${report.pass ? 'OK' : 'FAIL'} ${refId} diff ${report.mismatchPercent}% → ${paths.report}`
    )
  }

  return report
}

function parseArgs(argv) {
  const positional = []
  let threshold = 0.02
  let skipBuild = false
  for (const arg of argv) {
    if (arg === '--skip-build') {
      skipBuild = true
    } else if (arg.startsWith('--threshold=')) {
      threshold = Number(arg.slice('--threshold='.length))
    } else if (arg.startsWith('-')) {
      throw new Error(`unknown flag: ${arg}`)
    } else {
      positional.push(arg)
    }
  }
  return { positional, threshold, skipBuild }
}

async function main() {
  const { positional, threshold, skipBuild } = parseArgs(process.argv.slice(2))
  const [cmd, refId] = positional

  if (!cmd || cmd === 'help' || cmd === '--help') {
    usage()
    process.exit(cmd ? 0 : 1)
  }

  if (!refId) {
    usage()
    process.exit(1)
  }

  resolveNeonRefVisualTarget(refId)
  const paths = outputPaths(refId)

  if (cmd === 'capture' || cmd === 'run') {
    ensureBuilt(skipBuild)
    await captureRef(resolveNeonRefVisualTarget(refId), paths.capture)
    rotateHistory(paths.historyDir, paths.capture)
  }

  if (cmd === 'diff' || cmd === 'run') {
    const report = await diffRef(refId, threshold)
    process.exit(report.pass ? 0 : 1)
  }

  if (cmd !== 'capture') {
    throw new Error(`unknown command: ${cmd}`)
  }
}

main().catch((err) => {
  console.error(`${LOG} ERROR:`, err instanceof Error ? err.message : err)
  process.exit(1)
})
