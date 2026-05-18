import { describe, expect, it } from 'vitest'

import { createEmptyFfmpegHwEncodersSnapshot } from '../../src/shared/ffmpeg-hw-encoder-probe'
import {
  buildEditorExportStatusbarCodecDisplay,
  resolveEditorExportCodecDisplayName
} from '../../src/renderer/src/editor-export-statusbar-codec'
import { resolveEditorExportStatusbarEncoderSummary } from '../../src/renderer/src/editor-export-codec-tooltip'

const uiText = (key: string): string => key
const uiTextVars = (key: string, vars: Record<string, string>): string =>
  `${key}:${Object.values(vars).join(',')}`

describe('editor-export-statusbar-codec', () => {
  it('resolveEditorExportCodecDisplayName — HW label key', () => {
    expect(resolveEditorExportCodecDisplayName('h264_nvenc', uiText)).toBe(
      'editorExportCodecHwH264Nvenc'
    )
  })

  it('resolveEditorExportStatusbarEncoderSummary — NVENC family', () => {
    expect(resolveEditorExportStatusbarEncoderSummary('h264_nvenc', uiText)).toBe(
      'editorStatusbarProcessingNvenc'
    )
  })

  it('resolveEditorExportStatusbarEncoderSummary — CPU', () => {
    expect(resolveEditorExportStatusbarEncoderSummary('libx264', uiText)).toBe(
      'editorStatusbarProcessingCpu'
    )
  })

  it('buildEditorExportStatusbarCodecDisplay — processing label, auto badge, tooltip, aria', () => {
    const snap = createEmptyFfmpegHwEncodersSnapshot()
    snap.h264_nvenc = true
    const { label, title, ariaLabel } = buildEditorExportStatusbarCodecDisplay({
      exportVideoCodec: 'hw_auto',
      resolvedCodec: 'h264_nvenc',
      hwEncoderProbe: {
        ok: true,
        snapshot: snap,
        hwaccels: ['cuda', 'dxva2'],
        nvidiaGpu: { name: 'NVIDIA GeForce RTX 3060', driverVersion: '551.61' }
      },
      exportHwDecode: true,
      exportHwaccelDecode: 'cuda',
      uiText,
      uiTextVars
    })
    expect(label).toContain('editorStatusbarProcessing')
    expect(label).toContain('editorStatusbarProcessingNvenc')
    expect(label).toContain('editorExportCodecHwAutoBadge')
    expect(label).toContain('editorStatusbarHwDecode')
    expect(title).toContain('editorExportCodecHwAutoBadgeTitle')
    expect(title).toContain('editorExportCodecHintNvenc')
    expect(title).toContain('editorStatusbarTitleHwEncoders')
    expect(title).toContain('editorStatusbarTitleGpu')
    expect(title).toContain('editorStatusbarTitleNvencSessions')
    expect(title).toContain('editorStatusbarTitleActiveHwDecode')
    expect(ariaLabel).toContain('editorStatusbarCodecAria')
  })

  it('buildEditorExportStatusbarCodecDisplay — CPU tooltip and probe error', () => {
    const cpu = buildEditorExportStatusbarCodecDisplay({
      exportVideoCodec: 'libx264',
      resolvedCodec: 'libx264',
      hwEncoderProbe: { ok: false, error: 'ffmpeg missing' },
      exportHwDecode: false,
      exportHwaccelDecode: null,
      uiText,
      uiTextVars
    })
    expect(cpu.label).toContain('editorStatusbarProcessingCpu')
    expect(cpu.title).toContain('editorStatusbarTitleCpu')
    expect(cpu.title).toContain('editorStatusbarTitleProbeFailed')
  })
})
