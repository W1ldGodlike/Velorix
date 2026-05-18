import { execSync } from 'node:child_process'
import fs from 'node:fs'

const rel = 'src/main/ytdlp-download-options.ts'
const lines = execSync(`git show HEAD:${rel}`, { encoding: 'utf8' }).split(/\r?\n/)

const preview = `import { isAbsolute, normalize } from 'path'

import { resolveYtdlpOutputDirectory } from './ytdlp-download-output'

${lines.slice(45, 104).join('\n')}
`

const validate = `import { existsSync, statSync } from 'fs'
import { isAbsolute, join, normalize, relative, resolve, sep } from 'path'

import type { AppUiLocale } from '../shared/app-ui-locale'
import { getYtdlpCliValidationCopy } from '../shared/ytdlp-cli-validation-locale'
${lines.slice(173, 277).join('\n')}

${lines.slice(279, 347).join('\n')}
`

const snapshotFixed = `import { existsSync, statSync } from 'fs'
import { isAbsolute, join, normalize } from 'path'

import type { AppSettings } from './settings-store'
import type { AppUiLocale } from '../shared/app-ui-locale'
import { getYtdlpCliValidationCopy } from '../shared/ytdlp-cli-validation-locale'
import {
  buildYtdlpFormatPresetChoices,
  buildYtdlpQueueRetryProfileChoices
} from '../shared/ytdlp-download-payload-locale'
import type {
  YtdlpCookiesBrowserId,
  YtdlpDownloadOptionsPayload,
  YtdlpFormatPresetId,
  YtdlpImpersonateId,
  YtdlpQueueRetryProfileId,
  YtdlpSubtitlePresetId
} from '../shared/ytdlp-download-contract'
import {
  buildYtdlpSpawnArgvTokens,
  formatArgvTokensForPreview,
  parseExtraYtdlpArgsLine,
  validateYtdlpCookiesBrowserProfile
} from './ytdlp-extra-args'
import { getYtdlpCommandHints } from './ytdlp-commands-hints'
import {
  parseYtdlpCookiesBrowser,
  parseYtdlpFormatPreset,
  parseYtdlpImpersonate,
  parseYtdlpSubtitlePreset
} from '../shared/ytdlp-download-stored-parse'
import { parseYtdlpQueueRetryProfile } from './ytdlp-queue-retry'
import type { YtdlpCommandPreviewContext } from './ytdlp-download-options-preview'
import { sanitizeYtdlpPreviewUrl } from './ytdlp-download-options-preview'
import {
  resolveSafeYtdlpOutputPattern,
  validateFilenameTemplate,
  validateYtdlpFragmentRetriesLine,
  validateYtdlpRateLimit,
  validateYtdlpRetriesLine,
  validateYtdlpSubLangs
} from './ytdlp-download-options-validate'

${lines.slice(105, 165).join('\n')}

${lines.slice(348, 594).join('\n')}
`

const entry = `export type {
  YtdlpCommandHintEntry,
  YtdlpCookiesBrowserId,
  YtdlpDownloadOptionsPatch,
  YtdlpDownloadOptionsPayload,
  YtdlpFormatPresetId,
  YtdlpImpersonateId,
  YtdlpQueueRetryProfileId,
  YtdlpSubtitlePresetId
} from '../shared/ytdlp-download-contract'

export {
  parseYtdlpCookiesBrowser,
  parseYtdlpFormatPreset,
  parseYtdlpImpersonate,
  parseYtdlpSubtitlePreset
} from '../shared/ytdlp-download-stored-parse'

export { parseYtdlpFilenameTemplateStored } from '../shared/ytdlp-download-stored-parse'

export type { YtdlpCommandPreviewContext } from './ytdlp-download-options-preview'
export {
  buildYtdlpCommandPreviewContext,
  normalizeYtdlpPreviewOutputDirectory,
  sanitizeYtdlpPreviewUrl
} from './ytdlp-download-options-preview'

export {
  resolveSafeYtdlpOutputPattern,
  validateFilenameTemplate,
  validateYtdlpCookiesFilePath,
  validateYtdlpFragmentRetriesLine,
  validateYtdlpRateLimit,
  validateYtdlpRetriesLine,
  validateYtdlpSubLangs
} from './ytdlp-download-options-validate'

export {
  YTDLP_DEFAULT_FILENAME_TEMPLATE,
  buildYtdlpRunOptionsSnapshot,
  formatPresetToExtraArgs,
  payloadFromSnapshot
} from './ytdlp-download-options-snapshot'
export type { YtdlpRunOptionsSnapshot } from './ytdlp-download-options-snapshot'
`

fs.writeFileSync('src/main/ytdlp-download-options-preview.ts', preview)
fs.writeFileSync('src/main/ytdlp-download-options-validate.ts', validate)
fs.writeFileSync('src/main/ytdlp-download-options-snapshot.ts', snapshotFixed)
fs.writeFileSync(rel, entry)
console.log('split ytdlp-download-options OK')
