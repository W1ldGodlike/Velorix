# Шаблон для очереди «продолжай»

Копируйте блок целиком (лучше, чем одно слово «продолжай»):

```text
Режим: marathon. Контракт: docs/AGENT_REANCHOR.md и .cursor/rules/fluxalloy-marathon.mdc.

План: только «Ближайший TODO спринта» в IMPLEMENTATION_CHECKLIST.md; ТЗ — один нужный § FLUXALLOY_TZ.md.

Объём: один крупный вертикальный срез за итерацию (main→preload→UI→тесты). Минимум слов в чате, максимум кода.

Журнал: ровно одна сводная J-* в конце итерации — npm run journal:stamp. Не дублировать журнал в ответе.

Коммит: каждые 5 итераций (счётчик в docs/.agent-session.json), если check:quiet зелёный.
Push: каждые 10 итераций на origin (без force в main/master).

Каждая 10-я итерация: re-anchor по AGENT_REANCHOR.md → в отчёте «re-anchor OK».

FLUXALLOY_TZ.md не трогать. Отчёт: 3–5 буллетов.
```
