import { existsSync } from 'fs'
import { join } from 'path'

export type PreloadStem = 'index' | 'downloadsWindow'

/** После сборки electron-vite кладёт preloads как `.mjs`; в некоторых конфигурациях встречался `.js`. */
export function resolvePreloadOutFile(stem: PreloadStem, mainDirname: string): string {
  const dir = join(mainDirname, '../preload')
  const mjs = join(dir, `${stem}.mjs`)
  const js = join(dir, `${stem}.js`)
  if (existsSync(mjs)) {
    return mjs
  }
  if (existsSync(js)) {
    return js
  }
  return mjs
}
