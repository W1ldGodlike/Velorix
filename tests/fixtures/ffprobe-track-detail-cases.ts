import type { FfprobeStreamFixture } from './ffprobe-track-rows-helpers'

export type FfprobeTrackDetailCase = {
  label: string
  streams: FfprobeStreamFixture[]
  duration: number | null
  row: number
  contains: string[]
  notContains?: string[]
  notMatch?: RegExp
}

export const FFPROBE_TRACK_DETAIL_CASES: readonly FfprobeTrackDetailCase[] = [
  {
    label: 'audio FourCC mp4a',
    streams: [
      {
        index: 1,
        codec_type: 'audio',
        codec_name: 'aac',
        channels: 2,
        sample_rate: '48000',
        channel_layout: 'stereo',
        codec_tag_string: 'mp4a'
      }
    ],
    duration: 120,
    row: 0,
    contains: ['mp4a']
  },
  {
    label: 'audio без FourCC — нет N/A',
    streams: [
      {
        index: 0,
        codec_type: 'audio',
        codec_name: 'flac',
        channels: 2,
        sample_rate: '44100'
      }
    ],
    duration: null,
    row: 0,
    contains: [],
    notMatch: /\bN\/A\b/i
  },
  {
    label: 'audio hex codec_tag',
    streams: [
      {
        index: 0,
        codec_type: 'audio',
        codec_name: 'aac',
        channels: 2,
        sample_rate: '48000',
        codec_tag_string: '[0][0][0][0]',
        codec_tag: '0x6134706d'
      }
    ],
    duration: null,
    row: 0,
    contains: ['tag 0x6134706d'],
    notContains: ['[0][0][0][0]']
  },
  {
    label: 'video exdata',
    streams: [
      {
        index: 0,
        codec_type: 'video',
        codec_name: 'h264',
        width: 1280,
        height: 720,
        extradata_size: 42
      }
    ],
    duration: null,
    row: 0,
    contains: ['exdata 42 B']
  },
  {
    label: 'video max_bit_rate peak RU',
    streams: [
      {
        index: 0,
        codec_type: 'video',
        codec_name: 'h264',
        width: 1920,
        height: 1080,
        bit_rate: '5000000',
        max_bit_rate: '12000000'
      }
    ],
    duration: null,
    row: 0,
    contains: ['max 12.00 Мбит/с']
  },
  {
    label: 'video max≈bit — без max',
    streams: [
      {
        index: 0,
        codec_type: 'video',
        codec_name: 'h264',
        width: 1280,
        height: 720,
        bit_rate: '5000000',
        max_bit_rate: '5050000'
      }
    ],
    duration: null,
    row: 0,
    contains: [],
    notMatch: /\bmax\b/i
  },
  {
    label: 'audio only max_bit_rate',
    streams: [
      {
        index: 1,
        codec_type: 'audio',
        codec_name: 'aac',
        channels: 2,
        sample_rate: '48000',
        max_bit_rate: '320000'
      }
    ],
    duration: null,
    row: 0,
    contains: ['max 320 кбит/с']
  },
  {
    label: 'video closed_captions',
    streams: [
      {
        index: 0,
        codec_type: 'video',
        codec_name: 'h264',
        width: 1280,
        height: 720,
        closed_captions: 1
      }
    ],
    duration: null,
    row: 0,
    contains: ['CEA-608/708']
  },
  {
    label: 'H.264 is_avc=0 Annex-B',
    streams: [
      {
        index: 0,
        codec_type: 'video',
        codec_name: 'h264',
        width: 1920,
        height: 1080,
        is_avc: 0
      }
    ],
    duration: null,
    row: 0,
    contains: ['Annex-B']
  },
  {
    label: 'H.264 is_avc=1 без Annex-B',
    streams: [
      {
        index: 0,
        codec_type: 'video',
        codec_name: 'h264',
        width: 1920,
        height: 1080,
        is_avc: 1
      }
    ],
    duration: null,
    row: 0,
    contains: [],
    notContains: ['Annex-B']
  },
  {
    label: 'ticks_per_frame>1',
    streams: [
      {
        index: 0,
        codec_type: 'video',
        codec_name: 'mpeg2video',
        width: 720,
        height: 576,
        ticks_per_frame: 2
      }
    ],
    duration: null,
    row: 0,
    contains: ['tpf 2']
  },
  {
    label: 'ticks_per_frame=1 без tpf',
    streams: [
      {
        index: 0,
        codec_type: 'video',
        codec_name: 'h264',
        width: 1280,
        height: 720,
        ticks_per_frame: 1
      }
    ],
    duration: null,
    row: 0,
    contains: [],
    notMatch: /\btpf\b/
  },
  {
    label: 'video bpc + coded WxH',
    streams: [
      {
        index: 0,
        codec_type: 'video',
        codec_name: 'h264',
        width: 1280,
        height: 720,
        coded_width: 1920,
        coded_height: 1080,
        bits_per_coded_sample: 8
      }
    ],
    duration: null,
    row: 0,
    contains: ['bpc 8-bit', 'coded 1920×1080']
  },
  {
    label: 'audio bpc',
    streams: [
      {
        index: 0,
        codec_type: 'audio',
        codec_name: 'pcm_s16le',
        channels: 2,
        sample_rate: '48000',
        bits_per_coded_sample: 16
      }
    ],
    duration: null,
    row: 0,
    contains: ['bpc 16-bit']
  },
  {
    label: 'video pix_fmt yuv420p10le',
    streams: [
      {
        index: 0,
        codec_type: 'video',
        codec_name: 'hevc',
        width: 3840,
        height: 2160,
        pix_fmt: 'yuv420p10le'
      }
    ],
    duration: null,
    row: 0,
    contains: ['yuv420p10le']
  },
  {
    label: 'video yuv420p без дубля pix_fmt',
    streams: [
      {
        index: 0,
        codec_type: 'video',
        codec_name: 'h264',
        width: 1280,
        height: 720,
        pix_fmt: 'yuv420p'
      }
    ],
    duration: null,
    row: 0,
    contains: [],
    notContains: ['yuv420p']
  },
  {
    label: 'PRFT AV1 side_data',
    streams: [
      {
        index: 0,
        codec_type: 'video',
        codec_name: 'av1',
        width: 1920,
        height: 1080,
        side_data_list: [
          { side_data_type: 'Producer Reference Time', pts: '123456' },
          { side_data_type: 'AV1 film grain params' }
        ]
      }
    ],
    duration: null,
    row: 0,
    contains: ['PRFT 123456', 'AV1 film grain']
  }
]
