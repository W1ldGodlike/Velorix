/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { readFileSync, writeFileSync } from 'node:fs'

const p = 'src/main/index.ts'
let s = readFileSync(p, 'utf8')
const start = s.indexOf(
  '  // IPC-каналы держим узкими: renderer просит только конкретные операции'
)
const end = s.indexOf('  ipcMain.on(mw.logRenderer')
if (start < 0 || end < 0) {
  console.error('markers not found', { start, end })
  process.exit(1)
}
const insert = `  registerExportBatchIpcHandlers({
    getActiveExportAbort: () => activeExportAbort,
    setActiveExportAbort: (ac) => {
      activeExportAbort = ac
    },
    getSettings: () => cachedSettings,
    bindBatchSnapshotBroadcast: (fn) => {
      broadcastFfmpegExportBatchSnapshot = fn
    },
    launchFfmpegExportBatchRunner,
    mainAppStr,
    mainDownloadsUiLocale,
    previewOpenDialogOptsFromSettings,
    batchExportOutputFolderPickOptsFromSettings,
    rememberedExportDefaultPath,
    rememberExportOutputPath,
    rememberFfmpegExportDirectory,
    rememberedSnapshotDefaultPath,
    rememberFfmpegSnapshotDirectory,
    openExportOutputPath,
    openDownloadedFileInMainHandler,
    parseDownloadsOpenRequest
  })

`
s = s.slice(0, start) + insert + s.slice(end)
writeFileSync(p, s)
console.log(`[splice-export-batch-ipc] removed ${end - start} chars`)
