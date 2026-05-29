# Terminal hints for ffmpeg / yt-dlp

For everyday use you only need to know: the **Terminal** tab suggests safe argv fragments, shows an example, and can open upstream docs in a browser. The sections below are for people who edit the bundled data files or scenario code.

The **Terminal** tab loads `Data/ytdlp_commands.json` and `Data/ffmpeg_commands.json`. Each entry describes a token, a short description, an example argv string, and a `docUrl` pointing to upstream documentation. The hint catalog’s **Scenarios** chip lists only built-in lines with `fullLine`, not JSON tokens.

You can extend the JSON without rebuilding: the files ship next to `Velorix.exe` as `Data\*.json`.

## Useful bits

Common ffmpeg tags: `-i`, `-map`, `-c:v copy`, `-ss`, `-t`, hardware encoders `*_nvenc`/`*_amf`/`*_qsv`. For yt-dlp: `-F`, `-f`, networking via `--proxy` and auth with `--cookies` / from browser.

## Built-in scenarios (developers)

Hints for the **Downloads** tab and preview live in shards `src/shared/terminal-contract-hints-*.ts` (canonical **`terminal-contract-hints-meta`**: 14 downloads + 8 preview shards (22 files), 839+465 hints; `npm run check:terminal-contract-hints-shards`). The barrel is `src/shared/terminal-contract.ts` (`summary` / `token` / `fullLine`). After editing Russian `summary` strings (use **допишите ссылку**, not **допишите URL**, and keep the `(поле …)` gloss for `--print-to-file` lines targeting `velorix-ytdlp-*.txt`), run **`npm run locales:terminal-summaries-ru`** **twice** until the second run prints **0** replacements and **0** gloss; use **`npm run locales:terminal-velorix-pole`** if you only need the field gloss pass. Scripts do **not** modify `fullLine`. Regression coverage lives in `tests/shared/terminal-contract-scenarios.test.ts`.

Support ZIP diagnostics — [logging-and-diagnostics.md](logging-and-diagnostics.md).

## See also

[about-support-logs.md](about-support-logs.md) · [logging-and-diagnostics.md](logging-and-diagnostics.md).
