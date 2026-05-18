import type { SetStateAction } from 'react'

import type { TerminalCommandHintEntry, TerminalRunResult } from '../../../shared/terminal-contract'
import type { TerminalHintToolFilter } from '../../../shared/terminal-hints-catalog'
import { createRendererStore } from './create-renderer-store'
import { applySetStateAction } from './store-set-action'

export type TerminalHistoryEntry = {
  id: number
  line: string
  result: TerminalRunResult
}

export type TerminalStoreState = {
  terminalLine: string
  terminalBusy: boolean
  terminalHints: TerminalCommandHintEntry[]
  terminalHintFilter: string
  terminalHintToolFilter: TerminalHintToolFilter
  terminalHistory: TerminalHistoryEntry[]
  terminalSuggestFocus: boolean
  terminalSuggestIndex: number
}

type TerminalSetterKeys = {
  [K in keyof TerminalStoreState as `set${Capitalize<string & K>}`]: (
    next: SetStateAction<TerminalStoreState[K]>
  ) => void
}

export type TerminalStore = TerminalStoreState &
  TerminalSetterKeys & {
    reset: () => void
    appendTerminalHistory: (entry: Omit<TerminalHistoryEntry, 'id'>, nextId: number) => void
  }

export const initialTerminalStoreState: TerminalStoreState = {
  terminalLine: 'ffmpeg -version',
  terminalBusy: false,
  terminalHints: [],
  terminalHintFilter: '',
  terminalHintToolFilter: 'all',
  terminalHistory: [],
  terminalSuggestFocus: false,
  terminalSuggestIndex: 0
}

function setter<K extends keyof TerminalStoreState>(
  key: K,
  set: (partial: Partial<TerminalStoreState>) => void,
  get: () => TerminalStoreState
): (next: SetStateAction<TerminalStoreState[K]>) => void {
  return (next) => {
    set({ [key]: applySetStateAction(next, get()[key]) } as Partial<TerminalStoreState>)
  }
}

export const useTerminalStore = createRendererStore<TerminalStore>('Terminal', (set, get) => ({
  ...initialTerminalStoreState,
  setTerminalLine: setter('terminalLine', set, get),
  setTerminalBusy: setter('terminalBusy', set, get),
  setTerminalHints: setter('terminalHints', set, get),
  setTerminalHintFilter: setter('terminalHintFilter', set, get),
  setTerminalHintToolFilter: setter('terminalHintToolFilter', set, get),
  setTerminalHistory: setter('terminalHistory', set, get),
  setTerminalSuggestFocus: setter('terminalSuggestFocus', set, get),
  setTerminalSuggestIndex: setter('terminalSuggestIndex', set, get),
  appendTerminalHistory: (entry, nextId) => {
    set({
      terminalHistory: [{ id: nextId, ...entry }, ...get().terminalHistory].slice(0, 20)
    })
  },
  reset: () => {
    set(initialTerminalStoreState)
  }
}))
