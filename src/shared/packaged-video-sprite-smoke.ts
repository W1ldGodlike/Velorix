/**
 * §7.5/§19 — offline guard для argv превью-спрайта (без запуска ffmpeg).
 */
import { buildFfmpegVideoSpriteVideoFilter } from './ffmpeg-video-sprite-argv'

/** Типичная цепочка -vf для smoke/диагностики (4×3, 60s, без drawtext). */
export function samplePackagedVideoSpriteVideoFilter(): string {
  return buildFfmpegVideoSpriteVideoFilter({
    sampleFps: 12 / 60,
    columns: 4,
    rows: 3,
    burnTimestamps: false
  })
}

export function isPackagedVideoSpriteVideoFilterShape(vf: string): boolean {
  return /^fps=/.test(vf) && vf.includes('scale=320:-2:flags=lanczos') && /tile=\d+x\d+$/.test(vf)
}

export function isPackagedVideoSpriteVideoFilterWithTimestamps(vf: string): boolean {
  return isPackagedVideoSpriteVideoFilterShape(vf) && vf.includes('drawtext=') && vf.includes('pts')
}

/** §18 Support ZIP / smoke — подсказки без exe. */
export function formatPackagedVideoSpriteSmokeDiagnosticLines(): string[] {
  const sample = samplePackagedVideoSpriteVideoFilter()
  return [
    'guard: buildFfmpegVideoSpriteVideoFilter + isPackagedVideoSpriteVideoFilterShape (§7.5)',
    `sample-vf: ${sample}`,
    'ui: EditorVideoSpritePanel → export.generateVideoSprite → velorix:generate-video-sprite',
    'dev: npm run test — tests/shared/packaged-video-sprite-smoke.test.ts'
  ]
}
