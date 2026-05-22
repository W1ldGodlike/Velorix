import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import { ELECTRON_VITE_ESM_SHIM_FIX_PLUGIN_NAME } from '../../src/shared/electron-vite-build-meta'

const STRICT_COMPILER_OPTIONS = [
  'noImplicitAny',
  'noUncheckedIndexedAccess',
  'exactOptionalPropertyTypes',
  'noPropertyAccessFromIndexSignature',
  'useUnknownInCatchVariables'
] as const

function readCompilerOptions(path: string): Record<string, unknown> {
  const json = JSON.parse(readFileSync(path, 'utf8')) as {
    compilerOptions?: Record<string, unknown>
  }
  return json.compilerOptions ?? {}
}

function majorOfRange(version: string): number {
  const match = /^[\^~]?(\d+)/.exec(version.trim())
  if (!match) {
    throw new Error(`unparseable semver range: ${version}`)
  }
  return Number(match[1])
}

describe('toolchain baseline (package.json / .npmrc / tsconfig.web)', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
    type?: string
    engines?: { node?: string }
    pnpm?: { onlyBuiltDependencies?: string[] }
    dependencies: Record<string, string>
    devDependencies: Record<string, string>
    scripts: Record<string, string>
  }
  const dev = pkg.devDependencies
  const deps = pkg.dependencies

  it('locks Electron 42, Vite 8, TypeScript 6, ESLint 9', () => {
    const electron = dev['electron'] ?? ''
    const vite = dev['vite'] ?? ''
    const typescript = dev['typescript'] ?? ''
    const eslint = dev['eslint'] ?? ''
    expect(electron.length).toBeGreaterThan(0)
    expect(vite.length).toBeGreaterThan(0)
    expect(typescript.length).toBeGreaterThan(0)
    expect(eslint.length).toBeGreaterThan(0)
    expect(majorOfRange(electron)).toBe(42)
    expect(majorOfRange(vite)).toBe(8)
    expect(majorOfRange(typescript)).toBe(6)
    expect(majorOfRange(eslint)).toBe(9)
  })

  it('root .npmrc sets legacy-peer-deps for Vite 8 vs electron-vite peer', () => {
    expect(readFileSync('.npmrc', 'utf8')).toContain('legacy-peer-deps=true')
  })

  it('tsconfig.web.json uses explicit paths without deprecated baseUrl (TS 6)', () => {
    const web = JSON.parse(readFileSync('tsconfig.web.json', 'utf8')) as {
      compilerOptions?: { baseUrl?: string; paths?: Record<string, string[]> }
    }
    expect(web.compilerOptions?.baseUrl).toBeUndefined()
    expect(web.compilerOptions?.paths?.['@renderer/*']).toEqual(['./src/renderer/src/*'])
    expect(web.compilerOptions?.paths?.['@locales/*']).toEqual(['./locales/*'])
  })

  it('locks electron-vite 5 and Vitest 4; check:quiet script present', () => {
    const electronVite = dev['electron-vite'] ?? ''
    const vitest = dev['vitest'] ?? ''
    expect(electronVite.length).toBeGreaterThan(0)
    expect(vitest.length).toBeGreaterThan(0)
    expect(majorOfRange(electronVite)).toBe(5)
    expect(majorOfRange(vitest)).toBe(4)
    expect(pkg.scripts['check:quiet']?.length).toBeGreaterThan(0)
  })

  it('locks @vitejs/plugin-react 6; electron.vite.config keeps fix:esm-shim', () => {
    const pluginReact = dev['@vitejs/plugin-react'] ?? ''
    expect(pluginReact.length).toBeGreaterThan(0)
    expect(majorOfRange(pluginReact)).toBe(6)
    const viteConfig = readFileSync('electron.vite.config.ts', 'utf8')
    expect(viteConfig).toContain('electron-vite-build-meta')
    expect(viteConfig).toContain('fixedEsmShimPlugin')
    expect(viteConfig).toContain("p.name === 'vite:esm-shim'")
    expect(viteConfig).toContain('MagicString')
    expect(viteConfig).toContain('ELECTRON_VITE_ESM_SHIM_FIX_PLUGIN_NAME')
    expect(ELECTRON_VITE_ESM_SHIM_FIX_PLUGIN_NAME).toBe('fix:esm-shim')
    expect(viteConfig).toContain('findLastRealImportEnd')
  })

  it('exposes build and typecheck npm scripts for baseline gate', () => {
    expect(pkg.scripts['build']?.length).toBeGreaterThan(0)
    expect(pkg.scripts['typecheck']?.length).toBeGreaterThan(0)
    expect(pkg.scripts['build']).toContain('electron-vite')
  })

  it('locks Node engines floor, ESM package type, and React 19', () => {
    expect(pkg.type).toBe('module')
    expect(pkg.engines?.node).toBe('>=20.19.0')
    for (const name of ['react', 'react-dom'] as const) {
      const version = dev[name] ?? ''
      expect(version.length).toBeGreaterThan(0)
      expect(majorOfRange(version)).toBe(19)
    }
  })

  it('locks electron-builder 26, zustand 5, and ESLint 9 flat config', () => {
    const electronBuilder = dev['electron-builder'] ?? ''
    const zustand = deps['zustand'] ?? ''
    expect(electronBuilder.length).toBeGreaterThan(0)
    expect(zustand.length).toBeGreaterThan(0)
    expect(majorOfRange(electronBuilder)).toBe(26)
    expect(majorOfRange(zustand)).toBe(5)
    const eslintConfig = readFileSync('eslint.config.mjs', 'utf8')
    expect(eslintConfig).toContain("from 'eslint/config'")
    expect(eslintConfig).toContain('@electron-toolkit/eslint-config-ts')
    expect(eslintConfig).toContain('@electron-toolkit/eslint-config-prettier')
  })

  it('locks Vitest 4 node runner, coverage v8 scope, and electron-toolkit runtime deps', () => {
    const coverage = dev['@vitest/coverage-v8'] ?? ''
    expect(coverage.length).toBeGreaterThan(0)
    expect(majorOfRange(coverage)).toBe(4)
    expect(pkg.scripts['test']).toContain('vitest run')
    expect(pkg.scripts['test:coverage']).toContain('--coverage')
    const vitestConfig = readFileSync('vitest.config.ts', 'utf8')
    expect(vitestConfig).toContain("environment: 'node'")
    expect(vitestConfig).toContain("include: ['tests/**/*.test.ts']")
    expect(vitestConfig).toContain("provider: 'v8'")
    expect(vitestConfig).toContain('src/shared/**/*.ts')
    expect(vitestConfig).toContain('src/main/**/*.ts')
    expect(majorOfRange(deps['@electron-toolkit/preload'] ?? '')).toBe(3)
    expect(majorOfRange(deps['@electron-toolkit/utils'] ?? '')).toBe(4)
  })

  it('locks typecheck triplet, lint/format scripts, @types majors, and pnpm native builds', () => {
    expect(pkg.scripts['typecheck']).toContain('typecheck:node')
    expect(pkg.scripts['typecheck']).toContain('typecheck:web')
    expect(pkg.scripts['typecheck']).toContain('typecheck:tests')
    expect(pkg.scripts['typecheck:node']).toContain('tsconfig.node.json')
    expect(pkg.scripts['typecheck:web']).toContain('tsconfig.web.json')
    expect(pkg.scripts['typecheck:tests']).toContain('tsconfig.tests.json')
    expect(pkg.scripts['lint']).toContain('eslint')
    expect(pkg.scripts['lint']).toContain('--max-warnings 0')
    expect(pkg.scripts['format']).toContain('prettier')
    expect(majorOfRange(dev['prettier'] ?? '')).toBe(3)
    expect(majorOfRange(dev['@types/node'] ?? '')).toBe(25)
    expect(majorOfRange(dev['@types/react'] ?? '')).toBe(19)
    expect(majorOfRange(dev['@electron-toolkit/tsconfig'] ?? '')).toBe(2)
    expect(pkg.pnpm?.onlyBuiltDependencies).toEqual(['electron', 'esbuild'])
  })

  it('tsconfig.tests.json includes vitest.config and test sources', () => {
    const json = JSON.parse(readFileSync('tsconfig.tests.json', 'utf8')) as { include?: string[] }
    expect(json.include).toContain('vitest.config.ts')
    expect(json.include).toContain('tests/**/*.ts')
  })

  it('electron-vite wires main/preload/renderer; web tsconfig paths match vite aliases', () => {
    const viteConfig = readFileSync('electron.vite.config.ts', 'utf8')
    expect(viteConfig).toContain('main:')
    expect(viteConfig).toContain('preload:')
    expect(viteConfig).toContain('renderer:')
    expect(viteConfig).toContain("index: resolve('src/preload/index.ts')")
    expect(viteConfig).toContain("@renderer': resolve('src/renderer/src')")
    expect(viteConfig).toContain("@locales': resolve('locales')")
    expect(viteConfig).toContain('plugins: [react(), rendererDevCspPlugin()]')
    expect(viteConfig).toContain("name: 'VELORIX-renderer-dev-csp'")
    const webOpts = readCompilerOptions('tsconfig.web.json')
    const paths = webOpts['paths'] as Record<string, string[]>
    expect(paths['@renderer/*']).toEqual(['./src/renderer/src/*'])
    expect(paths['@locales/*']).toEqual(['./locales/*'])
    expect(webOpts['baseUrl']).toBeUndefined()
    expect(webOpts['jsx']).toBe('react-jsx')
  })

  it('eslint flat config covers TSX react-hooks/refresh; check aliases check:quiet', () => {
    const eslintConfig = readFileSync('eslint.config.mjs', 'utf8')
    expect(eslintConfig).toContain('eslint-plugin-react-hooks')
    expect(eslintConfig).toContain('eslint-plugin-react-refresh')
    expect(eslintConfig).toContain("files: ['**/*.{ts,tsx}']")
    expect(pkg.scripts['check']).toBe('npm run check:quiet')
  })

  it('tsconfig include graph covers electron layers; toolkit eslint dev majors', () => {
    const nodeJson = JSON.parse(readFileSync('tsconfig.node.json', 'utf8')) as {
      include?: string[]
    }
    expect(nodeJson.include).toContain('electron.vite.config.*')
    expect(nodeJson.include).toContain('src/main/**/*')
    expect(nodeJson.include).toContain('src/preload/**/*')
    expect(nodeJson.include).toContain('src/shared/**/*')
    const webJson = JSON.parse(readFileSync('tsconfig.web.json', 'utf8')) as {
      include?: string[]
    }
    expect(webJson.include).toContain('locales/**/*.json')
    expect(webJson.include).toContain('src/shared/**/*.ts')
    expect(majorOfRange(dev['@electron-toolkit/eslint-config-ts'] ?? '')).toBe(3)
    expect(majorOfRange(dev['@electron-toolkit/eslint-config-prettier'] ?? '')).toBe(3)
    expect(majorOfRange(dev['eslint-plugin-react'] ?? '')).toBe(7)
    expect(majorOfRange(deps['extract-zip'] ?? '')).toBe(2)
    const eslintConfig = readFileSync('eslint.config.mjs', 'utf8')
    expect(eslintConfig).toContain('eslint-plugin-react')
    expect(eslintConfig).toContain('configs.flat.recommended')
  })

  it('tsconfig node/web/tests extend @electron-toolkit/tsconfig baselines', () => {
    for (const file of ['tsconfig.node.json', 'tsconfig.web.json', 'tsconfig.tests.json']) {
      const json = JSON.parse(readFileSync(file, 'utf8')) as { extends?: string }
      expect(json.extends).toMatch(/^@electron-toolkit\/tsconfig\//)
    }
  })

  it('tsconfig node/web/tests share strict compiler baseline', () => {
    for (const file of ['tsconfig.node.json', 'tsconfig.web.json', 'tsconfig.tests.json']) {
      const opts = readCompilerOptions(file)
      for (const key of STRICT_COMPILER_OPTIONS) {
        expect(opts[key]).toBe(true)
      }
    }
    expect(readCompilerOptions('tsconfig.web.json')['baseUrl']).toBeUndefined()
  })
})
