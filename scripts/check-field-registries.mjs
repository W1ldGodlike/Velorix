/* eslint-disable @typescript-eslint/explicit-function-return-type */
/**
 * Запрещает возврат копипасты там, где уже есть data-driven реестр.
 */
import { readFileSync, readdirSync } from 'node:fs'

const failures = []

const containerFormat = readFileSync('src/shared/ffprobe-container-format.ts', 'utf8')
if (/export function parseFfprobeFormat\w+Tag\b/.test(containerFormat)) {
  failures.push(
    'ffprobe-container-format.ts: не добавлять parseFfprobeFormat*Tag — только ffprobe-format-tag-registry.ts'
  )
}
if (/export function parseFfprobeFormat/.test(containerFormat)) {
  failures.push(
    'ffprobe-container-format.ts: parse — только ffprobe-container-field-registry.ts (re-export)'
  )
}

const containerRegistry = readFileSync('src/shared/ffprobe-container-field-registry.ts', 'utf8')
if (/export function formatFfprobe\w+ExportLine/.test(containerRegistry)) {
  const simple = (containerRegistry.match(/export function formatFfprobe\w+ExportLine/g) ?? [])
    .length
  const table = containerRegistry.includes('FFPROBE_CONTAINER_SCALAR_EXPORT_SPECS')
  if (simple > 6 && !table) {
    failures.push(
      'ffprobe-container-field-registry.ts: слишком много format*ExportLine без таблицы спецификаций'
    )
  }
}

const exportService = readFileSync('src/main/ffmpeg-export-service.ts', 'utf8')
if (/if\s*\(\s*raw\s*===\s*'light'\s*\|\|\s*raw\s*===\s*'medium'/.test(exportService)) {
  failures.push(
    'ffmpeg-export-service.ts: whitelist-парсеры — только ffmpeg-export-parse-registry.ts'
  )
}

const settingsStore = readFileSync('src/main/settings-store.ts', 'utf8')
if (/if\s*\(\s*raw\s*===\s*'[^']+'\s*\|\|/.test(settingsStore)) {
  failures.push(
    'settings-store.ts: whitelist stored — только settings-stored-parse.ts / parseWhitelistEnum'
  )
}

const testsDir = 'tests'
function walkTests(dir) {
  const out = []
  for (const name of readdirSync(dir, { withFileTypes: true })) {
    const p = `${dir}/${name.name}`
    if (name.isDirectory()) {
      if (name.name !== 'fixtures') {
        out.push(...walkTests(p))
      }
      continue
    }
    if (/\.test\.ts$/.test(name.name)) {
      out.push(p)
    }
  }
  return out
}
for (const testFile of walkTests(testsDir)) {
  const t = readFileSync(testFile, 'utf8')
  if (/const\s+probeBase:\s*MediaProbeSuccess\s*=\s*\{/.test(t)) {
    failures.push(`${testFile}: probeBase — tests/fixtures/media-probe-success-base.ts`)
  }
}

const resolveFromSettings = readFileSync('src/main/ffmpeg-export-resolve-from-settings.ts', 'utf8')
const resolveRawBlocks = [
  ...resolveFromSettings.matchAll(/const \w+Raw = raw\['([^']+)'\]/g)
].map((m) => m[1])
const allowedResolveRawKeys = new Set(['twoPass', 'extraArgsLine'])
const illegalResolveRaw = resolveRawBlocks.filter((k) => !allowedResolveRawKeys.has(k))
if (illegalResolveRaw.length > 0) {
  failures.push(
    `ffmpeg-export-resolve-from-settings.ts: лишние resolve-блоки (${illegalResolveRaw.join(', ')}) — только ffmpeg-export-resolve-field-registry.ts`
  )
}

if (failures.length > 0) {
  for (const f of failures) {
    console.error(`[field-registries] ${f}`)
  }
  process.exit(1)
}

console.log('[field-registries] OK')
