import { create, type StateCreator, type StoreApi, type UseBoundStore } from 'zustand'
import { devtools } from 'zustand/middleware'

const useDevtools = import.meta.env.DEV

/**
 * Zustand store с именем для Redux DevTools (только dev-сборка renderer).
 */
export function createRendererStore<T extends object>(
  storeName: string,
  initializer: StateCreator<T, [], [], T>
): UseBoundStore<StoreApi<T>> {
  if (useDevtools) {
    return create<T>()(devtools(initializer, { name: storeName, enabled: true }))
  }
  return create<T>()(initializer)
}
