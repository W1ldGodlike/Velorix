import { closeDownloadsPopoutIfOpen } from './downloads-window'
import { closeInspectorWindowIfOpen } from './inspector-window'

/** §4.2.3 — закрыть pop-out загрузок и окно инспектора перед выходом из главного окна. */
export function closeSecondaryAppWindows(): void {
  closeDownloadsPopoutIfOpen()
  closeInspectorWindowIfOpen()
}
