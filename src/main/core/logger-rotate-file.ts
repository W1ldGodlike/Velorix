import { existsSync, renameSync, statSync, unlinkSync } from 'fs'
import { join } from 'path'

/** §18.5 — один backup-файл при превышении лимита (Vitest + main logger). */
export function rotateLogFileIfTooLarge(
  filePath: string,
  backupBaseName: string,
  maxBytes: number
): void {
  try {
    if (!existsSync(filePath)) {
      return
    }
    const sz = statSync(filePath).size
    if (sz < maxBytes) {
      return
    }
    const backup = join(join(filePath, '..'), backupBaseName)
    if (existsSync(backup)) {
      try {
        unlinkSync(backup)
      } catch {
        /* старый бэкап мог быть открыт */
      }
    }
    renameSync(filePath, backup)
  } catch {
    /* ротация не должна ронять запись новых строк */
  }
}
