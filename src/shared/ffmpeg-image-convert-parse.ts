import type { MediaUtilitiesImageFormatId } from './media-utilities-contract'
import { pathExtname } from './path-lite'

const IMAGE_INPUT_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.bmp',
  '.gif',
  '.tif',
  '.tiff',
  '.heic',
  '.heif'
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
  if (raw === 'bmp') {
    return 'bmp'
  }
  if (raw === 'tiff' || raw === 'tif') {
    return 'tiff'
  }
  return null
}

export function isMediaUtilitiesImageInputPath(filePath: string): boolean {
  const ext = pathExtname(filePath)
  return IMAGE_INPUT_EXTENSIONS.has(ext)
}

export function mediaUtilitiesImageOutputExtension(format: MediaUtilitiesImageFormatId): string {
  if (format === 'jpg') {
    return '.jpg'
  }
  if (format === 'webp') {
    return '.webp'
  }
  if (format === 'bmp') {
    return '.bmp'
  }
  if (format === 'tiff') {
    return '.tiff'
  }
  return '.png'
}
