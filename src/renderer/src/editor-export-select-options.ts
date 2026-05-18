import type {
  FfmpegExportAudioModeId,
  FfmpegExportAudioNormalizeId,
  FfmpegExportContainerId,
  FfmpegExportCropPresetId,
  FfmpegExportEncodePresetId,
  FfmpegExportScalePresetId,
  FfmpegExportSubtitleModeId,
  FfmpegExportVideoCodecId,
  FfmpegExportVideoDebandId,
  FfmpegExportVideoDeinterlaceId,
  FfmpegExportVideoDenoiseId,
  FfmpegExportVideoEqPresetId,
  FfmpegExportVideoGrainId,
  FfmpegExportVideoHisteqId,
  FfmpegExportVideoHueId,
  FfmpegExportVideoBlurId,
  FfmpegExportVideoLut3dId,
  FfmpegExportVideoSharpenId,
  FfmpegExportVideoTransformId,
  FfmpegExportVideoVignetteId
} from '../../shared/ffmpeg-export-contract'
import type { FfmpegSnapshotFormatId } from '../../shared/ffmpeg-snapshot-contract'
import {
  FFMPEG_HW_ENCODER_LABEL_UI_KEYS,
  FFMPEG_HW_VIDEO_ENCODER_SELECT_ORDER
} from '../../shared/ffmpeg-export-hw-codec-ui'
import type { FfmpegHwEncodersProbeResult } from '../../shared/ffmpeg-hw-encoder-probe'
import { isFfmpegHwExportVideoCodec } from '../../shared/ffmpeg-export-video-codec'
import { uiText, uiTextVars } from './locales/ui-text'
import type { UiTextKey } from './locales/ui-text-strings'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- FfmpegExportSelectOptions = ReturnType below
export function buildEditorExportSelectOptions(
  hwEncoderProbe: FfmpegHwEncodersProbeResult | null,
  exportVideoCodec: FfmpegExportVideoCodecId
) {
  return {
    encodePresets: [
      { id: 'balance', label: uiText('editorExportEncodeBalance') },
      { id: 'smaller', label: uiText('editorExportEncodeSmaller') },
      { id: 'quality', label: uiText('editorExportEncodeQuality') }
    ] as Array<{ id: FfmpegExportEncodePresetId; label: string }>,
    videoCodecs: (() => {
      const v: Array<{ id: FfmpegExportVideoCodecId; label: string }> = [
        { id: 'libx264', label: uiText('editorExportCodecH264') },
        { id: 'libx265', label: uiText('editorExportCodecH265') },
        { id: 'libvpx-vp9', label: uiText('editorExportCodecVp9') },
        { id: 'libsvtav1', label: uiText('editorExportCodecSvtav1') },
        { id: 'libaom-av1', label: uiText('editorExportCodecAomav1') },
        { id: 'librav1e', label: uiText('editorExportCodecLibrav1e') },
        { id: 'prores_ks', label: uiText('editorExportCodecProresKs') },
        { id: 'dnxhd', label: uiText('editorExportCodecDnxhd') },
        { id: 'ffv1', label: uiText('editorExportCodecFfv1') },
        { id: 'hw_auto', label: uiText('editorExportCodecHwAuto') },
        { id: 'hw_auto_hevc', label: uiText('editorExportCodecHwAutoHevc') }
      ]
      if (hwEncoderProbe?.ok === true) {
        for (const id of FFMPEG_HW_VIDEO_ENCODER_SELECT_ORDER) {
          if (hwEncoderProbe.snapshot[id]) {
            const labelKey = FFMPEG_HW_ENCODER_LABEL_UI_KEYS[id]
            v.push({ id, label: uiText(labelKey as UiTextKey) })
          }
        }
      } else if (isFfmpegHwExportVideoCodec(exportVideoCodec)) {
        const labelKey = FFMPEG_HW_ENCODER_LABEL_UI_KEYS[exportVideoCodec]
        v.push({
          id: exportVideoCodec,
          label: uiTextVars('editorExportCodecHwProbeUnknownLabel', {
            label: uiText(labelKey as UiTextKey)
          })
        })
      }
      return v
    })(),
    containers: [
      { id: 'mp4', label: uiText('editorExportContainerMp4') },
      { id: 'mkv', label: uiText('editorExportContainerMkv') },
      { id: 'mov', label: uiText('editorExportContainerMov') }
    ] as Array<{ id: FfmpegExportContainerId; label: string }>,
    scalePresets: [
      { id: 'source', label: uiText('editorExportScaleSource') },
      { id: '480p', label: uiText('editorExportScale480p') },
      { id: '720p', label: uiText('editorExportScale720p') },
      { id: '1080p', label: uiText('editorExportScale1080p') }
    ] as Array<{ id: FfmpegExportScalePresetId; label: string }>,
    videoTransforms: [
      { id: 'none', label: uiText('editorExportTransformNone') },
      { id: 'cw90', label: uiText('editorExportTransformCw90') },
      { id: 'ccw90', label: uiText('editorExportTransformCcw90') },
      { id: 'r180', label: uiText('editorExportTransformR180') },
      { id: 'hflip', label: uiText('editorExportTransformHflip') },
      { id: 'vflip', label: uiText('editorExportTransformVflip') }
    ] as Array<{ id: FfmpegExportVideoTransformId; label: string }>,
    cropPresets: [
      { id: 'none', label: uiText('editorExportCropNone') },
      { id: 'center-square', label: uiText('editorExportCropCenterSquare') },
      { id: 'center-16-9', label: uiText('editorExportCropCenter169') },
      { id: 'center-4-3', label: uiText('editorExportCropCenter43') }
    ] as Array<{ id: FfmpegExportCropPresetId; label: string }>,
    audioGainOptions: [
      { value: -12, label: uiText('editorExportAudioGainM12') },
      { value: -9, label: uiText('editorExportAudioGainM9') },
      { value: -6, label: uiText('editorExportAudioGainM6') },
      { value: -3, label: uiText('editorExportAudioGainM3') },
      { value: 0, label: uiText('editorExportAudioGain0') },
      { value: 3, label: uiText('editorExportAudioGainP3') },
      { value: 6, label: uiText('editorExportAudioGainP6') },
      { value: 9, label: uiText('editorExportAudioGainP9') },
      { value: 12, label: uiText('editorExportAudioGainP12') }
    ],
    subtitleModes: [
      { id: 'drop', label: uiText('editorExportSubtitleDrop') },
      { id: 'copy', label: uiText('editorExportSubtitleCopy') }
    ] as Array<{ id: FfmpegExportSubtitleModeId; label: string }>,
    videoDeinterlace: [
      { id: 'off', label: uiText('editorExportDeinterlaceOff') },
      { id: 'frame', label: uiText('editorExportDeinterlaceFrame') },
      { id: 'field', label: uiText('editorExportDeinterlaceField') }
    ] as Array<{ id: FfmpegExportVideoDeinterlaceId; label: string }>,
    videoDenoise: [
      { id: 'off', label: uiText('editorExportDenoiseOff') },
      { id: 'light', label: uiText('editorExportDenoiseLight') },
      { id: 'medium', label: uiText('editorExportDenoiseMedium') },
      { id: 'strong', label: uiText('editorExportDenoiseStrong') }
    ] as Array<{ id: FfmpegExportVideoDenoiseId; label: string }>,
    videoSharpen: [
      { id: 'off', label: uiText('editorExportSharpenOff') },
      { id: 'light', label: uiText('editorExportSharpenLight') },
      { id: 'medium', label: uiText('editorExportSharpenMedium') },
      { id: 'strong', label: uiText('editorExportSharpenStrong') }
    ] as Array<{ id: FfmpegExportVideoSharpenId; label: string }>,
    videoDeband: [
      { id: 'off', label: uiText('editorExportDebandOff') },
      { id: 'light', label: uiText('editorExportDebandLight') },
      { id: 'medium', label: uiText('editorExportDebandMedium') },
      { id: 'strong', label: uiText('editorExportDebandStrong') }
    ] as Array<{ id: FfmpegExportVideoDebandId; label: string }>,
    videoHisteq: [
      { id: 'off', label: uiText('editorExportHisteqOff') },
      { id: 'light', label: uiText('editorExportHisteqLight') },
      { id: 'medium', label: uiText('editorExportHisteqMedium') },
      { id: 'strong', label: uiText('editorExportHisteqStrong') }
    ] as Array<{ id: FfmpegExportVideoHisteqId; label: string }>,
    videoLut3d: [
      { id: 'off', label: uiText('editorExportLut3dOff') },
      { id: 'film-warm', label: uiText('editorExportLut3dFilmWarm') },
      { id: 'film-cool', label: uiText('editorExportLut3dFilmCool') },
      { id: 'punch', label: uiText('editorExportLut3dPunch') }
    ] as Array<{ id: FfmpegExportVideoLut3dId; label: string }>,
    videoEq: [
      { id: 'off', label: uiText('editorExportEqOff') },
      { id: 'warm', label: uiText('editorExportEqWarm') },
      { id: 'cool', label: uiText('editorExportEqCool') },
      { id: 'vivid', label: uiText('editorExportEqVivid') },
      { id: 'flat', label: uiText('editorExportEqFlat') }
    ] as Array<{ id: FfmpegExportVideoEqPresetId; label: string }>,
    videoHue: [
      { id: 'off', label: uiText('editorExportHueOff') },
      { id: 'warmShift', label: uiText('editorExportHueWarmShift') },
      { id: 'coolShift', label: uiText('editorExportHueCoolShift') },
      { id: 'satBoost', label: uiText('editorExportHueSatBoost') }
    ] as Array<{ id: FfmpegExportVideoHueId; label: string }>,
    videoGrain: [
      { id: 'off', label: uiText('editorExportGrainOff') },
      { id: 'light', label: uiText('editorExportGrainLight') },
      { id: 'medium', label: uiText('editorExportGrainMedium') },
      { id: 'strong', label: uiText('editorExportGrainStrong') }
    ] as Array<{ id: FfmpegExportVideoGrainId; label: string }>,
    videoVignette: [
      { id: 'off', label: uiText('editorExportVignetteOff') },
      { id: 'light', label: uiText('editorExportVignetteLight') },
      { id: 'medium', label: uiText('editorExportVignetteMedium') },
      { id: 'strong', label: uiText('editorExportVignetteStrong') }
    ] as Array<{ id: FfmpegExportVideoVignetteId; label: string }>,
    videoBlur: [
      { id: 'off', label: uiText('editorExportBlurOff') },
      { id: 'light', label: uiText('editorExportBlurLight') },
      { id: 'medium', label: uiText('editorExportBlurMedium') },
      { id: 'strong', label: uiText('editorExportBlurStrong') }
    ] as Array<{ id: FfmpegExportVideoBlurId; label: string }>,
    audioNormalize: [
      { id: 'off', label: uiText('editorExportAudioNormOff') },
      { id: 'loudnorm', label: uiText('editorExportAudioNormLoudnorm') },
      { id: 'dynaudnorm', label: uiText('editorExportAudioNormDynaudnorm') }
    ] as Array<{ id: FfmpegExportAudioNormalizeId; label: string }>,
    audioModes: [
      { id: 'aac', label: uiText('editorExportAudioModeAac') },
      { id: 'libmp3lame', label: uiText('editorExportAudioModeLibmp3lame') },
      { id: 'ac3', label: uiText('editorExportAudioModeAc3') },
      { id: 'copy', label: uiText('editorExportAudioModeCopy') },
      { id: 'pcm_s16le', label: uiText('editorExportAudioModePcmS16le') },
      { id: 'libvorbis', label: uiText('editorExportAudioModeLibvorbis') },
      { id: 'libopus', label: uiText('editorExportAudioModeLibopus') },
      { id: 'flac', label: uiText('editorExportAudioModeFlac') },
      { id: 'alac', label: uiText('editorExportAudioModeAlac') },
      { id: 'none', label: uiText('editorExportAudioModeNone') }
    ] as Array<{ id: FfmpegExportAudioModeId; label: string }>,
    snapshotFormats: [
      { id: 'png', label: uiText('editorExportSnapshotPng') },
      { id: 'jpg', label: uiText('editorExportSnapshotJpg') },
      { id: 'webp', label: uiText('editorExportSnapshotWebp') }
    ] as Array<{ id: FfmpegSnapshotFormatId; label: string }>
  }
}

export type FfmpegExportSelectOptions = ReturnType<typeof buildEditorExportSelectOptions>
