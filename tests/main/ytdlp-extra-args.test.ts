import { describe, expect, it } from 'vitest'

import {
  buildYtdlpSpawnArgvTokens,
  formatArgvTokensForPreview,
  parseExtraYtdlpArgsLine
} from '../../src/main/ytdlp-extra-args'

describe('parseExtraYtdlpArgsLine', () => {
  it('возвращает пустой массив для пустой строки', () => {
    expect(parseExtraYtdlpArgsLine('')).toEqual({ ok: true, args: [] })
    expect(parseExtraYtdlpArgsLine('   \t  ')).toEqual({ ok: true, args: [] })
  })

  it('разбивает токены по пробелам', () => {
    const r = parseExtraYtdlpArgsLine('--write-info-json --no-mtime')
    expect(r).toEqual({ ok: true, args: ['--write-info-json', '--no-mtime'] })
  })

  it('отвергает контрольные символы', () => {
    const r = parseExtraYtdlpArgsLine('--foo\nbar')
    // \n splits на отдельные токены, поэтому нет одной строки с control char
    expect(r.ok).toBe(true)
    const r2 = parseExtraYtdlpArgsLine('--foo bar\u0007')
    expect(r2.ok).toBe(false)
  })

  it('отвергает shell-метасимволы внутри токена', () => {
    for (const ch of [';', '|', '&', '$', '`', '<', '>', '\\', '"', "'"]) {
      const r = parseExtraYtdlpArgsLine(`--foo bar${ch}baz`)
      expect(r.ok, `should reject ${JSON.stringify(ch)}`).toBe(false)
    }
  })

  it('отвергает @batch-файлы', () => {
    expect(parseExtraYtdlpArgsLine('@list.txt').ok).toBe(false)
  })

  const dupCases: Array<[string, string]> = [
    ['-o', '-o /tmp/x'],
    ['--output', '--output /tmp/x'],
    ['-o=', '-o=template'],
    ['-a', '-a list.txt'],
    ['--batch-file=', '--batch-file=list.txt'],
    ['--cookies', '--cookies cookies.txt'],
    ['--cookies-from-browser', '--cookies-from-browser chrome'],
    ['--impersonate', '--impersonate chrome'],
    ['--limit-rate', '--limit-rate 1M'],
    ['-r', '-r 5'],
    ['--retries', '--retries 3'],
    ['--fragment-retries', '--fragment-retries 5'],
    ['-P', '-P /tmp']
  ]

  it.each(dupCases)('запрещает дубль/конфликт %s', (_label, line) => {
    const r = parseExtraYtdlpArgsLine(line)
    expect(r.ok).toBe(false)
  })

  const gluedShortOptionCases = [
    '-P/tmp/evil',
    '-Ptemp:/tmp/evil',
    '-a/tmp/list.txt',
    '-o/tmp/%(title)s.%(ext)s',
    '-r5M'
  ]

  it.each(gluedShortOptionCases)('запрещает glued short-option %s', (token) => {
    const r = parseExtraYtdlpArgsLine(token)
    expect(r.ok).toBe(false)
  })

  const dangerousFlags = [
    '--exec',
    '--exec-before-download',
    '--use-postprocessor',
    '--postprocessor-args',
    '--ppa',
    '--external-downloader',
    '--downloader',
    '--external-downloader-args',
    '--config-location',
    '--config-locations',
    '--plugin-dirs',
    '--ffmpeg-location',
    '--paths',
    '--enable-file-urls'
  ]

  it.each(dangerousFlags)('запрещает runtime-флаг %s', (flag) => {
    const r = parseExtraYtdlpArgsLine(`${flag} value`)
    expect(r.ok).toBe(false)
  })

  it('отвергает слишком длинную строку', () => {
    const big = '--x '.repeat(2000)
    const r = parseExtraYtdlpArgsLine(big)
    expect(r.ok).toBe(false)
  })
})

describe('buildYtdlpSpawnArgvTokens', () => {
  const base = {
    downloadPlaylist: false,
    audioOnly: false,
    subtitlePreset: 'none' as const,
    subLangs: '',
    cookiesFile: null,
    cookiesBrowser: null,
    impersonateTarget: null,
    rateLimit: '',
    retries: null,
    fragmentRetries: null,
    formatExtraArgs: [],
    extraArgs: [],
    outputPattern: '/tmp/%(title)s.%(ext)s',
    url: 'https://example.com/v'
  }

  it('всегда добавляет --newline и --no-color', () => {
    const args = buildYtdlpSpawnArgvTokens(base)
    expect(args.slice(0, 2)).toEqual(['--newline', '--no-color'])
  })

  it('кладёт --no-playlist если downloadPlaylist=false', () => {
    const args = buildYtdlpSpawnArgvTokens(base)
    expect(args).toContain('--no-playlist')
    expect(args).not.toContain('--yes-playlist')
  })

  it('кладёт --yes-playlist если downloadPlaylist=true', () => {
    const args = buildYtdlpSpawnArgvTokens({ ...base, downloadPlaylist: true })
    expect(args).toContain('--yes-playlist')
    expect(args).not.toContain('--no-playlist')
  })

  it('cookies-file имеет приоритет над cookies-from-browser', () => {
    const args = buildYtdlpSpawnArgvTokens({
      ...base,
      cookiesFile: 'C:/c.txt',
      cookiesBrowser: 'chrome'
    })
    expect(args).toContain('--cookies')
    expect(args).toContain('C:/c.txt')
    expect(args).not.toContain('--cookies-from-browser')
  })

  it('добавляет --impersonate, --limit-rate, --retries, --fragment-retries по флагам', () => {
    const args = buildYtdlpSpawnArgvTokens({
      ...base,
      impersonateTarget: 'firefox',
      rateLimit: '500K',
      retries: 3,
      fragmentRetries: 7
    })
    expect(args).toContain('--impersonate')
    expect(args).toContain('firefox')
    expect(args).toContain('--limit-rate')
    expect(args).toContain('500K')
    expect(args).toContain('--retries')
    expect(args).toContain('3')
    expect(args).toContain('--fragment-retries')
    expect(args).toContain('7')
  })

  it('собирает субтитры manual_auto + sub-langs только при непустых langs', () => {
    const a = buildYtdlpSpawnArgvTokens({
      ...base,
      subtitlePreset: 'manual_auto',
      subLangs: 'ru,en'
    })
    expect(a).toContain('--write-subs')
    expect(a).toContain('--write-auto-subs')
    expect(a).toContain('--sub-langs')
    expect(a).toContain('ru,en')
    const b = buildYtdlpSpawnArgvTokens({ ...base, subtitlePreset: 'manual_auto', subLangs: '' })
    expect(b).not.toContain('--sub-langs')
  })

  it('audioOnly добавляет -x и игнорирует formatExtraArgs', () => {
    const args = buildYtdlpSpawnArgvTokens({
      ...base,
      audioOnly: true,
      formatExtraArgs: ['-f', 'best']
    })
    expect(args).toContain('-x')
    expect(args).toContain('--audio-format')
    expect(args).toContain('best')
  })

  it('outputPattern и url всегда в конце через -o', () => {
    const args = buildYtdlpSpawnArgvTokens(base)
    const tail = args.slice(-3)
    expect(tail).toEqual(['-o', '/tmp/%(title)s.%(ext)s', 'https://example.com/v'])
  })
})

describe('formatArgvTokensForPreview', () => {
  it('экранирует токены с пробелами в кавычки', () => {
    expect(formatArgvTokensForPreview(['--foo', 'bar baz'])).toBe('--foo "bar baz"')
  })

  it('экранирует обратные слэши и двойные кавычки', () => {
    expect(formatArgvTokensForPreview(['a"b', 'c\\d'])).toBe('"a\\"b" c\\d')
  })

  it('обычные токены оставляет как есть', () => {
    expect(formatArgvTokensForPreview(['--no-color', '--newline'])).toBe('--no-color --newline')
  })
})
