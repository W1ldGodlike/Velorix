import { existsSync } from 'fs'
import { join } from 'path'

import { app } from 'electron'

import {
  buildKnowledgeHelpDirCandidates,
  resolveKnowledgeHelpDirectory
} from '../services/knowledge/knowledge-service'
import { registerMainShellIpcHandlers } from '../ipc/register-main-shell-ipc'
import { registerMainRendererLogIpcHandler } from './main-bootstrap-ipc-helpers'
import { registervelorixmediaProtocol } from '../core/media-protocol'
import { registerFluxHelpProtocol } from '../core/help-assets-protocol'
import { registerVelorixReferenceProtocol } from '../core/reference-assets-protocol'

export function registerMainApplicationBootstrapIpc(): void {
  registervelorixmediaProtocol()
  registerFluxHelpProtocol(() =>
    resolveKnowledgeHelpDirectory(
      buildKnowledgeHelpDirCandidates({
        cwd: process.cwd(),
        appPath: app.getAppPath(),
        resourcesPath: process.resourcesPath,
        isPackaged: app.isPackaged
      })
    )
  )
  registerVelorixReferenceProtocol(() => {
    const dir = join(app.getAppPath(), 'docs', 'reference')
    return existsSync(dir) ? dir : null
  })
  registerMainShellIpcHandlers()
  registerMainRendererLogIpcHandler()
}
