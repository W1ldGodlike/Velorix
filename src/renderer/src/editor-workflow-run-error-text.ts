import type {
  WorkflowRunScenarioOnFileError,
  WorkflowRunScenarioOnUrlError
} from '../../shared/workflow-watch-folder-contract'
import { uiText } from './locales/ui-text'

export function workflowRunScenarioOnFileErrorText(
  code: WorkflowRunScenarioOnFileError
): string {
  switch (code) {
    case 'bad-args':
      return uiText('editorWorkflowRunErrorBadArgs')
    case 'scenario-not-found':
      return uiText('editorWorkflowRunErrorScenario')
    case 'path-missing':
      return uiText('editorWorkflowRunErrorNoFile')
    case 'path-denied':
      return uiText('editorWorkflowRunErrorPathDenied')
    case 'no-export-step':
      return uiText('editorWorkflowRunErrorNoExport')
    default:
      return uiText('editorWorkflowRunErrorGeneric')
  }
}

export function workflowRunScenarioOnUrlErrorText(code: WorkflowRunScenarioOnUrlError): string {
  if (code === 'no-source-url') {
    return uiText('editorWorkflowRunUrlErrorNoSource')
  }
  if (code === 'download-start-failed') {
    return uiText('editorWorkflowRunUrlErrorDownload')
  }
  return workflowRunScenarioOnFileErrorText(code)
}
