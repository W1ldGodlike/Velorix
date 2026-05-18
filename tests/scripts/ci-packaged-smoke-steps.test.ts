import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

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

  it('linux-packaging job runs pack:linux:dir and verify:linux-unpacked', () => {
    const linuxJob = workflow.slice(workflow.indexOf('linux-packaging:'))
    expect(linuxJob).toContain('runs-on: ubuntu-latest')
    expect(linuxJob).toContain('npm run check:quiet')
    expect(linuxJob).toContain('npm run pack:linux:dir')
    expect(linuxJob).toContain('npm run verify:linux-unpacked')
    expect(linuxJob).not.toContain('engines:prepare:win')
  })
})
