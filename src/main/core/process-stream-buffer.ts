/** Максимум накопленного tail stdout/stderr одного процесса (символы UTF-16). */
export const MAX_PROCESS_STREAM_BUFFER_CHARS = 256_000

export function appendProcessStreamBuffer(current: string, chunk: string): string {
  const next = current + chunk
  if (next.length <= MAX_PROCESS_STREAM_BUFFER_CHARS) {
    return next
  }
  return next.slice(next.length - MAX_PROCESS_STREAM_BUFFER_CHARS)
}
