import { describe, expect, it } from 'vitest'

import { FFMPEG_EXPORT_USER_PRESETS_MAX_ENTRIES } from '../../src/shared/ffmpeg-export-contract'
import {
  getBuiltinFfmpegExportUserPresets,
  mergeBuiltinFfmpegExportUserPresetsFromFile
} from '../../src/shared/builtin-ffmpeg-export-user-presets'
import {
  parseFfmpegExportUserPresetSnapshot,
  parseFfmpegExportUserPresetsList
} from '../../src/main/services/ffmpeg/ffmpeg-export-service'

describe('ffmpeg export pure helpers', () => {
  it('parses preset hint and caps list length', () => {
    const snap = parseFfmpegExportUserPresetSnapshot({
      encodePreset: 'balance',
      container: 'mp4',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      videoTransform: 'none',
      cropPreset: 'none'
    })
    expect(snap).toBeTruthy()
    const raw = Array.from({ length: 30 }, (_, i) => ({
      id: `p${i}`,
      label: `L${i}`,
      hint: i === 0 ? 'Подсказка' : undefined,
      snapshot: snap
    }))
    const parsed = parseFfmpegExportUserPresetsList(raw)
    expect(parsed).toHaveLength(FFMPEG_EXPORT_USER_PRESETS_MAX_ENTRIES)
    expect(parsed[0]?.hint).toBe('Подсказка')
  })

  it('§7.2 built-in platform presets count', () => {
    const ru = getBuiltinFfmpegExportUserPresets('ru')
    expect(ru).toHaveLength(11)
    expect(ru.every((p) => p.id.startsWith('velorix-builtin-'))).toBe(true)
    expect(ru[0]?.hint && ru[0].hint.length > 0).toBe(true)
  })

  it('§7.2 merge builtins from code + user-only rows from settings file', () => {
    const snap = getBuiltinFfmpegExportUserPresets('ru')[0]!.snapshot
    const legacy = [
      { id: 'velorix-builtin-share-mp4', label: 'X', snapshot: snap },
      { id: 'velorix-builtin-compact-mp4', label: 'Y', snapshot: snap },
      { id: 'velorix-builtin-quality-mkv', label: 'Z', snapshot: snap }
    ]
    const mergedLegacy = mergeBuiltinFfmpegExportUserPresetsFromFile(legacy, 'ru')
    expect(mergedLegacy).toHaveLength(11)
    expect(mergedLegacy[0]?.id).toBe('velorix-builtin-tiktok')

    const withUser = mergeBuiltinFfmpegExportUserPresetsFromFile(
      [...legacy, { id: 'my-slot', label: 'Mine', snapshot: snap }],
      'en'
    )
    expect(withUser).toHaveLength(12)
    expect(withUser.some((p) => p.id === 'my-slot')).toBe(true)
    expect(withUser.some((p) => p.id === 'velorix-builtin-share-mp4')).toBe(false)
  })
})
