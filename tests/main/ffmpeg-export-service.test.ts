import { describe, expect, it } from 'vitest'

import type { AppSettings } from '../../src/shared/settings-contract'
import { FFMPEG_EXPORT_USER_PRESETS_MAX_ENTRIES } from '../../src/shared/ffmpeg-export-contract'
import {
  getBuiltinFfmpegExportUserPresets,
  mergeBuiltinFfmpegExportUserPresetsFromFile
} from '../../src/shared/builtin-ffmpeg-export-user-presets'
import {
  ensureFfmpegExportExtension,
  inferFfmpegExportContainerFromPath,
  isFfmpegExportProgressStatusLine,
  mergeFfmpegExportSnapshotIntoAppSettings,
  parseFfmpegExportAudioBitrate,
  parseFfmpegExportAudioMode,
  parseFfmpegExportCropPreset,
  parseFfmpegExportEncodePreset,
  parseFfmpegExportContainer,
  parseFfmpegExportCrf,
  parseFfmpegExportFps,
  parseFfmpegExportScalePreset,
  parseFfmpegExportTrim,
  parseFfmpegExportTwoPass,
  parseFfmpegExportUserPresetSnapshot,
  parseFfmpegExportUserPresetsList,
  parseFfmpegExportVideoBitrate,
  parseFfmpegExportVideoGrain,
  parseFfmpegExportVideoVignette,
  parseFfmpegExportVideoBlur,
  parseFfmpegExportVideoDeinterlace,
  parseFfmpegExportVideoHisteq,
  parseFfmpegSpeedToken,
  parseFfmpegTimeSeconds,
  resolveExportEncodeParams,
  resolveExportSegmentDurationSec
} from '../../src/main/ffmpeg-export-service'

describe('ffmpeg export pure helpers', () => {
  it('разбирает time= из строки прогресса ffmpeg', () => {
    expect(parseFfmpegTimeSeconds('frame=42 fps=30 time=00:01:02.50 bitrate=1M')).toBe(62.5)
    expect(parseFfmpegTimeSeconds('no timestamp')).toBeNull()
  })

  it('разбирает speed= из строки прогресса ffmpeg', () => {
    expect(parseFfmpegSpeedToken('time=00:00:01.00 speed=1.25x')).toBe('1.25x')
    expect(parseFfmpegSpeedToken('time=00:00:01.00 speed=N/A')).toBe('N/A')
    expect(parseFfmpegSpeedToken('no speed')).toBeNull()
  })

  it('§7.1 — фильтр строк статусбара: статистика и ошибки, не баннер сборки', () => {
    expect(
      isFfmpegExportProgressStatusLine(
        'frame=  123 fps= 30 q=28.0 size=    1024kB time=00:01:02.50 bitrate= 500.0kbits/s speed=1.2x'
      )
    ).toBe(true)
    expect(isFfmpegExportProgressStatusLine('ffmpeg version 6.0')).toBe(false)
    expect(isFfmpegExportProgressStatusLine('[error] something failed')).toBe(true)
  })

  it('выбирает безопасный encode preset и параметры libx264', () => {
    expect(parseFfmpegExportEncodePreset('quality')).toBe('quality')
    expect(parseFfmpegExportEncodePreset('bad')).toBe('balance')
    expect(resolveExportEncodeParams('quality')).toEqual({ crf: '18', x264preset: 'medium' })
  })

  it('нормализует контейнер экспорта по расширению', () => {
    expect(parseFfmpegExportContainer('mkv')).toBe('mkv')
    expect(parseFfmpegExportContainer('bad')).toBe('mp4')
    expect(inferFfmpegExportContainerFromPath('out.MOV')).toBe('mov')
    expect(ensureFfmpegExportExtension('out', 'mkv')).toBe('out.mkv')
    expect(ensureFfmpegExportExtension('out.mp4', 'mkv')).toBe('out.mp4')
  })

  it('валидирует ручные CRF и audio/video bitrate', () => {
    expect(parseFfmpegExportCrf(18)).toBe(18)
    expect(parseFfmpegExportCrf('28')).toBe(28)
    expect(parseFfmpegExportCrf(52)).toBeNull()
    expect(parseFfmpegExportVideoBitrate('8000K')).toBe('8000k')
    expect(parseFfmpegExportVideoBitrate('100k')).toBeNull()
    expect(parseFfmpegExportVideoBitrate('60000k')).toBeNull()
    expect(parseFfmpegExportAudioBitrate('192K')).toBe('192k')
    expect(parseFfmpegExportAudioBitrate('16k')).toBeNull()
    expect(parseFfmpegExportAudioBitrate('1000k')).toBeNull()
    expect(parseFfmpegExportAudioMode('none')).toBe('none')
    expect(parseFfmpegExportAudioMode('bad')).toBe('aac')
    expect(parseFfmpegExportTwoPass(true)).toBe(true)
    expect(parseFfmpegExportTwoPass(false)).toBe(false)
    expect(parseFfmpegExportTwoPass(1)).toBe(false)
  })

  it('валидирует FPS и scale preset', () => {
    expect(parseFfmpegExportFps(30)).toBe(30)
    expect(parseFfmpegExportFps('60')).toBe(60)
    expect(parseFfmpegExportFps(29.97)).toBeNull()
    expect(parseFfmpegExportScalePreset('720p')).toBe('720p')
    expect(parseFfmpegExportScalePreset('bad')).toBe('source')
    expect(parseFfmpegExportCropPreset('center-16-9')).toBe('center-16-9')
    expect(parseFfmpegExportCropPreset('bad')).toBe('none')
  })

  it('считает длительность сегмента с учётом trim', () => {
    expect(resolveExportSegmentDurationSec({ inSec: 2, outSec: 7 }, true, 20)).toBe(5)
    expect(resolveExportSegmentDurationSec(undefined, false, 12)).toBe(12)
    expect(resolveExportSegmentDurationSec(undefined, false, null)).toBe(0)
  })

  it('валидирует trim payload из renderer IPC', () => {
    expect(parseFfmpegExportTrim({ inSec: 2, outSec: 7 })).toEqual({ inSec: 2, outSec: 7 })
    expect(parseFfmpegExportTrim({ inSec: -1, outSec: 7 })).toBeUndefined()
    expect(parseFfmpegExportTrim({ inSec: 7, outSec: 7 })).toBeUndefined()
    expect(parseFfmpegExportTrim({ inSec: 8, outSec: 7 })).toBeUndefined()
    expect(parseFfmpegExportTrim({ inSec: Number.NaN, outSec: 7 })).toBeUndefined()
    expect(parseFfmpegExportTrim({ inSec: '2', outSec: 7 })).toBeUndefined()
  })

  it('parseFfmpegExportUserPresetSnapshot и список пресетов §7.2', () => {
    expect(parseFfmpegExportUserPresetSnapshot(null)).toBeNull()
    const snap = parseFfmpegExportUserPresetSnapshot({
      encodePreset: 'quality',
      container: 'mkv',
      crf: 20,
      videoBitrate: null,
      audioMode: 'none',
      audioBitrate: '192k',
      fps: 30,
      scalePreset: '720p',
      videoTransform: 'hflip',
      cropPreset: 'center-square'
    })
    expect(snap).toMatchObject({
      encodePreset: 'quality',
      container: 'mkv',
      crf: 20,
      videoBitrate: null,
      audioMode: 'none',
      audioBitrate: '192k',
      fps: 30,
      scalePreset: '720p',
      videoTransform: 'hflip',
      cropPreset: 'center-square'
    })
    const list = parseFfmpegExportUserPresetsList([
      { id: 'ab-cd_1', label: 'Тест', snapshot: snap },
      { id: 'bad id!', label: 'x', snapshot: snap }
    ])
    expect(list).toHaveLength(1)
    expect(list[0]?.id).toBe('ab-cd_1')
    expect(
      parseFfmpegExportUserPresetSnapshot({
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: '2500k',
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        twoPass: true
      })
    ).toMatchObject({ twoPass: true })
    const hevcTwo = parseFfmpegExportUserPresetSnapshot({
      encodePreset: 'balance',
      videoCodec: 'libx265',
      container: 'mp4',
      crf: null,
      videoBitrate: '2500k',
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      videoTransform: 'none',
      cropPreset: 'none',
      twoPass: true
    })
    expect(hevcTwo).toMatchObject({ videoCodec: 'libx265' })
    expect(hevcTwo?.twoPass).toBeUndefined()
    expect(
      parseFfmpegExportUserPresetSnapshot({
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoDeband: 'medium'
      })
    ).toMatchObject({ videoDeband: 'medium' })
    expect(
      parseFfmpegExportUserPresetSnapshot({
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoLut3d: 'punch'
      })
    ).toMatchObject({ videoLut3d: 'punch' })
    expect(
      parseFfmpegExportUserPresetSnapshot({
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoGrain: 'light'
      })
    ).toMatchObject({ videoGrain: 'light' })
    expect(
      parseFfmpegExportUserPresetSnapshot({
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoDeinterlace: 'field'
      })
    ).toMatchObject({ videoDeinterlace: 'field' })
    expect(
      parseFfmpegExportUserPresetSnapshot({
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoHisteq: 'strong'
      })
    ).toMatchObject({ videoHisteq: 'strong' })
  })

  it('parseFfmpegExportVideoGrain — whitelist', () => {
    expect(parseFfmpegExportVideoGrain('light')).toBe('light')
    expect(parseFfmpegExportVideoGrain('bogus')).toBe('off')
  })

  it('parseFfmpegExportVideoVignette — whitelist', () => {
    expect(parseFfmpegExportVideoVignette('medium')).toBe('medium')
    expect(parseFfmpegExportVideoVignette('bogus')).toBe('off')
  })

  it('parseFfmpegExportVideoBlur — whitelist', () => {
    expect(parseFfmpegExportVideoBlur('strong')).toBe('strong')
    expect(parseFfmpegExportVideoBlur('bogus')).toBe('off')
  })

  it('parseFfmpegExportVideoHisteq — whitelist', () => {
    expect(parseFfmpegExportVideoHisteq('light')).toBe('light')
    expect(parseFfmpegExportVideoHisteq('bogus')).toBe('off')
  })

  it('parseFfmpegExportVideoDeinterlace — whitelist', () => {
    expect(parseFfmpegExportVideoDeinterlace('frame')).toBe('frame')
    expect(parseFfmpegExportVideoDeinterlace('field')).toBe('field')
    expect(parseFfmpegExportVideoDeinterlace('bogus')).toBe('off')
  })

  it('mergeFfmpegExportSnapshotIntoAppSettings повторяет правила delete для дефолтов', () => {
    const base: AppSettings = { theme: 'dark', ffmpegExportCrf: 40, ffmpegExportAudioMode: 'none' }
    const next = mergeFfmpegExportSnapshotIntoAppSettings(base, {
      encodePreset: 'balance',
      container: 'mp4',
      crf: null,
      videoBitrate: null,
      audioMode: 'aac',
      audioBitrate: '128k',
      fps: null,
      scalePreset: 'source',
      videoTransform: 'none',
      cropPreset: 'none'
    })
    expect(next.ffmpegExportCrf).toBeUndefined()
    expect(next.ffmpegExportAudioMode).toBeUndefined()
    expect(next.ffmpegExportAudioBitrate).toBe('128k')
    expect(next.ffmpegExportScalePreset).toBeUndefined()
    expect(next.ffmpegExportVideoTransform).toBeUndefined()
    expect(next.ffmpegExportCropPreset).toBeUndefined()
    const withTp = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: '2500k',
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        twoPass: true
      }
    )
    expect(withTp.ffmpegExportTwoPass).toBe(true)

    const hwCodec = mergeFfmpegExportSnapshotIntoAppSettings({ theme: 'dark' }, {
      encodePreset: 'balance',
      videoCodec: 'h264_nvenc',
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
    expect(hwCodec.ffmpegExportVideoCodec).toBe('h264_nvenc')

    const deb = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoDeband: 'strong'
      }
    )
    expect(deb.ffmpegExportVideoDeband).toBe('strong')

    const grain = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoGrain: 'medium'
      }
    )
    expect(grain.ffmpegExportVideoGrain).toBe('medium')

    const vignette = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoVignette: 'light'
      }
    )
    expect(vignette.ffmpegExportVideoVignette).toBe('light')

    const blur = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoBlur: 'medium'
      }
    )
    expect(blur.ffmpegExportVideoBlur).toBe('medium')

    const histeq = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoHisteq: 'light'
      }
    )
    expect(histeq.ffmpegExportVideoHisteq).toBe('light')

    const deint = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoDeinterlace: 'frame'
      }
    )
    expect(deint.ffmpegExportVideoDeinterlace).toBe('frame')

    const hue = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoHue: 'coolShift'
      }
    )
    expect(hue.ffmpegExportVideoHue).toBe('coolShift')

    const lut = mergeFfmpegExportSnapshotIntoAppSettings(
      { theme: 'dark' },
      {
        encodePreset: 'balance',
        container: 'mp4',
        crf: null,
        videoBitrate: null,
        audioMode: 'aac',
        audioBitrate: '192k',
        fps: null,
        scalePreset: 'source',
        videoTransform: 'none',
        cropPreset: 'none',
        videoLut3d: 'film-warm'
      }
    )
    expect(lut.ffmpegExportVideoLut3d).toBe('film-warm')

    const lutOff = mergeFfmpegExportSnapshotIntoAppSettings(lut, {
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
    expect(lutOff.ffmpegExportVideoLut3d).toBeUndefined()

    const off = mergeFfmpegExportSnapshotIntoAppSettings(withTp, {
      encodePreset: 'balance',
      container: 'mp4',
      crf: null,
      videoBitrate: '2500k',
      audioMode: 'aac',
      audioBitrate: '192k',
      fps: null,
      scalePreset: 'source',
      videoTransform: 'none',
      cropPreset: 'none'
    })
    expect(off.ffmpegExportTwoPass).toBeUndefined()
  })

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
    expect(ru.every((p) => p.id.startsWith('flux-builtin-'))).toBe(true)
    expect(ru[0]?.hint && ru[0].hint.length > 0).toBe(true)
  })

  it('§7.2 merge builtins from code + user-only rows from settings file', () => {
    const snap = getBuiltinFfmpegExportUserPresets('ru')[0]!.snapshot
    const legacy = [
      { id: 'flux-builtin-share-mp4', label: 'X', snapshot: snap },
      { id: 'flux-builtin-compact-mp4', label: 'Y', snapshot: snap },
      { id: 'flux-builtin-quality-mkv', label: 'Z', snapshot: snap }
    ]
    const mergedLegacy = mergeBuiltinFfmpegExportUserPresetsFromFile(legacy, 'ru')
    expect(mergedLegacy).toHaveLength(11)
    expect(mergedLegacy[0]?.id).toBe('flux-builtin-tiktok')

    const withUser = mergeBuiltinFfmpegExportUserPresetsFromFile(
      [...legacy, { id: 'my-slot', label: 'Mine', snapshot: snap }],
      'en'
    )
    expect(withUser).toHaveLength(12)
    expect(withUser.some((p) => p.id === 'my-slot')).toBe(true)
    expect(withUser.some((p) => p.id === 'flux-builtin-share-mp4')).toBe(false)
  })
})
