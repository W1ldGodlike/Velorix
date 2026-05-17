/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { execSync } from 'node:child_process'
import fs from 'node:fs'

const rel = 'tests/main/ytdlp-progress-parser.test.ts'
const lines = execSync(`git show HEAD:${rel}`, { encoding: 'utf8' }).split(/\r?\n/)

function sliceBody(ranges) {
  return ranges.map(([from, to]) => lines.slice(from - 1, to).join('\n')).join('\n\n')
}

const slices = [
  {
    out: 'tests/main/ytdlp-progress-parser-download.test.ts',
    header: `import { describe, expect, it } from 'vitest'

import {
  YTDLP_PROGRESS_EQUAL_CASES,
  YTDLP_PROGRESS_NULL_LINES
} from '../fixtures/ytdlp-progress-parse-cases'
import {
  parseYtdlpDownloadProgressLine,
  parseYtdlpQueueFormatHint
} from '../../src/main/ytdlp-progress-parser'
`,
    ranges: [
      [28, 91],
      [318, 331]
    ]
  },
  {
    out: 'tests/main/ytdlp-progress-parser-info-display.test.ts',
    header: `import { describe, expect, it } from 'vitest'

import {
  YTDLP_PROGRESS_PERCENT_NUMBER_CASES,
  YTDLP_SPEED_TO_BPS_CASES
} from '../fixtures/ytdlp-progress-parse-cases'
import {
  displayLabelFromYtdlpOutputPath,
  formatTorrentStyleSpeedFromBps,
  formatYtdlpProgressCell,
  parseYtdlpInfoDownloadingTitlePrefix,
  parseYtdlpInfoFormatSnippet,
  parseYtdlpInfoQueueSizeHint,
  parseYtdlpProgressPercentNumber,
  parseYtdlpQueueFormatHint,
  parseYtdlpSpeedToBytesPerSec
} from '../../src/main/ytdlp-progress-parser'
`,
    ranges: [[93, 245]]
  },
  {
    out: 'tests/main/ytdlp-progress-parser-queue-failure.test.ts',
    header: `import { describe, expect, it } from 'vitest'

import {
  classifyYtdlpQueueFailureKind,
  extractYtdlpErrorSummary,
  formatYtdlpProgressCell,
  formatYtdlpQueueFailureStatus,
  shouldSkipQueueRetriesForFailureKind,
  shouldSkipYtdlpQueueRetriesAfterFailure
} from '../../src/main/ytdlp-progress-parser'
`,
    ranges: [
      [246, 317],
      [332, 497]
    ]
  },
  {
    out: 'tests/main/ytdlp-progress-parser-output-path.test.ts',
    header: `import { describe, expect, it } from 'vitest'

import { extractYtdlpOutputPath } from '../../src/main/ytdlp-progress-parser'
`,
    ranges: [[498, 608]]
  }
]

for (const { out, header, ranges } of slices) {
  fs.writeFileSync(out, `${header}\n${sliceBody(ranges)}\n`)
}

fs.unlinkSync(rel)
console.log('split ytdlp-progress-parser.test OK')
