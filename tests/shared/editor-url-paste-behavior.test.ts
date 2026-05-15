import { describe, expect, it } from 'vitest'

import {
  DEFAULT_EDITOR_URL_PASTE_BEHAVIOR,
  parseEditorUrlPasteBehavior
} from '../../src/shared/editor-url-paste-behavior'

describe('parseEditorUrlPasteBehavior', () => {
  it('дефолт downloads_window', () => {
    expect(parseEditorUrlPasteBehavior(undefined)).toBe(DEFAULT_EDITOR_URL_PASTE_BEHAVIOR)
    expect(parseEditorUrlPasteBehavior('bad')).toBe(DEFAULT_EDITOR_URL_PASTE_BEHAVIOR)
  })

  it('принимает download_open_editor', () => {
    expect(parseEditorUrlPasteBehavior('download_open_editor')).toBe('download_open_editor')
  })
})
