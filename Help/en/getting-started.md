# Getting started

**FluxAlloy** helps with two everyday jobs: **download a link** and **reshape a local video** for social apps or an archive.

![Tabs: Editor, Downloads, Terminal (diagram)](assets/workspace-tabs-diagram.svg)

## First steps

1. Open the **Downloads** tab when you work with internet links.
2. Paste addresses (one per line) and add them to the queue.
3. Start a single row or the whole queue — the app calls the downloader for you.

For a file on disk open the **Editor** tab, drop the file on the preview zone, or use **Open**.

## Where to read next

- How tabs fit together — [workspace-tabs.md](workspace-tabs.md)
- Queue and quick actions — [downloads-workflow.md](downloads-workflow.md)
- Preview, timeline, export — [editor-workflow.md](editor-workflow.md) and [ffmpeg-rail-presets.md](ffmpeg-rail-presets.md)
- Using this help window — [knowledge-base-howto.md](knowledge-base-howto.md)
- Theme, language, and Windows scaling — [appearance-language-theme.md](appearance-language-theme.md); full owner smoke checklist — [owner-manual-smoke.md](owner-manual-smoke.md)
- Packaged smoke after build — [packaged-windows-smoke.md](../packaged-windows-smoke.md) (Linux/macOS — sibling articles); §21 e2e **§21 packaged e2e (CI vs owner)** (`appendPackagedManualSmokeE2eAppendixLines`, per-step `e2e <id>:`) in `releaseSmoke:`; Support ZIP also includes `terminalHints:` (§8) — [about-support-logs.md](about-support-logs.md), [logging-and-diagnostics.md](logging-and-diagnostics.md); §19 publish signing (win/linux/mac): [`release-code-signing-roadmap.ts`](../../src/shared/release-code-signing-roadmap.ts) + [`docs/RELEASE.md`](../../docs/RELEASE.md) §4/§4.1/§4.2 — `check:help-packaged-smoke-docs`; Playwright scaffold: `tests/e2e/gui/planned-gui-e2e-steps.ts` (`PLANNED_GUI_E2E_STEP_IDS`, `PLANNED_GUI_E2E_SCENARIOS`, `PLANNED_GUI_E2E_STEP_BY_ID`). Copy/releaseSmoke includes `PLANNED_GUI_E2E_STEP_BY_ID` (registry `note` per step; `formatPackagedGuiE2ePlaywrightPlannedStepByIdDiagnosticLine`). Wiring: `docs/RELEASE.md` — `formatPackagedGuiE2ePlaywrightReleaseWiringHandoffBullet` (after owner-smoke on hardware); Help: `check:help-workflow-smoke-crosslinks` (44 articles; partition: tail 42 + ffmpeg + knowledge, FAQ outside 44).
- Common issues — [faq-troubleshooting.md](faq-troubleshooting.md)
