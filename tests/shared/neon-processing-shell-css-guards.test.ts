import { describe, expect, it } from 'vitest'

import { loadRef1ProcessingShellAssets } from './neon-processing-shell-fixtures'

describe('ref.1 processing shell CSS guards (ui.2)', () => {
  it('ref1-processing.css and icons match NEON micro-glow tokens', () => {
    const { center, css, iconsCss, tsx, brandCss } = loadRef1ProcessingShellAssets()

    expect(css).toMatch(/\.processing-sidebar__section-title[\s\S]*text-transform: uppercase/)
    expect(css).toMatch(/\.processing-timeline__zoom[\s\S]*border: 1px solid/)
    expect(center).toContain('processing-preview__scene--ref')
    expect(center).toContain('processing-preview--ref')
    expect(center).not.toContain('processing-preview__skyline')
    expect(center).not.toContain('processing-preview__horizon')
    expect(tsx).toContain('Загрузка:')
    expect(tsx).toContain('Темп.:')
    expect(tsx).not.toContain('processing-sidebar__gpu-tag')
    expect(css).not.toContain('.processing-center__head-chip {')
    expect(css).not.toContain('.processing-center__summary {')
    expect(css).not.toContain('.processing-sidebar__gpu-tag {')
    expect(css).not.toContain('.processing-timeline__snap-pill {')
    expect(css).toContain('.processing-preview__watermark::before')
    expect(iconsCss).toContain('.processing-nav__item--active .processing-nav__icon--processing')
    expect(css).toContain('.processing-nav__item--active')
    expect(css).toMatch(
      /\.processing-nav__item--active[\s\S]*border-left: 2px solid rgba\(168, 85, 247, 0\.95\)/
    )
    expect(css).toMatch(
      /\.processing-nav__item--active[\s\S]*box-shadow: inset 0 0 5px rgba\(168, 85, 247, 0\.08\)/
    )
    expect(brandCss).toContain('.neon-sidebar-brand--ref1')
    expect(css).toMatch(/\.processing-preview__transport-tools[\s\S]*inset 0 0 10px/)
    expect(css).toMatch(
      /\.processing-preview__transport-tools:hover[\s\S]*inset 0 0 12px rgba\(168, 85, 247, 0\.1\)/
    )
    expect(css).toMatch(
      /\.processing-preview__transport-playback \.vn-btn--play:hover[\s\S]*inset 0 0 10px rgba\(168, 85, 247, 0\.14\)/
    )
    expect(css).toMatch(/\.processing-preview__tower--b::after[\s\S]*rgba\(59, 130, 246/)
    expect(css).toMatch(/\.processing-rail__preset-meta[\s\S]*rgba\(148, 163, 184/)
    expect(css).toMatch(
      /\.processing-nav__item:not\(\.processing-nav__item--active\) \.processing-nav__icon/
    )
    expect(css).toMatch(/\.processing-preview__horizon[\s\S]*box-shadow: none/)
    expect(css).toMatch(
      /\.processing-preview:hover \.processing-preview__horizon[\s\S]*inset 0 0 6px rgba\(168, 85, 247, 0\.12\)/
    )
    expect(css).toMatch(/\.processing-preview__ground-mist[\s\S]*inset 0 12px/)
    expect(css).toMatch(/\.processing-preview__neon-sign[\s\S]*inset 0 0 6px/)
    expect(css).toContain('.processing-timeline__ruler-labels span:nth-child(1)')
    expect(css).toMatch(/\.processing-rail__switch--on::after[\s\S]*box-shadow:/)
    expect(css).toMatch(/\.processing-rail__preset-row--active[\s\S]*inset 3px 0 0/)
    expect(css).toMatch(
      /\.processing-sidebar__mark::after[\s\S]*inset 0 0 5px rgba\(168, 85, 247, 0\.1\)/
    )
    expect(css).toMatch(
      /\.processing-ring--cpu[\s\S]*box-shadow: inset 0 0 6px rgba\(168, 85, 247, 0\.06\)/
    )
    expect(css).toMatch(/\.processing-preview__tower--a[\s\S]*box-shadow:/)
    expect(css).toMatch(/\.processing-preview__vignette[\s\S]*rgba\(59, 130, 246, 0\.13\)/)
    expect(css).toMatch(/\.processing-preview__watermark[\s\S]*filter: none/)
    expect(css).toMatch(/\.processing-preview__chrome[\s\S]*inset 0 -10px 20px/)
    expect(css).toMatch(
      /\.processing-preview--ref:hover \.processing-preview__chrome[\s\S]*box-shadow: none/
    )
    expect(css).toMatch(
      /\.processing-preview--ref:hover \.processing-preview__scene[\s\S]*filter: none/
    )
    expect(css).toMatch(
      /\.processing-rail__export:hover \.processing-rail__export-btn:not\(:disabled\)[\s\S]*inset 0 0 8px/
    )
    expect(css).toMatch(
      /\.processing-preview--ref \.processing-preview__transport-playback:hover[\s\S]*box-shadow: none/
    )
    expect(css).toMatch(
      /\.processing-preview--ref \.processing-preview__volume-val[\s\S]*text-shadow: none/
    )
    expect(css).toMatch(
      /\.processing-preview--ref \.processing-preview__transport-tools:hover[\s\S]*inset 0 0 6px/
    )
    expect(css).toMatch(
      /\.processing-preview--ref \.processing-preview__zoom-chevron[\s\S]*text-shadow: none/
    )
    expect(css).toMatch(
      /\.processing-preview--ref \.processing-chrome-glyph--search[\s\S]*box-shadow: none/
    )
    expect(css).toMatch(
      /\.processing-preview--ref \.processing-preview__overlays[\s\S]*display: none/
    )
    expect(css).toContain('.processing-preview__scene-demo')
    expect(css).toMatch(/\.processing-preview__badge[\s\S]*inset 0 0 8px/)
    expect(css).toMatch(/\.processing-preview__transport-playback[\s\S]*inset 0 1px 0/)
    expect(css).toMatch(/\.processing-preview \{[\s\S]*inset 0 0 0 1px rgba\(168, 85, 247, 0\.1\)/)
    expect(css).toMatch(
      /\.processing-preview__transport-playback[\s\S]*inset 0 0 10px rgba\(168, 85, 247, 0\.08\)/
    )
    expect(css).toMatch(/\.processing-preview__volume-val[\s\S]*text-shadow: none/)
    expect(css).toMatch(/\.processing-timeline__zoom-val[\s\S]*text-shadow: none/)
    expect(css).toMatch(
      /\.processing-preview__volume[\s\S]*inset 0 0 12px rgba\(168, 85, 247, 0\.1\)/
    )
    expect(css).toMatch(
      /\.processing-timeline__playhead-bubble[\s\S]*inset 0 0 5px rgba\(168, 85, 247, 0\.16\)/
    )
    expect(css).toMatch(
      /\.processing-timeline__playhead::after[\s\S]*inset 0 0 3px rgba\(168, 85, 247, 0\.18\)/
    )
    expect(css).toContain('.processing-rail__help:hover:not(:disabled)')
    expect(css).toMatch(
      /\.processing-rail__head--png \.processing-rail__title[\s\S]*color: rgba\(255, 255, 255, 0\.88\)/
    )
    expect(css).toMatch(/\.processing-statusbar__dot[\s\S]*inset 0 0 3px rgba\(46, 213, 115/)
    expect(css).toMatch(
      /\.processing-ring--ram[\s\S]*box-shadow: inset 0 0 6px rgba\(168, 85, 247, 0\.06\)/
    )
    expect(css).toMatch(
      /\.processing-sidebar \.processing-sidebar__footer \.processing-util-btn[\s\S]*filter: none/
    )
    expect(css).toMatch(
      /\.processing-center:hover \.processing-center__head--png \.processing-center__head-main p[\s\S]*text-shadow: none/
    )
    expect(css).toMatch(
      /\.processing-center:hover \.processing-center__body[\s\S]*inset 0 1px 0 rgba\(255, 255, 255, 0\.04\)/
    )
    expect(css).toMatch(/\.processing-center__head--png h1[\s\S]*color: #fff/)
    expect(css).toMatch(/\.processing-preview__tower--c[\s\S]*box-shadow:/)
    expect(css).toMatch(/\.processing-preview__neon-sign--right[\s\S]*border-color/)
    expect(css).toMatch(/\.processing-preview__zoom-chevron[\s\S]*text-shadow: none/)
    expect(css).toMatch(/\.processing-preview__transport-sep[\s\S]*box-shadow: none/)
    expect(css).toMatch(
      /\.processing-timeline__ruler-ticks::after[\s\S]*inset 0 0 4px rgba\(168, 85, 247, 0\.24\)/
    )
    expect(css).toMatch(
      /\.processing-timeline__track--active \.processing-timeline__lane[\s\S]*inset 0 0 6px rgba\(168, 85, 247, 0\.04\)/
    )
    expect(css).toMatch(/\.processing-timeline__lane--envelope::before[\s\S]*box-shadow:/)
    expect(css).toMatch(
      /\.processing-clip-link::after[\s\S]*inset 0 0 3px rgba\(168, 85, 247, 0\.12\)/
    )
    expect(css).toMatch(/\.processing-rail__select[\s\S]*inset 0 1px 0/)
    expect(css).toMatch(
      /\.processing-rail__preset-card[\s\S]*inset 0 0 6px rgba\(168, 85, 247, 0\.05\)/
    )
    expect(css).toMatch(/\.processing-sidebar__logo \{[\s\S]*text-shadow: none/)
    expect(css).toMatch(/\.processing-sidebar__nav-block[\s\S]*inset 2px 0/)
    expect(css).toMatch(/\.processing-preview__fit:hover[\s\S]*inset 0 0 10px/)
    expect(css).toMatch(
      /\.processing-preview__chrome-btn:hover[\s\S]*inset 0 0 10px rgba\(168, 85, 247, 0\.12\)/
    )
    expect(css).toContain('.processing-timeline__zoom:hover')
    expect(css).toMatch(/\.processing-rail__head--png \.processing-rail__title[\s\S]*filter: none/)
    expect(css).toContain('.processing-rail__subtitle {')
    expect(css).toMatch(
      /\.processing-rail__section--video\[open\][\s\S]*inset 0 0 8px rgba\(168, 85, 247, 0\.06\)/
    )
    expect(css).toMatch(/\.processing-rail__export-btn[\s\S]*inset 0 1px 0/)
    expect(css).toMatch(/\.processing-clip--thumb::after[\s\S]*box-shadow:/)
    expect(css).toContain('.processing-statusbar__ready .processing-statusbar__dot')
    expect(css).toMatch(/\.processing-statusbar__ready[\s\S]*text-shadow: none/)
    expect(css).toMatch(/\.processing-shell\s*\{[\s\S]*inset 0 0 18px rgba\(124, 58, 237, 0\.06\)/)
    expect(css).toMatch(/\.processing-center\s*\{[\s\S]*box-shadow: none/)
    expect(css).toMatch(/\.processing-center__head h1[\s\S]*filter: none/)
    expect(css).toMatch(/\.processing-sidebar__gpu-stats strong[\s\S]*text-shadow: none/)
    expect(css).toMatch(
      /\.processing-sidebar__gpu-spark[\s\S]*inset 0 0 6px rgba\(168, 85, 247, 0\.06\)/
    )
    expect(css).toMatch(
      /\.processing-preview::before[\s\S]*inset 0 0 28px rgba\(168, 85, 247, 0\.08\)/
    )
    expect(css).toMatch(/\.processing-preview__scene::after[\s\S]*box-shadow:/)
    expect(css).toMatch(/\.processing-timeline__toolbar[\s\S]*inset 0 1px 0/)
    expect(css).toMatch(
      /\.processing-timeline__tool--link-on[\s\S]*inset 0 0 8px rgba\(168, 85, 247, 0\.1\)/
    )
    expect(css).toMatch(/\.processing-timeline__lane--empty[\s\S]*border: 1px dashed/)
    expect(css).toMatch(
      /\.processing-timeline__track-hint[\s\S]*inset 0 0 8px rgba\(46, 213, 115, 0\.12\)/
    )
    expect(css).toMatch(/\.processing-clip__badge[\s\S]*box-shadow:/)
    expect(css).toMatch(/\.processing-rail__field-label[\s\S]*text-transform: uppercase/)
    expect(css).toMatch(/\.processing-rail__field-label[\s\S]*text-shadow: none/)
    expect(css).toMatch(
      /\.processing-rail__toggle:has\(\.processing-rail__switch--on\)[\s\S]*inset 0 0 8px rgba\(168, 85, 247, 0\.08\)/
    )
    expect(css).toMatch(/\.processing-statusbar--dense[\s\S]*box-shadow: none/)
    expect(css).toMatch(
      /\.processing-statusbar__val--cyan[\s\S]*color: rgba\(96, 165, 250, 0\.92\)/
    )
    expect(css).toMatch(/\.processing-preview__neon-sign--left[\s\S]*box-shadow:/)
    expect(css).toMatch(/\.processing-preview__transport[\s\S]*rgba\(59, 130, 246, 0\.08\)/)
    expect(css).toMatch(/\.processing-timeline__ruler[\s\S]*box-shadow: none/)
    expect(css).toMatch(
      /\.processing-timeline__playhead \{[\s\S]*inset 0 0 3px rgba\(168, 85, 247, 0\.22\)/
    )
    expect(css).toMatch(/\.processing-timeline__lane[\s\S]*border: 1px solid/)
    expect(css).toMatch(/\.processing-rail__section:not\(\[open\]\):hover/)
    expect(css).toMatch(/\.processing-rail__preset-head[\s\S]*border-bottom:/)
    expect(iconsCss).toMatch(/\.processing-track-icon--mute[\s\S]*box-shadow:/)
    expect(iconsCss).toMatch(/\.processing-rail__preset-gear[\s\S]*inset 0 0 4px/)
    expect(iconsCss).toMatch(
      /\.processing-clip__link-mark[\s\S]*inset 0 0 6px rgba\(168, 85, 247, 0\.22\)/
    )
    expect(css).toMatch(
      /\.processing-sidebar:hover[\s\S]*inset -1px 0 0 rgba\(168, 85, 247, 0\.1\)/
    )
    expect(css).toMatch(/\.processing-ring em[\s\S]*rgba\(255, 255, 255, 0\.88\)/)
    expect(css).toMatch(
      /\.processing-preview__tower[\s\S]*inset 0 0 12px rgba\(168, 85, 247, 0\.1\)/
    )
    expect(css).toMatch(/\.processing-preview__saved::before[\s\S]*0 0 0 2px/)
    expect(css).toMatch(/\.processing-preview__zoom \{[\s\S]*text-shadow: none/)
    expect(css).toMatch(/\.processing-timeline[\s\S]*box-shadow: none/)
    expect(css).toMatch(
      /\.processing-timeline__tool--active[\s\S]*inset 0 0 8px rgba\(168, 85, 247, 0\.12\)/
    )
    expect(css).toMatch(/\.processing-rail \{[\s\S]*inset 1px 0 0 rgba\(168, 85, 247, 0\.06\)/)
    expect(css).toMatch(/\.processing-rail__scroll[\s\S]*box-shadow: none/)
    expect(css).toMatch(
      /\.processing-rail__preset-row[\s\S]*border: 1px solid rgba\(168, 85, 247, 0\.1\)/
    )
    expect(css).toMatch(/\.processing-rail__field--fps[\s\S]*box-shadow: none/)
    expect(iconsCss).toMatch(/\.processing-chrome-glyph--search[\s\S]*box-shadow:/)
    expect(iconsCss).toMatch(/\.processing-chrome-glyph--close[\s\S]*box-shadow:/)
    expect(css).toMatch(/\.processing-ring > span:first-child[\s\S]*text-shadow: none/)
    expect(css).toMatch(/\.processing-sidebar__system \{[\s\S]*box-shadow: none/)
    expect(css).toMatch(/\.processing-center__body[\s\S]*background: transparent/)
    expect(css).toMatch(/\.processing-timeline__head[\s\S]*inset 0 0 8px/)
    expect(css).toMatch(/\.processing-clip__wave-bars[\s\S]*inset 0 0 6px rgba\(46, 213, 115/)
    expect(css).toMatch(
      /\.processing-timeline__playhead-bubble[\s\S]*background: rgba\(168, 85, 247, 0\.96\)/
    )
    expect(css).toMatch(
      /\.processing-rail__select[\s\S]*box-shadow: inset 0 1px 0 rgba\(255, 255, 255, 0\.04\)/
    )
    expect(css).toMatch(/\.processing-rail__slider-fill[\s\S]*inset 0 0 6px/)
    expect(css).toMatch(/\.processing-statusbar__left[\s\S]*border-right:/)
    expect(css).toMatch(/\.processing-statusbar__item strong[\s\S]*text-shadow: none/)
    expect(css).toMatch(
      /\.processing-timeline__track-tools \.processing-track-icon:hover[\s\S]*inset 0 0 6px rgba\(168, 85, 247, 0\.1\)/
    )
    expect(iconsCss).toMatch(/\.processing-nav__icon--downloads[\s\S]*box-shadow:/)
    expect(css).toMatch(/::-webkit-scrollbar-thumb[\s\S]*inset 0 0 4px rgba\(168, 85, 247, 0\.14\)/)
    expect(css).toMatch(/\.processing-preview__zoom:hover[\s\S]*inset 0 0 10px rgba\(59, 130, 246/)
    expect(css).toMatch(
      /\.processing-preview__neon-sign--right[\s\S]*inset 0 0 8px rgba\(59, 130, 246, 0\.18\)/
    )
    expect(css).toMatch(
      /\.processing-preview__transport-tools \.processing-transport-glyph:hover[\s\S]*filter: brightness\(1\.06\)/
    )
    expect(css).toMatch(/\.processing-timeline__ruler-labels[\s\S]*text-shadow: none/)
    expect(css).toMatch(/\.processing-clip--wave \.processing-clip__label[\s\S]*bottom: 0/)
    expect(css).toMatch(/\.processing-clip--wave[\s\S]*inset 0 0 10px rgba\(46, 213, 115, 0\.14\)/)
    expect(css).toContain('.processing-rail__help:hover:not(:disabled)')
    expect(css).toMatch(
      /\.processing-rail__section\[open\] \.processing-rail__section-hint[\s\S]*text-shadow: none/
    )
    expect(css).toMatch(/\.processing-rail__chevron[\s\S]*text-shadow: none/)
    expect(iconsCss).toMatch(/\.processing-nav__icon--tools[\s\S]*box-shadow:/)
    expect(iconsCss).toMatch(/\.processing-chrome-glyph--fullscreen[\s\S]*inset 0 0 4px/)
    expect(css).toMatch(/\.processing-sidebar__brand[\s\S]*0 1px 0 rgba\(168, 85, 247, 0\.05\)/)
    expect(css).toMatch(
      /\.processing-sidebar__gpu-meter-fill--load[\s\S]*inset 0 0 6px rgba\(168, 85, 247, 0\.22\)/
    )
    expect(css).toMatch(
      /\.processing-sidebar__gpu-meter-fill--temp[\s\S]*inset 0 0 4px rgba\(46, 213, 115, 0\.18\)/
    )
    expect(css).toContain('.processing-ring--disk:hover')
    expect(css).toMatch(/\.processing-preview__skyline[\s\S]*filter: none/)
    expect(css).toMatch(
      /\.processing-preview__ground-mist[\s\S]*inset 0 10px 20px rgba\(168, 85, 247, 0\.08\)/
    )
    expect(css).toMatch(
      /\.processing-preview__tc-box:hover[\s\S]*inset 0 0 10px rgba\(59, 130, 246/
    )
    expect(css).toMatch(
      /\.processing-clip:hover:not\(\.processing-clip--highlight\)[\s\S]*inset 0 0 8px rgba\(168, 85, 247, 0\.08\)/
    )
    expect(css).toMatch(/\.processing-rail__fps-unit[\s\S]*text-shadow: none/)
    expect(css).toMatch(
      /\.processing-rail__export-btn \.processing-rail__export-icon[\s\S]*filter: none/
    )
    expect(css).toMatch(
      /\.processing-clip__badge--4k[\s\S]*inset 0 0 5px rgba\(255, 255, 255, 0\.18\)/
    )
    expect(iconsCss).toMatch(/\.processing-nav__icon--terminal[\s\S]*box-shadow:/)
    expect(iconsCss).toMatch(/\.processing-transport-glyph[\s\S]*filter: none/)
    expect(css).toContain('.processing-ring--cpu:hover')
    expect(css).toMatch(/\.processing-ring:hover em[\s\S]*text-shadow: none/)
    expect(css).toMatch(
      /\.processing-ring--cpu:hover[\s\S]*inset 0 0 8px rgba\(168, 85, 247, 0\.1\)/
    )
    expect(css).toContain('.processing-ring--ram:hover')
    expect(css).toMatch(
      /\.processing-timeline__body:hover[\s\S]*inset 0 0 12px rgba\(168, 85, 247, 0\.05\)/
    )
    expect(css).toMatch(
      /\.processing-timeline__body::before[\s\S]*inset 0 0 16px rgba\(168, 85, 247, 0\.05\)/
    )
    expect(css).toMatch(/\.processing-clip--tone-violet:hover[\s\S]*brightness/)
    expect(css).toMatch(
      /\.processing-clip--tone-violet:hover[\s\S]*inset 0 0 10px rgba\(168, 85, 247, 0\.1\)/
    )
    expect(css).toMatch(/\.processing-rail__head--png[\s\S]*box-shadow: none/)
    expect(css).toMatch(/\.processing-rail__section-label[\s\S]*text-shadow: none/)
    expect(css).toMatch(/\.processing-rail__preset-meta[\s\S]*text-shadow: none/)
    expect(css).toMatch(/\.processing-statusbar__item:hover[\s\S]*box-shadow: none/)
    expect(css).toContain('.processing-statusbar__tc--magenta')
    expect(iconsCss).toMatch(/\.processing-nav__icon--history[\s\S]*box-shadow:/)
    expect(iconsCss).toMatch(/\.processing-nav__icon--inspector[\s\S]*box-shadow:/)
    expect(iconsCss).toMatch(/\.processing-nav__icon--planner[\s\S]*box-shadow:/)
    expect(iconsCss).toMatch(/\.processing-rail__export-icon[\s\S]*filter: none/)
    expect(css).toMatch(/\.processing-shell\s*\{[\s\S]*inset 0 0 48px/)
    expect(css).toContain('.processing-sidebar__brand:hover .processing-sidebar__brand-edition')
    expect(css).toContain('.processing-sidebar__brand:hover .processing-sidebar__mark')
    expect(css).toMatch(/\.processing-center__head--png[\s\S]*box-shadow: none/)
    expect(css).toMatch(/\.processing-preview__scene::before[\s\S]*inset 0 -8px 22px/)
    expect(css).toContain('.processing-preview__transport-playback:hover')
    expect(css).toMatch(/\.processing-timeline__top[\s\S]*border-bottom:/)
    expect(css).toMatch(/\.processing-rail__fields[\s\S]*box-shadow: none/)
    expect(css).toMatch(
      /\.processing-preview:hover \.processing-preview__badge[\s\S]*inset 0 0 6px/
    )
    expect(iconsCss).toMatch(/\.processing-nav__icon--scenarios[\s\S]*box-shadow:/)
    expect(iconsCss).toMatch(/\.processing-nav__icon--knowledge[\s\S]*box-shadow:/)
    expect(iconsCss).toMatch(/\.processing-nav__icon--help[\s\S]*box-shadow:/)
    expect(iconsCss).toMatch(/\.processing-tool-glyph--select[\s\S]*box-shadow:/)
    expect(css).toMatch(/\.processing-sidebar__gpu:hover \.processing-sidebar__gpu-spark/)
    expect(css).toMatch(/\.processing-preview:hover \.processing-preview__scanlines/)
    expect(css).toMatch(
      /\.processing-clip--highlight:hover[\s\S]*inset 0 0 10px rgba\(168, 85, 247, 0\.14\)/
    )
    expect(css).toMatch(
      /\.processing-timeline__keyframe[\s\S]*inset 0 0 3px rgba\(46, 213, 115, 0\.18\)/
    )
    expect(css).toMatch(
      /\.processing-rail__preset-row:hover:not\(\.processing-rail__preset-row--active\)[\s\S]*inset 0 0 6px rgba\(168, 85, 247, 0\.06\)/
    )
    expect(css).toMatch(
      /\.processing-preview__tower--d[\s\S]*inset 0 0 10px rgba\(168, 85, 247, 0\.1\)/
    )
    expect(iconsCss).toMatch(/\.processing-nav__icon--settings[\s\S]*box-shadow:/)
    expect(iconsCss).toMatch(/\.processing-media-glyph[\s\S]*filter: none/)
    expect(iconsCss).toContain('.processing-rail__preset-gear:hover')
    expect(css).toMatch(/\.processing-preview__transport-sep[\s\S]*box-shadow: none/)
    expect(css).toMatch(
      /\.processing-preview:hover \.processing-preview__overlays[\s\S]*filter: none/
    )
    expect(css).toMatch(/\.processing-timeline__ruler-ticks[\s\S]*inset 0 -1px 4px/)
    expect(css).toContain('.processing-clip--linked:hover .processing-clip-link')
    expect(css).toMatch(
      /\.processing-clip__duration \{[\s\S]*inset 0 0 3px rgba\(168, 85, 247, 0\.16\)/
    )
    expect(css).toMatch(
      /\.processing-clip__badge--fx[\s\S]*inset 0 0 5px rgba\(168, 85, 247, 0\.12\)/
    )
    expect(css).toContain('.processing-rail__toggle:hover')
    expect(css).toMatch(/\.processing-rail__hint[\s\S]*inset 0 0 8px rgba\(168, 85, 247, 0\.06\)/)
    expect(iconsCss).toMatch(/\.processing-tool-glyph--pen[\s\S]*box-shadow:/)
    expect(iconsCss).toMatch(/\.processing-track-icon--solo::before[\s\S]*content: 'S'/)
    expect(css).toMatch(/\.processing-preview__tc-box:hover \.processing-preview__tc-chevron/)
    expect(css).toMatch(
      /\.processing-preview__chrome-btn:hover:not\(:disabled\) \.processing-chrome-glyph--search/
    )
    expect(css).toContain('.processing-timeline__zoom-btn:active')
    expect(css).toMatch(/\.processing-clip:hover \.processing-clip__badges/)
    expect(css).toContain('.processing-clip--thumb:hover')
    expect(css).toMatch(/\.processing-rail__section summary:hover::after/)
    expect(css).toMatch(/\.processing-rail__slider-mock:hover em/)
    expect(css).toContain('.processing-rail__switch:hover')
    expect(css).toMatch(/\.processing-rail:hover \.processing-rail__hint/)
    expect(css).toContain('.processing-statusbar__ready:hover')
    expect(iconsCss).toMatch(/\.processing-transport-glyph--loop:hover[\s\S]*box-shadow:/)
    expect(iconsCss).toMatch(/\.processing-tool-glyph--cloud[\s\S]*box-shadow:/)
    expect(iconsCss).toMatch(/\.processing-tool-glyph--group[\s\S]*box-shadow:/)
    expect(css).toContain('.processing-nav__item--active {')
    expect(css).toMatch(
      /\.processing-preview__zoom:hover:not\(:disabled\) \.processing-preview__zoom-chevron/
    )
    expect(css).toMatch(
      /\.processing-preview__chrome-btn:hover:not\(:disabled\) \.processing-chrome-glyph--fullscreen/
    )
    expect(css).toMatch(
      /\.processing-preview__chrome-btn:hover:not\(:disabled\) \.processing-chrome-glyph--close/
    )
    expect(css).toMatch(
      /\.processing-timeline__toolbar .vn-btn--icon:hover .processing-tool-glyph--blade/
    )
    expect(css).toMatch(/\.processing-timeline:hover \.processing-timeline__playhead-bubble/)
    expect(css).toMatch(/\.processing-clip--wave:hover \.processing-clip__wave-bar/)
    expect(css).toContain('.processing-rail__export:hover')
    expect(css).toMatch(/\.processing-timeline__lane:hover \.processing-timeline__track-hint/)
    expect(css).toMatch(
      /\.processing-statusbar__center \.processing-statusbar__item strong[\s\S]*text-shadow: none/
    )
    expect(css).toMatch(
      /\.processing-statusbar__item:hover \.processing-statusbar__tc[\s\S]*text-shadow: none/
    )
    expect(css).toMatch(
      /\.processing-preview:hover \.processing-preview__overlays \.processing-preview__watermark/
    )
  })
})
