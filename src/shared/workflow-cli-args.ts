/** §10 — CLI-флаги main для watch-folder без UI. */
export const WORKFLOW_CLI_WATCH_FOLDER_TICK = '--workflow-watch-folder-tick'

export function isWorkflowWatchFolderTickArgv(
  argv: readonly string[] = process.argv
): boolean {
  return argv.includes(WORKFLOW_CLI_WATCH_FOLDER_TICK)
}
