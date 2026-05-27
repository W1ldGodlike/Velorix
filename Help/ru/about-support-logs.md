# «О программе», журналы и поддержка

## Версия

В диалоге «О программе» видно номер сборки приложения и версии встроенного движка страницы — это помогает при обращении в поддержку.

## Папка журналов

Там же есть переход к **папке журналов**. Файлы небольшие: при необходимости их можно приложить к письму.

## Архив для поддержки

Кнопка **архива** собирает несколько служебных файлов в один zip — удобно отправить целиком, не выбирая вручную.

В `diagnostics.txt` попадают:

- **`ownerHardwareChecklist:`** — чеклист владельца на вашем ПК (тема NEON, HiDPI, HW, сценарий, спрайт §7.5, packaged для вашей ОС, планировщик, Windows shell); канон **ru**; при EN UI в буфере копирования — EN-строки из locales.
- **`winPackagedSmoke:`** / **`linuxPackagedSmoke:`** / **`macosPackagedSmoke:`** — packaged-чеклисты (Windows всегда в ZIP; Linux/macOS — при сборке на соответствующей ОС); см. [packaged-windows-smoke.md](packaged-windows-smoke.md), [packaged-linux-smoke.md](packaged-linux-smoke.md), [packaged-macos-smoke.md](packaged-macos-smoke.md).
- **`terminalHints:`** — снимок подсказок терминала для поддержки; см. [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md) и [logging-and-diagnostics.md](logging-and-diagnostics.md).
- **`releaseSmoke:`** — сводка CI packaged-сборки и план §21 e2e (те же строки, что в UI **Скопировать** в packaged-чеклистах); см. [packaged-windows-smoke.md](packaged-windows-smoke.md) и [logging-and-diagnostics.md](logging-and-diagnostics.md).

## См. также

[packaged-windows-smoke.md](packaged-windows-smoke.md) (после `pack:dir`) · [logging-and-diagnostics.md](logging-and-diagnostics.md).
