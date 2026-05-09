/**
 * §6.4 — пауза активного yt-dlp через SIGSTOP/SIGCONT возможна только на POSIX.
 * В Windows у Node нет эквивалента приостановки чужого процесса без нативных обходных путей.
 */
export function isYtdlpOsPauseSupported(): boolean {
  return process.platform !== 'win32'
}
