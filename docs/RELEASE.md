# FluxAlloy Release Checklist

Практический чеклист перед сборкой и публикацией приватного/внутреннего релиза.

## 1. Чистота репозитория

```powershell
git status
npm run check
npm run build
npm run audit:moderate
```

Полный предрелизный прогон на Windows (включает подготовку `bin/` и `engines:verify-bundled` перед сборкой):

```powershell
npm run check:release
```

`npm run check` включает:

- ESLint;
- TypeScript для main/web/tests;
- Vitest;
- `scripts/check-no-secrets.mjs` по tracked-файлам.

## 2. Runtime-движки

Windows-релиз должен получать проверенные бинарники в `bin/` до упаковки:

- `bin/ffmpeg.exe`
- `bin/ffprobe.exe`
- `bin/yt-dlp.exe`

Бинарники не коммитятся. Для локальной подготовки:

```powershell
npm run engines:prepare:win
```

Перед релизом записать источник, версию и SHA256 в `Data/trusted_hashes.json` и/или во внутренние release notes. Пустой hash допустим для dev, но не для релиза, который нужно воспроизводимо проверять.

После `npm run engines:prepare:win`:

```powershell
npm run engines:verify-bundled
```

Скрипт проверяет наличие непустых `bin/yt-dlp.exe`, `bin/ffmpeg.exe`, `bin/ffprobe.exe` и, если в `windows-x64` заданы непустые строки, сверяет SHA256. Жёсткий режим (все три **exe**-хеша в JSON обязательны и должны совпасть):

```powershell
$env:FLUXALLOY_ENGINES_STRICT = '1'
npm run engines:verify-bundled
```

В `windows-x64` можно задавать хеши архивов FFmpeg (как раньше) и отдельно `ffmpeg.exe` / `ffprobe.exe` для проверки уже извлечённых бинарников (bootstrap, CI, загрузка в `userData/bin` из main).

Заполнить три exe-хеша после свежего `engines:prepare:win`:

```powershell
npm run engines:report-hashes
npm run engines:report-hashes -- --json
```

Второй вариант выводит JSON с ключами `yt-dlp.exe`, `ffmpeg.exe`, `ffprobe.exe` — вручную перенесите значения в `Data/trusted_hashes.json` → `windows-x64`.

## 3. Лицензии движков

См. [`BUNDLED_ENGINES_LICENSES.md`](./BUNDLED_ENGINES_LICENSES.md).

Важно: код FluxAlloy помечен как `UNLICENSED`, но bundled `ffmpeg` / `ffprobe` / `yt-dlp` имеют собственные лицензии. При распространении установщика нужно соблюдать именно их условия.

## 4. Сборки

```powershell
npm run build:unpack
npm run build:win
```

`npm run build:win` формирует NSIS, portable и zip (`electron-builder`: `nsis`, `portable`, `zip`).

Перед публикацией вручную проверить:

- первый запуск на чистом профиле `userData`;
- статус движков внизу окна;
- открытие локального файла;
- короткий yt-dlp download;
- «В редактор» для скачанного файла;
- snapshot кадра;
- ffmpeg export MP4;
- `О программе -> Support ZIP`;
- отсутствие секретов в артефактах и логах.

## 5. GitHub

Репозиторий: `https://github.com/W1ldGodlike/FluxAlloy`.

Перед push:

```powershell
git log --oneline -5
git status
```

После push убедиться, что GitHub Actions `ci` зелёный.

