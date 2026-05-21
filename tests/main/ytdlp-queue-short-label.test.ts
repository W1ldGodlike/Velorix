import { mkdtempSync, rmSync, writeFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { afterEach, describe, expect, it } from 'vitest'

import { shortUrlLabel } from '../../src/main/services/downloads/downloads-queue'
import {
  looksLikeYtdlpTechnicalShortLabel,
  pickYtdlpQueueShortLabelForOutputPath,
  shouldApplyYtdlpInfoTitleShortLabel,
  shouldPreferYtdlpOutputPathShortLabel
} from '../../src/main/services/ytdlp/ytdlp-queue-short-label'
import { displayLabelFromYtdlpOutputPath } from '../../src/main/services/ytdlp/ytdlp-progress-parser-download'

const VK_URL = 'https://vkvideo.ru/video-12875570_456240933'

describe('looksLikeYtdlpTechnicalShortLabel', () => {
  it('распознаёт id VK и YouTube', () => {
    expect(looksLikeYtdlpTechnicalShortLabel('-12875570_456240933')).toBe(true)
    expect(looksLikeYtdlpTechnicalShortLabel('dQw4w9WgXcQ')).toBe(true)
  })

  it('не помечает человеческие названия', () => {
    expect(looksLikeYtdlpTechnicalShortLabel('Rimworld — нормальное имя')).toBe(false)
    expect(looksLikeYtdlpTechnicalShortLabel('My Video Title')).toBe(false)
  })
})

describe('shouldPreferYtdlpOutputPathShortLabel', () => {
  it('заменяет технический id из [info] на имя из Destination', () => {
    const nice = 'Rimworld. нормальное имя'
    expect(shouldPreferYtdlpOutputPathShortLabel('-12875570_456240933', nice, VK_URL)).toBe(true)
  })

  it('оставляет уже нормальную подпись', () => {
    const nice = 'Другое имя'
    expect(shouldPreferYtdlpOutputPathShortLabel('Уже нормальное имя', nice, VK_URL)).toBe(false)
  })
})

describe('shouldApplyYtdlpInfoTitleShortLabel', () => {
  it('не подставляет технический title из [info]', () => {
    expect(
      shouldApplyYtdlpInfoTitleShortLabel('-12875570_456240933', VK_URL, shortUrlLabel(VK_URL))
    ).toBe(false)
  })

  it('подставляет человеческий title пока подпись — URL', () => {
    expect(
      shouldApplyYtdlpInfoTitleShortLabel('Какой-то ролик', VK_URL, shortUrlLabel(VK_URL))
    ).toBe(true)
  })
})

describe('pickYtdlpQueueShortLabelForOutputPath', () => {
  let root = ''

  afterEach(() => {
    if (root) {
      rmSync(root, { recursive: true, force: true })
      root = ''
    }
  })

  it('берёт имя из .part, если финал ещё не записан', () => {
    root = mkdtempSync(join(tmpdir(), 'flux-ytdlp-label-'))
    const out = join(root, 'Нормальное название.mp4')
    const part = `${out}.part`
    writeFileSync(part, 'x')
    expect(pickYtdlpQueueShortLabelForOutputPath(out)).toBe('Нормальное название')
  })

  it('использует объявленный путь без файла на диске', () => {
    root = mkdtempSync(join(tmpdir(), 'flux-ytdlp-label2-'))
    const out = join(root, 'Только Destination.mkv')
    expect(pickYtdlpQueueShortLabelForOutputPath(out)).toBe('Только Destination')
  })
})

describe('displayLabelFromYtdlpOutputPath partial suffix', () => {
  it('убирает .part перед разбором расширения', () => {
    expect(displayLabelFromYtdlpOutputPath('C:\\dl\\My Video.mp4.part')).toBe('My Video')
  })
})
