/**
 * Pop-out downloads CSS — log, settings rail, focus rings (`buildDownloadsHtml`).
 */
export const DOWNLOADS_WINDOW_HTML_STYLES_LAYOUT_RAIL = `    .log-panel pre#logPre {
      flex: 1 1 auto;
      min-height: 3.5rem;
      max-height: none;
      margin: 0.35rem 0.55rem 0.52rem;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: ui-monospace, Consolas, Menlo, monospace;
      font-size: 0.63rem;
      line-height: 1.34;
      tab-size: 2;
      scrollbar-gutter: stable;
      background: color-mix(in srgb, var(--bg) 92%, var(--surface-2));
      color: var(--muted);
      padding: 0.45rem 0.52rem;
      border-radius: 5px;
      border: 1px solid var(--border);
    }
    .log-panel pre#logPre .log-line {
      display: block;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .log-line-tag {
      display: inline;
      margin-right: 0.35rem;
      font-weight: 700;
      font-size: 0.6rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      opacity: 0.62;
    }
    .log-line-out .log-line-tag { color: color-mix(in srgb, var(--blue) 35%, var(--muted)); }
    .log-line-out .log-line-body { color: var(--muted); }
    .log-line-err .log-line-tag { color: color-mix(in srgb, var(--red) 55%, var(--muted)); }
    .log-line-err .log-line-body { color: color-mix(in srgb, var(--red) 18%, var(--text)); }
    .log-panel .log-meta {
      margin-left: auto;
      color: var(--dim);
      font-size: 0.64rem;
      font-variant-numeric: tabular-nums;
    }
    .settings-rail { min-width: 0; min-height: 0; overflow: auto; background: var(--surface); }
    .rail-head { padding: 0.5rem 0.62rem; border-bottom: 1px solid var(--border); }
    .rail-title { margin: 0; color: var(--text); font-size: 0.82rem; font-weight: 700; }
    .rail-subtitle { margin: 0.1rem 0 0; color: var(--dim); font-size: 0.68rem; line-height: 1.35; }
    .settings-section { border-bottom: 1px solid var(--border); }
    .settings-section > summary {
      cursor: pointer; list-style: none; padding: 0.42rem 0.62rem; color: var(--muted); font-size: 0.64rem;
      font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; user-select: none;
      line-height: 1.3;
    }
    .settings-section > summary::-webkit-details-marker { display: none; }
    .settings-section > summary::before { content: '▸'; display: inline-block; margin-right: 0.45rem; color: var(--dim); transition: transform 0.12s ease; }
    .settings-section[open] > summary::before { transform: rotate(90deg); }
    .settings-body { padding: 0 0.62rem 0.58rem; }
    .out-dir-row { display: flex; align-items: center; gap: 0.45rem; flex-wrap: wrap; margin: 0.35rem 0 0.65rem; font-size: 0.74rem; }
    .out-dir-row .out-dir-label { font-weight: 700; color: var(--muted); }
    .out-dir-row .out-path {
      flex: 1 1 100%; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
      font-family: ui-monospace, Consolas, Menlo, monospace; font-size: 0.68rem; color: var(--muted);
    }
    .opts-panel { font-size: 0.74rem; }
    .opts-panel label { display: block; margin: 0.5rem 0 0.25rem; color: var(--muted); font-weight: 700; font-size: 0.68rem; }
    .opts-panel input[type=text], .opts-panel select, .hint-select {
      width: 100%; min-width: 0; margin-bottom: 0.35rem; padding: 0.42rem 0.5rem; border-radius: 6px;
      border: 1px solid var(--border-2); background: color-mix(in srgb, var(--bg) 66%, var(--surface-2));
      color: var(--text); font-size: 0.72rem;
    }
    /* §1.1/§6: в правом rail нативные select ближе к v0 pill; длинные поля путей и превью — прямоугольные. */
    .settings-rail .opts-panel select,
    .settings-rail .hint-select {
      appearance: none;
      border-radius: 999px;
      padding: 0.34rem 1.82rem 0.34rem 0.82rem;
      min-height: 1.82rem;
      font-size: 0.71rem;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%238c98a8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.55rem center;
      background-size: 0.76rem;
    }
    .opts-panel input[type=text] { font-family: ui-monospace, Consolas, Menlo, monospace; }
    .opts-actions { display: flex; gap: 0.4rem; flex-wrap: wrap; align-items: center; margin-top: 0.45rem; }
    .opts-check-row { display: flex; flex-direction: column; gap: 0.45rem; margin: 0.55rem 0; }
    /* v0 rail: подпись слева на всю ширину, маленький pill-toggle справа */
    .opts-check-row label.chk {
      display: flex; align-items: center; justify-content: space-between; gap: 0.65rem;
      font-weight: 400; color: var(--text); cursor: pointer; margin: 0; line-height: 1.35;
    }
    .opts-check-row .chk-text { min-width: 0; flex: 1 1 auto; }
    .opts-check-row input[type=checkbox] { appearance: none; width: 32px; height: 18px; border-radius: 999px; border: 1px solid var(--border-2); background: var(--surface-3); position: relative; flex-shrink: 0; }
    .opts-check-row input[type=checkbox]::after { content: ''; position: absolute; width: 12px; height: 12px; top: 2px; left: 2px; border-radius: 999px; background: var(--dim); transition: transform 0.12s ease, background 0.12s ease; }
    .opts-check-row input[type=checkbox]:checked { background: color-mix(in srgb, var(--blue) 55%, var(--surface-3)); border-color: transparent; }
    .opts-check-row input[type=checkbox]:checked::after { transform: translateX(14px); background: white; }
    .opts-check-muted { color: var(--dim); font-size: 0.68rem; }
    /* §6.3 / v0: те же pill-кнопки, что PillSwitch на вкладке «Загрузки» (без native checkbox). */
    .opts-pill-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.55rem 0.75rem;
      margin: 0.5rem 0 0.45rem;
    }
    .opts-pill-field { display: flex; flex-direction: column; gap: 0.24rem; min-width: 0; }
    .opts-pill-label {
      color: var(--muted);
      font-size: 0.68rem;
      font-weight: 600;
      line-height: 1.35;
    }
    button.pill-switch {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      width: fit-content;
      min-height: 1.72rem;
      padding: 0 0.5rem 0 0.18rem;
      border-radius: 999px;
      border: 1px solid var(--fa-border-subtle);
      background: var(--fa-surface-elevated);
      color: var(--fa-text-muted);
      cursor: pointer;
      font-size: 0.68rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      font-family: inherit;
    }
    button.pill-switch.pill-switch-on {
      border-color: transparent;
      background: color-mix(in srgb, var(--fa-accent) 55%, var(--fa-surface-elevated));
      color: var(--fa-accent-contrast);
    }
    button.pill-switch:disabled { opacity: 0.45; cursor: not-allowed; }
    button.pill-switch:focus-visible {
      outline: 2px solid var(--fa-focus-ring);
      outline-offset: 2px;
    }
    button.pill-switch .pill-switch-knob {
      width: 1.16rem;
      height: 1.16rem;
      border-radius: 999px;
      background: var(--fa-text-muted);
      transition: transform 0.12s ease, background 0.12s ease;
    }
    button.pill-switch.pill-switch-on .pill-switch-knob {
      transform: translateX(0.8rem);
      background: #fff;
    }
    button.pill-switch .pill-switch-text { min-width: 2rem; text-align: center; }
    .opts-preview-label { display: block; margin: 0.5rem 0 0.25rem; font-size: 0.68rem; color: var(--muted); font-weight: 700; }
    .expert-panel, .hints-panel { margin: 0.55rem 0; padding: 0; border: none; background: transparent; }
    .expert-panel summary, .hints-panel summary { cursor: pointer; font-weight: 700; font-size: 0.72rem; color: var(--muted); user-select: none; margin-bottom: 0.45rem; }
    .hints-search {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 0.35rem;
      margin: 0.5rem 0 0.6rem;
    }
    .hints-search input[type=text] {
      width: 100%;
      border-radius: 999px;
      border: 1px solid var(--border-2);
      background: var(--surface-2);
      color: var(--text);
      padding: 0.36rem 0.55rem;
      font-size: 0.72rem;
      font-family: ui-monospace, Consolas, Menlo, monospace;
    }
    .hint-list {
      margin: 0.45rem 0 0;
      padding: 0;
      border: 1px solid var(--border);
      border-radius: 8px;
      background: color-mix(in srgb, var(--bg) 72%, var(--surface));
      max-height: 220px;
      overflow: auto;
    }
    .hint-cat {
      position: sticky;
      top: 0;
      z-index: 1;
      padding: 0.4rem 0.55rem;
      font-size: 0.62rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--muted);
      background: color-mix(in srgb, var(--surface) 86%, transparent);
      border-bottom: 1px solid var(--border);
    }
    .hint-item {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 0.18rem;
      padding: 0.42rem 0.55rem;
      border-bottom: 1px solid var(--border);
    }
    .hint-item:last-child { border-bottom: none; }
    button.hint-token {
      all: unset;
      cursor: pointer;
      color: var(--text);
      font-family: ui-monospace, Consolas, Menlo, monospace;
      font-size: 0.7rem;
      font-weight: 700;
      line-height: 1.35;
    }
    button.hint-token:hover { color: var(--blue); text-decoration: underline; }
    button.hint-token:focus-visible {
      outline: 2px solid var(--fa-focus-ring);
      outline-offset: 2px;
      border-radius: 6px;
    }
    .hint-desc { color: var(--dim); font-size: 0.66rem; line-height: 1.35; }
    textarea#extraArgsInput {
      width: 100%; min-height: 52px; margin-bottom: 0.4rem; padding: 0.45rem 0.5rem; border-radius: 6px;
      border: 1px solid var(--border-2); background: var(--bg); color: var(--text);
      font-family: ui-monospace, Consolas, Menlo, monospace; font-size: 0.68rem; resize: vertical;
    }
    .opts-warn { color: color-mix(in srgb, var(--red) 82%, white); margin: 0.35rem 0; line-height: 1.35; }
    .args-preview {
      margin: 0 0 0.5rem; padding: 0.5rem 0.6rem; border-radius: 6px; border: 1px solid var(--border);
      background: var(--bg); color: color-mix(in srgb, var(--green) 78%, white); font-family: ui-monospace, Consolas, Menlo, monospace;
      font-size: 0.68rem; white-space: pre-wrap; word-break: break-word; max-height: 120px; overflow: auto;
    }
    #hintCatalogIntro { margin-bottom: 0.35rem; }
    .opts-hint { font-size: 0.68rem; color: var(--dim); margin: 0 0 0.5rem; line-height: 1.35; }
    .note { display: none; }
    .history-actions { display: flex; gap: 0.45rem; flex-wrap: wrap; align-items: center; padding: 0 0.65rem 0.55rem; }
    .hist-inline-field {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
    }
    label.hist-inline { color: var(--muted); font-size: 0.7rem; }
    table.history-table { font-size: 0.64rem; }
    table.history-table th, table.history-table td { padding: 0.28rem 0.38rem; }
    table.history-table th:nth-child(1), table.history-table td:nth-child(1) { width: 10.5rem; white-space: nowrap; }
    table.history-table th:nth-child(4), table.history-table td:nth-child(4) { width: 5.5rem; }
    table.history-table th:nth-child(5), table.history-table td:nth-child(5) { width: 3rem; text-align: right; }
    table.history-table th:nth-child(7), table.history-table td:nth-child(7) { min-width: 10rem; width: 10rem; text-align: right; }
    td.h-out-ok { color: var(--green); }
    td.h-out-err { color: var(--red); }
    td.h-out-can { color: var(--blue); }
    textarea:focus-visible,
    select:focus-visible,
    button.cmd:focus-visible,
    td.act button.icon-btn:focus-visible,
    button.dl-topbar-ico:focus-visible,
    .opts-panel input[type=text]:focus-visible,
    #extraArgsInput:focus-visible,
    .opts-check-row input[type=checkbox]:focus-visible,
    button.pill-switch:focus-visible,
      .inline-filter-field select:focus-visible,
      .hist-inline-field select:focus-visible,
      .history-actions select:focus-visible,
    .settings-rail .opts-panel select:focus-visible,
    .settings-rail .hint-select:focus-visible,
    .settings-section > summary:focus-visible,
    .history-panel.details-chev > summary:focus-visible,
    .log-panel details.details-chev > summary:focus-visible,
    .hints-panel.details-chev > summary:focus-visible,
    button.workspace-tab:focus-visible:not(:disabled) {
      outline: 2px solid var(--fa-focus-ring);
      outline-offset: 2px;
    }
    /* §6.1/v0: как вкладка «Загрузки» ~1100px — rail не исчезает, уходит под очередь с max-height + scroll. */`
