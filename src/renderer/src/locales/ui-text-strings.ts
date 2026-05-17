/** Merged UI_TEXT tables (ru/en) from split parts + §2.2 JSON shards (`locales/{locale}/*.json`). */
import ruCommon from '@locales/ru/common.json'
import enCommon from '@locales/en/common.json'
import { uiTextStringsRuPart01 } from './ui-text-strings-ru-01'
import { uiTextStringsRuPart02 } from './ui-text-strings-ru-02'
import { uiTextStringsRuPart03 } from './ui-text-strings-ru-03'
import { uiTextStringsRuPart04 } from './ui-text-strings-ru-04'
import { uiTextStringsRuPart05 } from './ui-text-strings-ru-05'
import { uiTextStringsRuPart06 } from './ui-text-strings-ru-06'
import { uiTextStringsRuPart07 } from './ui-text-strings-ru-07'
import { uiTextStringsRuPart08 } from './ui-text-strings-ru-08'
import { uiTextStringsEnPart01 } from './ui-text-strings-en-01'
import { uiTextStringsEnPart02 } from './ui-text-strings-en-02'
import { uiTextStringsEnPart03 } from './ui-text-strings-en-03'
import { uiTextStringsEnPart04 } from './ui-text-strings-en-04'
import { uiTextStringsEnPart05 } from './ui-text-strings-en-05'
import { uiTextStringsEnPart06 } from './ui-text-strings-en-06'
import { uiTextStringsEnPart07 } from './ui-text-strings-en-07'
import { uiTextStringsEnPart08 } from './ui-text-strings-en-08'

const uiTextStringsRu = {
  ...uiTextStringsRuPart01,
  ...uiTextStringsRuPart02,
  ...uiTextStringsRuPart03,
  ...uiTextStringsRuPart04,
  ...uiTextStringsRuPart05,
  ...uiTextStringsRuPart06,
  ...uiTextStringsRuPart07,
  ...uiTextStringsRuPart08,
  ...ruCommon
} as const

const uiTextStringsEn = {
  ...uiTextStringsEnPart01,
  ...uiTextStringsEnPart02,
  ...uiTextStringsEnPart03,
  ...uiTextStringsEnPart04,
  ...uiTextStringsEnPart05,
  ...uiTextStringsEnPart06,
  ...uiTextStringsEnPart07,
  ...uiTextStringsEnPart08,
  ...enCommon
} as const

export const UI_TEXT = {
  ru: uiTextStringsRu,
  en: uiTextStringsEn
} as const

export type UiTextKey = keyof typeof uiTextStringsRu
