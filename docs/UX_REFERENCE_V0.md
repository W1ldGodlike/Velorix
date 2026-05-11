# FluxAlloy v0 UX Reference

Краткая карта v0-референса для Cursor SDK/Assistant. Использовать как ориентир для UI/UX-переноса без слепого копирования.

## Источник анализа

- Проверен `https://v0-fluxalloy-desktop-app.vercel.app/` через Playwright.
- Пройдены состояния `Редактор` и `Загрузки`, клики по IN/OUT, timeline, collapsible sections, switches и action-кнопкам таблицы загрузок.
- Отдельный canvas-артефакт для человека: `v0-fluxalloy-ux-map.canvas.tsx` в Cursor canvases.
- В скопированном логе v0 подтверждены Next 16, Radix UI (`tabs`, `accordion/collapsible`, `select`, `switch`) и `lucide-react`.
- Известный баг v0: hydration mismatch из-за случайных высот waveform. Такую random-разметку не копировать.

## Общая модель

- Интерфейс выглядит как компактная монтажная/инженерная программа, а не веб-форма.
- Палитра почти чёрная: body около black, панели лишь слегка светлее, borders очень тонкие.
- Основной акцент — синий: активная вкладка, progress bars, primary actions, timeline selection.
- Success/error markers — зелёный/красный, но без перегруза цветами.
- Плотность высокая: icon buttons 24-28px, секции 28-36px, мелкий моноширинный текст для команд/путей/логов.

## Topbar

- Высота около 70px в v0.
- Слева: бренд `FluxAlloy`, версия, иконки `folder-open`, `save`, `rotate-ccw`, `rotate-cw`, `scissors`.
- Центр: tabs `Редактор` / `Загрузки`, активная вкладка подчёркнута синим.
- Справа: строка версий `ffmpeg 6.1 • yt-dlp 2024.01` и icon cluster `film`, `download`, `settings`, `help`.
- Вывод: topbar должен быть коротким и не содержать все настройки.

## Editor Layout

- Главный визуальный центр — preview.
- После preview идёт transport strip:
  - `skip-back`, `chevron-left`, `play`, `chevron-right`, `skip-forward`;
  - справа `volume`, fullscreen.
- Timeline отделён от preview:
  - IN/OUT controls;
  - `Обрезать`;
  - zoom out/in;
  - waveform;
  - time ruler;
  - media facts (`Видео`, `Аудио`, `Позиция`).
- Клик по timeline меняет позицию и frame counter.
- `IN`/`OUT` меняют маркеры и длительность сразу.

## FFmpeg Settings

- В v0 это accordion/collapsible блок, а не длинный toolbar.
- Секции:
  - `Видео`: кодек, контейнер, preset, CRF/качество.
  - `Формат`: разрешение, частота кадров, 2-pass switch, hardware acceleration switch.
  - `Аудио`: свернута по умолчанию.
  - `Вывод`: путь, имя файла, command preview, primary export button.
- Для FluxAlloy: держать settings в боковой/нижней панели, сохранять preview/timeline доминирующими.

## Downloads Layout

- `Загрузки` — полноценная рабочая вкладка, не маленькая форма.
- Компоновка:
  - сверху input band: textarea для URL + кнопки `Добавить в очередь`, `Начать загрузку`;
  - центр: queue table;
  - снизу: operation log;
  - справа: settings rail.
- Таблица:
  - `#`;
  - название + source URL;
  - format;
  - size;
  - progress bar + percent;
  - speed;
  - оставшееся время (колонка «Осталось»);
  - status with dot;
  - icon-only actions.
- Row actions:
  - running: pause + cancel;
  - done: open folder + remove;
  - queued/error: play/retry + remove.
- Settings rail sections:
  - `Формат`;
  - `Метаданные`;
  - `Сохранение`;
  - `Сеть`.
- Switches в v0 выглядят как маленькие pill toggles, не checkbox.
- Правило переноса: если значение бинарное (`вкл/выкл`, `да/нет`, `без аудио`, `audio-only`, `2-pass`, `HW acceleration`) — использовать pill switch с короткой русской подсказкой. Если вариантов больше двух — использовать select/radio.

## Icons To Prefer

Ориентир на lucide-style:

- `folder-open` — открыть файл/папку;
- `save` — сохранить;
- `rotate-ccw` / `rotate-cw`;
- `scissors`;
- `film`;
- `download`;
- `settings`;
- `circle-question`;
- `skip-back`, `chevron-left`, `play`, `chevron-right`, `skip-forward`;
- `volume-2`;
- `maximize-2`;
- `zoom-out`, `zoom-in`;
- `pause`;
- `x`;
- `trash-2`.

## Правила переноса

- Не копировать пиксель-в-пиксель и не тащить Next/Radix в проект ради внешнего сходства.
- В Electron/vanilla HTML можно повторять структуру: tabs, accordion, settings rail, table/log split, icon-only actions.
- Не добавлять heavy abstractions, пока UI живёт в data HTML окне.
- Любой новый UI-блок сверять с этим документом и `IMPLEMENTATION_CHECKLIST.md`.
- После крупных UI-изменений обновлять `Ближайший TODO спринта`.
