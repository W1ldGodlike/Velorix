export type FfmpegHwManualSmokePlatformId = 'win-nvenc' | 'linux-vaapi'

export type FfmpegHwManualSmokeChecklistStep = {
  id: string
  text: string
}

export type FfmpegHwManualSmokeChecklistSection = {
  id: FfmpegHwManualSmokePlatformId
  title: string
  prerequisites: readonly string[]
  steps: readonly FfmpegHwManualSmokeChecklistStep[]
  pass: readonly string[]
}
