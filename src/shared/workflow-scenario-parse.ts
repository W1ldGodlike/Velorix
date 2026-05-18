import {
  WORKFLOW_SCENARIO_FORMAT_VERSION,
  WORKFLOW_SCENARIO_NODE_KINDS,
  type WorkflowScenarioNodeKind,
  type WorkflowScenarioDocument,
  type WorkflowScenarioEdge,
  type WorkflowScenarioNode,
  type WorkflowScenarioRegistryV1
} from './workflow-scenario-contract'
import { normalizeWorkflowScenarioSourceUrl } from './workflow-scenario-url'

const NODE_ID_RE = /^[a-z][a-z0-9_-]{0,63}$/

function parseNodeKind(raw: unknown): WorkflowScenarioNodeKind | null {
  if (
    typeof raw === 'string' &&
    (WORKFLOW_SCENARIO_NODE_KINDS as readonly string[]).includes(raw)
  ) {
    return raw as WorkflowScenarioNodeKind
  }
  return null
}

function parseNodeId(raw: unknown): string | null {
  if (typeof raw !== 'string') {
    return null
  }
  const id = raw.trim()
  if (!NODE_ID_RE.test(id)) {
    return null
  }
  return id
}

function parseOptionalString(raw: unknown, maxLen: number): string | undefined {
  if (raw === undefined || raw === null) {
    return undefined
  }
  if (typeof raw !== 'string') {
    return undefined
  }
  const s = raw.trim()
  if (s.length === 0 || s.length > maxLen) {
    return undefined
  }
  return s
}

function parseWorkflowScenarioNode(raw: unknown): WorkflowScenarioNode | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null
  }
  const r = raw as Record<string, unknown>
  const id = parseNodeId(r['id'])
  const kind = parseNodeKind(r['kind'])
  const label = parseOptionalString(r['label'], 120)
  if (!id || !kind || !label) {
    return null
  }
  const node: WorkflowScenarioNode = { id, kind, label }
  const ytdlpPresetRef = parseOptionalString(r['ytdlpPresetRef'], 80)
  const ffmpegPresetRef = parseOptionalString(r['ffmpegPresetRef'], 80)
  const outputDirectory = parseOptionalString(r['outputDirectory'], 512)
  if (ytdlpPresetRef !== undefined) {
    node.ytdlpPresetRef = ytdlpPresetRef
  }
  if (ffmpegPresetRef !== undefined) {
    node.ffmpegPresetRef = ffmpegPresetRef
  }
  if (outputDirectory !== undefined) {
    node.outputDirectory = outputDirectory
  }
  const sourceUrlRaw = parseOptionalString(r['sourceUrl'], 2048)
  if (sourceUrlRaw !== undefined) {
    const normalized = normalizeWorkflowScenarioSourceUrl(sourceUrlRaw)
    if (normalized) {
      node.sourceUrl = normalized
    }
  }
  return node
}

function parseWorkflowScenarioEdge(raw: unknown): WorkflowScenarioEdge | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null
  }
  const r = raw as Record<string, unknown>
  const from = parseNodeId(r['from'])
  const to = parseNodeId(r['to'])
  if (!from || !to || from === to) {
    return null
  }
  return { from, to }
}

export function parseWorkflowScenarioDocument(raw: unknown): WorkflowScenarioDocument | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null
  }
  const r = raw as Record<string, unknown>
  const version =
    typeof r['formatVersion'] === 'number' ? r['formatVersion'] : WORKFLOW_SCENARIO_FORMAT_VERSION
  if (version !== WORKFLOW_SCENARIO_FORMAT_VERSION) {
    return null
  }
  const id = parseNodeId(r['id'])
  const title = parseOptionalString(r['title'], 160)
  const updatedAt = parseOptionalString(r['updatedAt'], 40) ?? ''
  if (!id || !title) {
    return null
  }
  if (!Array.isArray(r['nodes']) || !Array.isArray(r['edges'])) {
    return null
  }
  const nodes: WorkflowScenarioNode[] = []
  for (const item of r['nodes']) {
    const node = parseWorkflowScenarioNode(item)
    if (!node) {
      return null
    }
    if (nodes.some((n) => n.id === node.id)) {
      return null
    }
    nodes.push(node)
  }
  if (nodes.length === 0) {
    return null
  }
  const nodeIds = new Set(nodes.map((n) => n.id))
  const edges: WorkflowScenarioEdge[] = []
  for (const item of r['edges']) {
    const edge = parseWorkflowScenarioEdge(item)
    if (!edge || !nodeIds.has(edge.from) || !nodeIds.has(edge.to)) {
      return null
    }
    edges.push(edge)
  }
  return {
    formatVersion: WORKFLOW_SCENARIO_FORMAT_VERSION,
    id,
    title,
    updatedAt,
    nodes,
    edges
  }
}

export function parseWorkflowScenarioRegistry(raw: unknown): WorkflowScenarioRegistryV1 | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null
  }
  const r = raw as Record<string, unknown>
  const version =
    typeof r['formatVersion'] === 'number' ? r['formatVersion'] : WORKFLOW_SCENARIO_FORMAT_VERSION
  if (version !== WORKFLOW_SCENARIO_FORMAT_VERSION || !Array.isArray(r['scenarios'])) {
    return null
  }
  const scenarios: WorkflowScenarioDocument[] = []
  for (const item of r['scenarios']) {
    const doc = parseWorkflowScenarioDocument(item)
    if (!doc) {
      return null
    }
    if (scenarios.some((s) => s.id === doc.id)) {
      return null
    }
    scenarios.push(doc)
  }
  return { formatVersion: WORKFLOW_SCENARIO_FORMAT_VERSION, scenarios }
}

export function emptyWorkflowScenarioRegistry(): WorkflowScenarioRegistryV1 {
  return { formatVersion: WORKFLOW_SCENARIO_FORMAT_VERSION, scenarios: [] }
}
