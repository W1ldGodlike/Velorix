import { describe, expect, it } from 'vitest'

import {
  normalizeWorkflowScenarioSourceUrl,
  resolveWorkflowScenarioDownloadSourceUrl
} from '../../src/shared/workflow-scenario-url'

describe('workflow-scenario-url', () => {
  it.each([
    ['https://example.com/v', 'https://example.com/v'],
    ['http://x.test/a', 'http://x.test/a'],
    ['www.example.com/path', 'https://www.example.com/path'],
    ['  https://a.b/c  ', 'https://a.b/c'],
    ['ftp://x', null],
    ['', null],
    ['short', null]
  ])('normalizeWorkflowScenarioSourceUrl(%j)', (raw, expected) => {
    expect(normalizeWorkflowScenarioSourceUrl(raw)).toBe(expected)
  })

  it('resolveWorkflowScenarioDownloadSourceUrl from download node', () => {
    const url = resolveWorkflowScenarioDownloadSourceUrl([
      { kind: 'process' },
      { kind: 'download', sourceUrl: 'https://youtu.be/abc' }
    ])
    expect(url).toBe('https://youtu.be/abc')
  })

  it('resolveWorkflowScenarioDownloadSourceUrl returns null without download url', () => {
    expect(
      resolveWorkflowScenarioDownloadSourceUrl([{ kind: 'download' }])
    ).toBeNull()
  })
})
