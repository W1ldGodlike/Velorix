import { describe, expect, it } from 'vitest'

import { buildEditorVideoSpriteManualSmokeChecklistFromLocaleShard } from '../../src/shared/editor-video-sprite-manual-smoke-checklist-build'
import { formatEditorVideoSpriteManualSmokeChecklistLines } from '../../src/shared/editor-video-sprite-manual-smoke-checklist'
import ruEditorVideoSpriteManualSmoke from '../../locales/ru/editor-video-sprite-manual-smoke.json'

describe('editor-video-sprite-manual-smoke-checklist §7.5', () => {
  it('builds video-sprite section', () => {
    const sections = buildEditorVideoSpriteManualSmokeChecklistFromLocaleShard(
      ruEditorVideoSpriteManualSmoke as Record<string, string>
    )
    expect(sections).toHaveLength(1)
    expect(sections[0]?.id).toBe('video-sprite')
  })

  it('format lines mention sprite panel and offline guard', () => {
    const joined = formatEditorVideoSpriteManualSmokeChecklistLines().join('\n')
    expect(joined).toContain('Спрайт превью')
    expect(joined).toContain('step [generate]')
    expect(joined).toContain('packaged-video-sprite-smoke')
    expect(joined).toContain('sample-vf:')
  })
})
