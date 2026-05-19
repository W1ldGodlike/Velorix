# Буфер обмена и перетаскивание на «Загрузках»

## Автоматически из буфера

Когда вы открываете вкладку **«Загрузки»** или возвращаетесь в окно программы, FluxAlloy ищет в буфере обмена строки, похожие на обычные **веб-адреса** (начинаются с `http://` или `https://`), и может сама добавить их в очередь. Это ускоряет работу из браузера.

## Перетаскивание

На свободную область вкладки (не на само поле ввода) можно перетащить:

- текст со ссылками — программа выделит адреса по пробелам и переносам строк;
- текстовый файл со списком ссылок;
- ярлык `.url` из Windows — откроется и прочитается адрес.

## Вручную

Всегда можно вставить текст обычным **Ctrl+V**, когда курсор стоит в поле адреса, или воспользоваться меню приложения.

Подробнее про очередь — [downloads-workflow.md](downloads-workflow.md). Packaged **ytdlp** после `pack:dir` — [packaged-windows-smoke.md](packaged-windows-smoke.md); §21 e2e per-step `e2e <id>:` в `releaseSmoke:` — [owner-manual-smoke.md](owner-manual-smoke.md); dev-блок `terminalHints:` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md); Help: `check:help-workflow-smoke-crosslinks` (44 статьи; partition: tail 42 + ffmpeg + knowledge, FAQ вне 44).
