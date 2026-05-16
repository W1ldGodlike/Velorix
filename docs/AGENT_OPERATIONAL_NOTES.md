# Operational notes (FluxAlloy)

**Исполняемое поведение агента** — только в [`.cursor/rules/`](../.cursor/rules/), в первую очередь [`fluxalloy-agent-runtime.mdc`](../.cursor/rules/fluxalloy-agent-runtime.mdc) (alwaysApply). Карта: [`AGENTS.md`](../AGENTS.md), иерархия: [`SOURCES_OF_TRUTH.md`](SOURCES_OF_TRUTH.md).

**Этот файл** — заметки при отладке конкретных зон. **Не** дублирует rules. **При конфликте** побеждают `.mdc` + шапки `IMPLEMENTATION_*`.

Архитектура: [`docs/ARCHITECTURE.md`](ARCHITECTURE.md). Медиа/CSP: `src/renderer/index.html`, `src/main/media-protocol.ts`.

---

## Операционные заметки

| Тема | Заметка |
|------|---------|
| CSP | `src/renderer/index.html` — `media-src` / `connect-src`; при падении `<video>` / `fetch` — CSP + способ отдачи файла в main |
| Медиа URL | Allowlist/grant в main; схема `fluxmedia://` и/или локальный HTTP — согласованность с `media-protocol.ts` |
| yt-dlp Windows | UTF-8 stdout для путей с кириллицей; не откатывать обёртки без причины |
| Очередь загрузок | `{ ok, error }` в IPC; снапшоты — main window и downloads, **если** оба окна в сценарии |
| Движки | bundled-first, `npm run engines:prepare:win`, `Data/trusted_hashes.json` — не ослаблять (§3 ТЗ, `fluxalloy-core.mdc`) |
| Долгие jobs | Превью, transcode, export — статус в UI и `userData/logs/main.log` |

**Если** меняете поведение по строке таблицы **и** владелец ведёт playbook **то** обновить эту таблицу **или** `docs/ARCHITECTURE.md` в том же коммите.

---

_2026-05-16: исполняемое → `fluxalloy-agent-runtime.mdc`. Бывш. `AGENT_INSTRUCTIONS_AND_AGREEMENTS.md` → `AGENT_OPERATIONAL_NOTES.md`._
