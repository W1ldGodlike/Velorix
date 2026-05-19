import { describe, expect, it } from 'vitest'

import {
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT,
  formatPackagedE2eHelpWorkflowCrosslinksSettingsHelpClause
} from '../../src/shared/packaged-e2e-help-workflow-crosslinks-meta'
import { formatOwnerManualSmokeHidpiChecklistLinesFromShard } from '../../src/shared/owner-manual-smoke-hidpi-lines'
import { formatOwnerManualSmokeThemeChecklistLinesFromShard } from '../../src/shared/owner-manual-smoke-theme-lines'
import enSettings from '../../locales/en/settings.json'
import ruSettings from '../../locales/ru/settings.json'

describe('owner-manual-smoke visual locale §2.2/§16', () => {
  it('en theme lines use settings shard keys', () => {
    const lines = formatOwnerManualSmokeThemeChecklistLinesFromShard(
      enSettings as Record<string, string>
    )
    const joined = lines.join('\n')
    expect(joined).toContain('owner: Theme')
    expect(joined).toContain('accent')
    expect(joined).toContain('Inspector')
  })

  it('ru and en hidpi headers differ but share checklist shape', () => {
    const ru = formatOwnerManualSmokeHidpiChecklistLinesFromShard(
      ruSettings as Record<string, string>
    )
    const en = formatOwnerManualSmokeHidpiChecklistLinesFromShard(
      enSettings as Record<string, string>
    )
    expect(ru[0]).toContain('HiDPI')
    expect(en[0]).toContain('HiDPI')
    expect(ru.filter((l) => l.startsWith('  - ')).length).toBe(
      en.filter((l) => l.startsWith('  - ')).length
    )
  })

  it('settings shards expose packaged e2e registry guard hint', () => {
    expect(enSettings.appSettingsPackagedE2eRegistryGuardHint).toContain(
      'check:packaged-e2e-scenarios-registry'
    )
    expect(ruSettings.appSettingsPackagedE2eRegistryGuardHint).toContain('planned GUI e2e scope')
    expect(enSettings.appSettingsPackagedE2eRegistryGuardHint).toContain('planned GUI')
    expect(ruSettings.appSettingsPackagedE2eRegistryGuardHint).toContain('planned GUI')
    expect(enSettings.appSettingsPackagedE2eRegistryGuardHint).toContain(
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT
    )
    expect(ruSettings.appSettingsPackagedE2eRegistryGuardHint).toContain(
      PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_GUARD_NPM_SCRIPT
    )
    expect(enSettings.appSettingsPackagedE2eRegistryGuardHint).toContain(
      formatPackagedE2eHelpWorkflowCrosslinksSettingsHelpClause('en')
    )
    expect(enSettings.appSettingsPackagedE2eRegistryGuardHint).toContain(
      'formatPackagedManualSmokeE2eAppendixLines'
    )
    expect(ruSettings.appSettingsPackagedE2eRegistryGuardHint).toContain(
      formatPackagedE2eHelpWorkflowCrosslinksSettingsHelpClause('ru')
    )
    expect(enSettings.appSettingsPackagedE2eRegistryGuardHint).toContain('FAQ outside 44')
    expect(ruSettings.appSettingsPackagedE2eRegistryGuardHint).toContain('FAQ вне 44')
  })

  it('owner hub packaged e2e hint links packaged Copy to appendix', () => {
    expect(enSettings.appSettingsOwnerSmokePackagedE2eHint).toContain('§21 packaged e2e')
    expect(ruSettings.appSettingsOwnerSmokePackagedE2eHint).toContain('releaseSmoke:')
    expect(enSettings.appSettingsOwnerSmokePackagedE2eHint).toContain('Packaged panel')
  })

  it('packaged copy appendix hint mentions §21 e2e groups', () => {
    expect(enSettings.appSettingsPackagedSmokeCopyAppendixHint).toContain('§21 packaged e2e')
    expect(ruSettings.appSettingsPackagedSmokeCopyAppendixHint).toContain('§21 packaged e2e')
    expect(enSettings.appSettingsPackagedSmokeCopyAppendixHint).toContain('releaseSmoke:')
    expect(ruSettings.appSettingsPackagedSmokeCopyAppendixHint).toContain('ownerManualSmoke:')
  })

  it('owner smoke intro mentions per-step e2e appendix', () => {
    expect(enSettings.appSettingsOwnerSmokeIntro).toContain(
      'formatPackagedManualSmokeE2eAppendixLines'
    )
    expect(ruSettings.appSettingsOwnerSmokeIntro).toContain(
      'formatPackagedManualSmokeE2eAppendixLines'
    )
    expect(enSettings.appSettingsOwnerSmokeIntro).toContain('per-step e2e')
    expect(ruSettings.appSettingsOwnerSmokeIntro).toContain('per-step e2e')
    expect(enSettings.appSettingsOwnerSmokeIntro).toContain('8 planned GUI')
    expect(ruSettings.appSettingsOwnerSmokeIntro).toContain('planned GUI')
    expect(enSettings.appSettingsOwnerSmokeIntro).toContain('releaseSmoke:')
  })
})
