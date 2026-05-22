import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

/** §19.3 / J-1586: repo icon for BrowserWindow + electron-builder packager. */
describe('resources/icon.png', () => {
  it('exists for electron-vite ?asset import in main-window', () => {
    const iconPath = join(process.cwd(), 'resources', 'icon.png')
    expect(existsSync(iconPath)).toBe(true)
  })

  it('is referenced in electron-builder.yml for packaged installers', () => {
    const yml = readFileSync(join(process.cwd(), 'electron-builder.yml'), 'utf8')
    expect(yml).toMatch(/^\s*icon:\s*resources\/icon\.png\s*$/m)
  })
})
