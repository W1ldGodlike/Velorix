# Ручной smoke Windows (pack:dir)

Проверка **собранного** приложения из `dist/win-unpacked/`, а не dev-сервера Vite. Автоматические шаги CI/релиза (`verify:win-unpacked`, `smoke:packaged-release`) **не заменяют** этот прогон.

## Подготовка

```powershell
npm run check:release
```

Или по шагам: `npm run pack:dir`, затем `npm run verify:win-unpacked` и `npm run smoke:packaged-release`.

В каталоге должны быть `FluxAlloy.exe` и `resources/bin/{yt-dlp,ffmpeg,ffprobe}.exe`.

## Чеклист в приложении

**Настройки → Зависимости → Ручной smoke Windows (pack:dir)** — те же шаги можно скопировать в отчёт; они попадают в Support ZIP (`winPackagedSmoke:`).

## Краткий порядок

1. Запустить `dist/win-unpacked/FluxAlloy.exe`.
2. Статусбар: версии движков без «не найден».
3. Редактор: локальный файл, превью, scrub.
4. Загрузки: короткий URL, очередь до «Готово».
5. «В редактор» для готового файла.
6. Снимок кадра и экспорт MP4.
7. База знаний и Support ZIP.
8. Закрыть и снова открыть exe — без падения.

Подробности сборки — [`docs/RELEASE.md`](../docs/RELEASE.md) (корень репозитория).

См. также [about-support-logs.md](about-support-logs.md) и [logging-and-diagnostics.md](logging-and-diagnostics.md).
