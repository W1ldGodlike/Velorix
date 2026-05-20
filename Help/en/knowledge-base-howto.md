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

- [appearance-language-theme.md](appearance-language-theme.md)
- [owner-manual-smoke.md](owner-manual-smoke.md)

## See also

[owner-manual-smoke.md](owner-manual-smoke.md) (manual smoke on hardware) · [packaged-windows-smoke.md](../packaged-windows-smoke.md) (post-`pack:dir` smoke).
