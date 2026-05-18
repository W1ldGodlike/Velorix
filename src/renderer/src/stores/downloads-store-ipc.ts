import { getUiLocale } from '../locales/ui-text'
import type { AppUiLocale } from '../../../shared/app-ui-locale'
import { useAppShellStore } from './app-shell-store'
import { useDownloadsStore } from './downloads-store'

export function bindDownloadsStoreIpc(): () => void {
  const cleanups: Array<() => void> = []
  let mounted = true

  void window.fluxalloy.downloads
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
    window.fluxalloy.downloads.getHistory(),
    window.fluxalloy.downloads.getHistoryWeeklySummary()
  ]).then(([rows, summary]) => {
    if (mounted) {
      useDownloadsStore.setState({
        downloadsHistory: rows,
        downloadsHistoryWeeklySummary: summary
      })
    }
  })

  void window.fluxalloy.downloads.getOutputDirectory().then((dir) => {
    useDownloadsStore.setState({ downloadsOutputDirectory: dir })
  })

  cleanups.push(
    window.fluxalloy.downloads.onLog((payload) => {
      useDownloadsStore.getState().handleDownloadsLogPayload(payload)
    })
  )

  cleanups.push(
    window.fluxalloy.downloads.onDownloadsOutputDirectoryChanged((snap) => {
      useDownloadsStore.setState({ downloadsOutputDirectory: snap })
    })
  )

  cleanups.push(
    window.fluxalloy.downloads.onDownloadsCliOptionsChanged(() => {
      void useDownloadsStore.getState().refreshDownloadsOptions()
    })
  )

  cleanups.push(
    window.fluxalloy.downloads.onDownloadsHistoryChanged(() => {
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
