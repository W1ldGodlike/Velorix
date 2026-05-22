import { useCallback, useState, type JSX } from 'react'

import type { AppUiLocale } from '../../../shared/app-ui-locale'
import { isMediaUtilitiesImageInputPath } from '../../../shared/ffmpeg-image-convert-parse'
import type {
  MediaUtilitiesImageFormatId,
  MediaUtilitiesNoiseKind
} from '../../../shared/media-utilities-contract'
import { MediaFileUtilitiesSlideshowSection } from './MediaFileUtilitiesSlideshowSection'
import { getUiLocale, uiText, uiTextVars } from '../locales/ui-text'

const DEFAULT_NOISE_DURATION_SEC = 5

export function MediaFileUtilitiesPanel(props: {
  disabled?: boolean
  describedById?: string
  onStatus: (message: string) => void
}): JSX.Element {
  const { disabled = false, describedById, onStatus } = props
  const [mediaPath, setMediaPath] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [noiseKind, setNoiseKind] = useState<MediaUtilitiesNoiseKind>('white')
  const [noiseDurationSec, setNoiseDurationSec] = useState(String(DEFAULT_NOISE_DURATION_SEC))
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [imageFormat, setImageFormat] = useState<MediaUtilitiesImageFormatId>('png')
  const pickImageFile = useCallback(async (): Promise<void> => {
    const result = await window.velorix.preview.openFileDialog(getUiLocale() as AppUiLocale)
    if (!result.ok) {
      if ('error' in result && result.error.length > 0) {
        onStatus(result.error)
      }
      return
    }
    if (!isMediaUtilitiesImageInputPath(result.path)) {
      onStatus(uiText('mediaUtilitiesImageNotImage'))
      return
    }
    setImagePath(result.path)
    onStatus(uiTextVars('mediaUtilitiesFileSelected', { name: result.name }))
  }, [onStatus])

  const pickFile = useCallback(async (): Promise<void> => {
    const result = await window.velorix.preview.openFileDialog(getUiLocale() as AppUiLocale)
    if (!result.ok) {
      if ('error' in result && result.error.length > 0) {
        onStatus(result.error)
      }
      return
    }
    setMediaPath(result.path)
    onStatus(uiTextVars('mediaUtilitiesFileSelected', { name: result.name }))
  }, [onStatus])

  const runRepair = useCallback(async (): Promise<void> => {
    if (!mediaPath || busy) {
      return
    }
    setBusy(true)
    onStatus(uiText('mediaUtilitiesRepairBusy'))
    try {
      const res = await window.velorix.utilities.repairRemux({
        inputPath: mediaPath,
        uiLocale: getUiLocale()
      })
      if (res.ok) {
        onStatus(uiTextVars('mediaUtilitiesRepairDone', { path: res.outputPath }))
      } else if ('cancelled' in res && res.cancelled) {
        onStatus(uiText('mediaUtilitiesCancelled'))
      } else if ('error' in res) {
        onStatus(res.error)
      }
    } finally {
      setBusy(false)
    }
  }, [busy, mediaPath, onStatus])

  const runIntegrity = useCallback(async (): Promise<void> => {
    if (!mediaPath || busy) {
      return
    }
    setBusy(true)
    onStatus(uiText('mediaUtilitiesIntegrityBusy'))
    try {
      const res = await window.velorix.utilities.checkIntegrity({
        inputPath: mediaPath,
        uiLocale: getUiLocale()
      })
      if (res.ok) {
        if (res.clean) {
          onStatus(uiText('mediaUtilitiesIntegrityClean'))
        } else {
          onStatus(uiTextVars('mediaUtilitiesIntegrityIssues', { detail: res.detail }))
        }
      } else if ('cancelled' in res && res.cancelled) {
        onStatus(uiText('mediaUtilitiesCancelled'))
      } else if ('error' in res) {
        onStatus(res.error)
      }
    } finally {
      setBusy(false)
    }
  }, [busy, mediaPath, onStatus])

  const runHashes = useCallback(async (): Promise<void> => {
    if (!mediaPath || busy) {
      return
    }
    setBusy(true)
    onStatus(uiText('mediaUtilitiesHashesBusy'))
    try {
      const res = await window.velorix.utilities.computeFileHash({
        inputPath: mediaPath,
        uiLocale: getUiLocale()
      })
      if (res.ok) {
        onStatus(
          uiTextVars('mediaUtilitiesHashesDone', {
            name: res.fileName,
            md5: res.md5,
            sha256: res.sha256
          })
        )
      } else if ('error' in res) {
        onStatus(res.error)
      }
    } finally {
      setBusy(false)
    }
  }, [busy, mediaPath, onStatus])

  const runGenerateNoise = useCallback(async (): Promise<void> => {
    if (busy) {
      return
    }
    const durationSec = Number.parseFloat(noiseDurationSec.trim())
    if (!Number.isFinite(durationSec) || durationSec <= 0) {
      onStatus(uiText('mediaUtilitiesNoiseDurationLabel'))
      return
    }
    setBusy(true)
    onStatus(uiText('mediaUtilitiesNoiseBusy'))
    try {
      const res = await window.velorix.utilities.generateNoise({
        kind: noiseKind,
        durationSec,
        uiLocale: getUiLocale()
      })
      if (res.ok) {
        onStatus(uiTextVars('mediaUtilitiesNoiseDone', { path: res.outputPath }))
      } else if ('cancelled' in res && res.cancelled) {
        onStatus(uiText('mediaUtilitiesCancelled'))
      } else if ('error' in res) {
        onStatus(res.error)
      }
    } finally {
      setBusy(false)
    }
  }, [busy, noiseDurationSec, noiseKind, onStatus])

  const runConvertImage = useCallback(async (): Promise<void> => {
    if (!imagePath || busy) {
      return
    }
    if (!isMediaUtilitiesImageInputPath(imagePath)) {
      onStatus(uiText('mediaUtilitiesImageNotImage'))
      return
    }
    setBusy(true)
    onStatus(uiText('mediaUtilitiesImageBusy'))
    try {
      const res = await window.velorix.utilities.convertImage({
        inputPath: imagePath,
        targetFormat: imageFormat,
        uiLocale: getUiLocale()
      })
      if (res.ok) {
        onStatus(uiTextVars('mediaUtilitiesImageDone', { path: res.outputPath }))
      } else if ('cancelled' in res && res.cancelled) {
        onStatus(uiText('mediaUtilitiesCancelled'))
      } else if ('error' in res) {
        onStatus(res.error)
      }
    } finally {
      setBusy(false)
    }
  }, [busy, imageFormat, imagePath, onStatus])

  const displayName =
    mediaPath !== null && mediaPath.length > 0
      ? mediaPath.replace(/^.*[/\\]/, '')
      : uiText('mediaUtilitiesNoFile')

  const imageDisplayName =
    imagePath !== null && imagePath.length > 0
      ? imagePath.replace(/^.*[/\\]/, '')
      : uiText('mediaUtilitiesNoFile')

  return (
    <div className="about-utilities-stack">
      <section
        className="about-diagnostics-folders media-file-utilities"
        aria-label={uiText('mediaUtilitiesRegionAria')}
        {...(describedById ? { 'aria-describedby': describedById } : {})}
        aria-busy={busy}
      >
        <h3 className="about-section-title">{uiText('mediaUtilitiesTitle')}</h3>
        <p className="app-modal-hint">{uiText('mediaUtilitiesHint')}</p>
        <p className="app-modal-hint" title={mediaPath ?? ''}>
          {displayName}
        </p>
        <div
          className="app-settings-benchmark-actions"
          role="toolbar"
          aria-label={uiText('mediaUtilitiesToolbarAria')}
        >
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={disabled || busy}
            title={uiText('mediaUtilitiesPickFileTitle')}
            onClick={() => {
              void pickFile()
            }}
          >
            {uiText('mediaUtilitiesPickFile')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={disabled || busy || mediaPath === null}
            title={uiText('mediaUtilitiesRepairTitle')}
            onClick={() => {
              void runRepair()
            }}
          >
            {uiText('mediaUtilitiesRepair')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={disabled || busy || mediaPath === null}
            title={uiText('mediaUtilitiesIntegrityTitle')}
            onClick={() => {
              void runIntegrity()
            }}
          >
            {uiText('mediaUtilitiesIntegrity')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={disabled || busy || mediaPath === null}
            title={uiText('mediaUtilitiesHashesTitle')}
            onClick={() => {
              void runHashes()
            }}
          >
            {uiText('mediaUtilitiesHashes')}
          </button>
        </div>
      </section>

      <section
        className="about-diagnostics-folders media-image-utilities"
        aria-label={uiText('mediaUtilitiesImageTitle')}
        {...(describedById ? { 'aria-describedby': describedById } : {})}
        aria-busy={busy}
      >
        <h3 className="about-section-title">{uiText('mediaUtilitiesImageTitle')}</h3>
        <p className="app-modal-hint">{uiText('mediaUtilitiesImageHint')}</p>
        <p className="app-modal-hint" title={imagePath ?? ''}>
          {imageDisplayName}
        </p>
        <div className="app-settings-field-row">
          <label
            className="app-settings-label"
            htmlFor="media-image-format"
            title={uiText('mediaUtilitiesImageFormatTitle')}
          >
            {uiText('mediaUtilitiesImageFormatLabel')}
          </label>
          <select
            id="media-image-format"
            className="app-settings-select"
            title={uiText('mediaUtilitiesImageFormatTitle')}
            disabled={disabled || busy}
            value={imageFormat}
            onChange={(e) => {
              setImageFormat(e.target.value as MediaUtilitiesImageFormatId)
            }}
          >
            <option value="jpg">{uiText('mediaUtilitiesImageFormatJpg')}</option>
            <option value="png">{uiText('mediaUtilitiesImageFormatPng')}</option>
            <option value="webp">{uiText('mediaUtilitiesImageFormatWebp')}</option>
            <option value="bmp">{uiText('mediaUtilitiesImageFormatBmp')}</option>
            <option value="tiff">{uiText('mediaUtilitiesImageFormatTiff')}</option>
          </select>
        </div>
        <div
          className="app-settings-benchmark-actions"
          role="toolbar"
          aria-label={uiText('mediaUtilitiesImageToolbarAria')}
        >
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={disabled || busy}
            title={uiText('mediaUtilitiesImagePickTitle')}
            onClick={() => {
              void pickImageFile()
            }}
          >
            {uiText('mediaUtilitiesImagePick')}
          </button>
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={disabled || busy || imagePath === null}
            title={uiText('mediaUtilitiesImageConvertTitle')}
            onClick={() => {
              void runConvertImage()
            }}
          >
            {uiText('mediaUtilitiesImageConvert')}
          </button>
        </div>
      </section>

      <MediaFileUtilitiesSlideshowSection
        disabled={disabled}
        {...(describedById ? { describedById } : {})}
        busy={busy}
        setBusy={setBusy}
        onStatus={onStatus}
      />

      <section
        className="about-diagnostics-folders media-noise-utilities"
        aria-label={uiText('mediaUtilitiesNoiseTitle')}
        {...(describedById ? { 'aria-describedby': describedById } : {})}
        aria-busy={busy}
      >
        <h3 className="about-section-title">{uiText('mediaUtilitiesNoiseTitle')}</h3>
        <p className="app-modal-hint">{uiText('mediaUtilitiesNoiseHint')}</p>
        <div className="app-settings-field-row">
          <label
            className="app-settings-label"
            htmlFor="media-noise-kind"
            title={uiText('mediaUtilitiesNoiseKindTitle')}
          >
            {uiText('mediaUtilitiesNoiseKindLabel')}
          </label>
          <select
            id="media-noise-kind"
            className="app-settings-select"
            title={uiText('mediaUtilitiesNoiseKindTitle')}
            disabled={disabled || busy}
            value={noiseKind}
            onChange={(e) => {
              setNoiseKind(e.target.value as MediaUtilitiesNoiseKind)
            }}
          >
            <option value="white">{uiText('mediaUtilitiesNoiseKindWhite')}</option>
            <option value="pink">{uiText('mediaUtilitiesNoiseKindPink')}</option>
            <option value="silence">{uiText('mediaUtilitiesNoiseKindSilence')}</option>
          </select>
        </div>
        <div className="app-settings-field-row">
          <label
            className="app-settings-label"
            htmlFor="media-noise-duration"
            title={uiText('mediaUtilitiesNoiseDurationTitle')}
          >
            {uiText('mediaUtilitiesNoiseDurationLabel')}
          </label>
          <input
            id="media-noise-duration"
            className="app-settings-input app-settings-input-narrow"
            type="number"
            min={0.1}
            max={3600}
            step={0.1}
            title={uiText('mediaUtilitiesNoiseDurationTitle')}
            aria-label={uiText('mediaUtilitiesNoiseDurationLabel')}
            disabled={disabled || busy}
            value={noiseDurationSec}
            onChange={(e) => {
              setNoiseDurationSec(e.target.value)
            }}
          />
        </div>
        <div
          className="app-settings-benchmark-actions"
          role="toolbar"
          aria-label={uiText('mediaUtilitiesNoiseToolbarAria')}
        >
          <button
            type="button"
            className="app-btn app-btn-compact"
            disabled={disabled || busy}
            title={uiText('mediaUtilitiesNoiseGenerateTitle')}
            onClick={() => {
              void runGenerateNoise()
            }}
          >
            {uiText('mediaUtilitiesNoiseGenerate')}
          </button>
        </div>
      </section>
    </div>
  )
}
