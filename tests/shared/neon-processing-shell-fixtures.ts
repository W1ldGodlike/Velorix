import { readFileSync } from 'node:fs'
import { join } from 'node:path'

export type Ref1ProcessingShellAssets = {
  tsx: string
  center: string
  parts: string
  data: string
  css: string
  iconsCss: string
  chrome: string
  brandCss: string
}

/** Shared file reads for ref.1 processing shell guard tests. */
export function loadRef1ProcessingShellAssets(): Ref1ProcessingShellAssets {
  return {
    tsx: readFileSync(join(process.cwd(), 'src/renderer/src/pages/ProcessingScreen.tsx'), 'utf8'),
    center: readFileSync(
      join(process.cwd(), 'src/renderer/src/pages/processing-ref1-center-parts.tsx'),
      'utf8'
    ),
    parts: readFileSync(
      join(process.cwd(), 'src/renderer/src/pages/processing-ref1-parts.tsx'),
      'utf8'
    ),
    data: readFileSync(
      join(process.cwd(), 'src/renderer/src/pages/processing-ref1-data.ts'),
      'utf8'
    ),
    css: readFileSync(join(process.cwd(), 'src/renderer/src/assets/ref1-processing.css'), 'utf8'),
    iconsCss: readFileSync(
      join(process.cwd(), 'src/renderer/src/assets/ref1-processing-icons.css'),
      'utf8'
    ),
    chrome: readFileSync(
      join(process.cwd(), 'src/renderer/src/components/NeonWindowChrome.tsx'),
      'utf8'
    ),
    brandCss: readFileSync(join(process.cwd(), 'src/renderer/src/assets/neon-brand.css'), 'utf8')
  }
}
