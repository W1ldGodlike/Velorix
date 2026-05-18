---
name: fluxalloy-journal-entry
description: Writes IMPLEMENTATION_JOURNAL entries for FluxAlloy. Use when finishing a coding iteration with repository diff, journal stamp, J-NNN format, Assistant vs SDK tags, check journal.
---

# Запись в журнал (FluxAlloy)

## Когда писать J

**Писать** одну строку `- [J-NNN]` **только если** в итерации есть diff в tracked-файлах репо.

**Не писать** J при обсуждении, плане или ответах без diff.

## Формат

```
- [J-NNN] YYYY-MM-DD HH:mm:ss [Assistant]: …
```

- Время: `npm run journal:stamp` в момент записи.
- `[Assistant]` — чат Cursor; `[SDK]` — только `scripts/cursor-automation`.
- Одна J на итерацию с diff; вся суть итерации в одной строке.
- **Запрещено:** микро-J (единственная суть — один тег/поле/IPC/smoke).

## Перед записью

1. Последняя строка в `IMPLEMENTATION_JOURNAL.md` → следующий номер.
2. После дописывания: `npm run check:journal`.

## Чат

Не вставлять тело журнала в ответ — ссылка на `IMPLEMENTATION_JOURNAL.md`, J-NNN.

Канон формата: шапка «Правило записей» в `IMPLEMENTATION_JOURNAL.md`.
