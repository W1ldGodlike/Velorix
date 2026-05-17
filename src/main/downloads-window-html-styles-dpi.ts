/**
 * Pop-out downloads CSS — HiDPI @media 120–192dpi (`buildDownloadsHtml`).
 */
export const DOWNLOADS_WINDOW_HTML_STYLES_DPI = `    /* §1.1 / §4.C: на HiDPI Chromium уже масштабирует, но плотность v0 на 125–200% Windows остаётся читабельнее с чуть большим базовым шагом и rail. */
    @media (-webkit-min-device-pixel-ratio: 1.25), (min-resolution: 120dpi) {
      body { font-size: 12px; }
      .dl-topbar {
        min-height: 64px;
        padding: 0.48rem 0.78rem;
        gap: 0.62rem;
      }
      button.dl-topbar-ico {
        width: 2.05rem;
        height: 2.05rem;
        min-width: 2.05rem;
        border-radius: 8px;
      }
      .dl-topbar-ico svg {
        width: 19px;
        height: 19px;
      }
      .topbar-meta { font-size: 0.698rem; }
      .workspace-tab {
        min-height: 2.2rem;
        font-size: 0.76rem;
      }
      .workspace-tab-glyph svg {
        width: 17px;
        height: 17px;
      }
      .dl-main { grid-template-columns: minmax(0, 1fr) minmax(266px, 294px); }
      .dl-input-band {
        padding: 0.58rem 0.68rem;
        gap: 0.62rem;
      }
      .input-label { font-size: 0.694rem; }
      textarea { min-height: 70px; font-size: 0.744rem; padding: 0.46rem 0.58rem; }
      textarea#extraArgsInput { min-height: 56px; font-size: 0.704rem; }
      .input-actions { gap: 0.4rem; min-width: 11rem; }
      button.cmd { min-height: 29px; font-size: 0.744rem; padding: 0.34rem 0.62rem; }
      .queue-toolbar {
        gap: 0.42rem;
        padding: 0.38rem 0.68rem;
      }
      .inline-filter-field label.inline-filter { font-size: 0.736rem; }
      .inline-filter-field select, .hist-inline-field select, .history-actions select {
        padding: 0.34rem 0.48rem;
        font-size: 0.758rem;
      }
      table.queue-table { font-size: 0.716rem; }
      table.queue-table th, table.queue-table td { padding: 0.32rem 0.44rem; }
      table.queue-table th { font-size: 0.664rem; line-height: 1.34; }
      .queue-url { font-size: 0.674rem; }
      td.prog { font-size: 0.704rem; line-height: 1.38; }
      td.queue-col-fmt, td.queue-col-size, td.queue-col-spd, td.queue-col-eta { font-size: 0.678rem; }
      .prog-pct { font-size: 0.674rem; min-width: 2.52rem; }
      .prog-head { font-size: 0.644rem; }
      .prog-stack { gap: 0.26rem; }
      .prog-bar-row { gap: 0.52rem; }
      .progress-track { height: 4.5px; margin: 0.16rem 0 0.14rem; }
      .status-dot { width: 0.49rem; height: 0.49rem; }
      td.act button.icon-btn, .icon-btn {
        width: 25px;
        height: 25px;
        border-radius: 6px;
      }
      td.act button.icon-btn svg {
        width: 17px;
        height: 17px;
      }
      td.act .act-icons { gap: 0.18rem; }
      table.history-table { font-size: 0.674rem; }
      table.history-table th, table.history-table td { padding: 0.3rem 0.42rem; }
      .bottom-panels {
        min-height: 174px;
        grid-template-rows: minmax(0, 1fr) minmax(0, 1.2fr);
      }
      .log-panel summary, .history-panel summary {
        padding: 0.4rem 0.6rem;
        font-size: 0.674rem;
      }
      .log-panel pre#logPre {
        font-size: 0.668rem;
        line-height: 1.38;
        padding: 0.48rem 0.56rem;
      }
      .history-actions {
        gap: 0.48rem;
        padding: 0 0.68rem 0.58rem;
      }
      .rail-head {
        padding: 0.54rem 0.68rem;
      }
      .rail-title { font-size: 0.844rem; }
      .rail-subtitle { font-size: 0.704rem; }
      .settings-section > summary {
        padding: 0.46rem 0.68rem;
        font-size: 0.674rem;
        line-height: 1.36;
      }
      .settings-body { padding: 0 0.68rem 0.62rem; }
      .opts-panel label { font-size: 0.704rem; }
      .opts-panel input[type=text], .opts-panel select, .hint-select {
        padding: 0.44rem 0.54rem;
        font-size: 0.734rem;
      }
      .settings-rail .opts-panel select,
      .settings-rail .hint-select {
        padding: 0.36rem 1.88rem 0.36rem 0.86rem;
        min-height: 1.92rem;
        font-size: 0.726rem;
        background-position: right 0.58rem center;
      }
      .opts-check-muted { font-size: 0.704rem; }
      .opts-check-row label.chk { line-height: 1.4; }
      .opts-check-row input[type=checkbox] { width: 33px; height: 19px; }
      .opts-check-row input[type=checkbox]::after { width: 12px; height: 12px; top: 2.5px; left: 2.5px; }
      .opts-check-row input[type=checkbox]:checked::after { transform: translateX(14px); }
      .args-preview { font-size: 0.704rem; }
      .hist-inline-field label.hist-inline { font-size: 0.718rem; }
    }
    @media (-webkit-min-device-pixel-ratio: 1.5), (min-resolution: 144dpi) {
      body { font-size: 12.25px; }
      .dl-topbar {
        min-height: 65px;
        padding: 0.5rem 0.8rem;
        gap: 0.64rem;
      }
      button.dl-topbar-ico {
        width: 2.08rem;
        height: 2.08rem;
        min-width: 2.08rem;
      }
      .dl-topbar-ico svg {
        width: 19.5px;
        height: 19.5px;
      }
      .topbar-meta { font-size: 0.71rem; }
      .workspace-tab {
        min-height: 2.24rem;
        font-size: 0.77rem;
      }
      .workspace-tab-glyph svg {
        width: 17.5px;
        height: 17.5px;
      }
      .dl-main { grid-template-columns: minmax(0, 1fr) minmax(270px, 298px); }
      .dl-input-band {
        padding: 0.6rem 0.7rem;
        gap: 0.64rem;
      }
      textarea { min-height: 72px; font-size: 0.756rem; padding: 0.48rem 0.6rem; }
      textarea#extraArgsInput { min-height: 58px; font-size: 0.714rem; }
      .input-actions { gap: 0.42rem; min-width: 11.25rem; }
      button.cmd { min-height: 30px; font-size: 0.756rem; padding: 0.36rem 0.64rem; }
      table.queue-table { font-size: 0.72rem; }
      .progress-track { height: 4.5px; }
      td.act button.icon-btn, .icon-btn { width: 25px; height: 25px; }
      td.act button.icon-btn svg { width: 17px; height: 17px; }
      .rail-title { font-size: 0.858rem; }
      .args-preview { font-size: 0.714rem; }
      .hist-inline-field label.hist-inline { font-size: 0.726rem; }
    }
    @media (-webkit-min-device-pixel-ratio: 1.75), (min-resolution: 168dpi) {
      body { font-size: 12.5px; }
      .dl-topbar { min-height: 66px; padding: 0.52rem 0.82rem; gap: 0.65rem; }
      button.dl-topbar-ico {
        width: 2.125rem;
        height: 2.125rem;
        min-width: 2.125rem;
      }
      .dl-topbar-ico svg {
        width: 20px;
        height: 20px;
      }
      .topbar-meta { font-size: 0.72rem; }
      .workspace-tab {
        min-height: 2.28rem;
        font-size: 0.782rem;
      }
      .workspace-tab-glyph svg {
        width: 18px;
        height: 18px;
      }
      .dl-main { grid-template-columns: minmax(0, 1fr) minmax(274px, 302px); }
      .dl-input-band { padding: 0.62rem 0.72rem; gap: 0.65rem; }
      textarea { min-height: 74px; font-size: 0.76rem; padding: 0.5rem 0.6rem; }
      textarea#extraArgsInput { min-height: 60px; }
      button.cmd { min-height: 30px; font-size: 0.764rem; }
      table.queue-table { font-size: 0.736rem; }
      table.queue-table th, table.queue-table td { padding: 0.36rem 0.48rem; }
      td.act button.icon-btn, .icon-btn { width: 26px; height: 26px; }
      td.act button.icon-btn svg {
        width: 18px;
        height: 18px;
      }
      .progress-track { height: 5px; }
      .rail-title { font-size: 0.868rem; }
      .opts-check-row input[type=checkbox] { width: 34px; height: 19px; }
      .opts-check-row input[type=checkbox]::after { width: 13px; height: 13px; left: 2px; top: 2px; }
      .opts-check-row input[type=checkbox]:checked::after { transform: translateX(15px); }
      .bottom-panels { min-height: 182px; }
      .log-panel pre#logPre { font-size: 0.686rem; }
    }
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
      body { font-size: 13px; }
      .dl-topbar { min-height: 68px; padding: 0.56rem 0.86rem; gap: 0.7rem; }
      button.dl-topbar-ico {
        width: 2.18rem;
        height: 2.18rem;
        min-width: 2.18rem;
      }
      .dl-topbar-ico svg {
        width: 21px;
        height: 21px;
      }
      .topbar-meta { font-size: 0.75rem; }
      .workspace-tab {
        min-height: 2.34rem;
        font-size: 0.8rem;
      }
      .workspace-tab-glyph svg {
        width: 19px;
        height: 19px;
      }
      .dl-main { grid-template-columns: minmax(0, 1fr) minmax(286px, 316px); }
      textarea { min-height: 78px; font-size: 0.788rem; padding: 0.52rem 0.64rem; }
      textarea#extraArgsInput { min-height: 62px; }
      button.cmd { min-height: 31px; font-size: 0.78rem; }
      table.queue-table { font-size: 0.76rem; }
      td.act button.icon-btn, .icon-btn { width: 27px; height: 27px; }
      td.act button.icon-btn svg { width: 19px; height: 19px; }
      .progress-track { height: 5.5px; }
      .rail-title { font-size: 0.89rem; }
    }`
