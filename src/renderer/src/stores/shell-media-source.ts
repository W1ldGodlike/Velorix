/** Активный локальный источник превью в shell (ref.1). */

export type ShellMediaSource = {
  path: string
  name: string
  mediaUrl: string
  /** Краткая строка ffprobe для бейджа превью. */
  probeSummary?: string
}
