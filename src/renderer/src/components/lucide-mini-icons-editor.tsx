import {
  EDITOR_TIMELINE_ICONS,
  EDITOR_THEME_ICONS,
  EDITOR_TOPBAR_ACTION_ICONS,
  EDITOR_TOPBAR_TOOLS_ICONS,
  EDITOR_TRANSPORT_ICONS,
  WORKSPACE_TAB_ICONS
} from '../../../shared/lucide-downloads-icons'
import { createLucideMiniIcon } from './lucide-mini-icons-core'

export const IconFolder = createLucideMiniIcon(EDITOR_TOPBAR_ACTION_ICONS.folder, {
  titleKey: 'miniIconFolder'
})

export const IconZoomOut = createLucideMiniIcon(EDITOR_TIMELINE_ICONS.zoomOut, {
  titleKey: 'miniIconZoomOut'
})

export const IconZoomIn = createLucideMiniIcon(EDITOR_TIMELINE_ICONS.zoomIn, {
  titleKey: 'miniIconZoomIn'
})

export const IconImage = createLucideMiniIcon(EDITOR_TOPBAR_ACTION_ICONS.image, {
  titleKey: 'miniIconImage'
})

export const IconSave = createLucideMiniIcon(EDITOR_TOPBAR_ACTION_ICONS.save, {
  titleKey: 'miniIconSave'
})

export const IconBan = createLucideMiniIcon(EDITOR_TOPBAR_ACTION_ICONS.ban)

export const IconCloudDownload = createLucideMiniIcon(EDITOR_TOPBAR_ACTION_ICONS.cloudDownload)

export const IconSun = createLucideMiniIcon(EDITOR_THEME_ICONS.sun, { titleKey: 'miniIconSun' })

export const IconMoon = createLucideMiniIcon(EDITOR_THEME_ICONS.moon, { titleKey: 'miniIconMoon' })

export const IconSkipBack = createLucideMiniIcon(EDITOR_TRANSPORT_ICONS.skipBack, {
  titleKey: 'miniIconSkipBack'
})

export const IconChevronLeft = createLucideMiniIcon(EDITOR_TRANSPORT_ICONS.chevronLeft, {
  titleKey: 'miniIconChevronLeft'
})

export const IconChevronRight = createLucideMiniIcon(EDITOR_TRANSPORT_ICONS.chevronRight, {
  titleKey: 'miniIconChevronRight'
})

export const IconSkipForward = createLucideMiniIcon(EDITOR_TRANSPORT_ICONS.skipForward, {
  titleKey: 'miniIconSkipForward'
})

export const IconPlay = createLucideMiniIcon(EDITOR_TRANSPORT_ICONS.play, {
  titleKey: 'miniIconPlay'
})

export const IconPauseUi = createLucideMiniIcon(EDITOR_TRANSPORT_ICONS.pause, {
  titleKey: 'miniIconPauseUi'
})

export const IconVolume2 = createLucideMiniIcon(EDITOR_TRANSPORT_ICONS.volume2, {
  titleKey: 'miniIconVolume2'
})

export const IconVolumeX = createLucideMiniIcon(EDITOR_TRANSPORT_ICONS.volumeX, {
  titleKey: 'miniIconVolumeX'
})

export const IconMaximize2 = createLucideMiniIcon(EDITOR_TRANSPORT_ICONS.maximize2, {
  titleKey: 'miniIconMaximize2'
})

export const IconWorkspaceEditor = createLucideMiniIcon(WORKSPACE_TAB_ICONS.editor, {
  defaultSize: 16
})

export const IconWorkspaceTerminal = createLucideMiniIcon(WORKSPACE_TAB_ICONS.terminal, {
  defaultSize: 16
})

export const IconRotateCcw = createLucideMiniIcon(EDITOR_TOPBAR_TOOLS_ICONS.rotateCcw, {
  titleKey: 'miniIconRotateCcw'
})

export const IconRotateCw = createLucideMiniIcon(EDITOR_TOPBAR_TOOLS_ICONS.rotateCw, {
  titleKey: 'miniIconRotateCw'
})

export const IconScissors = createLucideMiniIcon(EDITOR_TOPBAR_TOOLS_ICONS.scissors, {
  titleKey: 'miniIconScissors'
})
