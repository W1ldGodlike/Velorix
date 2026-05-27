/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §2.1/§3 — macOS/Linux: на целевом хосте — `prepare-engines-unix`; иначе подсказки.
 * Usage: node scripts/prepare-engines-bundled-first.mjs mac|linux [--help]
 */
import { stat } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { BUNDLED_UNIX_BIN_FILES } from './engines-bundled-sha256.mjs'

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const binDir = join(rootDir, 'bin')

const PLATFORMS = {
  mac: {
    label: 'macOS',
    packScript: 'pack:mac:dir',
    verifyScript: 'verify:mac-unpacked',
    helpArticle: 'Help/ru/packaged-macos-smoke.md'
  },
  linux: {
    label: 'Linux',
    packScript: 'pack:linux:dir',
    verifyScript: 'verify:linux-unpacked',
    helpArticle: 'Help/ru/packaged-linux-smoke.md'
  }
}

function printHelp(platformKey) {
  const p = PLATFORMS[platformKey]
  console.log(`prepare-engines-bundled-first (${p.label}) — на ${p.label}-хосте: сетевая загрузка в ${binDir}.

1. npm run engines:prepare:${platformKey}  (yt-dlp + BtbN ffmpeg tar.xz)
2. npm run engines:doctor  (verify + --version)
3. npm run build && npm run ${p.packScript} && npm run ${p.verifyScript}
4. UI packaged smoke + owner-hardware-checklist (§21 e2e в Support ZIP)

См. bin/README.md, ${p.helpArticle}, docs/BUNDLED_ENGINES_LICENSES.md.

npm:
  npm run engines:prepare:${platformKey}
  npm run engines:prepare:${platformKey} -- --help`)
}

async function logBinStatus() {
  const missing = []
  for (const { file } of BUNDLED_UNIX_BIN_FILES) {
    const full = join(binDir, file)
    try {
      const s = await stat(full)
      if (!s.isFile() || s.size === 0) {
        missing.push(file)
      } else {
        console.log(`[engines] bin/${file}: ok (${s.size} bytes)`)
      }
    } catch {
      missing.push(file)
    }
  }
  if (missing.length > 0) {
    console.log(`[engines] отсутствуют: ${missing.join(', ')}`)
  } else {
    console.log('[engines] все три бинарника в bin/ — можно npm run engines:doctor')
  }
}

async function main() {
  const platformKey = process.argv[2]
  if (!platformKey || !PLATFORMS[platformKey]) {
    console.error('Usage: node scripts/prepare-engines-bundled-first.mjs mac|linux [--help]')
    process.exit(1)
  }
  if (process.argv.includes('--help')) {
    printHelp(platformKey)
    return
  }

  const hostOk =
    (platformKey === 'mac' && process.platform === 'darwin') ||
    (platformKey === 'linux' && process.platform === 'linux')
  if (hostOk) {
    const { runUnixEnginePrepare } = await import('./prepare-engines-unix.mjs')
    await runUnixEnginePrepare(platformKey)
    await logBinStatus()
    return
  }

  printHelp(platformKey)
  await logBinStatus()
}

main()
