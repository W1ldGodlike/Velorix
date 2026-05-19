# Логи и диагностика

## Где лежит журнал

Основной текстовый журнал главного процесса — файл **`main.log`** в подпапке `logs` внутри служебной папки приложения (рядом с настройками и очередями). Рядом может лежать небольшой резервный файл при ротации.

## Сессионный лог

На каждый запуск создаётся отдельный короткий файл **сессии** — удобно отправить вместе с описанием шагов.

## Как открыть

Меню **«Инструменты»** содержит пункты для открытия журнала в программе просмотра и для **архива поддержки** (один zip с несколькими полезными файлами).

В `diagnostics.txt` архива:

- **`ownerManualSmoke:`** — полный пакет ручного smoke (тема, HiDPI, HW, packaged, §21 e2e per-step `e2e <id>:`); см. [owner-manual-smoke.md](owner-manual-smoke.md).
- **`releaseSmoke:`** — CI packaged pipeline, layout win/linux/macos и тот же §21 e2e-план; см. [about-support-logs.md](about-support-logs.md).

Dev: `npm run check:packaged-e2e-scenarios-registry`, `check:help-workflow-smoke-crosslinks` (в `check:quiet`). В Support ZIP строка **planned GUI e2e scope** (8 шагов Playwright позже; 2 manual-owner: sprite, mini-player).

## Подробнее про «О программе»

Кнопки очистки временных данных и размеры служебных каталогов — в статье [about-support-logs.md](about-support-logs.md).
