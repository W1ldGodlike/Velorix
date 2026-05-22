import type { TerminalDownloadsLineBatch } from './terminal-downloads-line-batches-types'

export const TERMINAL_DOWNLOADS_LINE_BATCHES_C: readonly TerminalDownloadsLineBatch[] = [
  {
    label: 'no-playlist-reverse + print-to-file extra fields + geo BM/KY/JM/BB/BS -F',
    lines: [
      'yt-dlp --no-playlist-reverse -F ',
      'yt-dlp --print-to-file comment_count velorix-ytdlp-ccount.txt --skip-download ',
      'yt-dlp --print-to-file webpage_url_basename velorix-ytdlp-wubase.txt --skip-download ',
      'yt-dlp --print-to-file display_id velorix-ytdlp-dispid.txt --skip-download ',
      'yt-dlp --print-to-file thumbnail velorix-ytdlp-thumburl.txt --skip-download ',
      'yt-dlp --print-to-file release_timestamp velorix-ytdlp-reltsepoch.txt --skip-download ',
      'yt-dlp --print-to-file filepath velorix-ytdlp-fpath.txt --skip-download ',
      'yt-dlp --print-to-file resolution velorix-ytdlp-res.txt --skip-download ',
      'yt-dlp --print-to-file format_id velorix-ytdlp-fmtid.txt --skip-download ',
      'yt-dlp --print-to-file ext velorix-ytdlp-ext.txt --skip-download ',
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
      'yt-dlp --print-to-file width velorix-ytdlp-width.txt --skip-download ',
      'yt-dlp --print-to-file height velorix-ytdlp-height.txt --skip-download ',
      'yt-dlp --print-to-file fps velorix-ytdlp-fps.txt --skip-download ',
      'yt-dlp --print-to-file tbr velorix-ytdlp-tbr.txt --skip-download ',
      'yt-dlp --print-to-file filesize_approx velorix-ytdlp-fsize.txt --skip-download ',
      'yt-dlp --print-to-file protocol velorix-ytdlp-proto.txt --skip-download ',
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
      'yt-dlp --print-to-file playlist_index velorix-ytdlp-plidx.txt --skip-download ',
      'yt-dlp --print-to-file playlist_autonumber velorix-ytdlp-plauto.txt --skip-download ',
      'yt-dlp --print-to-file playlist_count velorix-ytdlp-plcount.txt --skip-download ',
      'yt-dlp --print-to-file playlist_uploader_id velorix-ytdlp-plupid.txt --skip-download ',
      'yt-dlp --print-to-file uploader_id velorix-ytdlp-upid.txt --skip-download ',
      'yt-dlp --print-to-file average_rating velorix-ytdlp-rating.txt --skip-download ',
      'yt-dlp --print-to-file availability velorix-ytdlp-avail.txt --skip-download ',
      'yt-dlp --print-to-file age_limit velorix-ytdlp-age.txt --skip-download ',
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
      'yt-dlp --print-to-file webpage_url_domain velorix-ytdlp-wudom.txt --skip-download ',
      'yt-dlp --print-to-file original_url velorix-ytdlp-ourl.txt --skip-download ',
      'yt-dlp --print-to-file abr velorix-ytdlp-abr.txt --skip-download ',
      'yt-dlp --print-to-file vbr velorix-ytdlp-vbr.txt --skip-download ',
      'yt-dlp --print-to-file filesize velorix-ytdlp-fszb.txt --skip-download ',
      'yt-dlp --print-to-file format_note velorix-ytdlp-fnote.txt --skip-download ',
      'yt-dlp --print-to-file playlist_uploader velorix-ytdlp-plup.txt --skip-download ',
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
      'yt-dlp --print-to-file fulltitle velorix-ytdlp-fulltitle.txt --skip-download ',
      'yt-dlp --print-to-file alt_title velorix-ytdlp-alttitle.txt --skip-download ',
      'yt-dlp --print-to-file artist velorix-ytdlp-artist.txt --skip-download ',
      'yt-dlp --print-to-file album velorix-ytdlp-album.txt --skip-download ',
      'yt-dlp --print-to-file release_year velorix-ytdlp-relyear.txt --skip-download ',
      'yt-dlp --print-to-file is_live velorix-ytdlp-islive.txt --skip-download ',
      'yt-dlp --print-to-file live_status velorix-ytdlp-livestat.txt --skip-download ',
      'yt-dlp --print-to-file channel_follower_count velorix-ytdlp-chfol.txt --skip-download ',
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
      'yt-dlp --print-to-file series velorix-ytdlp-series.txt --skip-download ',
      'yt-dlp --print-to-file season_number velorix-ytdlp-snum.txt --skip-download ',
      'yt-dlp --print-to-file episode_number velorix-ytdlp-epnum.txt --skip-download ',
      'yt-dlp --print-to-file episode velorix-ytdlp-epstr.txt --skip-download ',
      'yt-dlp --print-to-file episode_id velorix-ytdlp-epid.txt --skip-download ',
      'yt-dlp --print-to-file season_id velorix-ytdlp-sid.txt --skip-download ',
      'yt-dlp --print-to-file playlist_channel_id velorix-ytdlp-plchid.txt --skip-download ',
      'yt-dlp --print-to-file asr velorix-ytdlp-asr.txt --skip-download ',
      'yt-dlp --print-to-file has_drm velorix-ytdlp-drm.txt --skip-download ',
      'yt-dlp --print-to-file playable_in_embed velorix-ytdlp-embed.txt --skip-download ',
      'yt-dlp --print-to-file was_live velorix-ytdlp-waslive.txt --skip-download ',
      'yt-dlp --print-to-file media_type velorix-ytdlp-mtype.txt --skip-download ',
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
      'yt-dlp --print-to-file formats velorix-ytdlp-formats.txt --skip-download ',
      'yt-dlp --print-to-file url velorix-ytdlp-url.txt --skip-download ',
      'yt-dlp --print-to-file thumbnails velorix-ytdlp-thumbs.txt --skip-download ',
      'yt-dlp --print-to-file location velorix-ytdlp-locmeta.txt --skip-download ',
      'yt-dlp --geo-bypass-country AX -F ',
      'yt-dlp --geo-bypass-country SJ -F ',
      'yt-dlp --geo-bypass-country SH -F ',
      'yt-dlp --xattr-set-filesize -F '
    ] as const
  },
  {
    label: 'print-to-file epoch/reqsubs/plch/nent/dislikes + no-pl-metafiles + geo BV/TF/HM -F',
    lines: [
      'yt-dlp --print-to-file epoch velorix-ytdlp-epoch.txt --skip-download ',
      'yt-dlp --print-to-file requested_subtitles velorix-ytdlp-reqsubs.txt --skip-download ',
      'yt-dlp --print-to-file playlist_channel velorix-ytdlp-plch.txt --skip-download ',
      'yt-dlp --print-to-file n_entries velorix-ytdlp-nent.txt --skip-download ',
      'yt-dlp --print-to-file dislike_count velorix-ytdlp-dislikes.txt --skip-download ',
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
      'yt-dlp --print-to-file release_date velorix-ytdlp-reldate.txt --skip-download ',
      'yt-dlp --print-to-file modified_timestamp velorix-ytdlp-mts.txt --skip-download ',
      'yt-dlp --print-to-file upload_timestamp velorix-ytdlp-upts.txt --skip-download ',
      'yt-dlp --print-to-file aspect_ratio velorix-ytdlp-aspect.txt --skip-download ',
      'yt-dlp --print-to-file episode_sort velorix-ytdlp-epsort.txt --skip-download '
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
      'yt-dlp --print-to-file genre velorix-ytdlp-genre.txt --skip-download ',
      'yt-dlp --print-to-file album_type velorix-ytdlp-albumtype.txt --skip-download ',
      'yt-dlp --print-to-file license velorix-ytdlp-license.txt --skip-download ',
      'yt-dlp --print-to-file track velorix-ytdlp-track.txt --skip-download ',
      'yt-dlp --print-to-file album_artist velorix-ytdlp-albumartist.txt --skip-download ',
      'yt-dlp --print-to-file comment velorix-ytdlp-comment.txt --skip-download '
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
      'yt-dlp --print-to-file lyrics velorix-ytdlp-lyrics.txt --skip-download ',
      'yt-dlp --print-to-file disc_number velorix-ytdlp-discnum.txt --skip-download ',
      'yt-dlp --print-to-file publisher velorix-ytdlp-publisher.txt --skip-download ',
      'yt-dlp --print-to-file mood velorix-ytdlp-mood.txt --skip-download '
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
      'yt-dlp --print-to-file artist_sort velorix-ytdlp-artistsort.txt --skip-download ',
      'yt-dlp --print-to-file album_sort velorix-ytdlp-albumsort.txt --skip-download ',
      'yt-dlp --print-to-file conductor velorix-ytdlp-conductor.txt --skip-download ',
      'yt-dlp --print-to-file performers velorix-ytdlp-performers.txt --skip-download ',
      'yt-dlp --print-to-file copyright velorix-ytdlp-copy.txt --skip-download ',
      'yt-dlp --print-to-file uploader_url velorix-ytdlp-upurl.txt --skip-download ',
      'yt-dlp --print-to-file producer velorix-ytdlp-producer.txt --skip-download ',
      'yt-dlp --print-to-file director velorix-ytdlp-director.txt --skip-download '
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
      'yt-dlp --print-to-file arranger velorix-ytdlp-arranger.txt --skip-download ',
      'yt-dlp --print-to-file remixer velorix-ytdlp-remixer.txt --skip-download ',
      'yt-dlp --print-to-file engineer velorix-ytdlp-engineer.txt --skip-download ',
      'yt-dlp --print-to-file lyricist velorix-ytdlp-lyricist.txt --skip-download ',
      'yt-dlp --print-to-file grouping velorix-ytdlp-grouping.txt --skip-download ',
      'yt-dlp --print-to-file compilation velorix-ytdlp-compilation.txt --skip-download ',
      'yt-dlp --print-to-file show velorix-ytdlp-show.txt --skip-download '
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
      'yt-dlp --print-to-file album_artists velorix-ytdlp-albumartists.txt --skip-download ',
      'yt-dlp --print-to-file cast velorix-ytdlp-cast.txt --skip-download ',
      'yt-dlp --print-to-file network velorix-ytdlp-network.txt --skip-download '
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
      'yt-dlp --print-to-file webpage_url_scheme velorix-ytdlp-wuscheme.txt --skip-download '
    ] as const
  },
  {
    label:
      'print-to-file playlist/annotations/storyboards/plwpurl + retries/fragment-retries 20 -F',
    lines: [
      'yt-dlp --print-to-file playlist velorix-ytdlp-playlist.txt --skip-download ',
      'yt-dlp --print-to-file annotations velorix-ytdlp-annotations.txt --skip-download ',
      'yt-dlp --print-to-file storyboards velorix-ytdlp-storyboards.txt --skip-download ',
      'yt-dlp --print-to-file playlist_webpage_url velorix-ytdlp-plwpurl.txt --skip-download '
    ] as const
  },
  {
    label:
      'print-to-file audio_ext/video_ext/player_url + concurrent-fragments 4 -F + geo RE/MU/SC -F',
    lines: [
      'yt-dlp --print-to-file audio_ext velorix-ytdlp-audext.txt --skip-download ',
      'yt-dlp --print-to-file video_ext velorix-ytdlp-vidext.txt --skip-download ',
      'yt-dlp --print-to-file player_url velorix-ytdlp-playerurl.txt --skip-download ',
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
      'yt-dlp --print-to-file keywords velorix-ytdlp-keywords.txt --skip-download ',
      'yt-dlp --print-to-file playlist_channel_url velorix-ytdlp-plchurl.txt --skip-download ',
      'yt-dlp --print-to-file starring velorix-ytdlp-starring.txt --skip-download ',
      'yt-dlp --print-to-file title_sort velorix-ytdlp-titlesort.txt --skip-download ',
      'yt-dlp --print-to-file season velorix-ytdlp-season.txt --skip-download ',
      'yt-dlp --print-to-file section_number velorix-ytdlp-secnum.txt --skip-download ',
      'yt-dlp --print-to-file isrc velorix-ytdlp-isrc.txt --skip-download ',
      'yt-dlp --print-to-file track_sort velorix-ytdlp-tracksort.txt --skip-download ',
      'yt-dlp --print-to-file alt_description velorix-ytdlp-altdesc.txt --skip-download ',
      'yt-dlp --print-to-file view_count velorix-ytdlp-viewcount.txt --skip-download '
    ] as const
  },
  {
    label: 'print-to-file extractor_key/uploader_url/thumbnail',
    lines: [
      'yt-dlp --print-to-file extractor_key velorix-ytdlp-extractor-key.txt --skip-download ',
      'yt-dlp --print-to-file uploader_url velorix-ytdlp-uploader-url.txt --skip-download ',
      'yt-dlp --print-to-file thumbnail velorix-ytdlp-thumb-url.txt --skip-download '
    ] as const
  }
]
