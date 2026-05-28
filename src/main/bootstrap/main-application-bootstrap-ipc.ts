import { app } from 'electron'

import {
  buildKnowledgeHelpDirCandidates,
  resolveKnowledgeHelpDirectory
} from '../services/knowledge/knowledge-service'
import { registerMainShellIpcHandlers } from '../ipc/register-main-shell-ipc'
import { registerMainRendererLogIpcHandler } from './main-bootstrap-ipc-helpers'
import { registervelorixmediaProtocol } from '../core/media-protocol'
import { registerFluxHelpProtocol } from '../core/help-assets-protocol'

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
  registerMainShellIpcHandlers()
  registerMainRendererLogIpcHandler()
}
