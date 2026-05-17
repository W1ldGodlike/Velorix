import { describe, expect, it } from 'vitest'

import {
  buildChapterRowsFromFfprobeJson,
  isFfprobeChaptersArrayOkForSmoke
} from '../../src/shared/ffprobe-chapters'

describe('ffprobe-chapters', () => {
  it('пустой или не массив → []', () => {
    expect(buildChapterRowsFromFfprobeJson(undefined)).toEqual([])
    expect(buildChapterRowsFromFfprobeJson(null)).toEqual([])
    expect(buildChapterRowsFromFfprobeJson({})).toEqual([])
  })

  it('парсит start_time / end_time и title', () => {
    const rows = buildChapterRowsFromFfprobeJson([
      {
        id: 2,
        start_time: '10.250000',
        end_time: '90.000000',
        tags: { title: 'Вступление' }
      }
    ])
    expect(rows).toEqual([{ index: 2, startSec: 10.25, endSec: 90, title: 'Вступление' }])
  })

  it('сортирует по startSec', () => {
    const rows = buildChapterRowsFromFfprobeJson([
      { id: 1, start_time: '5', end_time: '10' },
      { id: 0, start_time: '0', end_time: '5' }
    ])
    expect(rows.map((r) => r.index)).toEqual([0, 1])
  })

  it('isFfprobeChaptersArrayOkForSmoke', () => {
    expect(isFfprobeChaptersArrayOkForSmoke(undefined)).toBe(true)
    expect(
      isFfprobeChaptersArrayOkForSmoke([
        { id: 0, start_time: '0', end_time: '10', tags: { title: 'Intro' } }
      ])
    ).toBe(true)
    expect(isFfprobeChaptersArrayOkForSmoke([{ start_time: 'bad', end_time: '1' }])).toBe(false)
    expect(isFfprobeChaptersArrayOkForSmoke([{}])).toBe(true)
    expect(isFfprobeChaptersArrayOkForSmoke('not-array')).toBe(false)
    expect(isFfprobeChaptersArrayOkForSmoke([{ tags: 'bad' }])).toBe(false)
  })

  it('подставляет порядковый id при отсутствии поля id', () => {
    const rows = buildChapterRowsFromFfprobeJson([
      { start_time: '0', end_time: '1' },
      { start_time: '1', end_time: '2' }
    ])
    expect(rows[0]?.index).toBe(0)
    expect(rows[1]?.index).toBe(1)
  })
})
