/* eslint-disable @typescript-eslint/explicit-function-return-type -- one-shot maint script */
/**
 * One-shot §21: move all src/main/*.ts into domain folders under services/, bootstrap/, windows/, etc.
 * Rewrites relative imports across src/ and tests/.
 *
 * Usage: node scripts/maint/restructure-main-services.mjs
 */
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync
} from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const MAIN_ROOT = join(REPO_ROOT, 'src', 'main')

/** @type {Array<{ test: (name: string) => boolean, dir: string }>} */
const RULES = [
  { test: (n) => n === 'index.ts', dir: '.' },
  {
    test: (n) => /^main-application-bootstrap/.test(n) || n === 'main-bootstrap-ipc-helpers.ts',
    dir: 'bootstrap'
  },
  { test: (n) => /^main-application-menu/.test(n), dir: 'menu' },
  {
    test: (n) =>
      /^main-window/.test(n) ||
      /^downloads-window/.test(n) ||
      /^inspector-window/.test(n) ||
      /^mini-player/.test(n) ||
      n === 'main-inspector-window-bootstrap.ts' ||
      n === 'window-bounds.ts' ||
      n === 'window-hidpi.ts' ||
      n === 'window-title-locale.ts' ||
      n === 'main-downloads-window-bounds-bootstrap.ts',
    dir: 'windows'
  },
  { test: (n) => n === 'main-ffmpeg-export-batch-host.ts', dir: 'services/ffmpeg' },
  { test: (n) => n === 'main-ytdlp-download-main-handler.ts', dir: 'services/ytdlp' },
  {
    test: (n) => /^register-downloads/.test(n) || n === 'downloads-log-ipc.ts',
    dir: 'ipc/downloads'
  },
  { test: (n) => /^external-filter-script/.test(n), dir: 'services/ffmpeg' },
  { test: (n) => /^register-external-filter/.test(n), dir: 'ipc' },
  {
    test: (n) =>
      /^settings-/.test(n) ||
      n === 'main-cached-settings-host.ts' ||
      n === 'main-ytdlp-settings-persist.ts',
    dir: 'services/settings'
  },
  { test: (n) => /^presets-/.test(n), dir: 'services/presets' },
  { test: (n) => /^ytdlp-/.test(n), dir: 'services/ytdlp' },
  { test: (n) => /^ffmpeg-/.test(n), dir: 'services/ffmpeg' },
  { test: (n) => /^ffprobe-/.test(n), dir: 'services/ffprobe' },
  { test: (n) => /^terminal-/.test(n), dir: 'services/terminal' },
  { test: (n) => /^engine-/.test(n), dir: 'services/engines' },
  { test: (n) => /^workflow-/.test(n), dir: 'services/workflow' },
  { test: (n) => /^downloads-/.test(n), dir: 'services/downloads' },
  {
    test: (n) =>
      /^diagnostics-/.test(n) || n === 'main-diagnostics-service.ts' || /^support-bundle/.test(n),
    dir: 'services/diagnostics'
  },
  { test: (n) => /^processing-history/.test(n), dir: 'services/history' },
  { test: (n) => n === 'knowledge-service.ts', dir: 'services/knowledge' },
  {
    test: (n) =>
      /^windows-/.test(n) ||
      /^macos-/.test(n) ||
      /^linux-/.test(n) ||
      n === 'scheduled-task-os-sync.ts' ||
      n === 'watch-folder-scan-main.ts',
    dir: 'services/platform'
  },
  { test: (n) => /^preview-/.test(n), dir: 'services/preview' },
  { test: (n) => n === 'about-info.ts', dir: 'services/about' },
  { test: (n) => n === 'media-file-hash-runner.ts', dir: 'services/media' },
  {
    test: (n) =>
      n === 'app-data-root.ts' ||
      n === 'app-data-root-paths.ts' ||
      n === 'app-paths.ts' ||
      n === 'app-session-store.ts' ||
      n === 'logger-service.ts' ||
      n === 'process-stream-buffer.ts' ||
      n === 'external-url.ts' ||
      n === 'external-process-log.ts' ||
      n === 'media-protocol.ts' ||
      n === 'help-assets-protocol.ts' ||
      n === 'preload-resolve.ts' ||
      n === 'export-progress-broadcast.ts' ||
      n === 'trusted-hashes-store.ts' ||
      n === 'gpu-adapter-names-probe.ts' ||
      n === 'nvidia-smi-gpu-info-probe.ts' ||
      n === 'nvidia-smi-gpu-util-probe.ts' ||
      n === 'system-gpu-load-sampler.ts' ||
      n === 'main-export-output-paths.ts',
    dir: 'core'
  }
]

function classify(basename) {
  for (const { test, dir } of RULES) {
    if (test(basename)) {
      return dir
    }
  }
  throw new Error(`restructure-main-services: no rule for ${basename}`)
}

function walkTsFiles(dir, out = []) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, ent.name)
    if (ent.isDirectory()) {
      if (ent.name === 'node_modules') {
        continue
      }
      walkTsFiles(p, out)
    } else if (ent.name.endsWith('.ts')) {
      out.push(p)
    }
  }
  return out
}

function toPosix(p) {
  return p.split(sep).join('/')
}

function resolveImport(fromFile, spec) {
  if (!spec.startsWith('.')) {
    return null
  }
  const base = resolve(dirname(fromFile), spec)
  const candidates = [base, `${base}.ts`, join(base, 'index.ts')]
  for (const c of candidates) {
    if (existsSync(c)) {
      return c
    }
  }
  return null
}

function relImport(fromFile, targetFile) {
  let r = toPosix(relative(dirname(fromFile), targetFile))
  if (!r.startsWith('.')) {
    r = `./${r}`
  }
  return r.replace(/\.ts$/, '')
}

/** @type {Map<string, string>} old abs -> new abs */
const relocation = new Map()

function planMoves() {
  const rootFiles = readdirSync(MAIN_ROOT, { withFileTypes: true })
    .filter((e) => e.isFile() && e.name.endsWith('.ts'))
    .map((e) => join(MAIN_ROOT, e.name))

  for (const abs of rootFiles) {
    const base = abs.slice(MAIN_ROOT.length + 1)
    const dir = classify(base)
    if (dir === '.') {
      continue
    }
    const dest = join(MAIN_ROOT, dir, base)
    relocation.set(abs, dest)
  }
}

function applyMoves() {
  for (const [from, to] of relocation) {
    mkdirSync(dirname(to), { recursive: true })
    renameSync(from, to)
  }
}

const IMPORT_RE = /from\s+(['"])(\.[^'"]+)\1/g

function rewriteFile(filePath) {
  let text = readFileSync(filePath, 'utf8')
  let changed = false
  text = text.replace(IMPORT_RE, (full, q, spec) => {
    const resolved = resolveImport(filePath, spec)
    if (!resolved) {
      return full
    }
    const moved = relocation.get(resolved)
    if (!moved) {
      return full
    }
    const nextSpec = relImport(filePath, moved)
    changed = true
    return `from ${q}${nextSpec}${q}`
  })
  if (changed) {
    writeFileSync(filePath, text, 'utf8')
  }
}

function main() {
  planMoves()
  console.log(`[restructure-main-services] planned moves: ${relocation.size}`)
  applyMoves()
  const scanRoots = [join(REPO_ROOT, 'src'), join(REPO_ROOT, 'tests')]
  for (const root of scanRoots) {
    for (const f of walkTsFiles(root)) {
      rewriteFile(f)
    }
  }
  console.log('[restructure-main-services] done')
}

main()
