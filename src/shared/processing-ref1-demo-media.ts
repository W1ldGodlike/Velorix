/** ref.1 mock preview + timeline thumbs — dedicated demo PNGs (not full-shell sprite crop). */

import { velorixRefPngUrl } from './neon-reference-overlay-dev'

export const PROCESSING_REF1_DEMO_PREVIEW_REL =
  'docs/reference/velorix-neon-ref1-demo-preview.png' as const

export const PROCESSING_REF1_DEMO_CLIP_THUMBS = {
  'city-night': 'docs/reference/velorix-neon-ref1-demo-thumb-city-night.png',
  'drive-sequence': 'docs/reference/velorix-neon-ref1-demo-thumb-drive-sequence.png',
  'neon-building': 'docs/reference/velorix-neon-ref1-demo-thumb-neon-building.png',
  'digital-billboard': 'docs/reference/velorix-neon-ref1-demo-thumb-digital-billboard.png',
  'glitch-effect': 'docs/reference/velorix-neon-ref1-demo-thumb-glitch-effect.png',
  'rain-reflections': 'docs/reference/velorix-neon-ref1-demo-thumb-rain-reflections.png'
} as const

export type ProcessingRef1DemoClipThumbId = keyof typeof PROCESSING_REF1_DEMO_CLIP_THUMBS

export function processingRef1DemoPreviewUrl(): string {
  return velorixRefPngUrl(PROCESSING_REF1_DEMO_PREVIEW_REL)
}

export function processingRef1DemoClipThumbUrl(id: ProcessingRef1DemoClipThumbId): string {
  return velorixRefPngUrl(PROCESSING_REF1_DEMO_CLIP_THUMBS[id])
}
