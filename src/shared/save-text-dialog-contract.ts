/**
 * §9 — сохранение текстового содержимого из renderer через диалог «Сохранить как» в main.
 * Используется для экспорта форматированного JSON ffprobe; renderer не имеет прямого доступа к FS.
 */

/** Payload invoke из preload: заголовок диалога, предлагаемое имя файла и UTF-8 текст. */
export type SaveTextDialogPayload = {
  title: string
  /** Имя файла по умолчанию; в main нормализуется до basename (без каталогов из renderer). */
  defaultFileName: string
  content: string
}

/** Результат: успех с абсолютным путём, отмена пользователем или ошибка валидации/записи. */
export type SaveTextDialogResult =
  | { ok: true; path: string }
  | { ok: false; cancelled: true }
  | { ok: false; error: string }
