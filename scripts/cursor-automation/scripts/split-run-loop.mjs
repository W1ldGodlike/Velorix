/* eslint-disable @typescript-eslint/explicit-function-return-type */
import fs from 'node:fs'
import path from 'node:path'

const srcDir = path.join('scripts', 'cursor-automation', 'src')
const srcPath = path.join(srcDir, 'run-loop.ts')
const lines = fs.readFileSync(srcPath, 'utf8').split(/\r?\n/)

const cliImports = `import { existsSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

import { promptsDirDefault, stopFlagPath } from './paths.js'
import { readBooleanSetting, readIntegerSetting, SDK_AUTOMATION_SETTINGS } from './sdk-settings.js'
`

const retryImports = `import { CursorAgentError } from '@cursor/sdk'

import { readBooleanSetting, readIntegerSetting, SDK_AUTOMATION_SETTINGS } from './sdk-settings.js'
`

const verboseImports = `import { readBooleanSetting, readIntegerSetting, SDK_AUTOMATION_SETTINGS } from './sdk-settings.js'
`

function exportFunctions(body) {
  return body
    .replace(/^interface /gm, 'export interface ')
    .replace(/^async function /gm, 'export async function ')
    .replace(/^function /gm, 'export function ')
}

const cliBody = exportFunctions(lines.slice(10, 136).join('\n'))
const stopBody = exportFunctions(lines.slice(320, 336).join('\n'))
const retryBody = exportFunctions(lines.slice(137, 320).join('\n'))
const verboseBody = exportFunctions(lines.slice(337, 471).join('\n'))
const mainBody = lines.slice(471).join('\n')

fs.writeFileSync(
  path.join(srcDir, 'run-loop-cli.ts'),
  `${cliImports}
${cliBody}

${stopBody}
`
)

fs.writeFileSync(
  path.join(srcDir, 'run-loop-retry.ts'),
  `${retryImports}
${retryBody}
`
)

fs.writeFileSync(
  path.join(srcDir, 'run-loop-verbose.ts'),
  `${verboseImports}
${verboseBody}
`
)

fs.writeFileSync(
  path.join(srcDir, 'run-loop.ts'),
  `import 'dotenv/config'

import { Agent, CursorAgentError, type AgentOptions } from '@cursor/sdk'

import { automationRoot, projectRoot, stopFlagPath } from './paths.js'
import { readBooleanSetting, readIntegerSetting, SDK_AUTOMATION_SETTINGS } from './sdk-settings.js'
import {
  ensureStopFlagFile,
  loadPrompt,
  parseArgs,
  readStdinIfNotTty,
  shouldStopByFlag
} from './run-loop-cli.js'
import {
  readRunErrorRetryConfig,
  readStepRetryLimits,
  runStepWithRetries,
  runWithConnectionRetries,
  sleep
} from './run-loop-retry.js'
import {
  buildSessionRestartPrompt,
  normalizeVerboseMode,
  streamVerboseAssistantText,
  warnIfExpensiveSessionConfig
} from './run-loop-verbose.js'

${mainBody}
`
)

console.log('[split-run-loop] cli + retry + verbose + main')
