# VELORIX NEON — план и чеклист темы

**Навигатор агента:** UI/UX, NEON, Phase D, refs **1–27**, открытые пробелы Variant A, новый функционал под PNG. **«продолжай» / `+`:** этот файл → sprint TODO в [`IMPLEMENTATION_NEON_CHECKLIST.md`](IMPLEMENTATION_NEON_CHECKLIST.md). **Запрещено:** [`docs/archive/`](archive/README.md) как навигатор. Ручная проверка на железе (владелец) — Support ZIP `ownerHardwareChecklist:`.

**Эталон UI — «Обработка» (реф. 1):** [`reference/velorix-neon-canonical-reference.png`](reference/velorix-neon-canonical-reference.png)  
**Эталон иконки приложения:** [`reference/velorix-neon-app-icon-reference.png`](reference/velorix-neon-app-icon-reference.png) → в сборке: `resources/icon.png` (по явной просьбе владельца).  
**Эталон логотипа (горизонтальный):** [`reference/velorix-neon-logo-wordmark-reference.png`](reference/velorix-neon-logo-wordmark-reference.png) — mark слева, **VELORIX** справа (этап 2 sidebar/topbar).  
**Эталон логотипа (вертикальный):** [`reference/velorix-neon-logo-stacked-reference.png`](reference/velorix-neon-logo-stacked-reference.png) — mark сверху, **VELORIX** снизу (splash, about, узкий brand).  
**Эталон «Загрузки» (референс 2):** [`reference/velorix-neon-reference-downloads.png`](reference/velorix-neon-reference-downloads.png) — менеджер загрузок (сверка на этапе 6 / фаза D).  
**Эталон «История» (референс 3):** [`reference/velorix-neon-reference-history.png`](reference/velorix-neon-reference-history.png) — лента событий + аналитика (этап 6 / фаза D).  
**Эталон «Планировщик» (референс 4):** [`reference/velorix-neon-reference-planner.png`](reference/velorix-neon-reference-planner.png) — расписание и автоматизация (этап 6 / фаза D).  
**Эталон «База знаний» / «Справка» (референс 5):** [`reference/velorix-neon-reference-knowledge.png`](reference/velorix-neon-reference-knowledge.png) — один экран: каталог Help, поиск, превью статьи (этап 6 / фаза D).  
**Эталон «Настройки» (референс 6):** [`reference/velorix-neon-reference-settings.png`](reference/velorix-neon-reference-settings.png) — приложение + обработка + кэш (этап 6 / фаза D).  
**Эталон «Сценарии» (референс 7):** [`reference/velorix-neon-reference-scenarios.png`](reference/velorix-neon-reference-scenarios.png) — каталог workflow + запуски (этап 6 / фаза D).  
**Эталон «Инспектор файлов» (референс 8):** [`reference/velorix-neon-reference-inspector.png`](reference/velorix-neon-reference-inspector.png) — анализ медиа (не путать с FFmpeg rail, этап 5).  
**Эталон «Терминал» / «Консоль» (референс 9):** [`reference/velorix-neon-reference-terminal.png`](reference/velorix-neon-reference-terminal.png) — один экран: логи ffmpeg, CLI, настройки (этап 6 / фаза D).  
**Эталон «Инструменты» (реф. 10):** [`reference/velorix-neon-reference-tools.png`](reference/velorix-neon-reference-tools.png) — хаб карточек утилит.  
**Эталон «О программе» (реф. 11):** [`reference/velorix-neon-reference-about.png`](reference/velorix-neon-reference-about.png).  
**Эталон «Обслуживание файлов» (реф. 12):** [`reference/velorix-neon-reference-file-maintenance.png`](reference/velorix-neon-reference-file-maintenance.png).  
**Эталон «Конвертация изображений» (реф. 13):** [`reference/velorix-neon-reference-image-conversion.png`](reference/velorix-neon-reference-image-conversion.png).  
**Эталон «Генератор шума/тишины» (реф. 14):** [`reference/velorix-neon-reference-noise-generator.png`](reference/velorix-neon-reference-noise-generator.png).  
**Эталон «Слайдшоу» (реф. 15):** [`reference/velorix-neon-reference-slideshow.png`](reference/velorix-neon-reference-slideshow.png).  
**Эталон «Конструктор сценариев» (реф. 16):** [`reference/velorix-neon-reference-scenario-builder.png`](reference/velorix-neon-reference-scenario-builder.png) — ≠ каталог реф. 7.  
**Эталон «Внешний script-filter» (реф. 17):** [`reference/velorix-neon-reference-external-script-filter.png`](reference/velorix-neon-reference-external-script-filter.png).  
**Эталон «Имя пресета экспорта» (реф. 18):** [`reference/velorix-neon-reference-export-preset-name.png`](reference/velorix-neon-reference-export-preset-name.png) — модалка; фон mockup: конвертация видео.  
**Эталон «Пути к движкам» (реф. 19):** [`reference/velorix-neon-reference-engine-paths.png`](reference/velorix-neon-reference-engine-paths.png).  
**Эталон первого запуска / движки (реф. 20):** [`reference/velorix-neon-reference-first-run-engines.png`](reference/velorix-neon-reference-first-run-engines.png).  
**Эталон «Закрыть Velorix?» (реф. 21):** [`reference/velorix-neon-reference-quit-confirm.png`](reference/velorix-neon-reference-quit-confirm.png).  
**Эталон ошибки FFmpeg (реф. 22):** [`reference/velorix-neon-reference-ffmpeg-error-dialog.png`](reference/velorix-neon-reference-ffmpeg-error-dialog.png).  
**Эталон «Критический сбой приложения» (реф. 23):** [`reference/velorix-neon-reference-critical-crash.png`](reference/velorix-neon-reference-critical-crash.png).  
**Эталон «Бенчмарк кодеров» (реф. 24):** [`reference/velorix-neon-reference-encoder-benchmark.png`](reference/velorix-neon-reference-encoder-benchmark.png).  
**Эталон «Плагины» (реф. 25):** [`reference/velorix-neon-reference-plugins.png`](reference/velorix-neon-reference-plugins.png).  
**Эталон «UI State Showcase» (реф. 26):** [`reference/velorix-neon-reference-ui-state-showcase.png`](reference/velorix-neon-reference-ui-state-showcase.png).  
**Эталон «UI Components / States» (реф. 27):** [`reference/velorix-neon-reference-ui-components.png`](reference/velorix-neon-reference-ui-components.png).  
**Реестр (TS):** `velorix-neon-theme-tokens.ts` — `VELORIX_NEON_REFERENCE_SCREEN_RELS` (реф. 1–27 экраны/модалки/showcase) + иконка/логотипы.  
**Каталог mockup:** [`reference/README.md`](reference/README.md) · `VELORIX_REFERENCE_ASSETS_DIR`

> **Устарело:** [`UX_REFERENCE_V0.OLD.md`](archive/UX_REFERENCE_V0.OLD.md) — не использовать.

---

## Вариант A — единственный UI NEON (канон продукта, старт работ)

**Статус:** принято владельцем **2026-05-22**. **2026-05-26** владелец подтвердил старт Variant A cleanup/migration: документ используется как активный трекер канона, shell-миграции и удаления legacy.

### Смысл варианта A (кратко, от агента)

| Было | Станет |
|------|--------|
| Две палитры (`dark` / `light`) + NEON как слой поверх старого тёмного | **Один** визуальный продукт — **VELORIX NEON** |
| Старый shell (topbar-grid, правый rail) и `velorix-neon-*.css` поверх `main.css` | **UI с нуля** по PNG; legacy layout **удалять** (burn-down), не «скин» |
| Переключатель темы в настройках | **Убрать**; альтернативных тем в релизе **нет** |
| Pop-out окна, дубли nav | **Не** целевой UX (см. решение про pop-out ниже) |

**Зачем A:** один узнаваемый бренд, эталоны 1:1, нет двойной поддержки «старый dark + NEON + light».

### Текст владельца (зафиксировать дословно по смыслу)

> Делаем **вариант A**. Обязательно зафиксировать: **ничего лишнего** — без дублей и мусора; **старые темы полностью удалены** из проекта; **NEON по сути UI с нуля**. **Функционал не должен пострадать**: сначала переписываем UI и добавляем новый функционал; под новые вишки на референсах функционал **дописываем отдельно**. **Референсы = тотальный канон**, practically **1:1**; расхождения в названиях вкладок — мелочь; **визуал 100%**. Будут ещё референсы. Этот текст и план A сохранить; когда референсы готовы — отправить агента **читать этот файл** и **начать работу по проекту**.

### Старт работ (команда владельца)

**Если** в чате владелец пишет, что референсы готовы, и просит читать канон / начинать NEON (например: «читай `VELORIX_NEON_THEME.md` вариант A», «начинай по NEON», «референсы готовы — работай») **то** агент:

1. Читает **этот раздел** и полный список PNG в шапке + [`reference/README.md`](reference/README.md).
2. Сверяет, что все ожидаемые референсы на диске (`VELORIX_NEON_REFERENCE_SCREEN_RELS`, иконка/логотипы).
3. Работает по приоритету: **визуал 1:1** → единый shell (фаза D) → **удаление** legacy-тем и дублей UI → отдельные продуктовые срезы под фичи, которых ещё нет в коде, но есть на PNG.

**До команды «начинай»:** только референсы, правки этого дока, анализ — **без** массового удаления тем и **без** обещания «готово» по этапам 1–6 без sign-off vs PNG.

### Обязательные правила реализации (вариант A)

| # | Правило |
|---|---------|
| 1 | **Референс = канон.** Визуал (layout, плотность, цвет, glow, иконки, rails) — **максимально 1:1** с соответствующим PNG; новые PNG владельца добавляются в `docs/reference/` и реестр **до** верстки экрана. |
| 2 | **Функционал не ломать.** IPC, ffmpeg, yt-dlp, settings persistence, workflows — **сохранить**; в срезе «только UI» не менять контракты без отдельной задачи. |
| 3 | **UI с нуля, не «скин».** Старые `dark`/`light`, переключатель темы, `main.css` layout shell — **удалить** при burn-down (см. NEON-чеклист § burn-down); **не** держать параллельно. |
| 4 | **Без мусора.** Запрещены: второй sidebar, pop-out Загрузки/Инспектор, дублирующие пункты меню, неиспользуемые CSS-файлы старых тем, «оставили на всякий случай» ветки layout. |
| 5 | **Фичи с PNG без кода.** Сначала вёрстка по референсу; логика (NLE tracks, AI в базе знаний, …) — **отдельный** срез с ТЗ/IPC, не подменять пустышкой без пометки в чеклисте. |
| 6 | **Названия.** Мелкие отличия подписей mockup vs `ui-text` — допустимы; композиция и иерархия — **нет**. |
| 7 | **Удалять мешающее.** Устаревший код/doc/guard/UX, который блокирует план или реализацию — **удалить** или заменить в той же итерации; **не** копить legacy «из страха» и **не** дублировать старый+новый путь. Глоссарий: **«Удаление мешающего legacy»** в `velorix-rules-explicit.mdc`. |
| 8 | **Burn-down UI.** Единственная визуальная истина — **PNG refs 1–27**. Старый shell/layout/компоненты — **срезать** при внедрении ref-экрана; backend (IPC/stores) — сохранить. **Запрещено:** LosslessCut/чужие IDE как ориентир. |

### Конфликт с другими документами

- **Архив ТЗ:** [`docs/archive/VELORIX_TZ.OLD.md`](archive/VELORIX_TZ.OLD.md) — **не** spec. Вспомогательный стек — [`ARCHITECTURE.md`](ARCHITECTURE.md). §5 (две темы) и др. **не** блокируют Variant A.
- **Этапы 1–6 ниже:** черновик CSS на **старом** layout (J-1621…1625); при варианте A после sign-off vs PNG либо **пересмотр** под новый shell, либо замена фазой D + полная зачистка legacy — не считать закрытым «по старому коду».

### Чеклист «вариант A выполнен» (для финала программы, не сейчас)

- [ ] Все экраны/модалки из `VELORIX_NEON_REFERENCE_SCREEN_RELS` (+ новые PNG владельца) — визуально 1:1.
- [ ] В настройках и меню **нет** выбора `light` / `dark` / `system` — только NEON.
- [ ] Удалены неиспользуемые CSS/компоненты старых тем; `main.css` не дублирует `velorix-neon-*`.
- [ ] Pop-out downloads/inspector **не** в целевом UX (код вычищен или сведён к shell).
- [ ] `npm run check:quiet` зелёный; приёмка на железе — Support ZIP `ownerHardwareChecklist:`.

---

## Как работать с этим файлом (обязательно для агента)

**Шесть больших промптов владельца = шесть этапов ниже (§ «Шесть промптов»).**  
Тексты вносятся **по одному** от владельца (дословно), **с этапа 1**. Сейчас в каноне: **6 / 6** (все тексты промптов в доке; выполнение в коде — по команде «делай этап N»). **Потом** выполняют **строго по порядку**: этап *N* считается закрытым только когда выполнены **все** пункты «Критерии закрытия этапа» для этого *N*, затем `npm run check:quiet`, одна `J-NNN`, и только после этого — этап *N+1*.

**Запрещено:**

- Прыгать к этапу 4, пока не закрыт этап 3 (и т.д.).
- Смешивать зоны из CRITICAL RULES разных этапов в одной итерации (например, timeline + inspector + «final polish» одним diff).
- Ставить `[x]` на этап без визуальной сверки с эталонным PNG (код ≠ «готово по промпту»).
- Писать «фаза B закрыта», пока не закрыты этапы 1–6 по критериям ниже.

**История ошибки (J-1621…J-1625):** код по этапам 2–6 уже залит, но процесс был нарушен — этапы шли без жёсткой очереди и без полных тел промптов в этом файле; этап 6 (polish) накрыл всё сразу. Ниже — **канон процесса**; колонка **Sign-off** сброшена, пока владелец не подтвердит сверку с PNG.

---

## Эталоны по типу (не этапы 1–6)

| Артефакт | Файл | Роль |
|----------|------|------|
| **Обработка** (эталон / реф. 1) | `velorix-neon-canonical-reference.png` | Главный mockup: превью + timeline + FFmpeg rail; этапы 1–6 |
| **Иконка приложения** | `velorix-neon-app-icon-reference.png` | Только mark (квадрат под app icon / favicon). Упаковка → `resources/icon.png`. |
| **Логотип горизонтальный** | `velorix-neon-logo-wordmark-reference.png` | Mark **слева** + **VELORIX** **справа** (sidebar / topbar). |
| **Логотип вертикальный** | `velorix-neon-logo-stacked-reference.png` | Mark **сверху** + **VELORIX** **снизу** (splash, about, узкий brand). |
| **Загрузки** (реф. 2) | `velorix-neon-reference-downloads.png` | Менеджер загрузок: sidebar + список + детали/статистика |
| **История** (реф. 3) | `velorix-neon-reference-history.png` | Единая лента: обработка + загрузки + сценарии + система + ошибки |
| **Планировщик** (реф. 4) | `velorix-neon-reference-planner.png` | Week grid, задачи, очередь исполнения, статистика |
| **База знаний / Справка** (реф. 5) | `velorix-neon-reference-knowledge.png` | Поиск, категории, популярное, таблица статей, превью |
| **Настройки** (реф. 6) | `velorix-neon-reference-settings.png` | Вкладки, 6+ карточек, import/export, системный rail |
| **Сценарии** (реф. 7) | `velorix-neon-reference-scenarios.png` | Grid сценариев, фильтры, последние выполнения, detail rail |
| **Инспектор файлов** (реф. 8) | `velorix-neon-reference-inspector.png` | Probe dashboard: scopes, кадры, вкладки потоков |
| **Терминал** (реф. 9) | `velorix-neon-reference-terminal.png` | FFmpeg logs, вкладки, CLI, rail настроек терминала |
| **Инструменты** (реф. 10) | `velorix-neon-reference-tools.png` | Хаб карточек; дочерние окна — реф. 11–19, 22 |
| Модалки / мастера (реф. 11–22) | `velorix-neon-reference-*.png` | См. шапку дока; этап 6 или фаза D |

**Именование реф. 1:** на mockup экран в sidebar и в заголовке — **«Обработка»** (не «Редактор»). Файл `velorix-neon-canonical-reference.png` = **эталонный PNG** этого экрана. В **текущем** приложении та же зона — workspace `editor` / строка «Редактор» в topbar (`Help` → вкладки); целевой NEON-shell (фаза D) — пункт sidebar **Обработка**.

**Терминал = Консоль (решение владельца):** на части mockup’ов встречаются оба слова (sidebar **Терминал**, topbar реф. 1 — **Консоль**). Для продукта и референсов — **один экран**, один канон: реф. 9 `velorix-neon-reference-terminal.png`. Отдельный PNG «Консоль» **не** нужен; вкладки внутри экрана (FFmpeg Logs / System Console / Live / Debug) — **подрежимы**, не второй пункт nav.

**Справка = База знаний (решение владельца):** на mockup’ах встречаются оба слова (sidebar **Справка** на реф. 2, заголовок **База знаний** на реф. 5). Для продукта и референсов — **один экран**, один канон: реф. 5 `velorix-neon-reference-knowledge.png`. Отдельный PNG «Справка» **не** нужен. Пункты меню **Справка** / **Help** в приложении сегодня (в т.ч. «О программе», история из меню) при фазе D сводятся к **этому** экрану или к его разделам, а не к отдельному «лёгкому hub» без каталога статей.

**Без pop-out Загрузки / Инспектор (решение владельца):** отдельные окна `#downloads` / `#inspector` — **не** целевой NEON UX: дублируют sidebar **Загрузки** (реф. 2) и **Инспектор** (реф. 8). В фазе D — **один** главный shell, переключение вкладок; отдельные PNG pop-out **не** планируются. Наследие `focusOrCreateDownloadsWindow` / inspector window в коде — не развивать под mockup.

---

## Шесть промптов (канон выполнения)

Общие ограничения **для всех этапов** (если в этапе не сказано иное):

- Не менять backend, FFmpeg, IPC, state, workflows.
- Не переделывать layout / плотность сетки (до фазы D).
- Не упрощать UI до generic SaaS dark mode.
- До полного варианта A (§ выше): только dark + `html:not([data-theme])` для черновика CSS. **Цель A:** светлая и legacy dark/light **удалены**, остаётся только NEON.
- Сверка с [`reference/velorix-neon-canonical-reference.png`](reference/velorix-neon-canonical-reference.png).

| # | Текст в доке | Зона | CSS / код (факт) | Sign-off vs PNG |
|---|--------------|------|------------------|-----------------|
| 1 | [x] | Design tokens, atmosphere | `themes/velorix-neon/*`, … (код J-1617 — пересмотр после sign-off) | [ ] |
| 2 | [x] | Sidebar + topbar | `velorix-neon-chrome.css`, … (код J-1621 — пересмотр после sign-off) | [ ] |
| 3 | [x] | Preview + transport | `velorix-neon-preview.css`, … (код J-1622 — пересмотр после sign-off) | [ ] |
| 4 | [x] | Timeline + playhead | `velorix-neon-timeline.css`, … (код J-1623 — пересмотр после sign-off) | [ ] |
| 5 | [x] | Inspector / export rail | `velorix-neon-inspector.css`, … (код J-1624 — пересмотр после sign-off) | [ ] |
| 6 | [x] | Final polish (после sign-off 1–5) | `velorix-neon-polish.css`, … (код J-1625 — пересмотр) | [ ] |

**Sign-off (2026-05-23, референс 1):** все `[ ]` в таблице выше и в фазе B — **сброшены** после замены `velorix-neon-canonical-reference.png`. Старые визуальные sign-off **недействительны**. Колонка «Код» `[x]` = черновик J-1621…1625; **не** считать закрытием этапа без новой сверки с PNG.

---

## Анализ референса 1 (`velorix-neon-canonical-reference.png`)

Экран **«Обработка»** v1.7.0 — **эталонный** полный mockup (файл `velorix-neon-canonical-reference.png`). Подзаголовок на PNG: «Профессиональная обработка и монтаж медиафайлов». Ниже: что на картинке, что уже есть в Velorix, и что **не входит** в этапы NEON 1–6 (только стиль).

### Карта зон → этапы NEON

| Зона на PNG | Этап NEON | Заметки |
|-------------|-----------|---------|
| Sidebar: **Обработка** (active), заголовок экрана | **2** | «Профессиональная обработка и монтаж…»; nav + GPU/CPU (не путать с вкладкой «Редактор» в **текущем** коде) |
| Topbar (вариант mockup) | **2** | На части PNG — вкладки «Редактор» · Загрузки · «Консоль» (= **Терминал**, см. ниже); приоритет у sidebar |
| Левый sidebar (детали) | **2** | На части mockup’ов — медиатека/проекты; на эталоне — блок «ПРОЕКТ» + мониторинг |
| Центр: превью + transport + timecode | **3** | Рамка neon; crop / snapshot / volume |
| Низ центра: **таймлайн NLE** | **4** | Самая насыщенная **функциональная** дельта vs код |
| Правый rail: FFmpeg + экспорт | **5** | Плотные секции, CRF, NVENC, «НАЧАТЬ ЭКСПОРТ» |
| Status bar внизу | **6** | Путь, 4K, кадры, FFmpeg 6.1.1, GPU |
| Atmosphere / токены везде | **1** | Void, glass, bloom, magenta→cyan |

### Таймлайн на mockup (ключевое)

| Элемент на PNG | Смысл для продукта |
|----------------|-------------------|
| **Дорожки V1, V2, V3** | Несколько **видео**-слоёв; клипы с превью (`city_night_4k.mp4`, `drive_sequence.mov`, …) |
| **Дорожки A1, A2** | Несколько **аудио**-слотов; зелёные waveform |
| **Огибающая на A2** | Volume envelope + **keyframes** (автоматизация громкости) |
| **Lock / Mute** на заголовке дорожки | Блокировка и скрытие/заглушение дорожки |
| **Toolbar:** selection, **blade/cut**, delete, **link**, **snap** | Режимы монтажа: выделение, **нарезка**, удаление, связка клипов, привязка |
| **Несколько клипов на одной дорожке** | Последовательный монтаж / **склейка** сегментов на линии времени |
| **Playhead** + bubble timecode | Общий playhead на все дорожки |
| **Zoom slider** таймлайна | Масштаб по горизонтали (отдельно от zoom превью) |

### Другие «новые» вишки на экране (не только таймлайн)

| Область | На mockup | Сейчас в продукте (ориентир) |
|---------|-----------|------------------------------|
| Shell | Левый sidebar + центр + правый rail | Другая сетка (наследие; **фаза D**) |
| Медиатека в sidebar | Категории Video/Audio/Image + счётчики | Нет такого блока в editor shell |
| Проекты | Список с aspect ratio, highlight «НОВЫЙ СЕЗОН» | Нет multi-project UI как на PNG |
| Хранилище | 1.2 / 2.0 TB progress | Нет виджета в sidebar |
| Превью chrome | Saved 2 min ago, zoom %, window controls в панели | Упрощённый transport |
| FFmpeg rail | Collapsible Video/Audio/Format/…, two-pass toggle, preset footer | Rail есть; плотность/секции ≠ 1:1 |
| Status | Selection length, GPU, FFmpeg version | Частично / другие поля |

### Что есть в коде **сегодня** (editor timeline)

- **Сейчас в коде (legacy, под удаление):** waveform + trim in/out — `VideoTimeline*`. **Цель ref.1:** layout и поведение **по PNG**, не клон старого trim-редактора.
- Toolbar: **In/Out**, reset trim, zoom, save frame, export jump — **не** blade/link/snap/multi-track.
- Нет модели **клипов**, **дорожек V1–V3 / A1–A2**, drag-and-drop на линии, split/join на timeline.

Архив ТЗ описывал trim-редактор; **канон — ref.1 PNG** (NLE-визуал на mockup). Legacy `VideoTimeline*` снять при внедрении ref.1.

### Классификация работ (чтобы не смешать с NEON 1–6)

| Слой | Что делать | Когда |
|------|------------|--------|
| **NEON 1–6** | Только **визуал** зон (цвет, glow, плотность контролов) | По команде «делай этап N»; **без** новых дорожек/IPC |
| **Фаза D** | Layout 1:1 с PNG (sidebar слева, rail справа, плотность) | После sign-off 1–6 |
| **Продукт / NLE** | Модель timeline: tracks, clips, razor, snap, link, envelopes, multi-asset | **Отдельный** срез: ТЗ + state + IPC + main; **не** в промптах NEON |
| **Архив ТЗ** | Синхронизировать vision с референсом 1 | Только по **явной просьбе** владельца (`docs/archive/VELORIX_TZ.OLD.md`) |

**Вывод:** референс 1 задаёт **целевой pro-NLE UX** (multi-track + монтаж), а текущий Velorix — **trim/export hub** с одной шкалой. Этап **4 NEON** должен визуально приблизить **внешний вид** таймлайна к PNG (дорожки, клипы, toolbar **как стили**), но **реальная** нарезка/склейка/несколько файлов — отдельная продуктовая фаза после D или параллельно с обновлением ТЗ.

### Черновик для **D.1** (карта экранов)

- [x] **Обработка** (эталон) — [`velorix-neon-canonical-reference.png`](reference/velorix-neon-canonical-reference.png) (реф. 1)
- [x] Загрузки — [`velorix-neon-reference-downloads.png`](reference/velorix-neon-reference-downloads.png) (реф. 2)
- [x] История — [`velorix-neon-reference-history.png`](reference/velorix-neon-reference-history.png) (реф. 3)
- [x] Планировщик — [`velorix-neon-reference-planner.png`](reference/velorix-neon-reference-planner.png) (реф. 4)
- [x] База знаний / Справка — [`velorix-neon-reference-knowledge.png`](reference/velorix-neon-reference-knowledge.png) (реф. 5)
- [x] Настройки — [`velorix-neon-reference-settings.png`](reference/velorix-neon-reference-settings.png) (реф. 6)
- [x] Сценарии — [`velorix-neon-reference-scenarios.png`](reference/velorix-neon-reference-scenarios.png) (реф. 7)
- [x] Инспектор файлов — [`velorix-neon-reference-inspector.png`](reference/velorix-neon-reference-inspector.png) (реф. 8)
- [x] Терминал — [`velorix-neon-reference-terminal.png`](reference/velorix-neon-reference-terminal.png) (реф. 9)
- [x] Инструменты — [`velorix-neon-reference-tools.png`](reference/velorix-neon-reference-tools.png) (реф. 10)
- [x] О программе — [`velorix-neon-reference-about.png`](reference/velorix-neon-reference-about.png) (реф. 11)
- [x] Обслуживание файлов — [`velorix-neon-reference-file-maintenance.png`](reference/velorix-neon-reference-file-maintenance.png) (реф. 12)
- [x] Конвертация изображений — [`velorix-neon-reference-image-conversion.png`](reference/velorix-neon-reference-image-conversion.png) (реф. 13)
- [x] Генератор шума/тишины — [`velorix-neon-reference-noise-generator.png`](reference/velorix-neon-reference-noise-generator.png) (реф. 14)
- [x] Слайдшоу — [`velorix-neon-reference-slideshow.png`](reference/velorix-neon-reference-slideshow.png) (реф. 15)
- [x] Конструктор сценариев — [`velorix-neon-reference-scenario-builder.png`](reference/velorix-neon-reference-scenario-builder.png) (реф. 16)
- [x] Внешний script-filter — [`velorix-neon-reference-external-script-filter.png`](reference/velorix-neon-reference-external-script-filter.png) (реф. 17)
- [x] Имя пресета экспорта — [`velorix-neon-reference-export-preset-name.png`](reference/velorix-neon-reference-export-preset-name.png) (реф. 18)
- [x] Пути к движкам — [`velorix-neon-reference-engine-paths.png`](reference/velorix-neon-reference-engine-paths.png) (реф. 19)
- [x] Первый запуск / движки — [`velorix-neon-reference-first-run-engines.png`](reference/velorix-neon-reference-first-run-engines.png) (реф. 20)
- [x] Закрыть Velorix? — [`velorix-neon-reference-quit-confirm.png`](reference/velorix-neon-reference-quit-confirm.png) (реф. 21)
- [x] Ошибка FFmpeg — [`velorix-neon-reference-ffmpeg-error-dialog.png`](reference/velorix-neon-reference-ffmpeg-error-dialog.png) (реф. 22)
- [x] Критический сбой приложения — [`velorix-neon-reference-critical-crash.png`](reference/velorix-neon-reference-critical-crash.png) (реф. 23)
- [x] Бенчмарк кодеров — [`velorix-neon-reference-encoder-benchmark.png`](reference/velorix-neon-reference-encoder-benchmark.png) (реф. 24)
- [x] Плагины — [`velorix-neon-reference-plugins.png`](reference/velorix-neon-reference-plugins.png) (реф. 25)
- [x] UI State Showcase — [`velorix-neon-reference-ui-state-showcase.png`](reference/velorix-neon-reference-ui-state-showcase.png) (реф. 26)
- [x] UI Components / States — [`velorix-neon-reference-ui-components.png`](reference/velorix-neon-reference-ui-components.png) (реф. 27)
- [ ] Диагностика — отдельного PNG всё ещё нет
- [ ] Конвертация видео (полный экран без модалки) — на реф. 18 только как фон
- [ ] Timeline: UI NLE vs модель данных (§ реф. 1)
- [ ] Brand: horizontal vs stacked logo по зонам

---

## Анализ референса 2 (`velorix-neon-reference-downloads.png`)

Экран **«Менеджер загрузок»** — отдельная композиция от редактора; тот же NEON, но **другой shell**.

### Layout (3 колонки)

| Колонка | На mockup |
|---------|-----------|
| **Левый sidebar** | Навигация: Обработка, **Загрузки** (active), Терминал, История, Инспектор, Планировщик, Скрипты, Инструменты, Настройки, Справка; внизу GPU (RTX 3090, load/temp sparkline), сеть (↓↑ MB/s), иконки |
| **Центр** | Заголовок + поиск; фильтры (Все / Активные / Завершённые / Ошибки / Пауза) + счётчики; «Старт всех» / «Пауза всех»; **карточки** загрузок (thumb, 4K/H.265 badges, gradient progress, speed, ETA); очередь (2); footer: параллельность, лимит скорости, путь |
| **Правый rail** | Детали выбранной загрузки; статистика за день (42.7 GB, chart 24h); быстрые действия (добавить, из буфера, очистить, настройки) |

### Функции на mockup vs код сегодня

| Вишка на PNG | Velorix сейчас (ориентир) |
|--------------|---------------------------|
| Карточки с thumb + codec badges | Таблица/строки очереди (`DownloadsWorkspaceMainQueueTable`) — плотность и визуал ≠ mockup |
| Фильтры с badge-count (5 / 142 / 3) | Есть status filter chips — без полного набора вкладок как на PNG |
| Правый rail: preview + metadata + chart | `DownloadsSettingsRail` — другой состав секций |
| GPU / network widgets в sidebar | **Нет** в downloads shell |
| Глобальный nav-sidebar (9+ пунктов) | Сейчас topbar + legacy pop-out downloads; цель D — **только** sidebar, **без** pop-out (реф. 2) |
| Sparkline area chart «скорость за 24ч» | **Нет** (или частично в history summary) |

### Связь с NEON / фазами

| Слой | Действие |
|------|----------|
| **Этап 6** | Согласовать downloads с тем же токенами/glow, что редактор (после sign-off 1–5 редактора) |
| **Фаза D** | Трёхколоночный downloads-shell + карточки вместо таблицы (если канон = PNG) |
| **Продукт** | GPU monitor, stats chart, import clipboard — отдельные фичи (IPC/state), не только CSS |

**Вывод:** реф. 2 — целевой **pro download manager**; текущий downloads workspace ближе к **очереди + settings rail**, без левого system sidebar и без карточного списка 1:1.

---

## Анализ референса 3 (`velorix-neon-reference-history.png`)

Экран **«История»** — **глобальный журнал** всех операций (не только загрузки и не только export).

### Layout (как реф. 2: 3 колонки)

| Колонка | На mockup |
|---------|-----------|
| **Левый sidebar** | Тот же класс nav: Обработка, Загрузки, Терминал, **История** (active), Инспектор, Планировщик, Сценарии, …; GPU (RTX 3090, VRAM, load/temp); **CPU / RAM / Disk** gauges |
| **Центр** | Заголовок + поиск (Ctrl+F), «Экспорт истории»; вкладки: Все / Обработка / Загрузки / Сценарии / Система / Ошибки; фильтры (дата, тип, статус); **таблица** (событие, файл, тип-tag, статус Success/Error/Pause, дата, длительность, размер, actions); пагинация 1…49, rows/page |
| **Правый rail** | Donut «1 248 событий» (Processing 41%, Downloads 24%, …); график активности за неделю; блок **последних ошибок**; быстрые действия (очистить >30 дней, CSV, отчёт об ошибках, настройки истории) |

### Функции на mockup vs код сегодня

| Вишка на PNG | Velorix сейчас (ориентир) |
|--------------|---------------------------|
| **Единая** лента всех типов событий | Раздельно: `ProcessingHistoryPanel` (в FFmpeg rail), `DownloadsHistoryPanel` (embedded в downloads) — **нет** отдельного экрана «История» |
| Таблица с типами + цветными status tags | Панели истории — списки/таблицы проще, другой набор колонок |
| Вкладки-фильтры по домену (Processing/Downloads/…) | Частично: outcome filter в downloads history; processing filter в rail |
| Donut + area chart + recent errors | `weeklySummary` в панелях — **без** полноценного dashboard как на PNG |
| Экспорт истории / CSV / отчёт об ошибках | Есть export visible history в панелях — не тот UX |
| Глобальный sidebar + CPU/RAM/Disk | **Нет** |

### Связь с NEON / фазами

| Слой | Действие |
|------|----------|
| **Этап 6** | Общие токены таблиц, tags (success/error/pause), charts |
| **Фаза D** | Отдельный route/вкладка «История» с layout как PNG |
| **Продукт** | Unified event store (processing + downloads + system), пагинация, агрегаты — IPC + модель |

**Вывод:** реф. 3 — **центральный audit log** продукта; сейчас история **встроена** в редактор и загрузки, а не выделена в самостоятельный экран с аналитикой.

---

## Анализ референса 4 (`velorix-neon-reference-planner.png`)

Экран **«Планировщик»** — automation hub: отложенные и повторяющиеся задачи (обработка, архив, upload, отчёты).

### Layout

| Зона | На mockup |
|------|-----------|
| **Левый sidebar** | Nav; **Планировщик** active; GPU + CPU/RAM/Disk (как реф. 2–3) |
| **Верх** | «Создать задачу», «Импорт задач»; вкладки: Расписание / Завершённые / Шаблоны / Календарь / Триггеры / Зависимости; фильтры + диапазон дат + вид «Неделя» |
| **Центр** | Список задач (карточки: иконка, название, cron-like «Ежедневно 08:00», Active) + **week timeline grid** (часы 00–24, цветные блоки по типу задачи, линия «сейчас» 14:32) |
| **Низ** | Detail panel выбранной задачи: описание, next run, параметры (H.265, 4K, путь), Edit / Run now / Disable / Delete |
| **Правый rail** | Мини-календарь июня; **очередь исполнения** (3 active + progress); статистика недели (24 done, bar chart); быстрые действия |

### Функции на mockup vs код сегодня

| Вишка на PNG | Velorix сейчас (ориентир) |
|--------------|---------------------------|
| Полноэкранный планировщик | `WorkflowPlannerDialog` — **модальный** диалог из меню/shell, не отдельная вкладка |
| Week grid + цветные слоты задач | **Нет** calendar/timeline UI |
| Список scheduled tasks с Active | Planner dialog — форма/список сценариев, не mockup 1:1 |
| Очередь исполнения с pause/cancel | Batch/export queue частично; не тот UX |
| Триггеры / зависимости / шаблоны | Help `workflows-planner-scenarios`; UI вкладок **нет** |
| OS scheduler smoke | `workflow-os-scheduler-manual-smoke` — доки/чеклист, не этот экран |

### Связь с NEON / фазами

| Слой | Действие |
|------|----------|
| **Этап 6** | Цвета типов задач (purple/blue/green/orange), grid, progress bars |
| **Фаза D** | Вкладка «Планировщик» в global shell + layout как PNG |
| **Продукт** | Task model, cron, triggers, dependencies, run-now — IPC/main + ТЗ |

**Вывод:** реф. 4 — **целевой task scheduler** уровня «pro automation»; сейчас planner — **диалог workflow**, без week view и без интеграции в nav-sidebar mockup.

---

## Анализ референса 5 (`velorix-neon-reference-knowledge.png`)

Экран **«База знаний»** / **«Справка»** (один экран) — полноценный **Help hub** (не одна статья в модалке).

### Layout

| Зона | На mockup |
|------|-----------|
| **Левый sidebar** | Nav; **База знаний** active; GPU + CPU/RAM/Disk |
| **Верх** | Поиск (Ctrl+K), кнопка **AI-ассистент**; горизонтальные **category pills** со счётчиками |
| **Центр** | Карточки «Популярные статьи»; внутренний список категорий (Обработка видео, Экспорт, …); таблица **Недавно обновлённые** (статья, category tag, дата, просмотры); пагинация |
| **Правый rail** | Превью выбранной статьи: hero-image, метаданные, tags, содержание (TOC), **вложения** (PDF/PNG/JSON), «Открыть статью» / «Поделиться» |

### Функции на mockup vs код сегодня

| Вишка на PNG | Velorix сейчас (ориентир) |
|--------------|---------------------------|
| Полноэкранный каталог Help | `KnowledgeDialog` — **модалка** (lazy), список slug + markdown body |
| Sidebar **Справка** vs заголовок **База знаний** | **Один экран** (реф. 5); отдельный референс «Справка» **не** планируется |
| Поиск Ctrl+K + AI-ассистент | Поиск/навигация в диалоге проще; **AI-кнопки нет** |
| Популярные / недавние / views | Статьи в `Help/**`; метаданные views/рейтинг **не** в UI |
| Category pills + вложенные категории | Категории через slug/Help tree — не mockup 1:1 |
| Превью с TOC + attachments | Диалог показывает markdown; **нет** rail-preview с файлами |
| Share article | **Нет** |

Контент: `Help/en`, `Help/ru`, `knowledge-contract`, deep links из FFmpeg rail — **есть**, оболочка ≠ PNG.

### Связь с NEON / фазами

| Слой | Действие |
|------|----------|
| **Этап 6** | Карточки статей, pills, table, preview rail — те же токены |
| **Фаза D** | Вкладка «База знаний» / «Справка» в global shell (одно имя в UI на выбор) |
| **Продукт** | Search index, analytics (views), AI assist, attachments API — опционально поверх существующего Help |

**Вывод:** реф. 5 — **documentation portal**; сейчас knowledge — **диалог поверх редактора**, без каталога и без AI entry point. **Контент:** `Help/*.md` — переходный слой; целевая модель — не «только markdown» (см. `ARCHITECTURE.md` вспомогательный стек; контент — portal, не только markdown).

---

## Анализ референса 6 (`velorix-neon-reference-settings.png`)

Экран **«Настройки»** — центральная **конфигурация приложения** (не только FFmpeg rail).

### Layout

| Зона | На mockup |
|------|-----------|
| **Левый sidebar** | Nav; **Настройки** active; GPU + CPU/RAM/Disk |
| **Верх** | Импорт / Экспорт / Сброс настроек |
| **Вкладки** | Основные · Производительность · Интерфейс · Обработка · Интеграции · Хранилище · Расширенные |
| **Центр (вкладка «Основные»)** | 6 карточек: язык/тема (**Velorix Dark**, glow ON), поведение (tray, автозапуск, уведомления), рабочие папки `D:\Velorix\…`, **дефолты обработки** (H.265, NVENC, Rec.709, 10-bit), кэш/RAM 16 GB, автосохранение/бэкап |
| **Низ** | Крупный блок Import/Export конфигурации |
| **Правый rail** | О системе v2.1.0; ресурсы (i9, 64 GB, GPU, диски C:/D:); быстрые действия |

### Функции на mockup vs код сегодня

| Вишка на PNG | Velorix сейчас (ориентир) |
|--------------|---------------------------|
| Полноэкранные настройки | `AppSettingsDialog` — **модалка**; секции: general, defaults, dependencies, hotkeys, logs, reset |
| Тема «Velorix Dark» + toggle glow/neon | `dark`/`light` в settings; NEON — отдельная тема/CSS, не все toggles на PNG |
| Дефолты codec/NVENC/deinterlace в settings | Часть в **defaults** + export presets; не 6 карточек как на PNG |
| Рабочие папки Projects/Downloads/Output/Temp | Engine paths + downloads output — **разнесено**, не один экран |
| Кэш 16 GB, GPU optimization, pre-analysis | **Нет** такого UI в AppSettings |
| Import/Export всего конфига | Частично reset/logs; **нет** полного profile import/export |
| Системный rail (CPU, диски) | **Нет** |

### Связь с NEON / фазами

| Слой | Действие |
|------|----------|
| **Этап 1** | Toggle «Glow and neon effects» должен мапиться на `--vn-*` / отключение polish |
| **Этап 6** | Карточки settings, toggles, tabs — общий язык с реф. 2–5 |
| **Фаза D** | Вкладка «Настройки» в global shell |
| **Продукт** | Расширить `settings-contract`, backup, cache limits — IPC/main |

**Вывод:** реф. 6 — **единый control plane** продукта; сейчас настройки — **компактный диалог** с узким набором секций.

---

## Анализ референса 7 (`velorix-neon-reference-scenarios.png`)

Экран **«Сценарии»** — **библиотека automation workflows** (download + encode + batch и т.д.).

### Layout

| Зона | На mockup |
|------|-----------|
| **Левый sidebar** | Nav; **Сценарии** active; GPU + CPU/RAM/Disk |
| **Верх** | Импорт сценария, **+ Новый сценарий**; поиск Ctrl+K; grid/list toggle |
| **Фильтры** | Все (24) · Video · Audio · Subtitles · Export · Custom |
| **Центр** | **Grid 3×3** карточек (иконка, описание, tags, Active/Inactive, last used): YouTube 4K, TikTok batch, H.265 NVENC, … |
| **Низ** | Таблица **Последние выполнения**: сценарий, status (green/orange/red), progress %, время, результат |
| **Правый rail** | Детали выбранного (YouTube 4K Downloader): ID SCN-…, параметры (quality, format, folder, parallel 3), Run/Edit/Duplicate/Export/Delete, статистика (156 runs, 91% success, 2.48 TB) |

### Функции на mockup vs код сегодня

| Вишка на PNG | Velorix сейчас (ориентир) |
|--------------|---------------------------|
| Полноэкранный каталог сценариев | `WorkflowScenarioBuilderDialog` — **модалка** + flow diagram; список в planner dialog |
| Grid карточек + category filters | `EditorWorkflowScenarioSection` в FFmpeg rail — **секция**, не экран |
| Таблица последних run с progress | Processing history repeat — **нет** отдельной таблицы runs на экране сценариев |
| Detail rail: params, stats, Run now | Builder dialog — edit graph; **нет** marketing-style detail panel |
| Import/Export/Duplicate scenario | Workflow JSON в builder; **не** mockup UX |

Модель: `workflow-scenario-contract`, templates, `WorkflowScenarioFlowDiagram` — **есть**; оболочка ≠ PNG.

### Связь с NEON / фазами

| Слой | Действие |
|------|----------|
| **Этап 6** | Карточки сценариев, status colors, progress bars |
| **Фаза D** | Вкладка «Сценарии» в global shell |
| **Продукт** | Scenario run telemetry, catalog API, import pack — поверх workflow engine |

**Вывод:** реф. 7 — **scenario marketplace + ops dashboard**; сейчас сценарии — **builder в диалоге** и узкая секция в export rail.

---

## Анализ референса 8 (`velorix-neon-reference-inspector.png`)

Экран **«Инспектор»** — **медиа-анализ** одного файла (ffprobe + визуализация). **Не путать** с правым **FFmpeg export rail** редактора (NEON этап 5, `velorix-neon-inspector.css` на `EditorFfmpegSettingsRail`).

### Layout

| Зона | На mockup |
|------|-----------|
| **Левый sidebar** | Nav; **Инспектор** active; GPU + CPU/RAM/Disk |
| **Верх** | Открыть файл, Экспорт отчёта; заголовок файла + specs (4K, 23.976, 10-bit H.265) |
| **Вкладки** | Обзор · Видео · Аудио · Потоки · Кадры · Анализ · Метаданные · Журнал |
| **Центр (Обзор)** | Мини-плеер + timecode; основная информация (path, MD5, Premiere…); потоки; анализ кадров; **RGB histogram** + **vectorscope**; полоса **превью кадров** |
| **Правый rail** | Технические детали потоков (H.265 Main 10, BT.2020, AAC…); **инструменты** (QC, битые кадры, субтитры, конверт, скриншоты) |
| **Status** | Готов; очередь 0; CPU/RAM/VRAM |

### Функции на mockup vs код сегодня

| Вишка на PNG | Velorix сейчас (ориентир) |
|--------------|---------------------------|
| Полноэкранный media inspector | Цель D — вкладка **Инспектор** в shell (реф. 8); legacy `#inspector` pop-out — **не** целевой UX |
| Вкладки Обзор/Видео/Потоки/Кадры… | Секции probe panel — **не** 8 вкладок как на PNG |
| Histogram / vectorscope | **Нет** |
| Filmstrip превью кадров | **Нет** (есть snapshot в редакторе) |
| Экспорт отчёта, QC tools | Частично probe copy; **нет** полного набора actions |
| Плеер с timecode в inspector | Preview в **редакторе**; inspector — probe-first |

### Связь с NEON / фазами

| Слой | Действие |
|------|----------|
| **Этап 5 NEON** | Только **export rail** редактора vs реф. 1 — **не** этот PNG |
| **Этап 6 / D** | Стили вкладки «Инспектор» в shell под реф. 8 (не отдельное окно) |
| **Продукт** | Scopes, frame analysis, report export — ffprobe/main расширения |

**Вывод:** реф. 8 — **pro media inspector** в главном shell; pop-out `#inspector` — наследие, не эталон.

---

## Анализ референса 9 (`velorix-neon-reference-terminal.png`)

Экран **«Терминал»** — консоль логов + произвольные команды ffmpeg/yt-dlp (§8 ТЗ).

### Layout

| Зона | На mockup |
|------|-----------|
| **Левый sidebar** | Nav; **Терминал** active; GPU + CPU/RAM/Disk |
| **Центр** | Вкладки: **FFmpeg Logs** · System Console · Live Output · Debug; Clear / Pause / Save; **чёрная** область лога (ffmpeg 6.1.1, progress); внизу поле команды + **Выполнить** |
| **Правый rail** | Настройки терминала: уровень лога, color/timestamp/autoscroll, лимит строк; фильтры (только ошибки, include/exclude); сохранение в `logs/terminal.log` |
| **Status** | Проект, длительность, 4K, FFmpeg, GPU |

### Функции на mockup vs код сегодня

| Вишка на PNG | Velorix сейчас (ориентир) |
|--------------|---------------------------|
| 3-колоночный shell + settings rail | `TerminalWorkspacePanel` — **вкладка** workspace: intro, command, history + hints (**без** правого rail настроек) |
| Вкладки FFmpeg / System / Live / Debug | **Нет** — один поток history |
| Pause / Save log / фильтры / save to file | Частично через terminal store; UI фильтров **≠** PNG |
| IntelliSense CLI (§8 ТЗ) | `terminal-inline-suggest`, `TerminalHintRow` — есть задел |
| «Консоль» на topbar реф. 1 | **= Терминал** (один экран); в коде — вкладка `terminal`; отдельный референс **не** планируется |

### Связь с NEON / фазами

| Слой | Действие |
|------|----------|
| **Этап 6** | Моноширинный лог, neon scroll, rail toggles |
| **Фаза D** | Layout как реф. 9 (центр + rail) |
| **Продукт** | Log tabs, pause buffer, file sink — main/IPC |

**Вывод:** реф. 9 — **pro log console**; сейчас терминал — **функциональная вкладка** без вкладок логов и без rail «Настройки терминала» 1:1.

---

### Этап 1 — VELORIX NEON foundation (design system)

**Статус текста:** зафиксирован дословно (2026-05-23, «1промт»).  
**Эталон:** [`reference/velorix-neon-canonical-reference.png`](reference/velorix-neon-canonical-reference.png) — в сообщении вложен тот же mockup («attached reference image»).

<details>
<summary><strong>Промпт владельца (этап 1) — полный текст</strong></summary>

We are creating a NEW premium visual theme called "Velorix Neon".

The attached reference image is the canonical visual target.
Match its atmosphere, density, glow, gradients, depth and cinematic styling as closely as possible.

CRITICAL:
DO NOT modify backend logic.
DO NOT touch FFmpeg systems.
DO NOT change workflows.
DO NOT rewrite application architecture.
DO NOT redesign layouts yet.

This task is ONLY for creating the visual foundation and theme architecture.

Create:
- complete design token system
- color palette
- gradient system
- glow system
- shadow hierarchy
- typography scale
- spacing system
- border styles
- glass surface system
- animation tokens

STYLE REQUIREMENTS:
- cinematic desktop software
- futuristic workstation
- premium creative application
- deep navy backgrounds
- purple/magenta neon accents
- atmospheric glow
- layered gradients
- bloom lighting
- rich depth hierarchy

AVOID:
- flat UI
- generic SaaS style
- excessive whitespace
- boring minimalism
- gray surfaces
- default shadcn appearance

The final visual system must feel immersive, premium and cinematic.

</details>

**Критерии закрытия этапа:**

- [x] Текст промпта в доке (дословно).
- [ ] Код по промпту + sign-off vs PNG (старый J-1617 — только ориентир, не «закрыто»).
- [ ] `npm run check:quiet` в итерации доработки.
- [ ] Явная команда владельца «делай этап 1» перед правками кода.

---

### Этап 2 — Sidebar + top navigation

**Статус текста:** зафиксирован дословно (2026-05-23, «2 промт»).  
**Эталон:** [`reference/velorix-neon-canonical-reference.png`](reference/velorix-neon-canonical-reference.png) — в сообщении вложен mockup («attached reference image»).

<details>
<summary><strong>Промпт владельца (этап 2) — полный текст</strong></summary>

The attached reference image is the canonical visual target.

Recreate the visual style as closely as possible.

Now redesign ONLY:
- left sidebar
- top navigation bar

DO NOT touch:
- preview area
- timeline
- inspector panel
- backend logic
- application functionality

REQUIREMENTS:
- premium desktop feel
- dense professional layout
- cinematic neon atmosphere
- glowing active states
- layered surfaces
- ambient purple bloom
- subtle gradients
- illuminated borders
- premium icons
- smooth hover animations

IMPORTANT:
DO NOT simplify the interface.
DO NOT make it look like a generic web dashboard.
DO NOT add excessive empty space.

Match the reference image closely.

</details>

**Критерии закрытия этапа:**

- [x] Текст промпта в доке (дословно).
- [ ] Код по промпту + sign-off vs PNG (старый J-1621 — только ориентир).
- [ ] `npm run check:quiet` в итерации доработки.
- [ ] Явная команда владельца «делай этап 2» перед правками кода.
- [ ] В diff этапа 2 **нет** правок preview / timeline / inspector.

---

### Этап 3 — Preview area (centerpiece)

**Статус текста:** зафиксирован дословно (2026-05-23, «3 промт»).  
**Эталон:** [`reference/velorix-neon-canonical-reference.png`](reference/velorix-neon-canonical-reference.png) — в сообщении вложен mockup («attached reference image»).

<details>
<summary><strong>Промпт владельца (этап 3) — полный текст</strong></summary>

The attached reference image is the canonical visual target.

Recreate the visual atmosphere and composition as closely as possible.

Now redesign ONLY the preview area.

DO NOT touch:
- sidebar
- topbar
- timeline
- inspector
- backend logic

REQUIREMENTS:
- cinematic framing
- immersive composition
- ambient purple glow
- premium media controls
- layered shadows
- subtle bloom lighting
- glass-like depth
- modern cinematic presentation
- premium desktop software feeling

The preview area must become the main visual centerpiece.

Avoid flat styling.
Avoid generic video player appearance.
Avoid empty dark spaces.

The result should feel atmospheric and futuristic.

</details>

**Критерии закрытия этапа:**

- [x] Текст промпта в доке (дословно).
- [ ] Код по промпту + sign-off vs PNG (старый J-1622 — только ориентир).
- [ ] `npm run check:quiet` в итерации доработки.
- [ ] Явная команда владельца «делай этап 3» перед правками кода.
- [ ] В diff этапа 3 **нет** правок sidebar / topbar / timeline / inspector.

---

### Этап 4 — Timeline (главная визуальная зона)

**Статус текста:** зафиксирован дословно (2026-05-23, «4 промт»; дубликат с тем же текстом ранее подписан «3промт» — канон: **этап 4**).  
**Эталон:** [`reference/velorix-neon-canonical-reference.png`](reference/velorix-neon-canonical-reference.png) — в сообщении вложен mockup («attached reference image»).

<details>
<summary><strong>Промпт владельца (этап 4) — полный текст</strong></summary>

The attached reference image is the canonical visual target.

Recreate the timeline style as closely as possible.

Now redesign ONLY the timeline section.

This is the MOST important visual area in the application.

DO NOT touch:
- backend logic
- timeline functionality
- export systems
- workflows
- other UI areas

REQUIREMENTS:
- cinematic editing software feel
- glowing playhead
- premium track styling
- layered depth
- illuminated accents
- dense professional appearance
- modern transport controls
- atmospheric gradients
- rich hover interactions
- premium visual hierarchy

The timeline must resemble high-end professional editing software.

AVOID:
- flat tracks
- boring sliders
- generic browser UI
- excessive spacing
- minimalistic web-app appearance

The timeline should feel expensive and immersive.

</details>

**Критерии закрытия этапа:**

- [x] Текст промпта в доке (дословно).
- [ ] Код по промпту + sign-off vs PNG (старый J-1623 — только ориентир).
- [ ] `npm run check:quiet` в итерации доработки.
- [ ] Явная команда владельца «делай этап 4» перед правками кода.
- [ ] В diff этапа 4 **нет** правок sidebar / topbar / preview / inspector.

---

### Этап 5 — Inspector / export settings (правый rail)

**Статус текста:** зафиксирован дословно (2026-05-23, «5промт»).  
**Эталон:** [`reference/velorix-neon-canonical-reference.png`](reference/velorix-neon-canonical-reference.png) — в сообщении вложен mockup («attached reference image»).

<details>
<summary><strong>Промпт владельца (этап 5) — полный текст</strong></summary>

The attached reference image is the canonical visual target.

Match the visual styling closely.

Now redesign ONLY the right inspector/export settings panel.

DO NOT touch:
- backend logic
- export functionality
- layout structure
- other UI sections

REQUIREMENTS:
- compact dense layout
- premium controls
- glowing active states
- elegant dropdown styling
- layered surfaces
- cinematic gradients
- subtle bloom
- premium desktop software feeling
- immersive visual depth

The inspector must feel:
- professional
- futuristic
- visually rich
- atmospheric

Avoid:
- flat form controls
- generic settings UI
- boring dark panels
- excessive empty space

</details>

**Критерии закрытия этапа:**

- [x] Текст промпта в доке (дословно).
- [ ] Код по промпту + sign-off vs PNG (старый J-1624 — только ориентир).
- [ ] `npm run check:quiet` в итерации доработки.
- [ ] Явная команда владельца «делай этап 5» перед правками кода.
- [ ] В diff этапа 5 **нет** правок sidebar / topbar / preview / timeline / layout structure.

---

### Этап 6 — Final polish (весь интерфейс)

**Статус текста:** зафиксирован дословно (2026-05-23, «6 промт»).  
**Эталон:** [`reference/velorix-neon-canonical-reference.png`](reference/velorix-neon-canonical-reference.png) — в сообщении вложен mockup («attached reference image»).

<details>
<summary><strong>Промпт владельца (этап 6) — полный текст</strong></summary>

The attached reference image is the canonical visual target.

Perform a FINAL POLISH PASS across the entire interface.

DO NOT redesign layouts again.
DO NOT modify functionality.
DO NOT change workflows.

ONLY improve:
- visual consistency
- cinematic atmosphere
- glow hierarchy
- gradients
- spacing rhythm
- shadow depth
- hover animations
- bloom lighting
- premium desktop feeling

Add:
- subtle ambient glow
- layered glass effects
- smooth transitions
- cinematic motion
- atmospheric depth
- soft neon illumination

IMPORTANT:
The final result should feel:
- immersive
- futuristic
- premium
- visually unforgettable

Avoid generic SaaS appearance at all costs.

</details>

**Критерии закрытия этапа:**

- [x] Текст промпта в доке (дословно).
- [ ] **Предусловие:** sign-off этапов 1–5 vs PNG (или явное «делай этап 6» с пониманием, что 1–5 ещё не sign-off).
- [ ] Код по промпту + sign-off всего окна vs PNG (старый J-1625 — пересмотреть/пересобрать после 1–5).
- [ ] `npm run check:quiet` в итерации доработки.
- [ ] Не менять layout structure; только визуальная согласованность.

---

## v0 и полный редизайн UI — три слоя

| Слой | Влияет на NEON? | Статус |
|------|-----------------|--------|
| **Канон v0** | Нет | Снят J-1620 |
| **Токены NEON** | Да | Этап 1 |
| **Текущая вёрстка** (topbar + rail справа) | Наследие кода | Фаза D — layout под PNG |

Эталон PNG: **левый sidebar**, центральный плеер, правый rail. Сейчас в коде — **другая сетка**; этапы 2–6 красят её, не заменяют (фаза D).

### Фаза D — кардинальный UI (после этапов 1–6)

- [ ] **D.1** Карта экранов vs PNG.
- [ ] **D.2** Новый shell/layout.
- [ ] **D.3** `.vn-*` / `--fa-neon-*` на все поверхности.
- [ ] **D.4** Удалить мёртвые layout-классы.
- [ ] **D.5** Sign-off vs PNG.

### Workstream'ы Variant A (после синхрона канона)

**Честная метка:** **[x] в журнале J-1633..1667** = маршруты/зачистка кода, **не** визуал 1:1. Активная матрица — [`IMPLEMENTATION_NEON_CHECKLIST.md`](IMPLEMENTATION_NEON_CHECKLIST.md).

- [~] **VA.1** sidebar routes — shell частично; layout refs 1–9 — открыто.
- [~] **VA.2** Tools hub refs 10–20 — не full-screen 1:1.
- [~] **VA.3** System refs 21–25 — диалоги, не 1:1 PNG.
- [~] **VA.4** Showcase 26–27 — эталон компонентов, не весь app.
- [x] **VA.5** Legacy cleanup (pop-out/theme) — снято.

### Cleanup buckets (первый проход)

**Confirmed-remove / confirmed-cleanup**

- ~~stale path references вокруг `scripts/maint/sync-help-workflow-user-footers.mjs`~~ — Help keyboard/inspector copy (**J-1662**);
- ~~stale help/manual/checklist строки, которые продолжают описывать dual-theme или pop-out как целевой UX~~ — первый проход после sprint.5 (**J-1657**);
- хвосты про «нет референса» там, где это уже закрыто рефами 23–27;
- устаревшие формулировки вида «осталась только ручная приёмка», если они конфликтуют с Variant A program.

**Investigate bucket** (закрыт или не блокирует NEON)

- ~~`check-ui-surfaces-guard` hash regression~~ — **J-1658**.
- ~~`theme:tokenize-main-css` maint chain~~ — одноразовые скрипты, оставить в `package.json`.
- ~~packaging/help-smoke duplicates~~ — отдельные домены, не дубли.
- ~~renderer/CSS pop-out copy~~ — sprint.5.
- Дальше по продукту: Phase D, VA «Открытые пробелы» ниже — не агентский pop-out хвост.

### Открытые пробелы Variant A

- [ ] Отдельный экран **Диагностика** — PNG пока отсутствует.
- [ ] **Полноэкранная конвертация видео** — на реф. 18 видна только как фон модалки.
- [ ] Граница между **визуальным NLE-рефом** и реальной моделью данных для реф. 1 (timeline / tracks / clips).
- [ ] Правила применения **horizontal vs stacked logo** по зонам интерфейса и упаковки.

## Ограничения (глобально)

- Backend / FFmpeg / IPC / state / workflows — без явной просьбы владельца.
- Layout / плотность — без фазы D.
- Светлая тема — без NEON.

## Архитектура токенов

```
src/renderer/src/assets/base.css          ← @import themes/velorix-neon/index.css
src/renderer/src/assets/themes/velorix-neon/   (01…12, index.css)
src/renderer/src/assets/themes/
  velorix-neon-chrome.css      ← этап 2
  velorix-neon-preview.css     ← этап 3
  velorix-neon-timeline.css    ← этап 4
  velorix-neon-inspector.css   ← этап 5
  velorix-neon-polish.css      ← этап 6 (последний)
```

**В компонентах:** `var(--fa-*)`; расширение `var(--fa-neon-*)`, `.vn-*`.

## Чеклист (технический — фаза A)

### Фаза A — фундамент (этап 1)

- [x] **A.1**–**A.17** — см. журнал J-1617, J-1619; все пункты токенов закрыты.

### Фаза B — привязка к этапам 2–6 (код залит, sign-off отдельно)

| Пункт | Этап | Файл | Код | Sign-off |
|-------|------|------|-----|----------|
| B.1–B.2 | 2 | `velorix-neon-chrome.css` | [x] | [ ] |
| B.P | 3 | `velorix-neon-preview.css` | [x] | [ ] |
| B.8 | 4 | `velorix-neon-timeline.css` | [x] | [ ] |
| B.I, B.5–B.6 | 5 | `velorix-neon-inspector.css` | [x] | [ ] |
| B.3–B.4, B.7, B.9–B.12, B.F | 6 | `velorix-neon-polish.css` | [x] | [ ] |

**Фаза B не «закрыта»** — закрыт только **кодовый срез** J-1621…1625; визуальный канон — колонка Sign-off и фаза C.

### Фаза C — проверка

- [ ] **C.1** Ручной прогон dark + скриншоты.
- [ ] **C.2** Focus / disabled / danger на железе.
- [ ] **C.3** Сверка с PNG по **каждому** этапу 1–6 (таблица Sign-off выше).
- [ ] **C.4** Help — только по просьбе владельца.
- [ ] **C.5** Help — только по просьбе владельца.

## Токены — шпаргалка

| Группа | Префикс | Пример |
|--------|---------|--------|
| Примитивы | `--vn-color-*` | `--vn-color-magenta-neon` |
| Градиенты | `--vn-gradient-*` | `--vn-gradient-accent-primary` |
| Glow | `--vn-glow-*` | `--vn-glow-accent-medium` |
| Семантика | `--fa-*` | `--fa-accent` |
| NEON | `--fa-neon-*` | `--fa-neon-accent-gradient` |
| Utilities | `.vn-*` | `.vn-surface-glass` |

## Следующий шаг агента

1. **Канон текстов:** **6 / 6** — готово. Код **не** трогать без команды владельца «делай этап N».
2. **Порядок выполнения:** этап **1** → sign-off vs PNG → этап **2** → … → этап **6** (polish **после** sign-off 1–5 или с пересборкой polish).
3. На каждый этап в коде: только зона промпта, одна `J-NNN`, `npm run check:quiet`.

## История файла

| Дата | J | Изменение |
|------|---|-----------|
| 2026-05-22 | J-1617 | Файл создан; фаза A. |
| 2026-05-22 | J-1619 | Эталон PNG в `docs/reference/`. |
| 2026-05-22 | J-1620 | v0 снят с канона. |
| 2026-05-22 | J-1621 | Этап 2 код (chrome). |
| 2026-05-22 | J-1622 | Этап 3 код (preview). |
| 2026-05-23 | J-1623 | Этап 4 код (timeline). |
| 2026-05-23 | J-1624 | Этап 5 код (inspector). |
| 2026-05-23 | J-1625 | Этап 6 код (polish) — **раньше sign-off 2–5**. |
| 2026-05-23 | — | **Процесс:** шесть промптов зафиксированы в § «Шесть промптов»; Sign-off сброшен; снята формулировка «фаза B закрыта». |
| 2026-05-23 | — | **Пересборка канона:** промпт 1 дословно («1промт»); 1/6; код не трогали. |
| 2026-05-23 | — | Промпт 2 дословно («2 промт»); 2/6; код не трогали. |
| 2026-05-23 | — | Промпт 3 дословно («3 промт», preview); 3/6; код не трогали. |
| 2026-05-23 | — | Промпт 4 дословно (timeline; подтверждён «4 промт», ранее тот же текст как «3промт»); 4/6. |
| 2026-05-23 | — | Промпт 5 дословно («5промт», inspector/export rail); 5/6; код не трогали. |
| 2026-05-23 | — | Промпт 6 дословно («6 промт», final polish); **6/6**; канон текстов полный; код — по команде. |
| 2026-05-23 | — | Эталон иконки приложения: `docs/reference/velorix-neon-app-icon-reference.png`, `VELORIX_NEON_APP_ICON_REFERENCE_REL`. |
| 2026-05-23 | — | Эталон логотипа mark+wordmark: `velorix-neon-logo-wordmark-reference.png`, `VELORIX_NEON_LOGO_WORDMARK_REFERENCE_REL`. |
| 2026-05-23 | — | Замена PNG wordmark (исправленный файл владельца; тот же путь `velorix-neon-logo-wordmark-reference.png`). |
| 2026-05-23 | — | Эталон вертикального логотипа: `velorix-neon-logo-stacked-reference.png`, `VELORIX_NEON_LOGO_STACKED_REFERENCE_REL`. |
| 2026-05-23 | — | **Референс 1 (владелец):** замена главного mockup — `velorix-neon-canonical-reference.png` (тот же путь / `VELORIX_NEON_CANONICAL_REFERENCE_REL`). |
| 2026-05-23 | — | Sign-off этапов 1–6 и фазы B **сброшен** под новый canonical; § «Анализ референса 1» (NLE timeline vs код). |
| 2026-05-23 | — | **Референс 2:** `velorix-neon-reference-downloads.png`, `VELORIX_NEON_REFERENCE_DOWNLOADS_REL`; § «Анализ референса 2». |
| 2026-05-23 | — | **Референс 3:** `velorix-neon-reference-history.png`, `VELORIX_NEON_REFERENCE_HISTORY_REL`; § «Анализ референса 3». |
| 2026-05-23 | — | **Референс 4:** `velorix-neon-reference-planner.png`, `VELORIX_NEON_REFERENCE_PLANNER_REL`; § «Анализ референса 4». |
| 2026-05-23 | — | **Референс 5:** `velorix-neon-reference-knowledge.png`, `VELORIX_NEON_REFERENCE_KNOWLEDGE_REL`; § «Анализ референса 5». |
| 2026-05-23 | — | **Референс 6:** `velorix-neon-reference-settings.png`, `VELORIX_NEON_REFERENCE_SETTINGS_REL`; § «Анализ референса 6». |
| 2026-05-23 | — | **Референс 7:** `velorix-neon-reference-scenarios.png`, `VELORIX_NEON_REFERENCE_SCENARIOS_REL`; § «Анализ референса 7». |
| 2026-05-23 | — | **Референс 8:** `velorix-neon-reference-inspector.png`, `VELORIX_NEON_REFERENCE_INSPECTOR_REL`; § «Анализ референса 8» (media inspector ≠ export rail). |
| 2026-05-23 | — | **Референс 9:** `velorix-neon-reference-terminal.png`, `VELORIX_NEON_REFERENCE_TERMINAL_REL`; § «Анализ референса 9». |
| 2026-05-23 | — | **Именование:** Терминал = Консоль (один экран); отдельный реф. «Консоль» не нужен. |
| 2026-05-23 | — | **Именование:** Справка = База знаний (один экран, реф. 5); отдельный реф. «Справка» не нужен. |
| 2026-05-23 | — | **Референсы 10–22:** инструменты, утилиты, модалки, first-run, quit, ffmpeg error — `docs/reference/velorix-neon-reference-*.png`. |
| 2026-05-26 | — | **Референсы 23–27:** critical crash, encoder benchmark, plugins, UI state showcase, UI components — `docs/reference/velorix-neon-reference-*.png`. |
| 2026-05-23 | — | **UX:** pop-out Загрузки/Инспектор не целевой NEON; реф. 2 и 8 только в едином shell. |
| 2026-05-22 | — | **Вариант A:** единственная тема NEON, UI с нуля, удаление legacy dark/light; § «Вариант A — единственный UI NEON». Старт кода — по команде владельца после референсов. |
