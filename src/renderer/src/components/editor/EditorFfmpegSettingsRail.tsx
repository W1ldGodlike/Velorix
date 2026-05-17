import { ProcessingHistoryPanel } from '../ProcessingHistoryPanel'
import { IconChevronRight } from '../LucideMiniIcons'
import { uiText } from '../../locales/ui-text'
import { EditorFfmpegSettingsRailAudioSection } from './EditorFfmpegSettingsRailAudioSection'
import { EditorFfmpegSettingsRailFormatSection } from './EditorFfmpegSettingsRailFormatSection'
import { EditorFfmpegSettingsRailOutputSection } from './EditorFfmpegSettingsRailOutputSection'
import { EditorFfmpegSettingsRailPresetsSection } from './EditorFfmpegSettingsRailPresetsSection'
import { EditorFfmpegSettingsRailVideoSection } from './EditorFfmpegSettingsRailVideoSection'
export type { EditorFfmpegSettingsRailProps } from './editor-ffmpeg-settings-rail-props'
import type { EditorFfmpegSettingsRailProps } from './editor-ffmpeg-settings-rail-props'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- flat rail API for App.tsx
export function EditorFfmpegSettingsRail(props: EditorFfmpegSettingsRailProps) {
  const {
    panelOpen,
    persistMainWindowUiPanelToggle,
    onCollapseRail,
    setStatusHint,
    editorFfmpegDetailBusy,
    exportBusy,
    exportCancelBusy,
    snapshotBusy,
    probePending,
    processingHistory,
    setProcessingHistory,
    processingHistoryBusy,
    processingHistoryFilter,
    processingHistoryWeeklySummary,
    setProcessingHistoryWeeklySummary,
    applyProcessingHistoryFilter,
    refreshProcessingHistory,
    exportVisibleProcessingHistory,
    reportBatchPathsAdded
  } = props
  return (
    <aside
      className="app-settings-panel"
      aria-label={uiText('editorFfmpegSettingsAria')}
      aria-describedby="editor-ffmpeg-settings-hint"
      aria-busy={exportBusy || snapshotBusy || exportCancelBusy || probePending}
    >
      <div
        className="app-settings-panel-head"
        role="group"
        aria-label={uiText('editorFfmpegPanelHeadGroupAria')}
        aria-busy={exportBusy || snapshotBusy || exportCancelBusy || probePending}
      >
        <div>
          <h2 className="app-settings-title">{uiText('editorFfmpegSettingsTitle')}</h2>
          <p
            id="editor-ffmpeg-settings-hint"
            className="app-settings-subtitle"
            title={uiText('editorTooltipFfmpegPanelIntro')}
          >
            {uiText('editorFfmpegSettingsSubtitle')}
          </p>
        </div>
        <div
          className="app-settings-panel-head-trailing"
          role="toolbar"
          aria-orientation="horizontal"
          aria-label={uiText('editorFfmpegRailHeaderToolbarAria')}
          aria-describedby="editor-ffmpeg-settings-hint"
          aria-busy={exportBusy || snapshotBusy || exportCancelBusy || probePending}
        >
          <button
            type="button"
            className="app-icon-btn app-settings-rail-collapse-btn"
            onClick={() => {
              onCollapseRail()
            }}
            title={uiText('editorFfmpegRailCollapseTitle')}
          >
            <IconChevronRight title="" size={18} />
            <span className="app-visually-hidden">{uiText('editorFfmpegRailCollapseHidden')}</span>
          </button>
        </div>
      </div>

      <div
        role="region"
        aria-label={uiText('editorFfmpegRailSectionsRegionAria')}
        aria-describedby="editor-ffmpeg-settings-hint"
        aria-busy={editorFfmpegDetailBusy}
      >
        <EditorFfmpegSettingsRailVideoSection {...props} />
        <EditorFfmpegSettingsRailFormatSection {...props} />
        <EditorFfmpegSettingsRailAudioSection {...props} />
        <EditorFfmpegSettingsRailPresetsSection {...props} />
        <EditorFfmpegSettingsRailOutputSection {...props} />
      </div>
      <ProcessingHistoryPanel
        open={panelOpen('processingHistory')}
        busy={processingHistoryBusy}
        entries={processingHistory}
        filter={processingHistoryFilter}
        weeklySummary={processingHistoryWeeklySummary}
        onToggle={(nextOpen) => {
          persistMainWindowUiPanelToggle('processingHistory', nextOpen)
        }}
        onFilterChange={applyProcessingHistoryFilter}
        onRefresh={() => {
          void refreshProcessingHistory()
        }}
        onClear={() => {
          void window.fluxalloy.processingHistory.clear().then((res) => {
            if (!res.ok) {
              setStatusHint(res.error)
              return
            }
            setProcessingHistory([])
            void window.fluxalloy.processingHistory
              .weeklySummary()
              .then(setProcessingHistoryWeeklySummary)
          })
        }}
        onExportVisible={() => {
          void exportVisibleProcessingHistory()
        }}
        onOpenOutput={(id, mode) => {
          void window.fluxalloy.processingHistory.openOutput(id, mode).then((res) => {
            if (!res.ok) {
              setStatusHint(res.error)
            } else if (mode === 'preview') {
              setStatusHint(uiText('processingHistoryOpenOutputPreviewDone'))
            }
          })
        }}
        onOpenInputInHandler={(id) => {
          setStatusHint(uiText('processingHistoryOpenInputBusy'))
          void window.fluxalloy.processingHistory.openInputInHandler(id).then((res) => {
            setStatusHint(res.ok ? uiText('processingHistoryOpenInputDone') : res.error)
          })
        }}
        onAddInputToBatch={(id) => {
          void window.fluxalloy.batchExport.addFromHistoryInputs([id]).then((res) => {
            if (!res.ok) {
              setStatusHint(res.error)
              return
            }
            reportBatchPathsAdded(res)
          })
        }}
      />
    </aside>
  )
}
