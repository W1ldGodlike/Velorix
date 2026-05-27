---
name: Velorix-checklist-audit
description: Audit and update docs/IMPLEMENTATION_NEON_CHECKLIST.md for Velorix. Use when revising sprint TODO, snap.*, or reconciling with NEON tracker and journal.
---

# Аудит NEON-чеклиста

## Когда

Правки `docs/IMPLEMENTATION_NEON_CHECKLIST.md`: sprint TODO, snap.*, сводка VA/Phase D.

## Порядок

1. [`docs/VELORIX_NEON_THEME.md`](../../../docs/VELORIX_NEON_THEME.md) — Phase D, VA, refs 1–27 (источник срезов).
2. `docs/IMPLEMENTATION_NEON_CHECKLIST.md` — только sprint TODO (3–7, ≤220 символов) и snap.*.
3. **Запрещено:** раздувать матрицей § ТЗ — она в [`docs/archive/IMPLEMENTATION_CHECKLIST.OLD.md`](../../../docs/archive/IMPLEMENTATION_CHECKLIST.OLD.md).
4. `npm run check:checklist`, `npm run check:quiet`.

## Синхронизация

[`docs/SOURCES_OF_TRUTH.md`](../../../docs/SOURCES_OF_TRUTH.md) — строка «Sprint TODO (NEON)».
