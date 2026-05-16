/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { spawn } from 'node:child_process'

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const maxFailureOutputChars = Number.parseInt(process.env.CHECK_QUIET_FAILURE_CHARS ?? '80000', 10)

const steps = [
  ['lint', ['run', 'lint']],
  ['typecheck', ['run', 'typecheck']],
  ['test', ['run', 'test']],
  ['trusted-hashes', ['run', 'check:trusted-hashes']],
  ['rules-explicit', ['run', 'check:rules-explicit']],
  ['field-registries', ['run', 'check:field-registries']],
  ['audit:copy-paste', ['run', 'audit:copy-paste']],
  ['journal', ['run', 'check:journal']],
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
