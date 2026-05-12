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
    expect(lines).toContain('yt-dlp --skip-download --cookies-from-browser brave ')
    expect(lines).toContain('yt-dlp --skip-download --print series ')
    expect(lines).toContain('yt-dlp --skip-download --print season ')
    expect(lines).toContain('yt-dlp --skip-download --print episode ')
    expect(lines).toContain('yt-dlp --skip-download --print display_id ')
    expect(lines).toContain('yt-dlp --skip-download --print webpage_url_basename ')
    expect(lines).toContain('yt-dlp --skip-download --print fulltitle ')
    expect(lines).toContain('yt-dlp --sponsorblock-remove sponsor ')
    expect(lines).toContain('yt-dlp --downloader native -F ')
    expect(lines).toContain('yt-dlp --legacy-server-connect -F ')
    expect(lines).toContain('yt-dlp --no-call-home -F ')
    expect(lines).toContain('yt-dlp --datebefore 20991231 -F ')
    expect(lines).toContain('yt-dlp --embed-info-json ')
    expect(lines).toContain('yt-dlp --netrc -F ')
    expect(lines).toContain('yt-dlp --force-generic-extractor -F ')
    expect(lines).toContain('yt-dlp --skip-download --print channel_follower_count ')
    expect(lines).toContain('yt-dlp --skip-download --print average_rating ')
    expect(lines).toContain('yt-dlp --write-all-urls --skip-download ')
    expect(lines).toContain('yt-dlp --dump-pages --skip-download ')
    expect(lines).toContain('yt-dlp --no-progress -F ')
    expect(lines).toContain('yt-dlp --skip-download --print is_private ')
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

  it('preview: v:0 stream creation_time, format handler_name, acodec copy null', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:0') &&
          l.includes('stream_tags=creation_time') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('format_tags=handler_name'))).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-acodec copy') && l.includes('-vn -sn') && l.includes('-t 3 -f null -')
      )
    ).toBe(true)
  })

  it('downloads: HLS/subs/throttle/disk guards + single-entry JSON', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --no-playlist -J ')
    expect(lines).toContain('yt-dlp --hls-use-mpegts -F ')
    expect(lines).toContain('yt-dlp --write-subs --skip-download ')
    expect(lines).toContain('yt-dlp --max-sleep-interval 10 -F ')
    expect(lines).toContain('yt-dlp --retry-sleep 5 -F ')
    expect(lines).toContain('yt-dlp --min-filesize 100K -F ')
    expect(lines).toContain('yt-dlp --file-access-retries 5 -F ')
  })

  it('preview: a:0 bits_per_raw_sample, v:0 index+codec_name', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams a:0') &&
          l.includes('bits_per_raw_sample') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:0') &&
          l.includes('stream=index,codec_name') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
  })

  it('downloads: playlist/timestamps/location prints', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --skip-download --print playlist ')
    expect(lines).toContain('yt-dlp --skip-download --print playlist_autonumber ')
    expect(lines).toContain('yt-dlp --skip-download --print modified_timestamp ')
    expect(lines).toContain('yt-dlp --skip-download --print release_timestamp ')
    expect(lines).toContain('yt-dlp --skip-download --print upload_timestamp ')
    expect(lines).toContain('yt-dlp --skip-download --print stretched_ratio ')
    expect(lines).toContain('yt-dlp --skip-download --print location ')
  })

  it('preview: v:0 profile+level, s:2 disposition', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:0') &&
          l.includes('stream=profile,level') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams s:2') &&
          l.includes('stream=disposition') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
  })

  it('downloads: YouTube player clients + extractor metadata (smoke)', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --extractor-args youtube:player_client=android -F ')
    expect(lines).toContain('yt-dlp --extractor-args youtube:player_client=tv_embedded -F ')
    expect(lines).toContain('yt-dlp --extractor-args youtube:player_client=ios -F ')
    expect(lines).toContain('yt-dlp --skip-download --print alternate_title ')
    expect(lines).toContain('yt-dlp --skip-download --print extractor_key ')
    expect(lines).toContain('yt-dlp --flat-playlist --skip-download --print webpage_url ')
    expect(lines).toContain('yt-dlp --geo-bypass-country DE -F ')
    expect(lines).toContain('yt-dlp --skip-download --print channel_is_verified ')
  })

  it('preview: a:2 disposition, v:1 profile+level, s:1 stream duration, map v:0 copy', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams a:2') &&
          l.includes('stream=disposition') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:1') &&
          l.includes('stream=profile,level') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams s:1') &&
          l.includes('stream=start_time,duration') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('-map 0:v:0 -c:v copy') && l.includes('-an -sn -f null -'))).toBe(
      true
    )
  })

  it('downloads: extra browsers + FR geo + mweb + requested_*', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --skip-download --cookies-from-browser opera ')
    expect(lines).toContain('yt-dlp --skip-download --cookies-from-browser chromium ')
    expect(lines).toContain('yt-dlp --skip-download --cookies-from-browser vivaldi ')
    expect(lines).toContain('yt-dlp --geo-bypass-country FR -F ')
    expect(lines).toContain('yt-dlp --extractor-args youtube:player_client=mweb -F ')
    expect(lines).toContain('yt-dlp --skip-download --print requested_formats ')
    expect(lines).toContain('yt-dlp --skip-download --print requested_subtitles ')
  })

  it('preview: s:0 time_base+start_pts, volumedetect', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams s:0') &&
          l.includes('stream=time_base,start_pts') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('-af volumedetect') && l.includes('-vn -sn') && l.includes('-t 10'))).toBe(
      true
    )
  })

  it('downloads: safari + web_creator/web_embedded + GB + formats + simulate merge + multi-streams + compat 2024', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --skip-download --cookies-from-browser safari ')
    expect(lines).toContain('yt-dlp --extractor-args youtube:player_client=web_creator -F ')
    expect(lines).toContain('yt-dlp --extractor-args youtube:player_client=web_embedded -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country GB -F ')
    expect(lines).toContain('yt-dlp --skip-download --print formats ')
    expect(lines).toContain('yt-dlp --simulate -f bestvideo+bestaudio/best ')
    expect(lines).toContain('yt-dlp --multi-streams -F ')
    expect(lines).toContain('yt-dlp --compat-options 2024 -F ')
    expect(lines).toContain('yt-dlp --no-playlist --skip-download --print title ')
    expect(lines).toContain('yt-dlp --flat-playlist --skip-download --print extractor ')
  })

  it('preview: format genre+date, silencedetect', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some((l) => l.includes('format_tags=genre,date') && l.includes('default=nw=1:nk=1'))
    ).toBe(true)
    expect(
      lines.some((l) => l.includes('-af silencedetect=noise=-50dB:d=0.3') && l.includes('-vn -sn'))
    ).toBe(true)
  })

  it('downloads: no-remote-playlist + geo JP/CA + thumbnails + web_safari + playlist_* + flat _type', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --no-remote-playlist -J ')
    expect(lines).toContain('yt-dlp --geo-bypass-country JP -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country CA -F ')
    expect(lines).toContain('yt-dlp --skip-download --print thumbnails ')
    expect(lines).toContain('yt-dlp --extractor-args youtube:player_client=web_safari -F ')
    expect(lines).toContain('yt-dlp --skip-download --print playlist_channel ')
    expect(lines).toContain('yt-dlp --skip-download --print playlist_channel_id ')
    expect(lines).toContain('yt-dlp --skip-download --print playlist_uploader ')
    expect(lines).toContain('yt-dlp --skip-download --print playlist_uploader_id ')
    expect(lines).toContain('yt-dlp --flat-playlist --skip-download --print _type ')
  })

  it('downloads: merge mp4 / keep-video / ext-downloader / parse-metadata / geo AU–IT / playlist URL / multistream flags', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --merge-output-format mp4 ')
    expect(lines).toContain('yt-dlp --no-keep-video ')
    expect(lines).toContain('yt-dlp --external-downloader ffmpeg ')
    expect(lines).toContain('yt-dlp --parse-metadata title:%(title)s ')
    expect(lines).toContain('yt-dlp --geo-bypass-country AU -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BR -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country IT -F ')
    expect(lines).toContain('yt-dlp --skip-download --print playlist_webpage_url ')
    expect(lines).toContain('yt-dlp --skip-download --print webpage_url_scheme ')
    expect(lines).toContain('yt-dlp --video-multistreams -F ')
    expect(lines).toContain('yt-dlp --audio-multistreams -F ')
  })

  it('preview: v:0 disposition, a:1 bit_rate, astats', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:0') &&
          l.includes('stream=disposition') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams a:1') &&
          l.includes('stream=bit_rate') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(
      lines.some((l) => l.includes('-af astats=metadata=1:reset=1') && l.includes('-t 5') && l.includes('-vn -sn'))
    ).toBe(true)
  })

  it('preview: a:0 stream_tags encoder, ebur128', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams a:0') &&
          l.includes('stream_tags=encoder') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af ebur128=framelog=verbose') && l.includes('-t 12') && l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: quiet / no-cookies / compat 2025 / break-on-existing / mtime / check-formats-threshold / no-sponsorblock / allow-dynamic-mpd', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --quiet -F ')
    expect(lines).toContain('yt-dlp --no-cookies -F ')
    expect(lines).toContain('yt-dlp --compat-options 2025 -F ')
    expect(lines).toContain('yt-dlp --break-on-existing -F ')
    expect(lines).toContain('yt-dlp --mtime ')
    expect(lines).toContain('yt-dlp --check-formats-threshold 1.5 -F ')
    expect(lines).toContain('yt-dlp --no-sponsorblock -F ')
    expect(lines).toContain('yt-dlp --allow-dynamic-mpd -F ')
  })

  it('downloads: console-title / no-external-downloader / clean-infojson / no-write-info-json / ext-downloader-args / flat urls / progress-template / sleep-subtitles / sub-format best / geo NL', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --console-title -F ')
    expect(lines).toContain('yt-dlp --no-external-downloader -F ')
    expect(lines).toContain('yt-dlp --clean-infojson ')
    expect(lines).toContain('yt-dlp --no-write-info-json -F ')
    expect(lines).toContain('yt-dlp --external-downloader-args ffmpeg_i:-nostdin -F ')
    expect(lines).toContain('yt-dlp --flat-playlist --print urls --skip-download ')
    expect(lines).toContain('yt-dlp --progress-template predownload:Preparing %(info.title)s -F ')
    expect(lines).toContain('yt-dlp --sleep-subtitles 5 -F ')
    expect(lines).toContain('yt-dlp --sub-format best -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country NL -F ')
  })

  it('preview: a:0/s:0 codec_long_name + aphasemeter', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams a:0') &&
          l.includes('stream=codec_long_name') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams s:0') &&
          l.includes('stream=codec_long_name') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(
      lines.some((l) => l.includes('-af aphasemeter=video=0') && l.includes('-t 10') && l.includes('-vn -sn'))
    ).toBe(true)
  })

  it('preview: a:1 stream_tags encoder + idet 5s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams a:1') &&
          l.includes('stream_tags=encoder') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('-vf idet') && l.includes('-t 5') && l.includes('-an -sn'))).toBe(true)
  })

  it('downloads: force-keyframes / no-hls-use-mpegts / compat no-direct-merge / geo ES–SE / no-embed-meta / playlist range / merge webm / ignore-no-formats / no-write-thumb / extract aac / no-embed-thumb', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --force-keyframes-at-cuts ')
    expect(lines).toContain('yt-dlp --no-hls-use-mpegts -F ')
    expect(lines).toContain('yt-dlp --compat-options no-direct-merge -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country ES -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country PL -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country SE -F ')
    expect(lines).toContain('yt-dlp --no-embed-metadata ')
    expect(lines).toContain('yt-dlp --playlist-items 1:10 -F ')
    expect(lines).toContain('yt-dlp --merge-output-format webm ')
    expect(lines).toContain('yt-dlp --ignore-no-formats-error -F ')
    expect(lines).toContain('yt-dlp --no-write-thumbnail -F ')
    expect(lines).toContain('yt-dlp --extract-audio --audio-format aac ')
    expect(lines).toContain('yt-dlp --no-embed-thumbnail ')
  })

  it('preview: format publisher+encoded_by + blackdetect 30s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=publisher,encoded_by') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-vf blackdetect=d=0.1:pix_th=0.01') &&
          l.includes('-t 30') &&
          l.includes('-an -sn')
      )
    ).toBe(true)
  })

  it('downloads: ignore-dynamic-mpd / sponsorblock-api / config-locations / geo MX..CH / xfwd', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --ignore-dynamic-mpd -F ')
    expect(lines).toContain('yt-dlp --sponsorblock-api https://sponsor.ajay.app -F ')
    expect(lines).toContain('yt-dlp --config-locations yt-dlp.conf -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country MX -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country KR -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country IN -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country TR -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country NO -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country CH -F ')
    expect(lines).toContain('yt-dlp --xfwd -F ')
  })

  it('downloads: TV auth helpers / downloader-args / include-ads / geo NZ ZA', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --no-cookies-from-browser -F ')
    expect(lines).toContain('yt-dlp --downloader-args ffmpeg:-nostdin -F ')
    expect(lines).toContain('yt-dlp --include-ads -F ')
    expect(lines).toContain('yt-dlp --twofactor 123456 ')
    expect(lines).toContain('yt-dlp --video-password PASSWORD ')
    expect(lines).toContain('yt-dlp --ap-mso Rogers -F ')
    expect(lines).toContain('yt-dlp --ap-username user@example.com -F ')
    expect(lines).toContain('yt-dlp --concurrent-downloads 2 -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country NZ -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country ZA -F ')
  })

  it('downloads: print-to-file / file-urls / source-address / annotations / storyboards / sponsorblock chapter / concat-playlist / fixup / use-extractors / default-search', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --print-to-file title flux-ytdlp-title.txt --skip-download ')
    expect(lines).toContain('yt-dlp --enable-file-urls -F ')
    expect(lines).toContain('yt-dlp --source-address 198.51.100.2 -F ')
    expect(lines).toContain('yt-dlp --skip-download --print annotations ')
    expect(lines).toContain('yt-dlp --skip-download --print storyboards ')
    expect(lines).toContain('yt-dlp --sponsorblock-mark all --sponsorblock-chapter-title %(category)s ')
    expect(lines).toContain('yt-dlp --concat-playlist never -F ')
    expect(lines).toContain('yt-dlp --fixup warn -F ')
    expect(lines).toContain('yt-dlp --use-extractors youtube -F ')
    expect(lines).toContain('yt-dlp --default-search auto: -F ')
  })

  it('preview: chapters json / s:0+a:1 stream duration / pts time_base / dynaudnorm / highpass', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(lines.some((l) => l.includes('-show_chapters -of json=c=1'))).toBe(true)
    expect(
      lines.some((l) => l.includes('-select_streams s:0') && l.includes('stream=start_time,duration'))
    ).toBe(true)
    expect(
      lines.some((l) => l.includes('-select_streams a:1') && l.includes('stream=start_time,duration'))
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams s:1') &&
          l.includes('time_base') &&
          l.includes('start_pts') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams a:1') &&
          l.includes('time_base') &&
          l.includes('start_pts') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('-af dynaudnorm') && l.includes('-t 5'))).toBe(true)
    expect(lines.some((l) => l.includes('-af highpass=f=200') && l.includes('-t 5'))).toBe(true)
  })

  it('preview: cropdetect / freezedetect / signalstats', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('-vf cropdetect=limit=24:round=16:reset=0') &&
          l.includes('-t 30') &&
          l.includes('-an -sn')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-vf freezedetect=n=-60dB:d=2') &&
          l.includes('-t 45') &&
          l.includes('-an -sn')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('-vf signalstats') && l.includes('-t 8') && l.includes('-an -sn'))).toBe(
      true
    )
  })

  it('downloads: ap-password / client-cert / geo-verification-proxy / geo AT..IE', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --ap-password PASSWORD ')
    expect(lines).toContain('yt-dlp --client-certificate client.pem ')
    expect(lines).toContain('yt-dlp --geo-verification-proxy http://127.0.0.1:8888 -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country AT -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country DK -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country FI -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country GR -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country PT -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BE -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country IE -F ')
  })

  it('preview: v:0 location / a:0 sample_fmt / ffmpeg genpts remux', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams v:0') &&
          l.includes('stream_tags=location') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams a:0') &&
          l.includes('stream=sample_fmt') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('-fflags +genpts') && l.includes('-c copy') && l.includes('-t 2'))).toBe(true)
  })

  it('downloads: client-cert-key / impersonate firefox+edge / geo CZ..IS / convert-thumbnails png', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --client-certificate-key key.pem ')
    expect(lines).toContain('yt-dlp --impersonate firefox -F ')
    expect(lines).toContain('yt-dlp --impersonate edge -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country CZ -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country HU -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country RO -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BG -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country HR -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country LV -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country LT -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country EE -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country IS -F ')
    expect(lines).toContain('yt-dlp --convert-thumbnails png ')
  })

  it('preview: format lyrics / a:1 layout+sfmt / scenedetect', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=lyrics') &&
          l.includes('default=nw=1:nk=1') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams a:1') &&
          l.includes('channel_layout,sample_fmt') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(
      lines.some((l) => l.includes('-vf scenedetect=scene=0.3') && l.includes('-t 20') && l.includes('-an -sn'))
    ).toBe(true)
  })

  it('downloads: audio formats (opus/flac/wav/m4a) / no-mark-watched / no-write-* / geo MY..UA', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --extract-audio --audio-format opus ')
    expect(lines).toContain('yt-dlp --extract-audio --audio-format flac ')
    expect(lines).toContain('yt-dlp --extract-audio --audio-format wav ')
    expect(lines).toContain('yt-dlp --extract-audio --audio-format m4a ')
    expect(lines).toContain('yt-dlp --no-mark-watched -F ')
    expect(lines).toContain('yt-dlp --no-write-comments -F ')
    expect(lines).toContain('yt-dlp --no-write-description -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country MY -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country SG -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country TH -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country VN -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country AR -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country UA -F ')
  })

  it('preview: v:0 stereo_mode / a:0 duration_ts / format size+bit_rate+nb_streams / aresample', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams v:0') &&
          l.includes('stream_tags=stereo_mode') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams a:0') &&
          l.includes('stream=duration_ts') &&
          l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('format=size,bit_rate,nb_streams') && l.includes('default=nw=1:nk=1')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) => l.includes('-af aresample=44100') && l.includes('-t 3') && l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: geo PH..NG / extractor-args generic:noplaylist / retries+frag+skip-pl-err', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --geo-bypass-country PH -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country ID -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country PK -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BD -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country EG -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country CL -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country PE -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country KE -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country CO -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country NG -F ')
    expect(lines).toContain('yt-dlp --extractor-args generic:noplaylist -F ')
    expect(lines).toContain('yt-dlp --skip-playlist-after-errors 10 -F ')
    expect(lines).toContain('yt-dlp --retries 15 -F ')
    expect(lines).toContain('yt-dlp --fragment-retries 15 -F ')
  })

  it('preview: format_tags minor_version / ffmpeg afftdn 3s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=minor_version') &&
          l.includes('default=nw=1:nk=1') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) => l.includes('-af afftdn=nf=-25') && l.includes('-t 3') && l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: bidi-workaround / daterange / playlist-start 2 / geo SK..RS', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --bidi-workaround -F ')
    expect(lines).toContain('yt-dlp --daterange 20000101-20991231 -F ')
    expect(lines).toContain('yt-dlp --playlist-start 2 -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country SK -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country SI -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country LU -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country MT -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country CY -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BA -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country RS -F ')
  })

  it('preview: format desc+keywords / format location / ffmpeg acompressor 5s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=description,keywords') &&
          l.includes('default=nw=1:nk=1') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=location') &&
          l.includes('default=nw=1:nk=1') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af acompressor=threshold=-20dB:ratio=4:attack=5:release=100') &&
          l.includes('-t 5') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: geo MN..PA / downloader ffmpeg|aria2c / no-wait / verbose -F', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --geo-bypass-country MN -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country KZ -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country GE -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country AM -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country AZ -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country IQ -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country LK -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country TN -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country MA -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country DZ -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country GH -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country ET -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country UY -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BO -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country CR -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country PA -F ')
    expect(lines).toContain('yt-dlp --downloader ffmpeg -F ')
    expect(lines).toContain('yt-dlp --downloader aria2c -F ')
    expect(lines).toContain('yt-dlp --no-wait-for-video -F ')
    expect(lines).toContain('yt-dlp --verbose -F ')
  })

  it('preview: ffprobe v:2 / ffmpeg silenceremove 60s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:2') &&
          l.includes('stream=codec_name,width,height,profile,level') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af silenceremove=start_periods=1:start_duration=0.5:start_threshold=-50dB') &&
          l.includes('-t 60') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: trim-filenames / hls-split-discontinuity / dynamic-mpd-buffer / no-write-pages / socket 120', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --trim-filenames 180 -F ')
    expect(lines).toContain('yt-dlp --hls-split-discontinuity -F ')
    expect(lines).toContain('yt-dlp --dynamic-mpd-buffer-size 100 -F ')
    expect(lines).toContain('yt-dlp --no-write-pages -F ')
    expect(lines).toContain('yt-dlp --socket-timeout 120 -F ')
  })

  it('preview: v:0 ticks_per_frame / ffmpeg treble 3s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams v:0') &&
          l.includes('stream=ticks_per_frame') &&
          l.includes('default=nw=1:nk=1') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) => l.includes('-af treble=g=1') && l.includes('-t 3') && l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: -S sort / hide-progress / playlist slice / print genres+cast / --ppa', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp -S +res:1080,+codec:av01 -F ')
    expect(lines).toContain('yt-dlp -S +br:5000000,+res:720 -F ')
    expect(lines).toContain('yt-dlp --hide-progress -F ')
    expect(lines).toContain('yt-dlp --playlist-items -1 -F ')
    expect(lines).toContain('yt-dlp --playlist-items 2:4 -F ')
    expect(lines).toContain('yt-dlp --skip-download --print genres ')
    expect(lines).toContain('yt-dlp --skip-download --print cast ')
    expect(lines).toContain('yt-dlp --ppa FFmpeg:-threads:1 -F ')
  })

  it('preview: format software+episode tags / ffmpeg volume+lowpass', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=software') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=episode_sort,season_number,episode_id') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) => l.includes('-af volume=3dB') && l.includes('-t 2') && l.includes('-vn -sn')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) => l.includes('-af lowpass=f=3500') && l.includes('-t 3') && l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: yes-playlist -F + geo microstates AD..GL', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --yes-playlist -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country AD -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country MC -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country LI -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country SM -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country VA -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country GI -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country JE -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country GG -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country IM -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country FO -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country GL -F ')
  })

  it('preview: ffprobe a:0 time_base+fps / ffmpeg bandpass hp+lp 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams a:0') &&
          l.includes('stream=time_base,avg_frame_rate,r_frame_rate') &&
          l.includes('default=nw=1:nk=1') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af highpass=f=200,lowpass=f=3000') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: check-all-urls / no-windows-filenames / replace-meta / no-playlist simulate / dislike / flat+duration', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --check-all-urls -F ')
    expect(lines).toContain('yt-dlp --no-windows-filenames -F ')
    expect(lines).toContain('yt-dlp --replace-in-metadata title,_,- -F ')
    expect(lines).toContain('yt-dlp --no-playlist --simulate ')
    expect(lines).toContain('yt-dlp --skip-download --print dislike_count ')
    expect(lines).toContain('yt-dlp --flat-playlist --skip-download --print duration ')
  })

  it('preview: v:0 is_intra_only / ffmpeg adeclick 5s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams v:0') &&
          l.includes('stream=is_intra_only') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(lines.some((l) => l.includes('-af adeclick') && l.includes('-t 5') && l.includes('-vn -sn'))).toBe(
      true
    )
  })

  it('downloads: list-extractor-descriptions / print-traffic / vorbis / print-to-file id', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --list-extractor-descriptions')
    expect(lines).toContain('yt-dlp --print-traffic -F ')
    expect(lines).toContain('yt-dlp --extract-audio --audio-format vorbis ')
    expect(lines).toContain('yt-dlp --print-to-file id flux-ytdlp-id.txt --skip-download ')
  })

  it('preview: format composer+conductor / ffmpeg agate 5s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=composer,conductor') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af agate=threshold=0.005') &&
          l.includes('-t 5') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: no-update / no-color / color always / allow-unplayable / audio alac+ac3+q0 / ppa threads / geo TW+MD', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --no-update -F ')
    expect(lines).toContain('yt-dlp --no-color -F ')
    expect(lines).toContain('yt-dlp --color always -F ')
    expect(lines).toContain('yt-dlp --allow-unplayable-formats -F ')
    expect(lines).toContain('yt-dlp --extract-audio --audio-format alac ')
    expect(lines).toContain('yt-dlp --extract-audio --audio-format ac3 ')
    expect(lines).toContain('yt-dlp --audio-quality 0 --extract-audio ')
    expect(lines).toContain('yt-dlp --postprocessor-args ffmpeg:-threads 1 -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country TW -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country MD -F ')
  })

  it('preview: format performer / v:0 alpha_mode / ffmpeg extrastereo 3s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=performer') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams v:0') &&
          l.includes('stream_tags=alpha_mode') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af extrastereo') &&
          l.includes('-t 3') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: print-to-file pageurl+durstr+uploader+churl + geo BY+AL+MK', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --print-to-file webpage_url flux-ytdlp-pageurl.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file duration_string flux-ytdlp-durstr.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file uploader flux-ytdlp-uploader.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file channel_url flux-ytdlp-churl.txt --skip-download ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BY -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country AL -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country MK -F ')
  })

  it('preview: purchase_date / sort meta / ffmpeg aphaser 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=purchase_date') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=sort_artist,sort_album,sort_title') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af aphaser=in_gain=0.4') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: print-to-file views+channel+extractor+pltitle+uploaddate + geo ME+PS+TL + wma', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --print-to-file view_count flux-ytdlp-views.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file channel flux-ytdlp-channel.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file extractor flux-ytdlp-extractor.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file playlist_title flux-ytdlp-pltitle.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file upload_date flux-ytdlp-update.txt --skip-download ')
    expect(lines).toContain('yt-dlp --geo-bypass-country ME -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country PS -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country TL -F ')
    expect(lines).toContain('yt-dlp --extract-audio --audio-format wma ')
  })

  it('preview: format service tags + a:0 bits_per_coded_sample + ffmpeg flanger 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=service_provider,service_name') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams a:0') &&
          l.includes('stream=bits_per_coded_sample') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some((l) => l.includes('-af flanger') && l.includes('-t 4') && l.includes('-vn -sn'))
    ).toBe(true)
  })

  it('downloads: no-abort-on-error + no-restrict-filenames + geo PR GU VI AS MP UM + print-to-file desc+fn', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --no-abort-on-error -F ')
    expect(lines).toContain('yt-dlp --no-restrict-filenames -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country PR -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country GU -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country VI -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country AS -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country MP -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country UM -F ')
    expect(lines).toContain('yt-dlp --print-to-file description flux-ytdlp-desc.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file filename flux-ytdlp-fn.txt --skip-download ')
  })

  it('preview: format isrc + ffmpeg deesser 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=isrc') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af deesser=i=0.5') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: no-prefer-free + print-to-file categories/tags/language/autocap/chapters/acodec/vcodec', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --no-prefer-free-formats -F ')
    expect(lines).toContain('yt-dlp --print-to-file categories flux-ytdlp-categories.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file tags flux-ytdlp-tags.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file language flux-ytdlp-language.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file automatic_captions flux-ytdlp-autocap.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file chapters flux-ytdlp-chapters.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file acodec flux-ytdlp-acodec.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file vcodec flux-ytdlp-vcodec.txt --skip-download ')
  })

  it('preview: ffprobe s:0 encoder + ffmpeg vibrato 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams s:0') &&
          l.includes('stream_tags=encoder') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af vibrato=f=6.5:d=0.5') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: print-to-file likes+duration+subs+chid+plid+heatmap + lazy-pl + no-continue -F', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --print-to-file like_count flux-ytdlp-likes.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file duration flux-ytdlp-duration.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file subtitles flux-ytdlp-subs.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file channel_id flux-ytdlp-chid.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file playlist_id flux-ytdlp-plid.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file heatmap flux-ytdlp-heatmap.txt --skip-download ')
    expect(lines).toContain('yt-dlp --lazy-playlist -F ')
    expect(lines).toContain('yt-dlp --no-continue -F ')
  })

  it('preview: format part+compilation + ffmpeg crystalizer 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=part,compilation') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af crystalizer=i=1.2') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: no-playlist-reverse + print-to-file extra fields + geo BM/KY/JM/BB/BS -F', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --no-playlist-reverse -F ')
    expect(lines).toContain('yt-dlp --print-to-file comment_count flux-ytdlp-ccount.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file webpage_url_basename flux-ytdlp-wubase.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file display_id flux-ytdlp-dispid.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file thumbnail flux-ytdlp-thumburl.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file release_timestamp flux-ytdlp-reltsepoch.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file filepath flux-ytdlp-fpath.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file resolution flux-ytdlp-res.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file format_id flux-ytdlp-fmtid.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file ext flux-ytdlp-ext.txt --skip-download ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BM -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country KY -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country JM -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BB -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BS -F ')
  })

  it('preview: ffprobe v:0 codec_time_base+time_base + ffmpeg asetrate pitch 3s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams v:0') &&
          l.includes('stream=codec_time_base,time_base') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af asetrate=44100*1.01,aresample=44100') &&
          l.includes('-t 3') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: print-to-file width/height/fps/tbr/filesize_approx/protocol + reject-title + geo LC/GD/VC/KN/DM', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --print-to-file width flux-ytdlp-width.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file height flux-ytdlp-height.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file fps flux-ytdlp-fps.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file tbr flux-ytdlp-tbr.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file filesize_approx flux-ytdlp-fsize.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file protocol flux-ytdlp-proto.txt --skip-download ')
    expect(lines).toContain('yt-dlp --reject-title trailer -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country LC -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country GD -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country VC -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country KN -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country DM -F ')
  })

  it('preview: ffprobe format copyright+encoded_by + ffmpeg compand 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=copyright,encoded_by') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af compand=attacks=0.02:decays=0.1:points=-80/-80|-25/-25|0/-10:gain=2') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: print-to-file playlist/uploader/rating/availability/age + geo AW/CW/SX/TC/VG', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --print-to-file playlist_index flux-ytdlp-plidx.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file playlist_autonumber flux-ytdlp-plauto.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file playlist_count flux-ytdlp-plcount.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file playlist_uploader_id flux-ytdlp-plupid.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file uploader_id flux-ytdlp-upid.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file average_rating flux-ytdlp-rating.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file availability flux-ytdlp-avail.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file age_limit flux-ytdlp-age.txt --skip-download ')
    expect(lines).toContain('yt-dlp --geo-bypass-country AW -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country CW -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country SX -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country TC -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country VG -F ')
  })

  it('preview: ffprobe album_artist + track/disc + ffmpeg dynaudnorm 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=album_artist') && l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=track,disc') && l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af dynaudnorm=f=150:g=15') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: print-to-file domain/original/abr/vbr/filesize/format_note/plup + geo AG/MS/AI/GP/BQ + max-dls/pl-random/force-over', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --print-to-file webpage_url_domain flux-ytdlp-wudom.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file original_url flux-ytdlp-ourl.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file abr flux-ytdlp-abr.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file vbr flux-ytdlp-vbr.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file filesize flux-ytdlp-fszb.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file format_note flux-ytdlp-fnote.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file playlist_uploader flux-ytdlp-plup.txt --skip-download ')
    expect(lines).toContain('yt-dlp --geo-bypass-country AG -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country MS -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country AI -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country GP -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BQ -F ')
    expect(lines).toContain('yt-dlp --max-downloads 5 -F ')
    expect(lines).toContain('yt-dlp --playlist-random -F ')
    expect(lines).toContain('yt-dlp --force-overwrites -F ')
  })

  it('preview: ffprobe lyrics+synopsis + ffmpeg asoftclip 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=lyrics,synopsis') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af asoftclip') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: print-to-file fulltitle/alt_title/artist/album/relyear/is_live/live_status/chfol + geo CK/NU/TK/TO/WS + skip-unavail/abort -F', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --print-to-file fulltitle flux-ytdlp-fulltitle.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file alt_title flux-ytdlp-alttitle.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file artist flux-ytdlp-artist.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file album flux-ytdlp-album.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file release_year flux-ytdlp-relyear.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file is_live flux-ytdlp-islive.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file live_status flux-ytdlp-livestat.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file channel_follower_count flux-ytdlp-chfol.txt --skip-download ')
    expect(lines).toContain('yt-dlp --geo-bypass-country CK -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country NU -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country TK -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country TO -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country WS -F ')
    expect(lines).toContain('yt-dlp --skip-unavailable-fragments -F ')
    expect(lines).toContain('yt-dlp --abort-on-error -F ')
  })

  it('preview: ffprobe a:0 channels+channel_layout + ffmpeg aecho 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams a:0') &&
          l.includes('stream=channels,channel_layout') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af aecho=0.8:0.9:40:0.3') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: print-to-file series/snum/epnum/epstr/epid/sid/plchid/asr/drm/embed/waslive/mtype + geo PF/NC/FJ/VU/SB/FM/MH/PW + no-brk-reject -F', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --print-to-file series flux-ytdlp-series.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file season_number flux-ytdlp-snum.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file episode_number flux-ytdlp-epnum.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file episode flux-ytdlp-epstr.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file episode_id flux-ytdlp-epid.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file season_id flux-ytdlp-sid.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file playlist_channel_id flux-ytdlp-plchid.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file asr flux-ytdlp-asr.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file has_drm flux-ytdlp-drm.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file playable_in_embed flux-ytdlp-embed.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file was_live flux-ytdlp-waslive.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file media_type flux-ytdlp-mtype.txt --skip-download ')
    expect(lines).toContain('yt-dlp --geo-bypass-country PF -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country NC -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country FJ -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country VU -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country SB -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country FM -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country MH -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country PW -F ')
    expect(lines).toContain('yt-dlp --no-break-on-reject -F ')
  })

  it('preview: ffprobe s:1 disposition + ffmpeg tremolo/bandpass 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams s:1') &&
          l.includes('stream=disposition') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af tremolo=f=6:d=0.5') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af bandpass=f=1000:width_type=h:width=200') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: print-to-file _type/plurl/manurl/sarfix/reqf + geo NR/TV/KI/WF + progress-delta -F', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --print-to-file _type flux-ytdlp-otype.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file playlist_url flux-ytdlp-plurl.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file manifest_url flux-ytdlp-manurl.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file stretched_ratio flux-ytdlp-sarfix.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file requested_formats flux-ytdlp-reqf.txt --skip-download ')
    expect(lines).toContain('yt-dlp --geo-bypass-country NR -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country TV -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country KI -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country WF -F ')
    expect(lines).toContain('yt-dlp --progress-delta 5 -F ')
  })

  it('downloads: print-to-file formats/url/thumbnails/location + geo AX/SJ/SH + xattr-set-filesize -F', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --print-to-file formats flux-ytdlp-formats.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file url flux-ytdlp-url.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file thumbnails flux-ytdlp-thumbs.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file location flux-ytdlp-locmeta.txt --skip-download ')
    expect(lines).toContain('yt-dlp --geo-bypass-country AX -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country SJ -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country SH -F ')
    expect(lines).toContain('yt-dlp --xattr-set-filesize -F ')
  })

  it('preview: ffprobe a:1 codec+channels+layout + ffmpeg highshelf 3s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams a:1') &&
          l.includes('stream=codec_name,channels,channel_layout') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af highshelf=f=8000:width_type=o:width=2:g=-6') &&
          l.includes('-t 3') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('preview: ffprobe v:1 WxH + ffmpeg apulsator 3s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams v:1') &&
          l.includes('stream=codec_name,width,height') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af apulsator=mode=sine:hz=1:width=2') &&
          l.includes('-t 3') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: print-to-file epoch/reqsubs/plch/nent/dislikes + no-pl-metafiles + geo BV/TF/HM -F', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --print-to-file epoch flux-ytdlp-epoch.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file requested_subtitles flux-ytdlp-reqsubs.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file playlist_channel flux-ytdlp-plch.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file n_entries flux-ytdlp-nent.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file dislike_count flux-ytdlp-dislikes.txt --skip-download ')
    expect(lines).toContain('yt-dlp --no-playlist-metafiles -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BV -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country TF -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country HM -F ')
  })

  it('preview: ffprobe d:1 codec+tag + ffmpeg chorus 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('-select_streams d:1') &&
          l.includes('stream=codec_name,codec_tag_string') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af chorus=0.5:0.9:50:0.4:0.25:2') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: geo IO/PN/AQ/GS/PM + print-to-file rel/mts/upts/aspect/epsort', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --geo-bypass-country IO -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country PN -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country AQ -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country GS -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country PM -F ')
    expect(lines).toContain('yt-dlp --print-to-file release_date flux-ytdlp-reldate.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file modified_timestamp flux-ytdlp-mts.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file upload_timestamp flux-ytdlp-upts.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file aspect_ratio flux-ytdlp-aspect.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file episode_sort flux-ytdlp-epsort.txt --skip-download ')
  })

  it('preview: ffprobe format encoder+WMFSDKVersion + ffmpeg afade in 3s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=encoder,WMFSDKVersion') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af afade=t=in:st=0:d=0.6') &&
          l.includes('-t 3') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: geo FK/EH/DJ/KG/TJ/NP/LA/KH/BN + print-to-file chverify/private/composers/creators/trknum', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --geo-bypass-country FK -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country EH -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country DJ -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country KG -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country TJ -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country NP -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country LA -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country KH -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BN -F ')
    expect(lines).toContain(
      'yt-dlp --print-to-file channel_is_verified flux-ytdlp-chverify.txt --skip-download '
    )
    expect(lines).toContain('yt-dlp --print-to-file is_private flux-ytdlp-private.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file composers flux-ytdlp-composers.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file creators flux-ytdlp-creators.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file track_number flux-ytdlp-trknum.txt --skip-download ')
  })

  it('downloads: geo MM/BT/MV/MZ/ZW/BW/NA/LS/MW/SZ + print-to-file genre/album_type/license/track/album_artist/comment', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --geo-bypass-country MM -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BT -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country MV -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country MZ -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country ZW -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BW -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country NA -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country LS -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country MW -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country SZ -F ')
    expect(lines).toContain('yt-dlp --print-to-file genre flux-ytdlp-genre.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file album_type flux-ytdlp-albumtype.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file license flux-ytdlp-license.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file track flux-ytdlp-track.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file album_artist flux-ytdlp-albumartist.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file comment flux-ytdlp-comment.txt --skip-download ')
  })

  it('preview: ffprobe format probe_score + ffmpeg atempo 0.95 3s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format=probe_score') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af atempo=0.95') &&
          l.includes('-t 3') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('preview: ffprobe format encoding_tool + ffmpeg afade out 3s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=encoding_tool') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af afade=t=out:st=1.2:d=0.6') &&
          l.includes('-t 3') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: geo TD/NE/ML/SN/LY/SO/ER/SS/YE/MR + print-to-file lyrics/disc_number/publisher/mood', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --geo-bypass-country TD -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country NE -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country ML -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country SN -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country LY -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country SO -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country ER -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country SS -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country YE -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country MR -F ')
    expect(lines).toContain('yt-dlp --print-to-file lyrics flux-ytdlp-lyrics.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file disc_number flux-ytdlp-discnum.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file publisher flux-ytdlp-publisher.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file mood flux-ytdlp-mood.txt --skip-download ')
  })

  it('preview: ffprobe v:1 codec long + ffmpeg alimiter 3s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams v:1') &&
          l.includes('codec_long_name') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af alimiter=limit=0.8') &&
          l.includes('-t 3') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: geo CM/GA/CG/CD/CF/GQ/ST/BI/RW/UG/TZ/ZM + print-to-file artist_sort…director', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --geo-bypass-country CM -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country GA -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country CG -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country CD -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country CF -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country GQ -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country ST -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BI -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country RW -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country UG -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country TZ -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country ZM -F ')
    expect(lines).toContain('yt-dlp --print-to-file artist_sort flux-ytdlp-artistsort.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file album_sort flux-ytdlp-albumsort.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file conductor flux-ytdlp-conductor.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file performers flux-ytdlp-performers.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file copyright flux-ytdlp-copy.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file uploader_url flux-ytdlp-upurl.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file producer flux-ytdlp-producer.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file director flux-ytdlp-director.txt --skip-download ')
  })

  it('preview: ffprobe format MP4 brands + ffmpeg stereotools 3s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=major_brand,minor_version,compatible_brands') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af stereotools=mlev=0.05:phlev=0.05') &&
          l.includes('-t 3') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: geo BJ/TG/BF/CI/LR/SL/GN/GW + no-build-paths + print-to-file arranger…show', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --no-build-paths -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BJ -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country TG -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BF -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country CI -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country LR -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country SL -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country GN -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country GW -F ')
    expect(lines).toContain('yt-dlp --print-to-file arranger flux-ytdlp-arranger.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file remixer flux-ytdlp-remixer.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file engineer flux-ytdlp-engineer.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file lyricist flux-ytdlp-lyricist.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file grouping flux-ytdlp-grouping.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file compilation flux-ytdlp-compilation.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file show flux-ytdlp-show.txt --skip-download ')
  })

  it('preview: ffprobe gapless+compilation + ffmpeg speechnorm 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=gapless_playback,compilation') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af speechnorm=peak=0.25') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: geo SV/HN/NI/GT/BZ/DO/HT + limit-rate 500K + print-to-file album_artists/cast/network', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --geo-bypass-country SV -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country HN -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country NI -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country GT -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country BZ -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country DO -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country HT -F ')
    expect(lines).toContain('yt-dlp --limit-rate 500K -F ')
    expect(lines).toContain('yt-dlp --print-to-file album_artists flux-ytdlp-albumartists.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file cast flux-ytdlp-cast.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file network flux-ytdlp-network.txt --skip-download ')
  })

  it('preview: ffprobe format BPM+key + ffmpeg bs2b 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=BPM,initial_key') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af bs2b=profile=j2') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: geo BR/VE/EC/PY/CU/GY/SR + print-to-file webpage_url_scheme', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --geo-bypass-country BR -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country VE -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country EC -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country PY -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country CU -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country GY -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country SR -F ')
    expect(lines).toContain(
      'yt-dlp --print-to-file webpage_url_scheme flux-ytdlp-wuscheme.txt --skip-download '
    )
  })

  it('preview: ffprobe format artist+album + ffmpeg bass 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=artist,album') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af bass=g=2:f=120') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: print-to-file playlist/annotations/storyboards/plwpurl + retries/fragment-retries 20 -F', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --print-to-file playlist flux-ytdlp-playlist.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file annotations flux-ytdlp-annotations.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file storyboards flux-ytdlp-storyboards.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file playlist_webpage_url flux-ytdlp-plwpurl.txt --skip-download ')
    expect(lines).toContain('yt-dlp --retries 20 -F ')
    expect(lines).toContain('yt-dlp --fragment-retries 20 -F ')
  })

  it('preview: ffprobe s:0 index+codec + ffmpeg superequalizer 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('select_streams s:0') &&
          l.includes('stream=index,codec_name') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af superequalizer=3b=4') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: print-to-file timestamp/extractor_key/track_id/album_id/dynamic_range + geo TT -F', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --print-to-file timestamp flux-ytdlp-ts.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file extractor_key flux-ytdlp-extkey.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file track_id flux-ytdlp-trackid.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file album_id flux-ytdlp-albumid.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file dynamic_range flux-ytdlp-dynrange.txt --skip-download ')
    expect(lines).toContain('yt-dlp --geo-bypass-country TT -F ')
  })

  it('downloads: print-to-file audio_ext/video_ext/player_url + concurrent-fragments 4 -F + geo RE/MU/SC -F', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --print-to-file audio_ext flux-ytdlp-audext.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file video_ext flux-ytdlp-vidext.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file player_url flux-ytdlp-playerurl.txt --skip-download ')
    expect(lines).toContain('yt-dlp --concurrent-fragments 4 -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country RE -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country MU -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country SC -F ')
  })

  it('preview: ffprobe format show+epsort + ffmpeg lowshelf 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=show,episode_sort') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af lowshelf=g=2:f=200') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('preview: ffprobe format genre+date + ffmpeg extrastereo 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=genre,date') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af extrastereo=m=1.2') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })

  it('downloads: print-to-file audio_channels/chapter*/start_time/end_time/quality/formats_table', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --print-to-file audio_channels flux-ytdlp-achs.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file chapter flux-ytdlp-chapter.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file chapter_id flux-ytdlp-chapid.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file chapter_number flux-ytdlp-chapnum.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file start_time flux-ytdlp-stt.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file end_time flux-ytdlp-end.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file quality flux-ytdlp-quality.txt --skip-download ')
    expect(lines).toContain('yt-dlp --print-to-file formats_table flux-ytdlp-ftbl.txt --skip-download ')
  })

  it('downloads: geo AF/AO/HK/IL/KW -F + --clean-info-json -F + --update-to stable', () => {
    const lines = TERMINAL_SCENARIO_HINTS_DOWNLOADS.map((h) => h.fullLine ?? '')
    expect(lines).toContain('yt-dlp --geo-bypass-country AF -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country AO -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country HK -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country IL -F ')
    expect(lines).toContain('yt-dlp --geo-bypass-country KW -F ')
    expect(lines).toContain('yt-dlp --clean-info-json -F ')
    expect(lines).toContain('yt-dlp --update-to stable')
  })

  it('preview: ffprobe format podcast+podcasturl + ffmpeg acrusher 4s', () => {
    const lines = TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA.map((h) => h.fullLine ?? '')
    expect(
      lines.some(
        (l) =>
          l.includes('format_tags=podcast,podcasturl') &&
          l.includes(TERMINAL_CURRENT_FILE_PLACEHOLDER)
      )
    ).toBe(true)
    expect(
      lines.some(
        (l) =>
          l.includes('-af acrusher=level_in=0.8:level_out=0.8:bits=8:mode=log') &&
          l.includes('-t 4') &&
          l.includes('-vn -sn')
      )
    ).toBe(true)
  })
})
