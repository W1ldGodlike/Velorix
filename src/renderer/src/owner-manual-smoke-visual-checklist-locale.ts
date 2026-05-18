import type { AppUiLocale } from '../../shared/app-ui-locale'
import {
  formatOwnerManualSmokeHidpiChecklistLines,
  formatOwnerManualSmokeHidpiChecklistLinesFromShard
} from '../../shared/owner-manual-smoke-hidpi-lines'
import {
  formatOwnerManualSmokeThemeChecklistLines,
  formatOwnerManualSmokeThemeChecklistLinesFromShard
} from '../../shared/owner-manual-smoke-theme-lines'
import enSettings from '@locales/en/settings.json'

export function getOwnerManualSmokeThemeChecklistLinesForUiLocale(locale: AppUiLocale): string[] {
  if (locale === 'ru') {
    return formatOwnerManualSmokeThemeChecklistLines()
  }
  return formatOwnerManualSmokeThemeChecklistLinesFromShard(enSettings as Record<string, string>)
}

export function getOwnerManualSmokeHidpiChecklistLinesForUiLocale(locale: AppUiLocale): string[] {
  if (locale === 'ru') {
    return formatOwnerManualSmokeHidpiChecklistLines()
  }
  return formatOwnerManualSmokeHidpiChecklistLinesFromShard(enSettings as Record<string, string>)
}
