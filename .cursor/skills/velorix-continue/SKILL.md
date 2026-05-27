---
name: Velorix-continue
description: «продолжай» и `+` — равнозначные команды; продолжить текущую задачу или следующий срез по docs/VELORIX_NEON_THEME.md и docs/IMPLEMENTATION_NEON_CHECKLIST.md.
---

# Продолжай / +

**Если** в чате «продолжай» или `+` (**равнозначные команды**) **то:**

1. Продолжить **текущую** задачу из сообщения или контекста.
2. **Если** текущая задача закрыта **то:**
   - [`docs/VELORIX_NEON_THEME.md`](../../../docs/VELORIX_NEON_THEME.md) — Phase D, refs **1–27**, открытые пробелы VA, workstream'ы;
   - [`docs/IMPLEMENTATION_NEON_CHECKLIST.md`](../../../docs/IMPLEMENTATION_NEON_CHECKLIST.md) — `## Ближайший TODO спринта` (3–7 пунктов).
3. **Запрещено:** [`docs/archive/`](../../../docs/archive/), корневые `VELORIX_TZ.md` / `IMPLEMENTATION_CHECKLIST.md`.
4. `npm run check:quiet` при diff; одна `J-NNN` (skill [`velorix-journal-entry`](../velorix-journal-entry/SKILL.md)).
5. **Git по J-NNN** — [`velorix-agent.mdc`](../../rules/velorix-agent.mdc).

Исполняемое: [`velorix-agent.mdc`](../../rules/velorix-agent.mdc).
