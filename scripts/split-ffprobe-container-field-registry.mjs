/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'node:fs'
import path from 'node:path'

const sharedDir = path.join('src/shared')
const srcPath = path.join(sharedDir, 'ffprobe-container-field-registry.ts')
const lines = fs.readFileSync(srcPath, 'utf8').split(/\r?\n/)

const header = lines.slice(0, 20).join('\n')

const parseBody = lines.slice(21, 248).join('\n')
const formatBody = lines.slice(249, 844).join('\n')

fs.writeFileSync(
  path.join(sharedDir, 'ffprobe-container-field-registry-parse.ts'),
  `${header}

${parseBody}
`
)

fs.writeFileSync(
  path.join(sharedDir, 'ffprobe-container-field-registry-format.ts'),
  `import type { MediaProbeSuccess } from './ffprobe-contract'
import {
  type FfprobeSummaryLocale,
  type FfprobeSummaryStrings,
  formatFfprobeBitrateLabelFromKbps,
  ffprobeSummaryFill,
  ffprobeSummaryStrings
} from './ffprobe-summary-export-locale'
import { formatFfprobeStreamStartTime } from './ffprobe-stream-start-time'
import { formatFfprobeTickCount } from './ffprobe-stream-duration-ts'
import {
  formatFfprobeContainerTimeBaseCompact,
  parseFfprobeNontrivialTimeBase
} from './ffprobe-stream-time-base'
import { formatProbeChapterTimecode } from './ffprobe-timecode'

${formatBody}
`
)

const entry = `/**
 * §9 — поля \`format.*\` (не tags): parse + export из locale-шаблонов.
 * Скалярные \`format.tags.*\` — \`ffprobe-format-tag-registry.ts\`.
 */
export type { FfprobeFormatJsonSlice } from './ffprobe-container-field-registry-parse'
export {
  parseFfprobeContainerFieldsFromFormat,
  parseFfprobeFormatBitRateKbps,
  parseFfprobeFormatCompatibleBrands,
  parseFfprobeFormatCreationTime,
  parseFfprobeFormatDurationSec,
  parseFfprobeFormatDurationTs,
  parseFfprobeFormatFilename,
  parseFfprobeFormatFlags,
  parseFfprobeFormatMajorBrand,
  parseFfprobeFormatNbPrograms,
  parseFfprobeFormatNbStreams,
  parseFfprobeFormatProbeScore,
  parseFfprobeFormatProbeSize,
  parseFfprobeFormatSize,
  parseFfprobeFormatStartTimeSec,
  parseFfprobeFormatTimeBase
} from './ffprobe-container-field-registry-parse'
export {
  collectFfprobeContainerScalarExportLines,
  ffprobeContainerFilenameBasename,
  formatFfprobeContainerBitRateCompact,
  formatFfprobeContainerBitRateExportLine,
  formatFfprobeContainerBrandExportLine,
  formatFfprobeContainerCreationTimeExportLine,
  formatFfprobeContainerDiagnosticsCompactLine,
  formatFfprobeContainerDiagnosticsExportLine,
  formatFfprobeContainerDurationSecCompact,
  formatFfprobeContainerDurationSecExportLine,
  formatFfprobeContainerDurationTsCompact,
  formatFfprobeContainerDurationTsExportLine,
  formatFfprobeContainerFilenameCompact,
  formatFfprobeContainerFilenameExportLine,
  formatFfprobeContainerFormatFlagsCompact,
  formatFfprobeContainerFormatFlagsExportLine,
  formatFfprobeContainerOffsetTimingCompactLine,
  formatFfprobeContainerOffsetTimingExportLine,
  formatFfprobeContainerProbeLayoutCompactLine,
  formatFfprobeContainerProbeLayoutExportLine,
  formatFfprobeContainerProbeSizeCompact,
  formatFfprobeContainerProbeSizeExportLine,
  formatFfprobeContainerSizeCompact,
  formatFfprobeContainerSizeExportLine,
  formatFfprobeContainerStartOffsetCompactLine,
  formatFfprobeContainerStartOffsetExportLine,
  formatFfprobeContainerStartTimeCompact,
  formatFfprobeContainerStartTimeExportLine,
  formatFfprobeContainerStartTimeRealExportLine,
  formatFfprobeContainerTimeBaseExportLine,
  formatFfprobeContainerTimingProbeCompactLine,
  formatFfprobeContainerTimingProbeExportLine,
  formatFfprobeFormatFlagsExportLine,
  formatFfprobeNbProgramsExportLine,
  formatFfprobeNbStreamsExportLine,
  formatFfprobeProbeScoreExportLine
} from './ffprobe-container-field-registry-format'
`

fs.writeFileSync(srcPath, entry)
console.log('[split-ffprobe-container-field-registry] parse + format + entry')
