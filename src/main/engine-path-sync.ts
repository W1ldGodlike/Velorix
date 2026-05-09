import type { EnginePathOverrides } from './engine-service'

/**
 * Main держит актуальные override-пути движков в `cachedSettings`, но сервисы вроде
 * downloads-queue-runner не имеют прямого доступа к этому состоянию. Копия здесь
 * обновляется при загрузке настроек и после IPC сохранения путей §3.
 */
let snapshot: EnginePathOverrides | undefined

export function setEnginePathOverridesSnapshot(next: EnginePathOverrides | undefined): void {
  snapshot = next
}

export function getEnginePathOverridesSnapshot(): EnginePathOverrides | undefined {
  return snapshot
}
