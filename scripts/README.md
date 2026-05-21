# scripts/

| Каталог | Назначение | npm |
|---------|------------|-----|
| **gate/** | `check:quiet`, guards, `run-quiet-check.mjs` | `check:*` |
| **audit/** | `audit:*` (инвентарь, structural, IPC, prune) | `audit:*` |
| **release/** | engines, packaged smoke, verify layouts | `engines:*`, `smoke:*`, `verify:*`, `build` |
| **e2e/** | Playwright GUI + scaffold fallback | `test:e2e:gui` |
| **maint/** | журнал, локали терминала, Help sync (ручные) | `journal:*`, `locales:*`, `sync:*`, `theme:*` |
| **lib/** | хелперы (импорт из gate/release, не npm) | — |
| **data/** | JSON для maint (terminal RU pairs) | — |
| **cursor-automation/** | SDK agent loop | `agent:*` |

Корень: только `audit-scope.config.mjs`.

**Без npm** (импорт / fallback): см. `SCRIPTS_WIRING_EXEMPT_REL_PATHS` в [`scripts-inventory-meta.ts`](../src/shared/scripts-inventory-meta.ts).

**Запрещены** одноразовые `split-*` / `migrate-*` / `_migrate-*` (`check:maint-scripts-layout`).

**Проверка:** `npm run check:scripts-wiring` — каждый `.mjs` в gate|audit|release|maint|e2e в `package.json` или exempt-списке.

## tests/ (не в scripts/, та же схема)

| Каталог | Раннер |
|---------|--------|
| `tests/shared`, `main`, `renderer`, `scripts`, `fixtures` | `npm run test` (Vitest `*.test.ts`) |
| `tests/e2e/gui` | `npm run test:e2e:gui` (Playwright `*.spec.ts`) |

Артефакты Playwright: `test-results/`, `playwright-report/` — в `.gitignore`.
