import fs from 'node:fs'
import path from 'node:path'

const outDir = path.join('src/main')
const lines = fs
  .readFileSync(path.join(outDir, 'ytdlp-progress-parser-queue.ts'), 'utf8')
  .split(/\r?\n/)

const unquoteFn = lines
  .slice(396, 403)
  .join('\n')
  .replace(/^function unquoteYtdlpPath/, 'export function unquoteYtdlpPath')

const infoBody = [...lines.slice(6, 30), '', unquoteFn, '', ...lines.slice(30, 162)].join('\n')

const failureBlock = lines.slice(163, 395).join('\n')
const pathBlock = lines.slice(408, 541).join('\n')

const infoImports = `import type { AppUiLocale } from '../shared/app-ui-locale'
import { getYtdlpQueueProgressStrings } from '../shared/ytdlp-queue-progress-locale'

`

const failureImports = `import type { AppUiLocale } from '../shared/app-ui-locale'
import { getYtdlpQueueProgressStrings } from '../shared/ytdlp-queue-progress-locale'
import { YTDLP_QUEUE_STATUS_ERROR_PREFIX } from '../shared/ytdlp-queue-status'

import type { YtdlpQueueFailureKind } from './ytdlp-progress-parser-download'

`

const pathImports = `import { unquoteYtdlpPath } from './ytdlp-progress-parser-queue-info'

`

fs.writeFileSync(
  path.join(outDir, 'ytdlp-progress-parser-queue-info.ts'),
  `${infoImports}${infoBody}\n`
)

fs.writeFileSync(
  path.join(outDir, 'ytdlp-progress-parser-queue-failure.ts'),
  `${failureImports}${failureBlock}\n`
)

fs.writeFileSync(
  path.join(outDir, 'ytdlp-progress-parser-queue-path.ts'),
  `${pathImports}${pathBlock}\n`
)

const barrel = `export {
  parseYtdlpInfoDownloadingTitlePrefix,
  parseYtdlpInfoFormatSnippet,
  parseYtdlpQueueFormatHint,
  parseYtdlpInfoQueueSizeHint
} from './ytdlp-progress-parser-queue-info'
export {
  formatYtdlpQueueFailureStatus,
  classifyYtdlpQueueFailureKind,
  shouldSkipQueueRetriesForFailureKind,
  shouldSkipYtdlpQueueRetriesAfterFailure,
  extractYtdlpErrorSummary
} from './ytdlp-progress-parser-queue-failure'
export { extractYtdlpOutputPath } from './ytdlp-progress-parser-queue-path'
`

fs.writeFileSync(path.join(outDir, 'ytdlp-progress-parser-queue.ts'), barrel)
console.log('split ytdlp-progress-parser-queue OK')
