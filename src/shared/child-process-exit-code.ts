/** Node на Windows отдаёт отрицательные коды ffmpeg как uint32 (например -22 → 4294967274). */
export function normalizeChildProcessExitCode(code: number | null | undefined): number | null {
  if (code === null || code === undefined) {
    return null
  }
  if (!Number.isFinite(code)) {
    return null
  }
  return code > 0x7fffffff ? code - 0x1_0000_0000 : code
}

export function formatChildProcessExitCode(code: number | null | undefined): string {
  const normalized = normalizeChildProcessExitCode(code)
  return normalized === null ? '?' : String(normalized)
}
