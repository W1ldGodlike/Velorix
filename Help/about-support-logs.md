# «О программе», журналы и поддержка

## Версия

В диалоге «О программе» видно номер сборки приложения и версии встроенного движка страницы — это помогает при обращении в поддержку.

## Папка журналов

Там же есть переход к **папке журналов**. Файлы небольшие: при необходимости их можно приложить к письму.

## Архив для поддержки

Кнопка **архива** собирает несколько служебных файлов в один zip — удобно отправить целиком, не выбирая вручную.

В `diagnostics.txt` попадают:

- **`ownerManualSmoke:`** — единый пакет владельца (тема, HiDPI, HW, сценарий, спрайт §7.5, мини-плеер §4.3, packaged для вашей ОС, планировщик, Windows shell); канон **ru**, см. [owner-manual-smoke.md](owner-manual-smoke.md) и копирование в **Настройки → Ручной smoke** (при EN UI в буфере — EN-строки из locales).
- **`winPackagedSmoke:`** / **`linuxPackagedSmoke:`** / **`macosPackagedSmoke:`** — packaged-чеклисты (Windows всегда в ZIP; Linux/macOS — при сборке на соответствующей ОС); см. [packaged-windows-smoke.md](packaged-windows-smoke.md), [packaged-linux-smoke.md](packaged-linux-smoke.md), [packaged-macos-smoke.md](packaged-macos-smoke.md).
- **`terminalHints:`** — dev §8 (`terminal-contract-hints-meta`, 35 shards / 1056+833 hints, `check:terminal-contract-hints-shards`, `check:help-terminal-hints-docs` (24 статей), `check:support-bundle-terminal-hints` и прочие guards в `check:quiet`); см. [ffmpeg-terminal-hints.md](ffmpeg-terminal-hints.md) и [logging-and-diagnostics.md](logging-and-diagnostics.md).
- **`releaseSmoke:`** — CI packaged pipeline (`smoke:packaged-release`), `fix:esm-shim` для `electron-vite build` на Linux/CI, реестр §21 e2e и блок **§21 packaged e2e (CI vs owner)** (`appendPackagedManualSmokeE2ePlanLines` — те же строки, что UI **Скопировать** в packaged/owner), per-step `e2e <id>:`, `planned GUI e2e scope`, layout **present/missing** для `dist/win-unpacked/`, `dist/linux-unpacked/`, `FluxAlloy.app`; dev: `check:packaged-e2e-scenarios-registry`, `check:help-workflow-smoke-crosslinks` (44 статьи; partition: tail 42 + ffmpeg + knowledge, FAQ вне 44). §19 build: `fix:esm-shim` / `electron-vite-build-meta.ts` (Linux/CI `npm run build`).

## Временные файлы

Отдельно показывается оценка **временных** данных (превью, незавершённые загрузки вроде `.part` / `.crdownload` / `.aria2`, старые папки ffmpeg temp). Кнопка **«Размер временных»** выводит разбивку по категориям с числом файлов. Очистка идёт в два шага, чтобы случайно не удалить нужное; готовые медиафайлы не удаляются.

## Диагностика

Расширенные сведения о логах и сообщениях программы — [logging-and-diagnostics.md](logging-and-diagnostics.md).
