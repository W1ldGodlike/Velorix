import type { TerminalPreviewLinePredicate } from './terminal-preview-line-predicate-cases-types'

export const TERMINAL_PREVIEW_LINE_PREDICATE_CASES_STREAM_B: readonly TerminalPreviewLinePredicate[] =
  [
    {
      label: 'format start+start_real ┬╖ show_entries format=start_time,start_time_real',
      includes: ['show_entries format=start_time,start_time_real', 'default=nw=1:nk=1'] as const,
      needPlaceholder: true
    },
    {
      label:
        'format offset+timing ┬╖ show_entries format=start_time,start_time_real,duration,duration_ts,time_base,probe_size',
      includes: [
        'show_entries format=start_time,start_time_real,duration,duration_ts,time_base,probe_size',
        'default=nw=1:nk=1'
      ] as const,
      needPlaceholder: true
    },
    {
      label: 'format flags ┬╖ show_entries format=flags',
      includes: ['show_entries format=flags', 'default=nw=1:nk=1'] as const,
      needPlaceholder: true
    },
    {
      label:
        'format probe layout ┬╖ show_entries format=probe_score,nb_streams,nb_programs,flags,size',
      includes: [
        'show_entries format=probe_score,nb_streams,nb_programs,flags,size',
        'default=nw=1:nk=1'
      ] as const,
      needPlaceholder: true
    },
    {
      label:
        'format diagnostics ┬╖ show_entries format=filename,probe_score,nb_streams,flags,size,start_time,duration_ts',
      includes: [
        'show_entries format=filename,probe_score,nb_streams,nb_programs,flags,size,bit_rate,duration,start_time',
        'duration_ts,time_base,probe_size',
        'default=nw=1:nk=1'
      ] as const,
      needPlaceholder: true
    },
    {
      label:
        'v:0 stereo_mode / a:0 duration_ts / format size+bit_rate+nb_streams / aresample ┬╖ -af aresample=44100 + -t 3',
      includes: ['-af aresample=44100', '-t 3', '-vn -sn'] as const
    },
    {
      label:
        'format_tags minor_version / ffmpeg afftdn 3s ┬╖ format_tags=minor_version + default=nw=1:nk=1',
      includes: ['format_tags=minor_version', 'default=nw=1:nk=1'] as const,
      needPlaceholder: true
    },
    {
      label: 'format_tags minor_version / ffmpeg afftdn 3s ┬╖ -af afftdn=nf=-25 + -t 3',
      includes: ['-af afftdn=nf=-25', '-t 3', '-vn -sn'] as const
    },
    {
      label:
        'format desc+keywords / format location / ffmpeg acompressor 5s ┬╖ format_tags=description,keywords + default=nw=1:nk=1',
      includes: ['format_tags=description,keywords', 'default=nw=1:nk=1'] as const,
      needPlaceholder: true
    },
    {
      label:
        'format desc+keywords / format location / ffmpeg acompressor 5s ┬╖ format_tags=location + default=nw=1:nk=1',
      includes: ['format_tags=location', 'default=nw=1:nk=1'] as const,
      needPlaceholder: true
    },
    {
      label:
        'format desc+keywords / format location / ffmpeg acompressor 5s ┬╖ -af acompressor=threshold=-20dB:ratio=4:attack=5:release=100 + -t 5',
      includes: [
        '-af acompressor=threshold=-20dB:ratio=4:attack=5:release=100',
        '-t 5',
        '-vn -sn'
      ] as const
    },
    {
      label:
        'ffprobe v:2 / ffmpeg silenceremove 60s ┬╖ select_streams v:2 + stream=codec_name,width,height,profile,level',
      includes: ['select_streams v:2', 'stream=codec_name,width,height,profile,level'] as const,
      needPlaceholder: true
    },
    {
      label: 'ffprobe v:2 / ffmpeg silenceremove 60s ┬╖ -t 60 + -vn -sn',
      includes: ['-t 60', '-vn -sn'] as const
    },
    {
      label:
        'v:0 ticks_per_frame / ffmpeg treble 3s ┬╖ -select_streams v:0 + stream=ticks_per_frame',
      includes: ['-select_streams v:0', 'stream=ticks_per_frame', 'default=nw=1:nk=1'] as const,
      needPlaceholder: true
    },
    {
      label: 'v:0 ticks_per_frame / ffmpeg treble 3s ┬╖ -af treble=g=1 + -t 3',
      includes: ['-af treble=g=1', '-t 3', '-vn -sn'] as const
    },
    {
      label: 'format software+episode tags / ffmpeg volume+lowpass ┬╖ format_tags=software',
      includes: ['format_tags=software'] as const,
      needPlaceholder: true
    },
    {
      label:
        'format software+episode tags / ffmpeg volume+lowpass ┬╖ format_tags=episode_sort,season_number,episode_id',
      includes: ['format_tags=episode_sort,season_number,episode_id'] as const,
      needPlaceholder: true
    },
    {
      label: 'format software+episode tags / ffmpeg volume+lowpass ┬╖ -af volume=3dB + -t 2',
      includes: ['-af volume=3dB', '-t 2', '-vn -sn'] as const
    },
    {
      label: 'format software+episode tags / ffmpeg volume+lowpass ┬╖ -af lowpass=f=3500 + -t 3',
      includes: ['-af lowpass=f=3500', '-t 3', '-vn -sn'] as const
    },
    {
      label:
        'ffprobe a:0 time_base+fps / ffmpeg bandpass hp+lp 4s ┬╖ -select_streams a:0 + stream=time_base,avg_frame_rate,r_frame_rate',
      includes: [
        '-select_streams a:0',
        'stream=time_base,avg_frame_rate,r_frame_rate',
        'default=nw=1:nk=1'
      ] as const,
      needPlaceholder: true
    },
    {
      label:
        'ffprobe a:0 time_base+fps / ffmpeg bandpass hp+lp 4s ┬╖ -af highpass=f=200,lowpass=f=3000 + -t 4',
      includes: ['-af highpass=f=200,lowpass=f=3000', '-t 4', '-vn -sn'] as const
    },
    {
      label: 'v:0 is_intra_only / ffmpeg adeclick 5s ┬╖ -select_streams v:0 + stream=is_intra_only',
      includes: ['-select_streams v:0', 'stream=is_intra_only'] as const,
      needPlaceholder: true
    },
    {
      label: 'v:0 is_intra_only / ffmpeg adeclick 5s ┬╖ -af adeclick + -t 5',
      includes: ['-af adeclick', '-t 5', '-vn -sn'] as const
    },
    {
      label: 'format composer+conductor / ffmpeg agate 5s ┬╖ format_tags=composer,conductor',
      includes: ['format_tags=composer,conductor'] as const,
      needPlaceholder: true
    },
    {
      label: 'format composer+conductor / ffmpeg agate 5s ┬╖ -af agate=threshold=0.005 + -t 5',
      includes: ['-af agate=threshold=0.005', '-t 5', '-vn -sn'] as const
    },
    {
      label: 'format performer / v:0 alpha_mode / ffmpeg extrastereo 3s ┬╖ format_tags=performer',
      includes: ['format_tags=performer'] as const,
      needPlaceholder: true
    },
    {
      label:
        'format performer / v:0 alpha_mode / ffmpeg extrastereo 3s ┬╖ -select_streams v:0 + stream_tags=alpha_mode',
      includes: ['-select_streams v:0', 'stream_tags=alpha_mode'] as const,
      needPlaceholder: true
    },
    {
      label: 'format performer / v:0 alpha_mode / ffmpeg extrastereo 3s ┬╖ -af extrastereo + -t 3',
      includes: ['-af extrastereo', '-t 3', '-vn -sn'] as const
    },
    {
      label: 'purchase_date / sort meta / ffmpeg aphaser 4s ┬╖ format_tags=purchase_date',
      includes: ['format_tags=purchase_date'] as const,
      needPlaceholder: true
    },
    {
      label:
        'purchase_date / sort meta / ffmpeg aphaser 4s ┬╖ format_tags=sort_artist,sort_album,sort_title',
      includes: ['format_tags=sort_artist,sort_album,sort_title'] as const,
      needPlaceholder: true
    },
    {
      label: 'purchase_date / sort meta / ffmpeg aphaser 4s ┬╖ -af aphaser=in_gain=0.4 + -t 4',
      includes: ['-af aphaser=in_gain=0.4', '-t 4', '-vn -sn'] as const
    },
    {
      label:
        'format service tags + a:0 bits_per_coded_sample + ffmpeg flanger 4s ┬╖ format_tags=service_provider,service_name',
      includes: ['format_tags=service_provider,service_name'] as const,
      needPlaceholder: true
    },
    {
      label:
        'format service tags + a:0 bits_per_coded_sample + ffmpeg flanger 4s ┬╖ -select_streams a:0 + stream=bits_per_coded_sample',
      includes: ['-select_streams a:0', 'stream=bits_per_coded_sample'] as const,
      needPlaceholder: true
    },
    {
      label:
        'format service tags + a:0 bits_per_coded_sample + ffmpeg flanger 4s ┬╖ -af flanger + -t 4',
      includes: ['-af flanger', '-t 4', '-vn -sn'] as const
    },
    {
      label: 'format isrc + ffmpeg deesser 4s ┬╖ format_tags=isrc',
      includes: ['format_tags=isrc'] as const,
      needPlaceholder: true
    },
    {
      label: 'format isrc + ffmpeg deesser 4s ┬╖ -af deesser=i=0.5 + -t 4',
      includes: ['-af deesser=i=0.5', '-t 4', '-vn -sn'] as const
    },
    {
      label: 'ffprobe s:0 encoder + ffmpeg vibrato 4s ┬╖ -select_streams s:0 + stream_tags=encoder',
      includes: ['-select_streams s:0', 'stream_tags=encoder'] as const,
      needPlaceholder: true
    },
    {
      label: 'ffprobe s:0 encoder + ffmpeg vibrato 4s ┬╖ -af vibrato=f=6.5:d=0.5 + -t 4',
      includes: ['-af vibrato=f=6.5:d=0.5', '-t 4', '-vn -sn'] as const
    },
    {
      label: 'format part+compilation + ffmpeg crystalizer 4s ┬╖ format_tags=part,compilation',
      includes: ['format_tags=part,compilation'] as const,
      needPlaceholder: true
    },
    {
      label: 'format part+compilation + ffmpeg crystalizer 4s ┬╖ -af crystalizer=i=1.2 + -t 4',
      includes: ['-af crystalizer=i=1.2', '-t 4', '-vn -sn'] as const
    },
    {
      label:
        'ffprobe v:0 codec_time_base+time_base + ffmpeg asetrate pitch 3s ┬╖ -select_streams v:0 + stream=codec_time_base,time_base',
      includes: ['-select_streams v:0', 'stream=codec_time_base,time_base'] as const,
      needPlaceholder: true
    },
    {
      label:
        'ffprobe v:0 codec_time_base+time_base + ffmpeg asetrate pitch 3s ┬╖ -af asetrate=44100*1.01,aresample=44100 + -t 3',
      includes: ['-af asetrate=44100*1.01,aresample=44100', '-t 3', '-vn -sn'] as const
    }
  ]
