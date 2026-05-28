import { useEffect, useState, type JSX } from 'react'

import type { AppUiLocale } from '../../../../shared/app-ui-locale'
import type { EditorUrlPasteBehaviorId } from '../../../../shared/editor-url-paste-behavior'
import type { AppSettingsView } from '../../../../shared/settings-contract'
import { VELORIX_NEON_REFERENCE_SETTINGS_REL } from '../../../../shared/velorix-neon-theme-tokens'

import { useAppShellStore, type SettingsSectionId } from '../../stores/app-shell-store'

const SECTION_LABELS: Record<SettingsSectionId, { title: string; hint: string }> = {
  app: { title: 'Приложение', hint: 'Язык, закрытие, вставка URL' },
  processing: { title: 'Обработка', hint: 'FFmpeg, пути к движкам' },
  cache: { title: 'Кэш и данные', hint: 'Резервные копии настроек' }
}

async function loadSettingsView(): Promise<AppSettingsView | null> {
  const get = window.velorix?.settings?.get
  if (get == null) {
    return null
  }
  return get()
}

export function SettingsScreen(): JSX.Element {
  const section = useAppShellStore((s) => s.settingsSection)
  const openModal = useAppShellStore((s) => s.openModal)
  const hydrateEnginePathDraft = useAppShellStore((s) => s.hydrateEnginePathDraft)
  const [view, setView] = useState<AppSettingsView | null>(null)
  const [statusLine, setStatusLine] = useState<string | null>(null)
  const [winMenu, setWinMenu] = useState<{
    supported: boolean
    enabledInSettings: boolean
    registered: boolean
  } | null>(null)

  async function refresh(): Promise<void> {
    const next = await loadSettingsView()
    setView(next)
    const status = window.velorix?.settings?.windowsExplorerContextMenuStatus
    if (status != null) {
      setWinMenu(await status())
    }
  }

  useEffect(() => {
    void (async () => {
      await refresh()
    })()
    const onBackup = window.velorix?.onSettingsBackupImported
    if (onBackup == null) {
      return undefined
    }
    return onBackup(() => {
      void refresh()
    })
  }, [])

  const meta = SECTION_LABELS[section]

  return (
    <div className="portal-screen settings-screen">
      <header className="portal-screen__head">
        <h1 className="portal-screen__title">Настройки</h1>
        <p className="portal-screen__subtitle">Эталон: {VELORIX_NEON_REFERENCE_SETTINGS_REL}</p>
        {statusLine != null ? <p className="settings-screen__status">{statusLine}</p> : null}
      </header>
      <section className="portal-card vn-surface-glass settings-screen__panel">
        <h2>{meta.title}</h2>
        <p className="settings-screen__panel-hint">{meta.hint}</p>
        {view == null ? (
          <p className="settings-screen__loading">Загрузка…</p>
        ) : section === 'app' ? (
          <AppSettingsFields
            view={view}
            winMenu={winMenu}
            onStatus={setStatusLine}
            onSaved={() => void refresh()}
          />
        ) : section === 'processing' ? (
          <ProcessingSettingsFields
            view={view}
            onOpenEnginePaths={() => {
              void hydrateEnginePathDraft().then(() => openModal('engine-paths'))
            }}
            onOpenFirstRun={() => openModal('first-run-engines')}
          />
        ) : (
          <CacheSettingsFields onStatus={setStatusLine} onSaved={() => void refresh()} />
        )}
      </section>
    </div>
  )
}

function AppSettingsFields(props: {
  view: AppSettingsView
  winMenu: {
    supported: boolean
    enabledInSettings: boolean
    registered: boolean
  } | null
  onStatus: (line: string | null) => void
  onSaved: () => void
}): JSX.Element {
  const { view, winMenu, onStatus, onSaved } = props
  const locale = view.uiLocale ?? 'ru'
  const confirmQuit = view.confirmCloseOnQuit !== false
  const pasteBehavior: EditorUrlPasteBehaviorId =
    view.editorUrlPasteBehavior === 'download_open_editor'
      ? 'download_open_editor'
      : 'downloads_window'

  async function patch(apply: () => Promise<unknown>, okMessage: string): Promise<void> {
    onStatus(null)
    await apply()
    onStatus(okMessage)
    onSaved()
  }

  return (
    <div className="settings-screen__fields">
      <label className="app-ui-showcase-field">
        <span className="app-ui-showcase-field-label">Язык интерфейса</span>
        <select
          className="app-settings-select"
          value={locale}
          onChange={(e) => {
            const next = e.target.value === 'en' ? 'en' : 'ru'
            void patch(async () => {
              const setLocale = window.velorix?.settings?.setUiLocale
              if (setLocale == null) {
                return
              }
              await setLocale(next as AppUiLocale)
            }, 'Язык сохранён')
          }}
        >
          <option value="ru">Русский</option>
          <option value="en">English</option>
        </select>
      </label>
      <label className="app-ui-showcase-field settings-screen__checkbox">
        <input
          type="checkbox"
          checked={confirmQuit}
          onChange={(e) => {
            void patch(async () => {
              const setConfirm = window.velorix?.settings?.setConfirmCloseOnQuit
              if (setConfirm == null) {
                return
              }
              await setConfirm(e.target.checked)
            }, 'Подтверждение выхода обновлено')
          }}
        />
        <span>Подтверждать закрытие приложения</span>
      </label>
      <label className="app-ui-showcase-field">
        <span className="app-ui-showcase-field-label">Вставка URL из буфера</span>
        <select
          className="app-settings-select"
          value={pasteBehavior}
          onChange={(e) => {
            const next =
              e.target.value === 'download_open_editor'
                ? 'download_open_editor'
                : 'downloads_window'
            void patch(async () => {
              const setPaste = window.velorix?.settings?.setEditorUrlPasteBehavior
              if (setPaste == null) {
                return
              }
              await setPaste(next)
            }, 'Поведение вставки URL сохранено')
          }}
        >
          <option value="downloads_window">Окно загрузок</option>
          <option value="download_open_editor">Скачать и открыть в редакторе</option>
        </select>
      </label>
      {winMenu?.supported === true ? (
        <label className="app-ui-showcase-field settings-screen__checkbox">
          <input
            type="checkbox"
            checked={winMenu.enabledInSettings}
            onChange={(e) => {
              void (async () => {
                onStatus(null)
                const setEnabled = window.velorix?.settings?.setWindowsExplorerContextMenuEnabled
                if (setEnabled == null) {
                  return
                }
                const result = await setEnabled(e.target.checked)
                onStatus(result.ok ? 'Контекстное меню Windows обновлено' : result.error)
                onSaved()
              })()
            }}
          />
          <span>Контекстное меню проводника (видео)</span>
        </label>
      ) : null}
      <p className="settings-screen__meta">
        Тема: <strong>{view.effectiveTheme}</strong>
      </p>
    </div>
  )
}

function ProcessingSettingsFields(props: {
  view: AppSettingsView
  onOpenEnginePaths: () => void
  onOpenFirstRun: () => void
}): JSX.Element {
  const { view, onOpenEnginePaths, onOpenFirstRun } = props
  const ytdlpDir = view.ytdlpDownloadDirectory ?? '—'
  return (
    <div className="settings-screen__fields">
      <p className="settings-screen__meta">
        Каталог загрузок yt-dlp: <code>{ytdlpDir}</code>
      </p>
      <div className="settings-screen__actions">
        <button type="button" className="app-btn app-btn-secondary" onClick={onOpenEnginePaths}>
          Пути к движкам
        </button>
        <button type="button" className="app-btn app-btn-secondary" onClick={onOpenFirstRun}>
          Первый запуск / движки
        </button>
      </div>
    </div>
  )
}

function CacheSettingsFields(props: {
  onStatus: (line: string | null) => void
  onSaved: () => void
}): JSX.Element {
  const { onStatus, onSaved } = props
  return (
    <div className="settings-screen__fields settings-screen__actions">
      <button
        type="button"
        className="app-btn app-btn-secondary"
        onClick={() => {
          void (async () => {
            onStatus(null)
            const exp = window.velorix?.settings?.exportBackup
            if (exp == null) {
              return
            }
            const result = await exp()
            if (result.ok) {
              onStatus(`Резервная копия: ${result.path}`)
            } else if ('cancelled' in result && result.cancelled) {
              onStatus(null)
            } else {
              onStatus('error' in result ? result.error : 'Ошибка экспорта')
            }
          })()
        }}
      >
        Экспорт настроек
      </button>
      <button
        type="button"
        className="app-btn app-btn-secondary"
        onClick={() => {
          void (async () => {
            onStatus(null)
            const imp = window.velorix?.settings?.importBackup
            if (imp == null) {
              return
            }
            const result = await imp()
            if (result.ok) {
              onStatus('Настройки импортированы')
              onSaved()
            } else if ('cancelled' in result && result.cancelled) {
              onStatus(null)
            } else {
              onStatus('error' in result ? result.error : 'Ошибка импорта')
            }
          })()
        }}
      >
        Импорт настроек
      </button>
      <button
        type="button"
        className="app-btn"
        onClick={() => {
          void (async () => {
            onStatus(null)
            const reset = window.velorix?.settings?.resetToDefaults
            if (reset == null) {
              return
            }
            await reset()
            onStatus('Сброшено к значениям по умолчанию')
            onSaved()
          })()
        }}
      >
        Сбросить defaults
      </button>
    </div>
  )
}

export function SettingsRail(): JSX.Element {
  const section = useAppShellStore((s) => s.settingsSection)
  const setSection = useAppShellStore((s) => s.setSettingsSection)
  const openModal = useAppShellStore((s) => s.openModal)
  const hydrateEnginePathDraft = useAppShellStore((s) => s.hydrateEnginePathDraft)

  return (
    <aside className="portal-rail vn-surface-glass">
      <h2 className="portal-rail__title">Раздел</h2>
      <nav className="settings-rail__nav">
        {(Object.keys(SECTION_LABELS) as SettingsSectionId[]).map((id) => (
          <button
            key={id}
            type="button"
            className={`settings-rail__link${section === id ? ' settings-rail__link--active' : ''}`}
            onClick={() => setSection(id)}
          >
            {SECTION_LABELS[id].title}
          </button>
        ))}
      </nav>
      <div className="settings-rail__shortcuts">
        <button
          type="button"
          className="app-btn app-btn-secondary"
          onClick={() => {
            void hydrateEnginePathDraft().then(() => openModal('engine-paths'))
          }}
        >
          Пути движков
        </button>
        <button type="button" className="app-btn" onClick={() => openModal('about')}>
          О программе
        </button>
      </div>
    </aside>
  )
}
