# Velorix — чеклист NEON (активный)

**Навигатор срезов:** [`VELORIX_NEON_THEME.md`](VELORIX_NEON_THEME.md) (анализ PNG, Phase D, открытые пробелы).

**«продолжай» / `+`:** (1) задача в чате → (2) **`## Ближайший TODO спринта`** → (3) матрица **refs 1–27** и Phase D ниже. **Запрещено:** [`docs/archive/`](archive/).

**Хроника:** [`IMPLEMENTATION_JOURNAL.md`](../IMPLEMENTATION_JOURNAL.md). **Правила:** [`.cursor/rules/velorix-checklist.mdc`](../.cursor/rules/velorix-checklist.mdc), legacy — удалять (глоссарий «Удаление мешающего legacy»).

---

## UI ZERO REBUILD (2026-05-27)

**Смысл:** «zero» = **сброс галочек** визуального sign-off, не удаление этого чеклиста. Renderer снят с диска (`main.tsx` очищает `#root`); main/preload/IPC **сохранены**. Канон PNG — [`VELORIX_NEON_THEME.md`](VELORIX_NEON_THEME.md).

---

## Что видно в `npm run dev` сейчас (UI ZERO)

| Слой | Факт |
| ---- | ---- |
| **Окно** | Одно `BrowserWindow`; тёмный фон; **нет** продуктового React UI. |
| **Renderer** | `npm run dev` → `#ref1` NeonShell (default); `#ref27` / `#ref26` kit; sidebar GPU panel. |
| **Main/preload** | IPC, ffmpeg, yt-dlp, workflow — **сохранены**. |
| **Refs 1–27** | PNG в `docs/reference/`; **ни один** экран не сверен 1:1 с кодом. |

**Вывод:** backend ≠ UI. Пересборка — sprint `neon.*` и матрица refs ниже.

## Стратегия burn-down UI (канон; refs = единственная истина)

**Смысл:** старый shell (topbar-grid, правый FFmpeg-rail, bridge-карточки, modal-first маршруты) **мешает** — **удалять по мере** появления экрана по PNG, **не** держать параллельно «на всякий случай».

| Слой | Действие |
| ---- | -------- |
| **PNG refs 1–27** | Единственный визуальный и UX канон. |
| **Layout/CSS/компоненты** старой сетки | **Удалить** после (или вместе с) заменой на ref; **запрещено** «подкрасить» legacy. |
| **IPC, stores, ffmpeg/yt-dlp, workflow logic** | **Сохранить**; переподключить к новым компонентам. |
| **Bridge** (`workspaceRouteBridge*`) | Временный; **снять** при первом ref экрана. |
| **Модалки** вместо full-screen PNG | Заменить route-surface; старый dialog UI — **удалить**. |

**Порядок:** **D.2** новый `NeonShell` (sidebar + center + right rail) → **ref.27/26** → **ref.1** → остальные refs → **X.4** motion → вычистка `main.css` / topbar / `app-editor-*` legacy.

**Запрещено:** сравнивать с LosslessCut/StaxRip как целевой UX; упоминать как канон (только «удалённый legacy trim-UI», если нужно в J).

## Оценка готовности NEON UI (не путать с backend)

| Область | ~% | Комментарий |
| ------- | -- | ----------- |
| Токены / тема в renderer | **~25** | `velorix-neon/*` + `ref27-showcase*.css`; kit ~28 карточек; sign-off PNG — нет. |
| Shell layout (Phase D.2) | **~24** | `NeonShell` + ref.1 center tabs (Редактор/Загрузки/Консоль); sign-off PNG — нет. |
| Визуал экранов refs **1–9** | **~40** | ref.1/8 IPC probe; ref.5 Help IPC; 2–10 bootstrap; sign-off PNG — нет. |
| Модалки / утилиты refs **10–25** | **~35** | modals 11, 18–23 + tools full-screen 12–17, 24–25; sign-off PNG — нет. |
| Showcase refs **26–27** | **0** | Только PNG. |
| Функционал «вишек» с PNG | **0** | Backend отдельно; UI не сверен. |
| Motion / анимации | **0** | После layout 1:1. |
| **Итого UI** | **0** | UI ZERO REBUILD. |

---

## Легенда матрицы

Колонки **Shell** / **Layout** / **Функц.** / **Motion** — отдельно; `[x]` только при **sign-off vs PNG** (или тест + скрин в J).

- **Shell** — пункт sidebar + full-screen surface (не pop-out / не чужой layout).
- **Layout** — композиция 1:1 с `docs/reference/*.png` (плотность, rails, карточки).
- **Функц.** — элементы PNG, которых нет в коде (AI, week grid, NLE clips, …).
- **Motion** — переходы, hover, loading, panel animations для этого экрана.

---

## Ближайший TODO спринта

**Правило:** **3–7** пунктов, ≤ **220** символов. Детали — матрица refs ниже.

- [ ] **neon.1** **ref.27** — примитивы 1:1 `velorix-neon-reference-ui-components.png`; tokens CSS в renderer.
- [ ] **neon.2** **ref.26** — состояния 1:1 showcase PNG.
- [~] **neon.3** **ref.1** — bootstrap shell+processing в `#ref1`; sign-off canonical PNG — нет.
- [~] **neon.4** **refs 2–4** — ref.2 queue IPC в shell; history/planner bootstrap; sign-off PNG — нет.
- [~] **neon.5** Motion-pass v1 — `neon-motion-v1.css`; polish hover/glow — нет.

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
- [~] **X.3** Единый modal chrome — `SystemModals` refs 11, 18–23 bootstrap; refs 12–17, 24–25 full-screen в tools; sign-off PNG — нет.
- [ ] **X.4** **Motion system:** duration/easing tokens; hover glow; route transition; reduced-motion.
- [ ] **X.5** GPU/CPU/RAM виджеты в sidebar как на PNG (если в scope).
- [~] **X.6** Ctrl+K `CommandPalette` — навигация, open media, modals; polish vs PNG — нет.
- [ ] **X.7** Типографика / плотность / spacing scale 1:1 с ref.27.

## Workstreams VA — переклассификация

**Было [x] в журнале = код/маршруты, не визуал.**

- [ ] **VA.1** Routes — журнал J-1633..1640 **не** sign-off; UI ZERO.
- [~] **VA.2** Tools hub refs 10–17, 24–25 — bootstrap full-screen; sign-off PNG — нет.
- [ ] **VA.3** System refs 21–25 — UI ZERO.
- [ ] **VA.4** Showcase 26–27 — UI ZERO.
- [x] **VA.5** Pop-out/theme cleanup (**J-1651..1667**) — legacy снят.

## Фаза B/C (CSS этапы 2–6) — код ≠ готово

| Этап | CSS | Код | Sign-off PNG |
| ---- | --- | --- | ------------ |
| 2 chrome | `velorix-neon-chrome.css` | [ ] | [ ] |
| 3 preview | `velorix-neon-preview.css` | [ ] | [ ] |
| 4 timeline | `velorix-neon-timeline.css` | [ ] | [ ] |
| 5 inspector | `velorix-neon-inspector.css` | [ ] | [ ] |
| 6 polish | `velorix-neon-polish.css` | [ ] | [ ] |

- [ ] **C.1–C.3** Ручная сверка этапов 2–6 и refs 1–27 vs PNG.

---

## Матрица refs 1–27 (основная работа)

PNG: `docs/reference/`. Анализ: NEON § «Анализ референса N».

| Ref | Экран / поверхность | Shell | Layout | Функц. | Motion |
| --- | ------------------- | ----- | ------ | ------ | ------ |
| 1 | Обработка (canonical) | [ ] | [ ] | [ ] | [ ] |
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
- [x] **snap.3** Vitest **234** test files / **1794** tests (2026-05-27, post UI ZERO purge).
- [x] **snap.4** `audit-manifest` **1156** файлов.
- [x] **snap.5** Help 44 workflow; guards OK.
- [ ] **snap.6** **NEON UI 0%** — UI ZERO REBUILD; backend отдельно.

## Вспомогательный стек

[`ARCHITECTURE.md`](ARCHITECTURE.md) § «Вспомогательный стек».

## Журнал

Только [`IMPLEMENTATION_JOURNAL.md`](../IMPLEMENTATION_JOURNAL.md).
