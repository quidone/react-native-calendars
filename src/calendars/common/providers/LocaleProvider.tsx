import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from 'react';
import dayjs, {ConfigType} from 'dayjs';

type DayjsLocale = string | ILocale;
export type Locale = DayjsLocale;

type LocaleContextValue = {
  localedDayjs: (config?: ConfigType) => dayjs.Dayjs;
  weekDays: string[];
  months: string[];
  weekStart: number;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

type LocaleProviderProps = PropsWithChildren<{
  locale: Locale | undefined;
}>;

const LocaleProvider = ({locale, children}: LocaleProviderProps) => {
  const localedDayjs = useMemo<(config?: ConfigType) => dayjs.Dayjs>(() => {
    return locale !== undefined
      ? (config?: ConfigType) => dayjs(config).locale(locale)
      : dayjs;
  }, [locale]);
  const result = useMemo<LocaleContextValue>(() => {
    const localeData = localedDayjs().localeData();
    return {
      localedDayjs,
      months: localeData.months(),
      weekDays: localeData.weekdaysMin(),
      weekStart: localeData.firstDayOfWeek(),
    };
  }, [localedDayjs]);

  return <LocaleContext.Provider value={result} children={children} />;
};

export default LocaleProvider;

export const useLocale = () => {
  const value = useContext(LocaleContext);
  if (value == null) {
    throw new Error('useLocale must be called from within LocaleProvider!');
  }
  return value;
};

export const useLocaledDayjs = () => {
  return useLocale().localedDayjs;
};

export type LDayjs = ReturnType<typeof useLocaledDayjs>;
