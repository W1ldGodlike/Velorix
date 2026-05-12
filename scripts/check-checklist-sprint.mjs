import { readFileSync } from 'node:fs'

const checklistPath = 'IMPLEMENTATION_CHECKLIST.md'
const text = readFileSync(checklistPath, 'utf8')

const startMarker = '## Ближайший TODO спринта'
const start = text.indexOf(startMarker)
if (start < 0) {
  console.error('[checklist] missing sprint TODO heading')
  process.exit(1)
}

const afterStart = text.slice(start + startMarker.length)
const end = afterStart.indexOf('\n---')
if (end < 0) {
  console.error('[checklist] sprint TODO block must end before ---')
  process.exit(1)
}

const block = afterStart.slice(0, end)
const todoLines = block
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter((line) => /^- \[[x~ !]\]/.test(line))

const maxTodoLines = 7
const minTodoLines = 3
const maxLineChars = 220

if (todoLines.length < minTodoLines || todoLines.length > maxTodoLines) {
  console.error(
    `[checklist] sprint TODO must contain ${minTodoLines}-${maxTodoLines} items, got ${todoLines.length}`
  )
  process.exit(1)
}

const tooLong = todoLines.find((line) => line.length > maxLineChars)
if (tooLong) {
  console.error(`[checklist] sprint TODO item exceeds ${maxLineChars} chars: ${tooLong}`)
  process.exit(1)
}

const archiveMarkers = [
  '805',
  '161',
  '67',
  'сценарные подсказки',
  'в т.ч.',
  'уже есть;',
  'в сводке дорожки —'
]
const archived = todoLines.find((line) => archiveMarkers.some((marker) => line.includes(marker)))
if (archived) {
  console.error(`[checklist] sprint TODO looks like an archive/changelog item: ${archived}`)
  process.exit(1)
}

console.log(`[checklist] OK (${todoLines.length} sprint TODO items)`)
