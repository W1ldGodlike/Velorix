import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { velorix } from './preload-velorix-bridge'

try {
  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('velorix', velorix)
} catch (error) {
  console.error(error)
}
