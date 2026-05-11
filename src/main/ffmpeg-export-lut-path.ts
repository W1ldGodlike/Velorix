import { existsSync } from 'fs'
import { join } from 'path'

import type { FfmpegExportVideoLut3dId } from '../shared/ffmpeg-export-contract'

const FILENAME: Record<Exclude<FfmpegExportVideoLut3dId, 'off'>, string> = {
  'film-warm': 'film-warm.cube',
  'film-cool': 'film-cool.cube',
  punch: 'punch.cube'
}

/**
 * Каталог с `.cube`: в dev `resolveAppPaths().resources` — корень репозитория (`resources/luts/`),
 * в prod — уже `process.resourcesPath` (`…/resources`), там достаточно `luts/`.
 */
function resolveBundledLutsDirectory(resourcesOrAppRoot: string): string {
  const nested = join(resourcesOrAppRoot, 'resources', 'luts')
  if (existsSync(nested)) {
    return nested
  }
  return join(resourcesOrAppRoot, 'luts')
}

/** §7.2 — абсолютный путь к bundled `.cube` для `lut3d`; `null` если пресет `off` или файл отсутствует. */
export function resolveFfmpegExportLutCubeAbsPath(
  resourcesOrAppRoot: string,
  id: FfmpegExportVideoLut3dId | null | undefined
): string | null {
  if (!id || id === 'off') {
    return null
  }
  const file = FILENAME[id]
  if (!file) {
    return null
  }
  const abs = join(resolveBundledLutsDirectory(resourcesOrAppRoot), file)
  return existsSync(abs) ? abs : null
}
