/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Resolve capture monitor for neon-ref-visual.
 *
 * Default (`ide`): center of Cursor/VS Code main window → Electron screen.getDisplayNearestPoint.
 * Overrides:
 *   VELORIX_REF_VISUAL_DISPLAY=primary|ide|fhd|fhd-non-primary|<index>
 *   VELORIX_REF_VISUAL_DISPLAY_POINT=x,y
 */
import { execFileSync } from 'node:child_process'
import { join } from 'node:path'

import { REPO_ROOT } from '../lib/repo-root.mjs'

const LOG = '[neon:ref:visual:display]'
const IDE_CENTER_PS1 = join(REPO_ROOT, 'scripts/e2e/neon-ref-visual-ide-center.ps1')

/** @returns {{ x: number, y: number } | null} */
function parseDisplayPointEnv() {
  const raw = process.env.VELORIX_REF_VISUAL_DISPLAY_POINT?.trim()
  if (!raw) {
    return null
  }
  const m = /^(-?\d+)\s*,\s*(-?\d+)$/.exec(raw)
  if (!m) {
    throw new Error(`invalid VELORIX_REF_VISUAL_DISPLAY_POINT "${raw}" (expected x,y)`)
  }
  return { x: Number(m[1]), y: Number(m[2]) }
}

/** @returns {{ x: number, y: number } | null} */
function resolveIdeWindowCenterWin() {
  try {
    const out = execFileSync(
      'powershell',
      ['-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-File', IDE_CENTER_PS1],
      { encoding: 'utf8', windowsHide: true, timeout: 15_000 }
    ).trim()
    const m = /^(-?\d+),(-?\d+)$/.exec(out.split(/\r?\n/).pop() ?? '')
    if (!m) {
      return null
    }
    const point = { x: Number(m[1]), y: Number(m[2]) }
    console.log(`${LOG} IDE window center (${point.x},${point.y}) ← Cursor|Code`)
    return point
  } catch (err) {
    const code = typeof err === 'object' && err && 'status' in err ? err.status : null
    if (code === 2) {
      console.log(`${LOG} no Cursor/Code main window — will fall back`)
      return null
    }
    console.warn(`${LOG} IDE window lookup failed — will fall back`)
    return null
  }
}

/** @returns {{ x: number, y: number } | null} */
function resolveIdeWindowCenter() {
  if (process.platform === 'win32') {
    return resolveIdeWindowCenterWin()
  }
  return null
}

/**
 * Point / mode passed into Electron during capture.
 * @returns {Promise<{ mode: string, point: { x: number, y: number } | null, displayIndex: number | null }>}
 */
export async function resolveNeonRefVisualDisplayHint() {
  const fromEnv = parseDisplayPointEnv()
  if (fromEnv) {
    return { mode: 'point-env', point: fromEnv, displayIndex: null }
  }

  const mode = (process.env.VELORIX_REF_VISUAL_DISPLAY ?? 'ide').trim().toLowerCase()

  if (mode === 'primary') {
    return { mode: 'primary', point: null, displayIndex: null }
  }

  if (mode === 'fhd' || mode === 'fhd-non-primary') {
    return { mode, point: null, displayIndex: null }
  }

  const indexMatch = /^(\d+)$/.exec(mode)
  if (indexMatch) {
    return { mode: 'index', point: null, displayIndex: Number(indexMatch[1]) }
  }

  if (mode === 'ide') {
    const center = resolveIdeWindowCenter()
    if (center) {
      return { mode: 'ide', point: center, displayIndex: null }
    }
    console.log(`${LOG} IDE mode fallback → fhd-non-primary display`)
    return { mode: 'fhd-non-primary', point: null, displayIndex: null }
  }

  throw new Error(
    `unknown VELORIX_REF_VISUAL_DISPLAY "${mode}" (use ide|primary|fhd|fhd-non-primary|<index> or VELORIX_REF_VISUAL_DISPLAY_POINT=x,y)`
  )
}
