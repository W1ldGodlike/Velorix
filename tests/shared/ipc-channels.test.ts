import { describe, expect, it } from 'vitest'

import { downloadsIpc, mainWindowIpc } from '../../src/shared/ipc-channels'

function stringValues<const T extends Record<string, string>>(o: T): string[] {
  return Object.values(o)
}

describe('ipc-channels', () => {
  it('строки каналов главного окна уникальны', () => {
    const v = stringValues(mainWindowIpc)
    expect(new Set(v).size).toBe(v.length)
  })

  it('строки каналов окна yt-dlp уникальны', () => {
    const v = stringValues(downloadsIpc)
    expect(new Set(v).size).toBe(v.length)
  })

  it('две группы не используют одинаковые строки каналов', () => {
    const mainSet = new Set(stringValues(mainWindowIpc))
    for (const ch of stringValues(downloadsIpc)) {
      expect(mainSet.has(ch)).toBe(false)
    }
  })
})
