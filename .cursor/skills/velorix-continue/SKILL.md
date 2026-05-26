---
name: Velorix-continue
description: «продолжай» и `+` — равнозначные команды; продолжить текущую задачу или взять пункт из IMPLEMENTATION_CHECKLIST.md § Ближайший TODO спринта.
---

# Продолжай / +

**Если** в чате «продолжай» или `+` (**равнозначные команды**) **то:**

1. Продолжить **текущую** задачу из сообщения или контекста.
2. **Если** текущая задача закрыта **то** взять следующий пункт из [`IMPLEMENTATION_CHECKLIST.md`](../../../IMPLEMENTATION_CHECKLIST.md) → `## Ближайший TODO спринта`. **Запрещено:** пункты «владелец» / «на железе» / «приёмка» — только [`IMPLEMENTATION_MANUAL_VERIFICATION.md`](../../../IMPLEMENTATION_MANUAL_VERIFICATION.md).
3. `npm run check:quiet` при diff в репо; при diff — одна `J-NNN` (skill [`velorix-journal-entry`](../velorix-journal-entry/SKILL.md)).
4. **Git по J-NNN** — [`velorix-agent.mdc`](../../rules/velorix-agent.mdc): при новой J и зелёном quiet — `NNN % 5` → `git commit`, `NNN % 10` → также `git push` (любой чат).

Исполняемое: [`velorix-agent.mdc`](../../rules/velorix-agent.mdc). ТЗ без явной просьбы не править.
