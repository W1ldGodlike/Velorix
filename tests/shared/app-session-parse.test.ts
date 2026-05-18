import { describe, expect, it } from 'vitest'

import {
  APP_SESSION_JSON_VERSION,
  createDefaultAppSessionJson
} from '../../src/shared/app-session-contract'
import { parseAppSessionJson } from '../../src/shared/app-session-parse'

describe('parseAppSessionJson §4.3', () => {
  it('defaults when input invalid', () => {
    expect(parseAppSessionJson(null)).toEqual(createDefaultAppSessionJson())
  })

  it('parses miniPlayer alwaysOnTop and bounds', () => {
    const parsed = parseAppSessionJson({
      version: APP_SESSION_JSON_VERSION,
      miniPlayer: {
        alwaysOnTop: false,
        bounds: { x: 10, y: 20, width: 360, height: 88 }
      }
    })
    expect(parsed.miniPlayer.alwaysOnTop).toBe(false)
    expect(parsed.miniPlayer.bounds).toEqual({ x: 10, y: 20, width: 360, height: 88 })
  })
})
