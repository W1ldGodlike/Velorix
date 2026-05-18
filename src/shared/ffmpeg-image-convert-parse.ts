import { extname } from 'path'

import type { MediaUtilitiesImageFormatId } from './media-utilities-contract'

const IMAGE_INPUT_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.bmp',
  '.gif',
  '.tif',
  '.tiff'
])

export function parseMediaUtilitiesImageFormatId(raw: unknown): MediaUtilitiesImageFormatId | null {
  if (raw === 'jpg' || raw === 'jpeg') {
    return 'jpg'
  }
  if (raw === 'png') {
    return 'png'
  }
  if (raw === 'webp') {
    return 'webp'
  }
  return null
}

export function isMediaUtilitiesImageInputPath(filePath: string): boolean {
  const ext = extname(filePath).toLowerCase()
  return IMAGE_INPUT_EXTENSIONS.has(ext)
}

export function mediaUtilitiesImageOutputExtension(format: MediaUtilitiesImageFormatId): string {
  if (format === 'jpg') {
    return '.jpg'
  }
  if (format === 'webp') {
    return '.webp'
  }
  return '.png'
}
