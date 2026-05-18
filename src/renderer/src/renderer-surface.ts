/** Hash-route surfaces in `index.html` (same bundle + main preload). */
export type RendererSurfaceHash = 'inspector' | 'downloads' | 'mini-player' | null

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
  if (raw === 'mini-player') {
    return 'mini-player'
  }
  return null
}

export function isMiniPlayerStandaloneSurface(): boolean {
  return getRendererSurfaceHash() === 'mini-player'
}

export function isInspectorStandaloneSurface(): boolean {
  return getRendererSurfaceHash() === 'inspector'
}

export function isDownloadsStandaloneSurface(): boolean {
  return getRendererSurfaceHash() === 'downloads'
}
