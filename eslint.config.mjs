import { defineConfig } from 'eslint/config'
import tseslint from '@electron-toolkit/eslint-config-ts'
import eslintConfigPrettier from '@electron-toolkit/eslint-config-prettier'
import eslintPluginReact from 'eslint-plugin-react'
import eslintPluginReactHooks from 'eslint-plugin-react-hooks'
import eslintPluginReactRefresh from 'eslint-plugin-react-refresh'

export default defineConfig(
  // Сгенерированные каталоги и зависимости не линтим: они большие и не являются исходниками проекта.
  {
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/out',
      'scripts/cursor-automation/**',
      'scripts/inject-flux-summary-pole.mjs',
      'scripts/journal-lib.mjs',
      'scripts/journal-next-stamp.mjs',
      'scripts/journal-consolidate.mjs',
      'scripts/check-journal-numbering.mjs',
      'scripts/engines-bundled-sha256.mjs'
    ]
  },
  tseslint.configs.recommended,
  eslintPluginReact.configs.flat.recommended,
  eslintPluginReact.configs.flat['jsx-runtime'],
  {
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': eslintPluginReactHooks,
      'react-refresh': eslintPluginReactRefresh
    },
    rules: {
      // Hooks и refresh-правила ловят ошибки, которые TypeScript не видит: порядок hooks и export shape.
      ...eslintPluginReactHooks.configs.recommended.rules,
      ...eslintPluginReactRefresh.configs.vite.rules
    }
  },
  eslintConfigPrettier
)
