import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultLocale,
  isLocale,
  localeStorageKey,
  type Locale,
} from "./locales";
import {
  formatLocaleDate,
  translate,
  type MessageKey,
  type MessageParams,
} from "./messages";

type LocaleContextValue = {
  locale: Locale;
  hasLocale: boolean;
  setLocale(locale: Locale): void;
  t(key: MessageKey, params?: MessageParams): string;
  formatDate(value: Date | string | number): string;
};

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined);

function readStoredLocale(): { locale: Locale; hasLocale: boolean } {
  if (typeof window === "undefined") {
    return { locale: defaultLocale, hasLocale: false };
  }
  const stored = window.localStorage.getItem(localeStorageKey);
  if (isLocale(stored)) return { locale: stored, hasLocale: true };
  return { locale: defaultLocale, hasLocale: false };
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(readStoredLocale);

  useEffect(() => {
    document.documentElement.lang = state.locale;
  }, [state.locale]);

  const setLocale = useCallback((locale: Locale) => {
    window.localStorage.setItem(localeStorageKey, locale);
    setState({ locale, hasLocale: true });
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale: state.locale,
      hasLocale: state.hasLocale,
      setLocale,
      t: (key, params) => translate(state.locale, key, params),
      formatDate: (value) => formatLocaleDate(state.locale, value),
    }),
    [setLocale, state.hasLocale, state.locale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}
