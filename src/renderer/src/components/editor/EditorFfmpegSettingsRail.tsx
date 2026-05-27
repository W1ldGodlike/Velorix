import type { JSX } from 'react'

import { KNOWLEDGE_SLUG_FFMPEG_RAIL_PRESETS } from '../../../../shared/knowledge-contract'
import { ProcessingHistoryPanelConnected } from '../ProcessingHistoryPanelConnected'
import { IconChevronRight } from '../LucideMiniIcons'
import { KnowledgeDeepLinkButton } from '../KnowledgeDeepLinkButton'
import { uiText } from '../../locales/ui-text'
import { EditorFfmpegSettingsRailAudioSection } from './EditorFfmpegSettingsRailAudioSection'
import { EditorFfmpegSettingsRailFormatSection } from './EditorFfmpegSettingsRailFormatSection'
import { EditorFfmpegSettingsRailOutputSection } from './EditorFfmpegSettingsRailOutputSection'
import { EditorFfmpegSettingsRailPresetsSection } from './EditorFfmpegSettingsRailPresetsSection'
import { EditorWorkflowScenarioSection } from './EditorWorkflowScenarioSection'
import { EditorFfmpegSettingsRailVideoSection } from './EditorFfmpegSettingsRailVideoSection'
export type { EditorFfmpegSettingsRailProps } from './editor-ffmpeg-settings-rail-props'
import type { EditorFfmpegSettingsRailProps } from './editor-ffmpeg-settings-rail-props'

export function EditorFfmpegSettingsRail(props: EditorFfmpegSettingsRailProps): JSX.Element {
  const {
    panelOpen,
    persistMainWindowUiPanelToggle,
    onCollapseRail,
    editorFfmpegDetailBusy,
    exportBusy,
    exportCancelBusy,
    snapshotBusy,
    probePending,
    onOpenKnowledgeArticle
  } = props
  return (
    <aside
      className="app-settings-panel app-neon-inspector-rail"
      aria-label={uiText('editorFfmpegSettingsAria')}
      aria-describedby="editor-ffmpeg-settings-hint"
      aria-busy={exportBusy || snapshotBusy || exportCancelBusy || probePending}
    >
      <div
        className="app-settings-panel-head"
        role="group"
        aria-label={uiText('editorFfmpegPanelHeadGroupAria')}
        aria-describedby="editor-ffmpeg-settings-hint"
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
          {onOpenKnowledgeArticle ? (
            <KnowledgeDeepLinkButton
              label={uiText('knowledgeDeepLinkFfmpegRailLabel')}
              tooltip={uiText('knowledgeDeepLinkFfmpegRailTooltip')}
              ariaDescribedBy="editor-ffmpeg-settings-hint"
              disabled={exportBusy || snapshotBusy || exportCancelBusy || probePending}
              onOpen={() => {
                onOpenKnowledgeArticle(KNOWLEDGE_SLUG_FFMPEG_RAIL_PRESETS)
              }}
            />
          ) : null}
          <button
            type="button"
            className="app-icon-btn app-settings-rail-collapse-btn"
            aria-describedby="editor-ffmpeg-settings-hint"
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
        <EditorWorkflowScenarioSection {...props} />
        <EditorFfmpegSettingsRailOutputSection {...props} />
      </div>
      <ProcessingHistoryPanelConnected
        open={panelOpen('processingHistory')}
        {...(onOpenKnowledgeArticle ? { onOpenKnowledgeArticle } : {})}
        onToggle={(nextOpen) => {
          persistMainWindowUiPanelToggle('processingHistory', nextOpen)
        }}
      />
    </aside>
  )
}
