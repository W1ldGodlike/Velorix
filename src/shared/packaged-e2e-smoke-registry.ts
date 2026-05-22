/**
 * §21 — данные реестра packaged e2e (без импортов — Node check + TS).
 * Порядок stepId = `PACKAGED_MANUAL_SMOKE_STEPS` в `packaged-manual-smoke-step-ids.ts`.
 */

export type PackagedE2eAutomationKind = 'ci-headless' | 'manual-owner' | 'planned-gui-e2e'

export type PackagedE2eSmokeScenario = {
  /** Совпадает с `PACKAGED_MANUAL_SMOKE_STEPS[].id`. */
  stepId: string
  automation: PackagedE2eAutomationKind
  /** npm-скрипт или команда, если уже есть headless-покрытие. */
  ciSmokeScript: string | null
  note: string
}

/** План §21: GUI e2e ещё не в CI; headless — `smoke:packaged-*` после `pack:dir`. */
export const PACKAGED_E2E_SMOKE_REGISTRY: readonly PackagedE2eSmokeScenario[] = [
  {
    stepId: 'launch',
    automation: 'ci-headless',
    ciSmokeScript: 'smoke:packaged-app',
    note: 'Velorix.exe + app.asar + ELECTRON_RUN_AS_NODE probe'
  },
  {
    stepId: 'engines',
    automation: 'ci-headless',
    ciSmokeScript: 'smoke:packaged-engines',
    note: 'ffprobe + yt-dlp + ffmpeg -version/-encoders in dist/win-unpacked'
  },
  {
    stepId: 'open-file',
    automation: 'planned-gui-e2e',
    ciSmokeScript: null,
    note: 'Editor open local file + preview scrub (manual owner-smoke today)'
  },
  {
    stepId: 'ytdlp',
    automation: 'planned-gui-e2e',
    ciSmokeScript: 'smoke:packaged-ytdlp',
    note: 'CLI yt-dlp smoke exists; full downloads queue UI — planned GUI e2e'
  },
  {
    stepId: 'editor-dl',
    automation: 'planned-gui-e2e',
    ciSmokeScript: null,
    note: 'Open in editor from downloads queue'
  },
  {
    stepId: 'snapshot',
    automation: 'planned-gui-e2e',
    ciSmokeScript: null,
    note: 'Frame snapshot PNG/JPEG'
  },
  {
    stepId: 'export',
    automation: 'planned-gui-e2e',
    ciSmokeScript: 'smoke:packaged-ffmpeg',
    note: 'CLI ffmpeg smoke exists; editor export MP4 — planned GUI e2e'
  },
  {
    stepId: 'video-sprite',
    automation: 'manual-owner',
    ciSmokeScript: null,
    note: 'FFmpeg rail sprite sheet §7.5'
  },
  {
    stepId: 'knowledge',
    automation: 'planned-gui-e2e',
    ciSmokeScript: null,
    note: 'Knowledge base article + internal .md link'
  },
  {
    stepId: 'support-zip',
    automation: 'planned-gui-e2e',
    ciSmokeScript: null,
    note: 'About → Support ZIP without secrets in text'
  },
  {
    stepId: 'settings',
    automation: 'planned-gui-e2e',
    ciSmokeScript: null,
    note: 'Settings → Dependencies engine paths → resources/bin'
  }
]

/** Составные npm-скрипты → leaf-команды, как в `.github/workflows/ci.yml` (без импортов — Node check). */
export const PACKAGED_E2E_CI_SMOKE_SCRIPT_EXPANSIONS: Readonly<Record<string, readonly string[]>> =
  {
    'smoke:packaged-engines': [
      'smoke:packaged-ffprobe',
      'smoke:packaged-ytdlp',
      'smoke:packaged-ffmpeg'
    ]
  }
