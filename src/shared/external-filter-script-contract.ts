/** §17 — внешний скрипт AviSynth/VapourSynth как фильтр экспорта ffmpeg. */

export type ExternalFilterScriptKind = 'off' | 'avisynth' | 'vapoursynth'

export type ExternalFilterScriptApplyPayload = {
  kind: ExternalFilterScriptKind
  scriptPath: string | null
}

export type ExternalFilterScriptPickResult =
  | { ok: true; path: string }
  | { ok: false; cancelled: true }
  | { ok: false; error: string }

export type ExternalFilterScriptApplyResult = { ok: true } | { ok: false; error: string }
