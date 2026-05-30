/**
 * Extract ref.1 demo preview + V1 clip thumb PNGs from the processing reference.
 * Run: node scripts/maint/extract-ref1-demo-assets.mjs
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

import sharp from 'sharp'

import { REPO_ROOT } from '../lib/repo-root.mjs'

const refPng = join(REPO_ROOT, 'docs/reference/velorix-neon-reference-processing.png')
const outDir = join(REPO_ROOT, 'docs/reference')

/** V1 lane clip film strip below filename row (native 1920×1080 ref). */
const V1_FILM_TOP = 860
const V1_FILM_HEIGHT = 28
const V1_LANE_LEFT = 412
const V1_LANE_WIDTH = 1280

const CLIPS = [
  { id: 'city-night', grow: 4 },
  { id: 'drive-sequence', grow: 3 },
  { id: 'neon-building', grow: 2 },
  { id: 'digital-billboard', grow: 2 },
  { id: 'glitch-effect', grow: 2 },
  { id: 'rain-reflections', grow: 3 }
]

const totalGrow = CLIPS.reduce((sum, clip) => sum + clip.grow, 0)

await (async () => {
  let laneX = V1_LANE_LEFT
  for (const clip of CLIPS) {
    const width = Math.round((clip.grow / totalGrow) * V1_LANE_WIDTH)
    const outPath = join(outDir, `velorix-neon-ref1-demo-thumb-${clip.id}.png`)
    await sharp(refPng)
      .extract({ left: laneX, top: V1_FILM_TOP, width, height: V1_FILM_HEIGHT })
      .png()
      .toFile(outPath)
    console.log(`[ref1-demo] ${clip.id} ${width}px @ x=${laneX} → ${outPath}`)
    laneX += width
  }
})()

writeFileSync(
  join(REPO_ROOT, 'scripts/maint/ref1-demo-clip-crops.json'),
  `${JSON.stringify({ V1_FILM_TOP, V1_FILM_HEIGHT, V1_LANE_LEFT, V1_LANE_WIDTH, CLIPS }, null, 2)}\n`,
  'utf8'
)
