import type { TerminalPreviewLinePredicate } from './terminal-preview-line-predicate-cases-types'

export const TERMINAL_PREVIEW_LINE_PREDICATE_CASES_JSON: readonly TerminalPreviewLinePredicate[] = [
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ -of json + -show_format',
    includes: ['-of json', '-show_format', '-show_streams'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams s:0 + stream_tags=title,language',
    includes: ['select_streams s:0', 'stream_tags=title,language'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams a:1 + codec_name,sample_rate,channels',
    includes: ['select_streams a:1', 'codec_name,sample_rate,channels'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams v:0 + stream_tags=handler_name,encoder',
    includes: ['select_streams v:0', 'stream_tags=handler_name,encoder'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams s:1 + codec_name,codec_tag_string',
    includes: ['select_streams s:1', 'codec_name,codec_tag_string'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams a:0 + codec_name,profile,bit_rate',
    includes: ['select_streams a:0', 'codec_name,profile,bit_rate'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ -count_frames + select_streams v:0',
    includes: ['-count_frames', 'select_streams v:0', 'nb_read_frames'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams a:0 + stream=disposition',
    includes: ['select_streams a:0', 'stream=disposition'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams v:0 + pix_fmt,color_space,color_range',
    includes: ['select_streams v:0', 'pix_fmt,color_space,color_range'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams v:0 + coded_width,coded_height,width,height',
    includes: ['select_streams v:0', 'coded_width,coded_height,width,height'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams s:0 + stream=disposition',
    includes: ['select_streams s:0', 'stream=disposition'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams v:0 + stream=time_base,start_pts',
    includes: ['select_streams v:0', 'stream=time_base,start_pts'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams a:0 + stream=time_base,start_pts',
    includes: ['select_streams a:0', 'stream=time_base,start_pts'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams v:0 + stream=bit_rate,max_bit_rate',
    includes: ['select_streams v:0', 'stream=bit_rate,max_bit_rate'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams v:0 + stream_tags=rotate',
    includes: ['select_streams v:0', 'stream_tags=rotate'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams a:0 + stream=channel_layout,bit_rate',
    includes: ['select_streams a:0', 'stream=channel_layout,bit_rate'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams a:0 + stream_tags=title,handler_name',
    includes: ['select_streams a:0', 'stream_tags=title,handler_name'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams v:0 + stream=r_frame_rate',
    includes: ['select_streams v:0', 'stream=r_frame_rate'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams s:2 + codec_name,codec_tag_string',
    includes: ['select_streams s:2', 'codec_name,codec_tag_string'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams v:0 + stream=closed_captions,is_avc',
    includes: ['select_streams v:0', 'stream=closed_captions,is_avc'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams t:0 + stream=codec_name,codec_tag_string',
    includes: ['select_streams t:0', 'stream=codec_name,codec_tag_string'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams d:0 + stream=codec_name,codec_tag_string',
    includes: ['select_streams d:0', 'stream=codec_name,codec_tag_string'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams v:0 + stream=codec_tag_string',
    includes: ['select_streams v:0', 'stream=codec_tag_string'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams a:2 + codec_name,sample_rate,channels',
    includes: ['select_streams a:2', 'codec_name,sample_rate,channels'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams v:0 + stream=chroma_location',
    includes: ['select_streams v:0', 'stream=chroma_location'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ -show_programs + -of compact',
    includes: ['-show_programs', '-of compact'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams v:0 + stream=side_data_list',
    includes: ['select_streams v:0', 'stream=side_data_list'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ -show_chapters + -of csv',
    includes: ['-show_chapters', '-of csv'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams v:0 + stream=start_time,duration',
    includes: ['select_streams v:0', 'stream=start_time,duration'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams a:0 + stream=start_time,duration',
    includes: ['select_streams a:0', 'stream=start_time,duration'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams v:0 + stream=bits_per_raw_sample',
    includes: ['select_streams v:0', 'stream=bits_per_raw_sample'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams v:1 + stream=codec_name,width,height',
    includes: ['select_streams v:1', 'stream=codec_name,width,height'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams s:1 + stream_tags=language',
    includes: ['select_streams s:1', 'stream_tags=language'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams a:1 + stream=disposition',
    includes: ['select_streams a:1', 'stream=disposition'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ -err_detect ignore_err + -t 2 -f null -',
    includes: ['-err_detect ignore_err', '-t 2 -f null -'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams v:0 + stream=avg_frame_rate',
    includes: ['select_streams v:0', 'stream=avg_frame_rate'] as const,
    excludes: ['bit_rate'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams v:0 + stream=codec_long_name',
    includes: ['select_streams v:0', 'stream=codec_long_name', 'default=nw=1:nk=1'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ format_tags=encoder + default=nw=1:nk=1',
    includes: ['format_tags=encoder', 'default=nw=1:nk=1'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams a:3 + stream=codec_name,sample_rate,channels',
    includes: ['select_streams a:3', 'stream=codec_name,sample_rate,channels'] as const
  },
  {
    label:
      '╨╡╤Б╤В╤М JSON-╤Б╨▓╨╛╨┤╨║╨░ ╨╕ show_error ╨┤╨╗╤П ╤В╨╡╨║╤Г╤Й╨╡╨│╨╛ ╨┐╤А╨╡╨▓╤М╤О ┬╖ select_streams s:3 + stream=codec_name,codec_tag_string',
    includes: ['select_streams s:3', 'stream=codec_name,codec_tag_string'] as const
  },
  {
    label: 'pretty/flat/packets/frames + loudnorm summary ┬╖ -pretty + -show_format',
    includes: ['-pretty', '-show_format'] as const
  },
  {
    label: 'pretty/flat/packets/frames + loudnorm summary ┬╖ -of flat + -show_format',
    includes: ['-of flat', '-show_format'] as const
  },
  {
    label: 'pretty/flat/packets/frames + loudnorm summary ┬╖ select_streams v:0 + -show_packets',
    includes: ['select_streams v:0', '-show_packets', '-read_intervals %+#5'] as const
  },
  {
    label: 'pretty/flat/packets/frames + loudnorm summary ┬╖ select_streams v:0 + -show_frames',
    includes: ['select_streams v:0', '-show_frames', '-read_intervals %+#5'] as const
  },
  {
    label:
      'pretty/flat/packets/frames + loudnorm summary ┬╖ -af loudnorm=print_format=summary + -vn -sn -f null -',
    includes: ['-af loudnorm=print_format=summary', '-vn -sn -f null -'] as const
  },
  {
    label: 'program_version, a:0 packets, seek decode ┬╖ select_streams a:0 + -show_packets',
    includes: ['select_streams a:0', '-show_packets', '%+#3'] as const
  },
  {
    label: 'program_version, a:0 packets, seek decode ┬╖ -ss 10 -i  + -t 2 -f null -',
    includes: ['-ss 10 -i ', '-t 2 -f null -'] as const
  },
  {
    label:
      'format comment/synopsis, s:0 timebase, v:0 extradata_size ┬╖ select_streams s:0 + codec_time_base',
    includes: ['select_streams s:0', 'codec_time_base', 'time_base'] as const
  },
  {
    label:
      'format comment/synopsis, s:0 timebase, v:0 extradata_size ┬╖ select_streams v:0 + extradata_size',
    includes: ['select_streams v:0', 'extradata_size', 'initial_padding'] as const
  },
  {
    label:
      'format comment/synopsis, s:0 timebase, v:0 extradata_size ┬╖ select_streams s:0 + stream=bit_rate',
    includes: ['select_streams s:0', 'stream=bit_rate', '-of default=nw=1:nk=1'] as const
  },
  {
    label:
      'format comment/synopsis, s:0 timebase, v:0 extradata_size ┬╖ select_streams v:0 + stream_tags=BPS,DURATION',
    includes: ['select_streams v:0', 'stream_tags=BPS,DURATION'] as const
  },
  {
    label:
      'format comment/synopsis, s:0 timebase, v:0 extradata_size ┬╖ select_streams s:0 + stream_tags=duration',
    includes: ['select_streams s:0', 'stream_tags=duration', 'default=nw=1:nk=1'] as const
  },
  {
    label:
      'v:0 stream creation_time, format handler_name, acodec copy null ┬╖ select_streams v:0 + stream_tags=creation_time',
    includes: ['select_streams v:0', 'stream_tags=creation_time', 'default=nw=1:nk=1'] as const
  },
  {
    label:
      'v:0 stream creation_time, format handler_name, acodec copy null ┬╖ -acodec copy + -vn -sn',
    includes: ['-acodec copy', '-vn -sn', '-t 3 -f null -'] as const
  },
  {
    label:
      'a:0 bits_per_raw_sample, v:0 index+codec_name ┬╖ select_streams a:0 + bits_per_raw_sample',
    includes: ['select_streams a:0', 'bits_per_raw_sample', 'default=nw=1:nk=1'] as const
  }
]
