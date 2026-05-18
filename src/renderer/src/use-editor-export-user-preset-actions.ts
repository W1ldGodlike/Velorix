import { useCallback, type Dispatch, type SetStateAction } from 'react'

import { isBuiltinExportUserPresetId } from '../../shared/builtin-ffmpeg-export-user-presets'
import {
  FFMPEG_EXPORT_USER_ADDED_PRESETS_MAX,
  FFMPEG_EXPORT_USER_PRESETS_MAX_ENTRIES,
  type FfmpegExportUserPreset,
  type FfmpegExportUserPresetSnapshot
} from '../../shared/ffmpeg-export-contract'
import { uiText } from './locales/ui-text'
import type { ExportPresetNameDialogState } from './editor-export-settings-types'

export type UseEditorExportUserPresetActionsParams = {
  setStatusHint: (hint: string | null) => void
  exportUserPresets: FfmpegExportUserPreset[]
  setExportUserPresets: (presets: FfmpegExportUserPreset[]) => void
  selectedUserPresetId: string | null
  setSelectedUserPresetId: (id: string | null) => void
  exportPresetNameDialog: ExportPresetNameDialogState
  setExportPresetNameDialog: Dispatch<SetStateAction<ExportPresetNameDialogState>>
  exportPresetSaving: boolean
  setExportPresetSaving: (saving: boolean) => void
  buildCurrentExportSnapshot: () => FfmpegExportUserPresetSnapshot
}

export function useEditorExportUserPresetActions(params: UseEditorExportUserPresetActionsParams): {
  handleSaveExportUserPreset: () => void
  handleDeleteExportUserPreset: () => void
  handleRenameExportUserPreset: () => void
  handleSubmitExportPresetName: () => Promise<void>
  handleOverwriteExportUserPreset: () => void
} {
  const {
    setStatusHint,
    exportUserPresets,
    setExportUserPresets,
    selectedUserPresetId,
    setSelectedUserPresetId,
    exportPresetNameDialog,
    setExportPresetNameDialog,
    setExportPresetSaving,
    buildCurrentExportSnapshot
  } = params

  const handleSaveExportUserPreset = useCallback(() => {
    if (exportUserPresets.length >= FFMPEG_EXPORT_USER_PRESETS_MAX_ENTRIES) {
      setStatusHint(uiText('editorExportUserPresetsMaxTotalStatus'))
      return
    }
    const userAdded = exportUserPresets.filter((p) => !isBuiltinExportUserPresetId(p.id)).length
    if (userAdded >= FFMPEG_EXPORT_USER_ADDED_PRESETS_MAX) {
      setStatusHint(uiText('editorExportUserPresetsMaxStatus'))
      return
    }
    setExportPresetNameDialog({
      mode: 'create',
      value: uiText('editorExportPresetDefaultName'),
      error: null
    })
  }, [exportUserPresets, setExportPresetNameDialog, setStatusHint])

  const handleDeleteExportUserPreset = useCallback(() => {
    if (!selectedUserPresetId) {
      return
    }
    if (isBuiltinExportUserPresetId(selectedUserPresetId)) {
      setStatusHint(uiText('editorBuiltinPresetLockedHint'))
      return
    }
    const next = exportUserPresets.filter((p) => p.id !== selectedUserPresetId)
    void window.fluxalloy.settings
      .setFfmpegExportUserPresets(next)
      .then((s) => {
        setExportUserPresets(s.ffmpegExportUserPresets ?? [])
        setSelectedUserPresetId(null)
      })
      .catch(console.error)
  }, [
    exportUserPresets,
    selectedUserPresetId,
    setExportUserPresets,
    setSelectedUserPresetId,
    setStatusHint
  ])

  const handleRenameExportUserPreset = useCallback(() => {
    if (!selectedUserPresetId) {
      return
    }
    if (isBuiltinExportUserPresetId(selectedUserPresetId)) {
      setStatusHint(uiText('editorBuiltinPresetLockedHint'))
      return
    }
    const current = exportUserPresets.find((p) => p.id === selectedUserPresetId)
    if (!current) {
      return
    }
    setExportPresetNameDialog({ mode: 'rename', value: current.label, error: null })
  }, [exportUserPresets, selectedUserPresetId, setExportPresetNameDialog, setStatusHint])

  const handleSubmitExportPresetName = useCallback(async () => {
    if (!exportPresetNameDialog) {
      return
    }
    const label = exportPresetNameDialog.value.trim()
    if (label.length === 0) {
      setExportPresetNameDialog((prev) =>
        prev === null ? null : { ...prev, error: uiText('editorExportPresetErrorEmpty') }
      )
      return
    }
    const safeLabel = label.slice(0, 64)
    if (exportPresetNameDialog.mode === 'create') {
      if (exportUserPresets.length >= FFMPEG_EXPORT_USER_PRESETS_MAX_ENTRIES) {
        setExportPresetNameDialog((prev) =>
          prev === null ? null : { ...prev, error: uiText('editorExportPresetErrorMaxTotal') }
        )
        return
      }
      const userAdded = exportUserPresets.filter((p) => !isBuiltinExportUserPresetId(p.id)).length
      if (userAdded >= FFMPEG_EXPORT_USER_ADDED_PRESETS_MAX) {
        setExportPresetNameDialog((prev) =>
          prev === null ? null : { ...prev, error: uiText('editorExportPresetErrorMax') }
        )
        return
      }
      const id = crypto.randomUUID()
      const next = [
        ...exportUserPresets,
        { id, label: safeLabel, snapshot: buildCurrentExportSnapshot() }
      ]
      setExportPresetSaving(true)
      try {
        const s = await window.fluxalloy.settings.setFfmpegExportUserPresets(next)
        setExportUserPresets(s.ffmpegExportUserPresets ?? [])
        setSelectedUserPresetId(id)
        setExportPresetNameDialog(null)
      } catch (error) {
        console.error(error)
      } finally {
        setExportPresetSaving(false)
      }
      return
    }

    if (!selectedUserPresetId) {
      setExportPresetNameDialog(null)
      return
    }
    const next = exportUserPresets.map((p) =>
      p.id === selectedUserPresetId ? { ...p, label: safeLabel } : p
    )
    setExportPresetSaving(true)
    try {
      const s = await window.fluxalloy.settings.setFfmpegExportUserPresets(next)
      setExportUserPresets(s.ffmpegExportUserPresets ?? [])
      setExportPresetNameDialog(null)
    } catch (error) {
      console.error(error)
    } finally {
      setExportPresetSaving(false)
    }
  }, [
    buildCurrentExportSnapshot,
    exportPresetNameDialog,
    exportUserPresets,
    selectedUserPresetId,
    setExportPresetNameDialog,
    setExportPresetSaving,
    setExportUserPresets,
    setSelectedUserPresetId
  ])

  const handleOverwriteExportUserPreset = useCallback(() => {
    if (!selectedUserPresetId) {
      return
    }
    if (isBuiltinExportUserPresetId(selectedUserPresetId)) {
      setStatusHint(uiText('editorBuiltinPresetLockedHint'))
      return
    }
    const snap = buildCurrentExportSnapshot()
    const next = exportUserPresets.map((p) =>
      p.id === selectedUserPresetId ? { ...p, snapshot: snap } : p
    )
    void window.fluxalloy.settings
      .setFfmpegExportUserPresets(next)
      .then((s) => {
        setExportUserPresets(s.ffmpegExportUserPresets ?? [])
      })
      .catch(console.error)
  }, [
    buildCurrentExportSnapshot,
    exportUserPresets,
    selectedUserPresetId,
    setExportUserPresets,
    setStatusHint
  ])

  return {
    handleSaveExportUserPreset,
    handleDeleteExportUserPreset,
    handleRenameExportUserPreset,
    handleSubmitExportPresetName,
    handleOverwriteExportUserPreset
  }
}
