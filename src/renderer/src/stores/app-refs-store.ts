import { createRef, type RefObject } from 'react'

import { createRendererStore } from './create-renderer-store'

export type AppRefsState = {
  videoRef: RefObject<HTMLVideoElement | null>
  previewStackRef: RefObject<HTMLDivElement | null>
  downloadsSettingsRailRef: RefObject<HTMLElement | null>
}

export type AppRefsStore = AppRefsState & {
  reset: () => void
}

const initialRefs: AppRefsState = {
  videoRef: createRef<HTMLVideoElement | null>(),
  previewStackRef: createRef<HTMLDivElement | null>(),
  downloadsSettingsRailRef: createRef<HTMLElement | null>()
}

export const useAppRefsStore = createRendererStore<AppRefsStore>('AppRefs', (set) => ({
  ...initialRefs,
  reset: () => {
    set({
      videoRef: createRef<HTMLVideoElement | null>(),
      previewStackRef: createRef<HTMLDivElement | null>(),
      downloadsSettingsRailRef: createRef<HTMLElement | null>()
    })
  }
}))
