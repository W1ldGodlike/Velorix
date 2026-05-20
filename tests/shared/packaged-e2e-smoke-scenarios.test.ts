import { describe, expect, it } from 'vitest'

import { PACKAGED_MANUAL_SMOKE_STEPS } from '../../src/shared/packaged-manual-smoke-step-ids'
import { PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT } from '../../src/shared/packaged-gui-e2e-playwright-meta'
import {
  PACKAGED_E2E_CI_SMOKE_SCRIPTS,
  PACKAGED_E2E_SMOKE_SCENARIOS,
  expandPackagedE2eCiSmokeScriptsForWorkflow,
  formatPackagedE2ePerStepDiagnosticLines,
  formatPackagedE2eSmokeDiagnosticLines,
  PACKAGED_E2E_CI_HEADLESS_STEP_IDS,
  PACKAGED_E2E_MANUAL_OWNER_STEP_IDS,
  PACKAGED_E2E_PLANNED_GUI_STEP_IDS,
  PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT,
  formatPackagedE2eHelpWorkflowCrosslinksDiagnosticLine,
  listPackagedE2eStepIdsByAutomation
} from '../../src/shared/packaged-e2e-smoke-scenarios'

describe('packaged-e2e-smoke-scenarios §21', () => {
  it('covers every manual smoke step id exactly once', () => {
    const manualIds = PACKAGED_MANUAL_SMOKE_STEPS.map((s) => s.id)
    const registryIds = PACKAGED_E2E_SMOKE_SCENARIOS.map((s) => s.stepId)
    expect(registryIds).toEqual(manualIds)
  })

  it('lists unique ciSmokeScript npm names for CI guards', () => {
    expect(PACKAGED_E2E_CI_SMOKE_SCRIPTS).toEqual([
      'smoke:packaged-app',
      'smoke:packaged-engines',
      'smoke:packaged-ytdlp',
      'smoke:packaged-ffmpeg'
    ])
    expect(expandPackagedE2eCiSmokeScriptsForWorkflow()).toEqual([
      'smoke:packaged-app',
      'smoke:packaged-ffprobe',
      'smoke:packaged-ytdlp',
      'smoke:packaged-ffmpeg'
    ])
  })

  it('launch and engines map to ci headless smoke scripts', () => {
    const launch = PACKAGED_E2E_SMOKE_SCENARIOS.find((s) => s.stepId === 'launch')
    const engines = PACKAGED_E2E_SMOKE_SCENARIOS.find((s) => s.stepId === 'engines')
    expect(launch?.ciSmokeScript).toBe('smoke:packaged-app')
    expect(engines?.ciSmokeScript).toBe('smoke:packaged-engines')
  })

  it('diagnostic lines mention registry check', () => {
    const joined = formatPackagedE2eSmokeDiagnosticLines().join('\n')
    expect(joined).toContain('check:packaged-e2e-scenarios-registry')
    expect(joined).toContain('smoke:packaged-app')
  })

  it('exports readonly step id arrays by automation kind', () => {
    expect(PACKAGED_E2E_CI_HEADLESS_STEP_IDS).toEqual(['launch', 'engines'])
    expect(PACKAGED_E2E_PLANNED_GUI_STEP_IDS).toHaveLength(
      PACKAGED_GUI_E2E_PLAYWRIGHT_PLANNED_STEP_COUNT
    )
    expect(PACKAGED_E2E_MANUAL_OWNER_STEP_IDS).toEqual(['video-sprite', 'mini-player'])
    expect(listPackagedE2eStepIdsByAutomation('planned-gui-e2e')).toEqual([
      ...PACKAGED_E2E_PLANNED_GUI_STEP_IDS
    ])
  })

  it('lists planned-gui-e2e and manual-owner step ids for §21 roadmap', () => {
    expect(listPackagedE2eStepIdsByAutomation('planned-gui-e2e')).toEqual([
      'open-file',
      'ytdlp',
      'editor-dl',
      'snapshot',
      'export',
      'knowledge',
      'support-zip',
      'settings'
    ])
    expect(listPackagedE2eStepIdsByAutomation('manual-owner')).toEqual([
      'video-sprite',
      'mini-player'
    ])
    expect(listPackagedE2eStepIdsByAutomation('ci-headless')).toEqual(['launch', 'engines'])
  })

  it('diagnostic lines mention planned GUI scope and Help crosslinks guard', () => {
    const joined = formatPackagedE2eSmokeDiagnosticLines().join('\n')
    expect(joined).toContain('planned GUI e2e scope:')
    expect(joined).toContain('open-file')
    expect(joined).toContain('test:e2e:gui')
    expect(joined).toContain('check:packaged-gui-e2e-playwright-deferred')
    expect(joined).toContain(formatPackagedE2eHelpWorkflowCrosslinksDiagnosticLine('articles'))
  })

  it('exports Help workflow crosslinks article count from path registry', () => {
    expect(PACKAGED_E2E_HELP_WORKFLOW_CROSSLINKS_ARTICLE_COUNT).toBe(44)
  })

  it('per-step diagnostic lines cover every registry entry', () => {
    const perStep = formatPackagedE2ePerStepDiagnosticLines()
    expect(perStep).toHaveLength(PACKAGED_E2E_SMOKE_SCENARIOS.length)
    expect(perStep[0]).toBe('e2e launch: ci-headless script=smoke:packaged-app')
    expect(perStep.some((l) => l.includes('video-sprite: manual-owner'))).toBe(true)
    expect(
      perStep.some((l) => l.includes('ytdlp: planned-gui-e2e script=smoke:packaged-ytdlp'))
    ).toBe(true)
  })
})
