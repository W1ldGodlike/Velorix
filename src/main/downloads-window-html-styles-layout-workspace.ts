/**
 * Pop-out downloads CSS — shell, queue, history panels (`buildDownloadsHtml`).
 */
export const DOWNLOADS_WINDOW_HTML_STYLES_LAYOUT_WORKSPACE = `    .dl-shell { height: 100%; min-width: 0; display: flex; flex-direction: column; overflow: hidden; }
    .dl-topbar {
      /* Согласование с главным app-topbar ~62px DIP; точнее на HiDPI — @media ниже */
      min-height: 62px; display: grid; grid-template-columns: minmax(12rem, auto) 1fr auto; align-items: center;
      gap: 0.55rem; padding: 0.46rem 0.75rem; background: color-mix(in srgb, var(--bg) 86%, #111827 14%);
      border-bottom: 1px solid var(--border); flex-shrink: 0;
    }
    .brand { display: inline-flex; align-items: center; gap: 0.45rem; min-width: 0; }
    .brand-mark {
      display: inline-grid; place-items: center; width: 1.25rem; height: 1.25rem; border-radius: 6px;
      color: var(--blue); background: color-mix(in srgb, var(--blue) 15%, transparent); font-size: 0.8rem;
    }
    h1 { font-size: 0.84rem; font-weight: 700; margin: 0; letter-spacing: 0.01em; }
    .brand-version { color: var(--dim); font-size: 0.68rem; font-family: ui-monospace, Consolas, Menlo, monospace; }
    .workspace-tabs { justify-self: center; display: inline-flex; align-items: center; gap: 0.15rem; }
    .workspace-tab {
      min-height: 2.08rem; padding: 0 0.62rem; border: none; border-bottom: 2px solid transparent; background: transparent;
      color: var(--dim); cursor: default; font-size: 0.75rem; font-weight: 600;
    }
    .workspace-tab.active { color: var(--text); border-bottom-color: var(--blue); }
    .workspace-tab-glyph {
      display: inline-flex;
      align-items: center;
      vertical-align: middle;
      margin-right: 0.35rem;
    }
    .workspace-tab-glyph svg { display: block; }
    .topbar-right {
      justify-self: end;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      min-width: 0;
    }
    .topbar-meta {
      color: var(--dim);
      font-family: ui-monospace, Consolas, Menlo, monospace;
      font-size: 0.68rem;
      white-space: nowrap;
    }
    .topbar-cluster {
      display: inline-flex;
      align-items: center;
      gap: 0.12rem;
      flex-shrink: 0;
    }
    button.dl-topbar-ico {
      width: 2rem;
      height: 2rem;
      min-width: 2rem;
      padding: 0;
      border-radius: 8px;
      border: 1px solid var(--fa-border-subtle);
      background: color-mix(in srgb, var(--fa-surface-elevated) 88%, transparent);
      color: var(--fa-text-primary);
    }
    button.dl-topbar-ico:hover {
      background: var(--fa-surface-elevated);
      color: var(--fa-text-primary);
      border-color: var(--fa-border);
    }
    button.dl-topbar-ico svg { display: block; }
    .dl-main {
      flex: 1; min-height: 0; min-width: 0; display: grid; grid-template-columns: minmax(0, 1fr) minmax(258px, 276px);
      overflow: hidden;
    }
    .dl-workspace { min-width: 0; min-height: 0; display: flex; flex-direction: column; border-right: 1px solid var(--border); }
    .dl-input-band {
      display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.55rem; padding: 0.52rem 0.62rem;
      border-bottom: 1px solid var(--border); background: var(--surface);
    }
    .input-label { display: block; margin: 0 0 0.3rem; color: var(--muted); font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; }
    .hint { color: var(--dim); font-size: 0.7rem; margin: 0.28rem 0 0; }
    /* Подпись таблицы / подсказки для скринридеров без смены вёрстки окна загрузок §6 */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip-path: inset(50%);
      white-space: nowrap;
      border: 0;
    }
    textarea {
      width: 100%; min-height: 64px; box-sizing: border-box; resize: vertical; border-radius: 6px;
      border: 1px solid var(--border-2); background: color-mix(in srgb, var(--bg) 66%, var(--surface-2));
      color: var(--text); padding: 0.42rem 0.55rem; font-family: ui-monospace, Consolas, Menlo, monospace; font-size: 0.72rem;
      line-height: 1.38;
    }
    textarea.drag { outline: 2px dashed var(--blue); outline-offset: 2px; }
    .input-actions { display: flex; flex-direction: column; gap: 0.36rem; min-width: 10.75rem; justify-content: end; }
    .queue-toolbar {
      display: flex; gap: 0.38rem; flex-wrap: wrap; align-items: center; padding: 0.34rem 0.62rem;
      border-bottom: 1px solid var(--border); background: color-mix(in srgb, var(--surface) 94%, transparent);
    }
    .inline-filter-field {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }
    label.inline-filter { color: var(--muted); font-size: 0.72rem; }
    .inline-filter-field select, .hist-inline-field select, .history-actions select {
      border-radius: 6px; border: 1px solid var(--border-2); background: var(--surface-2); color: var(--text);
      padding: 0.32rem 0.45rem; font-size: 0.74rem;
    }
    .queue-summary { margin-left: auto; color: var(--dim); font-size: 0.68rem; font-variant-numeric: tabular-nums; }
    button.cmd {
      border-radius: 6px; border: 1px solid var(--border-2); background: var(--surface-2); color: var(--text);
      padding: 0.32rem 0.6rem; font-size: 0.72rem; cursor: pointer; min-height: 28px;
    }
    button.cmd.cmd-icon-leading {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }
    button.cmd.cmd-icon-leading .cmd-ico {
      display: inline-flex;
      flex-shrink: 0;
      line-height: 0;
      color: inherit;
    }
    button.cmd.cmd-icon-leading .cmd-ico svg { display: block; }
    button.cmd:hover { background: var(--surface-3); }
    button.cmd:disabled { opacity: 0.45; cursor: not-allowed; }
    button.cmd-primary {
      border-color: transparent;
      background: var(--blue);
      color: var(--fa-accent-contrast);
    }
    button.cmd-warn { border-color: color-mix(in srgb, var(--red) 45%, var(--border-2)); color: color-mix(in srgb, var(--red) 80%, white); }
    .queue-table-wrap { flex: 1; min-height: 0; overflow: auto; background: var(--bg); }
    table { width: 100%; border-collapse: collapse; font-size: 0.7rem; table-layout: fixed; }
    th, td { border-bottom: 1px solid var(--border); padding: 0.28rem 0.4rem; text-align: left; vertical-align: top; word-break: break-word; }
    table.queue-table tbody tr:nth-child(even) td {
      background: color-mix(in srgb, var(--surface) 16%, var(--bg));
    }
    table.queue-table tbody tr:hover td {
      background: color-mix(in srgb, var(--blue) 8%, var(--surface));
    }
    th { position: sticky; top: 0; z-index: 1; color: var(--muted); background: var(--surface); font-weight: 700; font-size: 0.64rem; text-transform: uppercase; letter-spacing: 0.06em; line-height: 1.28; }
    table.queue-table th:nth-child(1), table.queue-table td:nth-child(1) { width: 2.1rem; }
    table.queue-table th:nth-child(2), table.queue-table td:nth-child(2) { width: 24%; }
    table.queue-table th:nth-child(3), table.queue-table td:nth-child(3) { width: 8.5%; }
    table.queue-table th:nth-child(4), table.queue-table td:nth-child(4) { width: 7.5%; }
    table.queue-table th:nth-child(5), table.queue-table td:nth-child(5) { width: 11.5%; }
    table.queue-table th:nth-child(6), table.queue-table td:nth-child(6) { width: 10%; }
    table.queue-table th:nth-child(7), table.queue-table td:nth-child(7) { width: 5rem; }
    table.queue-table th:nth-child(8), table.queue-table td:nth-child(8) { width: 11%; }
    table.queue-table th:nth-child(9), table.queue-table td:nth-child(9) { width: 13rem; min-width: 9.5rem; }
    td.num { color: var(--dim); font-variant-numeric: tabular-nums; }
    .queue-title { color: var(--text); font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .queue-url { margin-top: 0.08rem; color: var(--dim); font-size: 0.64rem; font-family: ui-monospace, Consolas, Menlo, monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    td.prog { vertical-align: middle; font-variant-numeric: tabular-nums; color: var(--muted); white-space: normal; word-break: break-word; font-size: 0.68rem; line-height: 1.35; }
    td.queue-col-fmt, td.queue-col-size, td.queue-col-spd, td.queue-col-eta {
      font-variant-numeric: tabular-nums; font-size: 0.65rem; color: var(--muted);
    }
    .prog-stack { display: flex; flex-direction: column; gap: 0.22rem; min-width: 0; }
    .prog-bar-row { display: flex; align-items: center; gap: 0.48rem; min-width: 0; }
    .prog-bar-row .progress-track { flex: 1 1 auto; margin: 0; min-width: 0; }
    .prog-pct {
      flex-shrink: 0; min-width: 2.4rem; text-align: right;
      font-variant-numeric: tabular-nums; font-size: 0.64rem; font-weight: 700; color: var(--text);
    }
    .prog-pct.prog-pct-done { color: color-mix(in srgb, var(--green) 90%, white); }
    .prog-head { font-size: 0.62rem; line-height: 1.32; color: var(--muted); word-break: break-word; }
    .progress-track { height: 4px; border-radius: 999px; background: var(--border-2); overflow: hidden; margin: 0.14rem 0 0.12rem; }
    .progress-fill { height: 100%; border-radius: inherit; background: var(--blue); transition: width 0.85s ease-out; }
    .progress-fill-done { background: var(--green); }
    .status-pill { display: inline-flex; align-items: center; gap: 0.34rem; color: var(--muted); }
    .status-dot { width: 0.45rem; height: 0.45rem; border-radius: 999px; background: var(--dim); flex-shrink: 0; }
    .status-running .status-dot { background: var(--blue); }
    .status-done .status-dot { background: var(--green); }
    .status-error .status-dot { background: var(--red); }
    .status-cancelled .status-dot { background: var(--dim); }
    td.act { vertical-align: middle; min-width: 8.75rem; max-width: 15rem; }
    td.num, td.queue-col-fmt, td.queue-col-size, td.queue-col-spd, td.queue-col-eta { vertical-align: middle; }
    .act-icons {
      display: inline-flex; flex-wrap: wrap; gap: 0.14rem; align-items: center;
      justify-content: flex-end;
    }
    td.act button.icon-btn, .icon-btn {
      width: 24px; height: 24px; display: inline-grid; place-items: center; margin: 0; border: none;
      border-radius: 5px; background: transparent; color: var(--muted); cursor: pointer; padding: 0;
      flex-shrink: 0;
    }
    td.act button.icon-btn svg {
      display: block;
    }
    td.act button.icon-btn:hover, .icon-btn:hover { background: var(--surface-2); color: var(--text); }
    td.act button.icon-btn:disabled { opacity: 0.35; cursor: not-allowed; }
    td.act button.icon-btn-warn { color: color-mix(in srgb, var(--red) 88%, white); }
    td.act button.icon-btn-warn:hover { background: color-mix(in srgb, var(--red) 12%, var(--surface-2)); color: var(--red); }
    /* v0: под таблицей очереди — сначала история (опционально), непосредственно «снизу» — журнал операций на всю ширину столбца. */
    .bottom-panels {
      flex-shrink: 0;
      min-height: 168px;
      max-height: 38vh;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: minmax(0, 1fr) minmax(0, 1.18fr);
      border-top: 1px solid var(--border);
      background: var(--surface);
      overflow: hidden;
    }
    .log-panel, .history-panel { min-height: 0; overflow: auto; padding: 0; border: none; margin: 0; }
    .log-panel {
      border-left: none;
      border-top: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    .log-panel > details.details-chev { flex: 1; min-height: 0; display: flex; flex-direction: column; }
    .log-panel > details.details-chev > summary { flex-shrink: 0; }
    .log-panel .history-actions { flex-shrink: 0; }
    .log-panel summary, .history-panel summary {
      cursor: pointer; font-weight: 700; font-size: 0.64rem; padding: 0.36rem 0.55rem; margin: 0;
      user-select: none; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em;
      list-style: none;
    }
    .history-panel.details-chev > summary::-webkit-details-marker,
    .log-panel details.details-chev > summary::-webkit-details-marker,
    .hints-panel.details-chev > summary::-webkit-details-marker {
      display: none;
    }
    .history-panel.details-chev > summary::before,
    .log-panel details.details-chev > summary::before,
    .hints-panel.details-chev > summary::before {
      content: '▸';
      display: inline-block;
      margin-right: 0.45rem;
      color: var(--dim);
      font-size: 0.65rem;
      transition: transform 0.12s ease;
    }
    .history-panel.details-chev[open] > summary::before,
    .log-panel details.details-chev[open] > summary::before,
    .hints-panel.details-chev[open] > summary::before {
      transform: rotate(90deg);
    }`
