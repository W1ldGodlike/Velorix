/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * §2.1/§3 — bundled-first каркас для macOS/Linux (без авто-загрузки; только подсказки).
 * Usage: node scripts/prepare-engines-bundled-first.mjs mac|linux [--help]
 */
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

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
  console.log(`prepare-engines-bundled-first (${p.label}) — bundled-first, без сетевой загрузки.

1. Положите ffmpeg, ffprobe, yt-dlp в ${binDir} (без .exe).
2. npm run engines:doctor  (verify + SHA256 + --version)
3. npm run build && npm run ${p.packScript} && npm run ${p.verifyScript}
4. UI packaged smoke + owner-manual-smoke (§21 e2e в Support ZIP)

См. bin/README.md, ${p.helpArticle}, docs/BUNDLED_ENGINES_LICENSES.md.

npm:
  npm run engines:prepare:${platformKey}
  npm run engines:prepare:${platformKey} -- --help`)
}

function main() {
  const platformKey = process.argv[2]
  if (!platformKey || !PLATFORMS[platformKey]) {
    console.error('Usage: node scripts/prepare-engines-bundled-first.mjs mac|linux [--help]')
    process.exit(1)
  }
  if (process.argv.includes('--help')) {
    printHelp(platformKey)
    return
  }
  printHelp(platformKey)
}

main()
