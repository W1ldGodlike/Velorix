---
name: Velorix-continue
description: «продолжай» и `+` — равнозначные команды; продолжить Задачу №1 (UI 1:1 по PNG) или активный срез в docs/IMPLEMENTATION_NEON_CHECKLIST.md.
---

# Продолжай / +

**Если** в чате «продолжай» или `+` (**равнозначные команды**) **то:**

1. **Задача №1** — UI **идентично** PNG refs **1–27** ([`IMPLEMENTATION_NEON_CHECKLIST.md`](../../../docs/IMPLEMENTATION_NEON_CHECKLIST.md) § «Задача №1»). **Запрещено:** другие sprint/IPC/фичи, пока Задача №1 не закрыта (все refs sign-off).
2. **Активный срез** — первый незакрытый пункт `## Ближайший TODO спринта` (`ui.1` … `ui.5`). Сейчас приоритет: **ui.2 ref.1** (Обработка), после фундамента **ui.1**.
3. **Post PURGE v3:** renderer stub (`RENDERER_STATE_APPROACH = 'none'`); rebuild UI по PNG — [`VELORIX_NEON_THEME.md`](../../../docs/VELORIX_NEON_THEME.md); overlay/capture — после появления экранов.
4. **Запрещено:** [`docs/archive/`](../../../docs/archive/), корневые `VELORIX_TZ.md` / `IMPLEMENTATION_CHECKLIST.md`.
5. `npm run check:quiet` при diff; одна `J-NNN` (skill [`velorix-journal-entry`](../velorix-journal-entry/SKILL.md)).
6. **Git по J-NNN** — [`velorix-agent.mdc`](../../rules/velorix-agent.mdc).

Исполняемое: [`velorix-agent.mdc`](../../rules/velorix-agent.mdc).
