# How to use the help

Open the window with the **“?”** button in the top-right. The left side lists articles and search; the right side shows the article.

## Language

Article language follows the app interface language (Russian or English). Change the interface language in settings and open help again — titles and body load from separate files, without mixing two languages in one page.

## Pictures

Illustrations live under `Help/assets`. In Markdown use only this form:

`![Short caption](assets/file-name.png)`

Bundled UI diagrams: `workspace-tabs-diagram.svg`, `downloads-queue-overview.svg`, `editor-preview-timeline.svg`, `knowledge-dialog-toc.svg` (see `assets/README.txt`).

When you open an article, the app **inlines** small files (up to ~512 KiB) as embedded image data so diagrams work in dev and in packaged builds. The caption appears if the image cannot load.

## Links

Blue buttons jump to other in-app articles. Links that start with `https` open in your external browser.

## Theme and display scale

See [appearance-language-theme.md](appearance-language-theme.md) and [owner-manual-smoke.md](owner-manual-smoke.md) for checklists in **Settings → General** (theme, HiDPI) and the full **Owner manual smoke** bundle for Support ZIP. New users can start from [getting-started.md](getting-started.md).

## Packaged smoke and §21 e2e

Workflow articles (editor, downloads, ffprobe, planner) link to [packaged-windows-smoke.md](../packaged-windows-smoke.md) and Linux/macOS siblings. Support ZIP `releaseSmoke:` includes win/linux/macos layout and per-step `e2e <id>:`; dev block `terminalHints:` (§8, 24 Help articles) — [logging-and-diagnostics.md](logging-and-diagnostics.md), [about-support-logs.md](about-support-logs.md). Dev: `npm run check:help-workflow-smoke-crosslinks` (44 articles; partition: tail 42 + ffmpeg + knowledge, FAQ outside 44), `npm run check:help-terminal-hints-docs`. §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`; Playwright scaffold: `tests/e2e/gui/planned-gui-e2e-steps.ts` (`PLANNED_GUI_E2E_STEP_IDS`, `PLANNED_GUI_E2E_SCENARIOS`, `PLANNED_GUI_E2E_STEP_BY_ID`). Copy/releaseSmoke includes `PLANNED_GUI_E2E_STEP_BY_ID` (registry `note` per step; `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`). Wiring: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet` (after owner-smoke on hardware). UiHintSuffix: `formatPackagedGuiE2ePlaywrightUiHintSuffix` (4 settings + `aboutSupportZipDiagnosticsSectionsHint`; `check:owner-visual-smoke-locale`, `check:support-bundle-terminal-hints`).

## Tables

The help viewer **does not** render Markdown pipe tables. For “shortcut → action” style content, use a **bullet list** and bold the first part, for example: `- **Ctrl+O** — open a file…`
