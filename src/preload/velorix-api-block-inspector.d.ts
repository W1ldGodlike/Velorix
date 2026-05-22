/**
 * Типизированный контракт preload -> renderer (фрагмент VelorixApi).
 * IPC-каналы: `src/shared/ipc-channels.ts`; синхрон с `src/preload/index.ts`.
 */
import type {
  KnowledgeArticleListResult,
  KnowledgeArticleResult,
  KnowledgeListArticlesRequest,
  KnowledgeReadArticleRequest
} from '../shared/knowledge-contract'
import type {
  TerminalCommandHintEntry,
  TerminalRunRequest,
  TerminalRunResult
} from '../shared/terminal-contract'
export type VelorixApiInspectorBlock = {
  inspector: {
    openWindow: (absoluteMediaPath?: string | null) => Promise<void>
    bootstrap: () => Promise<{ initialMediaPath: string | null }>
    onTargetMediaPath: (listener: (absolutePath: string) => void) => () => void
  }
  clipboard: {
    readText: () => Promise<string>
    writeText: (text: string) => Promise<{ ok: true } | { ok: false }>
  }
  terminal: {
    getHints: () => Promise<TerminalCommandHintEntry[]>
    run: (payload: TerminalRunRequest) => Promise<TerminalRunResult>
  }
  knowledge: {
    listArticles: (req?: KnowledgeListArticlesRequest) => Promise<KnowledgeArticleListResult>
    readArticle: (req: KnowledgeReadArticleRequest) => Promise<KnowledgeArticleResult>
  }
}
