import { useEffect, useState, type FormEvent, type JSX } from 'react'

import type { TerminalCommandHintEntry } from '../../../../shared/terminal-contract'
import { VELORIX_NEON_REFERENCE_TERMINAL_REL } from '../../../../shared/velorix-neon-theme-tokens'

import { useAppShellStore } from '../../stores/app-shell-store'

export function TerminalScreen(): JSX.Element {
  const mediaSource = useAppShellStore((s) => s.mediaSource)
  const commandLine = useAppShellStore((s) => s.terminalCommandLine)
  const setCommandLine = useAppShellStore((s) => s.setTerminalCommandLine)
  const [logLines, setLogLines] = useState<string[]>([
    'Velorix terminal — введите команду и нажмите «Выполнить».'
  ])
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault()
    const run = window.velorix?.terminal?.run
    const line = commandLine.trim()
    if (run == null || line.length === 0) {
      return
    }
    setBusy(true)
    setLogLines((prev) => [...prev, `› ${line}`])
    const result = await run({
      line,
      currentFilePath: mediaSource?.path ?? null,
      uiLocale: 'ru'
    })
    if (result.ok) {
      appendChunks(result.stdout)
      appendChunks(result.stderr)
      setLogLines((prev) => [
        ...prev,
        `[${result.tool}] exit ${String(result.code)} · ${result.elapsedMs} ms`
      ])
    } else {
      setLogLines((prev) => [...prev, `Ошибка: ${result.error}`])
    }
    setBusy(false)
  }

  function appendChunks(text: string): void {
    if (text.trim().length === 0) {
      return
    }
    const lines = text.split(/\r?\n/).filter((chunk) => chunk.length > 0)
    setLogLines((prev) => [...prev, ...lines])
  }

  return (
    <div className="portal-screen terminal-screen">
      <header className="portal-screen__head">
        <h1 className="portal-screen__title">Терминал</h1>
        <p className="portal-screen__subtitle">Эталон: {VELORIX_NEON_REFERENCE_TERMINAL_REL}</p>
      </header>
      <div className="terminal-screen__head-actions">
        <button
          type="button"
          className="app-btn app-btn-secondary"
          disabled={logLines.length === 0}
          onClick={() => setLogLines(['Журнал очищен.'])}
        >
          Очистить журнал
        </button>
      </div>
      <div className="terminal-screen__log vn-surface-glass" role="log" aria-live="polite">
        {logLines.map((line, index) => (
          <code key={`${index}-${line.slice(0, 24)}`}>{line}</code>
        ))}
      </div>
      <form
        className="terminal-screen__input-row vn-surface-glass"
        onSubmit={(e) => void handleSubmit(e)}
      >
        <span className="terminal-screen__prompt" aria-hidden>
          ›
        </span>
        <input
          type="text"
          className="app-input terminal-screen__input"
          placeholder="ffmpeg -i …"
          spellCheck={false}
          value={commandLine}
          onChange={(e) => setCommandLine(e.target.value)}
          disabled={busy}
        />
        <button type="submit" className="app-btn app-btn-primary" disabled={busy}>
          {busy ? '…' : 'Выполнить'}
        </button>
      </form>
    </div>
  )
}

export function TerminalRail(): JSX.Element {
  const setCommandLine = useAppShellStore((s) => s.setTerminalCommandLine)
  const [hints, setHints] = useState<TerminalCommandHintEntry[]>([])

  useEffect(() => {
    let cancelled = false
    async function load(): Promise<void> {
      const getHints = window.velorix?.terminal?.getHints
      if (getHints == null) {
        return
      }
      const rows = await getHints()
      if (!cancelled) {
        setHints(rows.slice(0, 6))
      }
    }
    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <aside className="portal-rail vn-surface-glass terminal-rail">
      <h2 className="portal-rail__title">Подсказки</h2>
      <div className="terminal-rail__hints">
        {hints.map((hint) => (
          <button
            key={hint.token}
            type="button"
            className="app-btn app-btn-secondary"
            title={hint.summary}
            onClick={() => setCommandLine(hint.fullLine ?? hint.token)}
          >
            {hint.token}
          </button>
        ))}
      </div>
      <h2 className="portal-rail__title">Настройки</h2>
      <label className="app-ui-showcase-field">
        <span className="app-ui-showcase-field-label">Инструмент</span>
        <select className="app-settings-select" defaultValue="ffmpeg">
          <option value="ffmpeg">FFmpeg</option>
          <option value="ffprobe">FFprobe</option>
          <option value="yt-dlp">yt-dlp</option>
        </select>
      </label>
    </aside>
  )
}
