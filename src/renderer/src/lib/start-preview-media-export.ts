import type {
  FfmpegExportEncodePresetId,
  MediaExportStartResult
} from '../../../shared/ffmpeg-export-contract'
import type { MediaProbeSuccess } from '../../../shared/ffprobe-contract'
import type { AppSettingsView } from '../../../shared/settings-contract'

import type { SystemModalId } from '../app/system-modal'

function readEncodePreset(raw: string | undefined): FfmpegExportEncodePresetId | undefined {
  if (raw === 'smaller' || raw === 'quality' || raw === 'balance') {
    return raw
  }
  return undefined
}

/** §7.2 — одиночный экспорт открытого в превью файла (настройки из `settings.get` или store). */
export async function startPreviewMediaExport(args: {
  inputPath: string
  mediaProbe?: MediaProbeSuccess | null
  settings?: AppSettingsView | null
  openModal: (id: SystemModalId) => void
}): Promise<MediaExportStartResult | null> {
  const start = window.velorix?.export?.start
  if (start == null) {
    return null
  }
  const settings = args.settings
  const duration = args.mediaProbe?.durationSec
  const probeDurationSec =
    duration != null && Number.isFinite(duration) && duration > 0 ? duration : null
  const encodePreset = readEncodePreset(settings?.ffmpegExportEncodePreset)

  const result = await start({
    inputPath: args.inputPath,
    uiLocale: 'ru',
    probeDurationSec,
    ...(encodePreset != null ? { encodePreset } : {}),
    ...(settings?.ffmpegExportVideoCodec != null
      ? { videoCodec: settings.ffmpegExportVideoCodec }
      : {}),
    ...(settings?.ffmpegExportContainer != null
      ? { container: settings.ffmpegExportContainer }
      : {}),
    ...(settings?.ffmpegExportCrf != null ? { crf: settings.ffmpegExportCrf } : {}),
    ...(settings?.ffmpegExportAudioMode != null
      ? { audioMode: settings.ffmpegExportAudioMode }
      : {})
  })

  if (!result.ok && !('cancelled' in result && result.cancelled)) {
    args.openModal('ffmpeg-error')
  }
  return result
}
