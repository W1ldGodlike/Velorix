import {
  ENGINE_IDS,
  type EngineId,
  type EnginesStatusSnapshot
} from '../../../shared/engine-contract'

export function formatEnginesStatusLine(snapshot: EnginesStatusSnapshot): string {
  const parts: string[] = []
  for (const id of ENGINE_IDS) {
    const status = snapshot.engines[id]
    const label = status.state === 'ready' ? 'OK' : status.state
    parts.push(`${id}: ${label}`)
  }
  return parts.join(' · ')
}

export function isEngineReady(snapshot: EnginesStatusSnapshot, id: EngineId): boolean {
  return snapshot.engines[id].state === 'ready'
}

export function allEnginesReady(snapshot: EnginesStatusSnapshot): boolean {
  return ENGINE_IDS.every((id) => isEngineReady(snapshot, id))
}
