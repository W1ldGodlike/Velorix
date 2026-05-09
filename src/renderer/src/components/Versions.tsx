import { useState } from 'react'

function Versions(): React.JSX.Element {
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
