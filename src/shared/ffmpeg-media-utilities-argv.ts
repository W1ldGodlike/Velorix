/** argv для §17 remux repair и проверки целостности. */

export function buildFfmpegRepairRemuxArgv(inputPath: string, outputPath: string): string[] {
  return ['-hide_banner', '-loglevel', 'error', '-i', inputPath, '-c', 'copy', '-y', outputPath]
}

export function buildFfmpegIntegrityCheckArgv(inputPath: string): string[] {
  return ['-hide_banner', '-v', 'error', '-i', inputPath, '-f', 'null', '-']
}

export function summarizeFfmpegIntegrityStderr(stderr: string): {
  clean: boolean
  detail: string
} {
  const lines = stderr
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
  if (lines.length === 0) {
    return { clean: true, detail: '' }
  }
  const excerpt = lines.slice(0, 8).join('\n')
  return { clean: false, detail: excerpt.length > 600 ? `${excerpt.slice(0, 600)}…` : excerpt }
}
