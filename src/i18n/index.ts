import { ref } from 'vue'
import type { Locale, Messages } from './types'
import en from './en'
import de from './de'

const messages: Record<Locale, Messages> = { en, de }
const SUPPORTED_LOCALES: Locale[] = ['en', 'de']
const STORAGE_KEY = 'pexler-locale'

function detectLocale(): Locale {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored && SUPPORTED_LOCALES.includes(stored as Locale)) {
    return stored as Locale
  }
  const langs: readonly string[] = navigator.languages?.length ? navigator.languages : [navigator.language ?? 'en']
  for (const lang of langs) {
    if (!lang) continue
    const code = lang.split('-')[0]
    if (code && SUPPORTED_LOCALES.includes(code.toLowerCase() as Locale)) {
      return code.toLowerCase() as Locale
    }
  }
  return 'en'
}

const currentLocale = ref<Locale>(detectLocale())

export function useI18n() {
  function t(key: keyof Messages): string {
    return messages[currentLocale.value][key] ?? key
  }

  function setLocale(loc: Locale) {
    currentLocale.value = loc
    localStorage.setItem(STORAGE_KEY, loc)
  }

  return { locale: currentLocale, t, setLocale, supportedLocales: SUPPORTED_LOCALES }
}

export type { Locale, Messages }
