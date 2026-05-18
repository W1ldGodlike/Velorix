/** Колбэки локализации для подсказок кодека (без импорта `ui-text`). */
export type EditorExportCodecUiText = {
  uiText: (key: string) => string
  uiTextVars: (key: string, vars: Record<string, string>) => string
}
