export type FfmpegHwManualSmokePlatformId =
  | 'win-nvenc'
  | 'linux-vaapi'
  | 'win-packaged'
  | 'linux-packaged'
  | 'macos-packaged'
  | 'win-scheduler'
  | 'macos-scheduler'
  | 'linux-scheduler'

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
