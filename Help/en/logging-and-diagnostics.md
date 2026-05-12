# Logs and diagnostics

## Where logs live

Under Electron **`userData`** (on Windows this is usually **`%AppData%\FluxAlloy\`**, then the **`logs`** subfolder):

- **`main.log`** — rolling main-process log (**info / warn / error**, timestamps and scopes).
- **`main.log.1`** — previous segment when **`main.log`** exceeds the size limit (single rotated backup).
- **`session.log`** — per-launch session log for the current run.
- Renderer logs are forwarded through IPC into the same pipeline (rate-limited; control characters stripped).
- **Terminal** tab CLI runs may append to **`terminal-cli.log`** in the same folder.

Use **Help → About** or diagnostics menu actions (e.g. **Open logs folder**) to jump to the directory on disk.

## Support bundle

In **Help → About**, **Create Support ZIP** (wording may match your locale) packs recent logs, crash dumps when present, and a short **`diagnostics.txt`** for support.

## Crash dialog

On uncaught errors in main, a dialog offers **copy details**, **open log**, and **Support ZIP** when applicable.
