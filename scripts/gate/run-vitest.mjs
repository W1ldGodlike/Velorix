/* eslint-disable @typescript-eslint/explicit-function-return-type */
/** Vitest gate: one line on success; full output on failure. */
import { spawn } from 'node:child_process'

const npxCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx'

function runVitest() {
  return new Promise((resolve) => {
    const child = spawn(npxCmd, ['vitest', 'run', '--reporter=dot', '--silent'], {
      cwd: process.cwd(),
      windowsHide: true,
      shell: process.platform === 'win32',
      stdio: ['ignore', 'pipe', 'pipe']
    })
    let output = ''
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk) => {
      output += chunk
    })
    child.stderr.on('data', (chunk) => {
      output += chunk
    })
    child.on('error', (error) => {
      resolve({ code: 1, output: error.message })
    })
    child.on('close', (code) => {
      resolve({ code: code ?? 1, output })
    })
  })
}

const result = await runVitest()
if (result.code !== 0) {
  console.error('[test] FAILED')
  process.stderr.write(result.output)
  process.exit(result.code)
}

const files = result.output.match(/Test Files\s+(\d+) passed/)?.[1]
const tests = result.output.match(/Tests\s+(\d+) passed/)?.[1]
const summary =
  files && tests
    ? `${files} files, ${tests} tests`
    : result.output.match(/Tests\s+(.+)/)?.[1]?.trim()
console.log(summary ? `[test] OK (${summary})` : '[test] OK')
