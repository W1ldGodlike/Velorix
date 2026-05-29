# Логи и диагностика

## Где лежит журнал

Основной текстовый журнал главного процесса — файл **`main.log`** в подпапке `logs` внутри служебной папки приложения (рядом с настройками и очередями). Рядом может лежать небольшой резервный файл при ротации.

## Сессионный лог

На каждый запуск создаётся отдельный короткий файл **сессии** — удобно отправить вместе с описанием шагов.

## Как открыть

Меню **«Инструменты»** содержит пункты для открытия журнала в программе просмотра и для **архива поддержки** (один zip с несколькими полезными файлами).

В `diagnostics.txt` архива:

- **`engines:`** — ffmpeg / ffprobe / yt-dlp.
- **`terminalHints:`** — подсказки терминала; см. [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md).
- **`unpackedLayout:`** — layout packaged-сборок win/linux/macos; см. [about-support-logs.md](about-support-logs.md).

## Подробнее про «О программе»

Кнопки очистки временных данных и размеры служебных каталогов — в статье [about-support-logs.md](about-support-logs.md).

## См. также

[about-support-logs.md](about-support-logs.md) · [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md).
