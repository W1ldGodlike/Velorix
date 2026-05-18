import { describe, expect, it } from 'vitest'

import {
  ensureFfmpegSnapshotExtension,
  parseFfmpegSnapshotFormat
} from '../../src/main/ffmpeg-frame-snapshot-service'

describe('ffmpeg-frame-snapshot-service helpers', () => {
  it('нормализует формат снимка к png/jpg', () => {
    expect(parseFfmpegSnapshotFormat('png')).toBe('png')
    expect(parseFfmpegSnapshotFormat('jpg')).toBe('jpg')
    expect(parseFfmpegSnapshotFormat('jpeg')).toBe('jpg')
    expect(parseFfmpegSnapshotFormat('webp')).toBe('webp')
    expect(parseFfmpegSnapshotFormat(null)).toBe('png')
  })

  it('добавляет расширение снимка, если пользователь сохранил путь без него', () => {
    expect(ensureFfmpegSnapshotExtension('C:/tmp/frame', 'png')).toBe('C:/tmp/frame.png')
    expect(ensureFfmpegSnapshotExtension('C:/tmp/frame', 'jpg')).toBe('C:/tmp/frame.jpg')
    expect(ensureFfmpegSnapshotExtension('C:/tmp/frame.jpeg', 'png')).toBe('C:/tmp/frame.jpeg')
    expect(ensureFfmpegSnapshotExtension('C:/tmp/frame.PNG', 'jpg')).toBe('C:/tmp/frame.PNG')
  })
})
