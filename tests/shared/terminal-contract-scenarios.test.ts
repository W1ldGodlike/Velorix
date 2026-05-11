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
    expect(lines).toContain('yt-dlp --skip-download --print fps ')
    expect(lines).toContain('yt-dlp --skip-download --print is_live ')
    expect(lines).toContain('yt-dlp --skip-download --print live_status ')
    expect(lines).toContain('yt-dlp --skip-download --print availability ')
    expect(lines).toContain('yt-dlp --skip-download --print age_limit ')
    expect(lines).toContain('yt-dlp --skip-download --print like_count ')
    expect(lines).toContain('yt-dlp --skip-download --print comment_count ')
    expect(lines).toContain('yt-dlp --skip-download --print aspect_ratio ')
    expect(lines).toContain('yt-dlp --playlist-items 1 -F ')
    expect(lines).toContain('yt-dlp --extractor-args youtube:player_client=web -F ')
    expect(lines).toContain('yt-dlp --skip-download --cookies-from-browser edge ')
    expect(lines).toContain('yt-dlp --skip-download --print duration ')
    expect(lines).toContain('yt-dlp --skip-download --print width ')
    expect(lines).toContain('yt-dlp --skip-download --print height ')
    expect(lines).toContain('yt-dlp --skip-download --print tbr ')
    expect(lines).toContain('yt-dlp --skip-download --print abr ')
    expect(lines).toContain('yt-dlp --skip-download --print vbr ')
    expect(lines).toContain('yt-dlp --skip-download --print asr ')
    expect(lines).toContain('yt-dlp --write-thumbnail --skip-download ')
    expect(lines).toContain('yt-dlp --write-auto-sub --skip-download ')
    expect(lines).toContain('yt-dlp --write-description --skip-download ')
    expect(lines).toContain('yt-dlp --write-url-link --skip-download ')
    expect(lines).toContain('yt-dlp --check-formats ')
    expect(lines).toContain('yt-dlp --skip-download --cookies-from-browser firefox ')
    expect(lines).toContain('yt-dlp --skip-download --print has_drm ')
    expect(lines).toContain('yt-dlp --skip-download --print playable_in_embed ')
    expect(lines).toContain('yt-dlp --skip-download --print channel_url ')
    expect(lines).toContain('yt-dlp --skip-download --print uploader_id ')
    expect(lines).toContain('yt-dlp --skip-download --print was_live ')
    expect(lines).toContain('yt-dlp --skip-download --print media_type ')
    expect(lines).toContain('yt-dlp --skip-download --print release_year ')
    expect(lines).toContain('yt-dlp --no-check-certificates -F ')
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
    expect(lines.some((l) => l.includes('stream=index,codec_type,disposition'))).toBe(true)
    expect(lines.some((l) => l.includes('format=nb_streams,nb_programs,format_name'))).toBe(true)
    expect(
      lines.some(
        (l) => l.includes('-count_frames') && l.includes('select_streams v:0') && l.includes('nb_read_frames')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('select_streams a:0') && l.includes('stream=disposition'))).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:0') && l.includes('pix_fmt,color_space,color_range')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:0') &&
          l.includes('coded_width,coded_height,width,height')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('format_tags=creation_time'))).toBe(true)
    expect(
      lines.some((l) => l.includes('select_streams s:0') && l.includes('stream=disposition'))
    ).toBe(true)
    expect(
      lines.some(
        (l) => l.includes('select_streams v:0') && l.includes('stream=time_base,start_pts')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) => l.includes('select_streams a:0') && l.includes('stream=time_base,start_pts')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) => l.includes('select_streams v:0') && l.includes('stream=bit_rate,max_bit_rate')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('show_entries format=filename'))).toBe(true)
    expect(
      lines.some((l) => l.includes('select_streams v:0') && l.includes('stream_tags=rotate'))
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams a:0') && l.includes('stream=channel_layout,bit_rate')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('show_entries format=bit_rate'))).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams a:0') && l.includes('stream_tags=title,handler_name')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) => l.includes('select_streams v:0') && l.includes('stream=r_frame_rate')
      )
    ).toBe(true)
  })
})
