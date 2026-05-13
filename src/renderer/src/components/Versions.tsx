import { useState } from 'react'
import { uiText } from '../locales/ui-text'

function Versions(): React.JSX.Element {
  // Версии Electron/Chromium/Node оставляем в статусбаре как быстрый диагностический минимум.
  // Для support ZIP (§18) эти же значения позже пойдут в manifest вместе с ОС и билдом.
  const [versions] = useState(window.electron.process.versions)

  return (
    <ul className="versions-inline" aria-label={uiText('versionsAriaLabel')}>
      <li>
        {uiText('aboutRuntimeElectronLabel')} {versions['electron']}
      </li>
      <li>
        {uiText('aboutRuntimeChromiumLabel')} {versions['chrome']}
      </li>
      <li>
        {uiText('aboutRuntimeNodeLabel')} {versions['node']}
      </li>
    </ul>
  )
}

export default Versions
