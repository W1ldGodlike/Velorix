---
name: Velorix-continue
description: «продолжай» и `+` — равнозначные команды; Задача №1 — строго один активный PNG ref (сейчас ref.1) до sign-off 1:1, затем следующий.
---

# Продолжай / +

**Если** в чате «продолжай» или `+` (**равнозначные команды**) **то:**

1. **Задача №1** — UI **идентично** PNG refs **1–27** ([`IMPLEMENTATION_NEON_CHECKLIST.md`](../../../docs/IMPLEMENTATION_NEON_CHECKLIST.md) § «Задача №1»). **Запрещено:** другие sprint/IPC/фичи, пока Задача №1 не закрыта (все refs sign-off).
2. **Последовательный ref (1→27)** — глоссарий [`velorix-rules-explicit.mdc`](../../rules/velorix-rules-explicit.mdc). **Активный ref:** **ref.1** (`docs/reference/velorix-neon-reference-processing.png`). **Обязательно:** довести **только** активный ref до **1:1** (layout, шрифты, кнопки, glow, rails, chrome) **сверху донизу** vs PNG. **Запрещено:** ref.2…27, «сначала ref.27/26», любой polish неактивного ref — **до** `[x]` sign-off активного ref в матрице NEON-чеклиста.
3. **Post PURGE v3:** renderer stub (`RENDERER_STATE_APPROACH = 'none'`); rebuild по PNG — [`VELORIX_NEON_THEME.md`](../../../docs/VELORIX_NEON_THEME.md); **sprint ui.* и матрица refs — все `[ ]` до sign-off**; **запрещено:** `[~]`/проценты «готово».
4. **Запрещено:** [`docs/archive/`](../../../docs/archive/), корневые `VELORIX_TZ.md` / `IMPLEMENTATION_CHECKLIST.md`.
5. **Запрещено:** восстанавливать код из git без **явной просьбы владельца** в чате (`git checkout <rev> --`, `git restore --source=`, `git show` → файл). Rebuild — **новые** файлы по PNG; канон: [`velorix-no-git-restore.mdc`](../../rules/velorix-no-git-restore.mdc).
6. `npm run check:quiet` при diff; одна `J-NNN` (skill [`velorix-journal-entry`](../velorix-journal-entry/SKILL.md)).
7. **Git по J-NNN** — [`velorix-agent.mdc`](../../rules/velorix-agent.mdc).

Исполняемое: [`velorix-agent.mdc`](../../rules/velorix-agent.mdc) § UI «Последовательные refs».
