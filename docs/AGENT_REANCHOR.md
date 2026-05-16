# Re-anchor: режим marathon / «продолжай»

**Когда применять:** очередь «продолжай», `npm run agent:loop`, явный запрос владельца на автономный спринт.

**Счётчик:** ведите `docs/.agent-session.json` (в Git не коммитить) или строку в [`SESSION_HANDOFF.md`](SESSION_HANDOFF.md):

```json
{ "continue_count": 1, "last_reanchor_at": 0, "last_commit_iteration": 0, "last_push_iteration": 0 }
```

После каждой итерации увеличивайте `continue_count` на 1.

---

## Каждую итерацию

1. План — только [`IMPLEMENTATION_CHECKLIST.md`](../IMPLEMENTATION_CHECKLIST.md) → **`## Ближайший TODO спринта`** (3–7 пунктов). ТЗ — **один** нужный § [`FLUXALLOY_TZ.md`](../FLUXALLOY_TZ.md), не весь файл.
2. Объём — **один крупный вертикальный срез** (main → preload → renderer → тесты), не мелочь за итерацию.
3. **Журнал** — ровно **одна** сводная строка `J-NNN` в конце итерации: `npm run journal:stamp` → запись с `[Assistant]` (IDE) или `[SDK]` (automation). Без git для времени. Не дублировать журнал в чате.
4. **Отчёт в чате** — 3–5 буллетов, без простыни и без пересказа журнала.
5. Перед коммитом — `npm run check:quiet` (полный `npm run check` — при падении quiet или перед релизом).

## Каждые 5 итераций (`continue_count % 5 === 0`)

- **Локальный коммит** одним логичным сообщением (полное предложение: что и зачем), только если `check:quiet` зелёный.
- `git status` — в коммит только релевантные файлы; без секретов и артефактов сборки.
- Обновить `last_commit_iteration` в `.agent-session.json`.

## Каждые 10 итераций (`continue_count % 10 === 0`)

- **`git push`** на настроенный `origin` (если ветка отслеживает remote и нет блокера). Не force-push в `main`/`master`.
- Обновить `last_push_iteration`.

## Каждые 10 итераций — re-anchor (`continue_count % 10 === 0`)

Перечитать **целиком** (короткие файлы):

1. Этот файл (`AGENT_REANCHOR.md`).
2. [`docs/SOURCES_OF_TRUTH.md`](SOURCES_OF_TRUTH.md).
3. Блок **`## Ближайший TODO спринта`** в чеклисте.
4. Последние **3** строки журнала (номер `J-*`, не дублировать работу).

В отчёте итерации написать: **`re-anchor OK`** (и одной строкой — текущий фокус спринта).

Обновить `last_reanchor_at := continue_count`.

## Запрещено в marathon

- Десятки микро-`J-*` за одну итерацию.
- Правки [`FLUXALLOY_TZ.md`](../FLUXALLOY_TZ.md) без явной просьбы.
- Случайные новые `.md` «для красоты».
- Drive-by рефакторинг вне текущего среза.
- `prettier .` по всему репо (риск для ТЗ).
- Выдуманное время, «сетка» минут, привязка новых меток журнала к git.

## Новый чат (рекомендация каждые ~20–25 итераций)

Заполните [`SESSION_HANDOFF.md`](SESSION_HANDOFF.md) и начните чат: «Продолжай по SESSION_HANDOFF + sprint TODO».

## Шаблон сообщения «продолжай»

См. [`CONTINUE_PROMPT.ru.md`](CONTINUE_PROMPT.ru.md).
