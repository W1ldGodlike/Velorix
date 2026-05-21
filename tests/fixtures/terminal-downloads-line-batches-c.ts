import type { TerminalDownloadsLineBatch } from './terminal-downloads-line-batches-types'

export const TERMINAL_DOWNLOADS_LINE_BATCHES_C: readonly TerminalDownloadsLineBatch[] = [
  {
    label: 'no-playlist-reverse + print-to-file extra fields + geo BM/KY/JM/BB/BS -F',
    lines: [
      'yt-dlp --no-playlist-reverse -F ',
      'yt-dlp --print-to-file comment_count flux-ytdlp-ccount.txt --skip-download ',
      'yt-dlp --print-to-file webpage_url_basename flux-ytdlp-wubase.txt --skip-download ',
      'yt-dlp --print-to-file display_id flux-ytdlp-dispid.txt --skip-download ',
      'yt-dlp --print-to-file thumbnail flux-ytdlp-thumburl.txt --skip-download ',
      'yt-dlp --print-to-file release_timestamp flux-ytdlp-reltsepoch.txt --skip-download ',
      'yt-dlp --print-to-file filepath flux-ytdlp-fpath.txt --skip-download ',
      'yt-dlp --print-to-file resolution flux-ytdlp-res.txt --skip-download ',
      'yt-dlp --print-to-file format_id flux-ytdlp-fmtid.txt --skip-download ',
      'yt-dlp --print-to-file ext flux-ytdlp-ext.txt --skip-download ',
      'yt-dlp --geo-bypass-country BM -F ',
      'yt-dlp --geo-bypass-country KY -F ',
      'yt-dlp --geo-bypass-country JM -F ',
      'yt-dlp --geo-bypass-country BB -F ',
      'yt-dlp --geo-bypass-country BS -F '
    ] as const
  },
  {
    label:
      'print-to-file width/height/fps/tbr/filesize_approx/protocol + reject-title + geo LC/GD/VC/KN/DM',
    lines: [
      'yt-dlp --print-to-file width flux-ytdlp-width.txt --skip-download ',
      'yt-dlp --print-to-file height flux-ytdlp-height.txt --skip-download ',
      'yt-dlp --print-to-file fps flux-ytdlp-fps.txt --skip-download ',
      'yt-dlp --print-to-file tbr flux-ytdlp-tbr.txt --skip-download ',
      'yt-dlp --print-to-file filesize_approx flux-ytdlp-fsize.txt --skip-download ',
      'yt-dlp --print-to-file protocol flux-ytdlp-proto.txt --skip-download ',
      'yt-dlp --reject-title trailer -F ',
      'yt-dlp --geo-bypass-country LC -F ',
      'yt-dlp --geo-bypass-country GD -F ',
      'yt-dlp --geo-bypass-country VC -F ',
      'yt-dlp --geo-bypass-country KN -F ',
      'yt-dlp --geo-bypass-country DM -F '
    ] as const
  },
  {
    label: 'print-to-file playlist/uploader/rating/availability/age + geo AW/CW/SX/TC/VG',
    lines: [
      'yt-dlp --print-to-file playlist_index flux-ytdlp-plidx.txt --skip-download ',
      'yt-dlp --print-to-file playlist_autonumber flux-ytdlp-plauto.txt --skip-download ',
      'yt-dlp --print-to-file playlist_count flux-ytdlp-plcount.txt --skip-download ',
      'yt-dlp --print-to-file playlist_uploader_id flux-ytdlp-plupid.txt --skip-download ',
      'yt-dlp --print-to-file uploader_id flux-ytdlp-upid.txt --skip-download ',
      'yt-dlp --print-to-file average_rating flux-ytdlp-rating.txt --skip-download ',
      'yt-dlp --print-to-file availability flux-ytdlp-avail.txt --skip-download ',
      'yt-dlp --print-to-file age_limit flux-ytdlp-age.txt --skip-download ',
      'yt-dlp --geo-bypass-country AW -F ',
      'yt-dlp --geo-bypass-country CW -F ',
      'yt-dlp --geo-bypass-country SX -F ',
      'yt-dlp --geo-bypass-country TC -F ',
      'yt-dlp --geo-bypass-country VG -F '
    ] as const
  },
  {
    label:
      'print-to-file domain/original/abr/vbr/filesize/format_note/plup + geo AG/MS/AI/GP/BQ + max-dls/pl-random/force-over',
    lines: [
      'yt-dlp --print-to-file webpage_url_domain flux-ytdlp-wudom.txt --skip-download ',
      'yt-dlp --print-to-file original_url flux-ytdlp-ourl.txt --skip-download ',
      'yt-dlp --print-to-file abr flux-ytdlp-abr.txt --skip-download ',
      'yt-dlp --print-to-file vbr flux-ytdlp-vbr.txt --skip-download ',
      'yt-dlp --print-to-file filesize flux-ytdlp-fszb.txt --skip-download ',
      'yt-dlp --print-to-file format_note flux-ytdlp-fnote.txt --skip-download ',
      'yt-dlp --print-to-file playlist_uploader flux-ytdlp-plup.txt --skip-download ',
      'yt-dlp --geo-bypass-country AG -F ',
      'yt-dlp --geo-bypass-country MS -F ',
      'yt-dlp --geo-bypass-country AI -F ',
      'yt-dlp --geo-bypass-country GP -F ',
      'yt-dlp --geo-bypass-country BQ -F ',
      'yt-dlp --max-downloads 5 -F ',
      'yt-dlp --playlist-random -F ',
      'yt-dlp --force-overwrites -F '
    ] as const
  },
  {
    label:
      'print-to-file fulltitle/alt_title/artist/album/relyear/is_live/live_status/chfol + geo CK/NU/TK/TO/WS + skip-unavail/abort -F',
    lines: [
      'yt-dlp --print-to-file fulltitle flux-ytdlp-fulltitle.txt --skip-download ',
      'yt-dlp --print-to-file alt_title flux-ytdlp-alttitle.txt --skip-download ',
      'yt-dlp --print-to-file artist flux-ytdlp-artist.txt --skip-download ',
      'yt-dlp --print-to-file album flux-ytdlp-album.txt --skip-download ',
      'yt-dlp --print-to-file release_year flux-ytdlp-relyear.txt --skip-download ',
      'yt-dlp --print-to-file is_live flux-ytdlp-islive.txt --skip-download ',
      'yt-dlp --print-to-file live_status flux-ytdlp-livestat.txt --skip-download ',
      'yt-dlp --print-to-file channel_follower_count flux-ytdlp-chfol.txt --skip-download ',
      'yt-dlp --geo-bypass-country CK -F ',
      'yt-dlp --geo-bypass-country NU -F ',
      'yt-dlp --geo-bypass-country TK -F ',
      'yt-dlp --geo-bypass-country TO -F ',
      'yt-dlp --geo-bypass-country WS -F ',
      'yt-dlp --skip-unavailable-fragments -F ',
      'yt-dlp --abort-on-error -F '
    ] as const
  },
  {
    label:
      'print-to-file series/snum/epnum/epstr/epid/sid/plchid/asr/drm/embed/waslive/mtype + geo PF/NC/FJ/VU/SB/FM/MH/PW + no-brk-reject -F',
    lines: [
      'yt-dlp --print-to-file series flux-ytdlp-series.txt --skip-download ',
      'yt-dlp --print-to-file season_number flux-ytdlp-snum.txt --skip-download ',
      'yt-dlp --print-to-file episode_number flux-ytdlp-epnum.txt --skip-download ',
      'yt-dlp --print-to-file episode flux-ytdlp-epstr.txt --skip-download ',
      'yt-dlp --print-to-file episode_id flux-ytdlp-epid.txt --skip-download ',
      'yt-dlp --print-to-file season_id flux-ytdlp-sid.txt --skip-download ',
      'yt-dlp --print-to-file playlist_channel_id flux-ytdlp-plchid.txt --skip-download ',
      'yt-dlp --print-to-file asr flux-ytdlp-asr.txt --skip-download ',
      'yt-dlp --print-to-file has_drm flux-ytdlp-drm.txt --skip-download ',
      'yt-dlp --print-to-file playable_in_embed flux-ytdlp-embed.txt --skip-download ',
      'yt-dlp --print-to-file was_live flux-ytdlp-waslive.txt --skip-download ',
      'yt-dlp --print-to-file media_type flux-ytdlp-mtype.txt --skip-download ',
      'yt-dlp --geo-bypass-country PF -F ',
      'yt-dlp --geo-bypass-country NC -F ',
      'yt-dlp --geo-bypass-country FJ -F ',
      'yt-dlp --geo-bypass-country VU -F ',
      'yt-dlp --geo-bypass-country SB -F ',
      'yt-dlp --geo-bypass-country FM -F ',
      'yt-dlp --geo-bypass-country MH -F ',
      'yt-dlp --geo-bypass-country PW -F ',
      'yt-dlp --no-break-on-reject -F '
    ] as const
  },
  {
    label: 'print-to-file formats/url/thumbnails/location + geo AX/SJ/SH + xattr-set-filesize -F',
    lines: [
      'yt-dlp --print-to-file formats flux-ytdlp-formats.txt --skip-download ',
      'yt-dlp --print-to-file url flux-ytdlp-url.txt --skip-download ',
      'yt-dlp --print-to-file thumbnails flux-ytdlp-thumbs.txt --skip-download ',
      'yt-dlp --print-to-file location flux-ytdlp-locmeta.txt --skip-download ',
      'yt-dlp --geo-bypass-country AX -F ',
      'yt-dlp --geo-bypass-country SJ -F ',
      'yt-dlp --geo-bypass-country SH -F ',
      'yt-dlp --xattr-set-filesize -F '
    ] as const
  },
  {
    label: 'print-to-file epoch/reqsubs/plch/nent/dislikes + no-pl-metafiles + geo BV/TF/HM -F',
    lines: [
      'yt-dlp --print-to-file epoch flux-ytdlp-epoch.txt --skip-download ',
      'yt-dlp --print-to-file requested_subtitles flux-ytdlp-reqsubs.txt --skip-download ',
      'yt-dlp --print-to-file playlist_channel flux-ytdlp-plch.txt --skip-download ',
      'yt-dlp --print-to-file n_entries flux-ytdlp-nent.txt --skip-download ',
      'yt-dlp --print-to-file dislike_count flux-ytdlp-dislikes.txt --skip-download ',
      'yt-dlp --no-playlist-metafiles -F ',
      'yt-dlp --geo-bypass-country BV -F ',
      'yt-dlp --geo-bypass-country TF -F ',
      'yt-dlp --geo-bypass-country HM -F '
    ] as const
  },
  {
    label: 'geo IO/PN/AQ/GS/PM + print-to-file rel/mts/upts/aspect/epsort',
    lines: [
      'yt-dlp --geo-bypass-country IO -F ',
      'yt-dlp --geo-bypass-country PN -F ',
      'yt-dlp --geo-bypass-country AQ -F ',
      'yt-dlp --geo-bypass-country GS -F ',
      'yt-dlp --geo-bypass-country PM -F ',
      'yt-dlp --print-to-file release_date flux-ytdlp-reldate.txt --skip-download ',
      'yt-dlp --print-to-file modified_timestamp flux-ytdlp-mts.txt --skip-download ',
      'yt-dlp --print-to-file upload_timestamp flux-ytdlp-upts.txt --skip-download ',
      'yt-dlp --print-to-file aspect_ratio flux-ytdlp-aspect.txt --skip-download ',
      'yt-dlp --print-to-file episode_sort flux-ytdlp-epsort.txt --skip-download '
    ] as const
  },
  {
    label:
      'geo MM/BT/MV/MZ/ZW/BW/NA/LS/MW/SZ + print-to-file genre/album_type/license/track/album_artist/comment',
    lines: [
      'yt-dlp --geo-bypass-country MM -F ',
      'yt-dlp --geo-bypass-country BT -F ',
      'yt-dlp --geo-bypass-country MV -F ',
      'yt-dlp --geo-bypass-country MZ -F ',
      'yt-dlp --geo-bypass-country ZW -F ',
      'yt-dlp --geo-bypass-country BW -F ',
      'yt-dlp --geo-bypass-country NA -F ',
      'yt-dlp --geo-bypass-country LS -F ',
      'yt-dlp --geo-bypass-country MW -F ',
      'yt-dlp --geo-bypass-country SZ -F ',
      'yt-dlp --print-to-file genre flux-ytdlp-genre.txt --skip-download ',
      'yt-dlp --print-to-file album_type flux-ytdlp-albumtype.txt --skip-download ',
      'yt-dlp --print-to-file license flux-ytdlp-license.txt --skip-download ',
      'yt-dlp --print-to-file track flux-ytdlp-track.txt --skip-download ',
      'yt-dlp --print-to-file album_artist flux-ytdlp-albumartist.txt --skip-download ',
      'yt-dlp --print-to-file comment flux-ytdlp-comment.txt --skip-download '
    ] as const
  },
  {
    label: 'geo TD/NE/ML/SN/LY/SO/ER/SS/YE/MR + print-to-file lyrics/disc_number/publisher/mood',
    lines: [
      'yt-dlp --geo-bypass-country TD -F ',
      'yt-dlp --geo-bypass-country NE -F ',
      'yt-dlp --geo-bypass-country ML -F ',
      'yt-dlp --geo-bypass-country SN -F ',
      'yt-dlp --geo-bypass-country LY -F ',
      'yt-dlp --geo-bypass-country SO -F ',
      'yt-dlp --geo-bypass-country ER -F ',
      'yt-dlp --geo-bypass-country SS -F ',
      'yt-dlp --geo-bypass-country YE -F ',
      'yt-dlp --geo-bypass-country MR -F ',
      'yt-dlp --print-to-file lyrics flux-ytdlp-lyrics.txt --skip-download ',
      'yt-dlp --print-to-file disc_number flux-ytdlp-discnum.txt --skip-download ',
      'yt-dlp --print-to-file publisher flux-ytdlp-publisher.txt --skip-download ',
      'yt-dlp --print-to-file mood flux-ytdlp-mood.txt --skip-download '
    ] as const
  },
  {
    label: 'geo CM/GA/CG/CD/CF/GQ/ST/BI/RW/UG/TZ/ZM + print-to-file artist_sort…director',
    lines: [
      'yt-dlp --geo-bypass-country CM -F ',
      'yt-dlp --geo-bypass-country GA -F ',
      'yt-dlp --geo-bypass-country CG -F ',
      'yt-dlp --geo-bypass-country CD -F ',
      'yt-dlp --geo-bypass-country CF -F ',
      'yt-dlp --geo-bypass-country GQ -F ',
      'yt-dlp --geo-bypass-country ST -F ',
      'yt-dlp --geo-bypass-country BI -F ',
      'yt-dlp --geo-bypass-country RW -F ',
      'yt-dlp --geo-bypass-country UG -F ',
      'yt-dlp --geo-bypass-country TZ -F ',
      'yt-dlp --geo-bypass-country ZM -F ',
      'yt-dlp --print-to-file artist_sort flux-ytdlp-artistsort.txt --skip-download ',
      'yt-dlp --print-to-file album_sort flux-ytdlp-albumsort.txt --skip-download ',
      'yt-dlp --print-to-file conductor flux-ytdlp-conductor.txt --skip-download ',
      'yt-dlp --print-to-file performers flux-ytdlp-performers.txt --skip-download ',
      'yt-dlp --print-to-file copyright flux-ytdlp-copy.txt --skip-download ',
      'yt-dlp --print-to-file uploader_url flux-ytdlp-upurl.txt --skip-download ',
      'yt-dlp --print-to-file producer flux-ytdlp-producer.txt --skip-download ',
      'yt-dlp --print-to-file director flux-ytdlp-director.txt --skip-download '
    ] as const
  },
  {
    label: 'geo BJ/TG/BF/CI/LR/SL/GN/GW + no-build-paths + print-to-file arranger…show',
    lines: [
      'yt-dlp --no-build-paths -F ',
      'yt-dlp --geo-bypass-country BJ -F ',
      'yt-dlp --geo-bypass-country TG -F ',
      'yt-dlp --geo-bypass-country BF -F ',
      'yt-dlp --geo-bypass-country LR -F ',
      'yt-dlp --geo-bypass-country SL -F ',
      'yt-dlp --geo-bypass-country GN -F ',
      'yt-dlp --geo-bypass-country GW -F ',
      'yt-dlp --print-to-file arranger flux-ytdlp-arranger.txt --skip-download ',
      'yt-dlp --print-to-file remixer flux-ytdlp-remixer.txt --skip-download ',
      'yt-dlp --print-to-file engineer flux-ytdlp-engineer.txt --skip-download ',
      'yt-dlp --print-to-file lyricist flux-ytdlp-lyricist.txt --skip-download ',
      'yt-dlp --print-to-file grouping flux-ytdlp-grouping.txt --skip-download ',
      'yt-dlp --print-to-file compilation flux-ytdlp-compilation.txt --skip-download ',
      'yt-dlp --print-to-file show flux-ytdlp-show.txt --skip-download '
    ] as const
  },
  {
    label: 'geo SV/HN/NI/GT/BZ/DO/HT + limit-rate 500K + print-to-file album_artists/cast/network',
    lines: [
      'yt-dlp --geo-bypass-country SV -F ',
      'yt-dlp --geo-bypass-country HN -F ',
      'yt-dlp --geo-bypass-country NI -F ',
      'yt-dlp --geo-bypass-country GT -F ',
      'yt-dlp --geo-bypass-country BZ -F ',
      'yt-dlp --geo-bypass-country DO -F ',
      'yt-dlp --geo-bypass-country HT -F ',
      'yt-dlp --limit-rate 500K -F ',
      'yt-dlp --print-to-file album_artists flux-ytdlp-albumartists.txt --skip-download ',
      'yt-dlp --print-to-file cast flux-ytdlp-cast.txt --skip-download ',
      'yt-dlp --print-to-file network flux-ytdlp-network.txt --skip-download '
    ] as const
  },
  {
    label: 'geo BR/VE/EC/PY/CU/GY/SR/XK + print-to-file webpage_url_scheme',
    lines: [
      'yt-dlp --geo-bypass-country BR -F ',
      'yt-dlp --geo-bypass-country VE -F ',
      'yt-dlp --geo-bypass-country EC -F ',
      'yt-dlp --geo-bypass-country PY -F ',
      'yt-dlp --geo-bypass-country CU -F ',
      'yt-dlp --geo-bypass-country GY -F ',
      'yt-dlp --geo-bypass-country SR -F ',
      'yt-dlp --geo-bypass-country XK -F ',
      'yt-dlp --print-to-file webpage_url_scheme flux-ytdlp-wuscheme.txt --skip-download '
    ] as const
  },
  {
    label:
      'print-to-file playlist/annotations/storyboards/plwpurl + retries/fragment-retries 20 -F',
    lines: [
      'yt-dlp --print-to-file playlist flux-ytdlp-playlist.txt --skip-download ',
      'yt-dlp --print-to-file annotations flux-ytdlp-annotations.txt --skip-download ',
      'yt-dlp --print-to-file storyboards flux-ytdlp-storyboards.txt --skip-download ',
      'yt-dlp --print-to-file playlist_webpage_url flux-ytdlp-plwpurl.txt --skip-download '
    ] as const
  },
  {
    label:
      'print-to-file audio_ext/video_ext/player_url + concurrent-fragments 4 -F + geo RE/MU/SC -F',
    lines: [
      'yt-dlp --print-to-file audio_ext flux-ytdlp-audext.txt --skip-download ',
      'yt-dlp --print-to-file video_ext flux-ytdlp-vidext.txt --skip-download ',
      'yt-dlp --print-to-file player_url flux-ytdlp-playerurl.txt --skip-download ',
      'yt-dlp --concurrent-fragments 4 -F ',
      'yt-dlp --geo-bypass-country RE -F ',
      'yt-dlp --geo-bypass-country MU -F ',
      'yt-dlp --geo-bypass-country SC -F '
    ] as const
  },
  {
    label:
      'print-to-file keywords/plchurl/starring/title_sort/season/section_number/isrc/track_sort/alt_description/view_count',
    lines: [
      'yt-dlp --print-to-file keywords flux-ytdlp-keywords.txt --skip-download ',
      'yt-dlp --print-to-file playlist_channel_url flux-ytdlp-plchurl.txt --skip-download ',
      'yt-dlp --print-to-file starring flux-ytdlp-starring.txt --skip-download ',
      'yt-dlp --print-to-file title_sort flux-ytdlp-titlesort.txt --skip-download ',
      'yt-dlp --print-to-file season flux-ytdlp-season.txt --skip-download ',
      'yt-dlp --print-to-file section_number flux-ytdlp-secnum.txt --skip-download ',
      'yt-dlp --print-to-file isrc flux-ytdlp-isrc.txt --skip-download ',
      'yt-dlp --print-to-file track_sort flux-ytdlp-tracksort.txt --skip-download ',
      'yt-dlp --print-to-file alt_description flux-ytdlp-altdesc.txt --skip-download ',
      'yt-dlp --print-to-file view_count flux-ytdlp-viewcount.txt --skip-download '
    ] as const
  },
  {
    label: 'print-to-file extractor_key/uploader_url/thumbnail',
    lines: [
      'yt-dlp --print-to-file extractor_key flux-ytdlp-extractor-key.txt --skip-download ',
      'yt-dlp --print-to-file uploader_url flux-ytdlp-uploader-url.txt --skip-download ',
      'yt-dlp --print-to-file thumbnail flux-ytdlp-thumb-url.txt --skip-download '
    ] as const
  }
]
