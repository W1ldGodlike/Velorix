import { describe, expect, it } from 'vitest'

import { extractYtdlpOutputPath } from '../../src/main/services/ytdlp/ytdlp-progress-parser'

describe('extractYtdlpOutputPath', () => {
  it('извлекает путь из Destination строк', () => {
    expect(extractYtdlpOutputPath('[download] Destination: C:\\Downloads\\video.mp4')).toBe(
      'C:\\Downloads\\video.mp4'
    )
    expect(extractYtdlpOutputPath('[ExtractAudio] Destination: /tmp/audio.m4a')).toBe(
      '/tmp/audio.m4a'
    )
  })

  it('извлекает путь из merge/already-downloaded строк', () => {
    expect(extractYtdlpOutputPath('[Merger] Merging formats into "C:\\Downloads\\final.mp4"')).toBe(
      'C:\\Downloads\\final.mp4'
    )
    expect(extractYtdlpOutputPath('[download] /tmp/final.mp4 has already been downloaded')).toBe(
      '/tmp/final.mp4'
    )
  })

  it('возвращает null для обычных строк прогресса', () => {
    expect(extractYtdlpOutputPath('[download] 50% of 1MiB at 1MiB/s')).toBeNull()
  })

  it('извлекает путь из записи превью и субтитров', () => {
    expect(extractYtdlpOutputPath('[download] Writing thumbnail to: D:\\out\\thumb.webp')).toBe(
      'D:\\out\\thumb.webp'
    )
    expect(extractYtdlpOutputPath('[download] Writing video subtitles to: /tmp/sub.en.srt')).toBe(
      '/tmp/sub.en.srt'
    )
    expect(extractYtdlpOutputPath('[download] Writing subtitles to: "/tmp/spaced sub.srt"')).toBe(
      '/tmp/spaced sub.srt'
    )
  })

  it('извлекает путь из постпроцессоров EmbedSubtitle / ffmpeg / Metadata', () => {
    expect(extractYtdlpOutputPath('[EmbedSubtitle] Embedding subtitles in "/media/out.mkv"')).toBe(
      '/media/out.mkv'
    )
    expect(extractYtdlpOutputPath('[ffmpeg] Merging formats into "C:\\merged.mp4"')).toBe(
      'C:\\merged.mp4'
    )
    expect(extractYtdlpOutputPath('[ffmpeg] Destination: /tmp/converted.webm')).toBe(
      '/tmp/converted.webm'
    )
    expect(extractYtdlpOutputPath('[Metadata] Writing metadata to /home/u/final.m4a')).toBe(
      '/home/u/final.m4a'
    )
    expect(extractYtdlpOutputPath('[download] Writing metadata to: D:\\Media\\clip.mp4')).toBe(
      'D:\\Media\\clip.mp4'
    )
  })

  it('извлекает путь из строк FFmpeg PP (Destination после «;», thumbnail, metadata run, concat)', () => {
    expect(
      extractYtdlpOutputPath(
        '[FFmpegVideoConvertor] Convert video from webm to mp4; Destination: C:\\out\\clip.mp4'
      )
    ).toBe('C:\\out\\clip.mp4')
    expect(extractYtdlpOutputPath('[FFmpegVideoConvertor] Destination: D:\\only.mp4')).toBe(
      'D:\\only.mp4'
    )
    expect(
      extractYtdlpOutputPath('[Concat] Concatenating 3 files; Destination: C:\\merged.mp4')
    ).toBe('C:\\merged.mp4')
    expect(extractYtdlpOutputPath('[Concat] Moving "C:\\part.ts" to "C:\\final.mp4"')).toBe(
      'C:\\final.mp4'
    )
    expect(
      extractYtdlpOutputPath('[EmbedThumbnail] ffmpeg: Adding thumbnail to "C:\\Media\\song.m4a"')
    ).toBe('C:\\Media\\song.m4a')
    expect(extractYtdlpOutputPath('[Metadata] Adding metadata to "/home/u/track.mkv"')).toBe(
      '/home/u/track.mkv'
    )
  })

  it('извлекает путь из VideoRemuxer (into …) и стрелочного Destination', () => {
    expect(
      extractYtdlpOutputPath('[VideoRemuxer] Remuxing video from mkv into "C:\\out\\final.mp4"')
    ).toBe('C:\\out\\final.mp4')
    expect(
      extractYtdlpOutputPath('[FFmpegVideoRemuxer] Remux format → Destination: /tmp/final.mkv')
    ).toBe('/tmp/final.mkv')
    expect(
      extractYtdlpOutputPath('[FFmpegVideoRemuxer] Remux format -> Destination: /tmp/ascii.mkv')
    ).toBe('/tmp/ascii.mkv')
  })

  it('извлекает путь из fixup-постпроцессоров yt-dlp', () => {
    expect(
      extractYtdlpOutputPath('[FixupM3u8] Fixing MPEG-TS in MP4 container of "C:\\out\\hls.mp4"')
    ).toBe('C:\\out\\hls.mp4')
    expect(
      extractYtdlpOutputPath('[FixupTimestamp] Fixing frame timestamp in /tmp/final.mkv')
    ).toBe('/tmp/final.mkv')
  })

  it('извлекает путь из SubtitlesConvertor (стрелка или into)', () => {
    expect(
      extractYtdlpOutputPath('[SubsConvertor] Converting subtitles ./vid.en.vtt -> ./vid.ru.srt')
    ).toBe('./vid.ru.srt')
    expect(
      extractYtdlpOutputPath(
        '[SubtitlesConvertor] Converting subtitles /tmp/a.en.vtt → /tmp/a.ru.srt'
      )
    ).toBe('/tmp/a.ru.srt')
    expect(
      extractYtdlpOutputPath('[SubsConvertor] Converting subtitles into "/home/u/out.srt"')
    ).toBe('/home/u/out.srt')
  })
})
