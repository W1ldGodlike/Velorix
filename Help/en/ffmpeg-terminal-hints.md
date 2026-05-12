# Terminal hints for ffmpeg / yt-dlp

The **Terminal** tab loads `Data/ytdlp_commands.json` and `Data/ffmpeg_commands.json`. Each entry describes a token, a short description, an example argv string, and a `docUrl` pointing to upstream documentation.

You can extend the JSON without rebuilding: the files ship next to `FluxAlloy.exe` as `Data\*.json`.

## Useful bits
Common ffmpeg tags: `-i`, `-map`, `-c:v copy`, `-ss`, `-t`, hardware encoders `*_nvenc`/`*_amf`/`*_qsv`. For yt-dlp: `-F`, `-f`, networking via `--proxy` and auth with `--cookies` / from browser.
