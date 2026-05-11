import { describe, expect, it } from 'vitest'

import {
  TERMINAL_CURRENT_FILE_PLACEHOLDER,
  TERMINAL_SCENARIO_HINTS_DOWNLOADS,
  TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA
} from '../../src/shared/terminal-contract'

/** Парсер вкладки «Терминал» не принимает кавычки в строке команды. */
function terminalLineAllowsQuotes(line: string): boolean {
  return !/["']/.test(line)
}

describe('TERMINAL_SCENARIO_HINTS_*', () => {
  it('downloads: fullLine без кавычек и с префиксом yt-dlp', () => {
    for (const h of TERMINAL_SCENARIO_HINTS_DOWNLOADS) {
      expect(h.tool).toBe('yt-dlp')
      expect(h.fullLine, h.token).toBeTruthy()
      expect(terminalLineAllowsQuotes(h.fullLine!), h.token).toBe(true)
      expect(h.fullLine!.trimStart().startsWith('yt-dlp '), h.token).toBe(true)
      expect(h.fullLine).not.toContain(TERMINAL_CURRENT_FILE_PLACEHOLDER)
    }
  })

  it('preview: fullLine без кавычек, плейсхолдер ровно один раз', () => {
    for (const h of TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA) {
      expect(h.fullLine, h.token).toBeTruthy()
      expect(terminalLineAllowsQuotes(h.fullLine!), h.token).toBe(true)
      const n = h.fullLine!.split(TERMINAL_CURRENT_FILE_PLACEHOLDER).length - 1
      expect(n, h.token).toBe(1)
    }
  })

  it('downloads: есть --print шаблоны для title и duration_string', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --dump-single-json ')
    expect(lines).toContain('yt-dlp --skip-download --print title ')
    expect(lines).toContain('yt-dlp --skip-download --print duration_string ')
    expect(lines).toContain('yt-dlp --skip-download --print uploader ')
    expect(lines).toContain('yt-dlp --skip-download --print id ')
    expect(lines).toContain('yt-dlp --skip-download --print webpage_url ')
    expect(lines).toContain('yt-dlp --skip-download --print channel ')
    expect(lines).toContain('yt-dlp --skip-download --print channel_id ')
    expect(lines).toContain('yt-dlp --skip-download --print thumbnail ')
    expect(lines).toContain('yt-dlp --skip-download --print view_count ')
    expect(lines).toContain('yt-dlp --skip-download --print upload_date ')
    expect(lines).toContain('yt-dlp --skip-download --print playlist_title ')
    expect(lines).toContain('yt-dlp --skip-download --print playlist_count ')
    expect(lines).toContain('yt-dlp --skip-download --print filename ')
    expect(lines).toContain('yt-dlp --skip-download --print description ')
    expect(lines).toContain('yt-dlp --skip-download --print categories ')
    expect(lines).toContain('yt-dlp --skip-download --print language ')
    expect(lines).toContain('yt-dlp --skip-download --print extractor ')
    expect(lines).toContain('yt-dlp --skip-download --print playlist_id ')
    expect(lines).toContain('yt-dlp --geo-bypass -F ')
    expect(lines).toContain('yt-dlp --skip-download --print format_id ')
    expect(lines).toContain('yt-dlp --skip-download --print ext ')
    expect(lines).toContain('yt-dlp --skip-download --print resolution ')
    expect(lines).toContain('yt-dlp --skip-download --print vcodec ')
    expect(lines).toContain('yt-dlp --skip-download --print acodec ')
    expect(lines).toContain('yt-dlp --list-extractors')
    expect(lines).toContain('yt-dlp --version')
    expect(lines).toContain('yt-dlp -4 -F ')
    expect(lines).toContain('yt-dlp --no-cache-dir -F ')
    expect(lines).toContain('yt-dlp --skip-download --print tags ')
    expect(lines).toContain('yt-dlp --skip-download --print filesize_approx ')
    expect(lines).toContain('yt-dlp --ignore-errors --flat-playlist -J ')
    expect(lines).toContain('yt-dlp --write-info-json --skip-download ')
    expect(lines).toContain('yt-dlp --no-warnings -F ')
  })

  it('preview: есть JSON-сводка и show_error для текущего превью', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some((l) => l.includes('-of json') && l.includes('-show_format') && l.includes('-show_streams'))
    ).toBe(true)
    expect(lines.some((l) => l.includes('-show_error'))).toBe(true)
    expect(lines.some((l) => l.includes('stream_tags=language'))).toBe(true)
    expect(lines.some((l) => l.includes('color_primaries,color_transfer'))).toBe(true)
    expect(lines.some((l) => l.includes('bits_per_sample,sample_fmt'))).toBe(true)
    expect(lines.some((l) => l.includes('bit_rate,avg_frame_rate'))).toBe(true)
    expect(lines.some((l) => l.includes('sample_aspect_ratio,display_aspect_ratio'))).toBe(true)
    expect(lines.some((l) => l.includes('format_tags=title,encoder'))).toBe(true)
    expect(lines.some((l) => l.includes('field_order,color_range'))).toBe(true)
    expect(lines.some((l) => l.includes('select_streams s:0') && l.includes('stream_tags=title,language'))).toBe(
      true
    )
    expect(lines.some((l) => l.includes('select_streams a:1') && l.includes('codec_name,sample_rate,channels'))).toBe(
      true
    )
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:0') &&
          l.includes('stream_tags=handler_name,encoder')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('nb_frames,duration'))).toBe(true)
    expect(lines.some((l) => l.includes('format=start_time,duration'))).toBe(true)
    expect(
      lines.some((l) => l.includes('select_streams s:1') && l.includes('codec_name,codec_tag_string'))
    ).toBe(true)
    expect(lines.some((l) => l.includes('stream_tags=filename,mimetype'))).toBe(true)
    expect(lines.some((l) => l.includes('codec_name,profile,level'))).toBe(true)
    expect(
      lines.some((l) => l.includes('select_streams a:0') && l.includes('codec_name,profile,bit_rate'))
    ).toBe(true)
    expect(lines.some((l) => l.includes('refs,has_b_frames'))).toBe(true)
  })
})
