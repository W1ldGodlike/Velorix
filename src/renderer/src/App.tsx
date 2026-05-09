import { useCallback, useEffect, useRef, useState } from 'react'

import VideoTimeline from './components/VideoTimeline'
import Versions from './components/Versions'

type Theme = 'dark' | 'light'

/** Совпадает с `Extract<PreviewDialogResult,{ok:true}>` в preload-контракте §4/§7. */
interface PreviewOpenedPayload {
  path: string
  mediaUrl: string
  name: string
}
type EngineSummary = 'checking' | 'ready' | 'missing' | 'error'

type EnginesSnapshot = Awaited<ReturnType<typeof window.fluxalloy.engines.getStatus>>

type EngineId = 'ffmpeg' | 'ffprobe' | 'yt-dlp'

const ENGINE_IDS: EngineId[] = ['ffmpeg', 'ffprobe', 'yt-dlp']

function engineLabel(id: EngineId): string {
  switch (id) {
    case 'ffmpeg':
      return 'ffmpeg'
    case 'ffprobe':
      return 'ffprobe'
    case 'yt-dlp':
      return 'yt-dlp'
    default:
      return id
  }
}

type EnginePathsDraft = Record<EngineId, string>

function formatEngineVersionsLine(snapshot: EnginesSnapshot): string {
  const ids = ['ffmpeg', 'ffprobe', 'yt-dlp'] as const
  const parts = ids.map((id) => {
    const e = snapshot.engines[id]
    if (e.state === 'ready' && e.version) {
      const cut = e.version.length > 30 ? `${e.version.slice(0, 28)}…` : e.version
      return `${id}: ${cut}`
    }
    if (e.state === 'missing') {
      return `${id}: —`
    }
    if (e.state === 'error') {
      return `${id}: !`
    }
    return `${id}: …`
  })
  return parts.join(' · ')
}

function clipboardLooksLikeDownloadsPayload(text: string): boolean {
  const t = text.trim()
  if (t.length < 12) {
    return false
  }
  const lines = t.split(/\r?\n/)
  return lines.some((line) => {
    const x = line.trim()
    return /^https?:\/\//i.test(x) || (/^[\w.-]+\.[a-z]{2,}\//i.test(x) && x.includes('/'))
  })
}

function domTargetIsTextField(target: EventTarget | null): boolean {
  if (!target || !(target instanceof HTMLElement)) {
    return false
  }
  const tag = target.tagName
  if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') {
    return true
  }
  return target.isContentEditable
}

type MediaProbeSuccess = Extract<
  Awaited<ReturnType<typeof window.fluxalloy.preview.probe>>,
  { ok: true }
>

/**
 * Сводит подробные статусы движков к одной строке для нижнего статусбара.
 *
 * Подробности (пути, версии, ошибки по каждому бинарнику) позже уйдут в окно настроек
 * зависимостей. Статусбар должен оставаться компактным и показывать только состояние,
 * требующее внимания пользователя.
 */
function summarizeEngines(
  engines: Awaited<ReturnType<typeof window.fluxalloy.engines.getStatus>>['engines']
): EngineSummary {
  const states = Object.values(engines).map((engine) => engine.state)

  if (states.includes('error')) {
    return 'error'
  }
  if (states.includes('missing')) {
    return 'missing'
  }
  return 'ready'
}

function engineSummaryText(summary: EngineSummary): string {
  switch (summary) {
    case 'ready':
      return 'Движки: готовы'
    case 'missing':
      return 'Движки: не найдены'
    case 'error':
      return 'Движки: ошибка проверки'
    case 'checking':
      return 'Движки: проверка…'
  }
}

function App(): React.JSX.Element {
  const [theme, setTheme] = useState<Theme>('dark')
  const [engineSummary, setEngineSummary] = useState<EngineSummary>('checking')
  const [enginesOfferDownload, setEnginesOfferDownload] = useState(false)
  const [engineDownloadBusy, setEngineDownloadBusy] = useState(false)
  const [enginePathsOpen, setEnginePathsOpen] = useState(false)
  const [enginePathsDraft, setEnginePathsDraft] = useState<EnginePathsDraft>({
    ffmpeg: '',
    ffprobe: '',
    'yt-dlp': ''
  })
  /** Подстрочное сообщение статусбара: прогресс загрузки движков, ошибки DnD и т.п. */
  const [statusHint, setStatusHint] = useState<string | null>(null)
  const [preview, setPreview] = useState<PreviewOpenedPayload | null>(null)
  const [probeInfo, setProbeInfo] = useState<MediaProbeSuccess | null>(null)
  const [probeError, setProbeError] = useState<string | null>(null)
  const [downloadsUrl, setDownloadsUrl] = useState('')
  const [engineVersionsLine, setEngineVersionsLine] = useState('')
  const [exportBusy, setExportBusy] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  /** Последний диапазон In/Out с таймлайна для IPC экспорта. */
  const trimSnapshotRef = useRef<{ inSec: number; outSec: number } | null>(null)

  const applyPreview = useCallback((payload: PreviewOpenedPayload): void => {
    setProbeInfo(null)
    setProbeError(null)
    setPreview(payload)
  }, [])

  const onTrimRangeSnapshot = useCallback((range: { inSec: number; outSec: number }) => {
    trimSnapshotRef.current = range
  }, [])

  useEffect(() => {
    trimSnapshotRef.current = null
  }, [preview?.path])

  const applyTheme = useCallback((value: Theme) => {
    document.documentElement.dataset.theme = value
    setTheme(value)
  }, [])

  const refreshEngineUi = useCallback(async (): Promise<void> => {
    try {
      const snapshot = await window.fluxalloy.engines.getStatus()
      setEngineSummary(summarizeEngines(snapshot.engines))
      setEngineVersionsLine(formatEngineVersionsLine(snapshot))
      const need = await window.fluxalloy.engines.shouldOfferDownload()
      setEnginesOfferDownload(need)
    } catch {
      setEngineSummary('error')
      setEngineVersionsLine('')
    }
  }, [])

  useEffect(() => {
    let cleanupTheme: (() => void) | undefined
    void (async () => {
      const loaded = await window.fluxalloy.settings.get()
      applyTheme(loaded.theme === 'light' ? 'light' : 'dark')
      cleanupTheme = window.fluxalloy.onThemeChanged((next) => {
        applyTheme(next)
      })
    })().catch(console.error)

    return (): void => {
      cleanupTheme?.()
    }
  }, [applyTheme])

  useEffect(() => {
    let cancelled = false
    void window.fluxalloy.session.restoreLastSource().then((restored) => {
      if (cancelled || !restored) {
        return
      }
      applyPreview(restored)
    })
    return (): void => {
      cancelled = true
    }
  }, [applyPreview])

  useEffect(() => {
    const path = preview?.path
    if (!path) {
      return
    }
    let cancelled = false
    void window.fluxalloy.preview.probe(path).then((r) => {
      if (cancelled) {
        return
      }
      if (r.ok) {
        setProbeInfo(r)
        setProbeError(null)
      } else {
        setProbeInfo(null)
        setProbeError(r.error)
      }
    })
    return (): void => {
      cancelled = true
    }
  }, [preview?.path])

  useEffect(() => {
    let cancelled = false
    const handle = window.setTimeout(() => {
      if (!cancelled) {
        void refreshEngineUi()
      }
    }, 0)
    return (): void => {
      cancelled = true
      window.clearTimeout(handle)
    }
  }, [refreshEngineUi])

  useEffect(() => {
    if (!enginePathsOpen) {
      return
    }
    void window.fluxalloy.settings.get().then((s) => {
      setEnginePathsDraft({
        ffmpeg: s.engineExecutablePaths?.ffmpeg ?? '',
        ffprobe: s.engineExecutablePaths?.ffprobe ?? '',
        'yt-dlp': s.engineExecutablePaths?.['yt-dlp'] ?? ''
      })
    })
  }, [enginePathsOpen])

  useEffect(() => {
    const offMenu = window.fluxalloy.onOpenEnginePaths(() => {
      setEnginePathsOpen(true)
    })
    const offSynced = window.fluxalloy.onEnginePathsChanged(() => {
      void refreshEngineUi()
    })
    return (): void => {
      offMenu()
      offSynced()
    }
  }, [refreshEngineUi])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent): void {
      if (!e.ctrlKey && !e.metaKey) {
        return
      }
      if (e.key !== 'v' && e.key !== 'V') {
        return
      }
      if (domTargetIsTextField(e.target)) {
        return
      }
      e.preventDefault()
      void window.fluxalloy.clipboard.readText().then((raw) => {
        if (!clipboardLooksLikeDownloadsPayload(raw)) {
          return
        }
        void window.fluxalloy.downloads.openWindow(raw.trim())
      })
    }

    document.addEventListener('keydown', onKeyDown)
    return (): void => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  useEffect(() => {
    void window.fluxalloy.engines
      .shouldOfferDownload()
      .then(setEnginesOfferDownload)
      .catch(() => setEnginesOfferDownload(false))
  }, [engineSummary])

  useEffect(() => {
    const offProgress = window.fluxalloy.engines.onDownloadProgress((p) => {
      const pct = typeof p.percent === 'number' && p.percent >= 0 ? `${p.percent}% · ` : ''
      setStatusHint(`${pct}${p.message}`)
    })

    const offExport = window.fluxalloy.export.onProgress((p) => {
      const pct =
        typeof p.percent === 'number' && p.percent >= 0 ? `${Math.round(p.percent)}% · ` : ''
      setStatusHint(`Экспорт · ${pct}${p.message}`)
    })

    const offMenuPreview = window.fluxalloy.onPreviewOpened((payload) => {
      applyPreview(payload)
    })

    return (): void => {
      offProgress()
      offExport()
      offMenuPreview()
    }
  }, [applyPreview])

  function toggleTheme(): void {
    const next = theme === 'dark' ? 'light' : 'dark'
    void window.fluxalloy.settings.setTheme(next)
  }

  async function handleOpenToolbar(): Promise<void> {
    const result = await window.fluxalloy.preview.openFileDialog()
    if (result.ok) {
      applyPreview(result)
    }
  }

  async function handleEnginesDownload(): Promise<void> {
    setEngineDownloadBusy(true)
    setStatusHint('Подготовка загрузки…')
    try {
      const res = await window.fluxalloy.engines.download()
      if (!res.ok) {
        setStatusHint(`Ошибка: ${res.error}`)
        return
      }

      await refreshEngineUi()
      setStatusHint('Движки загружены')
    } catch (error) {
      setStatusHint(error instanceof Error ? error.message : 'Ошибка загрузки')
    } finally {
      setEngineDownloadBusy(false)
    }
  }

  async function handleSaveEnginePaths(): Promise<void> {
    await window.fluxalloy.settings.setEngineExecutablePaths({
      ffmpeg: enginePathsDraft.ffmpeg.trim() || null,
      ffprobe: enginePathsDraft.ffprobe.trim() || null,
      'yt-dlp': enginePathsDraft['yt-dlp'].trim() || null
    })
    await refreshEngineUi()
    setEnginePathsOpen(false)
    setStatusHint('Пути к движкам сохранены')
  }

  async function handlePickEngine(id: EngineId): Promise<void> {
    const picked = await window.fluxalloy.settings.pickEngineExecutable(id)
    if (!picked) {
      return
    }
    setEnginePathsDraft((prev) => ({ ...prev, [id]: picked }))
  }

  async function handleExport(): Promise<void> {
    if (!preview || exportBusy) {
      return
    }
    setExportBusy(true)
    setStatusHint('Подготовка экспорта…')
    try {
      const trimSnap = trimSnapshotRef.current
      const res = await window.fluxalloy.export.start({
        inputPath: preview.path,
        trim: trimSnap ?? undefined,
        probeDurationSec: probeInfo?.durationSec ?? null
      })
      if (res.ok) {
        setStatusHint('Экспорт завершён')
      } else if ('cancelled' in res && res.cancelled) {
        setStatusHint(null)
      } else if ('error' in res) {
        setStatusHint(`Экспорт: ${res.error}`)
      } else {
        setStatusHint('Экспорт: ошибка')
      }
    } catch (e) {
      setStatusHint(e instanceof Error ? e.message : 'Ошибка экспорта')
    } finally {
      setExportBusy(false)
    }
  }

  async function handlePreviewDrop(files: FileList | null): Promise<void> {
    const file = files?.[0]
    if (!file) {
      return
    }
    const absolutePath = window.fluxalloy.preview.getPathForFile(file)
    const granted = await window.fluxalloy.preview.grantPath(absolutePath)
    if (!granted.ok) {
      setStatusHint(`DnD: ${granted.error}`)
      return
    }
    applyPreview(granted)
  }

  return (
    <div className="app-shell">
      <header className="app-toolbar">
        <div className="app-toolbar-brand">FluxAlloy</div>
        <button
          type="button"
          className="app-btn"
          onClick={() => {
            void window.fluxalloy.downloads.openWindow(downloadsUrl || null)
          }}
          title="Отдельное окно заглушки менеджера загрузок (§4.A)"
        >
          Загрузки yt-dlp
        </button>
        <button
          type="button"
          className="app-btn"
          onClick={() => {
            void handleOpenToolbar()
          }}
          title="Открыть локальный видеофайл"
        >
          Открыть
        </button>
        <button
          type="button"
          className="app-btn app-btn-primary"
          disabled={!preview || exportBusy}
          onClick={() => {
            void handleExport()
          }}
          title="Сохранить фрагмент In–Out или весь файл в MP4 (libx264/aac), нужен ffmpeg"
        >
          {exportBusy ? 'Экспорт…' : 'Экспорт'}
        </button>
        {enginesOfferDownload ? (
          <button
            type="button"
            className="app-btn app-btn-warn"
            disabled={engineDownloadBusy}
            onClick={() => {
              void handleEnginesDownload()
            }}
            title="Скачать yt-dlp и FFmpeg в папку приложения пользователя"
          >
            {engineDownloadBusy ? 'Загрузка…' : 'Скачать движки'}
          </button>
        ) : null}
        <div className="app-toolbar-spacer" aria-hidden />
        <button
          type="button"
          className="app-btn"
          onClick={() => {
            setEnginePathsOpen(true)
          }}
          title="Задать исполняемые файлы ffmpeg, ffprobe и yt-dlp вручную"
        >
          Пути движков
        </button>
        <button
          type="button"
          className="app-btn"
          onClick={toggleTheme}
          title="Переключить тёмную/светлую тему"
        >
          Тема: {theme === 'dark' ? 'тёмная' : 'светлая'}
        </button>
      </header>

      <div className="app-url-bar" aria-label="Ссылка для будущего yt-dlp">
        <input
          className="app-url-input"
          type="url"
          inputMode="url"
          placeholder="URL для будущих загрузок (пока только передаётся в окно-заглушку)"
          value={downloadsUrl}
          onChange={(e) => {
            setDownloadsUrl(e.target.value)
          }}
        />
        <button
          type="button"
          className="app-btn"
          onClick={() => {
            void window.fluxalloy.downloads.openWindow(downloadsUrl || null)
          }}
        >
          Открыть окно
        </button>
        <button
          type="button"
          className="app-btn"
          onClick={() => {
            void window.fluxalloy.clipboard.readText().then((t) => {
              setDownloadsUrl(t.trim())
            })
          }}
          title="Вставить текст из буфера обмена в поле URL"
        >
          Из буфера
        </button>
      </div>

      <main className="app-main">
        <section
          className="app-preview"
          aria-label="Область предпросмотра"
          onDragOver={(event) => {
            event.preventDefault()
            event.stopPropagation()
          }}
          onDrop={(event) => {
            event.preventDefault()
            event.stopPropagation()
            void handlePreviewDrop(event.dataTransfer.files)
          }}
        >
          {preview ? (
            <>
              <div className="app-preview-stack">
                <video
                  key={preview.mediaUrl}
                  ref={videoRef}
                  className="app-preview-video"
                  controls
                  src={preview.mediaUrl}
                />
                <VideoTimeline
                  key={preview.mediaUrl}
                  mediaKey={preview.mediaUrl}
                  videoRef={videoRef}
                  onTrimRangeChange={onTrimRangeSnapshot}
                />
                {(probeInfo || probeError) && (
                  <div className="app-preview-probe" aria-live="polite">
                    {probeError ? (
                      <span className="app-preview-probe-error">{probeError}</span>
                    ) : probeInfo ? (
                      <span>
                        {probeInfo.durationSec !== null
                          ? `${Math.round(probeInfo.durationSec)} с`
                          : 'длительность ?'}
                        {probeInfo.video
                          ? ` · ${probeInfo.video.width}×${probeInfo.video.height} · ${probeInfo.video.codec}`
                          : ''}
                        {probeInfo.audioCodec ? ` · аудио ${probeInfo.audioCodec}` : ''}
                        {probeInfo.formatName ? ` · ${probeInfo.formatName}` : ''}
                      </span>
                    ) : null}
                  </div>
                )}
                <footer className="app-preview-caption" title={preview.path}>
                  {preview.name}
                </footer>
              </div>
            </>
          ) : (
            <div className="app-preview-placeholder">
              Нет источника — перетащите видеофайл сюда или «Открыть…» в меню «Файл» / кнопка
              сверху.
              <p className="app-preview-hint">
                Локальный файл стримится через защищённую схему fluxmedia — только после выбора или
                DnD по пути из Electron.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="app-statusbar">
        <span>{engineSummaryText(engineSummary)}</span>
        {engineVersionsLine ? (
          <>
            <span className="app-statusbar-sep" aria-hidden />
            <span className="app-statusbar-engines" title={engineVersionsLine}>
              {engineVersionsLine}
            </span>
          </>
        ) : null}
        {statusHint ? (
          <>
            <span className="app-statusbar-sep" aria-hidden />
            <span className="app-statusbar-extra">{statusHint}</span>
          </>
        ) : null}
        <span className="app-statusbar-sep" aria-hidden />
        <Versions />
      </footer>

      {enginePathsOpen ? (
        <div
          className="app-modal-backdrop"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setEnginePathsOpen(false)
            }
          }}
        >
          <div
            className="app-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="engine-paths-title"
            onMouseDown={(e) => {
              e.stopPropagation()
            }}
          >
            <h2 id="engine-paths-title" className="app-modal-title">
              Пути к движкам
            </h2>
            <p className="app-modal-hint">
              Полный путь к каждому исполняемому файлу имеет приоритет над встроенным каталогом и
              загрузкой в userData/bin. Оставьте поле пустым и сохраните — сброс на авто-поиск.
            </p>
            <div className="app-engine-path-rows">
              {ENGINE_IDS.map((id) => (
                <div key={id} className="app-engine-path-row">
                  <label className="app-engine-path-label" htmlFor={`engine-path-${id}`}>
                    {engineLabel(id)}
                  </label>
                  <input
                    id={`engine-path-${id}`}
                    className="app-engine-path-input"
                    type="text"
                    spellCheck={false}
                    placeholder="Авто"
                    value={enginePathsDraft[id]}
                    onChange={(e) => {
                      setEnginePathsDraft((prev) => ({ ...prev, [id]: e.target.value }))
                    }}
                  />
                  <div className="app-engine-path-actions">
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      onClick={() => {
                        void handlePickEngine(id)
                      }}
                    >
                      Выбрать…
                    </button>
                    <button
                      type="button"
                      className="app-btn app-btn-compact"
                      onClick={() => {
                        setEnginePathsDraft((prev) => ({ ...prev, [id]: '' }))
                      }}
                    >
                      Сбросить
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="app-modal-footer">
              <button
                type="button"
                className="app-btn"
                onClick={() => {
                  setEnginePathsOpen(false)
                }}
              >
                Отмена
              </button>
              <button
                type="button"
                className="app-btn app-btn-primary"
                onClick={() => {
                  void handleSaveEnginePaths()
                }}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
