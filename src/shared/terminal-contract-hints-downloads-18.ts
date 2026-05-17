import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки вкладки «Загрузки» (часть 18). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_18: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 17',
    summary:
      'Заголовок без скачивания с лимитом семнадцати загрузок за прогон (--max-downloads 17 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 17 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 2.5',
    summary:
      'Заголовок без скачивания с паузой 2,5 с между HTTP-запросами (--sleep-requests 2.5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 2.5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 11',
    summary:
      'Заголовок без скачивания с одиннадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 11 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 11 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 13',
    summary:
      'Заголовок без скачивания с тринадцатью повторами на фрагмент (--fragment-retries 13 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 13 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 240',
    summary:
      'Заголовок без скачивания с таймаутом сокета 240 с (--socket-timeout 240 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 240 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 10',
    summary:
      'Заголовок без скачивания с десятью повторами HTTP (--retries 10 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 10 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 250K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 250K (--limit-rate 250K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 250K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 7',
    summary:
      'Заголовок без скачивания с семью повторами извлечения (--extractor-retries 7 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 7 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 9',
    summary:
      'Заголовок без скачивания с девятью повторами чтения и записи на диск (--file-access-retries 9 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 9 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass AR print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион AR (--geo-bypass-country AR --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country AR --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass CH print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион CH (--geo-bypass-country CH --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country CH --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass AT print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион AT (--geo-bypass-country AT --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country AT --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass BE print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион BE (--geo-bypass-country BE --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country BE --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass PT print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион PT (--geo-bypass-country PT --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country PT --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 19',
    summary:
      'Заголовок без скачивания с лимитом девятнадцати загрузок за прогон (--max-downloads 19 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 19 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 3',
    summary:
      'Заголовок без скачивания с паузой 3 с между HTTP-запросами (--sleep-requests 3 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 3 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 12',
    summary:
      'Заголовок без скачивания с двенадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 12 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 12 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 14',
    summary:
      'Заголовок без скачивания с четырнадцатью повторами на фрагмент (--fragment-retries 14 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 14 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 300',
    summary:
      'Заголовок без скачивания с таймаутом сокета 300 с (--socket-timeout 300 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 300 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 11',
    summary:
      'Заголовок без скачивания с одиннадцатью повторами HTTP (--retries 11 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 11 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 1200K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 1200K (--limit-rate 1200K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 1200K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 8',
    summary:
      'Заголовок без скачивания с восемью повторами извлечения (--extractor-retries 8 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 8 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 10',
    summary:
      'Заголовок без скачивания с десятью повторами чтения и записи на диск (--file-access-retries 10 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 10 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass GR print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион GR (--geo-bypass-country GR --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country GR --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass CZ print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион CZ (--geo-bypass-country CZ --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country CZ --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass IE print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион IE (--geo-bypass-country IE --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country IE --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass NZ print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион NZ (--geo-bypass-country NZ --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country NZ --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass FI print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион FI (--geo-bypass-country FI --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country FI --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 21',
    summary:
      'Заголовок без скачивания с лимитом двадцати одной загрузки за прогон (--max-downloads 21 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 21 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 3.5',
    summary:
      'Заголовок без скачивания с паузой 3,5 с между HTTP-запросами (--sleep-requests 3.5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 3.5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 13',
    summary:
      'Заголовок без скачивания с тринадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 13 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 13 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 15 print',
    summary:
      'Заголовок без скачивания с пятнадцатью повторами на фрагмент (--fragment-retries 15 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 15 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 360',
    summary:
      'Заголовок без скачивания с таймаутом сокета 360 с (--socket-timeout 360 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 360 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 12',
    summary:
      'Заголовок без скачивания с двенадцатью повторами HTTP (--retries 12 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 12 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 1100K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 1100K (--limit-rate 1100K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 1100K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 9',
    summary:
      'Заголовок без скачивания с девятью повторами извлечения (--extractor-retries 9 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 9 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 11',
    summary:
      'Заголовок без скачивания с одиннадцатью повторами чтения и записи на диск (--file-access-retries 11 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 11 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass DK print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион DK (--geo-bypass-country DK --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country DK --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass HU print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион HU (--geo-bypass-country HU --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country HU --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass RO print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион RO (--geo-bypass-country RO --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country RO --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass SG print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион SG (--geo-bypass-country SG --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country SG --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass TW print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион TW (--geo-bypass-country TW --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country TW --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 23',
    summary:
      'Заголовок без скачивания с лимитом двадцати трёх загрузок за прогон (--max-downloads 23 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 23 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 4',
    summary:
      'Заголовок без скачивания с паузой 4 с между HTTP-запросами (--sleep-requests 4 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 4 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 14',
    summary:
      'Заголовок без скачивания с четырнадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 14 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 14 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 16 print',
    summary:
      'Заголовок без скачивания с шестнадцатью повторами на фрагмент (--fragment-retries 16 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 16 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 420',
    summary:
      'Заголовок без скачивания с таймаутом сокета 420 с (--socket-timeout 420 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 420 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 13',
    summary:
      'Заголовок без скачивания с тринадцатью повторами HTTP (--retries 13 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 13 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 650K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 650K (--limit-rate 650K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 650K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 10',
    summary:
      'Заголовок без скачивания с десятью повторами извлечения (--extractor-retries 10 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 10 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 12',
    summary:
      'Заголовок без скачивания с двенадцатью повторами чтения и записи на диск (--file-access-retries 12 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 12 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass BR print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион BR (--geo-bypass-country BR --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country BR --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass TH print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион TH (--geo-bypass-country TH --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country TH --print title '
  }
]
