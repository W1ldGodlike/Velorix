import { describe, expect, it } from 'vitest'

import {
  PROCESSING_REF1_DEMO_CLIP_THUMBS,
  PROCESSING_REF1_DEMO_PREVIEW_REL,
  processingRef1DemoClipThumbUrl,
  processingRef1DemoPreviewUrl
} from '../../src/shared/processing-ref1-demo-media'

describe('processing-ref1-demo-media', () => {
  it('maps preview demo PNG to velorixref URL', () => {
    expect(processingRef1DemoPreviewUrl()).toBe('velorixref:///velorix-neon-ref1-demo-preview.png')
    expect(PROCESSING_REF1_DEMO_PREVIEW_REL).toContain('velorix-neon-ref1-demo-preview.png')
  })

  it('maps each V1 clip thumb id to velorixref URL', () => {
    expect(processingRef1DemoClipThumbUrl('city-night')).toBe(
      'velorixref:///velorix-neon-ref1-demo-thumb-city-night.png'
    )
    expect(Object.keys(PROCESSING_REF1_DEMO_CLIP_THUMBS)).toHaveLength(6)
  })
})
