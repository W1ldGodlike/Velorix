# Terminal hints for ffmpeg / yt-dlp

The **Terminal** tab loads `Data/ytdlp_commands.json` and `Data/ffmpeg_commands.json`. Each entry describes a token, a short description, an example argv string, and a `docUrl` pointing to upstream documentation.

You can extend the JSON without rebuilding: the files ship next to `FluxAlloy.exe` as `Data\*.json`.

## Useful bits

Common ffmpeg tags: `-i`, `-map`, `-c:v copy`, `-ss`, `-t`, hardware encoders `*_nvenc`/`*_amf`/`*_qsv`. For yt-dlp: `-F`, `-f`, networking via `--proxy` and auth with `--cookies` / from browser.

## Built-in scenarios (developers)

Hints for the **Downloads** tab and preview are partly defined in code: `src/shared/terminal-contract.ts` (`summary` / `token` / `fullLine`). After editing Russian `summary` strings (use **допишите ссылку**, not **допишите URL**, and keep the `(поле …)` gloss for `--print-to-file` lines targeting `flux-ytdlp-*.txt`), run **`npm run locales:terminal-summaries-ru`** **twice** until the second run prints **0** replacements and **0** gloss; use **`npm run locales:terminal-flux-pole`** if you only need the field gloss pass. Scripts do **not** modify `fullLine`. Regression coverage lives in `tests/shared/terminal-contract-scenarios.test.ts`.
