import { describe, expect, it } from 'vitest'

import { loadRef1ProcessingShellAssets } from './neon-processing-shell-fixtures'

describe('ref.1 processing shell CSS hover guards (ui.2)', () => {
  it('ref1-processing.css hover micro-glow selectors', () => {
    const { css, iconsCss } = loadRef1ProcessingShellAssets()

    expect(iconsCss).toMatch(/\.processing-tool-glyph--blade[\s\S]*box-shadow:/)
    expect(iconsCss).toMatch(/\.processing-track-icon--mute:hover[\s\S]*box-shadow:/)
    expect(css).toContain('.processing-ring:hover em')
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__horizon/)
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__skyline/)
    expect(css).toMatch(/\.processing-timeline:hover \.processing-timeline__ruler/)
    expect(css).toMatch(
      /\.processing-timeline__lane:hover:not\(\.processing-timeline__lane--empty\)/
    )
    expect(css).toMatch(/\.processing-timeline__track:hover \.processing-timeline__label/)
    expect(css).toMatch(/\.processing-clip:hover \.processing-clip__label/)
    expect(css).toContain('.processing-rail__field--fps:hover')
    expect(css).toMatch(/\.processing-rail__preset-card:hover strong/)
    expect(css).toMatch(/\.processing-statusbar__item:hover \.processing-statusbar__project/)
    expect(css).toMatch(
      /\.processing-timeline__toolbar .vn-btn--icon:hover .processing-tool-glyph--link/
    )
    expect(iconsCss).toMatch(/\.processing-tool-glyph--snap[\s\S]*box-shadow:/)
    expect(css).toMatch(/\.processing-sidebar:hover::-webkit-scrollbar-thumb/)
    expect(css).toMatch(/\.processing-center__head--png:hover h1/)
    expect(css).toMatch(
      /\.processing-preview__transport-playback:hover \.processing-preview__transport-sep/
    )
    expect(css).toMatch(/\.processing-timeline:hover \.processing-timeline__top/)
    expect(css).toContain('.processing-timeline__toolbar:hover')
    expect(css).toMatch(/\.processing-timeline__zoom:hover \.processing-timeline__zoom-val/)
    expect(css).toMatch(/\.processing-clip--thumb:hover \.processing-clip__thumb-shine/)
    expect(css).toMatch(/\.processing-clip:hover \.processing-clip__badge--4k/)
    expect(css).toContain('.processing-rail__preset-row--active:hover')
    expect(css).toMatch(/\.processing-rail__head--png:hover \.processing-rail__title/)
    expect(css).toMatch(/\.processing-rail__preset-card:hover \.processing-rail__preset-meta/)
    expect(iconsCss).toMatch(/\.processing-track-icon--lock:hover[\s\S]*box-shadow:/)
    expect(css).toContain('.processing-center:hover')
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__chrome/)
    expect(css).toMatch(/\.processing-preview__chrome:hover \.processing-preview__saved/)
    expect(css).toMatch(/\.processing-timeline__track:hover \.processing-timeline__head/)
    expect(css).toMatch(/\.processing-clip:hover \.processing-clip__duration/)
    expect(css).toContain('.processing-clip--audio:hover')
    expect(css).toContain('.processing-rail:hover')
    expect(css).toMatch(/\.processing-rail__help:hover:not\(:disabled\)/)
    expect(css).toContain('.processing-rail__field--slider:hover')
    expect(css).toMatch(/\.processing-rail__preset-card:hover \.processing-rail__preset-head/)
    expect(css).toMatch(
      /\.processing-timeline__toolbar .vn-btn--icon:hover .processing-tool-glyph--select/
    )
    expect(iconsCss).toMatch(/\.processing-transport-glyph--snap:hover[\s\S]*box-shadow:/)
    expect(iconsCss).toMatch(/\.processing-transport-glyph--camera:hover[\s\S]*box-shadow:/)
    expect(iconsCss).toMatch(/\.processing-track-icon--visible:hover[\s\S]*box-shadow:/)
    expect(css).toContain('.processing-sidebar:hover')
    expect(css).toContain('.processing-center__head--png:hover')
    expect(css).toMatch(/\.processing-timeline__toolbar:hover \.processing-timeline__toolbar-sep/)
    expect(css).toMatch(/\.processing-timeline:hover \.processing-timeline__ruler-labels/)
    expect(css).toMatch(/\.processing-preview__transport-playback:hover \.processing-media-glyph/)
    expect(css).toMatch(/\.processing-clip:hover \.processing-clip__film/)
    expect(css).toMatch(/\.processing-clip:hover \.processing-clip__badge--fx/)
    expect(css).toMatch(/\.processing-rail:hover \.processing-rail__preset-list/)
    expect(css).toContain('.processing-statusbar--dense:hover')
    expect(css).toMatch(/\.processing-statusbar__item:hover strong/)
    expect(css).toMatch(
      /\.processing-preview:hover \.processing-preview__overlays \.processing-preview__badge/
    )
    expect(css).toContain('.processing-timeline__body:hover')
    expect(iconsCss).toMatch(/\.processing-track-icon--solo:hover[\s\S]*text-shadow:/)
    expect(css).toMatch(/\.processing-sidebar__gpu:hover \.processing-sidebar__gpu-title strong/)
    expect(css).toContain('.processing-sidebar__system:hover')
    expect(css).toContain('.processing-center__body:hover')
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__scene/)
    expect(css).toMatch(
      /\.processing-preview:hover \.processing-preview__scene \.processing-preview__car/
    )
    expect(css).toMatch(
      /\.processing-preview__transport-playback \.vn-btn--icon:hover:not\(:disabled\) \.processing-media-glyph/
    )
    expect(css).toMatch(/\.processing-timeline:hover \.processing-timeline__ruler-ticks/)
    expect(css).toMatch(/\.processing-timeline:hover \.processing-timeline__keyframe/)
    expect(css).toMatch(/\.processing-clip--linked:hover \.processing-clip-link::after/)
    expect(css).toMatch(/\.processing-rail__section:hover \.processing-rail__fields/)
    expect(css).toMatch(/\.processing-rail__field:hover \.processing-rail__field-label/)
    expect(css).toContain('.processing-rail__export-btn:active:not(:disabled)')
    expect(iconsCss).toMatch(/\.processing-sidebar__gpu:hover \.processing-sidebar__gpu-glyph/)
    expect(css).toMatch(/\.processing-sidebar__system:hover \.processing-sidebar__section-title/)
    expect(css).toMatch(
      /\.processing-sidebar__gpu:hover \.processing-sidebar__gpu-meter-fill--load/
    )
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__tower--b/)
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__tower--d/)
    expect(css).toMatch(/\.processing-timeline__track:hover \.processing-timeline__track-tools/)
    expect(css).toContain('.processing-timeline__lane--empty:hover')
    expect(css).toContain('.processing-timeline__lane--audio:hover')
    expect(css).toMatch(/\.processing-clip--highlight:hover::after/)
    expect(css).toMatch(/\.processing-clip--highlight:hover \.processing-clip__badge/)
    expect(css).toMatch(/\.processing-rail__section summary:hover \.processing-rail__section-hint/)
    expect(css).toMatch(/\.processing-rail__preset-card:hover \.processing-rail__preset-gear/)
    expect(css).toMatch(
      /\.processing-sidebar__gpu:hover \.processing-sidebar__gpu-spark-bars::after/
    )
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__tower--a/)
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__tower--c/)
    expect(css).toMatch(/\.processing-preview__transport-tools:hover/)
    expect(css).toMatch(/\.processing-timeline__tool--link-on:hover \.processing-tool-glyph--link/)
    expect(css).toMatch(/\.processing-timeline__lane--envelope:hover::before/)
    expect(css).toMatch(/\.processing-timeline__lane--envelope:hover::after/)
    expect(css).toMatch(/\.processing-clip--tone-violet:hover \.processing-clip__film/)
    expect(css).toMatch(/\.processing-rail__section summary:hover \.processing-rail__section-label/)
    expect(css).toMatch(
      /\.processing-rail__section:not\(\[open\]\):hover summary \.processing-rail__section-label/
    )
    expect(css).toContain('.processing-statusbar__left:hover')
    expect(css).toContain('.processing-statusbar__right:hover')
    expect(css).toContain('.processing-shell:hover')
    expect(css).toMatch(/\.processing-sidebar__gpu:hover \.processing-sidebar__gpu-stats strong/)
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__neon-sign--left/)
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__neon-sign--right/)
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__vignette/)
    expect(css).toContain('.processing-preview__transport:hover')
    expect(css).toMatch(/\.processing-preview__volume:hover \.processing-preview__volume-val/)
    expect(css).toContain('.processing-timeline__tool--active:hover')
    expect(css).toContain('.processing-timeline__tracks:hover')
    expect(css).toMatch(/\.processing-timeline:hover \.processing-timeline__playhead::after/)
    expect(css).toMatch(/\.processing-timeline__track--active:hover \.processing-timeline__lane/)
    expect(css).toMatch(/\.processing-timeline__track--active:hover \.processing-timeline__label/)
    expect(css).toMatch(/\.processing-rail__section--video\[open\]:hover/)
    expect(css).toContain('.processing-statusbar__center:hover')
    expect(css).toMatch(
      /\.processing-sidebar__gpu-meter:hover \.processing-sidebar__gpu-meter-track/
    )
    expect(css).toMatch(/\.processing-sidebar__system:hover \.processing-ring/)
    expect(css).toContain('.processing-sidebar__utilities:hover')
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__saved::before/)
    expect(css).toContain('.processing-timeline:hover {')
    expect(css).toMatch(/\.processing-timeline__body:hover::before/)
    expect(css).toMatch(/\.processing-timeline__zoom:hover \.processing-timeline__zoom-btn/)
    expect(css).toMatch(/\.processing-timeline__track--active:hover \.processing-timeline__head/)
    expect(css).toMatch(/\.processing-rail:hover \.processing-rail__head--png/)
    expect(css).toContain('.processing-rail__scroll:hover')
    expect(css).toContain('.processing-rail__switch--on:hover')
    expect(css).toMatch(/\.processing-rail__toggle:has\(\.processing-rail__switch--on\):hover/)
    expect(iconsCss).toMatch(/\.processing-clip--linked:hover \.processing-clip__link-mark/)
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__watermark::before/)
    expect(css).toMatch(/\.processing-clip--highlight:hover \.processing-clip__badges/)
    expect(css).toMatch(/\.processing-timeline__track--active:hover \.processing-track-icon/)
    expect(css).toMatch(/\.processing-rail__help:hover:not\(:disabled\)/)
    expect(css).toMatch(/\.processing-rail__head--png:hover \.processing-rail__title/)
    expect(css).toMatch(/\.processing-rail__section\[open\]:hover/)
    expect(css).toMatch(
      /\.processing-rail__field--slider:hover \.processing-rail__slider-fill--crf::after/
    )
    expect(css).toMatch(/\.processing-rail__toggle:hover \.processing-rail__toggle-value em/)
    expect(iconsCss).toMatch(
      /\.processing-sidebar__utilities:hover \.processing-util-btn:not\(:disabled\)/
    )
    expect(css).toMatch(
      /\.processing-sidebar__gpu-meter:hover \.processing-sidebar__gpu-meter-label/
    )
    expect(css).toMatch(/\.processing-center:hover \.processing-center__body/)
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__tower--a::before/)
    expect(css).toMatch(
      /\.processing-timeline:hover \.processing-timeline__ruler-labels span:nth-child\(1\)/
    )
    expect(css).toMatch(/\.processing-clip--wave:hover \.processing-clip__wave-bars/)
    expect(css).toMatch(/\.processing-rail:hover \.processing-rail__head--png/)
    expect(css).toMatch(/\.processing-rail__field--fps:hover \.processing-rail__select/)
    expect(css).toContain('.processing-rail__slider-mock:hover')
    expect(css).toContain('.processing-rail__preset-list:hover')
    expect(css).toMatch(/\.processing-statusbar__item:hover \.processing-statusbar__project/)
    expect(iconsCss).toMatch(
      /\.processing-rail__export-btn:hover:not\(:disabled\) \.processing-rail__export-icon/
    )
    expect(css).toContain('.processing-sidebar__brand:hover')
    expect(css).toMatch(/\.processing-sidebar__gpu:hover \.processing-sidebar__gpu-title span/)
    expect(css).toMatch(/\.processing-sidebar__system:hover \.processing-ring--cpu/)
    expect(css).toMatch(/\.processing-center:hover \.processing-center__head-main p/)
    expect(css).toContain('.processing-preview:hover::before')
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__scene::before/)
    expect(css).toContain('.processing-preview__chrome:hover')
    expect(css).toContain('.processing-timeline__lane--envelope:hover {')
    expect(css).toMatch(/\.processing-clip--thumb:hover::after/)
    expect(css).toContain('.processing-rail__scroll:hover')
    expect(css).toContain('.processing-rail__field:hover {')
    expect(css).toMatch(/\.processing-rail__field--fps:hover \.processing-rail__fps/)
    expect(css).toMatch(
      /\.processing-rail__export:hover \.processing-rail__export-btn:not\(:disabled\)/
    )
    expect(css).toContain('.processing-nav__item:hover:not(.processing-nav__item--active)')
    expect(css).toMatch(
      /\.processing-nav__item:hover:not\(\.processing-nav__item--active\) \.processing-nav__icon/
    )
    expect(css).toMatch(/\.processing-sidebar__gpu-meter:hover em/)
    expect(css).toMatch(/\.processing-sidebar__system:hover \.processing-ring--ram/)
    expect(css).toMatch(/\.processing-sidebar__system:hover \.processing-ring--disk/)
    expect(css).toContain('.processing-ring--ram:hover')
    expect(css).toContain('.processing-ring--disk:hover')
    expect(css).toContain('.processing-preview__fit:hover:not(:disabled)')
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__ground-mist/)
    expect(css).toMatch(/\.processing-rail:hover \.processing-rail__hint/)
    expect(css).toMatch(/\.processing-statusbar__item:hover \.processing-statusbar__val--cyan/)
    expect(css).toMatch(/\.processing-rail__select:hover \.processing-rail__chevron/)
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__scanlines/)
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__overlays \{/)
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__neon-sign/)
    expect(css).toMatch(
      /\.processing-timeline:hover \.processing-timeline__ruler-labels span:nth-child\(2\)/
    )
    expect(css).toMatch(
      /\.processing-timeline:hover \.processing-timeline__ruler-labels span:nth-child\(3\)/
    )
    expect(css).toContain('.processing-preview__zoom:hover:not(:disabled)')
    expect(css).toContain('.processing-preview__chrome-btn:hover:not(:disabled)')
    expect(css).toMatch(
      /\.processing-rail__preset-row:hover:not\(\.processing-rail__preset-row--active\)/
    )
    expect(css).toMatch(/\.processing-statusbar__item:hover \.processing-statusbar__tc--magenta/)
    expect(iconsCss).toMatch(
      /\.processing-preview__transport-tools \.processing-transport-glyph--pip:hover[\s\S]*box-shadow:/
    )
    expect(iconsCss).toMatch(
      /\.processing-preview__transport-tools \.processing-transport-glyph--crop:hover[\s\S]*box-shadow:/
    )
    expect(css).toMatch(/\.processing-rail__scroll:hover::-webkit-scrollbar-thumb/)
    expect(css).toContain('.processing-preview__tc-box:hover:not(:disabled)')
    expect(css).toContain('.processing-preview__transport-tool:hover:not(:disabled)')
    expect(css).toMatch(/\.processing-preview__transport-playback \.vn-btn--play:hover/)
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__scene::after/)
    expect(css).toContain('.processing-preview__volume:hover {')
    expect(css).toMatch(/\.processing-timeline:hover \.processing-timeline__ruler-labels \{/)
    expect(css).toMatch(/\.processing-timeline:hover \.processing-timeline__playhead-bubble/)
  })
})
