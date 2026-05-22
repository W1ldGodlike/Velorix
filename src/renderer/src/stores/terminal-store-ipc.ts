import { useTerminalStore } from './terminal-store'

/** Загрузка каталога подсказок терминала (§8). */
export function bindTerminalStoreIpc(): () => void {
  let mounted = true
  void window.velorix.terminal.getHints().then((hints) => {
    if (mounted) {
      useTerminalStore.getState().setTerminalHints(hints)
    }
  })
  return () => {
    mounted = false
  }
}
