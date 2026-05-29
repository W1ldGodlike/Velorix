# Velorix — чеклист NEON (активный)

**Навигатор срезов:** [`VELORIX_NEON_THEME.md`](VELORIX_NEON_THEME.md) (анализ PNG, Phase D, открытые пробелы).

**«продолжай» / `+`:** **только [Задача №1](#задача-1--ui-11-по-png)** → активный срез в **`## Ближайший TODO спринта`** → матрица refs. **Запрещено:** IPC/фичи/другие sprint до sign-off UI. **Запрещено:** [`docs/archive/`](archive/).

**Хроника:** [`IMPLEMENTATION_JOURNAL.md`](../IMPLEMENTATION_JOURNAL.md). **Правила:** [`.cursor/rules/velorix-checklist.mdc`](../.cursor/rules/velorix-checklist.mdc), legacy — удалять (глоссарий «Удаление мешающего legacy»).

---

## Задача №1 — UI 1:1 по PNG (блокер продукта)

**Статус:** **в работе** (владелец, 2026-05-28). **Пока не выполнена — ничего другого не делать** (ни NEON-фич, ни «улучшений» UX вне refs).

| Правило | Деталь |
| ------- | ------ |
| **Канон** | `docs/reference/*.png` — **идентично** layout, плотность, цвет, glow, rails (допуск: подписи mockup vs `ui-text`). |
| **Функции** | Кнопки/поля **без** backend — **ок**; пустышки помечать disabled/декор. |
| **Сверка** | Владелец: `npm run dev` без настроек. Агент: overlay/capture в CI; sign-off по PNG. |
| **Авто-setup** | После rebuild: bootstrap NEON; сейчас stub renderer. |
| **Sign-off** | `[x]` в матрице refs **только** после overlay ≈ 0 или скрин в J. |
| **Порядок срезов** | `ui.1` ref.27→26 → `ui.2` ref.1 → `ui.3` refs 2–9 → `ui.4` 10–25 → `ui.5` 26–27 + motion. |

**Охват:** **все** `docs/reference/*.png` (refs **1–27** + логотипы/иконка). **ref.1** в sprint — только **порядок работ**, не «единственный экран».

**Активный срез:** **ui.2** ref.1 — layout vs PNG sign-off (dev overlay HUD на ref.1); **ui.3** refs 2–9 polish complete (sign-off `[ ]`). Детали: [`VELORIX_NEON_THEME.md`](VELORIX_NEON_THEME.md).

---

## UI PURGE v3 — выполнен (2026-05-28)

**Статус:** ui.1 в работе — `assets/neon/` токены + dev kit `#` ref.27 / `#ref26`; `RENDERER_STATE_APPROACH = 'none'`; матрица refs 1–27 — **все `[ ]`** (sign-off только vs PNG).

**Запрещено** без явной просьбы владельца: `git revert` / `git restore` / `checkout` удалённого renderer/locales.

### Исключения / cross-cutting chrome (все refs)

| Элемент | Решение |
| ------- | ------- |
| Footer сайдбара (2× settings + power) | **Не в каноне** — не верстаем |
| ─ / ✕ | **Обязательны** на каждом ref (`NeonWindowChrome` при rebuild) |
| □ maximize, app menu, OS title bar | **Нет** |
| ref.1 PNG | Chrome вне сравнения overlay до обновления PNG |

### После rebuild

1. ref.27→26 токены → `NeonWindowChrome` + px-shell → refs 1–27 → IPC вертикальными срезами → новые `locales`/ui-text с PNG.
2. `dev:capture-ui` — **новая** команда после rebuild (старая удалена).

---

## UI ZERO / PURGE v2 — архив смысла

Не использовать как навигатор; факты выше (**PURGE v3**).

---

## Что видно в `npm run dev` сейчас (post PURGE v3)

| Слой | Факт |
| ---- | ---- |
| **Окно** | Frameless; на весь workArea; только ─ и ✕ (**J-1807**). |
| **Renderer** | ui.2 в работе: default **ref.1** + `#ref27`/`#ref26`; `NeonWindowChrome` (─ ✕); **не** sign-off. |
| **Main/preload** | Backend + survival IPC (shell/log/quit). |
| **Refs 1–27** | PNG на диске; матрица sign-off ниже — **все `[ ]`**. |

## Стратегия rebuild UI (канон; refs = единственная истина)

**Смысл:** старый shell (topbar-grid, правый FFmpeg-rail, bridge-карточки, modal-first маршруты) **мешает** — **удалять по мере** появления экрана по PNG, **не** держать параллельно «на всякий случай».

| Слой | Действие |
| ---- | -------- |
| **PNG refs 1–27** | Единственный визуальный и UX канон. |
| **Layout/CSS/компоненты** старой сетки | **Удалить** после (или вместе с) заменой на ref; **запрещено** «подкрасить» legacy. |
| **IPC, stores, ffmpeg/yt-dlp, workflow logic** | **Сохранить**; переподключить к новым компонентам. |
| **Bridge** (`workspaceRouteBridge*`) | Временный; **снять** при первом ref экрана. |
| **Модалки** вместо full-screen PNG | Заменить route-surface; старый dialog UI — **удалить**. |

**Порядок:** **ui.1** ref.27→26 (токены) → **NeonWindowChrome** + px-shell → **ui.2** ref.1 → refs 2–27 → **X.4** motion.

**Запрещено:** сравнивать с LosslessCut/StaxRip как целевой UX; упоминать как канон (только «удалённый legacy trim-UI», если нужно в J).

## Оценка готовности NEON UI (не путать с backend)

**После PURGE v3:** в renderer **нет** кода экранов — все строки **0%** до sign-off по PNG. **Запрещено:** ставить ~25% / ~45% / «фундамент есть» без `[x]` в матрице.

| Область | ~% | Комментарий |
| ------- | -- | ----------- |
| Токены / тема в renderer | **0** | Rebuild: `src/renderer/src/assets/neon/` + ref.27→26. |
| Shell layout (Phase D.2) | **0** | Rebuild: NeonWindowChrome + px-shell. |
| Визуал экранов refs **1–9** | **0** | Только PNG; матрица `[ ]`. |
| Модалки / утилиты refs **10–25** | **0** | Только PNG; матрица `[ ]`. |
| Showcase refs **26–27** | **0** | Только PNG. |
| Функционал «вишек» с PNG | **0** | Backend отдельно; UI не сверен. |
| Motion / анимации | **0** | После layout 1:1. |
| **Итого UI** | **0** | post PURGE v3; **snap.6** ниже. |

---

## Легенда матрицы

Колонки **Shell** / **Layout** / **Функц.** / **Motion** — отдельно; `[x]` только при **sign-off vs PNG** (или тест + скрин в J).

- **Shell** — пункт sidebar + full-screen surface (не pop-out / не чужой layout).
- **Layout** — композиция 1:1 с `docs/reference/*.png` (плотность, rails, карточки).
- **Функц.** — элементы PNG, которых нет в коде (AI, week grid, NLE clips, …).
- **Motion** — переходы, hover, loading, panel animations для этого экрана.

---

## Ближайший TODO спринта

**Правило:** **3–7** пунктов, ≤ **220** символов. **Блокер:** пока UI ≠ PNG 1:1 — **только** вёрстка refs; IPC/фичи — после sign-off.

- [ ] **ui.1** **ref.27→26** — shell 31 секций; layout 1:1 vs PNG; motion X.4 на `.vn-*`.
- [ ] **ui.2** **ref.1** — mock-shell + center summary, clip/rail/timeline hovers; dev `velorixref` overlay HUD (`?refOverlayFit=`); sign-off vs PNG владельца.
- [ ] **ui.3** **refs 2–9** — ref.2–9 polish complete (scroll, summary, sticky foot, statusbar, hovers); sign-off vs PNG all `[ ]`.
- [ ] **ui.4** **refs 10–25** — ref.10–25 polish complete (portal 3-col, scroll, sticky, status rows); PNG sign-off `[ ]` all.
- [ ] **ui.5** **refs 26–27** — shell есть; sign-off showcase PNG в J.

---

## Phase D — кардинальный UI

- [ ] **D.1** Таблица ниже сверена с `VELORIX_NEON_REFERENCE_SCREEN_RELS` + [`reference/README.md`](reference/README.md).
- [ ] **D.2** `AppShell` / layout: **левый** nav, **центр**, **правый** rail (как PNG); удалить наследие topbar-only grid.
- [ ] **D.3** Все поверхности на `.vn-*` / `--fa-neon-*` (без старых theme-веток).
- [ ] **D.4** Удалить мёртвые layout/CSS/components (глоссарий удаления legacy).
- [ ] **D.5** Sign-off **каждого** ref **1–27** (скрин vs PNG в J или владелец).

## Cross-cutting (все экраны)

- [ ] **X.1** Brand: horizontal/stacked logo по зонам (sidebar, about, splash).
- [ ] **X.2** Иконка app ↔ `resources/icon.png` ↔ ref app-icon.
- [ ] **X.3** Modals — ref.11 about+engines; единый modal chrome.
- [ ] **X.4** **Motion system:** duration/easing tokens; hover glow; route transition; reduced-motion.
- [ ] **X.5** Sidebar GPU — rings по PNG; IPC после layout.
- [ ] **X.6** Ctrl+K — palette по PNG; IPC после layout.
- [ ] **X.7** Типографика / плотность / spacing scale 1:1 с ref.27.

## Workstreams VA — переклассификация

**Было [x] в журнале = код/маршруты, не визуал.**

- [ ] **VA.1** Routes — журнал J-1633..1640 **не** sign-off; UI ZERO.
- [ ] **VA.2** Tools hub refs 10–17, 24–25 — full-screen 1:1 vs PNG.
- [ ] **VA.3** System refs 21–25 — modals 1:1 vs PNG.
- [ ] **VA.4** Showcase 26–27 — 1:1 vs PNG.
- [x] **VA.5** Pop-out/theme cleanup (**J-1651..1667**) — **инфра/legacy**, не sign-off UI.

## Фаза B/C (CSS этапы 2–6) — rebuild после PURGE v3

| Этап | CSS (цель) | Код | Sign-off PNG |
| ---- | ---------- | --- | ------------ |
| 2 chrome | `neon/chrome.css` (новый путь) | [ ] | [ ] |
| 3 preview | `neon/preview.css` | [ ] | [ ] |
| 4 timeline | `neon/timeline.css` | [ ] | [ ] |
| 5 inspector | `neon/inspector.css` | [ ] | [ ] |
| 6 polish | `neon/polish.css` | [ ] | [ ] |

- [ ] **C.1–C.3** Ручная сверка этапов 2–6 и refs 1–27 vs PNG.

---

## Матрица refs 1–27 (основная работа)

PNG: `docs/reference/`. Анализ: NEON § «Анализ референса N».

| Ref | Экран / поверхность | Shell | Layout | Функц. | Motion |
| --- | ------------------- | ----- | ------ | ------ | ------ |
| 1 | Обработка / редактор (`velorix-neon-reference-processing.png`) | [ ] | [ ] | [ ] | [ ] |
| 2 | Загрузки | [ ] | [ ] | [ ] | [ ] |
| 3 | История + аналитика | [ ] | [ ] | [ ] | [ ] |
| 4 | Планировщик (week grid) | [ ] | [ ] | [ ] | [ ] |
| 5 | База знаний (portal) | [ ] | [ ] | [ ] | [ ] |
| 6 | Настройки (карточки) | [ ] | [ ] | [ ] | [ ] |
| 7 | Сценарии (grid + runs) | [ ] | [ ] | [ ] | [ ] |
| 8 | Инспектор медиа | [ ] | [ ] | [ ] | [ ] |
| 9 | Терминал / консоль | [ ] | [ ] | [ ] | [ ] |
| 10 | Инструменты (hub) | [ ] | [ ] | [ ] | [ ] |
| 11 | О программе | [ ] | [ ] | [ ] | [ ] |
| 12 | Обслуживание файлов | [ ] | [ ] | [ ] | [ ] |
| 13 | Конвертация изображений | [ ] | [ ] | [ ] | [ ] |
| 14 | Генератор шума/тишины | [ ] | [ ] | [ ] | [ ] |
| 15 | Слайдшоу | [ ] | [ ] | [ ] | [ ] |
| 16 | Конструктор сценариев | [ ] | [ ] | [ ] | [ ] |
| 17 | Внешний script-filter | [ ] | [ ] | [ ] | [ ] |
| 18 | Имя пресета экспорта | [ ] | [ ] | [ ] | [ ] |
| 19 | Пути к движкам | [ ] | [ ] | [ ] | [ ] |
| 20 | Первый запуск / движки | [ ] | [ ] | [ ] | [ ] |
| 21 | Закрыть Velorix? | [ ] | [ ] | [ ] | [ ] |
| 22 | Ошибка FFmpeg | [ ] | [ ] | [ ] | [ ] |
| 23 | Критический сбой | [ ] | [ ] | [ ] | [ ] |
| 24 | Бенчмарк кодеров | [ ] | [ ] | [ ] | [ ] |
| 25 | Плагины | [ ] | [ ] | [ ] | [ ] |
| 26 | UI State Showcase | [ ] | [ ] | [ ] | [ ] |
| 27 | UI Components / States | [ ] | [ ] | [ ] | [ ] |

### Открытые продуктовые пробелы (нет PNG или scope TBD)

- [ ] **Диагностика** — отдельный full-screen (PNG TBD).
- [ ] **ref.1** NLE tracks/clips vs legacy trim-only editor — решение владельца + IPC; старый editor UI удалить после ref.1 layout.
- [ ] **ref.5** Help portal: search index, AI entry, attachments (не только `Help/*.md`).
- [ ] **ref.18** Полноэкранная конвертация видео (на PNG только фон модалки).

---

## Порядок реализации (рекомендуемый)

1. **D.2** shell-grid → **ref.27** компоненты → **ref.26** states → **ref.1** → **refs 2–9** по приоритету продукта.
2. **refs 10–17** утилиты full-screen.
3. **refs 11, 18–25** modals/system — единый chrome (**X.3**).
4. **Motion** (**X.4**) после layout 1:1 каждого экрана или волнами.
5. **Функц.** колонка — отдельные срезы (не блокировать чистый UI).

**Запрещено:** ставить `[x]` на **Layout** без сравнения с PNG.

---

## Снимок инфраструктуры (snap.*)

- [x] **snap.1** Electron + TS + single-NEON; pop-out снят.
- [x] **snap.2** `npm run check:quiet` зелёный.
- [x] **snap.3** Vitest **247** test files / **1794** tests (NEON ref shell tests 1–27).
- [x] **snap.4** `audit-manifest` **791** файлов.
- [x] **snap.5** Help 44 workflow; guards OK.
- [ ] **snap.6** **NEON UI 0%** — UI ZERO REBUILD; backend отдельно.

## Вспомогательный стек

[`ARCHITECTURE.md`](ARCHITECTURE.md) § «Вспомогательный стек».

## Журнал

Только [`IMPLEMENTATION_JOURNAL.md`](../IMPLEMENTATION_JOURNAL.md).
