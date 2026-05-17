/**
 * Pop-out downloads CSS — @media max-width 960px (`buildDownloadsHtml`).
 */
export const DOWNLOADS_WINDOW_HTML_STYLES_NARROW = `    @media (max-width: 960px) {
      .dl-main {
        grid-template-columns: minmax(0, 1fr);
        grid-template-rows: minmax(0, 1fr) auto;
        gap: 0;
        min-height: 0;
        overflow-x: hidden;
        overflow-y: auto;
        align-content: start;
      }
      .dl-workspace {
        border-right: none;
        min-height: 0;
      }
      .settings-rail {
        display: flex;
        flex-direction: column;
        max-height: min(42vh, 24rem);
        min-height: 10rem;
        flex-shrink: 0;
        overflow: auto;
        border-top: 1px solid var(--border);
        scroll-margin-top: 0.5rem;
      }
      .bottom-panels {
        max-height: min(34vh, 15rem);
      }
    }`
