#!/usr/bin/env node
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/** One-shot: import 13 ref PNGs from Cursor assets → docs/reference (1920×1080 PNG). */
import { statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

import sharp from 'sharp'

import { REPO_ROOT } from '../lib/repo-root.mjs'

const ASSETS = join(
  'C:',
  'Users',
  'truno',
  '.cursor',
  'projects',
  'c-Users-truno-Velorix',
  'assets'
)
const REF_DIR = join(REPO_ROOT, 'docs', 'reference')
const TARGET_W = 1920
const TARGET_H = 1080

/** @type {Array<{ needle: string, ref: string, screen: string, target: string }>} */
const MAP = [
  {
    needle: '1_________-14904f2f',
    ref: 'ref.1',
    screen: 'Обработка',
    target: 'velorix-neon-reference-processing.png'
  },
  {
    needle: '2_________-3a57f567',
    ref: 'ref.2',
    screen: 'Загрузки',
    target: 'velorix-neon-reference-downloads.png'
  },
  {
    needle: '3_________-3d3be565',
    ref: 'ref.3',
    screen: 'Терминал',
    target: 'velorix-neon-reference-terminal.png'
  },
  {
    needle: '4________-57747ff1',
    ref: 'ref.4',
    screen: 'История',
    target: 'velorix-neon-reference-history.png'
  },
  {
    needle: '5____________-a0c8fb92',
    ref: 'ref.5',
    screen: 'Планировщик',
    target: 'velorix-neon-reference-planner.png'
  },
  {
    needle: '6_____________-8ae601e9',
    ref: 'ref.6',
    screen: 'База знаний',
    target: 'velorix-neon-reference-knowledge.png'
  },
  {
    needle: '7__________-19892bb4',
    ref: 'ref.7',
    screen: 'Настройки',
    target: 'velorix-neon-reference-settings.png'
  },
  {
    needle: '8_________-98d512be',
    ref: 'ref.8',
    screen: 'Сценарии',
    target: 'velorix-neon-reference-scenarios.png'
  },
  {
    needle: '9__________-bb0e3647',
    ref: 'ref.9',
    screen: 'Инспектор',
    target: 'velorix-neon-reference-inspector.png'
  },
  {
    needle: '10____________-10beb101',
    ref: 'ref.10',
    screen: 'Инструменты',
    target: 'velorix-neon-reference-tools.png'
  },
  {
    needle: '11____________-2c82f97e',
    ref: 'ref.11',
    screen: 'О программе',
    target: 'velorix-neon-reference-about.png'
  },
  {
    needle: '12____________________-987641a4',
    ref: 'ref.12',
    screen: 'Обслуживание файлов',
    target: 'velorix-neon-reference-file-maintenance.png'
  },
  {
    needle: '13________________________-896a88a1',
    ref: 'ref.13',
    screen: 'Конвертация изображений',
    target: 'velorix-neon-reference-image-conversion.png'
  }
]

/** @param {string} filePath */
async function metaOf(filePath) {
  const m = await sharp(filePath).metadata()
  return {
    width: m.width ?? 0,
    height: m.height ?? 0,
    format: m.format ?? 'unknown',
    bytes: statSync(filePath).size
  }
}

async function main() {
  const { readdirSync } = await import('node:fs')
  const assetFiles = readdirSync(ASSETS)

  /** @type {Array<Record<string, unknown>>} */
  const report = []

  for (const row of MAP) {
    const srcName = assetFiles.find((f) => f.includes(row.needle))
    if (!srcName) {
      throw new Error(`asset not found for ${row.ref}: ${row.needle}`)
    }
    const srcPath = join(ASSETS, srcName)
    const destPath = join(REF_DIR, row.target)

    let oldMeta = null
    try {
      oldMeta = await metaOf(destPath)
    } catch {
      oldMeta = { width: 0, height: 0, format: 'missing', bytes: 0 }
    }

    const srcMeta = await metaOf(srcPath)
    await sharp(srcPath)
      .resize(TARGET_W, TARGET_H, { fit: 'fill', kernel: sharp.kernel.lanczos3 })
      .png({ compressionLevel: 6 })
      .toFile(destPath)

    const newMeta = await metaOf(destPath)
    report.push({
      ref: row.ref,
      screen: row.screen,
      target: `docs/reference/${row.target}`,
      sourceAsset: srcName,
      old: oldMeta,
      sourceUploaded: srcMeta,
      new: newMeta
    })
  }

  const out = join(REPO_ROOT, '.neon-ref-visual', 'ref-import-report.json')
  writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`)
  console.log(`[import-neon-refs] wrote ${report.length} refs → ${REF_DIR}`)
  console.log(`[import-neon-refs] report → ${out}`)
  for (const r of report) {
    const old = r.old
    const neu = r.new
    console.log(
      `${r.ref} ${r.target}: ${old.width}x${old.height} ${old.format} → ${neu.width}x${neu.height} ${neu.format}`
    )
  }
}

main().catch((err) => {
  console.error('[import-neon-refs] ERROR:', err instanceof Error ? err.message : err)
  process.exit(1)
})
