/** Данные для диалога «О программе» §4.5 (IPC без FS из renderer). */

export interface AppAboutInfo {
  appName: string
  appVersion: string
  /** Git short SHA, `FLUXALLOY_BUILD_ID` или `dev` в рабочей копии. */
  buildId: string
  /** ISO UTC времени `npm run build`; null в dev-заглушке. */
  builtAtUtc: string | null
  electronVersion: string
  chromeVersion: string
  nodeVersion: string
}
