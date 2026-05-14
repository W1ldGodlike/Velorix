/**
 * Adds "(поле …)" gloss inside summary strings that mention flux-ytdlp-*.txt
 * when missing. Does not change fullLine. Safe to run repeatedly.
 *
 * Usage: node scripts/inject-flux-summary-pole.mjs
 *        npm run locales:terminal-flux-pole
 *
 * Prefer `npm run locales:terminal-summaries-ru` so URL→ссылка runs before this gloss.
 */
import fs from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const p = join(__dirname, '../src/shared/terminal-contract.ts')

export function glossFluxPrintToFileSummary(inner) {
  if (!inner.includes('flux-ytdlp') || inner.includes('(поле ')) return inner
  let t = inner

  t = t.replace(/^Записать поле (\w+) в /, 'Записать (поле $1) в ')
  t = t.replace(/^Записать поле (\w+) \(/, 'Записать (поле $1) (')
  t = t.replace(
    /^Записать поле миниатюры \(thumbnail, (?:URL обложки|ссылка на обложку)\) в /,
    'Записать ссылку на обложку (поле thumbnail) в '
  )
  t = t.replace(/^Записать id ролика в /, 'Записать идентификатор ролика (поле id) в ')
  t = t.replace('(extractor)', '(поле extractor)')
  t = t.replace('(acodec)', '(поле acodec)')
  t = t.replace('(vcodec)', '(поле vcodec)')
  t = t.replace(/\(heatmap;/g, '(поле heatmap;')
  t = t.replace(/\((tbr), kbps\) в (flux-ytdlp)/g, '(поле $1, kbps) в $2')
  t = t.replace(/\(([a-z][a-z0-9_]*)\) в (flux-ytdlp)/gi, '(поле $1) в $2')
  t = t.replace(
    /^Записать fps выбранного формата в /,
    'Записать частоту кадров (поле fps) выбранного формата в '
  )
  t = t.replace(
    /^Записать protocol выбранного формата \(/,
    'Записать протокол транспорта (поле protocol; варианты: '
  )
  t = t.replace(/^Записать availability \(/, 'Записать строку доступности (поле availability; ')
  t = t.replace(
    /^Записать abr выбранного формата \(аудио kbps\) в /,
    'Записать средний битрейт аудио (поле abr; kbps) в '
  )
  t = t.replace(
    /^Записать vbr выбранного формата \(видео kbps\) в /,
    'Записать средний битрейт видео (поле vbr; kbps) в '
  )
  t = t.replace(/\((_type:)/g, '(поле _type:')
  t = t.replace(
    /^Записать прямой URL выбранного формата в /,
    'Записать прямую ссылку на поток (поле url) выбранного формата в '
  )
  t = t.replace(
    /^Записать прямую ссылку на поток выбранного формата в /,
    'Записать прямую ссылку на поток выбранного формата (поле url) в '
  )
  t = t.replace(/^Записать список форматов \(JSON/i, 'Записать список форматов (поле formats; JSON')
  t = t.replace(
    /^Записать словарь миниатюр \(thumbnails/i,
    'Записать словарь миниатюр (поле thumbnails;'
  )
  t = t.replace(
    /^Записать audio_ext выбранного формата \(/,
    'Записать расширение аудио (поле audio_ext) выбранного формата ('
  )
  t = t.replace(
    /^Записать video_ext выбранного формата \(/,
    'Записать расширение видео (поле video_ext) выбранного формата ('
  )
  t = t.replace(
    /^Записать человекочитаемую строку выбранного формата \(format\)/,
    'Записать человекочитаемую строку выбранного формата (поле format)'
  )
  t = t.replace(
    /^Записать миниатюру \(thumbnail, (?:URL обложки|основной URL обложки|основная ссылка на обложку|ссылка на обложку)\)/,
    'Записать миниатюру (поле thumbnail; основная ссылка на обложку)'
  )
  t = t.replace(
    /^Записать (\w+) в отдельный (flux-ytdlp[^\s;]+)/,
    'Записать (поле $1) в отдельный $2'
  )

  if (!/^Записать \(поле /.test(t)) {
    t = t.replace(/^Записать (\w+) \(/, 'Записать (поле $1) (')
  }
  if (!/^Записать \(поле /.test(t)) {
    t = t.replace(/^Записать ([a-z][a-z0-9_]*) в (flux-ytdlp)/i, 'Записать (поле $1) в $2')
  }

  return t
}

function main() {
  let s = fs.readFileSync(p, 'utf8')
  const summaryRe = /summary: '((?:[^'\\]|\\.)*)'/g
  let glossHits = 0
  s = s.replace(summaryRe, (full, inner) => {
    const next = glossFluxPrintToFileSummary(inner)
    if (next !== inner) {
      glossHits++
      return `summary: '${next}'`
    }
    return full
  })

  fs.writeFileSync(p, s, 'utf8')
  console.log('OK', p, 'summaries glossed:', glossHits)
}

const ranAsCli = process.argv[1]?.replace(/\\/g, '/').endsWith('inject-flux-summary-pole.mjs')
if (ranAsCli) main()
