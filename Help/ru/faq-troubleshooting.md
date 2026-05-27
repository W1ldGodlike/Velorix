# FAQ и устранение неполадок

![Оглавление справки по разделам](assets/knowledge-dialog-toc.svg)

Краткие ответы на частые вопросы. Подробности — в статьях разделов 1–6 (оглавление слева в справке).

## Загрузка не стартует или сразу ошибка

- Проверьте, что **движок yt-dlp** найден: [engines-update-paths.md](engines-update-paths.md).
- Для сайтов с входом — **куки** в панели загрузок: [downloads-settings-rail.md](downloads-settings-rail.md).
- Посмотрите текст ошибки в строке очереди и лог: [logging-and-diagnostics.md](logging-and-diagnostics.md).

## Видео скачалось, но не открывается в редакторе

- Убедитесь, что файл **полностью докачан** (статус «готово», нет `.part`).
- Откройте файл вручную: кнопки «файл» / «папка» в истории загрузок — [downloads-workflow.md](downloads-workflow.md).
- Проверьте формат: некоторые контейнеры требуют другого пресета экспорта — [ffmpeg-rail-presets.md](ffmpeg-rail-presets.md).

## Экспорт ffmpeg падает или «зависает»

- Сначала **превью** и короткий фрагмент (In/Out на таймлайне): [editor-workflow.md](editor-workflow.md).
- Упростите пресет (без тяжёлых фильтров) — [processing-social-presets.md](processing-social-presets.md).
- Аппаратное кодирование: [hardware-encoding.md](hardware-encoding.md).
- Пакетная очередь: не запускайте второй полный batch поверх занятого диска — [session-and-queues.md](session-and-queues.md).

## Терминал: «запрещено» или «не найден движок»

- Разрешены только **ffmpeg**, **ffprobe**, **yt-dlp** без shell-символов (`|`, `;`, `` ` ``).
- Путь к движку — в настройках; см. [tools-terminal-inspector.md](tools-terminal-inspector.md) и [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md).
- Подсказки справа ищите **по словам** («дорожка», «громкость»), а не по индексам вроде `v:0`.

## Инспектор / probe пустой или странный

- Выберите **файл на диске** (не только URL без локального файла).
- Обновите сводку ffprobe; см. [probe-and-inspector-basics.md](probe-and-inspector-basics.md).
- Сырой JSON — для опытных; для обычной работы достаточно блоков «дорожки» и «главы».

## Текст обрезается или NEON-поверхность выглядит «грязно»

- Масштаб Windows 100–200 %: чеклист в [appearance-language-theme.md](appearance-language-theme.md) и **Настройки → Общие → HiDPI**; полный пакет — [about-support-logs.md](about-support-logs.md).
- Канон единой темы и визуальный чеклист: [appearance-language-theme.md](appearance-language-theme.md). Варианты `dark` / `light` / `system` и legacy pop-out больше не относятся к целевому UX.

## Язык справки не совпадает с интерфейсом

Смените язык UI (RU/EN) и снова откройте справку — подтянется `Help/en/*.md` при наличии пары: [knowledge-base-howto.md](knowledge-base-howto.md).

## Где горячие клавиши

- [keyboard-shortcuts.md](keyboard-shortcuts.md)

## См. также

[about-support-logs.md](about-support-logs.md) (Support ZIP `ownerHardwareChecklist:`) · [packaged-windows-smoke.md](packaged-windows-smoke.md) (после `pack:dir`).
