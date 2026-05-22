import { getUiLocale } from '../locales/ui-text'
import type { AppUiLocale } from '../../../shared/app-ui-locale'
import { useAppShellStore } from './app-shell-store'
import { useDownloadsStore } from './downloads-store'

export function bindDownloadsStoreIpc(): () => void {
  const cleanups: Array<() => void> = []
  let mounted = true

  void window.velorix.downloads
    .getCliOptions({ uiLocale: getUiLocale() as AppUiLocale })
    .then((res) => {
      if (!mounted) {
        return
      }
      if (res.ok) {
        useDownloadsStore.setState({ downloadsOptions: res.payload })
        return
      }
      useAppShellStore.getState().setStatusHint(res.error)
    })

  void Promise.all([
    window.velorix.downloads.getHistory(),
    window.velorix.downloads.getHistoryWeeklySummary()
  ]).then(([rows, summary]) => {
    if (mounted) {
      useDownloadsStore.setState({
        downloadsHistory: rows,
        downloadsHistoryWeeklySummary: summary
      })
    }
  })

  void window.velorix.downloads.getOutputDirectory().then((dir) => {
    useDownloadsStore.setState({ downloadsOutputDirectory: dir })
  })

  cleanups.push(
    window.velorix.downloads.onLog((payload) => {
      useDownloadsStore.getState().handleDownloadsLogPayload(payload)
    })
  )

  cleanups.push(
    window.velorix.downloads.onDownloadsOutputDirectoryChanged((snap) => {
      useDownloadsStore.setState({ downloadsOutputDirectory: snap })
    })
  )

  cleanups.push(
    window.velorix.downloads.onDownloadsCliOptionsChanged(() => {
      void useDownloadsStore.getState().refreshDownloadsOptions()
    })
  )

  cleanups.push(
    window.velorix.downloads.onDownloadsHistoryChanged(() => {
      void useDownloadsStore.getState().refreshDownloadsHistory({ silent: true })
    })
  )

  return () => {
    mounted = false
    for (const off of cleanups) {
      off()
    }
  }
}
