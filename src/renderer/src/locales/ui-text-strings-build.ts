/** Сборка таблиц `UI_TEXT` из TS-частей и JSON-шардов `locales/{locale}/*.json`. */
import ruAbout from '@locales/ru/about.json'
import ruCommon from '@locales/ru/common.json'
import ruDownloads from '@locales/ru/downloads.json'
import ruDownloadsSettings from '@locales/ru/downloads-settings.json'
import ruEditor from '@locales/ru/editor.json'
import ruVideo from '@locales/ru/video.json'
import ruMini from '@locales/ru/mini.json'
import ruEditorFfmpeg from '@locales/ru/editor-ffmpeg.json'
import ruShell from '@locales/ru/shell.json'
import ruStatus from '@locales/ru/status.json'
import ruBatchExport from '@locales/ru/batch-export.json'
import ruSettings from '@locales/ru/settings.json'
import ruInspector from '@locales/ru/inspector.json'
import ruInspectorProbe from '@locales/ru/inspector-probe.json'
import ruFormatting from '@locales/ru/formatting.json'
import ruKnowledge from '@locales/ru/knowledge.json'
import ruMaintenance from '@locales/ru/maintenance.json'
import ruProcessing from '@locales/ru/processing.json'
import ruTerminal from '@locales/ru/terminal.json'
import ruWorkspace from '@locales/ru/workspace.json'
import ruWorkflow from '@locales/ru/workflow.json'
import enAbout from '@locales/en/about.json'
import enCommon from '@locales/en/common.json'
import enDownloads from '@locales/en/downloads.json'
import enDownloadsSettings from '@locales/en/downloads-settings.json'
import enEditor from '@locales/en/editor.json'
import enVideo from '@locales/en/video.json'
import enMini from '@locales/en/mini.json'
import enEditorFfmpeg from '@locales/en/editor-ffmpeg.json'
import enShell from '@locales/en/shell.json'
import enStatus from '@locales/en/status.json'
import enBatchExport from '@locales/en/batch-export.json'
import enSettings from '@locales/en/settings.json'
import enInspector from '@locales/en/inspector.json'
import enInspectorProbe from '@locales/en/inspector-probe.json'
import enFormatting from '@locales/en/formatting.json'
import enKnowledge from '@locales/en/knowledge.json'
import enMaintenance from '@locales/en/maintenance.json'
import enProcessing from '@locales/en/processing.json'
import enTerminal from '@locales/en/terminal.json'
import enWorkspace from '@locales/en/workspace.json'
import enWorkflow from '@locales/en/workflow.json'
import { uiTextStringsRuPart01 } from './ui-text-strings-ru-01'
import { uiTextStringsRuPart02 } from './ui-text-strings-ru-02'
import { uiTextStringsRuPart03 } from './ui-text-strings-ru-03'
import { uiTextStringsRuPart04 } from './ui-text-strings-ru-04'
import { uiTextStringsRuPart05 } from './ui-text-strings-ru-05'
import { uiTextStringsRuPart06 } from './ui-text-strings-ru-06'
import { uiTextStringsRuPart07 } from './ui-text-strings-ru-07'
import { uiTextStringsRuPart08 } from './ui-text-strings-ru-08'
import { uiTextStringsEnPart01 } from './ui-text-strings-en-01'
import { uiTextStringsEnPart02 } from './ui-text-strings-en-02'
import { uiTextStringsEnPart03 } from './ui-text-strings-en-03'
import { uiTextStringsEnPart04 } from './ui-text-strings-en-04'
import { uiTextStringsEnPart05 } from './ui-text-strings-en-05'
import { uiTextStringsEnPart06 } from './ui-text-strings-en-06'
import { uiTextStringsEnPart07 } from './ui-text-strings-en-07'
import { uiTextStringsEnPart08 } from './ui-text-strings-en-08'

export function buildUiTextTables() {
  const ru = {
    ...uiTextStringsRuPart01,
    ...uiTextStringsRuPart02,
    ...uiTextStringsRuPart03,
    ...uiTextStringsRuPart04,
    ...uiTextStringsRuPart05,
    ...uiTextStringsRuPart06,
    ...uiTextStringsRuPart07,
    ...uiTextStringsRuPart08,
    ...ruCommon,
    ...ruAbout,
    ...ruMaintenance,
    ...ruFormatting,
    ...ruKnowledge,
    ...ruTerminal,
    ...ruProcessing,
    ...ruDownloads,
    ...ruDownloadsSettings,
    ...ruWorkspace,
    ...ruEditor,
    ...ruVideo,
    ...ruMini,
    ...ruShell,
    ...ruEditorFfmpeg,
    ...ruStatus,
    ...ruBatchExport,
    ...ruSettings,
    ...ruInspector,
    ...ruInspectorProbe,
    ...ruWorkflow
  } as const
  const en = {
    ...uiTextStringsEnPart01,
    ...uiTextStringsEnPart02,
    ...uiTextStringsEnPart03,
    ...uiTextStringsEnPart04,
    ...uiTextStringsEnPart05,
    ...uiTextStringsEnPart06,
    ...uiTextStringsEnPart07,
    ...uiTextStringsEnPart08,
    ...enCommon,
    ...enAbout,
    ...enMaintenance,
    ...enFormatting,
    ...enKnowledge,
    ...enTerminal,
    ...enProcessing,
    ...enDownloads,
    ...enDownloadsSettings,
    ...enWorkspace,
    ...enEditor,
    ...enVideo,
    ...enMini,
    ...enShell,
    ...enEditorFfmpeg,
    ...enStatus,
    ...enBatchExport,
    ...enSettings,
    ...enInspector,
    ...enInspectorProbe,
    ...enWorkflow
  } as const
  return { ru, en } as const
}

export type UiTextTables = ReturnType<typeof buildUiTextTables>
