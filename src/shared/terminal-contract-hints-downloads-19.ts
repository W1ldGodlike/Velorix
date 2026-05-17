import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки вкладки «Загрузки» (часть 19). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_19: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass VN print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион VN (--geo-bypass-country VN --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country VN --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass ID print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион ID (--geo-bypass-country ID --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country ID --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass ZA print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион ZA (--geo-bypass-country ZA --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country ZA --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 25',
    summary:
      'Заголовок без скачивания с лимитом двадцати пяти загрузок за прогон (--max-downloads 25 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 25 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 4.5',
    summary:
      'Заголовок без скачивания с паузой 4,5 с между HTTP-запросами (--sleep-requests 4.5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 4.5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 15',
    summary:
      'Заголовок без скачивания с пятнадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 15 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 15 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 17 print',
    summary:
      'Заголовок без скачивания с семнадцатью повторами на фрагмент (--fragment-retries 17 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 17 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 480',
    summary:
      'Заголовок без скачивания с таймаутом сокета 480 с (--socket-timeout 480 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 480 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 14',
    summary:
      'Заголовок без скачивания с четырнадцатью повторами HTTP (--retries 14 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 14 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 550K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 550K (--limit-rate 550K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 550K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 11',
    summary:
      'Заголовок без скачивания с одиннадцатью повторами извлечения (--extractor-retries 11 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 11 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 13',
    summary:
      'Заголовок без скачивания с тринадцатью повторами чтения и записи на диск (--file-access-retries 13 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 13 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass CL print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион CL (--geo-bypass-country CL --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country CL --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass LY print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион LY (--geo-bypass-country LY --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country LY --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass UA print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион UA (--geo-bypass-country UA --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country UA --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass IL print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион IL (--geo-bypass-country IL --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country IL --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass PK print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион PK (--geo-bypass-country PK --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country PK --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 27',
    summary:
      'Заголовок без скачивания с лимитом двадцати семи загрузок за прогон (--max-downloads 27 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 27 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 5',
    summary:
      'Заголовок без скачивания с паузой 5 с между HTTP-запросами (--sleep-requests 5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 16',
    summary:
      'Заголовок без скачивания с шестнадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 16 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 16 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 18',
    summary:
      'Заголовок без скачивания с восемнадцатью повторами на фрагмент (--fragment-retries 18 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 18 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 540',
    summary:
      'Заголовок без скачивания с таймаутом сокета 540 с (--socket-timeout 540 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 540 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 15',
    summary:
      'Заголовок без скачивания с пятнадцатью повторами HTTP (--retries 15 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 15 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 800K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 800K (--limit-rate 800K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 800K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 12',
    summary:
      'Заголовок без скачивания с двенадцатью повторами извлечения (--extractor-retries 12 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 12 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 14',
    summary:
      'Заголовок без скачивания с четырнадцатью повторами чтения и записи на диск (--file-access-retries 14 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 14 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass BD print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион BD (--geo-bypass-country BD --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country BD --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass NG print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион NG (--geo-bypass-country NG --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country NG --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass CO print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион CO (--geo-bypass-country CO --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country CO --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass PE print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион PE (--geo-bypass-country PE --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country PE --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass SA print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион SA (--geo-bypass-country SA --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country SA --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 29',
    summary:
      'Заголовок без скачивания с лимитом двадцати девяти загрузок за прогон (--max-downloads 29 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 29 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 5.5',
    summary:
      'Заголовок без скачивания с паузой 5,5 с между HTTP-запросами (--sleep-requests 5.5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 5.5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 17',
    summary:
      'Заголовок без скачивания с семнадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 17 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 17 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 19',
    summary:
      'Заголовок без скачивания с девятнадцатью повторами на фрагмент (--fragment-retries 19 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 19 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 600',
    summary:
      'Заголовок без скачивания с таймаутом сокета 600 с (--socket-timeout 600 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 600 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 16',
    summary:
      'Заголовок без скачивания с шестнадцатью повторами HTTP (--retries 16 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 16 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 700K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 700K (--limit-rate 700K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 700K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 13',
    summary:
      'Заголовок без скачивания с тринадцатью повторами извлечения (--extractor-retries 13 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 13 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 15',
    summary:
      'Заголовок без скачивания с пятнадцатью повторами чтения и записи на диск (--file-access-retries 15 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 15 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass SD print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион SD (--geo-bypass-country SD --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country SD --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass KE print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион KE (--geo-bypass-country KE --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country KE --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass PH print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион PH (--geo-bypass-country PH --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country PH --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass HR print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион HR (--geo-bypass-country HR --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country HR --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass SK print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион SK (--geo-bypass-country SK --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country SK --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 31',
    summary:
      'Заголовок без скачивания с лимитом тридцати одной загрузки за прогон (--max-downloads 31 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 31 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 6',
    summary:
      'Заголовок без скачивания с паузой 6 с между HTTP-запросами (--sleep-requests 6 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 6 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 18',
    summary:
      'Заголовок без скачивания с восемнадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 18 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 18 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 20',
    summary:
      'Заголовок без скачивания с двадцатью повторами на фрагмент (--fragment-retries 20 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 20 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 660',
    summary:
      'Заголовок без скачивания с таймаутом сокета 660 с (--socket-timeout 660 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 660 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 17',
    summary:
      'Заголовок без скачивания с семнадцатью повторами HTTP (--retries 17 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 17 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 950K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 950K (--limit-rate 950K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 950K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 14',
    summary:
      'Заголовок без скачивания с четырнадцатью повторами извлечения (--extractor-retries 14 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 14 --print title '
  }
]
