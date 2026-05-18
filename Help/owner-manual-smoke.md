# Ручной smoke на вашем железе

Автоматические тесты в CI проверяют **argv** ffmpeg, но не реальную видеокарту и масштаб монитора. Для релиза на своей машине используйте единый пакет чеклистов.

## Где открыть

1. **Настройки → Зависимости** — блок **«Ручной smoke (владелец)»**: разверните превью секций (**Тема**, HiDPI, HW, сценарий, packaged, планировщик, shell), затем **«Скопировать весь пакет»** (тот же текст в Support ZIP `ownerManualSmoke:`). Кнопки **«К …»** переключают вкладку настроек и прокручивают к теме, HiDPI, HW, packaged или Проводнику.
2. Ниже — отдельные панели (у каждой deep-link на эту статью): **NVENC/VAAPI**, **packaged smoke**; **HiDPI** и **Проводник Windows** — вкладка **«Общие»**. Из hub: **«Открыть планировщик»** / **«Открыть конструктор»** (то же, что меню **Сервис**).
3. **Архив поддержки** — секция `ownerManualSmoke:` в `diagnostics.txt` (дублирует те же шаги).

## Что проверить

| Блок | Смысл |
|------|--------|
| Theme | Тёмная / светлая / системная тема: контраст, focus, modals, pop-out загрузок, инспектор |
| HiDPI | Масштаб Windows 100–200 %: редактор, загрузки, модалки, статусбар |
| HW encode | NVENC (Win) или VAAPI (Linux): probe, ручной кодек, hw_auto, «Оценить» |
| Scenario builder | Конструктор, JSON edges, запуск из редактора / URL |
| Packaged | `dist/win-unpacked` / `linux-unpacked` / `.app` — см. отдельную панель packaged в настройках |
| OS scheduler | Watch-folder + Task Scheduler / launchd / systemd user timer |
| Windows shell | Контекстное меню, «Открыть с помощью», «Приложения по умолчанию…» (только Win) |

Подробности: [hardware-encoding.md](hardware-encoding.md), [appearance-language-theme.md](appearance-language-theme.md), [workflows-planner-scenarios.md](workflows-planner-scenarios.md), [windows-shell-integration.md](windows-shell-integration.md).

После прогона отметьте пункты в `IMPLEMENTATION_CHECKLIST.md` (раздел «Ручной smoke владельца») и приложите Support ZIP при обращении в поддержку.
