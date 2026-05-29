/**
 * §18 Support ZIP — наличие dist/*-unpacked (без smoke-скриптов).
 */
import { formatLinuxUnpackedLayoutVerifyDiagnosticLines } from './linux-unpacked-layout-verify'
import { formatMacosUnpackedLayoutVerifyDiagnosticLines } from './macos-unpacked-layout-verify'
import { formatWinUnpackedLayoutVerifyDiagnosticLines } from './win-unpacked-layout-verify'

function layoutLinesWithoutVerifyCommand(lines: readonly string[]): string[] {
  return lines.filter((line) => !line.startsWith('command: npm run verify'))
}

/** Подсказки layout win/linux/macos для `diagnostics.txt` (post smoke removal). */
export function buildSupportZipUnpackedLayoutLines(
  repoRoot: string,
  existsSync: (path: string) => boolean
): string[] {
  return [
    ...layoutLinesWithoutVerifyCommand(
      formatWinUnpackedLayoutVerifyDiagnosticLines(repoRoot, existsSync)
    ),
    ...layoutLinesWithoutVerifyCommand(
      formatMacosUnpackedLayoutVerifyDiagnosticLines(repoRoot, existsSync)
    ),
    ...layoutLinesWithoutVerifyCommand(
      formatLinuxUnpackedLayoutVerifyDiagnosticLines(repoRoot, existsSync)
    )
  ]
}
