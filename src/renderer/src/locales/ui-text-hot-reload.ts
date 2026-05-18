/**
 * §2.2 — dev: подписка на обновление JSON в `locales/` (Vite HMR → пересборка UI_TEXT).
 */

const listeners = new Set<() => void>()

export function subscribeUiTextShardsUpdated(listener: () => void): () => void {
  listeners.add(listener)
  return (): void => {
    listeners.delete(listener)
  }
}

export function notifyUiTextShardsUpdated(): void {
  for (const listener of listeners) {
    listener()
  }
}
