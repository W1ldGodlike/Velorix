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
    expect(lines).toContain('yt-dlp --skip-download --print filesize ')
    expect(lines).toContain('yt-dlp --skip-download --print format_note ')
    expect(lines).toContain('yt-dlp --skip-download --print subtitles ')
    expect(lines).toContain('yt-dlp --skip-download --print automatic_captions ')
    expect(lines).toContain('yt-dlp --skip-download --print chapters ')
    expect(lines).toContain('yt-dlp --flat-playlist --skip-download --print title ')
    expect(lines).toContain('yt-dlp --skip-download --print original_url ')
    expect(lines).toContain('yt-dlp --skip-download --print webpage_url_domain ')
    expect(lines).toContain('yt-dlp --flat-playlist --skip-download --print id ')
    expect(lines).toContain('yt-dlp --skip-download --print playlist_index ')
    expect(lines).toContain('yt-dlp --write-sub --skip-download ')
    expect(lines).toContain('yt-dlp --write-comments --skip-download ')
  })

  it('downloads: доп. сценарии — audio URL, flat simulate, print filepath/epoch', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp -g -f bestaudio/best ')
    expect(lines).toContain('yt-dlp --flat-playlist --simulate ')
    expect(lines).toContain('yt-dlp --skip-download --print filepath ')
    expect(lines).toContain('yt-dlp --skip-download --print epoch ')
    expect(lines).toContain('yt-dlp -6 -F ')
    expect(lines).toContain('yt-dlp --flat-playlist --print url ')
    expect(lines).toContain('yt-dlp --write-pages --skip-download ')
    expect(lines).toContain('yt-dlp --skip-download --print heatmap ')
    expect(lines).toContain('yt-dlp --limit-rate 1M ')
    expect(lines).toContain('yt-dlp --retries 10 --fragment-retries 10 ')
    expect(lines).toContain('yt-dlp --socket-timeout 30 ')
    expect(lines).toContain('yt-dlp --force-ipv4 -F ')
    expect(lines).toContain('yt-dlp --no-part -F ')
    expect(lines).toContain('yt-dlp --concurrent-fragments 4 ')
    expect(lines).toContain('yt-dlp --merge-output-format mkv ')
    expect(lines).toContain('yt-dlp --format-sort +res:720 -F ')
    expect(lines).toContain('yt-dlp --playlist-end 10 -J ')
    expect(lines).toContain('yt-dlp --geo-bypass-country US -F ')
    expect(lines).toContain('yt-dlp --extractor-retries 5 ')
    expect(lines).toContain('yt-dlp --http-chunk-size 10M ')
    expect(lines).toContain('yt-dlp --no-overwrites -F ')
    expect(lines).toContain('yt-dlp --windows-filenames -F ')
    expect(lines).toContain('yt-dlp --newline -F ')
    expect(lines).toContain('yt-dlp --skip-unavailable-fragments ')
    expect(lines).toContain('yt-dlp --download-archive archive.txt ')
    expect(lines).toContain('yt-dlp --break-on-reject -F ')
    expect(lines).toContain('yt-dlp --trim-file-names 80 -F ')
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
    expect(
      lines.some((l) => l.includes('format_tags=major_brand,compatible_brands'))
    ).toBe(true)
    expect(
      lines.some((l) => l.includes('select_streams s:2') && l.includes('codec_name,codec_tag_string'))
    ).toBe(true)
    expect(
      lines.some((l) => l.includes('select_streams v:0') && l.includes('stream=closed_captions,is_avc'))
    ).toBe(true)
    expect(
      lines.some((l) => l.includes('select_streams t:0') && l.includes('stream=codec_name,codec_tag_string'))
    ).toBe(true)
    expect(
      lines.some((l) => l.includes('select_streams d:0') && l.includes('stream=codec_name,codec_tag_string'))
    ).toBe(true)
    expect(
      lines.some((l) => l.includes('select_streams v:0') && l.includes('stream=codec_tag_string'))
    ).toBe(true)
    expect(lines.some((l) => l.includes('format=probe_score'))).toBe(true)
    expect(
      lines.some((l) => l.includes('select_streams a:2') && l.includes('codec_name,sample_rate,channels'))
    ).toBe(true)
    expect(lines.some((l) => l.includes('format=format_long_name'))).toBe(true)
    expect(
      lines.some((l) => l.includes('select_streams v:0') && l.includes('stream=chroma_location'))
    ).toBe(true)
    expect(lines.some((l) => l.includes('-show_programs') && l.includes('-of compact'))).toBe(true)
    expect(
      lines.some((l) => l.includes('select_streams v:0') && l.includes('stream=side_data_list'))
    ).toBe(true)
    expect(lines.some((l) => l.includes('-show_chapters') && l.includes('-of csv'))).toBe(true)
    expect(lines.some((l) => l.includes('-frames:v 1 -f null -'))).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:0') && l.includes('stream=start_time,duration')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams a:0') && l.includes('stream=start_time,duration')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:0') && l.includes('stream=bits_per_raw_sample')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:1') && l.includes('stream=codec_name,width,height')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('show_entries format=size,duration'))).toBe(true)
    expect(lines.some((l) => l.includes('-t 5 -c copy -f null -'))).toBe(true)
    expect(lines.some((l) => l.includes('select_streams s:1') && l.includes('stream_tags=language'))).toBe(
      true
    )
    expect(
      lines.some((l) => l.includes('select_streams a:1') && l.includes('stream=disposition'))
    ).toBe(true)
    expect(lines.some((l) => l.includes('format_tags=language'))).toBe(true)
    expect(lines.some((l) => l.includes('-err_detect ignore_err') && l.includes('-t 2 -f null -'))).toBe(
      true
    )
    expect(lines.some((l) => l.includes('format_tags=artist,album'))).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:0') &&
          l.includes('stream=avg_frame_rate') &&
          !l.includes('bit_rate')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('-vn -sn -t 3 -f null -'))).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:0') &&
          l.includes('stream=codec_long_name') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('format_tags=encoder') && l.includes('default=nw=1:nk=1'))).toBe(
      true
    )
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams a:3') &&
          l.includes('stream=codec_name,sample_rate,channels')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams s:3') &&
          l.includes('stream=codec_name,codec_tag_string')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('-an -sn -t 2 -f null -'))).toBe(true)
  })

  it('downloads: сетевые/выводные флаги yt-dlp (smoke по fullLine)', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --no-mtime ')
    expect(lines).toContain('yt-dlp --continue ')
    expect(lines).toContain('yt-dlp --abort-on-error ')
    expect(lines).toContain('yt-dlp --playlist-start 5 --playlist-end 15 -J ')
    expect(lines).toContain('yt-dlp --max-filesize 512M -F ')
    expect(lines).toContain('yt-dlp --restrict-filenames -F ')
    expect(lines).toContain('yt-dlp --color never -F ')
    expect(lines).toContain('yt-dlp --embed-metadata ')
    expect(lines).toContain('yt-dlp --embed-thumbnail ')
    expect(lines).toContain('yt-dlp --wait-for-video 10 ')
    expect(lines).toContain('yt-dlp --skip-playlist-after-errors 5 ')
    expect(lines).toContain('yt-dlp --output-na-placeholder NA --skip-download --print title ')
    expect(lines).toContain('yt-dlp --referer https://www.youtube.com/ -F ')
    expect(lines).toContain('yt-dlp --add-header Accept-Language:en-US -F ')
    expect(lines).toContain('yt-dlp --proxy http://127.0.0.1:8080 -F ')
    expect(lines).toContain('yt-dlp --impersonate chrome -F ')
    expect(lines).toContain('yt-dlp --match-filter duration<600 -F ')
    expect(lines).toContain('yt-dlp --batch-file urls.txt ')
    expect(lines).toContain('yt-dlp --load-info-json video.info.json ')
    expect(lines).toContain('yt-dlp --yes-playlist -J ')
    expect(lines).toContain('yt-dlp --no-config -F ')
    expect(lines).toContain('yt-dlp --cookies cookies.txt -F ')
    expect(lines).toContain('yt-dlp --sleep-interval 2 ')
    expect(lines).toContain('yt-dlp --age-limit 18 -F ')
    expect(lines).toContain('yt-dlp --lazy-playlist -J ')
    expect(lines).toContain('yt-dlp --skip-download --print season_number ')
    expect(lines).toContain('yt-dlp --remux-video mkv ')
    expect(lines).toContain('yt-dlp --force-ipv6 -F ')
    expect(lines).toContain('yt-dlp --dateafter 20240101 -F ')
    expect(lines).toContain('yt-dlp --max-downloads 5 ')
    expect(lines).toContain('yt-dlp --match-title trailer -F ')
    expect(lines).toContain('yt-dlp --write-link --skip-download ')
    expect(lines).toContain('yt-dlp --sponsorblock-mark all ')
    expect(lines).toContain('yt-dlp --extract-audio --audio-format mp3 ')
    expect(lines).toContain('yt-dlp --audio-quality 192K --extract-audio ')
    expect(lines).toContain('yt-dlp --skip-download --print n_entries ')
    expect(lines).toContain('yt-dlp --embed-chapters ')
    expect(lines).toContain('yt-dlp --mark-watched --skip-download ')
    expect(lines).toContain('yt-dlp --write-all-thumbnails --skip-download ')
    expect(lines).toContain('yt-dlp --no-check-formats -F ')
    expect(lines).toContain('yt-dlp --playlist-reverse -J ')
    expect(lines).toContain('yt-dlp --playlist-random -J ')
    expect(lines).toContain('yt-dlp --user-agent curl/8.5.0 -F ')
    expect(lines).toContain('yt-dlp --throttled-rate 100K -F ')
    expect(lines).toContain('yt-dlp --embed-subs ')
    expect(lines).toContain('yt-dlp --convert-subs srt ')
    expect(lines).toContain('yt-dlp -o %(title)s.%(ext)s ')
    expect(lines).toContain('yt-dlp --split-chapters ')
    expect(lines).toContain('yt-dlp --remove-chapters sponsor ')
    expect(lines).toContain('yt-dlp --write-playlist-metafiles ')
    expect(lines).toContain('yt-dlp --force-overwrites ')
    expect(lines).toContain('yt-dlp --no-continue ')
    expect(lines).toContain('yt-dlp --recode-video mp4 ')
    expect(lines).toContain('yt-dlp --download-sections *0:00-2:00 ')
    expect(lines).toContain('yt-dlp --break-match-filters ')
    expect(lines).toContain('yt-dlp --no-post-overwrites ')
    expect(lines).toContain('yt-dlp --add-metadata ')
    expect(lines).toContain('yt-dlp --hls-prefer-ffmpeg -F ')
    expect(lines).toContain('yt-dlp --ffmpeg-location ffmpeg ')
    expect(lines).toContain('yt-dlp --paths home:ytdl-out ')
    expect(lines).toContain('yt-dlp --no-download-archive ')
    expect(lines).toContain('yt-dlp --encoding utf-8 ')
    expect(lines).toContain('yt-dlp --break-per-input -F ')
    expect(lines).toContain('yt-dlp --check-all-formats -F ')
    expect(lines).toContain('yt-dlp --socket-timeout 60 ')
    expect(lines).toContain('yt-dlp --xattrs ')
    expect(lines).toContain('yt-dlp -U ')
    expect(lines).toContain('yt-dlp --compat-options no-youtube-unavailable-videos -F ')
    expect(lines).toContain('yt-dlp --rm-cache-dir')
    expect(lines).toContain('yt-dlp --cache-dir cache -F ')
    expect(lines).toContain('yt-dlp --keep-fragments -F ')
    expect(lines).toContain('yt-dlp --buffer-size 16K -F ')
    expect(lines).toContain('yt-dlp --abort-on-unavailable-fragments ')
    expect(lines).toContain('yt-dlp --sub-langs en.*,ru.* -F ')
    expect(lines).toContain('yt-dlp --skip-download --print release_date ')
    expect(lines).toContain('yt-dlp --skip-download --print album_artist ')
    expect(lines).toContain('yt-dlp --skip-download --print track_number ')
  })

  it('preview: pretty/flat/packets/frames + loudnorm summary', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(lines.some((l) => l.includes('-pretty') && l.includes('-show_format'))).toBe(true)
    expect(lines.some((l) => l.includes('-of flat') && l.includes('-show_format'))).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:0') &&
          l.includes('-show_packets') &&
          l.includes('-read_intervals %+#5')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:0') &&
          l.includes('-show_frames') &&
          l.includes('-read_intervals %+#5')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) => l.includes('-af loudnorm=print_format=summary') && l.includes('-vn -sn -f null -')
      )
    ).toBe(true)
  })

  it('preview: program_version, a:0 packets, seek decode', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(lines.some((l) => l.includes('-show_program_version'))).toBe(true)
    expect(
      lines.some(
        (l) => l.includes('select_streams a:0') && l.includes('-show_packets') && l.includes('%+#3')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('-ss 10 -i ') && l.includes('-t 2 -f null -'))).toBe(true)
  })

  it('preview: format comment/synopsis, s:0 timebase, v:0 extradata_size', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(lines.some((l) => l.includes('format_tags=comment,synopsis'))).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams s:0') &&
          l.includes('codec_time_base') &&
          l.includes('time_base')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:0') &&
          l.includes('extradata_size') &&
          l.includes('initial_padding')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams s:0') &&
          l.includes('stream=bit_rate') &&
          l.includes('-of default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('show_entries format=duration_ts'))).toBe(true)
    expect(lines.some((l) => l.includes('format_tags=copyright'))).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:0') &&
          l.includes('stream_tags=BPS,DURATION')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams s:0') &&
          l.includes('stream_tags=duration') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('show_entries format=probe_size'))).toBe(true)
    expect(
      lines.some((l) => l.includes('-vf scale=320:-1') && l.includes('-t 1 -f null -'))
    ).toBe(true)
  })
})
