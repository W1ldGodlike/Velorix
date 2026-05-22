import { describe, expect, it } from 'vitest'

import {
  formatLinuxReleaseCodeSigningRoadmapDiagnosticLine,
  formatMacosReleaseCodeSigningRoadmapDiagnosticLine,
  formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine,
  formatWindowsReleaseCodeSigningRoadmapDiagnosticLine,
  getReleaseCodeSigningElectronBuilderYmlComments
} from '../../src/shared/release-code-signing-roadmap'

describe('release-code-signing-roadmap §19', () => {
  it('getReleaseCodeSigningElectronBuilderYmlComments returns nine §19 yaml lines', () => {
    const comments = getReleaseCodeSigningElectronBuilderYmlComments()
    expect(comments.length).toBe(9)
    expect(comments.some((c) => c.includes('Authenticode'))).toBe(true)
    expect(comments.some((c) => c.includes('notarytool'))).toBe(true)
    expect(comments.some((c) => c.includes('AppImage'))).toBe(true)
  })

  it('platform diagnostic lines reference RELEASE.md sections', () => {
    expect(formatWindowsReleaseCodeSigningRoadmapDiagnosticLine()).toContain('§4')
    expect(formatLinuxReleaseCodeSigningRoadmapDiagnosticLine()).toContain('§4.1')
    expect(formatMacosReleaseCodeSigningRoadmapDiagnosticLine()).toContain('§4.2')
    expect(formatReleaseCodeSigningRoadmapElectronBuilderYmlCommentsDiagnosticLine()).toContain('9')
  })
})
