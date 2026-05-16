# Marathon: «продолжай» / SDK loop

**Когда применять:** очередь «продолжай», `npm run agent:loop`, автономный спринт.

**Владельцу ничего создавать не нужно:** достаточно **«продолжай»** или `+`. Исполняемое — `.cursor/rules/fluxalloy-marathon.mdc` (`alwaysApply`) + глоссарий `fluxalloy-rules-explicit.mdc`.

**Счётчик:** в конце итерации `npm run agent:session -- bump` (создаёт `docs/.agent-session.json`, `.gitignore`). Вручную JSON **не** заводить.

**Cadence** (`% 5` коммит, `% 10` push + re-anchor) — **только после** `bump`, по полю `continue_count`.

---

## Каждую итерацию

1. План — [`IMPLEMENTATION_CHECKLIST.md`](../IMPLEMENTATION_CHECKLIST.md) → **`## Ближайший TODO спринта`**. ТЗ — один § [`FLUXALLOY_TZ.md`](../FLUXALLOY_TZ.md).
2. **Крупный срез** (глоссарий). **Если** новый/изменённый IPC — **вертикальный срез**. **Запрещено:** **микро-J**, **микро-срез** (`fluxalloy-iteration-batch.mdc`).
3. **Журнал** — **одна J за итерацию** (`npm run journal:stamp` → `[Assistant]` / `[SDK]`).
4. **Отчёт** — 3–5 буллетов; **запрещено** копировать тело журнала.
5. **check:quiet зелёный** (`npm run check:quiet` → exit code 0).
6. `npm run agent:session -- bump` — **последний** шаг.

## Cadence (сразу после bump)

- **Коммит:** **если** `continue_count % 5 === 0` **и** quiet зелёный (**коммит marathon cadence**).
- **Если** `continue_count % 10 === 0` **то:** `git push` (без force main/master) + **re-anchor** (этот файл, [`SOURCES_OF_TRUTH.md`](SOURCES_OF_TRUTH.md), sprint TODO, 3 строки журнала) → в отчёте **`re-anchor OK`**.

## Запрещено в marathon

Глоссарий `fluxalloy-rules-explicit.mdc`: **микро-J**, **микро-срез**, **копипаста-парсер**, ТЗ без **явной просьбы владельца**, **лишний .md**, **drive-by рефактор**, `prettier .` по репо, выдуманное время в журнале.

## Новый чат

**Обязательно:** «продолжай» / `+` — правил достаточно.

**Если** владелец просит handoff между чатами **то** заполнить [`AGENT_SESSION_HANDOFF.md`](AGENT_SESSION_HANDOFF.md).

**SDK:** короткий prompt — `scripts/cursor-automation/prompts/continue.txt` (не дублировать отдельный `.md`).

---

_Бывш. `AGENT_REANCHOR.md`. Удалён дубль `CONTINUE_PROMPT.ru.md` (канон: rules + `continue.txt`)._
