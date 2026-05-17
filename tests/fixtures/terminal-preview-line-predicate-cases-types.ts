/** Тип составного предиката fullLine для smoke preview/ffprobe (§8 терминал). */
export type TerminalPreviewLinePredicate = {
  label: string
  includes: readonly string[]
  excludes?: readonly string[]
  needPlaceholder?: boolean
}
