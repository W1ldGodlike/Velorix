# Логи и диагностика

## Где лежит журнал

Основной текстовый журнал главного процесса — файл **`main.log`** в подпапке `logs` внутри служебной папки приложения (рядом с настройками и очередями). Рядом может лежать небольшой резервный файл при ротации.

## Сессионный лог

На каждый запуск создаётся отдельный короткий файл **сессии** — удобно отправить вместе с описанием шагов.

## Как открыть

Меню **«Инструменты»** содержит пункты для открытия журнала в программе просмотра и для **архива поддержки** (один zip с несколькими полезными файлами).

В `diagnostics.txt` архива:

- **`ownerHardwareChecklist:`** — чеклист владельца на железе (тема, HiDPI, HW, packaged, §21 e2e); см. [about-support-logs.md](about-support-logs.md).
- **`releaseSmoke:`** — CI packaged pipeline и §21 e2e-план; см. [about-support-logs.md](about-support-logs.md).
- **`terminalHints:`** — подсказки терминала; см. [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md).

## Подробнее про «О программе»

Кнопки очистки временных данных и размеры служебных каталогов — в статье [about-support-logs.md](about-support-logs.md).

## См. также

[about-support-logs.md](about-support-logs.md) (Support ZIP `ownerHardwareChecklist:`) · [packaged-windows-smoke.md](packaged-windows-smoke.md) (после `pack:dir`).
