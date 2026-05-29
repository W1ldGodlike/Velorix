import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

describe('ref.9 terminal shell (ui.3)', () => {
  it('TerminalScreen module and ref9 CSS exist', () => {
    const tsx = join(process.cwd(), 'src/renderer/src/pages/TerminalScreen.tsx')
    const css = join(process.cwd(), 'src/renderer/src/assets/ref9-terminal.css')
    const parts = join(process.cwd(), 'src/renderer/src/pages/terminal-ref9-parts.tsx')
    const data = join(process.cwd(), 'src/renderer/src/pages/terminal-ref9-data.ts')
    expect(readFileSync(tsx, 'utf8')).toContain('TerminalScreen')
    expect(readFileSync(tsx, 'utf8')).toContain('NeonReferenceOverlay')
    expect(readFileSync(tsx, 'utf8')).toContain('terminal-center__eyebrow')
    expect(readFileSync(tsx, 'utf8')).toContain('terminal-center__head-chip')
    expect(readFileSync(tsx, 'utf8')).toContain('terminal-statusbar__ready')
    expect(readFileSync(tsx, 'utf8')).toContain('terminal-statusbar__tc')
    expect(readFileSync(css, 'utf8')).toContain('.terminal-statusbar__dot')
    expect(readFileSync(tsx, 'utf8')).toContain('terminal-shell')
    expect(readFileSync(tsx, 'utf8')).toContain('TERMINAL_ACTIVE_NAV')
    expect(readFileSync(css, 'utf8')).toContain('terminal-log')
    expect(readFileSync(css, 'utf8')).toContain('terminal-rail')
    expect(readFileSync(css, 'utf8')).toContain('terminal-statusbar')
    expect(readFileSync(parts, 'utf8')).toContain('TerminalSettingsRail')
    expect(readFileSync(tsx, 'utf8')).toContain('processing-util-btn--notify')
    expect(readFileSync(parts, 'utf8')).toContain('terminal-rail__scroll')
    expect(readFileSync(parts, 'utf8')).toContain('terminal-rail__save-sticky')
    expect(readFileSync(tsx, 'utf8')).toContain('TERMINAL_STATUS_ROWS')
    expect(readFileSync(tsx, 'utf8')).toContain('TERMINAL_LOG_SUMMARY')
    expect(readFileSync(data, 'utf8')).toContain('TERMINAL_CENTER_SUMMARY')
    expect(readFileSync(data, 'utf8')).toContain('TERMINAL_STATUS_ROWS')
    expect(readFileSync(data, 'utf8')).toContain('TERMINAL_STATUS_READY')
    expect(readFileSync(tsx, 'utf8')).toContain('terminal-center__scroll')
    expect(readFileSync(tsx, 'utf8')).toContain('terminal-command-sticky')
    expect(readFileSync(css, 'utf8')).toContain('--processing-rail-w')
    expect(readFileSync(css, 'utf8')).toContain('.terminal-log__line:hover')
    expect(readFileSync(css, 'utf8')).toContain('.terminal-tab:hover')
    expect(readFileSync(css, 'utf8')).toContain('.terminal-rail__section:hover')
    expect(readFileSync(css, 'utf8')).toContain('grid-template-rows')
  })

  it('bootstrap supports ref.9 hash route', () => {
    const bootstrap = readFileSync(
      join(process.cwd(), 'src/renderer/src/app-neon-bootstrap.tsx'),
      'utf8'
    )
    expect(bootstrap).toContain("return 'ref9'")
    expect(bootstrap).toContain('TerminalScreen')
    expect(bootstrap).toContain('#terminal')
  })
})
