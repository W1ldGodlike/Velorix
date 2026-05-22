import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

import {
  BUNDLED_ENGINE_EXE_JSON_KEYS,
  BUNDLED_ENGINE_UNIX_BIN_NAMES
} from '../../src/shared/bundled-engines-trusted-hashes'

const SHA256_HEX = /^[a-f0-9]{64}$/i

type TrustedHashesJson = {
  schema: number
  'windows-x64': Record<string, string>
  darwin: Record<string, string>
  'linux-x64': Record<string, string>
}

function loadTrustedHashes(): TrustedHashesJson {
  return JSON.parse(readFileSync('Data/trusted_hashes.json', 'utf8')) as TrustedHashesJson
}

function expectPlatformKeys(
  section: Record<string, string> | undefined,
  keys: readonly string[],
  label: string
): void {
  expect(section, `${label} section`).toBeDefined()
  for (const key of keys) {
    expect(typeof section![key], `${label}["${key}"]`).toBe('string')
    const value = section![key]!.trim()
    if (value !== '') {
      expect(value, `${label}["${key}"] SHA256`).toMatch(SHA256_HEX)
    }
  }
}

describe('Data/trusted_hashes.json §3.15', () => {
  it('schema 2 with windows-x64, darwin and linux-x64 platform keys', () => {
    const trusted = loadTrustedHashes()
    expect(trusted.schema).toBe(2)
    expectPlatformKeys(trusted['windows-x64'], BUNDLED_ENGINE_EXE_JSON_KEYS, 'windows-x64')
    expectPlatformKeys(trusted.darwin, BUNDLED_ENGINE_UNIX_BIN_NAMES, 'darwin')
    expectPlatformKeys(trusted['linux-x64'], BUNDLED_ENGINE_UNIX_BIN_NAMES, 'linux-x64')
  })
})
