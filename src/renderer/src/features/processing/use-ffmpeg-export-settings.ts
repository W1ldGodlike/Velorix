import { useCallback, useEffect, useState } from 'react'

import type {
  FfmpegExportAudioModeId,
  FfmpegExportContainerId,
  FfmpegExportEncodePresetId,
  FfmpegExportVideoCodecId
} from '../../../../shared/ffmpeg-export-contract'
import type { AppSettingsView } from '../../../../shared/settings-contract'

async function readSettingsView(): Promise<AppSettingsView | null> {
  const get = window.velorix?.settings?.get
  if (get == null) {
    return null
  }
  return get()
}

export function useFfmpegExportSettings(): {
  view: AppSettingsView | null
  reload: () => Promise<void>
  setCrf: (value: number) => Promise<void>
  setVideoCodec: (codec: FfmpegExportVideoCodecId) => Promise<void>
  setContainer: (container: FfmpegExportContainerId) => Promise<void>
  setEncodePreset: (preset: FfmpegExportEncodePresetId) => Promise<void>
  setAudioMode: (mode: FfmpegExportAudioModeId) => Promise<void>
} {
  const [view, setView] = useState<AppSettingsView | null>(null)

  const reload = useCallback(async () => {
    setView(await readSettingsView())
  }, [])

  useEffect(() => {
    let cancelled = false
    async function load(): Promise<void> {
      const next = await readSettingsView()
      if (!cancelled) {
        setView(next)
      }
    }
    void load()
    const unsubs: Array<() => void> = []
    const onPresets = window.velorix?.onExportPresetsDiskChanged
    const onBackup = window.velorix?.onSettingsBackupImported
    if (onPresets != null) {
      unsubs.push(onPresets(() => void load()))
    }
    if (onBackup != null) {
      unsubs.push(onBackup(() => void load()))
    }
    return () => {
      cancelled = true
      for (const unsub of unsubs) {
        unsub()
      }
    }
  }, [])

  async function patch(apply: () => Promise<unknown>): Promise<void> {
    await apply()
    await reload()
  }

  return {
    view,
    reload,
    setCrf: (value) =>
      patch(async () => {
        const set = window.velorix?.settings?.setFfmpegExportCrf
        if (set != null) {
          await set(value)
        }
      }),
    setVideoCodec: (codec) =>
      patch(async () => {
        const set = window.velorix?.settings?.setFfmpegExportVideoCodec
        if (set != null) {
          await set(codec)
        }
      }),
    setContainer: (container) =>
      patch(async () => {
        const set = window.velorix?.settings?.setFfmpegExportContainer
        if (set != null) {
          await set(container)
        }
      }),
    setEncodePreset: (preset) =>
      patch(async () => {
        const set = window.velorix?.settings?.setFfmpegExportEncodePreset
        if (set != null) {
          await set(preset)
        }
      }),
    setAudioMode: (mode) =>
      patch(async () => {
        const set = window.velorix?.settings?.setFfmpegExportAudioMode
        if (set != null) {
          await set(mode)
        }
      })
  }
}
