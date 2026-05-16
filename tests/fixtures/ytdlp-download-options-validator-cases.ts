export const YTDLP_RETRIES_LINE_CASES = [
  { input: '', expected: { ok: true, value: null, line: '' } },
  { input: '0', expected: { ok: true, value: 0, line: '0' } },
  { input: '99', expected: { ok: true, value: 99, line: '99' } },
  { input: '1.5', expectedOk: false },
  { input: '-1', expectedOk: false },
  { input: '100', expectedOk: false }
] as const

export const YTDLP_RATE_LIMIT_CASES = [
  { input: ' 500k ', expected: { ok: true, value: '500K' } },
  { input: '2m', expected: { ok: true, value: '2M' } },
  { input: '1M --exec', expectedOk: false },
  { input: 'fast', expectedOk: false }
] as const
