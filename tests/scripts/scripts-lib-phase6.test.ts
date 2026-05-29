import { spawnSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

const node = process.execPath

function runScriptsLibSelfCheck(): { status: number | null; output: string } {
  const script = `
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { REPO_ROOT, readRepoUtf8 } from './scripts/lib/repo-root.mjs';
import { WIN_ENGINE_EXE_OPTS, WIN_ENGINE_EXE_OPTS_APP, WIN_ENGINE_EXE_OPTS_LARGE } from './scripts/lib/win-exec-file-opts.mjs';

const pkg = readFileSync(join(REPO_ROOT, 'package.json'), 'utf8');
if (!WIN_ENGINE_EXE_OPTS.windowsHide || !WIN_ENGINE_EXE_OPTS_LARGE.maxBuffer || !WIN_ENGINE_EXE_OPTS_APP.timeout) throw new Error('win-exec-file-opts');
if (!pkg.includes('"name": "velorix"')) throw new Error('REPO_ROOT');
if (!readRepoUtf8('package.json').includes('velorix')) throw new Error('readRepoUtf8');
console.log('[scripts-lib] OK');
`
  const result = spawnSync(node, ['--input-type=module', '-e', script], {
    cwd: process.cwd(),
    encoding: 'utf8',
    windowsHide: true
  })
  return {
    status: result.status,
    output: `${result.stdout ?? ''}${result.stderr ?? ''}`
  }
}

describe('scripts/lib (phase 6)', () => {
  it('repo-root + win-exec-file-opts — node self-check', () => {
    const { status, output } = runScriptsLibSelfCheck()
    expect(status).toBe(0)
    expect(output).toContain('[scripts-lib] OK')
  })
})
