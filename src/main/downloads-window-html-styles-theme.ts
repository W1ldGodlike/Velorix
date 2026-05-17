/**
 * Pop-out downloads CSS — dark/light tokens + body base (`buildDownloadsHtml`).
 */
export const DOWNLOADS_WINDOW_HTML_STYLES_THEME = `    html[data-theme='dark'],
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
    }`
