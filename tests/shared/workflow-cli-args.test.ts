import { describe, expect, it } from 'vitest'

import {
  WORKFLOW_CLI_WATCH_FOLDER_TICK,
  isWorkflowWatchFolderTickArgv
} from '../../src/shared/workflow-cli-args'

describe('workflow-cli-args §10', () => {
  it('detects tick argv', () => {
    expect(isWorkflowWatchFolderTickArgv(['node', 'app', WORKFLOW_CLI_WATCH_FOLDER_TICK])).toBe(
      true
    )
    expect(isWorkflowWatchFolderTickArgv(['node', 'app'])).toBe(false)
  })
})
