import type { Dispatch, MutableRefObject, SetStateAction } from 'react'

import type { TerminalCommandHintEntry } from '../../../shared/terminal-contract'
import type { TerminalHistoryEntry } from '../use-terminal-workspace'

export type TerminalWorkspacePanelProps = {
  terminalBusy: boolean
  terminalLine: string
  setTerminalLine: Dispatch<SetStateAction<string>>
  terminalCommandInputId: string
  terminalInlineSuggestions: TerminalCommandHintEntry[]
  terminalSuggestFocus: boolean
  setTerminalSuggestFocus: Dispatch<SetStateAction<boolean>>
  terminalSuggestActiveIndex: number
  setTerminalSuggestIndex: Dispatch<SetStateAction<number>>
  terminalSuggestBlurTimeoutRef: MutableRefObject<number | undefined>
  currentSourcePath: string | null
  runTerminalLine: () => Promise<void>
  applyTerminalSuggest: (hint: TerminalCommandHintEntry) => void
  appendTerminalToken: (token: string) => void
  terminalHistory: TerminalHistoryEntry[]
  copyTerminalOutputLine: (line: string) => Promise<void>
  terminalHintsSearchFieldId: string
  terminalHintFilter: string
  setTerminalHintFilter: Dispatch<SetStateAction<string>>
  visibleTerminalHints: TerminalCommandHintEntry[]
  onOpenTerminalKnowledge: () => void
}
