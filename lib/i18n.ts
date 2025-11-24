import i18n from 'i18next';
import en from '@/locales/en/common.json';
import vi from '@/locales/vi/common.json';

// resources loaded from locales
const resources = {
  en: { common: en },
  vi: { common: vi },
};

// init i18next
if (!i18n.isInitialized) {
  i18n.init({
    resources,
    // Use a server-safe default here. Client code should call `setClientLanguage`
    // to harmonize the runtime language with localStorage or user preferences.
    lng: 'en',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });
}

// Helper to call on the client to set the runtime language from client-only sources
export function setClientLanguage(lang?: string) {
  if (typeof window === 'undefined') return;
  const resolved = lang ?? (localStorage.getItem('lang') as string | null) ?? 'en';
  try {
    i18n.changeLanguage(resolved);
  } catch (error) {
    // ignore errors
  }
}

export default i18n;
