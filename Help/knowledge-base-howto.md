# Как пользоваться справкой

Окно открывается кнопкой **«?»** в правом верхнем углу. Слева список статей и поиск, справа текст.

## Язык

Язык статей совпадает с языком интерфейса: русский или английский. Смените язык в настройках приложения и снова откройте справку — заголовки и текст подтянутся из отдельных файлов, без смешения двух языков в одной статье.

## Картинки

Иллюстрации лежат в папке `Help/assets`. В тексте используйте только такой вид ссылки:

`![Краткая подпись](assets/имя-файла.png)`

Готовые схемы UI: `workspace-tabs-diagram.svg`, `downloads-queue-overview.svg`, `editor-preview-timeline.svg`, `knowledge-dialog-toc.svg` (см. `assets/README.txt`).

При открытии статьи программа сама подставляет картинку в виде **встроенных данных** (небольшие файлы до ~512 КБ), чтобы схема показывалась и в режиме разработки, и в сборке. Подпись показывается, если картинка не загрузилась.

## Переходы

Синие кнопки в тексте ведут на другие статьи этой справки. Ссылки, начинающиеся с `https`, открываются во внешнем браузере.

## Тема и масштаб экрана

Статьи [appearance-language-theme.md](appearance-language-theme.md) и [owner-manual-smoke.md](owner-manual-smoke.md) описывают чеклисты в **Настройки → Общие** (тема, HiDPI) и полный пакет **Ручной smoke** для Support ZIP. Точка входа для новичка — также [getting-started.md](getting-started.md).

## Packaged smoke и §21 e2e

Статьи workflow (редактор, загрузки, ffprobe, планировщик) ссылаются на [packaged-windows-smoke.md](packaged-windows-smoke.md) и соседние для Linux/macOS. В Support ZIP `releaseSmoke:` — layout win/linux/macos и per-step `e2e <id>:`; см. [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md). Dev: `npm run check:help-workflow-smoke-crosslinks`.

## Таблицы

В окне справки **нет** разметки таблиц из символов `|`. Если нужен список «что — к чему», оформляйте **маркированным списком** и выделяйте первую часть жирным, например: `- **Ctrl+O** — открыть файл…`
