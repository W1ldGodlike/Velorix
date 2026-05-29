/** Mock terminal UI for ref.9 (not backend model). */

import type { ProcessingNavSlug } from './processing-ref1-data'

export const TERMINAL_ACTIVE_NAV: ProcessingNavSlug = 'terminal'

export const TERMINAL_CENTER_SUMMARY =
  'FFmpeg Logs · NVENC · 3840×2160 · speed 1.00x · автопрокрутка' as const

export const TERMINAL_TABS = [
  { id: 'ffmpeg', label: 'FFmpeg Logs', count: 16, active: true },
  { id: 'system', label: 'System Console', count: 248 },
  { id: 'live', label: 'Live Output', count: 1 },
  { id: 'debug', label: 'Debug', count: 42 }
] as const

export const TERMINAL_LOG_SUMMARY = '16 строк · автопрокрутка' as const

export const TERMINAL_STATUS_READY = 'Готово · 16 строк' as const

export type TerminalStatusAccent = 'cyan' | 'magenta'

export type TerminalStatusRow = {
  label: string
  value: string
  accent?: TerminalStatusAccent
  mono?: boolean
}

export const TERMINAL_STATUS_ROWS: readonly TerminalStatusRow[] = [
  {
    label: 'Проект',
    value: 'НОВЫЙ СЕЗОН.vlxr · 01:36:53:08 · 3840×2160 (4K)',
    mono: true
  },
  { label: 'Движки', value: 'FFmpeg 6.1.1 · NVIDIA GeForce RTX 4080', accent: 'cyan' }
]

export const TERMINAL_LOG_LINES = [
  'ffmpeg version 6.1.1 Copyright (c) 2000-2023 the FFmpeg developers',
  '  built with gcc 12.2.0 (Rev10, Built by MSYS2 project)',
  '  configuration: --enable-gpl --enable-version3 --enable-cuda --enable-nvenc',
  'Input #0, mov,mp4,m4a,3gp,3g2,mj2, from city_night_4k.mp4:',
  '  Duration: 00:05:32.18, start: 0.000000, bitrate: 62400 kb/s',
  '  Stream #0:0[0x1](und): Video: h264 (High) (avc1), yuv420p, 3840x2160, 60 fps',
  '  Stream #0:1[0x2](und): Audio: aac (LC) (mp4a), 48000 Hz, stereo, fltp, 320 kb/s',
  'Stream mapping:',
  '  Stream #0:0 -> #0:0 (h264 (native) -> h264 (h264_nvenc))',
  '  Stream #0:1 -> #0:1 (aac (native) -> aac (native))',
  'Output #0, mp4, to output_city_night.mp4:',
  '  Stream #0:0: Video: h264 (Main) (avc1), yuv420p, 3840x2160, q=2-31, 60 fps',
  '  Stream #0:1: Audio: aac (LC) (mp4a), 48000 Hz, stereo, fltp, 320 kb/s',
  'frame=  612 fps= 60 q=-0.0 size= 51200kB time=00:00:10.20 bitrate=41100.2kbits/s speed=1.00x',
  'frame=  724 fps= 60 q=-0.0 size= 59392kB time=00:00:12.04 bitrate=40715.7kbits/s speed=1.00x',
  '[h264_nvenc @ 0x7f8a2c001800] NVENC: encoding success'
] as const

export const TERMINAL_RAIL = {
  logLevel: 'Инфо ▾',
  colorOutput: true,
  timestamps: true,
  autoscroll: true,
  limitLines: false,
  maxLines: '10 000',
  errorsOnly: false,
  includeFilter: '',
  excludeFilter: '',
  saveToFile: false,
  savePath: 'logs/terminal.log'
} as const
