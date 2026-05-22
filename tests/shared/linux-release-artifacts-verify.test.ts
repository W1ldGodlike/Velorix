import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  collectLinuxReleaseArtifactFailures,
  distDirectory
} from '../../src/shared/linux-release-artifacts-verify'

describe('linux-release-artifacts-verify §2.1', () => {
  const repo = '/repo'
  const dist = distDirectory(repo)

  it('collectLinuxReleaseArtifactFailures requires AppImage and deb', () => {
    const failures = collectLinuxReleaseArtifactFailures(dist, {
      listDistFileNames: () => ['VELORIX-0.1.0.AppImage']
    })
    expect(failures).toHaveLength(1)
    expect(failures[0]).toContain('.deb')
  })

  it('collectLinuxReleaseArtifactFailures OK when both present', () => {
    const failures = collectLinuxReleaseArtifactFailures(dist, {
      listDistFileNames: () => ['VELORIX-0.1.0.AppImage', 'VELORIX_0.1.0_amd64.deb']
    })
    expect(failures).toEqual([])
  })

  it('distDirectory', () => {
    expect(dist).toBe(join(repo, 'dist'))
  })
})
