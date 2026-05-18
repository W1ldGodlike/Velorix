---
name: fluxalloy-checklist-audit
description: Full audit and update of IMPLEMENTATION_CHECKLIST.md for FluxAlloy. Use when revising checklist, sprint TODO, section status marks, or reconciling with FLUXALLOY_TZ and journal from J-500 onward.
---

# Полный ревиз чеклиста (FluxAlloy)

## Когда применять

Владелец просит обновить чеклист, фаза GOV C, или sprint TODO устарел.

## Метод

1. Оглавление `FLUXALLOY_TZ.md` — сверять § чеклиста §0–§17 по одному.
2. Каждый пункт: код `src/`, `tests/`, guards; журнал **с J-500** до последней строки.
3. `[x]` / `[~]` / `[ ]` — короткий точный текст; убрать устаревшее (hooks composition, удалённые gate, неверные счётчики тестов).
4. «Готовность» и «Текущий снимок» — из `npm run test` и `npm run audit:inventory`.
5. `## Ближайший TODO спринта`: **3–7** открытых пунктов, ≤220 символов — не архив `[x]`.
6. Мета «обновляй чеклист каждый раз» из §0 убрать — процесс в skills/rules.

## Проверки

`npm run check:checklist`, `npm run check:quiet`.

## Запрещено

Копировать ТЗ в чеклист; дублировать хронику журнала в теле чеклиста.
