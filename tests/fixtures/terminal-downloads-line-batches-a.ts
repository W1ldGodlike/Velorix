import type { TerminalDownloadsLineBatch } from './terminal-downloads-line-batches-types'

export const TERMINAL_DOWNLOADS_LINE_BATCHES_A: readonly TerminalDownloadsLineBatch[] = [
  {
    label: 'no-remote-playlist + geo JP/CA + thumbnails + web_safari + playlist_* + flat _type',
    lines: [
      'yt-dlp --no-remote-playlist -J ',
      'yt-dlp --geo-bypass-country JP -F ',
      'yt-dlp --geo-bypass-country CA -F ',
      'yt-dlp --skip-download --print thumbnails ',
      'yt-dlp --extractor-args youtube:player_client=web_safari -F ',
      'yt-dlp --skip-download --print playlist_channel ',
      'yt-dlp --skip-download --print playlist_channel_id ',
      'yt-dlp --skip-download --print playlist_uploader ',
      'yt-dlp --skip-download --print playlist_uploader_id ',
      'yt-dlp --flat-playlist --skip-download --print _type '
    ] as const
  },
  {
    label:
      'quiet / no-cookies / compat 2025 / break-on-existing / mtime / check-formats-threshold / no-sponsorblock / allow-dynamic-mpd',
    lines: [
      'yt-dlp --quiet -F ',
      'yt-dlp --no-cookies -F ',
      'yt-dlp --break-on-existing -F ',
      'yt-dlp --mtime ',
      'yt-dlp --check-formats-threshold 1.5 -F ',
      'yt-dlp --no-sponsorblock -F ',
      'yt-dlp --allow-dynamic-mpd -F '
    ] as const
  },
  {
    label: 'ignore-dynamic-mpd / sponsorblock-api / config-locations / geo MX..CH / xfwd',
    lines: [
      'yt-dlp --ignore-dynamic-mpd -F ',
      'yt-dlp --sponsorblock-api https://sponsor.ajay.app -F ',
      'yt-dlp --config-locations yt-dlp.conf -F ',
      'yt-dlp --geo-bypass-country MX -F ',
      'yt-dlp --geo-bypass-country KR -F ',
      'yt-dlp --geo-bypass-country IN -F ',
      'yt-dlp --geo-bypass-country TR -F ',
      'yt-dlp --geo-bypass-country NO -F ',
      'yt-dlp --geo-bypass-country CH -F ',
      'yt-dlp --xfwd -F '
    ] as const
  },
  {
    label: 'TV auth helpers / downloader-args / include-ads / geo NZ ZA',
    lines: [
      'yt-dlp --no-cookies-from-browser -F ',
      'yt-dlp --downloader-args ffmpeg:-nostdin -F ',
      'yt-dlp --include-ads -F ',
      'yt-dlp --twofactor 123456 ',
      'yt-dlp --video-password PASSWORD ',
      'yt-dlp --ap-mso Rogers -F ',
      'yt-dlp --ap-username user@example.com -F ',
      'yt-dlp --concurrent-downloads 2 -F ',
      'yt-dlp --geo-bypass-country NZ -F ',
      'yt-dlp --geo-bypass-country ZA -F '
    ] as const
  },
  {
    label: 'print-to-file _type/plurl/manurl/sarfix/reqf + geo NR/TV/KI/WF + progress-delta -F',
    lines: [
      'yt-dlp --print-to-file _type velorix-ytdlp-otype.txt --skip-download ',
      'yt-dlp --print-to-file playlist_url velorix-ytdlp-plurl.txt --skip-download ',
      'yt-dlp --print-to-file manifest_url velorix-ytdlp-manurl.txt --skip-download ',
      'yt-dlp --print-to-file stretched_ratio velorix-ytdlp-sarfix.txt --skip-download ',
      'yt-dlp --print-to-file requested_formats velorix-ytdlp-reqf.txt --skip-download ',
      'yt-dlp --geo-bypass-country NR -F ',
      'yt-dlp --geo-bypass-country TV -F ',
      'yt-dlp --geo-bypass-country KI -F ',
      'yt-dlp --geo-bypass-country WF -F ',
      'yt-dlp --progress-delta 5 -F '
    ] as const
  },
  {
    label:
      'geo FK/EH/DJ/KG/TJ/NP/LA/KH/BN + print-to-file chverify/private/composers/creators/trknum',
    lines: [
      'yt-dlp --geo-bypass-country FK -F ',
      'yt-dlp --geo-bypass-country EH -F ',
      'yt-dlp --geo-bypass-country DJ -F ',
      'yt-dlp --geo-bypass-country KG -F ',
      'yt-dlp --geo-bypass-country TJ -F ',
      'yt-dlp --geo-bypass-country NP -F ',
      'yt-dlp --geo-bypass-country LA -F ',
      'yt-dlp --geo-bypass-country KH -F ',
      'yt-dlp --geo-bypass-country BN -F ',
      'yt-dlp --print-to-file channel_is_verified velorix-ytdlp-chverify.txt --skip-download ',
      'yt-dlp --print-to-file is_private velorix-ytdlp-private.txt --skip-download ',
      'yt-dlp --print-to-file composers velorix-ytdlp-composers.txt --skip-download ',
      'yt-dlp --print-to-file creators velorix-ytdlp-creators.txt --skip-download ',
      'yt-dlp --print-to-file track_number velorix-ytdlp-trknum.txt --skip-download '
    ] as const
  },
  {
    label: 'print-to-file timestamp/extractor_key/track_id/album_id/dynamic_range + geo TT -F',
    lines: [
      'yt-dlp --print-to-file timestamp velorix-ytdlp-ts.txt --skip-download ',
      'yt-dlp --print-to-file extractor_key velorix-ytdlp-extkey.txt --skip-download ',
      'yt-dlp --print-to-file track_id velorix-ytdlp-trackid.txt --skip-download ',
      'yt-dlp --print-to-file album_id velorix-ytdlp-albumid.txt --skip-download ',
      'yt-dlp --print-to-file dynamic_range velorix-ytdlp-dynrange.txt --skip-download ',
      'yt-dlp --geo-bypass-country TT -F '
    ] as const
  },
  {
    label: 'print-to-file audio_channels/chapter*/start_time/end_time/quality/formats_table',
    lines: [
      'yt-dlp --print-to-file audio_channels velorix-ytdlp-achs.txt --skip-download ',
      'yt-dlp --print-to-file chapter velorix-ytdlp-chapter.txt --skip-download ',
      'yt-dlp --print-to-file chapter_id velorix-ytdlp-chapid.txt --skip-download ',
      'yt-dlp --print-to-file chapter_number velorix-ytdlp-chapnum.txt --skip-download ',
      'yt-dlp --print-to-file start_time velorix-ytdlp-stt.txt --skip-download ',
      'yt-dlp --print-to-file end_time velorix-ytdlp-end.txt --skip-download ',
      'yt-dlp --print-to-file quality velorix-ytdlp-quality.txt --skip-download ',
      'yt-dlp --print-to-file formats_table velorix-ytdlp-ftbl.txt --skip-download '
    ] as const
  },
  {
    label: 'geo AF/AO/HK/IL/KW -F + --clean-info-json -F',
    lines: [
      'yt-dlp --geo-bypass-country AF -F ',
      'yt-dlp --geo-bypass-country AO -F ',
      'yt-dlp --geo-bypass-country HK -F ',
      'yt-dlp --geo-bypass-country IL -F ',
      'yt-dlp --geo-bypass-country KW -F ',
      'yt-dlp --clean-info-json -F '
    ] as const
  },
  {
    label: 'print-to-file format/language_preference/autonumber + geo OM/QA/BH/AE/SA',
    lines: [
      'yt-dlp --print-to-file format velorix-ytdlp-fmtline.txt --skip-download ',
      'yt-dlp --print-to-file language_preference velorix-ytdlp-langpref.txt --skip-download ',
      'yt-dlp --print-to-file autonumber velorix-ytdlp-anum.txt --skip-download ',
      'yt-dlp --geo-bypass-country OM -F ',
      'yt-dlp --geo-bypass-country QA -F ',
      'yt-dlp --geo-bypass-country BH -F ',
      'yt-dlp --geo-bypass-country AE -F ',
      'yt-dlp --geo-bypass-country SA -F '
    ] as const
  },
  {
    label:
      'print-to-file filename_sanitized/requested_downloads + extractor-retries 5 -F + geo JO/LB/UZ/TM',
    lines: [
      'yt-dlp --print-to-file filename_sanitized velorix-ytdlp-fnsan.txt --skip-download ',
      'yt-dlp --print-to-file requested_downloads velorix-ytdlp-reqdl.txt --skip-download ',
      'yt-dlp --extractor-retries 5 -F ',
      'yt-dlp --geo-bypass-country JO -F ',
      'yt-dlp --geo-bypass-country LB -F ',
      'yt-dlp --geo-bypass-country UZ -F ',
      'yt-dlp --geo-bypass-country TM -F '
    ] as const
  },
  {
    label: 'print-to-file modified_date/live_title + http-chunk 1M -F + geo CV/GM/KM',
    lines: [
      'yt-dlp --print-to-file modified_date velorix-ytdlp-mdate.txt --skip-download ',
      'yt-dlp --print-to-file live_title velorix-ytdlp-livetitle.txt --skip-download ',
      'yt-dlp --http-chunk-size 1M -F ',
      'yt-dlp --geo-bypass-country CV -F ',
      'yt-dlp --geo-bypass-country GM -F ',
      'yt-dlp --geo-bypass-country KM -F '
    ] as const
  },
  {
    label:
      'print-to-file section_start/section_end/played_count/referrer + playlist-reverse -F + geo YT/MG/PG',
    lines: [
      'yt-dlp --print-to-file section_start velorix-ytdlp-segstart.txt --skip-download ',
      'yt-dlp --print-to-file section_end velorix-ytdlp-segend.txt --skip-download ',
      'yt-dlp --print-to-file played_count velorix-ytdlp-playcnt.txt --skip-download ',
      'yt-dlp --print-to-file referrer velorix-ytdlp-refurl.txt --skip-download ',
      'yt-dlp --playlist-reverse -F ',
      'yt-dlp --geo-bypass-country YT -F ',
      'yt-dlp --geo-bypass-country MG -F ',
      'yt-dlp --geo-bypass-country PG -F '
    ] as const
  },
  {
    label: 'сетевые/выводные флаги yt-dlp (smoke по fullLine)',
    lines: [
      'yt-dlp --no-mtime ',
      'yt-dlp --continue ',
      'yt-dlp --abort-on-error ',
      'yt-dlp --playlist-start 5 --playlist-end 15 -J ',
      'yt-dlp --max-filesize 512M -F ',
      'yt-dlp --restrict-filenames -F ',
      'yt-dlp --color never -F ',
      'yt-dlp --embed-metadata ',
      'yt-dlp --embed-thumbnail ',
      'yt-dlp --wait-for-video 10 ',
      'yt-dlp --skip-playlist-after-errors 5 ',
      'yt-dlp --output-na-placeholder NA --skip-download --print title ',
      'yt-dlp --referer https://www.youtube.com/ -F ',
      'yt-dlp --add-header Accept-Language:en-US -F ',
      'yt-dlp --proxy http://127.0.0.1:8080 -F ',
      'yt-dlp --impersonate chrome -F ',
      'yt-dlp --match-filter duration<600 -F ',
      'yt-dlp --batch-file urls.txt ',
      'yt-dlp --load-info-json video.info.json ',
      'yt-dlp --yes-playlist -J ',
      'yt-dlp --no-config -F ',
      'yt-dlp --cookies cookies.txt -F ',
      'yt-dlp --sleep-interval 2 ',
      'yt-dlp --age-limit 18 -F ',
      'yt-dlp --lazy-playlist -J ',
      'yt-dlp --skip-download --print season_number ',
      'yt-dlp --remux-video mkv ',
      'yt-dlp --dateafter 20240101 -F ',
      'yt-dlp --max-downloads 5 ',
      'yt-dlp --match-title trailer -F ',
      'yt-dlp --write-link --skip-download ',
      'yt-dlp --sponsorblock-mark all ',
      'yt-dlp --extract-audio --audio-format mp3 ',
      'yt-dlp --audio-quality 192K --extract-audio ',
      'yt-dlp --skip-download --print n_entries ',
      'yt-dlp --embed-chapters ',
      'yt-dlp --mark-watched --skip-download ',
      'yt-dlp --write-all-thumbnails --skip-download ',
      'yt-dlp --no-check-formats -F ',
      'yt-dlp --playlist-reverse -J ',
      'yt-dlp --playlist-random -J ',
      'yt-dlp --user-agent curl/8.5.0 -F ',
      'yt-dlp --throttled-rate 100K -F ',
      'yt-dlp --embed-subs ',
      'yt-dlp --convert-subs srt ',
      'yt-dlp -o %(title)s.%(ext)s ',
      'yt-dlp --split-chapters ',
      'yt-dlp --remove-chapters sponsor ',
      'yt-dlp --write-playlist-metafiles ',
      'yt-dlp --force-overwrites ',
      'yt-dlp --no-continue ',
      'yt-dlp --recode-video mp4 ',
      'yt-dlp --download-sections *0:00-2:00 ',
      'yt-dlp --break-match-filters ',
      'yt-dlp --no-post-overwrites ',
      'yt-dlp --add-metadata ',
      'yt-dlp --hls-prefer-ffmpeg -F ',
      'yt-dlp --ffmpeg-location ffmpeg ',
      'yt-dlp --paths home:ytdl-out ',
      'yt-dlp --no-download-archive ',
      'yt-dlp --encoding utf-8 ',
      'yt-dlp --break-per-input -F ',
      'yt-dlp --check-all-formats -F ',
      'yt-dlp --xattrs ',
      'yt-dlp -U ',
      'yt-dlp --compat-options no-youtube-unavailable-videos -F ',
      'yt-dlp --rm-cache-dir',
      'yt-dlp --cache-dir cache -F ',
      'yt-dlp --keep-fragments -F ',
      'yt-dlp --buffer-size 16K -F ',
      'yt-dlp --abort-on-unavailable-fragments ',
      'yt-dlp --sub-langs en.*,ru.* -F ',
      'yt-dlp --skip-download --print release_date ',
      'yt-dlp --skip-download --print album_artist ',
      'yt-dlp --skip-download --print track_number ',
      'yt-dlp --skip-download --cookies-from-browser brave ',
      'yt-dlp --skip-download --print series ',
      'yt-dlp --skip-download --print season ',
      'yt-dlp --skip-download --print episode ',
      'yt-dlp --skip-download --print display_id ',
      'yt-dlp --skip-download --print webpage_url_basename ',
      'yt-dlp --skip-download --print fulltitle ',
      'yt-dlp --sponsorblock-remove sponsor ',
      'yt-dlp --downloader native -F ',
      'yt-dlp --legacy-server-connect -F ',
      'yt-dlp --no-call-home -F ',
      'yt-dlp --datebefore 20991231 -F ',
      'yt-dlp --embed-info-json ',
      'yt-dlp --netrc -F ',
      'yt-dlp --force-generic-extractor -F ',
      'yt-dlp --skip-download --print channel_follower_count ',
      'yt-dlp --skip-download --print average_rating ',
      'yt-dlp --write-all-urls --skip-download ',
      'yt-dlp --dump-pages --skip-download ',
      'yt-dlp --no-progress -F ',
      'yt-dlp --skip-download --print is_private '
    ] as const
  },
  {
    label: 'HLS/subs/throttle/disk guards + single-entry JSON',
    lines: [
      'yt-dlp --no-playlist -J ',
      'yt-dlp --hls-use-mpegts -F ',
      'yt-dlp --write-subs --skip-download ',
      'yt-dlp --max-sleep-interval 10 -F ',
      'yt-dlp --retry-sleep 5 -F ',
      'yt-dlp --min-filesize 100K -F ',
      'yt-dlp --file-access-retries 5 -F '
    ] as const
  },
  {
    label: 'playlist/timestamps/location prints',
    lines: [
      'yt-dlp --skip-download --print playlist ',
      'yt-dlp --skip-download --print playlist_autonumber ',
      'yt-dlp --skip-download --print modified_timestamp ',
      'yt-dlp --skip-download --print release_timestamp ',
      'yt-dlp --skip-download --print upload_timestamp ',
      'yt-dlp --skip-download --print stretched_ratio ',
      'yt-dlp --skip-download --print location '
    ] as const
  },
  {
    label: 'YouTube player clients + extractor metadata (smoke)',
    lines: [
      'yt-dlp --extractor-args youtube:player_client=android -F ',
      'yt-dlp --extractor-args youtube:player_client=tv_embedded -F ',
      'yt-dlp --extractor-args youtube:player_client=ios -F ',
      'yt-dlp --skip-download --print alternate_title ',
      'yt-dlp --skip-download --print extractor_key ',
      'yt-dlp --flat-playlist --skip-download --print webpage_url ',
      'yt-dlp --geo-bypass-country DE -F ',
      'yt-dlp --skip-download --print channel_is_verified '
    ] as const
  },
  {
    label: 'extra browsers + FR geo + mweb + requested_*',
    lines: [
      'yt-dlp --skip-download --cookies-from-browser opera ',
      'yt-dlp --skip-download --cookies-from-browser chromium ',
      'yt-dlp --skip-download --cookies-from-browser vivaldi ',
      'yt-dlp --geo-bypass-country FR -F ',
      'yt-dlp --extractor-args youtube:player_client=mweb -F ',
      'yt-dlp --skip-download --print requested_formats ',
      'yt-dlp --skip-download --print requested_subtitles '
    ] as const
  },
  {
    label:
      'safari + web_creator/web_embedded + GB + formats + simulate merge + multi-streams + compat 2024',
    lines: [
      'yt-dlp --skip-download --cookies-from-browser safari ',
      'yt-dlp --extractor-args youtube:player_client=web_creator -F ',
      'yt-dlp --extractor-args youtube:player_client=web_embedded -F ',
      'yt-dlp --geo-bypass-country GB -F ',
      'yt-dlp --skip-download --print formats ',
      'yt-dlp --simulate -f bestvideo+bestaudio/best ',
      'yt-dlp --multi-streams -F ',
      'yt-dlp --compat-options 2024 -F ',
      'yt-dlp --no-playlist --skip-download --print title ',
      'yt-dlp --flat-playlist --skip-download --print extractor '
    ] as const
  },
  {
    label:
      'merge mp4 / keep-video / ext-downloader / parse-metadata / geo AU–IT / playlist URL / multistream flags',
    lines: [
      'yt-dlp --merge-output-format mp4 ',
      'yt-dlp --no-keep-video ',
      'yt-dlp --external-downloader ffmpeg ',
      'yt-dlp --parse-metadata title:%(title)s ',
      'yt-dlp --geo-bypass-country AU -F ',
      'yt-dlp --geo-bypass-country BR -F ',
      'yt-dlp --geo-bypass-country IT -F ',
      'yt-dlp --skip-download --print playlist_webpage_url ',
      'yt-dlp --skip-download --print webpage_url_scheme ',
      'yt-dlp --video-multistreams -F ',
      'yt-dlp --audio-multistreams -F '
    ] as const
  }
]
