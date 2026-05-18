/**
 * §7 — ключи ui-text для подсказки превью ffmpeg-команды (канон: use-editor-export-pipeline-preview).
 * Guard: npm run check:export-preview-hints-locale
 */
export const EDITOR_EXPORT_PREVIEW_HINT_KEYS = [
  'editorExportPreviewHintNoSource',
  'editorExportPreviewHintExternalFilter',
  'editorExportPreviewHintTwoPass',
  'editorExportPreviewHintTrimAppliedTemplate',
  'editorExportPreviewHintTrimFull',
  'editorExportPreviewHintTrimWaiting'
] as const

export type EditorExportPreviewHintKey = (typeof EDITOR_EXPORT_PREVIEW_HINT_KEYS)[number]
