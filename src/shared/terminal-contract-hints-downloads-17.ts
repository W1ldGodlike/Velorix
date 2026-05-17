import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки вкладки «Загрузки» (часть 17). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_17: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· заголовок и архив загрузок',
    summary:
      'Заголовок без скачивания с файлом архива уже скачанного (--download-archive flux-terminal-archive.txt --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --download-archive flux-terminal-archive.txt --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· filename без перезаписи',
    summary:
      'Имя файла без скачивания и без перезаписи существующих (--no-overwrites --skip-download --print filename); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --no-overwrites --print filename '
  },
  {
    tool: 'yt-dlp',
    token: '· filename с перезаписью',
    summary:
      'Имя файла без скачивания с принудительной перезаписью (--force-overwrites --skip-download --print filename); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --force-overwrites --print filename '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок break-on-reject',
    summary:
      'Заголовок без скачивания с остановкой при отклонении формата (--break-on-reject --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --break-on-reject --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 7',
    summary:
      'Заголовок без скачивания с лимитом семи загрузок за прогон (--max-downloads 7 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 7 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 0.7',
    summary:
      'Заголовок без скачивания с паузой 0,7 с между HTTP-запросами (--sleep-requests 0.7 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 0.7 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 5',
    summary:
      'Заголовок без скачивания с пятью параллельными фрагментами DASH/HLS (--concurrent-fragments 5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 6',
    summary:
      'Заголовок без скачивания с шестью повторами на фрагмент (--fragment-retries 6 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 6 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 45',
    summary:
      'Заголовок без скачивания с таймаутом сокета 45 с (--socket-timeout 45 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 45 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 4',
    summary:
      'Заголовок без скачивания с четырьмя повторами HTTP (--retries 4 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 4 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 750K',
    summary:
      'Заголовок без скачивания с ограничением скорости 750K (--limit-rate 750K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 750K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 3',
    summary:
      'Заголовок без скачивания с тремя повторами чтения и записи на диск (--file-access-retries 3 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 3 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass FR',
    summary:
      'Заголовок без скачивания с гео-обходом через регион FR (--geo-bypass-country FR --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country FR --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass JP print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион JP (--geo-bypass-country JP --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country JP --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 11',
    summary:
      'Заголовок без скачивания с лимитом одиннадцати загрузок за прогон (--max-downloads 11 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 11 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 1.1',
    summary:
      'Заголовок без скачивания с паузой 1,1 с между HTTP-запросами (--sleep-requests 1.1 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 1.1 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 8',
    summary:
      'Заголовок без скачивания с восемью параллельными фрагментами DASH/HLS (--concurrent-fragments 8 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 8 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 9',
    summary:
      'Заголовок без скачивания с девятью повторами на фрагмент (--fragment-retries 9 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 9 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 90',
    summary:
      'Заголовок без скачивания с таймаутом сокета 90 с (--socket-timeout 90 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 90 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 7',
    summary:
      'Заголовок без скачивания с семью повторами HTTP (--retries 7 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 7 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 1M print',
    summary:
      'Заголовок без скачивания с ограничением скорости 1M (--limit-rate 1M --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 1M --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 4',
    summary:
      'Заголовок без скачивания с четырьмя повторами извлечения (--extractor-retries 4 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 4 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 6',
    summary:
      'Заголовок без скачивания с шестью повторами чтения и записи на диск (--file-access-retries 6 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 6 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass US print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион US (--geo-bypass-country US --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country US --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass GB print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион GB (--geo-bypass-country GB --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country GB --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass IT print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион IT (--geo-bypass-country IT --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country IT --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 13',
    summary:
      'Заголовок без скачивания с лимитом тринадцати загрузок за прогон (--max-downloads 13 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 13 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 1.5',
    summary:
      'Заголовок без скачивания с паузой 1,5 с между HTTP-запросами (--sleep-requests 1.5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 1.5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 9',
    summary:
      'Заголовок без скачивания с девятью параллельными фрагментами DASH/HLS (--concurrent-fragments 9 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 9 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 11',
    summary:
      'Заголовок без скачивания с одиннадцатью повторами на фрагмент (--fragment-retries 11 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 11 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 120',
    summary:
      'Заголовок без скачивания с таймаутом сокета 120 с (--socket-timeout 120 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 120 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 8',
    summary:
      'Заголовок без скачивания с восемью повторами HTTP (--retries 8 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 8 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 400K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 400K (--limit-rate 400K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 400K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 5',
    summary:
      'Заголовок без скачивания с пятью повторами извлечения (--extractor-retries 5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 7',
    summary:
      'Заголовок без скачивания с семью повторами чтения и записи на диск (--file-access-retries 7 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 7 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass ES print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион ES (--geo-bypass-country ES --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country ES --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass CA print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион CA (--geo-bypass-country CA --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country CA --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass AU print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион AU (--geo-bypass-country AU --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country AU --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass NL print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион NL (--geo-bypass-country NL --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country NL --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 15',
    summary:
      'Заголовок без скачивания с лимитом пятнадцати загрузок за прогон (--max-downloads 15 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 15 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 2',
    summary:
      'Заголовок без скачивания с паузой 2 с между HTTP-запросами (--sleep-requests 2 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 2 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 10',
    summary:
      'Заголовок без скачивания с десятью параллельными фрагментами DASH/HLS (--concurrent-fragments 10 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 10 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 12',
    summary:
      'Заголовок без скачивания с двенадцатью повторами на фрагмент (--fragment-retries 12 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 12 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 180',
    summary:
      'Заголовок без скачивания с таймаутом сокета 180 с (--socket-timeout 180 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 180 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 9',
    summary:
      'Заголовок без скачивания с девятью повторами HTTP (--retries 9 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 9 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 900K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 900K (--limit-rate 900K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 900K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 6',
    summary:
      'Заголовок без скачивания с шестью повторами извлечения (--extractor-retries 6 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 6 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 8',
    summary:
      'Заголовок без скачивания с восемью повторами чтения и записи на диск (--file-access-retries 8 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 8 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass SE print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион SE (--geo-bypass-country SE --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country SE --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass NO print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион NO (--geo-bypass-country NO --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country NO --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass PL print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион PL (--geo-bypass-country PL --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country PL --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass KR print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион KR (--geo-bypass-country KR --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country KR --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass MX print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион MX (--geo-bypass-country MX --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country MX --print title '
  }
]
