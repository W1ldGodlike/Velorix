/* eslint-disable @typescript-eslint/explicit-function-return-type */
/** NEON ref.1–27 — capture/diff targets vs `docs/reference/*.png`. */

export const NEON_REF_VISUAL_OUTPUT_DIR = '.neon-ref-visual'

/** @typedef {{ refId: string, hash: string, bodySelector: string, captureSelector: string, shellSelector: string, pngRel: string, compareNote?: string }} NeonRefVisualTarget */

/** @type {Record<string, NeonRefVisualTarget>} */
export const NEON_REF_VISUAL_TARGETS = {
  ref1: {
    refId: 'ref1',
    hash: '#ref1',
    bodySelector: '.neon-chrome-shell__body',
    captureSelector: '.neon-chrome-shell',
    shellSelector: '#ref1',
    pngRel: 'docs/reference/velorix-neon-reference-processing.png',
    compareNote: 'IDE monitor workArea (как Cursor/prod); ref PNG 1920×1080 scaled at diff'
  }
}

/** @param {string} refId */
export function resolveNeonRefVisualTarget(refId) {
  const key = refId.startsWith('ref') ? refId : `ref${refId}`
  const target = NEON_REF_VISUAL_TARGETS[key]
  if (!target) {
    const known = Object.keys(NEON_REF_VISUAL_TARGETS).join(', ')
    throw new Error(`unknown ref "${refId}" (known: ${known})`)
  }
  return target
}

export const NEON_REF_VISUAL_CAPTURE_HIDE_CSS = `
  .processing-shell__ref-underlay,
  .neon-ref-overlay,
  .neon-ref-overlay__hud {
    display: none !important;
  }
  *, *::before, *::after {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
    transition-duration: 0s !important;
    transition-delay: 0s !important;
  }
`
