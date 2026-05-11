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

Основные дефолты и комментарии к каждой настройке лежат в **`src/sdk-settings.ts`**.
Рабочий **`.env`** (он игнорируется Git) держите почти пустым: обычно там нужен только секрет. Локальные override (`MAX_STEPS`, `VERBOSE`, `CURSOR_MODEL` и т.д.) добавляйте туда только временно, когда хотите перебить дефолт из `sdk-settings.ts`:

```dotenv
CURSOR_API_KEY=crsr_...
```

Промпты по умолчанию: каталог **`prompts/`** (`initial.txt`, `continue.txt`). Общие правила поведения — **`prompts/agent-contract.txt`**; именно туда добавляйте нюансы, которые агент должен соблюдать всегда. `continue.txt` намеренно компактный: он не заставляет агента заново читать весь контракт/v0-документ на каждой итерации, а просит брать только ближайший спринт и хвост журнала. Свой текст — через `PROMPTS_DIR` или правка файлов.

## Журнал и нумерация

`IMPLEMENTATION_JOURNAL.md` использует обязательные номера `J-NNN`. SDK должен добавлять строки формата:

```text
- [J-278] 2026-05-11 22:30:00 [SDK]: кратко что сделано; проверки.
```

Нумерацию проверяет корневой `npm run check` через `scripts/check-journal-numbering.mjs`.

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

Файл **`STOP`** в этой папке (`scripts/cursor-automation/STOP`) работает как локальный флаг. Он игнорируется Git; если файла нет, `run-loop` создаст его со значением `0` при запуске:

```text
1
```

`1` — остановиться перед следующей итерацией, `0` — продолжать работу. Для совместимости старый пустой `STOP` тоже считается командой остановки.

## Stdin

Если передать промпт через pipe, он заменит `initial.txt` для **первого** шага (`--once` или `loop`); дальше в цикле — только `continue.txt`.

- cmd: `type my.txt | npm run once`
- PowerShell: `Get-Content my.txt -Raw | npm run once`

## Настройки и override

Все дефолты — в `src/sdk-settings.ts`. Переменные ниже только переопределяют их для конкретной машины/запуска:

- `CURSOR_API_KEY` — обязательный секрет; хранить только в `.env` или переменной терминала.
- `MAX_STEPS` — число итераций, если не задан `--max-steps`.
- `CURSOR_MODEL` — модель SDK; по умолчанию `default`, `auto` здесь не используем.
- `VERBOSE` — печать assistant/thinking из стрима: `1`, `true`, `yes`, `on`.
- `PROMPTS_DIR` — альтернативный каталог с `initial.txt` / `continue.txt`.
- `STEP_DELAY_MS` — пауза между итерациями.
- `LOOP_STEP_RETRY_MAX` — повторы при retryable SDK/transport-сбое на цепочке `send` → опционально `stream` → `wait`.
- `LOOP_STEP_RETRY_BASE_MS` — базовая пауза для transport retry, дальше экспоненциально до лимита из `src/sdk-settings.ts`.
- `LOOP_RETRY_RUN_ERROR` — `1` включает повтор **любого** `status=error` той же итерацией; по умолчанию выключено, остаётся только эвристика короткого run.
- `LOOP_RUN_ERROR_RETRY_MAX` — макс. попыток на итерацию при `status=error`.
- `LOOP_RUN_ERROR_RETRY_BASE_MS` — пауза между такими попытками.
- `SETTING_SOURCES_ALL` — `1` прокидывает `local.settingSources: ['all']`; обычно не нужно.

## Коды выхода

- `0` — успешно или лимит шагов, или файл STOP  
- `1` — ошибка SDK до/вне успешного run (`CursorAgentError`)  
- `2` — run завершился со статусом `error` (или одиночный run не `finished`)  
- `130` — `cancelled`  
- `64` — ошибка CLI-аргументов  

Ограничения: нужен действующий SDK/локальный рантайм Cursor, сеть для API; стоимость и квоты — по вашему плану Cursor.
