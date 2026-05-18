/** argv ffmpeg для извлечения одного кадра обложки. */

export function buildFfmpegCoverExtractArgv(
  inputPath: string,
  streamIndex: number,
  outputPath: string
): string[] {
  return [
    '-hide_banner',
    '-loglevel',
    'error',
    '-i',
    inputPath,
    '-map',
    `0:${streamIndex}`,
    '-frames:v',
    '1',
    '-y',
    outputPath
  ]
}
