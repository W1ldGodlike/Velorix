import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import MagicString from 'magic-string'

/**
 * Workaround: electron-vite's `vite:esm-shim` plugin uses a regex (ESMStaticImportRe)
 * that false-positives on string literals ending with the word "import" followed by a quote
 * (e.g. `"no Node path import"`). This causes the CJS shim to be injected mid-code.
 *
 * This plugin:
 * 1. Removes the broken `vite:esm-shim` from the resolved plugin pipeline
 * 2. Correctly inserts the CJS shim after the real top-level import block
 */
function fixedEsmShimPlugin(): Plugin {
  const CJSyntaxRe = /__filename|__dirname|require\(|require\.resolve\(/
  const CJSShim = `\n// -- CommonJS Shims --\nimport __cjs_mod__ from 'node:module';\nconst __filename = import.meta.filename;\nconst __dirname = import.meta.dirname;\nconst require = __cjs_mod__.createRequire(import.meta.url);\n`

  return {
    name: 'fix:esm-shim',
    apply: 'build',
    enforce: 'post',
    configResolved(config) {
      const plugins = config.plugins as { name: string }[]
      const idx = plugins.findIndex((p) => p.name === 'vite:esm-shim')
      if (idx !== -1) {
        plugins.splice(idx, 1)
      }
    },
    renderChunk(code, _chunk, { format, sourcemap }) {
      if (format !== 'es') return null
      if (code.includes(CJSShim) || !CJSyntaxRe.test(code)) return null

      const lastImportEnd = findLastRealImportEnd(code)
      const s = new MagicString(code)
      s.appendRight(lastImportEnd, CJSShim)
      return { code: s.toString(), map: sourcemap ? s.generateMap({ hires: 'boundary' }) : null }
    }
  }
}

function findLastRealImportEnd(code: string): number {
  const lines = code.split('\n')
  let pos = 0
  let lastImportEnd = 0
  for (const line of lines) {
    const trimmed = line.trimStart()
    if (trimmed.startsWith('import ') || trimmed.startsWith('import{')) {
      lastImportEnd = pos + line.length + 1
    } else if (
      trimmed.length > 0 &&
      !trimmed.startsWith('//') &&
      !trimmed.startsWith('/*') &&
      !trimmed.startsWith('*')
    ) {
      if (lastImportEnd > 0) break
    }
    pos += line.length + 1
  }
  return lastImportEnd
}

export default defineConfig({
  // Main — дефолт; preload: главное окно + pop-out `#downloads` / `#inspector` (тот же entry).
  main: { plugins: [fixedEsmShimPlugin()] },
  preload: {
    build: {
      rollupOptions: {
        input: {
          index: resolve('src/preload/index.ts')
        }
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        // Алиас нужен, чтобы будущие UI-модули не строили длинные относительные импорты из renderer.
        '@renderer': resolve('src/renderer/src'),
        '@locales': resolve('locales')
      }
    },
    plugins: [react()]
  }
})
