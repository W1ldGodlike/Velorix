import type { TerminalCommandHintEntry } from './terminal-contract-types'

/** §8 — подсказки вкладки «Загрузки» (часть 20). */
export const TERMINAL_SCENARIO_HINTS_DOWNLOADS_PART_20: TerminalCommandHintEntry[] = [
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 16',
    summary:
      'Заголовок без скачивания с шестнадцатью повторами чтения и записи на диск (--file-access-retries 16 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 16 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass SI print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион SI (--geo-bypass-country SI --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country SI --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass LT print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион LT (--geo-bypass-country LT --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country LT --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass LV print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион LV (--geo-bypass-country LV --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country LV --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass EE print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион EE (--geo-bypass-country EE --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country EE --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass RS print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион RS (--geo-bypass-country RS --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country RS --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 33',
    summary:
      'Заголовок без скачивания с лимитом тридцати трёх загрузок за прогон (--max-downloads 33 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 33 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 6.5',
    summary:
      'Заголовок без скачивания с паузой 6,5 с между HTTP-запросами (--sleep-requests 6.5 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 6.5 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 19',
    summary:
      'Заголовок без скачивания с девятнадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 19 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 19 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 21',
    summary:
      'Заголовок без скачивания с двадцатью одним повтором на фрагмент (--fragment-retries 21 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 21 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 720',
    summary:
      'Заголовок без скачивания с таймаутом сокета 720 с (--socket-timeout 720 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 720 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 18',
    summary:
      'Заголовок без скачивания с восемнадцатью повторами HTTP (--retries 18 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 18 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 600K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 600K (--limit-rate 600K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 600K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 15',
    summary:
      'Заголовок без скачивания с пятнадцатью повторами извлечения (--extractor-retries 15 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 15 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 17',
    summary:
      'Заголовок без скачивания с семнадцатью повторами чтения и записи на диск (--file-access-retries 17 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 17 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass BG print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион BG (--geo-bypass-country BG --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country BG --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass MD print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион MD (--geo-bypass-country MD --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country MD --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass KZ print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион KZ (--geo-bypass-country KZ --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country KZ --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass UZ print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион UZ (--geo-bypass-country UZ --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country UZ --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass AZ print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион AZ (--geo-bypass-country AZ --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country AZ --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 35',
    summary:
      'Заголовок без скачивания с лимитом тридцати пяти загрузок за прогон (--max-downloads 35 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 35 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 7',
    summary:
      'Заголовок без скачивания с паузой 7 с между HTTP-запросами (--sleep-requests 7 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 7 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 20',
    summary:
      'Заголовок без скачивания с двадцатью параллельными фрагментами DASH/HLS (--concurrent-fragments 20 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 20 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 22',
    summary:
      'Заголовок без скачивания с двадцатью двумя повторами на фрагмент (--fragment-retries 22 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 22 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 780',
    summary:
      'Заголовок без скачивания с таймаутом сокета 780 с (--socket-timeout 780 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 780 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 19',
    summary:
      'Заголовок без скачивания с девятнадцатью повторами HTTP (--retries 19 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 19 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 520K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 520K (--limit-rate 520K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 520K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 16',
    summary:
      'Заголовок без скачивания с шестнадцатью повторами извлечения (--extractor-retries 16 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 16 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 18',
    summary:
      'Заголовок без скачивания с восемнадцатью повторами чтения и записи на диск (--file-access-retries 18 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 18 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass GE print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион GE (--geo-bypass-country GE --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country GE --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass AM print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион AM (--geo-bypass-country AM --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country AM --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass KG print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион KG (--geo-bypass-country KG --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country KG --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass TJ print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион TJ (--geo-bypass-country TJ --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country TJ --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass TM print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион TM (--geo-bypass-country TM --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country TM --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок max-downloads 51',
    summary:
      'Заголовок без скачивания с лимитом пятидесяти одной загрузки за прогон (--max-downloads 51 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --max-downloads 51 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок sleep-requests 11',
    summary:
      'Заголовок без скачивания с паузой 11 с между HTTP-запросами (--sleep-requests 11 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --sleep-requests 11 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок concurrent-fragments 28',
    summary:
      'Заголовок без скачивания с двадцатью восемью параллельными фрагментами DASH/HLS (--concurrent-fragments 28 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --concurrent-fragments 28 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок fragment-retries 30',
    summary:
      'Заголовок без скачивания с тридцатью повторами на фрагмент (--fragment-retries 30 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --fragment-retries 30 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок socket-timeout 1260',
    summary:
      'Заголовок без скачивания с таймаутом сокета 1260 с (--socket-timeout 1260 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --socket-timeout 1260 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок retries 27',
    summary:
      'Заголовок без скачивания с двадцатью семью повторами HTTP (--retries 27 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --retries 27 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок limit-rate 710K print',
    summary:
      'Заголовок без скачивания с ограничением скорости 710K (--limit-rate 710K --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --limit-rate 710K --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок extractor-retries 24',
    summary:
      'Заголовок без скачивания с двадцатью четырьмя повторами извлечения (--extractor-retries 24 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --extractor-retries 24 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок file-access-retries 26',
    summary:
      'Заголовок без скачивания с двадцатью шестью повторами чтения и записи на диск (--file-access-retries 26 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --file-access-retries 26 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass NG print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион NG (--geo-bypass-country NG --socket-timeout 361 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country NG --socket-timeout 361 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass ZA print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион ZA (--geo-bypass-country ZA --socket-timeout 362 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country ZA --socket-timeout 362 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass MZ print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион MZ (--geo-bypass-country MZ --socket-timeout 363 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country MZ --socket-timeout 363 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass ZW print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион ZW (--geo-bypass-country ZW --socket-timeout 364 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country ZW --socket-timeout 364 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· заголовок geo-bypass BW print',
    summary:
      'Заголовок без скачивания с гео-обходом через регион BW (--geo-bypass-country BW --socket-timeout 365 --skip-download --print title); допишите ссылку.',
    fullLine: 'yt-dlp --skip-download --geo-bypass-country BW --socket-timeout 365 --print title '
  },
  {
    tool: 'yt-dlp',
    token: '· обновить yt-dlp → stable',
    summary: 'Обновить yt-dlp до стабильной ветки (--update-to stable); ссылка в команде не нужна.',
    fullLine: 'yt-dlp --update-to stable'
  }
]
