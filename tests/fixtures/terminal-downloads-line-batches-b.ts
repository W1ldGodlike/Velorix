import type { TerminalDownloadsLineBatch } from './terminal-downloads-line-batches-types'

export const TERMINAL_DOWNLOADS_LINE_BATCHES_B: readonly TerminalDownloadsLineBatch[] = [
  {
    label:
      'console-title / no-external-downloader / clean-infojson / no-write-info-json / ext-downloader-args / flat urls / progress-template / sleep-subtitles / sub-format best / geo NL',
    lines: [
      'yt-dlp --console-title -F ',
      'yt-dlp --no-external-downloader -F ',
      'yt-dlp --clean-infojson ',
      'yt-dlp --no-write-info-json -F ',
      'yt-dlp --external-downloader-args ffmpeg_i:-nostdin -F ',
      'yt-dlp --flat-playlist --print urls --skip-download ',
      'yt-dlp --progress-template predownload:Preparing %(info.title)s -F ',
      'yt-dlp --sleep-subtitles 5 -F ',
      'yt-dlp --sub-format best -F ',
      'yt-dlp --geo-bypass-country NL -F '
    ] as const
  },
  {
    label:
      'force-keyframes / no-hls-use-mpegts / compat no-direct-merge / geo ES–SE / no-embed-meta / playlist range / merge webm / ignore-no-formats / no-write-thumb / extract aac / no-embed-thumb',
    lines: [
      'yt-dlp --force-keyframes-at-cuts ',
      'yt-dlp --no-hls-use-mpegts -F ',
      'yt-dlp --compat-options no-direct-merge -F ',
      'yt-dlp --geo-bypass-country ES -F ',
      'yt-dlp --geo-bypass-country PL -F ',
      'yt-dlp --geo-bypass-country SE -F ',
      'yt-dlp --no-embed-metadata ',
      'yt-dlp --playlist-items 1:10 -F ',
      'yt-dlp --merge-output-format webm ',
      'yt-dlp --ignore-no-formats-error -F ',
      'yt-dlp --no-write-thumbnail -F ',
      'yt-dlp --extract-audio --audio-format aac ',
      'yt-dlp --no-embed-thumbnail '
    ] as const
  },
  {
    label:
      'print-to-file / file-urls / source-address / annotations / storyboards / sponsorblock chapter / concat-playlist / fixup / use-extractors / default-search',
    lines: [
      'yt-dlp --print-to-file title flux-ytdlp-title.txt --skip-download ',
      'yt-dlp --enable-file-urls -F ',
      'yt-dlp --source-address 198.51.100.2 -F ',
      'yt-dlp --skip-download --print annotations ',
      'yt-dlp --skip-download --print storyboards ',
      'yt-dlp --sponsorblock-mark all --sponsorblock-chapter-title %(category)s ',
      'yt-dlp --concat-playlist never -F ',
      'yt-dlp --fixup warn -F ',
      'yt-dlp --use-extractors youtube -F ',
      'yt-dlp --default-search auto: -F '
    ] as const
  },
  {
    label: 'ap-password / client-cert / geo-verification-proxy / geo AT..IE',
    lines: [
      'yt-dlp --ap-password PASSWORD ',
      'yt-dlp --client-certificate client.pem ',
      'yt-dlp --geo-verification-proxy http://127.0.0.1:8888 -F ',
      'yt-dlp --geo-bypass-country AT -F ',
      'yt-dlp --geo-bypass-country DK -F ',
      'yt-dlp --geo-bypass-country FI -F ',
      'yt-dlp --geo-bypass-country GR -F ',
      'yt-dlp --geo-bypass-country PT -F ',
      'yt-dlp --geo-bypass-country BE -F ',
      'yt-dlp --geo-bypass-country IE -F '
    ] as const
  },
  {
    label: 'client-cert-key / impersonate firefox+edge / geo CZ..IS / convert-thumbnails png',
    lines: [
      'yt-dlp --client-certificate-key key.pem ',
      'yt-dlp --impersonate firefox -F ',
      'yt-dlp --impersonate edge -F ',
      'yt-dlp --geo-bypass-country CZ -F ',
      'yt-dlp --geo-bypass-country HU -F ',
      'yt-dlp --geo-bypass-country RO -F ',
      'yt-dlp --geo-bypass-country BG -F ',
      'yt-dlp --geo-bypass-country HR -F ',
      'yt-dlp --geo-bypass-country LV -F ',
      'yt-dlp --geo-bypass-country LT -F ',
      'yt-dlp --geo-bypass-country EE -F ',
      'yt-dlp --geo-bypass-country IS -F ',
      'yt-dlp --convert-thumbnails png '
    ] as const
  },
  {
    label: 'audio formats (opus/flac/wav/m4a) / no-mark-watched / no-write-* / geo MY..UA',
    lines: [
      'yt-dlp --extract-audio --audio-format opus ',
      'yt-dlp --extract-audio --audio-format flac ',
      'yt-dlp --extract-audio --audio-format wav ',
      'yt-dlp --extract-audio --audio-format m4a ',
      'yt-dlp --no-mark-watched -F ',
      'yt-dlp --no-write-comments -F ',
      'yt-dlp --no-write-description -F ',
      'yt-dlp --geo-bypass-country MY -F ',
      'yt-dlp --geo-bypass-country SG -F ',
      'yt-dlp --geo-bypass-country TH -F ',
      'yt-dlp --geo-bypass-country VN -F ',
      'yt-dlp --geo-bypass-country AR -F ',
      'yt-dlp --geo-bypass-country UA -F '
    ] as const
  },
  {
    label: 'geo PH..NG / extractor-args generic:noplaylist / retries+frag+skip-pl-err',
    lines: [
      'yt-dlp --geo-bypass-country PH -F ',
      'yt-dlp --geo-bypass-country ID -F ',
      'yt-dlp --geo-bypass-country PK -F ',
      'yt-dlp --geo-bypass-country BD -F ',
      'yt-dlp --geo-bypass-country EG -F ',
      'yt-dlp --geo-bypass-country CL -F ',
      'yt-dlp --geo-bypass-country PE -F ',
      'yt-dlp --geo-bypass-country KE -F ',
      'yt-dlp --geo-bypass-country CO -F ',
      'yt-dlp --geo-bypass-country NG -F ',
      'yt-dlp --extractor-args generic:noplaylist -F ',
      'yt-dlp --skip-playlist-after-errors 10 -F ',
      'yt-dlp --retries 15 -F ',
      'yt-dlp --fragment-retries 15 -F '
    ] as const
  },
  {
    label: 'bidi-workaround / daterange / playlist-start 2 / geo SK..RS',
    lines: [
      'yt-dlp --bidi-workaround -F ',
      'yt-dlp --daterange 20000101-20991231 -F ',
      'yt-dlp --playlist-start 2 -F ',
      'yt-dlp --geo-bypass-country SK -F ',
      'yt-dlp --geo-bypass-country SI -F ',
      'yt-dlp --geo-bypass-country LU -F ',
      'yt-dlp --geo-bypass-country MT -F ',
      'yt-dlp --geo-bypass-country CY -F ',
      'yt-dlp --geo-bypass-country BA -F ',
      'yt-dlp --geo-bypass-country RS -F '
    ] as const
  },
  {
    label: 'geo MN..PA / downloader ffmpeg|aria2c / no-wait / verbose -F',
    lines: [
      'yt-dlp --geo-bypass-country MN -F ',
      'yt-dlp --geo-bypass-country KZ -F ',
      'yt-dlp --geo-bypass-country GE -F ',
      'yt-dlp --geo-bypass-country AM -F ',
      'yt-dlp --geo-bypass-country AZ -F ',
      'yt-dlp --geo-bypass-country IQ -F ',
      'yt-dlp --geo-bypass-country LK -F ',
      'yt-dlp --geo-bypass-country TN -F ',
      'yt-dlp --geo-bypass-country MA -F ',
      'yt-dlp --geo-bypass-country DZ -F ',
      'yt-dlp --geo-bypass-country GH -F ',
      'yt-dlp --geo-bypass-country ET -F ',
      'yt-dlp --geo-bypass-country UY -F ',
      'yt-dlp --geo-bypass-country BO -F ',
      'yt-dlp --geo-bypass-country CR -F ',
      'yt-dlp --geo-bypass-country PA -F ',
      'yt-dlp --downloader ffmpeg -F ',
      'yt-dlp --downloader aria2c -F ',
      'yt-dlp --no-wait-for-video -F ',
      'yt-dlp --verbose -F '
    ] as const
  },
  {
    label:
      'trim-filenames / hls-split-discontinuity / dynamic-mpd-buffer / no-write-pages / socket 120',
    lines: [
      'yt-dlp --trim-filenames 180 -F ',
      'yt-dlp --hls-split-discontinuity -F ',
      'yt-dlp --dynamic-mpd-buffer-size 100 -F ',
      'yt-dlp --no-write-pages -F ',
      'yt-dlp --socket-timeout 120 -F '
    ] as const
  },
  {
    label: '-S sort / hide-progress / playlist slice / print genres+cast / --ppa',
    lines: [
      'yt-dlp -S +res:1080,+codec:av01 -F ',
      'yt-dlp -S +br:5000000,+res:720 -F ',
      'yt-dlp --hide-progress -F ',
      'yt-dlp --playlist-items -1 -F ',
      'yt-dlp --playlist-items 2:4 -F ',
      'yt-dlp --skip-download --print genres ',
      'yt-dlp --skip-download --print cast ',
      'yt-dlp --ppa FFmpeg:-threads:1 -F '
    ] as const
  },
  {
    label: 'yes-playlist -F + geo microstates AD..GL',
    lines: [
      'yt-dlp --yes-playlist -F ',
      'yt-dlp --geo-bypass-country AD -F ',
      'yt-dlp --geo-bypass-country MC -F ',
      'yt-dlp --geo-bypass-country LI -F ',
      'yt-dlp --geo-bypass-country SM -F ',
      'yt-dlp --geo-bypass-country VA -F ',
      'yt-dlp --geo-bypass-country GI -F ',
      'yt-dlp --geo-bypass-country JE -F ',
      'yt-dlp --geo-bypass-country GG -F ',
      'yt-dlp --geo-bypass-country IM -F ',
      'yt-dlp --geo-bypass-country FO -F ',
      'yt-dlp --geo-bypass-country GL -F '
    ] as const
  },
  {
    label:
      'check-all-urls / no-windows-filenames / replace-meta / no-playlist simulate / dislike / flat+duration',
    lines: [
      'yt-dlp --check-all-urls -F ',
      'yt-dlp --no-windows-filenames -F ',
      'yt-dlp --replace-in-metadata title,_,- -F ',
      'yt-dlp --no-playlist --simulate ',
      'yt-dlp --skip-download --print dislike_count ',
      'yt-dlp --flat-playlist --skip-download --print duration '
    ] as const
  },
  {
    label: 'list-extractor-descriptions / print-traffic / vorbis / print-to-file id',
    lines: [
      'yt-dlp --list-extractor-descriptions',
      'yt-dlp --print-traffic -F ',
      'yt-dlp --extract-audio --audio-format vorbis ',
      'yt-dlp --print-to-file id flux-ytdlp-id.txt --skip-download '
    ] as const
  },
  {
    label:
      'no-update / no-color / color always / allow-unplayable / audio alac+ac3+q0 / ppa threads / geo TW+MD',
    lines: [
      'yt-dlp --no-update -F ',
      'yt-dlp --no-color -F ',
      'yt-dlp --color always -F ',
      'yt-dlp --allow-unplayable-formats -F ',
      'yt-dlp --extract-audio --audio-format alac ',
      'yt-dlp --extract-audio --audio-format ac3 ',
      'yt-dlp --audio-quality 0 --extract-audio ',
      'yt-dlp --postprocessor-args ffmpeg:-threads 1 -F ',
      'yt-dlp --geo-bypass-country TW -F ',
      'yt-dlp --geo-bypass-country MD -F '
    ] as const
  },
  {
    label: 'print-to-file pageurl+durstr+uploader+churl + geo BY+AL+MK',
    lines: [
      'yt-dlp --print-to-file webpage_url flux-ytdlp-pageurl.txt --skip-download ',
      'yt-dlp --print-to-file duration_string flux-ytdlp-durstr.txt --skip-download ',
      'yt-dlp --print-to-file uploader flux-ytdlp-uploader.txt --skip-download ',
      'yt-dlp --print-to-file channel_url flux-ytdlp-churl.txt --skip-download ',
      'yt-dlp --geo-bypass-country BY -F ',
      'yt-dlp --geo-bypass-country AL -F ',
      'yt-dlp --geo-bypass-country MK -F '
    ] as const
  },
  {
    label: 'print-to-file views+channel+extractor+pltitle+uploaddate + geo ME+PS+TL + wma',
    lines: [
      'yt-dlp --print-to-file view_count flux-ytdlp-views.txt --skip-download ',
      'yt-dlp --print-to-file channel flux-ytdlp-channel.txt --skip-download ',
      'yt-dlp --print-to-file extractor flux-ytdlp-extractor.txt --skip-download ',
      'yt-dlp --print-to-file playlist_title flux-ytdlp-pltitle.txt --skip-download ',
      'yt-dlp --print-to-file upload_date flux-ytdlp-update.txt --skip-download ',
      'yt-dlp --geo-bypass-country ME -F ',
      'yt-dlp --geo-bypass-country PS -F ',
      'yt-dlp --geo-bypass-country TL -F ',
      'yt-dlp --extract-audio --audio-format wma '
    ] as const
  },
  {
    label:
      'no-abort-on-error + no-restrict-filenames + geo PR GU VI AS MP UM + print-to-file desc+fn',
    lines: [
      'yt-dlp --no-abort-on-error -F ',
      'yt-dlp --no-restrict-filenames -F ',
      'yt-dlp --geo-bypass-country PR -F ',
      'yt-dlp --geo-bypass-country GU -F ',
      'yt-dlp --geo-bypass-country VI -F ',
      'yt-dlp --geo-bypass-country AS -F ',
      'yt-dlp --geo-bypass-country MP -F ',
      'yt-dlp --geo-bypass-country UM -F ',
      'yt-dlp --print-to-file description flux-ytdlp-desc.txt --skip-download ',
      'yt-dlp --print-to-file filename flux-ytdlp-fn.txt --skip-download '
    ] as const
  },
  {
    label: 'no-prefer-free + print-to-file categories/tags/language/autocap/chapters/acodec/vcodec',
    lines: [
      'yt-dlp --no-prefer-free-formats -F ',
      'yt-dlp --print-to-file categories flux-ytdlp-categories.txt --skip-download ',
      'yt-dlp --print-to-file tags flux-ytdlp-tags.txt --skip-download ',
      'yt-dlp --print-to-file language flux-ytdlp-language.txt --skip-download ',
      'yt-dlp --print-to-file automatic_captions flux-ytdlp-autocap.txt --skip-download ',
      'yt-dlp --print-to-file chapters flux-ytdlp-chapters.txt --skip-download ',
      'yt-dlp --print-to-file acodec flux-ytdlp-acodec.txt --skip-download ',
      'yt-dlp --print-to-file vcodec flux-ytdlp-vcodec.txt --skip-download '
    ] as const
  },
  {
    label: 'print-to-file likes+duration+subs+chid+plid+heatmap + lazy-pl + no-continue -F',
    lines: [
      'yt-dlp --print-to-file like_count flux-ytdlp-likes.txt --skip-download ',
      'yt-dlp --print-to-file duration flux-ytdlp-duration.txt --skip-download ',
      'yt-dlp --print-to-file subtitles flux-ytdlp-subs.txt --skip-download ',
      'yt-dlp --print-to-file channel_id flux-ytdlp-chid.txt --skip-download ',
      'yt-dlp --print-to-file playlist_id flux-ytdlp-plid.txt --skip-download ',
      'yt-dlp --print-to-file heatmap flux-ytdlp-heatmap.txt --skip-download ',
      'yt-dlp --lazy-playlist -F ',
      'yt-dlp --no-continue -F '
    ] as const
  }
]
