# Ручной smoke Linux (pack:linux:dir)

Проверка **собранного** приложения из `dist/linux-unpacked/`, а не dev-сервера Vite. Автоматическая проверка дерева **`npm run verify:linux-unpacked`** **не заменяет** этот прогон.

## Подготовка

```bash
npm run build
npm run pack:linux:dir
npm run verify:linux-unpacked
```

В каталоге должны быть `fluxalloy` или `FluxAlloy` и `resources/bin/{yt-dlp,ffmpeg,ffprobe}` (движки в `bin/` перед упаковкой могут понадобиться для релиза).

## Чеклист в приложении

**Настройки → Зависимости → Ручной smoke Linux (pack:linux:dir)** — те же шаги можно скопировать в отчёт; они попадают в Support ZIP (`linuxPackagedSmoke:`).

## Копирование и локали

**Скопировать** в packaged-панели — формат как Support ZIP (`owner:` / `step [id]:`). EN UI — `locales/en/linux-packaged-manual-smoke.json`. Полный пакет — [owner-manual-smoke.md](owner-manual-smoke.md). Dev: `check:packaged-manual-smoke-parity`.

## Краткий порядок

1. Запустить бинарник из `dist/linux-unpacked/`.
2. Статусбар: версии движков без «не найден».
3. Редактор, загрузки, снимок, экспорт, спрайт §7.5, мини-плеер §4.3 при busy-задачах, база знаний, Support ZIP.
4. Закрыть и снова открыть — без падения.

Подробности — [`docs/RELEASE.md`](../docs/RELEASE.md) §4.1.

См. также [about-support-logs.md](about-support-logs.md) и [packaged-windows-smoke.md](packaged-windows-smoke.md).
