import { describe, expect, it } from 'vitest'

import { createEmptyFfmpegHwEncodersSnapshot } from '../../src/shared/ffmpeg-hw-encoder-probe'
import { buildEditorExportCodecDetailTooltip } from '../../src/renderer/src/editor-export-codec-tooltip'

const uiText = (key: string): string => key
const uiTextVars = (key: string, vars: Record<string, string>): string =>
  `${key}:${Object.values(vars).join(',')}`

describe('editor-export-codec-tooltip', () => {
  it('buildEditorExportCodecDetailTooltip — AMF without nvidia-smi', () => {
    const snap = createEmptyFfmpegHwEncodersSnapshot()
    snap.h264_amf = true
    const title = buildEditorExportCodecDetailTooltip({
      exportVideoCodec: 'h264_amf',
      resolvedCodec: 'h264_amf',
      hwEncoderProbe: {
        ok: true,
        snapshot: snap,
        hwaccels: ['d3d11va'],
        nvidiaGpu: null,
        gpuAdapterNames: ['AMD Radeon RX 580'],
        osPlatform: 'win32'
      },
      exportHwDecode: false,
      exportHwaccelDecode: null,
      uiText,
      uiTextVars
    })
    expect(title).toContain('editorExportCodecHintAmf')
    expect(title).not.toContain('editorStatusbarTitleGpu')
    expect(title).not.toContain('editorStatusbarTitleNvencSessions')
  })
})
