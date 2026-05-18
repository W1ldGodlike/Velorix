# Программа: консолидация governance, документации и legacy

```text
governance_plan: open
```

**Статус:** активна. Пока этот файл в репозитории с `governance_plan: open` — **запрещена любая работа вне этой программы** (см. `.cursor/rules/fluxalloy-governance-plan-gate.mdc`, `npm run check:governance-plan-gate`).

**Закрытие:** после фазы **F** — удалить **этот файл** (не оставлять `closed`), удалить все временные артефакты gate, один **commit + push**, `npm run agent:session -- reset`.

---

## Цели

1. Убрать дублирование правил между `.cursor/rules/`, `docs/`, шапками `IMPLEMENTATION_*`, `AGENTS.md`, `agent-contract.txt`.
2. Вынести тяжёлые workflow в **project skills** (`.cursor/skills/`), rules — короткие (**≤50 строк** на файл, по рекомендации Cursor).
3. **Полностью** актуализировать: `IMPLEMENTATION_CHECKLIST.md`, `README.md`, `docs/ARCHITECTURE.md`.
4. Удалить legacy-хвосты (устаревшие ссылки, удалённые пути, дубли процесса).
5. Зафиксировать cadence Git: **каждые 5 J — commit**, **каждые 10 J — commit + push** (по номеру `J-NNN`, не по `continue_count`).
6. Журнал: **одна J только при diff в репо**; обсуждение/план без правок — без записи в журнал.

---

## Иерархия после программы (целевая)

| Слой | Путь | Содержимое |
|------|------|------------|
| Вход | `AGENTS.md` | ≤15 строк, ссылки |
| Индекс | `docs/SOURCES_OF_TRUTH.md` | иерархия + таблица sync, **без** дубля буллетов rules |
| Глоссарий | `.cursor/rules/fluxalloy-rules-explicit.mdc` | термины, формат требований |
| Исполняемое | `.cursor/rules/fluxalloy-core.mdc` + `fluxalloy-agent.mdc` (или эквивалент ≤3 alwaysApply) | guardrails |
| По globs | `fluxalloy-{journal,checklist,electron,react}.mdc` | указатели + `check:*` |
| Skills | `.cursor/skills/fluxalloy-*/SKILL.md` | marathon, journal-entry, checklist-audit, release |
| Продукт | `FLUXALLOY_TZ.md`, тело чеклиста/журнала | не копировать в rules |
| Отладка | `docs/AGENT_OPERATIONAL_NOTES.md` | CSP, yt-dlp, медиа |
| SDK | `scripts/cursor-automation/prompts/agent-contract.txt` | ≤25 строк + ссылки |

---

## Прогресс фаз

| Фаза | Суть | Критерий готовности |
|------|------|---------------------|
| **A** | Gate + этот план + sprint GOV | `check:governance-plan-gate` OK, sprint только GOV |
| **B** | Rules/skills + `docs/` процесс | [x] J-1132: `fluxalloy-agent.mdc`; skills 4×; удалены 5 legacy rules; J-cadence в глоссарии |
| **C** | **Полный** `IMPLEMENTATION_CHECKLIST.md` | [x] J-1133: снимок ~52%, 242/1725 tests, §0/этапы/§4.A/§21; убраны устаревшие hooks/HTML-pop-out; sprint GOV C→D |
| **D** | **Полные** `README.md` + `docs/ARCHITECTURE.md` | [x] J-1134: быстрый старт, test/coverage; ARCHITECTURE — таблица входов, Zustand, `#downloads`, `audit:ipc-architecture` |
| **E** | Legacy + `check:docs-governance` | Нет ссылок на удалённые артефакты вне журнала; guard в `check:quiet`; `audit:orphan-scripts` чисто |
| **F** | Закрытие программы | Удалён план + gate rule + check-скрипт + тест; cadence J%%5/10 в rules/marathon/contract; **commit + push**; `agent:session -- reset` |

Отмечать в таблице: `[x]` в колонке «Суть» вручную в этом файле по завершении фазы (в той же итерации — одна J в журнале).

---

## Фаза A — gate

- [x] `docs/GOVERNANCE_CONSOLIDATION_PLAN.md` (этот файл)
- [x] `.cursor/rules/fluxalloy-governance-plan-gate.mdc`
- [x] `scripts/check-governance-plan-gate.mjs` + тест + `check:quiet`
- [x] `IMPLEMENTATION_CHECKLIST.md` → sprint только пункты **GOV:**
- [x] `docs/SOURCES_OF_TRUTH.md` — строка программы
- [x] `AGENTS.md` — предупреждение о gate
- [x] `npm run agent:session -- reset` (команда для фазы F)

---

## Фаза B — `.cursor/` и процессные `docs/` (выполнено J-1132)

- [x] `fluxalloy-agent.mdc` + ужатый `fluxalloy-core.mdc`
- [x] Удалены legacy rules: marathon, iteration-batch, project-audit, ui-surfaces, agent-runtime
- [x] Skills: marathon, journal-entry, checklist-audit, release
- [x] `SOURCES_OF_TRUTH`, `AGENT_MARATHON`, `agent-contract.txt`, `continue.txt`, глоссарий J-cadence

### Rules (сжать) — сделано

- Объединены в **`fluxalloy-agent.mdc`**; `fluxalloy-core.mdc` — вход + skills.
- Glob-rules: `journal` / `checklist` / `electron` / `react` — без изменений (указатели).

### Project skills (создать `.cursor/skills/`)

| Skill | Триггер |
|-------|---------|
| `fluxalloy-marathon` | продолжай, agent:loop, SDK |
| `fluxalloy-journal-entry` | правка журнала, конец coding-итерации с diff |
| `fluxalloy-checklist-audit` | полный ревиз чеклиста |
| `fluxalloy-release` | release, check:release |

Каждый: `SKILL.md` + при необходимости `reference.md` (progressive disclosure).

### Docs

- `docs/SOURCES_OF_TRUTH.md` — индекс + sync-таблица (добавить skills).
- `docs/AGENT_MARATHON.md` — краткий narrative + «детали в skill marathon».
- `scripts/cursor-automation/prompts/agent-contract.txt` — ≤25 строк, SDK-only.
- `scripts/cursor-automation/prompts/continue.txt` — не дублировать contract.

### Глоссарий (обязательно в фазе B или F)

- **Итерация с J:** есть изменения в tracked-файлах репо → ровно одна строка `J-NNN`.
- **Итерация без J:** обсуждение, план, ответы без diff.
- **Cadence Git:** `NNN % 5 === 0` → commit; `NNN % 10 === 0` → push + re-anchor (после `check:quiet`); **любой** чат (Cursor, marathon, SDK). Заменить `continue_count % 5` / привязку cadence к marathon.

Проверка: `npm run check:rules-explicit`, `npm run check:quiet`.

---

## Фаза C — полный `IMPLEMENTATION_CHECKLIST.md`

**Не точечные правки.** Методика:

1. Пройти **каждый** § чеклиста (§0–§17) против соответствующего § `FLUXALLOY_TZ.md`.
2. Сверить с кодом (`src/`, guards, Vitest).
3. Сверить с журналом **`J-500` … последняя** (хвост ~700 строк — основной источник расхождений).
4. Обновить «Готовность», «Текущий снимок» (актуальные `npm run test`, `audit:inventory`).
5. Убрать из §0 мета-пункты «обновляй чеклист» → в skill checklist-audit.
6. Исправить устаревшее: hooks composition, batch/HW «впереди», 187/1560 tests, Zustand gate/archive, sprint-архив с `[x]`.
7. **`## Ближайший TODO спринта`:** только 3–7 **незакрытых** продуктовых ориентиров (после GOV — снова продукт, не GOV).

Проверка: `npm run check:checklist`, `npm run check:quiet`.

Если diff >400 строк — **≥2 commit** в рамках фазы C (допустимо до закрытия gate; финальный push всё равно в F).

---

## Фаза D — `README.md` и `docs/ARCHITECTURE.md`

### README.md

- Node/npm версии из `package.json` / `.nvmrc`.
- Команды: `check`, `check:quiet`, `test`, `test:coverage`, dev, release — без устаревших ссылок.
- Архитектура → `docs/ARCHITECTURE.md`; агент → `AGENTS.md` + `SOURCES_OF_TRUTH` (без дубля marathon-текста).
- Zustand/renderer в одном абзаце; pop-out загрузок = renderer hash route.
- Структура для нового разработчика: clone → install → check:quiet → dev.

### ARCHITECTURE.md

- Переписать **битую** таблицу «Точки входа» (сейчас сломана вёрстка markdown).
- Удалить ссылки на удалённые модули: `downloads-window-html*`, `downloads-window-ui-strings-*`, `preload/downloads-window.ts` (legacy HTML pop-out).
- Актуализировать: Zustand `stores/*`, `AppRoot`, `AppStoreBootstrap`, `useAppShellLayoutController`, IPC preload blocks `fluxalloy-api-block-*.d.ts`.
- Pop-out downloads: `downloads-window.ts` + renderer `#downloads`, не HTML string.
- Секция «Состояние renderer» — канон `renderer-state-approach.ts`.
- IPC-таблица: пересчитать или указать «см. `audit:ipc-architecture`» вместо устаревших счётчиков.
- Длина: читаемые разделы; детальные списки файлов — сжать до паттернов + ссылок на каталоги (современный стандарт docs).

Проверка: нет битых relative links; `npm run check:quiet`.

---

## Фаза E — legacy и guard документации

### Удалить / исправить (примеры)

- Упоминания `scripts/archive/`, `check:zustand-migration-gate`, `fluxalloy-program-gate`, `UI_CONSOLIDATION_*` в **навигации** (журнал — история, OK).
- Дубли `continue_count % 5` после перехода на J-cadence (фаза F).
- Лишние `.md` вне allowlist (глоссарий «лишний .md»).
- Прогон `npm run audit:orphan-scripts`.

### `check:docs-governance` (новый)

- Битые `](...)` ссылки в: `docs/*.md`, `AGENTS.md`, `README.md`, `.cursor/rules/*.mdc`, `.cursor/skills/**/SKILL.md`.
- Запрет ссылок на удалённые пути (список в скрипте) вне `IMPLEMENTATION_JOURNAL.md`.
- Опционально: лимит строк `alwaysApply` rules.

Включить в `scripts/run-quiet-check.mjs`.

---

## Фаза F — закрытие (единственный обязательный commit+push программы)

**Порядок:**

1. Все фазы A–E отмечены выполненными; `npm run check:quiet` зелёный.
2. Удалить:
   - `docs/GOVERNANCE_CONSOLIDATION_PLAN.md`
   - `.cursor/rules/fluxalloy-governance-plan-gate.mdc`
   - `scripts/check-governance-plan-gate.mjs`
   - `tests/scripts/check-governance-plan-gate.test.ts`
3. Убрать `check:governance-plan-gate` из `package.json` и `run-quiet-check.mjs`.
4. Убрать упоминания GOVERNANCE / gate из sprint, `AGENTS.md`, `SOURCES_OF_TRUTH` (хвосты).
5. Обновить marathon: **J %% 5 / %% 10**; `npm run agent:session -- reset`.
6. Одна J в журнале на всю программу закрытия (или сводная по последней coding-итерации F).
7. **`git commit`** + **`git push`** (вся программа может быть одним коммитом или несколькими по фазам C/E — на усмотрение; push **только** здесь, если не было J%%10 раньше).

После F: `check:governance-plan-gate` отсутствует; guard `gate=no-plan`.

---

## Cadence Git (после программы)

| Условие | Действие |
|---------|----------|
| Новая `J-NNN` в журнале и `NNN % 5 === 0` | `git commit` (если есть staged diff, `check:quiet` зелёный) |
| `NNN % 10 === 0` | commit (если ещё нет) + `git push` (без force main/master) |
| Обсуждение без diff | журнал не пишем; commit не нужен |

`continue_count` в `agent:session` — опциональная метрика loop; **не** триггер commit.

---

## Запрещено до закрытия программы

- Продуктовые фичи, рефактор вне путей фаз B–E.
- Правки `FLUXALLOY_TZ.md` без явной просьбы владельца.
- Новые alwaysApply rules кроме gate.
- Оставлять `governance_plan: closed` вместо удаления файла плана.
- `scripts/archive/` и восстановление one-shot скриптов.

---

## Связанные команды

```bash
npm run check:governance-plan-gate
npm run check:quiet
npm run journal:stamp
npm run agent:session -- status
npm run agent:session -- reset    # только фаза F
npm run audit:inventory
npm run test
```

---

_Временная программа. После фазы F этот файл **не должен** существовать в репозитории._
