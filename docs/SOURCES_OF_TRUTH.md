# Источники истины (без противоречий)

Если меняете договорённость — обновите **все** связанные места **в одном коммите**. Не оставляйте «хвостов» (старое в одном файле, новое в другом).

## Иерархия

| Приоритет | Где | Что хранится |
|-----------|-----|----------------|
| 1 | [`.cursor/rules/`](../.cursor/rules/) | Обязательное поведение агента в Cursor (подмешивается каждый ход). Краткие буллеты **дублируют** шапки артефактов ниже. |
| 2 | Шапка [`IMPLEMENTATION_JOURNAL.md`](../IMPLEMENTATION_JOURNAL.md) | Канон **формата** журнала (`J-NNN`, время, одна сводная за итерацию). |
| 3 | Шапка [`IMPLEMENTATION_CHECKLIST.md`](../IMPLEMENTATION_CHECKLIST.md) | Канон **формата** чеклиста и блока «Ближайший TODO спринта». |
| 4 | [`docs/AGENT_REANCHOR.md`](AGENT_REANCHOR.md) | Режим marathon / «продолжай»: re-anchor, коммиты, push, отчёты. |
| 5 | [`FLUXALLOY_TZ.md`](../FLUXALLOY_TZ.md) | Канон **продукта** (требования). В rules **не** копируется целиком — только чтение нужного §. **Не редактировать** без явной просьбы владельца. |
| 6 | [`docs/AGENT_INSTRUCTIONS_AND_AGREEMENTS.md`](AGENT_INSTRUCTIONS_AND_AGREEMENTS.md) | Справочник (архитектура, коммуникация, операционные заметки). При расхождении с 1–4 — побеждают 1–4. |
| 7 | [`scripts/cursor-automation/prompts/agent-contract.txt`](../scripts/cursor-automation/prompts/agent-contract.txt) | То же поведение для SDK-агента; синхронизировать с 1–4 при смене процесса. |

## Что **не** переносить в rules целиком

- Текст ТЗ, весь чеклист, тело журнала — слишком большие и устаревают. Агент **открывает файл** и читает нужный фрагмент.
- Шапки артефактов остаются **каноном формата**; rules повторяют только **исполняемые** требования (что нельзя нарушать).

## При расхождении

1. Сверить с этой таблицей приоритетов.  
2. Исправить **все** дубликаты.  
3. Прогнать `npm run check:journal` и `npm run check:checklist` при правках журнала/спринта.

## Карта синхронизации (при правке темы)

| Тема | Обновить вместе |
|------|------------------|
| Журнал | шапка `IMPLEMENTATION_JOURNAL.md`, `fluxalloy-journal.mdc`, § журнал в `AGENT_REANCHOR.md`, § в `agent-contract.txt` |
| Спринт-TODO | шапка `IMPLEMENTATION_CHECKLIST.md`, `fluxalloy-checklist.mdc`, `AGENT_REANCHOR.md`, `agent-contract.txt` |
| Marathon (коммит/push/re-anchor) | `AGENT_REANCHOR.md`, `fluxalloy-marathon.mdc`, `continue.txt`, `agent-contract.txt` |
| Стек / IPC / main | `fluxalloy-core.mdc`, `fluxalloy-electron.mdc`, `fluxalloy-react.mdc`, при IPC — `docs/ARCHITECTURE.md` |
