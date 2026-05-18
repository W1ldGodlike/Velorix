/** Hash-route surfaces in `index.html` (same bundle + main preload). */
export type RendererSurfaceHash = 'inspector' | 'downloads' | null

export function getRendererSurfaceHash(): RendererSurfaceHash {
  if (typeof window === 'undefined') {
    return null
  }
  const raw = window.location.hash.replace(/^#\/?/, '').trim().toLowerCase()
  if (raw === 'inspector') {
    return 'inspector'
  }
  if (raw === 'downloads') {
    return 'downloads'
  }
  return null
}

export function isInspectorStandaloneSurface(): boolean {
  return getRendererSurfaceHash() === 'inspector'
}

export function isDownloadsStandaloneSurface(): boolean {
  return getRendererSurfaceHash() === 'downloads'
}
