# Ручной smoke macOS (pack:mac:dir)

Проверка **собранного** `FluxAlloy.app` из `dist/mac-arm64/` (или `dist/mac/`, `dist/mac-x64/`), а не dev-сервера Vite. Автоматическая проверка дерева **`npm run verify:mac-unpacked`** **не заменяет** этот прогон.

## Подготовка

```bash
npm run build
npm run pack:mac:dir
npm run verify:mac-unpacked
```

В бандле должны быть `Contents/MacOS/FluxAlloy` и `Contents/Resources/bin/`.

## Чеклист в приложении

**Настройки → Зависимости → Ручной smoke macOS (pack:mac:dir)** — шаги можно скопировать; они попадают в Support ZIP (`macosPackagedSmoke:`).

## Краткий порядок

1. Открыть `FluxAlloy.app`.
2. Статусбар, редактор, загрузки, снимок, экспорт, база знаний, Support ZIP.
3. Выйти и снова открыть бандл — без падения.

Подробности — [`docs/RELEASE.md`](../docs/RELEASE.md) §4.2.

См. также [about-support-logs.md](about-support-logs.md) и [packaged-windows-smoke.md](packaged-windows-smoke.md).
