# «О программе», журналы и поддержка

## Версия

В диалоге «О программе» видно номер сборки приложения и версии встроенного движка страницы — это помогает при обращении в поддержку.

## Папка журналов

Там же есть переход к **папке журналов**. Файлы небольшие: при необходимости их можно приложить к письму.

## Архив для поддержки

Кнопка **архива** собирает несколько служебных файлов в один zip — удобно отправить целиком, не выбирая вручную.

В `diagnostics.txt` попадают:

- **`engines:`** — состояние ffmpeg / ffprobe / yt-dlp (путь, первая строка `-version`).
- **`terminalHints:`** — снимок подсказок терминала для поддержки; см. [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md) и [logging-and-diagnostics.md](logging-and-diagnostics.md).
- **`unpackedLayout:`** — наличие каталогов `dist/win-unpacked`, `dist/linux-unpacked`, `Velorix.app` (present/missing) без повторного `pack:dir` на другой ОС.

## См. также

[logging-and-diagnostics.md](logging-and-diagnostics.md) · [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md).
