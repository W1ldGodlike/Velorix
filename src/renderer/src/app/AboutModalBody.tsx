import { useEffect, useState, type JSX } from 'react'

import {
  formatAboutBuildIdDisplay,
  formatBuiltAtUtcLine,
  readAppBuildInfo
} from '../../../shared/app-build-info'
import { VELORIX_NEON_REFERENCE_ABOUT_REL } from '../../../shared/velorix-neon-theme-tokens'

import { formatEnginesStatusLine } from '../lib/format-engines-status-line'

/** ref.11 — «О программе»: build info + статус движков. */
export function AboutModalBody(): JSX.Element {
  const build = readAppBuildInfo()
  const builtLine = formatBuiltAtUtcLine(build.builtAtUtc)
  const [enginesLine, setEnginesLine] = useState<string | null>(null)

  useEffect(() => {
    void (async () => {
      const getStatus = window.velorix?.engines?.getStatus
      if (getStatus == null) {
        return
      }
      const snapshot = await getStatus('ru')
      setEnginesLine(formatEnginesStatusLine(snapshot))
    })()
  }, [])

  return (
    <div className="app-modal__body">
      <p className="app-modal__subtitle">VELORIX · UI ZERO rebuild</p>
      <p className="app-modal__hint">
        Сборка {formatAboutBuildIdDisplay(build.buildId)}
        {builtLine != null ? ` · ${builtLine}` : ''}
      </p>
      {enginesLine != null ? <p className="app-modal__hint">{enginesLine}</p> : null}
      <p className="app-modal__hint">Эталон: {VELORIX_NEON_REFERENCE_ABOUT_REL}</p>
    </div>
  )
}
