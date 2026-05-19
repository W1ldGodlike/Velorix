# Clipboard and drag-and-drop on Downloads

## Automatic clipboard scan

When you open the **Downloads** tab or bring FluxAlloy back to the front, it looks at the clipboard for strings that look like normal **web addresses** (`http://` or `https://`) and may add them to the queue for you. This speeds up work from a browser.

## Drag-and-drop

Drop onto free space on the tab (not directly on the text field):

- text that contains links — addresses are split on spaces and line breaks;
- a plain text file with a list of links;
- a Windows `.url` shortcut — the target address is read.

## Manual paste

You can always paste with **Ctrl+V** while the caret is in the URL field, or use the app menu.

More about the queue — [downloads-workflow.md](downloads-workflow.md). Packaged **ytdlp** after `pack:dir` — [packaged-windows-smoke.md](../packaged-windows-smoke.md); §21 e2e per-step `e2e <id>:` in `releaseSmoke:` — [owner-manual-smoke.md](owner-manual-smoke.md); dev block `terminalHints:` (§8) — [logging-and-diagnostics.md](logging-and-diagnostics.md); Help: `check:help-workflow-smoke-crosslinks` (44 articles).
