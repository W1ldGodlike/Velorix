import { describe, expect, it } from 'vitest'

import {
  DOWNLOADS_TOPBAR_CLUSTER_ICONS,
  EDITOR_TIMELINE_ICONS,
  EDITOR_THEME_ICONS,
  EDITOR_TOPBAR_ACTION_ICONS,
  EDITOR_TRANSPORT_ICONS,
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
    expect(html).toContain('id="dlTopUrl"')
    expect(html).toContain('role="toolbar"')
  })

  it('иконки транспорта редактора (v0 §Editor layout) сериализуются в stroke SVG', () => {
    expect(emitInlineStrokeSvg(EDITOR_TRANSPORT_ICONS.skipBack, 20)).toContain('polygon points=')
    expect(emitInlineStrokeSvg(EDITOR_TRANSPORT_ICONS.volume2, 20)).toContain('path d=')
  })

  it('иконки zoom таймлайна (v0) содержат circle и ручку лупы', () => {
    const z = emitInlineStrokeSvg(EDITOR_TIMELINE_ICONS.zoomIn, 20)
    expect(z).toContain('circle')
    expect(z).toContain('line')
  })

  it('EDITOR_TOPBAR_ACTION_ICONS (снимок/экспорт/бан/облако) сериализуются в stroke SVG', () => {
    expect(emitInlineStrokeSvg(EDITOR_TOPBAR_ACTION_ICONS.save, 20)).toContain('path d=')
    expect(emitInlineStrokeSvg(EDITOR_TOPBAR_ACTION_ICONS.image, 20)).toContain('rect')
    expect(emitInlineStrokeSvg(EDITOR_TOPBAR_ACTION_ICONS.ban, 20)).toContain('circle')
    expect(emitInlineStrokeSvg(EDITOR_TOPBAR_ACTION_ICONS.cloudDownload, 20)).toContain('path d=')
  })

  it('EDITOR_THEME_ICONS (sun/moon) сериализуются в stroke SVG', () => {
    expect(emitInlineStrokeSvg(EDITOR_THEME_ICONS.sun, 20)).toContain('circle')
    expect(emitInlineStrokeSvg(EDITOR_THEME_ICONS.moon, 20)).toContain('path d=')
  })

  it('QUEUE_ROW_ACTION_ICONS.x (lucide close) попадает в bootstrap RowIco', () => {
    expect(emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.x, 20)).toContain('<line')
    expect(emitDownloadsQueueRowIcoBootstrapJs()).toContain('x:')
  })

  it('DOWNLOADS_TOPBAR_CLUSTER_ICONS.clipboard / popOutWindow сериализуются для вкладки «Загрузки»', () => {
    expect(emitInlineStrokeSvg(DOWNLOADS_TOPBAR_CLUSTER_ICONS.clipboard, 18)).toContain('<rect')
    expect(emitInlineStrokeSvg(DOWNLOADS_TOPBAR_CLUSTER_ICONS.popOutWindow, 18)).toContain('<path')
  })
})
