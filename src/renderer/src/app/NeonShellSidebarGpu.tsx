import { useEffect, useState, type JSX } from 'react'

import { countHwEncoders } from '../lib/count-hw-encoders'

/** §4.C — панель GPU в sidebar: nvidia-smi / адаптеры ОС + число HW-кодеков ffmpeg. */
export function NeonShellSidebarGpu(): JSX.Element {
  const [title, setTitle] = useState('GPU')
  const [line, setLine] = useState('Проверка…')
  const [sub, setSub] = useState('')

  useEffect(() => {
    void (async () => {
      const probe = window.velorix?.engines?.probeHwEncoders
      if (probe == null) {
        setLine('engines.probeHwEncoders недоступен')
        return
      }
      const result = await probe()
      if (!result.ok) {
        setLine(result.error)
        return
      }
      const gpu = result.nvidiaGpu
      if (gpu != null) {
        setTitle('GPU')
        setLine(gpu.name)
        setSub(`Драйвер ${gpu.driverVersion} · HW ${String(countHwEncoders(result.snapshot))}`)
        return
      }
      const adapter = result.gpuAdapterNames[0]
      setTitle('Видеоадаптер')
      setLine(adapter ?? 'Не обнаружен')
      setSub(`HW-кодеки ffmpeg: ${String(countHwEncoders(result.snapshot))}`)
    })()
  }, [])

  return (
    <div className="neon-shell__sidebar-panel vn-surface-glass">
      <p className="neon-shell__panel-title">{title}</p>
      <p className="neon-shell__panel-line">{line}</p>
      {sub.length > 0 ? <p className="neon-shell__panel-sub">{sub}</p> : null}
      <div className="neon-shell__sparkline" aria-hidden>
        <span style={{ height: '45%' }} />
        <span style={{ height: '70%' }} />
        <span style={{ height: '55%' }} />
        <span style={{ height: '90%' }} />
      </div>
      <div className="neon-shell__rings" aria-hidden>
        <span className="neon-shell__ring" data-label="CPU 68%" />
        <span className="neon-shell__ring" data-label="RAM 75%" />
        <span className="neon-shell__ring" data-label="Disk 42%" />
      </div>
      <p className="neon-shell__panel-sub">↓ 12.6 MB/s · ↑ 2.4 MB/s</p>
    </div>
  )
}
