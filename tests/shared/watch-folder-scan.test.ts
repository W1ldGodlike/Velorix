import { describe, expect, it } from 'vitest'

import {
  collectWatchFolderMediaEntries,
  detectNewWatchFolderFiles,
  type WatchFolderDirEntry
} from '../../src/shared/watch-folder-scan'

describe('watch-folder-scan §10', () => {
  it('collectWatchFolderMediaEntries filters video extensions', () => {
    const entries: WatchFolderDirEntry[] = [
      { name: 'clip.mp4', isFile: true, mtimeMs: 1, size: 100 },
      { name: 'readme.txt', isFile: true, mtimeMs: 2, size: 50 },
      { name: 'nested', isFile: false, mtimeMs: 3, size: 0 }
    ]
    const media = collectWatchFolderMediaEntries(entries)
    expect(media).toHaveLength(1)
    expect(media[0]?.fileName).toBe('clip.mp4')
  })

  it('detectNewWatchFolderFiles baselines without events', () => {
    const media = [{ fileName: 'a.mkv', mtimeMs: 10, size: 1 }]
    const { newFiles, nextSeen } = detectNewWatchFolderFiles(media, {})
    expect(newFiles).toHaveLength(0)
    expect(nextSeen['a.mkv']?.mtimeMs).toBe(10)
  })

  it('detectNewWatchFolderFiles reports new file after baseline', () => {
    const seen = { 'a.mkv': { mtimeMs: 10, size: 1 } }
    const media = [
      { fileName: 'a.mkv', mtimeMs: 10, size: 1 },
      { fileName: 'b.mp4', mtimeMs: 20, size: 2 }
    ]
    const { newFiles } = detectNewWatchFolderFiles(media, seen)
    expect(newFiles.map((f) => f.fileName)).toEqual(['b.mp4'])
  })
})
