import { existsSync, mkdtempSync, readFileSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it } from 'vitest'

import {
  appendYtdlpDownloadHistoryEntry,
  clearYtdlpDownloadHistory,
  outcomeFromQueueStatus,
  readYtdlpDownloadHistoryNewestFirst,
  YTDLP_DOWNLOAD_HISTORY_SCHEMA
} from '../../src/main/ytdlp-download-history'

const tempRoots: string[] = []

function makeTempRoot(): string {
  const dir = mkdtempSync(join(tmpdir(), 'fluxalloy-history-'))
  tempRoots.push(dir)
  return dir
}

afterEach(() => {
  while (tempRoots.length > 0) {
    const dir = tempRoots.pop()
    if (dir && existsSync(dir)) {
      rmSync(dir, { recursive: true, force: true })
    }
  }
})

describe('outcomeFromQueueStatus', () => {
  it('маппит финальные статусы очереди §6.1', () => {
    expect(outcomeFromQueueStatus('Готово')).toBe('success')
    expect(outcomeFromQueueStatus('Отменено')).toBe('cancelled')
    expect(outcomeFromQueueStatus('Ошибка (код 1)')).toBe('error')
    expect(outcomeFromQueueStatus('Ошибка: spawn failed')).toBe('error')
  })

  it('игнорирует пробелы по краям', () => {
    expect(outcomeFromQueueStatus('  Готово  ')).toBe('success')
    expect(outcomeFromQueueStatus('\tОтменено\n')).toBe('cancelled')
  })
})

describe('ytdlp download history persistence', () => {
  it('добавляет запись и читает новые первыми', () => {
    const root = makeTempRoot()

    appendYtdlpDownloadHistoryEntry(root, {
      id: 'a',
      startedAt: 1,
      finishedAt: 2,
      url: 'https://example.com/a',
      shortLabel: 'A',
      outcome: 'success',
      status: 'Готово',
      exitCode: 0,
      errorHint: null,
      outputPath: join(root, 'downloads', 'ytdlp', 'a.mp4')
    })
    appendYtdlpDownloadHistoryEntry(root, {
      id: 'b',
      startedAt: 3,
      finishedAt: 4,
      url: 'https://example.com/b',
      shortLabel: 'B',
      outcome: 'error',
      status: 'Ошибка',
      exitCode: 1,
      errorHint: 'ERROR: fail'
    })

    const newest = readYtdlpDownloadHistoryNewestFirst(root)
    expect(newest.map((entry) => entry.id)).toEqual(['b', 'a'])
    expect(newest[1].outputPath).toBe(join(root, 'downloads', 'ytdlp', 'a.mp4'))
  })

  it('очищает историю через валидный schema-файл', () => {
    const root = makeTempRoot()

    appendYtdlpDownloadHistoryEntry(root, {
      id: 'a',
      startedAt: 1,
      finishedAt: 2,
      url: 'https://example.com/a',
      shortLabel: 'A',
      outcome: 'success',
      status: 'Готово',
      exitCode: 0,
      errorHint: null
    })
    clearYtdlpDownloadHistory(root)

    const raw = JSON.parse(readFileSync(join(root, 'downloads', 'history.json'), 'utf-8')) as {
      schema: unknown
      entries: unknown
    }
    expect(raw).toEqual({ schema: YTDLP_DOWNLOAD_HISTORY_SCHEMA, entries: [] })
    expect(readYtdlpDownloadHistoryNewestFirst(root)).toEqual([])
  })
})
