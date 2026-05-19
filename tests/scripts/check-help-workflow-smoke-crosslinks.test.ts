import { execSync } from 'node:child_process'
import { describe, expect, it } from 'vitest'

import { PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT } from '../../src/shared/packaged-e2e-smoke-scenarios'

describe('check:help-workflow-smoke-crosslinks §15', () => {
  it('npm run check:help-workflow-smoke-crosslinks exits 0', () => {
    const result = execSync('npm run check:help-workflow-smoke-crosslinks', {
      encoding: 'utf8'
    })
    expect(result).toContain('[check:help-workflow-smoke-crosslinks] OK')
    expect(result).toContain(`${PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT} files`)
  })
})
