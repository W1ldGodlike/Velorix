/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'node:fs'
import path from 'node:path'

const sharedDir = path.join('src/shared')
const srcPath = path.join(sharedDir, 'ffprobe-container-field-registry-format-timing.ts')
const lines = fs.readFileSync(srcPath, 'utf8').split(/\r?\n/)

const header = lines.slice(0, 22).join('\n')
const layoutBody = lines.slice(23, 209).join('\n')
const metricsBody = lines.slice(210).join('\n')

const metricsImports = [
  'import {',
  '  formatFfprobeContainerFilenameExportLine,',
  '  formatFfprobeContainerProbeLayoutCompactLine,',
  '  formatFfprobeContainerProbeLayoutExportLine,',
  '  formatFfprobeContainerStartOffsetCompactLine,',
  '  formatFfprobeContainerStartOffsetExportLine,',
  '  formatFfprobeContainerStartTimeCompact,',
  '  formatFfprobeContainerStartTimeExportLine',
  "} from './ffprobe-container-field-registry-format-timing-layout'"
].join('\n')

fs.writeFileSync(
  path.join(sharedDir, 'ffprobe-container-field-registry-format-timing-layout.ts'),
  [header, layoutBody].join('\n')
)

fs.writeFileSync(
  path.join(sharedDir, 'ffprobe-container-field-registry-format-timing-metrics.ts'),
  [header, metricsImports, metricsBody].join('\n')
)

const entry = `export {
  formatFfprobeContainerBrandExportLine,
  formatFfprobeContainerFilenameExportLine,
  formatFfprobeContainerProbeLayoutCompactLine,
  formatFfprobeContainerProbeLayoutExportLine,
  formatFfprobeContainerSizeExportLine,
  formatFfprobeContainerStartOffsetCompactLine,
  formatFfprobeContainerStartOffsetExportLine,
  formatFfprobeContainerStartTimeCompact,
  formatFfprobeContainerStartTimeExportLine
} from './ffprobe-container-field-registry-format-timing-layout'
export {
  formatFfprobeContainerDiagnosticsCompactLine,
  formatFfprobeContainerDiagnosticsExportLine,
  formatFfprobeContainerDurationSecCompact,
  formatFfprobeContainerDurationSecExportLine,
  formatFfprobeContainerDurationTsCompact,
  formatFfprobeContainerDurationTsExportLine,
  formatFfprobeContainerOffsetTimingCompactLine,
  formatFfprobeContainerOffsetTimingExportLine,
  formatFfprobeContainerProbeSizeCompact,
  formatFfprobeContainerProbeSizeExportLine,
  formatFfprobeContainerStartTimeRealExportLine,
  formatFfprobeContainerTimeBaseExportLine,
  formatFfprobeContainerTimingProbeCompactLine,
  formatFfprobeContainerTimingProbeExportLine
} from './ffprobe-container-field-registry-format-timing-metrics'
`

fs.writeFileSync(srcPath, entry)
console.log('[split-ffprobe-container-field-registry-format-timing] layout + metrics + entry')
