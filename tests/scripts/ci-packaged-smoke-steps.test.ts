import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { expandPackagedE2eCiSmokeScriptsForWorkflow } from '../../src/shared/packaged-e2e-smoke-scenarios'

describe('ci packaged smoke steps §19', () => {
  const workflow = readFileSync('.github/workflows/ci.yml', 'utf8')

  function indexAfterPackDir(needle: string): number {
    const packIdx = workflow.indexOf('npm run pack:dir')
    expect(packIdx).toBeGreaterThanOrEqual(0)
    const needleIdx = workflow.indexOf(needle, packIdx)
    expect(needleIdx).toBeGreaterThan(packIdx)
    return needleIdx
  }

  it('runs verify, app, ffprobe, ffmpeg, and yt-dlp smoke after pack:dir', () => {
    indexAfterPackDir('verify:win-unpacked')
    indexAfterPackDir('smoke:packaged-app')
    indexAfterPackDir('smoke:packaged-ffprobe')
    indexAfterPackDir('smoke:packaged-ffmpeg')
    indexAfterPackDir('smoke:packaged-ytdlp')
  })

  it('uses dedicated CI steps for ffprobe and ffmpeg smoke', () => {
    expect(workflow).toMatch(/name: Packaged ffprobe smoke/)
    expect(workflow).toMatch(/name: Packaged ffmpeg smoke/)
    expect(workflow).toContain('run: npm run smoke:packaged-ffprobe')
    expect(workflow).toContain('run: npm run smoke:packaged-ffmpeg')
  })

  it('does not run pack:mac:dir in CI (mac pack is local/manual on darwin)', () => {
    expect(workflow).not.toMatch(/run:\s*npm run pack:mac:dir/)
    expect(workflow).toMatch(/macOS electron-builder.*local/i)
  })

  it('does not run build:linux or verify:linux-release in CI (full linux release is local)', () => {
    expect(workflow).not.toMatch(/run:\s*npm run build:linux/)
    expect(workflow).not.toMatch(/run:\s*npm run verify:linux-release/)
  })

  it('linux-packaging job runs pack:linux:dir and verify:linux-unpacked', () => {
    const linuxJob = workflow.slice(workflow.indexOf('linux-packaging:'))
    expect(linuxJob).toContain('runs-on: ubuntu-latest')
    expect(linuxJob).toContain('npm run check:quiet')
    const buildIdx = linuxJob.indexOf('npm run build')
    const packIdx = linuxJob.indexOf('npm run pack:linux:dir')
    expect(buildIdx).toBeGreaterThanOrEqual(0)
    expect(packIdx).toBeGreaterThan(buildIdx)
    expect(linuxJob).toContain('npm run pack:linux:dir')
    expect(linuxJob).toContain('npm run verify:linux-unpacked')
    expect(linuxJob).not.toContain('engines:prepare:win')
  })

  it('§21 registry ciSmokeScript npm scripts appear in CI workflow', () => {
    const scripts = expandPackagedE2eCiSmokeScriptsForWorkflow()
    expect(scripts).toContain('smoke:packaged-app')
    expect(scripts).toContain('smoke:packaged-ffprobe')
    for (const script of scripts) {
      expect(workflow).toContain(`npm run ${script}`)
    }
  })
})
