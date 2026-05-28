import { resolve } from 'path'
import { defineConfig } from 'electron-vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'
import MagicString from 'magic-string'

import { ELECTRON_VITE_ESM_SHIM_FIX_PLUGIN_NAME } from './src/shared/electron-vite-build-meta'

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
    name: ELECTRON_VITE_ESM_SHIM_FIX_PLUGIN_NAME,
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

/**
 * Vite dev вставляет inline `<script type="module">` (react-refresh, @vite/client).
 * Строгий `script-src 'self'` в index.html блокирует их — окно остаётся чёрным при `npm run dev`.
 */
function rendererDevCspPlugin(): Plugin {
  return {
    name: 'VELORIX-renderer-dev-csp',
    apply: 'serve',
    transformIndexHtml(html) {
      return html
        .replace("script-src 'self'", "script-src 'self' 'unsafe-inline'")
        .replace(
          "connect-src 'self' http://127.0.0.1:* velorixmedia:",
          "connect-src 'self' http://127.0.0.1:* http://localhost:* ws://127.0.0.1:* ws://localhost:* velorixmedia:"
        )
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
  // Main — дефолт; preload — один entry для единого shell renderer.
  main: { plugins: [fixedEsmShimPlugin()] },
  preload: {
    // Vite 8 SSR: preset electron-vite ставит ssr.noExternal=true → в бандл попадает electron/index.js
    // (install.js), а не runtime API → диалог out/preload/install.js и чёрное окно.
    ssr: {
      // Vite 8 SSROptions types omit `false`; overrides electron-vite preset `noExternal: true`.
      // @ts-expect-error — keep electron / @electron-toolkit/preload external in preload bundle
      noExternal: false
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve('src/preload/index.ts')
        },
        external: ['electron', /^electron\/.+/, '@electron-toolkit/preload']
      }
    }
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src')
      }
    },
    plugins: [react(), rendererDevCspPlugin()]
  }
})
