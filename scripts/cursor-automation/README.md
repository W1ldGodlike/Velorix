# Автоматизация Cursor Agent (локальный SDK)

Не читает Composer-чат IDE. Запускает [**Cursor Agent TypeScript SDK**](https://cursor.com/docs/api/sdk/typescript) против **корня репозитория FluxAlloy** (`cwd` = два уровня выше этой папки).

## Подготовка

```bash
cd scripts/cursor-automation
npm install
```

Корень репозитория содержит [`.npmrc`](../../.npmrc) (`legacy-peer-deps=true` для основного приложения); при `npm install` из этой папки npm обычно подхватывает его при обходе родительских каталогов. Канон baseline — `package.json` (lock — `tests/shared/toolchain-baseline-package.test.ts`). **Wave 5 Dependabot** — [x] на **`main`** (журнал **J-1558**). **Следующий cadence** **J-1570** (commit) — [`fluxalloy-agent.mdc`](../../.cursor/rules/fluxalloy-agent.mdc).

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
npm run loop -- --max-steps 200 --session-steps 1
```

Из корня репозитория можно использовать алиасы:

```bash
npm run agent:once
npm run agent:loop
npm run agent:loop:cheap
npm run agent:loop -- --max-steps 8 --verbose
npm run agent:loop -- --max-steps 200 --session-steps 1
```

Основные дефолты и комментарии к каждой настройке лежат в **`src/sdk-settings.ts`**.
Рабочий **`.env`** (он игнорируется Git) держите почти пустым: обычно там нужен только секрет. Локальные override (`MAX_STEPS`, `VERBOSE`, `CURSOR_MODEL` и т.д.) добавляйте туда только временно, когда хотите перебить дефолт из `sdk-settings.ts`:

```dotenv
CURSOR_API_KEY=crsr_...
```

- §19 publish signing (win/linux/mac): `release-code-signing-roadmap.ts` + `docs/RELEASE.md` §4/§4.1/§4.2 — см. `prompts/agent-contract.txt`; Help check:help-packaged-smoke-docs + check:help-owner-smoke-docs + strict signing (check:help-workflow-smoke-crosslinks).
- §19 signing indexed: `continue.txt` / `initial.txt` / `agent-contract.txt` — `formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedBlock` / `formatReleaseCodeSigningRoadmapSdkContractSigningIndexedClause`; diagnostics — `formatReleaseCodeSigningRoadmapSdkPromptSprintSigningIndexedDiagnosticLine` (`check:release` / `check:platform-packaging-scripts`). Packaging indexed: `electron-builder.yml` (**9** §19 yaml comments; J-1520..1539).
- §19 packaging (electron-builder.yml): win nsis+zip (no portable); 9 §19 yaml comments — getReleaseCodeSigningElectronBuilderYmlComments in release-code-signing-roadmap.ts.
- Sprint §19 (`IMPLEMENTATION_CHECKLIST`): `formatReleaseCodeSigningRoadmapChecklistSprintSection19Line` (J-1511..1545).
- Sprint §21 Playwright (`IMPLEMENTATION_CHECKLIST`): `formatPackagedGuiE2ePlaywrightChecklistSprintSection21Line` (8 steps).
- Sprint Wave 5 (`IMPLEMENTATION_CHECKLIST`): `formatToolchainBaselineWipHandoffChecklistSprintWave5Line` (**J-1570**).

Промпты по умолчанию: каталог **`prompts/`** (`initial.txt`, `continue.txt`). Общие правила поведения — **`prompts/agent-contract.txt`**; именно туда добавляйте нюансы, которые агент должен соблюдать всегда. `continue.txt` намеренно похож на команду `+` в живом чате: агент читает чеклист/журнал только точечно, когда нужно выбрать следующий блок или записать новый `J-NNN`. Для длинных запусков runner сам пересоздаёт `Agent` короткими сессиями и даёт компактный handoff, чтобы не тащить огромный accumulated conversation/cache context. Свой текст — через `PROMPTS_DIR` или правка файлов.

## Журнал и нумерация

`IMPLEMENTATION_JOURNAL.md` использует обязательные номера `J-NNN`. SDK должен добавлять строки формата:

```text
- [J-278] 2026-05-11 22:30:00 [SDK]: кратко что сделано; проверки.
```

Нумерацию проверяет корневой `npm run check` через `scripts/check-journal-numbering.mjs`.

## Число продолжений

По умолчанию цикл делает **5 итераций**: первый промпт из `initial.txt`, затем до 4 продолжений из `continue.txt`.
При этом long-loop режется на короткие SDK-сессии: по умолчанию **1 итерация на один `Agent.create(...)`**, затем `dispose` и новая сессия с компактным handoff. Это нужно, чтобы `MAX_STEPS=200/300` не превращал каждый следующий run в многомиллионный `Cache Read`.

Способы задать число:

```powershell
# Разово из корня репозитория:
npm run agent:loop:cheap
npm run agent:loop -- --max-steps 8
npm run agent:loop -- --max-steps 300 --session-steps 1

# Разово из scripts/cursor-automation:
npm run loop -- --max-steps 8

# Постоянно в scripts/cursor-automation\.env:
MAX_STEPS=8
SDK_SESSION_STEPS=1
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
- `SDK_SESSION_STEPS` — сколько итераций держать в одном `Agent.create(...)`; по умолчанию `1`, для минимального cache-read держите `1`, для более «памятного» агента можно временно поднять до `2–3`.
- `CURSOR_MODEL` — модель SDK; по умолчанию `default`, `auto` здесь не используем.
- `VERBOSE` — печать assistant/thinking из стрима: `1`, `true`, `yes`, `on`; на long-loop больше 20 шагов runner сам выключит verbose, чтобы не раздувать terminal logs.
- `SDK_ALLOW_VERBOSE_LONG_LOOP` — `1` разрешает verbose на long-loop, если он действительно нужен для диагностики.
- `VERBOSE_MAX_CHARS` — лимит stream-лога при `VERBOSE=1`; по умолчанию `8000`.
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

## Экономные проверки

Для SDK-итераций используйте корневой `npm run check:quiet`: он запускает тот же набор проверок, что и `npm run check`, но на успехе печатает только короткие summary-строки. Полный stdout/stderr показывается только при падении конкретного шага. Это снижает token/cache cost, потому что длинный successful test output не попадает в контекст агента.
