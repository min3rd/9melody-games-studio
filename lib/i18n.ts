import i18n from "i18next";
import en from "@/locales/en/common.json";
import vi from "@/locales/vi/common.json";
import enAdmin from "@/locales/en/admin.json";
import viAdmin from "@/locales/vi/admin.json";
import enPublic from "@/locales/en/public.json";
import viPublic from "@/locales/vi/public.json";
import enErrors from "@/locales/en/errors.json";
import viErrors from "@/locales/vi/errors.json";

// resources loaded from locales
const resources = {
  en: { common: en, admin: enAdmin, errors: enErrors, public: enPublic },
  vi: { common: vi, admin: viAdmin, errors: viErrors, public: viPublic },
};

// init i18next
if (!i18n.isInitialized) {
  i18n.init({
    resources,
    // Use a server-safe default here. Client code should call `setClientLanguage`
    // to harmonize the runtime language with localStorage or user preferences.
    lng: "en",
    fallbackLng: "en",
    ns: ["common", "admin", "errors", "public"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
  });
}

// Helper to call on the client to set the runtime language from client-only sources
export function setClientLanguage(lang?: string) {
  if (typeof window === "undefined") return;
  // prefer localStorage, then cookie, then default
  const fromLocal =
    (localStorage.getItem("lang") as string | null) ?? undefined;
  const cookieMatch =
    typeof document !== "undefined"
      ? document.cookie.match(/(?:^|; )lang=(vi|en)(?:;|$)/)
      : null;
  const fromCookie = cookieMatch ? (cookieMatch[1] as string) : undefined;
  const resolved = lang ?? fromLocal ?? fromCookie ?? "en";
  try {
    i18n.changeLanguage(resolved);
  } catch (error) {
    // ignore errors
  }
}

// Helper to call on the server during a request to set the runtime language for
// the current render. Note: this mutates the singleton i18n instance and may
// affect concurrent renders in a long-running server environment.
export function setServerLanguage(lang?: string) {
  if (typeof window !== "undefined") return;
  const resolved = lang ?? "en";
  try {
    i18n.changeLanguage(resolved);
  } catch (error) {
    // ignore
  }
}

export default i18n;
