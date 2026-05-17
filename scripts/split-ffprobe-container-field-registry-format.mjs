import fs from 'node:fs'
import path from 'node:path'

const sharedDir = path.join('src/shared')
const srcPath = path.join(sharedDir, 'ffprobe-container-field-registry-format.ts')
const lines = fs.readFileSync(srcPath, 'utf8').split(/\r?\n/)

const formatImports = `import type { MediaProbeSuccess } from './ffprobe-contract'
import {
  type FfprobeSummaryLocale,
  type FfprobeSummaryStrings,
  formatFfprobeBitrateLabelFromKbps,
  ffprobeSummaryFill,
  ffprobeSummaryStrings
} from './ffprobe-summary-export-locale'
import { formatFfprobeStreamStartTime } from './ffprobe-stream-start-time'
import { formatFfprobeContainerTimeBaseCompact } from './ffprobe-stream-time-base'
import { formatProbeChapterTimecode } from './ffprobe-timecode'
`

let scalarBody = [...lines.slice(12, 177), ...lines.slice(238, 251), ...lines.slice(590)].join('\n')
scalarBody = scalarBody.replace(
  /^function formatScalarTemplateExportLineFromValue/m,
  'export function formatScalarTemplateExportLineFromValue'
)

const timingBody = [...lines.slice(177, 238), ...lines.slice(252, 589)].join('\n')

const timingImports = `${formatImports}
import {
  formatFfprobeContainerBitRateCompact,
  formatFfprobeContainerBitRateExportLine,
  formatFfprobeContainerFilenameCompact,
  formatFfprobeContainerFormatFlagsCompact,
  formatFfprobeContainerSizeCompact,
  formatFfprobeFormatFlagsExportLine,
  formatFfprobeNbProgramsExportLine,
  formatFfprobeNbStreamsExportLine,
  formatFfprobeProbeScoreExportLine,
  formatScalarTemplateExportLineFromValue
} from './ffprobe-container-field-registry-format-scalar'
`

fs.writeFileSync(
  path.join(sharedDir, 'ffprobe-container-field-registry-format-scalar.ts'),
  `${formatImports}
${scalarBody}
`
)

fs.writeFileSync(
  path.join(sharedDir, 'ffprobe-container-field-registry-format-timing.ts'),
  `${timingImports}
${timingBody}
`
)

const entry = `export {
  collectFfprobeContainerScalarExportLines,
  ffprobeContainerFilenameBasename,
  formatFfprobeContainerBitRateCompact,
  formatFfprobeContainerBitRateExportLine,
  formatFfprobeContainerCreationTimeExportLine,
  formatFfprobeContainerFilenameCompact,
  formatFfprobeContainerFormatFlagsCompact,
  formatFfprobeContainerSizeCompact,
  formatFfprobeFormatFlagsExportLine,
  formatFfprobeNbProgramsExportLine,
  formatFfprobeNbStreamsExportLine,
  formatFfprobeProbeScoreExportLine
} from './ffprobe-container-field-registry-format-scalar'
export {
  formatFfprobeContainerBrandExportLine,
  formatFfprobeContainerDiagnosticsCompactLine,
  formatFfprobeContainerDiagnosticsExportLine,
  formatFfprobeContainerDurationSecCompact,
  formatFfprobeContainerDurationSecExportLine,
  formatFfprobeContainerDurationTsCompact,
  formatFfprobeContainerDurationTsExportLine,
  formatFfprobeContainerFilenameExportLine,
  formatFfprobeContainerOffsetTimingCompactLine,
  formatFfprobeContainerOffsetTimingExportLine,
  formatFfprobeContainerProbeLayoutCompactLine,
  formatFfprobeContainerProbeLayoutExportLine,
  formatFfprobeContainerProbeSizeCompact,
  formatFfprobeContainerProbeSizeExportLine,
  formatFfprobeContainerSizeExportLine,
  formatFfprobeContainerStartOffsetCompactLine,
  formatFfprobeContainerStartOffsetExportLine,
  formatFfprobeContainerStartTimeCompact,
  formatFfprobeContainerStartTimeExportLine,
  formatFfprobeContainerStartTimeRealExportLine,
  formatFfprobeContainerTimeBaseExportLine,
  formatFfprobeContainerTimingProbeCompactLine,
  formatFfprobeContainerTimingProbeExportLine
} from './ffprobe-container-field-registry-format-timing'
`

fs.writeFileSync(srcPath, entry)
console.log('[split-ffprobe-container-field-registry-format] scalar + timing + entry')
