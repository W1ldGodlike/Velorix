import type { Dispatch, SetStateAction } from 'react'

export function applySetStateAction<T>(next: SetStateAction<T>, prev: T): T {
  return typeof next === 'function' ? (next as (value: T) => T)(prev) : next
}

export type ZustandSetStateAction<T> = Dispatch<SetStateAction<T>>
