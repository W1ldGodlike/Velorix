# scripts/

| Каталог | Назначение |
|---------|------------|
| **gate/** | `check:quiet`, guards, `run-quiet-check.mjs` |
| **audit/** | `audit:*` (инвентарь, structural, IPC, copy-paste, terminal prune) |
| **release/** | engines prepare/verify, packaged smoke, `write-app-build-info` |
| **e2e/** | `test:e2e:gui`, Playwright runner + scaffold |
| **maint/** | журнал, локали терминала, Help sync footers, theme tokenize (ручные) |
| **lib/** | общие хелперы для скриптов |
| **cursor-automation/** | SDK agent loop (отдельный package) |

Корень `scripts/`: только `audit-scope.config.mjs` (общий конфиг audit).

Одноразовые `split-*` / `migrate-*` / `_migrate-*` в репо **запрещены** (`check:maint-scripts-layout`).
