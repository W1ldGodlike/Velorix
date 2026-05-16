# Re-anchor: режим marathon / «продолжай»

**Когда применять:** очередь «продолжай», `npm run agent:loop`, автономный спринт.

**Владельцу ничего создавать не нужно:** достаточно писать **«продолжай»** (или `+`). Контракт уже в `.cursor/rules/fluxalloy-marathon.mdc` (`alwaysApply`). Шаблоны и handoff — только справка, не обязательны.

**Счётчик итераций:** в конце каждой итерации агент выполняет `npm run agent:session -- bump` — скрипт сам создаёт `docs/.agent-session.json` при первом вызове (файл в `.gitignore`). Вручную JSON не заводить.

Перед коммитом/push/re-anchor: `npm run agent:session` — узнать текущий `continue_count`.

---

## Каждую итерацию

1. План — [`IMPLEMENTATION_CHECKLIST.md`](../IMPLEMENTATION_CHECKLIST.md) → **`## Ближайший TODO спринта`**. ТЗ — один § [`FLUXALLOY_TZ.md`](../FLUXALLOY_TZ.md).
2. **Один крупный вертикальный срез** (main → preload → renderer → тесты).
3. **Журнал** — одна сводная `J-NNN`: `npm run journal:stamp` → запись `[Assistant]` / `[SDK]`.
4. **Отчёт** — 3–5 буллетов, без пересказа журнала.
5. `npm run check:quiet` перед коммитом.
6. `npm run agent:session -- bump`.

## Каждые 5 итераций (`continue_count % 5 === 0`)

- Локальный **коммит**, если `check:quiet` зелёный.

## Каждые 10 итераций (`continue_count % 10 === 0`)

- **`git push`** (без force в main/master).
- **Re-anchor:** перечитать этот файл, [`SOURCES_OF_TRUTH.md`](SOURCES_OF_TRUTH.md), sprint TODO, 3 последние строки журнала → в отчёте **`re-anchor OK`**.

## Запрещено в marathon

- Микро-`J-*`, правки ТЗ без просьбы, лишние `.md`, drive-by рефактор, `prettier .` по репо, выдуманное время в журнале.

## Новый чат (по желанию, не обязательно)

Можно сказать «продолжай по sprint TODO» — правил достаточно. [`SESSION_HANDOFF.md`](SESSION_HANDOFF.md) агент заполняет **сам**, только если вы явно просите handoff между чатами.

## Справка (не копировать)

Текст для очереди, если хочется усилить один раз: [`CONTINUE_PROMPT.ru.md`](CONTINUE_PROMPT.ru.md) — **опционально**, дублирует rules.
