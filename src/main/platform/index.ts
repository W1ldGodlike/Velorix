/**
 * §2.1 — фасад nativeMain для main process (реэкспорт shared, без Electron).
 */
export {
  isNativeMainBrowserWindowNeedsIcon,
  isNativeMainEngineAutoDownloadSupported,
  isNativeMainLinux,
  isNativeMainMacos,
  isNativeMainQuitOnLastWindowClosed,
  isNativeMainWindows,
  isNativeMainYtdlpKillProcessTreeSupported,
  isNativeMainYtdlpOsPauseSupported,
  nativeMainDevNullPath,
  nativeMainEngineBinaryName,
  nativeMainEngineExecutableSuffix,
  nativeMainEngineOpenDialogFilters,
  nativeMainPathEnvSeparator,
  nativeMainPathSeparator,
  nativeMainPlatformFamily,
  type NativeMainPlatformFamily
} from '../../shared/native-main-platform'
