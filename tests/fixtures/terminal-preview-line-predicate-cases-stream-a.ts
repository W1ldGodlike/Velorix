import type { TerminalPreviewLinePredicate } from './terminal-preview-line-predicate-cases-types'

export const TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM_A: readonly TerminalPreviewLinePredicate[] =
  [
    {
      label:
        'a:0 bits_per_raw_sample, v:0 index+codec_name ┬╖ select_streams v:0 + stream=index,codec_name',
      includes: ['select_streams v:0', 'stream=index,codec_name', 'default=nw=1:nk=1'] as const
    },
    {
      label: 'v:0 profile+level, s:2 disposition ┬╖ select_streams v:0 + stream=profile,level',
      includes: ['select_streams v:0', 'stream=profile,level', 'default=nw=1:nk=1'] as const
    },
    {
      label: 'v:0 profile+level, s:2 disposition ┬╖ select_streams s:2 + stream=disposition',
      includes: ['select_streams s:2', 'stream=disposition', 'default=nw=1:nk=1'] as const
    },
    {
      label:
        'a:2 disposition, v:1 profile+level, s:1 stream duration, map v:0 copy ┬╖ select_streams a:2 + stream=disposition',
      includes: ['select_streams a:2', 'stream=disposition', 'default=nw=1:nk=1'] as const
    },
    {
      label:
        'a:2 disposition, v:1 profile+level, s:1 stream duration, map v:0 copy ┬╖ select_streams v:1 + stream=profile,level',
      includes: ['select_streams v:1', 'stream=profile,level', 'default=nw=1:nk=1'] as const
    },
    {
      label:
        'a:2 disposition, v:1 profile+level, s:1 stream duration, map v:0 copy ┬╖ select_streams s:1 + stream=start_time,duration',
      includes: ['select_streams s:1', 'stream=start_time,duration', 'default=nw=1:nk=1'] as const
    },
    {
      label:
        'a:2 disposition, v:1 profile+level, s:1 stream duration, map v:0 copy ┬╖ -map 0:v:0 -c:v copy + -an -sn -f null -',
      includes: ['-map 0:v:0 -c:v copy', '-an -sn -f null -'] as const
    },
    {
      label:
        's:0 time_base+start_pts, volumedetect ┬╖ select_streams s:0 + stream=time_base,start_pts',
      includes: ['select_streams s:0', 'stream=time_base,start_pts', 'default=nw=1:nk=1'] as const
    },
    {
      label: 's:0 time_base+start_pts, volumedetect ┬╖ -af volumedetect + -vn -sn',
      includes: ['-af volumedetect', '-vn -sn', '-t 10'] as const
    },
    {
      label: 'format genre+date, silencedetect ┬╖ format_tags=genre,date + default=nw=1:nk=1',
      includes: ['format_tags=genre,date', 'default=nw=1:nk=1'] as const
    },
    {
      label: 'format genre+date, silencedetect ┬╖ -af silencedetect=noise=-50dB:d=0.3 + -vn -sn',
      includes: ['-af silencedetect=noise=-50dB:d=0.3', '-vn -sn'] as const
    },
    {
      label: 'v:0 disposition, a:1 bit_rate, astats ┬╖ select_streams v:0 + stream=disposition',
      includes: ['select_streams v:0', 'stream=disposition', 'default=nw=1:nk=1'] as const
    },
    {
      label: 'v:0 disposition, a:1 bit_rate, astats ┬╖ select_streams a:1 + stream=bit_rate',
      includes: ['select_streams a:1', 'stream=bit_rate', 'default=nw=1:nk=1'] as const
    },
    {
      label: 'v:0 disposition, a:1 bit_rate, astats ┬╖ -af astats=metadata=1:reset=1 + -t 5',
      includes: ['-af astats=metadata=1:reset=1', '-t 5', '-vn -sn'] as const
    },
    {
      label: 'a:0 stream_tags encoder, ebur128 ┬╖ select_streams a:0 + stream_tags=encoder',
      includes: ['select_streams a:0', 'stream_tags=encoder', 'default=nw=1:nk=1'] as const
    },
    {
      label: 'a:0 stream_tags encoder, ebur128 ┬╖ -af ebur128=framelog=verbose + -t 12',
      includes: ['-af ebur128=framelog=verbose', '-t 12', '-vn -sn'] as const
    },
    {
      label: 'a:0/s:0 codec_long_name + aphasemeter ┬╖ select_streams a:0 + stream=codec_long_name',
      includes: ['select_streams a:0', 'stream=codec_long_name', 'default=nw=1:nk=1'] as const
    },
    {
      label: 'a:0/s:0 codec_long_name + aphasemeter ┬╖ select_streams s:0 + stream=codec_long_name',
      includes: ['select_streams s:0', 'stream=codec_long_name', 'default=nw=1:nk=1'] as const
    },
    {
      label: 'a:0/s:0 codec_long_name + aphasemeter ┬╖ -af aphasemeter=video=0 + -t 10',
      includes: ['-af aphasemeter=video=0', '-t 10', '-vn -sn'] as const
    },
    {
      label: 'a:1 stream_tags encoder + idet 5s ┬╖ select_streams a:1 + stream_tags=encoder',
      includes: ['select_streams a:1', 'stream_tags=encoder', 'default=nw=1:nk=1'] as const
    },
    {
      label: 'a:1 stream_tags encoder + idet 5s ┬╖ -vf idet + -t 5',
      includes: ['-vf idet', '-t 5', '-an -sn'] as const
    },
    {
      label:
        'format publisher+encoded_by + blackdetect 30s ┬╖ format_tags=publisher,encoded_by + default=nw=1:nk=1',
      includes: ['format_tags=publisher,encoded_by', 'default=nw=1:nk=1'] as const
    },
    {
      label:
        'format publisher+encoded_by + blackdetect 30s ┬╖ -vf blackdetect=d=0.1:pix_th=0.01 + -t 30',
      includes: ['-vf blackdetect=d=0.1:pix_th=0.01', '-t 30', '-an -sn'] as const
    },
    {
      label:
        'chapters json / s:0+a:1 stream duration / pts time_base / dynaudnorm / highpass ┬╖ -select_streams s:0 + stream=start_time,duration',
      includes: ['-select_streams s:0', 'stream=start_time,duration'] as const
    },
    {
      label:
        'chapters json / s:0+a:1 stream duration / pts time_base / dynaudnorm / highpass ┬╖ -select_streams a:1 + stream=start_time,duration',
      includes: ['-select_streams a:1', 'stream=start_time,duration'] as const
    },
    {
      label:
        'chapters json / s:0+a:1 stream duration / pts time_base / dynaudnorm / highpass ┬╖ -select_streams s:1 + time_base',
      includes: ['-select_streams s:1', 'time_base', 'start_pts', 'default=nw=1:nk=1'] as const
    },
    {
      label:
        'chapters json / s:0+a:1 stream duration / pts time_base / dynaudnorm / highpass ┬╖ -select_streams a:1 + time_base',
      includes: ['-select_streams a:1', 'time_base', 'start_pts', 'default=nw=1:nk=1'] as const
    },
    {
      label:
        'chapters json / s:0+a:1 stream duration / pts time_base / dynaudnorm / highpass ┬╖ -af dynaudnorm + -t 5',
      includes: ['-af dynaudnorm', '-t 5'] as const
    },
    {
      label:
        'chapters json / s:0+a:1 stream duration / pts time_base / dynaudnorm / highpass ┬╖ -af highpass=f=200 + -t 5',
      includes: ['-af highpass=f=200', '-t 5'] as const
    },
    {
      label:
        'cropdetect / freezedetect / signalstats ┬╖ -vf cropdetect=limit=24:round=16:reset=0 + -t 30',
      includes: ['-vf cropdetect=limit=24:round=16:reset=0', '-t 30', '-an -sn'] as const
    },
    {
      label: 'cropdetect / freezedetect / signalstats ┬╖ -vf freezedetect=n=-60dB:d=2 + -t 45',
      includes: ['-vf freezedetect=n=-60dB:d=2', '-t 45', '-an -sn'] as const
    },
    {
      label: 'cropdetect / freezedetect / signalstats ┬╖ -vf signalstats + -t 8',
      includes: ['-vf signalstats', '-t 8', '-an -sn'] as const
    },
    {
      label:
        'v:0 location / a:0 sample_fmt / ffmpeg genpts remux ┬╖ -select_streams v:0 + stream_tags=location',
      includes: ['-select_streams v:0', 'stream_tags=location', 'default=nw=1:nk=1'] as const
    },
    {
      label:
        'v:0 location / a:0 sample_fmt / ffmpeg genpts remux ┬╖ -select_streams a:0 + stream=sample_fmt',
      includes: ['-select_streams a:0', 'stream=sample_fmt', 'default=nw=1:nk=1'] as const
    },
    {
      label: 'v:0 location / a:0 sample_fmt / ffmpeg genpts remux ┬╖ -fflags +genpts + -c copy',
      includes: ['-fflags +genpts', '-c copy', '-t 2'] as const
    },
    {
      label:
        'format lyrics / a:1 layout+sfmt / scenedetect ┬╖ format_tags=lyrics + default=nw=1:nk=1',
      includes: ['format_tags=lyrics', 'default=nw=1:nk=1'] as const,
      needPlaceholder: true
    },
    {
      label:
        'format lyrics / a:1 layout+sfmt / scenedetect ┬╖ -select_streams a:1 + channel_layout,sample_fmt',
      includes: ['-select_streams a:1', 'channel_layout,sample_fmt', 'default=nw=1:nk=1'] as const
    },
    {
      label: 'format lyrics / a:1 layout+sfmt / scenedetect ┬╖ -vf scenedetect=scene=0.3 + -t 20',
      includes: ['-vf scenedetect=scene=0.3', '-t 20', '-an -sn'] as const
    },
    {
      label:
        'v:0 stereo_mode / a:0 duration_ts / format size+bit_rate+nb_streams / aresample ┬╖ -select_streams v:0 + stream_tags=stereo_mode',
      includes: ['-select_streams v:0', 'stream_tags=stereo_mode', 'default=nw=1:nk=1'] as const
    },
    {
      label:
        'v:0 stereo_mode / a:0 duration_ts / format size+bit_rate+nb_streams / aresample ┬╖ -select_streams a:0 + stream=duration_ts',
      includes: ['-select_streams a:0', 'stream=duration_ts', 'default=nw=1:nk=1'] as const
    },
    {
      label:
        'v:0 stereo_mode / a:0 duration_ts / format size+bit_rate+nb_streams / aresample ┬╖ format=size,bit_rate,nb_streams + default=nw=1:nk=1',
      includes: ['format=size,bit_rate,nb_streams', 'default=nw=1:nk=1'] as const
    },
    {
      label:
        'format duration_ts+time_base+probe_size ┬╖ show_entries format=duration_ts,time_base,probe_size',
      includes: [
        'show_entries format=duration_ts,time_base,probe_size',
        'default=nw=1:nk=1'
      ] as const,
      needPlaceholder: true
    },
    {
      label:
        'format start+timing ┬╖ show_entries format=start_time,duration_ts,time_base,probe_size',
      includes: [
        'show_entries format=start_time,duration_ts,time_base,probe_size',
        'default=nw=1:nk=1'
      ] as const,
      needPlaceholder: true
    }
  ]
