/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { spawn } from 'node:child_process'

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const maxFailureOutputChars = Number.parseInt(process.env.CHECK_QUIET_FAILURE_CHARS ?? '80000', 10)

/** Daily gate: product checks + doc guards used by scripts (no duplicate Vitest execSync wrappers). */
const steps = [
  ['lint', ['run', 'lint']],
  ['line-endings', ['run', 'check:line-endings']],
  ['maint-scripts-layout', ['run', 'check:maint-scripts-layout']],
  ['scripts-wiring', ['run', 'check:scripts-wiring']],
  ['typecheck', ['run', 'typecheck']],
  ['test', ['run', 'test']],
  ['trusted-hashes', ['run', 'check:trusted-hashes']],
  ['rules-explicit', ['run', 'check:rules-explicit']],
  ['field-registries', ['run', 'check:field-registries']],
  ['locales-json', ['run', 'check:locales-json']],
  ['locales-ts-overlap', ['run', 'check:locales-ts-overlap']],
  ['packaged-manual-smoke-parity', ['run', 'check:packaged-manual-smoke-parity']],
  ['owner-visual-smoke-locale', ['run', 'check:owner-visual-smoke-locale']],
  ['platform-packaging-scripts', ['run', 'check:platform-packaging-scripts']],
  ['help-smoke-guards-package-json', ['run', 'check:help-smoke-guards-package-json']],
  ['help-workflow-smoke-crosslinks', ['run', 'check:help-workflow-smoke-crosslinks']],
  ['help-owner-smoke-docs', ['run', 'check:help-owner-smoke-docs']],
  ['help-packaged-smoke-docs', ['run', 'check:help-packaged-smoke-docs']],
  ['help-terminal-hints-docs', ['run', 'check:help-terminal-hints-docs']],
  ['packaged-e2e-scenarios-registry', ['run', 'check:packaged-e2e-scenarios-registry']],
  ['terminal-hints-guards-package-json', ['run', 'check:terminal-hints-guards-package-json']],
  ['terminal-contract-hints-shards', ['run', 'check:terminal-contract-hints-shards']],
  ['terminal-hints-locale', ['run', 'check:terminal-hints-locale']],
  ['support-bundle-terminal-hints', ['run', 'check:support-bundle-terminal-hints']],
  ['ui-copy-quality', ['run', 'check:ui-copy-quality']],
  ['audit:copy-paste', ['run', 'audit:copy-paste']],
  ['audit:ipc-architecture', ['run', 'audit:ipc-architecture']],
  ['audit:structural', ['run', 'audit:structural']],
  ['journal', ['run', 'check:journal']],
  ['docs-governance', ['run', 'check:docs-governance']],
  ['ui-surfaces-guard', ['run', 'check:ui-surfaces-guard']],
  ['native-main-platform-guard', ['run', 'check:native-main-platform-guard']],
  ['renderer-state-approach', ['run', 'check:renderer-state-approach']],
  ['tz-artifacts', ['run', 'check:tz-artifacts']],
  ['checklist', ['run', 'check:checklist']],
  ['secrets', ['run', 'check:secrets']]
]

function trimFailureOutput(text) {
  if (!Number.isFinite(maxFailureOutputChars) || maxFailureOutputChars <= 0) {
    return text
  }
  if (text.length <= maxFailureOutputChars) {
    return text
  }
  return `... output truncated to last ${maxFailureOutputChars} chars ...\n${text.slice(-maxFailureOutputChars)}`
}

function summarizeSuccess(name, output) {
  if (name === 'test') {
    const files = output.match(/Test Files\s+(.+)/)?.[1]?.trim()
    const tests = output.match(/Tests\s+(.+)/)?.[1]?.trim()
    const parts = [files, tests].filter(Boolean)
    return parts.length > 0 ? parts.join('; ') : 'OK'
  }
  const okLine = output
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .reverse()
    .find((line) => /\bOK\b|\bok\b|passed|успеш/i.test(line))
  return okLine ?? 'OK'
}

function runStep(name, args) {
  return new Promise((resolve) => {
    const child = spawn(npmCmd, args, {
      cwd: process.cwd(),
      windowsHide: true,
      shell: process.platform === 'win32',
      stdio: ['ignore', 'pipe', 'pipe']
    })
    let stdout = ''
    let stderr = ''
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk) => {
      stdout += chunk
    })
    child.stderr.on('data', (chunk) => {
      stderr += chunk
    })
    child.on('error', (error) => {
      resolve({ name, code: 1, output: error.message })
    })
    child.on('close', (code) => {
      resolve({ name, code: code ?? 1, output: `${stdout}${stderr}` })
    })
  })
}

for (const [name, args] of steps) {
  const result = await runStep(name, args)
  if (result.code !== 0) {
    console.error(`[check:quiet] ${name} FAILED (exit ${result.code})`)
    console.error(trimFailureOutput(result.output))
    process.exit(result.code)
  }
  console.log(`[check:quiet] ${name}: ${summarizeSuccess(name, result.output)}`)
}

console.log('[check:quiet] OK')
