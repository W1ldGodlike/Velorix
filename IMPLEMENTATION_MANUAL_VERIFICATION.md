# Velorix — ручная проверка (владелец)

**Назначение:** чеклисты только на **реальном железе** (GPU, HiDPI, packaged, NSIS, Проводник). Агент **не** берёт их в «продолжай» / `+` и **не** ставит `[x]` без вашей проверки.

**Связанные артефакты:** [`IMPLEMENTATION_CHECKLIST.md`](IMPLEMENTATION_CHECKLIST.md) (код, CI, guards — те же **N.M.K** по § ТЗ), [`IMPLEMENTATION_JOURNAL.md`](IMPLEMENTATION_JOURNAL.md) (запись: `J-NNN: manual 5.2.3 OK` или `checklist 6.3.2`). **В UI приложения этих списков нет** — только эти файлы; дубль шагов в Support ZIP: `ownerManualSmoke:`.

**Нумерация:** `§.подпункт` = § в [`VELORIX_TZ.md`](VELORIX_TZ.md) и `### §6.3` в чеклисте → здесь **6.3.1** … (ручное на железе). В чеклисте **6.3.1** — код; в этом файле **19.1.1** — NSIS на железе.

**Технические имена в ZIP/guards** (`ownerManualSmoke:`, `hwManualSmoke:`) — для кода; в интерфейсе и здесь — **ручная проверка**.

---

## Реестр разделов

| TZ § | Раздел | Нумерация |
| ---- | ------ | --------- |
| 0 | Финал релиза | **0.1**–**0.5** |
| 3 | Packaged-сборки | **3.1**–**3.4** |
| 5 | Тема + HiDPI | **5.1.x**, **5.2.x** |
| 7.4 | Скачать → обработчик / экспорт | **7.4.1** |
| 7.5 | Спрайт превью | **7.5.1** |
| 10 | Планировщик ОС | **10.1** |
| 11 | Конструктор сценариев | **11.1**–**11.3** |
| 14 | Проводник Windows | **14.1** |
| 16 | HW encode | **16.1.x**, **16.2.x** |
| 19 | Установка / артефакты | **19.1**–**19.4** |
| 21 | Planned GUI e2e | **21.1**–**21.2** |
| 22 | Приёмочные сценарии | **22.1**–**22.2** |

---

## 0. Финал проекта

Ручная приёмка **в конце**; агент не закрывает без вашей проверки.

- [ ] **0.1** §16 + §5: тема, HiDPI, HW (см. **5.x**, **16.x**).
- [ ] **0.2** §3 + §19: packaged win/linux/macos + NSIS (**3.x**, **19.1**).
- [ ] **0.3** §7.5: спрайт на мониторе (**7.5.1**).
- [ ] **0.4** §21: Playwright planned GUI — прогон `test:e2e:gui` с `VELORIX_E2E_APP` (**21.x**).
- [ ] **0.5** §22: сквозные приёмочные сценарии (**22.1**, **22.2**).

---

## 3. Packaged (не CI)

Канон шагов: `locales/*/win-packaged-manual-smoke.json` (и linux/macos) + `ownerManualSmoke:` в Support ZIP. Help: [packaged-windows-smoke.md](Help/ru/packaged-windows-smoke.md), [packaged-linux-smoke.md](Help/ru/packaged-linux-smoke.md), [packaged-macos-smoke.md](Help/ru/packaged-macos-smoke.md).

### 3.1 Общее (все платформы)

- [ ] **3.1.1** Запуск exe/app из unpacked: главное окно, движки, редактор, загрузки, экспорт.
- [ ] **3.1.2** Спрайт §7.5 на packaged-сборке (см. **7.5.1**).
- [ ] **3.1.3** Support ZIP из «О программе» — `ownerManualSmoke:` / `releaseSmoke:` читаемы.
- [ ] **3.1.4** Отдельные `winPackagedSmoke:` / `linuxPackagedSmoke:` / `macosPackagedSmoke:` в ZIP (дубль OK).

### 3.2 Windows (`dist/win-unpacked`)

- [ ] **3.2.1** Полный прогон 11 packaged-шагов (Help `packaged-windows-smoke.md`; CI headless ≠ монитор).
- [ ] **3.2.2** Связка с **19.1** после NSIS-установки (если проверяете installer).

### 3.3 Linux (`linux-unpacked`)

- [ ] **3.3.1** Прогон packaged-шагов на Linux-железе (Help `packaged-linux-smoke.md`).

### 3.4 macOS (`Velorix.app`)

- [ ] **3.4.1** Прогон packaged-шагов на macOS (Help `packaged-macos-smoke.md`).

---

## 5. Тема и HiDPI

Канон: блок **Theme** / **HiDPI** в `ownerManualSmoke:`; Help [appearance-language-theme.md](Help/ru/appearance-language-theme.md). WCAG/токены — CI [x]; здесь только монитор.

### 5.1 VELORIX NEON (единственный UI)

- [ ] **5.1.1** Primary-кнопки и accent-ссылки читаемы в единой NEON-палитре.
- [ ] **5.1.2** Focus Tab на полях, select и кнопках.
- [ ] **5.1.3** Disabled приглушены, но различимы.
- [ ] **5.1.4** Модалки «Настройки» и «О программе» — glass/backdrop без грязного чёрного и без выпадения из NEON-хрома.
- [ ] **5.1.5** Сервис → конструктор/планировщик — узлы и подписи на токенах NEON.
- [ ] **5.1.6** Поверхность `Загрузки` внутри shell согласована с редактором и sidebar/topbar по референсам.
- [ ] **5.1.7** Поверхность `Инспектор` внутри shell согласована с редактором и не выглядит отдельным приложением.
- [ ] **5.1.8** В меню и настройках нет user-facing выбора `dark` / `light` / `system`, а pop-out UX для `Загрузок`/`Инспектора` отсутствует.

**Критерий §5.1:** все **5.1.x** `[x]` + строка в журнале.

### 5.2 HiDPI (масштаб Windows 100–200 %)

- [ ] **5.2.1** Редактор — топбар, превью, таймлайн, rail FFmpeg.
- [ ] **5.2.2** Вкладка «Загрузки» — URL, таблица, нижние панели.
- [ ] **5.2.3** Модалки «Настройки» и «О программе».
- [ ] **5.2.4** Строка состояния и индикатор активности.

**Критерий §5.2:** все **5.2.x** `[x]` + в журнале GPU/масштаб %.

---

## 7.4. Скачать и обработать (§7.4.3)

Код: `openInHandlerOnComplete` + `autoExportAfterOpenInHandler` в rail «Метаданные» загрузок; цепочка `applyYtdlpRowDownloadSuccessActions` → `scheduleAutoExportAfterSuccessfulYtdlpOpen` — [`IMPLEMENTATION_CHECKLIST.md`](IMPLEMENTATION_CHECKLIST.md) **7.4.3** [x].

- [ ] **7.4.1** Короткий URL (тестовый или свой): включить «Открыть в обработчике после успеха» + «Авто-экспорт ffmpeg»; дождаться **Готово** без ручного открытия файла — preview в редакторе, затем прогресс экспорта и файл в истории (`autoExport`).
- [ ] **7.4.2** Повтор с выключенным авто-экспортом: только открытие в preview, без spawn ffmpeg.
- [ ] **7.4.3** (опц.) Полный headless «скачал и перекодировал» без кликов — см. также **22.2**.

---

## 7.5. Спрайт превью

Канон: `locales/*/editor-video-sprite-manual-smoke.json`. Код и offline guard [x] (J-1145..1151).

- [ ] **7.5.1** FFmpeg rail → спрайт: сетка, PTS, сохранение PNG/JPEG на железе.

---

## 10. Планировщик ОС

Код [x] (J-1047..1057). Канон: `locales/*/workflow-os-scheduler-manual-smoke.json`; Support ZIP `workflowOsSchedulerSmoke:`.

- [ ] **10.1** Ручной прогон watch-folder + Task Scheduler / launchd / systemd user timer (`docs/RELEASE.md` §4.3, Help).

---

## 11. Конструктор сценариев

Канон: `locales/*/workflow-scenario-manual-smoke.json` → блок «Scenario builder» в `ownerManualSmoke:`.

- [x] **11.0** Код: add/remove, drag-reorder, drag-and-link → `edges` в JSON (J-1076/1078) — не ручная проверка.
- [ ] **11.1** «Сохранить» / перезагрузка — те же nodes/edges.
- [ ] **11.2** Редактор → «Запустить сценарий» — `workflowScenario` в истории.
- [ ] **11.3** (Опц.) URL-сценарий и watch-folder + OS scheduler (**10.1**).

---

## 14. Проводник Windows

Канон: `locales/*/windows-shell-manual-smoke.json` → блок «Windows shell» (только Win).

- [x] **14.0** Код: контекстное меню, OpenWith, default apps, NSIS (J-1061..1077) — не ручная проверка.
- [ ] **14.1** Прогон: контекстное меню, «Открыть с помощью», «Приложения по умолчанию…» на Win.

---

## 16. Аппаратное ускорение (железо)

Канон: [`src/shared/ffmpeg-hw-manual-smoke-checklist.ts`](src/shared/ffmpeg-hw-manual-smoke-checklist.ts) → `hwManualSmoke:` в ZIP. Argv — CI (`ffmpeg-export-nvenc-vtb-argv-table.test.ts`, `ffmpeg-export-vaapi-linux-argv-table.test.ts`).

### 16.1 Windows — NVENC

- [ ] **16.1.1** Probe: tooltip/статусбар — GPU NVIDIA.
- [ ] **16.1.2** Ручной `h264_nvenc` / `hevc_nvenc`, экспорт 10 с — файл OK; в логе `-hwaccel cuda` + NVENC.
- [ ] **16.1.3** `hw_auto` без тихого отката на libx264.
- [ ] **16.1.4** «Оценить» 15 с: строка NVENC; при наличии — колонка GPU.
- [ ] **16.1.5** Экспорт с vf (hflip/crop): `hwupload_cuda` в цепочке.

### 16.2 Linux — VAAPI

- [ ] **16.2.1** Probe: `h264_vaapi` / `hevc_vaapi` (или подсказка VAAPI).
- [ ] **16.2.2** Ручной `h264_vaapi`, экспорт 10 с — в логе `vaapi` + `hwupload` + кодер.
- [ ] **16.2.3** `hw_auto` выбирает VAAPI до CPU fallback.
- [ ] **16.2.4** `av1_vaapi` — по возможности GPU, иначе N/A в заметке.
- [ ] **16.2.5** «Оценить» на Linux без падения ffmpeg.

**Критерий §16:** все **16.1.x** / **16.2.x** по платформе `[x]` + журнал с GPU/драйвером.

---

## 19. Установка и дистрибуция

Код сборки/verify — [`IMPLEMENTATION_CHECKLIST.md`](IMPLEMENTATION_CHECKLIST.md) §19; здесь только приёмка на машине.

### 19.1 Windows NSIS installer

Сборка: `npm run build:win` / `release:win*`; `installer.nsh`, `verify:win-unpacked` — CI/скрипты [x].

- [ ] **19.1.1** Setup.exe: установка в выбранный каталог, ярлык, запуск приложения.
- [ ] **19.1.2** После install: контекстное меню / OpenWith зарегистрированы (связка с **14.1**).
- [ ] **19.1.3** Uninstall: снятие регистрации shell; поведение `app-data/` (по умолчанию не удалять).
- [ ] **19.1.4** ZIP рядом с установщиком: portable `app-data/` single-root при необходимости.

### 19.2 Артефакты macOS / Linux (сборка владельцем)

- [ ] **19.2.1** macOS: dmg/zip, запуск `.app` (**3.4.1**).
- [ ] **19.2.2** Linux: AppImage/deb/tar, запуск unpacked (**3.3.1**).

### 19.3 Иконка приложения

- [ ] **19.3.1** Иконка в установщике, панели задач и About — не placeholder/default.

### 19.4 Dev и legacy-маршруты

- [ ] **19.4.1** `npm run dev` (Win): основной shell открывается и покрывает `Загрузки`/`Инспектор` без обязательных `#downloads` / `#inspector`; legacy hash-route при наличии помечен как переходный и не нужен для целевого UX.

---

## 21. Planned GUI e2e (Playwright)

Код: `planned-gui-e2e-step-runners.ts` + spec/skip, реестр, guards [x] (J-1594–1595). Help/sync — `npm run sync:help-playwright-paragraphs`.

- [ ] **21.1** `VELORIX_E2E_APP` + packaged: `npm run test:e2e:gui` — 8 шагов (`open-file` … `settings`) на вашем exe.
- [ ] **21.2** Приёмка на железе: сценарии **22.x** (не только green skip в CI).

---

## 22. Приёмочные сценарии

- [ ] **22.1** Локальный файл → preview → экспорт/отмена → открыть файл / папку / вернуть в preview / копировать путь (packaged или dev).
- [ ] **22.2** URL → yt-dlp → открыть/показать файл → (опц.) авто-экспорт ffmpeg; полный headless «скачал и перекодировал» — по возможности.
