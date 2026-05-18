# Ручной smoke на вашем железе

Автоматические тесты в CI проверяют **argv** ffmpeg, но не реальную видеокарту и масштаб монитора. Для релиза на своей машине используйте единый пакет чеклистов.

## Где открыть

1. **Настройки → Зависимости** — блок **«Ручной smoke (владелец)»** и кнопка **«Скопировать весь пакет»** (HiDPI + HW + планировщик ОС + снимок dpi).
2. Ниже — отдельные панели: **NVENC/VAAPI**, **HiDPI** (вкладка «Общие»), **packaged smoke**, чеклист OS scheduler в **планировщике задач**.
3. **Архив поддержки** — секция `ownerManualSmoke:` в `diagnostics.txt` (дублирует те же шаги).

## Что проверить

| Блок | Смысл |
|------|--------|
| HiDPI | Масштаб Windows 100–200 %: редактор, загрузки, модалки, статусбар |
| HW encode | NVENC (Win) или VAAPI (Linux): probe, ручной кодек, hw_auto, «Оценить» |
| OS scheduler | Watch-folder + Task Scheduler / launchd / systemd user timer |

Подробности: [hardware-encoding.md](hardware-encoding.md), [appearance-language-theme.md](appearance-language-theme.md), [workflows-planner-scenarios.md](workflows-planner-scenarios.md).

После прогона отметьте пункты в `IMPLEMENTATION_CHECKLIST.md` (раздел «Ручной smoke владельца») и приложите Support ZIP при обращении в поддержку.
