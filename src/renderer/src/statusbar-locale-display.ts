import type { AppUiLocale } from '../../shared/app-ui-locale'
import { uiText } from './locales/ui-text'

export function formatStatusbarLocaleShort(locale: AppUiLocale): string {
  return locale === 'en' ? uiText('statusbarLocaleBadgeEn') : uiText('statusbarLocaleBadgeRu')
}
