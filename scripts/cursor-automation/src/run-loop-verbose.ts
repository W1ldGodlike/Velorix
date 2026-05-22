import { readBooleanSetting, readIntegerSetting, SDK_AUTOMATION_SETTINGS } from './sdk-settings.js'

export function shouldAllowVerboseLongLoop(): boolean {
  return readBooleanSetting(process.env.SDK_ALLOW_VERBOSE_LONG_LOOP, false)
}

export function normalizeVerboseMode(opts: { verbose: boolean; maxSteps: number }): boolean {
  if (!opts.verbose) {
    return false
  }
  if (opts.maxSteps <= SDK_AUTOMATION_SETTINGS.verboseLongLoopMaxSteps) {
    return true
  }
  if (shouldAllowVerboseLongLoop()) {
    return true
  }
  console.error(
    `VERBOSE отключён для long-loop ${opts.maxSteps} шагов: лимит ${SDK_AUTOMATION_SETTINGS.verboseLongLoopMaxSteps}. ` +
      'Если реально нужен полный stream/thinking лог, задайте SDK_ALLOW_VERBOSE_LONG_LOOP=1.'
  )
  return false
}

export function warnIfExpensiveSessionConfig(opts: {
  maxSteps: number
  sessionMaxSteps: number
}): void {
  if (
    opts.maxSteps > SDK_AUTOMATION_SETTINGS.verboseLongLoopMaxSteps &&
    opts.sessionMaxSteps >= SDK_AUTOMATION_SETTINGS.sessionStepsLongLoopWarnAt
  ) {
    console.error(
      `ВНИМАНИЕ: --session-steps ${opts.sessionMaxSteps} на long-loop ${opts.maxSteps} может резко увеличить Cache Read. ` +
        'Для минимума токенов используйте --session-steps 1.'
    )
  }
}

export function verboseMaxChars(): number {
  return readIntegerSetting(
    process.env.VERBOSE_MAX_CHARS,
    SDK_AUTOMATION_SETTINGS.defaultVerboseMaxChars,
    { min: 1000 }
  )
}

export async function streamVerboseAssistantText(run: {
  stream(): AsyncIterable<unknown>
}): Promise<void> {
  const maxChars = verboseMaxChars()
  let written = 0
  let truncated = false

  function writeLimited(text: string, stream: NodeJS.WriteStream): void {
    if (truncated) {
      return
    }
    const remaining = maxChars - written
    if (remaining <= 0) {
      truncated = true
      stream.write(`\n[verbose truncated after ${maxChars} chars]\n`)
      return
    }
    const chunk = text.length > remaining ? text.slice(0, remaining) : text
    written += chunk.length
    stream.write(chunk)
    if (text.length > remaining) {
      truncated = true
      stream.write(`\n[verbose truncated after ${maxChars} chars]\n`)
    }
  }

  for await (const msg of run.stream()) {
    if (
      typeof msg === 'object' &&
      msg !== null &&
      (msg as { type?: unknown }).type === 'assistant'
    ) {
      const assistant = msg as {
        message?: { content?: Array<{ type?: string; text?: string }> }
      }

      const content = assistant.message?.content
      if (!Array.isArray(content)) {
        continue
      }
      for (const block of content) {
        const t = block.text
        if (block.type === 'text' && typeof t === 'string') {
          writeLimited(t, process.stdout)
        }
      }
    }

    const mType =
      typeof msg === 'object' &&
      msg !== null &&
      typeof (msg as { type?: unknown }).type !== 'undefined'
        ? String((msg as { type?: unknown }).type)
        : ''
    if (
      typeof msg === 'object' &&
      msg !== null &&
      mType === 'thinking' &&
      typeof (msg as { text?: unknown }).text === 'string'
    ) {
      writeLimited(`\n[thinking] ${(msg as { text: string }).text}\n`, process.stderr)
    }
  }

  console.log('')
}

export function buildSessionRestartPrompt(args: {
  continuePrompt: string
  completedSteps: number
  maxSteps: number
  sessionIndex: number
  sessionMaxSteps: number
}): string {
  return [
    'Новая короткая SDK-сессия Velorix long-loop.',
    '',
    `Глобальный прогресс: уже завершено ${args.completedSteps}/${args.maxSteps}; эта SDK-сессия рассчитана максимум на ${args.sessionMaxSteps} итерации; номер сессии ${args.sessionIndex}.`,
    '',
    'Причина новой сессии: экономия tokens/cache-read. Не пытайся восстановить старый conversation context.',
    'Работай как после команды `+`, но с компактным handoff:',
    '- не перечитывай весь проект, весь чеклист, весь журнал, ТЗ или v0 без причины;',
    '- если не уверен, что брать дальше: прочитай только `## Ближайший TODO спринта` и связанный тематический §;',
    '- перед записью журнала прочитай только хвост `IMPLEMENTATION_JOURNAL.md`, возьми следующий `J-NNN`, время — только из `Get-Date`;',
    '- перед правками смотри `git status`; не трогай `.env`/секреты; коммит — один логичный на успешную итерацию;',
    '- делай максимум связной работы за итерацию, но не раздувай контекст лишними чтениями и логами.',
    '',
    'Далее применяй обычный continue-промпт:',
    '',
    args.continuePrompt
  ].join('\n')
}
