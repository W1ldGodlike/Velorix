import { describe, expect, it } from 'vitest'

import {
  DOWNLOADS_TOPBAR_CLUSTER_ICONS,
  EDITOR_TIMELINE_ICONS,
  EDITOR_TOPBAR_ACTION_ICONS,
  EDITOR_TRANSPORT_ICONS,
  QUEUE_ROW_ACTION_ICONS,
  WORKSPACE_TAB_ICONS,
  emitInlineStrokeSvg
} from '../../src/shared/lucide-downloads-icons'

describe('lucide-downloads-icons', () => {
  it('inline SVG топбара не пустой', () => {
    const svg = emitInlineStrokeSvg(DOWNLOADS_TOPBAR_CLUSTER_ICONS.film, 18)
    expect(svg.startsWith('<svg')).toBe(true)
    expect(svg).toContain('viewBox="0 0 24 24"')
  })

  it('иконки транспорта редактора сериализуются в stroke SVG', () => {
    expect(emitInlineStrokeSvg(EDITOR_TRANSPORT_ICONS.skipBack, 20)).toContain('polygon points=')
    expect(emitInlineStrokeSvg(EDITOR_TRANSPORT_ICONS.volume2, 20)).toContain('path d=')
  })

  it('иконки zoom таймлайна содержат circle и ручку лупы', () => {
    const z = emitInlineStrokeSvg(EDITOR_TIMELINE_ICONS.zoomIn, 20)
    expect(z).toContain('circle')
    expect(z).toContain('line')
  })

  it('EDITOR_TOPBAR_ACTION_ICONS сериализуются в stroke SVG', () => {
    expect(emitInlineStrokeSvg(EDITOR_TOPBAR_ACTION_ICONS.folder, 20)).toContain('path d=')
    expect(emitInlineStrokeSvg(EDITOR_TOPBAR_ACTION_ICONS.save, 20)).toContain('path d=')
    expect(emitInlineStrokeSvg(EDITOR_TOPBAR_ACTION_ICONS.image, 20)).toContain('rect')
    expect(emitInlineStrokeSvg(EDITOR_TOPBAR_ACTION_ICONS.ban, 20)).toContain('circle')
    expect(emitInlineStrokeSvg(EDITOR_TOPBAR_ACTION_ICONS.cloudDownload, 20)).toContain('path d=')
  })

  it('QUEUE_ROW_ACTION_ICONS.x (lucide close) сериализуется', () => {
    expect(emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.x, 20)).toContain('<line')
  })

  it('DOWNLOADS_TOPBAR_CLUSTER_ICONS.clipboard сериализуется', () => {
    expect(emitInlineStrokeSvg(DOWNLOADS_TOPBAR_CLUSTER_ICONS.clipboard, 18)).toContain('<rect')
  })

  it('QUEUE_ROW_ACTION_ICONS.plus — кнопки «Добавить…»', () => {
    expect(emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.plus, 17)).toContain('<path')
  })

  it('QUEUE_ROW_ACTION_ICONS.copy — копирование', () => {
    expect(emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.copy, 18)).toContain('<rect')
  })

  it('WORKSPACE_TAB_ICONS.editor — кадр, play и ножницы', () => {
    const svg = emitInlineStrokeSvg(WORKSPACE_TAB_ICONS.editor, 16)
    expect(svg).toContain('<rect')
    expect(svg).toContain('polygon points=')
    expect(svg).toContain('<circle')
    expect(svg).toContain('<line')
  })
})
