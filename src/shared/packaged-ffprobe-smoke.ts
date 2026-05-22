/**
 * §9/§18/§19 — packaged ffprobe smoke (split modules).
 */
export {
  listPackagedFfmpegCandidatePaths,
  listPackagedFfprobeCandidatePaths
} from './packaged-engine-candidate-paths'
export { isMinimalFfprobeProbeJson } from './packaged-ffprobe-smoke-minimal'
export { isPackagedFfprobeProbeJsonParsableByStreamDetailFields } from './packaged-ffprobe-smoke-stream-validators'
export { isPackagedFfprobeProbeJsonParsableByContainerRegistry } from './packaged-ffprobe-smoke-container-registry'

import { listPackagedFfprobeCandidatePaths } from './packaged-engine-candidate-paths'
import { isPackagedFfprobeProbeJsonParsableByContainerRegistry } from './packaged-ffprobe-smoke-container-registry'

/** §9 smoke-скрипт: format registry + stream detail optional fields. */
export function isPackagedFfprobeProbeJsonParsableForSmoke(parsed: unknown): boolean {
  return isPackagedFfprobeProbeJsonParsableByContainerRegistry(parsed)
}

/** §18 Support ZIP — подсказки smoke без запуска ffprobe. */
export function formatPackagedFfprobeSmokeDiagnosticLines(): string[] {
  return [
    'command: npm run smoke:packaged-ffprobe (part of smoke:packaged-engines)',
    'check: isMinimalFfprobeProbeJson + isPackagedFfprobeProbeJsonParsableForSmoke (format + stream detail)',
    'registry optional: format.duration, duration_ts, time_base, size, probe_size, flags (incl. hex string), probe_score, filename, format_long_name, bit_rate, start_time, start_time_real, nb_programs, nb_chapters, format.tags.* (major_brand, minor_version, compatible_brands, creation_time, …; parseFfprobeFormatTagScalar)',
    'probe optional: chapters[] (buildChapterRowsFromFfprobeJson / isFfprobeChaptersArrayOkForSmoke)',
    'stream detail optional: codec_type, codec_name, id, duration, duration_ts, start_time, start_pts, fps, bit_rate, nb_frames, nb_read_frames, nb_read_packets, width/height/pix_fmt, color_*, field_order, chroma_location, bits_per_*_sample, coded_width/height, extradata_size, refs, has_b_frames, closed_captions, is_avc, ticks_per_frame, initial_padding, index, stream_index, disposition, sample_aspect_ratio, display_aspect_ratio, channel_layout, channels, sample_rate, sample_fmt, profile, level, bits_per_sample, codec_tag, codec_tag_string, stream.tags.* (language, title, handler_name, rotate, stereo_mode, …), side_data_list, time_base, codec_long_name',
    'ui/export: formatFfprobeContainerDiagnostics* (filename + probe layout + offset/timing)',
    'env: VELORIX_SKIP_FFPROBE_SMOKE, VELORIX_FFPROBE_SMOKE_PROBE=0, VELORIX_FFPROBE_PATH'
  ]
}

export function buildSupportZipFfprobeSmokeLines(
  rootDir: string,
  fileExists: (path: string) => boolean
): string[] {
  return [
    ...formatPackagedFfprobeSmokeDiagnosticLines(),
    ...listPackagedFfprobeCandidatePaths(rootDir).map(
      (p) => `candidate: ${p} (${fileExists(p) ? 'present' : 'missing'})`
    )
  ]
}
