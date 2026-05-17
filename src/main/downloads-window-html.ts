import type { DownloadsWindowUiPanelState, ResolvedAppTheme } from '../shared/settings-contract'
import type { DownloadsWindowUiLocale } from '../shared/downloads-window-ui-locale'
import {
  buildDownloadsWindowScriptI18nJson,
  getDownloadsWindowUiStrings
} from '../shared/downloads-window-ui-locale'
import {
  YTDLP_DOC_FORMAT_SELECTION,
  YTDLP_DOC_OUTPUT_TEMPLATE,
  YTDLP_DOC_POSTPROCESS,
  YTDLP_DOC_README
} from '../shared/external-doc-urls'
import { getYtdlpHintCategoryOrder } from '../shared/ytdlp-hint-category-order'
import { DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED } from '../shared/downloads-log-contract'
import {
  YTDLP_QUEUE_STATUS_CANCELLED,
  YTDLP_QUEUE_STATUS_DONE,
  YTDLP_QUEUE_STATUS_ERROR_PREFIX,
  YTDLP_QUEUE_STATUS_RUNNING,
  YTDLP_QUEUE_STATUS_WAITING,
  YTDLP_QUEUE_STATUS_RETRY_PAUSE_PREFIX
} from '../shared/ytdlp-queue-status'
import {
  DOWNLOADS_TOPBAR_CLUSTER_ICONS,
  EDITOR_TOPBAR_ACTION_ICONS,
  EDITOR_TOPBAR_TOOLS_ICONS,
  QUEUE_ROW_ACTION_ICONS,
  emitDownloadsQueueRowIcoBootstrapJs,
  emitDownloadsTopbarClusterHtml,
  emitInlineStrokeSvg
} from '../shared/lucide-downloads-icons'

export function buildDownloadsHtml(
  panelState?: DownloadsWindowUiPanelState,
  appTheme: ResolvedAppTheme = 'dark',
  uiLocale: DownloadsWindowUiLocale = 'ru'
): string {
  const L = getDownloadsWindowUiStrings(uiLocale)
  const dlScriptI18nJson = buildDownloadsWindowScriptI18nJson(uiLocale)
  const dlLocaleCmpJson = JSON.stringify(uiLocale === 'en' ? 'en' : 'ru')
  const ytdlpHintCatOrderJson = JSON.stringify([...getYtdlpHintCategoryOrder(uiLocale)])
  const openAttr = (key: keyof DownloadsWindowUiPanelState, defaultOpen: boolean): string => {
    const v = panelState?.[key]
    const isOpen = typeof v === 'boolean' ? v : defaultOpen
    return isOpen ? ' open' : ''
  }
  const dataThemeAttr = appTheme === 'light' ? 'light' : 'dark'
  return `<!DOCTYPE html>
<html lang="${L.htmlLang}" data-theme="${dataThemeAttr}">
<head>
  <meta charset="UTF-8" />
  <title>${L.pageTitle}</title>
  <style>
    html[data-theme='dark'],
    html:not([data-theme]) {
      color-scheme: dark;
      /* Синхрон с html[data-theme=dark] в src/renderer/src/assets/base.css */
      --fa-bg: #020407;
      --fa-surface: #070a0f;
      --fa-surface-elevated: #0d1219;
      --fa-border: #202936;
      --fa-border-subtle: #151c27;
      --fa-text-primary: #e8edf5;
      --fa-text-secondary: #9aa7b7;
      --fa-text-muted: #5f6b7a;
      --fa-accent: #2f8cff;
      --fa-accent-contrast: #ffffff;
      --fa-danger: #ef4444;
      --fa-success: #22c55e;
      --fa-focus-ring: rgba(47, 140, 255, 0.45);
      --bg: var(--fa-bg);
      --surface: var(--fa-surface);
      --surface-2: var(--fa-surface-elevated);
      --surface-3: #111823;
      --border: var(--fa-border-subtle);
      --border-2: var(--fa-border);
      --text: var(--fa-text-primary);
      --muted: var(--fa-text-secondary);
      --dim: var(--fa-text-muted);
      --blue: var(--fa-accent);
      --green: var(--fa-success);
      --red: var(--fa-danger);
    }
    html[data-theme='light'] {
      color-scheme: light;
      --fa-bg: #f3f4f6;
      --fa-surface: #e8eaef;
      --fa-surface-elevated: #ffffff;
      --fa-border: #cfd2d9;
      --fa-border-subtle: #dfe1e8;
      --fa-text-primary: #1f2229;
      --fa-text-secondary: #4b5260;
      --fa-text-muted: #717784;
      --fa-accent: #2f6feb;
      --fa-accent-contrast: #ffffff;
      --fa-danger: #c43333;
      --fa-success: #29875f;
      --fa-focus-ring: rgba(47, 111, 235, 0.4);
      --bg: var(--fa-bg);
      --surface: var(--fa-surface);
      --surface-2: var(--fa-surface-elevated);
      --surface-3: #f0f2f5;
      --border: var(--fa-border-subtle);
      --border-2: var(--fa-border);
      --text: var(--fa-text-primary);
      --muted: var(--fa-text-secondary);
      --dim: var(--fa-text-muted);
      --blue: var(--fa-accent);
      --green: var(--fa-success);
      --red: var(--fa-danger);
    }
    * { box-sizing: border-box; }
    html, body { width: 100%; height: 100%; overflow: hidden; }
    body {
      font-family: Inter, Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      margin: 0; background: var(--bg); color: var(--text);
      line-height: 1.42; font-size: 11.5px;
      text-rendering: optimizeLegibility;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    /* §1.1 / §4.C: на HiDPI Chromium уже масштабирует, но плотность v0 на 125–200% Windows остаётся читабельнее с чуть большим базовым шагом и rail. */
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
    }
    .dl-shell { height: 100%; min-width: 0; display: flex; flex-direction: column; overflow: hidden; }
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
    }
    .log-panel pre#logPre {
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
    /* §6.1/v0: как вкладка «Загрузки» ~1100px — rail не исчезает, уходит под очередь с max-height + scroll. */
    @media (max-width: 960px) {
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
    }
  </style>
</head>
<body>
  <div class="dl-shell">
    <header class="dl-topbar">
      <div class="brand">
        <span class="brand-mark" aria-hidden>◇</span>
        <h1>FluxAlloy</h1>
        <span class="brand-version">yt-dlp</span>
      </div>
      <nav class="workspace-tabs" aria-label="${L.workspaceTabsAria}">
        <button type="button" class="workspace-tab" disabled title="${L.editorTabDisabledTitle}"><span class="workspace-tab-glyph" aria-hidden="true">${emitInlineStrokeSvg(DOWNLOADS_TOPBAR_CLUSTER_ICONS.home, 16)}</span>${L.editorTabLabel}</button>
        <button type="button" class="workspace-tab active" aria-current="page"><span class="workspace-tab-glyph" aria-hidden="true">${emitInlineStrokeSvg(DOWNLOADS_TOPBAR_CLUSTER_ICONS.download, 16)}</span>${L.downloadsTabLabel}</button>
      </nav>
      <div class="topbar-right">
        <span class="topbar-meta">ffmpeg / yt-dlp queue</span>
${emitDownloadsTopbarClusterHtml(18, L.topbarCluster)}
      </div>
    </header>
    <main class="dl-main">
      <section class="dl-workspace" aria-label="${L.queueSectionAria}">
        <div class="dl-input-band">
          <div>
            <label class="input-label" for="urls">${L.urlsLabel}</label>
            <textarea id="urls" placeholder="https://…" aria-describedby="urlsHint"></textarea>
            <p class="hint" id="urlsHint">${L.urlsHint}</p>
          </div>
          <div class="input-actions">
            <button type="button" class="cmd cmd-primary cmd-icon-leading" id="addBtn" aria-describedby="urlsHint">
              <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.plus, 15)}</span>
              ${L.addToQueue}
            </button>
            <button
              type="button"
              class="cmd cmd-icon-leading"
              id="startBtn"
              title="${L.startAllTitle}"
              aria-describedby="urlsHint"
            >
              <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.play, 15)}</span>
              ${L.startAll}
            </button>
          </div>
        </div>
        <div class="queue-toolbar">
          <button
            type="button"
            class="cmd cmd-icon-leading"
            id="pauseYtdlpBtn"
            title="${L.pauseToolbarTitleDefault}"
            aria-describedby="dlQueueToolbarHint"
          >
            <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.pause, 14)}</span>
            ${L.pauseLabel}
          </button>
          <button
            type="button"
            class="cmd cmd-warn cmd-icon-leading"
            id="cancelBtn"
            title="${L.cancelTitle}"
            aria-describedby="dlQueueToolbarHint"
          >
            <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(EDITOR_TOPBAR_ACTION_ICONS.ban, 14)}</span>
            ${L.cancel}
          </button>
          <button type="button" class="cmd cmd-icon-leading" id="clearBtn" aria-describedby="dlQueueToolbarHint">
            <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.trash, 14)}</span>
            ${L.clearQueue}
          </button>
          <button type="button" class="cmd cmd-icon-leading" id="clearFinishedBtn" aria-describedby="dlQueueToolbarHint">
            <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.trash, 14)}</span>
            ${L.clearFinished}
          </button>
          <span class="inline-filter-field">
            <label class="inline-filter" for="queueStatusFilter">${L.statusFilterLabel}</label>
            <select id="queueStatusFilter" aria-describedby="queueFilterHint">
              <option value="all">${L.optQueueAll}</option>
              <option value="waiting">${L.optQueueWaiting}</option>
              <option value="running">${L.optQueueRunning}</option>
              <option value="done">${L.optQueueDone}</option>
              <option value="error">${L.optQueueError}</option>
              <option value="cancelled">${L.optQueueCancelled}</option>
            </select>
          </span>
          <span id="queueFilterHint" class="sr-only">${L.queueFilterHint}</span>
          <span id="dlQueueToolbarHint" class="sr-only">
            ${L.queueToolbarHint}
          </span>
          <span class="queue-summary" id="queueSummary">${L.queueSummaryInitial}</span>
          <button
            type="button"
            class="cmd cmd-icon-leading"
            id="scrollToRailBtn"
            hidden
            title="${L.scrollToSettingsTitle}"
            aria-controls="dl-ytdlp-settings-rail"
          >
            <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(DOWNLOADS_TOPBAR_CLUSTER_ICONS.settings, 14)}</span>
            ${L.scrollToSettings}
          </button>
        </div>
        <div class="queue-table-wrap">
          <table class="queue-table">
            <caption class="sr-only">${L.queueTableCaption}</caption>
            <thead><tr><th>${L.thNum}</th><th>${L.thTitle}</th><th>${L.thFmt}</th><th>${L.thSize}</th><th>${L.thProg}</th><th>${L.thSpd}</th><th>${L.thEta}</th><th>${L.thStatus}</th><th>${L.thActions}</th></tr></thead>
            <tbody id="queueBody"></tbody>
          </table>
        </div>
        <div class="bottom-panels">
          <details class="history-panel details-chev" id="historyDetails"${openAttr('history', false)}>
            <summary>${L.historySummary}</summary>
            <p id="downloadsHistorySectionHint" class="sr-only">
              ${L.historySectionHint}
            </p>
            <div class="history-actions">
              <button
                type="button"
                class="cmd cmd-icon-leading"
                id="refreshHistoryBtn"
                aria-describedby="downloadsHistorySectionHint"
              >
                <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.refreshCw, 14)}</span>
                ${L.refreshHistory}
              </button>
              <button
                type="button"
                class="cmd cmd-warn cmd-icon-leading"
                id="clearHistoryBtn"
                aria-describedby="downloadsHistorySectionHint"
              >
                <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.trash, 14)}</span>
                ${L.clearHistory}
              </button>
              <span class="hist-inline-field">
                <label class="hist-inline" for="historyOutcomeFilter">${L.historyOutcomeLabel}</label>
                <select
                  id="historyOutcomeFilter"
                  aria-describedby="downloadsHistorySectionHint historyFilterHint"
                >
                  <option value="all">${L.histOptAll}</option>
                  <option value="success">${L.histOptSuccess}</option>
                  <option value="error">${L.histOptError}</option>
                  <option value="cancelled">${L.histOptCancelled}</option>
                </select>
              </span>
              <span id="historyFilterHint" class="sr-only">${L.historyFilterHint}</span>
            </div>
            <table class="history-table">
              <caption class="sr-only">${L.historyTableCaption}</caption>
              <thead><tr><th>${L.histThFinished}</th><th>${L.histThName}</th><th>${L.histThUrl}</th><th>${L.histThOutcome}</th><th>${L.histThCode}</th><th>${L.histThStatus}</th><th></th></tr></thead>
              <tbody id="historyBody"></tbody>
            </table>
          </details>
          <div class="log-panel">
            <details class="details-chev" id="logDetails"${openAttr('log', true)}>
              <summary>${L.logSummary}</summary>
              <p id="downloadsLogSectionHint" class="sr-only">
                ${L.logSectionHint}
              </p>
              <div class="history-actions">
                <button type="button" class="cmd cmd-icon-leading" id="saveLogBtn" aria-describedby="downloadsLogSectionHint">
                  <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(EDITOR_TOPBAR_ACTION_ICONS.save, 14)}</span>
                  ${L.saveLog}
                </button>
                <button
                  type="button"
                  class="cmd cmd-icon-leading"
                  id="clearLogBtn"
                  title="${L.clearLogViewTitle}"
                  aria-describedby="downloadsLogSectionHint"
                >
                  <span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.x, 14)}</span>
                  ${L.clearLogView}
                </button>
                <span class="queue-summary log-meta" id="logMeta"></span>
              </div>
              <pre
                id="logPre"
                role="log"
                aria-live="polite"
                aria-relevant="additions"
                aria-label="${L.logPreAriaLabel}"
                aria-describedby="downloadsLogSectionHint"
              ></pre>
            </details>
          </div>
        </div>
      </section>
      <aside class="settings-rail" id="dl-ytdlp-settings-rail" aria-label="${L.railAria}">
        <div class="rail-head">
          <h2 class="rail-title">${L.railTitle}</h2>
          <p class="rail-subtitle">${L.railSubtitle}</p>
        </div>
        <div class="opts-panel">
          <details class="settings-section" id="dlRailFormat"${openAttr('format', true)}>
            <summary>${L.formatSummary}</summary>
            <div class="settings-body" aria-describedby="dlRailFormatSectionHint">
              <p id="dlRailFormatSectionHint" class="opts-hint">
                ${L.formatSectionHint}
              </p>
              <label for="fmtPreset">${L.formatQualityLabel}</label>
              <select id="fmtPreset" aria-describedby="dlRailFormatSectionHint"></select>
              <div class="opts-pill-grid" role="group" aria-label="${L.playlistAudioGroupAria}">
                <div class="opts-pill-field">
                  <span class="opts-pill-label">${L.wholePlaylistLabel} <span class="opts-check-muted">--yes-playlist</span></span>
                  <button type="button" class="pill-switch" id="pillPlaylist" role="switch" aria-checked="false" aria-label="${L.wholePlaylistAria}" aria-describedby="dlRailFormatSectionHint">
                    <span class="pill-switch-knob" aria-hidden="true"></span>
                    <span class="pill-switch-text">${L.pillOff}</span>
                  </button>
                </div>
                <div class="opts-pill-field">
                  <span class="opts-pill-label">${L.audioOnlyLabel} <span class="opts-check-muted">-x --audio-format best</span></span>
                  <button type="button" class="pill-switch" id="pillAudioOnly" role="switch" aria-checked="false" aria-label="${L.audioOnlyAria}" aria-describedby="dlRailFormatSectionHint">
                    <span class="pill-switch-knob" aria-hidden="true"></span>
                    <span class="pill-switch-text">${L.pillOff}</span>
                  </button>
                </div>
              </div>
              <label for="subPreset">${L.subtitlesLabel}</label>
              <select id="subPreset" aria-describedby="dlRailFormatSectionHint">
                <option value="none">${L.subOptNone}</option>
                <option value="manual">${L.subOptManual}</option>
                <option value="manual_auto">${L.subOptManualAuto}</option>
              </select>
              <label for="subLangsInput">${L.subLangsLabel}</label>
              <input type="text" id="subLangsInput" spellcheck="false" autocomplete="off" placeholder="${L.subLangsPlaceholder}" aria-describedby="dlRailFormatSectionHint" />
            </div>
          </details>
          <details class="settings-section" id="dlRailMeta"${openAttr('metadata', true)}>
            <summary>${L.metadataSummary}</summary>
            <div class="settings-body" aria-describedby="dlRailMetaSectionHint">
              <p id="dlRailMetaSectionHint" class="opts-hint">
                ${L.metadataSectionHint}
              </p>
              <label for="cookiesBrowserSelect">${L.cookiesLabel}</label>
              <select id="cookiesBrowserSelect" aria-describedby="dlRailMetaSectionHint">
                <option value="none">${L.cookiesNone}</option>
                <option value="chrome">${L.cookiesChrome}</option>
                <option value="edge">${L.cookiesEdge}</option>
                <option value="firefox">${L.cookiesFirefox}</option>
              </select>
              <label for="cookiesBrowserProfileInput">${L.cookiesProfileLabel}</label>
              <input type="text" id="cookiesBrowserProfileInput" spellcheck="false" autocomplete="off" placeholder="${L.cookiesProfilePlaceholder}" aria-describedby="dlRailMetaSectionHint" />
              <div class="out-dir-row" role="group" aria-labelledby="dlCookiesPathLabel">
                <span id="dlCookiesPathLabel" class="out-dir-label">${L.cookiesFileLabel}</span>
                <span id="cookiesPathText" class="out-path" title="">—</span>
                <button type="button" class="cmd cmd-icon-leading" id="pickCookiesBtn" aria-describedby="dlRailMetaSectionHint"><span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.file, 14)}</span>${L.pickEllipsis}</button>
                <button type="button" class="cmd cmd-icon-leading" id="clearCookiesBtn" title="${L.clearCookiesTitle}" aria-describedby="dlRailMetaSectionHint"><span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.x, 14)}</span>${L.clearCookies}</button>
              </div>
              <p class="opts-hint opts-warn" id="cookiesWarn" hidden></p>
              <label for="impersonateSelect">${L.impersonateLabel}</label>
              <select id="impersonateSelect" aria-describedby="dlRailMetaSectionHint">
                <option value="none">${L.impersonateOff}</option>
                <option value="chrome">chrome</option>
                <option value="edge">edge</option>
                <option value="firefox">firefox</option>
              </select>
              <div class="opts-pill-field" style="margin-top:0.45rem">
                <span class="opts-pill-label">${L.openInHandlerPillLabel} <span class="opts-check-muted">§6.4</span></span>
                <button type="button" class="pill-switch" id="pillOpenInHandler" role="switch" aria-checked="false" aria-label="${L.openInHandlerAria}" aria-describedby="dlRailMetaSectionHint">
                  <span class="pill-switch-knob" aria-hidden="true"></span>
                  <span class="pill-switch-text">${L.pillOff}</span>
                </button>
              </div>
              <div class="opts-pill-field" style="margin-top:0.35rem">
                <span class="opts-pill-label">${L.autoExportPillLabel} <span class="opts-check-muted">§6.4→§7.2</span></span>
                <button type="button" class="pill-switch" id="pillAutoExportAfterOpen" role="switch" aria-checked="false" aria-label="${L.autoExportAria}" aria-describedby="dlRailMetaSectionHint">
                  <span class="pill-switch-knob" aria-hidden="true"></span>
                  <span class="pill-switch-text">${L.pillOff}</span>
                </button>
              </div>
              <div class="opts-pill-field" style="margin-top:0.35rem">
                <span class="opts-pill-label">${L.enqueueBatchPillLabel} <span class="opts-check-muted">§7.4</span></span>
                <button type="button" class="pill-switch" id="pillEnqueueBatch" role="switch" aria-checked="false" aria-label="${L.enqueueBatchAria}" aria-describedby="dlRailMetaSectionHint">
                  <span class="pill-switch-knob" aria-hidden="true"></span>
                  <span class="pill-switch-text">${L.pillOff}</span>
                </button>
              </div>
              <div class="opts-pill-field" style="margin-top:0.35rem">
                <span class="opts-pill-label">${L.autoStartBatchPillLabel} <span class="opts-check-muted">§7.4</span></span>
                <button type="button" class="pill-switch" id="pillAutoStartBatch" role="switch" aria-checked="false" aria-label="${L.autoStartBatchAria}" aria-describedby="dlRailMetaSectionHint">
                  <span class="pill-switch-knob" aria-hidden="true"></span>
                  <span class="pill-switch-text">${L.pillOff}</span>
                </button>
              </div>
            </div>
          </details>
          <details class="settings-section" id="dlRailSave"${openAttr('saving', true)}>
            <summary>${L.savingSummary}</summary>
            <div class="settings-body" aria-describedby="dlRailSaveSectionHint">
              <p id="dlRailSaveSectionHint" class="opts-hint">
                ${L.savingSectionHint}
              </p>
              <div class="out-dir-row" role="group" aria-labelledby="dlOutDirLabel">
                <span id="dlOutDirLabel" class="out-dir-label">${L.outDirLabel}</span>
                <span id="outDirText" class="out-path" title="">…</span>
                <button type="button" class="cmd cmd-icon-leading" id="openOutBtn" title="${L.openOutTitle}" aria-describedby="dlRailSaveSectionHint"><span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.folder, 14)}</span>${L.openOut}</button>
                <button type="button" class="cmd cmd-icon-leading" id="pickOutBtn" aria-describedby="dlRailSaveSectionHint"><span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(QUEUE_ROW_ACTION_ICONS.plus, 14)}</span>${L.pickOut}</button>
                <button type="button" class="cmd cmd-icon-leading" id="resetOutBtn" title="${L.resetOutTitle}" aria-describedby="dlRailSaveSectionHint"><span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(DOWNLOADS_TOPBAR_CLUSTER_ICONS.home, 14)}</span>${L.resetOut}</button>
              </div>
              <label for="tmplInput">${L.tmplLabel}</label>
              <input type="text" id="tmplInput" spellcheck="false" autocomplete="off" aria-describedby="dlRailSaveSectionHint" />
              <div class="opts-actions">
                <button type="button" class="cmd cmd-primary cmd-icon-leading" id="applyOptsBtn" aria-describedby="dlRailSaveSectionHint"><span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(EDITOR_TOPBAR_ACTION_ICONS.save, 14)}</span>${L.applyOpts}</button>
                <button type="button" class="cmd cmd-icon-leading" id="tmplReset" aria-describedby="dlRailSaveSectionHint"><span class="cmd-ico" aria-hidden="true">${emitInlineStrokeSvg(EDITOR_TOPBAR_TOOLS_ICONS.rotateCcw, 14)}</span>${L.tmplReset}</button>
              </div>
            </div>
          </details>
          <details class="settings-section" id="dlRailNet"${openAttr('network', false)}>
            <summary>${L.networkSummary}</summary>
            <div class="settings-body" aria-describedby="dlRailNetSectionHint">
              <p id="dlRailNetSectionHint" class="opts-hint">
                ${L.networkSectionHint}
              </p>
              <label for="rateLimitInput">${L.rateLimitLabel}</label>
              <input type="text" id="rateLimitInput" spellcheck="false" autocomplete="off" placeholder="${L.rateLimitPlaceholder}" aria-describedby="dlRailNetSectionHint" />
              <label for="retriesInput">${L.retriesLabel}</label>
              <input type="text" id="retriesInput" inputmode="numeric" spellcheck="false" autocomplete="off" placeholder="${L.retriesPlaceholder}" aria-describedby="dlRailNetSectionHint" />
              <label for="fragmentRetriesInput">${L.fragmentRetriesLabel}</label>
              <input type="text" id="fragmentRetriesInput" inputmode="numeric" spellcheck="false" autocomplete="off" placeholder="${L.retriesPlaceholder}" aria-describedby="dlRailNetSectionHint" />
              <label for="queueRetrySelect">${L.queueRetryLabel}</label>
              <select id="queueRetrySelect" aria-describedby="dlRailNetSectionHint">
                <option value="off">${L.queueRetryOff}</option>
                <option value="light">${L.queueRetryLight}</option>
                <option value="normal">${L.queueRetryNormal}</option>
                <option value="persistent">${L.queueRetryPersistent}</option>
              </select>
            </div>
          </details>
          <details class="settings-section" id="expertArgsDetails"${openAttr('expert', false)}>
            <summary>${L.expertSummary}</summary>
            <div class="settings-body" aria-describedby="dlRailExpertSectionHint">
              <p id="dlRailExpertSectionHint" class="opts-hint">
                ${L.expertSectionHintBeforeLinks}
                <a href="${YTDLP_DOC_README}" target="_blank" rel="noreferrer">README</a> ·
                <a href="${YTDLP_DOC_FORMAT_SELECTION}" target="_blank" rel="noreferrer">${L.docFormats}</a> ·
                <a href="${YTDLP_DOC_OUTPUT_TEMPLATE}" target="_blank" rel="noreferrer">${L.docOutputTemplate}</a> ·
                <a href="${YTDLP_DOC_POSTPROCESS}" target="_blank" rel="noreferrer">${L.docPostprocess}</a>${L.expertSectionHintAfterLinks}
              </p>
              <label for="extraArgsInput">${L.extraArgsLabel}</label>
              <textarea id="extraArgsInput" rows="2" spellcheck="false" autocomplete="off" placeholder="${L.extraArgsPlaceholder}" aria-describedby="dlRailExpertSectionHint"></textarea>
              <p class="opts-hint opts-warn" id="extraArgsWarn" hidden></p>
              <label for="previewOutDirOverride">${L.previewOutDirLabel}</label>
              <input type="text" id="previewOutDirOverride" spellcheck="false" autocomplete="off" placeholder="${L.previewOutDirPlaceholder}" aria-describedby="dlRailExpertSectionHint" />
              <span class="opts-preview-label">${L.argsPreviewLabel}</span>
              <pre class="args-preview" id="argsPreview" aria-label="${L.argsPreviewAria}" aria-describedby="dlRailExpertSectionHint"></pre>
              <details class="hints-panel details-chev" id="hintsPanel"${openAttr('hints', false)}>
                <summary>${L.hintsPanelSummary}</summary>
                <p id="hintCatalogIntro" class="opts-hint">${L.hintCatalogIntro}</p>
                <div class="hints-search">
                  <label class="opts-preview-label" for="hintFilter">${L.hintCatalogFilterLabel}</label>
                  <input type="text" id="hintFilter" spellcheck="false" autocomplete="off" placeholder="${L.hintFilterPlaceholder}" aria-describedby="hintCatalogIntro dlRailExpertSectionHint" aria-label="${L.hintFilterAria}" />
                </div>
                <div class="hint-list" id="hintList" role="list" aria-label="${L.hintListAria}"></div>
              </details>
            </div>
          </details>
        </div>
      </aside>
    </main>
    <p class="note">${L.footerNote}</p>
  </div>
  <script>
    (function () {
      var DL_I18N = ${dlScriptI18nJson};
      var DL_LOCALE_CMP = ${dlLocaleCmpJson};
      var _ytdlpHintCatOrder = ${ytdlpHintCatOrderJson};
      var QS_WAITING = ${JSON.stringify(YTDLP_QUEUE_STATUS_WAITING)};
      var QS_RUNNING = ${JSON.stringify(YTDLP_QUEUE_STATUS_RUNNING)};
      var QS_RETRY = ${JSON.stringify(YTDLP_QUEUE_STATUS_RETRY_PAUSE_PREFIX)};
      var QS_DONE = ${JSON.stringify(YTDLP_QUEUE_STATUS_DONE)};
      var QS_CANCELLED = ${JSON.stringify(YTDLP_QUEUE_STATUS_CANCELLED)};
      var QS_ERR = ${JSON.stringify(YTDLP_QUEUE_STATUS_ERROR_PREFIX)};
      function _ytdlpCatRank(c) {
        var i = _ytdlpHintCatOrder.indexOf(c);
        return i === -1 ? _ytdlpHintCatOrder.length - 1 : i;
      }
      function _ytdlpCmpCat(a, b) {
        var ra = _ytdlpCatRank(a);
        var rb = _ytdlpCatRank(b);
        if (ra !== rb) return ra - rb;
        return a.localeCompare(b, DL_LOCALE_CMP);
      }
      var api = window.fluxalloyDownloads;
      var addBtn = document.getElementById('addBtn');
      var clearBtn = document.getElementById('clearBtn');
      var clearFinishedBtn = document.getElementById('clearFinishedBtn');
      var startBtn = document.getElementById('startBtn');
      var pauseYtdlpBtn = document.getElementById('pauseYtdlpBtn');
      var cancelBtn = document.getElementById('cancelBtn');
      var urls = document.getElementById('urls');
      var body = document.getElementById('queueBody');
      var queueStatusFilter = document.getElementById('queueStatusFilter');
      var queueSummary = document.getElementById('queueSummary');
      var scrollToRailBtn = document.getElementById('scrollToRailBtn');
      var outDirText = document.getElementById('outDirText');
      var openOutBtn = document.getElementById('openOutBtn');
      var pickOutBtn = document.getElementById('pickOutBtn');
      var resetOutBtn = document.getElementById('resetOutBtn');
      var tmplInput = document.getElementById('tmplInput');
      var fmtPreset = document.getElementById('fmtPreset');
      var applyOptsBtn = document.getElementById('applyOptsBtn');
      var tmplReset = document.getElementById('tmplReset');
      var pillPlaylist = document.getElementById('pillPlaylist');
      var pillAudioOnly = document.getElementById('pillAudioOnly');
      var subPreset = document.getElementById('subPreset');
      var subLangsInput = document.getElementById('subLangsInput');
      var cookiesBrowserSelect = document.getElementById('cookiesBrowserSelect');
      var cookiesBrowserProfileInput = document.getElementById('cookiesBrowserProfileInput');
      var cookiesPathText = document.getElementById('cookiesPathText');
      var pickCookiesBtn = document.getElementById('pickCookiesBtn');
      var clearCookiesBtn = document.getElementById('clearCookiesBtn');
      var cookiesWarn = document.getElementById('cookiesWarn');
      var impersonateSelect = document.getElementById('impersonateSelect');
      var rateLimitInput = document.getElementById('rateLimitInput');
      var retriesInput = document.getElementById('retriesInput');
      var fragmentRetriesInput = document.getElementById('fragmentRetriesInput');
      var queueRetrySelect = document.getElementById('queueRetrySelect');
      var pillOpenInHandler = document.getElementById('pillOpenInHandler');
      var pillAutoExportAfterOpen = document.getElementById('pillAutoExportAfterOpen');
      var pillEnqueueBatch = document.getElementById('pillEnqueueBatch');
      var pillAutoStartBatch = document.getElementById('pillAutoStartBatch');
      var extraArgsInput = document.getElementById('extraArgsInput');
      var previewOutDirOverride = document.getElementById('previewOutDirOverride');
      var argsPreview = document.getElementById('argsPreview');
      var extraArgsWarn = document.getElementById('extraArgsWarn');
      var hintFilter = document.getElementById('hintFilter');
      var hintList = document.getElementById('hintList');
      var historyBody = document.getElementById('historyBody');
      var refreshHistoryBtn = document.getElementById('refreshHistoryBtn');
      var clearHistoryBtn = document.getElementById('clearHistoryBtn');
      var historyOutcomeFilter = document.getElementById('historyOutcomeFilter');
      var narrowPopoutMq = window.matchMedia('(max-width: 960px)');
      function syncScrollToRailBtn() {
        if (!scrollToRailBtn) return;
        scrollToRailBtn.hidden = !narrowPopoutMq.matches;
      }
      function onScrollToRailClick() {
        var rail = document.getElementById('dl-ytdlp-settings-rail');
        if (rail) {
          rail.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      if (scrollToRailBtn) {
        scrollToRailBtn.addEventListener('click', onScrollToRailClick);
      }
      narrowPopoutMq.addEventListener('change', syncScrollToRailBtn);
      window.addEventListener('resize', syncScrollToRailBtn);
      syncScrollToRailBtn();
      var historyRefreshTimer = null;
      var lastHistoryEntries = [];
      var lastQueueRows = [];
      /** После первого полного заполнения формы из main — черновик для превью argv совпадает с полями UI. */
      var cliFormHydrated = false;
      /** §4.1 — не писать в settings при программном открытии details (лог при старте строки очереди). */
      var suppressDetailsUiPersist = false;
      var suppressDetailsUiPersistTimer = null;

      function pillIsOn(btn) {
        return !!(btn && btn.getAttribute('aria-checked') === 'true');
      }
      function pillSet(btn, on) {
        if (!btn) return;
        btn.setAttribute('aria-checked', on ? 'true' : 'false');
        btn.classList.toggle('pill-switch-on', on);
        var txt = btn.querySelector('.pill-switch-text');
        if (txt) txt.textContent = on ? DL_I18N.pillOn : DL_I18N.pillOff;
      }
      function pillToggle(btn) {
        pillSet(btn, !pillIsOn(btn));
      }
      function syncFmtPresetAudioLock() {
        if (!fmtPreset || !pillAudioOnly) return;
        fmtPreset.disabled = pillIsOn(pillAudioOnly);
      }

      function syncAutoExportPillLocked() {
        if (!pillAutoExportAfterOpen) return;
        var openOn = !!(pillOpenInHandler && pillIsOn(pillOpenInHandler));
        pillAutoExportAfterOpen.disabled = !openOn;
        if (!openOn && pillIsOn(pillAutoExportAfterOpen)) {
          pillSet(pillAutoExportAfterOpen, false);
        }
      }

      function syncAutoStartBatchPillLocked() {
        if (!pillAutoStartBatch) return;
        var enqueueOn = !!(pillEnqueueBatch && pillIsOn(pillEnqueueBatch));
        pillAutoStartBatch.disabled = !enqueueOn;
        if (!enqueueOn && pillIsOn(pillAutoStartBatch)) {
          pillSet(pillAutoStartBatch, false);
        }
      }

      function collectDraftCliPatch() {
        return {
          filenameTemplate: tmplInput ? tmplInput.value : '',
          formatPreset: fmtPreset ? fmtPreset.value : 'default',
          downloadPlaylist: pillIsOn(pillPlaylist),
          audioOnly: pillIsOn(pillAudioOnly),
          subtitlePreset: subPreset ? subPreset.value : 'none',
          subLangs: subLangsInput ? subLangsInput.value : '',
          cookiesBrowser: cookiesBrowserSelect ? cookiesBrowserSelect.value : 'none',
          cookiesBrowserProfile: cookiesBrowserProfileInput ? cookiesBrowserProfileInput.value : '',
          impersonate: impersonateSelect ? impersonateSelect.value : 'none',
          rateLimit: rateLimitInput ? rateLimitInput.value : '',
          retriesLine: retriesInput ? retriesInput.value : '',
          fragmentRetriesLine: fragmentRetriesInput ? fragmentRetriesInput.value : '',
          queueRetryProfile: queueRetrySelect ? queueRetrySelect.value : 'off',
          openInHandlerOnComplete: pillIsOn(pillOpenInHandler),
          autoExportAfterOpenInHandler: pillIsOn(pillAutoExportAfterOpen),
          enqueueBatchOnDownloadComplete: pillIsOn(pillEnqueueBatch),
          autoStartBatchAfterEnqueue: pillIsOn(pillAutoStartBatch),
          extraArgsLine: extraArgsInput ? extraArgsInput.value : ''
        };
      }

      function buildCliPreviewRequest() {
        var req = { uiLocale: DL_LOCALE_CMP };
        if (previewOutDirOverride && previewOutDirOverride.value.trim()) {
          req.previewOutputDirectory = previewOutDirOverride.value.trim();
        }
        if (cliFormHydrated) {
          req.draft = collectDraftCliPatch();
        }
        return req;
      }

      function refreshPreviewOnly() {
        api.getCliOptions(buildCliPreviewRequest()).then(function (r) {
          if (!r || r.ok !== true || !r.payload) return;
          var p = r.payload;
          if (argsPreview && typeof p.commandPreview === 'string') {
            argsPreview.textContent = p.commandPreview;
          }
          if (extraArgsWarn) {
            if (p.extraArgsParseWarning) {
              extraArgsWarn.textContent = p.extraArgsParseWarning;
              extraArgsWarn.hidden = false;
            } else {
              extraArgsWarn.textContent = '';
              extraArgsWarn.hidden = true;
            }
          }
        });
      }

      var cliPreviewTimer = null;
      function schedulePreviewRefresh() {
        if (cliPreviewTimer !== null) {
          clearTimeout(cliPreviewTimer);
        }
        cliPreviewTimer = setTimeout(function () {
          cliPreviewTimer = null;
          refreshPreviewOnly();
        }, 400);
      }

      if (pillPlaylist) {
        pillPlaylist.addEventListener('click', function () {
          pillToggle(pillPlaylist);
          schedulePreviewRefresh();
        });
      }
      if (pillAudioOnly) {
        pillAudioOnly.addEventListener('click', function () {
          pillToggle(pillAudioOnly);
          syncFmtPresetAudioLock();
          schedulePreviewRefresh();
        });
      }
      if (pillOpenInHandler) {
        pillOpenInHandler.addEventListener('click', function () {
          pillToggle(pillOpenInHandler);
          syncAutoExportPillLocked();
          schedulePreviewRefresh();
        });
      }
      if (pillAutoExportAfterOpen) {
        pillAutoExportAfterOpen.addEventListener('click', function () {
          if (pillAutoExportAfterOpen.disabled) return;
          pillToggle(pillAutoExportAfterOpen);
          schedulePreviewRefresh();
        });
      }
      if (pillEnqueueBatch) {
        pillEnqueueBatch.addEventListener('click', function () {
          pillToggle(pillEnqueueBatch);
          syncAutoStartBatchPillLocked();
          schedulePreviewRefresh();
        });
      }
      if (pillAutoStartBatch) {
        pillAutoStartBatch.addEventListener('click', function () {
          if (pillAutoStartBatch.disabled) return;
          pillToggle(pillAutoStartBatch);
          schedulePreviewRefresh();
        });
      }

      function formatHistoryWhen(ms) {
        try {
          var d = new Date(ms);
          if (isNaN(d.getTime())) return '—';
          return d.toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'medium' });
        } catch (e) {
          return '—';
        }
      }

      function outcomeCellClass(o) {
        if (o === 'success') return 'h-out-ok';
        if (o === 'cancelled') return 'h-out-can';
        return 'h-out-err';
      }

      function outcomeLabel(o) {
        if (o === 'success') return DL_I18N.outcomeSuccess;
        if (o === 'cancelled') return DL_I18N.outcomeCancelled;
        return DL_I18N.outcomeError;
      }

      function isRowDownloading(status) {
        return status === QS_RUNNING || (typeof status === 'string' && status.indexOf(QS_RETRY) === 0);
      }

      /** §6/v0 — stroke-иконки очереди: единый источник путей lucide-downloads-icons (shared). */
      var SVG_NS = 'http://www.w3.org/2000/svg';
      function svgEl(tag, attrs) {
        var n = document.createElementNS(SVG_NS, tag);
        if (attrs) {
          Object.keys(attrs).forEach(function (k) {
            n.setAttribute(k, attrs[k]);
          });
        }
        return n;
      }
      function svgIcon(paths) {
        var svg = svgEl('svg', {
          width: '16',
          height: '16',
          viewBox: '0 0 24 24',
          fill: 'none',
          stroke: 'currentColor',
          'stroke-width': '2',
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round'
        });
        paths.forEach(function (p) {
          var el = svgEl(p.tag, p.attr);
          svg.appendChild(el);
        });
        return svg;
      }
${emitDownloadsQueueRowIcoBootstrapJs()}

      function renderHistoryEntries(raw) {
        if (!historyBody) return;
        lastHistoryEntries = Array.isArray(raw) ? raw : [];
        var filter = historyOutcomeFilter ? historyOutcomeFilter.value : 'all';
        var list = lastHistoryEntries.filter(function (entry) {
          if (filter === 'all') return true;
          return entry && typeof entry === 'object' && entry.outcome === filter;
        });
        historyBody.replaceChildren();
        if (list.length === 0) {
          var tr0 = document.createElement('tr');
          var td0 = document.createElement('td');
          td0.colSpan = 7;
          td0.style.opacity = '0.7';
          td0.textContent = lastHistoryEntries.length === 0 ? DL_I18N.historyEmpty : DL_I18N.historyNoMatchingFilter;
          tr0.appendChild(td0);
          historyBody.appendChild(tr0);
          return;
        }
        list.forEach(function (e) {
          if (!e || typeof e !== 'object') return;
          var tr = document.createElement('tr');
          function td(cls, text) {
            var x = document.createElement('td');
            if (cls) x.className = cls;
            x.textContent = text;
            return x;
          }
          var fin = typeof e.finishedAt === 'number' ? e.finishedAt : 0;
          tr.appendChild(td('num', formatHistoryWhen(fin)));
          tr.appendChild(td('', typeof e.shortLabel === 'string' && e.shortLabel ? e.shortLabel : '—'));
          var tdUrl = document.createElement('td');
          var u = typeof e.url === 'string' ? e.url : '';
          tdUrl.title = u;
          tdUrl.textContent = u.length > 80 ? u.slice(0, 78) + '…' : (u || '—');
          tr.appendChild(tdUrl);
          var oc = typeof e.outcome === 'string' ? e.outcome : 'error';
          tr.appendChild(td(outcomeCellClass(oc), outcomeLabel(oc)));
          var code = e.exitCode;
          var codeStr = code === null || code === undefined ? '—' : String(code);
          tr.appendChild(td('num', codeStr));
          var st = typeof e.status === 'string' ? e.status : '';
          tr.appendChild(td('', st.length > 120 ? st.slice(0, 118) + '…' : (st || '—')));
          var tdAction = document.createElement('td');
          tdAction.className = 'act';
          var histWrap = document.createElement('div');
          histWrap.className = 'act-icons';
          function mkHistIcon(title, attrs, iconFn, btnClass) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'icon-btn' + (btnClass ? ' ' + btnClass : '');
            b.title = title;
            b.setAttribute('aria-label', title);
            Object.keys(attrs).forEach(function (ak) {
              b.setAttribute(ak, attrs[ak]);
            });
            b.appendChild(iconFn());
            histWrap.appendChild(b);
          }
          if (u) {
            mkHistIcon(
              DL_I18N.histReenqueueUrl,
              { 'data-history-url': u },
              RowIco.plus,
              ''
            );
          }
          if (typeof e.outputPath === 'string' && e.outputPath) {
            var hid = typeof e.id === 'string' ? e.id : '';
            mkHistIcon(
              DL_I18N.histOpenInFlux,
              { 'data-history-handler': hid },
              RowIco.outbound,
              ''
            );
            mkHistIcon(
              DL_I18N.histOpenFile,
              { 'data-history-open': 'file', 'data-history-id': hid },
              RowIco.file,
              ''
            );
            mkHistIcon(
              DL_I18N.histShowInFolder,
              { 'data-history-open': 'folder', 'data-history-id': hid },
              RowIco.folder,
              ''
            );
          }
          tdAction.appendChild(histWrap);
          tr.appendChild(tdAction);
          historyBody.appendChild(tr);
        });
      }

      function refreshHistory() {
        api.getHistory().then(renderHistoryEntries);
      }

      function scheduleHistoryRefresh() {
        if (historyRefreshTimer !== null) {
          clearTimeout(historyRefreshTimer);
        }
        historyRefreshTimer = setTimeout(function () {
          historyRefreshTimer = null;
          refreshHistory();
        }, 300);
      }

      if (refreshHistoryBtn) {
        refreshHistoryBtn.addEventListener('click', function () {
          refreshHistory();
        });
      }
      if (historyOutcomeFilter) {
        historyOutcomeFilter.addEventListener('change', function () {
          renderHistoryEntries(lastHistoryEntries);
        });
      }
      if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', function () {
          if (!window.confirm(DL_I18N.confirmClearHistory)) return;
          api.clearHistory().then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
            refreshHistory();
          });
        });
      }
      if (historyBody) {
        historyBody.addEventListener('click', function (e) {
          var handler = e.target.closest('[data-history-handler]');
          if (handler) {
            var handlerId = handler.getAttribute('data-history-handler') || '';
            api.openHistoryOutputInHandler(handlerId).then(function (res) {
              if (res && res.ok === false && res.error) window.alert(res.error);
            });
            return;
          }
          var open = e.target.closest('[data-history-open]');
          if (open) {
            var mode = open.getAttribute('data-history-open') || 'file';
            var hid = open.getAttribute('data-history-id') || '';
            api.openHistoryOutput(hid, mode).then(function (res) {
              if (res && res.ok === false && res.error) window.alert(res.error);
            });
            return;
          }
          var t = e.target.closest('[data-history-url]');
          if (!t) return;
          var url = t.getAttribute('data-history-url') || '';
          if (!url) return;
          api.addLines(url).then(function (res) {
            if (res && res.ok === false && res.error) {
              window.alert(res.error);
              return;
            }
            api.getSnapshot().then(onQueueSnapshot);
          });
        });
      }

      function applyCommandHints(hints) {
        lastCommandHints = Array.isArray(hints) ? hints : [];
        renderHintList();
      }

      var lastCommandHints = [];
      function renderHintList() {
        if (!hintList) return;
        var raw = Array.isArray(lastCommandHints) ? lastCommandHints : [];
        var q = hintFilter && typeof hintFilter.value === 'string' ? hintFilter.value.trim().toLowerCase() : '';
        hintList.replaceChildren();
        if (raw.length === 0) {
          var empty = document.createElement('div');
          empty.className = 'hint-item';
          empty.style.opacity = '0.7';
          empty.textContent = DL_I18N.hintsCatalogUnavailable;
          hintList.appendChild(empty);
          return;
        }
        var byCat = new Map();
        raw.forEach(function (h) {
          if (!h || typeof h.token !== 'string') return;
          var token = h.token;
          var summary = typeof h.summary === 'string' ? h.summary : '';
          if (q) {
            var hay = (token + ' ' + summary).toLowerCase();
            if (hay.indexOf(q) === -1) return;
          }
          var cat = typeof h.category === 'string' && h.category.length ? h.category : DL_I18N.hintCategoryFallback;
          if (!byCat.has(cat)) byCat.set(cat, []);
          byCat.get(cat).push({ token: token, summary: summary });
        });
        if (byCat.size === 0) {
          var none = document.createElement('div');
          none.className = 'hint-item';
          none.style.opacity = '0.7';
          none.textContent = DL_I18N.hintsNoMatches;
          hintList.appendChild(none);
          return;
        }
        Array.from(byCat.keys()).sort(_ytdlpCmpCat).forEach(function (cat) {
          var head = document.createElement('div');
          head.className = 'hint-cat';
          head.textContent = cat;
          hintList.appendChild(head);
          byCat.get(cat).forEach(function (row) {
            var item = document.createElement('div');
            item.className = 'hint-item';
            var btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'hint-token';
            btn.textContent = row.token;
            btn.title = row.summary || row.token;
            btn.addEventListener('click', function () {
              if (!extraArgsInput) return;
              var cur = extraArgsInput.value.trim();
              extraArgsInput.value = cur ? cur + ' ' + row.token : row.token;
              try {
                extraArgsInput.focus();
                extraArgsInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
              } catch (e) {}
              schedulePreviewRefresh();
            });
            item.appendChild(btn);
            if (row.summary) {
              var desc = document.createElement('div');
              desc.className = 'hint-desc';
              desc.textContent = row.summary;
              item.appendChild(desc);
            }
            hintList.appendChild(item);
          });
        });
      }

      if (hintFilter) {
        hintFilter.addEventListener('input', function () {
          renderHintList();
        });
      }

      function refreshCliOpts() {
        api.getCliOptions({ uiLocale: DL_LOCALE_CMP }).then(function (r) {
          if (!r || r.ok !== true || !r.payload) return;
          var p = r.payload;
          if (tmplInput) tmplInput.value = p.filenameTemplate || '';
          if (pillPlaylist && typeof p.downloadPlaylist === 'boolean') {
            pillSet(pillPlaylist, p.downloadPlaylist);
          }
          if (pillAudioOnly && typeof p.audioOnly === 'boolean') {
            pillSet(pillAudioOnly, p.audioOnly);
          }
          if (subPreset && typeof p.subtitlePreset === 'string') {
            subPreset.value = p.subtitlePreset === 'manual' || p.subtitlePreset === 'manual_auto'
              ? p.subtitlePreset
              : 'none';
          }
          if (subLangsInput && typeof p.subLangsLine === 'string') {
            subLangsInput.value = p.subLangsLine;
          }
          if (cookiesBrowserSelect && typeof p.cookiesBrowserChoice === 'string') {
            var cb = p.cookiesBrowserChoice;
            cookiesBrowserSelect.value =
              cb === 'chrome' || cb === 'edge' || cb === 'firefox' ? cb : 'none';
          }
          if (cookiesBrowserProfileInput && typeof p.cookiesBrowserProfileLine === 'string') {
            cookiesBrowserProfileInput.value = p.cookiesBrowserProfileLine;
          }
          if (cookiesPathText && typeof p.cookiesFilePathStored === 'string') {
            var cp = p.cookiesFilePathStored;
            cookiesPathText.textContent = cp.length > 0 ? cp : '—';
            cookiesPathText.title = cp.length > 0 ? cp : '';
          }
          if (cookiesWarn) {
            if (p.cookiesWarning) {
              cookiesWarn.textContent = p.cookiesWarning;
              cookiesWarn.hidden = false;
            } else {
              cookiesWarn.textContent = '';
              cookiesWarn.hidden = true;
            }
          }
          if (impersonateSelect && typeof p.impersonateChoice === 'string') {
            var im = p.impersonateChoice;
            impersonateSelect.value =
              im === 'chrome' || im === 'edge' || im === 'firefox' ? im : 'none';
          }
          if (rateLimitInput && typeof p.rateLimit === 'string') {
            rateLimitInput.value = p.rateLimit;
          }
          if (retriesInput && typeof p.retriesLine === 'string') {
            retriesInput.value = p.retriesLine;
          }
          if (fragmentRetriesInput && typeof p.fragmentRetriesLine === 'string') {
            fragmentRetriesInput.value = p.fragmentRetriesLine;
          }
          if (queueRetrySelect && typeof p.queueRetryProfile === 'string') {
            var qv = p.queueRetryProfile;
            queueRetrySelect.value =
              qv === 'light' || qv === 'normal' || qv === 'persistent' ? qv : 'off';
          }
          if (pillOpenInHandler && typeof p.openInHandlerOnComplete === 'boolean') {
            pillSet(pillOpenInHandler, p.openInHandlerOnComplete);
          }
          if (pillAutoExportAfterOpen && typeof p.autoExportAfterOpenInHandler === 'boolean') {
            pillSet(pillAutoExportAfterOpen, p.autoExportAfterOpenInHandler);
          }
          if (pillEnqueueBatch && typeof p.enqueueBatchOnDownloadComplete === 'boolean') {
            pillSet(pillEnqueueBatch, p.enqueueBatchOnDownloadComplete);
          }
          if (pillAutoStartBatch && typeof p.autoStartBatchAfterEnqueue === 'boolean') {
            pillSet(pillAutoStartBatch, p.autoStartBatchAfterEnqueue);
          }
          syncAutoExportPillLocked();
          syncAutoStartBatchPillLocked();
          if (!fmtPreset) return;
          fmtPreset.replaceChildren();
          (p.formatPresetChoices || []).forEach(function (c) {
            var o = document.createElement('option');
            o.value = c.id;
            o.textContent = c.label;
            fmtPreset.appendChild(o);
          });
          fmtPreset.value = p.formatPreset || 'default';
          syncFmtPresetAudioLock();
          if (extraArgsInput && typeof p.extraArgsLine === 'string') {
            extraArgsInput.value = p.extraArgsLine;
          }
          if (argsPreview && typeof p.commandPreview === 'string') {
            argsPreview.textContent = p.commandPreview;
          }
          if (extraArgsWarn) {
            if (p.extraArgsParseWarning) {
              extraArgsWarn.textContent = p.extraArgsParseWarning;
              extraArgsWarn.hidden = false;
            } else {
              extraArgsWarn.textContent = '';
              extraArgsWarn.hidden = true;
            }
          }
          applyCommandHints(p.commandHints);
          cliFormHydrated = true;
          refreshPreviewOnly();
        });
      }

      function refreshOutDir() {
        api.getOutputDirectory().then(function (r) {
          if (!r || typeof r.path !== 'string') return;
          outDirText.textContent = r.path;
          outDirText.title = r.path;
          resetOutBtn.disabled = r.isDefault === true;
        });
      }
      var logPre = document.getElementById('logPre');
      var logDetails = document.getElementById('logDetails');
      var saveLogBtn = document.getElementById('saveLogBtn');
      var clearLogBtn = document.getElementById('clearLogBtn');
      var logMeta = document.getElementById('logMeta');
      var logTargetRowId = null;
      var maxLogChars = 240000;

      function getVisibleLogPlainText() {
        if (!logPre) return '';
        var parts = [];
        logPre.querySelectorAll('.log-line').forEach(function (el) {
          parts.push(el.textContent || '');
        });
        return parts.length ? parts.join('\\n') + '\\n' : '';
      }

      function updateLogMeta() {
        if (!logMeta || !logPre) return;
        var lines = logPre.querySelectorAll('.log-line').length;
        var chars = logPre.textContent.length;
        var sz = chars >= 1024 ? (Math.round((chars / 1024) * 10) / 10) + ' KiB' : chars + ' B';
        logMeta.textContent = lines + ' ' + DL_I18N.logLinesWord + ' · ' + sz;
      }

      function trimLogDom() {
        if (!logPre) return;
        while (logPre.textContent.length > maxLogChars && logPre.firstChild) {
          logPre.removeChild(logPre.firstChild);
        }
      }

      function appendLogLine(stream, text) {
        if (!logPre) return;
        var wrap = document.createElement('span');
        wrap.className = 'log-line log-line-' + (stream === 'stdout' ? 'out' : 'err');
        var tag = document.createElement('span');
        tag.className = 'log-line-tag';
        tag.textContent = stream === 'stdout' ? 'out ' : 'err ';
        var body = document.createElement('span');
        body.className = 'log-line-body';
        body.textContent = text;
        wrap.appendChild(tag);
        wrap.appendChild(body);
        logPre.appendChild(wrap);
        trimLogDom();
        logPre.scrollTop = logPre.scrollHeight;
        updateLogMeta();
      }

      function clearVisibleLog() {
        if (!logPre) return;
        logPre.replaceChildren();
        updateLogMeta();
      }

      api.onLog(function (payload) {
        if (!payload || typeof payload !== 'object') return;
        if (payload.kind === 'reset') {
          logTargetRowId = payload.rowId;
          clearVisibleLog();
          if (logDetails && !logDetails.open) {
            suppressDetailsUiPersist = true;
            if (suppressDetailsUiPersistTimer !== null) {
              window.clearTimeout(suppressDetailsUiPersistTimer);
            }
            logDetails.open = true;
            suppressDetailsUiPersistTimer = window.setTimeout(function () {
              suppressDetailsUiPersist = false;
              suppressDetailsUiPersistTimer = null;
            }, 0);
          }
          return;
        }
        if (payload.kind === 'line' && payload.rowId === logTargetRowId) {
          appendLogLine(payload.stream, payload.text);
        }
      });
      updateLogMeta();
      if (clearLogBtn) {
        clearLogBtn.addEventListener('click', function () {
          clearVisibleLog();
        });
      }
      if (saveLogBtn) {
        saveLogBtn.addEventListener('click', function () {
          var text = getVisibleLogPlainText();
          if (!text.trim()) {
            window.alert(DL_I18N.logEmptyAlert);
            return;
          }
          api.saveVisibleLog(text).then(function (res) {
            if (res && res.ok === false && res.error && res.error !== ${JSON.stringify(DOWNLOADS_VISIBLE_LOG_SAVE_CANCELLED)}) {
              window.alert(res.error);
            }
          });
        });
      }

      function rowShape(r) {
        return r && typeof r.id === 'number' && typeof r.url === 'string';
      }

      function rowCanRetry(status) {
        if (status === QS_WAITING || status === QS_RUNNING) return false;
        return !(typeof status === 'string' && status.indexOf(QS_RETRY) === 0);
      }

      function queueRowMatchesFilter(row, filter) {
        var status = typeof row.status === 'string' ? row.status : '';
        if (filter === 'all') return true;
        if (filter === 'waiting') return status === QS_WAITING;
        if (filter === 'running') return status === QS_RUNNING || status.indexOf(QS_RETRY) === 0;
        if (filter === 'done') return status === QS_DONE;
        if (filter === 'cancelled') return status === QS_CANCELLED;
        if (filter === 'error') return status.indexOf(QS_ERR) === 0;
        return true;
      }

      function statusClass(status) {
        if (status === QS_RUNNING || status.indexOf(QS_RETRY) === 0) return 'status-running';
        if (status === QS_DONE) return 'status-done';
        if (status === QS_CANCELLED) return 'status-cancelled';
        if (status.indexOf(QS_ERR) === 0) return 'status-error';
        return 'status-waiting';
      }

      function parseProgressPercent(text) {
        var m = String(text || '').match(/(\\d+(?:[.,]\\d+)?)\\s*%/);
        if (!m) return null;
        var n = Number(m[1].replace(',', '.'));
        if (!isFinite(n)) return null;
        return Math.max(0, Math.min(100, n));
      }

      function tdProgress(row) {
        var td = document.createElement('td');
        td.className = 'prog';
        var raw =
          row && typeof row.progress === 'string' && row.progress.trim().length > 0 ? row.progress.trim() : '—';
        var status = typeof (row && row.status) === 'string' ? row.status : '';
        var segs = raw === '—' ? [] : raw.split(' · ');
        var head = segs.length > 0 && segs[0] ? segs[0].trim() : raw;
        var pct = parseProgressPercent(head);
        if (status === QS_DONE) {
          pct = 100;
        }
        var showBar = pct !== null && isFinite(pct);
        if (status === QS_WAITING) {
          showBar = false;
        }
        var stack = document.createElement('div');
        stack.className = 'prog-stack';
        if (showBar && pct !== null) {
          var rowBar = document.createElement('div');
          rowBar.className = 'prog-bar-row';
          var track = document.createElement('div');
          track.className = 'progress-track';
          var fill = document.createElement('div');
          var done = status === QS_DONE;
          fill.className = 'progress-fill' + (done ? ' progress-fill-done' : '');
          fill.style.width = Math.max(0, Math.min(100, pct)) + '%';
          track.appendChild(fill);
          rowBar.appendChild(track);
          var pctEl = document.createElement('span');
          pctEl.className = 'prog-pct' + (done ? ' prog-pct-done' : '');
          pctEl.textContent = Math.round(pct) + '%';
          rowBar.appendChild(pctEl);
          stack.appendChild(rowBar);
        }
        var subline = '';
        if (raw === '—') {
          subline = '—';
        } else if (segs.length > 1) {
          subline = segs.slice(1).join(' · ').trim();
        } else if (!showBar) {
          subline = head;
        }
        if (subline) {
          var label = document.createElement('div');
          label.className = 'prog-head';
          label.textContent = subline;
          stack.appendChild(label);
        }
        td.appendChild(stack);
        return td;
      }
      function snapStr(row, key) {
        var v = row[key];
        return typeof v === 'string' && v.trim().length > 0 ? v.trim() : '';
      }
      function tdFmtCell(row) {
        var td = document.createElement('td');
        td.className = 'queue-col-fmt';
        var full = snapStr(row, 'queueFmt');
        if (!full.length) {
          td.textContent = '—';
          return td;
        }
        td.title = full;
        td.textContent = full.length > 24 ? full.slice(0, 22) + '…' : full;
        return td;
      }
      function tdSizeCell(row) {
        var td = document.createElement('td');
        td.className = 'queue-col-size';
        var s = snapStr(row, 'queueSize');
        td.textContent = s.length ? s : '—';
        return td;
      }
      function tdSpdCell(row) {
        var td = document.createElement('td');
        td.className = 'queue-col-spd';
        var s = snapStr(row, 'queueSpeed');
        td.textContent = s.length ? s : '—';
        td.title = s.length > 36 ? s : '';
        return td;
      }
      function tdEtaCell(row) {
        var td = document.createElement('td');
        td.className = 'queue-col-eta';
        var s = snapStr(row, 'queueEta');
        td.textContent = s.length ? s : '—';
        return td;
      }

      function tdStatus(status) {
        var td = document.createElement('td');
        var s = status || '—';
        var pill = document.createElement('span');
        pill.className = 'status-pill ' + statusClass(s);
        pill.title = s;
        var dot = document.createElement('span');
        dot.className = 'status-dot';
        var label = document.createElement('span');
        label.textContent = s;
        pill.appendChild(dot);
        pill.appendChild(label);
        td.appendChild(pill);
        return td;
      }

      function updateQueueSummary(rows) {
        if (!queueSummary) return;
        var total = rows.length;
        var waiting = 0;
        var running = 0;
        var done = 0;
        var error = 0;
        var cancelled = 0;
        rows.forEach(function (row) {
          var status = typeof row.status === 'string' ? row.status : '';
          if (status === QS_WAITING) waiting += 1;
          else if (status === QS_RUNNING || status.indexOf(QS_RETRY) === 0) running += 1;
          else if (status === QS_DONE) done += 1;
          else if (status === QS_CANCELLED) cancelled += 1;
          else if (status.indexOf(QS_ERR) === 0) error += 1;
        });
        queueSummary.textContent =
          DL_I18N.queueTotal + ' ' + total +
          ' · ' + DL_I18N.queueWaiting + ' ' + waiting +
          ' · ' + DL_I18N.queueRunning + ' ' + running +
          ' · ' + DL_I18N.queueDone + ' ' + done +
          ' · ' + DL_I18N.queueErrors + ' ' + error +
          ' · ' + DL_I18N.queueCancelled + ' ' + cancelled;
      }

      function renderRows(rawRows) {
        lastQueueRows = Array.isArray(rawRows) ? rawRows.filter(rowShape) : [];
        updateQueueSummary(lastQueueRows);
        var filter = queueStatusFilter ? queueStatusFilter.value : 'all';
        var rows = lastQueueRows.filter(function (row) {
          return queueRowMatchesFilter(row, filter);
        });
        body.replaceChildren();
        if (rows.length === 0) {
          var tr0 = document.createElement('tr');
          var td0 = document.createElement('td');
          td0.colSpan = 9;
          td0.style.opacity = '0.7';
          td0.textContent = lastQueueRows.length === 0 ? DL_I18N.queueEmpty : DL_I18N.queueNoMatchingFilter;
          tr0.appendChild(td0);
          body.appendChild(tr0);
          return;
        }
        rows.forEach(function (r, i) {
          var tr = document.createElement('tr');
          function tdText(cls, text) {
            var td = document.createElement('td');
            if (cls) td.className = cls;
            td.textContent = text;
            return td;
          }
          tr.appendChild(tdText('num', String(i + 1)));
          var tdTitle = document.createElement('td');
          var name = document.createElement('div');
          name.className = 'queue-title';
          name.textContent = r.shortLabel || '—';
          var url = document.createElement('div');
          url.className = 'queue-url';
          url.title = r.url;
          url.textContent = r.url.length > 120 ? r.url.slice(0, 118) + '…' : r.url;
          tdTitle.appendChild(name);
          tdTitle.appendChild(url);
          tr.appendChild(tdTitle);
          tr.appendChild(tdFmtCell(r));
          tr.appendChild(tdSizeCell(r));
          tr.appendChild(tdProgress(r));
          tr.appendChild(tdSpdCell(r));
          tr.appendChild(tdEtaCell(r));
          tr.appendChild(tdStatus(r.status || '—'));
          var tdAct = document.createElement('td');
          tdAct.className = 'act';
          var wrap = document.createElement('div');
          wrap.className = 'act-icons';
          function mkIcon(act, title, id, nodeFn, btnClass) {
            var b = document.createElement('button');
            b.type = 'button';
            b.className = 'icon-btn' + (btnClass ? ' ' + btnClass : '');
            b.setAttribute('data-act', act);
            b.setAttribute('data-id', String(id));
            b.title = title;
            b.setAttribute('aria-label', title);
            b.appendChild(nodeFn());
            wrap.appendChild(b);
          }
          var st = typeof r.status === 'string' ? r.status : '';
          var activeRun = !!r.isActiveRunner;
          var dl = isRowDownloading(st);
          if (dl && activeRun) {
            mkIcon(
              'row-cancel',
              DL_I18N.rowCancelYtdlp,
              r.id,
              RowIco.stop,
              'icon-btn-warn'
            );
          }
          if (dl && activeRun) {
            var canPause = r.ytdlpPauseSupported && r.ytdlpPauseChildActive;
            if (canPause) {
              var pTitle = r.ytdlpPaused ? DL_I18N.rowResumeYtdlp : DL_I18N.rowPauseYtdlp;
              var pFactory = r.ytdlpPaused ? RowIco.play : RowIco.pause;
              mkIcon('row-pause-toggle', pTitle, r.id, pFactory, '');
            } else {
              var bPause = document.createElement('button');
              bPause.type = 'button';
              bPause.className = 'icon-btn';
              bPause.disabled = true;
              bPause.title = !r.ytdlpPauseSupported
                ? DL_I18N.pauseUnsupportedWinTitle
                : DL_I18N.rowPauseYtdlp;
              bPause.setAttribute('aria-label', bPause.title);
              bPause.appendChild(RowIco.pause());
              wrap.appendChild(bPause);
            }
          }
          if (st === QS_WAITING) {
            mkIcon('start', DL_I18N.rowStartThisLine, r.id, RowIco.play, '');
          } else if (rowCanRetry(st)) {
            mkIcon('retry', DL_I18N.rowRetryDownload, r.id, RowIco.retry, '');
          }
          var outp = typeof r.outputPath === 'string' && r.outputPath;
          if (outp) {
            mkIcon(
              'open-handler',
              DL_I18N.rowOpenInFlux,
              r.id,
              RowIco.outbound,
              ''
            );
            mkIcon('open-file', DL_I18N.rowOpenFile, r.id, RowIco.file, '');
            mkIcon('open-folder', DL_I18N.rowShowInFolder, r.id, RowIco.folder, '');
          } else {
            mkIcon('open-folder', DL_I18N.rowOpenDownloadFolder, r.id, RowIco.folder, '');
          }
          mkIcon('up', DL_I18N.rowMoveUp, r.id, RowIco.chevUp, '');
          mkIcon('dn', DL_I18N.rowMoveDown, r.id, RowIco.chevDown, '');
          mkIcon('rm', DL_I18N.rowRemoveFromQueue, r.id, RowIco.trash, '');
          tdAct.appendChild(wrap);
          tr.appendChild(tdAct);
          body.appendChild(tr);
        });
      }

      body.addEventListener('click', function (e) {
        var t = e.target.closest('[data-act]');
        if (!t) return;
        var act = t.getAttribute('data-act');
        var id = Number(t.getAttribute('data-id'));
        if (act === 'rm') {
          api.removeRow(id).then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
          });
        }
        else if (act === 'up' || act === 'dn') {
          api.moveRow(id, act === 'up' ? -1 : 1).then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
          });
        }
        else if (act === 'retry') {
          api.retryRow(id).then(function (res) {
            if (res && res.ok === false && res.error) {
              window.alert(res.error);
            }
          });
        }
        else if (act === 'open-file' || act === 'open-folder') {
          api.openQueueOutput(id, act === 'open-folder' ? 'folder' : 'file').then(function (res) {
            if (res && res.ok === false && res.error) {
              window.alert(res.error);
            }
          });
        }
        else if (act === 'open-handler') {
          api.openQueueOutputInHandler(id).then(function (res) {
            if (res && res.ok === false && res.error) {
              window.alert(res.error);
            }
          });
        }
        else if (act === 'start') {
          api.startRow(id).then(function (res) {
            if (res && res.ok === false && res.error) {
              window.alert(res.error);
            }
          });
        } else if (act === 'row-cancel') {
          api.cancelQueue().then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
            refreshPauseBtn();
          });
        } else if (act === 'row-pause-toggle') {
          api.getYtdlpPauseState().then(function (s) {
            if (!s || !s.supported || !s.active) return;
            var p = s.paused ? api.resumeYtdlp() : api.pauseYtdlp();
            p.then(function (res) {
              if (res && res.ok === false && res.error) window.alert(res.error);
              refreshPauseBtn();
              api.getSnapshot().then(onQueueSnapshot);
            });
          });
        }
      });
      if (queueStatusFilter) {
        queueStatusFilter.addEventListener('change', function () {
          renderRows(lastQueueRows);
        });
      }

      addBtn.addEventListener('click', function () {
        api.addLines(urls.value).then(function (res) {
          if (res && res.ok === false && res.error) {
            window.alert(res.error);
            return;
          }
          urls.value = '';
        });
      });
      clearBtn.addEventListener('click', function () {
        api.clearQueue().then(function (res) {
          if (res && res.ok === false && res.error) window.alert(res.error);
        });
      });
      if (clearFinishedBtn) {
        clearFinishedBtn.addEventListener('click', function () {
          api.clearFinishedRows().then(function (res) {
            if (res && res.ok === false && res.error) {
              window.alert(res.error);
              return;
            }
            api.getSnapshot().then(onQueueSnapshot);
          });
        });
      }
      startBtn.addEventListener('click', function () {
        api.startQueue().then(function (res) {
          if (res && res.ok === false && res.error) window.alert(res.error);
        });
      });
      function refreshPauseBtn() {
        if (!pauseYtdlpBtn || !api.getYtdlpPauseState) return;
        api.getYtdlpPauseState().then(function (s) {
          if (!pauseYtdlpBtn) return;
          if (!s.supported) {
            pauseYtdlpBtn.disabled = true;
            pauseYtdlpBtn.textContent = DL_I18N.toolbarPause;
            pauseYtdlpBtn.title = DL_I18N.pauseUnsupportedWinTitle;
            return;
          }
          pauseYtdlpBtn.disabled = !s.active;
          if (!s.active) {
            pauseYtdlpBtn.textContent = DL_I18N.toolbarPause;
            pauseYtdlpBtn.title = DL_I18N.pauseTitleSigstop;
          } else if (s.paused) {
            pauseYtdlpBtn.textContent = DL_I18N.pauseToolbarResume;
            pauseYtdlpBtn.title = DL_I18N.resumeTitleSigcont;
          } else {
            pauseYtdlpBtn.textContent = DL_I18N.toolbarPause;
            pauseYtdlpBtn.title = DL_I18N.pauseTitleSigstop;
          }
        });
      }
      if (pauseYtdlpBtn) {
        pauseYtdlpBtn.addEventListener('click', function () {
          api.getYtdlpPauseState().then(function (s) {
            if (!s.supported || !s.active) return;
            var p = s.paused ? api.resumeYtdlp() : api.pauseYtdlp();
            p.then(function (res) {
              if (res && res.ok === false && res.error) window.alert(res.error);
              refreshPauseBtn();
            });
          });
        });
      }
      cancelBtn.addEventListener('click', function () {
        api.cancelQueue();
      });

      pickOutBtn.addEventListener('click', function () {
        api.pickOutputDirectory().then(function (res) {
          if (res && res.ok === false && res.error) window.alert(res.error);
          refreshOutDir();
          schedulePreviewRefresh();
        });
      });
      openOutBtn.addEventListener('click', function () {
        api.openOutputDirectory().then(function (res) {
          if (res && res.ok === false && res.error) window.alert(res.error);
        });
      });
      resetOutBtn.addEventListener('click', function () {
        api.clearOutputDirectory().then(function (res) {
          if (res && res.ok === false && res.error) {
            window.alert(res.error);
            return;
          }
          refreshOutDir();
          schedulePreviewRefresh();
        });
      });

      if (pickCookiesBtn) {
        pickCookiesBtn.addEventListener('click', function () {
          api.pickCookiesFile().then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
            refreshCliOpts();
          });
        });
      }
      if (clearCookiesBtn) {
        clearCookiesBtn.addEventListener('click', function () {
          api.clearCookiesFile().then(function (res) {
            if (res && res.ok === false && res.error) {
              window.alert(res.error);
              return;
            }
            refreshCliOpts();
          });
        });
      }

      if (applyOptsBtn && tmplInput && fmtPreset) {
        applyOptsBtn.addEventListener('click', function () {
          api.setCliOptions({
            filenameTemplate: tmplInput.value,
            formatPreset: fmtPreset.value,
            downloadPlaylist: pillIsOn(pillPlaylist),
            audioOnly: pillIsOn(pillAudioOnly),
            subtitlePreset: subPreset ? subPreset.value : 'none',
            subLangs: subLangsInput ? subLangsInput.value : '',
            cookiesBrowser: cookiesBrowserSelect ? cookiesBrowserSelect.value : 'none',
            cookiesBrowserProfile: cookiesBrowserProfileInput
              ? cookiesBrowserProfileInput.value
              : '',
            impersonate: impersonateSelect ? impersonateSelect.value : 'none',
            rateLimit: rateLimitInput ? rateLimitInput.value : '',
            retriesLine: retriesInput ? retriesInput.value : '',
            fragmentRetriesLine: fragmentRetriesInput ? fragmentRetriesInput.value : '',
            queueRetryProfile: queueRetrySelect ? queueRetrySelect.value : 'off',
            openInHandlerOnComplete: pillIsOn(pillOpenInHandler),
            autoExportAfterOpenInHandler: pillIsOn(pillAutoExportAfterOpen),
            enqueueBatchOnDownloadComplete: pillIsOn(pillEnqueueBatch),
            autoStartBatchAfterEnqueue: pillIsOn(pillAutoStartBatch),
            extraArgsLine: extraArgsInput ? extraArgsInput.value : ''
          }).then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
            refreshCliOpts();
          });
        });
      }
      if (tmplReset && tmplInput) {
        tmplReset.addEventListener('click', function () {
          api.getCliOptions({ uiLocale: DL_LOCALE_CMP }).then(function (r) {
            if (r && r.ok === true && r.payload && r.payload.defaultFilenameTemplate) {
              tmplInput.value = r.payload.defaultFilenameTemplate;
              schedulePreviewRefresh();
            }
          });
        });
      }

      function attachPreviewRefreshOnInput(el) {
        if (!el || !el.addEventListener) return;
        el.addEventListener('input', function () {
          schedulePreviewRefresh();
        });
      }
      function attachPreviewRefreshOnChange(el) {
        if (!el || !el.addEventListener) return;
        el.addEventListener('change', function () {
          schedulePreviewRefresh();
        });
      }
      attachPreviewRefreshOnInput(tmplInput);
      attachPreviewRefreshOnChange(fmtPreset);
      attachPreviewRefreshOnChange(subPreset);
      attachPreviewRefreshOnInput(subLangsInput);
      attachPreviewRefreshOnChange(cookiesBrowserSelect);
      attachPreviewRefreshOnInput(cookiesBrowserProfileInput);
      attachPreviewRefreshOnChange(impersonateSelect);
      attachPreviewRefreshOnInput(rateLimitInput);
      attachPreviewRefreshOnInput(retriesInput);
      attachPreviewRefreshOnInput(fragmentRetriesInput);
      attachPreviewRefreshOnChange(queueRetrySelect);
      attachPreviewRefreshOnInput(extraArgsInput);
      attachPreviewRefreshOnInput(previewOutDirOverride);

      urls.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.stopPropagation();
        urls.classList.add('drag');
      });
      urls.addEventListener('dragleave', function (e) {
        if (!urls.contains(e.relatedTarget)) urls.classList.remove('drag');
      });
      urls.addEventListener('drop', function (e) {
        e.preventDefault();
        e.stopPropagation();
        urls.classList.remove('drag');
        var txt = e.dataTransfer.getData('text/plain') || e.dataTransfer.getData('text/uri-list');
        if (txt) {
          api.addLines(txt).then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
          });
        }
      });

      /** §6.1 — сброс ссылки/текста на таблицу, заголовок и т.д.: в очередь, без перехвата drop на полях ввода настроек. */
      function extractDroppedQueueText(dt) {
        if (!dt) return '';
        var plain = dt.getData('text/plain');
        if (plain && plain.trim()) return plain;
        var uriList = dt.getData('text/uri-list');
        if (uriList && uriList.trim()) return uriList;
        return '';
      }
      function isQueueDropExcludedTarget(el) {
        if (!el || !el.closest) return false;
        var node = el.closest('textarea, select, input');
        if (!node) return false;
        if (node.tagName === 'TEXTAREA' || node.tagName === 'SELECT') return true;
        var type = (node.type || '').toLowerCase();
        return (
          type === 'text' ||
          type === 'search' ||
          type === 'url' ||
          type === 'password' ||
          type === ''
        );
      }
      document.body.addEventListener('dragover', function (e) {
        if (isQueueDropExcludedTarget(e.target)) return;
        e.preventDefault();
      });
      document.body.addEventListener('drop', function (e) {
        if (isQueueDropExcludedTarget(e.target)) return;
        e.preventDefault();
        var txt = extractDroppedQueueText(e.dataTransfer);
        if (txt) {
          api.addLines(txt).then(function (res) {
            if (res && res.ok === false && res.error) window.alert(res.error);
          });
        }
      });

      function onQueueSnapshot(rows) {
        renderRows(rows);
        scheduleHistoryRefresh();
        schedulePreviewRefresh();
        refreshPauseBtn();
      }

      var optsPanelRoot = document.querySelector('.opts-panel');
      if (optsPanelRoot) {
        optsPanelRoot.addEventListener('change', function () {
          schedulePreviewRefresh();
        });
        optsPanelRoot.addEventListener('input', function () {
          schedulePreviewRefresh();
        });
      }

      function wireDetailsUiPersist(id, key) {
        var el = document.getElementById(id);
        if (!el || el.tagName !== 'DETAILS') return;
        el.addEventListener('toggle', function () {
          if (suppressDetailsUiPersist) return;
          var patch = {};
          patch[key] = el.open;
          api.mergeUiPanels(patch);
        });
      }
      wireDetailsUiPersist('historyDetails', 'history');
      wireDetailsUiPersist('logDetails', 'log');
      wireDetailsUiPersist('dlRailFormat', 'format');
      wireDetailsUiPersist('dlRailMeta', 'metadata');
      wireDetailsUiPersist('dlRailSave', 'saving');
      wireDetailsUiPersist('dlRailNet', 'network');
      wireDetailsUiPersist('expertArgsDetails', 'expert');
      wireDetailsUiPersist('hintsPanel', 'hints');

      function wireDownloadsTopbarBridges() {
        var pairs = [
          ['dlTopFilm', function () { return api.bridgeOpenInspector(null); }],
          [
            'dlTopUrl',
            function () {
              var el = document.getElementById('urls')
              if (el && typeof el.focus === 'function') {
                el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
                el.focus()
              }
              return Promise.resolve({ ok: true })
            }
          ],
          ['dlTopHome', function () { return api.bridgeFocusMainEditor(); }],
          ['dlTopEngines', function () { return api.bridgeOpenEnginePaths(); }],
          ['dlTopHelp', function () { return api.bridgeOpenAbout(); }]
        ];
        pairs.forEach(function (pair) {
          var el = document.getElementById(pair[0]);
          if (!el) return;
          el.addEventListener('click', function () {
            Promise.resolve(pair[1]()).then(function (res) {
              if (res && res.ok === false && res.error) window.alert(res.error);
            }).catch(function (err) {
              window.alert(err && err.message ? err.message : String(err));
            });
          });
        });
      }
      wireDownloadsTopbarBridges();

      function applyDownloadsTheme(t) {
        document.documentElement.setAttribute('data-theme', t === 'light' ? 'light' : 'dark');
      }
      if (api && typeof api.onThemeChanged === 'function') {
        api.onThemeChanged(applyDownloadsTheme);
      }

      function applyDownloadsUiPanelsSnapshot(panels) {
        if (!panels || typeof panels !== 'object') return;
        var pairs = [
          ['historyDetails', 'history', false],
          ['logDetails', 'log', false],
          ['dlRailFormat', 'format', true],
          ['dlRailMeta', 'metadata', true],
          ['dlRailSave', 'saving', true],
          ['dlRailNet', 'network', false],
          ['expertArgsDetails', 'expert', false],
          ['hintsPanel', 'hints', true]
        ];
        suppressDetailsUiPersist = true;
        if (suppressDetailsUiPersistTimer !== null) {
          window.clearTimeout(suppressDetailsUiPersistTimer);
        }
        pairs.forEach(function (pair) {
          var el = document.getElementById(pair[0]);
          if (!el || el.tagName !== 'DETAILS') return;
          var v = panels[pair[1]];
          el.open = typeof v === 'boolean' ? v : pair[2];
        });
        suppressDetailsUiPersistTimer = window.setTimeout(function () {
          suppressDetailsUiPersist = false;
          suppressDetailsUiPersistTimer = null;
        }, 0);
      }
      if (api && typeof api.onDownloadsWindowUiPanelsChanged === 'function') {
        api.onDownloadsWindowUiPanelsChanged(applyDownloadsUiPanelsSnapshot);
      }
      if (api && typeof api.onDownloadsOutputDirectoryChanged === 'function') {
        api.onDownloadsOutputDirectoryChanged(function () {
          refreshOutDir();
          schedulePreviewRefresh();
        });
      }
      if (api && typeof api.onDownloadsCliOptionsChanged === 'function') {
        api.onDownloadsCliOptionsChanged(function () {
          refreshCliOpts();
          schedulePreviewRefresh();
        });
      }

      api.getSnapshot().then(onQueueSnapshot);

      api.onSnapshot(onQueueSnapshot);
      refreshOutDir();
      refreshCliOpts();
    })();
  </script>
</body>
</html>`
}
