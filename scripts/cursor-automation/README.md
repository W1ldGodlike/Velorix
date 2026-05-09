# Автоматизация Cursor Agent (локальный SDK)

Не читает Composer-чат IDE. Запускает [**Cursor Agent TypeScript SDK**](https://cursor.com/docs/api/sdk/typescript) против **корня репозитория FluxAlloy** (`cwd` = два уровня выше этой папки).

## Подготовка

```bash
cd scripts/cursor-automation
npm install
```

Ключ API (личный или service account): обычно **Dashboard → Integrations**.
Если ключ был отправлен в чат/лог, лучше сразу отозвать его и создать новый.

```bash
# Windows PowerShell
$env:CURSOR_API_KEY = "cursor_..."

# Одна проверочная итерация (создаёт агента, один промпт, закрывает):
npm run once

# Цикл из нескольких «продолжай работу по чеклисту»
npm run loop
npm run loop -- --max-steps 8 --verbose
```

Из корня репозитория можно использовать алиасы:

```bash
npm run agent:once
npm run agent:loop
npm run agent:loop -- --max-steps 8 --verbose
```

Можно без переменной в терминале: создайте рядом файл **`.env`** (он игнорируется Git):

```dotenv
CURSOR_API_KEY=crsr_...
# Не задавайте `auto`: в SDK ближайший вариант — `default`.
# CURSOR_MODEL=default
```

Промпты по умолчанию: каталог **`prompts/`** (`initial.txt`, `continue.txt`). Свой текст — через `PROMPTS_DIR` или правка файлов.

## Число продолжений

По умолчанию цикл делает **5 итераций**: первый промпт из `initial.txt`, затем до 4 продолжений из `continue.txt`.

Способы задать число:

```powershell
# Разово из корня репозитория:
npm run agent:loop -- --max-steps 8

# Разово из scripts/cursor-automation:
npm run loop -- --max-steps 8

# Постоянно в scripts/cursor-automation\.env:
MAX_STEPS=8
```

## Стоп без убийства процесса

Создайте пустой файл **`STOP`** в этой папке (`scripts/cursor-automation/STOP`). Перед следующей итерацией скрипт выйдет с кодом 0. Файл можно удалить вручную.

## Stdin

Если передать промпт через pipe, он заменит `initial.txt` для **первого** шага (`--once` или `loop`); дальше в цикле — только `continue.txt`.

- cmd: `type my.txt | npm run once`
- PowerShell: `Get-Content my.txt -Raw | npm run once`

## Переменные окружения

| Переменная | Назначение |
|------------|------------|
| `CURSOR_API_KEY` | Обязательна |
| `MAX_STEPS` | Число итераций (если не задан `--max-steps`) |
| `CURSOR_MODEL` | По умолчанию `default`; `auto` в SDK невалиден |
| `VERBOSE=1` | Печать assistant/thinking из стрима |
| `PROMPTS_DIR` | Альтернативный каталог с `initial.txt` / `continue.txt` |
| `STEP_DELAY_MS` | Пауза между итерациями (мс), по умолчанию `400` |
| `SETTING_SOURCES_ALL=1` | Прокинуть `local.settingSources: ['all']` (см. SDK; по умолчанию не нужно) |

## Коды выхода

- `0` — успешно или лимит шагов, или файл STOP  
- `1` — ошибка SDK до/вне успешного run (`CursorAgentError`)  
- `2` — run завершился со статусом `error` (или одиночный run не `finished`)  
- `130` — `cancelled`  
- `64` — ошибка CLI-аргументов  

Ограничения: нужен действующий SDK/локальный рантайм Cursor, сеть для API; стоимость и квоты — по вашему плану Cursor.
