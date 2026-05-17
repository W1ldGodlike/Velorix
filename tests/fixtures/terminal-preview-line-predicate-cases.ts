/** Составные предикаты fullLine для smoke preview/ffprobe (§8 терминал). */
export type TerminalPreviewLinePredicate = {
  label: string
  includes: readonly string[]
  excludes?: readonly string[]
  needPlaceholder?: boolean
}

export const TERMINAL_PREVIEW_LINE_PREDICATES: readonly TerminalPreviewLinePredicate[] = [
  {
    label: 'есть JSON-сводка и show_error для текущего превью · -of json + -show_format',
    includes: ['-of json', '-show_format', '-show_streams'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams s:0 + stream_tags=title,language',
    includes: ['select_streams s:0', 'stream_tags=title,language'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams a:1 + codec_name,sample_rate,channels',
    includes: ['select_streams a:1', 'codec_name,sample_rate,channels'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams v:0 + stream_tags=handler_name,encoder',
    includes: ['select_streams v:0', 'stream_tags=handler_name,encoder'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams s:1 + codec_name,codec_tag_string',
    includes: ['select_streams s:1', 'codec_name,codec_tag_string'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams a:0 + codec_name,profile,bit_rate',
    includes: ['select_streams a:0', 'codec_name,profile,bit_rate'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · -count_frames + select_streams v:0',
    includes: ['-count_frames', 'select_streams v:0', 'nb_read_frames'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams a:0 + stream=disposition',
    includes: ['select_streams a:0', 'stream=disposition'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams v:0 + pix_fmt,color_space,color_range',
    includes: ['select_streams v:0', 'pix_fmt,color_space,color_range'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams v:0 + coded_width,coded_height,width,height',
    includes: ['select_streams v:0', 'coded_width,coded_height,width,height'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams s:0 + stream=disposition',
    includes: ['select_streams s:0', 'stream=disposition'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams v:0 + stream=time_base,start_pts',
    includes: ['select_streams v:0', 'stream=time_base,start_pts'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams a:0 + stream=time_base,start_pts',
    includes: ['select_streams a:0', 'stream=time_base,start_pts'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams v:0 + stream=bit_rate,max_bit_rate',
    includes: ['select_streams v:0', 'stream=bit_rate,max_bit_rate'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams v:0 + stream_tags=rotate',
    includes: ['select_streams v:0', 'stream_tags=rotate'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams a:0 + stream=channel_layout,bit_rate',
    includes: ['select_streams a:0', 'stream=channel_layout,bit_rate'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams a:0 + stream_tags=title,handler_name',
    includes: ['select_streams a:0', 'stream_tags=title,handler_name'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams v:0 + stream=r_frame_rate',
    includes: ['select_streams v:0', 'stream=r_frame_rate'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams s:2 + codec_name,codec_tag_string',
    includes: ['select_streams s:2', 'codec_name,codec_tag_string'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams v:0 + stream=closed_captions,is_avc',
    includes: ['select_streams v:0', 'stream=closed_captions,is_avc'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams t:0 + stream=codec_name,codec_tag_string',
    includes: ['select_streams t:0', 'stream=codec_name,codec_tag_string'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams d:0 + stream=codec_name,codec_tag_string',
    includes: ['select_streams d:0', 'stream=codec_name,codec_tag_string'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams v:0 + stream=codec_tag_string',
    includes: ['select_streams v:0', 'stream=codec_tag_string'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams a:2 + codec_name,sample_rate,channels',
    includes: ['select_streams a:2', 'codec_name,sample_rate,channels'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams v:0 + stream=chroma_location',
    includes: ['select_streams v:0', 'stream=chroma_location'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · -show_programs + -of compact',
    includes: ['-show_programs', '-of compact'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams v:0 + stream=side_data_list',
    includes: ['select_streams v:0', 'stream=side_data_list'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · -show_chapters + -of csv',
    includes: ['-show_chapters', '-of csv'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams v:0 + stream=start_time,duration',
    includes: ['select_streams v:0', 'stream=start_time,duration'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams a:0 + stream=start_time,duration',
    includes: ['select_streams a:0', 'stream=start_time,duration'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams v:0 + stream=bits_per_raw_sample',
    includes: ['select_streams v:0', 'stream=bits_per_raw_sample'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams v:1 + stream=codec_name,width,height',
    includes: ['select_streams v:1', 'stream=codec_name,width,height'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams s:1 + stream_tags=language',
    includes: ['select_streams s:1', 'stream_tags=language'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams a:1 + stream=disposition',
    includes: ['select_streams a:1', 'stream=disposition'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · -err_detect ignore_err + -t 2 -f null -',
    includes: ['-err_detect ignore_err', '-t 2 -f null -'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams v:0 + stream=avg_frame_rate',
    includes: ['select_streams v:0', 'stream=avg_frame_rate'] as const,
    excludes: ['bit_rate'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams v:0 + stream=codec_long_name',
    includes: ['select_streams v:0', 'stream=codec_long_name', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · format_tags=encoder + default=nw=1:nk=1',
    includes: ['format_tags=encoder', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams a:3 + stream=codec_name,sample_rate,channels',
    includes: ['select_streams a:3', 'stream=codec_name,sample_rate,channels'] as const
  },
  {
    label: 'есть JSON-сводка и show_error для текущего превью · select_streams s:3 + stream=codec_name,codec_tag_string',
    includes: ['select_streams s:3', 'stream=codec_name,codec_tag_string'] as const
  },
  {
    label: 'pretty/flat/packets/frames + loudnorm summary · -pretty + -show_format',
    includes: ['-pretty', '-show_format'] as const
  },
  {
    label: 'pretty/flat/packets/frames + loudnorm summary · -of flat + -show_format',
    includes: ['-of flat', '-show_format'] as const
  },
  {
    label: 'pretty/flat/packets/frames + loudnorm summary · select_streams v:0 + -show_packets',
    includes: ['select_streams v:0', '-show_packets', '-read_intervals %+#5'] as const
  },
  {
    label: 'pretty/flat/packets/frames + loudnorm summary · select_streams v:0 + -show_frames',
    includes: ['select_streams v:0', '-show_frames', '-read_intervals %+#5'] as const
  },
  {
    label: 'pretty/flat/packets/frames + loudnorm summary · -af loudnorm=print_format=summary + -vn -sn -f null -',
    includes: ['-af loudnorm=print_format=summary', '-vn -sn -f null -'] as const
  },
  {
    label: 'program_version, a:0 packets, seek decode · select_streams a:0 + -show_packets',
    includes: ['select_streams a:0', '-show_packets', '%+#3'] as const
  },
  {
    label: 'program_version, a:0 packets, seek decode · -ss 10 -i  + -t 2 -f null -',
    includes: ['-ss 10 -i ', '-t 2 -f null -'] as const
  },
  {
    label: 'format comment/synopsis, s:0 timebase, v:0 extradata_size · select_streams s:0 + codec_time_base',
    includes: ['select_streams s:0', 'codec_time_base', 'time_base'] as const
  },
  {
    label: 'format comment/synopsis, s:0 timebase, v:0 extradata_size · select_streams v:0 + extradata_size',
    includes: ['select_streams v:0', 'extradata_size', 'initial_padding'] as const
  },
  {
    label: 'format comment/synopsis, s:0 timebase, v:0 extradata_size · select_streams s:0 + stream=bit_rate',
    includes: ['select_streams s:0', 'stream=bit_rate', '-of default=nw=1:nk=1'] as const
  },
  {
    label: 'format comment/synopsis, s:0 timebase, v:0 extradata_size · select_streams v:0 + stream_tags=BPS,DURATION',
    includes: ['select_streams v:0', 'stream_tags=BPS,DURATION'] as const
  },
  {
    label: 'format comment/synopsis, s:0 timebase, v:0 extradata_size · select_streams s:0 + stream_tags=duration',
    includes: ['select_streams s:0', 'stream_tags=duration', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'v:0 stream creation_time, format handler_name, acodec copy null · select_streams v:0 + stream_tags=creation_time',
    includes: ['select_streams v:0', 'stream_tags=creation_time', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'v:0 stream creation_time, format handler_name, acodec copy null · -acodec copy + -vn -sn',
    includes: ['-acodec copy', '-vn -sn', '-t 3 -f null -'] as const
  },
  {
    label: 'a:0 bits_per_raw_sample, v:0 index+codec_name · select_streams a:0 + bits_per_raw_sample',
    includes: ['select_streams a:0', 'bits_per_raw_sample', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'a:0 bits_per_raw_sample, v:0 index+codec_name · select_streams v:0 + stream=index,codec_name',
    includes: ['select_streams v:0', 'stream=index,codec_name', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'v:0 profile+level, s:2 disposition · select_streams v:0 + stream=profile,level',
    includes: ['select_streams v:0', 'stream=profile,level', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'v:0 profile+level, s:2 disposition · select_streams s:2 + stream=disposition',
    includes: ['select_streams s:2', 'stream=disposition', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'a:2 disposition, v:1 profile+level, s:1 stream duration, map v:0 copy · select_streams a:2 + stream=disposition',
    includes: ['select_streams a:2', 'stream=disposition', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'a:2 disposition, v:1 profile+level, s:1 stream duration, map v:0 copy · select_streams v:1 + stream=profile,level',
    includes: ['select_streams v:1', 'stream=profile,level', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'a:2 disposition, v:1 profile+level, s:1 stream duration, map v:0 copy · select_streams s:1 + stream=start_time,duration',
    includes: ['select_streams s:1', 'stream=start_time,duration', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'a:2 disposition, v:1 profile+level, s:1 stream duration, map v:0 copy · -map 0:v:0 -c:v copy + -an -sn -f null -',
    includes: ['-map 0:v:0 -c:v copy', '-an -sn -f null -'] as const
  },
  {
    label: 's:0 time_base+start_pts, volumedetect · select_streams s:0 + stream=time_base,start_pts',
    includes: ['select_streams s:0', 'stream=time_base,start_pts', 'default=nw=1:nk=1'] as const
  },
  {
    label: 's:0 time_base+start_pts, volumedetect · -af volumedetect + -vn -sn',
    includes: ['-af volumedetect', '-vn -sn', '-t 10'] as const
  },
  {
    label: 'format genre+date, silencedetect · format_tags=genre,date + default=nw=1:nk=1',
    includes: ['format_tags=genre,date', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'format genre+date, silencedetect · -af silencedetect=noise=-50dB:d=0.3 + -vn -sn',
    includes: ['-af silencedetect=noise=-50dB:d=0.3', '-vn -sn'] as const
  },
  {
    label: 'v:0 disposition, a:1 bit_rate, astats · select_streams v:0 + stream=disposition',
    includes: ['select_streams v:0', 'stream=disposition', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'v:0 disposition, a:1 bit_rate, astats · select_streams a:1 + stream=bit_rate',
    includes: ['select_streams a:1', 'stream=bit_rate', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'v:0 disposition, a:1 bit_rate, astats · -af astats=metadata=1:reset=1 + -t 5',
    includes: ['-af astats=metadata=1:reset=1', '-t 5', '-vn -sn'] as const
  },
  {
    label: 'a:0 stream_tags encoder, ebur128 · select_streams a:0 + stream_tags=encoder',
    includes: ['select_streams a:0', 'stream_tags=encoder', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'a:0 stream_tags encoder, ebur128 · -af ebur128=framelog=verbose + -t 12',
    includes: ['-af ebur128=framelog=verbose', '-t 12', '-vn -sn'] as const
  },
  {
    label: 'a:0/s:0 codec_long_name + aphasemeter · select_streams a:0 + stream=codec_long_name',
    includes: ['select_streams a:0', 'stream=codec_long_name', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'a:0/s:0 codec_long_name + aphasemeter · select_streams s:0 + stream=codec_long_name',
    includes: ['select_streams s:0', 'stream=codec_long_name', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'a:0/s:0 codec_long_name + aphasemeter · -af aphasemeter=video=0 + -t 10',
    includes: ['-af aphasemeter=video=0', '-t 10', '-vn -sn'] as const
  },
  {
    label: 'a:1 stream_tags encoder + idet 5s · select_streams a:1 + stream_tags=encoder',
    includes: ['select_streams a:1', 'stream_tags=encoder', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'a:1 stream_tags encoder + idet 5s · -vf idet + -t 5',
    includes: ['-vf idet', '-t 5', '-an -sn'] as const
  },
  {
    label: 'format publisher+encoded_by + blackdetect 30s · format_tags=publisher,encoded_by + default=nw=1:nk=1',
    includes: ['format_tags=publisher,encoded_by', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'format publisher+encoded_by + blackdetect 30s · -vf blackdetect=d=0.1:pix_th=0.01 + -t 30',
    includes: ['-vf blackdetect=d=0.1:pix_th=0.01', '-t 30', '-an -sn'] as const
  },
  {
    label: 'chapters json / s:0+a:1 stream duration / pts time_base / dynaudnorm / highpass · -select_streams s:0 + stream=start_time,duration',
    includes: ['-select_streams s:0', 'stream=start_time,duration'] as const
  },
  {
    label: 'chapters json / s:0+a:1 stream duration / pts time_base / dynaudnorm / highpass · -select_streams a:1 + stream=start_time,duration',
    includes: ['-select_streams a:1', 'stream=start_time,duration'] as const
  },
  {
    label: 'chapters json / s:0+a:1 stream duration / pts time_base / dynaudnorm / highpass · -select_streams s:1 + time_base',
    includes: ['-select_streams s:1', 'time_base', 'start_pts', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'chapters json / s:0+a:1 stream duration / pts time_base / dynaudnorm / highpass · -select_streams a:1 + time_base',
    includes: ['-select_streams a:1', 'time_base', 'start_pts', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'chapters json / s:0+a:1 stream duration / pts time_base / dynaudnorm / highpass · -af dynaudnorm + -t 5',
    includes: ['-af dynaudnorm', '-t 5'] as const
  },
  {
    label: 'chapters json / s:0+a:1 stream duration / pts time_base / dynaudnorm / highpass · -af highpass=f=200 + -t 5',
    includes: ['-af highpass=f=200', '-t 5'] as const
  },
  {
    label: 'cropdetect / freezedetect / signalstats · -vf cropdetect=limit=24:round=16:reset=0 + -t 30',
    includes: ['-vf cropdetect=limit=24:round=16:reset=0', '-t 30', '-an -sn'] as const
  },
  {
    label: 'cropdetect / freezedetect / signalstats · -vf freezedetect=n=-60dB:d=2 + -t 45',
    includes: ['-vf freezedetect=n=-60dB:d=2', '-t 45', '-an -sn'] as const
  },
  {
    label: 'cropdetect / freezedetect / signalstats · -vf signalstats + -t 8',
    includes: ['-vf signalstats', '-t 8', '-an -sn'] as const
  },
  {
    label: 'v:0 location / a:0 sample_fmt / ffmpeg genpts remux · -select_streams v:0 + stream_tags=location',
    includes: ['-select_streams v:0', 'stream_tags=location', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'v:0 location / a:0 sample_fmt / ffmpeg genpts remux · -select_streams a:0 + stream=sample_fmt',
    includes: ['-select_streams a:0', 'stream=sample_fmt', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'v:0 location / a:0 sample_fmt / ffmpeg genpts remux · -fflags +genpts + -c copy',
    includes: ['-fflags +genpts', '-c copy', '-t 2'] as const
  },
  {
    label: 'format lyrics / a:1 layout+sfmt / scenedetect · format_tags=lyrics + default=nw=1:nk=1',
    includes: ['format_tags=lyrics', 'default=nw=1:nk=1'] as const,
    needPlaceholder: true
  },
  {
    label: 'format lyrics / a:1 layout+sfmt / scenedetect · -select_streams a:1 + channel_layout,sample_fmt',
    includes: ['-select_streams a:1', 'channel_layout,sample_fmt', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'format lyrics / a:1 layout+sfmt / scenedetect · -vf scenedetect=scene=0.3 + -t 20',
    includes: ['-vf scenedetect=scene=0.3', '-t 20', '-an -sn'] as const
  },
  {
    label: 'v:0 stereo_mode / a:0 duration_ts / format size+bit_rate+nb_streams / aresample · -select_streams v:0 + stream_tags=stereo_mode',
    includes: ['-select_streams v:0', 'stream_tags=stereo_mode', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'v:0 stereo_mode / a:0 duration_ts / format size+bit_rate+nb_streams / aresample · -select_streams a:0 + stream=duration_ts',
    includes: ['-select_streams a:0', 'stream=duration_ts', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'v:0 stereo_mode / a:0 duration_ts / format size+bit_rate+nb_streams / aresample · format=size,bit_rate,nb_streams + default=nw=1:nk=1',
    includes: ['format=size,bit_rate,nb_streams', 'default=nw=1:nk=1'] as const
  },
  {
    label: 'format duration_ts+time_base+probe_size · show_entries format=duration_ts,time_base,probe_size',
    includes: [
      'show_entries format=duration_ts,time_base,probe_size',
      'default=nw=1:nk=1'
    ] as const,
    needPlaceholder: true
  },
  {
    label: 'format start+timing · show_entries format=start_time,duration_ts,time_base,probe_size',
    includes: [
      'show_entries format=start_time,duration_ts,time_base,probe_size',
      'default=nw=1:nk=1'
    ] as const,
    needPlaceholder: true
  },
  {
    label: 'format start+start_real · show_entries format=start_time,start_time_real',
    includes: ['show_entries format=start_time,start_time_real', 'default=nw=1:nk=1'] as const,
    needPlaceholder: true
  },
  {
    label: 'format offset+timing · show_entries format=start_time,start_time_real,duration_ts,time_base,probe_size',
    includes: [
      'show_entries format=start_time,start_time_real,duration_ts,time_base,probe_size',
      'default=nw=1:nk=1'
    ] as const,
    needPlaceholder: true
  },
  {
    label: 'format flags · show_entries format=flags',
    includes: ['show_entries format=flags', 'default=nw=1:nk=1'] as const,
    needPlaceholder: true
  },
  {
    label: 'v:0 stereo_mode / a:0 duration_ts / format size+bit_rate+nb_streams / aresample · -af aresample=44100 + -t 3',
    includes: ['-af aresample=44100', '-t 3', '-vn -sn'] as const
  },
  {
    label: 'format_tags minor_version / ffmpeg afftdn 3s · format_tags=minor_version + default=nw=1:nk=1',
    includes: ['format_tags=minor_version', 'default=nw=1:nk=1'] as const,
    needPlaceholder: true
  },
  {
    label: 'format_tags minor_version / ffmpeg afftdn 3s · -af afftdn=nf=-25 + -t 3',
    includes: ['-af afftdn=nf=-25', '-t 3', '-vn -sn'] as const
  },
  {
    label: 'format desc+keywords / format location / ffmpeg acompressor 5s · format_tags=description,keywords + default=nw=1:nk=1',
    includes: ['format_tags=description,keywords', 'default=nw=1:nk=1'] as const,
    needPlaceholder: true
  },
  {
    label: 'format desc+keywords / format location / ffmpeg acompressor 5s · format_tags=location + default=nw=1:nk=1',
    includes: ['format_tags=location', 'default=nw=1:nk=1'] as const,
    needPlaceholder: true
  },
  {
    label: 'format desc+keywords / format location / ffmpeg acompressor 5s · -af acompressor=threshold=-20dB:ratio=4:attack=5:release=100 + -t 5',
    includes: ['-af acompressor=threshold=-20dB:ratio=4:attack=5:release=100', '-t 5', '-vn -sn'] as const
  },
  {
    label: 'ffprobe v:2 / ffmpeg silenceremove 60s · select_streams v:2 + stream=codec_name,width,height,profile,level',
    includes: ['select_streams v:2', 'stream=codec_name,width,height,profile,level'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe v:2 / ffmpeg silenceremove 60s · -t 60 + -vn -sn',
    includes: ['-t 60', '-vn -sn'] as const
  },
  {
    label: 'v:0 ticks_per_frame / ffmpeg treble 3s · -select_streams v:0 + stream=ticks_per_frame',
    includes: ['-select_streams v:0', 'stream=ticks_per_frame', 'default=nw=1:nk=1'] as const,
    needPlaceholder: true
  },
  {
    label: 'v:0 ticks_per_frame / ffmpeg treble 3s · -af treble=g=1 + -t 3',
    includes: ['-af treble=g=1', '-t 3', '-vn -sn'] as const
  },
  {
    label: 'format software+episode tags / ffmpeg volume+lowpass · format_tags=software',
    includes: ['format_tags=software'] as const,
    needPlaceholder: true
  },
  {
    label: 'format software+episode tags / ffmpeg volume+lowpass · format_tags=episode_sort,season_number,episode_id',
    includes: ['format_tags=episode_sort,season_number,episode_id'] as const,
    needPlaceholder: true
  },
  {
    label: 'format software+episode tags / ffmpeg volume+lowpass · -af volume=3dB + -t 2',
    includes: ['-af volume=3dB', '-t 2', '-vn -sn'] as const
  },
  {
    label: 'format software+episode tags / ffmpeg volume+lowpass · -af lowpass=f=3500 + -t 3',
    includes: ['-af lowpass=f=3500', '-t 3', '-vn -sn'] as const
  },
  {
    label: 'ffprobe a:0 time_base+fps / ffmpeg bandpass hp+lp 4s · -select_streams a:0 + stream=time_base,avg_frame_rate,r_frame_rate',
    includes: ['-select_streams a:0', 'stream=time_base,avg_frame_rate,r_frame_rate', 'default=nw=1:nk=1'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe a:0 time_base+fps / ffmpeg bandpass hp+lp 4s · -af highpass=f=200,lowpass=f=3000 + -t 4',
    includes: ['-af highpass=f=200,lowpass=f=3000', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'v:0 is_intra_only / ffmpeg adeclick 5s · -select_streams v:0 + stream=is_intra_only',
    includes: ['-select_streams v:0', 'stream=is_intra_only'] as const,
    needPlaceholder: true
  },
  {
    label: 'v:0 is_intra_only / ffmpeg adeclick 5s · -af adeclick + -t 5',
    includes: ['-af adeclick', '-t 5', '-vn -sn'] as const
  },
  {
    label: 'format composer+conductor / ffmpeg agate 5s · format_tags=composer,conductor',
    includes: ['format_tags=composer,conductor'] as const,
    needPlaceholder: true
  },
  {
    label: 'format composer+conductor / ffmpeg agate 5s · -af agate=threshold=0.005 + -t 5',
    includes: ['-af agate=threshold=0.005', '-t 5', '-vn -sn'] as const
  },
  {
    label: 'format performer / v:0 alpha_mode / ffmpeg extrastereo 3s · format_tags=performer',
    includes: ['format_tags=performer'] as const,
    needPlaceholder: true
  },
  {
    label: 'format performer / v:0 alpha_mode / ffmpeg extrastereo 3s · -select_streams v:0 + stream_tags=alpha_mode',
    includes: ['-select_streams v:0', 'stream_tags=alpha_mode'] as const,
    needPlaceholder: true
  },
  {
    label: 'format performer / v:0 alpha_mode / ffmpeg extrastereo 3s · -af extrastereo + -t 3',
    includes: ['-af extrastereo', '-t 3', '-vn -sn'] as const
  },
  {
    label: 'purchase_date / sort meta / ffmpeg aphaser 4s · format_tags=purchase_date',
    includes: ['format_tags=purchase_date'] as const,
    needPlaceholder: true
  },
  {
    label: 'purchase_date / sort meta / ffmpeg aphaser 4s · format_tags=sort_artist,sort_album,sort_title',
    includes: ['format_tags=sort_artist,sort_album,sort_title'] as const,
    needPlaceholder: true
  },
  {
    label: 'purchase_date / sort meta / ffmpeg aphaser 4s · -af aphaser=in_gain=0.4 + -t 4',
    includes: ['-af aphaser=in_gain=0.4', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'format service tags + a:0 bits_per_coded_sample + ffmpeg flanger 4s · format_tags=service_provider,service_name',
    includes: ['format_tags=service_provider,service_name'] as const,
    needPlaceholder: true
  },
  {
    label: 'format service tags + a:0 bits_per_coded_sample + ffmpeg flanger 4s · -select_streams a:0 + stream=bits_per_coded_sample',
    includes: ['-select_streams a:0', 'stream=bits_per_coded_sample'] as const,
    needPlaceholder: true
  },
  {
    label: 'format service tags + a:0 bits_per_coded_sample + ffmpeg flanger 4s · -af flanger + -t 4',
    includes: ['-af flanger', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'format isrc + ffmpeg deesser 4s · format_tags=isrc',
    includes: ['format_tags=isrc'] as const,
    needPlaceholder: true
  },
  {
    label: 'format isrc + ffmpeg deesser 4s · -af deesser=i=0.5 + -t 4',
    includes: ['-af deesser=i=0.5', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe s:0 encoder + ffmpeg vibrato 4s · -select_streams s:0 + stream_tags=encoder',
    includes: ['-select_streams s:0', 'stream_tags=encoder'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe s:0 encoder + ffmpeg vibrato 4s · -af vibrato=f=6.5:d=0.5 + -t 4',
    includes: ['-af vibrato=f=6.5:d=0.5', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'format part+compilation + ffmpeg crystalizer 4s · format_tags=part,compilation',
    includes: ['format_tags=part,compilation'] as const,
    needPlaceholder: true
  },
  {
    label: 'format part+compilation + ffmpeg crystalizer 4s · -af crystalizer=i=1.2 + -t 4',
    includes: ['-af crystalizer=i=1.2', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe v:0 codec_time_base+time_base + ffmpeg asetrate pitch 3s · -select_streams v:0 + stream=codec_time_base,time_base',
    includes: ['-select_streams v:0', 'stream=codec_time_base,time_base'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe v:0 codec_time_base+time_base + ffmpeg asetrate pitch 3s · -af asetrate=44100*1.01,aresample=44100 + -t 3',
    includes: ['-af asetrate=44100*1.01,aresample=44100', '-t 3', '-vn -sn'] as const
  },
  {
    label: 'ffprobe format copyright+encoded_by + ffmpeg compand 4s · format_tags=copyright,encoded_by',
    includes: ['format_tags=copyright,encoded_by'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe format copyright+encoded_by + ffmpeg compand 4s · -af compand=attacks=0.02:decays=0.1:points=-80/-80|-25/-25|0/-10:gain=2 + -t 4',
    includes: ['-af compand=attacks=0.02:decays=0.1:points=-80/-80|-25/-25|0/-10:gain=2', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe album_artist + track/disc + ffmpeg dynaudnorm 4s · format_tags=album_artist',
    includes: ['format_tags=album_artist'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe album_artist + track/disc + ffmpeg dynaudnorm 4s · format_tags=track,disc',
    includes: ['format_tags=track,disc'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe album_artist + track/disc + ffmpeg dynaudnorm 4s · -af dynaudnorm=f=150:g=15 + -t 4',
    includes: ['-af dynaudnorm=f=150:g=15', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe lyrics+synopsis + ffmpeg asoftclip 4s · format_tags=lyrics,synopsis',
    includes: ['format_tags=lyrics,synopsis'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe lyrics+synopsis + ffmpeg asoftclip 4s · -af asoftclip + -t 4',
    includes: ['-af asoftclip', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe a:0 channels+channel_layout + ffmpeg aecho 4s · -select_streams a:0 + stream=channels,channel_layout',
    includes: ['-select_streams a:0', 'stream=channels,channel_layout'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe a:0 channels+channel_layout + ffmpeg aecho 4s · -af aecho=0.8:0.9:40:0.3 + -t 4',
    includes: ['-af aecho=0.8:0.9:40:0.3', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe s:1 disposition + ffmpeg tremolo/bandpass 4s · -select_streams s:1 + stream=disposition',
    includes: ['-select_streams s:1', 'stream=disposition'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe s:1 disposition + ffmpeg tremolo/bandpass 4s · -af tremolo=f=6:d=0.5 + -t 4',
    includes: ['-af tremolo=f=6:d=0.5', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe s:1 disposition + ffmpeg tremolo/bandpass 4s · -af bandpass=f=1000:width_type=h:width=200 + -t 4',
    includes: ['-af bandpass=f=1000:width_type=h:width=200', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe a:1 codec+channels+layout + ffmpeg highshelf 3s · -select_streams a:1 + stream=codec_name,channels,channel_layout',
    includes: ['-select_streams a:1', 'stream=codec_name,channels,channel_layout'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe a:1 codec+channels+layout + ffmpeg highshelf 3s · -af highshelf=f=8000:width_type=o:width=2:g=-6 + -t 3',
    includes: ['-af highshelf=f=8000:width_type=o:width=2:g=-6', '-t 3', '-vn -sn'] as const
  },
  {
    label: 'ffprobe v:1 WxH + ffmpeg apulsator 3s · -select_streams v:1 + stream=codec_name,width,height',
    includes: ['-select_streams v:1', 'stream=codec_name,width,height'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe v:1 WxH + ffmpeg apulsator 3s · -af apulsator=mode=sine:hz=1:width=2 + -t 3',
    includes: ['-af apulsator=mode=sine:hz=1:width=2', '-t 3', '-vn -sn'] as const
  },
  {
    label: 'ffprobe d:1 codec+tag + ffmpeg chorus 4s · -select_streams d:1 + stream=codec_name,codec_tag_string',
    includes: ['-select_streams d:1', 'stream=codec_name,codec_tag_string'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe d:1 codec+tag + ffmpeg chorus 4s · -af chorus=0.5:0.9:50:0.4:0.25:2 + -t 4',
    includes: ['-af chorus=0.5:0.9:50:0.4:0.25:2', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe format encoder+WMFSDKVersion + ffmpeg afade in 3s · format_tags=encoder,WMFSDKVersion',
    includes: ['format_tags=encoder,WMFSDKVersion'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe format encoder+WMFSDKVersion + ffmpeg afade in 3s · -af afade=t=in:st=0:d=0.6 + -t 3',
    includes: ['-af afade=t=in:st=0:d=0.6', '-t 3', '-vn -sn'] as const
  },
  {
    label: 'ffprobe format probe_score + ffmpeg atempo 0.95 3s · format=probe_score',
    includes: ['format=probe_score'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe format probe_score + ffmpeg atempo 0.95 3s · -af atempo=0.95 + -t 3',
    includes: ['-af atempo=0.95', '-t 3', '-vn -sn'] as const
  },
  {
    label: 'ffprobe format encoding_tool + ffmpeg afade out 3s · format_tags=encoding_tool',
    includes: ['format_tags=encoding_tool'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe format encoding_tool + ffmpeg afade out 3s · -af afade=t=out:st=1.2:d=0.6 + -t 3',
    includes: ['-af afade=t=out:st=1.2:d=0.6', '-t 3', '-vn -sn'] as const
  },
  {
    label: 'ffprobe v:1 codec long + ffmpeg alimiter 3s · select_streams v:1 + codec_long_name',
    includes: ['select_streams v:1', 'codec_long_name'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe v:1 codec long + ffmpeg alimiter 3s · -af alimiter=limit=0.8 + -t 3',
    includes: ['-af alimiter=limit=0.8', '-t 3', '-vn -sn'] as const
  },
  {
    label: 'ffprobe format MP4 brands + ffmpeg stereotools 3s · format_tags=major_brand,minor_version,compatible_brands',
    includes: ['format_tags=major_brand,minor_version,compatible_brands'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe format MP4 brands + ffmpeg stereotools 3s · -af stereotools=mlev=0.05:phlev=0.05 + -t 3',
    includes: ['-af stereotools=mlev=0.05:phlev=0.05', '-t 3', '-vn -sn'] as const
  },
  {
    label: 'ffprobe gapless+compilation + ffmpeg speechnorm 4s · format_tags=gapless_playback,compilation',
    includes: ['format_tags=gapless_playback,compilation'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe gapless+compilation + ffmpeg speechnorm 4s · -af speechnorm=peak=0.25 + -t 4',
    includes: ['-af speechnorm=peak=0.25', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe format BPM+key + ffmpeg bs2b 4s · format_tags=BPM,initial_key',
    includes: ['format_tags=BPM,initial_key'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe format BPM+key + ffmpeg bs2b 4s · -af bs2b=profile=j2 + -t 4',
    includes: ['-af bs2b=profile=j2', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe format artist+album + ffmpeg bass 4s · format_tags=artist,album',
    includes: ['format_tags=artist,album'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe format artist+album + ffmpeg bass 4s · -af bass=g=2:f=120 + -t 4',
    includes: ['-af bass=g=2:f=120', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe s:0 index+codec + ffmpeg superequalizer 4s · select_streams s:0 + stream=index,codec_name',
    includes: ['select_streams s:0', 'stream=index,codec_name'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe s:0 index+codec + ffmpeg superequalizer 4s · -af superequalizer=3b=4 + -t 4',
    includes: ['-af superequalizer=3b=4', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe format show+epsort + ffmpeg lowshelf 4s · format_tags=show,episode_sort',
    includes: ['format_tags=show,episode_sort'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe format show+epsort + ffmpeg lowshelf 4s · -af lowshelf=g=2:f=200 + -t 4',
    includes: ['-af lowshelf=g=2:f=200', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe format genre+date + ffmpeg extrastereo 4s · format_tags=genre,date',
    includes: ['format_tags=genre,date'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe format genre+date + ffmpeg extrastereo 4s · -af extrastereo=m=1.2 + -t 4',
    includes: ['-af extrastereo=m=1.2', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe format cat+barcode + ffmpeg aresample async 4s · format_tags=podcast,podcasturl',
    includes: ['format_tags=podcast,podcasturl'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe format cat+barcode + ffmpeg aresample async 4s · -af acrusher=level_in=0.8:level_out=0.8:bits=8:mode=log + -t 4',
    includes: ['-af acrusher=level_in=0.8:level_out=0.8:bits=8:mode=log', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe d:2 codec + ffmpeg pan stereo 4s · -select_streams d:2 + stream=codec_name,codec_tag_string',
    includes: ['-select_streams d:2', 'stream=codec_name,codec_tag_string'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe d:2 codec + ffmpeg pan stereo 4s · -af pan=stereo|c0=0.6*c0+0.4*c1|c1=0.4*c0+0.6*c1 + -t 4',
    includes: ['-af pan=stereo|c0=0.6*c0+0.4*c1|c1=0.4*c0+0.6*c1', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe a:4 + s:4 + ffmpeg acompressor 4s · -select_streams a:4 + stream=codec_name,sample_rate,channels',
    includes: ['-select_streams a:4', 'stream=codec_name,sample_rate,channels'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe a:4 + s:4 + ffmpeg acompressor 4s · -select_streams s:4 + stream=codec_name,codec_tag_string',
    includes: ['-select_streams s:4', 'stream=codec_name,codec_tag_string'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe a:4 + s:4 + ffmpeg acompressor 4s · -af acompressor=threshold=0.08:ratio=3:attack=5:release=50 + -t 4',
    includes: ['-af acompressor=threshold=0.08:ratio=3:attack=5:release=50', '-t 4', '-vn -sn'] as const
  },
  {
    label: 'ffprobe v:2 WxH+fps + ffmpeg acontrast 3s · -select_streams v:2 + stream=width,height,r_frame_rate',
    includes: ['-select_streams v:2', 'stream=width,height,r_frame_rate'] as const,
    needPlaceholder: true
  },
  {
    label: 'ffprobe v:2 WxH+fps + ffmpeg acontrast 3s · -af acontrast=25 + -t 3',
    includes: ['-af acontrast=25', '-t 3', '-vn -sn'] as const
  }
]
