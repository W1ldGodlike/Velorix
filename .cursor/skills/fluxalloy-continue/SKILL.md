---
name: fluxalloy-continue
description: «продолжай» / «+» — продолжить текущую задачу или взять пункт из IMPLEMENTATION_CHECKLIST.md § Ближайший TODO спринта.
---

# Продолжай / +

**Если** в чате «продолжай» или `+` **то:**

1. Продолжить **текущую** задачу из сообщения или контекста.
2. **Если** текущая задача закрыта **то** взять следующий пункт из [`IMPLEMENTATION_CHECKLIST.md`](../../../IMPLEMENTATION_CHECKLIST.md) → `## Ближайший TODO спринта`. **Запрещено:** пункты «владелец» / «на железе» / «приёмка» — только [`## Финал проекта — только владелец`](../../../IMPLEMENTATION_CHECKLIST.md#финал-проекта--только-владелец).
3. `npm run check:quiet` при diff в репо; при diff — одна `J-NNN` (skill [`fluxalloy-journal-entry`](../fluxalloy-journal-entry/SKILL.md)).
4. **Cadence Git** — [`fluxalloy-agent.mdc`](../../rules/fluxalloy-agent.mdc): при новой J и зелёном quiet — `NNN % 5` → `git commit`, `NNN % 10` → также `git push` (любой чат).

Исполняемое: [`fluxalloy-agent.mdc`](../../rules/fluxalloy-agent.mdc). ТЗ без явной просьбы не править.
