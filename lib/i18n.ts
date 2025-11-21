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
    lng: typeof window !== 'undefined' ? (localStorage.getItem('lang') || 'en') : 'en',
    fallbackLng: 'en',
    ns: ['common'],
    defaultNS: 'common',
    interpolation: { escapeValue: false },
  });
}

export default i18n;
