/** §8 — ffprobe/ffmpeg по текущему превью (сборка из частей). */
import { TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_01 } from './terminal-contract-hints-preview-media-01'
import { TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_02 } from './terminal-contract-hints-preview-media-02'
import { TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_03 } from './terminal-contract-hints-preview-media-03'
import { TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_04 } from './terminal-contract-hints-preview-media-04'
import { TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_05 } from './terminal-contract-hints-preview-media-05'
import { TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_06 } from './terminal-contract-hints-preview-media-06'
import { TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_07 } from './terminal-contract-hints-preview-media-07'
import { TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_08 } from './terminal-contract-hints-preview-media-08'

export const TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA = [
  ...TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_01,
  ...TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_02,
  ...TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_03,
  ...TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_04,
  ...TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_05,
  ...TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_06,
  ...TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_07,
  ...TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA_PART_08
] as const
