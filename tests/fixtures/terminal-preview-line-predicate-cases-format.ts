import type { TerminalPreviewLinePredicate } from './terminal-preview-line-predicate-cases-types'

export const TERMINAL_PREVIEW_LINE_PREDICATE_CASES_FORMAT: readonly TerminalPreviewLinePredicate[] =
  [
    {
      label:
        'ffprobe format copyright+encoded_by + ffmpeg compand 4s ┬╖ format_tags=copyright,encoded_by',
      includes: ['format_tags=copyright,encoded_by'] as const,
      needPlaceholder: true
    },
    {
      label:
        'ffprobe format copyright+encoded_by + ffmpeg compand 4s ┬╖ -af compand=attacks=0.02:decays=0.1:points=-80/-80|-25/-25|0/-10:gain=2 + -t 4',
      includes: [
        '-af compand=attacks=0.02:decays=0.1:points=-80/-80|-25/-25|0/-10:gain=2',
        '-t 4',
        '-vn -sn'
      ] as const
    },
    {
      label: 'ffprobe album_artist + track/disc + ffmpeg dynaudnorm 4s ┬╖ format_tags=album_artist',
      includes: ['format_tags=album_artist'] as const,
      needPlaceholder: true
    },
    {
      label: 'ffprobe album_artist + track/disc + ffmpeg dynaudnorm 4s ┬╖ format_tags=track,disc',
      includes: ['format_tags=track,disc'] as const,
      needPlaceholder: true
    },
    {
      label:
        'ffprobe album_artist + track/disc + ffmpeg dynaudnorm 4s ┬╖ -af dynaudnorm=f=150:g=15 + -t 4',
      includes: ['-af dynaudnorm=f=150:g=15', '-t 4', '-vn -sn'] as const
    },
    {
      label: 'ffprobe lyrics+synopsis + ffmpeg asoftclip 4s ┬╖ format_tags=lyrics,synopsis',
      includes: ['format_tags=lyrics,synopsis'] as const,
      needPlaceholder: true
    },
    {
      label: 'ffprobe lyrics+synopsis + ffmpeg asoftclip 4s ┬╖ -af asoftclip + -t 4',
      includes: ['-af asoftclip', '-t 4', '-vn -sn'] as const
    },
    {
      label:
        'ffprobe a:0 channels+channel_layout + ffmpeg aecho 4s ┬╖ -select_streams a:0 + stream=channels,channel_layout',
      includes: ['-select_streams a:0', 'stream=channels,channel_layout'] as const,
      needPlaceholder: true
    },
    {
      label:
        'ffprobe a:0 channels+channel_layout + ffmpeg aecho 4s ┬╖ -af aecho=0.8:0.9:40:0.3 + -t 4',
      includes: ['-af aecho=0.8:0.9:40:0.3', '-t 4', '-vn -sn'] as const
    },
    {
      label:
        'ffprobe s:1 disposition + ffmpeg tremolo/bandpass 4s ┬╖ -select_streams s:1 + stream=disposition',
      includes: ['-select_streams s:1', 'stream=disposition'] as const,
      needPlaceholder: true
    },
    {
      label: 'ffprobe s:1 disposition + ffmpeg tremolo/bandpass 4s ┬╖ -af tremolo=f=6:d=0.5 + -t 4',
      includes: ['-af tremolo=f=6:d=0.5', '-t 4', '-vn -sn'] as const
    },
    {
      label:
        'ffprobe s:1 disposition + ffmpeg tremolo/bandpass 4s ┬╖ -af bandpass=f=1000:width_type=h:width=200 + -t 4',
      includes: ['-af bandpass=f=1000:width_type=h:width=200', '-t 4', '-vn -sn'] as const
    },
    {
      label:
        'ffprobe a:1 codec+channels+layout + ffmpeg highshelf 3s ┬╖ -select_streams a:1 + stream=codec_name,channels,channel_layout',
      includes: ['-select_streams a:1', 'stream=codec_name,channels,channel_layout'] as const,
      needPlaceholder: true
    },
    {
      label:
        'ffprobe a:1 codec+channels+layout + ffmpeg highshelf 3s ┬╖ -af highshelf=f=8000:width_type=o:width=2:g=-6 + -t 3',
      includes: ['-af highshelf=f=8000:width_type=o:width=2:g=-6', '-t 3', '-vn -sn'] as const
    },
    {
      label:
        'ffprobe v:1 WxH + ffmpeg apulsator 3s ┬╖ -select_streams v:1 + stream=codec_name,width,height',
      includes: ['-select_streams v:1', 'stream=codec_name,width,height'] as const,
      needPlaceholder: true
    },
    {
      label: 'ffprobe v:1 WxH + ffmpeg apulsator 3s ┬╖ -af apulsator=mode=sine:hz=1:width=2 + -t 3',
      includes: ['-af apulsator=mode=sine:hz=1:width=2', '-t 3', '-vn -sn'] as const
    },
    {
      label:
        'ffprobe d:1 codec+tag + ffmpeg chorus 4s ┬╖ -select_streams d:1 + stream=codec_name,codec_tag_string',
      includes: ['-select_streams d:1', 'stream=codec_name,codec_tag_string'] as const,
      needPlaceholder: true
    },
    {
      label: 'ffprobe d:1 codec+tag + ffmpeg chorus 4s ┬╖ -af chorus=0.5:0.9:50:0.4:0.25:2 + -t 4',
      includes: ['-af chorus=0.5:0.9:50:0.4:0.25:2', '-t 4', '-vn -sn'] as const
    },
    {
      label:
        'ffprobe format encoder+WMFSDKVersion + ffmpeg afade in 3s ┬╖ format_tags=encoder,WMFSDKVersion',
      includes: ['format_tags=encoder,WMFSDKVersion'] as const,
      needPlaceholder: true
    },
    {
      label:
        'ffprobe format encoder+WMFSDKVersion + ffmpeg afade in 3s ┬╖ -af afade=t=in:st=0:d=0.6 + -t 3',
      includes: ['-af afade=t=in:st=0:d=0.6', '-t 3', '-vn -sn'] as const
    },
    {
      label: 'ffprobe format probe_score + ffmpeg atempo 0.95 3s ┬╖ format=probe_score',
      includes: ['format=probe_score'] as const,
      needPlaceholder: true
    },
    {
      label: 'ffprobe format probe_score + ffmpeg atempo 0.95 3s ┬╖ -af atempo=0.95 + -t 3',
      includes: ['-af atempo=0.95', '-t 3', '-vn -sn'] as const
    },
    {
      label: 'ffprobe format encoding_tool + ffmpeg afade out 3s ┬╖ format_tags=encoding_tool',
      includes: ['format_tags=encoding_tool'] as const,
      needPlaceholder: true
    },
    {
      label:
        'ffprobe format encoding_tool + ffmpeg afade out 3s ┬╖ -af afade=t=out:st=1.2:d=0.6 + -t 3',
      includes: ['-af afade=t=out:st=1.2:d=0.6', '-t 3', '-vn -sn'] as const
    },
    {
      label: 'ffprobe v:1 codec long + ffmpeg alimiter 3s ┬╖ select_streams v:1 + codec_long_name',
      includes: ['select_streams v:1', 'codec_long_name'] as const,
      needPlaceholder: true
    },
    {
      label: 'ffprobe v:1 codec long + ffmpeg alimiter 3s ┬╖ -af alimiter=limit=0.8 + -t 3',
      includes: ['-af alimiter=limit=0.8', '-t 3', '-vn -sn'] as const
    },
    {
      label:
        'ffprobe format MP4 brands + ffmpeg stereotools 3s ┬╖ format_tags=major_brand,minor_version,compatible_brands',
      includes: ['format_tags=major_brand,minor_version,compatible_brands'] as const,
      needPlaceholder: true
    },
    {
      label:
        'ffprobe format MP4 brands + ffmpeg stereotools 3s ┬╖ -af stereotools=mlev=0.05:phlev=0.05 + -t 3',
      includes: ['-af stereotools=mlev=0.05:phlev=0.05', '-t 3', '-vn -sn'] as const
    },
    {
      label:
        'ffprobe gapless+compilation + ffmpeg speechnorm 4s ┬╖ format_tags=gapless_playback,compilation',
      includes: ['format_tags=gapless_playback,compilation'] as const,
      needPlaceholder: true
    },
    {
      label:
        'ffprobe gapless+compilation + ffmpeg speechnorm 4s ┬╖ -af speechnorm=peak=0.25 + -t 4',
      includes: ['-af speechnorm=peak=0.25', '-t 4', '-vn -sn'] as const
    },
    {
      label: 'ffprobe format BPM+key + ffmpeg bs2b 4s ┬╖ format_tags=BPM,initial_key',
      includes: ['format_tags=BPM,initial_key'] as const,
      needPlaceholder: true
    },
    {
      label: 'ffprobe format BPM+key + ffmpeg bs2b 4s ┬╖ -af bs2b=profile=j2 + -t 4',
      includes: ['-af bs2b=profile=j2', '-t 4', '-vn -sn'] as const
    },
    {
      label: 'ffprobe format artist+album + ffmpeg bass 4s ┬╖ format_tags=artist,album',
      includes: ['format_tags=artist,album'] as const,
      needPlaceholder: true
    },
    {
      label: 'ffprobe format artist+album + ffmpeg bass 4s ┬╖ -af bass=g=2:f=120 + -t 4',
      includes: ['-af bass=g=2:f=120', '-t 4', '-vn -sn'] as const
    },
    {
      label:
        'ffprobe s:0 index+codec + ffmpeg superequalizer 4s ┬╖ select_streams s:0 + stream=index,codec_name',
      includes: ['select_streams s:0', 'stream=index,codec_name'] as const,
      needPlaceholder: true
    },
    {
      label: 'ffprobe s:0 index+codec + ffmpeg superequalizer 4s ┬╖ -af superequalizer=3b=4 + -t 4',
      includes: ['-af superequalizer=3b=4', '-t 4', '-vn -sn'] as const
    },
    {
      label: 'ffprobe format show+epsort + ffmpeg lowshelf 4s ┬╖ format_tags=show,episode_sort',
      includes: ['format_tags=show,episode_sort'] as const,
      needPlaceholder: true
    },
    {
      label: 'ffprobe format show+epsort + ffmpeg lowshelf 4s ┬╖ -af lowshelf=g=2:f=200 + -t 4',
      includes: ['-af lowshelf=g=2:f=200', '-t 4', '-vn -sn'] as const
    },
    {
      label: 'ffprobe format genre+date + ffmpeg extrastereo 4s ┬╖ format_tags=genre,date',
      includes: ['format_tags=genre,date'] as const,
      needPlaceholder: true
    },
    {
      label: 'ffprobe format genre+date + ffmpeg extrastereo 4s ┬╖ -af extrastereo=m=1.2 + -t 4',
      includes: ['-af extrastereo=m=1.2', '-t 4', '-vn -sn'] as const
    },
    {
      label:
        'ffprobe format cat+barcode + ffmpeg aresample async 4s ┬╖ format_tags=podcast,podcasturl',
      includes: ['format_tags=podcast,podcasturl'] as const,
      needPlaceholder: true
    },
    {
      label:
        'ffprobe format cat+barcode + ffmpeg aresample async 4s ┬╖ -af acrusher=level_in=0.8:level_out=0.8:bits=8:mode=log + -t 4',
      includes: [
        '-af acrusher=level_in=0.8:level_out=0.8:bits=8:mode=log',
        '-t 4',
        '-vn -sn'
      ] as const
    },
    {
      label:
        'ffprobe d:2 codec + ffmpeg pan stereo 4s ┬╖ -select_streams d:2 + stream=codec_name,codec_tag_string',
      includes: ['-select_streams d:2', 'stream=codec_name,codec_tag_string'] as const,
      needPlaceholder: true
    },
    {
      label:
        'ffprobe d:2 codec + ffmpeg pan stereo 4s ┬╖ -af pan=stereo|c0=0.6*c0+0.4*c1|c1=0.4*c0+0.6*c1 + -t 4',
      includes: ['-af pan=stereo|c0=0.6*c0+0.4*c1|c1=0.4*c0+0.6*c1', '-t 4', '-vn -sn'] as const
    },
    {
      label:
        'ffprobe a:4 + s:4 + ffmpeg acompressor 4s ┬╖ -select_streams a:4 + stream=codec_name,sample_rate,channels',
      includes: ['-select_streams a:4', 'stream=codec_name,sample_rate,channels'] as const,
      needPlaceholder: true
    },
    {
      label:
        'ffprobe a:4 + s:4 + ffmpeg acompressor 4s ┬╖ -select_streams s:4 + stream=codec_name,codec_tag_string',
      includes: ['-select_streams s:4', 'stream=codec_name,codec_tag_string'] as const,
      needPlaceholder: true
    },
    {
      label:
        'ffprobe a:4 + s:4 + ffmpeg acompressor 4s ┬╖ -af acompressor=threshold=0.08:ratio=3:attack=5:release=50 + -t 4',
      includes: [
        '-af acompressor=threshold=0.08:ratio=3:attack=5:release=50',
        '-t 4',
        '-vn -sn'
      ] as const
    },
    {
      label:
        'ffprobe v:2 WxH+fps + ffmpeg acontrast 3s ┬╖ -select_streams v:2 + stream=width,height,r_frame_rate',
      includes: ['-select_streams v:2', 'stream=width,height,r_frame_rate'] as const,
      needPlaceholder: true
    },
    {
      label: 'ffprobe v:2 WxH+fps + ffmpeg acontrast 3s ┬╖ -af acontrast=25 + -t 3',
      includes: ['-af acontrast=25', '-t 3', '-vn -sn'] as const
    }
  ]
