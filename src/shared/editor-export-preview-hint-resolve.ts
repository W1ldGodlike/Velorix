import type { EditorExportPreviewHintKey } from './editor-export-preview-hint-keys'

export type EditorExportPreviewHintResolveInput = {
  extraArgsOk: boolean
  hasPreviewSource: boolean
  externalFilterKind: 'off' | 'avisynth' | 'vapoursynth'
  externalFilterScriptAbsPath: string | null
  pass1Command: string | null | undefined
  appliedTrim: boolean
  trimRange: { inSec: number; outSec: number } | null
  probeDurationSec: number | null | undefined
}

export type EditorExportPreviewHintResolveResult =
  | { kind: 'extraArgsError' }
  | { kind: 'hint'; key: EditorExportPreviewHintKey; vars?: Record<string, string> }

/**
 * §7.2 — какая подсказка показывается под превью ffmpeg-команды (без uiText).
 * Канон ключей: editor-export-preview-hint-keys.ts
 */
export function resolveEditorExportPreviewHint(
  input: EditorExportPreviewHintResolveInput
): EditorExportPreviewHintResolveResult {
  if (!input.extraArgsOk) {
    return { kind: 'extraArgsError' }
  }
  if (!input.hasPreviewSource) {
    return { kind: 'hint', key: 'editorExportPreviewHintNoSource' }
  }
  if (
    (input.externalFilterKind === 'avisynth' || input.externalFilterKind === 'vapoursynth') &&
    input.externalFilterScriptAbsPath
  ) {
    return {
      kind: 'hint',
      key: 'editorExportPreviewHintExternalFilter',
      vars: {
        kind: input.externalFilterKind,
        path: input.externalFilterScriptAbsPath
      }
    }
  }
  if (input.pass1Command) {
    return { kind: 'hint', key: 'editorExportPreviewHintTwoPass' }
  }
  if (input.appliedTrim && input.trimRange !== null) {
    const span = Math.max(0, input.trimRange.outSec - input.trimRange.inSec)
    return {
      kind: 'hint',
      key: 'editorExportPreviewHintTrimAppliedTemplate',
      vars: {
        in: input.trimRange.inSec.toFixed(2),
        t: span.toFixed(2)
      }
    }
  }
  if (input.trimRange !== null && input.probeDurationSec) {
    return { kind: 'hint', key: 'editorExportPreviewHintTrimFull' }
  }
  return { kind: 'hint', key: 'editorExportPreviewHintTrimWaiting' }
}
