/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'

const rel = 'tests/shared/ffmpeg-export-argv.test.ts'
const lines = execSync(`git show HEAD:${rel}`, { encoding: 'utf8' }).split(/\r?\n/)

const vitestHeader = "import { describe, expect, it } from 'vitest'\n"

const sliceImports = {
  'ffmpeg-export-argv-encode-audio.test.ts': `import { FFMPEG_EXPORT_ENCODE_PRESET_CASES } from '../fixtures/ffmpeg-export-argv-cases'
import {
  buildFfmpegExportArgv,
  resolveFfmpegExportEncodeParams
} from '../../src/shared/ffmpeg-export-argv'
import {
  FFMPEG_EXPORT_AUDIO_FLAC_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_AUDIO_LIBOPUS_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_AUDIO_LIBVORBIS_MKV_ONLY_ERROR
} from '../../src/shared/ffmpeg-export-contract'
`,
  'ffmpeg-export-argv-filters.test.ts': `import {
  FFMPEG_EXPORT_CROP_FILTER_CASES,
  FFMPEG_EXPORT_SCALE_FILTER_CASES,
  FFMPEG_EXPORT_VIDEO_TRANSFORM_CASES
} from '../fixtures/ffmpeg-export-argv-cases'
import {
  buildFfmpegExportArgv,
  resolveFfmpegExportCropFilter,
  resolveFfmpegExportScaleFilter,
  resolveFfmpegExportVideoTransformFilters
} from '../../src/shared/ffmpeg-export-argv'
`,
  'ffmpeg-export-argv-codecs.test.ts': `import { buildFfmpegExportArgv } from '../../src/shared/ffmpeg-export-argv'
import {
  FFMPEG_EXPORT_AOM_AV1_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_DNXHD_MOV_ONLY_ERROR,
  FFMPEG_EXPORT_FFV1_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_PRORES_MOV_ONLY_ERROR,
  FFMPEG_EXPORT_RAV1E_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_SVTAV1_MKV_ONLY_ERROR,
  FFMPEG_EXPORT_VP9_MKV_ONLY_ERROR
} from '../../src/shared/ffmpeg-export-contract'
`,
  'ffmpeg-export-argv-hwaccel.test.ts': `import { buildFfmpegExportArgv } from '../../src/shared/ffmpeg-export-argv'
`,
  'ffmpeg-export-argv-build-trim.test.ts': `import {
  buildFfmpegExportArgv,
  buildFfmpegExportPreviewCommand,
  formatFfmpegArgvForPreview
} from '../../src/shared/ffmpeg-export-argv'
`,
  'ffmpeg-export-argv-preview-pass.test.ts': `import {
  FFMPEG_EXPORT_AUDIO_GAIN_DB_CASES,
  FFMPEG_EXPORT_SHOULD_APPLY_TRIM_CASES,
  FFMPEG_EXPORT_SUBTITLE_COPY_CODEC_CASES
} from '../fixtures/ffmpeg-export-argv-cases'
import {
  buildFfmpegExportArgv,
  buildFfmpegExportPreviewCommand,
  normalizeFfmpegExportAudioGainDb,
  resolveFfmpegExportSubtitleCopyCodec,
  shouldApplyFfmpegExportTrim
} from '../../src/shared/ffmpeg-export-argv'
`,
  'ffmpeg-export-argv-filters-metadata.test.ts': `import {
  FFMPEG_EXPORT_FILTER_RESOLVE_CASES,
  FFMPEG_EXPORT_LUT_ESCAPE_CASES,
  type FfmpegExportArgvFilterResolver
} from '../fixtures/ffmpeg-export-argv-cases'
import {
  buildFfmpegExportArgv,
  buildFfmpegExportLut3dFilter,
  buildFfmpegExportPreviewCommand,
  escapeFilePathForFfmpegFilter,
  resolveFfmpegExportAudioNormalizeFilter,
  resolveFfmpegExportVideoBlurFilter,
  resolveFfmpegExportVideoDebandFilter,
  resolveFfmpegExportVideoDeinterlaceFilter,
  resolveFfmpegExportVideoDenoiseFilter,
  resolveFfmpegExportVideoEqFilter,
  resolveFfmpegExportVideoGrainFilter,
  resolveFfmpegExportVideoHisteqFilter,
  resolveFfmpegExportVideoHueFilter,
  resolveFfmpegExportVideoSharpenFilter,
  resolveFfmpegExportVideoVignetteFilter
} from '../../src/shared/ffmpeg-export-argv'
`
}

const slices = [
  {
    out: 'tests/shared/ffmpeg-export-argv-encode-audio.test.ts',
    from: 71,
    to: 303,
    title: 'encode preset and audio modes'
  },
  {
    out: 'tests/shared/ffmpeg-export-argv-filters.test.ts',
    from: 304,
    to: 344,
    title: 'scale, transform, crop filters'
  },
  {
    out: 'tests/shared/ffmpeg-export-argv-codecs.test.ts',
    from: 345,
    to: 702,
    title: 'video codecs and containers'
  },
  {
    out: 'tests/shared/ffmpeg-export-argv-hwaccel.test.ts',
    from: 703,
    to: 991,
    title: 'hwaccel and hardware encode'
  },
  {
    out: 'tests/shared/ffmpeg-export-argv-build-trim.test.ts',
    from: 992,
    to: 1158,
    title: 'argv build, trim, preview helpers'
  },
  {
    out: 'tests/shared/ffmpeg-export-argv-preview-pass.test.ts',
    from: 1159,
    to: 1276,
    title: 'preview command and two-pass'
  },
  {
    out: 'tests/shared/ffmpeg-export-argv-filters-metadata.test.ts',
    from: 1277,
    to: 1613,
    title: 'filters, metadata, subtitles, LUT'
  }
]

for (const { out, from, to, title } of slices) {
  const body = lines.slice(from - 1, to).join('\n')
  const imports = sliceImports[path.basename(out)]
  const filterResolvers =
    out === 'tests/shared/ffmpeg-export-argv-filters-metadata.test.ts'
      ? `
const FFMPEG_EXPORT_FILTER_RESOLVERS: Record<
  FfmpegExportArgvFilterResolver,
  (id: string) => string | null
> = {
  denoise: (id) => resolveFfmpegExportVideoDenoiseFilter(id as 'off'),
  sharpen: (id) => resolveFfmpegExportVideoSharpenFilter(id as 'off'),
  deband: (id) => resolveFfmpegExportVideoDebandFilter(id as 'off'),
  grain: (id) => resolveFfmpegExportVideoGrainFilter(id as 'off'),
  vignette: (id) => resolveFfmpegExportVideoVignetteFilter(id as 'off'),
  blur: (id) => resolveFfmpegExportVideoBlurFilter(id as 'off'),
  deinterlace: (id) => resolveFfmpegExportVideoDeinterlaceFilter(id as 'off'),
  histeq: (id) => resolveFfmpegExportVideoHisteqFilter(id as 'off'),
  hue: (id) => resolveFfmpegExportVideoHueFilter(id as 'off'),
  eq: (id) => resolveFfmpegExportVideoEqFilter(id as 'off'),
  audioNormalize: (id) => resolveFfmpegExportAudioNormalizeFilter(id as 'off')
}
`
      : ''
  fs.writeFileSync(
    out,
    `${vitestHeader}
${imports}${filterResolvers}
describe('shared ffmpeg export argv — ${title}', () => {
${body}
})
`
  )
}

console.log('[split-ffmpeg-export-argv-test] wrote', slices.length, 'files')
