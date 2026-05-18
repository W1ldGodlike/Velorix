# Ручной smoke на вашем железе

Автоматические тесты в CI проверяют **argv** ffmpeg, но не реальную видеокарту и масштаб монитора. Для релиза на своей машине используйте единый пакет чеклистов.

## Где открыть

1. **Настройки → Зависимости** — блок **«Ручной smoke (владелец)»**: разверните превью секций (**Тема**, HiDPI, HW, сценарий, спрайт §7.5, мини-плеер §4.3, packaged, планировщик, shell), затем **«Скопировать весь пакет»** (тот же текст в Support ZIP `ownerManualSmoke:`; при **английском UI** — EN-строки из `locales/en/settings.json` и packaged shards). Кнопки **«К …»** переключают вкладку настроек и прокручивают к теме, HiDPI, HW, packaged или Проводнику. Подсказки в панели упоминают dev-guards: `check:owner-visual-smoke-locale`, `check:packaged-manual-smoke-parity`, `check:packaged-e2e-scenarios-registry` (§21: 12 packaged шагов ↔ CI headless или planned GUI e2e).
2. Ниже — отдельные панели (у каждой deep-link на эту статью): **NVENC/VAAPI**, **packaged smoke**; **HiDPI** и **Проводник Windows** — вкладка **«Общие»**. Из hub: **«Открыть планировщик»** / **«Открыть конструктор»** (то же, что меню **Сервис**).
3. **Архив поддержки** — `ownerManualSmoke:` в `diagnostics.txt` (дублирует те же шаги); `releaseSmoke:` — CI packaged pipeline и план §21 e2e (см. [about-support-logs.md](about-support-logs.md)).

## Что проверить

| Блок             | Смысл                                                                                        |
| ---------------- | -------------------------------------------------------------------------------------------- |
| Theme            | Тёмная / светлая / системная тема: контраст, focus, modals, pop-out загрузок, инспектор      |
| HiDPI            | Масштаб Windows 100–200 %: редактор, загрузки, модалки, статусбар                            |
| HW encode        | NVENC (Win) или VAAPI (Linux): probe, ручной кодек, hw_auto, «Оценить»                       |
| Scenario builder | Конструктор, JSON edges, запуск из редактора / URL                                           |
| Video sprite §7.5 | FFmpeg rail → спрайт превью: сетка, PTS, сохранение PNG/JPEG; offline guard в тестах          |
| Mini Player §4.3 | Сервис → мини-плеер при busy-задачах: %/speed, ПКМ topmost, restore main, `session.json`       |
| Packaged         | `dist/win-unpacked` / `linux-unpacked` / `.app` — отдельная панель packaged; **Скопировать** даёт `owner:`/`automated:`/`step [...]` как в Support ZIP |
| OS scheduler     | Watch-folder + Task Scheduler / launchd / systemd user timer                                 |
| Windows shell    | Контекстное меню, «Открыть с помощью», «Приложения по умолчанию…» (только Win)               |

Подробности: [hardware-encoding.md](hardware-encoding.md), [appearance-language-theme.md](appearance-language-theme.md), [workflows-planner-scenarios.md](workflows-planner-scenarios.md), [windows-shell-integration.md](windows-shell-integration.md).

В конце **«Скопировать весь пакет»** и в Support ZIP `ownerManualSmoke:` добавляется сводка **§21 packaged e2e** (группы ci-headless / planned-gui-e2e / manual-owner) и **12 строк** `e2e <stepId>: <automation> script=…` (например `e2e launch: ci-headless script=smoke:packaged-app`); тот же блок в `releaseSmoke:`.

После прогона отметьте пункты в `IMPLEMENTATION_CHECKLIST.md` (раздел «Ручной smoke владельца») и приложите Support ZIP при обращении в поддержку.
