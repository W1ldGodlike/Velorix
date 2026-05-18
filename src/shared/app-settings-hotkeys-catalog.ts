/** Статический список ускорителей меню для раздела «Горячие клавиши» §4.6 (не дублирует Electron roles). */
export const APP_SETTINGS_HOTKEY_ROWS = [
  { id: 'openFile', accel: 'CmdOrCtrl+O' },
  { id: 'openVideoFolder', accel: 'CmdOrCtrl+Shift+O' },
  { id: 'downloadsManager', accel: 'CmdOrCtrl+Shift+Y' },
  { id: 'pasteUrlDownloads', accel: 'CmdOrCtrl+Shift+V' },
  { id: 'pasteUrlGlobal', accel: 'CmdOrCtrl+V' }
] as const

export type AppSettingsHotkeyRowId = (typeof APP_SETTINGS_HOTKEY_ROWS)[number]['id']
