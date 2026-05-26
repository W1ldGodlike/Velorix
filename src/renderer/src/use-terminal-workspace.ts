import {
  useCallback,
  useId,
  useMemo,
  useRef,
  type Dispatch,
  type MutableRefObject,
  type SetStateAction
} from 'react'

import type { AppUiLocale } from '../../shared/app-ui-locale'
import {
  TERMINAL_SCENARIO_HINTS_DOWNLOADS,
  TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA,
  type TerminalCommandHintEntry,
  type TerminalRunResult
} from '../../shared/terminal-contract'
import {
  applyTerminalRecallStep,
  listTerminalRecallLines,
  type TerminalRecallState
} from '../../shared/terminal-command-recall'
import {
  capTerminalHintCatalogVisible,
  filterTerminalHintCatalog,
  type TerminalHintToolFilter
} from '../../shared/terminal-hints-catalog'
import {
  applyTerminalInlinePick,
  DEFAULT_TERMINAL_INLINE_SUGGEST_MAX,
  filterTerminalInlineSuggestions
} from '../../shared/terminal-inline-suggest'
import {
  previewPathExtensionLower,
  TERMINAL_HINT_AUDIO_EXTS,
  TERMINAL_HINT_VIDEO_EXTS,
  terminalHintToolRank,
  type WorkspaceTab
} from './app-terminal-hint-ui'
import { getUiLocale, uiText, uiTextVars } from './locales/ui-text'
import { useTerminalStore, type TerminalHistoryEntry } from './stores/terminal-store'

export type { TerminalHistoryEntry }

export type UseTerminalWorkspaceDeps = {
  workspaceTab: WorkspaceTab
  currentSourcePath: string | null
  setStatusHint: (hint: string | null) => void
}

export function useTerminalWorkspace(deps: UseTerminalWorkspaceDeps): {
  terminalLine: string
  setTerminalLine: Dispatch<SetStateAction<string>>
  terminalBusy: boolean
  terminalHintFilter: string
  setTerminalHintFilter: Dispatch<SetStateAction<string>>
  terminalHintToolFilter: TerminalHintToolFilter
  setTerminalHintToolFilter: Dispatch<SetStateAction<TerminalHintToolFilter>>
  terminalHintCatalogTotal: number
  terminalHintCatalogCapped: boolean
  terminalHistory: TerminalHistoryEntry[]
  terminalSuggestFocus: boolean
  setTerminalSuggestFocus: Dispatch<SetStateAction<boolean>>
  terminalSuggestBlurTimeoutRef: MutableRefObject<number | undefined>
  terminalHintsSearchFieldId: string
  terminalCommandInputId: string
  visibleTerminalHints: TerminalCommandHintEntry[]
  terminalInlineSuggestions: TerminalCommandHintEntry[]
  terminalSuggestActiveIndex: number
  setTerminalSuggestIndex: Dispatch<SetStateAction<number>>
  appendTerminalToken: (token: string) => void
  applyTerminalSuggest: (hint: TerminalCommandHintEntry) => void
  runTerminalLine: () => Promise<void>
  recallTerminalCommand: (direction: 'up' | 'down') => void
  copyTerminalOutputLine: (line: string) => Promise<void>
} {
  const { workspaceTab, currentSourcePath, setStatusHint } = deps

  const terminalLine = useTerminalStore((s) => s.terminalLine)
  const setTerminalLineRaw = useTerminalStore((s) => s.setTerminalLine)
  const terminalBusy = useTerminalStore((s) => s.terminalBusy)
  const setTerminalBusy = useTerminalStore((s) => s.setTerminalBusy)
  const terminalHints = useTerminalStore((s) => s.terminalHints)
  const terminalHintFilter = useTerminalStore((s) => s.terminalHintFilter)
  const setTerminalHintFilter = useTerminalStore((s) => s.setTerminalHintFilter)
  const terminalHintToolFilter = useTerminalStore((s) => s.terminalHintToolFilter)
  const setTerminalHintToolFilter = useTerminalStore((s) => s.setTerminalHintToolFilter)
  const terminalHistory = useTerminalStore((s) => s.terminalHistory)
  const appendTerminalHistory = useTerminalStore((s) => s.appendTerminalHistory)
  const terminalSuggestFocus = useTerminalStore((s) => s.terminalSuggestFocus)
  const setTerminalSuggestFocus = useTerminalStore((s) => s.setTerminalSuggestFocus)
  const terminalSuggestIndex = useTerminalStore((s) => s.terminalSuggestIndex)
  const setTerminalSuggestIndex = useTerminalStore((s) => s.setTerminalSuggestIndex)

  const terminalHintsSearchFieldId = useId()
  const terminalCommandInputId = useId()
  const terminalSuggestBlurTimeoutRef = useRef<number | undefined>(undefined)
  const terminalHistoryNextIdRef = useRef(1)
  const terminalRecallRef = useRef<TerminalRecallState>({ index: null, draft: null })

  const resetTerminalRecall = useCallback(() => {
    terminalRecallRef.current = { index: null, draft: null }
  }, [])

  const setTerminalLine = useCallback(
    (action: SetStateAction<string>) => {
      resetTerminalRecall()
      setTerminalLineRaw(action)
    },
    [resetTerminalRecall, setTerminalLineRaw]
  )

  const terminalMergedSortedHints = useMemo(() => {
    const ext = previewPathExtensionLower(currentSourcePath)
    const mediaInPreview = Boolean(
      ext && (TERMINAL_HINT_VIDEO_EXTS.has(ext) || TERMINAL_HINT_AUDIO_EXTS.has(ext))
    )
    const scenarioPrefix: TerminalCommandHintEntry[] = [
      ...(workspaceTab === 'downloads' ? TERMINAL_SCENARIO_HINTS_DOWNLOADS : []),
      ...(workspaceTab === 'processing' || workspaceTab === 'terminal'
        ? mediaInPreview
          ? TERMINAL_SCENARIO_HINTS_PREVIEW_MEDIA
          : []
        : [])
    ]
    const merged = [...scenarioPrefix, ...terminalHints]
    return [...merged].sort((a, b) => {
      const ra = terminalHintToolRank(a.tool, workspaceTab, mediaInPreview)
      const rb = terminalHintToolRank(b.tool, workspaceTab, mediaInPreview)
      if (ra !== rb) {
        return ra - rb
      }
      return a.tool.localeCompare(b.tool) || a.token.localeCompare(b.token, 'ru')
    })
  }, [terminalHints, currentSourcePath, workspaceTab])

  const terminalHintCatalogFiltered = useMemo(
    () =>
      filterTerminalHintCatalog(
        terminalMergedSortedHints,
        terminalHintFilter,
        terminalHintToolFilter
      ),
    [terminalHintFilter, terminalHintToolFilter, terminalMergedSortedHints]
  )

  const terminalHintCatalogSlice = useMemo(
    () =>
      capTerminalHintCatalogVisible(
        terminalHintCatalogFiltered,
        terminalHintFilter,
        terminalHintToolFilter
      ),
    [terminalHintCatalogFiltered, terminalHintFilter, terminalHintToolFilter]
  )

  const visibleTerminalHints = terminalHintCatalogSlice.visible
  const terminalHintCatalogTotal = terminalHintCatalogSlice.total
  const terminalHintCatalogCapped = terminalHintCatalogSlice.capped

  const terminalInlineSuggestions = useMemo(
    () =>
      filterTerminalInlineSuggestions({
        line: terminalLine,
        hints: terminalMergedSortedHints,
        max: DEFAULT_TERMINAL_INLINE_SUGGEST_MAX
      }),
    [terminalLine, terminalMergedSortedHints]
  )

  const terminalRecallLines = useMemo(
    () => listTerminalRecallLines(terminalHistory.map((e) => e.line)),
    [terminalHistory]
  )

  const terminalSuggestActiveIndex = useMemo(() => {
    const len = terminalInlineSuggestions.length
    if (len === 0) {
      return 0
    }
    return Math.min(terminalSuggestIndex, len - 1)
  }, [terminalInlineSuggestions, terminalSuggestIndex])

  const appendTerminalToken = useCallback(
    (token: string) => {
      setTerminalLine((line) => {
        const trimmed = line.trimEnd()
        return trimmed ? `${trimmed} ${token}` : token
      })
    },
    [setTerminalLine]
  )

  const applyTerminalSuggest = useCallback(
    (hint: TerminalCommandHintEntry) => {
      setTerminalLine((prev) => applyTerminalInlinePick({ line: prev, hint }))
    },
    [setTerminalLine]
  )

  const recallTerminalCommand = useCallback(
    (direction: 'up' | 'down') => {
      setTerminalLineRaw((current) => {
        const result = applyTerminalRecallStep(
          terminalRecallRef.current,
          current,
          terminalRecallLines,
          direction
        )
        terminalRecallRef.current = result.next
        return result.line
      })
    },
    [setTerminalLineRaw, terminalRecallLines]
  )

  const runTerminalLine = useCallback(async (): Promise<void> => {
    const line = terminalLine.trim()
    if (!line || terminalBusy) {
      return
    }
    setTerminalBusy(true)
    try {
      const result: TerminalRunResult = await window.velorix.terminal.run({
        line,
        currentFilePath: currentSourcePath,
        uiLocale: getUiLocale() as AppUiLocale
      })
      resetTerminalRecall()
      appendTerminalHistory({ line, result }, terminalHistoryNextIdRef.current++)
      setStatusHint(
        result.ok
          ? uiTextVars('statusTerminalCliExitOk', {
              code: String(result.code ?? uiText('commonNotApplicableShort'))
            })
          : uiTextVars('statusTerminalCliFailed', { error: result.error })
      )
    } finally {
      setTerminalBusy(false)
    }
  }, [
    appendTerminalHistory,
    currentSourcePath,
    resetTerminalRecall,
    setStatusHint,
    setTerminalBusy,
    terminalBusy,
    terminalLine
  ])

  const copyTerminalOutputLine = useCallback(
    async (line: string): Promise<void> => {
      const r = await window.velorix.clipboard.writeText(line)
      setStatusHint(
        r.ok
          ? uiText('statusTerminalOutputLineCopied')
          : uiText('statusTerminalOutputLineCopyFailed')
      )
    },
    [setStatusHint]
  )

  return {
    terminalLine,
    setTerminalLine,
    terminalBusy,
    terminalHintFilter,
    setTerminalHintFilter,
    terminalHintToolFilter,
    setTerminalHintToolFilter,
    terminalHintCatalogTotal,
    terminalHintCatalogCapped,
    terminalHistory,
    terminalSuggestFocus,
    setTerminalSuggestFocus,
    terminalSuggestBlurTimeoutRef,
    terminalHintsSearchFieldId,
    terminalCommandInputId,
    visibleTerminalHints,
    terminalInlineSuggestions,
    terminalSuggestActiveIndex,
    setTerminalSuggestIndex,
    appendTerminalToken,
    applyTerminalSuggest,
    runTerminalLine,
    recallTerminalCommand,
    copyTerminalOutputLine
  }
}
