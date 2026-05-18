# Источники истины (без противоречий)

Если меняете договорённость — обновите **все** связанные места **в одном коммите**. Не оставляйте «хвостов» (старое в одном файле, новое в другом).

## Иерархия

| Приоритет | Где | Что хранится |
|-----------|-----|----------------|
| 1 | [`.cursor/rules/`](../.cursor/rules/) | Обязательное поведение агента в Cursor (подмешивается каждый ход). **Глоссарий терминов:** `fluxalloy-rules-explicit.mdc`. Краткие буллеты **дублируют** шапки артефактов ниже. |
| 2 | Шапка [`IMPLEMENTATION_JOURNAL.md`](../IMPLEMENTATION_JOURNAL.md) | Канон **формата** журнала (`J-NNN`, время, одна сводная за итерацию). |
| 3 | Шапка [`IMPLEMENTATION_CHECKLIST.md`](../IMPLEMENTATION_CHECKLIST.md) | Канон **формата** чеклиста и блока «Ближайший TODO спринта». |
| 4 | [`docs/AGENT_MARATHON.md`](AGENT_MARATHON.md) | Marathon / «продолжай»: итерация, cadence, re-anchor, отчёты. |
| 4a | [`fluxalloy-project-audit.mdc`](../.cursor/rules/fluxalloy-project-audit.mdc) | Постоянный audit scope, `check:quiet` audit-скрипты, `audit-manifest.json`. Программа 2026-05 закрыта (J-887). |
| 4b | [`fluxalloy-ui-surfaces.mdc`](../.cursor/rules/fluxalloy-ui-surfaces.mdc) + `check:ui-surfaces-guard` | Один renderer на фичу, один словарь (`ui-text` / `locales/**`), Help TOC + deep-link; без HTML-pop-out (J-984). |
| 5 | [`FLUXALLOY_TZ.md`](../FLUXALLOY_TZ.md) | Канон **продукта** (требования). В rules **не** копируется целиком — только чтение нужного §. **Не редактировать** без явной просьбы владельца. |
| 6 | [`docs/AGENT_OPERATIONAL_NOTES.md`](AGENT_OPERATIONAL_NOTES.md) | **Operational notes** (CSP, медиа, yt-dlp). Исполняемое — `fluxalloy-agent-runtime.mdc`. При расхождении с 1–4 — побеждают 1–4. |
| 7 | [`scripts/cursor-automation/prompts/agent-contract.txt`](../scripts/cursor-automation/prompts/agent-contract.txt) | То же поведение для SDK-агента; синхронизировать с 1–4 при смене процесса. |

## Что **не** переносить в rules целиком

- Текст ТЗ, весь чеклист, тело журнала — слишком большие и устаревают. Агент **открывает файл** и читает нужный фрагмент.
- Шапки артефактов остаются **каноном формата**; rules повторяют только **исполняемые** требования (что нельзя нарушать).

## При расхождении

1. Сверить с таблицей приоритетов и глоссарием **«Приоритет rules vs шапка»** в `fluxalloy-rules-explicit.mdc` (формат → шапка `IMPLEMENTATION_*`; процесс marathon/audit → `.mdc`).  
2. Исправить **все** дубликаты **одним коммитом**.  
3. Прогнать `npm run check:journal` и `npm run check:checklist` при правках журнала/спринта.

## Карта синхронизации (при правке темы)

| Тема | Обновить вместе |
|------|------------------|
| Журнал | шапка `IMPLEMENTATION_JOURNAL.md`, `fluxalloy-journal.mdc`, `docs/AGENT_MARATHON.md`, `agent-contract.txt` |
| Спринт-TODO | шапка `IMPLEMENTATION_CHECKLIST.md`, `fluxalloy-checklist.mdc`, `docs/AGENT_MARATHON.md`, `agent-contract.txt` |
| Marathon (коммит/push/re-anchor) | `docs/AGENT_MARATHON.md`, `fluxalloy-marathon.mdc`, `continue.txt`, `agent-contract.txt` |
| Итерация / пакет / anti-micro | `fluxalloy-iteration-batch.mdc`, шапка журнала, `fluxalloy-journal.mdc`, § журнал в `agent-contract.txt` |
| Audit репозитория | `fluxalloy-project-audit.mdc`, `scripts/audit-scope.config.mjs`, `docs/audit-manifest.json`, `npm run audit:inventory` / `audit:inventory-sync` / `audit:copy-paste` / `audit:structural` |
| UI-поверхности / copy / Help | `fluxalloy-ui-surfaces.mdc`, `scripts/check-ui-surfaces-guard.mjs`, `knowledge-toc-registry.ts`, `check:ui-copy-quality`, итог в чеклист §6/§15 |
| Стек / IPC / main | `fluxalloy-core.mdc`, `fluxalloy-electron.mdc`, `fluxalloy-react.mdc`, при IPC — `docs/ARCHITECTURE.md` |
| Язык правил (однозначность) | `fluxalloy-rules-explicit.mdc`, `npm run check:rules-explicit`; при правке любого `.mdc` — сверка глоссария |
| Cadence marathon / continue_count | `fluxalloy-marathon.mdc`, `docs/AGENT_MARATHON.md`, `agent-contract.txt`, `continue.txt`, глоссарий (bump → `%5`/`%10`) |
| Handoff между чатами (опционально) | `docs/AGENT_SESSION_HANDOFF.md` |
| Приоритет rules vs шапка | `fluxalloy-rules-explicit.mdc` → синхрон шапок `IMPLEMENTATION_*` при смене формата |
| Среда агента / дифф / проверки / ответ в чате | `fluxalloy-agent-runtime.mdc`, `agent-contract.txt` (§ среда и проверки) |
| Operational notes (отладка) | `docs/AGENT_OPERATIONAL_NOTES.md` |
