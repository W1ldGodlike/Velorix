import { contextBridge } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

import { fluxalloy } from './preload-fluxalloy-bridge'

try {
  contextBridge.exposeInMainWorld('electron', electronAPI)
  contextBridge.exposeInMainWorld('fluxalloy', fluxalloy)
} catch (error) {
  console.error(error)
}
