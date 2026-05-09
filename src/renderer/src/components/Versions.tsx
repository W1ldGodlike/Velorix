import { useState } from 'react'

function Versions(): React.JSX.Element {
  // Версии Electron/Chromium/Node оставляем в статусбаре как быстрый диагностический минимум.
  // Для support ZIP (§18) эти же значения позже пойдут в manifest вместе с ОС и билдом.
  const [versions] = useState(window.electron.process.versions)

  return (
    <ul className="versions-inline" aria-label="Версии среды">
      <li>Electron {versions.electron}</li>
      <li>Chromium {versions.chrome}</li>
      <li>Node {versions.node}</li>
    </ul>
  )
}

export default Versions
