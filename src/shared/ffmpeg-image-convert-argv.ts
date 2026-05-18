import type { MediaUtilitiesImageFormatId } from './media-utilities-contract'

/** §7.5 — однокадровая конвертация изображения через ffmpeg. */
export function buildFfmpegConvertImageArgv(
  inputPath: string,
  outputPath: string,
  format: MediaUtilitiesImageFormatId
): string[] {
  const base = [
    '-hide_banner',
    '-loglevel',
    'error',
    '-i',
    inputPath,
    '-frames:v',
    '1'
  ]
  if (format === 'jpg') {
    return [...base, '-q:v', '2', '-y', outputPath]
  }
  if (format === 'webp') {
    return [...base, '-c:v', 'libwebp', '-quality', '85', '-y', outputPath]
  }
  return [...base, '-y', outputPath]
}
