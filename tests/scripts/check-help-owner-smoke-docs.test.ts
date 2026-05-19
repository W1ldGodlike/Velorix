import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

import { PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_GUARD_HELP_PATHS } from '../../src/shared/packaged-e2e-smoke-scenarios'

describe('check:help-owner-smoke-docs §15', () => {
  it('npm run check:help-owner-smoke-docs exits 0', () => {
    const result = execSync('npm run check:help-owner-smoke-docs', {
      encoding: 'utf8'
    })
    expect(result).toContain('[check:help-owner-smoke-docs] OK')
    expect(result).toContain(
      `${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_OWNER_GUARD_HELP_PATHS.length} files`
    )
    expect(result).toContain('crosslinks count anchors')
  })
})
