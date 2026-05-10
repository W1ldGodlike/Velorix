import { describe, expect, it } from 'vitest'

import {
  DOWNLOADS_TOPBAR_CLUSTER_ICONS,
  QUEUE_ROW_ACTION_ICONS,
  emitDownloadsQueueRowIcoBootstrapJs,
  emitDownloadsTopbarClusterHtml,
  emitInlineStrokeSvg
} from '../../src/shared/lucide-downloads-icons'

describe('lucide-downloads-icons', () => {
  it('эмит RowIco включает все ключи таблицы очереди', () => {
    const js = emitDownloadsQueueRowIcoBootstrapJs()
    expect(js).toContain('var RowIco')
    expect(js).toContain('play:')
    expect(js).toContain('pause:')
    expect(js).toContain('svgIcon([')
    for (const key of Object.keys(QUEUE_ROW_ACTION_ICONS)) {
      expect(js).toContain(`${key}:`)
    }
  })

  it('inline SVG топбара и кластера не пустые', () => {
    const svg = emitInlineStrokeSvg(DOWNLOADS_TOPBAR_CLUSTER_ICONS.film, 18)
    expect(svg.startsWith('<svg')).toBe(true)
    expect(svg).toContain('viewBox="0 0 24 24"')
    const html = emitDownloadsTopbarClusterHtml(18)
    expect(html).toContain('id="dlTopFilm"')
    expect(html).toContain('role="toolbar"')
  })
})
