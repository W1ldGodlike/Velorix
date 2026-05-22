/** §4.3 — снимок активных задач для компактного окна (main → renderer push). */
export type MiniPlayerSnapshot = {
  hasActiveWork: boolean
  exportActive: boolean
  downloadActive: boolean
  /** Короткая строка прогресса (yt-dlp progress/speed или статус экспорта). */
  detailLine: string
  /** 0..100 когда известен процент из progress; иначе null. */
  progressPercent: number | null
  /** Persist из `app-data/session.json` (§4.3). */
  alwaysOnTop: boolean
}

export const MINI_PLAYER_SNAPSHOT_PUSH_CHANNEL = 'velorix:mini-player-snapshot' as const
